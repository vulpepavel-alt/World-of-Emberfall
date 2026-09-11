// ==========================================================
//  ECRANUL DE PORNIRE SI ALEGEREA PERSONAJULUI
//
//  Ordinea ecranelor e acum:
//
//     TITLU  ->  SLOTURI  ->  CREARE (doar daca slotul e gol)  ->  JOC
//       |            |
//       |            +-- daca slotul are deja un personaj, intri direct
//       +-- se vede imediat, cat timp se incarca restul
//
//  Fisierul asta se incarca ULTIMUL din pagina. Asta nu e o
//  intamplare: cat timp nu s-a incarcat, pe ecran scrie "Loading...".
//  Daca ajunge sa ruleze, inseamna ca s-a incarcat chiar tot, si
//  abia atunci pune butonul Play. Nu e o bara de incarcare falsa -
//  daca ceva chiar nu ajunge, ramane pe Loading.
// ==========================================================

const ecranTitlu   = document.getElementById('ecran-titlu');
const ecranSloturi = document.getElementById('ecran-sloturi');
const listaSloturi = document.getElementById('sloturi');


// ----------------------------------------------------------
//  Titlul
// ----------------------------------------------------------
document.getElementById('titlu-joc').textContent = TEXT.GAME_TITLE;
document.getElementById('subtitlu-joc').textContent = TEXT.GAME_SUBTITLE;
document.getElementById('titlu-sloturi').textContent = TEXT.CHOOSE_CHARACTER;
document.getElementById('inapoi-la-titlu').textContent = TEXT.BACK;
document.title = TEXT.GAME_TITLE;

// Acum ca s-a incarcat tot, "Loading..." devine butonul Play.
document.getElementById('zona-play').innerHTML =
  '<button class="buton mare" id="play">' + TEXT.PLAY + '</button>';

document.getElementById('play').addEventListener('click', function () {
  ecranTitlu.classList.add('ascuns');
  arataSloturile();
});

document.getElementById('inapoi-la-titlu').addEventListener('click', function () {
  ecranSloturi.classList.add('ascuns');
  ecranTitlu.classList.remove('ascuns');
});


// ----------------------------------------------------------
//  Cele trei sloturi
// ----------------------------------------------------------
function arataSloturile() {
  scrieSloturile();
  ecranSloturi.classList.remove('ascuns');
}


function scrieSloturile() {

  const sloturi = toateSloturile();
  let html = '';

  sloturi.forEach(function (s, i) {

    const nr = i + 1;

    // ---- slot gol ----
    if (!s) {
      html += '<button class="slot-personaj gol" data-slot-gol="' + nr + '">' +
              '<span class="numar-slot">' + nr + '</span>' +
              '<span class="semn-gol">+</span>' +
              '<span class="nume-slot">' + TEXT.EMPTY_SLOT + '</span>' +
              '<span class="sub-slot">' + TEXT.CREATE_HERE + '</span>' +
              '</button>';
      return;
    }

    // ---- slot cu personaj ----
    const rasa = RASE[s.idRasa];
    const clasa = CLASE[s.idClasa];

    // Daca salvarea e dintr-o versiune care nu se mai potriveste,
    // o aratam ca stricata in loc sa crape ecranul.
    if (!rasa || !clasa) {
      html += '<div class="slot-personaj stricat">' +
              '<span class="numar-slot">' + nr + '</span>' +
              '<span class="nume-slot">?</span>' +
              '<button class="sterge-slot" data-sterge="' + nr + '">' + TEXT.DELETE + '</button>' +
              '</div>';
      return;
    }

    // Silueta lui, facuta din aceleasi forme ca in joc.
    const p = calculeazaPersonaj(s.idRasa, s.idClasa, s.infatisare, s.nivel);
    p.echipament = s.echipament || {};

    html += '<div class="slot-personaj plin">' +
            '<span class="numar-slot">' + nr + '</span>' +
            '<button class="apasa-slot" data-slot="' + nr + '">' +
            '<span class="poza-slot"><span class="silueta">' + htmlSilueta(p) + '</span></span>' +
            '<span class="nume-slot">' + s.nume + '</span>' +
            '<span class="sub-slot">' + TEXT.LEVEL + ' ' + s.nivel + ' ' +
              rasa.nume + ' ' + clasa.nume + '</span>' +
            '<span class="stins-slot">' + (s.zona || '') + ' &middot; ' +
              TEXT.SAVED + ' ' + cuCatTimpInUrma(s.cand) + '</span>' +
            '</button>' +
            '<button class="sterge-slot" data-sterge="' + nr + '">' + TEXT.DELETE + '</button>' +
            '</div>';
  });

  listaSloturi.innerHTML = html;

  // --- intri cu personajul din slot ---
  listaSloturi.querySelectorAll('[data-slot]').forEach(function (b) {
    b.addEventListener('click', function () {
      const nr = Number(b.dataset.slot);
      const s = citesteSlotul(nr);
      if (!s) return;

      slotulCurent = nr;
      ecranSloturi.classList.add('ascuns');
      porneste(faPersonajulDinSalvare(s), s);
    });
  });

  // --- slot gol: mergi la ecranul de creare ---
  listaSloturi.querySelectorAll('[data-slot-gol]').forEach(function (b) {
    b.addEventListener('click', function () {
      slotulCurent = Number(b.dataset.slotGol);
      ecranSloturi.classList.add('ascuns');
      ecran.classList.remove('ascuns');
      potrivesteScena();
    });
  });

  // --- stergerea unui personaj, cu intrebare inainte ---
  listaSloturi.querySelectorAll('[data-sterge]').forEach(function (b) {
    b.addEventListener('click', function () { intreabaDeStergere(Number(b.dataset.sterge)); });
  });
}


// Nu stergem din prima: un deget pus gresit ar sterge un personaj
// de nivelul 40. Slotul se schimba intr-o intrebare cu doua butoane.
function intreabaDeStergere(nr) {

  const cutie = listaSloturi.querySelector('[data-sterge="' + nr + '"]').parentElement;

  cutie.innerHTML =
    '<span class="numar-slot">' + nr + '</span>' +
    '<p class="intrebare-stergere">' + TEXT.DELETE_ASK + '</p>' +
    '<button class="buton rau" id="da-sterg">' + TEXT.YES_DELETE + '</button>' +
    '<button class="buton" id="nu-sterg">' + TEXT.CANCEL + '</button>';

  document.getElementById('da-sterg').addEventListener('click', function () {
    stergeSlotul(nr);
    scrieSloturile();
  });
  document.getElementById('nu-sterg').addEventListener('click', scrieSloturile);
}
