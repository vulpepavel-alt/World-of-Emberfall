// ==========================================================
//  ZONA: Gravehold        (eastmarch, nivel 40-50)
//
//  Munti de piatra si zapada, cu mine sapate adanc.
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

  id: 'gravehold',
  nume: 'Gravehold',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 40,
  nivelPanaLa: 50,

  COL: 820,
  RND: 541,
  samanta: 74468,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 3 },

  litere: LITERE,
  climat: 'munte',
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Gravehold', c: 0.2, r: 0.42 },
    { fel: 'mina', id: 'mina', nume: 'Tomb Quarry', c: 0.62, r: 0.3 },
    { fel: 'mina', id: 'minaVeche', nume: 'Old Quarry', c: 0.8, r: 0.72 },
    { fel: 'cetate', id: 'cetate', nume: 'Gatehouse', c: 0.44, r: 0.72 },
    { fel: 'corturi', id: 'tabara', nume: 'High Track Camp', c: 0.34, r: 0.2 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'miner', la: 'sat', dc: -4, dr: 12 },
    { fel: 'padurar', la: 'mina', dc: 0, dr: 9 }
  ],

  tabere: 80,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 42) return ['rat', 'boar'];
    if (n <= 43) return ['boar', 'wolf'];
    if (n <= 45) return ['wolf', 'burrower'];
    if (n <= 47) return ['burrower', 'spider'];
    if (n <= 48) return ['spider', 'raider'];
    return ['raider', 'spider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
