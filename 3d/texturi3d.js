// ==========================================================
//  MAKING THE WORLD LOOK LIVED IN
//
//  Everything here is DRAWN IN CODE, on a blank canvas, at the
//  moment the page opens. There is not one image file in this
//  project and there never will be: no photograph, no tile set, no
//  texture pack, nothing downloaded from anywhere. A few loops that
//  scatter dots and streaks, and that is the whole of it.
//
//  Two things were making the world look like a spreadsheet:
//
//  1. EVERY SURFACE WAS ONE FLAT COLOUR. A field was one green, a
//     wall was one cream. Real ground has grain. So each surface now
//     carries a small drawn pattern which MULTIPLIES its colour -
//     the grass stays exactly the green climat.js says it is, but it
//     has speckle in it, and the wall has streaks.
//
//  2. NOTHING SMALL GREW ON IT. No tufts, no flowers, no stones, and
//     a forest was a field of solid blocks with no trunks. So the
//     ground around you is sown with thousands of little things,
//     rebuilt as you walk, from the tile's own numbers - meaning
//     the same patch of field has the same daisies every time you
//     come back to it. That is what stops it looking like confetti.
//
//  None of it is solid. You walk through grass; you always could.
// ==========================================================


// ----------------------------------------------------------
//  Drawing on a blank canvas
//
//  A small square picture, repeated over and over across a surface.
//  Kept tiny - 64 dots across - because it is meant to be grain you
//  half-notice, and because a blocky world wants a blocky grain.
// ----------------------------------------------------------
const LATURA_TEXTURII = 64;

function faTextura(deseneaza) {
  const panza = document.createElement('canvas');
  panza.width = LATURA_TEXTURII;
  panza.height = LATURA_TEXTURII;
  const g = panza.getContext('2d');

  // White is "leave the colour alone". Everything drawn darker than
  // white darkens whatever colour this ends up on.
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, LATURA_TEXTURII, LATURA_TEXTURII);
  deseneaza(g, LATURA_TEXTURII);

  const t = new THREE.CanvasTexture(panza);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  // Up close: no smoothing at all, so the grain stays as blocky as
  // everything else.
  t.magFilter = THREE.NearestFilter;

  // Far away: smoothed, and this one matters. Left unsmoothed, a
  // wood seen from across the valley turns into corduroy - the
  // pattern is finer than the screen can show, so the dots beat
  // against the pixels and come out as stripes that crawl as you
  // walk. Smaller copies of the picture, picked by distance, are
  // what stops that.
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  return t;
}


// Numbers that look scattered but are always the same ones, so the
// picture is identical every time the page opens.
function zarTextura(n) {
  let x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}


// ---- the ground: speckle, and a few darker patches ----
//
// Dark flecks AND light ones, and most of them a short stroke
// rather than a dot. Seen from standing height that reads as blades
// lying every which way, which is what does most of the work of
// making a field look like a field. The loose tufts further down
// are only the few that stand up out of it.
const texturaPamantului = faTextura(function (g, n) {
  for (let i = 0; i < 900; i++) {
    const x = zarTextura(i) * n;
    const y = zarTextura(i + 900) * n;
    const lung = 1 + zarTextura(i + 1400) * 3;
    const inPicioare = zarTextura(i + 2100) < 0.62;
    const luminos = zarTextura(i + 2700) < 0.42;
    g.fillStyle = luminos
      ? 'rgba(255,255,255,' + (0.05 + zarTextura(i + 3300) * 0.13).toFixed(3) + ')'
      : 'rgba(0,0,0,' + (0.05 + zarTextura(i + 3300) * 0.15).toFixed(3) + ')';
    if (inPicioare) g.fillRect(x, y, 1, lung);
    else g.fillRect(x, y, lung, 1);
  }
  // A handful of wider, softer patches, so it is not an even fuzz.
  for (let i = 0; i < 9; i++) {
    const x = zarTextura(i + 40) * n, y = zarTextura(i + 70) * n;
    const raza = 5 + zarTextura(i + 110) * 7;
    g.fillStyle = 'rgba(0,0,0,0.05)';
    g.beginPath(); g.arc(x, y, raza, 0, Math.PI * 2); g.fill();
  }
});


// ---- what stands up: trunks, walls, rock. Vertical streaks, and
//      lines across, so a wall reads as courses of stone ----
const texturaZidurilor = faTextura(function (g, n) {
  // Few and faint. The first go had seventy-odd dark stripes at up
  // to 16% - which on a hillside of trees read as velvet, not bark.
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(zarTextura(i + 11) * n);
    const lat = 2 + Math.floor(zarTextura(i + 77) * 3);
    g.fillStyle = 'rgba(0,0,0,' + (0.018 + zarTextura(i + 133) * 0.042).toFixed(3) + ')';
    g.fillRect(x, 0, lat, n);
  }
  // Courses, as in a wall: a dark line with a lit one under it.
  for (let y = 0; y < n; y += 16) {
    g.fillStyle = 'rgba(0,0,0,0.07)';
    g.fillRect(0, y, n, 1);
    g.fillStyle = 'rgba(255,255,255,0.10)';
    g.fillRect(0, y + 1, n, 1);
  }
});


// ---- water: ripples, which are moved along a little each frame ----
const texturaApei = faTextura(function (g, n) {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, n, n);
  for (let i = 0; i < 26; i++) {
    const y = zarTextura(i + 300) * n;
    const lat = 6 + zarTextura(i + 400) * 16;
    const x = zarTextura(i + 500) * n;
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.fillRect(x, y, lat, 1);
    g.fillStyle = 'rgba(0,0,0,0.10)';
    g.fillRect(x, y + 1, lat, 1);
  }
});


// The two big piles of boxes were built before this file loaded, so
// their surfaces are handed the pattern here.
podeaua.material.map = texturaPamantului;
podeaua.material.needsUpdate = true;
zidurile.material.map = texturaZidurilor;
zidurile.material.needsUpdate = true;


// ==========================================================
//  THE SMALL THINGS GROWING ON IT
// ==========================================================

// How far out they are sown. Much smaller than the world itself:
// these are things you only see at your feet, and sowing them to the
// horizon would be tens of thousands of boxes nobody can make out.
const RAZA_DETALIILOR = 30;

const CATE_FIRE_MAXIM   = 26000;
const CATE_FLORI_MAXIM  = 2600;
const CATE_PIETRE_MAXIM = 2600;
const CATE_APE_MAXIM    = 5000;

// Which letters have things growing on them, and how thickly. The
// rest - roads, water, stone floors, roofs - get nothing.
const CAT_CRESTE_PE = { '.': 6, f: 7, h: 4, s: 5, m: 3 };

const ajutorulDetaliilor = new THREE.Object3D();
const culoareaDetaliului = new THREE.Color();

function faPilaDeDetalii(geometrie, catIncap, optiuni) {
  const material = new THREE.MeshLambertMaterial(optiuni || {});
  const g = new THREE.InstancedMesh(geometrie, material, catIncap);
  g.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(catIncap * 3), 3);
  g.count = 0;
  g.frustumCulled = false;
  lumea.add(g);
  return g;
}

// TUFTS, not single blades - and this took two goes to get right.
//
// A blade of grass really is about five centimetres across and
// twenty tall, and at this scale that is what the first version
// drew. It looked nothing like grass: it looked like a field full
// of little green fence posts, because you cannot afford one box
// per real blade, and four posts to the square metre is a fence,
// not a lawn.
//
// So the fine grass is painted into the GROUND itself, up above,
// and these are the clumps that stand out of it: low, wide, turned
// every which way. Squat, which is the opposite of what seemed
// obvious, and right.
const firele = faPilaDeDetalii(new THREE.BoxGeometry(0.26, 0.12, 0.26), CATE_FIRE_MAXIM);
const floricelele = faPilaDeDetalii(new THREE.BoxGeometry(0.09, 0.07, 0.09), CATE_FLORI_MAXIM);
const pietricelele = faPilaDeDetalii(new THREE.BoxGeometry(0.17, 0.08, 0.15), CATE_PIETRE_MAXIM);

// Water lies as a thin skin just over the bed of the river, so you
// can see the bottom darkening through it.
const apele = faPilaDeDetalii(new THREE.PlaneGeometry(1, 1), CATE_APE_MAXIM, {
  map: texturaApei, transparent: true, opacity: 0.62, depthWrite: false
});
apele.renderOrder = 2;

const CULORILE_FLORILOR = [0xf2e27a, 0xe8788a, 0xd8d0e8, 0xf0a860, 0xe8e8e8];


// ----------------------------------------------------------
//  Sowing the ground around you
//
//  Called from construiesteLumea() every time the world is built
//  again, over the same patch of tiles.
//
//  Every position comes from the tile's own coordinates through
//  amestecul() - the same scrambler the ground colours use - so the
//  daisies in a particular corner of a particular field are in the
//  same place every single time you walk back to it. Real randomness
//  would make them jump about as you moved, which the eye catches
//  instantly and hates.
// ----------------------------------------------------------
function semanaDetaliile(cMijloc, rMijloc) {
  if (!zona) return;

  let nFire = 0, nFlori = 0, nPietre = 0, nApe = 0;

  const c0 = Math.max(0, cMijloc - RAZA_DETALIILOR);
  const c1 = Math.min(zona.COL - 1, cMijloc + RAZA_DETALIILOR);
  const r0 = Math.max(0, rMijloc - RAZA_DETALIILOR);
  const r1 = Math.min(zona.RND - 1, rMijloc + RAZA_DETALIILOR);

  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {

      const litera = zona.harta[r][c];
      const fel = feluTerenului(litera);
      if (!fel) continue;
      const jos = ADANCIMI[litera] || 0;

      // ---- the skin of water ----
      if (litera === 'W' && nApe < CATE_APE_MAXIM) {
        ajutorulDetaliilor.position.set(c, jos + 0.17, r);
        ajutorulDetaliilor.rotation.set(-Math.PI / 2, 0, 0);
        ajutorulDetaliilor.scale.set(1, 1, 1);
        ajutorulDetaliilor.updateMatrix();
        apele.setMatrixAt(nApe, ajutorulDetaliilor.matrix);
        culoareaDetaliului.setHex(fel.culoare).offsetHSL(0, 0.05, 0.14);
        apele.setColorAt(nApe, culoareaDetaliului);
        nApe++;
      }
      ajutorulDetaliilor.rotation.set(0, 0, 0);

      // (Tree trunks are NOT here. They belong to the world itself -
      // they are built alongside the crowns in construiesteLumea(),
      // out to the full ninety tiles. Put here, a wood thirty tiles
      // away would have been crowns floating with nothing holding
      // them up.)

      // ---- grass, flowers, pebbles ----
      const cat = CAT_CRESTE_PE[litera];
      if (!cat) continue;

      for (let i = 0; i < cat; i++) {
        const zar = amestecul(c * 31 + i * 7, r * 17 + i * 5);
        const zar2 = amestecul(c * 13 + i * 3, r * 29 + i * 11);

        // A little under half the chances come up empty, so the
        // ground is patchy rather than evenly furred.
        if (zar > 0.62) continue;

        const x = c - 0.5 + zar2;
        const z = r - 0.5 + amestecul(c * 5 + i, r * 23 + i);

        const ceva = amestecul(c + i * 101, r + i * 57);

        if (ceva < 0.028 && nPietre < CATE_PIETRE_MAXIM) {
          ajutorulDetaliilor.position.set(x, jos + 0.04, z);
          ajutorulDetaliilor.rotation.set(0, zar * 6.283, 0);
          ajutorulDetaliilor.scale.set(0.7 + zar2 * 0.8, 1, 0.7 + zar * 0.8);
          ajutorulDetaliilor.updateMatrix();
          pietricelele.setMatrixAt(nPietre, ajutorulDetaliilor.matrix);
          culoareaDetaliului.setHex(fel.culoare).offsetHSL(0, -0.34, 0.09);
          pietricelele.setColorAt(nPietre, culoareaDetaliului);
          nPietre++;
          ajutorulDetaliilor.rotation.set(0, 0, 0);
          continue;
        }

        if (nFire >= CATE_FIRE_MAXIM) continue;

        const inalt = 0.6 + zar2 * 0.9;
        ajutorulDetaliilor.position.set(x, jos + 0.05 * inalt, z);
        // Turned any old way, and leaning a little, so a field is
        // not a grid.
        ajutorulDetaliilor.rotation.set((zar - 0.31) * 0.35, zar2 * 6.283, (zar2 - 0.5) * 0.35);
        ajutorulDetaliilor.scale.set(0.55 + zar * 0.6, inalt, 0.55 + zar2 * 0.6);
        ajutorulDetaliilor.updateMatrix();
        firele.setMatrixAt(nFire, ajutorulDetaliilor.matrix);
        // Grass out of the ground's own colour, a shade deeper - so
        // a green field grows green and a red waste grows rust.
        culoareaDetaliului.setHex(fel.variatie === undefined ? fel.culoare : fel.variatie)
                          .offsetHSL((zar - 0.5) * 0.05, 0.07, -0.03 + zar2 * 0.12);
        firele.setColorAt(nFire, culoareaDetaliului);
        nFire++;
        ajutorulDetaliilor.rotation.set(0, 0, 0);

        // A flower on top of one blade in forty.
        if (ceva > 0.972 && nFlori < CATE_FLORI_MAXIM) {
          ajutorulDetaliilor.position.set(x, jos + 0.16 * inalt + 0.03, z);
          ajutorulDetaliilor.scale.set(1, 1, 1);
          ajutorulDetaliilor.updateMatrix();
          floricelele.setMatrixAt(nFlori, ajutorulDetaliilor.matrix);
          culoareaDetaliului.setHex(
            CULORILE_FLORILOR[Math.floor(zar2 * CULORILE_FLORILOR.length) %
                              CULORILE_FLORILOR.length]);
          floricelele.setColorAt(nFlori, culoareaDetaliului);
          nFlori++;
        }
      }
    }
  }

  [[firele, nFire], [floricelele, nFlori], [pietricelele, nPietre],
   [apele, nApe]].forEach(function (pereche) {
    const pila = pereche[0];
    pila.count = pereche[1];
    pila.instanceMatrix.needsUpdate = true;
    if (pila.instanceColor) pila.instanceColor.needsUpdate = true;
  });
}


// ----------------------------------------------------------
//  Water that moves
//
//  The ripples are not redrawn - the picture is simply slid along,
//  slowly, in both directions at once and at different speeds, which
//  is enough to read as a current. It costs two numbers a frame.
// ----------------------------------------------------------
function actualizeazaTexturile(acum) {
  texturaApei.offset.x = (acum / 26000) % 1;
  texturaApei.offset.y = (acum / 41000) % 1;
}
