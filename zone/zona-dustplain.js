// ==========================================================
//  ZONA: Dustplain        (karador, nivel 10-20)
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

  id: 'dustplain',
  nume: 'Dustplain',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 10,
  nivelPanaLa: 20,

  COL: 700,
  RND: 462,
  samanta: 21563,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 0, r: 1 },

  litere: LITERE,
  teren: climat('campie'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  // De aici pleci pe celalalt continent.
  port: { fel: 'zeppelin', catre: 'thornmoor', la: 'mina' },

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
    { fel: 'armurier', la: 'sat', dc: 15, dr: -2 }
  ],

  tabere: 50,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 12) return ['rat', 'boar'];
    if (n <= 13) return ['boar', 'wolf'];
    if (n <= 15) return ['wolf', 'vulture'];
    if (n <= 17) return ['vulture', 'bandit'];
    if (n <= 18) return ['bandit', 'raider'];
    return ['raider', 'bandit'];
  },

  start: { la: 'sat', dc: 6, dr: 1 }
});
