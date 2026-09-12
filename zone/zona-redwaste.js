// ==========================================================
//  ZONA: Redwaste        (karador, nivel 1-10)
//
//  Pustiu rosu, cu albii secate si stanci arse de soare.
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

  id: 'redwaste',
  nume: 'Redwaste',
  continent: 'karador',
  factiune: 'Pact',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 664,
  RND: 438,
  samanta: 49417,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 2 },

  litere: LITERE,
  climat: 'pustiu',
  teren: climat('pustiu'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Redwaste Camp', c: 0.14, r: 0.54 },
    { fel: 'pestera', id: 'crapatura', nume: 'Red Crack', c: 0.32, r: 0.18 },
    { fel: 'corturi', id: 'tabara', nume: 'Warband Camp', c: 0.7, r: 0.72 },
    { fel: 'poiana', id: 'coliba', nume: 'Bonecaster\'s Hut', c: 0.4, r: 0.34 },
    { fel: 'post', id: 'post', nume: 'Scout Post', c: 0.58, r: 0.6 }
  ],

  npci: [
    { fel: 'hangiu',     la: 'tabara', dc: -6, dr:  6 },
    { fel: 'stapanZbor',      la: 'tabara', dc:  6, dr:  6 },
    { fel: 'chief', la: 'sat', dc: 3, dr: 1 },
    { fel: 'negustorOrc', la: 'sat', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'sat', dc: 16, dr: -2 },
    { fel: 'samana',   la: 'sat', dc: -18, dr: 7 },
    { fel: 'capitan',  la: 'sat', dc: 10, dr: 6 },
    { fel: 'vanator',  la: 'coliba', dc: 3, dr: 3 },
    { fel: 'cercetas', la: 'post', dc: 2, dr: 1 }
  ],

  tabere: 41,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 3) return ['rat', 'boar'];
    if (n <= 4) return ['boar', 'vulture'];
    if (n <= 5) return ['vulture', 'serpent'];
    if (n <= 7) return ['serpent', 'scorpid'];
    if (n <= 9) return ['scorpid', 'raider'];
    return ['raider', 'scorpid'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
