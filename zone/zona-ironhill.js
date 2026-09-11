// ==========================================================
//  ZONA: Ironhill
//
//  Munti de piatra si zapada. Minele de fier ale continentului,
//  si ce a iesit din ele.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'ironhill',
  nume: 'Ironhill',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 32,
  nivelPanaLa: 44,

  COL: 800,
  RND: 530,
  samanta: 71113,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 2 },

  litere: LITERE,
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.2, r: 0.4 },
    { fel: 'mina', id: 'mina', c: 0.62, r: 0.3 },
    { fel: 'mina', id: 'minaVeche', c: 0.78, r: 0.72 },
    { fel: 'cetate', id: 'cetate', c: 0.44, r: 0.7 },
    { fel: 'corturi', id: 'tabara', c: 0.34, r: 0.2 }
  ],

  npci: [
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'miner', la: 'mina', dc: 4, dr: 4 },
    { fel: 'cavaler', la: 'cetate', dc: 3, dr: 12 }
  ],

  tabere: 70,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 35) return ['burrower', 'spider'];
    if (n <= 39) return ['burrower', 'bandit'];
    if (n <= 42) return ['bandit', 'raider'];
    return ['raider', 'burrower'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { vest: 'mistwood', sud: 'emberwastes' }
});
