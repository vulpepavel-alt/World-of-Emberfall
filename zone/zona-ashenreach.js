// ==========================================================
//  ZONA: Ashen Reach        (eastmarch, nivel 45-55)
//
//  Pamant ars, cu foc mocnind sub el.
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

  id: 'ashenreach',
  nume: 'Ashen Reach',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 45,
  nivelPanaLa: 55,

  COL: 840,
  RND: 554,
  samanta: 88410,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 3, r: 3 },

  litere: LITERE,
  climat: 'cenusa',
  teren: climat('cenusa'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'corabie', catre: 'riftmarch', la: 'cetate' },

  locuri: [
    { fel: 'tabara', id: 'sat', nume: 'Reachward', c: 0.14, r: 0.52 },
    { fel: 'corturi', id: 'tabara', nume: 'Camp at the Third Well', c: 0.5, r: 0.26 },
    { fel: 'corturi', id: 'tabara2', nume: 'Second Well Camp', c: 0.66, r: 0.74 },
    { fel: 'mina', id: 'groapa', nume: 'Ash Diggings', c: 0.8, r: 0.44 },
    { fel: 'cetate', id: 'cetate', nume: 'Wells Keep', c: 0.36, r: 0.76 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cavaler', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 85,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 47) return ['scorpid', 'serpent'];
    if (n <= 48) return ['serpent', 'burrower'];
    if (n <= 50) return ['burrower', 'raider'];
    if (n <= 52) return ['raider', 'vulture'];
    if (n <= 53) return ['vulture', 'bandit'];
    return ['bandit', 'vulture'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
