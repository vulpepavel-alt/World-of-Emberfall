// ==========================================================
//  ZONA: Mistwood
//
//  Padure batrana, mereu in ceata. Are portul de unde pleaca
//  corabia spre celalalt continent.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'mistwood',
  nume: 'Mistwood',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 22,
  nivelPanaLa: 32,

  COL: 760,
  RND: 500,
  samanta: 60607,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 2 },

  litere: LITERE,
  teren: climat('padure'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'corabie', catre: 'saltcliff', la: 'port' },

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.16, r: 0.44 },
    { fel: 'post', id: 'port', c: 0.86, r: 0.5 },
    { fel: 'corturi', id: 'tabara', c: 0.56, r: 0.24 },
    { fel: 'pestera', id: 'vizuina', c: 0.34, r: 0.78 },
    { fel: 'cetate', id: 'turn', c: 0.72, r: 0.74 }
  ],

  npci: [
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'cavaler', la: 'turn', dc: 3, dr: 12 },
    { fel: 'padurar', la: 'sat', dc: 22, dr: 4 }
  ],

  tabere: 66,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 24) return ['wolf', 'spider'];
    if (n <= 27) return ['spider', 'bandit'];
    if (n <= 30) return ['bandit', 'burrower'];
    return ['burrower', 'raider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { nord: 'thornmoor', est: 'ironhill' }
});
