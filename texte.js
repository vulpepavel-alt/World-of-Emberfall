// ==========================================================
//  TOT TEXTUL CARE SE VEDE IN JOC
//
//  Aici stau cuvintele scrise pe ecran, ca sa le gasesti
//  intr-un singur loc. Daca vrei jocul in alta limba,
//  schimbi doar ce e scris intre ghilimele, in dreapta.
//  Numele din stanga (LEVEL, ATTACK) NU se schimba -
//  dupa ele cauta codul.
// ==========================================================

const TEXT = {

  // Numele jocului. Il schimbi aici si se schimba peste tot.
  GAME_TITLE:    'World of Emberfall',
  GAME_SUBTITLE: 'A valley worth holding. A camp worth feeding.',

  // Ecranul de pornire si alegerea personajului
  LOADING:          'Loading...',
  PLAY:             'Play',
  CHOOSE_CHARACTER: 'Choose your character',
  EMPTY_SLOT:       'Empty slot',
  CREATE_HERE:      'Create a character',
  DELETE:           'Delete',
  DELETE_ASK:       'Delete this character? This cannot be undone.',
  YES_DELETE:       'Yes, delete',
  CANCEL:           'Cancel',
  ENTER_WORLD:      'Enter World',
  BACK:             'Back',
  SAVED:            'saved',

  LEVEL:     'Level',
  LEVEL_UP:  'Level up!',
  MAX_LEVEL: 'Max level',
  ATTACK: 'ATTACK',
  INTERACT: 'TALK',
  LOG_OUT: 'Log out',
  SOUND:     'Sound',
  SOUND_ON:  'on',
  SOUND_OFF: 'off',
  MAP: 'Map',
  RARE: '\u25C6 RARE \u25C6',
  ELITE: '\u25C6 ELITE \u25C6',
  ROADS: 'Where you can go',
  YOU_ARE_HERE_NOTE: 'Walk to the edge of the zone to cross into the next one.',

  // Harta lumii
  WORLD_MAP:    'World map',
  WHOLE_WORLD:  'The whole world',
  YOU_ARE_HERE: 'You are here',
  DRAWING_MAP:  'Drawing the map...',
  WHATS_HERE:   'What is here',
  LEGEND:       'Legend',
  ZONE_MAP_NOTE: 'This is the real shape of the zone. Roads are the pale lines, ' +
                 'water is blue, and the gates on the edges lead to the zones named beside them.',

  // Locurile de pe harta
  PLACE_CITY:     'City',
  PLACE_VILLAGE:  'Village',
  PLACE_CAMP:     'Camp',
  PLACE_CAVE:     'Cave',
  PLACE_MINE:     'Mine',
  PLACE_KEEP:     'Keep',
  PLACE_OUTPOST:  'Outpost',
  PLACE_FARM:     'Farm',
  PLACE_CLEARING: 'Clearing',
  PLACE_DISTRICT: 'District',
  CITY_SAFE:      'No enemies here',
  PLACE_PEOPLE:   'People you can talk to',
  PLACE_GATE:     'Gate',
  PLACE_PORT:     'Port',
  MENU:   'MENU',

  // Numele inamicilor
  WOLF:     'Wolf',
  BURROWER: 'Burrower',
  BANDIT:   'Bandit',
  SCORPID:  'Scorpid',
  BOAR:     'Boar',
  RAIDER:   'Raider',
  RAT:      'Field Rat',
  SPIDER:   'Forest Spider',
  VULTURE:  'Dust Vulture',
  SERPENT:  'Sand Serpent',
  GUARD:    'City Guard',
  FACTOR:   'The Factor',
  ENEMY_CITY: 'Their city. The guards know your face.',

  // Moartea si reinvierea
  YOU_DIED:   'You have died',
  RETURNING:  'Returning to your camp...',

  // Meniul de infatisare
  SEX:         'Body',
  SKIN_COLOR:  'Skin Color',
  FACE:        'Face',
  HAIR_STYLE:  'Hair Style',
  HAIR_COLOR:  'Hair Color',
  FACIAL_HAIR: 'Facial Hair',

  HAIR_SHORT: 'Short',
  HAIR_LONG:  'Long',
  HAIR_SPIKY: 'Spiky',
  HAIR_BALD:  'Bald',

  FACE_ROUND:  'Round',
  FACE_NARROW: 'Narrow',
  FACE_WIDE:   'Wide',

  BEARD_NONE:      'Clean',
  BEARD_MOUSTACHE: 'Moustache',
  BEARD_FULL:      'Full Beard',

  // Personajele prietenoase (NPC). Vor conta mai tarziu.
  MARSHAL_NAME:  'Marshal Bren',
  MARSHAL_TITLE: 'Greenvale Marshal',
  CHIEF_NAME:    'Chief Gorrash',
  CHIEF_TITLE:   'Warband Chief',

  // Negustorii
  MERCHANT_NAME:      'Alden Hobb',
  MERCHANT_TITLE:     'Trade Goods',
  SMITH_NAME:         'Mira Steelhand',
  SMITH_TITLE:        'Weaponsmith',
  ORC_MERCHANT_NAME:  'Gurtok Ashpaw',
  ORC_MERCHANT_TITLE: 'Trade Goods',
  ORC_SMITH_NAME:     'Zelka Ironjaw',
  ORC_SMITH_TITLE:    'Weaponsmith',

  // Oamenii imprastiati pe harta, care dau misiuni
  FARMER_NAME:    'Edda Marrow',      FARMER_TITLE:   'Barley Farmer',
  RANGER_NAME:    'Coll Ashfen',      RANGER_TITLE:   'Forest Warden',
  MINER_NAME:     'Prospector Dunn',  MINER_TITLE:    'Mine Foreman',
  KNIGHT_NAME:    'Knight Ansel',     KNIGHT_TITLE:   'Keep Captain',
  HUNTRESS_NAME:  'Kaza Boneclaw',    HUNTRESS_TITLE: 'Beast Tracker',
  SHAMAN_NAME:    'Old Murgh',        SHAMAN_TITLE:   'Bonecaster',
  SCOUT_NAME:     'Zib Sandrunner',   SCOUT_TITLE:    'Warband Scout',
  CAPTAIN_NAME:   'Captain Drex',     CAPTAIN_TITLE:  'Warband Captain',

  // Aruncatul din rucsac
  DROP_ITEMS:    'Drop items',
  DROP_ALL_JUNK: 'Drop all junk',
  DONE:          'Done',
  DROP_HELP:     'Tap an item to throw it away. It will be gone for good.',
  DROP_ASK:      'Throw away {item}?',
  YES_DROP:      'Throw away',

  // ==========================================================
  //  OAMENII ORASULUI
  //
  //  Numele lor se schimba de la un oras la altul (le face jocul);
  //  ce scrie aici e doar de rezerva. Titlurile raman.
  //
  //  ATENTIE: meseriile de mai jos sunt cuvinte obisnuite - fierar,
  //  tabacar, tesator. Numele SISTEMULUI de meserii se alege la
  //  Pasul 2 si inca nu e nimic ales, deci nimic din el n-a intrat
  //  in joc.
  // ==========================================================
  TR_WARRIOR_NAME: 'Warmaster',      TR_WARRIOR_TITLE: 'Warrior Trainer',
  TR_HUNTER_NAME:  'Bowmaster',      TR_HUNTER_TITLE:  'Hunter Trainer',
  TR_MAGE_NAME:    'Arcanist',       TR_MAGE_TITLE:    'Mage Trainer',
  TR_PRIEST_NAME:  'Confessor',      TR_PRIEST_TITLE:  'Priest Trainer',

  TR_MINING_NAME:  'Prospector',     TR_MINING_TITLE:  'Delving Trainer',
  TR_HERB_NAME:    'Herb Gatherer',  TR_HERB_TITLE:    'Foraging Trainer',
  TR_SKIN_NAME:    'Hidecutter',     TR_SKIN_TITLE:    'Hidecraft Trainer',

  TR_SMITH_NAME:   'Forge Master',   TR_SMITH_TITLE:   'Smithing Trainer',
  TR_ALCH_NAME:    'Brewer',         TR_ALCH_TITLE:    'Brewing Trainer',
  TR_ENCH_NAME:    'Runecarver',     TR_ENCH_TITLE:    'Runecarving Trainer',
  TR_ENGI_NAME:    'Tinker',         TR_ENGI_TITLE:    'Tinkering Trainer',
  TR_LEATHER_NAME: 'Tanner',         TR_LEATHER_TITLE: 'Tanning Trainer',
  TR_TAILOR_NAME:  'Weaver',         TR_TAILOR_TITLE:  'Weaving Trainer',

  TR_COOK_NAME:    'Cook',           TR_COOK_TITLE:    'Cookery Trainer',
  TR_MEDIC_NAME:   'Field Medic',    TR_MEDIC_TITLE:   'Bandaging Trainer',
  TR_FISH_NAME:    'Angler',         TR_FISH_TITLE:    'Angling Trainer',

  TR_TOOLS_NAME:   'Toolwright',     TR_TOOLS_TITLE:   'Tools and Gear',
  TR_GOODS_NAME:   'Supplier',       TR_GOODS_TITLE:   'Trade Supplies',

  // Meseriile
  PROFESSIONS:      'Professions',
  PROFESSION:       'Profession',
  SKILL:            'Skill',
  TIER:             'Tier',
  LEARN_PROFESSION: 'Learn',
  NEXT_TIER:        'Learn next tier',
  ABANDON:          'Abandon',
  ABANDON_ASK:      'Abandon {p}? Your skill goes back to zero and you lose it all.',
  YES_ABANDON:      'Yes, abandon',
  PROF_FULL:        'You already have two main trades',
  PROF_SOON:        'Not open yet',
  PROF_KNOWN:       'You know this',
  PROF_CAP:         'Your tier stops you here',
  NEED_PROFESSION:  'You need {p}',
  NEED_SKILL:       'Needs skill {n}',
  CANNOT_GATHER:    'You cannot gather this',

  // Uneltele de meserie
  NEED_TOOL:        'You need a {t}',
  BUY_TOOL:         'Buy {t}',
  TOOL_IN_BAG:      'You are carrying one',
  TOOLS_TITLE:      'Tools',
  ITEM_TOOL:        'Tool',
  ITEM_RECIPE:      'Recipe',
  RECIPE_ITEM:      'Recipe: {r}',
  RECIPE_LEARNED:   'You have learned {r}!',
  RECIPE_KNOWN:     'You already know this',
  RECIPE_WRONG_JOB: 'You lack the trade for this',
  RECIPE_TOO_LOW:   'Needs skill {n} in {p}',
  RECIPES_TAUGHT:   'Recipes he can teach',

  // Magul: apa, paine si drumul scurt
  NOT_IN_COMBAT:    'Not while fighting',
  TELEPORT_TITLE:   'Where to?',
  TELEPORT_HELP:    'The road folds. Pick a city and step through.',
  TELEPORT_HERE:    'You are here',
  TELEPORT_GO:      'Step',
  TAP_TO_LEARN:     'Tap to learn',
  ITEM_TRADE:       'Trade goods',
  ITEM_JUNK:        'Junk',
  TOOL_PICK:        'For cutting ore out of rock.',
  TOOL_KNIFE:       'For taking the hide off a dead beast.',
  TOOL_ROD:         'For fishing. A line, a hook and patience.',
  GATHER_STOPPED:   'Interrupted',
  BITE:             'A bite!',
  TOO_SOON:         'Too soon',
  GOT_AWAY:         'It got away',
  FLEEING:          'Fleeing!',
  CHARMED:          'Dazed',
  TRAPPED:          'Caught!',
  PLAYING_DEAD:     'Playing dead',
  TOO_HEALTHY:      'Not weak enough yet',

  // Animalul de companie
  NOT_A_BEAST:      'Only a beast can be bound',
  BEAST_TOO_STRONG: 'It is stronger than you',
  TAMED:            '{p} is yours',
  NO_PET:           'You have no beast',
  PET_IS_DEAD:      'Your beast is down',
  PET_DIED:         '{p} has fallen',
  PET_REVIVED:      'Back on its feet',
  PET_FED:          'Fed',
  PET:              'Companion',
  HAPPINESS:        'Happiness',
  SKIN:             'Skin',
  NO_PROFESSIONS:   'You have no trade yet. Trainers wait in the cities.',

  // Facutul lucrurilor
  CRAFT:            'Craft',
  CRAFT_ALL:        'Craft All',
  NEED_STATION:     'Needs {s}',
  NEED_MATERIALS:   'You lack materials',
  MADE:             'Made',
  NO_RECIPES:       'Your trainer has taught you nothing yet.',
  RECIPES:          'What you can make',
  USE:              'Use',
  BANDAGE_SOON:     'Another bandage in {n}s',
  ALREADY_FULL:     'You are already full',
  NOT_FOR_YOU:      'That does nothing for you',
  NOTHING_HAPPENS:  'Nothing happens',

  // Antrenorul de clasa
  TRAIN:            'Train',
  LEARN:            'Learn',
  TRAINER_EMPTY:    'I have taught you everything I know.',
  RANK:             'Rank',
  REQUIRES:         'Requires level',
  NOT_ENOUGH_GOLD:  'Not enough money',
  LEARNED:          'Learned',
  NEW_AT_TRAINER:   '{n} new at your trainer',
  ABILITY_BAR:      'Your four buttons',
  BAR_PAGE:         'Page',
  BAR_HELP:         'Tap an ability, then tap the slot you want it in. ' +
                    'Four slots per page, two pages.',
  BAR_EMPTY_SLOT:   'empty',
  KNOWN_ABILITIES:  'What you know',
  NOTHING_LEARNED:  'You have not learned anything yet.',

  // Ce spun antrenorii pana cand invatatul chiar se poate face
  TRAINER_SOON:    'I will teach you my trade. Not yet, though \u2014 come ' +
                   'back when the guilds open their books.',
  TRAINER_TEACHES: 'Teaches',
  CITY_GATE:       'City gate',
  // Prada de la inamici
  LOOT:          'Loot',
  TAKE_ALL:      'Take All',
  NOTHING_LEFT:  'Nothing left here.',
  BAG_FULL:      'Your bags are full',
  TOO_FAR:       'Too far away',

  // Negustorul
  BUY:             'Buy',
  SELL:            'Sell',
  YOUR_MONEY:      'Your money',
  NOT_ENOUGH:      'Not enough money',
  NOTHING_TO_SELL: 'You have nothing to sell.',
  SOLD:            'Sold',
  BOUGHT:          'Bought',
  CLOSE:           'Close',

  // Misiunile
  QUESTS:          'Quests',
  QUEST_LOG:       'Quest Log',
  ACCEPT:          'Accept',
  COMPLETE:        'Complete',
  DECLINE:         'Decline',
  OBJECTIVES:      'Objectives',
  REWARDS:         'Rewards',
  CHOOSE_REWARD:   'Choose one:',
  EXPERIENCE:      'Experience',
  QUEST_ACCEPTED:  'Quest accepted',
  QUEST_COMPLETE:  'Quest complete!',
  NO_QUESTS:       'Nothing for you right now.',
  EMPTY_LOG:       'You have no quests. Look for a golden ! above someone in your camp.',
  REQUIRES_LEVEL:  'Requires level',
  NEEDS_BEFORE:    'Finish the quest before it first.',

  // Ecranul de la capatul povestii
  THE_END_TITLE: 'The Quiet Coast',
  THE_END_TEXT:
    'The lamp is still burning when you come down, because nobody thought ' +
    'to put it out.<br><br>' +
    'Four years of ledgers, and under them the older ones, in a different ' +
    'hand, going back further than the marshal at the gate has been alive. ' +
    'Valleys, roads, mines, a village with red roofs. A price beside each ' +
    'one, and a date, and the name of whoever was paid.<br><br>' +
    'Greenvale is in there. It is eleven years old and it is crossed out, ' +
    'because the road stayed open and fourteen farmers with a rusted sword ' +
    'were more expensive than the valley was worth.<br><br>' +
    'The people in the waiting camp come down to the shingle when the ' +
    'shouting stops. Nobody cheers. They stand and look at the water for a ' +
    'while, and then somebody asks, out loud, whether the road east goes ' +
    'anywhere - and for the first time in four years the answer is that it ' +
    'goes home.<br><br>' +
    'You burn the ledgers on the quay, where everyone can watch.<br><br>' +
    'It will start again somewhere. It always does. But not this year, and ' +
    'not here, and a hundred and thirty people in a town that keeps no ' +
    'book will never know your name - which, all things considered, is ' +
    'exactly how they would want it.',
  THE_END_DONE:  'The world stays open. Go where you like.',
  THE_END_CLOSE: 'Close',
  FINISHED_GAME: 'Finished the story',

  // Abilitatile care vin dintr-o misiune, nu de la antrenor
  TEACHES_YOU:     'Teaches you:',
  ABILITY_EARNED:  'You have learned {a}!',
  EARNED_BY_TASK:  'Earned by doing a task for your trainer.',
  TRAINER_TASK:    'Ask your trainer about it.'
};
