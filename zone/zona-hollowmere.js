// ==========================================================
//  ZONA: Hollowmere        (eastmarch, nivel 10-20)
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

  id: 'hollowmere',
  nume: 'Hollowmere',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 10,
  nivelPanaLa: 20,

  COL: 700,
  RND: 462,
  samanta: 89448,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 0 },

  litere: LITERE,
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', c: 0.16, r: 0.44 },
    { fel: 'corturi', id: 'tabara', c: 0.6, r: 0.3 },
    { fel: 'pestera', id: 'gaura', c: 0.32, r: 0.74 },
    { fel: 'mina', id: 'groapa', c: 0.76, r: 0.68 },
    { fel: 'poiana', id: 'popas', c: 0.48, r: 0.54 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 }
  ],

  tabere: 50,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 12) return ['rat', 'spider'];
    if (n <= 13) return ['spider', 'serpent'];
    if (n <= 15) return ['serpent', 'burrower'];
    if (n <= 17) return ['burrower', 'bandit'];
    if (n <= 18) return ['bandit', 'scorpid'];
    return ['scorpid', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
