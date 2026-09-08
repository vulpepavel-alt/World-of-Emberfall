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
  }
};
