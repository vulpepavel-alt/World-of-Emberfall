// ==========================================================
//  LOOT AND BAGS
//
//  What a monster leaves behind, and where you put it.
//
//  Nothing about WHAT drops is decided here. pradaCompleta() in
//  obiecte.js already knows: how much money, how likely an item is,
//  what a wolf leaves versus a bandit, what a rare one always
//  leaves. This file only picks that up, shows it, and puts it in
//  your bag.
//
//  The item pictures are the 2D game's own. formeleIconitei() gives
//  back a list of coloured rectangles on a 16x16 grid - the very
//  same list the 2D game paints its icons from - and here they
//  become rectangles in an SVG. Same sword, same colours, drawn
//  twice by two different pieces of code from one description.
// ==========================================================


// ----------------------------------------------------------
//  An item's picture
// ----------------------------------------------------------
function icoanaObiectului(obiect) {
  let forme;
  try {
    forme = formeleIconitei(obiect) || [];
  } catch (e) {
    forme = [];
  }

  const rect = forme.map(function (f) {
    return '<rect x="' + f.x + '" y="' + f.y + '" width="' + f.w +
           '" height="' + f.h + '" fill="' + f.c + '"/>';
  }).join('');

  return '<svg viewBox="0 0 16 16" width="100%" height="100%">' +
           '<rect width="16" height="16" fill="#1b1610"/>' + rect +
         '</svg>';
}


// The colour of an item's name says how good it is. The 2D game
// already decides that; we only ask.
function culoareaObiectului(obiect) {
  const t = (typeof treaptaObiectului === 'function') ? treaptaObiectului(obiect) : null;
  return {
    gri: '#9d9d9d', alb: '#ffffff', verde: '#1eff00',
    albastru: '#0070dd', mov: '#a335ee'
  }[t] || '#ffffff';
}


// ----------------------------------------------------------
//  The sack a dead monster leaves
//
//  A small box on the ground where it fell. Walk up and press F, or
//  click it.
// ----------------------------------------------------------
const sacuri = [];
const RAZA_LUARII = 3.2;

function lasaPrada(m, acum) {

  const fel = MOBI[m.fel] || {};
  let prada;
  try {
    prada = pradaCompleta(m.nivel, fel.neam === 'umanoid', m.fel,
                          m.rang || 'normal', zona ? zona.nume : null, null);
  } catch (e) {
    return;
  }
  if (!pradaAreCeva(prada)) return;

  const p = pozitiaFapturii(m);
  const cutie = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.36, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x6b4a2c })
  );
  cutie.position.set(p.x, inaltimeaSolului(Math.round(p.x), Math.round(p.z)) + 0.18, p.z);
  lumea.add(cutie);

  // A ring of light under it, so it can be seen in long grass.
  const lucire = new THREE.Mesh(
    new THREE.RingGeometry(0.34, 0.6, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd34d, transparent: true, opacity: 0.35,
                                  side: THREE.DoubleSide })
  );
  lucire.rotation.x = -Math.PI / 2;
  lucire.position.set(p.x, cutie.position.y - 0.16, p.z);
  lumea.add(lucire);

  sacuri.push({ prada: prada, cutie: cutie, lucire: lucire,
                x: p.x, z: p.z, pana: acum + REVINE_DUPA });
}


function stergeSacul(s) {
  lumea.remove(s.cutie);
  lumea.remove(s.lucire);
  const i = sacuri.indexOf(s);
  if (i >= 0) sacuri.splice(i, 1);
}


function saculDeLangaTine() {
  const x = jucator.position.x, z = jucator.position.z;
  return sacuri.find(function (s) {
    return Math.hypot(s.x - x, s.z - z) <= RAZA_LUARII;
  }) || null;
}


function actualizeazaSacurile(acum) {
  for (let i = sacuri.length - 1; i >= 0; i--) {
    const s = sacuri[i];
    if (acum >= s.pana) { if (s === saculDeschis3d) inchideFerestrele(); stergeSacul(s); continue; }
    s.cutie.rotation.y += 0.01;
  }
}


// ----------------------------------------------------------
//  The two windows
//
//  Only ever one open at a time. Escape closes it.
// ----------------------------------------------------------
let saculDeschis3d = null;
let rucsaculDeschis = false;
let cutiaFerestrei = null;

function faFereastra() {
  const el = document.createElement('div');
  el.id = 'fereastra3d';
  el.className = 'ascuns';
  el.innerHTML = '<div class="cap"><span id="titlu3d"></span>' +
                 '<button id="inchide3d">Close</button></div>' +
                 '<div class="corp" id="corp3d"></div>';
  document.body.appendChild(el);
  cutiaFerestrei = el;
  document.getElementById('inchide3d').addEventListener('click', inchideFerestrele);
}

function inchideFerestrele() {
  saculDeschis3d = null;
  rucsaculDeschis = false;
  if (typeof arboriDeschisi !== 'undefined') arboriDeschisi = false;
  if (typeof meseriiDeschise !== 'undefined') meseriiDeschise = false;
  if (cutiaFerestrei) cutiaFerestrei.classList.remove('lat');
  if (typeof uitaNpci === 'function') uitaNpci();
  if (cutiaFerestrei) cutiaFerestrei.classList.add('ascuns');
}

function deschideSacul(s) {
  if (!cutiaFerestrei) faFereastra();
  saculDeschis3d = s;
  rucsaculDeschis = false;
  cutiaFerestrei.classList.remove('ascuns');
  scrieFereastra();
}

function deschideRucsacul() {
  if (!cutiaFerestrei) faFereastra();
  rucsaculDeschis = !rucsaculDeschis;
  saculDeschis3d = null;
  cutiaFerestrei.classList.toggle('ascuns', !rucsaculDeschis);
  if (rucsaculDeschis) scrieFereastra();
}


function scrieFereastra() {
  if (!cutiaFerestrei) return;

  if (saculDeschis3d) scrieSacul();
  else if (rucsaculDeschis) scrieRucsacul();
}


function scrieSacul() {
  const prada = saculDeschis3d.prada;
  document.getElementById('titlu3d').textContent = TEXT.LOOT_TITLE || 'Loot';

  let html = '';
  if (prada.bani > 0) {
    html += '<div class="rand bani" data-bani="1">' +
              '<div class="ic"><svg viewBox="0 0 16 16" width="100%" height="100%">' +
                '<rect width="16" height="16" fill="#1b1610"/>' +
                '<circle cx="8" cy="8" r="5" fill="#e6c669"/>' +
                '<circle cx="6.4" cy="6.4" r="1.6" fill="#fff3c4" opacity="0.7"/>' +
              '</svg></div>' +
              '<div class="text">' + baniHtml(prada.bani) + '</div>' +
            '</div>';
  }

  (prada.obiecte || []).forEach(function (o, i) {
    html += '<div class="rand" data-obiect="' + i + '">' +
              '<div class="ic">' + icoanaObiectului(o) + '</div>' +
              '<div class="text" style="color:' + culoareaObiectului(o) + '">' +
                o.nume + '</div>' +
            '</div>';
  });

  if (!html) html = '<p class="gol">Empty.</p>';
  else html += '<button id="ia-tot">Take all</button>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-bani]').forEach(function (el) {
    el.addEventListener('click', function () { iaBanii(); });
  });
  corp.querySelectorAll('[data-obiect]').forEach(function (el) {
    el.addEventListener('click', function () { iaObiectul(Number(el.dataset.obiect)); });
  });
  const tot = document.getElementById('ia-tot');
  if (tot) tot.addEventListener('click', iaTot);
}


function iaBanii() {
  if (!saculDeschis3d) return;
  const prada = saculDeschis3d.prada;
  if (!prada.bani) return;
  personaj.bani = (personaj.bani || 0) + prada.bani;
  spuneCeva('+' + baniText(prada.bani));
  prada.bani = 0;
  gataCuSacul();
}

function iaObiectul(i) {
  if (!saculDeschis3d) return;
  const prada = saculDeschis3d.prada;
  const o = prada.obiecte[i];
  if (!o) return;

  personaj.inventar = personaj.inventar || [];
  if (personaj.inventar.length >= LOCURI_IN_RUCSAC) {
    spuneCeva(TEXT.BAG_FULL || 'Your bag is full');
    return;
  }

  personaj.inventar.push(o);
  prada.obiecte.splice(i, 1);
  spuneCeva(o.nume);
  gataCuSacul();
}

function iaTot() {
  if (!saculDeschis3d) return;
  iaBanii();
  if (!saculDeschis3d) return;
  const prada = saculDeschis3d.prada;
  while (prada.obiecte.length && personaj.inventar.length < LOCURI_IN_RUCSAC) {
    iaObiectul(0);
    if (!saculDeschis3d) return;
  }
}

// An empty sack is not worth keeping open.
function gataCuSacul() {
  const prada = saculDeschis3d.prada;
  if (!prada.bani && !(prada.obiecte || []).length) {
    stergeSacul(saculDeschis3d);
    inchideFerestrele();
  } else {
    scrieFereastra();
  }
}


// ----------------------------------------------------------
//  The bag
// ----------------------------------------------------------
function scrieRucsacul() {
  document.getElementById('titlu3d').textContent =
    (TEXT.BAG_TITLE || 'Bag') + '  ·  ' +
    (personaj.inventar || []).length + ' / ' + LOCURI_IN_RUCSAC +
    '  ·  ' + baniText(personaj.bani || 0);

  let html = '<div class="grila">';
  for (let i = 0; i < LOCURI_IN_RUCSAC; i++) {
    const o = (personaj.inventar || [])[i];
    html += '<div class="cutiuta' + (o ? '' : ' gol') + '"' +
            (o ? ' data-slot="' + i + '" title="' + (o.nume || '') + '"' : '') + '>' +
            (o ? icoanaObiectului(o) : '') + '</div>';
  }
  html += '</div>';

  // What you are wearing, so you can see what you would be swapping.
  html += '<div class="purtate"><b>Worn</b>';
  const sloturi = Object.keys(personaj.echipament || {});
  if (!sloturi.length) html += '<p class="gol">Nothing.</p>';
  sloturi.forEach(function (s) {
    const o = personaj.echipament[s];
    if (!o) return;
    html += '<div class="rand"><div class="ic">' + icoanaObiectului(o) + '</div>' +
            '<div class="text" style="color:' + culoareaObiectului(o) + '">' +
            o.nume + '</div></div>';
  });
  html += '</div>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-slot]').forEach(function (el) {
    el.addEventListener('click', function () {
      imbracaDinRucsac(Number(el.dataset.slot));
    });
  });
}


function imbracaDinRucsac(i) {
  const o = (personaj.inventar || [])[i];
  if (!o) return;

  if (!poateFiEchipat(personaj, o)) {
    spuneCeva(o.nivelCerut ? 'Needs level ' + o.nivelCerut : 'You cannot wear that');
    return;
  }

  if (echipeaza(personaj, o.id)) {
    recalculeazaPersonajul3d();
    spuneCeva(o.nume);
    scrieFereastra();
  }
}


// ----------------------------------------------------------
//  Working the numbers out again after a change of clothes
//
//  Everything here is the game's own calculator - calculeazaViata,
//  calculeazaAttackPower and the rest out of personaj.js, plus
//  bonusEchipament out of obiecte.js. What is NOT done is what the
//  2D game's aplicaTalentele() also does with the Phaser scene; that
//  part does not belong to the rules.
//
//  The strengthenings are added on at the end, out of the list they
//  already live on. That matters: before this, a strengthening added
//  its bonus straight onto the character, so putting on a helmet -
//  which works everything out again from scratch - quietly wiped it,
//  and taking the helmet off afterwards handed it back for nothing.
// ----------------------------------------------------------
function dinIntariri3d(camp) {
  let total = 0;
  (typeof lucruriCareTin !== 'undefined' ? lucruriCareTin : []).forEach(function (l) {
    if (l.fel === 'intarire' && l.da && l.da[camp]) total += l.da[camp];
  });
  return total;
}

function recalculeazaPersonajul3d() {
  if (!personaj) return;

  const baza = calculeazaPersonaj(personaj.idRasa, personaj.idClasa,
                                  personaj.infatisare, personaj.nivel);
  const dinEchipament = bonusEchipament(personaj);
  const clasa = CLASE[personaj.idClasa];

  // Keep the share of health and mana you had, not the number - so
  // a helmet that raises your health does not also heal you.
  const parteViata = personaj.viataMaxima ? personaj.viata / personaj.viataMaxima : 1;
  const parteMana  = personaj.manaMaxima  ? (personaj.mana || 0) / personaj.manaMaxima : 1;

  personaj.atribute = {
    str: baza.atribute.str + dinEchipament.str + dinIntariri3d('str'),
    agi: baza.atribute.agi + dinEchipament.agi + dinIntariri3d('agi'),
    sta: baza.atribute.sta + dinEchipament.sta + dinIntariri3d('sta'),
    int: baza.atribute.int + dinEchipament.int + dinIntariri3d('int'),
    spi: baza.atribute.spi + dinEchipament.spi + dinIntariri3d('spi')
  };

  const atr = personaj.atribute;
  personaj.viataMaxima = Math.round(calculeazaViata(atr.sta) * inmultitorTalent(personaj, 'viata'));
  personaj.manaMaxima  = calculeazaMana(atr.int, personaj.resursa);
  personaj.attackPower = calculeazaAttackPower(atr, clasa) + dinIntariri3d('attackPower');
  personaj.attackPowerDistanta = calculeazaAttackPowerDistanta(atr, clasa) +
                                 dinIntariri3d('attackPower');
  personaj.putereVrajii = calculeazaPutereaVrajii(atr, clasa);
  personaj.armura = Math.round((calculeazaArmura(atr.agi) + dinEchipament.armura +
                                dinIntariri3d('armura')) * inmultitorTalent(personaj, 'armura'));
  personaj.critical = calculeazaCritical(atr.agi) + bonusTalent(personaj, 'critic');

  personaj.viata = Math.max(1, Math.round(personaj.viataMaxima * parteViata));
  if (personaj.resursa === RESURSA_MANA) {
    personaj.mana = Math.round(personaj.manaMaxima * parteMana);
  }
}


// ----------------------------------------------------------
//  Once a frame, and the keys
// ----------------------------------------------------------
function actualizeazaPrada(acum) {
  if (!personaj || !zona) return;
  actualizeazaSacurile(acum);
  if (typeof actualizeazaNpci === 'function') actualizeazaNpci();

  // A sack you have walked away from closes itself.
  if (saculDeschis3d &&
      Math.hypot(saculDeschis3d.x - jucator.position.x,
                 saculDeschis3d.z - jucator.position.z) > RAZA_LUARII + 1) {
    inchideFerestrele();
  }
}

function uitaPrada() {
  inchideFerestrele();
  for (let i = sacuri.length - 1; i >= 0; i--) stergeSacul(sacuri[i]);
  sacuri.length = 0;
}

window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;

  if (e.code === 'KeyB' || e.code === 'KeyI') { deschideRucsacul(); return; }

  // F is the one key for "deal with what is in front of me". A sack
  // first - if you have just killed something you almost certainly
  // want its pockets, not a chat with the farmer standing behind it.
  if (e.code === 'KeyF') {
    const s = saculDeLangaTine();
    if (s) { deschideSacul(s); return; }
    const nod = (typeof nodulDeLangaTine === 'function') ? nodulDeLangaTine() : null;
    if (nod) { incepeCulesul3d(nod); return; }
    const n = (typeof npcDeLangaTine === 'function') ? npcDeLangaTine() : null;
    if (n) { vorbesteCu(n); return; }
    spuneCeva('Nothing here to take or talk to');
    return;
  }

  if (e.code === 'Escape') inchideFerestrele();
});
