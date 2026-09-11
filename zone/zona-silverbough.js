// ==========================================================
//  ZONA: Silverbough
//
//  Coasta de nord, cu paduri de argint si plaje lungi.
//  Zona de inceput pentru Night Elf.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'silverbough',
  nume: 'Silverbough',
  continent: 'karador',
  factiune: 'Alliance',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 680,
  RND: 455,
  samanta: 13577,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 0 },

  litere: LITERE,
  teren: climat('coasta'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'sat', id: 'sat', c: 0.18, r: 0.56 },
    { fel: 'pestera', id: 'vizuina', c: 0.32, r: 0.18 },
    { fel: 'corturi', id: 'tabara', c: 0.68, r: 0.34 },
    { fel: 'ferma', id: 'luminis', c: 0.44, r: 0.72 },
    { fel: 'cetate', id: 'turn', c: 0.8, r: 0.66 }
  ],

  npci: [
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'padurar', la: 'luminis', dc: 0, dr: -1 },
    { fel: 'cavaler', la: 'turn', dc: 3, dr: 12 }
  ],

  tabere: 50,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 1) return ['rat'];
    if (n <= 2) return ['rat', 'boar'];
    if (n <= 3) return ['boar', 'spider'];
    if (n <= 5) return ['spider', 'wolf', 'bandit'];
    if (n <= 7) return ['wolf', 'bandit'];
    return ['bandit', 'spider'];
  },

  start: { la: 'sat', dc: 6, dr: 1 },

  vecini: { sud: 'dustplain' }
});
