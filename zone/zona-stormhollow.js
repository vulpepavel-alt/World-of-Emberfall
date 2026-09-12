// ==========================================================
//  ZONA: Stormhollow        (eastmarch, nivel 25-35)
//
//  Coasta cu stanci, plaje lungi si vant sarat.
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

  id: 'stormhollow',
  nume: 'Stormhollow',
  continent: 'eastmarch',
  factiune: null,

  nivelDeLa: 25,
  nivelPanaLa: 35,

  COL: 760,
  RND: 501,
  samanta: 23616,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 2, r: 2 },

  litere: LITERE,
  climat: 'coasta',
  teren: climat('coasta'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Stormhollow', c: 0.18, r: 0.54 },
    { fel: 'pestera', id: 'pestera', nume: 'Cove Cave', c: 0.34, r: 0.2 },
    { fel: 'corturi', id: 'tabara', nume: 'Cliff Camp', c: 0.66, r: 0.34 },
    { fel: 'ferma', id: 'luminis', nume: 'Cliff Garden', c: 0.46, r: 0.74 },
    { fel: 'cetate', id: 'far', nume: 'Lighthouse', c: 0.8, r: 0.66 }
  ],

  npci: [
    { fel: 'stapanZbor',      la: 'tabara', dc:  6, dr:  6 },
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'taran', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cavaler', la: 'pestera', dc: 0, dr: 9 }
  ],

  tabere: 65,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 27) return ['rat', 'boar'];
    if (n <= 28) return ['boar', 'spider'];
    if (n <= 30) return ['spider', 'vulture'];
    if (n <= 32) return ['vulture', 'serpent'];
    if (n <= 33) return ['serpent', 'bandit'];
    return ['bandit', 'serpent'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
