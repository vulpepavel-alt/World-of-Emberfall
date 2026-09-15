// ==========================================================
//  PLAYING ON A COMPUTER
//
//  The game was built for a phone: a joystick in the bottom-left
//  corner and round buttons you press with a thumb. On a computer
//  none of that is needed - you have a keyboard and a mouse, and
//  the joystick only covers up a piece of the world.
//
//  So: on a computer the joystick is hidden and the keys do the
//  walking. The round buttons stay, because a mouse can click them
//  just as well as a thumb can press them.
//
//  The game does not ask you which one you are on. It asks the
//  browser, and it changes its mind the moment a real finger
//  touches the screen - which is what happens on a laptop that
//  also has a touch screen.
//
//  NOTE ON LANGUAGE: from 15 September 2026 new files are written
//  in English. The older files stay in Romanian; changing 30.000
//  lines now would only make them harder to read.
// ==========================================================

// Does this browser have a mouse? "pointer: fine" means a pointing
// device that can hit a small target - a mouse or a trackpad. A
// finger is "coarse", because a fingertip covers a lot of screen.
function areMouse() {
  try {
    return window.matchMedia('(pointer: fine)').matches;
  } catch (e) {
    return true;   // old browser: assume computer, the keys still work
  }
}

// Starts as "not decided yet". Set once the game scene is built.
let joystickulSeVede = true;

function seVedeJoystickul() {
  return joystickulSeVede;
}

function aratJoystickul(daNu) {
  joystickulSeVede = !!daNu;
  if (!joystickulSeVede) lasaJoystick();   // drop any direction it was holding
  pieseleJoystickului.forEach(function (p) { p.setVisible(joystickulSeVede); });
}


// ----------------------------------------------------------
//  The list of keys
//
//  With the joystick gone, nothing on screen says how to walk.
//  So there is a card with every key on it. It shows itself once,
//  the first time you play on a computer, and after that it is on
//  the K key. The hint in the corner stays, small.
//
//  K, not H: H already opens the world map, and M already opens the
//  menu. Those two were never written down anywhere, so they are on
//  the card as well.
// ----------------------------------------------------------
const CHEIA_AJUTOR_VAZUT = 'joc-rpg-taste-vazute';

let cartonasulTastelor = null;

function faCartonasulTastelor(scena) {

  const randuri = [
    TEXT.KEYS_MOVE,
    TEXT.KEYS_CLICK,
    TEXT.KEYS_ATTACK,
    TEXT.KEYS_ABILITY,
    TEXT.KEYS_TARGET,
    TEXT.KEYS_TEAM,
    TEXT.KEYS_MENU,
    TEXT.KEYS_ESCAPE
  ];

  const lat = 420;
  const inalt = 44 + randuri.length * 22 + 26;
  const x = LATIME / 2;
  const y = INALTIME / 2;

  const cutie = scena.add.container(x, y).setScrollFactor(0).setDepth(2000);

  cutie.add(scena.add.rectangle(0, 0, lat + 6, inalt + 6, UI.alamaInchisa, 0.95));
  cutie.add(scena.add.rectangle(0, 0, lat, inalt, UI.piatra, 0.97)
    .setStrokeStyle(2, UI.alama));

  cutie.add(scena.add.text(0, -inalt / 2 + 14, TEXT.KEYS_TITLE, {
    fontFamily: UI.FONT, fontSize: '15px', color: UI.textAuriu
  }).setOrigin(0.5, 0));

  randuri.forEach(function (rand, i) {
    cutie.add(scena.add.text(-lat / 2 + 20, -inalt / 2 + 44 + i * 22, rand, {
      fontFamily: UI.FONT, fontSize: '12px', color: UI.text
    }).setOrigin(0, 0));
  });

  cutie.add(scena.add.text(0, inalt / 2 - 20, TEXT.KEYS_CLOSE, {
    fontFamily: UI.FONT, fontSize: '11px', color: UI.textStins
  }).setOrigin(0.5, 0));

  cutie.setVisible(false);
  cartonasulTastelor = cutie;
}


function intoarceCartonasulTastelor() {
  if (!cartonasulTastelor) return;
  cartonasulTastelor.setVisible(!cartonasulTastelor.visible);
  if (cartonasulTastelor.visible) {
    try { localStorage.setItem(CHEIA_AJUTOR_VAZUT, '1'); } catch (e) { /* nothing to do */ }
  }
}


// ----------------------------------------------------------
//  Wiring it all up. Called from create(), right after the
//  joystick has been built.
// ----------------------------------------------------------
function pregatesteCalculatorul(scena) {

  aratJoystickul(!areMouse());

  faCartonasulTastelor(scena);

  // The small hint in the bottom-left corner, where the joystick
  // used to be. Only on a computer - on a phone it would be a lie.
  // It sits on grass, on stone, on water - so it carries its own
  // dark backing, otherwise it disappears against half the world.
  const semn = scena.add.text(12, INALTIME - 22, TEXT.KEYS_HINT, {
    fontFamily: UI.FONT, fontSize: '11px', color: UI.textAuriu,
    backgroundColor: '#14100c', padding: { x: 6, y: 3 }
  }).setScrollFactor(0).setDepth(1000).setAlpha(0.85).setVisible(!seVedeJoystickul());

  scena.input.keyboard.on('keydown-K', intoarceCartonasulTastelor);

  // Right-clicking inside a page normally opens the browser's own
  // little menu (Back, Reload, Save image as...). Over a game that
  // is only in the way.
  if (scena.game.canvas) {
    scena.game.canvas.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  }

  // A laptop can have both a mouse and a touch screen. The first
  // time a real finger lands on the game, the joystick comes back.
  scena.input.on('pointerdown', function (pointer) {
    if (pointer.pointerType === 'touch' && !seVedeJoystickul()) {
      aratJoystickul(true);
      semn.setVisible(false);
      if (cartonasulTastelor) cartonasulTastelor.setVisible(false);
    }
  });

  // First time on a computer: show the card by itself, so nobody
  // has to guess that H exists.
  let vazut = false;
  try { vazut = !!localStorage.getItem(CHEIA_AJUTOR_VAZUT); } catch (e) { vazut = false; }
  if (!seVedeJoystickul() && !vazut) intoarceCartonasulTastelor();
}
