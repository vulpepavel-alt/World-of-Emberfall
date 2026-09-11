// ==========================================================
//  FELURILE DE INAMICI
//
//  Fiecare fel are:
//    nume    - cum il cheama pe ecran (textul sta in texte.js)
//    neam    - 'fiara' sau 'umanoid'. Ca in WoW, FIARELE NU LASA
//              BANI: un lup n-are punga. Lasa bani doar umanoizii.
//    vechituri - lucrurile gri pe care le lasa: colti, catarame,
//              pene. Nu se poarta, sunt doar de vandut, si cad de
//              la mai mult de jumatate din inamici.
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


// Statisticile inamicilor, dupa nivel.
//
// ATENTIE: numerele astea sunt scrise din memorie, nu copiate din
// joc. Un inamic de nivel 1 are 42 de viata si loveste cu 1-3,
// iar unul de nivel 10 ajunge pe la 217 viata si 8-13 damage.
// Le putem regla oricand, dintr-un singur loc.
const STATS_NIVEL_1 = {
  nivel: 1,
  viata: 42,
  dmgMin: 1,
  dmgMax: 3,
  viteza: 2.0,   // secunde intre doua lovituri
  armura: 20
};

// Acelasi fel de inamic, dar de alt nivel. Fiecare nivel il face
// cam cu o cincime mai rezistent si putin mai dureros.
function statsPentruNivel(nivel) {

  const n = Math.max(1, Math.round(nivel || 1));
  if (n === 1) return STATS_NIVEL_1;

  return {
    nivel:  n,
    viata:  Math.round(STATS_NIVEL_1.viata * Math.pow(1.20, n - 1)),
    dmgMin: Math.round(STATS_NIVEL_1.dmgMin + (n - 1) * 0.8),
    dmgMax: Math.round(STATS_NIVEL_1.dmgMax + (n - 1) * 1.1),
    viteza: STATS_NIVEL_1.viteza,
    armura: STATS_NIVEL_1.armura + (n - 1) * 5
  };
}


const MOBI = {

  // ---------- GREENVALE ----------

  wolf: {
    nume: TEXT.WOLF,
    vechituri: ['Chipped Fang', 'Ragged Pelt', 'Torn Ear'],
    neam: 'fiara',
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
    vechituri: ['Dulled Claw', 'Shell Fragment', 'Grub Casing'],
    neam: 'fiara',
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
    vechituri: ['Bent Buckle', 'Empty Flask', 'Frayed Bandana', 'Cracked Dice'],
    neam: 'umanoid',
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

  // Sobolanul de camp: cel mai slab lucru din zona, chiar langa sat.
  rat: {
    nume: TEXT.RAT,
    vechituri: ['Chewed Rat Tail', 'Matted Fur', 'Gnawed Bone'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  11, y:  4, w:  9, h:  2, culoare: 0xa08a72 },  // coada
      { fel: 'dr',   x:   0, y:  4, w: 16, h:  9, culoare: 0x6e5f4e },  // trup
      { fel: 'dr',   x:  -7, y: -3, w:  3, h:  4, culoare: 0x7d6d59 },  // urechi
      { fel: 'dr',   x:  -2, y: -3, w:  3, h:  4, culoare: 0x7d6d59 },
      { fel: 'dr',   x:  -7, y:  2, w:  9, h:  7, culoare: 0x7d6d59 },  // cap
      { fel: 'dr',   x: -13, y:  4, w:  5, h:  4, culoare: 0x8d7c66 },  // bot
      { fel: 'dr',   x:  -8, y:  0, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  // Paianjenul de padure: picioare lungi, trup rotund.
  spider: {
    nume: TEXT.SPIDER,
    vechituri: ['Dried Silk Bundle', 'Brittle Leg', 'Clouded Eye'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -9, y: -6, w: 12, h:  2, culoare: 0x2b2028 },  // picioarele
      { fel: 'dr',   x:   9, y: -6, w: 12, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x: -11, y:  2, w: 14, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:  11, y:  2, w: 14, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:  -9, y: 10, w: 12, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:   9, y: 10, w: 12, h:  2, culoare: 0x2b2028 },
      { fel: 'cerc', x:   6, y:  3, r: 10,        culoare: 0x4a3550 },  // abdomen
      { fel: 'cerc', x:  -7, y:  1, r:  7,        culoare: 0x5b4362 },  // cap
      { fel: 'dr',   x: -10, y: -2, w:  2, h:  2, culoare: 0xd8d0a0 },  // ochii
      { fel: 'dr',   x:  -6, y: -2, w:  2, h:  2, culoare: 0xd8d0a0 }
    ]
  },

  // ---------- REDWASTE ----------

  scorpid: {
    nume: TEXT.SCORPID,
    vechituri: ['Cracked Carapace', 'Blunted Stinger', 'Chitin Shard'],
    neam: 'fiara',
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
    vechituri: ['Cracked Tusk', 'Coarse Bristle', 'Scrap of Hide'],
    neam: 'fiara',
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

  // Vulturul de praf: aripi late, gat golas.
  vulture: {
    nume: TEXT.VULTURE,
    vechituri: ['Scorched Feather', 'Hooked Beak', 'Hollow Bone'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:   0, y:  2, w: 34, h:  5, culoare: 0x3f372e },  // aripile intinse
      { fel: 'dr',   x: -14, y: -1, w:  9, h:  4, culoare: 0x4b4239 },
      { fel: 'dr',   x:  14, y: -1, w:  9, h:  4, culoare: 0x4b4239 },
      { fel: 'dr',   x:   0, y:  7, w: 14, h: 12, culoare: 0x554a3d },  // trup
      { fel: 'dr',   x:  -1, y: -3, w:  4, h:  7, culoare: 0xa38f6a },  // gat
      { fel: 'cerc', x:  -1, y: -8, r:  5,        culoare: 0xb09a72 },  // cap
      { fel: 'dr',   x:  -7, y: -7, w:  5, h:  3, culoare: 0xe0b055 },  // cioc
      { fel: 'dr',   x:  -2, y: -9, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  // Sarpele de nisip: incolacit, cu capul ridicat.
  serpent: {
    nume: TEXT.SERPENT,
    vechituri: ['Shed Scale', 'Rattle Tip', 'Dried Venom Gland'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:   8, y: 12, w: 20, h:  5, culoare: 0x6b7a3a },  // coada incolacita
      { fel: 'dr',   x:  -4, y:  8, w: 22, h:  6, culoare: 0x7a8b43 },
      { fel: 'dr',   x:   2, y:  1, w: 18, h:  6, culoare: 0x7a8b43 },
      { fel: 'dr',   x:  -4, y: -5, w:  6, h: 13, culoare: 0x87994b },  // gatul ridicat
      { fel: 'cerc', x:  -4, y:-11, r:  6,        culoare: 0x95a855 },  // cap
      { fel: 'dr',   x: -11, y: -9, w:  5, h:  2, culoare: 0xd85a4a },  // limba
      { fel: 'dr',   x:  -6, y:-12, w:  2, h:  2, culoare: 0xe8c84a }   // ochi
    ]
  },

  raider: {
    nume: TEXT.RAIDER,
    vechituri: ['Notched Blade Fragment', 'Sun-bleached Strap', 'Dented Cup'],
    neam: 'umanoid',
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
