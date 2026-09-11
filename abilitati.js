// ==========================================================
//  ABILITATILE SI CUM SE INVATA
//
//  TOATE cifrele stau aici, nu in cod: cat costa, cat dureaza
//  pregatirea, cat astepti pana o poti folosi din nou, de la ce
//  nivel se invata si cate ranguri are. Daca vrei o abilitate mai
//  ieftina sau mai puternica, schimbi un numar in fisierul asta si
//  nu te atingi de nimic altceva.
//
//  RANGURILE
//  Un rang nou e aceeasi abilitate, dar mai tare si mai scumpa. NU
//  scriem fiecare rang pe rand - ar fi de sase ori mai mult text si
//  de sase ori mai usor de gresit. Scriem rangul 1 si cat creste la
//  fiecare rang; restul se socoteste.
//
//  Rangul nou il INLOCUIESTE pe cel vechi pe buton. Daca vrei sa le
//  tii pe toate, pui PASTREAZA_RANGURILE_VECHI pe true mai jos.
//
//  NUMELE
//  Tot ce se vede in joc e scris in engleza. Numele de aici sunt ale
//  noastre - niciunul nu vine din alt joc.
// ==========================================================


// ----------------------------------------------------------
//  REGLAJE
// ----------------------------------------------------------

// Dupa aproape orice abilitate urmeaza o pauza scurta in care nu
// poti folosi alta. Asa nu se pot apasa trei butoane deodata.
const PAUZA_GLOBALA = 1500;               // milisecunde

// Rangul nou ia locul celui vechi pe bara. Pe true, le tii pe toate.
const PASTREAZA_RANGURILE_VECHI = false;

// Bara de abilitati: doua pagini a cate patru butoane.
const BUTOANE_PE_PAGINA = 4;
const PAGINI_BARA = 2;
const LOCURI_IN_BARA = BUTOANE_PE_PAGINA * PAGINI_BARA;

// Cat costa la antrenor un rang invatat la nivelul N.
//
// Socotit ca sa coste, dar sa nu te blocheze: o misiune la nivelul
// N iti da cam 60 x N^1.1 arama, deci un rang costa cam jumatate
// de misiune. La nivelul 1 e 12 arama, la 20 vreo sase argint, la
// 60 vreo douazeci si cinci de argint.
function costulInvatarii(nivel) {
  return Math.round(12 * Math.pow(nivel, 1.3));
}


// ----------------------------------------------------------
//  LISTA ABILITATILOR
//
//  fel:
//    'lovitura'  - cu arma, de aproape
//    'sageata'   - cu arcul, de departe
//    'vraja'     - glob care zboara spre tinta
//    'vindecare' - te vindeca pe tine
//    'arsura'    - pune o rana care doare in timp (pe inamic)
//    'alinare'   - te vindeca putin cate putin, in timp
//    'val'       - loveste tot ce e in jurul tau
//    'intarire'  - te intareste pe tine o vreme
//
//  Campurile care se inmultesc la fiecare rang sunt marcate mai jos
//  in "CE_CRESTE". Restul raman la fel indiferent de rang.
// ----------------------------------------------------------

const ABILITATI = [

  // ==========================================================
  //  WARRIOR - se bate cu furia, nu cu mana
  // ==========================================================
  {
    id: 'warrior_strike_01', clasa: 'warrior', nume: 'Heavy Strike',
    descriere: 'A hard swing that spends rage and hits for double damage.',
    fel: 'lovitura', nivel: 1, laCateNiveluri: 8, ranguri: 6, crestere: 1.15,
    costRage: 25, costMana: 0, pauza: 0, incantare: 0, inmultit: 2
  },
  {
    id: 'warrior_shout_01', clasa: 'warrior', nume: 'War Cry',
    descriere: 'A shout that raises your attack power for 60 seconds.',
    fel: 'intarire', nivel: 1, laCateNiveluri: 10, ranguri: 6, crestere: 1.25,
    costRage: 10, costMana: 0, pauza: 8000, incantare: 0,
    tine: 60000, da: { attackPower: 8 }
  },
  {
    id: 'warrior_rend_01', clasa: 'warrior', nume: 'Gash',
    descriere: 'Opens a wound that bleeds for 12 seconds.',
    fel: 'arsura', nivel: 4, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 15, costMana: 0, pauza: 0, incantare: 0,
    tine: 12000, laCat: 2000, peTura: 4
  },
  {
    id: 'warrior_aoe_01', clasa: 'warrior', nume: 'Ground Shock',
    descriere: 'Slams the ground, hurting and slowing everything close by.',
    fel: 'val', nivel: 6, laCateNiveluri: 9, ranguri: 6, crestere: 1.2,
    costRage: 20, costMana: 0, pauza: 6000, incantare: 0,
    raza: 130, dmgMin: 6, dmgMax: 10, incetineste: 0.6, tineIncetinirea: 6000
  },
  {
    id: 'warrior_slow_01', clasa: 'warrior', nume: 'Leg Cut',
    descriere: 'Cuts the leg. The target moves at half speed for 10 seconds.',
    fel: 'lovitura', nivel: 8, laCateNiveluri: 16, ranguri: 3, crestere: 1.2,
    costRage: 10, costMana: 0, pauza: 0, incantare: 0, inmultit: 0.8,
    incetineste: 0.5, tineIncetinirea: 10000
  },
  {
    id: 'warrior_over_01', clasa: 'warrior', nume: 'Opening',
    descriere: 'A heavy blow that lands while the enemy is off balance.',
    fel: 'lovitura', nivel: 12, laCateNiveluri: 8, ranguri: 6, crestere: 1.15,
    costRage: 15, costMana: 0, pauza: 5000, incantare: 0, inmultit: 2.6
  },
  {
    id: 'warrior_cleave_01', clasa: 'warrior', nume: 'Wide Swing',
    descriere: 'A wide swing that catches everything in front of you.',
    fel: 'val', nivel: 20, laCateNiveluri: 8, ranguri: 5, crestere: 1.18,
    costRage: 20, costMana: 0, pauza: 3000, incantare: 0,
    raza: 95, dmgMin: 14, dmgMax: 22
  },
  {
    id: 'warrior_ww_01', clasa: 'warrior', nume: 'Spin Cut',
    descriere: 'You turn on the spot and cut everything around you.',
    fel: 'val', nivel: 36, laCateNiveluri: 12, ranguri: 3, crestere: 1.2,
    costRage: 25, costMana: 0, pauza: 10000, incantare: 0,
    raza: 150, dmgMin: 40, dmgMax: 58
  },


  // ==========================================================
  //  HUNTER - arcul, otrava si aspectele
  // ==========================================================
  {
    id: 'hunter_melee_01', clasa: 'hunter', nume: 'Talon Strike',
    descriere: 'A close strike for when something reaches you.',
    fel: 'lovitura', nivel: 1, laCateNiveluri: 8, ranguri: 6, crestere: 1.15,
    costRage: 0, costMana: 15, pauza: 0, incantare: 0, inmultit: 1.8
  },
  {
    id: 'hunter_aspect_monkey', clasa: 'hunter', nume: 'Cat\'s Step',
    descriere: 'You move lighter. Armor rises for 10 minutes.',
    fel: 'intarire', nivel: 4, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 20, pauza: 2000, incantare: 0,
    tine: 600000, da: { armura: 20 }, aspect: true
  },
  {
    id: 'hunter_sting_01', clasa: 'hunter', nume: 'Venom Arrow',
    descriere: 'A poisoned arrow. The wound burns for 15 seconds.',
    fel: 'arsura', nivel: 4, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 20, pauza: 0, incantare: 0, deLaDistanta: true,
    tine: 15000, laCat: 3000, peTura: 5
  },
  {
    id: 'hunter_shot_01', clasa: 'hunter', nume: 'Drawn Shot',
    descriere: 'A drawn arrow that hits for double damage.',
    fel: 'sageata', nivel: 6, laCateNiveluri: 8, ranguri: 6, crestere: 1.15,
    costRage: 0, costMana: 25, pauza: 6000, incantare: 0, inmultit: 2
  },
  {
    id: 'hunter_slow_01', clasa: 'hunter', nume: 'Stunning Shot',
    descriere: 'A blunt arrow. The target crawls for 8 seconds.',
    fel: 'sageata', nivel: 8, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 18, pauza: 9000, incantare: 0, inmultit: 0.7,
    incetineste: 0.4, tineIncetinirea: 8000
  },
  {
    id: 'hunter_aspect_hawk', clasa: 'hunter', nume: 'Hawk\'s Eye',
    descriere: 'Your aim sharpens. Attack power rises for 10 minutes.',
    fel: 'intarire', nivel: 10, laCateNiveluri: 10, ranguri: 6, crestere: 1.25,
    costRage: 0, costMana: 25, pauza: 2000, incantare: 0,
    tine: 600000, da: { attackPower: 12 }, aspect: true
  },
  {
    id: 'hunter_clip_01', clasa: 'hunter', nume: 'Tendon Cut',
    descriere: 'A close cut that leaves the target limping.',
    fel: 'lovitura', nivel: 12, laCateNiveluri: 16, ranguri: 3, crestere: 1.2,
    costRage: 0, costMana: 15, pauza: 0, incantare: 0, inmultit: 0.8,
    incetineste: 0.5, tineIncetinirea: 10000
  },
  {
    id: 'hunter_multi_01', clasa: 'hunter', nume: 'Fan Shot',
    descriere: 'Three arrows at once, spread wide.',
    fel: 'val', nivel: 18, laCateNiveluri: 9, ranguri: 5, crestere: 1.18,
    costRage: 0, costMana: 35, pauza: 8000, incantare: 0,
    raza: 260, dmgMin: 16, dmgMax: 26, deLaDistanta: true
  },


  // ==========================================================
  //  MAGE - foc, gheata si armurile de vraja
  // ==========================================================
  {
    id: 'mage_bolt_01', clasa: 'mage', nume: 'Arcane Bolt',
    descriere: 'A bolt of raw magic. Takes a moment to gather.',
    fel: 'vraja', nivel: 1, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 20, pauza: 3000, incantare: 1500,
    dmgMin: 8, dmgMax: 12, raza: 200, culoare: 0x2f6fd0
  },
  {
    id: 'mage_armor_01', clasa: 'mage', nume: 'Rime Shield',
    descriere: 'A skin of frost. Armor rises for 30 minutes.',
    fel: 'intarire', nivel: 1, laCateNiveluri: 12, ranguri: 4, crestere: 1.3,
    costRage: 0, costMana: 25, pauza: 2000, incantare: 0,
    tine: 1800000, da: { armura: 30 }, armuraDeVraja: true
  },
  {
    id: 'mage_int_01', clasa: 'mage', nume: 'Clear Mind',
    descriere: 'Your thinking sharpens. Intellect rises for 30 minutes.',
    fel: 'intarire', nivel: 1, laCateNiveluri: 14, ranguri: 4, crestere: 1.3,
    costRage: 0, costMana: 30, pauza: 2000, incantare: 0,
    tine: 1800000, da: { int: 4 }
  },
  {
    id: 'mage_frost_01', clasa: 'mage', nume: 'Chillbolt',
    descriere: 'A shard of ice. Hurts, and leaves the target slow.',
    fel: 'vraja', nivel: 4, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 22, pauza: 0, incantare: 1800,
    dmgMin: 9, dmgMax: 13, raza: 220, culoare: 0x7cc8f0,
    incetineste: 0.6, tineIncetinirea: 6000
  },
  {
    id: 'mage_fire_01', clasa: 'mage', nume: 'Flame Burst',
    descriere: 'Fire with no wind-up. Short and hot.',
    fel: 'vraja', nivel: 6, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 25, pauza: 7000, incantare: 0,
    dmgMin: 12, dmgMax: 17, raza: 200, culoare: 0xe8862f
  },
  {
    id: 'mage_nova_01', clasa: 'mage', nume: 'Ice Ring',
    descriere: 'Ice bursts from your feet. Everything close freezes in place.',
    fel: 'val', nivel: 10, laCateNiveluri: 10, ranguri: 5, crestere: 1.2,
    costRage: 0, costMana: 35, pauza: 20000, incantare: 0,
    raza: 140, dmgMin: 8, dmgMax: 12, culoare: 0x9adcf8,
    incetineste: 0.05, tineIncetinirea: 7000
  },
  {
    id: 'mage_aoe_01', clasa: 'mage', nume: 'Burst Ring',
    descriere: 'Magic bursts outward from where you stand.',
    fel: 'val', nivel: 14, laCateNiveluri: 9, ranguri: 6, crestere: 1.18,
    costRage: 0, costMana: 40, pauza: 2000, incantare: 0,
    raza: 150, dmgMin: 14, dmgMax: 20, culoare: 0xb07cf0
  },
  {
    id: 'mage_scorch_01', clasa: 'mage', nume: 'Sear',
    descriere: 'A quick, cheap flame for when mana runs thin.',
    fel: 'vraja', nivel: 22, laCateNiveluri: 9, ranguri: 4, crestere: 1.18,
    costRage: 0, costMana: 14, pauza: 0, incantare: 900,
    dmgMin: 20, dmgMax: 27, raza: 200, culoare: 0xf0a03c
  },


  // ==========================================================
  //  PRIEST - lumina, umbra si scuturi
  // ==========================================================
  {
    id: 'priest_smite_01', clasa: 'priest', nume: 'Holy Spark',
    descriere: 'A lance of light, thrown fast.',
    fel: 'vraja', nivel: 1, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 18, pauza: 2500, incantare: 0,
    dmgMin: 6, dmgMax: 10, raza: 200, culoare: 0xe8c15a
  },
  {
    id: 'priest_heal_01', clasa: 'priest', nume: 'Mend Wounds',
    descriere: 'A small, cheap mending of your own wounds.',
    fel: 'vindecare', nivel: 1, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 25, pauza: 6000, incantare: 0,
    vindecaMin: 15, vindecaMax: 20
  },
  {
    id: 'priest_fort_01', clasa: 'priest', nume: 'Steady Heart',
    descriere: 'Your heart steadies. Stamina rises for 30 minutes.',
    fel: 'intarire', nivel: 1, laCateNiveluri: 12, ranguri: 5, crestere: 1.3,
    costRage: 0, costMana: 28, pauza: 2000, incantare: 0,
    tine: 1800000, da: { sta: 4 }
  },
  {
    id: 'priest_dot_01', clasa: 'priest', nume: 'Creeping Ache',
    descriere: 'A shadow that settles in and gnaws for 18 seconds.',
    fel: 'arsura', nivel: 4, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 22, pauza: 0, incantare: 0, deLaDistanta: true,
    tine: 18000, laCat: 3000, peTura: 5, culoare: 0x8a5ad0
  },
  {
    id: 'priest_hot_01', clasa: 'priest', nume: 'Slow Mending',
    descriere: 'Your wounds close slowly, over 15 seconds.',
    fel: 'alinare', nivel: 8, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 30, pauza: 4000, incantare: 0,
    tine: 15000, laCat: 3000, peTura: 8
  },
  {
    id: 'priest_blast_01', clasa: 'priest', nume: 'Mindstrike',
    descriere: 'A blow struck straight at the mind.',
    fel: 'vraja', nivel: 10, laCateNiveluri: 8, ranguri: 6, crestere: 1.2,
    costRage: 0, costMana: 35, pauza: 8000, incantare: 0,
    dmgMin: 22, dmgMax: 30, raza: 220, culoare: 0x9a6fd8
  },
  {
    id: 'priest_fire_01', clasa: 'priest', nume: 'Inner Ember',
    descriere: 'A light kindled inside. Armor rises for 10 minutes.',
    fel: 'intarire', nivel: 12, laCateNiveluri: 10, ranguri: 5, crestere: 1.25,
    costRage: 0, costMana: 30, pauza: 2000, incantare: 0,
    tine: 600000, da: { armura: 35 }
  },
  {
    id: 'priest_heal_02', clasa: 'priest', nume: 'Mend',
    descriere: 'A proper mending. Slower and dearer than the small one.',
    fel: 'vindecare', nivel: 16, laCateNiveluri: 9, ranguri: 5, crestere: 1.22,
    costRage: 0, costMana: 55, pauza: 8000, incantare: 1500,
    vindecaMin: 55, vindecaMax: 70
  }
];


// ----------------------------------------------------------
//  CE CRESTE LA FIECARE RANG
//
//  Numai campurile de aici se inmultesc. Un cooldown sau o raza nu
//  au de ce sa creasca odata cu rangul; damage-ul si costul, da.
// ----------------------------------------------------------
const CE_CRESTE = ['dmgMin', 'dmgMax', 'vindecaMin', 'vindecaMax',
                   'peTura', 'costMana', 'costRage'];


// Cu cat creste ce da o intarire (attackPower, armura, sta, int).
function intarireaLaRang(ab, rang, cheie) {
  return Math.round(ab.da[cheie] * Math.pow(ab.crestere, rang - 1));
}


// ----------------------------------------------------------
//  O abilitate, la un rang anume
//
//  Da inapoi exact forma pe care o asteapta lupta din joc: acelasi
//  id, acelasi fel, doar cu cifrele rangului cerut.
// ----------------------------------------------------------
function abilitateaLaRang(ab, rang) {

  const r = Math.max(1, Math.min(ab.ranguri, rang || 1));
  const spor = Math.pow(ab.crestere, r - 1);
  const iesire = Object.assign({}, ab);

  CE_CRESTE.forEach(function (cheie) {
    if (typeof ab[cheie] === 'number') iesire[cheie] = Math.round(ab[cheie] * spor);
  });

  if (ab.da) {
    iesire.da = {};
    Object.keys(ab.da).forEach(function (cheie) {
      iesire.da[cheie] = intarireaLaRang(ab, r, cheie);
    });
  }

  iesire.rang = r;
  iesire.nivelRang = nivelulRangului(ab, r);
  // Numele de pe buton nu spune rangul: pe un buton de patruzeci de
  // pixeli n-ai loc, si oricum rangul vechi dispare cand vine altul.
  iesire.numeIntreg = ab.nume + '  (Rank ' + r + ')';
  return iesire;
}


// La ce nivel se invata rangul R al unei abilitati.
function nivelulRangului(ab, rang) {
  return ab.nivel + (rang - 1) * (ab.laCateNiveluri || 0);
}


// Cel mai mare rang al abilitatii pe care il poate avea cineva de
// nivelul dat. 0 inseamna ca inca nu poate avea niciunul.
function rangulPosibil(ab, nivel) {
  let cel = 0;
  for (let r = 1; r <= ab.ranguri; r++) {
    if (nivelulRangului(ab, r) <= nivel) cel = r;
  }
  return cel;
}


// ----------------------------------------------------------
//  Ce stie personajul
//
//  personaj.stiute = { 'warrior_strike_01': 3, ... }  id -> rang
//  personaj.bara   = [ 'warrior_strike_01', null, ... ]  8 locuri
// ----------------------------------------------------------
function abilitatileClasei(idClasa) {
  return ABILITATI.filter(function (ab) { return ab.clasa === idClasa; });
}


function gasesteAbilitatea(id) {
  return ABILITATI.find(function (ab) { return ab.id === id; }) || null;
}


// Toate abilitatile pe care le stie, la rangul la care le stie.
function abilitatileStiute(personajul) {
  const stiute = personajul.stiute || {};
  return Object.keys(stiute).map(function (id) {
    const ab = gasesteAbilitatea(id);
    return ab ? abilitateaLaRang(ab, stiute[id]) : null;
  }).filter(Boolean);
}


// Ce are antrenorul de oferit: fiecare abilitate a clasei cu rangul
// urmator pe care NU-l stie inca, si de ce poate sau nu poate.
function ceAreAntrenorul(personajul) {

  const stiute = personajul.stiute || {};
  const lista = [];

  abilitatileClasei(personajul.idClasa).forEach(function (ab) {

    const acum = stiute[ab.id] || 0;
    const urmator = acum + 1;
    if (urmator > ab.ranguri) return;                 // le stie pe toate

    const nivelCerut = nivelulRangului(ab, urmator);
    const cost = costulInvatarii(nivelCerut);

    lista.push({
      abilitate: ab,
      rang: urmator,
      rangAcum: acum,
      nivelCerut: nivelCerut,
      cost: cost,
      preaMic: personajul.nivel < nivelCerut,
      faraBani: (personajul.bani || 0) < cost
    });
  });

  // Intai ce poti invata acum, apoi ce urmeaza, dupa nivel.
  lista.sort(function (a, b) {
    if (a.preaMic !== b.preaMic) return a.preaMic ? 1 : -1;
    return a.nivelCerut - b.nivelCerut;
  });
  return lista;
}


// Cate abilitati poti invata CHIAR ACUM. Se foloseste la urcarea in
// nivel, ca sa-ti spuna jocul ca te asteapta ceva la antrenor.
function cateTeAsteaptaLaAntrenor(personajul) {
  return ceAreAntrenorul(personajul).filter(function (c) {
    return !c.preaMic;
  }).length;
}


// ----------------------------------------------------------
//  Invatatul
// ----------------------------------------------------------
function invataAbilitatea(personajul, id, rang) {

  const ab = gasesteAbilitatea(id);
  if (!ab || ab.clasa !== personajul.idClasa) return null;

  const acum = (personajul.stiute || {})[id] || 0;
  if (rang !== acum + 1 || rang > ab.ranguri) return null;

  const nivelCerut = nivelulRangului(ab, rang);
  if (personajul.nivel < nivelCerut) return null;

  const cost = costulInvatarii(nivelCerut);
  if ((personajul.bani || 0) < cost) return null;

  personajul.bani -= cost;
  personajul.stiute = personajul.stiute || {};
  personajul.stiute[id] = rang;

  // Daca nu e pe bara si mai e loc, se aseaza singura. Asa nu
  // trebuie sa umbli prin meniu dupa fiecare lucru invatat.
  asazaPeBaraDacaIncape(personajul, id);

  return { abilitate: abilitateaLaRang(ab, rang), cost: cost };
}


// ----------------------------------------------------------
//  Bara de abilitati: opt locuri, doua pagini a cate patru
// ----------------------------------------------------------
function faBaraGoala() {
  return new Array(LOCURI_IN_BARA).fill(null);
}


function asazaPeBaraDacaIncape(personajul, id) {
  personajul.bara = personajul.bara || faBaraGoala();
  if (personajul.bara.indexOf(id) >= 0) return false;
  const liber = personajul.bara.indexOf(null);
  if (liber < 0) return false;
  personajul.bara[liber] = id;
  return true;
}


function puneInLoc(personajul, loc, id) {
  personajul.bara = personajul.bara || faBaraGoala();
  if (loc < 0 || loc >= LOCURI_IN_BARA) return;
  // Daca e deja in alt loc, o mutam - nu o punem de doua ori.
  const unde = personajul.bara.indexOf(id);
  if (id && unde >= 0) personajul.bara[unde] = null;
  personajul.bara[loc] = id;
}


// ----------------------------------------------------------
//  La crearea personajului
//
//  Abilitatile de nivelul 1 se stiu din start, fara antrenor.
// ----------------------------------------------------------
function abilitatileDeStart(idClasa) {
  const stiute = {};
  abilitatileClasei(idClasa).forEach(function (ab) {
    if (ab.nivel <= 1) stiute[ab.id] = 1;
  });
  return stiute;
}


// Bara, gata umpluta cu ce stii de la inceput. Fara asta, un personaj
// nou stia doua abilitati si avea bara goala: nu avea ce apasa.
function faBaraDeStart(idClasa) {
  const bara = faBaraGoala();
  let i = 0;
  Object.keys(abilitatileDeStart(idClasa)).forEach(function (id) {
    if (i < LOCURI_IN_BARA) bara[i++] = id;
  });
  return bara;
}


// ----------------------------------------------------------
//  Personajele vechi
//
//  Salvarile facute inainte de antrenori n-au nicio abilitate
//  invatata. Ar fi nedrept sa se trezeasca la nivelul 40 cu doua
//  butoane, asa ca primesc gratis tot ce le-ar fi dat antrenorul
//  pana la nivelul lor.
// ----------------------------------------------------------
function daTotCeSeCuvine(personajul) {
  const stiute = {};
  abilitatileClasei(personajul.idClasa).forEach(function (ab) {
    const r = rangulPosibil(ab, personajul.nivel);
    if (r > 0) stiute[ab.id] = r;
  });
  return stiute;
}
