// ==========================================================
//  TEMNITA: The Greyfen Sink        (nivel 26-30)
//
//  Mlastina din Greyfen s-a lasat intr-o noapte si a scos la lumina niste incaperi pe care nimeni nu le-a sapat. Apa intra si nu mai iese.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'greyfendepths',
  nume: 'The Greyfen Sink',
  continent: 'eastmarch',
  esteTemnita: true,

  intrareDin: { zona: 'greyfen', loc: 'gaura' },

  nivelDeLa: 26,
  nivelPanaLa: 30,

  COL: 320,
  RND: 230,
  samanta: 26030,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'gura', nume: 'The Sunken Mouth', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'sala', nume: 'The Drowned Floor', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'serpent', nume: 'Silt, Who Waits Under', nivel: 27,
             lasa: [
               { nume: 'Silt\'s Guard', slot: 'brau', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Silt Mark', slot: 'picioare', felArmura: 'zale', raritate: 'bun' }
             ] } },
    { id: 'bolta', nume: 'The Vaulted Dark', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'spider', nume: 'The Pale Weaver', nivel: 28,
             lasa: [
               { nume: 'Weaver\'s Guard', slot: 'incheieturi', felArmura: 'zale', raritate: 'bun' },
               { nume: 'The Weaver Mark', slot: 'umeri', felArmura: 'placi', raritate: 'bun' }
             ] } },
    { id: 'put', nume: 'The Standing Well', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'burrower', nume: 'What the Water Fed', nivel: 29,
             lasa: [
               { nume: 'Fed\'s Guard', slot: 'piept', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Fed Mark', slot: 'maini', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'inima', nume: 'The Room That Was Dry', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'bandit', nume: 'Maren Coss, Who Sold the Map', nivel: 30, rang: 'elit',
             lasa: [
               { nume: 'Coss\'s Guard', slot: 'picioare', felArmura: 'panza', raritate: 'rar' },
               { nume: 'The Coss Mark', slot: 'talpi', felArmura: 'piele', raritate: 'rar' },
               { nume: 'Coss-Cut Plate', slot: 'incheieturi', felArmura: 'zale', raritate: 'rar' }
             ] } }
  ],

  trash: 70,

  feluriPeNivel: function () {
    return ['serpent','spider','burrower'];
  }
});
