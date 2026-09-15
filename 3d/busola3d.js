// ==========================================================
//  THE QUEST ARROW
//
//  A single arrow at the top of the screen that points at whatever
//  the quest you are following wants next, with its name and how
//  far off it is. Straight up means straight ahead.
//
//  It does NOT walk you there and it does not draw a line on the
//  ground. It tells you which way to set off, and then you set off.
//
//  WHERE the arrow points is not worked out here. ghid-misiuni.js
//  has done that for the 2D game for a long time, and it is a good
//  deal cleverer than it looks: if what you need is in this zone it
//  finds the nearest one of them, and if it is three zones away it
//  walks the map of roads between zones and points you at the gate
//  you should leave by. That file now counts in TILES rather than
//  pixels, so both games can ask it the same question.
//
//  The two things it cannot know by itself - where you are standing
//  and what is alive right now - it asks for, and the answers are at
//  the bottom of this file. The 2D game's pair is in game.js.
// ==========================================================


let cutiaBusolei = null;
let sageataBusolei = null;
let tintaBusolei = null;
let urmatoareaCautareBusola = 0;
let misiuneaBusolei = null;
let stareaBusolei = null;
let aveaTinta = null;        // was an enemy frame showing last time?


function faBusola() {
  const el = document.createElement('div');
  el.id = 'busola';
  el.className = 'ascuns';
  el.innerHTML =
    '<div class="ac" id="acul-busolei">' +
      '<svg viewBox="0 0 24 24" width="100%" height="100%">' +
        '<path d="M12 2 L21 21 L12 16 L3 21 Z" fill="#ffd34d" ' +
              'stroke="#3b2c0d" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>' +
    '</div>' +
    '<div class="scrisul">' +
      '<div class="misiunea" id="busola-misiune"></div>' +
      '<div class="departe" id="busola-departe"></div>' +
    '</div>';

  document.body.appendChild(el);
  cutiaBusolei = el;
  sageataBusolei = document.getElementById('acul-busolei');

  // Clicking it opens the quest list, so you can follow another one.
  el.addEventListener('click', function () {
    if (typeof deschideMisiunile3d === 'function') deschideMisiunile3d();
  });

  asazaBusola();
  window.addEventListener('resize', asazaBusola);
}


// Where it can sit without landing on something else.
//
// It belongs in the middle of the top edge. On a wide screen there
// is room for it there, between your two frames on the left and the
// map on the right. On a narrow one there is not, and it sat on top
// of the enemy's health bar - so it drops to the line underneath
// instead. All three are MEASURED, not assumed: the top bar is as
// tall as its text wraps to, and the frames are as tall as the bars
// in them.
function asazaBusola() {
  if (!cutiaBusolei) return;

  const bara = document.getElementById('bara');
  const susulEcranului = (!bara || bara.classList.contains('ascuns'))
    ? 0 : bara.getBoundingClientRect().height;

  // The rightmost frame that is actually showing. With nothing
  // picked there is no enemy frame, and the middle is that much
  // wider.
  const cutiaTintei = document.getElementById('panou-tinta');
  const panou = (cutiaTintei && !cutiaTintei.classList.contains('ascuns'))
    ? cutiaTintei : document.getElementById('panou-tau');
  const colt = document.getElementById('coltul-hartii');

  // Hidden things measure zero, so fall back to what they are worth
  // when they are showing.
  const eraAscunsa = cutiaBusolei.classList.contains('ascuns');
  if (eraAscunsa) cutiaBusolei.classList.remove('ascuns');
  const latimea = cutiaBusolei.getBoundingClientRect().width || 220;
  if (eraAscunsa) cutiaBusolei.classList.add('ascuns');

  const stanga = (window.innerWidth - latimea) / 2;
  const capatulPanourilor = panou ? panou.getBoundingClientRect().right : 0;
  const inceputulHartii = colt ? colt.getBoundingClientRect().left : window.innerWidth;

  const incape = (stanga > capatulPanourilor + 10) &&
                 (stanga + latimea < inceputulHartii - 10);

  const inaltimeaPanourilor = panou ? panou.getBoundingClientRect().height : 0;
  cutiaBusolei.style.top =
    (susulEcranului + 8 + (incape ? 0 : inaltimeaPanourilor + 10)) + 'px';
}


function ascundeBusola() {
  if (cutiaBusolei) cutiaBusolei.classList.add('ascuns');
}


// ----------------------------------------------------------
//  Once every fifth of a second
//
//  Looking for the nearest wolf among thirteen hundred of them, and
//  sometimes walking the road map between fifty-two zones, is not
//  something to do sixty times a second. The answer is kept and
//  looked up again five times a second, or at once if you have
//  changed which quest you are following.
// ----------------------------------------------------------
function actualizeazaBusola(acum) {
  if (!cutiaBusolei) faBusola();
  if (!personaj || !zona) return ascundeBusola();

  // Turned off in the settings.
  if (typeof sageataPornita !== 'undefined' && !sageataPornita) return ascundeBusola();

  // Picking an enemy makes a second frame appear beside your own, so
  // where the arrow fits changes. Asking the class list costs
  // nothing; measuring would, so it is only measured when this
  // actually flips.
  const cutiaTintei = document.getElementById('panou-tinta');
  const areTinta = !!cutiaTintei && !cutiaTintei.classList.contains('ascuns');
  if (areTinta !== aveaTinta) { aveaTinta = areTinta; asazaBusola(); }

  // Not while you are dead, and not while the screen is fading from
  // one zone into the next.
  if ((typeof mortPanaLa !== 'undefined' && mortPanaLa) ||
      (typeof treceInCurs3d !== 'undefined' && treceInCurs3d)) return ascundeBusola();

  const m = misiuneaPentruGhid(personaj);
  if (!m) return ascundeBusola();

  const stare = starea(personaj, m.id);
  const schimbata = (misiuneaBusolei !== m.id) || (stareaBusolei !== stare);

  if (schimbata || acum >= urmatoareaCautareBusola) {
    const eu = casutaTa();
    tintaBusolei = eu ? tintaPentruGhid(m, personaj, zona, { x: eu.c, y: eu.r }, acum) : null;
    misiuneaBusolei = m.id;
    stareaBusolei = stare;
    urmatoareaCautareBusola = acum + 200;
  }

  if (!tintaBusolei) return ascundeBusola();

  const dx = tintaBusolei.x - jucator.position.x;
  const dz = tintaBusolei.y - jucator.position.z;
  const cat = Math.hypot(dx, dz);

  // Standing on it already: nothing useful left to point at.
  if (cat < 1.5) return ascundeBusola();

  // Which way that is ON SCREEN. The camera can be dragged off to
  // one side, so the arrow follows the CAMERA, not the direction
  // your character happens to be facing - otherwise you would swing
  // the view round and the arrow would lie to you.
  //
  // The camera sits at (sin u, cos u) from you and looks back, so
  // what it sees as straight ahead is (-sin u, -cos u), and its
  // right is a quarter turn from that: (cos u, -sin u).
  const sinU = Math.sin(unghi), cosU = Math.cos(unghi);
  const inainte = dx * (-sinU) + dz * (-cosU);
  const dreapta = dx * cosU + dz * (-sinU);

  sageataBusolei.style.transform =
    'rotate(' + (Math.atan2(dreapta, inainte) * 180 / Math.PI) + 'deg)';

  document.getElementById('busola-misiune').textContent =
    m.titlu + (stare === 'gata' ? ' — ' + TEXT.UI_QUEST_DONE : '');
  document.getElementById('busola-departe').textContent =
    TEXT.UI_STEPS.replace('{n}', Math.round(cat));

  cutiaBusolei.classList.remove('ascuns');
}


// ----------------------------------------------------------
//  THE TWO ANSWERS THE SHARED FILES ASK FOR
//
//  Both in tiles. In this world a tile IS the unit of distance and
//  the middle of tile (c, r) is exactly c, r - so there is nothing
//  to convert. The 2D game's copies of these, in game.js, divide by
//  32 and step half a tile in.
// ----------------------------------------------------------
function casutaTa() {
  if (!zona || !personaj) return null;
  return { c: jucator.position.x, r: jucator.position.z };
}

function viiInZona() {
  return {
    // The people standing about do not move in this world, so where
    // the zone's own table says they are IS where they are, and
    // ghid-misiuni.js falls back to that table on its own when this
    // list comes back empty.
    npci: [],

    // A monster's entry in zona.mobi is the monster - it carries its
    // own health and its own position once it has woken up. So the
    // key and the value are two views of one thing.
    mobi: new Map((zona.mobi || []).map(function (m) {
      return [m, { x: (m.x === undefined) ? m.col : m.x,
                   y: (m.z === undefined) ? m.rand : m.z,
                   viu: !esteMort(m) }];
    })),

    saci: (typeof sacuri === 'undefined' ? [] : sacuri).map(function (s) {
      return { x: s.x, y: s.z, prada: s.prada };
    })
  };
}
