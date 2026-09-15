// ==========================================================
//  THE INTERFACE
//
//  Laid out the way an action-bar RPG has been laid out since the
//  nineties: your own frame top left, your target's beside it, a
//  row of numbered buttons along the bottom, a cast bar above them.
//  That arrangement is a convention, like a steering wheel being
//  round - it is what a player's hands already know.
//
//  EVERY PICTURE IN HERE IS DRAWN BY US, from shapes, in code. Not
//  one icon, border, font or colour is taken from any other game.
//  The icons below are circles, triangles and lines arranged per
//  KIND of ability - a slash for a weapon blow, a flame for a burn,
//  rings for something that hits everything around you - and tinted
//  with the colour the ability already carries in abilitati.js.
//
//  The names on them come from texte.js and abilitati.js, which are
//  ours too. Nothing here needs anyone's permission.
// ==========================================================


// ----------------------------------------------------------
//  The icons
//
//  One drawing per kind of ability, as a small SVG - the same way
//  the 2D game draws its item icons out of rectangles rather than
//  loading pictures. Everything scales and nothing is ever blurry.
// ----------------------------------------------------------
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

  const desen = forme[ab.fel] || forme.lovitura;

  return '<svg viewBox="0 0 32 32" width="100%" height="100%">' +
           '<rect width="32" height="32" fill="#1b1610"/>' +
           '<rect width="32" height="32" fill="' + culoare + '" opacity="0.13"/>' +
           desen +
         '</svg>';
}


// ----------------------------------------------------------
//  Building the panels
// ----------------------------------------------------------
const TASTELE_BAREI = ['1','2','3','4','5','6','7','8','9','0','-','='];
const CODURILE_BAREI = ['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6',
                        'Digit7','Digit8','Digit9','Digit0','Minus','Equal'];

let sloturileBarei = [];
let cutiaIncantarii = null;
let fisaAbilitatii = null;

function faInterfata() {

  const gazda = document.createElement('div');
  gazda.id = 'interfata';

  // ---- the action bar ----
  let bara = '<div id="bara-actiuni">';
  for (let i = 0; i < LOCURI_IN_BARA; i++) {
    bara += '<div class="slot" data-loc="' + i + '">' +
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
        loc: i,
        idAcum: null
      };
      el.addEventListener('click', function () { apasaLocul(i); });
      el.addEventListener('mouseenter', function () { arataFisa(s); });
      el.addEventListener('mouseleave', function () { fisaAbilitatii.classList.add('ascuns'); });
      return s;
    });

  scrieBara();
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
  const ab = abilitateaDinSlot(s.loc);
  if (!ab) return;
  const cost = ab.costRage ? ab.costRage + ' rage'
             : ab.costMana ? ab.costMana + ' mana' : 'free';
  fisaAbilitatii.innerHTML =
    '<b>' + ab.nume + (ab.rangAcum > 1 ? ' ' + ab.rangAcum : '') + '</b>' +
    '<i>' + cost + (ab.incantare ? ' · ' + (ab.incantare / 1000) + 's cast' : ' · instant') +
    (ab.pauza ? ' · ' + (ab.pauza / 1000) + 's cooldown' : '') + '</i>' +
    '<p>' + (ab.descriere || '') + '</p>';
  const r = s.el.getBoundingClientRect();
  fisaAbilitatii.classList.remove('ascuns');
  fisaAbilitatii.style.left = Math.max(8, r.left + r.width / 2 - 110) + 'px';
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
    const ab = abilitateaDinSlot(s.loc);
    if (!ab) { s.perdea.style.height = '0%'; s.secunde.textContent = ''; return; }

    // The dark curtain that sinks as the cooldown runs out.
    const gataLa = pauzaAbilitatii(ab.id);
    const ramas = gataLa - acum;
    if (ramas > 0) {
      const tot = Math.max(ab.pauza || 0, PAUZA_GLOBALA);
      s.perdea.style.height = Math.min(100, (ramas / tot) * 100) + '%';
      s.secunde.textContent = ramas > 1000 ? Math.ceil(ramas / 1000) : '';
    } else {
      s.perdea.style.height = '0%';
      s.secunde.textContent = '';
    }

    s.el.classList.toggle('sarac', !aiCuCePlati(ab));
  });

  // The cast bar.
  if (incantareaInCurs) {
    const trecut = acum - incantareaInCurs.dela;
    const parte = Math.max(0, Math.min(1, trecut / incantareaInCurs.cat));
    cutiaIncantarii.classList.remove('ascuns');
    document.getElementById('incantare-plina').style.width = (parte * 100) + '%';
    document.getElementById('incantare-nume').textContent = incantareaInCurs.nume;
  } else {
    cutiaIncantarii.classList.add('ascuns');
  }
}


// The keys along the top of the keyboard.
window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  const loc = CODURILE_BAREI.indexOf(e.code);
  if (loc < 0 || loc >= LOCURI_IN_BARA) return;
  e.preventDefault();
  apasaLocul(loc);
});
