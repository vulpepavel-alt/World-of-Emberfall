// ==========================================================
//  ZONA: Ashenmoor        (eastmarch, nivel 35-45)
//
//  Pamant ars, cu foc mocnind sub el.
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

  id: 'ashenmoor',
  nume: 'Ashenmoor',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 35,
  nivelPanaLa: 45,

  COL: 800,
  RND: 528,
  samanta: 14380,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 1 },

  litere: LITERE,
  teren: climat('cenusa'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', c: 0.14, r: 0.52 },
    { fel: 'corturi', id: 'tabara', c: 0.5, r: 0.26 },
    { fel: 'corturi', id: 'tabara2', c: 0.66, r: 0.74 },
    { fel: 'mina', id: 'groapa', c: 0.8, r: 0.44 },
    { fel: 'cetate', id: 'cetate', c: 0.36, r: 0.76 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 }
  ],

  tabere: 75,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 37) return ['scorpid', 'serpent'];
    if (n <= 38) return ['serpent', 'burrower'];
    if (n <= 40) return ['burrower', 'raider'];
    if (n <= 42) return ['raider', 'vulture'];
    if (n <= 43) return ['vulture', 'bandit'];
    return ['bandit', 'vulture'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
