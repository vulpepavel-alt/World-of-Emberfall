// ==========================================================
//  TEMNITA: Thornspire Hold        (nivel 57-60)
//
//  Ultima temnita dinainte de coasta. Cetatea din Thornspire a fost cumparata, nu cucerita, si cei dinauntru inca isi primesc leafa.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'thornspirehold',
  nume: 'Thornspire Hold',
  continent: 'eastmarch',
  esteTemnita: true,

  intrareDin: { zona: 'thornspire', loc: 'cetate' },

  nivelDeLa: 57,
  nivelPanaLa: 60,

  COL: 320,
  RND: 230,
  samanta: 57060,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'poarta', nume: 'The Bought Gate', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'curte', nume: 'The Inner Yard', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'garda', nume: 'The Gate They Bought', nivel: 58,
             lasa: [
               { nume: 'Bought\'s Guard', slot: 'talpi', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Bought Mark', slot: 'incheieturi', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'sala', nume: 'The Muster Hall', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'raider', nume: 'Serjeant Lynd, Paid Monthly', nivel: 59,
             lasa: [
               { nume: 'Lynd\'s Guard', slot: 'cap', felArmura: 'panza', raritate: 'bun' },
               { nume: 'The Lynd Mark', slot: 'piept', felArmura: 'piele', raritate: 'bun' }
             ] } },
    { id: 'turn', nume: 'The Signal Tower', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'garda', nume: 'The Signal Keeper', nivel: 59,
             lasa: [
               { nume: 'Keeper\'s Guard', slot: 'brau', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Keeper Mark', slot: 'picioare', felArmura: 'zale', raritate: 'bun' }
             ] } },
    { id: 'varf', nume: 'The Paid Room', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'factor', nume: 'Under-Factor Reyn', nivel: 60, rang: 'elit',
             lasa: [
               { nume: 'Reyn\'s Guard', slot: 'incheieturi', felArmura: 'zale', raritate: 'rar' },
               { nume: 'The Reyn Mark', slot: 'umeri', felArmura: 'placi', raritate: 'rar' },
               { nume: 'Reyn-Cut Plate', slot: 'cap', felArmura: 'panza', raritate: 'rar' }
             ] } }
  ],

  trash: 95,

  feluriPeNivel: function () {
    return ['garda','raider','bandit'];
  }
});
