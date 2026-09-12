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
            culoare: '#e6c669', xp: 10, marime: 1.5,  reaparitie: 1200000 }
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
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal','buzdugan'], catDes: 0.40 },
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
      { fel: 'dr',   x:  12, y: -6, w:  3, h: 26, culoare: 0xb8bcc4 },  // sulita
      { fel: 'dr',   x:  12, y:-19, w:  5, h:  7, culoare: 0xd8dce4 },  // varful
      { fel: 'dr',   x:   0, y:  5, w: 19, h: 19, culoare: 0x6b6f78 },  // platosa
      { fel: 'dr',   x:   0, y:  2, w: 19, h:  5, culoare: 0x8f5a2c },  // curea
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },  // cap
      { fel: 'dr',   x:   0, y:-13, w: 19, h:  9, culoare: 0x8a8f98 },  // coif
      { fel: 'dr',   x:   0, y:-13, w:  3, h:  9, culoare: 0x5c6068 },  // creasta
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  bandit: {
    nume: TEXT.BANDIT,
    prada: { poarta: true, armuri: ['panza','piele'], arme: ['pumnal','sabie','arc'], catDes: 1.15 },
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
    prada: { poarta: false, sloturi: ['inel1','talisman'], arme: [], catDes: 0.25 },
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
    prada: { poarta: false, sloturi: ['gat','inel1','talisman','spate'], arme: [], catDes: 0.35 },
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
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal'], catDes: 0.40 },
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
    prada: { poarta: false, sloturi: ['inel1','talisman'], arme: [], catDes: 0.30 },
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
    prada: { poarta: false, sloturi: ['gat','inel1','spate'], arme: [], catDes: 0.35 },
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
    prada: { poarta: false, sloturi: ['gat','inel1','talisman'], arme: ['pumnal'], catDes: 0.40 },
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
    prada: { poarta: true, armuri: ['piele','zale'], arme: ['topor','buzdugan','sabie'], catDes: 1.25 },
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
