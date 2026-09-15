// ==========================================================
//  THINGS THAT ARE ALIVE
//
//  Until now the monsters stood exactly where the zone's recipe put
//  them, facing nowhere, for ever. This file gives them a life: they
//  wander a few steps from home, they notice you, they come at you,
//  they hit, they die, and after a while they come back.
//
//  And it fights with the REAL numbers. Not numbers that look about
//  right - the actual ones:
//
//    statsPentruNivel()  from mobi.js  - a monster's health, damage
//                                        and armour for its level
//                                        and rank
//    damageulTau()       from lupta.js - how hard you hit
//    dupaArmura()        from lupta.js - how much armour eats
//    ratezi()            from lupta.js - whether you miss
//    xpDeLaMob()         from personaj.js - what killing it is worth
//    xpPentruNivel()     from personaj.js - when you level up
//
//  Not one of those lives here. If a formula changes in the 2D
//  game, this fight changes with it, and there is no second copy to
//  drift out of step.
//
//  What is NOT here yet, and should be said plainly: no abilities,
//  no loot, no quests, no talents in combat. Just a weapon swing,
//  both ways.
// ==========================================================


// ---- how monsters behave ----
const RAZA_SUPARARII   = 9;      // tiles: how close before it notices you
const RAZA_LESEI       = 22;     // tiles from home before it gives up and walks back
const RAZA_LOVITURII   = 2.2;    // tiles: close enough to hit
const VITEZA_MOBULUI   = 3.4;    // tiles per second while chasing
const VITEZA_PLIMBARII = 1.1;    // tiles per second while wandering
const PLIMBA_LA        = [2500, 7000];   // pick a new idle spot after this long
const RAZA_PLIMBARII   = 4;      // how far from home it will wander

// A killed monster comes back after this long, the way it does in
// the 2D game - the world would empty out otherwise.
const REVINE_DUPA = 45000;

// The player's own swing reach and how long death lasts.
const RAZA_TA = 2.4;
const MORT_CAT = 4000;


// ----------------------------------------------------------
//  A monster's numbers, worked out once and kept on its entry
//
//  Kept on the entry in zona.mobi, not on the boxes - so a wolf you
//  left at half health is still at half health when you walk back
//  into view and it gets a body again.
// ----------------------------------------------------------
// Is this one unable to act at all? Frozen in a trap, or charmed
// into something harmless. Both are "it stands there and does
// nothing", so they are asked about together.
function mobulEImpiedicat(m, acum) {
  return (m.ingheatatPanaLa > acum) || (m.farmecPanaLa > acum);
}

// Its armour and its damage, after anything that has weakened it.
function armuraMobului(m, acum) {
  const slabit = (m.slabitPanaLa > acum) ? (m.slabireArmura || 0) : 0;
  return m.armura * (1 - slabit);
}

function damageMobului(m, acum) {
  const slabit = (m.slabitPanaLa > acum) ? (m.slabireDmg || 0) : 0;
  return 1 - slabit;
}

function trezesteMobul(m) {
  if (m.viataMaxima !== undefined) return m;

  const s = statsPentruNivel(m.nivel, m.rang);
  m.viataMaxima = s.viata;
  m.viata = s.viata;
  m.dmgMin = s.dmgMin;
  m.dmgMax = s.dmgMax;
  m.armura = s.armura;
  m.vitezaLovirii = s.viteza * 1000;     // milliseconds between its swings

  m.x = m.col;
  m.z = m.rand;
  m.suparat = false;
  m.urmatoareaLovitura = 0;
  m.plimbaLa = 0;
  m.tintaPlimbarii = null;
  return m;
}

function esteMort(m) {
  return !!m.mortPanaLa && performance.now() < m.mortPanaLa;
}


// ----------------------------------------------------------
//  Health bars over their heads
//
//  Two flat pictures that always turn to face you. The back one is
//  the empty bar, the front one is what is left. A bar that shrinks
//  from the middle looks wrong, so as the front one narrows it also
//  slides left by half of what it lost.
// ----------------------------------------------------------
const LAT_BARA = 1.2;
const INALT_BARA = 0.13;

function faBaraDeViata(inaltime) {
  const grup = new THREE.Group();

  const fundal = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x1a1512 }));
  fundal.scale.set(LAT_BARA + 0.06, INALT_BARA + 0.05, 1);

  const plina = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x8c2f27 }));
  plina.scale.set(LAT_BARA, INALT_BARA, 1);

  grup.add(fundal);
  grup.add(plina);
  grup.position.y = inaltime;
  grup.plina = plina;
  return grup;
}

// The bar hangs off the creature, and the creature turns to face
// whatever it is doing. Without undoing that turn the bar turns with
// it, and a half-empty bar that should drain to the left drains to
// the right instead - or towards the camera, edge-on and invisible.
function indreaptaBara(bara, rotatiaFapturii) {
  bara.rotation.y = -rotatiaFapturii;
}

function potrivesteBara(bara, parte) {
  const p = Math.max(0, Math.min(1, parte));
  bara.plina.scale.x = LAT_BARA * p;
  bara.plina.position.x = -(LAT_BARA * (1 - p)) / 2;
  bara.visible = p > 0;
}

// Called by prototip.js the moment a creature is given a body.
function imbracaFapturaInLupta(intrare, grup, tabel) {
  if (tabel !== MOBI) return;
  trezesteMobul(intrare);
  grup.baraLui = faBaraDeViata(grup.inaltimeaLui + 0.22);
  grup.add(grup.baraLui);
  potrivesteBara(grup.baraLui, intrare.viata / intrare.viataMaxima);
}


// ----------------------------------------------------------
//  The numbers that float up when something is hit
//
//  One picture per piece of text, kept and reused - "7" comes up a
//  lot. They rise a little and fade out over three quarters of a
//  second.
// ----------------------------------------------------------
const cifreZburatoare = [];

function aratacifra(x, y, z, text, culoare, mare) {
  const e = eticheta(text, culoare);
  const s = new THREE.Sprite(e.material.clone());
  const cat = mare ? 1.7 : 1.1;
  s.latBaza = e.lat * cat;
  s.inaltBaza = e.inalt * cat;
  s.scale.set(s.latBaza, s.inaltBaza, 1);
  s.position.set(x, y, z);
  s.material.depthTest = false;
  s.renderOrder = 20;
  lumea.add(s);
  cifreZburatoare.push({ s: s, pana: performance.now() + 750 });
}

function miscaCifrele(acum) {
  for (let i = cifreZburatoare.length - 1; i >= 0; i--) {
    const c = cifreZburatoare[i];
    const ramas = (c.pana - acum) / 750;
    if (ramas <= 0) {
      lumea.remove(c.s);
      c.s.material.dispose();
      cifreZburatoare.splice(i, 1);
      continue;
    }
    c.s.position.y += 0.014;
    c.s.material.opacity = Math.min(1, ramas * 2);
    const f = marimePeEcran(c.s);
    c.s.scale.set(c.s.latBaza * f, c.s.inaltBaza * f, 1);
  }
}


// ----------------------------------------------------------
//  Who you are fighting
// ----------------------------------------------------------
let tinta = null;          // the monster you have picked
let luptiSingur = false;   // are you swinging automatically?
let spusCaEDeparte = false;   // have we already said "too far" this time?
let urmatoareaLovituraTa = 0;
let mortPanaLa = 0;

let marcajulTintei = null;

function faMarcajulTintei() {
  const inel = new THREE.Mesh(
    new THREE.RingGeometry(0.62, 0.78, 20),
    new THREE.MeshBasicMaterial({ color: 0xffd34d, transparent: true, opacity: 0.75,
                                  side: THREE.DoubleSide, depthTest: false })
  );
  inel.rotation.x = -Math.PI / 2;
  inel.renderOrder = 15;
  inel.visible = false;
  lumea.add(inel);
  return inel;
}

function alegeTinta(m) {
  const alta = (m || null) !== tinta;
  tinta = m || null;
  if (!tinta) luptiSingur = false;

  // Swapping targets starts your swing over, as it does in Warcraft.
  // Without this you could stand between two wolves and hit both on
  // one weapon timer by tabbing back and forth, which is twice the
  // damage the weapon is worth.
  if (alta && tinta) urmatoareaLovituraTa = performance.now() + pauzaIntreLovituri(armaDeAtac());

  scrieFereastraTintei();
}

function tintaEVie() {
  return !!tinta && !esteMort(tinta) && tinta.viata > 0 &&
         zona && (zona.mobi || []).indexOf(tinta) >= 0;
}

// Which enemy Tab picks, and what the mouse hits, are both in
// comenzi3d.js now - along with every other control.


// ----------------------------------------------------------
//  Hitting things
// ----------------------------------------------------------
function inaltimeaCapului(m) {
  const grup = fapturiDeFata.get(m);
  return (grup && grup.inaltimeaLui) ? grup.inaltimeaLui : 1.4;
}

function loveteMobul(m, acum) {

  const arma = armaDeAtac();
  const p = pozitiaFapturii(m);
  const sus = inaltimeaSolului(Math.round(p.x), Math.round(p.z)) + inaltimeaCapului(m) * 0.7;

  urmatoareaLovituraTa = acum + pauzaIntreLovituri(arma);

  // Turn to face what you are hitting, so you are not swinging at
  // the air behind you.
  fataJucatorului = Math.atan2(p.x - jucator.position.x, p.z - jucator.position.z);

  // The arm comes over whether or not the blow lands - a miss is
  // still a swing. See animatii3d.js.
  if (typeof aiLovit === 'function') aiLovit();

  if (ratezi()) { aratacifra(p.x, sus, p.z, 'Miss', '#cfd6e0', false); return; }

  const lovitura = damageulTau(arma, personaj.attackPower);
  const cat = Math.max(1, Math.round(dupaArmura(lovitura.damage, armuraMobului(m, acum))));

  m.viata = Math.max(0, m.viata - cat);
  m.suparat = true;
  // Hitting something charmed wakes it up, as it should.
  m.farmecPanaLa = 0;

  // It jerks back and flashes red.
  if (typeof fapturaAFostLovita === 'function') fapturaAFostLovita(m);

  // Rage comes from swinging, split the same way the damage is.
  if (typeof castigaRage === 'function') castigaRage(RAGE_PE_LOVITURA / LOVITURI_MAI_DESE);

  aratacifra(p.x, sus, p.z, String(cat), lovitura.critic ? '#ffd34d' : '#ffe9c8', lovitura.critic);

  const grup = fapturiDeFata.get(m);
  if (grup && grup.baraLui) potrivesteBara(grup.baraLui, m.viata / m.viataMaxima);

  if (m.viata <= 0) moareMobul(m, acum);
}


function moareMobul(m, acum) {

  m.mortPanaLa = acum + REVINE_DUPA;
  m.suparat = false;

  // What it leaves behind. pradaCompleta() in obiecte.js decides
  // what that is; see prada3d.js.
  if (typeof lasaPrada === 'function') lasaPrada(m, acum);

  const xp = xpDeLaMob(m.nivel, personaj.nivel);

  const p = pozitiaFapturii(m);
  aratacifra(p.x, inaltimeaSolului(Math.round(p.x), Math.round(p.z)) + 1.8,
             p.z, '+' + xp + ' XP', '#a8d98a', false);

  // The levelling lives in npc3d.js, because handing in a quest has
  // to be able to take you up a level too, by exactly the same path.
  if (typeof daXp === 'function') daXp(xp);

  // Quests that count kills count themselves, through misiuni.js.
  if (typeof amUcis === 'function') {
    try {
      amUcis(personaj, m.fel, m.nume || null).forEach(function (avans) {
        aratacifra(jucator.position.x, jucator.position.y + 2.6, jucator.position.z,
                   avans.terminata ? (TEXT.QUEST_COMPLETE || 'Quest complete')
                                   : textulCerintei(personaj, avans.misiune),
                   avans.terminata ? '#ffd34d' : '#e8dcc0', false);
      });
    } catch (e) { /* a quest we cannot count is not worth a crash */ }
  }

  // The body is NOT taken away here any more. It stays for a moment
  // and falls over - animatii3d.js turns it, and
  // actualizeazaFapturile() in prototip.js clears it up once it has
  // settled. Removing it on this line was why a wolf used to blink
  // out of the world mid-bite.
  if (tinta === m) alegeTinta(null);
}


function teLoveste(m, acum) {

  m.urmatoareaLovitura = acum + m.vitezaLovirii;

  // It lunges at you as it strikes, whether or not it connects.
  if (typeof fapturaLoveste === 'function') fapturaLoveste(m);

  // Talents that teach you to slip a blow, and the Duskborn who are
  // born knowing how.
  let sansaDeEvitare = bonusTalent(personaj, 'dodge');
  if (personaj.idRasa === 'nightelf') sansaDeEvitare += QUICKNESS_DODGE;
  if ((Math.random() * 100) < sansaDeEvitare) {
    aratacifra(jucator.position.x, jucator.position.y + 2, jucator.position.z,
               'Dodge', '#cfd6e0', false);
    return;
  }

  let brut = intreDoua(m.dmgMin, m.dmgMax) * damageMobului(m, acum);
  const critic = (Math.random() * 100) < SANSA_CRITIC_MOB;
  if (critic) brut = brut * 2;

  let cat = Math.max(1, Math.round(dupaArmura(brut, personaj.armura) *
                                   reducereTalent(personaj, 'damageIncasat')));

  // If your companion is at its throat, roughly half the bites land
  // on it instead of you. That is the whole point of having one.
  if (typeof loveaAnimalul === 'function' && Math.random() < 0.5) {
    if (loveaAnimalul(m, cat)) return;
  }

  // A shield swallows the blow before your health does, and only
  // what is left over reaches you.
  if (typeof inghiteScutul === 'function') cat = inghiteScutul(cat);
  if (cat <= 0) return;

  personaj.viata = Math.max(0, personaj.viata - cat);
  if (typeof teDaJosDeCal === 'function') teDaJosDeCal();
  if (typeof aiFostLovit === 'function') aiFostLovit();

  // And from being hit.
  if (typeof castigaRage === 'function') castigaRage(RAGE_LA_INCASARE);

  aratacifra(jucator.position.x, jucator.position.y + 2, jucator.position.z,
             '-' + cat, critic ? '#ff9a6a' : '#f0a0a0', critic);

  if (personaj.viata <= 0) moriTu(acum);
}


function moriTu(acum) {
  mortPanaLa = acum + MORT_CAT;
  luptiSingur = false;
  alegeTinta(null);
  // Everything loses interest in a corpse.
  (zona.mobi || []).forEach(function (m) { m.suparat = false; });
  aratacifra(jucator.position.x, jucator.position.y + 2.4, jucator.position.z,
             'You died', '#ff9a6a', true);
}


function teIntorciLaViata() {
  personaj.viata = personaj.viataMaxima;
  if (personaj.resursa === RESURSA_MANA) personaj.mana = personaj.manaMaxima;
  const unde = zona.reinviere || zona.start;
  jucator.position.set(unde.col, inaltimeaSolului(unde.col, unde.rand), unde.rand);
  construiesteLumea(unde.col, unde.rand);
  actualizeazaFapturile();
}


// ----------------------------------------------------------
//  What the monsters do, once a frame
// ----------------------------------------------------------
function poateCalcaMobul(x, z) {
  return !esteBlocat(Math.round(x), Math.round(z));
}

function miscaMobul(m, delta, acum) {

  const catreTineX = jucator.position.x - m.x;
  const catreTineZ = jucator.position.z - m.z;
  const panaLaTine = Math.hypot(catreTineX, catreTineZ);
  const deAcasa = Math.hypot(m.x - m.col, m.z - m.rand);

  // Frozen solid, or charmed into something harmless: it does not
  // move and it does not swing.
  if (mobulEImpiedicat(m, acum)) return;

  // Frightened: it turns and runs, and cannot be reasoned with
  // until it wears off.
  if (m.fricaPanaLa > acum) {
    const fugaX = m.x + (m.x - jucator.position.x);
    const fugaZ = m.z + (m.z - jucator.position.z);
    const dxF = fugaX - m.x, dzF = fugaZ - m.z;
    const catF = Math.hypot(dxF, dzF) || 1;
    const pasF = VITEZA_MOBULUI * delta;
    if (poateCalcaMobul(m.x + (dxF / catF) * pasF, m.z)) m.x += (dxF / catF) * pasF;
    if (poateCalcaMobul(m.x, m.z + (dzF / catF) * pasF)) m.z += (dzF / catF) * pasF;
    return;
  }

  // Do you matter to it?
  if (!m.suparat && mortPanaLa < acum && panaLaTine <= RAZA_SUPARARII) m.suparat = true;
  // Playing dead: nothing has any interest in you.
  if (teFaciMort(acum)) m.suparat = false;
  if (m.suparat && (deAcasa > RAZA_LESEI || mortPanaLa > acum)) {
    m.suparat = false;
    m.viata = m.viataMaxima;      // it heals on the way home, as in the 2D game
    const grup = fapturiDeFata.get(m);
    if (grup && grup.baraLui) potrivesteBara(grup.baraLui, 1);
  }

  let tintaX = null, tintaZ = null, viteza = VITEZA_PLIMBARII;

  if (m.suparat) {
    if (panaLaTine > RAZA_LOVITURII) { tintaX = jucator.position.x; tintaZ = jucator.position.z; }
    viteza = VITEZA_MOBULUI;

    // Cut its leg and it limps, for as long as the ability says.
    if (m.incetinitPanaLa > acum) viteza = viteza * (m.catDeIncetinit || 1);

    if (panaLaTine <= RAZA_LOVITURII && acum >= m.urmatoareaLovitura) {
      if (!m.urmatoareaLovitura) m.urmatoareaLovitura = acum + m.vitezaLovirii;
      else teLoveste(m, acum);
    }

  } else if (deAcasa > 0.6) {
    tintaX = m.col; tintaZ = m.rand;              // wander back home

  } else {
    // Idle: pick a spot nearby every few seconds and stroll to it.
    if (acum >= m.plimbaLa) {
      m.plimbaLa = acum + intreDoua(PLIMBA_LA[0], PLIMBA_LA[1]);
      const unghiul = Math.random() * Math.PI * 2;
      const cat = Math.random() * RAZA_PLIMBARII;
      m.tintaPlimbarii = { x: m.col + Math.cos(unghiul) * cat,
                           z: m.rand + Math.sin(unghiul) * cat };
    }
    if (m.tintaPlimbarii) { tintaX = m.tintaPlimbarii.x; tintaZ = m.tintaPlimbarii.z; }
  }

  if (tintaX === null) return;

  const dx = tintaX - m.x, dz = tintaZ - m.z;
  const cat = Math.hypot(dx, dz);
  if (cat < 0.15) { m.tintaPlimbarii = null; return; }

  const pas = Math.min(cat, viteza * delta);
  const nx = m.x + (dx / cat) * pas;
  const nz = m.z + (dz / cat) * pas;

  // One direction at a time, so it slides along a wall instead of
  // grinding into it.
  if (poateCalcaMobul(nx, m.z)) m.x = nx;
  if (poateCalcaMobul(m.x, nz)) m.z = nz;
}


// ----------------------------------------------------------
//  The panels: your health, your target, your experience
//
//  Plain HTML over the top of the 3D picture. A health bar does not
//  need to be made of boxes.
// ----------------------------------------------------------
let panouTau = null, panouTinta = null;
let felulDinPortret = null;      // whose picture is in the target frame
let cumEraiImbracat = null;      // and what you were wearing in yours

function faPanourileLuptei() {
  const gazda = document.createElement('div');
  gazda.id = 'panouri';
  // Each frame is a portrait and, beside it, the bars. The portrait
  // is not decoration: yours shows what you are actually wearing,
  // and your target's is drawn from that creature's own shapes, so
  // you can tell a rat from a bandit without reading the name.
  // The two frames sit in a ROW, not at two positions measured out by
  // hand. They used to be at left:14 and left:262, which was right
  // until the frames were made eight pixels wider - and then they
  // overlapped, because a number written in one place has to be
  // remembered in the other. A row cannot overlap itself.
  gazda.innerHTML =
    '<div id="randul-panourilor">' +
    '<div id="panou-tau" class="panou-lupta">' +
      '<div class="portret"><div class="inauntru" id="portret-tau"></div></div>' +
      '<div class="cifrele">' +
        '<div class="nume-lupta"><span id="nume-tau"></span><span id="nivel-tau"></span></div>' +
        '<div class="sant"><span id="viata-ta" class="viata"></span></div>' +
        '<div class="sant"><span id="resursa-ta" class="mana"></span></div>' +
        '<div class="sant subtire"><span id="xp-tau" class="xp"></span></div>' +
      '</div>' +
    '</div>' +
    '<div id="panou-tinta" class="panou-lupta ascuns">' +
      '<div class="portret"><div class="inauntru" id="portret-tinta"></div></div>' +
      '<div class="cifrele">' +
        '<div class="nume-lupta"><span id="nume-tinta"></span><span id="nivel-tinta"></span></div>' +
        '<div class="sant"><span id="viata-tintei" class="viata rosu"></span></div>' +
      '</div>' +
    '</div>' +
    '</div>';
  document.body.appendChild(gazda);
  panouTau = document.getElementById('panou-tau');
  panouTinta = document.getElementById('panou-tinta');

  asazaPanourileSubBara();
  window.addEventListener('resize', asazaPanourileSubBara);
}

// The top bar's height depends on how its text wraps - one line on a
// wide window, two on a narrow one. Guessing it put the target's name
// behind the bar, where it could not be read at all. So we measure.
function asazaPanourileSubBara() {
  const gazda = document.getElementById('panouri');
  const bara = document.getElementById('bara');
  if (!gazda || !bara) return;
  const inalt = bara.classList.contains('ascuns') ? 0 : bara.getBoundingClientRect().height;
  gazda.style.top = (inalt + 8) + 'px';
}

function scrieFereastraTintei() {
  if (!panouTinta) return;
  if (!tintaEVie()) { panouTinta.classList.add('ascuns'); return; }
  panouTinta.classList.remove('ascuns');
  const d = MOBI[tinta.fel] || {};
  document.getElementById('nume-tinta').textContent = tinta.nume || d.nume || tinta.fel;
  document.getElementById('nivel-tinta').textContent =
    'Level ' + tinta.nivel + (tinta.rang && tinta.rang !== 'normal' ? ' · ' + tinta.rang : '');

  // Redrawn only when you pick something different, not every time
  // its health moves.
  if (felulDinPortret !== tinta.fel && typeof portretulFapturii === 'function') {
    felulDinPortret = tinta.fel;
    document.getElementById('portret-tinta').innerHTML = portretulFapturii(d.forme);
  }

  // How hard it is going to be, in the colour the map already uses
  // for zones that are over your head.
  const fataDe = tinta.nivel - personaj.nivel;
  panouTinta.className = 'panou-lupta ' +
    (fataDe >= 3 ? 'greu' : fataDe >= 1 ? 'cam-greu' : fataDe <= -4 ? 'usor' : 'potrivit');
}

function scriePanourileLuptei() {
  if (!panouTau || !personaj) return;

  // Your own portrait, out of the same shapes the character creation
  // screen draws you from - so it changes when you put a helmet on.
  // Redrawn only when what you are wearing changes; it is a couple of
  // dozen boxes, and doing that sixty times a second would be daft.
  if (typeof htmlSilueta === 'function') {
    const imbracat = Object.keys(personaj.echipament || {}).map(function (s) {
      return s + ':' + (personaj.echipament[s] ? personaj.echipament[s].id : '');
    }).join();
    if (imbracat !== cumEraiImbracat) {
      cumEraiImbracat = imbracat;
      document.getElementById('portret-tau').innerHTML = htmlSilueta(personaj);
    }
  }

  document.getElementById('nume-tau').textContent = personaj.nume || '';
  document.getElementById('nivel-tau').textContent = 'Level ' + personaj.nivel;
  document.getElementById('viata-ta').style.width =
    (100 * personaj.viata / personaj.viataMaxima) + '%';
  document.getElementById('viata-ta').textContent =
    Math.ceil(personaj.viata) + ' / ' + personaj.viataMaxima;

  // Rage or mana. They fill in opposite directions, but they are the
  // same bar - as they are in the 2D game.
  const bara = document.getElementById('resursa-ta');
  if (personaj.resursa === RESURSA_FURIE) {
    bara.className = 'rage';
    bara.style.width = Math.round(personaj.rage || 0) + '%';
    bara.textContent = Math.round(personaj.rage || 0) + ' / 100';
  } else {
    bara.className = 'mana';
    bara.style.width = (100 * (personaj.mana || 0) / personaj.manaMaxima) + '%';
    bara.textContent = Math.round(personaj.mana || 0) + ' / ' + personaj.manaMaxima;
  }

  const trebuie = xpPentruNivel(personaj.nivel);
  document.getElementById('xp-tau').style.width =
    (personaj.nivel >= NIVEL_MAXIM ? 100 : 100 * (personaj.xp || 0) / trebuie) + '%';

  if (tintaEVie()) {
    document.getElementById('viata-tintei').style.width =
      (100 * tinta.viata / tinta.viataMaxima) + '%';
    document.getElementById('viata-tintei').textContent =
      Math.ceil(tinta.viata) + ' / ' + tinta.viataMaxima;
  } else if (tinta) {
    alegeTinta(null);
  }
}


// ----------------------------------------------------------
//  Once a frame
// ----------------------------------------------------------
function actualizeazaLupta(delta, acum) {

  if (!personaj || !zona) return;

  if (!panouTau) faPanourileLuptei();
  if (!marcajulTintei) marcajulTintei = faMarcajulTintei();

  // Dead: you lie there a few seconds and come back at the zone's
  // own resurrection point.
  if (mortPanaLa) {
    if (acum >= mortPanaLa) { mortPanaLa = 0; teIntorciLaViata(); }
    miscaCifrele(acum);
    scriePanourileLuptei();
    return;
  }

  // Out of combat you mend, at the rate the game already uses:
  // Spirit divided by ten, per second.
  const inLupta = (zona.mobi || []).some(function (m) { return m.suparat; });
  if (!inLupta && personaj.viata < personaj.viataMaxima) {
    personaj.viata = Math.min(personaj.viataMaxima,
      personaj.viata + (personaj.atribute.spi / 10) * delta *
      inmultitorTalent(personaj, 'regen'));
  }

  // Monsters near enough to matter. The ones far away do nothing at
  // all - there are 1300 of them in Greenvale.
  const x = jucator.position.x, z = jucator.position.z;
  (zona.mobi || []).forEach(function (m) {
    if (esteMort(m)) return;
    if (m.viataMaxima === undefined) {
      if (Math.abs(m.col - x) > RAZA_FAPTURI || Math.abs(m.rand - z) > RAZA_FAPTURI) return;
      trezesteMobul(m);
    }
    // Out of sight, and therefore out of mind. Without this, a
    // monster you woke and then ran away from stayed angry FOR EVER:
    // it is no longer close enough to be given a turn, so nothing
    // ever calms it down again. And because "am I in a fight?" asks
    // whether ANY monster is angry, one of those left behind in a
    // corner of the zone quietly stopped your health coming back,
    // stopped your rage draining, and made it impossible to get on a
    // horse - anywhere in the zone, for the rest of the session.
    if (Math.abs(m.x - x) > RAZA_FAPTURI || Math.abs(m.z - z) > RAZA_FAPTURI) {
      if (m.suparat) {
        m.suparat = false;
        m.viata = m.viataMaxima;      // it goes home and mends, as it would
        m.x = m.col; m.z = m.rand;
      }
      return;
    }

    miscaMobul(m, delta, acum);

    const grup = fapturiDeFata.get(m);
    if (grup) {
      grup.position.x = m.x;
      grup.position.z = m.z;
      grup.position.y = inaltimeaSolului(Math.round(m.x), Math.round(m.z));
      if (m.suparat) grup.rotation.y = Math.atan2(x - m.x, z - m.z);

      if (grup.baraLui) {
        potrivesteBara(grup.baraLui, m.viata / m.viataMaxima);
        grup.baraLui.visible = m.viata < m.viataMaxima || m.suparat || m === tinta;
        indreaptaBara(grup.baraLui, grup.rotation.y);
        if (grup.baraLui.visible) {
          const f = marimePeEcran(grup.baraLui);
          grup.baraLui.scale.set(f, f, 1);
        }
      }

      // Hold the name at a steady size on screen, and lift it clear
      // of the health bar when both are showing.
      if (grup.numeleScris && grup.numeleScris.visible) {
        const f = marimePeEcran(grup.numeleScris);
        grup.numeleScris.scale.set(grup.numeleScris.latBaza * f,
                                   grup.numeleScris.inaltBaza * f, 1);
        grup.numeleScris.position.y = grup.inaltimeaLui + 0.22 +
          (grup.baraLui && grup.baraLui.visible ? INALT_BARA * f + 0.14 : 0.2);
      }
    }
  });

  // Your own swing.
  //
  // Out of reach you simply do not swing - and it SAYS so, once,
  // instead of going quiet. A silent auto-attack that is doing
  // nothing because you are half a step too far away is the single
  // most confusing thing a fight can do.
  if (luptiSingur && tintaEVie()) {
    const p = pozitiaFapturii(tinta);
    if (Math.hypot(p.x - x, p.z - z) <= RAZA_TA) {
      spusCaEDeparte = false;
      if (acum >= urmatoareaLovituraTa) loveteMobul(tinta, acum);
    } else if (!spusCaEDeparte) {
      spusCaEDeparte = true;
      spuneCeva(TEXT.TARGET_TOO_FAR);
    }
  } else if (luptiSingur) {
    luptiSingur = false;
  }

  // The ring under whatever you have picked.
  if (tintaEVie()) {
    const p = pozitiaFapturii(tinta);
    marcajulTintei.visible = true;
    marcajulTintei.position.set(p.x, inaltimeaSolului(Math.round(p.x), Math.round(p.z)) + 0.05, p.z);
  } else {
    marcajulTintei.visible = false;
  }

  // Casting, wounds that keep burning, rage and mana, and the
  // buttons along the bottom. See abilitati3d.js and interfata.js.
  if (typeof actualizeazaAbilitatile === 'function') {
    actualizeazaAbilitatile(delta, acum, inLupta);
  }

  miscaCifrele(acum);
  scriePanourileLuptei();
}


// Leaving a zone: forget who you were fighting.
function uitaLupta() {
  if (typeof uitaPrada === 'function') uitaPrada();
  if (typeof uitaAnimalul === 'function') uitaAnimalul();
  if (typeof uitaMeseriile === 'function') uitaMeseriile();
  tinta = null;
  luptiSingur = false;
  mortPanaLa = 0;
  if (typeof uitaAbilitatile === 'function') uitaAbilitatile();
  for (let i = cifreZburatoare.length - 1; i >= 0; i--) lumea.remove(cifreZburatoare[i].s);
  cifreZburatoare.length = 0;
  if (marcajulTintei) marcajulTintei.visible = false;
  scrieFereastraTintei();
}


// Tab, Escape, the mouse and everything else you press: comenzi3d.js.
