// ==========================================================
//  THE CONTROLS
//
//  Every key and every mouse button for the 3D world, in ONE file.
//  They were spread across three before, and it showed: Escape both
//  dropped your target AND threw the settings window open, because
//  two files were listening for it and neither knew about the other.
//
//  The scheme is the one Warcraft has used since 2004, because it is
//  what hands already know. A scheme is not artwork - this is the
//  arrangement of the controls, the way a car's pedals are always in
//  the same order. Not one picture, name or line of text is taken
//  from anywhere.
//
//    W / S            walk forward and back
//    A / D            TURN left and right
//    Q / E            step sideways without turning
//    Space            jump
//    X                sit down and get up
//
//    left drag        swing the view around you. You do not turn -
//                     you can look at where you came from while
//                     still walking away from it.
//    right drag       turn YOURSELF. The view stays at your back,
//                     and while the right button is held A and D
//                     step sideways instead of turning.
//    both buttons     walk forward
//    wheel            closer or further away
//
//    left click       pick something
//    right click      pick it AND go at it - an enemy gets hit, a
//                     person gets talked to, a box gets opened
//
//    Tab              nearest enemy IN FRONT of you, then the next
//    Shift+Tab        the one before
//    Escape           shuts a window, or drops your target, or -
//                     with nothing to shut and nothing picked -
//                     opens the menu
//
//  Auto-attack is a switch, not a button you hammer. Once it is on
//  you keep swinging on your weapon's own timer until the thing dies
//  or you turn it off. Out of reach you do not swing and it says so,
//  once, rather than going quiet and leaving you wondering.
// ==========================================================


// ----------------------------------------------------------
//  The mouse
// ----------------------------------------------------------
const PAS_INVARTIRII = 0.005;     // radians per pixel dragged sideways
const PAS_INCLINARII = 0.004;
const CAT_E_O_APASARE = 5;        // pixels: more than this and it was a drag

let butoaneleMouse = { stanga: false, dreapta: false };
let deUndeAmTras = null;
let ultimulXMouse = 0, ultimulYMouse = 0;
let amTrasDeCand = 0;

// The right button is the turning button, so the browser's own menu
// must not appear on top of it.
randator.domElement.addEventListener('contextmenu', function (e) { e.preventDefault(); });

randator.domElement.addEventListener('pointerdown', function (e) {
  if (e.button === 0) butoaneleMouse.stanga = true;
  if (e.button === 2) butoaneleMouse.dreapta = true;
  deUndeAmTras = { x: e.clientX, y: e.clientY, buton: e.button };
  amTrasDeCand = 0;
  ultimulXMouse = e.clientX;
  ultimulYMouse = e.clientY;
  try { randator.domElement.setPointerCapture(e.pointerId); } catch (err) { /* nothing to do */ }
});

randator.domElement.addEventListener('pointermove', function (e) {
  const stanga = (e.buttons & 1) !== 0;
  const dreapta = (e.buttons & 2) !== 0;
  butoaneleMouse.stanga = stanga;
  butoaneleMouse.dreapta = dreapta;
  if (!stanga && !dreapta) return;

  const dx = e.clientX - ultimulXMouse;
  const dy = e.clientY - ultimulYMouse;
  ultimulXMouse = e.clientX;
  ultimulYMouse = e.clientY;
  amTrasDeCand += Math.abs(dx) + Math.abs(dy);

  // Both of them swing the view. The difference is whether YOU turn
  // with it: on the right button you do, which is what makes the
  // right button the steering wheel.
  unghi -= dx * PAS_INVARTIRII;
  if (dreapta) fataJucatorului -= dx * PAS_INVARTIRII;

  inclinare = Math.max(0.05, Math.min(1.2, inclinare + dy * PAS_INCLINARII));
});

randator.domElement.addEventListener('pointerup', function (e) {
  if (e.button === 0) butoaneleMouse.stanga = false;
  if (e.button === 2) butoaneleMouse.dreapta = false;
  try { randator.domElement.releasePointerCapture(e.pointerId); } catch (err) { /* nothing */ }

  const aFostApasare = deUndeAmTras &&
    Math.hypot(e.clientX - deUndeAmTras.x, e.clientY - deUndeAmTras.y) <= CAT_E_O_APASARE &&
    amTrasDeCand <= CAT_E_O_APASARE * 3;
  const butonul = deUndeAmTras ? deUndeAmTras.buton : -1;
  deUndeAmTras = null;

  if (!aFostApasare || !personaj || !zona) return;
  if (e.target !== randator.domElement) return;    // a button or a menu, not the world

  if (butonul === 0) apasaCuStanga(e);
  else if (butonul === 2) apasaCuDreapta(e);
});

// Letting go of the window must not leave a button stuck down, or
// you would walk forward for ever with nothing held.
window.addEventListener('blur', function () {
  butoaneleMouse.stanga = false;
  butoaneleMouse.dreapta = false;
  deUndeAmTras = null;
});

// The wheel runs all the way in to nothing, and the last notch puts
// you inside your own head - see prototip.js. Warcraft does the
// same, and it is worth having: it is the only way to properly look
// up at a thing.
randator.domElement.addEventListener('wheel', function (e) {
  e.preventDefault();
  departare = Math.max(0, Math.min(24, departare + e.deltaY * 0.01));
}, { passive: false });


// ----------------------------------------------------------
//  The view settling back behind you
//
//  Left-dragging swings the view round and LEAVES it there, which is
//  what you want while you are standing still looking at something.
//  It is not what you want the moment you walk off: you then spend
//  the whole journey looking at your own shoulder.
//
//  So walking FORWARD eases the view back behind you. Only forward -
//  backing up and stepping sideways leave it alone, because those
//  are the times you are deliberately watching something that is not
//  in front of you. And never while a button is held down, because
//  then you are aiming it by hand and it should stay where you put
//  it. It can be turned off in the settings.
// ----------------------------------------------------------
const VITEZA_REVENIRII = 2.4;     // radians a second

function asazaCameraLaSpate(delta, mergiInainte) {
  if (typeof urmarireCamera !== 'undefined' && !urmarireCamera) return;
  if (butoaneleMouse.stanga || butoaneleMouse.dreapta) return;
  if (!mergiInainte) return;

  // The shortest way round. Both numbers grow without limit as you
  // turn, so the difference has to be folded back into half a turn
  // either way, or the view would take the long way round the houses.
  let cat = (fataJucatorului + Math.PI) - unghi;
  while (cat >  Math.PI) cat -= Math.PI * 2;
  while (cat < -Math.PI) cat += Math.PI * 2;

  if (Math.abs(cat) < 0.003) { unghi += cat; return; }
  unghi += Math.sign(cat) * Math.min(Math.abs(cat), VITEZA_REVENIRII * delta);
}


// ----------------------------------------------------------
//  What the line from your mouse went through
//
//  Three.js shoots a line from where you clicked into the world and
//  says what it passed through. We ask it about monsters, people and
//  boxes at once, and take whichever is nearest the camera - so
//  clicking a wolf standing in front of the innkeeper picks the
//  wolf, not the innkeeper behind them.
// ----------------------------------------------------------
const razaApasarii = new THREE.Raycaster();
const puncteleMouse = new THREE.Vector2();

function ceAiSubMouse(ev) {
  puncteleMouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  puncteleMouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
  razaApasarii.setFromCamera(puncteleMouse, camera);

  const deCautat = [];

  fapturiDeFata.forEach(function (grup, intrare) {
    const eMob = (zona.mobi || []).indexOf(intrare) >= 0;
    const eOm = (zona.npci || []).indexOf(intrare) >= 0;
    if (!eMob && !eOm) return;
    grup.lucrul = { fel: eMob ? 'mob' : 'om', intrare: intrare };
    deCautat.push(grup);
  });

  if (typeof sacuri !== 'undefined') {
    sacuri.forEach(function (s) {
      s.cutie.lucrul = { fel: 'sac', intrare: s };
      deCautat.push(s.cutie);
    });
  }

  if (typeof noduriDeFata3d !== 'undefined') {
    noduriDeFata3d.forEach(function (grup, loc) {
      grup.lucrul = { fel: 'nod', intrare: loc };
      deCautat.push(grup);
    });
  }

  const lovite = razaApasarii.intersectObjects(deCautat, true);
  for (const l of lovite) {
    let o = l.object;
    while (o && !o.lucrul) o = o.parent;
    if (o && o.lucrul) return o.lucrul;
  }
  return null;
}


// Left: pick it, and nothing more. Clicking bare ground drops what
// you had picked, the same as clicking away from it does.
function apasaCuStanga(ev) {
  const lucrul = ceAiSubMouse(ev);
  if (lucrul && lucrul.fel === 'mob') { alegeTinta(lucrul.intrare); return; }
  alegeTinta(null);
}


// Right: pick it AND do the obvious thing to it.
function apasaCuDreapta(ev) {
  const lucrul = ceAiSubMouse(ev);
  if (!lucrul) return;

  if (lucrul.fel === 'mob') { alegeTinta(lucrul.intrare); incepeAtacul(); return; }

  // Everything else has to be within arm's reach, the same reach F
  // uses. Right-clicking a shopkeeper across the village should walk
  // you there, and nothing here walks you anywhere yet, so it says
  // so instead of opening a stall you are nowhere near.
  const unde = (lucrul.fel === 'sac')
    ? { x: lucrul.intrare.x, z: lucrul.intrare.z }
    : { x: lucrul.intrare.col, z: lucrul.intrare.rand };
  const cat = Math.hypot(unde.x - jucator.position.x, unde.z - jucator.position.z);

  const raza = (lucrul.fel === 'sac') ? RAZA_LUARII
             : (lucrul.fel === 'nod') ? RAZA_CULESULUI : RAZA_VORBIRII;
  if (cat > raza) { spuneCeva(TEXT.TARGET_TOO_FAR); return; }

  if (lucrul.fel === 'sac') deschideSacul(lucrul.intrare);
  else if (lucrul.fel === 'nod') incepeCulesul3d(lucrul.intrare);
  else vorbesteCu(lucrul.intrare);
}


// ----------------------------------------------------------
//  Where you are trying to go
//
//  Read once a frame by prototip.js. Nothing here moves you; it only
//  says what you are asking for.
// ----------------------------------------------------------
function intentiaDeMers() {
  let inainte = 0, lateral = 0, intoarcere = 0;

  if (tasta(['KeyW', 'ArrowUp']))   inainte += 1;
  if (tasta(['KeyS', 'ArrowDown'])) inainte -= 1;

  // Holding both buttons walks you forward. It is how you cross a
  // field with one hand while steering with the same hand.
  if (butoaneleMouse.stanga && butoaneleMouse.dreapta) inainte += 1;

  if (tasta(['KeyQ'])) lateral -= 1;
  if (tasta(['KeyE'])) lateral += 1;

  // A and D turn you - unless the right button is down, in which
  // case the mouse is already doing the turning and they step
  // sideways instead. A becomes Q and D becomes E.
  const stangaDreapta = (tasta(['KeyA', 'ArrowLeft']) ? 1 : 0) -
                        (tasta(['KeyD', 'ArrowRight']) ? 1 : 0);
  if (butoaneleMouse.dreapta) lateral -= stangaDreapta;
  else intoarcere += stangaDreapta;

  return {
    inainte: Math.max(-1, Math.min(1, inainte)),
    lateral: Math.max(-1, Math.min(1, lateral)),
    intoarcere: intoarcere
  };
}


// ----------------------------------------------------------
//  Jumping
//
//  It changes nothing about the game and that is the point: it is
//  what a world feels like when it answers you. You cannot jump over
//  anything, you cannot jump while dead, and you cannot jump twice.
// ----------------------------------------------------------
const AVANTUL_SARITURII = 4.6;      // tiles per second, upwards
const GREUTATEA = 14;               // tiles per second per second

let vitezaSaritura = 0;
let inAer = false;

function sariInSus() {
  if (inAer) return;
  if (typeof mortPanaLa !== 'undefined' && mortPanaLa) return;
  if (typeof stauJos !== 'undefined' && stauJos) { ridicaTe(); return; }
  vitezaSaritura = AVANTUL_SARITURII;
  inAer = true;
}

// Called from the frame, with the height of the ground under you.
// Off the ground you fall; on it you follow the lie of the land,
// gently, so that hills do not snap you upwards.
function urcaSauCoboara(delta, sol) {
  if (inAer) {
    vitezaSaritura -= GREUTATEA * delta;
    jucator.position.y += vitezaSaritura * delta;
    if (jucator.position.y <= sol) {
      jucator.position.y = sol;
      vitezaSaritura = 0;
      inAer = false;
    }
    return;
  }
  jucator.position.y += (sol - jucator.position.y) * Math.min(1, delta * 9);
}


// ----------------------------------------------------------
//  Picking things with Tab
//
//  In front of you first, and never through a wall. Both of those
//  matter: tabbing onto a wolf standing behind your back, or onto
//  one inside a house you are outside of, is the kind of thing that
//  makes a game feel like it is not listening.
// ----------------------------------------------------------
const UNGHIUL_DIN_FATA = Math.PI * 0.42;   // about 75 degrees either side
const RAZA_ALEGERII = 30;                  // tiles

// Is there a clear line from you to there? Walked in short steps,
// the same way the camera checks what it would end up inside of.
function veziPana(x, z) {
  const dx = x - jucator.position.x, dz = z - jucator.position.z;
  const lung = Math.hypot(dx, dz);
  const pasi = Math.max(2, Math.ceil(lung / 0.6));
  for (let i = 1; i < pasi; i++) {
    const t = i / pasi;
    const c = Math.round(jucator.position.x + dx * t);
    const r = Math.round(jucator.position.z + dz * t);
    if (inaltimeaObstacolului(c, r) >= 1.2) return false;
  }
  return true;
}

function urmatoareaTinta(inapoi) {
  if (!zona || !personaj) return;

  const x = jucator.position.x, z = jucator.position.z;
  const sin = Math.sin(fataJucatorului), cos = Math.cos(fataJucatorului);

  const toate = [];
  (zona.mobi || []).forEach(function (m) {
    if (esteMort(m)) return;
    const p = pozitiaFapturii(m);
    const dx = p.x - x, dz = p.z - z;
    const cat = Math.hypot(dx, dz);
    if (!cat || cat > RAZA_ALEGERII) return;

    // How far off straight ahead it is. Facing is (sin, cos), so the
    // dot product of the two divided by the distance is the cosine
    // of the angle between them.
    const catreFata = (dx * sin + dz * cos) / cat;
    if (!veziPana(p.x, p.z)) return;
    toate.push({ m: m, cat: cat, inFata: catreFata >= Math.cos(UNGHIUL_DIN_FATA) });
  });

  if (!toate.length) { alegeTinta(null); return; }

  // Those in front, nearest first; then the rest, nearest first. So
  // Tab walks outwards from what is under your nose, and only turns
  // round to look behind you once it has run out of things ahead.
  toate.sort(function (a, b) {
    if (a.inFata !== b.inFata) return a.inFata ? -1 : 1;
    return a.cat - b.cat;
  });

  const lista = toate.map(function (t) { return t.m; });
  const acum = lista.indexOf(tinta);
  const pas = inapoi ? -1 : 1;
  const urmatorul = (acum < 0)
    ? (inapoi ? lista.length - 1 : 0)
    : (acum + pas + lista.length) % lista.length;

  alegeTinta(lista[urmatorul]);
}


// ----------------------------------------------------------
//  Auto-attack
// ----------------------------------------------------------
function incepeAtacul() {
  if (typeof mortPanaLa !== 'undefined' && mortPanaLa) return;
  if (!tintaEVie()) { spuneCeva(TEXT.NO_TARGET); return; }
  luptiSingur = true;
  // Turn to face it the moment you commit, not on the first swing -
  // otherwise you stand side-on to the thing for a second and a
  // half and it looks like nothing happened.
  const p = pozitiaFapturii(tinta);
  fataJucatorului = Math.atan2(p.x - jucator.position.x, p.z - jucator.position.z);
}

function opresteAtacul() {
  luptiSingur = false;
}

function comutaAtacul() {
  if (luptiSingur) opresteAtacul();
  else incepeAtacul();
}


// ----------------------------------------------------------
//  The keys
// ----------------------------------------------------------
function scriemUndeva(e) {
  return e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
}

window.addEventListener('keydown', function (e) {
  if (!personaj || !zona || scriemUndeva(e)) return;

  // Tab: the next enemy in front. Shift+Tab: the one before.
  if (e.code === 'Tab') {
    e.preventDefault();
    urmatoareaTinta(e.shiftKey);
    return;
  }

  if (e.code === 'Space') { e.preventDefault(); sariInSus(); return; }

  // Start and stop swinging. In Warcraft this sits on the action bar
  // rather than on a key of its own, and our bar holds abilities, so
  // it gets a key - and the right mouse button, which is how you
  // will actually do it.
  if (e.code === 'KeyT') {
    if (!tintaEVie()) urmatoareaTinta(false);
    comutaAtacul();
    return;
  }

  if (e.code === 'KeyX') { comutaStatul(); return; }

  // Escape, all of it in one place and in this order: shut what is
  // open, then drop what is picked, and only with nothing open and
  // nothing picked does it mean "I want the menu".
  if (e.code === 'Escape') {
    if (cutiaFerestrei && !cutiaFerestrei.classList.contains('ascuns')) {
      inchideFerestrele();
      return;
    }
    if (typeof hartaLumiiEDeschisa === 'function' && hartaLumiiEDeschisa()) {
      inchideHarta();
      return;
    }
    if (luptiSingur || tinta) { opresteAtacul(); alegeTinta(null); return; }
    if (typeof deschidePagina3d === 'function') deschidePagina3d('setari');
  }
});
