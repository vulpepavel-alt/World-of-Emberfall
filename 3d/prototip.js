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
//  list is flat ground. Roofs ('R') and house walls ('H') are not
//  here: buildings are stacked in two parts further down.
// ----------------------------------------------------------
const INALTIMI = {
  T: 2.6,    // thick forest
  s: 0.9,    // low scrub
  r: 1.5,    // rock
  X: 3.4,    // the wall around the edge of the zone
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
const VITEZA_INTOARCERII = 2.6; // radians per second - a full turn in 2,4 s
const RAZA_JUCATOR = 0.32;      // how wide you are, for bumping into things


// ----------------------------------------------------------
//  Setting up the picture
// ----------------------------------------------------------
const lumea = new THREE.Scene();
lumea.background = new THREE.Color(0x8fb6d8);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);

// antialias OFF on purpose. It exists to smooth the staircase edges
// of a diagonal line, and a smooth edge is exactly what we do not
// want here.
const randator = new THREE.WebGLRenderer({ antialias: false });
document.body.appendChild(randator.domElement);

// Flat colours, no photographs: one soft light from above and one
// strong light from the side, so a box has a lit face and a dark
// face and you can tell which way it is turned.
const luminaDeSus = new THREE.HemisphereLight(0xcfe3f5, 0x3b4a30, 0.95);
lumea.add(luminaDeSus);
const soare = new THREE.DirectionalLight(0xfff0d0, 0.85);
soare.position.set(-40, 70, 30);
lumea.add(soare);

// ----------------------------------------------------------
//  The pixelated look
//
//  There is no clever trick to this, and that is the good news.
//  The picture is drawn SMALL - a third of the size of the window -
//  and then blown up to fill it. Blown up the honest way: each small
//  dot becomes a square block of screen, with nothing smeared or
//  blended in between. That is what "image-rendering: pixelated"
//  asks the browser for.
//
//  It is the same thing the 2D game does with `pixelArt: true`.
//
//  It also costs less, not more: drawing a third as wide and a third
//  as tall is a ninth of the work.
//
//  1 = smooth and modern. 6 = very chunky. Press P to cycle.
//
//  Started at 3, which turned out to be too coarse to look at for
//  long - faces and distant trees dissolved. 2 keeps the blocky
//  edge without losing the picture.
// ----------------------------------------------------------
let pixelare = 2;

function potrivesteMarimea() {
  const lat = window.innerWidth, inalt = window.innerHeight;

  // A window of no size at all - the tab is in the background, or
  // hidden. Setting the canvas to zero here would leave it blank
  // even after the tab came back, so we simply wait.
  if (!lat || !inalt) return;

  camera.aspect = lat / inalt;
  camera.updateProjectionMatrix();

  // Draw at this many actual dots...
  randator.setPixelRatio(1);
  randator.setSize(Math.max(160, Math.round(lat / pixelare)),
                   Math.max(90, Math.round(inalt / pixelare)),
                   false);           // false = do not touch the size on screen

  // ...but take up the whole window on screen, blocks and all.
  const panza = randator.domElement;
  panza.style.width = lat + 'px';
  panza.style.height = inalt + 'px';
  panza.style.imageRendering = 'pixelated';
}

potrivesteMarimea();
window.addEventListener('resize', potrivesteMarimea);
document.addEventListener('visibilitychange', potrivesteMarimea);


// ----------------------------------------------------------
//  When the browser takes the 3D away
//
//  A browser can hand back the graphics card at any moment - a tab
//  left in the background for a long time, a driver hiccup, too many
//  3D pages open at once. Everything drawn is gone, and every
//  attempt to draw again throws.
//
//  Without these two lines the page would then throw once per frame,
//  for ever, and never come back - which is exactly what happened
//  while testing. Now it waits quietly, and rebuilds when the
//  browser is ready.
// ----------------------------------------------------------
let graficaPierduta = false;

randator.domElement.addEventListener('webglcontextlost', function (e) {
  e.preventDefault();          // without this, it is never given back
  graficaPierduta = true;
});

randator.domElement.addEventListener('webglcontextrestored', function () {
  graficaPierduta = false;
  potrivesteMarimea();
  if (!zona) return;
  // The boxes and the creatures have to be built again from scratch.
  uitaToateFapturile();
  construiesteLumea(Math.round(jucator.position.x), Math.round(jucator.position.z));
  actualizeazaFapturile();
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
lumea.add(jucator);


// ==========================================================
//  THE LIVING WORLD
//
//  This is the part that surprised me. Every monster and every
//  townsperson in the game is ALREADY a list of coloured
//  rectangles - MOBI['wolf'].forme, NPC['hangiu'].forme - each with
//  an x, a y, a width and a height in pixels of the 2D picture.
//  A wolf is 23 rectangles. The innkeeper is 20.
//
//  That is a flat side view, so all it needs is a depth to become
//  a body. Nothing here is modelled by hand: the wolves in this
//  prototype are the wolves from mobi.js, and if somebody repaints
//  one there, it changes here too.
//
//  The same goes for where they stand. faZona() placed 1300
//  monsters and 9 townspeople in Greenvale, on walkable ground, in
//  the right spots - and this page just reads that list.
// ==========================================================

// 24 pixels of the 2D drawing make one tile here. Not the 16 the
// 2D game uses: it draws people deliberately larger than life
// against its own tiles, and at that scale a townsman in 3D would
// stand two and a half metres tall next to a house.
const SCARA_FAPTURII = 1 / 24;

// How far away creatures are given a body at all.
const RAZA_FAPTURI = 55;

// One template per kind, built once and then copied. Copies share
// the same shapes and colours in the computer's memory, so a
// hundred wolves cost about as much to keep as one.
const sabloaneFapturi = {};

function fapturaDinForme(forme) {

  const grup = new THREE.Group();
  if (!forme || !forme.length) return grup;

  // Where the feet are, in the 2D drawing. In that drawing y grows
  // DOWNWARDS - the head is a negative number - so the feet are the
  // largest y of all the rectangles. Everything is measured up from
  // there, which is what stands the creature on the ground instead
  // of sinking it or floating it.
  let talpa = -Infinity;
  forme.forEach(function (f) {
    talpa = Math.max(talpa, f.fel === 'cerc' ? f.y + f.r : f.y + f.h / 2);
  });

  forme.forEach(function (f) {
    const material = new THREE.MeshLambertMaterial({ color: f.culoare });
    let bucata;

    if (f.fel === 'cerc') {
      // Circles are heads, almost always. A ball reads better than
      // a cube for those, and there are never many of them.
      bucata = new THREE.Mesh(new THREE.SphereGeometry(f.r * SCARA_FAPTURII, 10, 8), material);
    } else {
      // A rectangle has no depth of its own, so it gets one: as deep
      // as it is wide, up to a limit. A torso comes out square-ish,
      // an arm stays an arm.
      const adanc = Math.max(3, Math.min(f.w, 12));
      bucata = new THREE.Mesh(new THREE.BoxGeometry(
        f.w * SCARA_FAPTURII, f.h * SCARA_FAPTURII, adanc * SCARA_FAPTURII
      ), material);
    }

    bucata.position.set(f.x * SCARA_FAPTURII, (talpa - f.y) * SCARA_FAPTURII, 0);
    grup.add(bucata);
  });

  return grup;
}

function sablonulFapturii(tabel, fel) {
  const cheie = tabel === MOBI ? 'm:' + fel : 'n:' + fel;
  if (!sabloaneFapturi[cheie]) {
    const d = tabel[fel];
    sabloaneFapturi[cheie] = fapturaDinForme(d && d.forme);
  }
  return sabloaneFapturi[cheie];
}


// ----------------------------------------------------------
//  The name floating above them
//
//  The 2D game writes a name over every creature. Here that is a
//  "sprite": a small flat picture that always turns to face you,
//  however the camera moves - like a shop sign that swivels.
//
//  The picture is drawn once per piece of text and then shared, so
//  forty wolves called "Wolf (Level 4)" cost one drawing, not forty.
// ----------------------------------------------------------
const etichete = {};

function eticheta(text, culoare) {
  const cheie = culoare + '|' + text;
  if (etichete[cheie]) return etichete[cheie];

  const panza = document.createElement('canvas');
  const ctx = panza.getContext('2d');
  const font = '26px Georgia, "Times New Roman", serif';
  ctx.font = font;
  panza.width = Math.ceil(ctx.measureText(text).width) + 16;
  panza.height = 38;

  const c2 = panza.getContext('2d');
  c2.font = font;
  c2.textAlign = 'center';
  c2.textBaseline = 'middle';
  // A dark outline first, then the text. Without it, a pale name
  // over pale ground is unreadable, and over dark ground a dark one.
  c2.lineWidth = 5;
  c2.strokeStyle = 'rgba(8,8,10,0.85)';
  c2.strokeText(text, panza.width / 2, panza.height / 2);
  c2.fillStyle = culoare;
  c2.fillText(text, panza.width / 2, panza.height / 2);

  const textura = new THREE.CanvasTexture(panza);
  textura.minFilter = THREE.LinearFilter;

  etichete[cheie] = {
    // depthTest stays ON, so a name goes behind a house the way the
    // creature does. With it off, every name in the village floated
    // on top of the walls and you could read the whole street at once.
    material: new THREE.SpriteMaterial({ map: textura, transparent: true }),
    lat: panza.width / 90,
    inalt: panza.height / 90
  };
  return etichete[cheie];
}

function faEticheta(text, culoare, inaltime) {
  const e = eticheta(text, culoare);
  const s = new THREE.Sprite(e.material);
  s.scale.set(e.lat, e.inalt, 1);
  s.position.y = inaltime;
  // Kept so the name can be held at a steady size on screen no
  // matter how near or far it is - see marimePeEcran().
  s.latBaza = e.lat;
  s.inaltBaza = e.inalt;
  return s;
}

// Anything in perspective grows as you walk up to it. That is right
// for a wolf and wrong for its name: stand next to one and the
// writing filled half the screen. A name is a label, not an object,
// so it is held at roughly the same size however far away it is -
// by scaling it up in step with its distance.
//
// Clamped at both ends: not so small it cannot be read across a
// field, not so large it covers the thing it belongs to.
function marimePeEcran(obiectInLume) {
  const d = camera.position.distanceTo(obiectInLume.getWorldPosition(new THREE.Vector3()));
  return Math.max(0.45, Math.min(2.6, d * 0.12));
}

// A townsperson's name is worth reading from across the village.
// Fifty monster names at once is just noise, so those only show up
// close - the same distance the 2D game shows them from.
const RAZA_NUMELUI_MOB = 22;


// ----------------------------------------------------------
//  Keeping only what is near you
//
//  Greenvale holds 1300 monsters. Building all of them would take
//  longer than building the ground. So a creature gets a body when
//  you come within RAZA_FAPTURI tiles of it, and gives it back when
//  you walk away - the entry in the zone's list is what lasts, not
//  the boxes.
// ----------------------------------------------------------
const fapturiDeFata = new Map();     // the zone's entry -> its boxes

function inaltimeaFapturii(grup) {
  let sus = 0;
  grup.children.forEach(function (b) {
    const g = b.geometry.parameters;
    sus = Math.max(sus, b.position.y + (g.height ? g.height / 2 : (g.radius || 0)));
  });
  return sus;
}

// Where a creature is standing right now. Monsters walk about, so
// they carry an x and a z of their own; the square written in the
// zone's list is only where they started.
function pozitiaFapturii(intrare) {
  return {
    x: (intrare.x === undefined) ? intrare.col : intrare.x,
    z: (intrare.z === undefined) ? intrare.rand : intrare.z
  };
}

function adaugaFaptura(intrare, tabel, numeScris, culoareaNumelui) {
  const d = tabel[intrare.fel];
  if (!d || !d.forme) return;

  const grup = sablonulFapturii(tabel, intrare.fel).clone();
  const unde = pozitiaFapturii(intrare);
  grup.position.set(unde.x, inaltimeaSolului(Math.round(unde.x), Math.round(unde.z)), unde.z);

  // Facing whichever way their own square says, so a clearing of
  // wolves does not look like a parade. Same square, same way, every
  // time you come back.
  grup.rotation.y = amestecul(intrare.col, intrare.rand) * Math.PI * 2;

  grup.inaltimeaLui = inaltimeaFapturii(grup);

  if (numeScris) {
    grup.numeleScris = faEticheta(numeScris, culoareaNumelui, grup.inaltimeaLui + 0.42);
    grup.add(grup.numeleScris);
  }

  lumea.add(grup);
  fapturiDeFata.set(intrare, grup);
  if (typeof imbracaFapturaInLupta === 'function') imbracaFapturaInLupta(intrare, grup, tabel);
}

function uitaFaptura(intrare) {
  const grup = fapturiDeFata.get(intrare);
  if (!grup) return;
  lumea.remove(grup);
  fapturiDeFata.delete(intrare);
}

function actualizeazaFapturile() {
  if (!zona) return;

  const x = jucator.position.x, z = jucator.position.z;
  const vrute = new Set();

  (zona.npci || []).forEach(function (n) {
    if (Math.abs(n.col - x) > RAZA_FAPTURI || Math.abs(n.rand - z) > RAZA_FAPTURI) return;
    vrute.add(n);
    if (!fapturiDeFata.has(n)) {
      const d = NPC[n.fel] || {};
      adaugaFaptura(n, NPC, d.nume || n.fel, '#ffe9b0');
    }
  });

  (zona.mobi || []).forEach(function (m) {
    const p = pozitiaFapturii(m);
    if (Math.abs(p.x - x) > RAZA_FAPTURI || Math.abs(p.z - z) > RAZA_FAPTURI) return;

    // A monster you have killed has no body until it comes back.
    if (typeof esteMort === 'function' && esteMort(m)) { uitaFaptura(m); return; }

    vrute.add(m);
    if (!fapturiDeFata.has(m)) {
      const d = MOBI[m.fel] || {};
      adaugaFaptura(m, MOBI, (m.nume || d.nume || m.fel) + ' (' + m.nivel + ')', '#f0d6d0');
    }
    const grup = fapturiDeFata.get(m);
    if (grup && grup.numeleScris) {
      grup.numeleScris.visible = Math.hypot(p.x - x, p.z - z) <= RAZA_NUMELUI_MOB;
    }
  });

  fapturiDeFata.forEach(function (grup, intrare) {
    if (!vrute.has(intrare)) uitaFaptura(intrare);
  });
}

function uitaToateFapturile() {
  fapturiDeFata.forEach(function (grup) { lumea.remove(grup); });
  fapturiDeFata.clear();
}


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

function faGramada(geometrie, catIncap) {
  const g = new THREE.InstancedMesh(
    geometrie,
    new THREE.MeshLambertMaterial({ vertexColors: false }),
    catIncap
  );
  g.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(catIncap * 3), 3);
  g.count = 0;
  g.frustumCulled = false;
  lumea.add(g);
  return g;
}

const podeaua = faGramada(new THREE.BoxGeometry(1, GROSIME_PODEA, 1), MAX_CUTII);
// Twice the room: a building tile puts up TWO boxes, a wall and the
// roof on top of it.
const zidurile = faGramada(new THREE.BoxGeometry(1, 1, 1), MAX_CUTII * 2);

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


// How a building is stacked: wall from the ground up to here, then
// the roof colour laid across the top of it.
const INALTIMEA_PERETELUI = 2.3;
const GROSIMEA_ACOPERISULUI = 0.6;

// Puts one box into the pile and hands back the next free slot.
// delaLaSol is how far off the ground it starts, inalt how tall.
function puneCutia(nZid, c, r, jos, delaLaSol, inalt, fel) {
  if (nZid >= zidurile.instanceMatrix.count) return nZid;   // pile full

  ajutor.position.set(c, jos + delaLaSol + inalt / 2, r);
  ajutor.scale.set(1, inalt, 1);
  ajutor.updateMatrix();
  zidurile.setMatrixAt(nZid, ajutor.matrix);

  // The top of a box catches the light and the sides fall into
  // shadow on their own, but a whole forest in one flat green reads
  // as a wall. So each box is nudged a shade lighter or darker,
  // again from its own coordinates.
  culoareaTerenului(fel, c, r);
  culoareaDeLucru.multiplyScalar(0.82 + ((c * 3 + r * 5) % 7) / 20);
  zidurile.setColorAt(nZid, culoareaDeLucru);

  return nZid + 1;
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

      // ---- buildings ----
      //
      // This was the ugly part. In the 2D map a house is drawn from
      // straight above: a band of roof tiles ('R'), and in front of
      // it a band of front-wall tiles ('H'), side by side. Stood up
      // as they are, that becomes a red slab standing NEXT TO a
      // cream slab - two low walls, not a house.
      //
      // What the map actually means is: this whole patch is a
      // building. So every tile of it gets a wall from the ground up
      // and the roof colour laid across the top. The doorway 'D' is
      // not in this list, so it stays the hole in the wall it is.
      if (litera === 'R' || litera === 'H') {
        const zid = feluTerenului('H') || fel;
        const acoperis = feluTerenului('R') || fel;

        nZid = puneCutia(nZid, c, r, jos, 0, INALTIMEA_PERETELUI, zid);
        nZid = puneCutia(nZid, c, r, jos, INALTIMEA_PERETELUI, GROSIMEA_ACOPERISULUI, acoperis);
        continue;
      }

      // ---- and, if something else stands on it, the box above ----
      const h = INALTIMI[litera];
      if (!h) continue;

      // Trees and rocks are not all the same height, otherwise a
      // forest looks like a hedge trimmed with a ruler. The wobble
      // comes from the tile's own numbers, so it never changes
      // between two visits to the same spot.
      const variatie = (litera === 'T' || litera === 's' || litera === 'r')
        ? 0.75 + ((c * 7 + r * 13) % 11) / 20
        : 1;

      nZid = puneCutia(nZid, c, r, jos, 0, h * variatie, fel);
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

// P cycles how chunky the picture is, so the two looks can be
// compared side by side instead of argued about.
const TREPTE_PIXELARE = [1, 2, 3, 4, 6];

window.addEventListener('keydown', function (e) {
  if (e.code !== 'KeyP') return;
  pixelare = TREPTE_PIXELARE[(TREPTE_PIXELARE.indexOf(pixelare) + 1) % TREPTE_PIXELARE.length];
  potrivesteMarimea();
  scrieTreapta();
});

function scrieTreapta() {
  const el = document.getElementById('treapta-pixeli');
  if (el) el.textContent = pixelare === 1 ? 'smooth' : pixelare + '× chunky';
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

// Which way the character is facing. The camera sits opposite it, so
// facing starts at half a turn from the camera's own angle.
let fataJucatorului = unghi - Math.PI;
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


// How tall whatever stands on this square is, measured from the
// ground. Nothing there: zero.
function inaltimeaObstacolului(c, r) {
  if (!zona || r < 0 || c < 0 || r >= zona.RND || c >= zona.COL) return 99;
  const litera = zona.harta[r][c];
  if (litera === 'R' || litera === 'H') return INALTIMEA_PERETELUI + GROSIMEA_ACOPERISULUI;
  return INALTIMI[litera] || 0;
}

// Walking into a village used to put the camera inside a wall and
// you saw nothing but plaster. So before the camera is placed, we
// walk the line from your head out to where it wants to sit, and
// stop it at the first thing tall enough to be in the way.
const DISTANTA_MINIMA_CAMERA = 1.6;

function catIncapeCamera(ochi, spre) {
  const dx = spre.x - ochi.x, dy = spre.y - ochi.y, dz = spre.z - ochi.z;
  const lung = Math.hypot(dx, dy, dz);
  const pasi = Math.max(4, Math.ceil(lung / 0.35));

  for (let i = 1; i <= pasi; i++) {
    const t = i / pasi;
    const x = ochi.x + dx * t, y = ochi.y + dy * t, z = ochi.z + dz * t;
    const c = Math.round(x), r = Math.round(z);
    const sol = ADANCIMI[(zona.harta[r] || '')[c]] || 0;

    // Only things the camera would actually be inside count. A
    // campfire is solid but half a metre tall; the camera flies
    // over it without complaint.
    if (y < sol + inaltimeaObstacolului(c, r)) {
      const inapoi = (i - 1) / pasi * lung - 0.25;
      return Math.max(DISTANTA_MINIMA_CAMERA, Math.min(lung, inapoi));
    }
  }
  return lung;
}


// ----------------------------------------------------------
//  Entering a zone
// ----------------------------------------------------------
const cutiaStare = document.getElementById('stare');
const scrisUnde = document.getElementById('unde');
const alegeZona = document.getElementById('alege-zona');

function intraInZona(id, unde, dinspre) {

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

    lumea.background = new THREE.Color(departe);
    lumea.fog = new THREE.Fog(departe,
      subPamant ? 14 : RAZA_LUMII * 0.45,
      subPamant ? 46 : RAZA_LUMII * 0.92);

    // You start exactly where the 2D game starts you - or, coming
    // back from a save, on the very square you left from.
    let c = zona.start ? zona.start.col : Math.round(zona.COL / 2);
    let r = zona.start ? zona.start.rand : Math.round(zona.RND / 2);
    // Coming through a gate: you appear on the matching gate of the
    // new zone, ten squares inside it. See treceri3d.js.
    if (!unde && dinspre && typeof undeIntriDinspre === 'function') {
      unde = undeIntriDinspre(dinspre);
    }

    // Arrived by air, or by hearthstone: you land at the stop.
    if (!unde && typeof undeCoboriDinZbor === 'function') {
      unde = undeCoboriDinZbor();
    }

    if (unde && unde.col !== null && unde.col !== undefined) {
      c = Math.max(0, Math.min(zona.COL - 1, Math.round(unde.col)));
      r = Math.max(0, Math.min(zona.RND - 1, Math.round(unde.rand)));
    }
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
    uitaToateFapturile();
    if (typeof uitaLupta === 'function') uitaLupta();
    if (typeof stergeSemneleTrecerilor === 'function') stergeSemneleTrecerilor();
    construiesteLumea(c, r);
    actualizeazaFapturile();

    scrisUnde.innerHTML = '<b>' + zona.nume + '</b> &nbsp;levels ' +
      zona.nivelDeLa + '&ndash;' + zona.nivelPanaLa + ' &nbsp;·&nbsp; ' +
      zona.COL + '&times;' + zona.RND + ' tiles';

    if (typeof gataDeTrecere === 'function') gataDeTrecere();

    cutiaStare.classList.add('gata');
  }, 30);
}


// Every zone the game has, in the bar - all 52 of them, plus the two
// cities, the eight dungeons and the raid.
ZONE.forEach(function (z) {
  const o = document.createElement('option');
  o.value = z.id;
  o.textContent = z.nume + '  (' + z.nivelDeLa + '–' + z.nivelPanaLa + ')';
  alegeZona.appendChild(o);
});
alegeZona.addEventListener('change', function () { intraInZona(alegeZona.value); });


// ==========================================================
//  STARTING THE GAME
//
//  The title screen, the three save slots and the whole character
//  creation screen are the 2D game's own files, loaded unchanged.
//  They only ask one thing of whatever comes after them: a function
//  called porneste() - "start" - which they call with the character
//  you made, or the one they loaded out of a save.
//
//  In the 2D game that function is in game.js and it starts Phaser.
//  Here it is this one, and it walks you into the 3D world instead.
//  Neither file knows the other exists.
// ==========================================================

// The 2D game measures positions in pixels, at 32 pixels to a tile.
// We measure in tiles. Saving in the 2D game's units means a
// character saved here can still be opened there, and the other way
// round.
const PIXELI_PE_CASUTA_SALVATA = 32;

// salvare.js writes `jucator.x` and `jucator.y` straight into the
// save. Our jucator is a 3D object, whose place lives somewhere else
// and counts Z where the 2D game counts Y. These two lines let the
// old file read the new object without either of them being changed.
Object.defineProperty(jucator, 'x', {
  get: function () { return jucator.position.x * PIXELI_PE_CASUTA_SALVATA; }
});
Object.defineProperty(jucator, 'y', {
  get: function () { return jucator.position.z * PIXELI_PE_CASUTA_SALVATA; }
});

let personaj = null;
const bara = document.getElementById('bara');

function porneste(personajAles, salvarea) {

  personaj = personajAles;
  window.personaj = personaj;      // salvare.js looks for it by name

  // There are no trainers in the 3D world yet, so you are given
  // everything your class and level allows - by the game's own rule,
  // daTotCeSeCuvine(), not by any list written here.
  //
  // Topped up, not replaced: a character made at level 20 already
  // knows the three you start with, so "only fill this in if it is
  // empty" left them with three buttons at level 20. Now each
  // ability takes whichever rank is higher, so nothing you learnt
  // is ever taken away or knocked back a rank.
  personaj.stiute = personaj.stiute || {};
  const secuvine = daTotCeSeCuvine(personaj);
  Object.keys(secuvine).forEach(function (id) {
    personaj.stiute[id] = Math.max(personaj.stiute[id] || 0, secuvine[id]);
  });
  personaj.bara = personaj.bara || faBaraGoala();
  Object.keys(personaj.stiute).forEach(function (id) {
    asazaPeBaraDacaIncape(personaj, id);
  });

  // Rage starts empty, mana starts full. Two opposite habits sharing
  // one bar, exactly as in the 2D game.
  personaj.viata = personaj.viataMaxima;
  if (personaj.resursa === RESURSA_MANA) personaj.mana = personaj.manaMaxima;
  else personaj.rage = 0;

  // Every screen of the menu goes away, and the world's bar appears.
  ['ecran-titlu', 'ecran-sloturi', 'ecran-creare'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('ascuns');
  });
  bara.classList.remove('ascuns');

  // Out of a save you go back where you were. Otherwise you start in
  // your own people's home zone, exactly as in the 2D game.
  const idZonei = (salvarea && salvarea.zona && retetaZonei(salvarea.zona))
    ? salvarea.zona
    : (ZONA_DE_START[personaj.idRasa] || ZONE[0].id);

  const unde = (salvarea && salvarea.x !== null && salvarea.x !== undefined)
    ? { col: salvarea.x / PIXELI_PE_CASUTA_SALVATA,
        rand: salvarea.y / PIXELI_PE_CASUTA_SALVATA }
    : null;

  intraInZona(idZonei, unde);
}


// ----------------------------------------------------------
//  The loop: once per frame, for ever
// ----------------------------------------------------------
let cand = performance.now();
let ultimaVerificareFapturi = 0;

function cadru(acum) {
  requestAnimationFrame(cadru);

  // Never below zero, never above a twentieth of a second. Zero,
  // because a clock that jumps backwards would walk you backwards;
  // the cap, because if the tab is asleep for a minute we do not
  // want to wake up and teleport a minute's worth of walking.
  const delta = Math.max(0, Math.min(0.05, (acum - cand) / 1000));
  cand = acum;

  if (zona) {

    // ---- turning ----
    //
    // A and D TURN you, the way they do in Warcraft, and the camera
    // swings round with you so it stays at your back. Before this,
    // they slid you sideways while the camera stared straight ahead,
    // which is why walking anywhere felt like being dragged.
    //
    // The camera gets the very same amount added to it, so if you
    // have dragged it off to one side with the mouse, it keeps that
    // offset instead of snapping back behind you mid-turn.
    // WHICH WAY IS RIGHT. Worth writing down, because I got it
    // backwards once and a test that only checked "A and D are
    // opposite, and the camera follows" happily passed anyway.
    //
    // Facing is the vector (sin f, cos f). You start facing away
    // from the camera, which is (0, -1) - call it north. On screen,
    // +x is to your right, because the camera sits on the +z side
    // looking towards -z.
    //
    // Turning right means going from north (0, -1) towards east
    // (1, 0), so sin f has to become positive. sin(-PI + e) is
    // NEGATIVE and sin(-PI - e) is positive - so a right turn makes
    // f smaller, not bigger. D subtracts.
    let intoarcere = 0;
    if (tasta(['KeyA', 'ArrowLeft']))  intoarcere += 1;
    if (tasta(['KeyD', 'ArrowRight'])) intoarcere -= 1;

    if (intoarcere) {
      const cat = intoarcere * VITEZA_INTOARCERII * delta;
      fataJucatorului += cat;
      unghi += cat;
    }

    // ---- walking ----
    //
    // Always along the way you are FACING, never along the way the
    // camera happens to be pointing. Q and E step sideways without
    // turning, for edging round a corner.
    let inainte = 0, lateral = 0;
    if (tasta(['KeyW', 'ArrowUp']))   inainte += 1;
    if (tasta(['KeyS', 'ArrowDown'])) inainte -= 1;
    if (tasta(['KeyQ']))              lateral -= 1;
    if (tasta(['KeyE']))              lateral += 1;

    if (inainte || lateral) {
      const lung = Math.hypot(inainte, lateral);
      inainte /= lung; lateral /= lung;

      // Facing is (sin f, cos f). Your right is a quarter turn from
      // it - and it is (-cos f, sin f), NOT (cos f, -sin f). Check
      // it at the start, facing north (0, -1): (-cos(-PI), sin(-PI))
      // is (1, 0), which is east, which is the right of the screen.
      // The other one gives (-1, 0), west, and Q and E come out
      // swapped - which is exactly what they were.
      const sin = Math.sin(fataJucatorului), cos = Math.cos(fataJucatorului);
      // A horse carries you faster - see drumuri3d.js.
      const viteza = (typeof vitezaTa3d === 'function') ? vitezaTa3d() : VITEZA;
      const dx = (inainte * sin - lateral * cos) * viteza * delta;
      const dz = (inainte * cos + lateral * sin) * viteza * delta;

      // Each direction is tried on its own. That is what lets you
      // slide along a wall instead of sticking to it the moment you
      // touch it at an angle.
      if (poatiSta(jucator.position.x + dx, jucator.position.z)) jucator.position.x += dx;
      if (poatiSta(jucator.position.x, jucator.position.z + dz)) jucator.position.z += dz;
    }

    jucator.rotation.y = fataJucatorului;

    // Follow the lie of the land, gently, so hills do not snap.
    const c = Math.round(jucator.position.x), r = Math.round(jucator.position.z);
    const tinta = inaltimeaSolului(c, r);
    jucator.position.y += (tinta - jucator.position.y) * Math.min(1, delta * 9);

    // Walked far enough? Build the next stretch of world.
    if (Math.abs(c - construitLa.c) >= PAS_RECONSTRUIRE ||
        Math.abs(r - construitLa.r) >= PAS_RECONSTRUIRE) {
      construiesteLumea(c, r);
    }

    // Twice a second is plenty for deciding who is close enough to
    // be given a body. Doing it every frame would be 1300 distance
    // sums sixty times a second for no gain.
    if (acum - ultimaVerificareFapturi > 500) {
      ultimaVerificareFapturi = acum;
      actualizeazaFapturile();
    }

    // Everything that is alive: wandering, chasing, hitting,
    // dying, coming back. See lupta3d.js.
    if (typeof actualizeazaLupta === 'function') actualizeazaLupta(delta, acum);

    // Standing on a gate to the next zone? See treceri3d.js.
    if (typeof verificaTrecerea3d === 'function') verificaTrecerea3d();

    // Where the camera would like to sit, and where it actually can.
    const ochi = { x: jucator.position.x, y: jucator.position.y + 1.3, z: jucator.position.z };
    const spre = {
      x: ochi.x + Math.sin(unghi) * departare * Math.cos(inclinare),
      y: jucator.position.y + departare * Math.sin(inclinare) + 1.2,
      z: ochi.z + Math.cos(unghi) * departare * Math.cos(inclinare)
    };

    const incape = catIncapeCamera(ochi, spre) /
                   Math.max(0.001, Math.hypot(spre.x - ochi.x, spre.y - ochi.y, spre.z - ochi.z));

    camera.position.set(
      ochi.x + (spre.x - ochi.x) * incape,
      ochi.y + (spre.y - ochi.y) * incape,
      ochi.z + (spre.z - ochi.z) * incape
    );
    camera.lookAt(ochi.x, ochi.y, ochi.z);
  }

  // Nothing to draw on while the browser has the graphics card back.
  if (!graficaPierduta) randator.render(lumea, camera);
}

// The loop runs from the very first moment, but there is no zone in
// it until porneste() is called from the menu. Until then it just
// draws an empty sky behind the title screen, which costs nothing.
requestAnimationFrame(cadru);
