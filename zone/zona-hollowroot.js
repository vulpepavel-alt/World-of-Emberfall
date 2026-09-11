// ==========================================================
//  ZONA: Hollowroot        (karador, nivel 45-55)
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

  id: 'hollowroot',
  nume: 'Hollowroot',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 45,
  nivelPanaLa: 55,

  COL: 840,
  RND: 554,
  samanta: 8728,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 3 },

  litere: LITERE,
  climat: 'mlastina',
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Hollowroot', c: 0.16, r: 0.44 },
    { fel: 'corturi', id: 'tabara', nume: 'Uphill Camp', c: 0.6, r: 0.3 },
    { fel: 'pestera', id: 'gaura', nume: 'Hollow Under the Hall', c: 0.32, r: 0.74 },
    { fel: 'mina', id: 'groapa', nume: 'Root Diggings', c: 0.76, r: 0.68 },
    { fel: 'poiana', id: 'popas', nume: 'Drained Pool', c: 0.48, r: 0.54 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'capitan', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cercetas', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 85,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 47) return ['rat', 'spider'];
    if (n <= 48) return ['spider', 'serpent'];
    if (n <= 50) return ['serpent', 'burrower'];
    if (n <= 52) return ['burrower', 'bandit'];
    if (n <= 53) return ['bandit', 'scorpid'];
    return ['scorpid', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
