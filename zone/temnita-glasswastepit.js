// ==========================================================
//  TEMNITA: The Glass Pit        (nivel 42-46)
//
//  In Glasswastes, nisipul s-a topit candva si s-a facut sticla. Groapa merge in jos prin ea, si peretii taie.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'glasswastepit',
  nume: 'The Glass Pit',
  continent: 'karador',
  esteTemnita: true,

  intrareDin: { zona: 'glasswastes', loc: 'crapatura' },

  nivelDeLa: 42,
  nivelPanaLa: 46,

  COL: 320,
  RND: 230,
  samanta: 42047,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'gura', nume: 'The Cut Mouth', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'sticla', nume: 'The Green Floor', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'scorpid', nume: 'Shardback', nivel: 43,
             lasa: [
               { nume: 'Shardback\'s Guard', slot: 'cap', felArmura: 'panza', raritate: 'bun' },
               { nume: 'The Shardback Mark', slot: 'piept', felArmura: 'piele', raritate: 'bun' }
             ] } },
    { id: 'cuptor', nume: 'The Old Kiln', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'serpent', nume: 'What Coils in Glass', nivel: 44,
             lasa: [
               { nume: 'Glass\'s Guard', slot: 'brau', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Glass Mark', slot: 'picioare', felArmura: 'zale', raritate: 'bun' }
             ] } },
    { id: 'fisura', nume: 'The Split', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'raider', nume: 'Tessin Vail, Who Dug for Buyers', nivel: 45,
             lasa: [
               { nume: 'Vail\'s Guard', slot: 'incheieturi', felArmura: 'zale', raritate: 'bun' },
               { nume: 'The Vail Mark', slot: 'umeri', felArmura: 'placi', raritate: 'bun' }
             ] } },
    { id: 'fund', nume: 'The Bottom Glass', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'bandit', nume: 'The Kiln Master', nivel: 46, rang: 'elit',
             lasa: [
               { nume: 'Master\'s Guard', slot: 'piept', felArmura: 'placi', raritate: 'rar' },
               { nume: 'The Master Mark', slot: 'maini', felArmura: 'panza', raritate: 'rar' },
               { nume: 'Master-Cut Plate', slot: 'brau', felArmura: 'piele', raritate: 'rar' }
             ] } }
  ],

  trash: 80,

  feluriPeNivel: function () {
    return ['scorpid','serpent','raider'];
  }
});
