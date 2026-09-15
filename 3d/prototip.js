// ==========================================================
//  3D PROTOTYPE
//
//  This is not the game. It is one question, asked as cheaply as
//  possible: does walking around this world in 3D feel good?
//
//  There is no combat, no menus, no inventory, no saving. There is
//  a zone, a character, and a camera behind their shoulder.
//
//  What matters is where the world comes from. Nothing here is
//  hand-drawn. The page loads the SAME zone files the 2D game
//  loads, calls the SAME faZona() with the SAME seed, and gets back
//  the same grid of letters - '.' is ground, 'T' is thick forest,
//  'W' is water, 'X' is the wall at the edge of the zone. Each
//  letter already carries its colour and whether you can walk on
//  it, in zone/climat.js. So the 3D world is the 2D world seen
//  from a different angle, not a copy of it.
//
//  That is the thing worth finding out before rebuilding 8000
//  lines: the data layer really does survive.
// ==========================================================


// ----------------------------------------------------------
//  How tall each kind of tile stands
//
//  A tile is 1 unit wide, and the character is about 1.7 units
//  tall - so these numbers read like metres. Anything not in this
//  list is flat ground.
// ----------------------------------------------------------
const INALTIMI = {
  T: 2.6,    // thick forest
  s: 0.9,    // low scrub
  r: 1.5,    // rock
  X: 3.4,    // the wall around the edge of the zone
  R: 2.9,    // roof
  H: 2.1,    // house wall
  S: 1.1,    // standing stone
  w: 1.9,    // palisade
  A: 1.7,    // tent
  F: 0.5,    // fire
  N: 0.9,    // anvil
  U: 0.9     // rune table
};

// Ground that is not flat: hills stand a little proud, water and
// pits sink a little. Small numbers on purpose - the 2D game has
// no heights at all, so anything bigger would be invented.
const ADANCIMI = { h: 0.35, W: -0.30, m: -0.10, c: -0.45, P: 0.02, B: 0.06 };

const GROSIME_PODEA = 0.5;      // how thick the ground slab is

// How far around you the world is actually built. Beyond this
// there is fog, and the world is built again as you walk.
const RAZA_LUMII = 90;          // in tiles
const PAS_RECONSTRUIRE = 22;    // rebuild after you walk this far

const VITEZA = 6.5;             // tiles per second
const RAZA_JUCATOR = 0.32;      // how wide you are, for bumping into things


// ----------------------------------------------------------
//  Setting up the picture
// ----------------------------------------------------------
const scena = new THREE.Scene();
scena.background = new THREE.Color(0x8fb6d8);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);

const randator = new THREE.WebGLRenderer({ antialias: true });
randator.setPixelRatio(Math.min(window.devicePixelRatio, 2));
randator.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(randator.domElement);

// Flat colours, no photographs: one soft light from above and one
// strong light from the side, so a box has a lit face and a dark
// face and you can tell which way it is turned.
const luminaDeSus = new THREE.HemisphereLight(0xcfe3f5, 0x3b4a30, 0.95);
scena.add(luminaDeSus);
const soare = new THREE.DirectionalLight(0xfff0d0, 0.85);
soare.position.set(-40, 70, 30);
scena.add(soare);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  randator.setSize(window.innerWidth, window.innerHeight);
});


// ----------------------------------------------------------
//  The character
//
//  Boxes, on purpose. The 2D character is a stack of coloured
//  rectangles; this is the same stack, given a third dimension.
// ----------------------------------------------------------
function faJucator() {
  const grup = new THREE.Group();

  function cub(lat, inalt, adanc, culoare, x, y, z) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(lat, inalt, adanc),
      new THREE.MeshLambertMaterial({ color: culoare })
    );
    m.position.set(x, y, z);
    grup.add(m);
    return m;
  }

  cub(0.52, 0.60, 0.34, 0x7d2f2f, 0, 1.12, 0);      // chest
  cub(0.30, 0.46, 0.26, 0x3a3f52, -0.13, 0.55, 0);  // left leg
  cub(0.30, 0.46, 0.26, 0x3a3f52,  0.13, 0.55, 0);  // right leg
  cub(0.16, 0.44, 0.16, 0x7d2f2f, -0.34, 1.10, 0);  // left arm
  cub(0.16, 0.44, 0.16, 0x7d2f2f,  0.34, 1.10, 0);  // right arm
  cub(0.34, 0.32, 0.30, 0xe0b48a, 0, 1.58, 0);      // head
  cub(0.36, 0.14, 0.32, 0x4a3524, 0, 1.72, 0);      // hair

  // A blade, so you can tell which way they are facing from behind.
  const sabie = cub(0.07, 0.80, 0.07, 0xb9c2cc, 0.42, 1.15, 0.10);
  sabie.rotation.x = 0.35;

  return grup;
}

const jucator = faJucator();
scena.add(jucator);


// ----------------------------------------------------------
//  The world, built out of two piles of boxes
//
//  Drawing 290.000 separate boxes would bring any computer to its
//  knees. Three.js has a trick for exactly this - "instancing":
//  one box shape, drawn thousands of times in one go, each copy
//  with its own place and its own colour. The whole zone becomes
//  two draw calls instead of three hundred thousand.
// ----------------------------------------------------------
const MAX_CUTII = (RAZA_LUMII * 2 + 1) * (RAZA_LUMII * 2 + 1);

function faGramada(geometrie) {
  const g = new THREE.InstancedMesh(
    geometrie,
    new THREE.MeshLambertMaterial({ vertexColors: false }),
    MAX_CUTII
  );
  g.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_CUTII * 3), 3);
  g.count = 0;
  g.frustumCulled = false;
  scena.add(g);
  return g;
}

const podeaua = faGramada(new THREE.BoxGeometry(1, GROSIME_PODEA, 1));
const zidurile = faGramada(new THREE.BoxGeometry(1, 1, 1));

const ajutor = new THREE.Object3D();
const culoareaDeLucru = new THREE.Color();

let zona = null;
let construitLa = { c: -9999, r: -9999 };


// The colour and the "can you walk here" flag both come straight
// out of the zone's climate table - the very same one the 2D game
// paints its tiles with.
function feluTerenului(litera) {
  return (zona.teren && zona.teren[litera]) || null;
}

// Every climate gives most letters TWO colours - 'culoare' and
// 'variatie'. The 2D game mixes between them tile by tile, which is
// why its grass looks like grass and not like a green bedsheet.
// Same idea here: a cheap scramble of the tile's own coordinates
// decides how far between the two colours this tile sits. Same
// tile, same shade, every time - nothing flickers as you walk.
function amestecul(c, r) {
  let n = (c * 374761393 + r * 668265263) | 0;
  n = (n ^ (n >> 13)) * 1274126177 | 0;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

const culoareaAlta = new THREE.Color();

function culoareaTerenului(fel, c, r) {
  culoareaDeLucru.setHex(fel.culoare);
  if (fel.variatie === undefined) return culoareaDeLucru;
  culoareaAlta.setHex(fel.variatie);
  return culoareaDeLucru.lerp(culoareaAlta, amestecul(c, r));
}


function esteBlocat(c, r) {
  if (!zona || r < 0 || c < 0 || r >= zona.RND || c >= zona.COL) return true;
  const f = feluTerenului(zona.harta[r][c]);
  return !f || !!f.blocat;
}

function inaltimeaSolului(c, r) {
  if (!zona || r < 0 || c < 0 || r >= zona.RND || c >= zona.COL) return 0;
  return ADANCIMI[zona.harta[r][c]] || 0;
}


function construiesteLumea(cMijloc, rMijloc) {

  let nPodea = 0;
  let nZid = 0;

  const c0 = Math.max(0, cMijloc - RAZA_LUMII), c1 = Math.min(zona.COL - 1, cMijloc + RAZA_LUMII);
  const r0 = Math.max(0, rMijloc - RAZA_LUMII), r1 = Math.min(zona.RND - 1, rMijloc + RAZA_LUMII);

  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {

      const litera = zona.harta[r][c];
      const fel = feluTerenului(litera);
      if (!fel) continue;

      const jos = ADANCIMI[litera] || 0;

      // ---- the ground slab ----
      ajutor.position.set(c, jos - GROSIME_PODEA / 2, r);
      ajutor.scale.set(1, 1, 1);
      ajutor.updateMatrix();
      podeaua.setMatrixAt(nPodea, ajutor.matrix);
      podeaua.setColorAt(nPodea, culoareaTerenului(fel, c, r));
      nPodea++;

      // ---- and, if something stands on it, the box above ----
      const h = INALTIMI[litera];
      if (!h) continue;

      // Trees and rocks are not all the same height, otherwise a
      // forest looks like a hedge trimmed with a ruler. The wobble
      // comes from the tile's own numbers, so it never changes
      // between two visits to the same spot.
      const variatie = (litera === 'T' || litera === 's' || litera === 'r')
        ? 0.75 + ((c * 7 + r * 13) % 11) / 20
        : 1;
      const inalt = h * variatie;

      ajutor.position.set(c, jos + inalt / 2, r);
      ajutor.scale.set(1, inalt, 1);
      ajutor.updateMatrix();
      zidurile.setMatrixAt(nZid, ajutor.matrix);

      // The top of a box catches the light and the sides fall into
      // shadow on their own, but a whole forest in one flat green
      // reads as a wall. So each box is nudged a shade lighter or
      // darker, again from its own coordinates.
      culoareaTerenului(fel, c, r);
      const umbra = 0.82 + ((c * 3 + r * 5) % 7) / 20;
      culoareaDeLucru.multiplyScalar(umbra);
      zidurile.setColorAt(nZid, culoareaDeLucru);
      nZid++;
    }
  }

  podeaua.count = nPodea;
  zidurile.count = nZid;
  podeaua.instanceMatrix.needsUpdate = true;
  zidurile.instanceMatrix.needsUpdate = true;
  podeaua.instanceColor.needsUpdate = true;
  zidurile.instanceColor.needsUpdate = true;

  construitLa = { c: cMijloc, r: rMijloc };
}


// ----------------------------------------------------------
//  Walking
// ----------------------------------------------------------
const apasate = {};
window.addEventListener('keydown', function (e) { apasate[e.code] = true; });
window.addEventListener('keyup',   function (e) { apasate[e.code] = false; });
window.addEventListener('blur',    function () { for (const k in apasate) apasate[k] = false; });

function tasta(lista) {
  return lista.some(function (k) { return apasate[k]; });
}

// You are a small circle, not a point: this checks the four corners
// of that circle, so you cannot slide diagonally into a tree trunk.
function poatiSta(x, z) {
  const puncte = [
    [x - RAZA_JUCATOR, z - RAZA_JUCATOR], [x + RAZA_JUCATOR, z - RAZA_JUCATOR],
    [x - RAZA_JUCATOR, z + RAZA_JUCATOR], [x + RAZA_JUCATOR, z + RAZA_JUCATOR]
  ];
  return puncte.every(function (p) {
    return !esteBlocat(Math.round(p[0]), Math.round(p[1]));
  });
}


// ----------------------------------------------------------
//  The camera, over the shoulder
//
//  It sits behind and above you and looks at your head. Dragging
//  with the mouse swings it round; the scroll wheel pulls it in
//  and out.
// ----------------------------------------------------------
let unghi = 0;          // how far the camera has swung around you
let inclinare = 0.42;   // how far above you it sits
let departare = 9;

let trage = false, ultimulX = 0, ultimulY = 0;

randator.domElement.addEventListener('pointerdown', function (e) {
  trage = true; ultimulX = e.clientX; ultimulY = e.clientY;
  randator.domElement.setPointerCapture(e.pointerId);
});
randator.domElement.addEventListener('pointerup', function (e) {
  trage = false;
  try { randator.domElement.releasePointerCapture(e.pointerId); } catch (err) { /* nothing to do */ }
});
randator.domElement.addEventListener('pointermove', function (e) {
  if (!trage) return;
  unghi -= (e.clientX - ultimulX) * 0.005;
  inclinare = Math.max(0.05, Math.min(1.2, inclinare + (e.clientY - ultimulY) * 0.004));
  ultimulX = e.clientX; ultimulY = e.clientY;
});
randator.domElement.addEventListener('wheel', function (e) {
  e.preventDefault();
  departare = Math.max(3.5, Math.min(24, departare + e.deltaY * 0.01));
}, { passive: false });


// ----------------------------------------------------------
//  Entering a zone
// ----------------------------------------------------------
const cutiaStare = document.getElementById('stare');
const scrisUnde = document.getElementById('unde');
const alegeZona = document.getElementById('alege-zona');

function intraInZona(id) {

  cutiaStare.classList.remove('gata');
  cutiaStare.innerHTML = 'Building the zone&hellip;<span class="mic">Same recipe, same seed as the 2D game.</span>';

  // A breath, so the message actually paints before the browser
  // goes quiet for a second building 290.000 tiles.
  setTimeout(function () {

    const reteta = retetaZonei(id);
    zona = faZona(reteta);
    alegeZona.value = id;

    // Underground there is no sky. Same trick as the 2D game, which
    // paints a dungeon on black instead of on grass.
    const subPamant = !!(reteta.esteTemnita || reteta.esteRaid);
    const departe = subPamant ? 0x0b0a09 : 0x8fb6d8;

    // Fog the colour of whatever is behind everything, so the edge of
    // what has been built fades out instead of ending in a cliff of
    // nothing.
    // Underground the light is torchlight: weaker, and orange.
    luminaDeSus.color.setHex(subPamant ? 0x8a7a63 : 0xcfe3f5);
    luminaDeSus.groundColor.setHex(subPamant ? 0x201a14 : 0x3b4a30);
    luminaDeSus.intensity = subPamant ? 0.85 : 0.95;
    soare.color.setHex(subPamant ? 0xffca8a : 0xfff0d0);
    soare.intensity = subPamant ? 0.55 : 0.85;

    scena.background = new THREE.Color(departe);
    scena.fog = new THREE.Fog(departe,
      subPamant ? 14 : RAZA_LUMII * 0.45,
      subPamant ? 46 : RAZA_LUMII * 0.92);

    // You start exactly where the 2D game starts you.
    let c = zona.start ? zona.start.col : Math.round(zona.COL / 2);
    let r = zona.start ? zona.start.rand : Math.round(zona.RND / 2);
    if (esteBlocat(c, r)) {
      // Should not happen, but a prototype that drops you inside a
      // rock and says nothing is worse than one that walks you out.
      for (let raza = 1; raza < 40 && esteBlocat(c, r); raza++) {
        if (!esteBlocat(c + raza, r)) { c += raza; break; }
        if (!esteBlocat(c - raza, r)) { c -= raza; break; }
        if (!esteBlocat(c, r + raza)) { r += raza; break; }
        if (!esteBlocat(c, r - raza)) { r -= raza; break; }
      }
    }

    jucator.position.set(c, inaltimeaSolului(c, r), r);
    construiesteLumea(c, r);

    scrisUnde.innerHTML = '<b>' + zona.nume + '</b> &nbsp;levels ' +
      zona.nivelDeLa + '&ndash;' + zona.nivelPanaLa + ' &nbsp;·&nbsp; ' +
      zona.COL + '&times;' + zona.RND + ' tiles';

    cutiaStare.classList.add('gata');
  }, 30);
}


// The list of zones in the bar. Only the handful this page loads -
// the prototype does not need all 52 to answer its question.
ZONE.forEach(function (z) {
  const o = document.createElement('option');
  o.value = z.id;
  o.textContent = z.nume + '  (' + z.nivelDeLa + '–' + z.nivelPanaLa + ')';
  alegeZona.appendChild(o);
});
alegeZona.value = 'greenvale';
alegeZona.addEventListener('change', function () { intraInZona(alegeZona.value); });


// ----------------------------------------------------------
//  The loop: once per frame, for ever
// ----------------------------------------------------------
let cand = performance.now();

function cadru(acum) {
  requestAnimationFrame(cadru);

  const delta = Math.min(0.05, (acum - cand) / 1000);
  cand = acum;

  if (zona) {

    // Which way you asked to go, in camera terms: "forward" means
    // away from the camera, whichever way it happens to be turned.
    let inainte = 0, lateral = 0;
    if (tasta(['KeyW', 'ArrowUp']))    inainte += 1;
    if (tasta(['KeyS', 'ArrowDown']))  inainte -= 1;
    if (tasta(['KeyA', 'ArrowLeft']))  lateral -= 1;
    if (tasta(['KeyD', 'ArrowRight'])) lateral += 1;

    if (inainte || lateral) {
      const lung = Math.hypot(inainte, lateral);
      inainte /= lung; lateral /= lung;

      const sin = Math.sin(unghi), cos = Math.cos(unghi);
      const dx = (lateral * cos - inainte * sin) * VITEZA * delta;
      const dz = (lateral * sin + inainte * cos) * VITEZA * delta;

      // Each direction is tried on its own. That is what lets you
      // slide along a wall instead of sticking to it the moment you
      // touch it at an angle.
      if (poatiSta(jucator.position.x + dx, jucator.position.z)) jucator.position.x += dx;
      if (poatiSta(jucator.position.x, jucator.position.z + dz)) jucator.position.z += dz;

      jucator.rotation.y = Math.atan2(dx, dz);
    }

    // Follow the lie of the land, gently, so hills do not snap.
    const c = Math.round(jucator.position.x), r = Math.round(jucator.position.z);
    const tinta = inaltimeaSolului(c, r);
    jucator.position.y += (tinta - jucator.position.y) * Math.min(1, delta * 9);

    // Walked far enough? Build the next stretch of world.
    if (Math.abs(c - construitLa.c) >= PAS_RECONSTRUIRE ||
        Math.abs(r - construitLa.r) >= PAS_RECONSTRUIRE) {
      construiesteLumea(c, r);
    }

    camera.position.set(
      jucator.position.x + Math.sin(unghi) * departare * Math.cos(inclinare),
      jucator.position.y + departare * Math.sin(inclinare) + 1.2,
      jucator.position.z + Math.cos(unghi) * departare * Math.cos(inclinare)
    );
    camera.lookAt(jucator.position.x, jucator.position.y + 1.3, jucator.position.z);
  }

  randator.render(scena, camera);
}

requestAnimationFrame(cadru);
intraInZona('greenvale');
