// ==========================================================
//  ZONA: Greenvale
//
//  Padure de primavara. Verde bogat, lumina calda.
//  Un rau taie zona in doua, trecut prin doua poduri de piatra.
//  Un satuc cu acoperisuri rosii in stanga, iar in dreapta,
//  sus pe deal, o cladire mare de piatra.
//
//  Zona pentru Alliance: Human si Night Elf.
// ==========================================================

const ZONA_GREENVALE = {

  nume: 'Greenvale',

  // Cine incepe aici. Rasele Alliance: Human si Night Elf.
  factiune: 'Alliance',

  // Fiecare litera folosita in harta trebuie sa apara si aici.
  //   culoare  = ce culoare are casuta
  //   blocat   = true inseamna ca nimeni nu poate trece prin ea
  //   variatie = culoare a doua, pusa din doua in doua casute,
  //              ca terenul sa nu arate ca o suprafata plata
  teren: {
    '.': { culoare: 0x4f9440, blocat: false, variatie: 0x589e48, textura: 'iarba' },  // iarba
    'f': { culoare: 0x8fc46a, blocat: false, variatie: 0xc9d46b, textura: 'flori' },  // poiana cu flori
    'h': { culoare: 0x86c163, blocat: false, variatie: 0x90ca6d, textura: 'iarba' },  // dealul, mai insorit
    'P': { culoare: 0xb59567, blocat: false, variatie: 0xab8b5f, textura: 'pamant' },  // drum de pamant
    'B': { culoare: 0x9a9384, blocat: false, variatie: 0x8f8879, textura: 'piatra' },  // pod de piatra
    'D': { culoare: 0x6b4a2c, blocat: false, textura: 'lemn' },                      // usa
    'W': { culoare: 0x4b93d6, blocat: true,  variatie: 0x5aa0e0, textura: 'apa' },  // rau
    'T': { culoare: 0x1f4d22, blocat: true, textura: 'frunzis'  },                      // copac
    's': { culoare: 0x376b32, blocat: true, textura: 'frunzis'  },                      // tufis
    'r': { culoare: 0x9c9689, blocat: true, textura: 'piatra'  },                      // stanca
    'H': { culoare: 0xd6c8a8, blocat: true, textura: 'zid'  },                      // perete de casa
    'R': { culoare: 0xb0402f, blocat: true, textura: 'tigla'  },                      // acoperis rosu
    'S': { culoare: 0xb0aa9c, blocat: true, textura: 'piatra'  },                      // zid de piatra
    'c': { culoare: 0x161f16, blocat: true, textura: 'neted'  },                      // gura vizuinii de lupi
    'm': { culoare: 0x241d14, blocat: true, textura: 'neted'  },                      // gura minei
    'o': { culoare: 0x6f6252, blocat: true, textura: 'piatra'  },                      // gramada de steril
    'A': { culoare: 0x8d7b5a, blocat: true, textura: 'lemn'  },                      // cort de bandit
    'F': { culoare: 0xd87a2a, blocat: true, textura: 'foc' }         // foc de tabara
  },

  // Zona are 64 x 44 casute. Raul curge de sus in jos, serpuind,
  // si e trecut prin doua poduri de piatra, pe randurile 13 si 30.
  harta: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TT.............................WWW............................TT',
    'TT.........T.....TT.............WWW.....hhhhrrhhhhhhhhrrhrhrh.TT',
    'TT.T..TTT.T..T...T..........s...WWW.....hhhhhhhhhhhhhhhhhhhhh.TT',
    'TT.........T....................WWW.....hhhhhSSSSSSSSSSSShhhr.TT',
    'TT...T.T.T........T...TT.........WWWTT..hhhhhSSSSSSSSSSSShhhr.TT',
    'TT.T.T..rrcrrr.T.T....TT.........WWWTT..rhhhhSSSSSSSSSSSShhhh.TT',
    'TT.T.TTT..P......................WWW....rhhhhSSSSSSSSSSSShhhh.TT',
    'TT........P......T........TT.....WWW....hhhhhSSSSSSSSSSSShhhh.TT',
    'TT.s......P...............TT.....WWW....rhhhhSSSSSSSSSSSShhhh.TT',
    'TT...T....P.s....................WWW....hhhhhSSSSSSSSSSSShhhh.TT',
    'TT..TTTT..P.......T.TT..........WWW.....hhhhhSSSSSDDSSSSShhhh.TT',
    'TT.....TTTPPPPPPPPPPPPPPPPPPPPPPBBBPPPPPPPPPPPPPPPPPPPPPPPhhh.TT',
    'TT.....Ts..T.T.........P........WWW.....rhhhhhhhhhhhhhhhhhhhr.TT',
    'TT..T.s....T..T..T.....P.......WWW......rhhhhhhhhhhhhhhhhhhhr.TT',
    'TT........T..TT........PTT.....WWW......hhhhhhhhhhhhhhhhhhhhh.TT',
    'TT................s....PTT....WWW.......hhrrrrhhhrhhrhhhhhhrr.TT',
    'TT..........TT.........P......WWW.............................TT',
    'TT....T...T............P.....WWW......s..........s............TT',
    'TT.....................P.....WWW............A.................TT',
    'TT..T...T....T.........P....WWWT........A............TT.......TT',
    'TT..fff.......TT.......P....WWW.......s....F.........TT..s....TT',
    'TT..fff.TT....TT.......P...WWW.................A..............TT',
    'TT......TT.............P...WWW....TT.....A..............TT....TT',
    'TT.................s...P...WWW....TT..s......s...s......TT....TT',
    'TT....RRR...RRR...RRR..P...WWW.............P..................TT',
    'TT....HDH...HDH...HDH..P...WWW.............Pr...........r.....TT',
    'TT.....................P...WWW.............P....r.............TT',
    'TT.....................P....WWW...........rP....rr......r.....TT',
    'TT.....fPPPPPPPPPPPPPPPPPPPPBBBPPPPPPPPPPPPPPPPPPPPPPPPPP.r...TT',
    'TT.....ff.P.................WWW..............r..r..P....o.....TT',
    'TT........P..................WWW...........r....rrrPrrrrsr....TT',
    'TT....RRR.P.RRR...RRR........WWW...............rrrrmrrrr......TT',
    'TT....HDH.P.HDH...HDH.........WWW...TT......r...rrrrrrrr......TT',
    'TT........P...................WWW...TT.......r......rrr..o....TT',
    'TT........PPPPPPPPPPP..........WWW...s.....r.r........r.rr....TT',
    'TT.......RRRs..RRR.............WWW...........o...r..r.........TT',
    'TT.......HDH..sHDH..............WWW..........r........or....r.TT',
    'TT.......s................s.....WWW...........rr....r.........TT',
    'TT...............fff........TT...WWW............r...rr..s.....TT',
    'TT......................TT..TT...WWW..........................TT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],

  // Apari in sat, pe drum. col = a cata coloana, rand = al catelea rand.
  start:     { col: 16, rand: 30 },
  reinviere: { col: 16, rand: 30 },

  // Personajele prietenoase din zona. Cum arata scrie in npc.js.
  npci: [
    { fel: 'marshal', col: 14, rand: 29 }
  ],

  // Unde apar inamicii si de ce fel sunt.
  // Fiecare fel isi are locul lui pe harta:
  //   wolf     - in jurul vizuinii din nord-vest
  //   burrower - in jurul minei din sud-est, unde sapa
  //   bandit   - in tabara cu corturi de la mijloc-est
  mobi: [
    { fel: 'wolf',      col: 9, rand: 8 },
    { fel: 'wolf',      col: 12, rand: 9 },
    { fel: 'wolf',      col: 10, rand: 5 },
    { fel: 'wolf',      col: 6, rand: 9 },
    { fel: 'burrower',  col: 50, rand: 35 },
    { fel: 'burrower',  col: 50, rand: 31 },
    { fel: 'burrower',  col: 47, rand: 34 },
    { fel: 'burrower',  col: 53, rand: 36 },
    { fel: 'bandit',    col: 43, rand: 20 },
    { fel: 'bandit',    col: 41, rand: 22 },
    { fel: 'bandit',    col: 45, rand: 22 },
    { fel: 'bandit',    col: 43, rand: 24 }
  ]
};

// Zona se adauga singura in lista jocului.
inregistreazaZona(ZONA_GREENVALE);
