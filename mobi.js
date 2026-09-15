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

// Acelasi fel de inamic, dar de alt nivel.
//
// ATENTIE la formula de viata. Prima data era 42 x 1,20 la puterea
// nivelului - adica inmultit cu 1,2 la FIECARE nivel. Pana la 10
// mergea (42 -> 217), dar la 30 iesea 8.308 si la 60 peste doua
// milioane. O testasem doar pe primele zece niveluri.
//
// Acum creste domol si e reglata dupa cat damage poate scoate un
// jucator cu echipament pe masura: o lupta cu un inamic obisnuit
// tine cam cincisprezece secunde la ORICE nivel. Un rar tine de
// doua ori si jumatate mai mult, un elit de sase ori.
function statsPentruNivel(nivel, rang) {

  const n = Math.max(1, Math.round(nivel || 1));
  const r = RANGURI[rang] || RANGURI.normal;

  const baza = {
    nivel:  n,
    viata:  Math.round(40 + n * 11 + Math.pow(n, 1.5) * 0.5),
    dmgMin: Math.round(STATS_NIVEL_1.dmgMin + (n - 1) * 0.8),
    dmgMax: Math.round(STATS_NIVEL_1.dmgMax + (n - 1) * 1.1),
    viteza: STATS_NIVEL_1.viteza,
    armura: STATS_NIVEL_1.armura + (n - 1) * 5
  };

  return {
    nivel:  n,
    rang:   r.id,
    viata:  Math.round(baza.viata * r.viata),
    dmgMin: Math.round(baza.dmgMin * r.damage),
    dmgMax: Math.round(baza.dmgMax * r.damage),
    viteza: baza.viteza,
    armura: Math.round(baza.armura * r.armura)
  };
}


// ==========================================================
//  RANGURILE: obisnuit, RAR (argintiu), ELIT (auriu)
//
//  Copiat din WoW:
//
//    OBISNUIT  - inamicul de rand. Reapare in zece secunde.
//    RAR       - are rama ARGINTIE in jurul numelui si nume propriu.
//                De doua ori si jumatate mai multa viata, loveste mai
//                tare, si LASA INTOTDEAUNA un obiect bun. Reapare
//                rar: dupa zece minute. Cate trei in fiecare zona.
//    ELIT      - rama AURIE. De sase ori mai multa viata, damage
//                dublu. Lasa intotdeauna ceva albastru sau mov.
//                Unul singur in zona, ascuns intr-un colt. Reapare
//                dupa douazeci de minute.
//
//  Un rar de nivelul tau e o lupta adevarata. Un elit de nivelul tau
//  te omoara daca te duci singur si neechipat.
// ==========================================================
const RANGURI = {
  normal: { id: 'normal', viata: 1,   damage: 1,   armura: 1,
            culoare: '#e8dcc0', xp: 1,  marime: 1,    reaparitie: 10000 },
  rar:    { id: 'rar',    viata: 2.5, damage: 1.4, armura: 1.3,
            culoare: '#c9ccd4', xp: 4,  marime: 1.25, reaparitie: 600000 },
  elit:   { id: 'elit',   viata: 6,   damage: 2,   armura: 1.6,
            culoare: '#e6c669', xp: 10, marime: 1.5,  reaparitie: 1200000 },

  // Rangul de SEF. Unul singur in tot jocul, la capatul povestii.
  // Reaparitia lunga e dinadins: nu e un mob de farmat, e un capat.
  // Cel mai mare lucru din joc. Peste marimea asta se mai adauga
  // sporul de sef de temnita (vezi creeazaMob), deci cel de la
  // capatul raidului iese de trei ori si ceva cat un om.
  sef:    { id: 'sef',    viata: 14,  damage: 2.6, armura: 1.8,
            culoare: '#d86a4a', xp: 30, marime: 2.2,  reaparitie: 1800000 }
};


const MOBI = {

  // ---------- GREENVALE ----------

  wolf: {
    nume: TEXT.WOLF,
    prada: { poarta: false, sloturi: ['gat','inel1','talisman','spate'], arme: ['pumnal'], catDes: 0.35 },
    vechituri: ['Chipped Fang', 'Ragged Pelt', 'Torn Ear'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -8, y: 11, w:  4, h:  8, culoare: 0x4e5054 },  // picioarele din spate
      { fel: 'dr',   x:   5, y: 11, w:  4, h:  8, culoare: 0x4e5054 },
      { fel: 'dr',   x:  -3, y: 12, w:  4, h:  7, culoare: 0x5f6165 },  // picioarele din fata
      { fel: 'dr',   x:   9, y: 12, w:  4, h:  7, culoare: 0x5f6165 },
      { fel: 'dr',   x:  -9, y: 15, w:  5, h:  3, culoare: 0x2f3033 },  // labele
      { fel: 'dr',   x:  10, y: 15, w:  5, h:  3, culoare: 0x2f3033 },
      { fel: 'dr',   x:  14, y: -1, w: 10, h:  4, culoare: 0x6a6c71 },  // coada
      { fel: 'dr',   x:  20, y: -3, w:  6, h:  4, culoare: 0x8e9095 },  // varful ei, mai deschis
      { fel: 'dr',   x:   0, y:  3, w: 22, h: 12, culoare: 0x77797e },  // trupul
      { fel: 'dr',   x:   0, y: -1, w: 20, h:  4, culoare: 0x91939a, faraContur: true },  // lumina de pe spinare
      { fel: 'dr',   x:   0, y:  7, w: 20, h:  4, culoare: 0x585a5e, faraContur: true },  // umbra de sub burta
      { fel: 'dr',   x:  -2, y: -4, w:  8, h:  5, culoare: 0x9ca2a8, faraContur: true },  // gulerul de blana
      { fel: 'dr',   x: -13, y: -8, w:  4, h:  6, culoare: 0x83858a },  // urechile
      { fel: 'dr',   x:  -8, y: -8, w:  4, h:  6, culoare: 0x83858a },
      { fel: 'dr',   x: -13, y: -8, w:  2, h:  3, culoare: 0x4a3634, faraContur: true },  // pe dinauntru
      { fel: 'dr',   x:  -8, y: -8, w:  2, h:  3, culoare: 0x4a3634, faraContur: true },
      { fel: 'dr',   x: -11, y: -1, w: 11, h: 10, culoare: 0x83858a },  // capul
      { fel: 'dr',   x: -11, y: -4, w: 10, h:  3, culoare: 0x9ca2a8, faraContur: true },  // lumina de pe frunte
      { fel: 'dr',   x: -19, y:  2, w:  7, h:  5, culoare: 0x6a6c71 },  // botul
      { fel: 'dr',   x: -22, y:  1, w:  3, h:  3, culoare: 0x1c1a18, faraContur: true },  // nasul
      { fel: 'dr',   x: -18, y:  5, w:  6, h:  2, culoare: 0xe8e2d4, faraContur: true },  // coltii
      { fel: 'dr',   x: -13, y: -2, w:  3, h:  3, culoare: 0xc9a83a },  // ochiul
      { fel: 'dr',   x: -14, y: -3, w:  1, h:  1, culoare: 0xfff4d0, faraContur: true }   // sclipirea din el
    ]
  },

  burrower: {
    nume: TEXT.BURROWER,
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal','buzdugan'], catDes: 0.40 },
    vechituri: ['Dulled Claw', 'Shell Fragment', 'Grub Casing'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  11, y: 12, w: 15, h:  5, culoare: 0x5e4630 },  // musuroiul rascolit
      { fel: 'dr',   x:  12, y: 10, w: 11, h:  3, culoare: 0x715540, faraContur: true },
      { fel: 'cerc', x:   0, y:  3, r: 11,        culoare: 0x7a5a3a },  // trupul
      { fel: 'dr',   x:   2, y: -4, w: 13, h:  5, culoare: 0x916d47, faraContur: true },  // lumina de pe spinare
      { fel: 'dr',   x:   0, y:  9, w: 16, h:  4, culoare: 0x5c432b, faraContur: true },  // umbra de dedesubt
      { fel: 'dr',   x:   4, y:  1, w:  3, h:  9, culoare: 0x6b4e33, faraContur: true },  // dungi pe blana
      { fel: 'dr',   x:   9, y:  2, w:  3, h:  7, culoare: 0x6b4e33, faraContur: true },
      { fel: 'dr',   x: -12, y:  8, w:  9, h:  3, culoare: 0xd8d2c4 },  // ghearele de sapat
      { fel: 'dr',   x: -12, y: 12, w:  9, h:  3, culoare: 0xd8d2c4 },
      { fel: 'dr',   x: -17, y:  8, w:  3, h:  2, culoare: 0xf4f0e6, faraContur: true },  // varfurile lor
      { fel: 'dr',   x: -17, y: 12, w:  3, h:  2, culoare: 0xf4f0e6, faraContur: true },
      { fel: 'cerc', x:  -9, y:  0, r:  7,        culoare: 0x8a6a46 },  // capul
      { fel: 'dr',   x:  -9, y: -5, w:  9, h:  3, culoare: 0xa07c54, faraContur: true },  // lumina de pe crestet
      { fel: 'dr',   x: -16, y:  1, w:  7, h:  5, culoare: 0xd6a6a0 },  // ratul
      { fel: 'dr',   x: -18, y:  0, w:  2, h:  2, culoare: 0x8a5c58, faraContur: true },  // narile
      { fel: 'dr',   x: -15, y:  4, w:  5, h:  2, culoare: 0xe8e2d4, faraContur: true },  // dintii
      { fel: 'dr',   x: -10, y: -3, w:  2, h:  2, culoare: 0x120f0c }   // ochiul, mic si slab
    ]
  },

  // Garda orasului. Nu apare nicaieri pe harta obisnuita: sta numai
  // in orasul unei tabere, si numai pentru cine vine din cealalta.
  // De asta e si singurul inamic din joc care e mereu elit.
  garda: {
    nume: TEXT.GUARD,
    prada: { poarta: true, armuri: ['zale','placi'], arme: ['sabie','buzdugan'], catDes: 1.6 },
    razaAgro: 210,          // te vede de departe: aia e treaba ei
    vechituri: ['Torn Tabard', 'Dented Helm Strap', 'Watch Whistle'],
    neam: 'umanoid',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  12, y: -6, w:  3, h: 26, culoare: 0x6b4a2c },  // sulita
      { fel: 'dr',   x:  12, y:-19, w:  5, h:  8, culoare: 0xd8dce4 },  // varful
      { fel: 'dr',   x:  12, y:-21, w:  2, h:  4, culoare: 0xf0f4fa, faraContur: true },  // lucirea lui
      { fel: 'dr',   x:  -7, y: 16, w:  6, h:  6, culoare: 0x3a3028 },  // cizmele
      { fel: 'dr',   x:   4, y: 16, w:  6, h:  6, culoare: 0x3a3028 },
      { fel: 'dr',   x:   0, y:  5, w: 19, h: 19, culoare: 0x6b6f78 },  // platosa
      { fel: 'dr',   x:  -6, y:  4, w:  5, h: 15, culoare: 0x7f838c, faraContur: true },  // lumina pe ea
      { fel: 'dr',   x:   7, y:  6, w:  4, h: 13, culoare: 0x55585f, faraContur: true },  // umbra din dreapta
      { fel: 'dr',   x: -10, y: -1, w:  6, h:  7, culoare: 0x8a8f98 },  // umerarele
      { fel: 'dr',   x:  10, y: -1, w:  6, h:  7, culoare: 0x8a8f98 },
      { fel: 'dr',   x:   0, y:  2, w: 19, h:  5, culoare: 0x8f5a2c },  // cureaua
      { fel: 'dr',   x:   0, y:  2, w:  5, h:  5, culoare: 0xc9a961, faraContur: true },  // catarama
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },  // capul
      { fel: 'dr',   x:   0, y: -4, w: 10, h:  4, culoare: 0x8a7358, faraContur: true },  // barba scurta
      { fel: 'dr',   x:   0, y:-13, w: 19, h:  9, culoare: 0x8a8f98 },  // coiful
      { fel: 'dr',   x:   0, y:-16, w: 17, h:  3, culoare: 0xa4a9b2, faraContur: true },  // lumina de pe el
      { fel: 'dr',   x:   0, y:-13, w:  3, h:  9, culoare: 0x5c6068 },  // creasta
      { fel: 'dr',   x:   0, y:-19, w:  5, h:  4, culoare: 0x9c3a2c },  // penajul rosu
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },  // ochii
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  // Omul de la capatul drumului. Nu e o fiara si nu e un monstru:
  // e un functionar bine imbracat, cu o carte de socoteli in fata.
  // Toata povestea jocului duce la el, si nimic din felul cum arata
  // nu trebuie sa para eroic.
  factor: {
    nume: TEXT.FACTOR,
    razaAgro: 260,
    prada: { poarta: true, armuri: ['panza', 'piele'], arme: ['pumnal'], catDes: 3 },
    vechituri: ['Ink-Stained Cuff', 'Brass Seal', 'Tally Stick'],
    neam: 'umanoid',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:   0, y: 10, w: 20, h: 13, culoare: 0x2b3550 },  // roba lunga
      { fel: 'dr',   x:  -6, y: 10, w:  4, h: 13, culoare: 0x35415f, faraContur: true },  // cutele ei
      { fel: 'dr',   x:   4, y: 11, w:  3, h: 11, culoare: 0x222b42, faraContur: true },
      { fel: 'dr',   x:   0, y:  4, w: 18, h:  8, culoare: 0x36426a },  // pieptul
      { fel: 'dr',   x: -10, y:  6, w:  5, h: 11, culoare: 0x2b3550 },  // manecile
      { fel: 'dr',   x:  10, y:  6, w:  5, h: 11, culoare: 0x2b3550 },
      { fel: 'dr',   x:   0, y:  0, w: 12, h:  3, culoare: 0xe6ddc4, faraContur: true },  // gulerul alb
      { fel: 'dr',   x:   0, y:  4, w:  3, h:  8, culoare: 0xc9a961 },  // lantul de la gat
      { fel: 'dr',   x:   0, y:  8, w:  5, h:  4, culoare: 0xe6c669, faraContur: true },  // pecetea de pe el
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xe0bb95 },  // capul
      { fel: 'dr',   x:  -5, y: -6, w:  4, h:  5, culoare: 0xc9a583, faraContur: true },  // obrazul supt
      { fel: 'dr',   x:   0, y:-15, w: 17, h:  5, culoare: 0x1d2438 },  // parul lins
      { fel: 'dr',   x:   0, y:-17, w: 14, h:  2, culoare: 0x2b3550, faraContur: true },
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },  // ochii
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c },
      { fel: 'dr',   x:   0, y: -4, w:  6, h:  1, culoare: 0x9c7a5e, faraContur: true },  // gura subtire
      { fel: 'dr',   x:  13, y:  6, w:  8, h: 10, culoare: 0xe6ddc4 },  // registrul
      { fel: 'dr',   x:  13, y:  2, w:  8, h:  2, culoare: 0xf2ecd8, faraContur: true },  // muchia paginilor
      { fel: 'dr',   x:  13, y:  6, w:  6, h:  1, culoare: 0x8a7f66, faraContur: true },  // randurile scrise
      { fel: 'dr',   x:  13, y:  9, w:  6, h:  1, culoare: 0x8a7f66, faraContur: true }
    ]
  },

  bandit: {
    nume: TEXT.BANDIT,
    prada: { poarta: true, armuri: ['panza','piele'], arme: ['pumnal','sabie','arc'], catDes: 1.15 },
    vechituri: ['Bent Buckle', 'Empty Flask', 'Frayed Bandana', 'Cracked Dice'],
    neam: 'umanoid',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  11, y:  1, w:  3, h: 13, culoare: 0xc8ccd4 },  // pumnalul
      { fel: 'dr',   x:  11, y: -4, w:  2, h:  5, culoare: 0xf0f4fa, faraContur: true },  // taisul lui
      { fel: 'dr',   x:  11, y:  8, w:  5, h:  4, culoare: 0x5b3a1a },  // manerul
      { fel: 'dr',   x:  -6, y: 16, w:  6, h:  6, culoare: 0x2e2820 },  // cizmele
      { fel: 'dr',   x:   5, y: 16, w:  6, h:  6, culoare: 0x2e2820 },
      { fel: 'dr',   x:   0, y:  5, w: 18, h: 18, culoare: 0x3f4a3d },  // trupul
      { fel: 'dr',   x:  -5, y:  4, w:  5, h: 14, culoare: 0x4c5a49, faraContur: true },  // lumina
      { fel: 'dr',   x:   6, y:  6, w:  4, h: 12, culoare: 0x333d32, faraContur: true },  // umbra
      { fel: 'dr',   x:   0, y:  8, w: 18, h:  3, culoare: 0x6b4a2c, faraContur: true },  // cureaua
      { fel: 'dr',   x:  -4, y:  8, w:  3, h:  3, culoare: 0xa8955e, faraContur: true },  // catarama
      { fel: 'dr',   x:   0, y: -1, w: 14, h:  3, culoare: 0x5a3a2a, faraContur: true },  // curelele peste piept
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },  // capul
      { fel: 'dr',   x:   0, y:-14, w: 18, h:  8, culoare: 0x2c352a },  // gluga
      { fel: 'dr',   x:   0, y: -9, w: 14, h:  3, culoare: 0x1c231b, faraContur: true },  // umbra ei peste ochi
      { fel: 'dr',   x:  -8, y: -8, w:  3, h:  7, culoare: 0x2c352a, faraContur: true },  // marginile glugii
      { fel: 'dr',   x:   8, y: -8, w:  3, h:  7, culoare: 0x2c352a, faraContur: true },
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0xc9b878, faraContur: true },  // ochii, sclipind din umbra
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0xc9b878, faraContur: true },
      { fel: 'dr',   x:   0, y: -3, w:  7, h:  2, culoare: 0x8a6a52, faraContur: true }   // basmaua peste gura
    ]
  },

  // Sobolanul de camp: cel mai slab lucru din zona, chiar langa sat.
  rat: {
    nume: TEXT.RAT,
    prada: { poarta: false, sloturi: ['inel1','talisman'], arme: [], catDes: 0.25 },
    vechituri: ['Chewed Rat Tail', 'Matted Fur', 'Gnawed Bone'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  11, y:  4, w: 10, h:  2, culoare: 0xa08a72 },  // coada
      { fel: 'dr',   x:  17, y:  2, w:  6, h:  2, culoare: 0xb59c80 },
      { fel: 'dr',   x:  -4, y: 10, w:  3, h:  4, culoare: 0x5e5142 },  // labutele
      { fel: 'dr',   x:   4, y: 10, w:  3, h:  4, culoare: 0x5e5142 },
      { fel: 'dr',   x:   0, y:  4, w: 16, h:  9, culoare: 0x6e5f4e },  // trupul
      { fel: 'dr',   x:   0, y:  1, w: 14, h:  3, culoare: 0x83725d, faraContur: true },  // lumina pe spinare
      { fel: 'dr',   x:   0, y:  7, w: 14, h:  3, culoare: 0x574a3c, faraContur: true },  // umbra sub burta
      { fel: 'dr',   x:  -7, y: -3, w:  4, h:  5, culoare: 0x7d6d59 },  // urechile
      { fel: 'dr',   x:  -2, y: -3, w:  4, h:  5, culoare: 0x7d6d59 },
      { fel: 'dr',   x:  -7, y: -3, w:  2, h:  3, culoare: 0xc2918c, faraContur: true },  // pe dinauntru, roz
      { fel: 'dr',   x:  -2, y: -3, w:  2, h:  3, culoare: 0xc2918c, faraContur: true },
      { fel: 'dr',   x:  -7, y:  2, w:  9, h:  7, culoare: 0x7d6d59 },  // capul
      { fel: 'dr',   x: -13, y:  4, w:  6, h:  4, culoare: 0x8d7c66 },  // botul
      { fel: 'dr',   x: -16, y:  4, w:  2, h:  2, culoare: 0xc2918c, faraContur: true },  // nasul
      { fel: 'dr',   x: -13, y:  6, w:  4, h:  2, culoare: 0xe8e2d4, faraContur: true },  // dintii din fata
      { fel: 'dr',   x: -13, y:  2, w:  7, h:  1, culoare: 0x4a3f33, faraContur: true },  // mustatile
      { fel: 'dr',   x:  -8, y:  0, w:  2, h:  2, culoare: 0x1a1410 }   // ochiul
    ]
  },

  // Paianjenul de padure: picioare lungi, trup rotund.
  spider: {
    nume: TEXT.SPIDER,
    prada: { poarta: false, sloturi: ['gat','inel1','talisman','spate'], arme: [], catDes: 0.35 },
    vechituri: ['Dried Silk Bundle', 'Brittle Leg', 'Clouded Eye'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -9, y: -7, w: 13, h:  2, culoare: 0x2b2028 },  // picioarele
      { fel: 'dr',   x:   9, y: -7, w: 13, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x: -11, y:  2, w: 15, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:  11, y:  2, w: 15, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:  -9, y: 11, w: 13, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x:   9, y: 11, w: 13, h:  2, culoare: 0x2b2028 },
      { fel: 'dr',   x: -15, y: -4, w:  2, h:  5, culoare: 0x201820, faraContur: true },  // incheieturile lor
      { fel: 'dr',   x:  15, y: -4, w:  2, h:  5, culoare: 0x201820, faraContur: true },
      { fel: 'dr',   x: -17, y:  4, w:  2, h:  5, culoare: 0x201820, faraContur: true },
      { fel: 'dr',   x:  17, y:  4, w:  2, h:  5, culoare: 0x201820, faraContur: true },
      { fel: 'cerc', x:   6, y:  3, r: 10,        culoare: 0x4a3550 },  // abdomenul
      { fel: 'dr',   x:   6, y: -2, w: 11, h:  4, culoare: 0x5e4468, faraContur: true },  // lumina de pe el
      { fel: 'dr',   x:   7, y:  4, w:  6, h:  3, culoare: 0xc9a84a, faraContur: true },  // semnul galben de pe spate
      { fel: 'dr',   x:   7, y:  9, w:  4, h:  2, culoare: 0xc9a84a, faraContur: true },
      { fel: 'cerc', x:  -7, y:  1, r:  7,        culoare: 0x5b4362 },  // capul
      { fel: 'dr',   x:  -7, y: -3, w:  8, h:  3, culoare: 0x6f5378, faraContur: true },
      { fel: 'dr',   x: -13, y:  5, w:  4, h:  3, culoare: 0x2b2028 },  // coltii
      { fel: 'dr',   x: -13, y:  6, w:  2, h:  2, culoare: 0xe8e2d4, faraContur: true },
      { fel: 'dr',   x: -10, y: -2, w:  3, h:  3, culoare: 0xe8dc9a, faraContur: true },  // ochii mari
      { fel: 'dr',   x:  -6, y: -2, w:  3, h:  3, culoare: 0xe8dc9a, faraContur: true },
      { fel: 'dr',   x: -11, y:  2, w:  2, h:  2, culoare: 0xb8ac6a, faraContur: true },  // si cei mici de sub ei
      { fel: 'dr',   x:  -7, y:  2, w:  2, h:  2, culoare: 0xb8ac6a, faraContur: true }
    ]
  },

  // ---------- REDWASTE ----------

  scorpid: {
    nume: TEXT.SCORPID,
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal'], catDes: 0.40 },
    vechituri: ['Cracked Carapace', 'Blunted Stinger', 'Chitin Shard'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  12, y: -2, w:  7, h:  7, culoare: 0xc99a45 },  // coada, inel cu inel
      { fel: 'dr',   x:  15, y: -8, w:  7, h:  7, culoare: 0xd8a94f },
      { fel: 'dr',   x:  17, y:-15, w:  6, h:  7, culoare: 0x2c2418 },  // acul
      { fel: 'dr',   x:  17, y:-18, w:  3, h:  3, culoare: 0x6b5a3a, faraContur: true },  // varful lui lucios
      { fel: 'dr',   x:  12, y: -4, w:  6, h:  2, culoare: 0xe2b86a, faraContur: true },  // lumina pe inele
      { fel: 'dr',   x:  15, y:-10, w:  6, h:  2, culoare: 0xe2b86a, faraContur: true },
      { fel: 'dr',   x:  -5, y: 12, w:  4, h:  4, culoare: 0x9c7830 },  // picioruse
      { fel: 'dr',   x:   3, y: 12, w:  4, h:  4, culoare: 0x9c7830 },
      { fel: 'dr',   x:   0, y:  4, w: 20, h: 13, culoare: 0xb98a3a },  // trupul
      { fel: 'dr',   x:   0, y:  0, w: 18, h:  4, culoare: 0xd3a04a, faraContur: true },  // carapacea luminata
      { fel: 'dr',   x:   0, y:  8, w: 18, h:  3, culoare: 0x966e2c, faraContur: true },  // umbra
      { fel: 'dr',   x:  -4, y:  4, w:  2, h: 11, culoare: 0x966e2c, faraContur: true },  // cusaturile carapacei
      { fel: 'dr',   x:   3, y:  4, w:  2, h: 11, culoare: 0x966e2c, faraContur: true },
      { fel: 'dr',   x: -19, y: -2, w: 10, h:  5, culoare: 0xd8a94f },  // clestii
      { fel: 'dr',   x: -19, y:  9, w: 10, h:  5, culoare: 0xd8a94f },
      { fel: 'dr',   x: -23, y: -3, w:  4, h:  2, culoare: 0x2c2418, faraContur: true },  // varfurile lor
      { fel: 'dr',   x: -23, y:  8, w:  4, h:  2, culoare: 0x2c2418, faraContur: true },
      { fel: 'dr',   x: -11, y:  3, w:  9, h:  9, culoare: 0xc99a45 },  // capul
      { fel: 'dr',   x: -12, y:  0, w:  2, h:  2, culoare: 0x1a1410 },  // ochii
      { fel: 'dr',   x:  -8, y:  0, w:  2, h:  2, culoare: 0x1a1410 }
    ]
  },

  boar: {
    nume: TEXT.BOAR,
    prada: { poarta: false, sloturi: ['inel1','talisman'], arme: [], catDes: 0.30 },
    vechituri: ['Cracked Tusk', 'Coarse Bristle', 'Scrap of Hide'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  -7, y: 12, w:  4, h:  8, culoare: 0x4f3c28 },  // picioarele
      { fel: 'dr',   x:   7, y: 12, w:  4, h:  8, culoare: 0x4f3c28 },
      { fel: 'dr',   x:  -1, y: 13, w:  4, h:  7, culoare: 0x5c4630 },
      { fel: 'dr',   x:  12, y: 13, w:  4, h:  7, culoare: 0x5c4630 },
      { fel: 'dr',   x:  -8, y: 16, w:  5, h:  3, culoare: 0x2a2018 },  // copitele
      { fel: 'dr',   x:   8, y: 16, w:  5, h:  3, culoare: 0x2a2018 },
      { fel: 'dr',   x:  14, y:  0, w:  4, h:  5, culoare: 0x5c4530 },  // codita
      { fel: 'dr',   x:   0, y:  4, w: 24, h: 15, culoare: 0x6b5236 },  // trupul
      { fel: 'dr',   x:   0, y: -1, w: 20, h:  4, culoare: 0x806342, faraContur: true },  // spinarea luminata
      { fel: 'dr',   x:   0, y:  9, w: 20, h:  4, culoare: 0x53402a, faraContur: true },  // umbra sub burta
      { fel: 'dr',   x:  -2, y: -4, w: 14, h:  4, culoare: 0x3e2f1f, faraContur: true },  // coama de peri aspri
      { fel: 'dr',   x: -11, y: -5, w:  4, h:  5, culoare: 0x5c4530 },  // urechea
      { fel: 'dr',   x: -12, y:  3, w: 11, h: 12, culoare: 0x7a5f40 },  // capul
      { fel: 'dr',   x: -12, y:  0, w: 10, h:  3, culoare: 0x8d7050, faraContur: true },
      { fel: 'dr',   x: -20, y:  5, w:  8, h:  8, culoare: 0x93755a },  // ratul
      { fel: 'dr',   x: -22, y:  5, w:  2, h:  2, culoare: 0x5c4028, faraContur: true },  // narile
      { fel: 'dr',   x: -22, y:  9, w:  2, h:  2, culoare: 0x5c4028, faraContur: true },
      { fel: 'dr',   x: -21, y:  1, w:  6, h:  3, culoare: 0xece5d2 },  // coltii
      { fel: 'dr',   x: -21, y: 11, w:  6, h:  3, culoare: 0xece5d2 },
      { fel: 'dr',   x: -24, y:  0, w:  3, h:  2, culoare: 0xfaf6ec, faraContur: true },
      { fel: 'dr',   x: -13, y:  0, w:  2, h:  2, culoare: 0x1a1410 }   // ochiul
    ]
  },

  // Vulturul de praf: aripi late, gat golas.
  vulture: {
    nume: TEXT.VULTURE,
    prada: { poarta: false, sloturi: ['gat','inel1','spate'], arme: [], catDes: 0.35 },
    vechituri: ['Scorched Feather', 'Hooked Beak', 'Hollow Bone'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:   0, y:  2, w: 34, h:  5, culoare: 0x3f372e },  // aripile intinse
      { fel: 'dr',   x: -14, y: -1, w: 10, h:  4, culoare: 0x4b4239 },
      { fel: 'dr',   x:  14, y: -1, w: 10, h:  4, culoare: 0x4b4239 },
      { fel: 'dr',   x: -13, y:  4, w:  9, h:  2, culoare: 0x2e2820, faraContur: true },  // penele mari
      { fel: 'dr',   x:  13, y:  4, w:  9, h:  2, culoare: 0x2e2820, faraContur: true },
      { fel: 'dr',   x: -15, y:  0, w:  5, h:  2, culoare: 0x5b5147, faraContur: true },  // lumina pe aripa
      { fel: 'dr',   x:  15, y:  0, w:  5, h:  2, culoare: 0x5b5147, faraContur: true },
      { fel: 'dr',   x:   0, y:  7, w: 14, h: 12, culoare: 0x554a3d },  // trupul
      { fel: 'dr',   x:   0, y:  3, w: 12, h:  3, culoare: 0x685c4c, faraContur: true },
      { fel: 'dr',   x:   0, y: 11, w: 12, h:  4, culoare: 0x433a30, faraContur: true },
      { fel: 'dr',   x:  -4, y: 15, w:  3, h:  4, culoare: 0xc9a04a },  // ghearele
      { fel: 'dr',   x:   4, y: 15, w:  3, h:  4, culoare: 0xc9a04a },
      { fel: 'dr',   x:  -1, y:  0, w:  9, h:  3, culoare: 0xe0d8c4, faraContur: true },  // gulerul de puf
      { fel: 'dr',   x:  -1, y: -3, w:  4, h:  7, culoare: 0xa38f6a },  // gatul golas
      { fel: 'cerc', x:  -1, y: -8, r:  5,        culoare: 0xb09a72 },  // capul
      { fel: 'dr',   x:  -1, y:-11, w:  6, h:  2, culoare: 0xc4ae86, faraContur: true },
      { fel: 'dr',   x:  -7, y: -7, w:  6, h:  3, culoare: 0xe0b055 },  // ciocul
      { fel: 'dr',   x:  -9, y: -6, w:  3, h:  2, culoare: 0x8a6a2a, faraContur: true },  // varful lui incovoiat
      { fel: 'dr',   x:  -2, y: -9, w:  2, h:  2, culoare: 0xe8dc9a, faraContur: true }   // ochiul galben
    ]
  },

  // Sarpele de nisip: incolacit, cu capul ridicat.
  serpent: {
    nume: TEXT.SERPENT,
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal'], catDes: 0.40 },
    vechituri: ['Shed Scale', 'Rattle Tip', 'Dried Venom Gland'],
    neam: 'fiara',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:   8, y: 12, w: 21, h:  6, culoare: 0x6b7a3a },  // coada incolacita
      { fel: 'dr',   x:  -4, y:  8, w: 22, h:  6, culoare: 0x7a8b43 },
      { fel: 'dr',   x:   2, y:  1, w: 18, h:  6, culoare: 0x7a8b43 },
      { fel: 'dr',   x:   9, y: 10, w: 18, h:  2, culoare: 0x869a45, faraContur: true },  // lumina pe inele
      { fel: 'dr',   x:  -3, y:  6, w: 19, h:  2, culoare: 0x8a9c4e, faraContur: true },
      { fel: 'dr',   x:   2, y: -1, w: 15, h:  2, culoare: 0x8a9c4e, faraContur: true },
      { fel: 'dr',   x:   4, y: 12, w:  3, h:  5, culoare: 0x59682f, faraContur: true },  // solzii de pe spate
      { fel: 'dr',   x:  12, y: 12, w:  3, h:  5, culoare: 0x59682f, faraContur: true },
      { fel: 'dr',   x:   0, y:  8, w:  3, h:  5, culoare: 0x59682f, faraContur: true },
      { fel: 'dr',   x:   8, y:  1, w:  3, h:  5, culoare: 0x59682f, faraContur: true },
      { fel: 'dr',   x:  -4, y: -5, w:  6, h: 13, culoare: 0x87994b },  // gatul ridicat
      { fel: 'dr',   x:  -6, y: -5, w:  2, h: 12, culoare: 0x9aad57, faraContur: true },
      { fel: 'cerc', x:  -4, y:-11, r:  6,        culoare: 0x95a855 },  // capul
      { fel: 'dr',   x:  -4, y:-14, w:  7, h:  2, culoare: 0xa8bb62, faraContur: true },
      { fel: 'dr',   x: -11, y: -9, w:  6, h:  2, culoare: 0xd85a4a },  // limba despicata
      { fel: 'dr',   x: -14, y:-10, w:  3, h:  1, culoare: 0xd85a4a, faraContur: true },
      { fel: 'dr',   x: -14, y: -8, w:  3, h:  1, culoare: 0xd85a4a, faraContur: true },
      { fel: 'dr',   x:  -8, y: -7, w:  3, h:  2, culoare: 0xe8e2d4, faraContur: true },  // coltii
      { fel: 'dr',   x:  -6, y:-12, w:  3, h:  3, culoare: 0xe8c84a },  // ochiul
      { fel: 'dr',   x:  -6, y:-12, w:  1, h:  3, culoare: 0x2a2010, faraContur: true }   // pupila despicata
    ]
  },

  raider: {
    nume: TEXT.RAIDER,
    prada: { poarta: true, armuri: ['piele','zale'], arme: ['topor','buzdugan','sabie'], catDes: 1.25 },
    vechituri: ['Notched Blade Fragment', 'Sun-bleached Strap', 'Dented Cup'],
    neam: 'umanoid',
    stats: STATS_NIVEL_1,
    forme: [
      { fel: 'dr',   x:  12, y:  2, w:  3, h: 16, culoare: 0x5b3a1a },  // coada toporului
      { fel: 'dr',   x:  16, y: -4, w:  9, h:  9, culoare: 0xb8bcc4 },  // lama
      { fel: 'dr',   x:  19, y: -5, w:  3, h:  6, culoare: 0xe2e6ee, faraContur: true },  // taisul
      { fel: 'dr',   x:  13, y: -3, w:  3, h:  4, culoare: 0x8a8f98, faraContur: true },  // legatura de fier
      { fel: 'dr',   x:  -6, y: 16, w:  6, h:  6, culoare: 0x3a2c1e },  // cizmele
      { fel: 'dr',   x:   5, y: 16, w:  6, h:  6, culoare: 0x3a2c1e },
      { fel: 'dr',   x:   0, y:  5, w: 19, h: 18, culoare: 0x7a4a30 },  // trupul
      { fel: 'dr',   x:  -5, y:  4, w:  5, h: 14, culoare: 0x8d5a3c, faraContur: true },  // lumina
      { fel: 'dr',   x:   6, y:  6, w:  4, h: 12, culoare: 0x633a24, faraContur: true },  // umbra
      { fel: 'dr',   x: -10, y: -1, w:  6, h:  6, culoare: 0x6b6f78 },  // umerarul de fier
      { fel: 'dr',   x: -10, y: -3, w:  5, h:  2, culoare: 0x8a8f98, faraContur: true },
      { fel: 'dr',   x:   0, y:  8, w: 19, h:  3, culoare: 0x4a3018, faraContur: true },  // cureaua lata
      { fel: 'dr',   x:   2, y:  8, w:  4, h:  3, culoare: 0xa8955e, faraContur: true },  // catarama
      { fel: 'dr',   x:   0, y:  0, w: 15, h:  3, culoare: 0x5a3a2a, faraContur: true },  // curea peste piept
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xc99a6a },  // capul
      { fel: 'dr',   x:   0, y: -4, w: 11, h:  5, culoare: 0x6b4a2c, faraContur: true },  // barba deasa
      { fel: 'dr',   x:   0, y:-12, w: 18, h:  6, culoare: 0x9c3a2c },  // banderola rosie
      { fel: 'dr',   x:   0, y:-14, w: 16, h:  2, culoare: 0xb8503c, faraContur: true },
      { fel: 'dr',   x:   8, y:-11, w:  4, h:  7, culoare: 0x9c3a2c, faraContur: true },  // capatul ei fluturand
      { fel: 'dr',   x:  -3, y: -7, w:  2, h:  2, culoare: 0x120f0c },  // ochii
      { fel: 'dr',   x:   3, y: -7, w:  2, h:  2, culoare: 0x120f0c }
    ]
  }
};


// ==========================================================
//  NUMELE CELOR RARI SI ALE CELOR ELIT
//
//  Un inamic de rand se cheama "Wolf". Unul rar are nume propriu:
//  "Greyhide the Starved". Se face din doua bucati, ca obiectele -
//  asa ies sute de nume fara sa le scriu pe toate.
// ==========================================================
const NUME_RARE = [
  'Greyhide', 'Ashfang', 'Old Bramble', 'Nightcrawl', 'Ironjaw',
  'Sablemane', 'Hollowtooth', 'Duskwing', 'Rotclaw', 'Stonehide',
  'Bitterfang', 'Palehorn', 'Grimscale', 'Emberback', 'Thornhide'
];

const PORECLE_RARE = [
  'the Starved', 'the Patient', 'the Unbroken', 'the Scarred',
  'the Long-Lived', 'the Silent', 'the Hungry', 'the Twice-Hunted',
  'the Ragged', 'the Bitter'
];

const NUME_ELITE = [
  'Warden', 'Matriarch', 'Bloodking', 'The Elder', 'Dreadmaw',
  'The Broodfather', 'Grave-Tender', 'The Pale Sovereign'
];

// Numele se face din numarul locului, nu la intamplare: asa acelasi
// inamic rar are mereu acelasi nume, oricat de des te intorci.
function numeDeRar(samanta) {
  const a = NUME_RARE[samanta % NUME_RARE.length];
  const b = PORECLE_RARE[Math.floor(samanta / NUME_RARE.length) % PORECLE_RARE.length];
  return a + ' ' + b;
}

function numeDeElit(samanta, numeFel) {
  return NUME_ELITE[samanta % NUME_ELITE.length] + ' of the ' + numeFel;
}


// ==========================================================
//  VIETATILE MARUNTE
//
//  Iepuri, soparle, gandaci. Nu se bat, nu dau experienta, nu lasa
//  nimic si mor dintr-o lovitura. N-au niciun rost in joc.
//
//  Exact asta e rostul lor: o lume in care singurele lucruri vii
//  sunt cele care vor sa te omoare nu se simte ca o lume. WoW e
//  plin de broaste si de veverite din acelasi motiv.
// ==========================================================
const VIETATI = {

  iepure: {
    nume: 'Rabbit',
    forme: [
      { fel: 'dr',   x:  5, y:  2, w:  3, h:  3, culoare: 0xe8e2d8 },  // coada
      { fel: 'dr',   x:  0, y:  2, w: 10, h:  6, culoare: 0xa89880 },  // trup
      { fel: 'dr',   x: -5, y: -4, w:  2, h:  5, culoare: 0xb8a890 },  // urechi
      { fel: 'dr',   x: -2, y: -4, w:  2, h:  5, culoare: 0xb8a890 },
      { fel: 'dr',   x: -5, y:  1, w:  6, h:  5, culoare: 0xb8a890 },  // cap
      { fel: 'dr',   x: -6, y:  0, w:  2, h:  2, culoare: 0x120f0c }   // ochi
    ]
  },

  soparla: {
    nume: 'Lizard',
    forme: [
      { fel: 'dr',   x:  7, y:  1, w:  8, h:  2, culoare: 0x6a8a52 },  // coada
      { fel: 'dr',   x:  0, y:  1, w: 11, h:  4, culoare: 0x7a9a5c },  // trup
      { fel: 'dr',   x: -4, y:  4, w:  3, h:  2, culoare: 0x6a8a52 },  // picioare
      { fel: 'dr',   x:  3, y:  4, w:  3, h:  2, culoare: 0x6a8a52 },
      { fel: 'dr',   x: -6, y:  0, w:  5, h:  4, culoare: 0x8aaa6c },  // cap
      { fel: 'dr',   x: -7, y: -1, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  gandac: {
    nume: 'Beetle',
    forme: [
      { fel: 'cerc', x:  1, y:  1, r:  5,        culoare: 0x3a3a44 },  // carapace
      { fel: 'dr',   x:  1, y:  1, w:  2, h:  9, culoare: 0x24242c },  // dunga
      { fel: 'dr',   x: -6, y: -2, w:  3, h:  2, culoare: 0x2a2a32 },  // antene
      { fel: 'dr',   x: -6, y:  3, w:  3, h:  2, culoare: 0x2a2a32 }
    ]
  },

  pasare: {
    nume: 'Sparrow',
    forme: [
      { fel: 'dr',   x:  4, y:  0, w:  5, h:  2, culoare: 0x6a5a48 },  // coada
      { fel: 'cerc', x:  0, y:  0, r:  4,        culoare: 0x8a7a62 },  // trup
      { fel: 'dr',   x: -4, y: -1, w:  3, h:  3, culoare: 0x9a8a72 },  // cap
      { fel: 'dr',   x: -6, y:  0, w:  2, h:  1, culoare: 0xd8a84a },  // cioc
      { fel: 'dr',   x: -4, y: -2, w:  1, h:  1, culoare: 0x120f0c }
    ]
  }
};

const ID_VIETATI = Object.keys(VIETATI);


// ==========================================================
//  ANIMALUL IMBLANZIT
//
//  Mutate din game.js. Cat viata si cat damage are fiara pe care ti-ai
//  facut-o tovaras, si cu cat loveste mai tare cand e multumita, sunt
//  reguli despre fiare - stau langa statsPentruNivel(), din care ies.
//  Le citeste si lumea 3D.
// ==========================================================
function sporulFericirii(a) {
  if (a.fericire >= 70) return 1.15;
  if (a.fericire >= 35) return 1;
  return 0.75;
}

function statsleAnimalului(fel, nivel) {
  const s = statsPentruNivel(nivel, 'normal');
  // ATENTIE: campurile se cheama dmgMin si dmgMax, nu damageMin.
  // Cu numele gresite, damage-ul animalului iesea NaN si inamicul
  // ramanea cu viata "NaN" - adica invincibil.
  return {
    viataMaxima: Math.round(s.viata * 1.3),
    dmgMin: Math.round(s.dmgMin * 0.8),
    dmgMax: Math.round(s.dmgMax * 0.8),
    viteza: 2.0
  };
}
