// ==========================================================
//  THINGS THAT MOVE
//
//  Until now everything in this world slid about like a chess piece:
//  you glided, wolves glided, and a wolf that died simply stopped
//  being there between one moment and the next. Nothing ever looked
//  like it had any weight.
//
//  This file gives everything a body that answers:
//
//    walking     arms and legs swing, and you bob as you step
//    standing    you breathe, and so does everything else
//    jumping     legs tuck up, and you tip forward as you go
//    swinging    the sword arm comes over and back, every blow
//    being hit   you flinch backwards; a wolf jerks and flashes red
//    striking    a wolf lunges at you as it bites
//    dying       creatures fall over sideways and sink away
//    sitting     press X
//
//  It is all turning and moving boxes that are already there. There
//  is no animation file, no model and no motion capture - nothing
//  could be taken from anywhere, because there is nothing here but
//  sums over the shapes this game already draws.
//
//  THE ONE IDEA WORTH KEEPING: the phase of a walk is driven by HOW
//  FAR YOU HAVE WALKED, not by the clock. Step length then stays the
//  same whether you are on foot or on a horse at 1.6x, so the feet
//  never skate. Driving it from the clock is what makes characters
//  in cheap games look like they are on a conveyor belt.
// ==========================================================


// ----------------------------------------------------------
//  How big each movement is
// ----------------------------------------------------------
const PASUL_PE_CASUTA   = 2.1;    // radians of leg swing per tile walked
const CAT_RIDICI_PICIOR = 0.55;   // radians, at the top of a stride
const CAT_LEGENI_BRATUL = 0.42;
const CAT_TE_LEGENI     = 0.045;  // tiles: up and down as you step
const CAT_RESPIRI       = 0.012;

const LOVITURA_TINE     = 320;    // milliseconds of a sword swing
const TRESARIREA_TINE   = 220;    // milliseconds of a flinch
const CADEREA_TINE      = 900;    // milliseconds of falling over

let fazaPasului = 0;          // how far through a stride we are
let undeEraiInainte = null;   // to measure how far you moved this frame
let amLovitLa = 0;            // when your last swing started
let amFostLovitLa = 0;        // when you were last hit
let stauJos = false;
let catStauJos = 0;           // 0 standing, 1 fully sat down


// ----------------------------------------------------------
//  Sitting down
//
//  It does nothing at all, and that is exactly why it belongs in a
//  world rather than in a game. You sit down by a fire because you
//  feel like sitting down by a fire.
// ----------------------------------------------------------
function comutaStatul() {
  if (typeof mortPanaLa !== 'undefined' && mortPanaLa) return;
  stauJos = !stauJos;
}

function ridicaTe() {
  stauJos = false;
}


// Called from lupta3d.js the moment a blow of yours lands, and the
// moment one lands on you.
function aiLovit()      { amLovitLa = performance.now(); }
function aiFostLovit()  { amFostLovitLa = performance.now(); }


// A number that rises to 1 and falls back to 0 over a stretch of
// time. Every one-off movement here is built out of it: the swing,
// the flinch, the lunge.
function unVarf(acum, cand, cat) {
  if (!cand) return 0;
  const t = (acum - cand) / cat;
  if (t < 0 || t > 1) return 0;
  return Math.sin(t * Math.PI);
}


// ==========================================================
//  YOU
// ==========================================================
function miscaJucatorul(delta, acum) {
  const p = jucator.parti;
  if (!p) return;

  // ---- how far you actually moved along the ground ----
  const aici = { x: jucator.position.x, z: jucator.position.z };
  let catAiMers = 0;
  if (undeEraiInainte) {
    catAiMers = Math.hypot(aici.x - undeEraiInainte.x, aici.z - undeEraiInainte.z);
  }
  undeEraiInainte = aici;

  // You stand up the moment you move, without having to press X.
  if (stauJos && catAiMers > 0.001) stauJos = false;
  catStauJos += ((stauJos ? 1 : 0) - catStauJos) * Math.min(1, delta * 9);

  // ---- dead: fall over and stay there ----
  if (typeof mortPanaLa !== 'undefined' && mortPanaLa) {
    p.corpul.rotation.x += (-Math.PI / 2 - p.corpul.rotation.x) * Math.min(1, delta * 6);
    p.corpul.position.y += (-0.55 - p.corpul.position.y) * Math.min(1, delta * 6);
    return;
  }

  // ---- the stride ----
  fazaPasului += catAiMers * PASUL_PE_CASUTA;
  const merge = catAiMers > 0.0015;

  // Stopping unwinds the stride to the nearest standstill rather
  // than freezing mid-step with one leg out in front.
  if (!merge) {
    const spre = Math.round(fazaPasului / Math.PI) * Math.PI;
    fazaPasului += (spre - fazaPasului) * Math.min(1, delta * 10);
  }

  const leagan = Math.sin(fazaPasului);

  const inZbor = (typeof inAer !== 'undefined' && inAer);
  const deasupraSolului = Math.max(0, jucator.position.y -
    inaltimeaSolului(Math.round(aici.x), Math.round(aici.z)));

  if (inZbor) {
    // Legs tuck up together; how far depends on how high you are.
    const tras = Math.min(1, deasupraSolului * 1.6);
    p.soldStang.rotation.x = -0.9 * tras;
    p.soldDrept.rotation.x = -0.5 * tras;
    p.umarStang.rotation.x =  0.6 * tras;
    p.umarDrept.rotation.x = -0.3 * tras;
  } else if (catStauJos > 0.02) {
    // Sitting: knees up in front, arms back.
    p.soldStang.rotation.x = -1.35 * catStauJos;
    p.soldDrept.rotation.x = -1.35 * catStauJos;
    p.umarStang.rotation.x =  0.55 * catStauJos;
    p.umarDrept.rotation.x =  0.55 * catStauJos;
  } else {
    p.soldStang.rotation.x =  leagan * CAT_RIDICI_PICIOR;
    p.soldDrept.rotation.x = -leagan * CAT_RIDICI_PICIOR;
    // An arm swings opposite the leg on its own side, as it does.
    p.umarStang.rotation.x = -leagan * CAT_LEGENI_BRATUL;
    p.umarDrept.rotation.x =  leagan * CAT_LEGENI_BRATUL;
  }

  // ---- the sword arm ----
  //
  // Added ON TOP of the walk, not instead of it, so you can swing
  // while walking and the arm does both at once.
  const lovind = unVarf(acum, amLovitLa, LOVITURA_TINE);
  if (lovind > 0) {
    p.umarDrept.rotation.x -= lovind * 2.2;
    p.umarDrept.rotation.z = -lovind * 0.7;
  } else {
    p.umarDrept.rotation.z += (0 - p.umarDrept.rotation.z) * Math.min(1, delta * 10);
  }
  p.corpul.rotation.y = lovind * 0.28;

  // ---- up, down, and the shove of being hit ----
  const tresarind = unVarf(acum, amFostLovitLa, TRESARIREA_TINE);

  // Two bobs to a stride, because both feet come down. Plus a slow
  // breath when you are still, so you are never quite a statue.
  const legan = merge ? Math.abs(Math.cos(fazaPasului)) * CAT_TE_LEGENI : 0;
  const respiratie = Math.sin(acum / 900) * CAT_RESPIRI;

  p.corpul.position.y = -legan - catStauJos * 0.42 + respiratie - tresarind * 0.04;
  p.corpul.position.z = -tresarind * 0.14;

  // A slight lean forward while walking, tipped further in a jump,
  // and back on your heels when something lands on you.
  p.corpul.rotation.x = (merge ? 0.07 : 0) + (inZbor ? 0.12 : 0) - tresarind * 0.25;
}


// ==========================================================
//  EVERYTHING ELSE THAT IS ALIVE
//
//  Wolves and townspeople are built out of the flat rectangles in
//  mobi.js and npc.js, and there is no way to tell which rectangle
//  is a leg. So they get no stride. They get WEIGHT instead: a body
//  that rises and falls as it moves, rolls from side to side,
//  lunges when it strikes, jerks back when it is struck, and falls
//  over when it dies.
//
//  That reads as walking, because it is what the eye is watching
//  for - not knees, but a body going up and down in time with
//  itself.
//
//  EVERYTHING HERE IS SET, NEVER ADDED TO. lupta3d.js has already
//  put each creature where it belongs this frame; the animation is
//  an offset from that, worked out fresh every time. Adding to the
//  position instead would have been fine for monsters, whose
//  position is written again each frame - and would have sent the
//  townspeople slowly drifting up into the sky, because nothing
//  ever writes theirs again.
// ==========================================================
const CAT_SALTA_FAPTURA = 0.055;
const ROSU_LOVIT = new THREE.Color(0xff5b46);


// A creature's colours are shared with every other creature of its
// kind - a hundred wolves are one set of colours, which is what
// makes a hundred wolves cheap to keep. So turning one red would
// turn all of them red.
//
// The first time a particular creature is actually hit, and only
// then, it is given colours of its own. Fight three wolves out of a
// hundred and three wolves pay for it.
function daiCuloriAleLui(grup) {
  if (grup.areCulorileLui) return;
  grup.areCulorileLui = true;
  grup.culorileDeBaza = [];
  grup.traverse(function (o) {
    if (!o.material || !o.material.color || o.isSprite) return;
    o.material = o.material.clone();
    grup.culorileDeBaza.push({ material: o.material, culoare: o.material.color.clone() });
  });
}


// Called from lupta3d.js when a creature takes a blow, and when one
// swings at you.
function fapturaAFostLovita(m) {
  const grup = fapturiDeFata.get(m);
  if (!grup) return;
  daiCuloriAleLui(grup);
  grup.lovitaLa = performance.now();
}

function fapturaLoveste(m) {
  const grup = fapturiDeFata.get(m);
  if (grup) grup.aLovitLa = performance.now();
}


function miscaFaptura(grup, m, acum) {

  // Where it would stand with no animation at all. For a monster
  // that is wherever it has walked to; for a townsperson it is
  // where they have always been.
  if (!grup.baza) {
    grup.baza = { x: grup.position.x, y: grup.position.y, z: grup.position.z };
  }

  const mort = m && esteMort(m);

  if (m && !mort) {
    const p = pozitiaFapturii(m);
    grup.baza.x = p.x;
    grup.baza.z = p.z;
    grup.baza.y = inaltimeaSolului(Math.round(p.x), Math.round(p.z));
  }

  // ---- dead: over it goes, and down into the ground ----
  if (mort) {
    // Its name and its health bar do not fall over with it.
    if (grup.baraLui) grup.baraLui.visible = false;
    if (grup.numeleScris) grup.numeleScris.visible = false;

    const t = Math.min(1, (acum - (m.mortPanaLa - REVINE_DUPA)) / CADEREA_TINE);
    const usurat = 1 - Math.pow(1 - t, 3);          // fast at first, then settling
    grup.rotation.x = 0;
    grup.rotation.z = usurat * Math.PI / 2;
    grup.position.set(grup.baza.x, grup.baza.y - usurat * 0.22, grup.baza.z);
    return;
  }

  // ---- how far it moved, for the bob ----
  let cat = 0;
  if (grup.undeEra) {
    cat = Math.hypot(grup.baza.x - grup.undeEra.x, grup.baza.z - grup.undeEra.z);
  }
  grup.undeEra = { x: grup.baza.x, z: grup.baza.z };

  grup.faza = (grup.faza || 0) + cat * 3.4;
  const merge = cat > 0.002;

  const salt = merge ? Math.abs(Math.sin(grup.faza)) * CAT_SALTA_FAPTURA : 0;
  const clatinare = merge ? Math.sin(grup.faza) * 0.06 : 0;

  // A slow breath standing still. Its own place in the world seeds
  // the timing, so a row of them is not one row breathing in unison.
  const alLui = (grup.baza.x * 13 + grup.baza.z * 7) % 6.283;
  const respira = merge ? 0 : Math.sin(acum / 1100 + alLui) * 0.012;

  const lovind = unVarf(acum, grup.aLovitLa, 260);
  const tresarind = unVarf(acum, grup.lovitaLa, TRESARIREA_TINE);

  // The lunge goes along the way it is facing.
  const inainte = lovind * 0.28;
  grup.position.set(
    grup.baza.x + Math.sin(grup.rotation.y) * inainte,
    grup.baza.y + salt + respira - tresarind * 0.05,
    grup.baza.z + Math.cos(grup.rotation.y) * inainte
  );
  grup.rotation.z = clatinare - tresarind * 0.12;
  grup.rotation.x = lovind * 0.30 - tresarind * 0.22;

  // ---- the red flash of a blow landing ----
  if (grup.culorileDeBaza) {
    grup.culorileDeBaza.forEach(function (c) {
      c.material.color.copy(c.culoare).lerp(ROSU_LOVIT, tresarind * 0.75);
    });
  }
}


function actualizeazaAnimatiile(delta, acum) {
  if (!zona || !personaj) return;

  miscaJucatorul(delta, acum);

  fapturiDeFata.forEach(function (grup, intrare) {
    const eMob = (zona.mobi || []).indexOf(intrare) >= 0;
    miscaFaptura(grup, eMob ? intrare : null, acum);
  });
}
