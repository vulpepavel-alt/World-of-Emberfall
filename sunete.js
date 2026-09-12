// ==========================================================
//  SUNETELE
//
//  Niciun fisier de sunet. Browserul stie sa FACA sunete singur,
//  la fel cum stie sa deseneze forme - ii spui ce inaltime are
//  tonul si cat sa tina, si el il produce.
//
//  De ce asa si nu cu fisiere:
//    - nu descarcam nimic de nicaieri, deci nimic nu e al altcuiva
//    - jocul ramane la fel de mic
//    - un sunet nou inseamna trei randuri aici, nu un fisier nou
//
//  Cum sunt facute: fiecare sunet e unul sau mai multe TONURI
//  (ca un fluierat) sau ZGOMOT (ca un fasait), fiecare cu un volum
//  care creste repede si scade lin. Asta din urma e ce face
//  diferenta intre "bip" si ceva ce seamana a lovitura.
//
//  ATENTIE la nume: functiile de aici se cheama sunetTon si
//  sunetZgomot, nu ton si zgomot. In game.js exista deja o functie
//  zgomot() care face terenul; daca o chemam pe a mea tot asa, una
//  o acoperea pe cealalta si nu se auzea nimic - exact asta s-a si
//  intamplat prima data.
//
//  ATENTIE la telefoane: browserul nu are voie sa scoata sunet pana
//  cand nu atingi ecranul macar o data. De asta pornim cutia de
//  sunet abia la prima atingere, nu la incarcarea paginii.
// ==========================================================


// Cutia in care browserul face sunetele. Se face o singura data.
let cutiaDeSunet = null;

// Pornit sau oprit. Se tine minte in telefon, separat de personaje:
// e o setare a ta, nu a unui personaj anume.
const CHEIA_SUNETULUI = 'joc-rpg-sunet';
let sunetulPornit = true;

// Cat de tare, peste tot. 0 = mut, 1 = cat poate.
const VOLUM_GENERAL = 0.22;


function citesteSetareaSunetului() {
  try {
    const ce = localStorage.getItem(CHEIA_SUNETULUI);
    if (ce === 'nu') sunetulPornit = false;
  } catch (e) { /* fereastra privata: ramane pornit */ }
}
citesteSetareaSunetului();


function scrieSetareaSunetului() {
  try {
    localStorage.setItem(CHEIA_SUNETULUI, sunetulPornit ? 'da' : 'nu');
  } catch (e) { /* nu se poate salva; merge oricum cat timp joci */ }
}


function porneisteOpresteSunetul() {
  sunetulPornit = !sunetulPornit;
  scrieSetareaSunetului();
  if (sunetulPornit) { deschideCutiaDeSunet(); suna('buton'); }
  return sunetulPornit;
}


// Deschide cutia, daca nu e deschisa. Se cheama la prima atingere
// si la fiecare sunet - a doua oara nu mai face nimic.
function deschideCutiaDeSunet() {
  if (cutiaDeSunet) {
    // Telefonul o poate adormi cand pleci din pagina si te intorci.
    if (cutiaDeSunet.state === 'suspended') cutiaDeSunet.resume();
    return cutiaDeSunet;
  }
  const Cutie = window.AudioContext || window.webkitAudioContext;
  if (!Cutie) return null;                 // browser prea vechi: fara sunet
  try { cutiaDeSunet = new Cutie(); } catch (e) { return null; }
  return cutiaDeSunet;
}


// ----------------------------------------------------------
//  Caramizile din care se fac sunetele
// ----------------------------------------------------------

// Un TON: un fluierat de la o inaltime la alta.
//   forma  - 'sine' (rotund), 'square' (aspru), 'triangle', 'sawtooth'
//   deLa   - inaltimea de pornire, in herti (cu cat mai mare, cu atat
//            mai subtire: 200 e gros, 900 e subtire)
//   panaLa - unde ajunge pana se stinge
//   tine   - cat dureaza, in secunde
//   tare   - cat de tare, fata de volumul general
//   peste  - peste cate secunde sa inceapa (pentru sunete din mai
//            multe bucati, una dupa alta)
function sunetTon(forma, deLa, panaLa, tine, tare, peste) {
  const c = cutiaDeSunet;
  if (!c) return;

  const acum = c.currentTime + (peste || 0);
  const osc = c.createOscillator();
  const vol = c.createGain();

  osc.type = forma;
  osc.frequency.setValueAtTime(deLa, acum);
  if (panaLa !== deLa) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, panaLa), acum + tine);
  }

  // Volumul: creste in 8 milisecunde si scade lin pana la zero.
  // Fara cresterea asta scurta s-ar auzi un poc la inceput.
  const varf = VOLUM_GENERAL * (tare === undefined ? 1 : tare);
  vol.gain.setValueAtTime(0.0001, acum);
  vol.gain.exponentialRampToValueAtTime(Math.max(0.0001, varf), acum + 0.008);
  vol.gain.exponentialRampToValueAtTime(0.0001, acum + tine);

  osc.connect(vol);
  vol.connect(c.destination);
  osc.start(acum);
  osc.stop(acum + tine + 0.02);
}


// ZGOMOT: un fasait, ca frunzele sau ca o lovitura care nu are
// inaltime. Se face din numere la intamplare, exact cum se face
// terenul din joc.
function sunetZgomot(tine, tare, taiatSub, peste) {
  const c = cutiaDeSunet;
  if (!c) return;

  const acum = c.currentTime + (peste || 0);
  const cateCadre = Math.floor(c.sampleRate * tine);
  const tampon = c.createBuffer(1, Math.max(1, cateCadre), c.sampleRate);
  const date = tampon.getChannelData(0);
  for (let i = 0; i < cateCadre; i++) date[i] = Math.random() * 2 - 1;

  const sursa = c.createBufferSource();
  sursa.buffer = tampon;

  // Un filtru care lasa sa treaca doar sunetele groase: asa iese
  // "buf", nu "sss".
  const filtru = c.createBiquadFilter();
  filtru.type = 'lowpass';
  filtru.frequency.setValueAtTime(taiatSub || 900, acum);

  const vol = c.createGain();
  const varf = VOLUM_GENERAL * (tare === undefined ? 1 : tare);
  vol.gain.setValueAtTime(varf, acum);
  vol.gain.exponentialRampToValueAtTime(0.0001, acum + tine);

  sursa.connect(filtru);
  filtru.connect(vol);
  vol.connect(c.destination);
  sursa.start(acum);
  sursa.stop(acum + tine + 0.02);
}


// ----------------------------------------------------------
//  SUNETELE JOCULUI
//
//  Fiecare e o reteta scurta. Daca vrei unul mai gros sau mai
//  lung, schimbi numerele de aici si nu te atingi de nimic altceva.
// ----------------------------------------------------------
const SUNETE = {

  // ---- lupta ----
  lovitura:   function () { sunetZgomot(0.09, 0.9, 800); sunetTon('square', 160, 90, 0.08, 0.35); },
  critic:     function () { sunetZgomot(0.14, 1.1, 1100); sunetTon('square', 200, 70, 0.14, 0.5);
                            sunetTon('sawtooth', 420, 180, 0.12, 0.25, 0.03); },
  incasezi:   function () { sunetZgomot(0.11, 0.8, 500); sunetTon('triangle', 120, 60, 0.12, 0.45); },
  ratat:      function () { sunetZgomot(0.07, 0.35, 2600); },
  sageata:    function () { sunetTon('sawtooth', 900, 300, 0.10, 0.30);
                            sunetZgomot(0.05, 0.30, 3000, 0.02); },

  // ---- vraji ----
  vraja:      function () { sunetTon('sine', 300, 720, 0.18, 0.45);
                            sunetTon('sine', 450, 1080, 0.18, 0.22, 0.02); },
  incantare:  function () { sunetTon('sine', 260, 340, 0.35, 0.18); },
  vindecare:  function () { sunetTon('sine', 620, 880, 0.22, 0.40);
                            sunetTon('sine', 930, 1320, 0.26, 0.20, 0.05); },
  scut:       function () { sunetTon('triangle', 420, 300, 0.25, 0.35);
                            sunetTon('sine', 840, 600, 0.25, 0.15, 0.02); },

  // ---- ce se intampla cu tine ----
  nivelNou:   function () { sunetTon('sine', 523, 523, 0.14, 0.5);
                            sunetTon('sine', 659, 659, 0.14, 0.5, 0.13);
                            sunetTon('sine', 784, 784, 0.14, 0.5, 0.26);
                            sunetTon('sine', 1047, 1047, 0.34, 0.55, 0.39); },
  moarte:     function () { sunetTon('triangle', 300, 70, 0.9, 0.5);
                            sunetTon('sine', 150, 50, 1.1, 0.3, 0.05); },
  mobMoare:   function () { sunetTon('sawtooth', 260, 90, 0.22, 0.30);
                            sunetZgomot(0.14, 0.5, 600, 0.04); },

  // ---- lucruri de luat si de facut ----
  bani:       function () { sunetTon('square', 1400, 1400, 0.05, 0.28);
                            sunetTon('square', 1900, 1900, 0.07, 0.22, 0.05);
                            sunetTon('square', 1650, 1650, 0.10, 0.18, 0.10); },
  prada:      function () { sunetZgomot(0.10, 0.45, 1600); sunetTon('sine', 500, 380, 0.08, 0.18); },
  cules:      function () { sunetZgomot(0.16, 0.5, 700); sunetTon('triangle', 280, 200, 0.14, 0.25, 0.06); },
  peste:      function () { sunetTon('sine', 700, 420, 0.12, 0.35);
                            sunetZgomot(0.10, 0.45, 1200, 0.04); },
  facut:      function () { sunetTon('square', 300, 300, 0.06, 0.35);
                            sunetTon('square', 300, 300, 0.06, 0.35, 0.09);
                            sunetTon('sine', 700, 900, 0.16, 0.30, 0.18); },
  invatat:    function () { sunetTon('sine', 660, 660, 0.12, 0.40);
                            sunetTon('sine', 880, 880, 0.22, 0.40, 0.11); },

  // ---- misiuni ----
  misiuneLuata:  function () { sunetTon('sine', 520, 660, 0.16, 0.35); },
  misiuneGata:   function () { sunetTon('sine', 660, 660, 0.12, 0.45);
                               sunetTon('sine', 880, 880, 0.12, 0.45, 0.11);
                               sunetTon('sine', 1100, 1100, 0.28, 0.45, 0.22); },

  // ---- interfata ----
  buton:      function () { sunetTon('square', 620, 620, 0.035, 0.22); },
  fereastra:  function () { sunetTon('sine', 380, 300, 0.09, 0.20); },
  gresit:     function () { sunetTon('square', 200, 150, 0.14, 0.30); },
  poarta:     function () { sunetTon('sine', 200, 420, 0.5, 0.30);
                            sunetTon('sine', 300, 630, 0.6, 0.18, 0.08); }
};


// ----------------------------------------------------------
//  Pauza dintre doua sunete la fel
//
//  O lovitura in cerc atinge sase inamici deodata, si atunci s-ar
//  auzi sase lovituri una peste alta - iese un bubuit urat, nu sase
//  lovituri. La fel, o misiune mare care te urca doua niveluri ar
//  suna de doua ori fanfara, suprapusa.
//
//  De aceea acelasi sunet nu poate porni din nou mai devreme de
//  atat. Sunete DIFERITE pot suna deodata, ca in viata.
// ----------------------------------------------------------
const PAUZA_SUNET = 55;                   // milisecunde, pentru toate
const PAUZA_SUNETULUI_ANUME = {           // afara de astea, mai lungi
  nivelNou: 900,
  moarte: 1200,
  misiuneGata: 600,
  poarta: 800,
  bani: 200
};

const candAsunatUltimaData = {};


// Sunetul cu numele dat. Daca numele nu exista, nu se intampla
// nimic - un sunet lipsa nu are voie sa opreasca jocul.
function suna(nume) {
  if (!sunetulPornit) return;
  const reteta = SUNETE[nume];
  if (!reteta) return;

  const acum = Date.now();
  const pauza = PAUZA_SUNETULUI_ANUME[nume] || PAUZA_SUNET;
  if (acum - (candAsunatUltimaData[nume] || 0) < pauza) return;
  candAsunatUltimaData[nume] = acum;

  if (!deschideCutiaDeSunet()) return;
  try { reteta(); } catch (e) { /* mai bine fara sunet decat fara joc */ }
}


// La prima atingere a ecranului deschidem cutia. Pe telefon fara
// asta n-ar suna nimic, niciodata.
window.addEventListener('pointerdown', function () {
  deschideCutiaDeSunet();
}, { once: false });
