// ==========================================================
//  ZONA: Gravemoor
//
//  Mlastina rece de la nord, unde apa sta si nu curge.
//  Zona de inceput pentru Undead.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'gravemoor',
  nume: 'Gravemoor',
  continent: 'eastmarch',
  factiune: 'Horde',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 660,
  RND: 440,
  samanta: 90211,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 0 },

  litere: LITERE,
  teren: climat('mlastina'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'tabara', c: 0.16, r: 0.3 },
    { fel: 'corturi', id: 'banditi', c: 0.62, r: 0.3 },
    { fel: 'pestera', id: 'gaura', c: 0.3, r: 0.72 },
    { fel: 'mina', id: 'groapa', c: 0.76, r: 0.7 },
    { fel: 'poiana', id: 'popas', c: 0.46, r: 0.52 }
  ],

  npci: [
    { fel: 'chief', la: 'tabara', dc: 3, dr: 1 },
    { fel: 'negustorOrc', la: 'tabara', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'tabara', dc: 16, dr: -2 },
    { fel: 'samana', la: 'tabara', dc: -18, dr: 7 },
    { fel: 'cercetas', la: 'popas', dc: 2, dr: 1 }
  ],

  tabere: 48,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 1) return ['rat'];
    if (n <= 2) return ['rat', 'spider'];
    if (n <= 4) return ['spider', 'serpent'];
    if (n <= 6) return ['serpent', 'bandit'];
    if (n <= 8) return ['bandit', 'burrower'];
    return ['burrower', 'bandit'];
  },

  start: { la: 'tabara', dc: 6, dr: 1 },

  vecini: { sud: 'thornmoor' }
});
