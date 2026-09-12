// ==========================================================
//  ZONA: Gravemoor        (eastmarch, nivel 1-10)
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

  id: 'gravemoor',
  nume: 'Gravemoor',
  continent: 'eastmarch',
  factiune: 'Pact',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 664,
  RND: 438,
  samanta: 29137,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 0 },

  litere: LITERE,
  climat: 'mlastina',
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Gravemoor', c: 0.16, r: 0.44 },
    { fel: 'corturi', id: 'tabara', nume: 'Reed Camp', c: 0.6, r: 0.3 },
    { fel: 'pestera', id: 'gaura', nume: 'Drowned Hollow', c: 0.32, r: 0.74 },
    { fel: 'mina', id: 'groapa', nume: 'Old Peat Cutting', c: 0.76, r: 0.68 },
    { fel: 'poiana', id: 'popas', nume: 'Coffin Ground', c: 0.48, r: 0.54 }
  ],

  npci: [
    { fel: 'chief', la: 'sat', dc: 3, dr: 1 },
    { fel: 'negustorOrc', la: 'sat', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'sat', dc: 16, dr: -2 },
    { fel: 'cavaler', la: 'sat', dc: -4, dr: 12 },
    { fel: 'taran', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 41,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 3) return ['rat', 'spider'];
    if (n <= 4) return ['spider', 'serpent'];
    if (n <= 5) return ['serpent', 'burrower'];
    if (n <= 7) return ['burrower', 'bandit'];
    if (n <= 9) return ['bandit', 'scorpid'];
    return ['scorpid', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
