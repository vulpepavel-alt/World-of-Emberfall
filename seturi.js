// ==========================================================
//  SETURILE
//
//  Un set e o familie de piese care se potrivesc intre ele. Cat
//  timp porti mai multe deodata, primesti ceva in plus - la doua
//  piese putin, la patru mai mult, la sase cel mai mult.
//
//  Spre deosebire de restul obiectelor, care se fac dupa reteta din
//  adjectiv + piesa + coada, piesele de set sunt scrise de mana:
//  fiecare are numele ei, aceeasi pentru toata lumea, mereu.
//  De asta si merita cautate.
//
//  DE UNDE PICA: fiecare set are lista lui de inamici. Piesele de
//  Moorwarden pica de la talhari si raideri, cele de Houndmark de
//  la lupi si de la cei care sapa. Nu pica de la orice.
//
//  Numele sunt inventate aici, ca tot ce se vede in joc. Niciunul
//  nu vine din alt joc.
// ==========================================================


// Sloturile pe care le are un set. Sase, mereu aceleasi: asa
// bonusul de sase piese cere tot setul, dar iti lasa gatul,
// pelerina, inelele si armele libere.
const SLOTURI_DE_SET = ['cap', 'piept', 'maini', 'brau', 'picioare', 'talpi'];


const SETURI = [

  {
    id: 'moorwarden', nume: 'Moorwarden', felArmura: 'piele', nivel: 18,
    deLa: ['bandit', 'raider'],
    piese: {
      cap:      'Moorwarden Mask',
      piept:    'Moorwarden Jerkin',
      maini:    'Moorwarden Grips',
      brau:     'Moorwarden Belt',
      picioare: 'Moorwarden Britches',
      talpi:    'Moorwarden Treads'
    },
    bonusuri: [
      { cate: 2, da: { agi: 5 } },
      { cate: 4, da: { agi: 8, sta: 6 } },
      { cate: 6, da: { agi: 14, sta: 10, armura: 90 } }
    ]
  },

  {
    id: 'ashweave', nume: 'Ashweave', felArmura: 'panza', nivel: 24,
    deLa: ['spider', 'serpent'],
    piese: {
      cap:      'Ashweave Cowl',
      piept:    'Ashweave Robe',
      maini:    'Ashweave Handwraps',
      brau:     'Ashweave Cord',
      picioare: 'Ashweave Leggings',
      talpi:    'Ashweave Slippers'
    },
    bonusuri: [
      { cate: 2, da: { int: 6 } },
      { cate: 4, da: { int: 10, spi: 8 } },
      { cate: 6, da: { int: 18, spi: 14 } }
    ]
  },

  {
    id: 'houndmark', nume: 'Houndmark', felArmura: 'zale', nivel: 32,
    deLa: ['wolf', 'burrower', 'boar'],
    piese: {
      cap:      'Houndmark Coif',
      piept:    'Houndmark Ringmail',
      maini:    'Houndmark Handguards',
      brau:     'Houndmark Waistguard',
      picioare: 'Houndmark Chausses',
      talpi:    'Houndmark Warboots'
    },
    bonusuri: [
      { cate: 2, da: { sta: 8 } },
      { cate: 4, da: { sta: 12, str: 8 } },
      { cate: 6, da: { sta: 20, str: 14, armura: 160 } }
    ]
  },

  {
    id: 'sunscour', nume: 'Sunscour', felArmura: 'piele', nivel: 40,
    deLa: ['vulture', 'scorpid'],
    piese: {
      cap:      'Sunscour Headguard',
      piept:    'Sunscour Vest',
      maini:    'Sunscour Handguards',
      brau:     'Sunscour Girdle',
      picioare: 'Sunscour Legguards',
      talpi:    'Sunscour Boots'
    },
    bonusuri: [
      { cate: 2, da: { agi: 10 } },
      { cate: 4, da: { agi: 16, spi: 10 } },
      { cate: 6, da: { agi: 26, spi: 16, armura: 200 } }
    ]
  },

  {
    id: 'stonevigil', nume: 'Stonevigil', felArmura: 'placi', nivel: 48,
    deLa: ['raider', 'bandit'],
    piese: {
      cap:      'Stonevigil Greathelm',
      piept:    'Stonevigil Cuirass',
      maini:    'Stonevigil Gauntlets',
      brau:     'Stonevigil Girdle',
      picioare: 'Stonevigil Legplates',
      talpi:    'Stonevigil Sabatons'
    },
    bonusuri: [
      { cate: 2, da: { str: 12 } },
      { cate: 4, da: { str: 18, sta: 14 } },
      { cate: 6, da: { str: 30, sta: 24, armura: 320 } }
    ]
  },

  {
    id: 'emberguard', nume: 'Emberguard', felArmura: 'placi', nivel: 58,
    deLa: ['garda'],
    piese: {
      cap:      'Emberguard Warhelm',
      piept:    'Emberguard Breastplate',
      maini:    'Emberguard Handplates',
      brau:     'Emberguard Warbelt',
      picioare: 'Emberguard Warlegs',
      talpi:    'Emberguard Stompers'
    },
    bonusuri: [
      { cate: 2, da: { str: 16, sta: 10 } },
      { cate: 4, da: { str: 24, sta: 20 } },
      { cate: 6, da: { str: 40, sta: 34, armura: 450 } }
    ]
  }
];


function gasesteSetul(id) {
  return SETURI.find(function (s) { return s.id === id; }) || null;
}


// Seturile care pot pica de la un anumit fel de inamic, la nivelul
// lui. Un set apare doar in jurul nivelului lui: de la sase sub
// pana la douasprezece peste, ca sa nu-l primesti prea devreme si
// nici sa nu-l mai vezi mult dupa ce l-ai depasit.
function seturileDeLa(felMob, nivelMob) {
  return SETURI.filter(function (s) {
    if (s.deLa.indexOf(felMob) < 0) return false;
    return nivelMob >= s.nivel - 6 && nivelMob <= s.nivel + 12;
  });
}


// Face o piesa de set. E un obiect ca oricare altul - se poarta la
// fel, se vinde la fel - doar ca are numele scris de mana si tine
// minte din ce set face parte.
function faPiesaDeSet(set, idSlot) {

  const nume = set.piese[idSlot];
  if (!nume) return null;

  // Pornim de la un obiect obisnuit, ca sa nu socotim de doua ori
  // aceleasi cifre, si ii schimbam numele si culoarea.
  const o = faObiect(idSlot, set.nivel, 'bun', { felArmura: set.felArmura });
  if (!o) return null;

  o.nume = nume;
  o.set = set.id;
  return o;
}


// ----------------------------------------------------------
//  CAT AI DINTR-UN SET, SI CE-TI DA
// ----------------------------------------------------------

// Cate piese din fiecare set ai pe tine acum.
function pieseleDeSetPurtate(personajul) {
  const cate = {};
  const echipate = personajul.echipament || {};
  Object.keys(echipate).forEach(function (idSlot) {
    const o = echipate[idSlot];
    if (o && o.set) cate[o.set] = (cate[o.set] || 0) + 1;
  });
  return cate;
}


// Bonusurile pornite acum, cu totul. Se aduna peste statistici la
// fel ca ce dau piesele in sine.
function bonusDeSet(personajul) {

  const total = { str: 0, agi: 0, sta: 0, int: 0, spi: 0, armura: 0 };
  const cate = pieseleDeSetPurtate(personajul);

  Object.keys(cate).forEach(function (idSet) {
    const set = gasesteSetul(idSet);
    if (!set) return;
    set.bonusuri.forEach(function (b) {
      if (cate[idSet] < b.cate) return;
      Object.keys(b.da).forEach(function (cheie) {
        total[cheie] = (total[cheie] || 0) + b.da[cheie];
      });
    });
  });

  return total;
}


// Bonusul scris omeneste, pentru fisa obiectului si pentru meniu.
function scrieBonusul(da) {
  const NUME = { str: 'Strength', agi: 'Agility', sta: 'Stamina',
                 int: 'Intellect', spi: 'Spirit', armura: 'Armor' };
  return Object.keys(da).map(function (k) {
    return '+' + da[k] + ' ' + (NUME[k] || k);
  }).join(', ');
}
