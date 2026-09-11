// ==========================================================
//  ZONA: The Glasswastes        (karador, nivel 40-50)
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

  id: 'glasswastes',
  nume: 'The Glasswastes',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 40,
  nivelPanaLa: 50,

  COL: 820,
  RND: 541,
  samanta: 60586,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 2 },

  litere: LITERE,
  climat: 'pustiu',
  teren: climat('pustiu'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'sat', c: 0.14, r: 0.54 },
    { fel: 'pestera', id: 'crapatura', c: 0.32, r: 0.18 },
    { fel: 'corturi', id: 'tabara', c: 0.7, r: 0.72 },
    { fel: 'poiana', id: 'coliba', c: 0.4, r: 0.34 },
    { fel: 'post', id: 'post', c: 0.58, r: 0.6 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'cercetas', la: 'sat', dc: -4, dr: 12 },
    { fel: 'capitan', la: 'crapatura', dc: 0, dr: 9 }
  ],

  tabere: 80,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 42) return ['rat', 'boar'];
    if (n <= 43) return ['boar', 'vulture'];
    if (n <= 45) return ['vulture', 'serpent'];
    if (n <= 47) return ['serpent', 'scorpid'];
    if (n <= 48) return ['scorpid', 'raider'];
    return ['raider', 'scorpid'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
