// ==========================================================
//  TEMNITA: The Coldspine Vault        (nivel 54-58)
//
//  Cetatea din Coldspine e goala de o suta de ani. Seiful de sub ea nu e.
//
//  Harta e CONSTRUITA din camerele de mai jos, nu generata ca o
//  padure. Coridoarele se sapa singure, de la o camera la
//  urmatoarea. Vezi construiesteTemnita din generator.js.
// ==========================================================

inregistreazaZona({

  id: 'coldspinevault',
  nume: 'The Coldspine Vault',
  continent: 'karador',
  esteTemnita: true,

  intrareDin: { zona: 'coldspine', loc: 'cetate' },

  nivelDeLa: 54,
  nivelPanaLa: 58,

  COL: 320,
  RND: 230,
  samanta: 54058,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  camere: [
    { id: 'poarta', nume: 'The Frozen Door', c: 0.1, r: 0.72, lat: 24, inalt: 18 },
    { id: 'sala', nume: 'The Hall of Cold Iron', c: 0.3, r: 0.48, lat: 34, inalt: 26,
      sef: { fel: 'garda', nume: 'The Door That Was Paid For', nivel: 55,
             lasa: [
               { nume: 'For\'s Guard', slot: 'incheieturi', felArmura: 'zale', raritate: 'bun' },
               { nume: 'The For Mark', slot: 'umeri', felArmura: 'placi', raritate: 'bun' }
             ] } },
    { id: 'arhiva', nume: 'The Paper Room', c: 0.5, r: 0.74, lat: 32, inalt: 24,
      sef: { fel: 'bandit', nume: 'Quill, Who Filed the Names', nivel: 56,
             lasa: [
               { nume: 'Quill\'s Guard', slot: 'piept', felArmura: 'placi', raritate: 'bun' },
               { nume: 'The Quill Mark', slot: 'maini', felArmura: 'panza', raritate: 'bun' }
             ] } },
    { id: 'trezorerie', nume: 'The Strongroom', c: 0.7, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'raider', nume: 'Captain Vorr, Still Under Contract', nivel: 57,
             lasa: [
               { nume: 'Vorr\'s Guard', slot: 'picioare', felArmura: 'panza', raritate: 'bun' },
               { nume: 'The Vorr Mark', slot: 'talpi', felArmura: 'piele', raritate: 'bun' }
             ] } },
    { id: 'fund', nume: 'The Deep Vault', c: 0.88, r: 0.7, lat: 40, inalt: 30,
      sef: { fel: 'garda', nume: 'The Vaultkeeper', nivel: 58, rang: 'elit',
             lasa: [
               { nume: 'Vaultkeeper\'s Guard', slot: 'umeri', felArmura: 'piele', raritate: 'rar' },
               { nume: 'The Vaultkeeper Mark', slot: 'cap', felArmura: 'zale', raritate: 'rar' },
               { nume: 'Vaultkeeper-Cut Plate', slot: 'piept', felArmura: 'placi', raritate: 'rar' }
             ] } }
  ],

  trash: 90,

  feluriPeNivel: function () {
    return ['garda','bandit','raider'];
  }
});
