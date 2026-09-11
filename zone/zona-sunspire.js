// ==========================================================
//  ZONA: Sunspire        (karador, nivel 20-30)
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

  id: 'sunspire',
  nume: 'Sunspire',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 20,
  nivelPanaLa: 30,

  COL: 740,
  RND: 488,
  samanta: 82718,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 0 },

  litere: LITERE,
  climat: 'campie',
  teren: climat('campie'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.18, r: 0.5 },
    { fel: 'corturi', id: 'tabara', c: 0.66, r: 0.32 },
    { fel: 'pestera', id: 'vizuina', c: 0.4, r: 0.76 },
    { fel: 'post', id: 'post', c: 0.82, r: 0.56 },
    { fel: 'mina', id: 'mina', c: 0.74, r: 0.8 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'capitan', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cercetas', la: 'tabara', dc: 0, dr: 9 }
  ],

  tabere: 60,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 22) return ['rat', 'boar'];
    if (n <= 23) return ['boar', 'wolf'];
    if (n <= 25) return ['wolf', 'vulture'];
    if (n <= 27) return ['vulture', 'bandit'];
    if (n <= 28) return ['bandit', 'raider'];
    return ['raider', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
