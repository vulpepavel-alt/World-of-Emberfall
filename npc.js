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
  },


  // ==========================================================
  //  OAMENII IMPRASTIATI PE HARTA
  //
  //  Sunt multi, si ar fi fost o mie de randuri daca desenam
  //  fiecare de la zero. Asa ca sunt facuti dintr-o reteta:
  //  culoarea pielii, a hainei, a parului, si ce tine in mana.
  //  Vezi faOmulet() mai jos.
  // ==========================================================

  // ---------- GREENVALE ----------
  taran: {
    nume: TEXT.FARMER_NAME, titlu: TEXT.FARMER_TITLE,
    forme: faOmulet({ piele: 0xefc49e, haina: 0x7c6a3e, accent: 0xa8904f,
                      par: 0x8a6a32, tine: 'furca' })
  },
  padurar: {
    nume: TEXT.RANGER_NAME, titlu: TEXT.RANGER_TITLE,
    forme: faOmulet({ piele: 0xe6bc94, haina: 0x36562f, accent: 0x4f7a3c,
                      par: 0x3a2c1c, tine: 'arc', gluga: true })
  },
  miner: {
    nume: TEXT.MINER_NAME, titlu: TEXT.MINER_TITLE,
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x4a4038, accent: 0x8a7a4a,
                      par: 0x2e2418, tine: 'tarnacop', casca: true })
  },
  cavaler: {
    nume: TEXT.KNIGHT_NAME, titlu: TEXT.KNIGHT_TITLE,
    forme: faOmulet({ piele: 0xf0c9a6, haina: 0x9aa4b4, accent: 0xd8c88a,
                      par: 0x6a5a3a, tine: 'sabie', casca: true })
  },

  // ---------- REDWASTE ----------
  vanator: {
    nume: TEXT.HUNTRESS_NAME, titlu: TEXT.HUNTRESS_TITLE,
    forme: faOmulet({ piele: 0x6aa86e, haina: 0x6b4a28, accent: 0xa8763a,
                      par: 0x1f2b1b, tine: 'arc', colti: true })
  },
  samana: {
    nume: TEXT.SHAMAN_NAME, titlu: TEXT.SHAMAN_TITLE,
    forme: faOmulet({ piele: 0x4f8a58, haina: 0x4a2f5c, accent: 0xc9a961,
                      par: 0xcfc6b4, tine: 'toiag', colti: true, gluga: true })
  },
  cercetas: {
    nume: TEXT.SCOUT_NAME, titlu: TEXT.SCOUT_TITLE,
    forme: faOmulet({ piele: 0x63a067, haina: 0x5a4a2c, accent: 0x8a2f22,
                      par: 0x24331f, tine: 'pumnal', colti: true })
  },
  capitan: {
    nume: TEXT.CAPTAIN_NAME, titlu: TEXT.CAPTAIN_TITLE,
    forme: faOmulet({ piele: 0x5f9e63, haina: 0x6b2f22, accent: 0xb8bcc4,
                      par: 0x1a1410, tine: 'topor', colti: true, casca: true })
  },
// ==========================================================
  //  OAMENII ORASULUI
  //
  //  Antrenorii de clasa si de meserie, plus negustorii care tin
  //  unelte si materiale. Stau numai in orasele principale.
  //
  //  Deocamdata ei NU invata nimic pe nimeni: antrenamentul se face
  //  la pasul urmator. Campul "invata" spune ce vor preda, iar cand
  //  vorbesti cu ei iti spun asta cinstit, in loc sa taca.
  //
  //  Numele meseriilor de mai jos sunt cuvinte obisnuite (fierar,
  //  tabacar, tesator). Numele SISTEMULUI de meserii il alegi tu
  //  la Pasul 2; pana atunci n-am bagat niciunul in joc.
  // ==========================================================

  // ---------- antrenori de clasa ----------
  antrenorRazboinic: {
    nume: TEXT.TR_WARRIOR_NAME, titlu: TEXT.TR_WARRIOR_TITLE, invata: 'warrior',
    forme: faOmulet({ piele: 0xe8bd94, haina: 0x6b2f22, accent: 0xb8bcc4,
                      par: 0x2e2418, tine: 'topor', casca: true })
  },
  antrenorVanator: {
    nume: TEXT.TR_HUNTER_NAME, titlu: TEXT.TR_HUNTER_TITLE, invata: 'hunter',
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x3a5a30, accent: 0x8a6a3a,
                      par: 0x4a3520, tine: 'arc', gluga: true })
  },
  antrenorMag: {
    nume: TEXT.TR_MAGE_NAME, titlu: TEXT.TR_MAGE_TITLE, invata: 'mage',
    forme: faOmulet({ piele: 0xf0c9a6, haina: 0x2f3f7a, accent: 0x6f8ad0,
                      par: 0xcfc6b4, tine: 'toiag', gluga: true })
  },
  antrenorPreot: {
    nume: TEXT.TR_PRIEST_NAME, titlu: TEXT.TR_PRIEST_TITLE, invata: 'priest',
    forme: faOmulet({ piele: 0xefc49e, haina: 0xd8d2c4, accent: 0xc9a961,
                      par: 0x8a7a5a, tine: 'toiag' })
  },

  // ---------- antrenori de meserii care se strang ----------
  antrenorMinerit: {
    nume: TEXT.TR_MINING_NAME, titlu: TEXT.TR_MINING_TITLE, invata: 'minerit',
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x4a4038, accent: 0x8a7a4a,
                      par: 0x2e2418, tine: 'tarnacop', casca: true })
  },
  antrenorIerburi: {
    nume: TEXT.TR_HERB_NAME, titlu: TEXT.TR_HERB_TITLE, invata: 'ierburi',
    forme: faOmulet({ piele: 0xefc49e, haina: 0x4f7a3c, accent: 0x9ac46a,
                      par: 0x6a8a3a, tine: 'furca' })
  },
  antrenorJupuit: {
    nume: TEXT.TR_SKIN_NAME, titlu: TEXT.TR_SKIN_TITLE, invata: 'jupuit',
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x6b4a28, accent: 0xa8763a,
                      par: 0x3a2c1c, tine: 'pumnal' })
  },

  // ---------- antrenori de meserii care fac lucruri ----------
  antrenorFierarie: {
    nume: TEXT.TR_SMITH_NAME, titlu: TEXT.TR_SMITH_TITLE, invata: 'fierarie',
    forme: faOmulet({ piele: 0xc9906a, haina: 0x3a2e22, accent: 0xb8bcc4,
                      par: 0x1f1812, tine: 'topor' })
  },
  antrenorAlchimie: {
    nume: TEXT.TR_ALCH_NAME, titlu: TEXT.TR_ALCH_TITLE, invata: 'alchimie',
    forme: faOmulet({ piele: 0xefc49e, haina: 0x4a2f5c, accent: 0x9a6fd0,
                      par: 0xcfc6b4, tine: 'toiag', gluga: true })
  },
  antrenorVrajire: {
    nume: TEXT.TR_ENCH_NAME, titlu: TEXT.TR_ENCH_TITLE, invata: 'vrajire',
    forme: faOmulet({ piele: 0xf0c9a6, haina: 0x2a4a5c, accent: 0x6fd0c0,
                      par: 0xb4c6cf, tine: 'pumnal', gluga: true })
  },
  antrenorInginerie: {
    nume: TEXT.TR_ENGI_NAME, titlu: TEXT.TR_ENGI_TITLE, invata: 'inginerie',
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x5a4a2c, accent: 0xc9a961,
                      par: 0x8a6a32, tine: 'tarnacop' })
  },
  antrenorPielarie: {
    nume: TEXT.TR_LEATHER_NAME, titlu: TEXT.TR_LEATHER_TITLE, invata: 'pielarie',
    forme: faOmulet({ piele: 0xc9906a, haina: 0x7c5a32, accent: 0xa8763a,
                      par: 0x3a2c1c, tine: 'pumnal' })
  },
  antrenorCroitorie: {
    nume: TEXT.TR_TAILOR_NAME, titlu: TEXT.TR_TAILOR_TITLE, invata: 'croitorie',
    forme: faOmulet({ piele: 0xefc49e, haina: 0x8a3f5c, accent: 0xd8a8c0,
                      par: 0x5a4a2c, tine: 'furca' })
  },

  // ---------- meseriile de pe langa casa ----------
  antrenorGatit: {
    nume: TEXT.TR_COOK_NAME, titlu: TEXT.TR_COOK_TITLE, invata: 'gatit',
    forme: faOmulet({ piele: 0xe8bd94, haina: 0xd8d2c4, accent: 0x8a5a2f,
                      par: 0x6a5a3a, tine: 'furca' })
  },
  antrenorPrimAjutor: {
    nume: TEXT.TR_MEDIC_NAME, titlu: TEXT.TR_MEDIC_TITLE, invata: 'primAjutor',
    forme: faOmulet({ piele: 0xf0c9a6, haina: 0xe4e0d4, accent: 0xc2543f,
                      par: 0x8a7a5a, tine: 'pumnal' })
  },
  antrenorPescuit: {
    nume: TEXT.TR_FISH_NAME, titlu: TEXT.TR_FISH_TITLE, invata: 'pescuit',
    forme: faOmulet({ piele: 0xc9906a, haina: 0x3a5a6a, accent: 0x6fa8c0,
                      par: 0x4a4038, tine: 'furca' })
  },

  // ---------- negustorii orasului ----------
  negustorUnelte: {
    nume: TEXT.TR_TOOLS_NAME, titlu: TEXT.TR_TOOLS_TITLE, vinde: 'arma',
    forme: faOmulet({ piele: 0xd8a87c, haina: 0x5a4a2c, accent: 0xb8bcc4,
                      par: 0x2e2418, tine: 'tarnacop' })
  },
  negustorMateriale: {
    nume: TEXT.TR_GOODS_NAME, titlu: TEXT.TR_GOODS_TITLE, vinde: 'armura',
    forme: faOmulet({ piele: 0xefc49e, haina: 0x6b5a3a, accent: 0xc9a961,
                      par: 0x8a6a32, tine: 'furca' })
  }
};


// ==========================================================
//  NUMELE LOR, ALTUL IN FIECARE ZONA
//
//  Pana acum fiecare meserie avea UN nume: orice miner din lume
//  se chema Prospector Dunn. Cu patruzeci de zone asta se vedea
//  imediat si facea lumea sa para mica.
//
//  Acum numele se alege din listele de mai jos, dupa zona si dupa
//  al catelea om e in zona. Alegerea e facuta din numere, nu la
//  intamplare, deci acelasi om are MEREU acelasi nume - nu se
//  schimba cand iesi si intri inapoi in zona.
//
//  Greenvale si Redwaste isi tin numele scrise de mana: acolo
//  misiunile sunt scrise cap la cap si pomenesc oamenii pe nume.
// ==========================================================
const ZONE_CU_NUME_SCRISE = ['Greenvale', 'Redwaste'];

const NUME_MIC_OM = [
  'Aldric', 'Bess', 'Corwin', 'Dena', 'Emrik', 'Fenna', 'Garret', 'Hale',
  'Ivar', 'Jessa', 'Kell', 'Lissa', 'Maren', 'Nolan', 'Orla', 'Perrin',
  'Quenn', 'Rowan', 'Sela', 'Tobin', 'Ulric', 'Vessa', 'Wren', 'Yorick'
];

const NUME_MARE_OM = [
  'Ashdown', 'Barrow', 'Clay', 'Dunmore', 'Elmsworth', 'Fielding', 'Grange',
  'Harrow', 'Ingold', 'Kettle', 'Larkin', 'Merrow', 'Norwood', 'Oakley',
  'Pike', 'Ravenel', 'Stonebrook', 'Thatcher', 'Underhill', 'Vance'
];

const NUME_MIC_ORC = [
  'Bruk', 'Draga', 'Gharn', 'Hoska', 'Jorreg', 'Kruul', 'Lorga', 'Mazok',
  'Nurga', 'Orkuz', 'Rahk', 'Shela', 'Thrag', 'Ugra', 'Vorlak', 'Zurga',
  'Grem', 'Halka', 'Morg', 'Tessk'
];

const NUME_MARE_ORC = [
  'Ashfang', 'Blackhoof', 'Coalbiter', 'Dustmane', 'Emberjaw', 'Grimtusk',
  'Ironhide', 'Kragmaw', 'Lowspine', 'Redscar', 'Sandclaw', 'Stonegut',
  'Thornhide', 'Wormcutter', 'Boneshear'
];


// Amesteca doua numere intr-unul singur, mereu acelasi pentru
// aceeasi pereche. Asa numele nu sar de la o intrare la alta.
function numarDinText(text, adaos) {
  let n = 2166136261 ^ (adaos || 0);
  for (let i = 0; i < text.length; i++) {
    n = Math.imul(n ^ text.charCodeAt(i), 16777619);
  }
  return Math.abs(n);
}


// Numele omului al "indice"-lea din zona data.
function numeDeNpc(zonaAsta, indice, felul) {

  if (!zonaAsta) return null;
  if (ZONE_CU_NUME_SCRISE.indexOf(zonaAsta.nume) >= 0) return null;

  const orc = (zonaAsta.continent === 'karador');
  const mici = orc ? NUME_MIC_ORC : NUME_MIC_OM;
  const mari = orc ? NUME_MARE_ORC : NUME_MARE_OM;

  const n = numarDinText(zonaAsta.id + ':' + felul, indice * 7919);
  return mici[n % mici.length] + ' ' + mari[(n >> 8) % mari.length];
}


// ==========================================================
//  RETETA DIN CARE IES OAMENII
//
//  Toti sunt facuti la fel: picioare, trup, brate, cap, par sau
//  coif, ochi - si ce tin in mana. Se schimba doar culorile si
//  obiectul, si ies personaje care nu seamana intre ele.
// ==========================================================
function faOmulet(op) {

  const forme = [];
  const umbra = function (c, cat) {
    const r = Math.max(0, ((c >> 16) & 255) + cat);
    const g = Math.max(0, ((c >> 8) & 255) + cat);
    const b = Math.max(0, (c & 255) + cat);
    return (Math.min(255, r) << 16) | (Math.min(255, g) << 8) | Math.min(255, b);
  };

  // ---- ce tine in mana, in spatele lui ----
  switch (op.tine) {
    case 'furca':
      forme.push({ fel: 'dr', x: 14, y: -2, w: 3, h: 30, culoare: 0x6b4a2c });
      forme.push({ fel: 'dr', x: 11, y: -18, w: 3, h: 8, culoare: 0xb8bcc4 });
      forme.push({ fel: 'dr', x: 14, y: -19, w: 3, h: 9, culoare: 0xb8bcc4 });
      forme.push({ fel: 'dr', x: 17, y: -18, w: 3, h: 8, culoare: 0xb8bcc4 });
      break;
    case 'arc':
      forme.push({ fel: 'dr', x: 14, y: -2, w: 2, h: 30, culoare: 0xe8e2d4 });
      forme.push({ fel: 'dr', x: 17, y: -14, w: 4, h: 10, culoare: 0x6b4a2c });
      forme.push({ fel: 'dr', x: 19, y: -2, w: 4, h: 14, culoare: 0x7d5735 });
      forme.push({ fel: 'dr', x: 17, y: 10, w: 4, h: 10, culoare: 0x6b4a2c });
      break;
    case 'tarnacop':
      forme.push({ fel: 'dr', x: 14, y: -1, w: 3, h: 28, culoare: 0x5b3a1a });
      forme.push({ fel: 'dr', x: 14, y: -16, w: 18, h: 4, culoare: 0x7a7a84 });
      break;
    case 'sabie':
      forme.push({ fel: 'dr', x: 15, y: 2, w: 4, h: 10, culoare: 0x5b3a1a });
      forme.push({ fel: 'dr', x: 15, y: -4, w: 12, h: 3, culoare: 0xb08d3a });
      forme.push({ fel: 'dr', x: 15, y: -16, w: 5, h: 22, culoare: 0xd8d8e0 });
      break;
    case 'topor':
      forme.push({ fel: 'dr', x: 15, y: 0, w: 4, h: 28, culoare: 0x5b3a1a });
      forme.push({ fel: 'dr', x: 19, y: -13, w: 10, h: 11, culoare: 0xb8bcc4 });
      break;
    case 'toiag':
      forme.push({ fel: 'dr', x: 15, y: 0, w: 4, h: 32, culoare: 0x6a5232 });
      forme.push({ fel: 'cerc', x: 15, y: -18, r: 6, culoare: 0x7fd0c0 });
      forme.push({ fel: 'cerc', x: 15, y: -18, r: 3, culoare: 0xdff6ef });
      break;
    case 'pumnal':
      forme.push({ fel: 'dr', x: 15, y: 6, w: 3, h: 7, culoare: 0x3a2c1c });
      forme.push({ fel: 'dr', x: 15, y: -3, w: 4, h: 12, culoare: 0xc8ccd4 });
      break;
  }

  // ---- picioarele si cizmele ----
  forme.push({ fel: 'dr', x: -5, y: 17, w: 6, h: 9, culoare: umbra(op.haina, -40) });
  forme.push({ fel: 'dr', x:  5, y: 17, w: 6, h: 9, culoare: umbra(op.haina, -40) });
  forme.push({ fel: 'dr', x: -5, y: 22, w: 7, h: 5, culoare: 0x2a2018 });
  forme.push({ fel: 'dr', x:  5, y: 22, w: 7, h: 5, culoare: 0x2a2018 });

  // ---- trupul ----
  forme.push({ fel: 'dr', x: 0, y: 6, w: 21, h: 21, culoare: op.haina });
  forme.push({ fel: 'dr', x: -8, y: 6, w: 5, h: 21, culoare: umbra(op.haina, -26) });
  forme.push({ fel: 'dr', x: 9, y: 6, w: 3, h: 21, culoare: umbra(op.haina, 22) });
  forme.push({ fel: 'dr', x: 0, y: 6, w: 6, h: 21, culoare: op.accent });   // dunga din fata
  forme.push({ fel: 'dr', x: 0, y: 13, w: 21, h: 4, culoare: umbra(op.haina, -46) });  // cureaua

  // ---- bratele si mainile ----
  forme.push({ fel: 'dr', x: -11, y: 7, w: 4, h: 13, culoare: umbra(op.haina, -16) });
  forme.push({ fel: 'dr', x:  11, y: 7, w: 4, h: 13, culoare: umbra(op.haina, -16) });
  forme.push({ fel: 'dr', x: -11, y: 15, w: 5, h: 5, culoare: op.piele });
  forme.push({ fel: 'dr', x:  11, y: 15, w: 5, h: 5, culoare: op.piele });

  // ---- gatul si capul ----
  forme.push({ fel: 'dr', x: 0, y: -3, w: 7, h: 5, culoare: umbra(op.piele, -30) });
  forme.push({ fel: 'cerc', x: 0, y: -10, r: 8, culoare: op.piele });
  forme.push({ fel: 'dr', x: -5, y: -10, w: 3, h: 10, culoare: umbra(op.piele, -26) });

  // ---- coltii orcilor ----
  if (op.colti) {
    forme.push({ fel: 'dr', x: -4, y: -5, w: 3, h: 5, culoare: 0xf2ece0 });
    forme.push({ fel: 'dr', x:  4, y: -5, w: 3, h: 5, culoare: 0xf2ece0 });
  }

  // ---- ochii ----
  forme.push({ fel: 'dr', x: -3.5, y: -11, w: 2, h: 2, culoare: 0x120f0c });
  forme.push({ fel: 'dr', x:  3.5, y: -11, w: 2, h: 2, culoare: 0x120f0c });

  // ---- parul, gluga sau coiful ----
  if (op.casca) {
    forme.push({ fel: 'dr', x: 0, y: -14, w: 18, h: 5, culoare: umbra(op.accent, -20) });
    forme.push({ fel: 'dr', x: 0, y: -18, w: 15, h: 5, culoare: op.accent });
  } else if (op.gluga) {
    forme.push({ fel: 'dr', x: 0, y: -15, w: 20, h: 7, culoare: umbra(op.haina, -20) });
    forme.push({ fel: 'dr', x: -9, y: -8, w: 4, h: 9, culoare: umbra(op.haina, -20) });
    forme.push({ fel: 'dr', x:  9, y: -8, w: 4, h: 9, culoare: umbra(op.haina, -20) });
  } else {
    forme.push({ fel: 'dr', x: 0, y: -15, w: 17, h: 6, culoare: op.par });
    forme.push({ fel: 'dr', x: 0, y: -17, w: 13, h: 3, culoare: umbra(op.par, 18) });
  }

  return forme;
}
