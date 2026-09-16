// ==========================================================
//  THE HUNTER'S COMPANION
//
//  You tame a beast off the map, you call it, it walks behind you,
//  and it fights what you fight. If it dies you can rouse it.
//
//  What it is made of is not invented here either: a tamed beast IS
//  the beast you tamed - the same entry in mobi.js, the same list of
//  coloured rectangles, so a tamed wolf looks exactly like a wild
//  one. Its health and damage come from statsleAnimalului() in
//  mobi.js, and how much harder it hits when it is content comes
//  from sporulFericirii(), next to it.
//
//  It is kept on personaj.animal, so it is part of the character and
//  is saved with them - not part of the zone.
// ==========================================================


const DISTANTA_URMARII = 2.6;    // how close behind you it walks
const VITEZA_ANIMALULUI = 5.2;   // tiles a second - a little faster than you,
                                 // so it can catch up after a corner
const RAZA_LUPTEI_LUI = 2.0;

let animalulDesenat = null;      // its boxes, while it is out


// ----------------------------------------------------------
//  Taming
// ----------------------------------------------------------
function imblanzesteFiara(ab) {

  if (personaj.idClasa !== 'hunter') return;

  if (!tintaEVie()) { spuneCeva(TEXT.SELECT_TARGET || 'Select an enemy first'); return; }

  const m = tinta;
  const fel = MOBI[m.fel] || {};

  if (fel.neam !== 'fiara') { spuneCeva(TEXT.NOT_A_BEAST || 'That is not a beast'); return; }
  if (m.nivel > personaj.nivel) { spuneCeva(TEXT.BEAST_TOO_STRONG || 'Too strong to tame'); return; }

  const st = statsleAnimalului(m.fel, m.nivel);
  personaj.animal = {
    fel: m.fel,
    nume: fel.nume,
    nivel: m.nivel,
    viata: st.viataMaxima,
    viataMaxima: st.viataMaxima,
    fericire: 100,
    chemat: true
  };

  // The beast you tamed leaves the map: it is yours now, and there
  // must not be two of it.
  m.mortPanaLa = performance.now() + REVINE_DUPA;
  uitaFaptura(m);
  alegeTinta(null);

  scoateAnimalul();
  spuneCeva((TEXT.TAMED || 'Tamed {p}').replace('{p}', personaj.animal.nume));
}


function cheamaAnimalul(ab) {
  const a = personaj.animal;
  if (!a) { spuneCeva(TEXT.NO_PET || 'You have no companion'); return; }
  if (a.viata <= 0) { spuneCeva(TEXT.PET_DEAD || 'Your companion is down'); return; }
  a.chemat = true;
  scoateAnimalul();
  spuneCeva(a.nume);
}


function invieAnimalul(ab) {
  const a = personaj.animal;
  if (!a) { spuneCeva(TEXT.NO_PET || 'You have no companion'); return; }
  if (a.viata > 0) { spuneCeva(TEXT.PET_ALIVE || 'It is already up'); return; }
  a.viata = Math.round(a.viataMaxima * 0.5);
  a.chemat = true;
  scoateAnimalul();
  spuneCeva(a.nume);
}


function vindecaAnimalul(ab) {
  const a = personaj.animal;
  if (!a || a.viata <= 0) { spuneCeva(TEXT.NO_PET || 'You have no companion'); return; }
  const inainte = a.viata;
  a.viata = Math.min(a.viataMaxima, a.viata + (ab.peTura || 0) + sporulVrajii(ab));
  a.fericire = Math.min(100, (a.fericire || 0) + 10);
  if (animalulDesenat) {
    aratacifra(animalulDesenat.position.x, animalulDesenat.position.y + 1.2,
               animalulDesenat.position.z,
               '+' + Math.round(a.viata - inainte), '#9ad8c8', false);
  }
}


// ----------------------------------------------------------
//  Its body
// ----------------------------------------------------------
function scoateAnimalul() {
  ascundeAnimalul();

  const a = personaj && personaj.animal;
  if (!a || !a.chemat || a.viata <= 0 || !zona) return;

  const d = MOBI[a.fel];
  if (!d || !d.forme) return;

  const grup = sablonulFapturii(MOBI, a.fel).clone();
  grup.inaltimeaLui = inaltimeaFapturii(grup);

  grup.position.set(jucator.position.x, jucator.position.y, jucator.position.z + 1.5);
  grup.baraLui = faBaraDeViata(grup.inaltimeaLui + 0.22);
  grup.add(grup.baraLui);
  grup.numeleScris = faEticheta(a.nume, '#a8d98a', grup.inaltimeaLui + 0.5);
  grup.add(grup.numeleScris);

  // Marked so amenintare.js knows what it is looking at: a companion
  // builds 1.3x the tally from the same bite, which is what lets it
  // hold something off you at all.
  grup.rol = 'animal';

  lumea.add(grup);
  animalulDesenat = grup;
}

function ascundeAnimalul() {
  if (!animalulDesenat) return;
  lumea.remove(animalulDesenat);
  animalulDesenat = null;
}

function uitaAnimalul() {
  ascundeAnimalul();
}


// ----------------------------------------------------------
//  Once a frame: walking behind you, and fighting
// ----------------------------------------------------------
function actualizeazaAnimalul(delta, acum) {

  const a = personaj && personaj.animal;

  if (!a || !a.chemat || a.viata <= 0) { ascundeAnimalul(); return; }
  if (!animalulDesenat) { scoateAnimalul(); if (!animalulDesenat) return; }

  const g = animalulDesenat;

  // Who it is going for: whatever you have picked, if it is close
  // enough to be worth walking to.
  let spre = null;
  if (tintaEVie()) {
    const p = pozitiaFapturii(tinta);
    if (Math.hypot(p.x - jucator.position.x, p.z - jucator.position.z) <= 18) spre = p;
  }

  const tintaX = spre ? spre.x : jucator.position.x;
  const tintaZ = spre ? spre.z : jucator.position.z;
  const opreste = spre ? RAZA_LUPTEI_LUI : DISTANTA_URMARII;

  const dx = tintaX - g.position.x, dz = tintaZ - g.position.z;
  const cat = Math.hypot(dx, dz);

  if (cat > opreste) {
    const pas = Math.min(cat - opreste, VITEZA_ANIMALULUI * delta);
    const nx = g.position.x + (dx / cat) * pas;
    const nz = g.position.z + (dz / cat) * pas;
    if (!esteBlocat(Math.round(nx), Math.round(g.position.z))) g.position.x = nx;
    if (!esteBlocat(Math.round(g.position.x), Math.round(nz))) g.position.z = nz;
  }

  // A companion that falls too far behind - through a wall, or
  // because you rode off - is simply put at your heel again.
  if (Math.hypot(g.position.x - jucator.position.x, g.position.z - jucator.position.z) > 30) {
    g.position.set(jucator.position.x, jucator.position.y, jucator.position.z + 1.5);
  }

  g.position.y = inaltimeaSolului(Math.round(g.position.x), Math.round(g.position.z));
  g.rotation.y = Math.atan2(tintaX - g.position.x, tintaZ - g.position.z);

  // Biting.
  if (spre && cat <= RAZA_LUPTEI_LUI + 0.4) {
    if (!a.urmatoareaLovitura || acum >= a.urmatoareaLovitura) {
      a.urmatoareaLovitura = acum + 2000;
      musca(a, acum);
    }
  }

  // Its bar and its name, held steady on screen like everyone's.
  potrivesteBara(g.baraLui, a.viata / a.viataMaxima);
  indreaptaBara(g.baraLui, g.rotation.y);
  const f = marimePeEcran(g.baraLui);
  g.baraLui.scale.set(f, f, 1);
  const fn = marimePeEcran(g.numeleScris);
  g.numeleScris.scale.set(g.numeleScris.latBaza * fn, g.numeleScris.inaltBaza * fn, 1);
}

function musca(a, acum) {
  if (!tintaEVie()) return;

  const st = statsleAnimalului(a.fel, a.nivel);
  let brut = intreDoua(st.dmgMin, st.dmgMax) * sporulFericirii(a);

  daiDamage(tinta, brut, false, acum);
}


// What hits you can also hit it: the monster spreads its attention.
function loveaAnimalul(m, cat) {
  const a = personaj && personaj.animal;
  if (!a || !a.chemat || a.viata <= 0) return false;
  a.viata = Math.max(0, a.viata - cat);
  if (a.viata <= 0) {
    a.chemat = false;
    ascundeAnimalul();
    spuneCeva((TEXT.PET_DIED || '{p} is down').replace('{p}', a.nume));
  }
  return true;
}
