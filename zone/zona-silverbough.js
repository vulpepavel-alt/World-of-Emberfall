// ==========================================================
//  ZONA: Silverbough        (karador, nivel 1-10)
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

  id: 'silverbough',
  nume: 'Silverbough',
  continent: 'karador',
  factiune: 'Alliance',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 664,
  RND: 438,
  samanta: 52923,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 0 },

  litere: LITERE,
  climat: 'coasta',
  teren: climat('coasta'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.18, r: 0.54 },
    { fel: 'pestera', id: 'pestera', c: 0.34, r: 0.2 },
    { fel: 'corturi', id: 'tabara', c: 0.66, r: 0.34 },
    { fel: 'ferma', id: 'luminis', c: 0.46, r: 0.74 },
    { fel: 'cetate', id: 'far', c: 0.8, r: 0.66 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'capitan', la: 'sat', dc: -4, dr: 12 },
    { fel: 'cercetas', la: 'pestera', dc: 0, dr: 9 }
  ],

  tabere: 41,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 3) return ['rat', 'boar'];
    if (n <= 4) return ['boar', 'spider'];
    if (n <= 5) return ['spider', 'vulture'];
    if (n <= 7) return ['vulture', 'serpent'];
    if (n <= 9) return ['serpent', 'bandit'];
    return ['bandit', 'serpent'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
