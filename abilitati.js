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
,
// ---- Warrior, restul ----
  {
    id: 'warrior_charge_01', clasa: 'warrior', nume: 'Bull Rush',
    descriere: 'You close the distance in one step and come up swinging.',
    fel: 'saritura', laTinta: true, nivel: 4, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 0, pauza: 15000, incantare: 0, daRage: 15
  },
  {
    id: 'warrior_sunder_01', prinQuest: true, clasa: 'warrior', nume: 'Armor Split',
    descriere: 'A blow aimed at the joints. Their armor holds less.',
    fel: 'slabire', nivel: 10, laCateNiveluri: 12, ranguri: 5, crestere: 1.12,
    costRage: 15, costMana: 0, pauza: 0, incantare: 0,
    inmultit: 0.9, slabesteCu: 0.12, tine: 30000
  },
  {
    id: 'warrior_exec_01', clasa: 'warrior', nume: 'Finisher',
    descriere: 'Only lands on an enemy near death \u2014 and it ends them.',
    fel: 'lovitura', nivel: 24, laCateNiveluri: 9, ranguri: 5, crestere: 1.18,
    costRage: 20, costMana: 0, pauza: 0, incantare: 0,
    inmultit: 1, doarSubViata: 0.25, inmultitFinal: 5
  },
  {
    id: 'warrior_wall_01', clasa: 'warrior', nume: 'Iron Guard',
    descriere: 'You set yourself. Blows glance off for a short while.',
    fel: 'scut', nivel: 28, laCateNiveluri: 11, ranguri: 3, crestere: 1.5,
    costRage: 10, costMana: 0, pauza: 120000, incantare: 0,
    absoarbe: 300, tine: 10000
  },
  {
    id: 'warrior_fear_01', clasa: 'warrior', nume: 'Break Their Nerve',
    descriere: 'A shout that sends everything close by running.',
    fel: 'frica', nivel: 22, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 25, costMana: 0, pauza: 60000, incantare: 0,
    raza: 150, tine: 6000
  },
  {
    id: 'warrior_intercept_01', prinQuest: true, clasa: 'warrior', nume: 'Closing Leap',
    descriere: 'A leap that catches something already running.',
    fel: 'saritura', laTinta: true, nivel: 30, laCateNiveluri: 14, ranguri: 3, crestere: 1,
    costRage: 10, costMana: 0, pauza: 25000, incantare: 0
  },

  // ---- Hunter, restul ----
  {
    id: 'hunter_mend_01', clasa: 'hunter', nume: 'Tend Companion',
    descriere: 'Binds your beast\'s wounds. Only works on the beast.',
    fel: 'alinare', peAnimal: true, nivel: 12, laCateNiveluri: 8, ranguri: 6,
    crestere: 1.2, costRage: 0, costMana: 30, pauza: 6000, incantare: 0,
    tine: 0, laCat: 0, peTura: 12
  },
  {
    id: 'hunter_tame_01', prinQuest: true, clasa: 'hunter', nume: 'Bind Beast',
    descriere: 'Bind a beast to you. It must be no higher level than you are.',
    fel: 'imblanzire', nivel: 10, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 0, pauza: 20000, incantare: 4000, raza: 220
  },
  {
    id: 'hunter_call_01', prinQuest: true, clasa: 'hunter', nume: 'Call Companion',
    descriere: 'Calls your beast to your side, or sends it away again.',
    fel: 'cheama', nivel: 10, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 10, pauza: 4000, incantare: 0
  },
  {
    id: 'hunter_revive_01', prinQuest: true, clasa: 'hunter', nume: 'Rouse Companion',
    descriere: 'Brings your beast back on its feet, half mended.',
    fel: 'invie', nivel: 10, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 40, pauza: 30000, incantare: 3000
  },
  {
    id: 'hunter_mark_01', clasa: 'hunter', nume: 'Marked Quarry',
    descriere: 'You mark it. Its guard drops for half a minute.',
    fel: 'slabire', nivel: 6, laCateNiveluri: 14, ranguri: 4, crestere: 1.15,
    costRage: 0, costMana: 12, pauza: 0, incantare: 0, deLaDistanta: true,
    inmultit: 0.5, slabesteCu: 0.15, tine: 30000
  },
  {
    id: 'hunter_trap_ice', clasa: 'hunter', nume: 'Frost Snare',
    descriere: 'A snare laid at your feet. The first thing to step on it freezes.',
    fel: 'capcana', nivel: 20, laCateNiveluri: 14, ranguri: 3, crestere: 1,
    costRage: 0, costMana: 30, pauza: 30000, incantare: 0,
    prinde: 'gheata', tineCapcana: 60000, tineEfectul: 9000, culoare: 0x9adcf8
  },
  {
    id: 'hunter_trap_fire', clasa: 'hunter', nume: 'Ember Snare',
    descriere: 'A snare that catches fire under whatever finds it.',
    fel: 'capcana', nivel: 16, laCateNiveluri: 11, ranguri: 4, crestere: 1.25,
    costRage: 0, costMana: 28, pauza: 25000, incantare: 0,
    prinde: 'foc', tineCapcana: 60000, tineEfectul: 12000, peTura: 10,
    culoare: 0xe8862f
  },
  {
    id: 'hunter_dead_01', clasa: 'hunter', nume: 'Play Dead',
    descriere: 'You drop. Everything loses interest in you.',
    fel: 'mortPrefacut', nivel: 30, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 20, pauza: 40000, incantare: 0, tine: 6000
  },
  {
    id: 'hunter_disengage_01', clasa: 'hunter', nume: 'Break Off',
    descriere: 'A quick step back, out of reach.',
    fel: 'saritura', laTinta: false, nivel: 20, laCateNiveluri: 14, ranguri: 3, crestere: 1,
    costRage: 0, costMana: 15, pauza: 20000, incantare: 0, sarePana: -170
  },
  {
    id: 'hunter_rapid_01', clasa: 'hunter', nume: 'Quick Draw',
    descriere: 'Your hands speed up. Attack power climbs for 15 seconds.',
    fel: 'intarire', nivel: 26, laCateNiveluri: 12, ranguri: 3, crestere: 1.3,
    costRage: 0, costMana: 30, pauza: 180000, incantare: 0,
    tine: 15000, da: { attackPower: 60 }
  },

  // ---- Mage, restul ----
  {
    id: 'mage_blink_01', clasa: 'mage', nume: 'Step Through',
    descriere: 'You are suddenly a little further along.',
    fel: 'saritura', laTinta: false, nivel: 20, laCateNiveluri: 0, ranguri: 1, crestere: 1,
    costRage: 0, costMana: 25, pauza: 15000, incantare: 0, sarePana: 170
  },
  {
    id: 'mage_shield_01', clasa: 'mage', nume: 'Mind Ward',
    descriere: 'A shell that drinks the first blows.',
    fel: 'scut', nivel: 20, laCateNiveluri: 8, ranguri: 6, crestere: 1.3,
    costRage: 0, costMana: 40, pauza: 12000, incantare: 0,
    absoarbe: 120, tine: 30000
  },
  {
    id: 'mage_poly_01', prinQuest: true, clasa: 'mage', nume: 'Shapebind',
    descriere: 'One enemy forgets what it was doing, and stands there.',
    fel: 'farmec', nivel: 8, laCateNiveluri: 14, ranguri: 4, crestere: 1.2,
    costRage: 0, costMana: 30, pauza: 20000, incantare: 1500,
    raza: 220, tine: 12000
  },
  {
    id: 'mage_evoc_01', clasa: 'mage', nume: 'Drawing Breath',
    descriere: 'You stand still and your thinking comes back.',
    fel: 'refacere', nivel: 20, laCateNiveluri: 12, ranguri: 4, crestere: 1.4,
    costRage: 0, costMana: 0, pauza: 300000, incantare: 0, cat: 300
  },
  {
    id: 'mage_icearmor_01', clasa: 'mage', nume: 'Glacier Skin',
    descriere: 'Deeper frost than the first. Armor rises for 30 minutes.',
    fel: 'intarire', nivel: 30, laCateNiveluri: 12, ranguri: 3, crestere: 1.3,
    costRage: 0, costMana: 40, pauza: 2000, incantare: 0,
    tine: 1800000, da: { armura: 90 }, armuraDeVraja: true
  },

  // ---- Priest, restul ----
  {
    id: 'priest_shield_01', clasa: 'priest', nume: 'Warding Word',
    descriere: 'A word spoken over yourself. It takes the next blows.',
    fel: 'scut', nivel: 6, laCateNiveluri: 8, ranguri: 6, crestere: 1.3,
    costRage: 0, costMana: 35, pauza: 15000, incantare: 0,
    absoarbe: 60, tine: 30000
  },
  {
    id: 'priest_fear_01', prinQuest: true, clasa: 'priest', nume: 'Wail',
    descriere: 'A cry that scatters everything around you.',
    fel: 'frica', nivel: 14, laCateNiveluri: 16, ranguri: 3, crestere: 1,
    costRage: 0, costMana: 40, pauza: 45000, incantare: 0,
    raza: 140, tine: 6000
  },
  {
    id: 'priest_holyfire_01', clasa: 'priest', nume: 'Sunfire',
    descriere: 'Light that catches and keeps burning.',
    fel: 'arsura', nivel: 20, laCateNiveluri: 9, ranguri: 5, crestere: 1.2,
    costRage: 0, costMana: 40, pauza: 10000, incantare: 0, deLaDistanta: true,
    tine: 12000, laCat: 2000, peTura: 14, culoare: 0xe8c15a
  },
  {
    id: 'priest_flash_01', clasa: 'priest', nume: 'Quick Mercy',
    descriere: 'A fast mending, and a dear one.',
    fel: 'vindecare', nivel: 20, laCateNiveluri: 8, ranguri: 6, crestere: 1.22,
    costRage: 0, costMana: 80, pauza: 0, incantare: 800,
    vindecaMin: 80, vindecaMax: 100
  },
  {
    id: 'priest_bigheal_01', clasa: 'priest', nume: 'Deep Mending',
    descriere: 'The whole of what you know, poured into one wound.',
    fel: 'vindecare', nivel: 40, laCateNiveluri: 10, ranguri: 3, crestere: 1.25,
    costRage: 0, costMana: 160, pauza: 0, incantare: 2500,
    vindecaMin: 420, vindecaMax: 520
  },

  // ==========================================================
  //  PREOTUL, DUPA RASA
  //
  //  Doua abilitati de fiecare rasa, la nivelele 10 si 20. Le are
  //  DOAR preotul rasei aceleia: un preot Human nu vede niciodata
  //  la antrenor ce stie unul Undead.
  //
  //  Campul 'rasa' e tot ce le deosebeste de restul listei.
  //
  //  Orcul are si el doua, desi in Classic nu exista preot orc.
  //  La noi exista, si mi s-a parut nedrept sa fie singura rasa
  //  fara nimic. Alea doua sunt inventate cap-coada.
  // ==========================================================

  // ---- Human: nu cedezi, si ce primesti dai inapoi ----
  {
    id: 'priest_race_human_01', clasa: 'priest', rasa: 'human', nume: 'Last Breath',
    descriere: 'When there is nothing left, you find a little more. Mends you at once.',
    fel: 'vindecare', nivel: 10, laCateNiveluri: 12, ranguri: 4, crestere: 1.3,
    costRage: 0, costMana: 0, pauza: 300000, incantare: 0,
    vindecaMin: 120, vindecaMax: 160
  },
  {
    id: 'priest_race_human_02', clasa: 'priest', rasa: 'human', nume: 'Turned Aside',
    descriere: 'For 15 seconds, part of every blow goes back where it came from.',
    fel: 'intarire', nivel: 20, laCateNiveluri: 14, ranguri: 3, crestere: 1.15,
    costRage: 0, costMana: 60, pauza: 180000, incantare: 0,
    tine: 15000, da: { intoarce: 0.35 }
  },

  // ---- Duskborn: lumina rece, si pasul care nu se aude ----
  {
    id: 'priest_race_nightelf_01', clasa: 'priest', rasa: 'nightelf', nume: 'Star Splinter',
    descriere: 'A sliver of cold light, left burning in the wound for 18 seconds.',
    fel: 'arsura', nivel: 10, laCateNiveluri: 10, ranguri: 4, crestere: 1.25,
    costRage: 0, costMana: 45, pauza: 12000, incantare: 0, deLaDistanta: true,
    tine: 18000, laCat: 3000, peTura: 14
  },
  {
    id: 'priest_race_nightelf_02', clasa: 'priest', rasa: 'nightelf', nume: 'Moonlit Step',
    descriere: 'For 15 seconds you are harder to touch than you look.',
    fel: 'intarire', nivel: 20, laCateNiveluri: 14, ranguri: 3, crestere: 1.2,
    costRage: 0, costMana: 55, pauza: 120000, incantare: 0,
    tine: 15000, da: { dodge: 15 }
  },

  // ---- Undead: mana care slabeste, si foamea care se hraneste ----
  {
    id: 'priest_race_undead_01', clasa: 'priest', rasa: 'undead', nume: 'Withering Touch',
    descriere: 'What it strikes with grows weak. It hits softer for 20 seconds.',
    fel: 'slabire', nivel: 10, laCateNiveluri: 12, ranguri: 4, crestere: 1.1,
    costRage: 0, costMana: 40, pauza: 20000, incantare: 0, raza: 200,
    slabesteDmg: 0.20, tine: 20000
  },
  {
    id: 'priest_race_undead_02', clasa: 'priest', rasa: 'undead', nume: 'Rotting Hunger',
    descriere: 'A rot that eats for 24 seconds, and feeds you what it takes.',
    fel: 'arsura', nivel: 20, laCateNiveluri: 12, ranguri: 3, crestere: 1.25,
    costRage: 0, costMana: 70, pauza: 24000, incantare: 0, deLaDistanta: true,
    tine: 24000, laCat: 3000, peTura: 16, iaViata: true
  },

  // ---- Orc: ce ti-au lasat cei dinainte ----
  {
    id: 'priest_race_orc_01', clasa: 'priest', rasa: 'orc', nume: 'Ancestor\'s Vigil',
    descriere: 'They stand around you for 20 seconds. Harder to hit, harder to hurt.',
    fel: 'intarire', nivel: 10, laCateNiveluri: 12, ranguri: 4, crestere: 1.2,
    costRage: 0, costMana: 50, pauza: 90000, incantare: 0,
    tine: 20000, da: { dodge: 10, armura: 30 }
  },
  {
    id: 'priest_race_orc_02', clasa: 'priest', rasa: 'orc', nume: 'Ancestor\'s Wrath',
    descriere: 'For 25 seconds, what is done to you is done back, in part.',
    fel: 'intarire', nivel: 20, laCateNiveluri: 14, ranguri: 3, crestere: 1.15,
    costRage: 0, costMana: 70, pauza: 180000, incantare: 0,
    tine: 25000, da: { intoarce: 0.30 }
  }
];


// ----------------------------------------------------------
//  CE CRESTE LA FIECARE RANG
//
//  Numai campurile de aici se inmultesc. Un cooldown sau o raza nu
//  au de ce sa creasca odata cu rangul; damage-ul si costul, da.
// ----------------------------------------------------------
const CE_CRESTE = ['dmgMin', 'dmgMax', 'vindecaMin', 'vindecaMax',
                   'peTura', 'costMana', 'costRage',
                   // Astea doua sunt fractiuni - cat de mult slabeste
                   // lovitura armura sau damage-ul. Pana acum nu
                   // cresteau deloc, deci un rang nou costa mai mult
                   // si facea exact acelasi lucru.
                   'slabesteCu', 'slabesteDmg'];


// Cifrele mici, sub 1, sunt fractiuni: 0,35 din lovitura intoarsa
// inapoi, 0,12 din armura data jos. Rotunjite la intreg s-ar face
// zero, si abilitatea n-ar mai face nimic.
function crestePastrandZecimalele(baza, spor) {
  const val = baza * spor;
  return (Math.abs(baza) < 1) ? Math.round(val * 100) / 100 : Math.round(val);
}


// Cu cat creste ce da o intarire (attackPower, armura, sta, int).
function intarireaLaRang(ab, rang, cheie) {
  return crestePastrandZecimalele(ab.da[cheie], Math.pow(ab.crestere, rang - 1));
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
    if (typeof ab[cheie] === 'number') {
      iesire[cheie] = crestePastrandZecimalele(ab[cheie], spor);
    }
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

    // Unele nu se cumpara: primul rang vine dintr-o misiune data tot
    // de antrenor. Dupa ce l-ai primit, rangurile urmatoare se invata
    // normal, cu bani, ca la orice alta abilitate.
    if (ab.prinQuest && acum === 0) return;

    // Si unele tin de rasa ta, nu doar de clasa.
    if (ab.rasa && ab.rasa !== personajul.idRasa) return;

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
  if (ab.rasa && ab.rasa !== personajul.idRasa) return null;

  const acum = (personajul.stiute || {})[id] || 0;
  if (rang !== acum + 1 || rang > ab.ranguri) return null;
  if (ab.prinQuest && acum === 0) return null;       // primul rang vine din misiune

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


// Abilitatile clasei tale care NU se cumpara si pe care nu le ai
// inca. Le aratam la antrenor, scrise stins, ca sa stii ca exista
// si ca se primesc dintr-o misiune - nu sa te intrebi de ce lipsesc.
function abilitatilePrinQuest(personajul) {
  const stiute = personajul.stiute || {};
  return abilitatileClasei(personajul.idClasa).filter(function (ab) {
    return ab.prinQuest && !stiute[ab.id];
  });
}


// Abilitatea primita de-a gata, la capatul unei misiuni. Nu costa
// bani si nu cere nivel: daca ai dus misiunea la bun sfarsit, ai
// meritat-o. Da inapoi abilitatea, ca s-o putem arata in fereastra.
function daruiesteAbilitatea(personajul, id) {

  const ab = gasesteAbilitatea(id);
  if (!ab || ab.clasa !== personajul.idClasa) return null;
  if (ab.rasa && ab.rasa !== personajul.idRasa) return null;

  personajul.stiute = personajul.stiute || {};
  if (personajul.stiute[id]) return null;             // o ai deja

  personajul.stiute[id] = 1;
  asazaPeBaraDacaIncape(personajul, id);

  return abilitateaLaRang(ab, 1);
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
    if (ab.rasa) return;                    // rasialele vin la nivelul 10
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
    if (ab.rasa && ab.rasa !== personajul.idRasa) return;
    const r = rangulPosibil(ab, personajul.nivel);
    if (r > 0) stiute[ab.id] = r;
  });
  return stiute;
}
