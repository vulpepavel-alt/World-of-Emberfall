// ==========================================================
//  BANII
//
//  Ca in World of Warcraft, sunt trei feluri de monede, si una
//  se schimba in alta la fiecare o suta:
//
//      100 de arame (copper)  =  1 argint (silver)
//      100 de arginti         =  1 aur    (gold)
//
//  In joc NU tinem trei numere. Tinem UNUL SINGUR: cati bani de
//  arama ai. Restul se socoteste cand ii scriem pe ecran.
//  Asa nu se poate intampla sa ai "2 arginti si 137 de arame" -
//  o socoteala gresita care ar aparea daca le-am tine separat.
//
//      12045 de arame  =  1 aur, 20 de arginti, 45 de arame
//                         (12045 / 10000 = 1, ce ramane / 100 = 20 ...)
// ==========================================================

const ARAMA_PE_ARGINT = 100;
const ARAMA_PE_AUR    = 100 * ARAMA_PE_ARGINT;   // 10.000

const CULOARE_AUR    = '#e6c669';
const CULOARE_ARGINT = '#c9ccd4';
const CULOARE_ARAMA  = '#c8825a';


// Desface un teanc de arame in aur, argint si arama.
function desfaBanii(arame) {
  const tot = Math.max(0, Math.round(arame));
  return {
    aur:    Math.floor(tot / ARAMA_PE_AUR),
    argint: Math.floor((tot % ARAMA_PE_AUR) / ARAMA_PE_ARGINT),
    arama:  tot % ARAMA_PE_ARGINT
  };
}


// Scris simplu, pentru textul din joc: "1g 20s 45c".
// Monedele care ies zero nu se scriu, afara de cea mai mica.
function baniText(arame) {
  const b = desfaBanii(arame);
  const bucati = [];
  if (b.aur > 0) bucati.push(b.aur + 'g');
  if (b.argint > 0 || b.aur > 0) bucati.push(b.argint + 's');
  bucati.push(b.arama + 'c');
  return bucati.join(' ');
}


// Acelasi lucru, dar colorat, pentru ferestrele din meniu.
function baniHtml(arame) {
  const b = desfaBanii(arame);
  let html = '';
  if (b.aur > 0) {
    html += '<span class="moneda" style="color:' + CULOARE_AUR + '">' + b.aur + 'g</span> ';
  }
  if (b.argint > 0 || b.aur > 0) {
    html += '<span class="moneda" style="color:' + CULOARE_ARGINT + '">' + b.argint + 's</span> ';
  }
  html += '<span class="moneda" style="color:' + CULOARE_ARAMA + '">' + b.arama + 'c</span>';
  return html;
}


// ----------------------------------------------------------
//  Cati bani lasa un inamic
//
//  Ca in WoW, FIARELE NU LASA BANI - un lup nu are punga. Lasa
//  bani doar cei care ar putea avea buzunare: banditii,
//  jefuitorii. De aceea taberele lor sunt si cele mai cautate.
//
//  Suma creste cu patratul nivelului: la nivel 1 sunt cativa
//  bani de arama, la nivel 10 cam un argint.
// ----------------------------------------------------------
function baniDeLaMob(nivel, esteUmanoid) {

  if (!esteUmanoid) return 0;

  const n = Math.max(1, nivel);
  const baza = n * n * 0.9 + n * 2;

  // Intre 65% si 135% din suma de baza, ca sa nu fie mereu aceeasi.
  return Math.max(1, Math.round(baza * (0.65 + Math.random() * 0.7)));
}


// ----------------------------------------------------------
//  Cat face un obiect
//
//  Pretul creste cu nivelul si cu raritatea. Negustorul iti
//  vinde la pretul intreg si iti cumpara la un sfert din el -
//  la fel ca in WoW, unde nu poti trai din cumparat si revandut.
// ----------------------------------------------------------
const PARTEA_NEGUSTORULUI = 0.25;   // cat iti da cand ii vinzi

function valoareaObiectului(obiect) {
  const raritate = gasesteRaritate(obiect.raritate);
  const n = obiect.nivel;
  return Math.max(1, Math.round((n * n * 0.6 + n * 8 + 4) * raritate.putere));
}

// Cat platesti TU ca sa-l cumperi.
function pretDeCumparat(obiect) {
  return valoareaObiectului(obiect);
}

// Cat primesti TU cand il vinzi.
function pretDeVandut(obiect) {
  return Math.max(1, Math.round(valoareaObiectului(obiect) * PARTEA_NEGUSTORULUI));
}


// ----------------------------------------------------------
//  Punga ta
// ----------------------------------------------------------
function aiDestuiBani(personajul, arame) {
  return (personajul.bani || 0) >= arame;
}

function iaBani(personajul, arame) {
  personajul.bani = (personajul.bani || 0) + Math.max(0, Math.round(arame));
}

// Da inapoi false daca n-ai destui - si atunci nu ia nimic.
function dauBani(personajul, arame) {
  const cat = Math.max(0, Math.round(arame));
  if (!aiDestuiBani(personajul, cat)) return false;
  personajul.bani -= cat;
  return true;
}
