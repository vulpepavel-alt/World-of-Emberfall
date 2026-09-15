// ==========================================================
//  SEMNELE DIN TEXTE
//
//  Multe texte au un loc gol in ele, insemnat cu acolade:
//
//    FLIGHT_FOUND: 'New stop found: {l}'
//
//  iar codul pune numele inauntru cu .replace('{l}', ...).
//
//  Daca cele doua nu se potrivesc, nu crapa nimic: replace() pur si
//  simplu nu gaseste ce cauta si lasa textul cum era. Jucatorul vede
//  atunci "New stop found: {l}" scris pe ecran, cu acolade cu tot.
//
//  Exact asta s-a intamplat: in texte.js scria {l}, iar in
//  drumuri3d.js se inlocuia {p}. De-aia exista fisierul asta.
//
//  Se cheama cu:  node verifica-semne.js
// ==========================================================

const fs = require('fs');
const cale = require('path');

const texte = fs.readFileSync(cale.join(__dirname, 'texte.js'), 'utf8');

// Doua feluri in care se scrie in joc:
//    TEXT.CEVA.replace('{x}', ...)
//    (TEXT.CEVA || 'ceva de rezerva').replace('{x}', ...)
const TIPARE = [
  /TEXT\.([A-Z_0-9]+)\s*\.replace\('(\{[a-z]+\})'/g,
  /\(\s*TEXT\.([A-Z_0-9]+)\s*\|\|[^)]*\)\s*\.replace\('(\{[a-z]+\})'/g
];

function semnulDinTexte(cheie) {
  const linia = new RegExp('^\\s*' + cheie + ':\\s*(.*)$', 'm').exec(texte);
  return linia ? linia[1] : null;
}

function fisiereleDeVerificat() {
  const toate = [];
  fs.readdirSync(__dirname)
    .filter(function (f) { return f.endsWith('.js') && !f.startsWith('verifica'); })
    .forEach(function (f) { toate.push(f); });
  fs.readdirSync(cale.join(__dirname, '3d'))
    .filter(function (f) { return f.endsWith('.js'); })
    .forEach(function (f) { toate.push(cale.join('3d', f)); });
  return toate;
}

let rele = 0, verificate = 0;

fisiereleDeVerificat().forEach(function (f) {
  const s = fs.readFileSync(cale.join(__dirname, f), 'utf8');

  TIPARE.forEach(function (tipar) {
    tipar.lastIndex = 0;
    let m;
    while ((m = tipar.exec(s))) {
      const cheie = m[1], semn = m[2];
      const scris = semnulDinTexte(cheie);
      if (scris === null) continue;        // textul nu e in texte.js
      verificate++;
      if (scris.includes(semn)) continue;
      console.log('  ' + f + ': se inlocuieste ' + semn + ' in TEXT.' + cheie +
                  ', dar acolo scrie: ' + scris.trim().slice(0, 70));
      rele++;
    }
  });
});

if (rele) {
  console.log('\n  ' + rele + ' semn(e) care nu se potrivesc. Jucatorul vede acoladele.');
  process.exit(1);
}
console.log('Toate cele ' + verificate + ' semne {..} se potrivesc cu texte.js.');
