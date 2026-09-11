// ==========================================================
//  ZONA: Ironhill        (eastmarch, nivel 30-40)
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

  id: 'ironhill',
  nume: 'Ironhill',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 30,
  nivelPanaLa: 40,

  COL: 780,
  RND: 514,
  samanta: 83739,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 3 },

  litere: LITERE,
  climat: 'munte',
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Ironhill', c: 0.2, r: 0.42 },
    { fel: 'mina', id: 'mina', nume: 'New Workings', c: 0.62, r: 0.3 },
    { fel: 'mina', id: 'minaVeche', nume: 'Sealed Mine', c: 0.8, r: 0.72 },
    { fel: 'cetate', id: 'cetate', nume: 'Ironhill Keep', c: 0.44, r: 0.72 },
    { fel: 'corturi', id: 'tabara', nume: 'Spoil Camp', c: 0.34, r: 0.2 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'padurar', la: 'sat', dc: -4, dr: 12 },
    { fel: 'miner', la: 'mina', dc: 0, dr: 9 }
  ],

  tabere: 70,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 32) return ['rat', 'boar'];
    if (n <= 33) return ['boar', 'wolf'];
    if (n <= 35) return ['wolf', 'burrower'];
    if (n <= 37) return ['burrower', 'spider'];
    if (n <= 38) return ['spider', 'raider'];
    return ['raider', 'spider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
