// ==========================================================
//  OBIECTELE SI ECHIPAMENTUL
//
//  Sloturile sunt cele obisnuite intr-un RPG: cap, gat, umeri
//  si asa mai departe. Obiectele NU sunt scrise unul cate unul -
//  se fac dupa reteta, din trei bucati:
//
//     [ adjectiv ]  [ numele piesei ]  [ of ... ]
//       Sturdy           Helm           of Stone
//
//  Adjectivul vine din raritate, piesa din slot, iar coada
//  "of ..." spune ce statistica da mai mult. Asa ies mii de
//  obiecte diferite fara sa scriem fiecare de mana.
// ==========================================================


// Sloturile, in ordinea in care apar in meniu.
// coloana: 'stanga', 'dreapta' sau 'jos'
const SLOTURI = [
  { id: 'cap',          nume: 'Head',      coloana: 'stanga' },
  { id: 'gat',          nume: 'Neck',      coloana: 'stanga' },
  { id: 'umeri',        nume: 'Shoulders', coloana: 'stanga' },
  { id: 'spate',        nume: 'Back',      coloana: 'stanga' },
  { id: 'piept',        nume: 'Chest',     coloana: 'stanga' },
  { id: 'incheieturi',  nume: 'Wrists',    coloana: 'stanga' },

  { id: 'maini',        nume: 'Hands',     coloana: 'dreapta' },
  { id: 'brau',         nume: 'Waist',     coloana: 'dreapta' },
  { id: 'picioare',     nume: 'Legs',      coloana: 'dreapta' },
  { id: 'talpi',        nume: 'Feet',      coloana: 'dreapta' },
  { id: 'inel1',        nume: 'Ring 1',    coloana: 'dreapta', fel: 'inel' },
  { id: 'inel2',        nume: 'Ring 2',    coloana: 'dreapta', fel: 'inel' },

  { id: 'talisman',     nume: 'Trinket',   coloana: 'jos', fel: 'talisman' },
  { id: 'armaPrincipala', nume: 'Main Hand', coloana: 'jos', fel: 'arma' },
  { id: 'armaSecundara',  nume: 'Off Hand',  coloana: 'jos', fel: 'scut' }
];

function gasesteSlot(id) {
  return SLOTURI.find(function (s) { return s.id === id; }) || null;
}


// Raritatile, de la cea mai simpla la cea mai buna.
// putere = de cate ori mai bune sunt statisticile
const RARITATI = [
  { id: 'comun',    nume: 'Common',    culoare: '#c8c2b4', putere: 1.0, sansa: 50,
    adjective: ['Worn', 'Plain', 'Rough', 'Chipped', 'Battered', 'Simple', 'Patched', 'Weathered'] },
  { id: 'bun',      nume: 'Uncommon',  culoare: '#5fbf5f', putere: 1.5, sansa: 32,
    adjective: ['Sturdy', 'Fine', 'Keen', 'Honed', 'Banded', 'Trued', 'Seasoned', 'Well-Made'] },
  { id: 'rar',      nume: 'Rare',      culoare: '#5f9fe0', putere: 2.2, sansa: 14,
    adjective: ['Gleaming', 'Runed', 'Tempered', 'Etched', 'Hallowed', 'Frostbound', 'Sunlit', 'Oathsworn'] },
  { id: 'maiestru', nume: 'Epic',      culoare: '#b06fd8', putere: 3.2, sansa: 4,
    adjective: ['Ancient', 'Dread', 'Storied', 'Undying', 'Sovereign', 'Wrathbound', 'Everdark', 'Kingsworn'] }
];

function gasesteRaritate(id) {
  return RARITATI.find(function (r) { return r.id === id; }) || RARITATI[0];
}


// ==========================================================
//  DIN CE E FACUT UN OBIECT
//
//  Pana acum un obiect era "adjectiv + numele slotului + of ...",
//  deci toate coifurile din joc se chemau Helm si toate armele
//  se chemau Blade. Erau 225 de tipare de nume cu totul.
//
//  Acum un obiect are trei straturi, ca in Classic:
//
//    TREAPTA DE MATERIAL - se schimba cu nivelul. Fierul de la
//        nivelul 5 nu e acelasi cu cel de la 50, si se vede si in
//        nume, si in culoare.
//    CLASA DE ARMURA - panza, piele, zale sau placi. Schimba
//        numele piesei (papucii de panza nu-s sabatonii de placi),
//        cat tine armura, si cum arata.
//    FELUL ARMEI - sabie, topor, buzdugan, pumnal, toiag sau arc,
//        fiecare cu viteza lui si cu numele lui.
//
//  ATENTIE: clasa de armura NU te opreste sa porti ceva. Tu ai scris
//  ca "armor proficiency" nu intra in scopul jocului, deci ramane
//  doar aroma, desenul si cata armura da.
// ==========================================================


// ---- Cele sase trepte de material, dupa nivelul obiectului ----
// Cuvintele sunt aceleasi cu ale minereurilor din meserii (Dull,
// Bright, Deep, Rich), ca lumea sa se lege intre ea.
const TREPTE_MATERIAL = [
  { panaLa:  9, nume: 'Dull',    baza: '#6f6a62', lumina: '#918b80', umbra: '#46423c', ornament: '#7d7059' },
  { panaLa: 19, nume: 'Bright',  baza: '#8a8f96', lumina: '#b3b8c0', umbra: '#565b62', ornament: '#c0a462' },
  { panaLa: 29, nume: 'Deep',    baza: '#5e6b7d', lumina: '#8593a6', umbra: '#39424e', ornament: '#b59a55' },
  { panaLa: 39, nume: 'Rich',    baza: '#7d6a3c', lumina: '#a88f52', umbra: '#4d4124', ornament: '#d9c17b' },
  { panaLa: 49, nume: 'Storied', baza: '#4d5f8c', lumina: '#7387b8', umbra: '#2e3a57', ornament: '#d9c07a' },
  { panaLa: 99, nume: 'Ember',   baza: '#7a3f2e', lumina: '#a85f42', umbra: '#48241a', ornament: '#e6a84d' }
];

function treaptaMaterialului(nivel) {
  for (const t of TREPTE_MATERIAL) if (nivel <= t.panaLa) return t;
  return TREPTE_MATERIAL[TREPTE_MATERIAL.length - 1];
}


// ---- Clasele de armura ----
// cataArmura = de cate ori mai multa armura da fata de zale
const FELURI_ARMURA = {
  panza:  { id: 'panza',  nume: 'Cloth',   cataArmura: 0.55 },
  piele:  { id: 'piele',  nume: 'Leather', cataArmura: 0.80 },
  zale:   { id: 'zale',   nume: 'Mail',    cataArmura: 1.00 },
  placi:  { id: 'placi',  nume: 'Plate',   cataArmura: 1.35 }
};

const CLASE_ARMURA = ['panza', 'piele', 'zale', 'placi'];


// ---- Numele piesei, pe slot SI pe clasa de armura ----
//
// De aici vine cea mai mare parte a variatiei. Un singur slot are
// acum pana la douasprezece nume in loc de unul.
const PIESE = {
  cap: {
    panza: ['Cowl', 'Hood', 'Circlet'],
    piele: ['Cap', 'Mask', 'Headguard'],
    zale:  ['Coif', 'Helm', 'Skullcap'],
    placi: ['Greathelm', 'Faceplate', 'Warhelm']
  },
  umeri: {
    panza: ['Mantle', 'Shoulderwrap', 'Amice'],
    piele: ['Shoulderguards', 'Spaulders', 'Shoulderpads'],
    zale:  ['Shoulderplates', 'Pauldrons', 'Mantle of Rings'],
    placi: ['Shoulderplates', 'Great Pauldrons', 'Warshoulders']
  },
  piept: {
    panza: ['Robe', 'Vestment', 'Tunic'],
    piele: ['Jerkin', 'Vest', 'Hauberk'],
    zale:  ['Chainmail', 'Ringmail', 'Coat of Rings'],
    placi: ['Breastplate', 'Cuirass', 'Chestguard']
  },
  incheieturi: {
    panza: ['Cuffs', 'Wristwraps', 'Armbands'],
    piele: ['Bracers', 'Wristguards', 'Armguards'],
    zale:  ['Vambraces', 'Wristplates', 'Bracers'],
    placi: ['Armplates', 'Vambraces', 'Wristguards']
  },
  maini: {
    panza: ['Gloves', 'Handwraps', 'Mitts'],
    piele: ['Gloves', 'Grips', 'Handguards'],
    zale:  ['Gauntlets', 'Handguards', 'Chain Gloves'],
    placi: ['Gauntlets', 'Handplates', 'Warfists']
  },
  brau: {
    panza: ['Cord', 'Sash', 'Girdle'],
    piele: ['Belt', 'Girdle', 'Waistband'],
    zale:  ['Chain Belt', 'Girdle', 'Waistguard'],
    placi: ['Girdle', 'Waistplate', 'Warbelt']
  },
  picioare: {
    panza: ['Leggings', 'Trousers', 'Pantaloons'],
    piele: ['Britches', 'Leggings', 'Legguards'],
    zale:  ['Legguards', 'Chausses', 'Chain Leggings'],
    placi: ['Greaves', 'Legplates', 'Warlegs']
  },
  talpi: {
    panza: ['Slippers', 'Sandals', 'Footwraps'],
    piele: ['Boots', 'Treads', 'Shoes'],
    zale:  ['Warboots', 'Sabatons', 'Greaves'],
    placi: ['Sabatons', 'Stompers', 'Warboots']
  }
};

// Sloturile care nu au clasa de armura: pelerina, podoabele.
const PIESE_SIMPLE = {
  spate:    ['Cloak', 'Cape', 'Drape', 'Shroud'],
  gat:      ['Amulet', 'Pendant', 'Necklace', 'Choker', 'Torc'],
  inel1:    ['Band', 'Ring', 'Signet', 'Loop', 'Seal'],
  inel2:    ['Band', 'Ring', 'Signet', 'Loop', 'Seal'],
  talisman: ['Charm', 'Idol', 'Talisman', 'Figurine', 'Token']
};


// ---- Felurile de arma ----
// viteza  = secunde intre doua lovituri (mai incet = lovituri mai mari)
// dmg     = de cate ori mai mult damage decat media, ca sa iasa
//           acelasi DPS indiferent ce tii in mana
const FELURI_ARMA = [
  { id: 'sabie',    viteza: 2.2, dmg: 1.00, nume: ['Blade', 'Sword', 'Longsword', 'Saber'] },
  { id: 'topor',    viteza: 2.6, dmg: 1.18, nume: ['Axe', 'Cleaver', 'Waraxe', 'Hatchet'] },
  { id: 'buzdugan', viteza: 2.4, dmg: 1.09, nume: ['Mace', 'Hammer', 'Maul', 'Cudgel'] },
  { id: 'pumnal',   viteza: 1.6, dmg: 0.73, nume: ['Dagger', 'Dirk', 'Shiv', 'Kris'] },
  { id: 'toiag',    viteza: 2.8, dmg: 1.27, nume: ['Staff', 'Rod', 'Quarterstaff', 'Cane'] },
  { id: 'arc',      viteza: 2.5, dmg: 1.14, nume: ['Bow', 'Shortbow', 'Longbow', 'Recurve'] }
];

const PIESE_SCUT = ['Shield', 'Buckler', 'Bulwark', 'Targe', 'Aegis'];


// Coada "of ...": ce statistica primeste mai mult.
const COZI = [
  { text: 'of Might',      atribut: 'str' },
  { text: 'of the Bear',   atribut: 'str' },
  { text: 'of the Forge',  atribut: 'str' },
  { text: 'of the Wind',   atribut: 'agi' },
  { text: 'of the Falcon', atribut: 'agi' },
  { text: 'of the Fox',    atribut: 'agi' },
  { text: 'of Stone',      atribut: 'sta' },
  { text: 'of the Boar',   atribut: 'sta' },
  { text: 'of Warding',    atribut: 'sta' },
  { text: 'of Insight',    atribut: 'int' },
  { text: 'of the Owl',    atribut: 'int' },
  { text: 'of Embers',     atribut: 'int' },
  { text: 'of the Spring', atribut: 'spi' },
  { text: 'of the Tide',   atribut: 'spi' },
  { text: 'of Quiet',      atribut: 'spi' }
];


// Cate puncte de statistica da un obiect. Creste cu nivelul si
// cu raritatea. Sloturile mari (piept, picioare) dau mai mult.
const MARIME_SLOT = {
  cap: 1.0, gat: 0.6, umeri: 0.85, spate: 0.6, piept: 1.2,
  incheieturi: 0.6, maini: 0.8, brau: 0.8, picioare: 1.2, talpi: 0.8,
  inel1: 0.7, inel2: 0.7, talisman: 0.9,
  armaPrincipala: 1.3, armaSecundara: 0.9
};

// Sloturile astea dau si armura; inelele si talismanele nu.
const DA_ARMURA = ['cap', 'umeri', 'spate', 'piept', 'incheieturi',
                   'maini', 'brau', 'picioare', 'talpi', 'armaSecundara'];


let urmatorulIdObiect = 1;

// Cand incarcam un personaj salvat, numerele obiectelor noi trebuie
// sa continue de unde a ramas, nu de la 1.
function pornesteIdurileObiectelor(deLa) {
  urmatorulIdObiect = Math.max(urmatorulIdObiect, deLa || 1);
}

// Un obiect cu numele scris de mana: prada unui sef anume.
//
// Se face ca orice alt obiect - ca sa nu socotim de doua ori
// aceleasi cifre - si pe urma i se pune numele lui. Asta il face sa
// merite cautat: "Corvin's Ledger Key" pica DOAR de la Corvin, si
// oricine il vede stie de unde vine.
function faObiectDeSef(def, nivel) {
  const o = faObiect(def.slot, def.nivel || nivel, def.raritate || 'rar',
                     def.felArmura ? { felArmura: def.felArmura } : undefined);
  if (!o) return null;
  o.nume = def.nume;
  o.deLaSef = true;
  return o;
}


// ==========================================================
//  DURABILITATEA
//
//  Fiecare arma si fiecare piesa de armura are un numar de puncte.
//  Scad cand lovesti, cand incasezi si - mai ales - cand mori.
//  La zero, lucrul nu mai da NIMIC: nici statistici, nici armura,
//  nici damage. Il repari la armurier, pe bani.
//
//  Podoabele nu se strica: un inel nu se toceste.
// ==========================================================

// Cat tine fiecare slot. Armele si piesele mari se strica mai
// repede, fiindca ele iau lovitura.
const DURABILITATE_SLOT = {
  cap: 55, umeri: 60, spate: 40, piept: 80, incheieturi: 45,
  maini: 50, brau: 45, picioare: 75, talpi: 55,
  armaPrincipala: 70, armaSecundara: 80
};

function durabilitateaSlotului(idSlot, nivel) {
  const baza = DURABILITATE_SLOT[idSlot] || 50;
  // Lucrurile de nivel mare tin mai mult, dar nu mult mai mult:
  // vrem ca reparatul sa ramana o cheltuiala, la orice nivel.
  return Math.round(baza * (1 + nivel / 90));
}


function esteStricat(obiect) {
  return obiect && obiect.durabilitateMaxima > 0 && obiect.durabilitate <= 0;
}


// Cat costa sa repari un lucru, dupa cat de stricat e si cat e de bun.
function costulReparatiei(obiect) {
  if (!obiect || !obiect.durabilitateMaxima) return 0;
  const lipsa = obiect.durabilitateMaxima - obiect.durabilitate;
  if (lipsa <= 0) return 0;
  const peLovitura = 1 + (obiect.nivel || 1) * 0.5 *
                     (gasesteRaritate(obiect.raritate).putere);
  return Math.max(1, Math.round(lipsa * peLovitura));
}


// Toate lucrurile pe care le porti si care se pot repara.
function ceAiDeReparat(personajul) {
  const lista = [];
  const echipate = personajul.echipament || {};
  Object.keys(echipate).forEach(function (sl) {
    const o = echipate[sl];
    if (o && o.durabilitateMaxima > 0 && o.durabilitate < o.durabilitateMaxima) {
      lista.push(o);
    }
  });
  (personajul.inventar || []).forEach(function (o) {
    if (o && o.durabilitateMaxima > 0 && o.durabilitate < o.durabilitateMaxima) {
      lista.push(o);
    }
  });
  return lista;
}


function costulReparatiilorTuturor(personajul) {
  return ceAiDeReparat(personajul).reduce(function (t, o) {
    return t + costulReparatiei(o);
  }, 0);
}


function reparaTot(personajul) {
  const cost = costulReparatiilorTuturor(personajul);
  if (cost <= 0) return { nimic: true };
  if ((personajul.bani || 0) < cost) return { faraBani: true, cost: cost };
  personajul.bani -= cost;
  ceAiDeReparat(personajul).forEach(function (o) {
    o.durabilitate = o.durabilitateMaxima;
  });
  return { cost: cost };
}


// Toceste un lucru. Intoarce true daca tocmai s-a stricat de tot.
function toceste(obiect, cat) {
  if (!obiect || !obiect.durabilitateMaxima) return false;
  if (obiect.durabilitate <= 0) return false;
  obiect.durabilitate = Math.max(0, obiect.durabilitate - (cat || 1));
  return obiect.durabilitate <= 0;
}


// Alege unul la intamplare dintr-o lista.
function unulDin(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}


// Ce clasa de armura are piesa asta? Nu e la intamplare de tot:
// la nivel mic lumea poarta panza si piele, mai incolo apar zalele
// si placile - la fel ca in Classic, unde armura grea vine tarziu.
function claseleDeLaNivel(nivel) {
  if (nivel < 10) return ['panza', 'piele'];
  if (nivel < 25) return ['panza', 'piele', 'piele', 'zale'];
  if (nivel < 40) return ['panza', 'piele', 'zale', 'zale', 'placi'];
  return ['panza', 'piele', 'zale', 'placi', 'placi'];
}


// Numele piesei si clasa ei de armura, pentru un slot.
function piesaPentru(idSlot, nivel) {

  if (PIESE_SIMPLE[idSlot]) {
    return { nume: unulDin(PIESE_SIMPLE[idSlot]), felArmura: null };
  }

  if (PIESE[idSlot]) {
    const fel = unulDin(claseleDeLaNivel(nivel));
    return { nume: unulDin(PIESE[idSlot][fel]), felArmura: fel };
  }

  return { nume: 'Trinket', felArmura: null };
}


// Face un obiect nou pentru slotul dat.
//  optiuni (toate pot lipsi):
//    felArmura - 'panza' | 'piele' | 'zale' | 'placi'
//    felArma   - 'sabie' | 'topor' | ...
//    zona      - numele zonei, pentru lucrurile gasite acolo
function faObiect(idSlot, nivel, idRaritate, optiuni) {

  const slot = gasesteSlot(idSlot);
  if (!slot) return null;
  const cerut = optiuni || {};

  const raritate = gasesteRaritate(idRaritate);
  const marime = MARIME_SLOT[idSlot] || 0.8;
  const treapta = treaptaMaterialului(nivel);
  const coada = unulDin(COZI);
  const adjectiv = unulDin(raritate.adjective);

  // Cat de tare e obiectul, in mare: creste cu nivelul.
  const putere = (1 + nivel * 0.55) * raritate.putere * marime;

  const statistici = {};
  statistici[coada.atribut] = Math.max(1, Math.round(putere * 0.7));

  // Un al doilea atribut, mai mic, ales la intamplare.
  const altul = unulDin(COZI).atribut;
  if (altul !== coada.atribut) {
    statistici[altul] = Math.max(1, Math.round(putere * 0.35));
  }

  // ---- ce fel de lucru e, si cum se cheama ----
  let felArmura = null;
  let felArma = null;
  let numePiesa;

  if (idSlot === 'armaPrincipala') {
    felArma = cerut.felArma
      ? (FELURI_ARMA.find(function (f) { return f.id === cerut.felArma; }) || unulDin(FELURI_ARMA))
      : unulDin(FELURI_ARMA);
    numePiesa = unulDin(felArma.nume);

  } else if (idSlot === 'armaSecundara') {
    numePiesa = unulDin(PIESE_SCUT);
    felArmura = (nivel < 20) ? 'piele' : (nivel < 40 ? 'zale' : 'placi');

  } else if (cerut.felArmura && PIESE[idSlot] && PIESE[idSlot][cerut.felArmura]) {
    felArmura = cerut.felArmura;
    numePiesa = unulDin(PIESE[idSlot][felArmura]);

  } else {
    const p = piesaPentru(idSlot, nivel);
    numePiesa = p.nume;
    felArmura = p.felArmura;
  }

  // ---- armura ----
  // Acum conteaza si din ce e facuta: panza tine mai putin decat
  // placile. Pana acum toate sloturile dadeau la fel.
  let armura = 0;
  if (DA_ARMURA.includes(idSlot)) {
    const cat = felArmura ? FELURI_ARMURA[felArmura].cataArmura : 0.7;
    armura = Math.max(1, Math.round(putere * 2.2 * cat));
  }

  // ---- arma ----
  //
  // Fiecare fel de arma are viteza lui. Un pumnal loveste des si
  // marunt, un toiag rar si tare - dar amandoua scot cam acelasi
  // damage pe secunda, ca sa nu fie unul mereu mai bun.
  let arma = null;
  if (felArma) {
    const mediu = (1 + nivel * 0.9) * raritate.putere * felArma.dmg;
    const dmgMin = Math.max(2, Math.round(mediu));
    arma = {
      dmgMin: dmgMin,
      dmgMax: Math.round(dmgMin * 1.6),
      viteza: felArma.viteza,
      fel: felArma.id,
      nume: numePiesa
    };
  }

  // ---- numele intreg ----
  //
  // Cuvantul materialului intra in nume doar din cand in cand. Pus
  // mereu, "Dull" ar aparea pe toate obiectele de sub nivelul 10 si
  // ar obosi; pus niciodata, treptele nu s-ar vedea.
  //
  // Un lucru din patru luat dintr-o zona ii poarta numele. Asa prada
  // dintr-un loc se simte ca vine de acolo: dupa o zi in Thornmoor
  // ai in rucsac lucruri care scriu Thornmoor pe ele.
  const cuZona = cerut.zona && Math.random() < 0.25;
  const cuMaterial = !cuZona && Math.random() < 0.45;

  const inceput = cuZona     ? (cerut.zona + ' ' + numePiesa)
                : cuMaterial ? (treapta.nume + ' ' + numePiesa)
                             : (adjectiv + ' ' + numePiesa);

  // Cateva nume de piesa au deja un "of" in ele - "Coat of Rings".
  // Lipita peste, coada iesea "Coat of Rings of the Falcon", care
  // suna a greseala. Alea raman fara coada; statisticile nu se
  // schimba, doar numele e mai scurt.
  const areDejaOf = numePiesa.indexOf(' of ') >= 0;
  const numeIntreg = areDejaOf ? inceput : (inceput + ' ' + coada.text);

  // ---- durabilitatea ----
  //
  // Ca in Classic: armele si armura se strica de la folosit si de la
  // moarte, si se repara pe bani la armurier. Podoabele - lant,
  // inele, talisman - NU se strica: nu le folosesti cu nimic.
  const arePiele = (idSlot !== 'gat' && idSlot !== 'inel1' &&
                    idSlot !== 'inel2' && idSlot !== 'talisman');
  const durMax = arePiele ? durabilitateaSlotului(idSlot, nivel) : 0;

  return {
    id: urmatorulIdObiect++,
    slot: idSlot,
    nume: numeIntreg,
    durabilitate: durMax,
    durabilitateMaxima: durMax,
    nivel: nivel,
    nivelCerut: nivel,    // de la ce nivel il poti pune pe tine
    raritate: raritate.id,
    culoare: raritate.culoare,
    // ATENTIE la nume: campul 'material' inseamna deja ALTCEVA in
    // joc - "asta e material de meserie, nu-l arunca". Daca puneam
    // treapta tot acolo, fiecare platosa ar fi scris "Trade goods"
    // sub ea. De asta se cheama 'treapta'.
    treapta: treapta.nume,      // pentru desen si pentru fisa
    felArmura: felArmura,       // 'panza' | 'piele' | 'zale' | 'placi' | null
    statistici: statistici,
    armura: armura,
    arma: arma
  };
}


// Alege o raritate la intamplare, dupa sansele de mai sus.
function raritateLaIntamplare() {
  let total = 0;
  RARITATI.forEach(function (r) { total += r.sansa; });

  let n = Math.random() * total;
  for (const r of RARITATI) {
    n -= r.sansa;
    if (n <= 0) return r.id;
  }
  return RARITATI[0].id;
}


// ==========================================================
//  CE LASA IN URMA UN INAMIC
//
//  Cum e in WoW Classic, si cum NU era la noi pana acum:
//
//    - VECHITURILE (gri) cad foarte des, peste jumatate din
//      inamici. Nu se pot purta, sunt doar de vandut - si sunt
//      principala sursa de bani.
//    - Obiectele PURTABILE cad rar. Un verde (Uncommon) e o mica
//      sarbatoare, un albastru (Rare) e o zi buna.
//
//  Inainte aveam 35% sanse de obiect purtabil si zero vechituri.
//  De aceea se umplea rucsacul in zece minute si nimic nu se
//  simtea ca o gasire.
//
//  Sansele cresc putin cu nivelul inamicului: la nivel 1 aproape
//  tot ce cade e alb, pe la 60 incep sa apara si albastrele.
// ==========================================================

function sansaDeObiect(nivelMob) {
  return 5 + Math.min(nivelMob, 30) * 0.23;      // 5,2% la nivel 1 -> ~12% la 30+
}

// Cat de des cade fiecare raritate, la un anumit nivel de inamic.
function sanseleRaritatilor(nivelMob) {
  const n = Math.min(nivelMob, 60);
  return {
    comun:    78 - n * 0.40,
    bun:      20 + n * 0.30,
    rar:     1.8 + n * 0.08,
    maiestru: 0.2 + n * 0.02
  };
}

function raritateDupaNivel(nivelMob) {
  const sanse = sanseleRaritatilor(nivelMob);
  let total = 0;
  Object.keys(sanse).forEach(function (id) { total += sanse[id]; });

  let n = Math.random() * total;
  for (const id of Object.keys(sanse)) {
    n -= sanse[id];
    if (n <= 0) return id;
  }
  return 'comun';
}

//  Ce lasa un inamic anume, dupa profilul lui din mobi.js.
//
//  Pana acum orice inamic putea lasa orice: un sobolan de camp
//  scapa din el o platosa de placi. Acum un talhar lasa ce poarta
//  un talhar - panza, piele, pumnale - iar o fiara nu lasa armura
//  deloc: doar ce s-o fi gasit prin vizuina, un inel sau un lant.
//
//  Sloturile purtate, pentru cine chiar poarta haine.
const SLOTURI_PURTATE = ['cap', 'umeri', 'piept', 'incheieturi', 'maini',
                         'brau', 'picioare', 'talpi'];

// Din cate lucruri care pica, cate sunt piese de set. Una din opt:
// destul de rara cat sa insemne ceva, destul de deasa cat sa aduni
// un set intreg intr-o zona, nu in trei.
const SANSA_PIESA_DE_SET = 0.12;

function obiectDeLaMob(nivelMob, profil, numeZona, felMob) {

  const p = profil || {};
  const catDes = (typeof p.catDes === 'number') ? p.catDes : 1;
  if (Math.random() * 100 >= sansaDeObiect(nivelMob) * catDes) return null;

  const nivel = Math.max(1, nivelMob);
  const raritate = raritateDupaNivel(nivelMob);
  const optiuni = { zona: numeZona };

  // Are arme? Atunci uneori cade una din ale lui.
  const arme = p.arme || [];
  if (arme.length > 0 && Math.random() < 0.22) {
    optiuni.felArma = arme[Math.floor(Math.random() * arme.length)];
    return faObiect('armaPrincipala', nivel, raritate, optiuni);
  }

  // Din cand in cand, in loc de un lucru obisnuit, cade o piesa de
  // set - dar numai de la inamicii care au setul ala, si numai in
  // jurul nivelului lui.
  if (typeof seturileDeLa === 'function' && felMob) {
    const ale = seturileDeLa(felMob, nivelMob);
    if (ale.length > 0 && Math.random() < SANSA_PIESA_DE_SET) {
      const set = ale[Math.floor(Math.random() * ale.length)];
      const slot = SLOTURI_DE_SET[Math.floor(Math.random() * SLOTURI_DE_SET.length)];
      const piesa = faPiesaDeSet(set, slot);
      if (piesa) return piesa;
    }
  }

  // Poarta haine? Atunci cade o piesa de-a lui, din ce poarta el.
  if (p.poarta) {
    const armuri = p.armuri || CLASE_ARMURA;
    optiuni.felArmura = armuri[Math.floor(Math.random() * armuri.length)];
    const slot = SLOTURI_PURTATE[Math.floor(Math.random() * SLOTURI_PURTATE.length)];
    return faObiect(slot, nivel, raritate, optiuni);
  }

  // Fiara: doar ce s-a nimerit sa fie prin vizuina.
  const sloturi = p.sloturi || ['gat', 'inel1', 'talisman', 'spate'];
  const slot = sloturi[Math.floor(Math.random() * sloturi.length)];
  return faObiect(slot, nivel, raritate, optiuni);
}


// ----------------------------------------------------------
//  VECHITURILE
//
//  Gri, fara statistici, bune doar de vandut. Fiecare fel de
//  inamic lasa altceva - un lup lasa colti, un bandit lasa
//  catarame - iar lucrurile la fel se aduna intr-o singura
//  gramada in rucsac, ca sa nu-ti ocupe zece locuri.
// ----------------------------------------------------------
const SANSA_VECHITURA = 55;        // din 100
const CULOARE_VECHITURA = '#9d9d9d';
const CULOARE_MATERIAL  = '#6fa8c0';   // materialele de meserie, albastrui
const CULOARE_CONSUMABIL = '#7ad07a';  // ce se bea sau se mananca, verzui
const CULOARE_UNEALTA   = '#c8b27a';   // uneltele de meserie, auriu stins
const CULOARE_RETETA    = '#d0a0d8';   // foile de reteta, liliachiu
const MAXIM_PE_GRAMADA = 20;

function vechituraDeLaMob(nivelMob, felulMobului) {

  if (Math.random() * 100 >= SANSA_VECHITURA) return null;

  const fel = (typeof MOBI !== 'undefined') ? MOBI[felulMobului] : null;
  const lista = (fel && fel.vechituri) ? fel.vechituri : ['Worn Scrap'];
  const nume = lista[Math.floor(Math.random() * lista.length)];
  const nivel = Math.max(1, nivelMob);

  return {
    id: urmatorulIdObiect++,
    vechitura: true,
    nume: nume,
    nivel: nivel,
    culoare: CULOARE_VECHITURA,
    cate: 1,
    valoare: Math.max(1, Math.round(nivel * 1.8 + 2))
  };
}


// Un material de meserie: minereu, planta, piele. Se poarta ca o
// vechitura - se aduna in gramada si se vinde - dar are culoarea
// lui, ca sa nu-l arunci din greseala cu "Drop all junk".
function faMaterial(nume, valoare) {
  return {
    id: urmatorulIdObiect++,
    vechitura: true,          // ca sa mearga gramezile si vanzarea
    material: true,           // dar NU e gunoi: nu se arunca la gramada
    nume: nume,
    nivel: 1,
    culoare: CULOARE_MATERIAL,
    cate: 1,
    valoare: Math.max(1, valoare)
  };
}


// O unealta de meserie: tarnacop, cutit de jupuit, undita. Nu se
// echipeaza si nu se foloseste - e destul s-o ai in rucsac. Poarta
// 'material: true' ca sa n-o mature butonul care arunca vechiturile:
// ar fi urat sa ramai fara tarnacop dupa o curatenie in rucsac.
function faUnealta(nume, valoare) {
  return {
    id: urmatorulIdObiect++,
    vechitura: true,
    material: true,
    unealta: true,
    nume: nume,
    nivel: 1,
    culoare: CULOARE_UNEALTA,
    cate: 1,
    valoare: Math.max(1, valoare)
  };
}


// O foaie de reteta: o apesi in rucsac si inveti ce scrie pe ea.
// Dupa aceea foaia se face praf, ca in Classic. Cade de la inamici
// si se vinde la negustorul de materiale din oras.
function faFoaieDeReteta(idReteta) {
  const r = gasesteReteta(idReteta);
  if (!r) return null;
  return {
    id: urmatorulIdObiect++,
    vechitura: true,
    material: true,            // nu se arunca la gramada cu gunoiul
    retetaDe: idReteta,
    nume: TEXT.RECIPE_ITEM.replace('{r}', r.nume),
    nivel: 1,
    culoare: CULOARE_RETETA,
    cate: 1,
    valoare: Math.max(2, Math.round(costulRetetei(r) / 2))
  };
}


// Un consumabil: se apasa in rucsac si se foloseste. Ce face scrie
// in reteta din care a iesit.
function faConsumabil(ce) {
  return {
    id: urmatorulIdObiect++,
    vechitura: true,          // se aduna in gramada
    material: true,           // nu e gunoi
    consumabil: ce,           // ce se intampla cand il folosesti
    nume: ce.nume,
    nivel: 1,
    culoare: CULOARE_CONSUMABIL,
    cate: 1,
    valoare: Math.max(1, ce.valoare || 1)
  };
}


// ==========================================================
//  CU CE PLECI DE ACASA
//
//  Pana acum un personaj nou pornea gol de tot: fara arma, fara
//  haine, cu rucsacul gol. Nu asa incepe nimeni. In Classic
//  primesti o arma potrivita clasei, doua haine simple si ceva de
//  mancare - atat cat sa ai cu ce da prima lovitura.
//
//  Lucrurile astea sunt COMUNE si de nivelul 1. Nu-ti dau un
//  avans: le arunci dupa o ora de joc. Numele lor sunt scrise de
//  mana, nu iesite din tabelele de sus, tocmai ca sa se vada ca
//  sunt lucrurile cu care ai plecat de acasa, nu prada.
//
//  Fiecare clasa are UN singur atribut pe piese, cel care conteaza
//  pentru ea. La nivelul 1 e vorba de un punct - e un semn, nu o
//  cifra care schimba ceva.
// ==========================================================

// ATENTIE la numele de aici. Prima varianta pe care am scris-o suna
// firesc - "Recruit's", "Apprentice's Robe", "Novice's" - tocmai
// fiindca astea SUNT numele lucrurilor de start din Classic. Nu au
// ce cauta in joc. Numele de mai jos sunt ale noastre: satul are o
// oaste de tarani (levy), vanatorul isi face capcane din lemn,
// magul invata la lumina unei lumanari de seu, preotul imparte
// pomeni.
const ECHIPAMENT_DE_START = {

  warrior: {
    atribut: 'str',
    piese: [
      { slot: 'armaPrincipala', felArma: 'sabie',    nume: 'Levy Blade' },
      { slot: 'armaSecundara',                       nume: 'Levy Buckler' },
      { slot: 'piept',          felArmura: 'piele',  nume: 'Levy Jerkin' },
      { slot: 'picioare',       felArmura: 'piele',  nume: 'Levy Breeches' }
    ]
  },

  hunter: {
    atribut: 'agi',
    piese: [
      { slot: 'armaPrincipala', felArma: 'arc',      nume: 'Snarewood Bow' },
      { slot: 'piept',          felArmura: 'piele',  nume: 'Snarewood Vest' },
      { slot: 'picioare',       felArmura: 'piele',  nume: 'Snarewood Leggings' }
    ]
  },

  mage: {
    atribut: 'int',
    piese: [
      { slot: 'armaPrincipala', felArma: 'toiag',    nume: 'Tallowlight Rod' },
      { slot: 'piept',          felArmura: 'panza',  nume: 'Tallowlight Robe' },
      { slot: 'picioare',       felArmura: 'panza',  nume: 'Tallowlight Trousers' }
    ]
  },

  priest: {
    atribut: 'spi',
    piese: [
      { slot: 'armaPrincipala', felArma: 'buzdugan', nume: 'Almsgiver\'s Cudgel' },
      { slot: 'piept',          felArmura: 'panza',  nume: 'Almsgiver\'s Vestment' },
      { slot: 'picioare',       felArmura: 'panza',  nume: 'Almsgiver\'s Trousers' }
    ]
  }
};


// O piesa de start: se face ca orice alt obiect - ca sa nu socotim
// de doua ori aceleasi cifre de armura si de damage - si pe urma i
// se pune numele scris de mana si un singur atribut.
function faPiesaDeStart(def, atribut) {

  const optiuni = def.felArmura ? { felArmura: def.felArmura }
                : def.felArma   ? { felArma:   def.felArma }
                                : undefined;

  const o = faObiect(def.slot, 1, 'comun', optiuni);
  if (!o) return null;

  o.nume = def.nume;
  o.deStart = true;

  // Statisticile iesite din tabel sunt la intamplare. Pe lucrurile
  // de start nu vrem intamplare: doi razboinici nou facuti trebuie
  // sa aiba exact aceleasi haine.
  const st = {};
  st[atribut] = 1;
  o.statistici = st;

  return o;
}


// Painea si apa cu care pleci la drum. Painea o are toata lumea;
// apa doar cine bea mana - unui razboinic nu i-ar folosi la nimic.
function mancareaDeStart(idClasa) {
  const lista = [];

  const paine = faConsumabil({
    // "Refreshing Spring Water" e apa de start din Classic, deci nu
    // folosim nici "Spring Water", nici "Traveller's" pe paine.
    nume: 'Road Loaf', valoare: 2,
    efect: 'vindecare', cat: 40, forma: 'paine',
    descriere: 'Restores 40 health.'
  });
  paine.cate = 4;
  lista.push(paine);

  if (CLASE[idClasa] && CLASE[idClasa].resursa === 'mana') {
    const apa = faConsumabil({
      nume: 'Wellwater Flask', valoare: 2,
      efect: 'mana', cat: 40,
      descriere: 'Restores 40 mana.'
    });
    apa.cate = 4;
    lista.push(apa);
  }

  return lista;
}


// Imbraca un personaj nou. Nu face nimic daca are deja ceva pe el:
// asa poate fi chemata si pentru o salvare veche, facuta inainte sa
// existe lucrurile astea, fara sa strice nimic celor care joaca de
// mult.
function daEchipamentulDeStart(personajul) {

  if (!personajul) return false;
  personajul.echipament = personajul.echipament || {};
  if (Object.keys(personajul.echipament).length > 0) return false;

  const set = ECHIPAMENT_DE_START[personajul.idClasa];
  if (!set) return false;

  const clasa = CLASE[personajul.idClasa];

  set.piese.forEach(function (def) {
    const o = faPiesaDeStart(def, set.atribut);
    if (!o) return;

    // ATENTIE, aici era o capcana. Cifrele iesite din faObiect pentru
    // nivelul 1 sunt MAI MICI decat arma din care porneste clasa:
    // sabia de start dadea 2-3, iar razboinicul fara nimic in mana
    // dadea 3-6. Adica iti dadeam un cadou care te facea mai slab.
    //
    // Asa ca arma de start pleaca de la arma clasei - aceeasi viteza,
    // deci acelasi ritm de lupta - si e cu un punct mai buna. Cat sa
    // se simta ca ai primit ceva, nu cat sa sari peste primele niveluri.
    if (o.arma && clasa) {
      const aClasei = clasa.arme.distanta || clasa.arme.corpLaCorp;
      o.arma.dmgMin = aClasei.dmgMin + 1;
      o.arma.dmgMax = aClasei.dmgMax + 1;
      o.arma.viteza = aClasei.viteza;
    }

    personajul.echipament[def.slot] = o;
  });

  mancareaDeStart(personajul.idClasa).forEach(function (o) {
    pomeneInRucsac(personajul, o);
  });

  // Piatra de intoarcere pleaca la drum cu tine, ca in Classic. Nu e
  // legata de nimic inca: o legi de primul han la care ajungi.
  if (typeof faPiatraDeIntoarcere === 'function') {
    pomeneInRucsac(personajul, faPiatraDeIntoarcere());
  }

  return true;
}


// TOT ce lasa un inamic cand moare: bani si obiecte, la un loc.
// Asta ajunge in trupul lui, de unde iei tu ce vrei - nu mai intra
// singur in inventar, ca in WoW.
function pradaDeLaMob(nivelMob, esteUmanoid, profil, numeZona, felMob) {

  // Un singur obiect purtabil pe inamic, si acela rar. Inainte mai
  // exista o sansa sa cada si al doilea; acum, cu sansele coborate
  // la cat sunt in WoW, doua obiecte de la acelasi mob n-ar avea sens.
  const obiecte = [];
  const unul = obiectDeLaMob(nivelMob, profil, numeZona, felMob);
  if (unul) obiecte.push(unul);

  const foaie = foaieDeLaMob(nivelMob);
  if (foaie) obiecte.push(foaie);

  return {
    bani: baniDeLaMob(nivelMob, esteUmanoid),
    obiecte: obiecte
  };
}


// Sansa ca inamicul sa lase o foaie de reteta. E mica - o foaie la
// vreo optzeci de inamici - fiindca sunt doar paisprezece in tot
// jocul si trebuie sa insemne ceva cand cade una.
const SANSA_FOAIE = 1.2;

function foaieDeLaMob(nivelMob) {

  if (Math.random() * 100 >= SANSA_FOAIE) return null;

  // Un inamic mic nu lasa reteta pe care ai invata-o la skill 240.
  // Inmultitul cu 6 face ca pe la nivelul 40 sa poata cadea oricare.
  const potrivite = RETETE.filter(function (r) {
    return r.sursa === 'obiect' && r.invatataLa <= nivelMob * 6;
  });
  if (potrivite.length === 0) return null;

  const aleasa = potrivite[Math.floor(Math.random() * potrivite.length)];
  return faFoaieDeReteta(aleasa.id);
}


// Acelasi lucru, dar stiind si ce fel de inamic a fost - ca sa
// putem pune si vechitura potrivita in trupul lui.
// Panza pentru croitorie NU se strange din noduri: cade de la
// umanoizi, ca in Classic. Bandit, raider si ceilalti care poarta
// haine au ce sa lase in urma.
const SANSA_PANZA = 38;        // din 100, de la un umanoid

function panzaDeLaUmanoid(nivelMob) {
  if (Math.random() * 100 >= SANSA_PANZA) return null;
  // Panza urca odata cu cel de la care vine: de la un talhar mic
  // iei panza aspra, de la o garda de nivel 60 iei panza de sigilii.
  const p = panzaDeLaNivel(nivelMob || 1);
  return faMaterial(p.nume, p.valoare);
}


function pradaCompleta(nivelMob, esteUmanoid, felulMobului, rang, numeZona, locul) {

  const profil = (MOBI[felulMobului] || {}).prada || null;
  const prada = pradaDeLaMob(nivelMob, esteUmanoid, profil, numeZona, felulMobului);
  const vechitura = vechituraDeLaMob(nivelMob, felulMobului);
  if (vechitura) prada.obiecte.push(vechitura);

  // Panza, numai de la cei care poarta haine.
  if (esteUmanoid) {
    const panza = panzaDeLaUmanoid(nivelMob);
    if (panza) prada.obiecte.push(panza);
  }

  // Seful unei temnite lasa unul din lucrurile LUI, scrise langa el
  // in reteta temnitei. Alea nu pica de nicaieri altundeva.
  if (locul && locul.lasa && locul.lasa.length > 0) {
    const def = locul.lasa[Math.floor(Math.random() * locul.lasa.length)];
    const alLui = faObiectDeSef(def, nivelMob);
    if (alLui) prada.obiecte.push(alLui);
  }

  // Cei rari si cei elit lasa INTOTDEAUNA ceva bun - de aceea ii
  // cauti. Un rar da sigur verde, uneori albastru. Un elit da sigur
  // albastru, si cam unul din patru da mov.
  if (rang === 'rar' || rang === 'elit' || rang === 'sef') {
    const zar = Math.random() * 100;
    let raritate;
    // Seful e unul singur in tot jocul si se omoara o data. Da mov
    // de fiecare data, si inca un lucru pe deasupra: daca ai mers
    // pana la capatul lumii, nu pleci de acolo cu maini goale.
    if (rang === 'sef')       raritate = 'maiestru';
    else if (rang === 'elit') raritate = (zar < 25) ? 'maiestru' : 'rar';
    else                      raritate = (zar < 22) ? 'rar' : 'bun';

    // Un rar sau un elit da piesa de set de trei ori mai des.
    const aleSet = (typeof seturileDeLa === 'function')
      ? seturileDeLa(felulMobului, nivelMob) : [];
    if (aleSet.length > 0 && Math.random() < SANSA_PIESA_DE_SET * 3) {
      const set = aleSet[Math.floor(Math.random() * aleSet.length)];
      const sl = SLOTURI_DE_SET[Math.floor(Math.random() * SLOTURI_DE_SET.length)];
      const piesa = faPiesaDeSet(set, sl);
      if (piesa) prada.obiecte.push(piesa);
    }

    const optiuni = { zona: numeZona };
    let slot;
    if (profil && profil.poarta) {
      optiuni.felArmura = (profil.armuri || CLASE_ARMURA)[
        Math.floor(Math.random() * (profil.armuri || CLASE_ARMURA).length)];
      slot = SLOTURI_PURTATE[Math.floor(Math.random() * SLOTURI_PURTATE.length)];
    } else {
      const ale = (profil && profil.sloturi) || ['gat', 'inel1', 'talisman', 'spate'];
      slot = ale[Math.floor(Math.random() * ale.length)];
    }
    prada.obiecte.push(faObiect(slot, Math.max(1, nivelMob), raritate, optiuni));

    // Seful da inca un lucru, pe alt slot, tot mov.
    if (rang === 'sef') {
      const altSlot = SLOTURI_PURTATE[Math.floor(Math.random() * SLOTURI_PURTATE.length)];
      prada.obiecte.push(faObiect(altSlot, Math.max(1, nivelMob), 'maiestru',
                                  { zona: numeZona }));
    }

    // Si mai multi bani: au fost mai greu de omorat.
    prada.bani = Math.round(prada.bani *
      (rang === 'sef' ? 25 : rang === 'elit' ? 8 : 3));
    if (prada.bani === 0) {
      // Chiar si o fiara rara lasa ceva: ce a inghitit de la altii.
      prada.bani = Math.max(1, Math.round(nivelMob * nivelMob * 0.6 *
                                          (rang === 'elit' ? 4 : 1.5)));
    }
  }

  return prada;
}


// Are ceva de luat, sau e un trup gol?
function pradaAreCeva(prada) {

  if (!prada) return false;

  // O fiara pe care inca n-ai jupuit-o are ceva de dat, chiar daca
  // nu i-a cazut nici ban, nici obiect.
  if (prada.deJupuit) return true;

  const deMisiune = (prada.obiecteMisiune || []).length;
  return prada.bani > 0 || prada.obiecte.length > 0 || deMisiune > 0;
}


// ==========================================================
//  RUCSACUL
//
//  Nu mai incape orice, oricat. Rucsacul are un numar de locuri,
//  ca in WoW, si cand se umple nu mai poti lua nimic de pe jos.
// ==========================================================
const LOCURI_IN_RUCSAC = 20;

function locuriLibere(personajul) {
  return LOCURI_IN_RUCSAC - (personajul.inventar || []).length;
}

function maiEsteLocInRucsac(personajul) {
  return locuriLibere(personajul) > 0;
}

// Pune un obiect in rucsac. Da inapoi false daca nu mai e loc.
//
// Vechiturile la fel se aduna intr-o gramada, pana la 20 bucati.
// Fara asta, cincizeci de colti de lup ar umple rucsacul de doua ori.
function pomeneInRucsac(personajul, obiect) {

  personajul.inventar = personajul.inventar || [];

  if (obiect.vechitura) {
    const gramada = personajul.inventar.find(function (o) {
      return o.vechitura && o.nume === obiect.nume && o.cate < MAXIM_PE_GRAMADA;
    });
    if (gramada) {
      gramada.cate += (obiect.cate || 1);
      return true;
    }
  }

  if (!maiEsteLocInRucsac(personajul)) return false;
  personajul.inventar.push(obiect);
  return true;
}


// Arunca un obiect din rucsac. Se duce de tot - nu se poate lua
// inapoi, la fel ca in WoW. De-aia jocul intreaba inainte.
//
// Da inapoi obiectul aruncat, ca sa putem scrie pe ecran ce a fost.
function aruncaDinRucsac(personajul, idObiect) {

  const inventar = personajul.inventar || [];
  const unde = inventar.findIndex(function (o) { return o.id === idObiect; });
  if (unde < 0) return null;

  return inventar.splice(unde, 1)[0];
}


// Arunca toate vechiturile deodata. Cand ti se umple rucsacul
// departe de un negustor, asta e butonul care te scoate din impas.
function aruncaVechiturile(personajul) {

  const inventar = personajul.inventar || [];
  let cate = 0;

  for (let i = inventar.length - 1; i >= 0; i--) {
    if (!inventar[i].vechitura) continue;
    if (inventar[i].material) continue;   // materialele nu sunt gunoi
    cate += (inventar[i].cate || 1);
    inventar.splice(i, 1);
  }
  return cate;
}


// ==========================================================
//  ECHIPAREA
// ==========================================================

// Ce da, la un loc, tot ce ai pe tine.
function bonusEchipament(personajul) {
  const total = { str: 0, agi: 0, sta: 0, int: 0, spi: 0, armura: 0 };
  const echipate = personajul.echipament || {};

  Object.keys(echipate).forEach(function (idSlot) {
    const obiect = echipate[idSlot];
    if (!obiect) return;
    // Un lucru stricat de tot ramane pe tine, dar nu mai da nimic.
    if (esteStricat(obiect)) return;
    Object.keys(obiect.statistici).forEach(function (a) {
      total[a] = (total[a] || 0) + obiect.statistici[a];
    });
    total.armura += obiect.armura;
  });

  // Peste ce dau piesele in sine vine ce dau seturile: daca ai doua,
  // patru sau sase piese din aceeasi familie, primesti ceva in plus.
  if (typeof bonusDeSet === 'function') {
    const dinSet = bonusDeSet(personajul);
    Object.keys(dinSet).forEach(function (k) {
      total[k] = (total[k] || 0) + dinSet[k];
    });
  }

  return total;
}


// Pui un obiect pe tine. Ce aveai in slotul ala se intoarce in
// inventar. Da inapoi true daca a mers.
// Esti destul de mare ca sa porti obiectul asta?
function nivelulCerut(obiect) {
  return obiect.nivelCerut || obiect.nivel || 1;
}

function poateFiEchipat(personajul, obiect) {
  if (obiect.vechitura) return false;      // o vechitura nu se poarta
  return personajul.nivel >= nivelulCerut(obiect);
}


function echipeaza(personajul, idObiect) {

  personajul.inventar = personajul.inventar || [];
  personajul.echipament = personajul.echipament || {};

  const locInInventar = personajul.inventar.findIndex(function (o) { return o.id === idObiect; });
  if (locInInventar < 0) return false;

  const obiect = personajul.inventar[locInInventar];

  // O vechitura sau ceva peste nivelul tau: ramane in rucsac.
  if (!poateFiEchipat(personajul, obiect)) return false;
  const vechi = personajul.echipament[obiect.slot] || null;

  personajul.inventar.splice(locInInventar, 1);
  personajul.echipament[obiect.slot] = obiect;
  if (vechi) personajul.inventar.push(vechi);

  return true;
}


// Scoti obiectul dintr-un slot si il pui inapoi in inventar.
function dezechipeaza(personajul, idSlot) {
  personajul.echipament = personajul.echipament || {};
  const obiect = personajul.echipament[idSlot];
  if (!obiect) return false;

  personajul.inventar = personajul.inventar || [];
  personajul.inventar.push(obiect);
  personajul.echipament[idSlot] = null;
  return true;
}


// Textul scurt cu ce da un obiect: "+7 Strength, +3 Stamina, +18 Armor"
const NUME_ATRIBUT = { str: 'Strength', agi: 'Agility', sta: 'Stamina',
                       int: 'Intellect', spi: 'Spirit' };

function descriereObiect(obiect) {
  // Un tarnacop nu e gunoi, si nici un minereu. Pana acum toate
  // trei scriau 'Junk', fiindca merg pe acelasi drum al gramezilor.
  if (obiect.retetaDe) return TEXT.ITEM_RECIPE;
  if (obiect.unealta) return TEXT.ITEM_TOOL;
  if (obiect.consumabil) return TEXT.USE;
  if (obiect.material) return TEXT.ITEM_TRADE;
  if (obiect.vechitura) return TEXT.ITEM_JUNK;
  const bucati = [];
  if (obiect.arma) bucati.push(obiect.arma.dmgMin + '-' + obiect.arma.dmgMax + ' dmg');
  Object.keys(obiect.statistici).forEach(function (a) {
    bucati.push('+' + obiect.statistici[a] + ' ' + NUME_ATRIBUT[a]);
  });
  if (obiect.armura > 0) bucati.push('+' + obiect.armura + ' Armor');
  return bucati.join(', ');
}
