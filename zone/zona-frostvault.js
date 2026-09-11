// ==========================================================
//  ZONA: Frostvault
//
//  Munti de gheata la capatul de apus. Ultima zona a
//  continentului, si ultimele niveluri pana la 60.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'frostvault',
  nume: 'Frostvault',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 44,
  nivelPanaLa: 60,

  COL: 860,
  RND: 575,
  samanta: 95101,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 2 },

  litere: LITERE,
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.16, r: 0.5 },
    { fel: 'mina', id: 'mina', c: 0.46, r: 0.26 },
    { fel: 'mina', id: 'minaVeche', c: 0.7, r: 0.7 },
    { fel: 'cetate', id: 'cetate', c: 0.76, r: 0.34 },
    { fel: 'corturi', id: 'tabara', c: 0.34, r: 0.74 }
  ],

  npci: [
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'cavaler', la: 'cetate', dc: 3, dr: 12 }
  ],

  tabere: 74,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 48) return ['burrower', 'wolf'];
    if (n <= 53) return ['wolf', 'raider'];
    if (n <= 57) return ['raider', 'burrower'];
    return ['raider', 'burrower'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { vest: 'bonemarch' }
});
