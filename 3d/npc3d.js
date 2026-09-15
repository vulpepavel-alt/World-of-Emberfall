// ==========================================================
//  TALKING TO PEOPLE
//
//  Quests and merchants. Walk up to somebody and press F, or click
//  them.
//
//  Once again, almost nothing is decided here. misiuni.js already
//  knows every quest, who gives it, what it asks for, what it pays
//  and whether you can take it yet; it even works out the '!' and
//  '?' that float over a person's head. faMarfa() knows what a
//  merchant keeps on the shelf. bani.js knows what things cost to
//  buy and what they fetch when sold.
//
//  This file walks up to those and shows the answers.
// ==========================================================


const RAZA_VORBIRII = 3.6;

// Which NPC you are standing next to.
function npcDeLangaTine() {
  if (!zona) return null;
  const x = jucator.position.x, z = jucator.position.z;
  let celMaiAproape = null, ceaMaiMica = RAZA_VORBIRII;
  (zona.npci || []).forEach(function (n) {
    const d = Math.hypot(n.col - x, n.rand - z);
    if (d <= ceaMaiMica) { ceaMaiMica = d; celMaiAproape = n; }
  });
  return celMaiAproape;
}


// ----------------------------------------------------------
//  The mark over their head
//
//  '!' there is something to take, '?' something to hand in, '...'
//  you are already on it. semnulLui() in misiuni.js decides; we only
//  draw it.
// ----------------------------------------------------------
const semneNpc = new Map();

function semnulPentru(n) {
  if (!personaj || !zona) return '';
  try {
    return semnulLui(personaj, zona.nume, n.fel) || '';
  } catch (e) {
    return '';
  }
}

function actualizeazaSemnele() {
  if (!zona) return;

  (zona.npci || []).forEach(function (n) {
    const grup = fapturiDeFata.get(n);
    if (!grup) return;

    const semn = semnulPentru(n);
    const acum = semneNpc.get(n);

    if (acum && acum.text === semn) return;

    if (acum) { grup.remove(acum.sprite); semneNpc.delete(n); }
    if (!semn) return;

    const culoare = semn === '?' ? '#ffd34d' : semn === '!' ? '#ffd34d' : '#a08a63';
    const s = faEticheta(semn, culoare, grup.inaltimeaLui + 1.05);
    grup.add(s);
    semneNpc.set(n, { text: semn, sprite: s });
  });

  // Keep them a steady size on screen, like the names.
  semneNpc.forEach(function (v) {
    const f = marimePeEcran(v.sprite) * 1.5;
    v.sprite.scale.set(v.sprite.latBaza * f, v.sprite.inaltBaza * f, 1);
  });
}


// ----------------------------------------------------------
//  The window
//
//  The same frame the sack and the bag use, so there is only one
//  thing on screen at a time and one Close button to learn.
// ----------------------------------------------------------
let npcDeschis = null;
let misiuneaDeschisa = null;
let negustorul3d = null;
let rasplataAleasa3d = null;
let mesaj3d = '';

function vorbesteCu(n) {
  if (!cutiaFerestrei) faFereastra();
  inchideFerestrele();
  npcDeschis = n;
  misiuneaDeschisa = null;
  negustorul3d = null;
  rasplataAleasa3d = null;
  mesaj3d = '';

  const d = NPC[n.fel] || {};

  // A merchant with nothing to say opens their stall straight away.
  const areMisiuni = misiunileLuiAici(n).length > 0;
  if (d.vinde && !areMisiuni) { deschideTaraba3d(n); return; }

  cutiaFerestrei.classList.remove('ascuns');
  scrieNpc();
}

function misiunileLuiAici(n) {
  if (!personaj || !zona) return [];
  try {
    return misiunileLui(personaj, zona.nume, n.fel).filter(function (m) {
      const s = starea(personaj, m.id);
      return s === 'gata' || s === 'activa' || poateFiLuata(personaj, m);
    });
  } catch (e) {
    return [];
  }
}


function scrieNpc() {
  if (!npcDeschis) return;
  const n = npcDeschis;
  const d = NPC[n.fel] || {};

  document.getElementById('titlu3d').textContent =
    (d.nume || n.fel) + (d.titlu ? '  ·  ' + d.titlu : '');

  if (misiuneaDeschisa) { scrieMisiunea(); return; }

  let html = '';
  if (mesaj3d) html += '<p class="mesaj">' + mesaj3d + '</p>';

  const ale = misiunileLuiAici(n);
  if (ale.length) {
    html += '<div class="lista">';
    ale.forEach(function (m) {
      const s = starea(personaj, m.id);
      const semn = s === 'gata' ? '?' : s === 'activa' ? '···' : '!';
      const cum = s === 'gata' ? 'gata' : s === 'activa' ? 'activa' : 'noua';
      html += '<div class="rand misiune ' + cum + '" data-misiune="' + m.id + '">' +
                '<span class="semn">' + semn + '</span>' +
                '<span class="text">' + m.titlu + '</span>' +
              '</div>';
    });
    html += '</div>';
  }

  if (d.vinde) {
    html += '<button class="lat" id="deschide-taraba">' +
            (TEXT.SHOP_TITLE || 'Browse goods') + '</button>';
  }

  if (!html) html = '<p class="gol">' + (d.nume || 'They') + ' has nothing for you.</p>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-misiune]').forEach(function (el) {
    el.addEventListener('click', function () {
      misiuneaDeschisa = gasesteMisiunea(el.dataset.misiune);
      rasplataAleasa3d = null;
      scrieNpc();
    });
  });
  const b = document.getElementById('deschide-taraba');
  if (b) b.addEventListener('click', function () { deschideTaraba3d(npcDeschis); });
}


// ----------------------------------------------------------
//  One quest
// ----------------------------------------------------------
function scrieMisiunea() {
  const m = misiuneaDeschisa;
  const s = starea(personaj, m.id);

  let html = '<h3>' + m.titlu + '</h3>';
  html += '<p class="povestea">' + (m.text || '') + '</p>';

  if (s !== 'predata') {
    html += '<p class="cerinta"><b>' + (TEXT.QUEST_OBJECTIVE || 'To do') + '</b><br>' +
            textulCerintei(personaj, m) + '</p>';
  }

  // What it pays.
  const alegeri = obiecteleDeRasplata(m);
  html += '<div class="rasplata"><b>' + (TEXT.QUEST_REWARD || 'Reward') + '</b>';
  if (m.rasplata.bani) html += '<div class="bani">' + baniHtml(m.rasplata.bani) + '</div>';
  if (m.rasplata.xp) html += '<div class="xp">' + m.rasplata.xp + ' XP</div>';
  if (alegeri.length) {
    html += '<p class="mic">' + (TEXT.QUEST_PICK_ONE || 'Choose one:') + '</p><div class="alegeri">';
    alegeri.forEach(function (o) {
      html += '<div class="rand alegere' + (rasplataAleasa3d === o.id ? ' aleasa' : '') +
              '" data-rasplata="' + o.id + '">' +
                '<div class="ic">' + icoanaObiectului(o) + '</div>' +
                '<div class="text" style="color:' + culoareaObiectului(o) + '">' + o.nume + '</div>' +
              '</div>';
    });
    html += '</div>';
  }
  html += '</div>';

  if (s === 'gata') {
    html += '<button class="lat" id="preda">' + (TEXT.QUEST_HANDIN || 'Hand it in') + '</button>';
  } else if (s === 'activa') {
    html += '<p class="gol">' + (TEXT.QUEST_NOT_DONE || 'Not finished yet.') + '</p>';
  } else if (poateFiLuata(personaj, m)) {
    html += '<button class="lat" id="ia">' + (TEXT.QUEST_ACCEPT || 'Accept') + '</button>';
  }
  html += '<button class="lat inapoi" id="inapoi3d">Back</button>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-rasplata]').forEach(function (el) {
    el.addEventListener('click', function () {
      rasplataAleasa3d = Number(el.dataset.rasplata);
      scrieNpc();
    });
  });

  const ia = document.getElementById('ia');
  if (ia) ia.addEventListener('click', function () {
    iaMisiunea(personaj, m.id);
    spuneCeva(TEXT.QUEST_TAKEN || 'Quest taken');
    misiuneaDeschisa = null;
    scrieNpc();
  });

  const preda = document.getElementById('preda');
  if (preda) preda.addEventListener('click', function () { predaMisiunea3d(m); });

  document.getElementById('inapoi3d').addEventListener('click', function () {
    misiuneaDeschisa = null;
    scrieNpc();
  });
}


function predaMisiunea3d(m) {
  const alegeri = obiecteleDeRasplata(m);
  if (alegeri.length && rasplataAleasa3d === null) {
    mesaj3d = TEXT.QUEST_PICK_ONE || 'Choose one:';
    scrieNpc();
    return;
  }

  const xpInainte = personaj.xp || 0;
  const r = predaMisiunea(personaj, m.id, rasplataAleasa3d);

  if (!r) { mesaj3d = 'Not finished yet.'; scrieNpc(); return; }
  if (r.rucsacPlin) { mesaj3d = TEXT.BAG_FULL || 'Your bag is full'; scrieNpc(); return; }

  // predaMisiunea() pays the money and the item. The experience is
  // ours to hand over, through the same level-up path a kill uses.
  if (m.rasplata.xp) daXp(m.rasplata.xp);

  spuneCeva(TEXT.QUEST_COMPLETE || 'Quest complete');
  misiuneaDeschisa = null;
  mesaj3d = '';
  recalculeazaPersonajul3d();
  scrieNpc();
}


// ----------------------------------------------------------
//  The stall
// ----------------------------------------------------------
function deschideTaraba3d(n) {
  const d = NPC[n.fel] || {};
  if (!d.vinde) return;

  // The stock is made once per visit to the zone and kept, so the
  // shelf does not shuffle itself while you are looking at it.
  if (!n.marfa) {
    try { n.marfa = faMarfa(d.vinde); } catch (e) { n.marfa = []; }
  }

  npcDeschis = n;
  negustorul3d = n;
  misiuneaDeschisa = null;
  cutiaFerestrei.classList.remove('ascuns');
  scrieTaraba3d();
}


function scrieTaraba3d() {
  const n = negustorul3d;
  const d = NPC[n.fel] || {};

  document.getElementById('titlu3d').textContent =
    (d.nume || n.fel) + '  ·  ' + baniText(personaj.bani || 0);

  let html = '';
  if (mesaj3d) html += '<p class="mesaj">' + mesaj3d + '</p>';

  html += '<b>' + (TEXT.SHOP_BUY || 'For sale') + '</b><div class="lista">';
  (n.marfa || []).forEach(function (o) {
    html += '<div class="rand" data-cumpar="' + o.id + '">' +
              '<div class="ic">' + icoanaObiectului(o) + '</div>' +
              '<div class="text" style="color:' + culoareaObiectului(o) + '">' + o.nume + '</div>' +
              '<div class="pret">' + baniHtml(pretDeCumparat(o)) + '</div>' +
            '</div>';
  });
  if (!(n.marfa || []).length) html += '<p class="gol">Nothing left.</p>';
  html += '</div>';

  html += '<b>' + (TEXT.SHOP_SELL || 'Your bag') + '</b><div class="lista">';
  (personaj.inventar || []).forEach(function (o) {
    html += '<div class="rand" data-vand="' + o.id + '">' +
              '<div class="ic">' + icoanaObiectului(o) + '</div>' +
              '<div class="text" style="color:' + culoareaObiectului(o) + '">' + o.nume + '</div>' +
              '<div class="pret">' + baniHtml(pretDeVandut(o)) + '</div>' +
            '</div>';
  });
  if (!(personaj.inventar || []).length) html += '<p class="gol">Empty.</p>';
  html += '</div>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-cumpar]').forEach(function (el) {
    el.addEventListener('click', function () { cumpara3d(Number(el.dataset.cumpar)); });
  });
  corp.querySelectorAll('[data-vand]').forEach(function (el) {
    el.addEventListener('click', function () { vinde3d(Number(el.dataset.vand)); });
  });
}


function cumpara3d(id) {
  const marfa = negustorul3d.marfa;
  const unde = marfa.findIndex(function (o) { return o.id === id; });
  if (unde < 0) return;
  const o = marfa[unde];

  if (!maiEsteLocInRucsac(personaj)) { mesaj3d = TEXT.BAG_FULL || 'Your bag is full'; scrieTaraba3d(); return; }
  if (!dauBani(personaj, pretDeCumparat(o))) { mesaj3d = TEXT.NOT_ENOUGH || 'Not enough money'; scrieTaraba3d(); return; }

  // A tool is replaced on the shelf at once: somebody who sells
  // their own pick by mistake should be able to buy it back.
  if (!o.unealta) marfa.splice(unde, 1);
  pomeneInRucsac(personaj, o.unealta ? faUnealta(o.nume, o.valoare) : o);

  mesaj3d = (TEXT.BOUGHT || 'Bought') + ': ' + o.nume;
  scrieTaraba3d();
}


function vinde3d(id) {
  const ale = personaj.inventar || [];
  const unde = ale.findIndex(function (o) { return o.id === id; });
  if (unde < 0) return;
  const o = ale[unde];

  if (personaj.echipament && Object.keys(personaj.echipament).some(function (s) {
    return personaj.echipament[s] && personaj.echipament[s].id === id;
  })) return;

  const pret = pretDeVandut(o);
  ale.splice(unde, 1);
  iaBani(personaj, pret);

  // What you sell sits on their shelf, so you can change your mind -
  // at full price. Junk does not: nobody buys back a wolf's tooth.
  if (!o.vechitura) negustorul3d.marfa.push(o);

  mesaj3d = (TEXT.SOLD || 'Sold') + ': ' + o.nume + ' (' + baniText(pret) + ')';
  scrieTaraba3d();
}


// ----------------------------------------------------------
//  Experience, in one place
//
//  Handing in a quest and killing something both give it, and both
//  have to be able to take you up a level - so the levelling lives
//  here and moareMobul() calls it too.
// ----------------------------------------------------------
function daXp(cat) {
  personaj.xp = (personaj.xp || 0) + cat;

  while (personaj.nivel < NIVEL_MAXIM && personaj.xp >= xpPentruNivel(personaj.nivel)) {
    personaj.xp -= xpPentruNivel(personaj.nivel);
    personaj.nivel = personaj.nivel + 1;

    // New level, new abilities - by the game's own rule.
    const secuvine = daTotCeSeCuvine(personaj);
    Object.keys(secuvine).forEach(function (id) {
      if ((personaj.stiute[id] || 0) < secuvine[id]) {
        personaj.stiute[id] = secuvine[id];
        asazaPeBaraDacaIncape(personaj, id);
      }
    });

    recalculeazaPersonajul3d();
    personaj.viata = personaj.viataMaxima;
    if (personaj.resursa === RESURSA_MANA) personaj.mana = personaj.manaMaxima;

    aratacifra(jucator.position.x, jucator.position.y + 2.4, jucator.position.z,
               'Level ' + personaj.nivel, '#ffd34d', true);
  }
}


// ----------------------------------------------------------
//  Once a frame, and the key
// ----------------------------------------------------------
function actualizeazaNpci() {
  actualizeazaSemnele();

  // Walk away and the conversation ends.
  if (npcDeschis &&
      Math.hypot(npcDeschis.col - jucator.position.x,
                 npcDeschis.rand - jucator.position.z) > RAZA_VORBIRII + 1.5) {
    inchideFerestrele();
  }
}

function uitaNpci() {
  npcDeschis = null;
  misiuneaDeschisa = null;
  negustorul3d = null;
  semneNpc.clear();
}
