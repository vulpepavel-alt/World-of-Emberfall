// ==========================================================
//  MISIUNILE DE CLASA
//
//  Cateva abilitati NU se cumpara de la antrenor: le primesti la
//  capatul unei misiuni, ca dovada ca stii ce faci. Antrenorul tau
//  e cel care ti-o da, in orice oras il gasesti.
//
//  Doua lucruri le fac diferite de restul misiunilor:
//
//    clasa: 'warrior'   - o vede DOAR razboinicul. Un mag nu stie
//                         ca exista, nici macar ca semn deasupra
//                         capului antrenorului.
//    oriunde: true      - nu tine de o zona anume. Antrenorul tau
//                         ti-o da si in Ambervault, si in Karrak
//                         Hold, oriunde dai de el.
//
//  Rasplata lor are un camp in plus: 'abilitati', o lista de id-uri
//  pe care le primesti gata invatate, fara bani si fara nivel.
//
//  Textele sunt in engleza, ca tot ce se vede in joc.
// ==========================================================

const MISIUNI_DE_CLASA = [

  // ==========================================================
  //  RAZBOINIC - "unde se rupe armura"
  //  Se termina cu Armor Split.
  // ==========================================================
  {
    id: 'cls_war_1', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 10,
    titlu: 'The Weight of a Shield',
    text: 'You swing well enough. Anyone can be taught to swing.<br><br>' +
          'What I teach here is the other half: where a man in armor is ' +
          'soft, and how to get at it before he gets at you. That takes a ' +
          'week of drill, or one honest afternoon out on the moor.<br><br>' +
          'Go and take that afternoon. Boars, wolves, whatever comes at ' +
          'you first. I want you tired, not clever.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 12 },
    rasplata: { xp: 620, bani: 380 }
  },
  {
    id: 'cls_war_2', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 10, cere: 'cls_war_1',
    titlu: 'Plates and Straps',
    text: 'Tired. Good. Now look at what you were hitting.<br><br>' +
          'A boar has no armor and still it is hard to kill, because the ' +
          'bone sits where you want the blade. A bandit has armor and is ' +
          'easy, because the armor is strapped on by a man in a hurry.<br><br>' +
          'Bring me the plates off a few of them. Not to sell. To show ' +
          'you where the straps were, and what a strap is worth.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 8, obiect: 'Strapped Plate' },
    rasplata: { xp: 780, bani: 460 }
  },
  {
    id: 'cls_war_3', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 10, cere: 'cls_war_2',
    titlu: 'Where It Comes Apart',
    text: 'Every one of these came apart in the same place. Shoulder, hip, ' +
          'the seam under the arm. That is not luck. That is how armor is ' +
          'made, and every smith in the world makes it the same way.<br><br>' +
          'Go back out and aim there. Not at the man - at the seam. When ' +
          'you can do it without thinking about it, come back and I will ' +
          'put a name to what you already know how to do.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 },
    rasplata: { xp: 1100, bani: 700, abilitati: ['warrior_sunder_01'] }
  },

  // ==========================================================
  //  RAZBOINIC - "cine fuge"
  //  Mai tarziu, la 30. Se termina cu Closing Leap.
  // ==========================================================
  {
    id: 'cls_war_4', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 30, cere: 'cls_war_3',
    titlu: 'The Ones Who Run',
    text: 'You have grown into the armor since I saw you last. Sit down.<br><br>' +
          'Here is the complaint I hear from every soldier who lives long ' +
          'enough to complain: the dangerous ones do not stand still. They ' +
          'break, they scatter, and they come back at your back.<br><br>' +
          'Raiders are the worst of them. Go and see for yourself how far ' +
          'one gets before you catch it.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 15 },
    rasplata: { xp: 3400, bani: 1900 }
  },
  {
    id: 'cls_war_5', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 30, cere: 'cls_war_4',
    titlu: 'Cut From the Running',
    text: 'Far, is the answer. They get far.<br><br>' +
          'A wolf runs better than any man and it does not tire the way we ' +
          'do. If you want to learn to close a gap, learn it from the thing ' +
          'that opens one.<br><br>' +
          'Bring me their tendons. I will show you what a leg does in the ' +
          'moment before it pushes off - and where you have to be standing.',
    cerinta: { fel: 'aduna', mob: 'wolf', cati: 10, obiect: 'Wolf Tendon' },
    rasplata: { xp: 3900, bani: 2200 }
  },
  {
    id: 'cls_war_6', dator: 'antrenorRazboinic', clasa: 'warrior',
    oriunde: true, nivel: 30, cere: 'cls_war_5',
    titlu: 'One Step, Not Ten',
    text: 'Ten steps and you arrive out of breath, which is the same as not ' +
          'arriving. One step, thrown from the hip, and you arrive with the ' +
          'weapon already moving.<br><br>' +
          'It is not grace. It is deciding earlier than the other man does. ' +
          'Go out once more, and every time something turns its back on ' +
          'you, be there before it finishes turning.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 20 },
    rasplata: { xp: 5200, bani: 3000, abilitati: ['warrior_intercept_01'] }
  },

  // ==========================================================
  //  VANATOR - "legarea unei fiare"
  //  Se termina cu Bind Beast, Call Companion si Rouse Companion.
  // ==========================================================
  {
    id: 'cls_hun_1', dator: 'antrenorVanator', clasa: 'hunter',
    oriunde: true, nivel: 10,
    titlu: 'What Hunts Beside You',
    text: 'You hunt alone. Most do, at first, and most stop when they meet ' +
          'something that hunts in twos.<br><br>' +
          'A beast can be bound to you. Not tamed the way a farmer tames a ' +
          'goat - bound, which is a bargain, and a bargain has two sides. ' +
          'Before I teach you the words, you will learn what you are ' +
          'bargaining with.<br><br>' +
          'Wolves first. Watch how they move together before you kill them.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 12 },
    rasplata: { xp: 640, bani: 390 }
  },
  {
    id: 'cls_hun_2', dator: 'antrenorVanator', clasa: 'hunter',
    oriunde: true, nivel: 10, cere: 'cls_hun_1',
    titlu: 'A Bargain Needs Two',
    text: 'They circle. Always. One holds the eyes and the other takes the ' +
          'leg, and neither of them was told to.<br><br>' +
          'That is what you are asking for, and it is not free. A bound ' +
          'beast eats, and a hungry beast is a bad bargain.<br><br>' +
          'Bring me hide - good hide, off boars, not the scraps. I will cut ' +
          'you a feed bag and a collar out of it, and you will carry both ' +
          'before you carry a companion.',
    cerinta: { fel: 'aduna', mob: 'boar', cati: 8, obiect: 'Thick Boar Hide' },
    rasplata: { xp: 800, bani: 470 }
  },
  {
    id: 'cls_hun_3', dator: 'antrenorVanator', clasa: 'hunter',
    oriunde: true, nivel: 10, cere: 'cls_hun_2',
    titlu: 'Say It Once, Mean It',
    text: 'Bag, collar, and a hunter who has watched a pack work. That is ' +
          'all the ceremony there is.<br><br>' +
          'The words are short and you only get to say them once to any ' +
          'one beast. Say them to something no stronger than you are, or it ' +
          'will hear a question instead of an offer.<br><br>' +
          'Go and find yours. Call it when you need it, send it off when ' +
          'you do not, and put it back on its feet when it falls - because ' +
          'it will fall, and it will have fallen for you.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 10 },
    rasplata: {
      xp: 1150, bani: 720,
      abilitati: ['hunter_tame_01', 'hunter_call_01', 'hunter_revive_01']
    }
  },

  // ==========================================================
  //  MAG - "forma imprumutata"
  //  Se termina cu Shapebind.
  // ==========================================================
  {
    id: 'cls_mag_1', dator: 'antrenorMag', clasa: 'mage',
    oriunde: true, nivel: 8,
    titlu: 'Burning Is the Easy Part',
    text: 'Burning a thing is the first trick anyone learns and the last ' +
          'one anyone should rely on. It works until you are outnumbered, ' +
          'and then it works on exactly one of them.<br><br>' +
          'There is an older idea: do not remove the enemy, change it. A ' +
          'rat is not a threat. A rat is a rat.<br><br>' +
          'Before that, go and look closely at some. Kill them if you must ' +
          '- I want you to know what a rat is, precisely, down to the ' +
          'shape of the skull.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 14 },
    rasplata: { xp: 480, bani: 300 }
  },
  {
    id: 'cls_mag_2', dator: 'antrenorMag', clasa: 'mage',
    oriunde: true, nivel: 8, cere: 'cls_mag_1',
    titlu: 'Something to Borrow From',
    text: 'Good. Now the difficulty.<br><br>' +
          'You cannot invent a shape out of nothing; you can only borrow ' +
          'one, and to borrow it you must have held the real thing.<br><br>' +
          'Spiders will do. Bring me the eyes - whole, not crushed. An eye ' +
          'remembers the shape it belonged to longer than any other part ' +
          'does, and that is the whole secret, though nobody writes it ' +
          'down that plainly.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 6, obiect: 'Clouded Eye' },
    rasplata: { xp: 600, bani: 380 }
  },
  {
    id: 'cls_mag_3', dator: 'antrenorMag', clasa: 'mage',
    oriunde: true, nivel: 8, cere: 'cls_mag_2',
    titlu: 'It Wears Off',
    text: 'Here is the part I tell everyone twice, because everyone forgets ' +
          'it once.<br><br>' +
          'It wears off. Always. And whatever you hit while it is wearing ' +
          'off wakes up early and angry, and it wakes up looking at you.<br><br>' +
          'So it is not a way to win a fight. It is a way to have one fight ' +
          'instead of three. Go and prove to me you can pick which of ' +
          'three you would rather have.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 10 },
    rasplata: { xp: 900, bani: 580, abilitati: ['mage_poly_01'] }
  },

  // ==========================================================
  //  PREOT - "strigatul"
  //  Se termina cu Wail.
  // ==========================================================
  {
    id: 'cls_pri_1', dator: 'antrenorPreot', clasa: 'priest',
    oriunde: true, nivel: 14,
    titlu: 'When Mending Is Not Enough',
    text: 'You have learned to close a wound. That is the kind half of what ' +
          'we do, and it is the half that gets people killed, because it ' +
          'teaches you to stand still.<br><br>' +
          'Sooner or later three of them will be on you at once and there ' +
          'will be nothing left to mend.<br><br>' +
          'I want you to meet that moment first, and survive it the hard ' +
          'way. Go out to where they run in numbers.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 12 },
    rasplata: { xp: 1250, bani: 760 }
  },
  {
    id: 'cls_pri_2', dator: 'antrenorPreot', clasa: 'priest',
    oriunde: true, nivel: 14, cere: 'cls_pri_1',
    titlu: 'The Sound Under the Words',
    text: 'You survived it. You also ran, and there is no shame in that; ' +
          'there is only the question of what you do next time.<br><br>' +
          'Every prayer we say out loud has a sound under the words. Said ' +
          'plainly it comforts. Torn out of you, it does the opposite, and ' +
          'everything near enough to hear it goes away.<br><br>' +
          'Bring me serpent throats. I want you to see how a sound is ' +
          'made, in a thing that has no words at all.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 8, obiect: 'Hollow Throat' },
    rasplata: { xp: 1500, bani: 900 }
  },
  {
    id: 'cls_pri_3', dator: 'antrenorPreot', clasa: 'priest',
    oriunde: true, nivel: 14, cere: 'cls_pri_2',
    titlu: 'Scatter Them',
    text: 'No words. That is the lesson. The words were never the power, ' +
          'they were the manners.<br><br>' +
          'Once you learn to take them off, you will have a moment - a ' +
          'short one - where nothing is touching you. Use it to mend, or to ' +
          'leave. Do not use it to feel powerful; that habit ends badly in ' +
          'our order.<br><br>' +
          'Go out once more. Come back when you have earned the quiet.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 12 },
    rasplata: { xp: 2000, bani: 1250, abilitati: ['priest_fear_01'] }
  }
];


MISIUNI_DE_CLASA.forEach(function (m) { MISIUNI.push(m); });
