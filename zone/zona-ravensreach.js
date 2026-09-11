// ==========================================================
//  ZONA: Ravensreach        (eastmarch, nivel 15-25)
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

  id: 'ravensreach',
  nume: 'Ravensreach',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 15,
  nivelPanaLa: 25,

  COL: 720,
  RND: 475,
  samanta: 88349,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 1 },

  litere: LITERE,
  climat: 'campie',
  teren: climat('campie'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Ravensreach', c: 0.18, r: 0.5 },
    { fel: 'corturi', id: 'tabara', nume: 'Runners\' Camp', c: 0.66, r: 0.32 },
    { fel: 'pestera', id: 'vizuina', nume: 'Raven Hollow', c: 0.4, r: 0.76 },
    { fel: 'post', id: 'post', nume: 'Sixth Signal Post', c: 0.82, r: 0.56 },
    { fel: 'mina', id: 'mina', nume: 'Chalk Mine', c: 0.74, r: 0.8 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cavaler', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 55,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 17) return ['rat', 'boar'];
    if (n <= 18) return ['boar', 'wolf'];
    if (n <= 20) return ['wolf', 'vulture'];
    if (n <= 22) return ['vulture', 'bandit'];
    if (n <= 23) return ['bandit', 'raider'];
    return ['raider', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
