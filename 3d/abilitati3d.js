// ==========================================================
//  USING ABILITIES
//
//  All 69 of them already exist, with every number written down, in
//  abilitati.js: what they cost, how long they take to cast, how
//  long until you can use one again, what they do, and how much
//  stronger each rank is. Nothing about them is invented here.
//
//  This file only answers: what happens in the 3D world when you
//  press the button. It reads the ability, spends the resource,
//  waits out the cast, and applies the effect using the same
//  formulas the 2D game uses - damageulTau, dupaArmura, sporulVrajii,
//  sporulRanii, all from lupta.js.
//
//  There are 22 kinds in abilitati.js, not the nine I first assumed
//  - I only found that out by trying all 67 abilities one at a time
//  and looking at which ones did nothing. Seventeen are done here:
//
//    lovitura     a weapon blow, up close
//    sageata      a shot, from a distance
//    vraja        a spell that flies at the target
//    vindecare    heals you at once
//    alinare      heals you a little at a time
//    arsura       opens a wound that hurts over time
//    val          hits everything around you
//    intarire     strengthens you for a while
//    saritura     closes the gap, or opens it
//    slabire      takes the edge off its armour or its damage
//    scut         swallows blows before your health does
//    frica        sends everything close by running
//    farmec       leaves one standing there, until you hit it
//    mortPrefacut nothing wants anything to do with you
//    refacere     hands back mana
//    capcana      waits on the ground for something to step on it
//    intrerupere  runs, but there is nothing casting to stop yet
//
//  FIVE ARE NOT, and say so out loud when pressed, rather than
//  pretending: 'cheama', 'invie' and 'imblanzire' need the hunter's
//  pet; 'faceMancare' needs bags; 'teleport' needs city travel.
//  None of those exist in the 3D world yet.
// ==========================================================


// The warrior's resource is written 'furie' in personaj.js, not
// 'rage'. Every other class uses 'mana'. Comparing against the
// English word silently never matched, so the rage bar sat at zero
// and rage never drained - written down here once, as a name, so it
// cannot be mistyped again.
const RESURSA_FURIE = 'furie';
const RESURSA_MANA  = 'mana';

// Ranges. The 2D game measures in pixels at 32 to a tile; here a
// tile is 1, so the ability's own raza is divided by that.
const CASUTA_IN_PIXELI = 32;

function razaAbilitatii(ab) {
  let raza;
  if (ab.raza) raza = ab.raza / CASUTA_IN_PIXELI;
  else if (ab.fel === 'sageata' || ab.fel === 'vraja' || ab.deLaDistanta) raza = 9;
  else if (ab.fel === 'intrerupere') raza = (personaj.idClasa === 'warrior') ? 2.6 : 9;
  else raza = RAZA_TA;

  // NIMIC NU POATE AJUNGE MAI APROAPE DECAT PROPRIA TA SABIE.
  //
  // Razele scrise de mana in abilitati.js sunt in pixeli de-ai
  // jocului 2D, unde corp la corp inseamna 34 de pixeli - o casuta
  // si ceva. Aici corp la corp inseamna 2,4 casute, fiindca lumea e
  // vazuta altfel si de la o casuta nu ajungi la nimic.
  //
  // Cine a intins doar una din cele doua a facut ca Shield Knock, cu
  // raza lui de 58 de pixeli, sa ajunga 1,81 casute: stateai lipit
  // de lup, il loveai cu sabia, si intreruperea spunea "prea
  // departe". Deci: orice raza sub bataia sabiei devine bataia
  // sabiei. Pe cele adevarat lungi - cea mai scurta dintre ele e de
  // aproape trei casute - nu le atinge deloc.
  return Math.max(raza, RAZA_TA);
}


// ----------------------------------------------------------
//  Cooldowns
//
//  Two kinds, as in every game of this shape: the ability's own
//  wait, and the short global pause after ANY of them, so you
//  cannot press three buttons at once.
// ----------------------------------------------------------
const pauzeAbilitati = {};
let pauzaGlobalaPanaLa = 0;

function pauzaAbilitatii(id) {
  return Math.max(pauzeAbilitati[id] || 0, pauzaGlobalaPanaLa);
}

// What it actually costs you, after the talents that make things
// cheaper. Asked in both places - what you can afford and what you
// are charged - so the two can never disagree.
function costulAbilitatii(ab) {
  const scade = reducereTalent(personaj, 'costResursa');
  return {
    rage: Math.round((ab.costRage || 0) * scade),
    mana: Math.round((ab.costMana || 0) * scade)
  };
}

function aiCuCePlati(ab) {
  const c = costulAbilitatii(ab);
  if (c.rage) return (personaj.rage || 0) >= c.rage;
  if (c.mana) return (personaj.mana || 0) >= c.mana;
  return true;
}

function plateste(ab) {
  const c = costulAbilitatii(ab);
  if (c.rage) personaj.rage = Math.max(0, (personaj.rage || 0) - c.rage);
  if (c.mana) personaj.mana = Math.max(0, (personaj.mana || 0) - c.mana);
}


// ----------------------------------------------------------
//  Casting
//
//  Some abilities land the moment you press. Others need a few
//  seconds of standing still, and moving cancels them - which is
//  the whole reason a caster has to think about where they stand.
// ----------------------------------------------------------
let incantareaInCurs = null;

function opresteIncantarea(deCe) {
  if (!incantareaInCurs) return;
  if (deCe) spuneCeva(deCe);
  incantareaInCurs = null;
}


// A short line of text above your head.
function spuneCeva(text) {
  aratacifra(jucator.position.x, jucator.position.y + 2.2, jucator.position.z,
             text, '#e0b45a', false);
}


// ----------------------------------------------------------
//  Pressing a button
// ----------------------------------------------------------
function apasaLocul(loc) {
  const ab = abilitateaDinSlot(loc);
  if (!ab) return;
  folosesteAbilitatea3d(ab);
}

function folosesteAbilitatea3d(ab) {

  const acum = performance.now();

  if (mortPanaLa) return;
  if (incantareaInCurs) { spuneCeva('Already casting'); return; }
  if (acum < pauzaAbilitatii(ab.id)) return;
  if (!aiCuCePlati(ab)) { spuneCeva(ab.costRage ? 'Not enough rage' : 'Not enough mana'); return; }

  // Does it need something to point at?
  const areNevoieDeTinta = ['lovitura','sageata','vraja','arsura','intrerupere'].indexOf(ab.fel) >= 0;
  if (areNevoieDeTinta) {
    if (!tintaEVie()) { spuneCeva(TEXT.SELECT_TARGET || 'Select an enemy first'); return; }
    const p = pozitiaFapturii(tinta);
    if (Math.hypot(p.x - jucator.position.x, p.z - jucator.position.z) > razaAbilitatii(ab)) {
      spuneCeva(TEXT.TARGET_TOO_FAR || 'Too far away'); return;
    }
  }

  if (!ab.incantare) { faceEfectul(ab, acum); return; }

  // A cast: remember where you stood, so a step cancels it.
  incantareaInCurs = {
    ab: ab, nume: ab.nume, dela: acum, cat: ab.incantare,
    unde: { x: jucator.position.x, z: jucator.position.z }
  };
}


// Called once a frame: finish or cancel whatever is being cast.
function actualizeazaIncantarea(acum) {
  if (!incantareaInCurs) return;

  const c = incantareaInCurs;

  if (mortPanaLa) { opresteIncantarea(null); return; }

  if (Math.hypot(jucator.position.x - c.unde.x, jucator.position.z - c.unde.z) > 0.35) {
    opresteIncantarea('Interrupted');
    return;
  }

  if (acum - c.dela >= c.cat) {
    incantareaInCurs = null;
    faceEfectul(c.ab, acum);
  }
}


// ----------------------------------------------------------
//  What each kind actually does
// ----------------------------------------------------------
function faceEfectul(ab, acum) {

  plateste(ab);
  pauzeAbilitati[ab.id] = acum + (ab.pauza || 0) * reducereTalent(personaj, 'pauza');
  pauzaGlobalaPanaLa = acum + PAUZA_GLOBALA;

  switch (ab.fel) {

    case 'lovitura':
    case 'sageata':
      lovesteCuAbilitatea(ab, acum);
      break;

    case 'vraja':
      aruncaVraja(ab, acum);
      break;

    case 'val':
      loveaTotInJur3d(ab, acum);
      break;

    case 'vindecare':
      teVindeci(ab);
      break;

    case 'alinare':
      puneAlinarea(ab, acum);
      break;

    case 'arsura':
      puneRana3d(ab, acum);
      break;

    case 'intarire':
      puneIntarirea(ab, acum);
      break;

    case 'intrerupere':
      intrerupeTinta(ab);
      break;

    case 'saritura':
      sari(ab, acum);
      break;

    case 'slabire':
      slabesteTinta(ab, acum);
      break;

    case 'scut':
      puneScutul(ab, acum);
      break;

    case 'frica':
      sperieInJur(ab, acum);
      break;

    case 'farmec':
      farmecaTinta(ab, acum);
      break;

    case 'mortPrefacut':
      teFaciMortPanaLa = acum + (ab.tine || 0);
      spuneCeva(ab.nume);
      break;

    case 'refacere':
      refaResursa(ab);
      break;

    case 'capcana':
      puneCapcana(ab, acum);
      break;

    case 'imblanzire':
      imblanzesteFiara(ab);
      break;

    case 'cheama':
      cheamaAnimalul(ab);
      break;

    case 'invie':
      invieAnimalul(ab);
      break;

    case 'faceMancare':
      faceMancare3d(ab);
      break;

    case 'teleport':
      teleporteazaTe(ab);
      break;

    default:
      spuneCeva('Not in the 3D world yet');
      break;
  }
}


// ----------------------------------------------------------
//  Closing the gap, and opening it
//
//  'laTinta' jumps you to whatever you have picked. Otherwise
//  'sarePana' says how far to jump along your own facing - a
//  positive number forwards, a negative one backwards, and it is
//  written in the 2D game's pixels.
// ----------------------------------------------------------
function sari(ab, acum) {
  let tintaX, tintaZ;

  if (ab.laTinta) {
    if (!tintaEVie()) { spuneCeva(TEXT.SELECT_TARGET || 'Select an enemy first'); return; }
    const p = pozitiaFapturii(tinta);
    const dx = p.x - jucator.position.x, dz = p.z - jucator.position.z;
    const cat = Math.hypot(dx, dz) || 1;
    // Land just short, not inside it.
    const opreste = Math.max(0, cat - 1.6);
    tintaX = jucator.position.x + (dx / cat) * opreste;
    tintaZ = jucator.position.z + (dz / cat) * opreste;
    tinta.suparat = true;
  } else {
    const cat = (ab.sarePana || 0) / CASUTA_IN_PIXELI;
    tintaX = jucator.position.x + Math.sin(fataJucatorului) * cat;
    tintaZ = jucator.position.z + Math.cos(fataJucatorului) * cat;
  }

  // Walk the jump in short steps and stop at the first thing in the
  // way, so a leap can never put you inside a wall.
  const dx = tintaX - jucator.position.x, dz = tintaZ - jucator.position.z;
  const lung = Math.hypot(dx, dz);
  const pasi = Math.max(1, Math.ceil(lung / 0.3));
  for (let i = 1; i <= pasi; i++) {
    const x = jucator.position.x + (dx / pasi), z = jucator.position.z + (dz / pasi);
    if (!poatiSta(x, z)) break;
    jucator.position.x = x;
    jucator.position.z = z;
  }

  if (ab.daRage) castigaRage(ab.daRage);
  spuneCeva(ab.nume);
}


// ----------------------------------------------------------
//  Weakening what you are fighting
//
//  'slabesteCu' takes that share off its armour, 'slabesteDmg' off
//  how hard it hits. Some of them land a weapon blow at the same
//  time, which is what 'inmultit' is for.
// ----------------------------------------------------------
function slabesteTinta(ab, acum) {
  if (!tintaEVie()) { spuneCeva(TEXT.SELECT_TARGET || 'Select an enemy first'); return; }

  const p = pozitiaFapturii(tinta);
  if (Math.hypot(p.x - jucator.position.x, p.z - jucator.position.z) > razaAbilitatii(ab)) {
    spuneCeva(TEXT.TARGET_TOO_FAR || 'Too far away'); return;
  }

  tinta.slabitPanaLa = acum + (ab.tine || 0);
  if (ab.slabesteCu)  tinta.slabireArmura = ab.slabesteCu;
  if (ab.slabesteDmg) tinta.slabireDmg = ab.slabesteDmg;
  tinta.suparat = true;

  if (ab.inmultit) lovesteCuAbilitatea(ab, acum);
  else cifraPeMob(tinta, ab.nume, '#d0a8e0', false);
}


// ----------------------------------------------------------
//  A shield that swallows blows
//
//  It holds a number. Every hit takes from that number first, and
//  only what is left over reaches your health. When the number runs
//  out, or the time does, it is gone.
// ----------------------------------------------------------
let scutulTau = 0;
let scutulPanaLa = 0;

function puneScutul(ab, acum) {
  scutulTau = ab.absoarbe || 0;
  scutulPanaLa = acum + (ab.tine || 0);
  spuneCeva(ab.nume + ' (' + scutulTau + ')');
}

function inghiteScutul(cat) {
  if (performance.now() > scutulPanaLa || scutulTau <= 0) return cat;
  const inghitit = Math.min(scutulTau, cat);
  scutulTau -= inghitit;
  if (inghitit > 0) {
    aratacifra(jucator.position.x, jucator.position.y + 2.2, jucator.position.z,
               'Absorbed ' + Math.round(inghitit), '#9ad8f0', false);
  }
  return cat - inghitit;
}


// ----------------------------------------------------------
//  Fear, charm, playing dead
// ----------------------------------------------------------
function sperieInJur(ab, acum) {
  const raza = razaAbilitatii(ab);
  let cati = 0;
  (zona.mobi || []).forEach(function (m) {
    if (esteMort(m) || m.viataMaxima === undefined) return;
    if (Math.hypot(m.x - jucator.position.x, m.z - jucator.position.z) > raza) return;
    m.fricaPanaLa = acum + (ab.tine || 0);
    cati++;
  });
  spuneCeva(cati ? ab.nume : 'Nothing in reach');
}

function farmecaTinta(ab, acum) {
  if (!tintaEVie()) { spuneCeva(TEXT.SELECT_TARGET || 'Select an enemy first'); return; }
  tinta.farmecPanaLa = acum + (ab.tine || 0);
  tinta.suparat = false;
  cifraPeMob(tinta, ab.nume, '#c8a0e0', false);
}

let teFaciMortPanaLa = 0;

function teFaciMort(acum) {
  return teFaciMortPanaLa > acum;
}

function refaResursa(ab) {
  if (personaj.resursa === RESURSA_MANA) {
    const inainte = personaj.mana || 0;
    personaj.mana = Math.min(personaj.manaMaxima, inainte + (ab.cat || 0));
    spuneCeva('+' + Math.round(personaj.mana - inainte) + ' mana');
  } else {
    castigaRage(ab.cat || 0);
    spuneCeva(ab.nume);
  }
}


// ----------------------------------------------------------
//  Traps
//
//  Put down where you stand. It waits 'tineCapcana' for something
//  to walk onto it, and then either freezes it or sets it burning
//  for 'tineEfectul'.
// ----------------------------------------------------------
const capcanePuse = [];
const RAZA_CAPCANEI = 1.4;

function puneCapcana(ab, acum) {
  const semn = new THREE.Mesh(
    new THREE.RingGeometry(0.5, RAZA_CAPCANEI, 18),
    new THREE.MeshBasicMaterial({ color: ab.culoare || 0x9adcf8, transparent: true,
                                  opacity: 0.45, side: THREE.DoubleSide })
  );
  semn.rotation.x = -Math.PI / 2;
  semn.position.set(jucator.position.x, jucator.position.y + 0.06, jucator.position.z);
  lumea.add(semn);

  capcanePuse.push({
    ab: ab, semn: semn,
    x: jucator.position.x, z: jucator.position.z,
    pana: acum + (ab.tineCapcana || 60000)
  });
  spuneCeva(ab.nume);
}

function actualizeazaCapcanele(acum) {
  for (let i = capcanePuse.length - 1; i >= 0; i--) {
    const c = capcanePuse[i];

    if (acum >= c.pana) { lumea.remove(c.semn); capcanePuse.splice(i, 1); continue; }

    const prins = (zona.mobi || []).find(function (m) {
      return !esteMort(m) && m.viataMaxima !== undefined &&
             Math.hypot(m.x - c.x, m.z - c.z) <= RAZA_CAPCANEI;
    });
    if (!prins) continue;

    if (c.ab.prinde === 'gheata') {
      prins.ingheatatPanaLa = acum + (c.ab.tineEfectul || 0);
      cifraPeMob(prins, 'Frozen', '#9adcf8', false);
    } else {
      // Fire: it burns for as long as the trap says, on the same
      // list every other wound is kept on.
      lucruriCareTin.push({
        fel: 'rana', ab: c.ab, pe: prins, peTic: c.ab.peTura || 0,
        laCat: 2000, urmatorul: acum + 2000, pana: acum + (c.ab.tineEfectul || 0)
      });
      cifraPeMob(prins, 'Burning', '#ffb060', false);
    }

    lumea.remove(c.semn);
    capcanePuse.splice(i, 1);
  }
}


function uitaCapcanele() {
  capcanePuse.forEach(function (c) { lumea.remove(c.semn); });
  capcanePuse.length = 0;
}


// A weapon blow or a shot: the same swing you make anyway, times
// whatever the ability multiplies it by.
function lovesteCuAbilitatea(ab, acum) {
  if (!tintaEVie()) return;

  const arma = armaDeAtac();
  const p = pozitiaFapturii(tinta);
  fataJucatorului = Math.atan2(p.x - jucator.position.x, p.z - jucator.position.z);

  if (ratezi()) { cifraPeMob(tinta, 'Miss', '#cfd6e0', false); return; }

  const lovitura = damageulTau(arma, attackPowerFolosit(ab));
  let brut = lovitura.damage * (ab.inmultit || 1);
  if (ab.dmgMin) brut = brut + intreDoua(ab.dmgMin, ab.dmgMax);
  brut = brut * inmultitorTalent(personaj, 'dmgAbilitate');

  daiDamage(tinta, brut, lovitura.critic, acum);
  if (ab.incetineste) incetinesteMobul(tinta, ab, acum);
}


// A hunter shooting uses ranged attack power; everyone else uses
// the ordinary kind.
function attackPowerFolosit(ab) {
  const laDistanta = ab.fel === 'sageata' || ab.deLaDistanta;
  return (laDistanta && personaj.attackPowerDistanta)
    ? personaj.attackPowerDistanta : personaj.attackPower;
}


// A spell: its own damage plus what your spell power adds.
function aruncaVraja(ab, acum) {
  if (!tintaEVie()) return;
  const p = pozitiaFapturii(tinta);
  fataJucatorului = Math.atan2(p.x - jucator.position.x, p.z - jucator.position.z);

  const brut = (intreDoua(ab.dmgMin, ab.dmgMax) + sporulVrajii(ab)) *
               inmultitorTalent(personaj, 'dmgAbilitate');
  const critic = (Math.random() * 100) < personaj.critical;
  daiDamage(tinta, critic ? brut * 2 : brut, critic, acum);
  if (ab.incetineste) incetinesteMobul(tinta, ab, acum);
}


// Everything close by, at once.
function loveaTotInJur3d(ab, acum) {
  const raza = razaAbilitatii(ab);
  const x = jucator.position.x, z = jucator.position.z;
  let cate = 0;

  (zona.mobi || []).forEach(function (m) {
    if (esteMort(m) || m.viataMaxima === undefined) return;
    if (Math.hypot(m.x - x, m.z - z) > raza) return;

    let brut = intreDoua(ab.dmgMin, ab.dmgMax) + sporulVrajii(ab);
    if (ab.inmultit) brut = brut * ab.inmultit;
    brut = brut * inmultitorTalent(personaj, 'dmgAbilitate');
    const critic = (Math.random() * 100) < personaj.critical;

    m.suparat = true;
    daiDamage(m, critic ? brut * 2 : brut, critic, acum);
    if (ab.incetineste) incetinesteMobul(m, ab, acum);
    cate++;
  });

  if (!cate) spuneCeva('Nothing in reach');
}


function teVindeci(ab) {
  const cat = Math.round((intreDoua(ab.vindecaMin, ab.vindecaMax) + sporulVrajii(ab)) *
                         inmultitorTalent(personaj, 'vindecare'));
  const inainte = personaj.viata;
  personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + cat);
  aratacifra(jucator.position.x, jucator.position.y + 2.2, jucator.position.z,
             '+' + Math.round(personaj.viata - inainte), '#8fd48a', false);
}


// ---- things that keep working after they are cast ----
//
// A wound on a monster, a slow heal on you, a strengthening that
// lasts a while. All three are kept in one list and looked at once
// a frame.
const lucruriCareTin = [];

function puneRana3d(ab, acum) {
  if (!tintaEVie()) return;

  // The spell power is worked out NOW and frozen, so taking your
  // staff off halfway through does not change a wound already made.
  const peTic = (ab.peTura || 0) + sporulRanii(ab);

  lucruriCareTin.push({
    fel: 'rana', ab: ab, pe: tinta, peTic: peTic,
    laCat: ab.laCat || 2000, urmatorul: acum + (ab.laCat || 2000),
    pana: acum + (ab.tine || 0)
  });

  tinta.suparat = true;
  cifraPeMob(tinta, ab.nume, '#e8863a', false);
}

function puneAlinarea(ab, acum) {
  // 'peAnimal' means it mends the companion, not you - and Tend
  // Companion is instant, with no ticks at all.
  if (ab.peAnimal) { vindecaAnimalul(ab); return; }

  lucruriCareTin.push({
    fel: 'alinare', ab: ab,
    peTic: (ab.peTura || 0) + sporulRanii(ab),
    laCat: ab.laCat || 3000, urmatorul: acum + (ab.laCat || 3000),
    pana: acum + (ab.tine || 0)
  });
  spuneCeva(ab.nume);
}

// A strengthening does NOT add its bonus onto the character. It
// goes on the list, and the character's numbers are worked out
// again from scratch - base, plus what you are wearing, plus
// everything on this list.
//
// It used to add straight onto the character, which is the same
// thing right up until something else works the numbers out from
// scratch. Putting on a helmet does exactly that, and it quietly
// swallowed the buff; taking the helmet off afterwards handed the
// bonus back a second time, for nothing.
function puneIntarirea(ab, acum) {
  scoateIntarirea(ab.id);      // no stacking with itself

  lucruriCareTin.push({
    fel: 'intarire', ab: ab, id: ab.id, da: ab.da || {},
    pana: acum + (ab.tine || 0), urmatorul: Infinity
  });
  recalculeazaPersonajul3d();
  spuneCeva(ab.nume);
}

function scoateIntarirea(id) {
  for (let i = lucruriCareTin.length - 1; i >= 0; i--) {
    if (lucruriCareTin[i].fel === 'intarire' && lucruriCareTin[i].id === id) {
      lucruriCareTin.splice(i, 1);
    }
  }
}

function actualizeazaLucrurileCareTin(acum) {
  for (let i = lucruriCareTin.length - 1; i >= 0; i--) {
    const l = lucruriCareTin[i];

    if (acum >= l.pana) {
      lucruriCareTin.splice(i, 1);
      // Off the list, then work the numbers out again - never by
      // subtracting, which is what drifts.
      if (l.fel === 'intarire') recalculeazaPersonajul3d();
      continue;
    }

    if (acum < l.urmatorul) continue;
    l.urmatorul = acum + l.laCat;

    if (l.fel === 'rana') {
      if (esteMort(l.pe) || l.pe.viata <= 0) { lucruriCareTin.splice(i, 1); continue; }
      daiDamage(l.pe, l.peTic, false, acum);
    } else if (l.fel === 'alinare') {
      const inainte = personaj.viata;
      personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + l.peTic);
      if (personaj.viata > inainte) {
        aratacifra(jucator.position.x, jucator.position.y + 2.2, jucator.position.z,
                   '+' + Math.round(personaj.viata - inainte), '#9ad8c8', false);
      }
    }
  }
}


// AN INTERRUPT THAT LIED.
//
// This printed "Interrupted!" over whatever you had picked, always,
// and did nothing else - because nothing in the 3D world prepares an
// attack yet. The creatures that do are the dungeon bosses, and
// their behaviour is not wired in here (see the list of what is
// missing at the end of the README). So a wolf standing there doing
// nothing was solemnly interrupted, several times a minute.
//
// Now it says what is true. And when a creature IS given something
// to prepare, this already stops it and keeps it from starting
// another special attack for four seconds - which is what the
// ability's own description has promised all along.
function intrerupeTinta(ab) {
  if (!tintaEVie()) return;

  const acum = performance.now();
  const pregateste = tinta.incantare && tinta.incantare.pana > acum;

  if (!pregateste) {
    spuneCeva(TEXT.NO_CAST_TO_STOP);
    return;
  }

  tinta.incantare = null;
  tinta.faraSpecialPanaLa = acum + (ab.tineTacerea || 4000);
  cifraPeMob(tinta, TEXT.INTERRUPTED, '#ffe184', false);
}


function incetinesteMobul(m, ab, acum) {
  m.incetinitPanaLa = acum + (ab.tineIncetinirea || 5000);
  m.catDeIncetinit = ab.incetineste;
}


// ----------------------------------------------------------
//  Doing the damage, wherever it came from
// ----------------------------------------------------------
function daiDamage(m, brut, critic, acum) {
  if (!m || m.viataMaxima === undefined || esteMort(m)) return;

  const cat = Math.max(1, Math.round(dupaArmura(brut, m.armura)));
  m.viata = Math.max(0, m.viata - cat);
  m.suparat = true;

  cifraPeMob(m, String(cat), critic ? '#ffd34d' : '#ffe9c8', critic);

  const grup = fapturiDeFata.get(m);
  if (grup && grup.baraLui) potrivesteBara(grup.baraLui, m.viata / m.viataMaxima);

  if (m.viata <= 0) moareMobul(m, acum);
}

function cifraPeMob(m, text, culoare, mare) {
  const p = pozitiaFapturii(m);
  const grup = fapturiDeFata.get(m);
  const sus = inaltimeaSolului(Math.round(p.x), Math.round(p.z)) +
              ((grup && grup.inaltimeaLui) ? grup.inaltimeaLui * 0.7 : 1.2);
  aratacifra(p.x, sus, p.z, text, culoare, mare);
}


// ----------------------------------------------------------
//  Rage and mana
//
//  The two work in opposite directions, and both numbers come from
//  personaj.js, not from here. Mana starts full and is spent; rage
//  starts empty, fills by hitting and being hit, and drains away
//  once you are out of a fight.
// ----------------------------------------------------------
const RAGE_MAXIM        = 100;
const RAGE_PE_LOVITURA  = 12;
const RAGE_LA_INCASARE  = 6;
const RAGE_SCURS_PE_SEC = 25;

// THE EXACT MISTAKE THE NAME AT THE TOP OF THIS FILE WAS MEANT TO
// PREVENT, made again on this one line: it said 'rage', and the
// warrior's resource is written 'furie'. The comparison never
// matched, so this function returned on its first line every single
// time and NO RAGE WAS EVER GAINED, from a blow landed or a blow
// taken. The bar sat at zero for ever and every warrior ability was
// unaffordable.
//
// It survived because everything around it looked right: the bar was
// drawn, rage drained correctly out of combat, the costs were
// deducted correctly - all of that used the name. Only the one place
// that PUTS rage in used the English word.
function castigaRage(cat) {
  if (personaj.resursa !== RESURSA_FURIE) return;
  personaj.rage = Math.min(RAGE_MAXIM, (personaj.rage || 0) + cat);
}

function actualizeazaResursa3d(delta, inLupta) {
  if (!personaj) return;

  if (personaj.resursa === RESURSA_FURIE) {
    if (!inLupta) {
      personaj.rage = Math.max(0, (personaj.rage || 0) - RAGE_SCURS_PE_SEC * delta);
    }
  } else if (personaj.manaMaxima) {
    // Out of a fight your mana comes back at Spirit divided by five,
    // per second - the same rule the 2D game uses.
    if (!inLupta && personaj.mana < personaj.manaMaxima) {
      personaj.mana = Math.min(personaj.manaMaxima,
        (personaj.mana || 0) + (personaj.atribute.spi / 5) * delta *
        inmultitorTalent(personaj, 'regen'));
    }
  }
}


// Everything above, once a frame. Called from lupta3d.js.
function actualizeazaAbilitatile(delta, acum, inLupta) {
  if (typeof actualizeazaPrada === "function") actualizeazaPrada(acum);
  actualizeazaIncantarea(acum);
  actualizeazaLucrurileCareTin(acum);
  actualizeazaCapcanele(acum);
  if (typeof actualizeazaAnimalul === 'function') actualizeazaAnimalul(delta, acum);
  if (typeof actualizeazaNodurile === 'function') actualizeazaNodurile(acum);
  if (typeof actualizeazaCulesul === 'function') actualizeazaCulesul(acum);
  if (typeof actualizeazaDrumurile === 'function') actualizeazaDrumurile();
  actualizeazaResursa3d(delta, inLupta);
  actualizeazaInterfata(acum);
}


// Leaving a zone: nothing carries over except what you are wearing.
function uitaAbilitatile() {
  incantareaInCurs = null;
  scutulTau = 0;
  scutulPanaLa = 0;
  teFaciMortPanaLa = 0;
  uitaCapcanele();
  lucruriCareTin.length = 0;
  if (personaj) recalculeazaPersonajul3d();
}
