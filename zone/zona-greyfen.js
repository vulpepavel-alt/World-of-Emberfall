// ==========================================================
//  ZONA: Greyfen        (eastmarch, nivel 25-35)
//
//  Mlastina joasa, unde apa sta si nu curge.
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

  id: 'greyfen',
  nume: 'Greyfen',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 25,
  nivelPanaLa: 35,

  COL: 760,
  RND: 501,
  samanta: 70424,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 1 },

  litere: LITERE,
  climat: 'mlastina',
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Greyfen Gate', c: 0.16, r: 0.44 },
    { fel: 'corturi', id: 'tabara', nume: 'Causeway Camp', c: 0.6, r: 0.3 },
    { fel: 'pestera', id: 'gaura', nume: 'Alder Hollow', c: 0.32, r: 0.74 },
    { fel: 'mina', id: 'groapa', nume: 'Fen Diggings', c: 0.76, r: 0.68 },
    { fel: 'poiana', id: 'popas', nume: 'Wayhouse', c: 0.48, r: 0.54 }
  ],

  npci: [
    { fel: 'stapanZbor',      la: 'tabara', dc:  6, dr:  6 },
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cavaler', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 65,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 27) return ['rat', 'spider'];
    if (n <= 28) return ['spider', 'serpent'];
    if (n <= 30) return ['serpent', 'burrower'];
    if (n <= 32) return ['burrower', 'bandit'];
    if (n <= 33) return ['bandit', 'scorpid'];
    return ['scorpid', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
