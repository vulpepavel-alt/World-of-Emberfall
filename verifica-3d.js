// ==========================================================
//  CE INCARCA PAGINA 3D, SI CE NU
//
//  Jocul are acum DOUA pagini care pornesc de la aceleasi date:
//
//    index.html     - jocul 2D, cu Phaser
//    3d/index.html  - lumea 3D, cu Three.js
//
//  A doua nu-si scrie propriile date. Cheama exact aceleasi
//  fisiere: aceleasi zone, aceleasi abilitati, aceiasi mobi. De aia
//  se pot strica doua feluri de lucruri fara sa se planga nimeni:
//
//  1. ADAUGI UN FISIER NOU si-l pui numai in index.html. In 2D
//     merge, in 3D lipseste - si de obicei nu crapa, ci doar nu
//     apare ce trebuia sa apara.
//
//  2. DOUA FISIERE FOLOSESC ACELASI NUME. Toate scripturile impart
//     acelasi spatiu de nume. Azi am scris 'const scena' in
//     prototip.js fara sa stiu ca meniu.js are deja 'const scena' -
//     si asta nu e o greseala mica, e o eroare de sintaxa care
//     opreste TOATA pagina inainte sa ruleze un singur rand.
//     Ecranul ramane negru si nu scrie nimic despre ce s-a
//     intamplat.
//
//  Cum se ruleaza, din folderul jocului:
//    node verifica-3d.js
// ==========================================================

const fs = require('fs');
const path = require('path');

const RADACINA = __dirname;

// Fisierele care SUNT numai ale jocului 2D: deseneaza cu Phaser sau
// tin de interfata lui. Nu se asteapta nimeni sa fie si in 3D.
const NUMAI_2D = [
  'game.js',                  // toata desenarea 2D si bucla Phaser
  'harta.js',                 // harta lumii, ferestre 2D
  'meniu-joc.js',             // meniul din joc
  'prada.js',                 // fereastra de prada si taraba
  'control-lupta.js',         // butoanele de lupta de pe ecranul 2D
  'desktop.js',               // joystickul si tastele jocului 2D
  'comportamente-temnita.js', // mecanicile de temnita, legate de mobii 2D
  'ghid-misiuni.js',          // sageata galbena de pe ecranul 2D
  'personaj-test.js',         // unealta de proba
  'verifica.js',              // verificarea generala, pornita cu ?verifica=1
  'sunete.js',                // sunetele
  'titlu.js',                 // SE incarca si in 3D, dar dintr-un loc anume
  'meniu.js',                 // idem
  'salvare.js',               // idem
  'intalniri-instante.js'     // idem: dupa leagaZonele()
];

let greseli = 0;
function plange(text) { console.log('  ' + text); greseli++; }


function scripturile(pagina) {
  const text = fs.readFileSync(path.join(RADACINA, pagina), 'utf8');
  const gasite = [];
  const re = /src="([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!/^https?:/.test(m[1])) gasite.push(m[1]);
  }
  return gasite;
}


// ----------------------------------------------------------
//  1. Fiecare <script src> arata spre un fisier care exista
// ----------------------------------------------------------
function fisiereleExista(pagina) {
  const langa = path.dirname(path.join(RADACINA, pagina));
  scripturile(pagina).forEach(function (s) {
    if (!fs.existsSync(path.resolve(langa, s))) {
      plange(pagina + ' cere "' + s + '", care nu exista');
    }
  });
}


// ----------------------------------------------------------
//  2. Niciun fisier incarcat de doua ori pe aceeasi pagina
//
//  Un fisier cu 'const' in el, incarcat a doua oara, e eroare de
//  sintaxa si opreste pagina. La fel de tacut ca mai sus.
// ----------------------------------------------------------
function faraDubluri(pagina) {
  const vazute = {};
  scripturile(pagina).forEach(function (s) {
    const cheie = path.basename(s);
    if (vazute[cheie]) plange(pagina + ' incarca "' + cheie + '" de doua ori');
    vazute[cheie] = true;
  });
}


// ----------------------------------------------------------
//  3. Tot ce incarca 2D-ul si nu e numai al lui, incarca si 3D-ul
// ----------------------------------------------------------
function acelesiDate() {
  const a2d = scripturile('index.html').map(function (s) { return path.basename(s); });
  const a3d = scripturile('3d/index.html').map(function (s) { return path.basename(s); });

  a2d.forEach(function (f) {
    if (NUMAI_2D.indexOf(f) >= 0) return;
    if (a3d.indexOf(f) < 0) {
      plange('"' + f + '" e in jocul 2D dar lipseste din pagina 3D');
    }
  });

  return { a2d: a2d.length, a3d: a3d.length };
}


// ----------------------------------------------------------
//  4. Numele scrise la marginea din stanga nu se calca in picioare
//
//  Numai cele globale: ce e scris inauntrul unei functii e al ei si
//  nu deranjeaza pe nimeni.
// ----------------------------------------------------------
function numeleDeSus(fisier) {
  const gasite = new Set();
  fs.readFileSync(fisier, 'utf8').split('\n').forEach(function (rand) {
    let m = rand.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/);
    if (m) gasite.add(m[1]);
    m = rand.match(/^function\s+([A-Za-z_$][\w$]*)/);
    if (m) gasite.add(m[1]);
  });
  return gasite;
}

function faraNumeCalcate() {
  const langa = path.join(RADACINA, '3d');
  const toate = scripturile('3d/index.html').map(function (s) {
    return { scurt: path.basename(s), drum: path.resolve(langa, s) };
  });

  const undeE = {};
  toate.forEach(function (f) {
    numeleDeSus(f.drum).forEach(function (n) {
      if (undeE[n]) {
        plange('numele "' + n + '" e scris si in ' + undeE[n] + ', si in ' + f.scurt +
               '\n      (acelasi spatiu de nume: al doilea il sterge pe primul,' +
               ' iar la "const" opreste toata pagina)');
      } else {
        undeE[n] = f.scurt;
      }
    });
  });
}


// ----------------------------------------------------------
//  Si numaratoarea, ca sa se vada dintr-o privire cat e jocul
// ----------------------------------------------------------
function numara() {
  function randuri(drum) {
    return fs.readFileSync(drum, 'utf8').split('\n').length;
  }

  const grupe = {
    'date si reguli': [],
    'zone': [],
    'jocul 2D': [],
    'lumea 3D': [],
    'verificatoare': []
  };

  function adauga(drum, scurt) {
    if (scurt.indexOf('3d/') === 0) grupe['lumea 3D'].push(drum);
    else if (scurt.indexOf('zone/') === 0) grupe['zone'].push(drum);
    else if (scurt.indexOf('verifica') === 0) grupe['verificatoare'].push(drum);
    else if (NUMAI_2D.indexOf(scurt) >= 0 && ['titlu.js','meniu.js','salvare.js','intalniri-instante.js'].indexOf(scurt) < 0)
      grupe['jocul 2D'].push(drum);
    else grupe['date si reguli'].push(drum);
  }

  ['', 'zone', '3d'].forEach(function (folder) {
    const unde = path.join(RADACINA, folder);
    fs.readdirSync(unde).forEach(function (n) {
      if (!/\.(js|html)$/.test(n)) return;
      adauga(path.join(unde, n), folder ? folder + '/' + n : n);
    });
  });

  console.log('');
  let totalF = 0, totalR = 0;
  Object.keys(grupe).forEach(function (g) {
    const r = grupe[g].reduce(function (s, d) { return s + randuri(d); }, 0);
    totalF += grupe[g].length; totalR += r;
    console.log('  ' + g.padEnd(18) + String(grupe[g].length).padStart(3) + ' fisiere' +
                String(r).padStart(8) + ' randuri');
  });
  console.log('  ' + ''.padEnd(18) + String(totalF).padStart(3) + ' fisiere' +
              String(totalR).padStart(8) + ' randuri  in total');
}


// ----------------------------------------------------------
console.log('Pagina 2D si pagina 3D:');
fisiereleExista('index.html');
fisiereleExista('3d/index.html');
faraDubluri('index.html');
faraDubluri('3d/index.html');
const cate = acelesiDate();
faraNumeCalcate();

if (greseli === 0) {
  console.log('  ' + cate.a2d + ' scripturi in jocul 2D, ' + cate.a3d + ' in lumea 3D.');
  console.log('  Toate exista, niciunul de doua ori, niciun nume calcat in picioare.');
}
numara();
process.exit(greseli ? 1 : 0);
