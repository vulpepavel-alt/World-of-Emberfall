// ==========================================================
//  ZONA: The Long Steppe        (karador, nivel 30-40)
//
//  Campie intinsa de ierburi uscate si maracini.
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

  id: 'longsteppe',
  nume: 'The Long Steppe',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 30,
  nivelPanaLa: 40,

  COL: 780,
  RND: 514,
  samanta: 1291,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 3 },

  litere: LITERE,
  climat: 'campie',
  teren: climat('campie'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Steppewatch', c: 0.18, r: 0.5 },
    { fel: 'corturi', id: 'tabara', nume: 'Herd Camp', c: 0.66, r: 0.32 },
    { fel: 'pestera', id: 'vizuina', nume: 'Crossing Gap', c: 0.4, r: 0.76 },
    { fel: 'post', id: 'post', nume: 'North Line Post', c: 0.82, r: 0.56 },
    { fel: 'mina', id: 'mina', nume: 'Steppe Mine', c: 0.74, r: 0.8 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'cercetas', la: 'sat', dc: -4, dr: 12 },
    { fel: 'capitan', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 70,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 32) return ['rat', 'boar'];
    if (n <= 33) return ['boar', 'wolf'];
    if (n <= 35) return ['wolf', 'vulture'];
    if (n <= 37) return ['vulture', 'bandit'];
    if (n <= 38) return ['bandit', 'raider'];
    return ['raider', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
