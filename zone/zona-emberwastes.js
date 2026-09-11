// ==========================================================
//  ZONA: The Emberwastes
//
//  Pamant ars, cu foc sub el. Capatul continentului,
//  si capatul drumului pana la nivelul 60.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'emberwastes',
  nume: 'The Emberwastes',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 44,
  nivelPanaLa: 60,

  COL: 840,
  RND: 560,
  samanta: 88011,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 3 },

  litere: LITERE,
  teren: climat('cenusa'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'tabara', c: 0.14, r: 0.52 },
    { fel: 'corturi', id: 'tabara1', c: 0.5, r: 0.26 },
    { fel: 'corturi', id: 'tabara2', c: 0.66, r: 0.72 },
    { fel: 'mina', id: 'groapa', c: 0.8, r: 0.44 },
    { fel: 'cetate', id: 'cetate', c: 0.36, r: 0.76 }
  ],

  npci: [
    { fel: 'negustorOrc', la: 'tabara', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'tabara', dc: 16, dr: -2 },
    { fel: 'capitan', la: 'tabara', dc: 10, dr: 6 }
  ],

  tabere: 76,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 48) return ['burrower', 'raider'];
    if (n <= 53) return ['raider', 'scorpid'];
    if (n <= 57) return ['raider', 'burrower'];
    return ['raider', 'scorpid'];
  },

  start: { la: 'tabara', dc: 6, dr: 1 },

  vecini: { nord: 'ironhill' }
});
