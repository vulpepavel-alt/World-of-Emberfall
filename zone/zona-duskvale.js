// ==========================================================
//  ZONA: Duskvale        (eastmarch, nivel 20-30)
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

  id: 'duskvale',
  nume: 'Duskvale',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 20,
  nivelPanaLa: 30,

  COL: 740,
  RND: 488,
  samanta: 42614,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 0 },

  litere: LITERE,
  climat: 'padure',
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
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cavaler', la: 'ferma', dc: 0, dr: 9 }
  ],

  tabere: 60,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 22) return ['rat', 'boar'];
    if (n <= 23) return ['boar', 'wolf'];
    if (n <= 25) return ['wolf', 'spider'];
    if (n <= 27) return ['spider', 'bandit'];
    if (n <= 28) return ['bandit', 'burrower'];
    return ['burrower', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
