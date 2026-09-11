// ==========================================================
//  ZONA: Thornmoor        (eastmarch, nivel 10-20)
//
//  Campie intinsa de ierburi uscate si maracini.
//
//  Aici e ORASUL Ambervault, unul din cele doua orase mari ale lumii.
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

  id: 'thornmoor',
  nume: 'Thornmoor',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 10,
  nivelPanaLa: 20,

  COL: 700,
  RND: 462,
  samanta: 49322,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 1 },

  litere: LITERE,
  climat: 'campie',
  teren: climat('campie'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'zeppelin', catre: 'dustplain', la: 'mina' },

  locuri: [
    { fel: 'oras', id: 'oras', nume: 'Ambervault', c: 0.30, r: 0.46 },
    { fel: 'corturi', id: 'tabara', nume: 'Heather Camp', c: 0.66, r: 0.32 },
    { fel: 'pestera', id: 'vizuina', nume: 'Moor Hollow', c: 0.4, r: 0.76 },
    { fel: 'post', id: 'post', nume: 'Moor Toll Post', c: 0.82, r: 0.56 },
    { fel: 'mina', id: 'mina', nume: 'Ambervault Mine', c: 0.74, r: 0.8 }
  ],

  npci: [
    { fel: 'marshal', la: 'oras', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'oras', dc: -22, dr: -2 },
    { fel: 'armurier', la: 'oras', dc: 22, dr: -2 },
    { fel: 'negustor', la: 'oras', dc: -22, dr: 14 },
    { fel: 'armurier', la: 'oras', dc: 22, dr: 14 },
    { fel: 'cavaler', la: 'oras', dc: 0, dr: -16 },
    { fel: 'padurar', la: 'oras', dc: -14, dr: 18 },
    { fel: 'miner', la: 'oras', dc: 14, dr: 18 },
    { fel: 'taran', la: 'oras', dc: -30, dr: 4 }
  ],

  tabere: 50,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 12) return ['rat', 'boar'];
    if (n <= 13) return ['boar', 'wolf'];
    if (n <= 15) return ['wolf', 'vulture'];
    if (n <= 17) return ['vulture', 'bandit'];
    if (n <= 18) return ['bandit', 'raider'];
    return ['raider', 'bandit'];
  },

  start: { la: 'oras', dc: 6, dr: 14 }
});
