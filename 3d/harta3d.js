// ==========================================================
//  THE MAP CORNER
//
//  Two maps, and only one of them is new.
//
//    1. THE SMALL MAP, top right. A square of the ground around
//       you, drawn from zona.harta - the very same row of letters
//       the world itself is built from - in the very same colours
//       the climate table gives those letters. So the small map
//       cannot drift out of step with the world: it IS the world,
//       one pixel to a tile.
//
//    2. THE WHOLE WORLD, when you click the small map or press M.
//       That one is not written here at all. harta.js has drawn it
//       for the 2D game for a long time: both continents, every
//       zone in its own colours, the roads between them, and any
//       single zone at full size. It is plain canvas drawing with
//       no Phaser in it anywhere, so the 3D page simply loads the
//       same file and calls deschideHarta().
//
//  The only thing harta.js could not know was where you are
//  standing - the 2D game keeps that in pixels on a sprite, this
//  one in tiles on a 3D object. So it asks casutaTa(), and each
//  game answers for itself. See the bottom of prototip.js.
// ==========================================================


const LATURA_MINIHARTII = 152;        // how big it is on screen
const CASUTE_PE_MINIHARTA = [26, 42, 68, 110];   // how much ground it shows
let treaptaMinihartii = 1;

let panzaMinihartii = null;
let desenulMinihartii = null;
let coltulHartii = null;
let urmatorulDesenAlHartii = 0;


// ----------------------------------------------------------
//  Building the corner
// ----------------------------------------------------------
function faColtulHartii() {
  const el = document.createElement('div');
  el.id = 'coltul-hartii';
  el.innerHTML =
    '<div class="nume-locului"><span id="numele-zonei"></span></div>' +
    '<div class="rama-hartii">' +
      '<canvas id="miniharta" width="' + LATURA_MINIHARTII +
        '" height="' + LATURA_MINIHARTII + '"></canvas>' +
      '<div class="nord">N</div>' +
      '<div class="lupa">' +
        '<button id="harta-mai-aproape" title="Closer">+</button>' +
        '<button id="harta-mai-departe" title="Further">&minus;</button>' +
      '</div>' +
    '</div>' +
    '<div class="sub-harta" id="sub-harta"></div>';

  document.body.appendChild(el);
  coltulHartii = el;

  panzaMinihartii = document.getElementById('miniharta');
  desenulMinihartii = panzaMinihartii.getContext('2d');

  // Clicking the map opens the big one, the way it does in every
  // game that has ever had a corner like this.
  panzaMinihartii.addEventListener('click', deschideHartaLumii);

  document.getElementById('harta-mai-aproape').addEventListener('click', function (e) {
    e.stopPropagation();
    treaptaMinihartii = Math.max(0, treaptaMinihartii - 1);
    urmatorulDesenAlHartii = 0;
  });
  document.getElementById('harta-mai-departe').addEventListener('click', function (e) {
    e.stopPropagation();
    treaptaMinihartii = Math.min(CASUTE_PE_MINIHARTA.length - 1, treaptaMinihartii + 1);
    urmatorulDesenAlHartii = 0;
  });

  asazaColtulHartii();
  window.addEventListener('resize', asazaColtulHartii);
}


// The bar along the top is as tall as its text needs, so its height
// is measured rather than guessed - the same reason the combat
// panels measure it. Guessing put the zone name behind it.
function asazaColtulHartii() {
  if (!coltulHartii) return;
  const bara = document.getElementById('bara');
  const inalt = (!bara || bara.classList.contains('ascuns'))
    ? 0 : bara.getBoundingClientRect().height;
  coltulHartii.style.top = (inalt + 8) + 'px';
}


// ----------------------------------------------------------
//  Opening the big map
// ----------------------------------------------------------
function deschideHartaLumii() {
  if (!zona || typeof deschideHarta !== 'function') return;
  if (typeof inchideFerestrele === 'function') inchideFerestrele();
  deschideHarta();
}

function hartaLumiiEDeschisa() {
  const el = document.getElementById('ecran-harta');
  return !!el && !el.classList.contains('ascuns');
}


// ----------------------------------------------------------
//  Drawing the small map
//
//  North is up and stays up. A map that spins as you turn is
//  harder to read, not easier - you lose the one thing a map is
//  for, which is knowing that the village is over THAT way. You
//  are the arrow, and the arrow turns instead.
// ----------------------------------------------------------
function culoareaCasutei(litera, c, r) {
  const fel = (zona.teren && zona.teren[litera]) || null;
  if (!fel) return '#000000';
  if (fel.variatie === undefined) return culoareCss(fel.culoare);

  // Same mixing the world itself does, so grass on the map is the
  // same grass you are standing on.
  const cat = amestecul(c, r);
  const a = fel.culoare, b = fel.variatie;
  const amesteca = function (deplasare) {
    const x = (a >> deplasare) & 255, y = (b >> deplasare) & 255;
    return Math.round(x + (y - x) * cat);
  };
  return 'rgb(' + amesteca(16) + ',' + amesteca(8) + ',' + amesteca(0) + ')';
}


function punctPeHarta(g, cx, cy, cat, x, z, culoare, marime) {
  const px = cx + (x - jucator.position.x) * cat;
  const py = cy + (z - jucator.position.z) * cat;
  if (px < -4 || py < -4 || px > LATURA_MINIHARTII + 4 || py > LATURA_MINIHARTII + 4) return;
  g.fillStyle = culoare;
  g.fillRect(px - marime / 2, py - marime / 2, marime, marime);
}


function deseneazaMiniharta() {
  if (!panzaMinihartii || !zona || !personaj) return;

  const g = desenulMinihartii;
  const casute = CASUTE_PE_MINIHARTA[treaptaMinihartii];
  const cat = LATURA_MINIHARTII / casute;          // pixels per tile
  const jum = casute / 2;

  const cJ = jucator.position.x, rJ = jucator.position.z;
  const c0 = Math.floor(cJ - jum), r0 = Math.floor(rJ - jum);

  // ---- the ground ----
  g.fillStyle = '#07090b';
  g.fillRect(0, 0, LATURA_MINIHARTII, LATURA_MINIHARTII);

  for (let r = r0; r <= r0 + casute; r++) {
    if (r < 0 || r >= zona.RND) continue;
    const rand = zona.harta[r];
    for (let c = c0; c <= c0 + casute; c++) {
      if (c < 0 || c >= zona.COL) continue;
      g.fillStyle = culoareaCasutei(rand[c], c, r);
      g.fillRect(Math.floor((c - cJ + jum) * cat), Math.floor((r - rJ + jum) * cat),
                 Math.ceil(cat), Math.ceil(cat));
    }
  }

  const cx = LATURA_MINIHARTII / 2, cy = LATURA_MINIHARTII / 2;

  // ---- the gates out of the zone ----
  (zona.treceri || []).forEach(function (tr) {
    punctPeHarta(g, cx, cy, cat, tr.col, tr.rand, '#8fd0ff', 6);
  });

  // ---- what can be picked up ----
  const acum = performance.now();
  (zona.noduri || []).forEach(function (loc) {
    if (typeof esteGolNodul === 'function' && esteGolNodul(loc, acum)) return;
    punctPeHarta(g, cx, cy, cat, loc.col, loc.rand, '#7fe0a0', 4);
  });

  // ---- people you can talk to ----
  (zona.npci || []).forEach(function (n) {
    punctPeHarta(g, cx, cy, cat, n.col, n.rand, '#ffd34d', 5);
  });

  // ---- things that would rather you left ----
  (zona.mobi || []).forEach(function (m) {
    if (typeof esteMort === 'function' && esteMort(m)) return;
    const x = (m.x === undefined) ? m.col : m.x;
    const z = (m.z === undefined) ? m.rand : m.z;
    if (Math.abs(x - cJ) > jum + 1 || Math.abs(z - rJ) > jum + 1) return;
    punctPeHarta(g, cx, cy, cat, x, z, m.suparat ? '#ff7060' : '#c04a3c', 4);
  });

  // ---- boxes left on the ground ----
  if (typeof sacuri !== 'undefined') {
    sacuri.forEach(function (s) {
      punctPeHarta(g, cx, cy, cat, s.x, s.z, '#ffe9a8', 5);
    });
  }

  // ---- you ----
  g.save();
  g.translate(cx, cy);
  // Facing is (sin f, cos f) in the world, and the map lays x across
  // and z down, so that vector is already the screen direction.
  g.rotate(Math.atan2(Math.cos(fataJucatorului), Math.sin(fataJucatorului)));
  g.fillStyle = '#ffffff';
  g.strokeStyle = '#16120c';
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(7, 0); g.lineTo(-5, -5); g.lineTo(-2, 0); g.lineTo(-5, 5);
  g.closePath();
  g.fill(); g.stroke();
  g.restore();
}


// ----------------------------------------------------------
//  Once every sixth of a second - not sixty times
// ----------------------------------------------------------
function actualizeazaHarta3d(acum) {
  if (!coltulHartii) faColtulHartii();
  if (!zona) return;
  if (acum < urmatorulDesenAlHartii) return;
  urmatorulDesenAlHartii = acum + 160;

  deseneazaMiniharta();

  document.getElementById('numele-zonei').textContent = zona.nume || '';

  // Underneath: where in the zone you are, and how much of the zone
  // the little square is showing.
  document.getElementById('sub-harta').textContent =
    Math.round(jucator.position.x) + ', ' + Math.round(jucator.position.z);
}


// M for the whole world, as in the 2D game. Escape shuts it too -
// that one key is handled in the one place, at the bottom of
// prada3d.js, so the two of them cannot fight over it.
window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  if (e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;

  if (e.code === 'KeyM') {
    if (hartaLumiiEDeschisa()) inchideHarta();
    else deschideHartaLumii();
  }
});
