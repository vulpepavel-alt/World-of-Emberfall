// ==========================================================
//  PERSONAJELE PRIETENOASE (NPC)
//
//  NPC = personaj din joc care NU e condus de tine si NU e
//  inamic. Nu te atacă, nu poate fi atacat, nu se plimba.
//  Deocamdata stau pe loc si atat - vor conta mai tarziu.
//
//  Ca sa se vada dintr-o privire ca NU sunt inamici:
//    - numele lor e AURIU (al inamicilor e alb)
//    - au sub nume un titlu, in paranteze ascutite: <Warband Chief>
//    - NU au bara rosie de viata deasupra capului
//
//  Unii NPC sunt NEGUSTORI. Aceia au in plus:
//    vinde: 'armura' sau 'arma' - ce fel de marfa tin pe taraba
//  Cand te duci langa ei si ii atingi, se deschide taraba.
//
//  Formele se scriu la fel ca la inamici, in mobi.js:
//    x negativ = spre stanga, y negativ = mai sus
//    fel 'dr' = dreptunghi (w, h), fel 'cerc' = cerc (r)
// ==========================================================

const NPC = {

  // Greenvale: un om, in sat
  marshal: {
    nume:  TEXT.MARSHAL_NAME,
    titlu: TEXT.MARSHAL_TITLE,
    forme: [
      { fel: 'dr',   x:  13, y: -4, w:  4, h: 30, culoare: 0x6b4a2c },  // sulita
      { fel: 'dr',   x:  13, y:-21, w:  7, h:  9, culoare: 0xd2d6de },  // varful sulitei
      { fel: 'dr',   x:   0, y:  6, w: 20, h: 20, culoare: 0x2f5aa8 },  // tunica albastra
      { fel: 'dr',   x:   0, y:  6, w:  6, h: 20, culoare: 0xd8c88a },  // dunga aurie
      { fel: 'dr',   x: -11, y:  2, w:  4, h: 12, culoare: 0x9aa4b4 },  // umeri
      { fel: 'dr',   x:  11, y:  2, w:  4, h: 12, culoare: 0x9aa4b4 },
      { fel: 'cerc', x:   0, y:-10, r:  8,        culoare: 0xf0c9a6 },  // cap
      { fel: 'dr',   x:   0, y:-16, w: 17, h:  6, culoare: 0x4a3826 },  // par
      { fel: 'dr',   x:  -3, y: -9, w:  2, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   3, y: -9, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  // Redwaste: un orc, in tabara
  chief: {
    nume:  TEXT.CHIEF_NAME,
    titlu: TEXT.CHIEF_TITLE,
    forme: [
      { fel: 'dr',   x:  14, y: -2, w:  4, h: 26, culoare: 0x5b3a1a },  // coada toporului
      { fel: 'dr',   x:  15, y:-17, w: 11, h: 11, culoare: 0xb8bcc4 },  // lama mare
      { fel: 'dr',   x:   0, y:  7, w: 24, h: 21, culoare: 0x6b4028 },  // trup
      { fel: 'dr',   x:   0, y:  0, w: 24, h:  6, culoare: 0x8a2f22 },  // esarfa rosie
      { fel: 'dr',   x: -14, y:  4, w:  5, h: 14, culoare: 0x4f7a3c },  // brate verzi
      { fel: 'dr',   x:  14, y:  4, w:  5, h: 14, culoare: 0x4f7a3c },
      { fel: 'cerc', x:   0, y:-11, r: 10,        culoare: 0x5f9e63 },  // cap verde
      { fel: 'dr',   x:  -5, y: -4, w:  3, h:  6, culoare: 0xf2ece0 },  // colti
      { fel: 'dr',   x:   5, y: -4, w:  3, h:  6, culoare: 0xf2ece0 },
      { fel: 'dr',   x:   0, y:-19, w: 21, h:  6, culoare: 0x24331f },  // par negru
      { fel: 'dr',   x:  -4, y:-12, w:  3, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   4, y:-12, w:  3, h:  2, culoare: 0x120f0c }
    ]
  },


  // ---------- NEGUSTORII DIN GREENVALE ----------

  // Negustorul de marfuri: sort maro, sac in spate.
  negustor: {
    nume:  TEXT.MERCHANT_NAME,
    titlu: TEXT.MERCHANT_TITLE,
    vinde: 'armura',
    forme: [
      { fel: 'dr',   x:  13, y:  0, w: 13, h: 15, culoare: 0x8a6a3e },  // sacul din spate
      { fel: 'dr',   x:  13, y: -6, w:  9, h:  4, culoare: 0x6b5230 },  // gura sacului
      { fel: 'dr',   x:   0, y:  7, w: 20, h: 20, culoare: 0x6e4e2c },  // sort maro
      { fel: 'dr',   x:   0, y:  3, w: 20, h:  4, culoare: 0xa8834a },  // curea lata
      { fel: 'dr',   x: -11, y:  4, w:  4, h: 12, culoare: 0xe8c4a0 },  // brate
      { fel: 'dr',   x:  11, y:  4, w:  4, h: 12, culoare: 0xe8c4a0 },
      { fel: 'cerc', x:   0, y:-10, r:  8,        culoare: 0xf0c9a6 },  // cap
      { fel: 'dr',   x:   0, y:-17, w: 19, h:  5, culoare: 0x6b4a2c },  // palarie
      { fel: 'dr',   x:   0, y:-20, w: 11, h:  4, culoare: 0x5b3e24 },
      { fel: 'dr',   x:  -3, y: -9, w:  2, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   3, y: -9, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  // Armurierul: sort de piele, ciocan si nicovala.
  armurier: {
    nume:  TEXT.SMITH_NAME,
    titlu: TEXT.SMITH_TITLE,
    vinde: 'arma',
    forme: [
      { fel: 'dr',   x: -15, y: 14, w: 16, h:  8, culoare: 0x4a4a52 },  // nicovala
      { fel: 'dr',   x: -15, y:  9, w: 10, h:  4, culoare: 0x5c5c66 },
      { fel: 'dr',   x:  13, y: -8, w:  4, h: 20, culoare: 0x6b4a2c },  // coada ciocanului
      { fel: 'dr',   x:  13, y:-19, w: 11, h:  8, culoare: 0x7a7a84 },  // capul ciocanului
      { fel: 'dr',   x:   0, y:  7, w: 21, h: 20, culoare: 0x4a3524 },  // sort de piele
      { fel: 'dr',   x:   0, y:  2, w: 21, h:  3, culoare: 0x8a6a3a },
      { fel: 'dr',   x: -12, y:  4, w:  5, h: 13, culoare: 0xd8a884 },  // brate
      { fel: 'dr',   x:  12, y:  4, w:  5, h: 13, culoare: 0xd8a884 },
      { fel: 'cerc', x:   0, y:-10, r:  8,        culoare: 0xe0b48c },  // cap
      { fel: 'dr',   x:   0, y: -4, w: 13, h:  6, culoare: 0x3a2c1c },  // barba
      { fel: 'dr',   x:   0, y:-17, w: 17, h:  5, culoare: 0x3a2c1c },  // par
      { fel: 'dr',   x:  -3, y:-10, w:  2, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   3, y:-10, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },


  // ---------- NEGUSTORII DIN REDWASTE ----------

  negustorOrc: {
    nume:  TEXT.ORC_MERCHANT_NAME,
    titlu: TEXT.ORC_MERCHANT_TITLE,
    vinde: 'armura',
    forme: [
      { fel: 'dr',   x:  14, y:  0, w: 13, h: 16, culoare: 0x6b5230 },  // sac de piele
      { fel: 'dr',   x:  14, y: -7, w:  9, h:  4, culoare: 0x4f3c22 },
      { fel: 'dr',   x:   0, y:  7, w: 22, h: 20, culoare: 0x5c4326 },  // vesta
      { fel: 'dr',   x:   0, y:  2, w: 22, h:  4, culoare: 0x8a2f22 },  // brau rosu
      { fel: 'dr',   x: -13, y:  4, w:  5, h: 13, culoare: 0x4f7a3c },  // brate verzi
      { fel: 'dr',   x:  13, y:  4, w:  5, h: 13, culoare: 0x4f7a3c },
      { fel: 'cerc', x:   0, y:-10, r:  9,        culoare: 0x5f9e63 },  // cap verde
      { fel: 'dr',   x:  -5, y: -4, w:  3, h:  5, culoare: 0xf2ece0 },  // colti
      { fel: 'dr',   x:   5, y: -4, w:  3, h:  5, culoare: 0xf2ece0 },
      { fel: 'dr',   x:   0, y:-18, w: 19, h:  5, culoare: 0x24331f },  // par
      { fel: 'dr',   x:  -4, y:-11, w:  3, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   4, y:-11, w:  3, h:  2, culoare: 0x120f0c }
    ]
  },

  armurierOrc: {
    nume:  TEXT.ORC_SMITH_NAME,
    titlu: TEXT.ORC_SMITH_TITLE,
    vinde: 'arma',
    forme: [
      { fel: 'dr',   x: -16, y: 14, w: 16, h:  8, culoare: 0x3f3a34 },  // nicovala
      { fel: 'dr',   x: -16, y:  9, w: 10, h:  4, culoare: 0x524c44 },
      { fel: 'dr',   x:  14, y: -8, w:  4, h: 20, culoare: 0x5b3a1a },  // ciocan
      { fel: 'dr',   x:  14, y:-19, w: 12, h:  9, culoare: 0x6e6e78 },
      { fel: 'dr',   x:   0, y:  7, w: 23, h: 21, culoare: 0x40301f },  // sort
      { fel: 'dr',   x:   0, y:  1, w: 23, h:  4, culoare: 0x7a5a2a },
      { fel: 'dr',   x: -14, y:  4, w:  5, h: 14, culoare: 0x4a733a },  // brate
      { fel: 'dr',   x:  14, y:  4, w:  5, h: 14, culoare: 0x4a733a },
      { fel: 'cerc', x:   0, y:-11, r:  9,        culoare: 0x58955c },  // cap
      { fel: 'dr',   x:  -5, y: -5, w:  3, h:  5, culoare: 0xf2ece0 },  // colti
      { fel: 'dr',   x:   5, y: -5, w:  3, h:  5, culoare: 0xf2ece0 },
      { fel: 'dr',   x:   0, y:-19, w: 20, h:  5, culoare: 0x1f2b1b },  // par
      { fel: 'dr',   x:  -4, y:-12, w:  3, h:  2, culoare: 0x120f0c },  // ochi
      { fel: 'dr',   x:   4, y:-12, w:  3, h:  2, culoare: 0x120f0c }
    ]
  }
};
