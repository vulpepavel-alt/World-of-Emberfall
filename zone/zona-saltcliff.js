// ==========================================================
//  ZONA: Saltcliff
//
//  Stanci de sare deasupra marii. Portul unde trage corabia
//  de pe celalalt continent.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'saltcliff',
  nume: 'Saltcliff',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 22,
  nivelPanaLa: 32,

  COL: 780,
  RND: 520,
  samanta: 64007,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 1 },

  litere: LITERE,
  teren: climat('coasta'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'corabie', catre: 'mistwood', la: 'port' },

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.18, r: 0.46 },
    { fel: 'post', id: 'port', c: 0.86, r: 0.52 },
    { fel: 'pestera', id: 'pestera', c: 0.44, r: 0.2 },
    { fel: 'corturi', id: 'tabara', c: 0.62, r: 0.74 },
    { fel: 'cetate', id: 'far', c: 0.74, r: 0.26 }
  ],

  npci: [
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'vanator', la: 'sat', dc: 20, dr: 5 }
  ],

  tabere: 68,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 24) return ['serpent', 'vulture'];
    if (n <= 27) return ['vulture', 'scorpid'];
    if (n <= 30) return ['scorpid', 'raider'];
    return ['raider', 'burrower'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { vest: 'dustplain', sud: 'bonemarch' }
});
