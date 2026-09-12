// ==========================================================
//  TEMNITA: Gravehold Undercroft        (nivel 42-46)
//
//  Sub cetatea din Gravehold e o pivnita mai veche decat cetatea. Cine a construit deasupra a stiut si n-a spus.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'gravehollow',
  nume: 'Gravehold Undercroft',
  continent: 'eastmarch',
  esteTemnita: true,

  intrareDin: { zona: 'gravehold', loc: 'cetate' },

  nivelDeLa: 42,
  nivelPanaLa: 46,

  COL: 320,
  RND: 230,
  samanta: 42046,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'trepte', nume: 'The Stair Head', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'cripta', nume: 'The Shelf Room', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'vulture', nume: 'The Thing on the Shelves', nivel: 43,
             lasa: [
               { nume: 'Shelves\'s Guard', slot: 'piept', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Shelves Mark', slot: 'maini', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'sala', nume: 'The Hall of Names', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'bandit', nume: 'Sister Ivo, Who Kept the Keys', nivel: 44,
             lasa: [
               { nume: 'Ivo\'s Guard', slot: 'picioare', felArmura: 'panza', raritate: 'bun' },
               { nume: 'The Ivo Mark', slot: 'talpi', felArmura: 'piele', raritate: 'bun' }
             ] } },
    { id: 'camara', nume: 'The Sealed Stores', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'serpent', nume: 'Coil, Who Came Up', nivel: 45,
             lasa: [
               { nume: 'Coil\'s Guard', slot: 'umeri', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Coil Mark', slot: 'cap', felArmura: 'zale', raritate: 'bun' }
             ] } },
    { id: 'fund', nume: 'The Older Floor', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'raider', nume: 'Warden Hale, Who Sold the Dead', nivel: 46, rang: 'elit',
             lasa: [
               { nume: 'Hale\'s Guard', slot: 'maini', felArmura: 'zale', raritate: 'rar' },
               { nume: 'The Hale Mark', slot: 'brau', felArmura: 'placi', raritate: 'rar' },
               { nume: 'Hale-Cut Plate', slot: 'picioare', felArmura: 'panza', raritate: 'rar' }
             ] } }
  ],

  trash: 80,

  feluriPeNivel: function () {
    return ['vulture','bandit','serpent'];
  }
});
