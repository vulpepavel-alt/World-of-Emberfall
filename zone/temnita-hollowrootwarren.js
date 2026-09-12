// ==========================================================
//  TEMNITA: The Hollowroot Warren        (nivel 48-52)
//
//  Radacinile din Hollowroot sunt goale pe dinauntru si se leaga intre ele. Ceva le-a facut incaperi.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'hollowrootwarren',
  nume: 'The Hollowroot Warren',
  continent: 'karador',
  esteTemnita: true,

  intrareDin: { zona: 'hollowroot', loc: 'gaura' },

  nivelDeLa: 48,
  nivelPanaLa: 52,

  COL: 320,
  RND: 230,
  samanta: 48052,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'gura', nume: 'The Root Mouth', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'impletit', nume: 'The Braided Hall', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'spider', nume: 'The Braider', nivel: 49,
             lasa: [
               { nume: 'Braider\'s Guard', slot: 'umeri', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Braider Mark', slot: 'cap', felArmura: 'zale', raritate: 'bun' }
             ] } },
    { id: 'cuib', nume: 'The Nursery', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'wolf', nume: 'Grey Nine', nivel: 50,
             lasa: [
               { nume: 'Nine\'s Guard', slot: 'maini', felArmura: 'zale', raritate: 'bun' },
               { nume: 'The Nine Mark', slot: 'brau', felArmura: 'placi', raritate: 'bun' }
             ] } },
    { id: 'putred', nume: 'The Rotting Cut', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'burrower', nume: 'What Ate the Roots', nivel: 51,
             lasa: [
               { nume: 'Roots\'s Guard', slot: 'talpi', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Roots Mark', slot: 'incheieturi', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'inima', nume: 'The Heartwood', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'raider', nume: 'Ossian Rook, Who Lit the Fires', nivel: 52, rang: 'elit',
             lasa: [
               { nume: 'Rook\'s Guard', slot: 'cap', felArmura: 'panza', raritate: 'rar' },
               { nume: 'The Rook Mark', slot: 'piept', felArmura: 'piele', raritate: 'rar' },
               { nume: 'Rook-Cut Plate', slot: 'maini', felArmura: 'zale', raritate: 'rar' }
             ] } }
  ],

  trash: 85,

  feluriPeNivel: function () {
    return ['spider','wolf','burrower'];
  }
});
