// ==========================================================
//  ZONA: Greenvale        (eastmarch, nivel 1-10)
//
//  Padure deasa, cu drumuri batatorite si sate de lemn.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: cat e de mare,
//  ce culori are si unde stau locurile care conteaza. Harta se
//  construieste cand intri in zona, din samanta de mai jos - aceeasi
//  samanta da mereu aceeasi harta.
//
//  Vecinii NU se scriu: se afla singuri din locul zonei pe harta
//  lumii (peHarta). Doua zone alaturate pe grila se leaga intre ele.
// ==========================================================

inregistreazaZona({

  id: 'greenvale',
  nume: 'Greenvale',
  continent: 'eastmarch',
  factiune: 'Alliance',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 664,
  RND: 438,
  samanta: 76194,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 2 },

  litere: LITERE,
  teren: climat('padure'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.16, r: 0.52 },
    { fel: 'ferma', id: 'ferma', c: 0.34, r: 0.7 },
    { fel: 'pestera', id: 'vizuina', c: 0.24, r: 0.18 },
    { fel: 'corturi', id: 'tabara', c: 0.62, r: 0.34 },
    { fel: 'mina', id: 'mina', c: 0.78, r: 0.76 },
    { fel: 'cetate', id: 'cetate', c: 0.84, r: 0.18 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 }
  ],

  tabere: 41,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 3) return ['rat', 'boar'];
    if (n <= 4) return ['boar', 'wolf'];
    if (n <= 5) return ['wolf', 'spider'];
    if (n <= 7) return ['spider', 'bandit'];
    if (n <= 9) return ['bandit', 'burrower'];
    return ['burrower', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
