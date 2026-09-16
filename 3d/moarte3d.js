// ==========================================================
//  DYING PROPERLY
//
//  Until now: you fell over, waited four seconds, and stood up at
//  the camp with full health. You lost nothing. And if dying costs
//  nothing, then not dying is worth nothing either - which quietly
//  takes the point out of every fight in the game.
//
//  Now it is what the 2D game already does, and what Classic does:
//
//    - you die, and your BODY stays exactly where you fell
//    - your gear takes ten per cent damage, on everything you wear.
//      That is the half of the price that costs money.
//    - you get up as a SPIRIT at the zone's stone: see-through,
//      faster on your feet, and nothing in the world can see you
//    - walk back to your body and you rise there, at a third of your
//      health, with nothing else held against you
//    - or GIVE UP the walk and rise where you stand - but weak:
//      half of everything, for two minutes
//
//  So you are never stuck, because giving up is always there - but
//  dying costs you either the walk or two minutes of being no use.
//
//  Nothing here invents a number. TIMP_REINVIERE, RAU_DE_INVIERE and
//  CAT_SLABESTE are the 2D game's own, and the wear on your gear is
//  tocesteTotLaMoarte() out of obiecte.js.
// ==========================================================


const CAT_ZACI          = 3500;     // cat stai jos inainte sa te faci duh
const RAU_DE_INVIERE_3D = 120000;   // doua minute de slabiciune
const CAT_SLABESTE_3D   = 0.5;      // la jumatate din tot
const CAT_VIATA_LA_RIDICARE = 0.3;  // cu cata viata te ridici
const LANGA_TRUP        = 2.2;      // de la cat de aproape te poti ridica
const VITEZA_DUHULUI    = 1.6;      // de cate ori mergi mai repede ca duh


let trupulTau = null;          // { x, z, zona } - unde ai cazut
let semnulTrupului = null;     // crucea desenata pe jos
let rauDeInvierePanaLa3d = 0;
let cutiaMortii = null;


function estiDuh() {
  return !!trupulTau;
}

// Cat de slab esti acum. 1 inseamna deloc. Citita de
// recalculeazaPersonajul3d().
function slabiciuneaDeInviere3d() {
  return (performance.now() < rauDeInvierePanaLa3d) ? CAT_SLABESTE_3D : 1;
}


// ----------------------------------------------------------
//  Cazi
// ----------------------------------------------------------
function cazi3d() {

  // Zece la suta pe tot ce porti. Regula e in obiecte.js, aceeasi pe
  // care o foloseste si jocul 2D.
  if (typeof tocesteTotLaMoarte === 'function' && tocesteTotLaMoarte(personaj)) {
    spuneCeva(TEXT.BROKEN);
  }
  recalculeazaPersonajul3d();

  trupulTau = { x: jucator.position.x, z: jucator.position.z, zona: zona.id };
  faSemnulTrupului();
}


function faSemnulTrupului() {
  stergeSemnulTrupului();
  if (!trupulTau) return;

  // O cruce joasa, din doua scanduri, si un inel de lumina in jur ca
  // s-o vezi de departe prin iarba.
  const grup = new THREE.Group();
  const lemn = new THREE.MeshLambertMaterial({ color: 0x6b5336 });
  const stalp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), lemn);
  stalp.position.y = 0.55;
  const brat = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.12, 0.12), lemn);
  brat.position.y = 0.82;
  grup.add(stalp); grup.add(brat);

  const inel = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.85, 20),
    new THREE.MeshBasicMaterial({ color: 0xa8d8f0, transparent: true, opacity: 0.32,
                                  side: THREE.DoubleSide })
  );
  inel.rotation.x = -Math.PI / 2;
  inel.position.y = 0.04;
  grup.add(inel);

  grup.position.set(trupulTau.x,
                    inaltimeaSolului(Math.round(trupulTau.x), Math.round(trupulTau.z)),
                    trupulTau.z);
  grup.add(faEticheta(TEXT.YOUR_BODY, '#a8d8f0', 1.35));

  lumea.add(grup);
  semnulTrupului = grup;
}

function stergeSemnulTrupului() {
  if (!semnulTrupului) return;
  lumea.remove(semnulTrupului);
  semnulTrupului = null;
}


// ----------------------------------------------------------
//  Te faci duh
//
//  Chemata de lupta3d.js cand se termina cele trei secunde si
//  jumatate de stat jos.
// ----------------------------------------------------------
function teFaciDuh() {
  if (!trupulTau) return;

  const unde = zona.reinviere || zona.start;
  jucator.position.set(unde.col, inaltimeaSolului(unde.col, unde.rand), unde.rand);
  construiesteLumea(unde.col, unde.rand);
  actualizeazaFapturile();

  // See-through, si nu ii mai da nimeni atentie.
  faTransparent(true);
  spuneCeva(TEXT.YOU_ARE_SPIRIT);
  araTaCutiaMortii();
}


// Tot ce e din tine devine sticlos, sau se face la loc.
function faTransparent(da) {
  jucator.traverse(function (o) {
    if (!o.material || o.isSprite) return;
    o.material.transparent = da;
    o.material.opacity = da ? 0.42 : 1;
    o.material.depthWrite = !da;
  });
}


// ----------------------------------------------------------
//  Te ridici
// ----------------------------------------------------------
function teRidiciLaTrup3d() {
  if (!trupulTau) return;
  jucator.position.set(trupulTau.x,
                       inaltimeaSolului(Math.round(trupulTau.x), Math.round(trupulTau.z)),
                       trupulTau.z);
  teRidici(TEXT.BACK_UP, '#8fd08f');
}


function renuntiLaTrup3d() {
  if (!trupulTau) return;
  rauDeInvierePanaLa3d = performance.now() + RAU_DE_INVIERE_3D;
  teRidici(TEXT.RES_SICKNESS, '#c94a3a');
}


function teRidici(ce, culoare) {
  trupulTau = null;
  stergeSemnulTrupului();
  ascundeCutiaMortii();
  faTransparent(false);

  personaj.viata = Math.max(1, Math.round(personaj.viataMaxima * CAT_VIATA_LA_RIDICARE));
  if (personaj.resursa === RESURSA_MANA) {
    personaj.mana = Math.round(personaj.manaMaxima * CAT_VIATA_LA_RIDICARE);
  } else {
    personaj.rage = 0;
  }
  recalculeazaPersonajul3d();

  construiesteLumea(Math.round(jucator.position.x), Math.round(jucator.position.z));
  actualizeazaFapturile();
  aratacifra(jucator.position.x, jucator.position.y + 2.4, jucator.position.z,
             ce, culoare, true);
}


// ----------------------------------------------------------
//  Cutia de pe ecran, cat esti duh
// ----------------------------------------------------------
function faCutiaMortii() {
  const el = document.createElement('div');
  el.id = 'cutia-mortii';
  el.className = 'ascuns';
  el.innerHTML =
    '<div class="titlu-mortii">' + TEXT.YOU_DIED + '</div>' +
    '<div class="scrisul-mortii" id="cat-pana-la-trup">' + TEXT.WALK_BACK + '</div>' +
    '<button id="renunt-la-trup">' + TEXT.GIVE_UP + '</button>' +
    '<div class="nota-mortii">' + TEXT.GIVE_UP_NOTE + '</div>';
  document.body.appendChild(el);
  cutiaMortii = el;
  document.getElementById('renunt-la-trup')
          .addEventListener('click', renuntiLaTrup3d);
}

function araTaCutiaMortii() {
  if (!cutiaMortii) faCutiaMortii();
  cutiaMortii.classList.remove('ascuns');
}

function ascundeCutiaMortii() {
  if (cutiaMortii) cutiaMortii.classList.add('ascuns');
}


// ----------------------------------------------------------
//  O data pe cadru, cat esti duh
// ----------------------------------------------------------
function actualizeazaMoartea3d() {
  if (!estiDuh()) return;

  // In alta zona nu-ti mai gasesti trupul: nu te lasam sa ratacesti.
  if (trupulTau.zona !== zona.id) { renuntiLaTrup3d(); return; }

  const cat = Math.hypot(trupulTau.x - jucator.position.x,
                         trupulTau.z - jucator.position.z);

  const scris = document.getElementById('cat-pana-la-trup');
  if (scris) scris.textContent = TEXT.UI_STEPS.replace('{n}', Math.round(cat));

  if (cat <= LANGA_TRUP) teRidiciLaTrup3d();
}
