// ==========================================================
//  ZONA: The Pale Reach        (karador, nivel 50-60)
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

  id: 'palereach',
  nume: 'The Pale Reach',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 50,
  nivelPanaLa: 60,

  COL: 860,
  RND: 567,
  samanta: 43813,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 4, r: 0 },

  litere: LITERE,
  climat: 'munte',
  teren: climat('munte'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Palereach', c: 0.2, r: 0.42 },
    { fel: 'mina', id: 'mina', nume: 'Reach Mine', c: 0.62, r: 0.3 },
    { fel: 'mina', id: 'minaVeche', nume: 'Old Adit', c: 0.8, r: 0.72 },
    { fel: 'cetate', id: 'cetate', nume: 'Relay Keep', c: 0.44, r: 0.72 },
    { fel: 'corturi', id: 'tabara', nume: 'High Ground Camp', c: 0.34, r: 0.2 }
  ],

  npci: [
    { fel: 'stapanZbor',      la: 'tabara', dc:  6, dr:  6 },
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'capitan', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cercetas', la: 'mina', dc: 0, dr: 9 }
  ],

  tabere: 90,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 52) return ['rat', 'boar'];
    if (n <= 53) return ['boar', 'wolf'];
    if (n <= 55) return ['wolf', 'burrower'];
    if (n <= 57) return ['burrower', 'spider'];
    if (n <= 58) return ['spider', 'raider'];
    return ['raider', 'spider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
