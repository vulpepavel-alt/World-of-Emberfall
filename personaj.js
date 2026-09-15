// ==========================================================
//  PERSONAJUL - rase, clase si calculul statisticilor
// ==========================================================
//
//  Statisticile se calculeaza in doua straturi:
//
//     statistici finale = statistici de baza ale RASEI
//                       + modificatori de CLASA
//
//  Ca sa adaugi o rasa noua, copiaza un bloc de mai jos si
//  completeaza cinci numere si doua pasive. Nimic altceva.
//  Ca sa adaugi o clasa noua, la fel: modificatorii, arma
//  de start, pasiva si abilitatea.
// ==========================================================


// ---------- INFATISAREA ----------
// Stilurile sunt aceleasi pentru toate rasele; doar CULORILE
// difera de la o rasa la alta (vezi "optiuni" la fiecare rasa).
//   id   - dupa el stie codul ce sa deseneze
//   nume - ce scrie pe ecran (textul sta in texte.js)

const STILURI_PAR = [
  { id: 'scurt', nume: TEXT.HAIR_SHORT },
  { id: 'lung',  nume: TEXT.HAIR_LONG  },
  { id: 'tepi',  nume: TEXT.HAIR_SPIKY },
  { id: 'chel',  nume: TEXT.HAIR_BALD  }
];

const STILURI_FATA = [
  { id: 'rotunda', nume: TEXT.FACE_ROUND  },
  { id: 'ingusta', nume: TEXT.FACE_NARROW },
  { id: 'lata',    nume: TEXT.FACE_WIDE   }
];

const STILURI_BARBA = [
  { id: 'fara',    nume: TEXT.BEARD_NONE      },
  { id: 'mustata', nume: TEXT.BEARD_MOUSTACHE },
  { id: 'barba',   nume: TEXT.BEARD_FULL      }
];


// ---------- CELE 4 RASE ----------
// baza = Strength / Agility / Stamina / Intellect / Spirit
// Factiunea este deocamdata doar o eticheta, nu are efect in joc.
// Cele doua pasive ale fiecarei rase functioneaza in joc.

const RASE = {

  human: {
    nume: 'Human',
    factiune: 'Concord',
    baza: { str: 20, agi: 20, sta: 20, int: 20, spi: 20 },
    optiuni: {
      piele: ['#f0c9a6', '#e3b78f', '#cf9a69', '#b07d57', '#8d5f3f'],
      par:   ['#3d2b1c', '#1b1512', '#7a4a24', '#caa96b', '#8d8d95']
    },
    nume_exemplu: ['Aldric', 'Elena', 'Marcus', 'Isolde', 'Roland', 'Brianna'],
    pasive: [
      { nume: 'Stubborn Heart',  descriere: '+5% Spirit, rounded down' },
      { nume: 'Drilled Hand',   descriere: '+3% chance to hit' }
    ]
  },

  nightelf: {
    nume: 'Duskborn',
    factiune: 'Concord',
    baza: { str: 18, agi: 24, sta: 19, int: 20, spi: 20 },
    optiuni: {
      piele: ['#9d7fd8', '#8f6fce', '#b192e6', '#7d5fb8', '#c7aef0'],
      par:   ['#2f7f76', '#1f5f58', '#4aa89c', '#6f4fa8', '#d8dce8']
    },
    nume_exemplu: ['Shaeya', 'Talyndris', 'Ilyana', 'Kaelen', 'Nyssara', 'Faerin'],
    pasive: [
      { nume: 'Slip Aside',  descriere: '+5% chance to fully dodge an incoming hit' },
      { nume: 'Go Unseen', descriere: 'Stand still for 2 seconds: mobs lose track of you and you leave combat' }
    ]
  },

  orc: {
    nume: 'Orc',
    factiune: 'Pact',
    baza: { str: 23, agi: 18, sta: 22, int: 18, spi: 22 },
    optiuni: {
      piele: ['#5f9e63', '#4e8552', '#6faf72', '#3f6d45', '#84bd84'],
      par:   ['#24331f', '#131a10', '#4a3a22', '#6b6b60', '#8f2f2f']
    },
    nume_exemplu: ['Grokar', 'Murgash', 'Uzrek', 'Kagra', 'Thruk', 'Zolga'],
    pasive: [
      { nume: 'Red Surge', descriere: '+50% Attack Power for 15 seconds, once every 2 minutes' },
      { nume: 'Thick Bone',  descriere: 'Takes 15% less damage from critical hits' }
    ]
  },

  undead: {
    nume: 'Undead',
    factiune: 'Pact',
    baza: { str: 20, agi: 19, sta: 21, int: 19, spi: 24 },
    optiuni: {
      piele: ['#adc0bb', '#98aca7', '#c3d2cd', '#8195a0', '#6f8188'],
      par:   ['#3a3a44', '#1c1c22', '#5c4a3a', '#8a2f3a', '#c9c9d2']
    },
    nume_exemplu: ['Mordris', 'Nezra', 'Ossian', 'Valka', 'Cryven', 'Gwynn'],
    pasive: [
      { nume: 'Grave Feast',        descriere: 'After killing a mob, recovers 30% of maximum health over 10 seconds' },
      { nume: 'Unquiet Flesh', descriere: 'Regenerates 1% of maximum health per second, even in combat' }
    ]
  }
};


// ---------- CELE 4 CLASE ----------
// modificatori = cat se ADUNA peste statisticile rasei
// apPerStr     = cat Attack Power da fiecare punct de Strength
// apPerAgi     = cat Attack Power da fiecare punct de Agility
//                (doar pentru atacul la distanta; 0 daca clasa nu trage)
// resursa      = 'mana' sau 'furie'
//
// Fiecare abilitate isi are TOATE cifrele scrise langa ea:
//   fel        - 'lovitura' (cu arma), 'sageata', 'vraja', 'vindecare'
//   costMana / costRage - cat te costa
//   pauza      - cate milisecunde pana o poti folosi din nou
//   incantare  - cat dureaza pregatirea ei (0 = instant)
//   inmultit   - de cate ori mai mult damage decat o lovitura normala
//   dmgMin/dmgMax sau vindecaMin/vindecaMax - pentru vraji si vindecari

const CLASE = {

  warrior: {
    nume: 'Warrior',
    culoare: '#a04747',
    modificatori: { str: 3, sta: 2 },
    // Cat creste fiecare statistica LA FIECARE NIVEL.
    // Numere alese de mine - le poti regla oricand.
    crestere: { str: 1.2, agi: 0.6, sta: 1.2, int: 0.2, spi: 0.4 },
    resursa: 'furie',
    apPerStr: 2,
    apPerAgi: 0,
    vrajaPerInt: 0,
    arme: {
      corpLaCorp: { nume: 'Sword', dmgMin: 3, dmgMax: 6, viteza: 2.0 }
    },
    pasiva: {
      nume: 'Battle Fury',
      descriere: 'Generates up to 50% more rage while below 30% health'
    },
    abilitati: [
      {
        id: 'warrior_strike_01',
        nume: 'Heavy Strike',
        descriere: 'Costs 25 rage. Lands a hit for double damage',
        costRage: 25, costMana: 0, pauza: 0, incantare: 0,
        fel: 'lovitura', inmultit: 2
      }
    ]
  },

  hunter: {
    nume: 'Hunter',
    culoare: '#4e8f6a',
    modificatori: { agi: 3, sta: 1, spi: 1 },
    // Cat creste fiecare statistica LA FIECARE NIVEL.
    // Numere alese de mine - le poti regla oricand.
    crestere: { str: 0.5, agi: 1.3, sta: 0.9, int: 0.4, spi: 0.6 },
    resursa: 'mana',
    apPerStr: 1,
    apPerAgi: 2,
    vrajaPerInt: 0,
    // Hunter lupta DOAR cu arcul. Pumnalul a fost scos: nu-l mai
    // foloseste nicaieri, deci n-are ce cauta scris in meniu.
    arme: {
      distanta: { nume: 'Bow', dmgMin: 3, dmgMax: 5, viteza: 2.4 }
    },
    pasiva: {
      nume: 'Hunter\'s Eye',
      descriere: 'For the first 3 seconds of combat, ranged damage is increased by 25%'
    },
    abilitati: [
      {
        id: 'hunter_shot_01',
        nume: 'Drawn Shot',
        descriere: 'Costs 25 mana, 6 second cooldown. A charged arrow for double damage',
        costRage: 0, costMana: 25, pauza: 6000, incantare: 0,
        fel: 'sageata', inmultit: 2
      }
    ]
  },

  mage: {
    nume: 'Mage',
    culoare: '#4a6fd6',
    modificatori: { int: 3, spi: 2 },
    // Cat creste fiecare statistica LA FIECARE NIVEL.
    // Numere alese de mine - le poti regla oricand.
    crestere: { str: 0.3, agi: 0.5, sta: 0.7, int: 1.4, spi: 0.9 },
    resursa: 'mana',
    apPerStr: 1,
    apPerAgi: 0,
    vrajaPerInt: 1.2,
    arme: {
      corpLaCorp: { nume: 'Staff', dmgMin: 2, dmgMax: 4, viteza: 2.6 }
    },
    pasiva: {
      nume: 'Arcane Barrier',
      descriere: 'At the start of every fight gains a shield that absorbs 15 damage; it refreshes out of combat'
    },
    abilitati: [
      {
        id: 'mage_bolt_01',
        nume: 'Arcane Bolt',
        descriere: 'Costs 20 mana, 3 second cooldown, 1.5 second cast. Deals 8-12 damage',
        costRage: 0, costMana: 20, pauza: 3000, incantare: 1500,
        fel: 'vraja', dmgMin: 8, dmgMax: 12, raza: 200, culoare: 0x2f6fd0
      }
    ]
  },

  priest: {
    nume: 'Priest',
    culoare: '#e2e6f0',
    modificatori: { int: 2, spi: 3 },
    // Cat creste fiecare statistica LA FIECARE NIVEL.
    // Numere alese de mine - le poti regla oricand.
    crestere: { str: 0.3, agi: 0.4, sta: 0.7, int: 1.2, spi: 1.2 },
    resursa: 'mana',
    apPerStr: 1,
    apPerAgi: 0,
    vrajaPerInt: 0.3,
    arme: {
      corpLaCorp: { nume: 'Staff', dmgMin: 2, dmgMax: 4, viteza: 2.4 }
    },
    pasiva: {
      nume: 'Inner Will',
      descriere: 'Regenerates 2 mana per second even in combat'
    },
    abilitati: [
      {
        id: 'priest_holyspark_01',
        nume: 'Holy Spark',
        descriere: 'Costs 18 mana, 2.5 second cooldown. Deals 6-10 damage',
        costRage: 0, costMana: 18, pauza: 2500, incantare: 0,
        fel: 'vraja', dmgMin: 6, dmgMax: 10, raza: 200, culoare: 0xe8c15a
      },
      {
        id: 'priest_heal_01',
        nume: 'Mend Wounds',
        descriere: 'Costs 25 mana, 6 second cooldown. Heals 15-20 health',
        costRage: 0, costMana: 25, pauza: 6000, incantare: 0,
        fel: 'vindecare', vindecaMin: 15, vindecaMax: 20
      }
    ]
  }
};


// ==========================================================
//  EXPERIENTA SI NIVELURILE
//
//  Nivel maxim 60, ca in WoW Classic. Primul punct de talent la
//  nivelul 10, apoi cate unul la fiecare nivel: 51 de puncte la 60.
//
//  Curba de experienta e a noastra, nu a Blizzard - creste lin.
//  Daca ti se pare prea lenta sau prea rapida, schimba cele doua
//  numere de mai jos si se schimba tot tabelul.
// ==========================================================

const NIVEL_MAXIM = 60;
const NIVEL_PRIMUL_TALENT = 10;

// Curba de experienta.
//
// Inainte cifrele erau altele si se urca mult prea repede: doi mobi
// pentru nivelul 1, sapte pentru nivelul 10. Acum: trei pentru primul
// nivel, ~25 pe la 10, ~60 pe la 59 - daca omori doar mobi. Cu misiuni
// merge mult mai repede, fiindca o misiune da cat vreo 20 de mobi.
// Asta e forma din WoW: misiunile sunt drumul rapid, macelul e cel lent.
const XP_BAZA = 140;      // cat experienta cere trecerea de la nivelul 1 la 2
const XP_PUTERE = 1.22;   // cat de repede creste cerinta de la un nivel la altul

// Cata experienta iti trebuie ca sa treci DE LA nivelul asta la urmatorul.
function xpPentruNivel(nivel) {
  if (nivel >= NIVEL_MAXIM) return Infinity;   // la 60 nu mai creste
  return Math.round(XP_BAZA * Math.pow(nivel, XP_PUTERE) / 5) * 5;
}

// Cate puncte de talent ai in total la un nivel anume.
function puncteTalentLaNivel(nivel) {
  if (nivel < NIVEL_PRIMUL_TALENT) return 0;
  return nivel - NIVEL_PRIMUL_TALENT + 1;
}

// Cata experienta da un inamic.
//
// Formula e cea din WoW: 5 x nivel + 45. Inainte era 45 x nivel, adica
// de zece ori mai mult la nivelurile mari - de aceea se urca instant.
// Unul mult sub nivelul tau nu mai da nimic.
const XP_MOB_BAZA = 45;
const XP_MOB_PE_NIVEL = 5;

function xpDeLaMob(nivelMob, nivelJucator) {
  const diferenta = nivelMob - nivelJucator;
  if (diferenta <= -6) return 0;
  const spor = Math.max(0.15, 1 + diferenta * 0.12);
  return Math.max(1, Math.round((XP_MOB_PE_NIVEL * nivelMob + XP_MOB_BAZA) * spor));
}


// ==========================================================
//  CONVERSIILE
//  Formulele exacte cerute in specificatie. Nu le modifica
//  fara sa reverifici cele 16 rezultate.
// ==========================================================

// Viata = 20 de baza
//       + primele 20 de Stamina dau cate 1 viata
//       + fiecare Stamina peste 20 da 10 viata
// Verificare: 22 Stamina = 20 + 20 + 20 = 60 viata.
function calculeazaViata(stamina) {
  const primele = Math.min(stamina, 20);
  const peste = Math.max(0, stamina - 20);
  return 20 + primele + peste * 10;
}

// Mana = Intellect x 15. Warrior nu are mana, are furie.
function calculeazaMana(intellect, resursa) {
  if (resursa !== 'mana') return null;
  return intellect * 15;
}

// Attack Power corp la corp = Strength x cat da clasa per Strength.
function calculeazaAttackPower(atribute, clasa) {
  return atribute.str * clasa.apPerStr;
}

// Attack Power la distanta = cel corp la corp + Agility x apPerAgi.
// Are sens doar pentru clasele care trag (Hunter). Pentru restul: null.
function calculeazaAttackPowerDistanta(atribute, clasa) {
  if (clasa.apPerAgi === 0) return null;
  return atribute.str * clasa.apPerStr + atribute.agi * clasa.apPerAgi;
}

// ==========================================================
//  PUTEREA VRAJII
//
//  DE CE EXISTA.
//  Masurat in joc, la nivelul 60, cu echipament de nivel: razboinicul
//  facea 93 de damage pe secunda, vanatorul 109, preotul 51 si magul
//  34. Adica magul, care e clasa de damage prin vraji, facea o treime
//  din cat face o clasa cu arma - si a doua sursa de damage a lui era
//  chiar lovitura cu toiagul.
//
//  Cauza nu era in temnite, ci in formule. Loviturile razboinicului si
//  ale vanatorului INMULTESC damage-ul armei, deci cresc de fiecare
//  data cand gasesti echipament mai bun. Vrajile erau cifre fixe scrise
//  in tabel, care cresteau doar cu rangul abilitatii - cam de doua ori
//  pe tot parcursul celor 60 de niveluri. Intellect nu facea nimic
//  pentru damage.
//
//  Acum vrajile au propria lor "putere", exact cum loviturile au Attack
//  Power: iese din Intellect, deci creste cu echipamentul, la fel ca la
//  celelalte clase.
// ==========================================================
// Cifrele 'vrajaPerInt' de la clase nu-s ghicite. Masurat cu acelasi
// echipament pentru toti, damage pe secunda impotriva unui sef elit:
//
//   nivel        20     40     60
//   warrior      65     83     97
//   hunter       73     94     110
//   mage  (1,2)  48     95     109      <- slab devreme, la fel la 60
//   priest (0,3) 61     73     82       <- sub clasele de damage, ca vindeca
//
// Magul ramane mai slab la inceput si ajunge din urma spre 60. Asa e si
// in Classic: o clasa de vraji e firava pana strange echipament.
function calculeazaPutereaVrajii(atribute, clasa) {
  return Math.round(atribute.int * (clasa.vrajaPerInt || 0));
}

// Armura = Agility x 2.
function calculeazaArmura(agilitate) {
  return agilitate * 2;
}

// Sansa de critical = 5% + (Agility / 20)%. Critical = damage dublu.
function calculeazaCritical(agilitate) {
  return 5 + agilitate / 20;
}


// ==========================================================
//  INFATISAREA ALEASA
//
//  O infatisare e o cutie cu cinci numere: al catelea lucru
//  ai ales din fiecare lista. { piele: 0, fata: 2, ... }
//  Numerele astea se pastreaza si in joc.
// ==========================================================

// Toate listele din care poti alege, pentru o rasa anume.
// ==========================================================
//  BARBAT SAU FEMEIE
//
//  Se alege ca orice altceva din infatisare: un rand cu doua
//  optiuni. Nu schimba nicio cifra - nici viata, nici damage-ul,
//  nici ce poti purta. Schimba doar cum arati.
// ==========================================================
const SEXE = [
  { id: 'barbat', nume: 'Male' },
  { id: 'femeie', nume: 'Female' }
];


function optiuniInfatisare(idRasa) {
  const rasa = RASE[idRasa];
  return {
    sex:        SEXE,
    piele:      rasa.optiuni.piele,
    fata:       STILURI_FATA,
    parStil:    STILURI_PAR,
    parCuloare: rasa.optiuni.par,
    barba:      STILURI_BARBA
  };
}

// Infatisarea de pornire: primul lucru din fiecare lista.
function infatisareImplicita() {
  return { sex: 0, piele: 0, fata: 0, parStil: 0, parCuloare: 0, barba: 0 };
}

// O infatisare la intamplare.
function infatisareLaIntamplare(idRasa) {
  const op = optiuniInfatisare(idRasa);
  const iaUna = lista => Math.floor(Math.random() * lista.length);
  return {
    sex:        iaUna(op.sex),
    piele:      iaUna(op.piele),
    fata:       iaUna(op.fata),
    parStil:    iaUna(op.parStil),
    parCuloare: iaUna(op.parCuloare),
    barba:      iaUna(op.barba)
  };
}

// Daca o alegere iese din lista (de ex. ai schimbat rasa),
// o aducem inapoi inauntru, ca sa nu ramana nimic gol.
function potrivesteInfatisarea(idRasa, inf) {
  const op = optiuniInfatisare(idRasa);
  const bun = {};
  Object.keys(op).forEach(function (cheie) {
    const i = inf && typeof inf[cheie] === 'number' ? inf[cheie] : 0;
    bun[cheie] = Math.min(Math.max(0, i), op[cheie].length - 1);
  });
  return bun;
}


// ==========================================================
//  FUNCTIA PRINCIPALA
//  Ii dai numele scurt al rasei si al clasei ('human', 'warrior')
//  si iti da inapoi personajul complet, cu tot ce s-a calculat.
// ==========================================================
function calculeazaPersonaj(idRasa, idClasa, infatisare, nivel) {

  const rasa = RASE[idRasa];
  const clasa = CLASE[idClasa];

  if (!rasa)  throw new Error('Nu exista rasa: ' + idRasa);
  if (!clasa) throw new Error('Nu exista clasa: ' + idClasa);

  // --- Stratul 1: statisticile de baza ale rasei ---
  const atribute = {
    str: rasa.baza.str,
    agi: rasa.baza.agi,
    sta: rasa.baza.sta,
    int: rasa.baza.int,
    spi: rasa.baza.spi
  };

  // --- Stratul 2: se adauga modificatorii clasei ---
  for (const numeAtribut of Object.keys(clasa.modificatori)) {
    atribute[numeAtribut] = atribute[numeAtribut] + clasa.modificatori[numeAtribut];
  }

  // --- Stratul 3: cresterea de la niveluri ---
  // La nivelul 1 nu se adauga nimic; la nivelul 60 se aduna de 59 de ori.
  const nivelul = Math.max(1, Math.min(NIVEL_MAXIM, nivel || 1));
  for (const numeAtribut of Object.keys(clasa.crestere)) {
    atribute[numeAtribut] += Math.floor(clasa.crestere[numeAtribut] * (nivelul - 1));
  }

  // --- Pasiva de rasa care schimba chiar statisticile ---
  // THE HUMAN SPIRIT: +5% Spirit, rotunjit in jos.
  // Se aplica AICI, ca sa intre si in mana si in regenerare.
  if (idRasa === 'human') {
    atribute.spi = Math.floor(atribute.spi * 1.05);
  }

  // --- Infatisarea aleasa in meniu ---
  const inf = potrivesteInfatisarea(idRasa, infatisare || infatisareImplicita());
  const op = optiuniInfatisare(idRasa);
  const aspect = {
    sex:     op.sex[inf.sex].id,
    piele:   op.piele[inf.piele],
    par:     op.parCuloare[inf.parCuloare],
    fata:    op.fata[inf.fata].id,
    parStil: op.parStil[inf.parStil].id,
    // O femeie n-are barba, oricare ar fi randul ales. Randul nici
    // nu se mai arata in meniu, dar daca vine dintr-o salvare veche
    // il taiem aici, ca sa nu iasa o femeie cu barba.
    barba:   (op.sex[inf.sex].id === 'femeie') ? 'fara' : op.barba[inf.barba].id
  };

  // --- Peste rezultat se aplica formulele de conversie ---
  return {
    idRasa: idRasa,
    idClasa: idClasa,
    nivel: nivelul,
    xp: 0,
    xpNecesar: xpPentruNivel(nivelul),
    puncteTalent: puncteTalentLaNivel(nivelul),
    talente: {},
    echipament: {},
    inventar: [],
    bani: 0,            // toti banii, socotiti in arame (vezi bani.js)
    misiuni: {},        // ce misiuni ai luat si cat ai facut din ele
    rasa: rasa.nume,
    clasa: clasa.nume,
    factiune: rasa.factiune,

    // Numele scris de jucator se completeaza mai tarziu, din meniu.
    nume: '',

    // Cum arata personajul: culorile si stilurile alese in meniu.
    aspect: aspect,
    infatisare: inf,
    culoareClasa: clasa.culoare || '#3355cc',

    atribute: atribute,

    viata: calculeazaViata(atribute.sta),
    viataMaxima: calculeazaViata(atribute.sta),

    resursa: clasa.resursa,
    mana: calculeazaMana(atribute.int, clasa.resursa),
    manaMaxima: calculeazaMana(atribute.int, clasa.resursa),
    furie: clasa.resursa === 'furie' ? 0 : null,

    attackPower: calculeazaAttackPower(atribute, clasa),
    attackPowerDistanta: calculeazaAttackPowerDistanta(atribute, clasa),
    putereVrajii: calculeazaPutereaVrajii(atribute, clasa),

    armura: calculeazaArmura(atribute.agi),
    critical: calculeazaCritical(atribute.agi),

    arme: clasa.arme,

    // Cele trei pasive: doua de la rasa, una de la clasa.
    // Deocamdata sunt doar text - nu au inca efect in joc.
    pasiveRasa: rasa.pasive,
    pasivaClasa: clasa.pasiva,
    // Ce abilitati stii, si la ce rang: { id: rang }. La creare
    // stii doar cele de nivelul 1; restul se invata la antrenor.
    stiute: abilitatileDeStart(idClasa),
    // Cele opt locuri de pe bara, doua pagini a cate patru. Se umple
    // singura cu ce stii la creare, ca sa ai ce apasa din prima.
    bara: faBaraDeStart(idClasa),

    // Lista veche, tinuta doar ca meniul de creare sa aiba ce arata.
    abilitati: clasa.abilitati
  };
}


// Lista de nume scurte, ca sa putem parcurge toate combinatiile.
const ID_RASE = Object.keys(RASE);
const ID_CLASE = Object.keys(CLASE);
