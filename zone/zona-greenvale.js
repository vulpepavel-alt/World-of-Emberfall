// ==========================================================
//  ZONA: Greenvale
//
//  Padure de primavara, la scara lui Elwynn Forest din WoW:
//  3.470 x 2.315 yarzi, adica 694 x 463 casute de cate 5 yarzi.
//  Zona de inceput pentru Human si Night Elf.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'greenvale',
  nume: 'Greenvale',
  continent: 'eastmarch',
  factiune: 'Alliance',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 694,
  RND: 463,
  samanta: 7331,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 2 },

  litere: LITERE,
  teren: climat('padure'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.12, r: 0.6 },
    { fel: 'ferma', id: 'ferma', c: 0.3, r: 0.66 },
    { fel: 'pestera', id: 'vizuina', c: 0.2, r: 0.12 },
    { fel: 'corturi', id: 'tabara', c: 0.6, r: 0.36 },
    { fel: 'mina', id: 'mina', c: 0.78, r: 0.78 },
    { fel: 'cetate', id: 'cetate', c: 0.84, r: 0.16 },
    { fel: 'poiana', id: 'coliba', c: 0.26, r: 0.24 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'ferma', dc: 0, dr: -1 },
    { fel: 'padurar', la: 'coliba', dc: 5, dr: 1 },
    { fel: 'miner', la: 'mina', dc: 4, dr: 4 },
    { fel: 'cavaler', la: 'cetate', dc: 3, dr: 12 }
  ],

  tabere: 54,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 1) return ['rat'];
    if (n <= 2) return ['rat', 'boar'];
    if (n <= 3) return ['boar', 'wolf'];
    if (n <= 5) return ['wolf', 'spider', 'bandit'];
    if (n <= 7) return ['spider', 'bandit'];
    return ['bandit', 'burrower'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { est: 'thornmoor' }
});
