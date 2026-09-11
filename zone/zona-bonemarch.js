// ==========================================================
//  ZONA: Bonemarch
//
//  Pustiu de oase, unde vin sa moara toate fiarele mari
//  ale continentului.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'bonemarch',
  nume: 'Bonemarch',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 32,
  nivelPanaLa: 44,

  COL: 820,
  RND: 545,
  samanta: 77003,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 2 },

  litere: LITERE,
  teren: climat('pustiu'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'tabara', c: 0.16, r: 0.44 },
    { fel: 'pestera', id: 'crapatura', c: 0.4, r: 0.22 },
    { fel: 'corturi', id: 'tabara1', c: 0.6, r: 0.32 },
    { fel: 'mina', id: 'groapa', c: 0.74, r: 0.7 },
    { fel: 'cetate', id: 'cetate', c: 0.34, r: 0.74 }
  ],

  npci: [
    { fel: 'negustorOrc', la: 'tabara', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'tabara', dc: 16, dr: -2 },
    { fel: 'samana', la: 'tabara', dc: -18, dr: 7 }
  ],

  tabere: 72,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 35) return ['scorpid', 'serpent'];
    if (n <= 39) return ['scorpid', 'raider'];
    if (n <= 42) return ['raider', 'burrower'];
    return ['raider', 'burrower'];
  },

  start: { la: 'tabara', dc: 6, dr: 1 },

  vecini: { nord: 'saltcliff', est: 'frostvault' }
});
