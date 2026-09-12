// ==========================================================
//  RETETELE
//
//  Ce se poate face din materiale. Tot ce e aici sunt DATE: ca sa
//  adaugi o reteta noua, scrii un rand in lista de mai jos si ai
//  terminat - nu se atinge nimeni de cod.
//
//  O reteta are:
//    id        - nume scurt, neutru, dupa care o cauta jocul
//    meserie   - a cui e
//    nume      - ce scrie in fereastra
//    cere      - materialele: [{ nume, cate }]
//    statie    - 'Anvil', 'Cookfire', 'Rune Table' sau null
//    praguri   - portocaliu / galben / verde / gri (ca la noduri)
//    face      - ce iese din ea (vezi mai jos)
//    invatataLa- de la ce skill ti-o da antrenorul
//
//  CE POATE IESI DINTR-O RETETA
//    { fel: 'material',    nume, valoare, cate }
//    { fel: 'echipament',  slot, nivel, raritate }
//    { fel: 'consumabil',  nume, efect, ... }
//
//  Un consumabil se foloseste din rucsac, apasandu-l. Efectele
//  sunt cele pe care motorul le stie deja:
//    'vindecare' - te vindeca pe loc
//    'alinare'   - te vindeca putin cate putin (bandajele)
//    'intarire'  - te intareste o vreme (mancarea)
// ==========================================================


const RETETE = [

  // ==========================================================
  //  SMITHING - din minereu iese metal, si din metal fier de purtat
  // ==========================================================
  {
    id: 'smith_ingot_01', meserie: 'smithing', nume: 'Dull Ingot',
    cere: [{ nume: 'Dull Ore', cate: 2 }], statie: 'Anvil',
    praguri: { portocaliu: 1, galben: 20, verde: 40, gri: 65 },
    face: { fel: 'material', nume: 'Dull Ingot', valoare: 11, cate: 1 },
    invatataLa: 1
  },
  {
    id: 'smith_helm_01', meserie: 'smithing', nume: 'Plain Helm',
    cere: [{ nume: 'Dull Ingot', cate: 3 }], statie: 'Anvil',
    praguri: { portocaliu: 20, galben: 45, verde: 65, gri: 90 },
    face: { fel: 'echipament', slot: 'cap', nivel: 8, raritate: 'comun' },
    invatataLa: 20
  },
  {
    id: 'smith_blade_01', meserie: 'smithing', nume: 'Plain Blade',
    cere: [{ nume: 'Dull Ingot', cate: 4 }], statie: 'Anvil',
    praguri: { portocaliu: 35, galben: 60, verde: 80, gri: 105 },
    face: { fel: 'echipament', slot: 'armaPrincipala', nivel: 12, raritate: 'comun' },
    invatataLa: 35
  },
  {
    id: 'smith_ingot_02', meserie: 'smithing', nume: 'Bright Ingot',
    cere: [{ nume: 'Bright Ore', cate: 2 }], statie: 'Anvil',
    praguri: { portocaliu: 75, galben: 95, verde: 115, gri: 140 },
    face: { fel: 'material', nume: 'Bright Ingot', valoare: 30, cate: 1 },
    invatataLa: 75
  },
  {
    id: 'smith_chest_01', meserie: 'smithing', nume: 'Fine Breastplate',
    cere: [{ nume: 'Bright Ingot', cate: 5 }, { nume: 'Cured Leather', cate: 2 }],
    statie: 'Anvil',
    praguri: { portocaliu: 110, galben: 135, verde: 155, gri: 180 },
    face: { fel: 'echipament', slot: 'piept', nivel: 24, raritate: 'bun' },
    invatataLa: 110
  },
  {
    id: 'smith_ingot_03', meserie: 'smithing', nume: 'Deep Ingot',
    cere: [{ nume: 'Deep Ore', cate: 2 }], statie: 'Anvil',
    praguri: { portocaliu: 150, galben: 170, verde: 190, gri: 215 },
    face: { fel: 'material', nume: 'Deep Ingot', valoare: 62, cate: 1 },
    invatataLa: 150
  },
  {
    id: 'smith_blade_02', meserie: 'smithing', nume: 'Keen Blade',
    cere: [{ nume: 'Deep Ingot', cate: 6 }], statie: 'Anvil',
    praguri: { portocaliu: 185, galben: 210, verde: 230, gri: 255 },
    face: { fel: 'echipament', slot: 'armaPrincipala', nivel: 40, raritate: 'bun' },
    invatataLa: 185
  },
  {
    id: 'smith_blade_03', meserie: 'smithing', nume: 'Storied Blade',
    cere: [{ nume: 'Rich Ore', cate: 4 }, { nume: 'Deep Ingot', cate: 4 }],
    statie: 'Anvil',
    praguri: { portocaliu: 240, galben: 265, verde: 285, gri: 300 },
    face: { fel: 'echipament', slot: 'armaPrincipala', nivel: 55, raritate: 'rar' },
    invatataLa: 240
  },


  // ==========================================================
  //  TANNING - din piele bruta iese piele buna, si din ea haine
  // ==========================================================
  {
    id: 'tan_leather_01', meserie: 'tanning', nume: 'Cured Leather',
    cere: [{ nume: 'Raw Hide', cate: 2 }], statie: null,
    praguri: { portocaliu: 1, galben: 20, verde: 40, gri: 65 },
    face: { fel: 'material', nume: 'Cured Leather', valoare: 10, cate: 1 },
    invatataLa: 1
  },
  {
    id: 'tan_boots_01', meserie: 'tanning', nume: 'Plain Boots',
    cere: [{ nume: 'Cured Leather', cate: 3 }], statie: null,
    praguri: { portocaliu: 20, galben: 45, verde: 65, gri: 90 },
    face: { fel: 'echipament', slot: 'talpi', nivel: 9, raritate: 'comun' },
    invatataLa: 20
  },
  {
    id: 'tan_gloves_01', meserie: 'tanning', nume: 'Plain Gloves',
    cere: [{ nume: 'Cured Leather', cate: 3 }], statie: null,
    praguri: { portocaliu: 40, galben: 65, verde: 85, gri: 110 },
    face: { fel: 'echipament', slot: 'maini', nivel: 14, raritate: 'comun' },
    invatataLa: 40
  },
  {
    id: 'tan_chest_01', meserie: 'tanning', nume: 'Fine Jerkin',
    cere: [{ nume: 'Cured Leather', cate: 6 }], statie: null,
    praguri: { portocaliu: 100, galben: 125, verde: 145, gri: 170 },
    face: { fel: 'echipament', slot: 'piept', nivel: 22, raritate: 'bun' },
    invatataLa: 100
  },
  {
    id: 'tan_legs_01', meserie: 'tanning', nume: 'Keen Greaves',
    cere: [{ nume: 'Cured Leather', cate: 8 }, { nume: 'Coarse Cloth', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 180, galben: 205, verde: 225, gri: 250 },
    face: { fel: 'echipament', slot: 'picioare', nivel: 38, raritate: 'bun' },
    invatataLa: 180
  },


  // ==========================================================
  //  WEAVING - panza, luata de la umanoizi
  // ==========================================================
  {
    id: 'weave_bolt_01', meserie: 'weaving', nume: 'Cloth Bolt',
    cere: [{ nume: 'Coarse Cloth', cate: 3 }], statie: null,
    praguri: { portocaliu: 1, galben: 20, verde: 40, gri: 65 },
    face: { fel: 'material', nume: 'Cloth Bolt', valoare: 14, cate: 1 },
    invatataLa: 1
  },
  {
    id: 'weave_back_01', meserie: 'weaving', nume: 'Plain Cloak',
    cere: [{ nume: 'Cloth Bolt', cate: 2 }], statie: null,
    praguri: { portocaliu: 25, galben: 50, verde: 70, gri: 95 },
    face: { fel: 'echipament', slot: 'spate', nivel: 10, raritate: 'comun' },
    invatataLa: 25
  },
  {
    id: 'weave_chest_01', meserie: 'weaving', nume: 'Fine Robe',
    cere: [{ nume: 'Cloth Bolt', cate: 5 }], statie: null,
    praguri: { portocaliu: 90, galben: 115, verde: 135, gri: 160 },
    face: { fel: 'echipament', slot: 'piept', nivel: 20, raritate: 'bun' },
    invatataLa: 90
  },
  {
    id: 'weave_bandage_cloth', meserie: 'weaving', nume: 'Clean Wrapping',
    cere: [{ nume: 'Coarse Cloth', cate: 2 }], statie: null,
    praguri: { portocaliu: 45, galben: 70, verde: 90, gri: 115 },
    face: { fel: 'material', nume: 'Clean Wrapping', valoare: 9, cate: 2 },
    invatataLa: 45
  },
  {
    id: 'weave_legs_01', meserie: 'weaving', nume: 'Keen Leggings',
    cere: [{ nume: 'Cloth Bolt', cate: 7 }, { nume: 'Nightbloom', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 170, galben: 195, verde: 215, gri: 240 },
    face: { fel: 'echipament', slot: 'picioare', nivel: 36, raritate: 'bun' },
    invatataLa: 170
  },


  // ==========================================================
  //  BREWING - din plante ies bauturi
  // ==========================================================
  {
    id: 'brew_heal_01', meserie: 'brewing', nume: 'Small Healing Draught',
    cere: [{ nume: 'Fieldleaf', cate: 2 }], statie: null,
    praguri: { portocaliu: 1, galben: 25, verde: 45, gri: 70 },
    face: { fel: 'consumabil', nume: 'Small Healing Draught', valoare: 18,
            efect: 'vindecare', cat: 60,
            descriere: 'Drink to close your wounds at once.' },
    invatataLa: 1
  },
  {
    id: 'brew_mana_01', meserie: 'brewing', nume: 'Small Clearwater',
    cere: [{ nume: 'Fieldleaf', cate: 3 }], statie: null,
    praguri: { portocaliu: 30, galben: 55, verde: 75, gri: 100 },
    face: { fel: 'consumabil', nume: 'Small Clearwater', valoare: 22,
            efect: 'mana', cat: 80,
            descriere: 'Drink to get your thinking back.' },
    invatataLa: 30
  },
  {
    id: 'brew_heal_02', meserie: 'brewing', nume: 'Healing Draught',
    cere: [{ nume: 'Nightbloom', cate: 3 }], statie: null,
    praguri: { portocaliu: 90, galben: 115, verde: 135, gri: 160 },
    face: { fel: 'consumabil', nume: 'Healing Draught', valoare: 52,
            efect: 'vindecare', cat: 260,
            descriere: 'A deeper draught. Closes a great deal at once.' },
    invatataLa: 90
  },
  {
    id: 'brew_str_01', meserie: 'brewing', nume: 'Draught of Might',
    cere: [{ nume: 'Nightbloom', cate: 2 }, { nume: 'Mistleaf', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 150, galben: 175, verde: 195, gri: 225 },
    face: { fel: 'consumabil', nume: 'Draught of Might', valoare: 90,
            efect: 'intarire', tine: 600000, da: { str: 12 },
            descriere: 'Strength rises for ten minutes.' },
    invatataLa: 150
  },
  {
    id: 'brew_heal_03', meserie: 'brewing', nume: 'Deep Healing Draught',
    cere: [{ nume: 'Emberroot', cate: 2 }, { nume: 'Mistleaf', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 220, galben: 245, verde: 265, gri: 295 },
    face: { fel: 'consumabil', nume: 'Deep Healing Draught', valoare: 180,
            efect: 'vindecare', cat: 900,
            descriere: 'The strongest thing anyone here knows how to brew.' },
    invatataLa: 220
  },


  // ==========================================================
  //  RUNECARVING - semne taiate in metal si piatra
  // ==========================================================
  {
    id: 'rune_dust_01', meserie: 'runecarving', nume: 'Sigil Dust',
    cere: [{ nume: 'Dull Ingot', cate: 1 }], statie: 'Rune Table',
    praguri: { portocaliu: 1, galben: 20, verde: 40, gri: 65 },
    face: { fel: 'material', nume: 'Sigil Dust', valoare: 16, cate: 1 },
    invatataLa: 1
  },
  {
    id: 'rune_band_01', meserie: 'runecarving', nume: 'Carved Band',
    cere: [{ nume: 'Sigil Dust', cate: 3 }], statie: 'Rune Table',
    praguri: { portocaliu: 35, galben: 60, verde: 80, gri: 105 },
    face: { fel: 'echipament', slot: 'inel1', nivel: 14, raritate: 'bun' },
    invatataLa: 35
  },
  {
    id: 'rune_charm_01', meserie: 'runecarving', nume: 'Carved Charm',
    cere: [{ nume: 'Sigil Dust', cate: 5 }, { nume: 'Bright Ingot', cate: 1 }],
    statie: 'Rune Table',
    praguri: { portocaliu: 120, galben: 145, verde: 165, gri: 190 },
    face: { fel: 'echipament', slot: 'talisman', nivel: 28, raritate: 'bun' },
    invatataLa: 120
  },
  {
    id: 'rune_amulet_01', meserie: 'runecarving', nume: 'Storied Amulet',
    cere: [{ nume: 'Sigil Dust', cate: 8 }, { nume: 'Deep Ingot', cate: 2 }],
    statie: 'Rune Table',
    praguri: { portocaliu: 210, galben: 235, verde: 255, gri: 285 },
    face: { fel: 'echipament', slot: 'gat', nivel: 48, raritate: 'rar' },
    invatataLa: 210
  },


  // ==========================================================
  //  TINKERING - mecanisme care merg cam de fiecare data
  // ==========================================================
  {
    id: 'tink_bolt_01', meserie: 'tinkering', nume: 'Iron Fitting',
    cere: [{ nume: 'Dull Ingot', cate: 2 }], statie: 'Anvil',
    praguri: { portocaliu: 1, galben: 20, verde: 40, gri: 65 },
    face: { fel: 'material', nume: 'Iron Fitting', valoare: 15, cate: 2 },
    invatataLa: 1
  },
  {
    id: 'tink_belt_01', meserie: 'tinkering', nume: 'Clasped Belt',
    cere: [{ nume: 'Iron Fitting', cate: 4 }, { nume: 'Cured Leather', cate: 2 }],
    statie: 'Anvil',
    praguri: { portocaliu: 40, galben: 65, verde: 85, gri: 110 },
    face: { fel: 'echipament', slot: 'brau', nivel: 16, raritate: 'comun' },
    invatataLa: 40
  },
  {
    id: 'tink_bomb_01', meserie: 'tinkering', nume: 'Rattling Charge',
    cere: [{ nume: 'Iron Fitting', cate: 2 }, { nume: 'Emberroot', cate: 1 }],
    statie: 'Anvil',
    praguri: { portocaliu: 130, galben: 155, verde: 175, gri: 200 },
    face: { fel: 'consumabil', nume: 'Rattling Charge', valoare: 70,
            efect: 'val', raza: 150, dmgMin: 90, dmgMax: 140, culoare: 0xe8862f,
            descriere: 'Throw it down. Everything close by regrets it.' },
    invatataLa: 130
  },
  {
    id: 'tink_trinket_01', meserie: 'tinkering', nume: 'Wound Spring',
    cere: [{ nume: 'Iron Fitting', cate: 6 }, { nume: 'Deep Ingot', cate: 2 }],
    statie: 'Anvil',
    praguri: { portocaliu: 200, galben: 225, verde: 245, gri: 275 },
    face: { fel: 'echipament', slot: 'talisman', nivel: 44, raritate: 'bun' },
    invatataLa: 200
  },


  // ==========================================================
  //  COOKERY - mancare care tine. Cere foc.
  // ==========================================================
  {
    id: 'cook_meat_01', meserie: 'cookery', nume: 'Roast Haunch',
    cere: [{ nume: 'Raw Hide', cate: 1 }], statie: 'Cookfire',
    praguri: { portocaliu: 1, galben: 25, verde: 45, gri: 70 },
    face: { fel: 'consumabil', nume: 'Roast Haunch', valoare: 12,
            efect: 'intarire', tine: 900000, da: { sta: 5 },
            descriere: 'Stamina rises for fifteen minutes.' },
    invatataLa: 1
  },
  {
    id: 'cook_stew_01', meserie: 'cookery', nume: 'Root Stew',
    cere: [{ nume: 'Fieldleaf', cate: 2 }, { nume: 'Raw Hide', cate: 1 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 40, galben: 65, verde: 85, gri: 110 },
    face: { fel: 'consumabil', nume: 'Root Stew', valoare: 26,
            efect: 'intarire', tine: 900000, da: { spi: 8 },
            descriere: 'Spirit rises for fifteen minutes.' },
    invatataLa: 40
  },
  {
    id: 'cook_feast_01', meserie: 'cookery', nume: 'Traveller\'s Plate',
    cere: [{ nume: 'Nightbloom', cate: 1 }, { nume: 'Raw Hide', cate: 2 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 120, galben: 145, verde: 165, gri: 190 },
    face: { fel: 'consumabil', nume: 'Traveller\'s Plate', valoare: 58,
            efect: 'intarire', tine: 900000, da: { sta: 14, spi: 10 },
            descriere: 'Stamina and spirit rise for fifteen minutes.' },
    invatataLa: 120
  },


  // ---- din peste iese mancare buna ----
  {
    id: 'cook_fish_01', meserie: 'cookery', nume: 'Fried Minnow',
    cere: [{ nume: 'Silver Minnow', cate: 2 }], statie: 'Cookfire',
    praguri: { portocaliu: 20, galben: 45, verde: 65, gri: 90 },
    face: { fel: 'consumabil', nume: 'Fried Minnow', valoare: 16,
            efect: 'intarire', tine: 900000, da: { agi: 6 },
            descriere: 'Agility rises for fifteen minutes.' },
    invatataLa: 20
  },
  {
    id: 'cook_fish_02', meserie: 'cookery', nume: 'Pike Steak',
    cere: [{ nume: 'Deepwater Pike', cate: 1 }, { nume: 'Fieldleaf', cate: 1 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 160, galben: 185, verde: 205, gri: 235 },
    face: { fel: 'consumabil', nume: 'Pike Steak', valoare: 74,
            efect: 'intarire', tine: 900000, da: { str: 12, sta: 12 },
            descriere: 'Strength and stamina rise for fifteen minutes.' },
    invatataLa: 160
  },

  // ==========================================================
  //  BANDAGING - legaturi care inchid o rana in mers
  // ==========================================================
  {
    id: 'band_01', meserie: 'bandaging', nume: 'Rough Bandage',
    cere: [{ nume: 'Coarse Cloth', cate: 1 }], statie: null,
    praguri: { portocaliu: 1, galben: 25, verde: 45, gri: 70 },
    face: { fel: 'consumabil', nume: 'Rough Bandage', valoare: 8,
            efect: 'alinare', tine: 8000, laCat: 1000, peTura: 12,
            descriere: 'Binds a wound. It closes while you walk.' },
    invatataLa: 1
  },
  {
    id: 'band_02', meserie: 'bandaging', nume: 'Clean Bandage',
    cere: [{ nume: 'Clean Wrapping', cate: 1 }], statie: null,
    praguri: { portocaliu: 60, galben: 85, verde: 105, gri: 130 },
    face: { fel: 'consumabil', nume: 'Clean Bandage', valoare: 22,
            efect: 'alinare', tine: 8000, laCat: 1000, peTura: 40,
            descriere: 'A proper binding. Closes a great deal.' },
    invatataLa: 60
  },
  {
    id: 'band_03', meserie: 'bandaging', nume: 'Deep Bandage',
    cere: [{ nume: 'Clean Wrapping', cate: 2 }, { nume: 'Mistleaf', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 160, galben: 185, verde: 205, gri: 235 },
    face: { fel: 'consumabil', nume: 'Deep Bandage', valoare: 64,
            efect: 'alinare', tine: 8000, laCat: 1000, peTura: 120,
            descriere: 'For wounds that would otherwise end it.' },
    invatataLa: 160
  },

  // ==========================================================
  //  TREPTELE DE SUS
  //
  //  Pielea si panza urca acum odata cu inamicul de la care vin, iar
  //  minereul si planta au fiecare o treapta in plus. Retetele de
  //  aici sunt ce se face din ele - altfel materialele noi ar fi
  //  stat degeaba in rucsac.
  // ==========================================================

  // ---- pielarie ----
  {
    id: 'tan_leather_02', meserie: 'tanning', nume: 'Heavy Leather',
    cere: [{ nume: 'Thick Hide', cate: 2 }], statie: null,
    praguri: { portocaliu: 75, galben: 100, verde: 125, gri: 165 },
    face: { fel: 'material', nume: 'Heavy Leather', valoare: 24, cate: 1 },
    invatataLa: 75
  },
  {
    id: 'tan_leather_03', meserie: 'tanning', nume: 'Hardened Leather',
    cere: [{ nume: 'Prime Hide', cate: 2 }, { nume: 'Heavy Leather', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 150, galben: 175, verde: 200, gri: 245 },
    face: { fel: 'material', nume: 'Hardened Leather', valoare: 58, cate: 1 },
    invatataLa: 150
  },
  {
    id: 'tan_leather_04', meserie: 'tanning', nume: 'Storied Leather',
    cere: [{ nume: 'Ancient Hide', cate: 3 }, { nume: 'Hardened Leather', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 240, galben: 260, verde: 280, gri: 300 },
    face: { fel: 'material', nume: 'Storied Leather', valoare: 120, cate: 1 },
    invatataLa: 240
  },
  {
    id: 'tan_chest_02', meserie: 'tanning', nume: 'Heavy Jerkin',
    cere: [{ nume: 'Heavy Leather', cate: 5 }, { nume: 'Woven Cloth', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 130, galben: 155, verde: 180, gri: 220 },
    face: { fel: 'echipament', slot: 'piept', nivel: 30, raritate: 'bun' },
    invatataLa: 130
  },
  {
    id: 'tan_chest_03', meserie: 'tanning', nume: 'Storied Hauberk',
    cere: [{ nume: 'Storied Leather', cate: 6 }, { nume: 'Sigil Cloth', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 260, galben: 275, verde: 290, gri: 300 },
    face: { fel: 'echipament', slot: 'piept', nivel: 52, raritate: 'rar' },
    invatataLa: 260
  },

  // ---- tesut ----
  {
    id: 'weave_bolt_02', meserie: 'weaving', nume: 'Fine Bolt',
    cere: [{ nume: 'Woven Cloth', cate: 3 }], statie: null,
    praguri: { portocaliu: 75, galben: 100, verde: 125, gri: 165 },
    face: { fel: 'material', nume: 'Fine Bolt', valoare: 28, cate: 1 },
    invatataLa: 75
  },
  {
    id: 'weave_back_02', meserie: 'weaving', nume: 'Fine Cloak',
    cere: [{ nume: 'Fine Bolt', cate: 3 }, { nume: 'Heavy Leather', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 120, galben: 145, verde: 170, gri: 205 },
    face: { fel: 'echipament', slot: 'spate', nivel: 28, raritate: 'bun' },
    invatataLa: 120
  },
  {
    id: 'weave_bolt_03', meserie: 'weaving', nume: 'Rune Bolt',
    cere: [{ nume: 'Fine Cloth', cate: 3 }, { nume: 'Sigil Dust', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 155, galben: 180, verde: 205, gri: 250 },
    face: { fel: 'material', nume: 'Rune Bolt', valoare: 66, cate: 1 },
    invatataLa: 155
  },
  {
    id: 'weave_robe_02', meserie: 'weaving', nume: 'Rune Robe',
    cere: [{ nume: 'Rune Bolt', cate: 4 }, { nume: 'Mistleaf', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 200, galben: 225, verde: 250, gri: 285 },
    face: { fel: 'echipament', slot: 'piept', nivel: 45, raritate: 'bun' },
    invatataLa: 200
  },
  {
    id: 'weave_robe_03', meserie: 'weaving', nume: 'Sigil Vestment',
    cere: [{ nume: 'Sigil Cloth', cate: 5 }, { nume: 'Rune Bolt', cate: 2 }],
    statie: null,
    praguri: { portocaliu: 255, galben: 275, verde: 290, gri: 300 },
    face: { fel: 'echipament', slot: 'piept', nivel: 54, raritate: 'rar' },
    invatataLa: 255
  },

  // ---- fierarie ----
  {
    id: 'smith_ingot_04', meserie: 'smithing', nume: 'Ember Ingot',
    cere: [{ nume: 'Ember Ore', cate: 2 }], statie: 'Anvil',
    praguri: { portocaliu: 240, galben: 260, verde: 280, gri: 300 },
    face: { fel: 'material', nume: 'Ember Ingot', valoare: 130, cate: 1 },
    invatataLa: 240
  },
  {
    id: 'smith_plate_02', meserie: 'smithing', nume: 'Ember Cuirass',
    cere: [{ nume: 'Ember Ingot', cate: 6 }, { nume: 'Storied Leather', cate: 2 }],
    statie: 'Anvil',
    praguri: { portocaliu: 265, galben: 280, verde: 292, gri: 300 },
    face: { fel: 'echipament', slot: 'piept', nivel: 56, raritate: 'rar' },
    invatataLa: 265
  },

  // ---- fierturi ----
  {
    id: 'brew_heal_04', meserie: 'brewing', nume: 'Emberdraught',
    cere: [{ nume: 'Emberbloom', cate: 2 }, { nume: 'Nightbloom', cate: 1 }],
    statie: null,
    praguri: { portocaliu: 250, galben: 270, verde: 288, gri: 300 },
    face: { fel: 'consumabil', nume: 'Emberdraught', valoare: 140,
            efect: 'vindecare', cat: 900,
            descriere: 'Drink when nothing else is left.' },
    invatataLa: 250
  },

  // ---- bucatarie ----
  {
    id: 'cook_fish_03', meserie: 'cookery', nume: 'Carp Supper',
    cere: [{ nume: 'Reed Carp', cate: 1 }, { nume: 'Fieldleaf', cate: 1 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 60, galben: 85, verde: 110, gri: 140 },
    face: { fel: 'consumabil', nume: 'Carp Supper', valoare: 26,
            efect: 'intarire', tine: 600000, da: { spi: 6 },
            descriere: 'Spirit rises for ten minutes.' },
    invatataLa: 60
  },
  {
    id: 'cook_fish_04', meserie: 'cookery', nume: 'Smoked Eel',
    cere: [{ nume: 'Glass Eel', cate: 1 }, { nume: 'Nightbloom', cate: 1 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 190, galben: 215, verde: 240, gri: 275 },
    face: { fel: 'consumabil', nume: 'Smoked Eel', valoare: 70,
            efect: 'intarire', tine: 600000, da: { int: 10 },
            descriere: 'Intellect rises for ten minutes.' },
    invatataLa: 190
  },
  {
    id: 'cook_meat_02', meserie: 'cookery', nume: 'Ember Roast',
    cere: [{ nume: 'Ancient Hide', cate: 1 }, { nume: 'Emberbloom', cate: 1 }],
    statie: 'Cookfire',
    praguri: { portocaliu: 230, galben: 255, verde: 280, gri: 300 },
    face: { fel: 'consumabil', nume: 'Ember Roast', valoare: 90,
            efect: 'intarire', tine: 600000, da: { sta: 14 },
            descriere: 'Stamina rises for ten minutes.' },
    invatataLa: 230
  }
];



// Dupa ce folosesti un bandaj, nu mai poti pune altul o vreme.
const PAUZA_BANDAJ = 60000;


// ----------------------------------------------------------
//  Cautari
// ----------------------------------------------------------
function reteteleMeseriei(idMeserie) {
  return RETETE.filter(function (r) { return r.meserie === idMeserie; });
}

function gasesteReteta(id) {
  return RETETE.find(function (r) { return r.id === id; }) || null;
}


// ==========================================================
//  DE UNDE VINE O RETETA
//
//  Doua cai, ca in Classic:
//
//    'antrenor' - o cumperi de la antrenorul meseriei, pe bani, cand
//                 ai skill-ul cerut. Asa vin cele mai multe.
//    'obiect'   - vine scrisa pe o foaie. Foaia cade de la inamici
//                 sau se cumpara de la negustorul de materiale din
//                 oras; o apesi in rucsac si o inveti.
//
//  Lista de mai jos e a celor care NU se cumpara de la antrenor.
//  Sunt raspandite peste toate meseriile, ca fiecare meserie sa
//  aiba ceva de cautat, nu doar de platit.
// ==========================================================
const RETETE_DIN_OBIECTE = [
  'smith_blade_02', 'smith_blade_03',
  'tan_legs_01',
  'weave_bandage_cloth', 'weave_legs_01',
  'brew_str_01', 'brew_heal_03',
  'rune_charm_01', 'rune_amulet_01',
  'tink_bomb_01', 'tink_trinket_01',
  'cook_feast_01', 'cook_fish_02',
  'band_03'
];

RETETE.forEach(function (r) {
  r.sursa = RETETE_DIN_OBIECTE.indexOf(r.id) >= 0 ? 'obiect' : 'antrenor';
});


// Cat costa o reteta la antrenor. Creste cu skill-ul cerut, ca sa
// coste mai mult cele de care ai nevoie mai tarziu, cand ai si bani.
function costulRetetei(reteta) {
  return Math.round(5 * Math.pow(Math.max(1, reteta.invatataLa), 1.3));
}


// Retetele cu care pornesti la drum cand inveti meseria. Fara ele
// ai iesi de la antrenor cu o meserie si nimic de facut cu ea.
function reteteleDeStart(idMeserie) {
  return reteteleMeseriei(idMeserie).filter(function (r) {
    return r.sursa === 'antrenor' && r.invatataLa <= 1;
  });
}


function stiiReteta(personajul, id) {
  return !!(personajul.retete || {})[id];
}


// O inveti: ori pe bani la antrenor, ori gratis (de pe o foaie sau
// la inceputul meseriei). Intoarce reteta, sau null daca n-a mers.
function invataReteta(personajul, id, gratis) {

  const r = gasesteReteta(id);
  if (!r) return null;
  if (stiiReteta(personajul, id)) return null;

  if (!gratis) {
    if (r.sursa !== 'antrenor') return null;
    if (!aiMeseria(personajul, r.meserie)) return null;
    if (skillulTau(personajul, r.meserie) < r.invatataLa) return null;

    const cost = costulRetetei(r);
    if ((personajul.bani || 0) < cost) return null;
    personajul.bani -= cost;
  }

  personajul.retete = personajul.retete || {};
  personajul.retete[id] = true;
  return r;
}


// Ce are antrenorul de meserie de vandut acum: retetele pe care nu
// le stii si care vin de la el. Se scriu si cele pe care inca nu le
// poti lua, cu motivul, ca sa vezi ce te asteapta.
function ceTeInvataAntrenorul(personajul, idMeserie) {

  const skill = skillulTau(personajul, idMeserie);

  return reteteleMeseriei(idMeserie)
    .filter(function (r) {
      return r.sursa === 'antrenor' && !stiiReteta(personajul, r.id);
    })
    .map(function (r) {
      const cost = costulRetetei(r);
      return {
        reteta: r, cost: cost,
        preaMic: skill < r.invatataLa,
        faraBani: (personajul.bani || 0) < cost
      };
    })
    .sort(function (a, b) { return a.reteta.invatataLa - b.reteta.invatataLa; });
}


// Retetele pe care le stii intr-o meserie, in ordinea skill-ului.
function reteteleStiute(personajul, idMeserie) {
  return reteteleMeseriei(idMeserie).filter(function (r) {
    return stiiReteta(personajul, r.id);
  });
}


// Cate bucati ai dintr-un material, numarate peste toate gramezile.
function cateAi(personajul, nume) {
  let total = 0;
  (personajul.inventar || []).forEach(function (o) {
    if (o.nume === nume) total += (o.cate || 1);
  });
  return total;
}


function aiMaterialele(personajul, reteta) {
  return reteta.cere.every(function (c) {
    return cateAi(personajul, c.nume) >= c.cate;
  });
}


// Scoate din rucsac materialele cerute. Se cheama DUPA ce s-a
// verificat ca le ai.
function iaMaterialele(personajul, reteta) {
  reteta.cere.forEach(function (c) {
    let ramas = c.cate;
    for (let i = (personajul.inventar || []).length - 1; i >= 0 && ramas > 0; i--) {
      const o = personajul.inventar[i];
      if (o.nume !== c.nume) continue;
      const iau = Math.min(ramas, o.cate || 1);
      o.cate = (o.cate || 1) - iau;
      ramas -= iau;
      if (o.cate <= 0) personajul.inventar.splice(i, 1);
    }
  });
}


// De cate ori la rand se poate face reteta, cu ce ai in rucsac.
function deCateOriPoti(personajul, reteta) {
  let cel = Infinity;
  reteta.cere.forEach(function (c) {
    cel = Math.min(cel, Math.floor(cateAi(personajul, c.nume) / c.cate));
  });
  return (cel === Infinity) ? 0 : cel;
}
