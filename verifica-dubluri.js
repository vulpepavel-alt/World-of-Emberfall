// ==========================================================
//  CAUTA CHEI SCRISE DE DOUA ORI
//
//  De ce trebuie citite FISIERELE si nu jocul:
//
//  Cand scrii de doua ori aceeasi cheie intr-un tabel -
//    const TEXT = { RECIPES: 'a',  ...  RECIPES: 'b' }
//  - JavaScript nu se plange deloc. A doua o inghite pe prima si
//  gata. Din joc nu mai ai ce vedea: cand ajungi tu sa te uiti,
//  prima nici n-a existat vreodata.
//
//  De aia programul asta nu porneste jocul. Citeste fisierele ca pe
//  un text si numara cheile.
//
//  Cum se ruleaza, din folderul jocului:
//    node verifica-dubluri.js
//
//  Daca totul e curat, scrie o singura linie.
// ==========================================================

const fs = require('fs');
const cale = require('path');


// Tabelele mari, scrise toate la fel: "const NUME = {" si apoi
// cheile aliniate la doua spatii.
const DE_VERIFICAT = [
  ['texte.js',     'TEXT'],
  ['meserii.js',   'MESERII'],
  ['meserii.js',   'NODURI'],
  ['meserii.js',   'UNELTE'],
  ['mobi.js',      'MOBI'],
  ['personaj.js',  'RASE'],
  ['personaj.js',  'CLASE'],
  ['obiecte.js',   'PIESE'],
  ['obiecte.js',   'PIESE_SIMPLE'],
  ['obiecte.js',   'FELURI_ARMURA'],
  ['obiecte.js',   'MARIME_SLOT'],
  ['npc.js',       'NPC'],
  ['infatisare.js','MATERIALE'],
  ['abilitati.js', 'ID_VECHI_NOI']
];


// Bucata de fisier care tine tabelul: de la "const NUME = {" pana
// la randul care inchide, "};" la inceput de rand.
function bucataTabelului(text, nume) {
  const inceput = text.indexOf('const ' + nume + ' = {');
  if (inceput < 0) return null;
  const sfarsit = text.indexOf('\n};', inceput);
  if (sfarsit < 0) return null;
  return text.slice(inceput, sfarsit);
}


function cheileDeNivelUnu(bucata) {
  const chei = [];
  bucata.split('\n').forEach(function (rand, i) {
    // exact doua spatii inainte, apoi numele si doua puncte
    const m = rand.match(/^  '?([A-Za-z_][A-Za-z0-9_]*)'?\s*:/);
    if (m) chei.push({ nume: m[1], rand: i });
  });
  return chei;
}


let probleme = 0;

DE_VERIFICAT.forEach(function (pereche) {

  const fisier = pereche[0], nume = pereche[1];
  const drum = cale.join(__dirname, fisier);

  let text;
  try { text = fs.readFileSync(drum, 'utf8'); }
  catch (e) { console.log('  nu pot citi ' + fisier); probleme++; return; }

  const bucata = bucataTabelului(text, nume);
  if (!bucata) {
    console.log('  nu gasesc tabelul ' + nume + ' in ' + fisier +
                ' (poate si-a schimbat forma)');
    probleme++;
    return;
  }

  const vazute = {};
  cheileDeNivelUnu(bucata).forEach(function (c) {
    if (vazute[c.nume] !== undefined) {
      console.log('  ' + fisier + ' / ' + nume + ': cheia "' + c.nume +
                  '" e scrisa de doua ori (randurile ' + (vazute[c.nume] + 1) +
                  ' si ' + (c.rand + 1) + ' din tabel)');
      probleme++;
    }
    vazute[c.nume] = c.rand;
  });
});


if (probleme === 0) {
  console.log('Nicio cheie scrisa de doua ori in cele ' +
              DE_VERIFICAT.length + ' tabele verificate.');
} else {
  console.log('\n' + probleme + ' de reparat.');
  process.exitCode = 1;
}
