// ==========================================================
//  ZONA: Stonecall        (karador, nivel 15-25)
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

  id: 'stonecall',
  nume: 'Stonecall',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 15,
  nivelPanaLa: 25,

  COL: 720,
  RND: 475,
  samanta: 27224,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 1 },

  litere: LITERE,
  climat: 'munte',
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.2, r: 0.42 },
    { fel: 'mina', id: 'mina', c: 0.62, r: 0.3 },
    { fel: 'mina', id: 'minaVeche', c: 0.8, r: 0.72 },
    { fel: 'cetate', id: 'cetate', c: 0.44, r: 0.72 },
    { fel: 'corturi', id: 'tabara', c: 0.34, r: 0.2 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'vanator', la: 'sat', dc: -4, dr: 12 },
    { fel: 'samana', la: 'mina', dc: 0, dr: 9 }
  ],

  tabere: 55,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 17) return ['rat', 'boar'];
    if (n <= 18) return ['boar', 'wolf'];
    if (n <= 20) return ['wolf', 'burrower'];
    if (n <= 22) return ['burrower', 'spider'];
    if (n <= 23) return ['spider', 'raider'];
    return ['raider', 'spider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
