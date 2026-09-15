// ==========================================================
//  THE MENU IN THE CORNER
//
//  The row of small buttons at the bottom right, the bag squares
//  above them, and the five pages they open: your character, your
//  spells, your quests, the settings, and how to play.
//
//  The arrangement is the one this kind of game has had for twenty
//  years - your own frame top left, your target beside it, the
//  abilities along the bottom, the map in a corner, the little row
//  of buttons under it. That layout is a convention, like the pedals
//  in a car being in that order; it is not anybody's artwork.
//
//  AND NONE OF IT IS ANYBODY'S ARTWORK. Every button below is a
//  drawing made here out of circles, rectangles and lines. Every
//  word on screen comes out of texte.js, which is ours. There is not
//  one picture, icon, border, sound or line of text in this file
//  that came from anywhere but this project.
//
//  What the pages SHOW is worked out by the rest of the game, not
//  here: calculeazaViata and the rest out of personaj.js, MESERII
//  out of meserii.js, textulCerintei out of misiuni.js, poateInvata
//  out of talente.js. This file arranges. It does not decide.
// ==========================================================


// ----------------------------------------------------------
//  The little drawings on the buttons
// ----------------------------------------------------------
function semnulMeniului(fel) {
  const c = '#e8dcc0';
  const desene = {
    // A person: head and shoulders.
    caracter: '<circle cx="12" cy="8" r="4" fill="' + c + '"/>' +
              '<path d="M4 21 C4 15 20 15 20 21 Z" fill="' + c + '"/>',

    // An open book.
    vraji: '<path d="M3 5 C7 3 11 4 12 6 L12 20 C11 18 7 17 3 19 Z" fill="' + c + '"/>' +
           '<path d="M21 5 C17 3 13 4 12 6 L12 20 C13 18 17 17 21 19 Z" fill="' + c +
           '" opacity="0.7"/>',

    // A tree that forks: one trunk, three branches.
    talente: '<path d="M12 21 L12 12" stroke="' + c + '" stroke-width="2.4"/>' +
             '<path d="M12 13 L6 7 M12 13 L18 7" stroke="' + c + '" stroke-width="2"/>' +
             '<circle cx="12" cy="10" r="2.2" fill="' + c + '"/>' +
             '<circle cx="6" cy="6" r="2.2" fill="' + c + '"/>' +
             '<circle cx="18" cy="6" r="2.2" fill="' + c + '"/>',

    // A rolled sheet with a mark on it.
    misiuni: '<rect x="5" y="3" width="14" height="18" rx="1.5" fill="' + c + '"/>' +
             '<rect x="11" y="7" width="2" height="7" fill="#1b1610"/>' +
             '<rect x="11" y="16" width="2" height="2" fill="#1b1610"/>',

    // A hammer over an anvil.
    meserii: '<path d="M4 9 L14 9 L14 12 L4 12 Z" fill="' + c + '"/>' +
             '<path d="M13 10 L20 3 L22 5 L15 12 Z" fill="' + c + '"/>' +
             '<path d="M5 20 L19 20 L17 15 L7 15 Z" fill="' + c + '" opacity="0.7"/>',

    // A folded map.
    harta: '<path d="M3 6 L9 4 L15 6 L21 4 L21 18 L15 20 L9 18 L3 20 Z" fill="' + c + '"/>' +
           '<path d="M9 4 L9 18 M15 6 L15 20" stroke="#1b1610" stroke-width="1.2"/>',

    // A wheel with teeth.
    setari: '<circle cx="12" cy="12" r="4.6" fill="none" stroke="' + c + '" stroke-width="2.4"/>' +
            '<path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 ' +
            'M5 5 L8 8 M16 16 L19 19 M19 5 L16 8 M8 16 L5 19" ' +
            'stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>',

    // A tied sack.
    rucsac: '<path d="M7 9 C7 6 17 6 17 9 L19 20 L5 20 Z" fill="' + c + '"/>' +
            '<path d="M8 9 L16 9" stroke="#1b1610" stroke-width="2"/>' +
            '<path d="M10 4 C10 7 14 7 14 4" fill="none" stroke="' + c + '" stroke-width="1.8"/>'
  };

  return '<svg viewBox="0 0 24 24" width="100%" height="100%">' +
         (desene[fel] || '') + '</svg>';
}


// ----------------------------------------------------------
//  Building the corner
//
//  Four bag squares, as this kind of game has always had, and the
//  row of buttons under them. The game has ONE bag - the twenty
//  places you carry things in - so the first square is that bag and
//  the other three are drawn empty and say so when you point at
//  them. Three squares pretending to be bags you do not own would
//  be a lie told in pictures.
// ----------------------------------------------------------
const BUTOANELE_MENIULUI = [
  { fel: 'caracter', text: 'UI_CHARACTER', tasta: 'C' },
  { fel: 'vraji',    text: 'UI_SPELLS',    tasta: 'P' },
  { fel: 'talente',  text: 'UI_TALENTS',   tasta: 'N' },
  { fel: 'misiuni',  text: 'UI_QUESTS',    tasta: 'L' },
  { fel: 'meserii',  text: 'UI_TRADES',    tasta: 'K' },
  { fel: 'harta',    text: 'UI_MAP',       tasta: 'M' },
  { fel: 'setari',   text: 'UI_SETTINGS',  tasta: 'Esc' }
];

let coltulMeniului = null;
let scrisulLocurilor = '';        // what the bag square said last time

function faMeniulDinColt() {
  const el = document.createElement('div');
  el.id = 'meniu-colt';

  let genti = '<div class="genti">';
  genti += '<div class="geanta" id="geanta-ta" title="' + TEXT.UI_BAGS + '">' +
             '<span class="semn">' + semnulMeniului('rucsac') + '</span>' +
             '<span class="libere" id="locuri-libere"></span>' +
           '</div>';
  for (let i = 0; i < 3; i++) {
    genti += '<div class="geanta goala" title="' + TEXT.UI_NO_BAG + '"></div>';
  }
  genti += '</div>';

  let butoane = '<div class="butonase">';
  BUTOANELE_MENIULUI.forEach(function (b) {
    butoane += '<button class="butonas" data-pagina="' + b.fel + '" title="' +
               TEXT[b.text] + '  (' + b.tasta + ')">' +
               semnulMeniului(b.fel) + '</button>';
  });
  butoane += '</div>';

  el.innerHTML = genti + butoane;
  document.body.appendChild(el);
  coltulMeniului = el;

  document.getElementById('geanta-ta').addEventListener('click', deschideRucsacul);

  el.querySelectorAll('[data-pagina]').forEach(function (b) {
    b.addEventListener('click', function () { apasaButonulMeniului(b.dataset.pagina); });
  });
}


function apasaButonulMeniului(fel) {
  if (fel === 'talente') { deschideTalentele(); return; }
  if (fel === 'meserii') { deschideMeseriile(); return; }
  if (fel === 'harta')   { deschideHartaLumii(); return; }
  deschidePagina3d(fel);
}


// Called once a frame, so it only writes when the number changes -
// otherwise the browser would be rebuilding the same two words
// sixty times a second.
function actualizeazaMeniul3d() {
  if (!coltulMeniului) faMeniulDinColt();
  if (!personaj) return;

  const libere = locuriLibere(personaj);
  const scris = String(libere);
  if (scris !== scrisulLocurilor) {
    scrisulLocurilor = scris;
    const el = document.getElementById('locuri-libere');
    el.textContent = scris;
    el.classList.toggle('plin', libere === 0);
    document.getElementById('geanta-ta').title =
      TEXT.UI_BAGS + '  ·  ' + (LOCURI_IN_RUCSAC - libere) + ' / ' + LOCURI_IN_RUCSAC;
  }
}


// ==========================================================
//  THE PAGES
//
//  They all sit in the one window the rest of the 3D world already
//  uses - the loot sack, the bag, a shopkeeper's stall and the
//  talent trees are all that same box. One window open at a time.
// ==========================================================
let paginaMeniului3d = null;
let mesajMeniului3d = '';

function deschidePagina3d(fel) {
  if (!cutiaFerestrei) faFereastra();

  // The same button again shuts it.
  if (paginaMeniului3d === fel) { inchideFerestrele(); return; }

  inchideFerestrele();
  paginaMeniului3d = fel;
  mesajMeniului3d = '';
  cutiaFerestrei.classList.remove('ascuns');
  if (fel === 'caracter' || fel === 'ajutor') cutiaFerestrei.classList.add('lat');
  scriePaginaMeniului3d();
}

function deschideMisiunile3d() { deschidePagina3d('misiuni'); }


function scriePaginaMeniului3d() {
  if (!paginaMeniului3d || !personaj) return;
  if (paginaMeniului3d === 'caracter') scrieCaracterul3d();
  else if (paginaMeniului3d === 'vraji') scrieVrajile3d();
  else if (paginaMeniului3d === 'misiuni') scrieMisiunile3d();
  else if (paginaMeniului3d === 'setari') scrieSetarile3d();
  else if (paginaMeniului3d === 'ajutor') scrieInstructiunile3d();
}


function randDeStat(nume, valoare) {
  return '<div class="rand-cifra"><span>' + nume + '</span><span>' + valoare + '</span></div>';
}


// ----------------------------------------------------------
//  1. YOUR CHARACTER
// ----------------------------------------------------------
function scrieCaracterul3d() {
  const p = personaj;
  document.getElementById('titlu3d').textContent = TEXT.UI_CHARACTER;

  const resursa = (p.resursa === RESURSA_MANA)
    ? randDeStat(TEXT.UI_MANA, Math.round(p.mana || 0) + ' / ' + p.manaMaxima)
    : randDeStat(TEXT.UI_RAGE, Math.round(p.rage || 0) + ' / 100');

  let html = '<div class="doua-coloane">';

  html += '<div class="cutie"><h3>' + p.nume + '</h3>' +
    randDeStat(TEXT.LEVEL, p.nivel) +
    randDeStat(TEXT.UI_RACE, p.rasa) +
    randDeStat(TEXT.UI_CLASS, p.clasa) +
    randDeStat(TEXT.UI_HEALTH, Math.round(p.viata) + ' / ' + p.viataMaxima) +
    resursa +
    randDeStat(TEXT.UI_EXPERIENCE, (p.nivel >= NIVEL_MAXIM)
      ? TEXT.MAX_LEVEL : Math.floor(p.xp || 0) + ' / ' + xpPentruNivel(p.nivel)) +
    randDeStat(TEXT.UI_MONEY, baniText(p.bani || 0)) +
    '</div>';

  html += '<div class="cutie"><h3>' + TEXT.UI_ATTRIBUTES + '</h3>' +
    randDeStat(TEXT.UI_STR, p.atribute.str) +
    randDeStat(TEXT.UI_AGI, p.atribute.agi) +
    randDeStat(TEXT.UI_STA, p.atribute.sta) +
    randDeStat(TEXT.UI_INT, p.atribute.int) +
    randDeStat(TEXT.UI_SPI, p.atribute.spi) +
    '</div>';

  html += '<div class="cutie"><h3>' + TEXT.UI_COMBAT + '</h3>' +
    randDeStat(TEXT.UI_ATTACK_POWER, p.attackPower) +
    (p.attackPowerDistanta ? randDeStat(TEXT.UI_RANGED_POWER, p.attackPowerDistanta) : '') +
    (p.putereVrajii ? randDeStat(TEXT.UI_SPELL_POWER, p.putereVrajii) : '') +
    randDeStat(TEXT.UI_ARMOR, p.armura) +
    randDeStat(TEXT.UI_CRIT, (p.critical || 0).toFixed(2) + '%') +
    '</div>';

  // ---- what you are wearing ----
  let purtate = '<div class="cutie"><h3>' + TEXT.UI_WORN + '</h3>';
  let ceva = false;
  SLOTURI.forEach(function (s) {
    const o = (p.echipament || {})[s.id];
    if (!o) return;
    ceva = true;
    purtate += '<div class="rand" data-scoate="' + s.id + '" title="' + TEXT.UI_TAKE_OFF + '">' +
                 '<div class="ic">' + icoanaObiectului(o) + '</div>' +
                 '<div class="text"><span style="color:' + culoareaObiectului(o) + '">' +
                 o.nume + '</span><br><span class="mic-zona">' + s.nume + '</span></div>' +
               '</div>';
  });
  if (!ceva) purtate += '<p class="gol">' + TEXT.UI_NOTHING_WORN + '</p>';
  purtate += '</div>';
  html += purtate;

  // ---- your trades ----
  html += '<div class="cutie"><h3>' + TEXT.PROFESSIONS + '</h3>';
  const ale = meseriileTale(personaj);
  const idMeserii = Object.keys(ale);
  if (!idMeserii.length) {
    html += '<p class="gol">' + TEXT.NO_PROFESSIONS + '</p>';
  } else {
    idMeserii.forEach(function (id) {
      const m = MESERII[id];
      if (!m) return;
      html += randDeStat(m.nume, skillulTau(personaj, id) + ' / ' + plafonulTau(personaj, id));
    });
  }
  html += '</div>';

  html += '</div>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-scoate]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (!maiEsteLocInRucsac(personaj)) { spuneCeva(TEXT.UI_BAG_FULL); return; }
      if (dezechipeaza(personaj, el.dataset.scoate)) {
        recalculeazaPersonajul3d();
        scrieCaracterul3d();
      }
    });
  });
}


// ----------------------------------------------------------
//  2. YOUR SPELLS
//
//  Everything you have learnt, at the rank you have it, with what it
//  costs and what it does - all of it read out of abilitati.js.
//  Clicking one puts it on the bar, and clicking it again takes it
//  off, which is this world's answer to dragging it there.
// ----------------------------------------------------------
// Only the slots this bar can actually reach. The first button of
// the twelve is your weapon, so eleven ability slots are pressable -
// and putting something in a twelfth would be putting it where no
// key goes.
function loculDinBara(id) {
  const bara = personaj.bara || [];
  for (let i = 0; i < Math.min(bara.length, LOCURI_PE_BARA_3D); i++) {
    if (bara[i] === id) return i;
  }
  return -1;
}

function puneInBara3d(id) {
  const unde = loculDinBara(id);
  if (unde >= 0) {
    personaj.bara[unde] = null;
    mesajMeniului3d = '';
    scrieVrajile3d();
    return;
  }
  let gol = -1;
  for (let i = 0; i < LOCURI_PE_BARA_3D; i++) {
    if (!personaj.bara[i]) { gol = i; break; }
  }
  if (gol < 0) { mesajMeniului3d = TEXT.UI_BAR_FULL; scrieVrajile3d(); return; }
  personaj.bara[gol] = id;
  mesajMeniului3d = '';
  scrieVrajile3d();
}


function scrieVrajile3d() {
  document.getElementById('titlu3d').textContent = TEXT.UI_SPELLS;

  const stiute = Object.keys(personaj.stiute || {});

  let html = '<p class="mic">' + TEXT.UI_SPELLS_HINT + '</p>';
  if (mesajMeniului3d) html += '<p class="mesaj">' + mesajMeniului3d + '</p>';

  if (!stiute.length) {
    html += '<p class="gol">' + TEXT.UI_NO_SPELLS + '</p>';
  }

  stiute.forEach(function (id) {
    const baza = gasesteAbilitatea(id);
    if (!baza) return;
    const ab = abilitateaLaRang(baza, personaj.stiute[id]);
    const unde = loculDinBara(id);

    const cost = ab.costRage ? ab.costRage + ' ' + TEXT.UI_RAGE.toLowerCase()
               : ab.costMana ? ab.costMana + ' ' + TEXT.UI_MANA.toLowerCase()
               : TEXT.UI_FREE;

    html += '<div class="rand vraja' + (unde >= 0 ? ' pusa' : '') + '" data-vraja="' + id + '">' +
              '<div class="ic">' + icoanaAbilitatii(ab) + '</div>' +
              '<div class="text"><span class="nume-vraja">' + ab.nume +
              (ab.rangAcum > 1 ? ' ' + ab.rangAcum : '') + '</span>' +
              '<br><span class="mic-zona">' + cost +
              (ab.incantare ? ' · ' + (ab.incantare / 1000) + 's' : '') +
              (ab.pauza ? ' · ' + (ab.pauza / 1000) + 's' : '') + '</span>' +
              '<br><span class="ce-face">' + (ab.descriere || '') + '</span></div>' +
              '<div class="pret">' +
              (unde >= 0 ? TASTELE_BAREI[butonulSlotului(unde)] : '') + '</div>' +
            '</div>';
  });

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-vraja]').forEach(function (el) {
    el.addEventListener('click', function () { puneInBara3d(el.dataset.vraja); });
  });
}


// ----------------------------------------------------------
//  3. YOUR QUESTS
//
//  The one you are following is the one the arrow at the top of the
//  screen points for. misiuneaPentruGhid() in ghid-misiuni.js picks
//  the first one if you have not chosen.
// ----------------------------------------------------------
function scrieMisiunile3d() {
  const active = misiuniActive(personaj);
  document.getElementById('titlu3d').textContent =
    TEXT.QUEST_LOG + '  ·  ' + active.length;

  let html = '';
  if (!active.length) html += '<p class="gol">' + TEXT.EMPTY_LOG + '</p>';

  const urmarita = misiuneaPentruGhid(personaj);

  active.forEach(function (m) {
    const gata = starea(personaj, m.id) === 'gata';
    const aleasa = urmarita && urmarita.id === m.id;

    html += '<div class="carnet' + (gata ? ' gata' : '') + (aleasa ? ' urmarita' : '') + '">' +
              '<div class="titlu-carnet">' + m.titlu +
                ' <span class="mic-zona">(' + TEXT.LEVEL + ' ' + m.nivel + ')</span></div>' +
              '<div class="ce-face">' + (m.text || '') + '</div>' +
              '<div class="cerinta' + (gata ? ' gata' : '') + '">' +
                textulCerintei(personaj, m) + '</div>' +
              '<div class="butoanele-misiunii">' +
                '<button data-urmareste="' + m.id + '"' + (aleasa ? ' disabled' : '') + '>' +
                  (aleasa ? TEXT.TRACKING_QUEST : TEXT.TRACK_QUEST) + '</button>' +
                '<button class="inapoi" data-renunt="' + m.id + '">' +
                  TEXT.UI_ABANDON + '</button>' +
              '</div>' +
            '</div>';
  });

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-urmareste]').forEach(function (b) {
    b.addEventListener('click', function () {
      personaj.misiuneUrmarita = b.dataset.urmareste;
      scrieMisiunile3d();
    });
  });

  corp.querySelectorAll('[data-renunt]').forEach(function (b) {
    b.addEventListener('click', function () {
      renuntaLaMisiune(personaj, b.dataset.renunt);
      scrieMisiunile3d();
    });
  });
}


// ----------------------------------------------------------
//  4. SETTINGS
// ----------------------------------------------------------
let sageataPornita = true;
let urmarireCamera = true;

function scrieSetarile3d() {
  document.getElementById('titlu3d').textContent = TEXT.UI_SETTINGS;

  let html = '<div class="cutie"><h3>' + TEXT.SET_PICTURE + '</h3>' +
             '<p class="mic">' + TEXT.SET_PICTURE_HINT + '</p><div class="trepte">';

  TREPTE_PIXELARE.forEach(function (n) {
    html += '<button class="treapta-poza' + (n === pixelare ? ' aleasa' : '') +
            '" data-pixeli="' + n + '">' +
            (n === 1 ? TEXT.SET_SHARP : TEXT.SET_CHUNKY.replace('{n}', n)) + '</button>';
  });
  html += '</div></div>';

  html += '<div class="cutie"><h3>' + TEXT.SET_CAMERA + '</h3>' +
          '<p class="mic">' + TEXT.SET_CAMERA_HINT + '</p>' +
          '<button class="lat" id="comuta-camera">' +
          (urmarireCamera ? TEXT.SET_ON : TEXT.SET_OFF) + '</button></div>';

  html += '<div class="cutie"><h3>' + TEXT.SET_ARROW + '</h3>' +
          '<p class="mic">' + TEXT.SET_ARROW_HINT + '</p>' +
          '<button class="lat" id="comuta-sageata">' +
          (sageataPornita ? TEXT.SET_ON : TEXT.SET_OFF) + '</button></div>';

  html += '<div class="cutie"><h3>' + TEXT.SET_SAVING + '</h3>' +
          '<p class="mic">' + TEXT.SET_SAVING_HINT + '</p>' +
          '<button class="lat" id="salveaza-acum">' + TEXT.SET_SAVE_NOW + '</button></div>';

  html += '<button class="lat" id="cum-se-joaca">' + TEXT.HOWTO_TITLE + '</button>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-pixeli]').forEach(function (b) {
    b.addEventListener('click', function () {
      schimbaPixelarea(Number(b.dataset.pixeli));
      scrieSetarile3d();
    });
  });

  document.getElementById('comuta-camera').addEventListener('click', function () {
    urmarireCamera = !urmarireCamera;
    scrieSetarile3d();
  });

  document.getElementById('comuta-sageata').addEventListener('click', function () {
    sageataPornita = !sageataPornita;
    if (!sageataPornita) ascundeBusola();
    scrieSetarile3d();
  });

  document.getElementById('salveaza-acum').addEventListener('click', function () {
    spuneCeva(salveaza() ? TEXT.SET_SAVED : TEXT.SET_NOT_SAVED);
  });

  document.getElementById('cum-se-joaca').addEventListener('click', function () {
    deschidePagina3d('ajutor');
  });
}


// ----------------------------------------------------------
//  5. HOW TO PLAY
//
//  Every word of it is in texte.js, in one block, so it can be read
//  through and corrected as a piece of writing rather than hunted
//  for among the code.
// ----------------------------------------------------------
const CAPITOLELE_AJUTORULUI = ['MOVE', 'MOUSE', 'FIGHT', 'ABILITIES', 'LOOT',
                               'QUESTS', 'MAP', 'TRADES', 'TRAVEL'];

function scrieInstructiunile3d() {
  document.getElementById('titlu3d').textContent = TEXT.HOWTO_TITLE;

  let html = '<div class="doua-coloane">';
  CAPITOLELE_AJUTORULUI.forEach(function (cap) {
    html += '<div class="cutie"><h3>' + TEXT['HOWTO_' + cap + '_H'] + '</h3>' +
            '<p class="ce-face">' + TEXT['HOWTO_' + cap] + '</p></div>';
  });
  html += '</div>';

  html += '<button class="lat inapoi" id="inapoi-setari">' + TEXT.UI_SETTINGS + '</button>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;
  document.getElementById('inapoi-setari').addEventListener('click', function () {
    deschidePagina3d('setari');
  });
}


// ----------------------------------------------------------
//  The keys
//
//  P used to cycle how blocky the picture is. It is the spell book
//  now, as it is in games of this shape, and the picture has a
//  proper row of buttons in the settings instead of a hidden key
//  nobody would find.
// ----------------------------------------------------------
window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  if (e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;

  if (e.code === 'KeyC') deschidePagina3d('caracter');
  if (e.code === 'KeyP') deschidePagina3d('vraji');
  if (e.code === 'KeyL') deschidePagina3d('misiuni');
});
