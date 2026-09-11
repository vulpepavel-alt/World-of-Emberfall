// ==========================================================
//  PROGRAMUL CARE CONSTRUIESTE HARTILE
//
//  O harta de 694 x 463 casute are peste 300.000 de litere.
//  Nu se poate scrie de mana. Programul asta o construieste:
//  intai iarba, apoi dealurile, raul, drumurile, padurea, satul
//  si taberele de inamici - si scrie la sfarsit fisierul zonei.
//
//  Se cheama din terminal, o singura data, cand vrei harti noi:
//
//      node unelte/genereaza-zone.js
//
//  Fisierele care ies (zone/zona-greenvale.js si
//  zone/zona-redwaste.js) se pot deschide si modifica de mana
//  dupa aceea - sunt litere obisnuite, ca pana acum.
//
//  SAMANTA (seed) e numarul de la care porneste intamplarea.
//  Acelasi numar da mereu aceeasi harta. Daca schimbi samanta,
//  iese alta harta.
// ==========================================================

const fs = require('fs');
const path = require('path');


// ----------------------------------------------------------
//  Intamplare statornica
//
//  Math.random() da alt numar de fiecare data, deci harta ar iesi
//  altfel la fiecare rulare. Asta da mereu acelasi sir de numere
//  pentru aceeasi samanta.
// ----------------------------------------------------------
function faZaruri(samanta) {
  let s = samanta >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}


// Zgomot: un numar intre 0 si 1 care depinde doar de loc.
function zgomotBrut(x, y, samanta) {
  // Math.imul inmulteste numere intregi fara sa piarda cifre. Cu
  // inmultirea obisnuita numarul iese prea mare, se rotunjeste, si
  // zgomotul n-ar trece niciodata de 0,5.
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) +
           Math.imul(samanta, 2246822519)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

// Acelasi zgomot, dar neted: intre doua puncte trece lin, nu sare.
// De aici ies dealuri si petice de padure cu marginea moale.
function zgomotNeted(x, y, marime, samanta) {
  const fx = x / marime, fy = y / marime;
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const tx = fx - x0, ty = fy - y0;
  const nx = tx * tx * (3 - 2 * tx);     // muchia se rotunjeste
  const ny = ty * ty * (3 - 2 * ty);

  const a = zgomotBrut(x0,     y0,     samanta);
  const b = zgomotBrut(x0 + 1, y0,     samanta);
  const c = zgomotBrut(x0,     y0 + 1, samanta);
  const d = zgomotBrut(x0 + 1, y0 + 1, samanta);

  return (a * (1 - nx) + b * nx) * (1 - ny) + (c * (1 - nx) + d * nx) * ny;
}

// Mai multe zgomote suprapuse, tot mai marunte: asa terenul are si
// forme mari (dealuri), si detalii mici (tufe razlete).
function zgomotBogat(x, y, marime, straturi, samanta) {
  let total = 0, greutate = 0, m = marime, g = 1;
  for (let i = 0; i < straturi; i++) {
    total += zgomotNeted(x, y, m, samanta + i * 101) * g;
    greutate += g;
    m /= 2;
    g /= 2;
  }
  return total / greutate;
}


// ----------------------------------------------------------
//  Praguri dupa procent
//
//  "Vreau ca o cincime din harta sa fie padure" e mai usor de
//  inteles decat "vreau ca zgomotul sa fie peste 0,86". Functia
//  asta ia cateva mii de puncte la intamplare, le pune in ordine
//  si spune de la ce valoare in sus se afla procentul cerut.
// ----------------------------------------------------------
function pragPentruProcent(COL, RND, formula, procent) {
  const probe = [];
  for (let i = 0; i < 20000; i++) {
    const c = Math.floor(zgomotBrut(i, 1, 12345) * COL);
    const r = Math.floor(zgomotBrut(i, 2, 54321) * RND);
    probe.push(formula(c, r));
  }
  probe.sort(function (a, b) { return a - b; });
  return probe[Math.floor((1 - procent) * (probe.length - 1))];
}


// ----------------------------------------------------------
//  Harta ca tabla de litere
// ----------------------------------------------------------
function faTabla(coloane, randuri, litera) {
  const t = [];
  for (let r = 0; r < randuri; r++) t.push(new Array(coloane).fill(litera));
  return t;
}

function pune(t, c, r, litera) {
  if (r < 0 || r >= t.length || c < 0 || c >= t[0].length) return;
  t[r][c] = litera;
}

function ia(t, c, r) {
  if (r < 0 || r >= t.length || c < 0 || c >= t[0].length) return null;
  return t[r][c];
}

// Un disc plin de litere.
function disc(t, c0, r0, raza, litera) {
  for (let r = Math.floor(r0 - raza); r <= r0 + raza; r++) {
    for (let c = Math.floor(c0 - raza); c <= c0 + raza; c++) {
      const dc = c - c0, dr = r - r0;
      if (dc * dc + dr * dr <= raza * raza) pune(t, c, r, litera);
    }
  }
}

function dreptunghi(t, c0, r0, lat, inalt, litera) {
  for (let r = r0; r < r0 + inalt; r++) {
    for (let c = c0; c < c0 + lat; c++) pune(t, c, r, litera);
  }
}


// ==========================================================
//  ZONA 1: GREENVALE  (la scara lui Elwynn Forest)
//
//  Elwynn Forest are 3.470 x 2.315 yarzi. Cu 5 yarzi pe casuta
//  ies 694 x 463 casute. Durotar e de 1,5 ori mai mare - asa e
//  si la noi, intre Greenvale si Redwaste.
// ==========================================================
function faGreenvale() {

  const COL = 694, RND = 463;
  const S = 7331;                       // samanta zonei
  const t = faTabla(COL, RND, '.');

  // ---- dealuri insorite in jumatatea de rasarit ----
  const formulaDeal = function (c, r) {
    return zgomotBogat(c, r, 90, 3, S) + (c / COL) * 0.45;
  };
  const pragDeal = pragPentruProcent(COL, RND, formulaDeal, 0.26);
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (formulaDeal(c, r) > pragDeal) t[r][c] = 'h';
    }
  }

  // ---- poieni cu flori ----
  const formulaFlori = function (c, r) { return zgomotBogat(c, r, 40, 2, S + 5000); };
  const pragFlori = pragPentruProcent(COL, RND, formulaFlori, 0.08);
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (t[r][c] !== '.') continue;
      if (formulaFlori(c, r) > pragFlori) t[r][c] = 'f';
    }
  }

  // ---- raul, de sus in jos, serpuind ----
  // Pentru fiecare rand socotim unde se afla mijlocul lui si cat e
  // de lat. Amandoua se schimba lin, deci raul iese unduit.
  const raul = [];
  for (let r = 0; r < RND; r++) {
    const mijloc = Math.round(COL * 0.46
      + Math.sin(r / 52) * 42
      + (zgomotNeted(0, r, 30, S + 77) - 0.5) * 60);
    const lat = 6 + Math.round(zgomotNeted(0, r, 40, S + 91) * 5);
    raul.push({ mijloc: mijloc, lat: lat });
    for (let c = mijloc - lat; c <= mijloc + lat; c++) pune(t, c, r, 'W');
  }

  // ---- drumurile ----
  // Un drum mare de la apus la rasarit si unul de la nord la sud.
  const randDrumMare = Math.round(RND * 0.55);
  const colDrumLung  = Math.round(COL * 0.20);

  function drumOrizontal(rand, c1, c2) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
      const abatere = Math.round((zgomotNeted(c, 0, 55, S + 31) - 0.5) * 46);
      for (let r = rand + abatere - 1; r <= rand + abatere + 1; r++) {
        if (ia(t, c, r) === 'W') pune(t, c, r, 'B');   // trece raul pe pod
        else pune(t, c, r, 'P');
      }
    }
  }

  function drumVertical(col, r1, r2) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      const abatere = Math.round((zgomotNeted(0, r, 55, S + 47) - 0.5) * 46);
      for (let c = col + abatere - 1; c <= col + abatere + 1; c++) {
        if (ia(t, c, r) === 'W') pune(t, c, r, 'B');
        else pune(t, c, r, 'P');
      }
    }
  }

  drumOrizontal(randDrumMare, 20, COL - 20);
  drumOrizontal(Math.round(RND * 0.22), 20, COL - 20);
  drumVertical(colDrumLung, 20, RND - 20);
  drumVertical(Math.round(COL * 0.72), 20, RND - 20);

  // ---- padurea ----
  // Deasa la nord si la apus, rara spre dealurile de rasarit.
  // Nu creste pe drum, pe pod si nici langa ele.
  function langaDrum(c, r, cat) {
    for (let dr = -cat; dr <= cat; dr++) {
      for (let dc = -cat; dc <= cat; dc++) {
        const l = ia(t, c + dc, r + dr);
        if (l === 'P' || l === 'B') return true;
      }
    }
    return false;
  }

  const formulaPadure = function (c, r) {
    const spreNordVest = (1 - c / COL) * 0.3 + (1 - r / RND) * 0.25;
    return zgomotBogat(c, r, 26, 3, S + 1200) + spreNordVest;
  };
  const pragCopac = pragPentruProcent(COL, RND, formulaPadure, 0.17);
  const pragTufis = pragPentruProcent(COL, RND, formulaPadure, 0.24);

  const formulaStanca = function (c, r) { return zgomotBogat(c, r, 18, 2, S + 640); };
  const pragStanca = pragPentruProcent(COL, RND, formulaStanca, 0.09);

  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      const l = t[r][c];
      if (l !== '.' && l !== 'f' && l !== 'h') continue;
      if (langaDrum(c, r, 3)) continue;

      const padure = formulaPadure(c, r);
      if (padure > pragCopac) t[r][c] = 'T';
      else if (padure > pragTufis) t[r][c] = 's';
      else if (l === 'h' && formulaStanca(c, r) > pragStanca) t[r][c] = 'r';
    }
  }

  // ---- marginea zonei: un brau gros de padure, ca sa nu iesi ----
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (r < 7 || c < 7 || r >= RND - 7 || c >= COL - 7) t[r][c] = 'T';
    }
  }

  // ==========================================================
  //  LOCURILE CARE CONTEAZA
  // ==========================================================
  const mobi = [];
  const npci = [];

  // ---- satul, la apus de drumul lung ----
  const satC = Math.round(COL * 0.12), satR = Math.round(RND * 0.60);
  dreptunghi(t, satC - 26, satR - 20, 56, 44, '.');      // curatam locul

  function casa(c, r) {
    dreptunghi(t, c, r, 7, 3, 'R');        // acoperisul
    dreptunghi(t, c, r + 3, 7, 2, 'H');    // peretii
    pune(t, c + 3, r + 4, 'D');            // usa
  }

  const locuriCase = [
    [-24, -17], [-13, -17], [-2, -17], [9, -17], [20, -17],
    [-24,  -8], [-13,  -8],            [9,  -8], [20,  -8],
    [-24,   5], [-13,   5], [-2,   5], [9,   5], [20,   5],
    [-24,  14], [-13,  14], [-2,  14], [9,  14]
  ];
  locuriCase.forEach(function (l) { casa(satC + l[0], satR + l[1]); });

  // fantana din mijlocul satului
  disc(t, satC, satR - 3, 3, 'S');
  disc(t, satC, satR - 3, 1, 'W');

  // drumul care leaga satul de drumul lung
  drumOrizontal(satR, satC, colDrumLung + 6);

  npci.push({ fel: 'marshal',  col: satC + 4,  rand: satR + 1 });
  npci.push({ fel: 'negustor', col: satC - 8,  rand: satR - 1 });
  npci.push({ fel: 'armurier', col: satC + 15, rand: satR - 2 });

  // ---- ferma Eddei, la rasarit de sat ----
  const fermaC = Math.round(COL * 0.30), fermaR = Math.round(RND * 0.66);
  dreptunghi(t, fermaC - 20, fermaR - 14, 44, 30, '.');
  casa(fermaC - 3, fermaR - 6);
  dreptunghi(t, fermaC - 14, fermaR + 2, 26, 10, 'f');    // lanul de orz
  dreptunghi(t, fermaC - 14, fermaR + 2, 26, 1, 's');     // gardul viu
  dreptunghi(t, fermaC - 14, fermaR + 11, 26, 1, 's');
  dreptunghi(t, fermaC + 2, fermaR + 11, 6, 1, 'f');      // spartura din gard
  drumOrizontal(fermaR - 2, satC + 26, fermaC);
  npci.push({ fel: 'taran', col: fermaC, rand: fermaR - 1 });

  const START = { col: satC + 6, rand: satR + 1 };

  // ---- vizuina lupilor, la nord-vest ----
  const vizC = Math.round(COL * 0.20), vizR = Math.round(RND * 0.12);
  disc(t, vizC, vizR, 9, 'r');
  disc(t, vizC, vizR + 2, 5, '.');
  pune(t, vizC, vizR - 2, 'c');

  // coliba padurarului, la o aruncatura de bat de vizuina
  const colibaC = vizC + 24, colibaR = vizR + 18;
  disc(t, colibaC, colibaR, 8, '.');
  casa(colibaC - 3, colibaR - 4);
  npci.push({ fel: 'padurar', col: colibaC + 5, rand: colibaR + 1 });
  drumVertical(colibaC, colibaR, Math.round(RND * 0.22));

  // ---- tabara de banditi, la mijloc-rasarit ----
  const banC = Math.round(COL * 0.60), banR = Math.round(RND * 0.36);
  disc(t, banC, banR, 13, '.');
  [[-7, -5], [6, -6], [-8, 5], [7, 4], [0, -9], [-2, 8]].forEach(function (l) {
    dreptunghi(t, banC + l[0], banR + l[1], 3, 3, 'A');
  });
  pune(t, banC, banR, 'F');

  // ---- mina, la sud-est ----
  const minC = Math.round(COL * 0.78), minR = Math.round(RND * 0.78);
  disc(t, minC, minR, 12, 'r');
  disc(t, minC, minR + 3, 7, '.');
  dreptunghi(t, minC - 2, minR - 4, 4, 3, 'm');
  npci.push({ fel: 'miner', col: minC + 4, rand: minR + 4 });
  [[-9, 6], [8, 5], [-7, 9]].forEach(function (l) {
    disc(t, minC + l[0], minR + l[1], 2, 'o');
  });
  drumVertical(minC, minR, randDrumMare);

  // ---- cetatea de piatra, la nord-est, pe dealuri ----
  const cetC = Math.round(COL * 0.84), cetR = Math.round(RND * 0.16);
  dreptunghi(t, cetC - 18, cetR - 12, 36, 24, 'h');
  dreptunghi(t, cetC - 15, cetR - 10, 30, 20, 'S');
  dreptunghi(t, cetC - 11, cetR - 6,  22, 12, 'h');
  pune(t, cetC, cetR + 10, 'D');
  npci.push({ fel: 'cavaler', col: cetC + 3, rand: cetR + 12 });
  drumVertical(cetC, cetR + 11, Math.round(RND * 0.22));

  return {
    nume: 'Greenvale',
    factiune: 'Alliance',
    COL: COL, RND: RND,
    tabla: t,
    start: START,
    npci: npci,
    mobi: mobi,

    // Unde stau taberele de inamici, cu nivelul lor. Programul asta
    // le imprastie singur in jurul fiecarui punct, pe teren liber.
    // Nivelurile cresc pe masura ce te departezi de sat.
    tabere: [
      { fel: 'rat',      nivel: 1,  c: satC + 34, r: satR - 6,  raza: 24, cati: 18 },
      { fel: 'rat',      nivel: 1,  c: satC + 12, r: satR + 30, raza: 22, cati: 16 },
      { fel: 'boar',     nivel: 2,  c: satC + 44, r: satR + 26, raza: 28, cati: 20 },
      { fel: 'boar',     nivel: 2,  c: satC + 50, r: satR - 40, raza: 28, cati: 20 },
      { fel: 'wolf',     nivel: 3,  c: vizC + 20, r: vizR + 26, raza: 28, cati: 20 },
      { fel: 'wolf',     nivel: 4,  c: vizC,      r: vizR + 12, raza: 18, cati: 18 },
      { fel: 'spider',   nivel: 4,  c: Math.round(COL * 0.34), r: Math.round(RND * 0.30), raza: 28, cati: 20 },
      { fel: 'spider',   nivel: 5,  c: Math.round(COL * 0.30), r: Math.round(RND * 0.80), raza: 28, cati: 20 },
      { fel: 'wolf',     nivel: 5,  c: Math.round(COL * 0.42), r: Math.round(RND * 0.14), raza: 26, cati: 18 },
      { fel: 'bandit',   nivel: 6,  c: banC - 26, r: banR + 20, raza: 24, cati: 18 },
      { fel: 'bandit',   nivel: 7,  c: banC,      r: banR,      raza: 16, cati: 18 },
      { fel: 'spider',   nivel: 7,  c: Math.round(COL * 0.56), r: Math.round(RND * 0.72), raza: 28, cati: 18 },
      { fel: 'burrower', nivel: 8,  c: minC - 22, r: minR - 18, raza: 24, cati: 16 },
      { fel: 'burrower', nivel: 9,  c: minC,      r: minR + 6,  raza: 14, cati: 18 },
      { fel: 'bandit',   nivel: 9,  c: Math.round(COL * 0.66), r: Math.round(RND * 0.88), raza: 26, cati: 18 },
      { fel: 'burrower', nivel: 10, c: cetC - 30, r: cetR + 24, raza: 24, cati: 18 },
      { fel: 'bandit',   nivel: 10, c: cetC,      r: cetR + 22, raza: 20, cati: 18 }
    ],

    // Cine poate aparea la fiecare nivel, in taberele imprastiate
    // singure. Lucrurile blande stau jos, cele care lovesc tare sus.
    feluriPeNivel: {
      1:  ['rat'], 2: ['rat', 'boar'], 3: ['boar', 'wolf'],
      4:  ['wolf', 'spider'], 5: ['wolf', 'bandit'],
      6:  ['spider', 'bandit'], 7: ['bandit', 'spider'],
      8:  ['bandit', 'burrower'], 9: ['burrower', 'bandit'],
      10: ['burrower', 'bandit']
    },
    tabereInPlus: 54,

    literaUmplere: 'T',

    teren: TEREN_GREENVALE,
    antet: [
      'ZONA: Greenvale',
      '',
      'Padure de primavara, la scara lui Elwynn Forest din WoW:',
      '3.470 x 2.315 yarzi, adica 694 x 463 casute de cate 5 yarzi.',
      '',
      'Harta NU e scrisa de mana. O construieste unelte/genereaza-zone.js.',
      'Daca vrei sa schimbi ceva mic, poti scrie direct aici;',
      'daca rulezi din nou programul, fisierul se face la loc.',
      '',
      'Zona pentru Alliance: Human si Night Elf. Niveluri 1-10.'
    ]
  };
}


// ==========================================================
//  ZONA 2: REDWASTE  (la scara lui Durotar)
//
//  Durotar are 5.287 x 3.525 yarzi -> 1.058 x 705 casute.
// ==========================================================
function faRedwaste() {

  const COL = 1058, RND = 705;
  const S = 20461;
  const t = faTabla(COL, RND, '.');

  // ---- pete de nisip batut de vant ----
  const formulaNisip = function (c, r) { return zgomotBogat(c, r, 70, 3, S + 300); };
  const pragNisip = pragPentruProcent(COL, RND, formulaNisip, 0.18);
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (formulaNisip(c, r) > pragNisip) t[r][c] = 'n';
    }
  }

  // ---- albia secata: se poate MERGE pe ea, spre deosebire de rau ----
  for (let r = 0; r < RND; r++) {
    const mijloc = Math.round(COL * 0.40
      + Math.sin(r / 70) * 60
      + (zgomotNeted(0, r, 40, S + 77) - 0.5) * 90);
    const lat = 8 + Math.round(zgomotNeted(0, r, 50, S + 91) * 7);
    for (let c = mijloc - lat; c <= mijloc + lat; c++) pune(t, c, r, 'V');
    pune(t, mijloc - lat - 1, r, 'r');
    pune(t, mijloc + lat + 1, r, 'r');
  }

  // ---- drumurile batatorite ----
  const randDrumMare = Math.round(RND * 0.50);
  const colDrumLung  = Math.round(COL * 0.24);

  function drumOrizontal(rand, c1, c2) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
      const abatere = Math.round((zgomotNeted(c, 0, 65, S + 31) - 0.5) * 54);
      for (let r = rand + abatere - 1; r <= rand + abatere + 1; r++) pune(t, c, r, 'P');
    }
  }
  function drumVertical(col, r1, r2) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      const abatere = Math.round((zgomotNeted(0, r, 65, S + 47) - 0.5) * 54);
      for (let c = col + abatere - 1; c <= col + abatere + 1; c++) pune(t, c, r, 'P');
    }
  }

  drumOrizontal(randDrumMare, 24, COL - 24);
  drumOrizontal(Math.round(RND * 0.20), 24, COL - 24);
  drumVertical(colDrumLung, 24, RND - 24);
  drumVertical(Math.round(COL * 0.74), 24, RND - 24);

  // ---- stanci, cactusi si tufe uscate ----
  function langaDrum(c, r, cat) {
    for (let dr = -cat; dr <= cat; dr++) {
      for (let dc = -cat; dc <= cat; dc++) {
        if (ia(t, c + dc, r + dr) === 'P') return true;
      }
    }
    return false;
  }

  const formulaPiatra = function (c, r) { return zgomotBogat(c, r, 34, 3, S + 1200); };
  const pragStanca = pragPentruProcent(COL, RND, formulaPiatra, 0.11);
  const pragTufa   = pragPentruProcent(COL, RND, formulaPiatra, 0.17);
  const pragCactus = pragPentruProcent(COL, RND, formulaPiatra, 0.94);   // valorile MICI

  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      const l = t[r][c];
      if (l !== '.' && l !== 'n' && l !== 'V') continue;
      if (langaDrum(c, r, 3)) continue;

      const piatra = formulaPiatra(c, r);
      if (piatra > pragStanca) t[r][c] = 'r';
      else if (piatra > pragTufa) t[r][c] = 's';
      else if (piatra < pragCactus) t[r][c] = 'C';
    }
  }

  // ---- peretii canionului de jur imprejur ----
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (r < 8 || c < 8 || r >= RND - 8 || c >= COL - 8) t[r][c] = 'X';
    }
  }
  // cateva pinteni de stanca in interior, ca zona sa nu fie o tava
  for (let i = 0; i < 26; i++) {
    const c = 60 + Math.floor(zgomotBrut(i, 3, S) * (COL - 120));
    const r = 60 + Math.floor(zgomotBrut(i, 9, S) * (RND - 120));
    if (ia(t, c, r) === 'P') continue;

    // Trei discuri suprapuse, de marimi diferite: iese o stanca
    // colturoasa, nu o bulina rotunda.
    const marime = 9 + Math.floor(zgomotBrut(i, 17, S) * 13);
    for (let k = 0; k < 3; k++) {
      const dx = Math.round((zgomotBrut(i, 40 + k, S) - 0.5) * marime * 1.6);
      const dy = Math.round((zgomotBrut(i, 60 + k, S) - 0.5) * marime * 1.6);
      disc(t, c + dx, r + dy, marime * (0.6 + zgomotBrut(i, 80 + k, S) * 0.5), 'X');
    }
  }

  // ==========================================================
  //  LOCURILE CARE CONTEAZA
  // ==========================================================
  const npci = [];

  // ---- tabara de inceput ----
  const tabC = Math.round(COL * 0.14), tabR = Math.round(RND * 0.56);
  dreptunghi(t, tabC - 28, tabR - 22, 60, 48, '.');

  // palisada de lemn de jur imprejur, cu o singura poarta
  dreptunghi(t, tabC - 24, tabR - 18, 52, 1, 'W');
  dreptunghi(t, tabC - 24, tabR + 18, 52, 1, 'W');
  dreptunghi(t, tabC - 24, tabR - 18, 1, 37, 'W');
  dreptunghi(t, tabC + 27, tabR - 18, 1, 37, 'W');
  dreptunghi(t, tabC + 27, tabR - 2, 1, 5, '.');       // poarta

  function coliba(c, r) {
    dreptunghi(t, c, r, 6, 3, 'R');
    dreptunghi(t, c, r + 3, 6, 2, 'H');
    pune(t, c + 2, r + 4, 'D');
  }
  [[-20, -14], [-10, -14], [2, -14], [12, -14],
   [-20,   2], [-10,   2],          [12,   2],
   [-20,  10], [-10,  10], [2,  10], [12,  10]].forEach(function (l) {
    coliba(tabC + l[0], tabR + l[1]);
  });

  pune(t, tabC, tabR - 4, 'F');       // focul din mijloc
  drumOrizontal(tabR, tabC + 28, colDrumLung + 6);

  npci.push({ fel: 'chief',       col: tabC + 3,  rand: tabR + 1 });
  npci.push({ fel: 'negustorOrc', col: tabC - 6,  rand: tabR - 1 });
  npci.push({ fel: 'armurierOrc', col: tabC + 16, rand: tabR - 2 });
  npci.push({ fel: 'samana',     col: tabC - 18, rand: tabR + 7 });
  npci.push({ fel: 'capitan',    col: tabC + 10, rand: tabR + 6 });

  // ---- coliba vanatoarei, langa albia secata ----
  const vanC = Math.round(COL * 0.38), vanR = Math.round(RND * 0.34);
  disc(t, vanC, vanR, 10, '.');
  dreptunghi(t, vanC - 3, vanR - 4, 6, 3, 'R');
  dreptunghi(t, vanC - 3, vanR - 1, 6, 2, 'H');
  pune(t, vanC, vanR, 'D');
  pune(t, vanC + 5, vanR + 3, 'F');
  npci.push({ fel: 'vanator', col: vanC + 3, rand: vanR + 3 });
  drumVertical(vanC, vanR, randDrumMare);

  // ---- postul de paza al cercetasului, pe drumul mare ----
  const strajaC = Math.round(COL * 0.56), strajaR = Math.round(RND * 0.62);
  disc(t, strajaC, strajaR, 9, '.');
  dreptunghi(t, strajaC - 5, strajaR - 4, 10, 1, 'W');
  dreptunghi(t, strajaC - 5, strajaR + 4, 10, 1, 'W');
  dreptunghi(t, strajaC - 5, strajaR - 4, 1, 9, 'W');
  pune(t, strajaC, strajaR - 2, 'F');
  npci.push({ fel: 'cercetas', col: strajaC + 2, rand: strajaR + 1 });
  drumOrizontal(strajaR, strajaC - 10, strajaC + 10);
  const START = { col: tabC + 6, rand: tabR + 1 };

  // ---- crapatura scorpionilor ----
  const crapC = Math.round(COL * 0.30), crapR = Math.round(RND * 0.16);
  disc(t, crapC, crapR, 12, 'r');
  disc(t, crapC, crapR + 3, 7, '.');
  dreptunghi(t, crapC - 2, crapR - 3, 4, 3, 'c');

  // ---- tabara jefuitorilor ----
  const jefC = Math.round(COL * 0.70), jefR = Math.round(RND * 0.74);
  disc(t, jefC, jefR, 18, '.');
  dreptunghi(t, jefC - 15, jefR - 13, 31, 1, 'W');
  dreptunghi(t, jefC - 15, jefR + 13, 31, 1, 'W');
  dreptunghi(t, jefC - 15, jefR - 13, 1, 27, 'W');
  dreptunghi(t, jefC + 15, jefR - 13, 1, 27, 'W');
  dreptunghi(t, jefC - 15, jefR - 2, 1, 5, '.');
  [[-9, -7], [8, -8], [-10, 6], [9, 5], [0, -10], [-2, 9]].forEach(function (l) {
    dreptunghi(t, jefC + l[0], jefR + l[1], 3, 3, 'A');
  });
  pune(t, jefC, jefR, 'F');
  drumVertical(jefC, jefR - 14, randDrumMare);

  return {
    nume: 'Redwaste',
    factiune: 'Horde',
    COL: COL, RND: RND,
    tabla: t,
    start: START,
    npci: npci,
    mobi: [],

    tabere: [
      { fel: 'rat',     nivel: 1,  c: tabC + 44, r: tabR - 10, raza: 26, cati: 18 },
      { fel: 'rat',     nivel: 1,  c: tabC + 30, r: tabR + 38, raza: 24, cati: 16 },
      { fel: 'boar',    nivel: 2,  c: tabC + 62, r: tabR + 30, raza: 30, cati: 20 },
      { fel: 'boar',    nivel: 2,  c: tabC + 70, r: tabR - 46, raza: 30, cati: 20 },
      { fel: 'vulture', nivel: 3,  c: crapC + 34, r: crapR + 40, raza: 30, cati: 20 },
      { fel: 'scorpid', nivel: 4,  c: crapC + 6,  r: crapR + 14, raza: 20, cati: 18 },
      { fel: 'vulture', nivel: 4,  c: Math.round(COL * 0.44), r: Math.round(RND * 0.32), raza: 30, cati: 20 },
      { fel: 'serpent', nivel: 5,  c: Math.round(COL * 0.38), r: Math.round(RND * 0.66), raza: 30, cati: 20 },
      { fel: 'scorpid', nivel: 6,  c: Math.round(COL * 0.52), r: Math.round(RND * 0.18), raza: 28, cati: 20 },
      { fel: 'serpent', nivel: 6,  c: Math.round(COL * 0.48), r: Math.round(RND * 0.86), raza: 28, cati: 18 },
      { fel: 'vulture', nivel: 7,  c: Math.round(COL * 0.62), r: Math.round(RND * 0.40), raza: 28, cati: 18 },
      { fel: 'raider',  nivel: 8,  c: jefC - 34, r: jefR - 26, raza: 26, cati: 18 },
      { fel: 'raider',  nivel: 9,  c: jefC,      r: jefR,      raza: 14, cati: 18 },
      { fel: 'scorpid', nivel: 9,  c: Math.round(COL * 0.86), r: Math.round(RND * 0.30), raza: 28, cati: 18 },
      { fel: 'serpent', nivel: 10, c: Math.round(COL * 0.88), r: Math.round(RND * 0.60), raza: 28, cati: 18 },
      { fel: 'raider',  nivel: 10, c: Math.round(COL * 0.84), r: Math.round(RND * 0.86), raza: 26, cati: 18 }
    ],

    feluriPeNivel: {
      1:  ['rat'], 2: ['rat', 'boar'], 3: ['boar', 'vulture'],
      4:  ['vulture', 'serpent'], 5: ['serpent', 'raider'],
      6:  ['scorpid', 'raider'], 7: ['raider', 'vulture'],
      8:  ['raider', 'scorpid'], 9: ['raider', 'serpent'],
      10: ['raider', 'scorpid']
    },
    tabereInPlus: 82,

    literaUmplere: 'r',

    teren: TEREN_REDWASTE,
    antet: [
      'ZONA: Redwaste',
      '',
      'Canion uscat, la scara lui Durotar din WoW:',
      '5.287 x 3.525 yarzi, adica 1.058 x 705 casute de cate 5 yarzi.',
      'E de 1,5 ori mai mare decat Greenvale - exact ca in WoW.',
      '',
      'Harta NU e scrisa de mana. O construieste unelte/genereaza-zone.js.',
      '',
      'Zona pentru Horde: Orc si Undead. Niveluri 1-10.'
    ]
  };
}


// ==========================================================
//  UNDE SE POATE MERGE, SI UNDE PUNEM INAMICII
// ==========================================================

// Porneste din locul de start si se raspandeste in toate directiile
// pe unde se poate pasi. Ce nu atinge, inseamna ca e inchis.
function undeSePoateAjunge(zona) {

  const t = zona.tabla;
  const COL = zona.COL, RND = zona.RND;
  const ajuns = [];
  for (let r = 0; r < RND; r++) ajuns.push(new Uint8Array(COL));

  const coada = [[zona.start.col, zona.start.rand]];
  ajuns[zona.start.rand][zona.start.col] = 1;

  while (coada.length > 0) {
    const p = coada.pop();
    const c = p[0], r = p[1];
    const vecini = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]];
    for (const v of vecini) {
      if (v[0] < 0 || v[1] < 0 || v[0] >= COL || v[1] >= RND) continue;
      if (ajuns[v[1]][v[0]]) continue;
      const felul = zona.teren[t[v[1]][v[0]]];
      if (!felul || felul.blocat) continue;
      ajuns[v[1]][v[0]] = 1;
      coada.push(v);
    }
  }
  return ajuns;
}


// Padurea deasa lasa uneori poieni inchise de jur imprejur: teren
// pe care s-ar putea pasi, dar la care nu se poate ajunge. Le
// umplem cu copaci (sau cu stanca), ca tot ce se vede verde pe
// harta sa fie si de ajuns.
function astupaPoieniileInchise(zona, ajuns, litera) {

  let astupate = 0;
  for (let r = 0; r < zona.RND; r++) {
    for (let c = 0; c < zona.COL; c++) {
      if (ajuns[r][c]) continue;
      const felul = zona.teren[zona.tabla[r][c]];
      if (!felul || felul.blocat) continue;
      zona.tabla[r][c] = litera;
      astupate++;
    }
  }
  return astupate;
}


// Pe langa taberele scrise de mana, imprastiem si altele pe toata
// harta, ca sa nu ramana intinderi goale intre ele. Nivelul lor NU
// e la intamplare: creste cu departarea de locul unde incepi -
// exact ca intr-o zona de inceput din WoW, unde cel mai slab lucru
// e langa sat si cel mai tare in coltul cel mai indepartat.
function taberiAutomate(zona, ajuns, cate) {

  const zar = faZaruri(90210 + zona.COL);
  const noi = [];
  const maxDist = Math.sqrt(zona.COL * zona.COL + zona.RND * zona.RND);

  // Distanta pana la care totul ramane nivel 1: chiar langa sat.
  const raza1 = maxDist * 0.10;

  let incercari = 0;
  while (noi.length < cate && incercari < cate * 900) {
    incercari++;

    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r][c]) continue;

    // Nu prea aproape de o alta tabara, ca sa nu se amestece.
    const toate = zona.tabere.concat(noi);
    const inghesuit = toate.some(function (tab) {
      const dc = tab.c - c, dr = tab.r - r;
      return Math.sqrt(dc * dc + dr * dr) < 40;
    });
    if (inghesuit) continue;

    const dc = c - zona.start.col, dr = r - zona.start.rand;
    const dist = Math.sqrt(dc * dc + dr * dr);

    let nivel = 1;
    if (dist > raza1) {
      nivel = 1 + Math.round((dist - raza1) / (maxDist - raza1) * 11);
    }
    nivel = Math.max(1, Math.min(10, nivel));

    const feluri = zona.feluriPeNivel[nivel];
    const fel = feluri[Math.floor(zar() * feluri.length)];

    noi.push({ fel: fel, nivel: nivel, c: c, r: r, raza: 20, cati: 16 });
  }

  return noi;
}


// Imprastie inamicii unei tabere in jurul punctului ei, doar pe
// casute libere si la care chiar se poate ajunge.
function asazaMobii(zona) {

  let ajuns = undeSePoateAjunge(zona);

  const astupate = astupaPoieniileInchise(zona, ajuns, zona.literaUmplere);
  if (astupate > 0) {
    console.log('  am astupat ' + astupate + ' casute de poiana inchisa');
    ajuns = undeSePoateAjunge(zona);
  }

  const zar = faZaruri(4242);
  const mobi = [];

  // taberele scrise de mana + cele imprastiate singure
  const tabere = zona.tabere.concat(taberiAutomate(zona, ajuns, zona.tabereInPlus));

  tabere.forEach(function (tabara) {

    let pusi = 0, incercari = 0;

    while (pusi < tabara.cati && incercari < tabara.cati * 200) {
      incercari++;

      const unghi = zar() * Math.PI * 2;
      const raza = Math.sqrt(zar()) * tabara.raza;
      const c = Math.round(tabara.c + Math.cos(unghi) * raza);
      const r = Math.round(tabara.r + Math.sin(unghi) * raza);

      if (r < 0 || c < 0 || r >= zona.RND || c >= zona.COL) continue;
      if (!ajuns[r][c]) continue;

      // Nu doi inamici in acelasi loc, si nici lipiti unul de altul.
      const preaAproape = mobi.some(function (m) {
        return Math.abs(m.col - c) < 3 && Math.abs(m.rand - r) < 3;
      });
      if (preaAproape) continue;

      mobi.push({ fel: tabara.fel, col: c, rand: r, nivel: tabara.nivel });
      pusi++;
    }

    if (pusi < tabara.cati) {
      console.warn('  tabara ' + tabara.fel + ' nivel ' + tabara.nivel +
                   ': au incaput doar ' + pusi + ' din ' + tabara.cati);
    }
  });

  zona.mobi = mobi;
  zona.ajuns = ajuns;
  return zona;
}


// ==========================================================
//  SCRIEREA FISIERULUI
// ==========================================================
function scrieZona(zona, numeFisier, numeConstanta) {

  const linii = [];
  linii.push('// ==========================================================');
  zona.antet.forEach(function (l) { linii.push('//  ' + l); });
  linii.push('// ==========================================================');
  linii.push('');
  linii.push('const ' + numeConstanta + ' = {');
  linii.push('');
  linii.push("  nume: '" + zona.nume + "',");
  linii.push("  factiune: '" + zona.factiune + "',");
  linii.push('');
  linii.push('  // Fiecare litera folosita in harta trebuie sa apara si aici.');
  linii.push('  teren: {');

  const chei = Object.keys(zona.teren);
  chei.forEach(function (litera, i) {
    const f = zona.teren[litera];
    let rand = "    '" + litera + "': { culoare: 0x" + f.culoare.toString(16).padStart(6, '0') +
               ', blocat: ' + (f.blocat ? 'true' : 'false');
    if (f.variatie !== undefined) rand += ', variatie: 0x' + f.variatie.toString(16).padStart(6, '0');
    rand += ", textura: '" + f.textura + "' }";
    if (i < chei.length - 1) rand += ',';
    while (rand.length < 96) rand += ' ';
    linii.push(rand + '// ' + f.nota);
  });
  linii.push('  },');
  linii.push('');
  linii.push('  // Zona are ' + zona.COL + ' x ' + zona.RND + ' casute.');
  linii.push('  harta: [');
  zona.tabla.forEach(function (rand, i) {
    linii.push("    '" + rand.join('') + "'" + (i < zona.tabla.length - 1 ? ',' : ''));
  });
  linii.push('  ],');
  linii.push('');
  linii.push('  start:     { col: ' + zona.start.col + ', rand: ' + zona.start.rand + ' },');
  linii.push('  reinviere: { col: ' + zona.start.col + ', rand: ' + zona.start.rand + ' },');
  linii.push('');
  linii.push('  npci: [');
  zona.npci.forEach(function (n, i) {
    linii.push("    { fel: '" + n.fel + "', col: " + n.col + ', rand: ' + n.rand + ' }' +
               (i < zona.npci.length - 1 ? ',' : ''));
  });
  linii.push('  ],');
  linii.push('');
  linii.push('  // ' + zona.mobi.length + ' inamici, de la nivelul 1 langa tabara');
  linii.push('  // pana la nivelul 10 in coltul cel mai departat.');
  linii.push('  mobi: [');
  zona.mobi.forEach(function (m, i) {
    linii.push("    { fel: '" + m.fel + "', col: " + m.col + ', rand: ' + m.rand +
               ', nivel: ' + m.nivel + ' }' + (i < zona.mobi.length - 1 ? ',' : ''));
  });
  linii.push('  ]');
  linii.push('};');
  linii.push('');
  linii.push('// Zona se adauga singura in lista jocului.');
  linii.push('inregistreazaZona(' + numeConstanta + ');');
  linii.push('');

  const caleFisier = path.join(__dirname, '..', 'zone', numeFisier);
  fs.writeFileSync(caleFisier, linii.join('\n'), 'utf8');
  return caleFisier;
}


// ==========================================================
//  FELURILE DE TEREN
// ==========================================================
const TEREN_GREENVALE = {
  '.': { culoare: 0x4f9440, blocat: false, variatie: 0x589e48, textura: 'iarba',   nota: 'iarba' },
  'f': { culoare: 0x8fc46a, blocat: false, variatie: 0xc9d46b, textura: 'flori',   nota: 'poiana cu flori' },
  'h': { culoare: 0x86c163, blocat: false, variatie: 0x90ca6d, textura: 'iarba',   nota: 'dealul, mai insorit' },
  'P': { culoare: 0xb59567, blocat: false, variatie: 0xab8b5f, textura: 'pamant',  nota: 'drum de pamant' },
  'B': { culoare: 0x9a9384, blocat: false, variatie: 0x8f8879, textura: 'piatra',  nota: 'pod de piatra' },
  'D': { culoare: 0x6b4a2c, blocat: false,                     textura: 'lemn',    nota: 'usa' },
  'W': { culoare: 0x4b93d6, blocat: true,  variatie: 0x5aa0e0, textura: 'apa',     nota: 'rau' },
  'T': { culoare: 0x1f4d22, blocat: true,                      textura: 'frunzis', nota: 'copac' },
  's': { culoare: 0x376b32, blocat: true,                      textura: 'frunzis', nota: 'tufis' },
  'r': { culoare: 0x9c9689, blocat: true,                      textura: 'piatra',  nota: 'stanca' },
  'H': { culoare: 0xd6c8a8, blocat: true,                      textura: 'zid',     nota: 'perete de casa' },
  'R': { culoare: 0xb0402f, blocat: true,                      textura: 'tigla',   nota: 'acoperis rosu' },
  'S': { culoare: 0xb0aa9c, blocat: true,                      textura: 'piatra',  nota: 'zid de piatra' },
  'c': { culoare: 0x161f16, blocat: true,                      textura: 'neted',   nota: 'gura vizuinii de lupi' },
  'm': { culoare: 0x241d14, blocat: true,                      textura: 'neted',   nota: 'gura minei' },
  'o': { culoare: 0x6f6252, blocat: true,                      textura: 'piatra',  nota: 'gramada de steril' },
  'A': { culoare: 0x8d7b5a, blocat: true,                      textura: 'lemn',    nota: 'cort de bandit' },
  'F': { culoare: 0xd87a2a, blocat: true,                      textura: 'foc',     nota: 'foc de tabara' }
};

const TEREN_REDWASTE = {
  '.': { culoare: 0x6b3a1e, blocat: false, variatie: 0x633519, textura: 'crapat',  nota: 'pamant crapat' },
  'V': { culoare: 0xa89570, blocat: false, variatie: 0x9d8a65, textura: 'nisip',   nota: 'albia secata' },
  'n': { culoare: 0x8a6a42, blocat: false, variatie: 0x80613b, textura: 'nisip',   nota: 'nisip batut de vant' },
  'P': { culoare: 0x543018, blocat: false, variatie: 0x4d2c15, textura: 'pamant',  nota: 'drum batatorit' },
  'D': { culoare: 0x1c1208, blocat: false,                     textura: 'lemn',    nota: 'usa' },
  'X': { culoare: 0x2c1409, blocat: true,  variatie: 0x25110a, textura: 'piatra',  nota: 'peretele canionului' },
  'C': { culoare: 0x2f5230, blocat: true,                      textura: 'frunzis', nota: 'cactus' },
  's': { culoare: 0x554626, blocat: true,                      textura: 'frunzis', nota: 'tufa uscata' },
  'r': { culoare: 0x503a2b, blocat: true,                      textura: 'piatra',  nota: 'stanca' },
  'W': { culoare: 0x3a2513, blocat: true,                      textura: 'lemn',    nota: 'palisada de lemn' },
  'H': { culoare: 0x8a7a5e, blocat: true,                      textura: 'zid',     nota: 'perete de coliba' },
  'R': { culoare: 0x3a1f0f, blocat: true,                      textura: 'tigla',   nota: 'acoperis de piele' },
  'A': { culoare: 0x7d6c50, blocat: true,                      textura: 'lemn',    nota: 'cort de jefuitor' },
  'F': { culoare: 0xe8862f, blocat: true,                      textura: 'foc',     nota: 'foc de tabara' },
  'c': { culoare: 0x120a06, blocat: true,                      textura: 'neted',   nota: 'crapatura scorpionilor' }
};


// ==========================================================
//  PORNIREA
// ==========================================================
function construieste(numeleZonei, faZona, numeFisier, numeConstanta) {

  console.log('--- ' + numeleZonei + ' ---');
  const inceput = Date.now();

  const zona = faZona();
  asazaMobii(zona);

  // Cat din harta se poate umbla, plecand din locul de start.
  let libere = 0, atinse = 0;
  for (let r = 0; r < zona.RND; r++) {
    for (let c = 0; c < zona.COL; c++) {
      const felul = zona.teren[zona.tabla[r][c]];
      if (felul && !felul.blocat) libere++;
      if (zona.ajuns[r][c]) atinse++;
    }
  }

  const cale = scrieZona(zona, numeFisier, numeConstanta);

  console.log('  ' + zona.COL + ' x ' + zona.RND + ' casute');
  console.log('  ' + zona.mobi.length + ' inamici, ' + zona.npci.length + ' personaje prietenoase');
  console.log('  casute pe care se poate pasi: ' + libere +
              ', din care se poate ajunge la: ' + atinse +
              ' (' + Math.round(atinse / libere * 100) + '%)');
  console.log('  scris in ' + path.relative(process.cwd(), cale) +
              ', in ' + (Date.now() - inceput) + ' ms');
  console.log('');
}

construieste('Greenvale', faGreenvale, 'zona-greenvale.js', 'ZONA_GREENVALE');
construieste('Redwaste', faRedwaste, 'zona-redwaste.js', 'ZONA_REDWASTE');
