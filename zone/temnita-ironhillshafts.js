// ==========================================================
//  TEMNITA: The Ironhill Shafts        (nivel 34-38)
//
//  Mina din Ironhill are trei niveluri. Al treilea a fost inchis cu zid, iar zidul a fost spart pe dinauntru.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'ironhillshafts',
  nume: 'The Ironhill Shafts',
  continent: 'eastmarch',
  esteTemnita: true,

  intrareDin: { zona: 'ironhill', loc: 'mina' },

  nivelDeLa: 34,
  nivelPanaLa: 38,

  COL: 320,
  RND: 230,
  samanta: 34038,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'gura', nume: 'The Cage Head', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'galerie', nume: 'The Long Gallery', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'raider', nume: 'Foreman Bask, Still on Shift', nivel: 35,
             lasa: [
               { nume: 'Bask\'s Guard', slot: 'maini', felArmura: 'zale', raritate: 'bun' },
               { nume: 'The Bask Mark', slot: 'brau', felArmura: 'placi', raritate: 'bun' }
             ] } },
    { id: 'atelier', nume: 'The Wheelhouse', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'burrower', nume: 'The Cut That Bled', nivel: 36,
             lasa: [
               { nume: 'Bled\'s Guard', slot: 'talpi', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Bled Mark', slot: 'incheieturi', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'surpat', nume: 'The Fallen Cut', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'scorpid', nume: 'Rustback', nivel: 37,
             lasa: [
               { nume: 'Rustback\'s Guard', slot: 'cap', felArmura: 'panza', raritate: 'bun' },
               { nume: 'The Rustback Mark', slot: 'piept', felArmura: 'piele', raritate: 'bun' }
             ] } },
    { id: 'fund', nume: 'The Third Level', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'bandit', nume: 'Alder Grange, Who Bought the Deed', nivel: 38, rang: 'elit',
             lasa: [
               { nume: 'Grange\'s Guard', slot: 'brau', felArmura: 'piele', raritate: 'rar' },
               { nume: 'The Grange Mark', slot: 'picioare', felArmura: 'zale', raritate: 'rar' },
               { nume: 'Grange-Cut Plate', slot: 'talpi', felArmura: 'placi', raritate: 'rar' }
             ] } }
  ],

  trash: 75,

  feluriPeNivel: function () {
    return ['raider','burrower','scorpid'];
  }
});
