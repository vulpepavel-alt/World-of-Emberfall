// ==========================================================
//  SALVAREA
//
//  Pana acum, daca inchideai pagina, pierdeai tot: nivelul,
//  echipamentul, banii, misiunile. Acum jocul isi tine minte
//  personajul in telefon, si il gasesti acolo cand te intorci.
//
//  NU salvam tot personajul. Salvam doar ce e AL TAU si nu se
//  poate socoti din altceva:
//
//     cine esti        - rasa, clasa, infatisarea, numele
//     cat ai ajuns     - nivelul si experienta
//     ce ai stans      - talente, echipament, rucsac, bani, misiuni
//     unde esti        - zona si locul de pe harta
//
//  Statisticile (viata, attack power, armura) NU se salveaza:
//  se socotesc din nou la incarcare, din nivel si echipament.
//  Asa nu se poate intampla ca un personaj salvat sa aiba cifre
//  care nu se potrivesc intre ele.
//
//  Totul sta in "localStorage" - o cutiuta pe care browserul
//  telefonului o tine pentru fiecare pagina in parte. E ca un
//  sertar al jocului: numai jocul pune si scoate din el.
// ==========================================================

// Trei sloturi, fiecare cu personajul lui. Fiecare sta sub cheia
// lui in sertarul browserului: joc-rpg-slot-1, -2, -3.
const NUMAR_SLOTURI = 3;
const CHEIA_VECHE = 'joc-rpg-salvare';      // pe vremea cand era un singur personaj
const VERSIUNEA_SALVARII = 1;

function cheiaSlotului(nr) {
  return 'joc-rpg-slot-' + nr;
}

// In ce slot joci acum. Se pune cand alegi un personaj sau cand
// faci unul nou, si toate salvarile de dupa merg acolo.
let slotulCurent = null;

// La cate milisecunde salvam singuri, cat timp joci.
const SALVARE_LA = 15000;


// ----------------------------------------------------------
//  Scrisul si cititul
//
//  localStorage poate sa dea eroare: in fereastra privata, sau
//  daca telefonul e setat sa nu lase paginile sa tina nimic.
//  De aceea totul e invelit in try/catch - daca nu merge, jocul
//  merge mai departe fara salvare, nu se opreste.
// ----------------------------------------------------------
function citesteSlotul(nr) {
  try {
    const text = localStorage.getItem(cheiaSlotului(nr));
    if (!text) return null;
    const s = JSON.parse(text);
    if (!s || s.versiune !== VERSIUNEA_SALVARII) return null;
    return s;
  } catch (e) {
    return null;
  }
}


// Toate cele trei sloturi, in ordine. Un slot gol e null.
function toateSloturile() {
  const lista = [];
  for (let i = 1; i <= NUMAR_SLOTURI; i++) lista.push(citesteSlotul(i));
  return lista;
}


function stergeSlotul(nr) {
  try { localStorage.removeItem(cheiaSlotului(nr)); } catch (e) { /* nimic de facut */ }
}


function existaVreoSalvare() {
  return toateSloturile().some(function (s) { return s !== null; });
}


// Pe vremea cand era un singur personaj, salvarea statea sub alta
// cheie. Daca o gasim, o mutam in primul slot liber si o stergem
// de acolo - ca sa nu-si piarda nimeni personajul.
function mutaSalvareaVeche() {
  try {
    const text = localStorage.getItem(CHEIA_VECHE);
    if (!text) return;

    for (let i = 1; i <= NUMAR_SLOTURI; i++) {
      if (citesteSlotul(i) === null) {
        localStorage.setItem(cheiaSlotului(i), text);
        break;
      }
    }
    localStorage.removeItem(CHEIA_VECHE);
  } catch (e) { /* nimic de facut */ }
}
mutaSalvareaVeche();


let ultimaSalvare = 0;

function salveaza() {

  if (!personaj || !personaj.nume) return false;
  if (!slotulCurent) return false;      // nu stim in ce slot sa punem

  const s = {
    versiune: VERSIUNEA_SALVARII,

    // cine esti
    idRasa: personaj.idRasa,
    idClasa: personaj.idClasa,
    infatisare: personaj.infatisare,
    nume: personaj.nume,

    // cat ai ajuns
    nivel: personaj.nivel,
    xp: personaj.xp,

    // ce ai strans
    talente: personaj.talente || {},
    echipament: personaj.echipament || {},
    inventar: personaj.inventar || [],
    bani: personaj.bani || 0,
    misiuni: personaj.misiuni || {},
    // Ce abilitati ai invatat la antrenor, si cum ti-ai asezat bara.
    stiute: personaj.stiute || {},
    meserii: personaj.meserii || {},
    bara: personaj.bara || null,

    // ca obiectele noi sa nu primeasca numere deja folosite
    urmatorulIdObiect: urmatorulIdObiect,

    // unde esti
    zona: zona ? zona.id : null,
    numeZona: zona ? zona.nume : null,
    x: jucator ? Math.round(jucator.x) : null,
    y: jucator ? Math.round(jucator.y) : null,

    cand: Date.now()
  };

  try {
    localStorage.setItem(cheiaSlotului(slotulCurent), JSON.stringify(s));
    ultimaSalvare = Date.now();
    return true;
  } catch (e) {
    // Sertarul e plin sau inchis. Nu stricam jocul pentru atat.
    console.warn('Nu am putut salva: ' + e.message);
    return false;
  }
}


// Se cheama des, din update(). Salveaza doar din cand in cand.
function salveazaDinCandInCand() {
  if (Date.now() - ultimaSalvare < SALVARE_LA) return;
  salveaza();
}


// ----------------------------------------------------------
//  Refacerea personajului din salvare
//
//  Pornim de la un personaj nou, de rasa si clasa salvate si de
//  nivelul salvat - asa toate cifrele de baza ies corecte - si
//  punem peste el doar ce e al tau.
// ----------------------------------------------------------
function faPersonajulDinSalvare(s) {

  const p = calculeazaPersonaj(s.idRasa, s.idClasa, s.infatisare, s.nivel);

  p.nume       = s.nume;
  p.xp         = s.xp;
  p.talente    = s.talente || {};
  p.echipament = s.echipament || {};
  p.inventar   = s.inventar || [];
  p.bani       = s.bani || 0;
  p.misiuni    = s.misiuni || {};

  // Abilitatile invatate. O salvare facuta INAINTE de antrenori n-are
  // niciuna: ar fi nedrept sa te trezesti la nivelul 40 cu doua
  // butoane, asa ca primesti gratis tot ce ti-ar fi dat antrenorul
  // pana la nivelul tau.
  p.stiute = s.stiute && Object.keys(s.stiute).length
    ? s.stiute : daTotCeSeCuvine(p);

  p.meserii = s.meserii || {};
  p.bara = (s.bara && s.bara.length === LOCURI_IN_BARA) ? s.bara : faBaraGoala();
  Object.keys(p.stiute).forEach(function (id) { asazaPeBaraDacaIncape(p, id); });

  // Obiectele noi trebuie sa primeasca numere mai mari decat
  // tot ce ai deja, altfel doua obiecte diferite ar avea acelasi
  // numar si ai echipa unul crezand ca ai apasat pe celalalt.
  let celMaiMare = s.urmatorulIdObiect || 1;
  p.inventar.forEach(function (o) { celMaiMare = Math.max(celMaiMare, o.id + 1); });
  Object.keys(p.echipament).forEach(function (sl) {
    const o = p.echipament[sl];
    if (o) celMaiMare = Math.max(celMaiMare, o.id + 1);
  });
  pornesteIdurileObiectelor(celMaiMare);

  return p;
}


// Cat de demult a fost salvat, scris omeneste: "3 minutes ago".
function cuCatTimpInUrma(cand) {
  const secunde = Math.max(0, Math.round((Date.now() - cand) / 1000));
  if (secunde < 60) return 'just now';
  const minute = Math.round(secunde / 60);
  if (minute < 60) return minute + (minute === 1 ? ' minute ago' : ' minutes ago');
  const ore = Math.round(minute / 60);
  if (ore < 24) return ore + (ore === 1 ? ' hour ago' : ' hours ago');
  const zile = Math.round(ore / 24);
  return zile + (zile === 1 ? ' day ago' : ' days ago');
}


// ----------------------------------------------------------
//  Salvam si cand inchizi pagina sau treci la alta aplicatie
//
//  Pe telefon, "pagehide" e singurul moment sigur: cand dai
//  drumul la altceva, browserul poate inchide pagina fara sa mai
//  anunte. De aceea salvam si la "visibilitychange".
// ----------------------------------------------------------
window.addEventListener('pagehide', function () { salveaza(); });

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') salveaza();
});
