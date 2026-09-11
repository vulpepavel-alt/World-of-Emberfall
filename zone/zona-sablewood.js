// ==========================================================
//  ZONA: Sablewood        (eastmarch, nivel 35-45)
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

  id: 'sablewood',
  nume: 'Sablewood',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 35,
  nivelPanaLa: 45,

  COL: 800,
  RND: 528,
  samanta: 54387,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 0 },

  litere: LITERE,
  climat: 'padure',
  teren: climat('padure'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Sablewood', c: 0.16, r: 0.52 },
    { fel: 'ferma', id: 'ferma', nume: 'Edge Farm', c: 0.34, r: 0.7 },
    { fel: 'pestera', id: 'vizuina', nume: 'Stone Hollow', c: 0.24, r: 0.18 },
    { fel: 'corturi', id: 'tabara', nume: 'Road Camp', c: 0.62, r: 0.34 },
    { fel: 'mina', id: 'mina', nume: 'Swallowed Mine Head', c: 0.78, r: 0.76 },
    { fel: 'cetate', id: 'cetate', nume: 'Sablewood Keep', c: 0.84, r: 0.18 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'padurar', la: 'sat', dc: -4, dr: 12 },
    { fel: 'miner', la: 'ferma', dc: 0, dr: 9 }
  ],

  tabere: 75,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 37) return ['rat', 'boar'];
    if (n <= 38) return ['boar', 'wolf'];
    if (n <= 40) return ['wolf', 'spider'];
    if (n <= 42) return ['spider', 'bandit'];
    if (n <= 43) return ['bandit', 'burrower'];
    return ['burrower', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
