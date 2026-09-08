// ==========================================================
//  FELURILE DE INAMICI
//
//  Fiecare fel are:
//    nume    - cum il cheama pe ecran (textul sta in texte.js)
//    stats   - viata, damage, viteza de lovire, armura, nivel
//    forme   - din ce bucati colorate e desenat
//
//  Ca sa adaugi un fel nou: copiezi un bloc si il pui in lista
//  "mobi" a unei zone. Nu trebuie modificat codul jocului.
//
//  FORMELE se deseneaza fata de mijlocul inamicului:
//    x negativ = spre stanga, y negativ = mai sus
//    fel 'dr'   = dreptunghi, are w (latime) si h (inaltime)
//    fel 'cerc' = cerc, are r (raza)
//  Bucatile se deseneaza in ordinea din lista: prima jos, ultima deasupra.
// ==========================================================


// Statisticile de nivel 1, in stilul World of Warcraft.
// ATENTIE: numerele astea sunt scrise din memorie, nu verificate
// in joc. Sunt aceleasi pentru toate felurile, cum ai cerut la
// inceput - le echilibram mai tarziu, fel cu fel.
const STATS_NIVEL_1 = {
  nivel: 1,
  viata: 42,
  dmgMin: 1,
  dmgMax: 3,
  viteza: 2.0,   // secunde intre doua lovituri
  armura: 20
};


const MOBI = {

  // ---------- GREENVALE ----------

  wolf: {
    nume: TEXT.WOLF,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -6, y: 10, w:  4, h:  7, culoare: 0x5f6165 },  // picior
      { fel: 'dr',   x:   6, y: 10, w:  4, h:  7, culoare: 0x5f6165 },
      { fel: 'dr',   x:  13, y:  0, w:  9, h:  4, culoare: 0x6a6c71 },  // coada
      { fel: 'dr',   x:   0, y:  3, w: 22, h: 12, culoare: 0x77797e },  // trup
      { fel: 'dr',   x: -13, y: -8, w:  4, h:  5, culoare: 0x83858a },  // urechi
      { fel: 'dr',   x:  -8, y: -8, w:  4, h:  5, culoare: 0x83858a },
      { fel: 'dr',   x: -11, y: -1, w: 11, h: 10, culoare: 0x83858a },  // cap
      { fel: 'dr',   x: -19, y:  2, w:  7, h:  5, culoare: 0x6a6c71 },  // bot
      { fel: 'dr',   x: -13, y: -2, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  burrower: {
    nume: TEXT.BURROWER,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  10, y: 11, w: 13, h:  5, culoare: 0x5e4630 },  // musuroiul din spate
      { fel: 'cerc', x:   0, y:  3, r: 11,        culoare: 0x7a5a3a },  // trup
      { fel: 'dr',   x: -12, y:  8, w:  8, h:  3, culoare: 0xe2ddd2 },  // gheare
      { fel: 'dr',   x: -12, y: 12, w:  8, h:  3, culoare: 0xe2ddd2 },
      { fel: 'cerc', x:  -9, y:  0, r:  7,        culoare: 0x8a6a46 },  // cap
      { fel: 'dr',   x: -16, y:  1, w:  6, h:  4, culoare: 0xd6a6a0 },  // ras
      { fel: 'dr',   x: -10, y: -3, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  bandit: {
    nume: TEXT.BANDIT,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  11, y:  1, w:  3, h: 13, culoare: 0xc8ccd4 },  // pumnal
      { fel: 'dr',   x:   0, y:  5, w: 18, h: 18, culoare: 0x3f4a3d },  // trup
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },  // cap
      { fel: 'dr',   x:   0, y:-14, w: 18, h:  7, culoare: 0x2c352a },  // gluga
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  // ---------- REDWASTE ----------

  scorpid: {
    nume: TEXT.SCORPID,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  12, y: -2, w:  6, h:  6, culoare: 0xc99a45 },  // coada
      { fel: 'dr',   x:  15, y: -8, w:  6, h:  6, culoare: 0xc99a45 },
      { fel: 'dr',   x:  17, y:-14, w:  5, h:  6, culoare: 0x2c2418 },  // acul
      { fel: 'dr',   x:   0, y:  4, w: 20, h: 13, culoare: 0xb98a3a },  // trup
      { fel: 'dr',   x: -19, y: -2, w:  9, h:  4, culoare: 0xd8a94f },  // clesti
      { fel: 'dr',   x: -19, y:  9, w:  9, h:  4, culoare: 0xd8a94f },
      { fel: 'dr',   x: -11, y:  3, w:  9, h:  9, culoare: 0xc99a45 },  // cap
      { fel: 'dr',   x: -12, y:  1, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  boar: {
    nume: TEXT.BOAR,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -6, y: 12, w:  4, h:  7, culoare: 0x4f3c28 },  // picioare
      { fel: 'dr',   x:   7, y: 12, w:  4, h:  7, culoare: 0x4f3c28 },
      { fel: 'dr',   x:   0, y:  4, w: 24, h: 15, culoare: 0x6b5236 },  // trup
      { fel: 'dr',   x: -11, y: -4, w:  4, h:  4, culoare: 0x5c4530 },  // ureche
      { fel: 'dr',   x: -12, y:  3, w: 11, h: 12, culoare: 0x7a5f40 },  // cap
      { fel: 'dr',   x: -20, y:  5, w:  7, h:  7, culoare: 0x93755a },  // rat
      { fel: 'dr',   x: -21, y:  1, w:  5, h:  3, culoare: 0xece5d2 },  // colti
      { fel: 'dr',   x: -21, y: 11, w:  5, h:  3, culoare: 0xece5d2 },
      { fel: 'dr',   x: -13, y:  0, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  raider: {
    nume: TEXT.RAIDER,
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  12, y:  2, w:  3, h: 15, culoare: 0x5b3a1a },  // coada toporului
      { fel: 'dr',   x:  16, y: -4, w:  8, h:  8, culoare: 0xb8bcc4 },  // lama
      { fel: 'dr',   x:   0, y:  5, w: 19, h: 18, culoare: 0x7a4a30 },  // trup
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xc99a6a },  // cap
      { fel: 'dr',   x:   0, y:-12, w: 18, h:  5, culoare: 0x9c3a2c },  // banderola rosie
      { fel: 'dr',   x:  -3, y: -7, w:  2, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   3, y: -7, w:  2, h:  2, culoare: 0x120f0c }
    ]
  }
};
