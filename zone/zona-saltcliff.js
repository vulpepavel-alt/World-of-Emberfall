// ==========================================================
//  ZONA: Saltcliff        (karador, nivel 20-30)
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

  id: 'saltcliff',
  nume: 'Saltcliff',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 20,
  nivelPanaLa: 30,

  COL: 740,
  RND: 488,
  samanta: 8307,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 2 },

  litere: LITERE,
  climat: 'coasta',
  teren: climat('coasta'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'corabie', catre: 'mistwood', la: 'far' },

  locuri: [
    { fel: 'sat', id: 'sat', nume: 'Saltcliff', c: 0.18, r: 0.54 },
    { fel: 'pestera', id: 'pestera', nume: 'Brine Cave', c: 0.34, r: 0.2 },
    { fel: 'corturi', id: 'tabara', nume: 'Pan Camp', c: 0.66, r: 0.34 },
    { fel: 'ferma', id: 'luminis', nume: 'Drying Racks', c: 0.46, r: 0.74 },
    { fel: 'cetate', id: 'far', nume: 'Saltcliff Light', c: 0.8, r: 0.66 }
  ],

  npci: [
    { fel: 'stapanZbor',      la: 'tabara', dc:  6, dr:  6 },
    { fel: 'marshal', la: 'sat', dc: 4, dr: 1 },
    { fel: 'negustor', la: 'sat', dc: -8, dr: -1 },
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 },
    { fel: 'cercetas', la: 'sat', dc: -4, dr: 12 },
    { fel: 'capitan', la: 'pestera', dc: 0, dr: 9 }
  ],

  tabere: 60,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 22) return ['rat', 'boar'];
    if (n <= 23) return ['boar', 'spider'];
    if (n <= 25) return ['spider', 'vulture'];
    if (n <= 27) return ['vulture', 'serpent'];
    if (n <= 28) return ['serpent', 'bandit'];
    return ['bandit', 'serpent'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
