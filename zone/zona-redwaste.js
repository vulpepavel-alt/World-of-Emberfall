// ==========================================================
//  ZONA: Redwaste
//
//  Canion uscat, la scara lui Durotar din WoW:
//  5.287 x 3.525 yarzi, adica 1.058 x 705 casute.
//  Zona de inceput pentru Orc.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'redwaste',
  nume: 'Redwaste',
  continent: 'karador',
  factiune: 'Horde',

  nivelDeLa: 1,
  nivelPanaLa: 10,

  COL: 1058,
  RND: 705,
  samanta: 20461,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 2 },

  litere: LITERE,
  teren: climat('pustiu'),

  apaLa: 0.46, apaUnduire: 42, apaLatime: 6,

  locuri: [
    { fel: 'tabara', id: 'tabara', c: 0.14, r: 0.56 },
    { fel: 'pestera', id: 'crapatura', c: 0.3, r: 0.16 },
    { fel: 'corturi', id: 'jefuitori', c: 0.7, r: 0.74 },
    { fel: 'poiana', id: 'coliba', c: 0.38, r: 0.34 },
    { fel: 'post', id: 'straja', c: 0.56, r: 0.62 }
  ],

  npci: [
    { fel: 'chief', la: 'tabara', dc: 3, dr: 1 },
    { fel: 'negustorOrc', la: 'tabara', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'tabara', dc: 16, dr: -2 },
    { fel: 'samana', la: 'tabara', dc: -18, dr: 7 },
    { fel: 'capitan', la: 'tabara', dc: 10, dr: 6 },
    { fel: 'vanator', la: 'coliba', dc: 3, dr: 3 },
    { fel: 'cercetas', la: 'straja', dc: 2, dr: 1 }
  ],

  tabere: 82,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 1) return ['rat'];
    if (n <= 2) return ['rat', 'boar'];
    if (n <= 3) return ['boar', 'vulture'];
    if (n <= 5) return ['vulture', 'serpent', 'raider'];
    if (n <= 7) return ['raider', 'scorpid'];
    return ['raider', 'scorpid'];
  },

  start: { la: 'tabara', dc: 6, dr: 1 },

  vecini: { nord: 'dustplain' }
});
