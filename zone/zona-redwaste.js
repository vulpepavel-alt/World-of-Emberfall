// ==========================================================
//  ZONA: Redwaste
//
//  Canion secetos, la asfintit. Rosu stins si pamant crapat,
//  piatra intunecata. Singura lumina vie e focul din tabara
//  jefuitorilor. In loc de rau, o albie secata pe care se
//  poate merge. Cactusi razleti si tufe uscate. O tabara de
//  colibe din lemn si piele, aparata de o palisada. Peretii
//  canionului inchid zona de jur imprejur.
//
//  Zona pentru Horde: Orc si Undead.
// ==========================================================

const ZONA_REDWASTE = {

  nume: 'Redwaste',

  // Cine incepe aici. Rasele Horde: Orc si Undead.
  factiune: 'Horde',

  // Fiecare litera folosita in harta trebuie sa apara si aici.
  //   culoare  = ce culoare are casuta
  //   blocat   = true inseamna ca nimeni nu poate trece prin ea
  //   variatie = culoare a doua, pusa din doua in doua casute,
  //              ca terenul sa nu arate ca o suprafata plata
  teren: {
    '.': { culoare: 0x6b3a1e, blocat: false, variatie: 0x633519, textura: 'crapat' },  // pamant crapat
    'V': { culoare: 0x8a7550, blocat: false, variatie: 0x806c49, textura: 'nisip' },  // albia secata
    'P': { culoare: 0x543018, blocat: false, variatie: 0x4d2c15, textura: 'pamant' },  // drum batatorit
    'D': { culoare: 0x1c1208, blocat: false, textura: 'lemn' },                      // usa
    'X': { culoare: 0x2c1409, blocat: true,  variatie: 0x25110a, textura: 'piatra' },  // peretele canionului
    'C': { culoare: 0x2f5230, blocat: true, textura: 'frunzis'  },                      // cactus
    's': { culoare: 0x554626, blocat: true, textura: 'frunzis'  },                      // tufa uscata
    'r': { culoare: 0x503a2b, blocat: true, textura: 'piatra'  },                      // stanca
    'W': { culoare: 0x3a2513, blocat: true, textura: 'lemn'  },                      // palisada de lemn
    'H': { culoare: 0x8a7a5e, blocat: true, textura: 'zid'  },                      // perete de coliba
    'R': { culoare: 0x3a1f0f, blocat: true, textura: 'tigla'  },                      // acoperis de piele
    'A': { culoare: 0x7d6c50, blocat: true, textura: 'lemn'  },                      // cort de jefuitor
    'F': { culoare: 0xe8862f, blocat: true, textura: 'foc'  },                      // foc de tabara - singura lumina
    'c': { culoare: 0x120a06, blocat: true, textura: 'neted' }       // crapatura scorpionilor
  },

  // Zona are 64 x 44 casute. Peretii canionului o inchid de jur
  // imprejur. Albia secata (V) coboara serpuind si SE POATE MERGE
  // pe ea - asta e diferenta fata de raul din Greenvale.
  // Fiecare tabara are o singura poarta.
  harta: [
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXX..X.............X.X.XX....XVVVVX.X...X...X.....XX...X..XXrXXX',
    'XXX...........................VVVV...............s..........XXXX',
    'XXX....ss.s............r..C....VVVV..........rrrr.....r......XXX',
    'XXXX..C..s...s......s..........VVVV.......rrrrr....r.........XXX',
    'XXX....s...s....s..s............VVVV........rr.r..s..r.rr.r..XXX',
    'XXX.s.s.......s.s...............VVVV........rr.rrrcrrrr......XXX',
    'XXX.....s........s..ss..........VVVV.........r...........rr.XXXX',
    'XXX...........PPPPPPPPPPPPPPPPPPVVVVPPPPPPPPPPPPPPP....r.....XXX',
    'XXXXs.........Pr.............s.rVVVV.P...s...s....P.....rr...XXX',
    'XXX......Cs...P...ss............VVVV.P.......r....P.....r.r..XXX',
    'XXX........r.sP..s....r.........VVVV.P.....r...r.r.rr.......XXXX',
    'XXX.....s....sPs........C...C..VVVV..P....rrr.r...rr.r..rr...XXX',
    'XXX....s......P.s..s......C....VVVV..P....rrr..r.........rr..XXX',
    'XXX...........P...s............VVVV..P..r...Cr...r....r..sr.XXXX',
    'XXX.........C.P...C.....r.....VVVV...P..s..r.........s....r..XXX',
    'XXX...........P...r..........VVVV....P.s.....................XXX',
    'XXXXr.........P...........s..VVVV....P....Cs........s........XXX',
    'XXX....s......P.......C.....VVVV.....P..........C............XXX',
    'XXX...........P.............VVVV.....P.....C..............r..XXX',
    'XXXX..........P............VVVV......P.......................XXX',
    'XXXX.......C..P...........VVVV.......P..........s...........XXXX',
    'XXX...........P...........VVVV.......P......................XXXX',
    'XXX...........P..........VVVV........P......r......r....r....XXX',
    'XXXX..WWWWWWWWPWWWWWWWW..VVVV........P...............Cr.....XXXX',
    'XXX...W...............W..VVVV........P.....WWWWWWWWWWWWWWW...XXX',
    'XXXX..W.RRR...RRR.RRR.W.VVVV.........P.C...W.............W...XXX',
    'XXX...W.HDH...HDH.HDH.W.VVVV.........P.....W.......A.....W...XXX',
    'XXXX..W...............W.VVVV.........P.....W..A..........W..XXXX',
    'XXXX..W...............WrVVVV.........P.....W.............W...XXX',
    'XXX...W................PVVVVPPPPPPPPPPPPPPPP......F......W..XXXX',
    'XXXX..W...............W.VVVV...............W..........A..W.CXXXX',
    'XXXX..W...............W..VVVV..............W.............W...XXX',
    'XXXX..W.RRR...RRR.RRR.W..VVVV..............W...A....A....W...XXX',
    'XXX...W.HDH...HDH.HDH.W..VVVV..............W.............W...XXX',
    'XXX...W...............W...VVVV.............WWWWWWWWWWWWWWW...XXX',
    'XXX...WWWWWWWWWWWWWWWWW...VVVV...............................XXX',
    'XXX........................VVVV.........C.................C..XXX',
    'XXX.XXX..X....X..X.........VVVV.....X..XrXXX.....XXX.X..X...XXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  ],

  // Apari in tabara. col = a cata coloana, rand = al catelea rand.
  start:     { col: 14, rand: 32 },
  reinviere: { col: 14, rand: 32 },

  // Personajele prietenoase din zona. Cum arata scrie in npc.js.
  npci: [
    { fel: 'chief', col: 12, rand: 31 }
  ],

  // Unde apar inamicii si de ce fel sunt.
  // Fiecare fel isi are locul lui pe harta:
  //   scorpid - in jurul crapaturii din stanca, nord-est
  //   boar    - in balta uscata cu tufe, nord-vest
  //   raider  - in tabara cu corturi si palisada, sud-est
  mobi: [
    { fel: 'scorpid',  col: 49, rand: 9 },
    { fel: 'scorpid',  col: 52, rand: 10 },
    { fel: 'scorpid',  col: 50, rand: 13 },
    { fel: 'scorpid',  col: 50, rand: 6 },
    { fel: 'boar',     col: 13, rand: 9 },
    { fel: 'boar',     col: 16, rand: 11 },
    { fel: 'boar',     col: 14, rand: 6 },
    { fel: 'boar',     col: 10, rand: 10 },
    { fel: 'raider',   col: 50, rand: 30 },
    { fel: 'raider',   col: 48, rand: 32 },
    { fel: 'raider',   col: 52, rand: 32 },
    { fel: 'raider',   col: 50, rand: 34 }
  ]
};

// Zona se adauga singura in lista jocului.
inregistreazaZona(ZONA_REDWASTE);
