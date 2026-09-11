// ==========================================================
//  ZONA: Thornmoor
//
//  Campie uscata cu maracini, intre padure si mlastina.
//  Aici se aduna drumurile din toata jumatatea de vest.
//  Are si zeppelinul catre celalalt continent.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'thornmoor',
  nume: 'Thornmoor',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 12,
  nivelPanaLa: 22,

  COL: 720,
  RND: 480,
  samanta: 44101,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 1 },

  litere: LITERE,
  teren: climat('campie'),


  // De aici pleci pe celalalt continent.
  port: { fel: 'zeppelin', catre: 'dustplain', la: 'port' },

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.18, r: 0.5 },
    { fel: 'corturi', id: 'tabara', c: 0.66, r: 0.3 },
    { fel: 'pestera', id: 'vizuina', c: 0.4, r: 0.76 },
    { fel: 'post', id: 'port', c: 0.84, r: 0.56 },
    { fel: 'mina', id: 'mina', c: 0.74, r: 0.8 }
  ],

  npci: [
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 }
  ],

  tabere: 62,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 14) return ['boar', 'wolf'];
    if (n <= 17) return ['wolf', 'spider', 'bandit'];
    if (n <= 20) return ['bandit', 'scorpid'];
    return ['bandit', 'burrower'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { vest: 'greenvale', nord: 'gravemoor', sud: 'mistwood' }
});
