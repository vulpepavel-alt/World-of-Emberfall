// ==========================================================
//  THE INTERFACE
//
//  Laid out the way an action-bar RPG has been laid out since the
//  nineties: your own frame top left, your target's beside it, a row
//  of numbered buttons along the bottom, a cast bar above them, the
//  map in a corner. That arrangement is a convention, like a
//  steering wheel being round - it is what a player's hands already
//  know, and an arrangement is not a picture.
//
//  EVERY PICTURE IN HERE IS DRAWN BY US, from shapes, in code. Not
//  one icon, border, frame, font or colour is taken from any other
//  game. The icons below are circles, triangles and lines arranged
//  per KIND of ability - a slash for a weapon blow, a flame for a
//  burn, rings for something that hits everything around you - each
//  on a lit stone tile drawn with gradients, and tinted with the
//  colour the ability already carries in abilitati.js.
//
//  The names on them come from texte.js and abilitati.js, which are
//  ours too. Nothing here needs anyone's permission.
//
//  THE FIRST BUTTON IS YOUR WEAPON. Not a spell: the swing of
//  whatever is in your main hand, drawn from that actual item, and
//  it starts and stops your auto-attack. That is where it has always
//  sat in this kind of game, and it is why abilities start at 2.
// ==========================================================


// ----------------------------------------------------------
//  The icons
//
//  One drawing per kind of ability, as a small SVG - the same way
//  the 2D game draws its item icons out of rectangles rather than
//  loading pictures. Everything scales and nothing is ever blurry.
// ----------------------------------------------------------
let numarulIcoanei = 0;     // so two gradients never share a name

function icoanaAbilitatii(ab) {
  const c = ab.culoare ? '#' + ab.culoare.toString(16).padStart(6, '0') : null;

  // A colour per kind, used when the ability has none of its own.
  const implicit = {
    lovitura:  '#c9ced8',   // steel
    sageata:   '#b8d08a',   // fletching green
    vraja:     '#6fa8e8',   // arcane blue
    vindecare: '#8fd48a',   // living green
    arsura:    '#e8863a',   // burning orange
    alinare:   '#9ad8c8',   // still water
    val:       '#d8b45a',   // shock gold
    intarire:  '#d8c07a',   // brass
    intrerupere: '#c8a0e0'  // broken violet
  }[ab.fel] || '#c9ced8';

  const culoare = c || implicit;
  const inchis = '#0e0b08';

  const forme = {
    // A slash across the tile.
    lovitura: '<path d="M7 25 L25 7" stroke="' + culoare + '" stroke-width="5" ' +
              'stroke-linecap="round" fill="none"/>' +
              '<path d="M11 27 L27 11" stroke="' + culoare + '" stroke-width="2" ' +
              'stroke-linecap="round" opacity="0.55" fill="none"/>',

    // An arrow, flying up and to the right.
    sageata: '<path d="M6 26 L26 6" stroke="' + culoare + '" stroke-width="3"/>' +
             '<path d="M26 6 L18 8 L24 14 Z" fill="' + culoare + '"/>' +
             '<path d="M6 26 L10 22" stroke="' + culoare + '" stroke-width="2" opacity="0.6"/>',

    // An orb with a light in it.
    vraja: '<circle cx="16" cy="16" r="9" fill="' + culoare + '" opacity="0.85"/>' +
           '<circle cx="13" cy="13" r="3.4" fill="#ffffff" opacity="0.55"/>' +
           '<circle cx="16" cy="16" r="11.5" fill="none" stroke="' + culoare +
           '" stroke-width="1.4" opacity="0.5"/>',

    // A leaf: mending, growing.
    vindecare: '<path d="M16 6 C24 11 24 21 16 26 C8 21 8 11 16 6 Z" fill="' + culoare +
               '" opacity="0.9"/><path d="M16 8 L16 24" stroke="' + inchis +
               '" stroke-width="1.4" opacity="0.5"/>',

    // A flame.
    arsura: '<path d="M16 5 C21 12 24 14 24 19 A8 8 0 0 1 8 19 C8 14 12 13 16 5 Z" fill="' +
            culoare + '" opacity="0.9"/>' +
            '<path d="M16 15 C18 18 19 19 19 21 A3 3 0 0 1 13 21 C13 19 15 18 16 15 Z" ' +
            'fill="#ffe9a8" opacity="0.8"/>',

    // A drop, falling slowly.
    alinare: '<path d="M16 5 C21 13 23 16 23 20 A7 7 0 0 1 9 20 C9 16 11 13 16 5 Z" fill="' +
             culoare + '" opacity="0.9"/>' +
             '<circle cx="14" cy="19" r="2.2" fill="#ffffff" opacity="0.45"/>',

    // Rings going outwards: everything around you.
    val: '<circle cx="16" cy="16" r="4" fill="' + culoare + '"/>' +
         '<circle cx="16" cy="16" r="8" fill="none" stroke="' + culoare +
         '" stroke-width="2" opacity="0.7"/>' +
         '<circle cx="16" cy="16" r="12" fill="none" stroke="' + culoare +
         '" stroke-width="1.5" opacity="0.4"/>',

    // A shield: something that holds.
    intarire: '<path d="M16 5 L26 9 C26 19 22 25 16 27 C10 25 6 19 6 9 Z" fill="' +
              culoare + '" opacity="0.85"/>' +
              '<path d="M16 9 L16 23" stroke="' + inchis + '" stroke-width="1.6" opacity="0.45"/>' +
              '<path d="M9 13 L23 13" stroke="' + inchis + '" stroke-width="1.6" opacity="0.45"/>',

    // A broken line: an interruption.
    intrerupere: '<path d="M6 16 L13 16" stroke="' + culoare + '" stroke-width="3.4" ' +
                 'stroke-linecap="round"/>' +
                 '<path d="M19 16 L26 16" stroke="' + culoare + '" stroke-width="3.4" ' +
                 'stroke-linecap="round"/>' +
                 '<path d="M17 7 L13 25" stroke="#ffe9a8" stroke-width="2.6" ' +
                 'stroke-linecap="round"/>'
  };

  return inRamaDePiatra(forme[ab.fel] || forme.lovitura, culoare);
}


// ----------------------------------------------------------
//  The tile an icon sits on
//
//  A flat square with a shape on it reads as a sticker. What it
//  needs is to look like a thing you could press: lit from above,
//  dark at the bottom, with a rim. All of that is two gradients and
//  two lines, drawn here.
// ----------------------------------------------------------
function inRamaDePiatra(desen, culoare) {
  const n = ++numarulIcoanei;

  return '<svg viewBox="0 0 32 32" width="100%" height="100%">' +
           '<defs>' +
             '<radialGradient id="f' + n + '" cx="0.35" cy="0.25" r="0.9">' +
               '<stop offset="0" stop-color="' + culoare + '" stop-opacity="0.34"/>' +
               '<stop offset="0.55" stop-color="' + culoare + '" stop-opacity="0.12"/>' +
               '<stop offset="1" stop-color="#000000" stop-opacity="0.45"/>' +
             '</radialGradient>' +
             '<linearGradient id="l' + n + '" x1="0" y1="0" x2="0" y2="1">' +
               '<stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>' +
               '<stop offset="0.45" stop-color="#ffffff" stop-opacity="0.02"/>' +
               '<stop offset="1" stop-color="#000000" stop-opacity="0.22"/>' +
             '</linearGradient>' +
           '</defs>' +
           '<rect width="32" height="32" fill="#191309"/>' +
           '<rect width="32" height="32" fill="url(#f' + n + ')"/>' +
           desen +
           '<rect width="32" height="32" fill="url(#l' + n + ')"/>' +
         '</svg>';
}


// ----------------------------------------------------------
//  The first button: your weapon
//
//  Drawn from the item actually in your main hand, through
//  formeleIconitei() in icoane.js - the same function that draws it
//  in your bag. Bare-handed, it is a fist.
// ----------------------------------------------------------
function icoanaAtacului() {
  const arma = (personaj.echipament || {}).armaPrincipala;

  if (arma && typeof icoanaObiectului === 'function') {
    try { return icoanaObiectului(arma); } catch (e) { /* fall through to the fist */ }
  }

  // No weapon: a fist.
  return inRamaDePiatra(
    '<rect x="9" y="12" width="14" height="10" rx="2.5" fill="#e0b48a"/>' +
    '<rect x="9" y="15" width="14" height="1.4" fill="#0e0b08" opacity="0.35"/>' +
    '<rect x="9" y="18" width="14" height="1.4" fill="#0e0b08" opacity="0.35"/>' +
    '<rect x="7" y="13.5" width="3" height="7" rx="1.5" fill="#cf9f77"/>',
    '#e0b48a');
}


// ----------------------------------------------------------
//  A portrait of whatever you are fighting
//
//  Out of the creature's own rectangles in mobi.js - the same list
//  its body in the world is built from. The box is worked out from
//  the shapes themselves rather than guessed, so a rat and a bear
//  both fill their frame instead of one being a speck and the other
//  spilling out of it.
// ----------------------------------------------------------
function portretulFapturii(forme) {
  if (!forme || !forme.length) return '';

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  forme.forEach(function (f) {
    const lat = (f.fel === 'cerc') ? f.r * 2 : f.w;
    const inalt = (f.fel === 'cerc') ? f.r * 2 : f.h;
    x0 = Math.min(x0, f.x - lat / 2);  x1 = Math.max(x1, f.x + lat / 2);
    y0 = Math.min(y0, f.y - inalt / 2); y1 = Math.max(y1, f.y + inalt / 2);
  });

  // A hair of air all round, and always square, so nothing is
  // stretched to fit.
  const latura = Math.max(x1 - x0, y1 - y0) * 1.12;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;

  const desen = forme.map(function (f) {
    if (f.fel === 'cerc') {
      return '<circle cx="' + f.x + '" cy="' + f.y + '" r="' + f.r +
             '" fill="' + f.culoare + '"/>';
    }
    return '<rect x="' + (f.x - f.w / 2) + '" y="' + (f.y - f.h / 2) +
           '" width="' + f.w + '" height="' + f.h + '" fill="' + f.culoare + '"/>';
  }).join('');

  return '<svg viewBox="' + (cx - latura / 2) + ' ' + (cy - latura / 2) + ' ' +
         latura + ' ' + latura + '" width="100%" height="100%">' + desen + '</svg>';
}


// ----------------------------------------------------------
//  Building the panels
//
//  Twelve buttons. The FIRST is your weapon swing; the other eleven
//  are personaj.bara, which is why the ability in bar slot 0 is
//  pressed with the 2 key.
// ----------------------------------------------------------
const TASTELE_BAREI = ['1','2','3','4','5','6','7','8','9','0','-','='];
const CODURILE_BAREI = ['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6',
                        'Digit7','Digit8','Digit9','Digit0','Minus','Equal'];

// Twelve buttons. Button 0 is the weapon, so ability slot n is
// button n + 1, and eleven of the twelve ability slots in
// personaj.bara can be reached from this bar. That is the same trade
// the bar in Warcraft makes: one of the twelve is your weapon.
const BUTOANE_PE_BARA = 12;
const BUTONUL_ATACULUI = 0;
const LOCURI_PE_BARA_3D = BUTOANE_PE_BARA - 1;

function butonulSlotului(loc) { return loc + 1; }
function slotulButonului(buton) { return buton - 1; }

let sloturileBarei = [];
let cutiaIncantarii = null;
let fisaAbilitatii = null;

function faInterfata() {

  const gazda = document.createElement('div');
  gazda.id = 'interfata';

  // ---- the action bar ----
  let bara = '<div id="bara-actiuni">';
  for (let i = 0; i < BUTOANE_PE_BARA; i++) {
    bara += '<div class="slot' + (i === BUTONUL_ATACULUI ? ' atacul' : '') +
              '" data-buton="' + i + '">' +
              '<div class="icoana"></div>' +
              '<div class="perdea"></div>' +
              '<div class="secunde"></div>' +
              '<div class="tasta">' + TASTELE_BAREI[i] + '</div>' +
            '</div>';
  }
  bara += '</div>';

  gazda.innerHTML =
    '<div id="incantare" class="ascuns"><span id="incantare-plina"></span>' +
      '<span id="incantare-nume"></span></div>' +
    bara +
    '<div id="fisa-abilitate" class="ascuns"></div>';

  document.body.appendChild(gazda);

  cutiaIncantarii = document.getElementById('incantare');
  fisaAbilitatii = document.getElementById('fisa-abilitate');

  sloturileBarei = Array.prototype.map.call(
    document.querySelectorAll('#bara-actiuni .slot'),
    function (el, i) {
      const s = {
        el: el,
        icoana: el.querySelector('.icoana'),
        perdea: el.querySelector('.perdea'),
        secunde: el.querySelector('.secunde'),
        buton: i,
        loc: slotulButonului(i),
        idAcum: null
      };
      el.addEventListener('click', function () { apasaButonulBarei(i); });
      el.addEventListener('mouseenter', function () { arataFisa(s); });
      el.addEventListener('mouseleave', function () { fisaAbilitatii.classList.add('ascuns'); });
      return s;
    });

  scrieBara();
}


function apasaButonulBarei(buton) {
  if (buton === BUTONUL_ATACULUI) {
    if (!tintaEVie()) urmatoareaTinta(false);
    comutaAtacul();
    return;
  }
  apasaLocul(slotulButonului(buton));
}


// What sits in a slot right now, at the rank you have learnt.
function abilitateaDinSlot(loc) {
  if (!personaj || !personaj.bara) return null;
  const id = personaj.bara[loc];
  if (!id) return null;
  const ab = gasesteAbilitatea(id);
  if (!ab || !personaj.stiute || !personaj.stiute[id]) return null;
  return abilitateaLaRang(ab, personaj.stiute[id]);
}


// Only redraws when what is in a slot actually changes - otherwise
// the browser would be rebuilding twelve pictures sixty times a
// second for nothing.
function scrieBara() {
  if (!sloturileBarei.length) return;
  sloturileBarei.forEach(function (s) {

    if (s.buton === BUTONUL_ATACULUI) {
      // The weapon changes when you change weapons, and not
      // otherwise. Its id is the item's own number.
      const arma = (personaj.echipament || {}).armaPrincipala;
      const id = 'arma:' + (arma ? arma.id : 'pumn');
      if (s.desenat && id === s.idAcum) return;
      s.desenat = true;
      s.idAcum = id;
      s.el.classList.remove('gol');
      s.icoana.innerHTML = icoanaAtacului();
      return;
    }

    const ab = abilitateaDinSlot(s.loc);
    const id = ab ? ab.id + ':' + ab.rangAcum : null;

    // 'idAcum' starts as null and an empty slot is also null, so
    // without the 'desenat' flag the very first pass over an empty
    // slot decided nothing had changed and skipped it - leaving all
    // twelve looking full when nine of them were empty.
    if (s.desenat && id === s.idAcum) return;
    s.desenat = true;
    s.idAcum = id;
    s.el.classList.toggle('gol', !ab);
    s.icoana.innerHTML = ab ? icoanaAbilitatii(ab) : '';
  });
}


function arataFisa(s) {
  let html;

  if (s.buton === BUTONUL_ATACULUI) {
    // The numbers come from armaDeAtac() in lupta.js - the same
    // function the fight itself asks, so the tooltip cannot say one
    // thing while the blows say another.
    const arma = armaDeAtac();
    html = '<b>' + TEXT.UI_ATTACK + '</b>' +
           '<i>' + arma.nume + ' · ' + arma.dmgMin + '–' + arma.dmgMax +
           ' · ' + arma.viteza.toFixed(1) + 's</i>' +
           '<p>' + TEXT.UI_ATTACK_DESC + '</p>';
  } else {
    const ab = abilitateaDinSlot(s.loc);
    if (!ab) return;
    const cost = ab.costRage ? ab.costRage + ' ' + TEXT.UI_RAGE.toLowerCase()
               : ab.costMana ? ab.costMana + ' ' + TEXT.UI_MANA.toLowerCase()
               : TEXT.UI_FREE;
    html = '<b>' + ab.nume + (ab.rangAcum > 1 ? ' ' + ab.rangAcum : '') + '</b>' +
           '<i>' + cost + (ab.incantare ? ' · ' + (ab.incantare / 1000) + 's cast' : ' · instant') +
           (ab.pauza ? ' · ' + (ab.pauza / 1000) + 's cooldown' : '') + '</i>' +
           '<p>' + (ab.descriere || '') + '</p>';
  }

  fisaAbilitatii.innerHTML = html;
  const r = s.el.getBoundingClientRect();
  fisaAbilitatii.classList.remove('ascuns');
  fisaAbilitatii.style.left = Math.max(8, Math.min(window.innerWidth - 240,
    r.left + r.width / 2 - 115)) + 'px';
  fisaAbilitatii.style.bottom = (window.innerHeight - r.top + 10) + 'px';
}


// ----------------------------------------------------------
//  Once a frame: cooldowns, whether you can afford it, the cast bar
// ----------------------------------------------------------
function actualizeazaInterfata(acum) {
  if (!personaj) return;
  if (!sloturileBarei.length) faInterfata();

  scrieBara();

  sloturileBarei.forEach(function (s) {

    if (s.buton === BUTONUL_ATACULUI) {
      // No dark curtain on the weapon: a swing timer is not a
      // cooldown, and showing one there would say you cannot press
      // it when you can. It lights up instead, while it is running.
      s.el.classList.toggle('pornit', !!luptiSingur);
      s.el.classList.remove('sarac');
      s.perdea.style.setProperty('--sweep', '0deg');
      s.secunde.textContent = '';
      return;
    }

    const ab = abilitateaDinSlot(s.loc);
    if (!ab) {
      s.perdea.style.setProperty('--sweep', '0deg');
      s.secunde.textContent = '';
      return;
    }

    // The dark wedge that sweeps round as the cooldown runs out -
    // a clock hand, which is what a cooldown IS. It used to be a
    // curtain sliding down, and a curtain tells you how much is
    // left but not how fast it is coming.
    const gataLa = pauzaAbilitatii(ab.id);
    const ramas = gataLa - acum;
    if (ramas > 0) {
      const tot = Math.max(ab.pauza || 0, PAUZA_GLOBALA);
      const parte = Math.min(1, ramas / tot);
      s.perdea.style.setProperty('--sweep', (parte * 360).toFixed(1) + 'deg');
      s.secunde.textContent = ramas > 1000 ? Math.ceil(ramas / 1000) : '';
    } else {
      s.perdea.style.setProperty('--sweep', '0deg');
      s.secunde.textContent = '';
    }

    s.el.classList.toggle('sarac', !aiCuCePlati(ab));
  });

  // The cast bar - which also shows gathering, because waiting for
  // an ore vein is the same thing to look at as waiting for a spell.
  const inCurs = incantareaInCurs ||
    ((typeof culesulInCurs3d !== 'undefined' && culesulInCurs3d)
      ? { dela: culesulInCurs3d.dela, cat: culesulInCurs3d.cat,
          nume: (NODURI[culesulInCurs3d.loc.fel] || {}).material || 'Gathering' }
      : null);

  if (inCurs) {
    const trecut = acum - inCurs.dela;
    const parte = Math.max(0, Math.min(1, trecut / inCurs.cat));
    cutiaIncantarii.classList.remove('ascuns');
    document.getElementById('incantare-plina').style.width = (parte * 100) + '%';
    document.getElementById('incantare-nume').textContent = inCurs.nume;
  } else {
    cutiaIncantarii.classList.add('ascuns');
  }
}


// The keys along the top of the keyboard. 1 is the weapon; 2 to =
// are the eleven ability slots.
window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  if (e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
  const buton = CODURILE_BAREI.indexOf(e.code);
  if (buton < 0 || buton >= BUTOANE_PE_BARA) return;
  e.preventDefault();
  apasaButonulBarei(buton);
});
