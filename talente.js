// ==========================================================
//  TALENTELE
//
//  Mecanica e cea din WoW Classic:
//    - primul punct la nivelul 10, cate unul pe nivel, 51 la 60
//    - fiecare clasa are TREI arbori
//    - un arbore are TREPTE; treapta se deschide dupa cate puncte
//      ai pus in arborele ALA (0, 5, 10, 15, 20)
//    - un talent are mai multe ranguri (de ex. 0/5)
//    - unele talente cer altul dinainte, luat pe tot
//    - poti reseta tot si primesti punctele inapoi
//
//  Talentele in sine sunt scrise de noi. Fiecare are un EFECT
//  care se simte in joc - nu sunt doar text.
//
//  Efectele care se pot folosi:
//    dmgArma       - damage-ul cu arma, in procente
//    dmgAbilitate  - damage-ul abilitatilor, in procente
//    critic        - sansa de critical, in puncte de procent
//    viteza        - cat de des lovesti, in procente
//    viata         - viata maxima, in procente
//    armura        - armura, in procente
//    damageIncasat - cat damage primesti, in procente MAI PUTIN
//    costResursa   - cat costa abilitatile, in procente MAI PUTIN
//    pauza         - pauza abilitatilor, in procente MAI PUTIN
//    regen         - regenerarea in afara luptei, in procente
//    vindecare     - cat vindeca abilitatile, in procente
//    dodge         - sansa de a evita o lovitura, in puncte de procent
//
//  treapta:  0 = mereu deschisa, 1 = cere 5 puncte in arbore,
//            2 = cere 10, 3 = cere 15, 4 = cere 20
//  cere:     id-ul talentului care trebuie luat pe tot inainte
// ==========================================================

const PUNCTE_PE_TREAPTA = 5;

const TALENTE = {

  warrior: [
    {
      id: 'arme', nume: 'Bladework',
      talente: [
        { id: 'taisAscutit', nume: 'Honed Edge', treapta: 0, maxRang: 5,
          efect: 'dmgArma', valoare: 2,
          descriere: 'Weapon damage increased by {v}%' },
        { id: 'manaSigura', nume: 'Steady Grip', treapta: 0, maxRang: 3,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'bratRepede', nume: 'Quick Arm', treapta: 1, maxRang: 5,
          efect: 'viteza', valoare: 2,
          descriere: 'You strike {v}% more often' },
        { id: 'taieturiAdanci', nume: 'Deep Cuts', treapta: 1, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 5, cere: 'taisAscutit',
          descriere: 'Ability damage increased by {v}%' },
        { id: 'neindurator', nume: 'Ruthless', treapta: 2, maxRang: 5,
          efect: 'dmgArma', valoare: 2,
          descriere: 'Weapon damage increased by {v}%' },
        { id: 'ochiDeCalau', nume: 'Executioner', treapta: 3, maxRang: 3,
          efect: 'critic', valoare: 2,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'furtunaDeLame', nume: 'Bladestorm', treapta: 4, maxRang: 1,
          efect: 'dmgAbilitate', valoare: 30, cere: 'ochiDeCalau',
          descriere: 'Ability damage increased by {v}%' }
      ]
    },
    {
      id: 'aparare', nume: 'Bulwark',
      talente: [
        { id: 'pieleTare', nume: 'Toughened Hide', treapta: 0, maxRang: 5,
          efect: 'armura', valoare: 4,
          descriere: 'Armor increased by {v}%' },
        { id: 'trupVanjos', nume: 'Hardened Body', treapta: 0, maxRang: 5,
          efect: 'viata', valoare: 2,
          descriere: 'Maximum health increased by {v}%' },
        { id: 'incasare', nume: 'Absorb Blow', treapta: 1, maxRang: 5,
          efect: 'damageIncasat', valoare: 2,
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'picioareSigure', nume: 'Sure Footing', treapta: 2, maxRang: 3,
          efect: 'dodge', valoare: 1,
          descriere: 'Dodge chance increased by {v}%' },
        { id: 'vointa', nume: 'Iron Will', treapta: 2, maxRang: 5,
          efect: 'viata', valoare: 2, cere: 'trupVanjos',
          descriere: 'Maximum health increased by {v}%' },
        { id: 'zidDeOtel', nume: 'Wall of Steel', treapta: 3, maxRang: 3,
          efect: 'damageIncasat', valoare: 3, cere: 'incasare',
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'nemuritor', nume: 'Unbreakable', treapta: 4, maxRang: 1,
          efect: 'viata', valoare: 15,
          descriere: 'Maximum health increased by {v}%' }
      ]
    },
    {
      id: 'furie', nume: 'Fury',
      talente: [
        { id: 'sangeFierbinte', nume: 'Hot Blood', treapta: 0, maxRang: 5,
          efect: 'regen', valoare: 6,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'lovituriIeftine', nume: 'Cheap Blows', treapta: 0, maxRang: 5,
          efect: 'costResursa', valoare: 4,
          descriere: 'Abilities cost {v}% less' },
        { id: 'rasuflare', nume: 'Second Wind', treapta: 1, maxRang: 3,
          efect: 'pauza', valoare: 6,
          descriere: 'Ability cooldowns are {v}% shorter' },
        { id: 'turbare', nume: 'Frenzy', treapta: 2, maxRang: 5,
          efect: 'viteza', valoare: 2, cere: 'sangeFierbinte',
          descriere: 'You strike {v}% more often' },
        { id: 'setelDeSange', nume: 'Bloodthirst', treapta: 3, maxRang: 3,
          efect: 'dmgArma', valoare: 3,
          descriere: 'Weapon damage increased by {v}%' },
        { id: 'nebunie', nume: 'Reckless Rage', treapta: 3, maxRang: 2,
          efect: 'critic', valoare: 2,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'urletDeLupta', nume: 'War Cry', treapta: 4, maxRang: 1,
          efect: 'dmgArma', valoare: 12, cere: 'setelDeSange',
          descriere: 'Weapon damage increased by {v}%' }
      ]
    }
  ],

  hunter: [
    {
      id: 'tras', nume: 'Marksmanship',
      talente: [
        { id: 'ochiSigur', nume: 'Steady Aim', treapta: 0, maxRang: 5,
          efect: 'dmgArma', valoare: 2,
          descriere: 'Ranged damage increased by {v}%' },
        { id: 'coardaIntinsa', nume: 'Taut String', treapta: 0, maxRang: 5,
          efect: 'viteza', valoare: 2,
          descriere: 'You shoot {v}% more often' },
        { id: 'varfAscutit', nume: 'Barbed Tips', treapta: 1, maxRang: 3,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'sagetiGrele', nume: 'Heavy Arrows', treapta: 1, maxRang: 5,
          efect: 'dmgArma', valoare: 2, cere: 'ochiSigur',
          descriere: 'Ranged damage increased by {v}%' },
        { id: 'tinta', nume: 'Dead Eye', treapta: 2, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 6,
          descriere: 'Ability damage increased by {v}%' },
        { id: 'incordare', nume: 'Rapid Draw', treapta: 3, maxRang: 3,
          efect: 'pauza', valoare: 8,
          descriere: 'Ability cooldowns are {v}% shorter' },
        { id: 'lovituraPerfecta', nume: 'Perfect Shot', treapta: 4, maxRang: 1,
          efect: 'critic', valoare: 6, cere: 'tinta',
          descriere: 'Critical chance increased by {v}%' }
      ]
    },
    {
      id: 'salbaticie', nume: 'Wilderness',
      talente: [
        { id: 'piele', nume: 'Weathered Skin', treapta: 0, maxRang: 5,
          efect: 'armura', valoare: 4,
          descriere: 'Armor increased by {v}%' },
        { id: 'suflu', nume: 'Long Breath', treapta: 0, maxRang: 5,
          efect: 'viata', valoare: 2,
          descriere: 'Maximum health increased by {v}%' },
        { id: 'pasUsor', nume: 'Light Step', treapta: 1, maxRang: 3,
          efect: 'dodge', valoare: 1,
          descriere: 'Dodge chance increased by {v}%' },
        { id: 'traiInSalbaticie', nume: 'Live Off the Land', treapta: 2, maxRang: 5,
          efect: 'regen', valoare: 6,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'calit', nume: 'Hardened', treapta: 2, maxRang: 5,
          efect: 'damageIncasat', valoare: 2, cere: 'piele',
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'instinct', nume: 'Beast Instinct', treapta: 3, maxRang: 3,
          efect: 'dodge', valoare: 1, cere: 'pasUsor',
          descriere: 'Dodge chance increased by {v}%' },
        { id: 'stapanulSalbaticiei', nume: 'Lord of the Wild', treapta: 4, maxRang: 1,
          efect: 'viata', valoare: 15,
          descriere: 'Maximum health increased by {v}%' }
      ]
    },
    {
      id: 'viclenie', nume: 'Cunning',
      talente: [
        { id: 'economie', nume: 'Frugal', treapta: 0, maxRang: 5,
          efect: 'costResursa', valoare: 4,
          descriere: 'Abilities cost {v}% less' },
        { id: 'minteLimpede', nume: 'Clear Mind', treapta: 0, maxRang: 5,
          efect: 'regen', valoare: 6,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'capcane', nume: 'Trapper', treapta: 1, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 5,
          descriere: 'Ability damage increased by {v}%' },
        { id: 'rabdare', nume: 'Patience', treapta: 2, maxRang: 3,
          efect: 'pauza', valoare: 7, cere: 'capcane',
          descriere: 'Ability cooldowns are {v}% shorter' },
        { id: 'siretenie', nume: 'Guile', treapta: 2, maxRang: 5,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'lovituraPeLaSpate', nume: 'Ambush', treapta: 3, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 7,
          descriere: 'Ability damage increased by {v}%' },
        { id: 'maiestrie', nume: 'Master Hunter', treapta: 4, maxRang: 1,
          efect: 'dmgArma', valoare: 12,
          descriere: 'Ranged damage increased by {v}%' }
      ]
    }
  ],

  mage: [
    {
      id: 'foc', nume: 'Destruction',
      talente: [
        { id: 'flacaraVie', nume: 'Living Flame', treapta: 0, maxRang: 5,
          efect: 'dmgAbilitate', valoare: 3,
          descriere: 'Spell damage increased by {v}%' },
        { id: 'scanteie', nume: 'Spark', treapta: 0, maxRang: 3,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'incantareScurta', nume: 'Swift Casting', treapta: 1, maxRang: 5,
          efect: 'pauza', valoare: 5,
          descriere: 'Spell cooldowns are {v}% shorter' },
        { id: 'arderePrelunga', nume: 'Lingering Burn', treapta: 1, maxRang: 5,
          efect: 'dmgAbilitate', valoare: 3, cere: 'flacaraVie',
          descriere: 'Spell damage increased by {v}%' },
        { id: 'explozie', nume: 'Detonation', treapta: 2, maxRang: 3,
          efect: 'critic', valoare: 2,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'putereBruta', nume: 'Raw Power', treapta: 3, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 5,
          descriere: 'Spell damage increased by {v}%' },
        { id: 'cataclism', nume: 'Cataclysm', treapta: 4, maxRang: 1,
          efect: 'dmgAbilitate', valoare: 25, cere: 'putereBruta',
          descriere: 'Spell damage increased by {v}%' }
      ]
    },
    {
      id: 'arcan', nume: 'Arcane',
      talente: [
        { id: 'fantana', nume: 'Deep Well', treapta: 0, maxRang: 5,
          efect: 'regen', valoare: 8,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'cumpatare', nume: 'Temperance', treapta: 0, maxRang: 5,
          efect: 'costResursa', valoare: 4,
          descriere: 'Spells cost {v}% less' },
        { id: 'concentrare', nume: 'Focus', treapta: 1, maxRang: 3,
          efect: 'pauza', valoare: 6,
          descriere: 'Spell cooldowns are {v}% shorter' },
        { id: 'scutIntarit', nume: 'Reinforced Barrier', treapta: 2, maxRang: 5,
          efect: 'damageIncasat', valoare: 2,
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'izvor', nume: 'Wellspring', treapta: 2, maxRang: 5,
          efect: 'regen', valoare: 8, cere: 'fantana',
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'echilibru', nume: 'Equilibrium', treapta: 3, maxRang: 3,
          efect: 'costResursa', valoare: 5, cere: 'cumpatare',
          descriere: 'Spells cost {v}% less' },
        { id: 'nesecat', nume: 'Boundless', treapta: 4, maxRang: 1,
          efect: 'costResursa', valoare: 20,
          descriere: 'Spells cost {v}% less' }
      ]
    },
    {
      id: 'ocrotire', nume: 'Warding',
      talente: [
        { id: 'roba', nume: 'Woven Robes', treapta: 0, maxRang: 5,
          efect: 'armura', valoare: 5,
          descriere: 'Armor increased by {v}%' },
        { id: 'trupFragil', nume: 'Frail No More', treapta: 0, maxRang: 5,
          efect: 'viata', valoare: 2,
          descriere: 'Maximum health increased by {v}%' },
        { id: 'pasLateral', nume: 'Sidestep', treapta: 1, maxRang: 3,
          efect: 'dodge', valoare: 1,
          descriere: 'Dodge chance increased by {v}%' },
        { id: 'pavaza', nume: 'Aegis', treapta: 2, maxRang: 5,
          efect: 'damageIncasat', valoare: 2, cere: 'roba',
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'linisteInterioara', nume: 'Inner Calm', treapta: 2, maxRang: 3,
          efect: 'regen', valoare: 7,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'ocrotire', nume: 'Warded', treapta: 3, maxRang: 3,
          efect: 'viata', valoare: 3, cere: 'trupFragil',
          descriere: 'Maximum health increased by {v}%' },
        { id: 'invulnerabil', nume: 'Untouchable', treapta: 4, maxRang: 1,
          efect: 'damageIncasat', valoare: 12,
          descriere: 'Damage taken reduced by {v}%' }
      ]
    }
  ],

  priest: [
    {
      id: 'lumina', nume: 'Light',
      talente: [
        { id: 'mainiCalde', nume: 'Warm Hands', treapta: 0, maxRang: 5,
          efect: 'vindecare', valoare: 4,
          descriere: 'Healing increased by {v}%' },
        { id: 'rugaScurta', nume: 'Short Prayer', treapta: 0, maxRang: 5,
          efect: 'costResursa', valoare: 4,
          descriere: 'Spells cost {v}% less' },
        { id: 'binecuvantare', nume: 'Blessing', treapta: 1, maxRang: 3,
          efect: 'pauza', valoare: 7,
          descriere: 'Spell cooldowns are {v}% shorter' },
        { id: 'maniLuminate', nume: 'Radiant Touch', treapta: 2, maxRang: 5,
          efect: 'vindecare', valoare: 4, cere: 'mainiCalde',
          descriere: 'Healing increased by {v}%' },
        { id: 'credinta', nume: 'Faith', treapta: 2, maxRang: 3,
          efect: 'regen', valoare: 7,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'har', nume: 'Grace', treapta: 3, maxRang: 3,
          efect: 'vindecare', valoare: 5,
          descriere: 'Healing increased by {v}%' },
        { id: 'miracol', nume: 'Miracle', treapta: 4, maxRang: 1,
          efect: 'vindecare', valoare: 25, cere: 'har',
          descriere: 'Healing increased by {v}%' }
      ]
    },
    {
      id: 'umbra', nume: 'Shadow',
      talente: [
        { id: 'umbraTaioasa', nume: 'Cutting Shadow', treapta: 0, maxRang: 5,
          efect: 'dmgAbilitate', valoare: 3,
          descriere: 'Spell damage increased by {v}%' },
        { id: 'soapta', nume: 'Whisper', treapta: 0, maxRang: 3,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'intuneric', nume: 'Gathering Dark', treapta: 1, maxRang: 5,
          efect: 'dmgAbilitate', valoare: 3, cere: 'umbraTaioasa',
          descriere: 'Spell damage increased by {v}%' },
        { id: 'valDeUmbra', nume: 'Shadow Veil', treapta: 2, maxRang: 3,
          efect: 'dodge', valoare: 1,
          descriere: 'Dodge chance increased by {v}%' },
        { id: 'chinuire', nume: 'Torment', treapta: 2, maxRang: 5,
          efect: 'critic', valoare: 1,
          descriere: 'Critical chance increased by {v}%' },
        { id: 'bezna', nume: 'Deep Night', treapta: 3, maxRang: 3,
          efect: 'dmgAbilitate', valoare: 6, cere: 'intuneric',
          descriere: 'Spell damage increased by {v}%' },
        { id: 'stapanulUmbrei', nume: 'Shadowlord', treapta: 4, maxRang: 1,
          efect: 'dmgAbilitate', valoare: 25,
          descriere: 'Spell damage increased by {v}%' }
      ]
    },
    {
      id: 'disciplina', nume: 'Discipline',
      talente: [
        { id: 'trupCalit', nume: 'Tempered Body', treapta: 0, maxRang: 5,
          efect: 'viata', valoare: 2,
          descriere: 'Maximum health increased by {v}%' },
        { id: 'vesminte', nume: 'Blessed Vestments', treapta: 0, maxRang: 5,
          efect: 'armura', valoare: 5,
          descriere: 'Armor increased by {v}%' },
        { id: 'stapanireDeSine', nume: 'Composure', treapta: 1, maxRang: 5,
          efect: 'damageIncasat', valoare: 2,
          descriere: 'Damage taken reduced by {v}%' },
        { id: 'meditatie', nume: 'Meditation', treapta: 2, maxRang: 5,
          efect: 'regen', valoare: 8,
          descriere: 'Out of combat recovery increased by {v}%' },
        { id: 'tarie', nume: 'Fortitude', treapta: 2, maxRang: 3,
          efect: 'viata', valoare: 3, cere: 'trupCalit',
          descriere: 'Maximum health increased by {v}%' },
        { id: 'cumpat', nume: 'Restraint', treapta: 3, maxRang: 3,
          efect: 'costResursa', valoare: 5,
          descriere: 'Spells cost {v}% less' },
        { id: 'neclintit', nume: 'Steadfast', treapta: 4, maxRang: 1,
          efect: 'damageIncasat', valoare: 12, cere: 'stapanireDeSine',
          descriere: 'Damage taken reduced by {v}%' }
      ]
    }
  ]
};


// ==========================================================
//  REGULILE
// ==========================================================

// Arborii clasei tale.
function arboriiClasei(idClasa) {
  return TALENTE[idClasa] || [];
}

// Cate puncte ai pus intr-un arbore anume.
function puncteInArbore(talente, arbore) {
  let total = 0;
  arbore.talente.forEach(function (t) { total += (talente[t.id] || 0); });
  return total;
}

// Cate puncte ai cheltuit in total.
function puncteCheltuite(idClasa, talente) {
  let total = 0;
  arboriiClasei(idClasa).forEach(function (a) { total += puncteInArbore(talente, a); });
  return total;
}

// Cate puncte iti mai raman de cheltuit.
function puncteRamase(personajul) {
  return personajul.puncteTalent - puncteCheltuite(personajul.idClasa, personajul.talente || {});
}

// Gaseste un talent dupa id, impreuna cu arborele lui.
function gasesteTalent(idClasa, idTalent) {
  const arbori = arboriiClasei(idClasa);
  for (const arbore of arbori) {
    for (const t of arbore.talente) {
      if (t.id === idTalent) return { talent: t, arbore: arbore };
    }
  }
  return null;
}

// Poti pune un punct in talentul asta? Da inapoi motivul, daca nu.
function poateInvata(personajul, idTalent) {

  const gasit = gasesteTalent(personajul.idClasa, idTalent);
  if (!gasit) return { poate: false, motiv: 'talentul nu exista' };

  const talente = personajul.talente || {};
  const rangAcum = talente[idTalent] || 0;

  if (rangAcum >= gasit.talent.maxRang) return { poate: false, motiv: 'e deja pe tot' };
  if (puncteRamase(personajul) <= 0) return { poate: false, motiv: 'nu mai ai puncte' };

  // Treapta se deschide dupa cate puncte ai in ACEST arbore.
  const inArbore = puncteInArbore(talente, gasit.arbore);
  const cerute = gasit.talent.treapta * PUNCTE_PE_TREAPTA;
  if (inArbore < cerute) {
    return { poate: false, motiv: 'iti trebuie ' + cerute + ' puncte in acest arbore' };
  }

  // Talentul dinainte, daca e cerut, trebuie luat pe tot.
  if (gasit.talent.cere) {
    const inainte = gasesteTalent(personajul.idClasa, gasit.talent.cere);
    if (!inainte || (talente[gasit.talent.cere] || 0) < inainte.talent.maxRang) {
      return { poate: false, motiv: 'trebuie intai ' + (inainte ? inainte.talent.nume : '?') + ' pe tot' };
    }
  }

  return { poate: true };
}

// Pune un punct. Da inapoi true daca a mers.
function invataTalent(personajul, idTalent) {
  if (!poateInvata(personajul, idTalent).poate) return false;
  personajul.talente = personajul.talente || {};
  personajul.talente[idTalent] = (personajul.talente[idTalent] || 0) + 1;
  return true;
}

// Sterge tot si primesti punctele inapoi.
function reseteazaTalentele(personajul) {
  personajul.talente = {};
}

// Cat aduna, in total, un efect anume din toate talentele luate.
// De exemplu bonusTalent(p, 'dmgArma') = 10 inseamna +10% damage cu arma.
function bonusTalent(personajul, efect) {
  const talente = personajul.talente || {};
  let total = 0;
  arboriiClasei(personajul.idClasa).forEach(function (arbore) {
    arbore.talente.forEach(function (t) {
      if (t.efect === efect) total += (talente[t.id] || 0) * t.valoare;
    });
  });
  return total;
}

// Acelasi lucru, dar ca inmultitor: 12% -> 1.12
function inmultitorTalent(personajul, efect) {
  return 1 + bonusTalent(personajul, efect) / 100;
}

// ...si ca reducere: 12% mai putin -> 0.88
function reducereTalent(personajul, efect) {
  return Math.max(0.1, 1 - bonusTalent(personajul, efect) / 100);
}

// Textul unui talent, cu cifra pusa la locul ei pentru rangul dat.
function descriereTalent(talent, rang) {
  const valoare = talent.valoare * Math.max(1, rang);
  return talent.descriere.replace('{v}', valoare);
}
