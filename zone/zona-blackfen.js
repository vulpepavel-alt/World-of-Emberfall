// ==========================================================
//  ZONA: Blackfen        (eastmarch, nivel 40-50)
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

  id: 'blackfen',
  nume: 'Blackfen',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 40,
  nivelPanaLa: 50,

  COL: 820,
  RND: 541,
  samanta: 52951,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 2 },

  litere: LITERE,
  climat: 'mlastina',
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Mirewick', c: 0.16, r: 0.44 },
    { fel: 'corturi', id: 'tabara', nume: 'Reed Camp', c: 0.6, r: 0.3 },
    { fel: 'pestera', id: 'gaura', nume: 'Sink Hole', c: 0.32, r: 0.74 },
    { fel: 'mina', id: 'groapa', nume: 'Peat Diggings', c: 0.76, r: 0.68 },
    { fel: 'poiana', id: 'popas', nume: 'Old Road Rest', c: 0.48, r: 0.54 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'miner', la: 'sat', dc: -4, dr: 12 },
    { fel: 'padurar', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 80,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 42) return ['rat', 'spider'];
    if (n <= 43) return ['spider', 'serpent'];
    if (n <= 45) return ['serpent', 'burrower'];
    if (n <= 47) return ['burrower', 'bandit'];
    if (n <= 48) return ['bandit', 'scorpid'];
    return ['scorpid', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
