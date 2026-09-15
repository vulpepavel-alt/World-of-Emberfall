// ==========================================================
//  MISIUNILE (quests)
//
//  O misiune are trei vieti:
//    NELUATA - se vede un semn de exclamare galben peste cel
//              care o da
//    ACTIVA  - o ai in carnet si numeri ce ai de facut
//    GATA    - ai terminat-o si te intorci; peste cap ii apare
//              un semn de intrebare galben
//    PREDATA - ai luat rasplata; nu se mai poate lua din nou
//
//  Sunt doua feluri de cerinte, ca in WoW:
//    ucide - omoara atatia inamici de un fel
//    aduna - strange atatea lucruri care cad de la un fel de
//            inamic (nu ocupa loc in rucsac)
//
//  Fiecare misiune poate cere una dinainte (camp "cere"), asa
//  ca ies doua lanturi lungi, cate unul pentru fiecare zona.
// ==========================================================


// Cat de des cade lucrul cerut de o misiune de tip "aduna".
const SANSA_OBIECT_DE_MISIUNE = 45;   // din 100


const MISIUNI = [

  // ==========================================================
  //  GREENVALE - povestea vaii
  //
  //  Incepe cu sobolani in hambar si se termina cu intelegerea
  //  ca nimic din ce s-a intamplat in vara asta nu a fost o
  //  intamplare. Fiecare om iti spune o bucata; cap la cap,
  //  bucatile fac o poveste.
  // ==========================================================

  // ---------- Marshal Bren, in sat ----------
  {
    id: 'gv1', zona: 'Greenvale', dator: 'marshal', nivel: 1,
    titlu: 'Rats in the Cellar',
    text: 'You picked a poor season to arrive, but I will not turn away a pair ' +
          'of hands.<br><br>' +
          'The storehouse under the old hall is full of rats. That is not ' +
          'unusual. What is unusual is that they came all at once, three weeks ' +
          'ago, on the same night, and they have not left since.<br><br>' +
          'The miller says they came up from the river. The farmer says they ' +
          'came down from the hills. I say a rat goes where the food is and ' +
          'thinks no further than that.<br><br>' +
          'Thin them out. I will pay you from my own purse, because the village ' +
          'purse is a jar with nothing in it.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 },
    rasplata: { xp: 140, bani: 90 }
  },
  {
    id: 'gv2', zona: 'Greenvale', dator: 'marshal', nivel: 2, cere: 'gv1',
    titlu: 'What the Boars Turned Up',
    text: 'Good. The cellar is quiet and the miller has stopped writing me ' +
          'letters about it.<br><br>' +
          'Now the boars. They have come down out of the eastern hills in ' +
          'numbers I have not seen in eleven years here, and they are rooting ' +
          'through everything between the road and the river.<br><br>' +
          'Here is the part I keep turning over: boars do not leave good ground ' +
          'for bad. Something moved them. The same something, I think, that ' +
          'moved the rats.<br><br>' +
          'Go and thin them. And if you see what pushed them down, come back ' +
          'and tell me before you do anything brave.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 10 },
    rasplata: { xp: 260, bani: 160, nivelObiect: 3, raritate: 'comun' }
  },
  {
    id: 'gv3', zona: 'Greenvale', dator: 'marshal', nivel: 5, cere: 'gv2',
    titlu: 'The Sealed Purse',
    text: 'A carter was robbed on the east road and left alive, which is itself ' +
          'strange. Bandits who mean to eat do not leave witnesses.<br><br>' +
          'He brought me this: a leather purse, empty, with a seal stamped into ' +
          'the flap. Not a merchant mark. Not a village mark. I have been the ' +
          'law in this valley for eleven years and I have never seen it.<br><br>' +
          'They camp east of the river. Bring me six more of those purses. One ' +
          'is an accident. Six is a payroll, and a payroll has somebody at the ' +
          'other end of it.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 6, obiect: 'Sealed Purse' },
    rasplata: { xp: 700, bani: 450, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'gv4', zona: 'Greenvale', dator: 'marshal', nivel: 7, cere: 'gv3',
    titlu: 'A Name on Paper',
    text: 'Six purses, six seals, all the same. I sent a rubbing of it up the ' +
          'road with the last grain cart.<br><br>' +
          'The answer came back faster than I wanted. The seal belongs to a ' +
          'house that holds land on the far side of the eastern hills. They have ' +
          'wanted this valley for three generations and been told no three ' +
          'times.<br><br>' +
          'So: they cannot buy it, and they cannot take it while people live ' +
          'here. So they make living here expensive. Rats, boars, wolves driven ' +
          'down, a road nobody will travel.<br><br>' +
          'I cannot march on a great house with fourteen farmers. But I can ' +
          'empty their camp, and I can make it cost them. Break it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 12 },
    rasplata: { xp: 1150, bani: 780, nivelObiect: 8, raritate: 'rar' }
  },
  {
    id: 'gv5', zona: 'Greenvale', dator: 'marshal', nivel: 9, cere: 'gv4',
    titlu: 'The Thing Under Greenvale',
    text: 'Dunn sent word from the mine and his hand was shaking when he wrote ' +
          'it. I have known that man twenty years and he does not shake.<br><br>' +
          'The old mine was sealed in my grandfather\'s time. Not worked out - ' +
          'sealed. There is a difference, and the difference is written in the ' +
          'village book in a hand I cannot read.<br><br>' +
          'Somebody opened it this spring. Somebody with money, and reason to ' +
          'want this valley emptied. I think they did not know what was behind ' +
          'the wall, and I think they do not care.<br><br>' +
          'Go down. Kill what is coming up. I will hold the road.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 12 },
    rasplata: { xp: 1800, bani: 1200, nivelObiect: 10, raritate: 'rar' }
  },
  {
    id: 'gv6', zona: 'Greenvale', dator: 'marshal', nivel: 10, cere: 'gv5',
    titlu: 'Hold the Valley',
    text: 'They have come back, and this time they are not hiding. Camped on ' +
          'the open hill under the keep, in daylight, with their banners up.<br><br>' +
          'That is not a raid. That is a claim. They want us to see them and ' +
          'decide it is not worth it.<br><br>' +
          'Eleven years I have kept this road open with fourteen farmers and a ' +
          'rusted sword. I do not intend for the twelfth to be the one where I ' +
          'explain to my grandchildren why the valley has a new name.<br><br>' +
          'Go up the hill. I will be behind you, and so will every one of the ' +
          'fourteen. Finish it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 15 },
    rasplata: { xp: 2400, bani: 1800, nivelObiect: 11, raritate: 'maiestru' }
  },

  // ---------- Edda Marrow, la ferma ----------
  {
    id: 'gf1', zona: 'Greenvale', dator: 'taran', nivel: 2,
    titlu: 'Trampled Barley',
    text: 'Look at it. Just look at it.<br><br>' +
          'Four months of work and they went through it in one night like it ' +
          'was a road. I have barley flat from the fence to the ditch and a hole ' +
          'in the hedge I could drive a cart through.<br><br>' +
          'My husband would have sat up with a lamp and a pitchfork. My husband ' +
          'is in the ground behind the house, and I am fifty-two, and I sleep ' +
          'badly enough as it is.<br><br>' +
          'Ten of them. Ten, and I will sleep. Then we will talk about what I ' +
          'can pay you, and you will find I am fairer than I look.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 10 },
    rasplata: { xp: 260, bani: 170, nivelObiect: 3, raritate: 'comun' }
  },
  {
    id: 'gf2', zona: 'Greenvale', dator: 'taran', nivel: 3, cere: 'gf1',
    titlu: 'Tusks for the Tanner',
    text: 'Now, since you are already out among them and already filthy.<br><br>' +
          'The tanner down at the ford pays well for good tusks - handles, ' +
          'buttons, that sort of thing - and he pays in coin, not in promises. ' +
          'The village lives on what the tanner sells, whatever the Marshal ' +
          'likes to think it lives on.<br><br>' +
          'Six tusks. Whole ones, mind. He will not take a cracked one and he ' +
          'will spend a quarter of an hour telling you why.<br><br>' +
          'Bring them to me and I will settle with him myself. He talks less to me.',
    cerinta: { fel: 'aduna', mob: 'boar', cati: 6, obiect: 'Boar Tusk' },
    rasplata: { xp: 380, bani: 260, nivelObiect: 4, raritate: 'bun' }
  },
  {
    id: 'gf3', zona: 'Greenvale', dator: 'taran', nivel: 4, cere: 'gf2',
    titlu: 'The Dog Did Not Come Back',
    text: 'Her name was Pell. Black, with one white foot. She was out with the ' +
          'sheep four nights ago and she did not come back, and neither did two ' +
          'of the sheep.<br><br>' +
          'I am not going to ask you to look for her. I know what happened and ' +
          'so do you. I want you to go up toward the rocks and make it so that ' +
          'it does not happen to anybody else\'s dog.<br><br>' +
          'Ten of them. Coll up at the wood will tell you they are only doing ' +
          'what wolves do, and he is right, and I do not care.<br><br>' +
          'Go on. I will have something warm when you come back.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 10 },
    rasplata: { xp: 520, bani: 350, nivelObiect: 5, raritate: 'bun' }
  },

  // ---------- Coll Ashfen, la marginea padurii ----------
  {
    id: 'gr1', zona: 'Greenvale', dator: 'padurar', nivel: 4,
    titlu: 'Thin the Pack',
    text: 'Edda sent you, I expect. She has been sending people since the dog.<br><br>' +
          'I will tell you what I told her. There have been wolves in this wood ' +
          'since before there was a village to complain about them, and in a ' +
          'normal year they keep to the high rocks and we keep to the low ' +
          'ground and nobody writes any letters.<br><br>' +
          'This is not a normal year. The pack is down off the ridge, it is ' +
          'twice the size it should be, and it is hungry in the wrong season. ' +
          'Something is up there that they would rather not share a hill with.<br><br>' +
          'So yes. Thin them. But do it knowing they are running from something, ' +
          'and that the something is still up there.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 12 },
    rasplata: { xp: 560, bani: 380, nivelObiect: 5, raritate: 'comun' }
  },
  {
    id: 'gr2', zona: 'Greenvale', dator: 'padurar', nivel: 5, cere: 'gr1',
    titlu: 'Webs in the Deep Wood',
    text: 'Two woodcutters went into the deep wood on the same morning. One ' +
          'came out at dusk with his axe missing and his hands cut to ribbons ' +
          'from pulling something off himself.<br><br>' +
          'He has not said a word since. Not one. He sits by his sister\'s fire ' +
          'and looks at the door.<br><br>' +
          'I went in as far as the second stream. There is web in there from ' +
          'root to branch, thick enough to lean on, and it is new. I have walked ' +
          'that wood for nineteen years and last autumn there was nothing.<br><br>' +
          'Burn it out. Twelve of them, at least, before I take anyone else in there.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 12 },
    rasplata: { xp: 760, bani: 480, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'gr3', zona: 'Greenvale', dator: 'padurar', nivel: 6, cere: 'gr2',
    titlu: 'Eight Sacs',
    text: 'The woodcutter spoke last night. One sentence, and then nothing ' +
          'again. He said: "They were put there."<br><br>' +
          'I have been a warden long enough to know that a frightened man says ' +
          'strange things. I have also been one long enough to know that spiders ' +
          'of that size do not walk into a valley on their own feet.<br><br>' +
          'Bring me eight venom sacs. There is a woman at the chapel who reads ' +
          'such things, and she will tell me whether these came out of our wood ' +
          'or out of somebody\'s cart.<br><br>' +
          'I would rather be wrong. I usually am not.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 8, obiect: 'Venom Sac' },
    rasplata: { xp: 950, bani: 640, nivelObiect: 7, raritate: 'bun' }
  },

  // ---------- Prospector Dunn, la mina ----------
  {
    id: 'gm1', zona: 'Greenvale', dator: 'miner', nivel: 7,
    titlu: 'Who Opened the Mine',
    text: 'I did not open it. Put that down first, because everyone from the ' +
          'village asks me second and accuses me first.<br><br>' +
          'I came up here in spring to survey the spoil heaps - honest work, ' +
          'paid by the yard - and I found the seal broken and the timbers ' +
          'shored up new. Somebody did a proper job. Somebody with money.<br><br>' +
          'There were men camped in the cut when I arrived. Not miners. Miners ' +
          'have hands. These had swords and clean boots and they told me to walk ' +
          'back down the hill, so I did, because I am sixty-one.<br><br>' +
          'Ten of them. Then I can get to my own tools, which are still in there.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 10 },
    rasplata: { xp: 1200, bani: 820, nivelObiect: 8, raritate: 'bun' }
  },
  {
    id: 'gm2', zona: 'Greenvale', dator: 'miner', nivel: 8, cere: 'gm1',
    titlu: 'Things That Dig',
    text: 'I got my tools. I also got a look at the second gallery, which is ' +
          'more than I wanted.<br><br>' +
          'The wall at the end of it was built, not fallen. Dressed stone, laid ' +
          'by hand, in a mine where nobody had any reason to build a wall. And ' +
          'it has been opened from this side with picks.<br><br>' +
          'Behind it the rock is soft and the tunnels do not go where tunnels ' +
          'go. They go down and they turn and there are more of them every week. ' +
          'Something is making them and it is not making them for us.<br><br>' +
          'Twelve, and be quick about it. They come up at the sound of a ' +
          'pick and I am tired of standing still.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 12 },
    rasplata: { xp: 1500, bani: 1000, nivelObiect: 9, raritate: 'rar' }
  },
  {
    id: 'gm3', zona: 'Greenvale', dator: 'miner', nivel: 9, cere: 'gm2',
    titlu: 'Chitin for the Smith',
    text: 'Say what you like about the things in the dark, their shells are the ' +
          'best material I have handled in forty years.<br><br>' +
          'Harder than iron across the grain and lighter than leather. Mira down ' +
          'in the village has already made a bracer out of a broken piece and it ' +
          'turned a knife.<br><br>' +
          'Bring me eight whole claws. She will have them worked into something ' +
          'you can wear by the time you have walked back down, and I will not ' +
          'charge you for the material, because I did not pay for it either.<br><br>' +
          'And do not tell the Marshal where the bracers came from. He has ' +
          'enough on his mind.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Chitin Claw' },
    rasplata: { xp: 1750, bani: 1150, nivelObiect: 10, raritate: 'rar' }
  },

  // ---------- Knight Ansel, la cetate ----------
  {
    id: 'gk1', zona: 'Greenvale', dator: 'cavaler', nivel: 6,
    titlu: 'Short of Hands',
    text: 'Stand where I can see you. Good.<br><br>' +
          'This keep is meant to hold forty men. It holds nine, and three of ' +
          'those are older than the gate. Every spring the capital promises a ' +
          'relief column and every autumn the column is needed somewhere more ' +
          'interesting.<br><br>' +
          'Meanwhile there are armed men camped in my valley in daylight, and I ' +
          'cannot put nine against thirty and still have a keep in the ' +
          'morning.<br><br>' +
          'So I am reduced to hiring. Twelve of them, off the east road. I will ' +
          'pay you out of the garrison chest, and I will write it in the book as ' +
          'repairs to the gate.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 12 },
    rasplata: { xp: 1000, bani: 700, nivelObiect: 7, raritate: 'bun' }
  },
  {
    id: 'gk2', zona: 'Greenvale', dator: 'cavaler', nivel: 8, cere: 'gk1',
    titlu: 'The Hill Road',
    text: 'The hill road is the only way a cart reaches this keep, and it has ' +
          'been closed for two weeks by web.<br><br>' +
          'My cook went down it on foot and came back the long way round the ' +
          'river, which took him a day and a half and cost me a dinner.<br><br>' +
          'Warden Ashfen tells me they are coming out of the deep wood and ' +
          'spreading along the warm stone of the road at night. He also tells me ' +
          'he does not believe they got here on their own, and I have learned to ' +
          'listen when Coll says a thing twice.<br><br>' +
          'Clear the road. Twelve should be enough to make a cart driver brave ' +
          'again.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 12 },
    rasplata: { xp: 1550, bani: 1050, nivelObiect: 9, raritate: 'bun' }
  },
  {
    id: 'gk3', zona: 'Greenvale', dator: 'cavaler', nivel: 10, cere: 'gk2',
    titlu: 'What Ansel Knew',
    text: 'Sit. I am going to tell you something and then you may do what you ' +
          'like with it.<br><br>' +
          'I knew about the mine. A letter came in spring, from the house whose ' +
          'seal is on those purses, asking leave to survey the old workings. I ' +
          'wrote back that the workings were sealed by order and that leave was ' +
          'refused.<br><br>' +
          'I did not write to the Marshal. I did not post a man on the road. I ' +
          'told myself a refused letter was the end of it, because a relief ' +
          'column was promised and I wanted the spring to be quiet.<br><br>' +
          'It was not the end of it. Fifteen of the things are between here and ' +
          'the second gallery. Go down with me and we will not discuss what I ' +
          'should have done in March.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 15 },
    rasplata: { xp: 2300, bani: 1700, nivelObiect: 11, raritate: 'maiestru' }
  },


  // ==========================================================
  //  REDWASTE - povestea taberei
  //
  //  O tabara nou venita intr-un canion uscat, cu prea putina
  //  apa si prea multi vecini. Aici nu e vorba de cine detine
  //  valea, ci de cine apuca sa bea maine.
  // ==========================================================

  // ---------- Chief Gorrash, in tabara ----------
  {
    id: 'rw1', zona: 'Redwaste', dator: 'chief', nivel: 1,
    titlu: 'Vermin in the Stores',
    text: 'You are new. Stand up straight while I decide what you are worth.<br><br>' +
          'We have been in this canyon four months. Before that we were three ' +
          'days south, and before that somewhere with grass in it, and every ' +
          'time we move we carry less.<br><br>' +
          'What we still carry is in those sacks, and there are rats in those ' +
          'sacks. A warrior does not hunt rats. But you are not a warrior yet - ' +
          'you are a pair of hands with a name I have not bothered to ' +
          'learn.<br><br>' +
          'Kill eight. Then I will learn it.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 },
    rasplata: { xp: 140, bani: 90 }
  },
  {
    id: 'rw2', zona: 'Redwaste', dator: 'chief', nivel: 2, cere: 'rw1',
    titlu: 'Thick Hides',
    text: 'Eight rats and you did not complain once. Good.<br><br>' +
          'Now hide. Our tents are four months old and they were old when we ' +
          'took them. When the wind comes down the wash at night it goes through ' +
          'the canvas like it is not there, and children do not sleep, and ' +
          'mothers do not sleep, and then nobody works.<br><br>' +
          'The boars past the wash are fat and slow and stupid, which is the ' +
          'best combination there is. Ten of them will re-skin the two worst ' +
          'tents.<br><br>' +
          'It is not glory. It is a warm night for twelve people. Go.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 10 },
    rasplata: { xp: 260, bani: 160, nivelObiect: 3, raritate: 'comun' }
  },
  {
    id: 'rw3', zona: 'Redwaste', dator: 'chief', nivel: 5, cere: 'rw2',
    titlu: 'Take Back the Water',
    text: 'Four barrels. That is what we had, and that is what they took, and ' +
          'they killed Hesk to take it.<br><br>' +
          'Hesk was fifteen. He was watching the barrels because watching the ' +
          'barrels is what you give a boy who is not ready for anything else, ' +
          'and because I did not think anyone would come that close to the ' +
          'camp.<br><br>' +
          'They came that close to the camp.<br><br>' +
          'Twelve of them, east, where the tents are. I am not sending you for ' +
          'the water. The water is gone and we will find more. I am sending you ' +
          'so the next warband that counts our tents decides to keep walking.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 12 },
    rasplata: { xp: 780, bani: 500, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'rw4', zona: 'Redwaste', dator: 'chief', nivel: 7, cere: 'rw3',
    titlu: 'Red Strips',
    text: 'Every one of them wears a strip of red cloth. Wrist, arm, or ' +
          'across the brow. I noticed it on the first body and I have been ' +
          'turning it over since.<br><br>' +
          'Raiders do not wear a colour. Raiders wear what they took off the ' +
          'last person. A colour means somebody handed it out, and somebody who ' +
          'hands out cloth is somebody who expects to be recognised.<br><br>' +
          'Bring me six. Old Murgh reads such things - bones, cloth, whatever ' +
          'you put in front of her - and she has been quiet for a week, which ' +
          'means she already suspects something and is waiting to be proved ' +
          'right.<br><br>' +
          'Six strips. Let us find out who dressed them.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 6, obiect: 'Red Strip' },
    rasplata: { xp: 1200, bani: 820, nivelObiect: 8, raritate: 'rar' }
  },
  {
    id: 'rw5', zona: 'Redwaste', dator: 'chief', nivel: 9, cere: 'rw4',
    titlu: 'The Nest',
    text: 'Murgh read the cloth. She would not say the name out loud, which she ' +
          'has never done before in thirty years, and that frightened me more ' +
          'than the answer would have.<br><br>' +
          'What she did say is this: the man who dressed them was cast out of a ' +
          'warband once, and a cast-out chief spends the rest of his life ' +
          'building a bigger one.<br><br>' +
          'Before we go east I want our own ground clean. There is a crack in ' +
          'the rock north of here that the scorpids come out of, and they come ' +
          'out at night, and I will not fight two things at once.<br><br>' +
          'Twelve. Go in, come out. That is the whole of it.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 12 },
    rasplata: { xp: 1800, bani: 1200, nivelObiect: 10, raritate: 'rar' }
  },
  {
    id: 'rw6', zona: 'Redwaste', dator: 'chief', nivel: 10, cere: 'rw5',
    titlu: 'Break the Warband',
    text: 'They are gathered in the south, all of them, under one banner that ' +
          'has no right to fly.<br><br>' +
          'I could take the camp west instead. Three days\' walk, no water on ' +
          'the way, and we would arrive with fewer than we left with - but we ' +
          'would arrive. I have done it twice. I know exactly what it costs.<br><br>' +
          'I am not doing it a third time. The children in those tents have ' +
          'moved four times and they have stopped asking where we are going, ' +
          'which is worse than crying about it.<br><br>' +
          'Fifteen of them and their chief behind. You have earned the right to ' +
          'be the one who walks in first. Go, and when you come out we will call ' +
          'this place ours and mean it.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 15 },
    rasplata: { xp: 2400, bani: 1800, nivelObiect: 11, raritate: 'maiestru' }
  },

  // ---------- Kaza Boneclaw, vanatoarea ----------
  {
    id: 'rh1', zona: 'Redwaste', dator: 'vanator', nivel: 3,
    titlu: 'Feathers for the Fletcher',
    text: 'Hold still. No - your feet. You put them down like you are angry at ' +
          'the ground. Out there that is the difference between eating and ' +
          'being eaten.<br><br>' +
          'I need feathers. Six good ones, stiff through the spine, off the ' +
          'dust vultures. Six feathers is six arrows, and six arrows is a boar ' +
          'from thirty paces instead of a wrestling match.<br><br>' +
          'They are never far. In this country something is always dying, and ' +
          'they know it before we do.<br><br>' +
          'Go. Quietly, if you can manage it.',
    cerinta: { fel: 'aduna', mob: 'vulture', cati: 6, obiect: 'Stiff Feather' },
    rasplata: { xp: 400, bani: 270, nivelObiect: 4, raritate: 'bun' }
  },
  {
    id: 'rh2', zona: 'Redwaste', dator: 'vanator', nivel: 4, cere: 'rh1',
    titlu: 'They Circle the Camp',
    text: 'Look up. Go on.<br><br>' +
          'Nine of them, over our own tents, and they have been there since ' +
          'yesterday morning. Vultures circle where something is going to die. ' +
          'Not where something has died - where it is going to.<br><br>' +
          'I have hunted them for eleven years and I have never known them to be ' +
          'wrong. That is not a thing I enjoy saying out loud in the middle of ' +
          'my own camp.<br><br>' +
          'Ten of them. I want them to look at this camp and remember something ' +
          'unpleasant.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 10 },
    rasplata: { xp: 560, bani: 380, nivelObiect: 5, raritate: 'comun' }
  },
  {
    id: 'rh3', zona: 'Redwaste', dator: 'vanator', nivel: 5, cere: 'rh2',
    titlu: 'Serpents in the Wash',
    text: 'The dry riverbed is the only easy road south. Everything else is ' +
          'loose rock and it will break a leg in the dark.<br><br>' +
          'It is full of serpents. Not the usual two or three sunning ' +
          'themselves - full. I counted nineteen in one afternoon between the ' +
          'bend and the black rock, and I stopped counting because I ran out of ' +
          'places to put my feet.<br><br>' +
          'They came up from the south. Something down there stopped being ' +
          'comfortable and they are all moving the same direction, which is ' +
          'toward us.<br><br>' +
          'Twelve. Open the road. I would like to know what they are running from.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 12 },
    rasplata: { xp: 760, bani: 480, nivelObiect: 6, raritate: 'bun' }
  },

  // ---------- Old Murgh, bonecaster ----------
  {
    id: 'rs1', zona: 'Redwaste', dator: 'samana', nivel: 5,
    titlu: 'Venom Keeps a Wound Open',
    text: 'Come closer. My eyes are not what they were and I want to see what ' +
          'the camp has sent me this time.<br><br>' +
          'Hm. You will do.<br><br>' +
          'Scorpid venom keeps a wound from closing. That is a bad thing when it ' +
          'is in you and a useful thing when it is on a blade, and I have never ' +
          'been able to afford the luxury of caring which.<br><br>' +
          'Eight stingers. Curved ones, from the big ones - the small ones are ' +
          'all shell and no sac. Bring them to me and I will put a coating on ' +
          'something of yours that will make the next fight shorter.<br><br>' +
          'And do not squeeze them on the way back. I have had that conversation before.',
    cerinta: { fel: 'aduna', mob: 'scorpid', cati: 8, obiect: 'Curved Stinger' },
    rasplata: { xp: 800, bani: 520, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'rs2', zona: 'Redwaste', dator: 'samana', nivel: 6, cere: 'rs1',
    titlu: 'Shed Skins',
    text: 'A serpent sheds its skin when it is growing, or when it is sick, or ' +
          'when it is frightened. Three reasons, and the skin tells you which.<br><br>' +
          'Kaza brought me one from the wash and it was wrong. Shed early, shed ' +
          'whole, shed in the open where anything could find it. That is a ' +
          'frightened animal, and a frightened animal does not stop to be ' +
          'tidy.<br><br>' +
          'Six more, from six different serpents. If they all read the same way ' +
          'then something has walked into the south of this country that every ' +
          'living thing there has decided to leave.<br><br>' +
          'I would very much like to be wrong about that. Go and let me be wrong.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 6, obiect: 'Shed Skin' },
    rasplata: { xp: 1000, bani: 660, nivelObiect: 7, raritate: 'bun' }
  },
  {
    id: 'rs3', zona: 'Redwaste', dator: 'samana', nivel: 7, cere: 'rs2',
    titlu: 'The Bones Say East',
    text: 'I was wrong, and I am relieved, and you will not hear me say that ' +
          'twice in one season.<br><br>' +
          'The skins do not point south. They point east - the serpents came up ' +
          'the wash from the south because something pushed them off the eastern ' +
          'flats first. Men, camping where men have no business camping, with ' +
          'fires every night for a month.<br><br>' +
          'So it is people after all. People are easier. People can be reasoned ' +
          'with, and when they cannot, they can be counted.<br><br>' +
          'But the scorpids are still between us and them, and I will not have ' +
          'the camp fighting east with its back to a nest. Twelve. Clear behind ' +
          'us before we turn around.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 12 },
    rasplata: { xp: 1250, bani: 850, nivelObiect: 8, raritate: 'rar' }
  },

  // ---------- Zib Sandrunner, cercetasul ----------
  {
    id: 'rc1', zona: 'Redwaste', dator: 'cercetas', nivel: 4,
    titlu: 'Scouts Do Not Come Back',
    text: 'I run the wash. That is the job. South in the morning, back by dark, ' +
          'and tell the Chief what is between here and the bend.<br><br>' +
          'Two weeks ago I ran it with Fen. Fen went ahead because Fen always ' +
          'went ahead, and I stopped to pull a thorn out of my foot, and that is ' +
          'the entire reason I am the one standing here telling you this.<br><br>' +
          'I did not see it happen. I heard it. Then I ran, and I have not told ' +
          'the Chief that part, and you will not either.<br><br>' +
          'Twelve serpents. I want to go back down there and I cannot make my ' +
          'feet do it while they are still thick on the ground.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 12 },
    rasplata: { xp: 600, bani: 400, nivelObiect: 5, raritate: 'bun' }
  },
  {
    id: 'rc2', zona: 'Redwaste', dator: 'cercetas', nivel: 6, cere: 'rc1',
    titlu: 'Count the Tents',
    text: 'I got east. Two days, wide around the rocks, and I lay on the ridge ' +
          'above their camp from dusk until it was light enough to be ' +
          'stupid.<br><br>' +
          'Here is what I counted. Nineteen tents. Four fires kept burning all ' +
          'night, which means they are not hiding. A stockade, half-built, which ' +
          'means they intend to still be there next season.<br><br>' +
          'And our water barrels. Stacked by the big tent, not even emptied, ' +
          'like they were trophies rather than the reason Hesk is dead.<br><br>' +
          'Ten of them, from the edge of the camp. Quietly, so they do not learn ' +
          'how many of us there are. That number is the only thing we have that ' +
          'they do not.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 10 },
    rasplata: { xp: 1050, bani: 700, nivelObiect: 7, raritate: 'bun' }
  },
  {
    id: 'rc3', zona: 'Redwaste', dator: 'cercetas', nivel: 8, cere: 'rc2',
    titlu: 'The Vultures Know First',
    text: 'Something has changed east. I have been up on that ridge four times ' +
          'now and I can read a camp the way Murgh reads a bone.<br><br>' +
          'Twenty-six tents, not nineteen. Two more fires. And the vultures have ' +
          'moved - they are not over their camp any more, they are over the ' +
          'ground between their camp and ours.<br><br>' +
          'Kaza says vultures circle where something is going to die. I used to ' +
          'think that was a hunter\'s story. I have stopped thinking that.<br><br>' +
          'Twelve of them, out of the air, before they finish telling everything ' +
          'in this canyon where the bodies are going to be.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 12 },
    rasplata: { xp: 1500, bani: 1000, nivelObiect: 9, raritate: 'rar' }
  },

  // ---------- Captain Drex ----------
  {
    id: 'rd1', zona: 'Redwaste', dator: 'capitan', nivel: 8,
    titlu: 'Blood for the Barrels',
    text: 'I was on the barrels with Hesk. I want that said plainly, before ' +
          'somebody else says it for me.<br><br>' +
          'I went twenty paces to look at a noise in the rocks. The noise was ' +
          'nothing. When I came back there were four of them and one of me and ' +
          'Hesk was already down, and I killed two and the other two took the ' +
          'water.<br><br>' +
          'The Chief has not said a word about it to me in four months. Not one ' +
          'word. I would rather he had broken my jaw.<br><br>' +
          'Twelve, from the eastern camp. I am not asking you to do it for me. I ' +
          'am asking you to do it with me.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 12 },
    rasplata: { xp: 1600, bani: 1100, nivelObiect: 9, raritate: 'bun' }
  },
  {
    id: 'rd2', zona: 'Redwaste', dator: 'capitan', nivel: 9, cere: 'rd1',
    titlu: 'Stingers for the Blades',
    text: 'When we go east we go once. There will not be a second walk across ' +
          'that ground with our numbers.<br><br>' +
          'So every blade in this camp gets a coating before we leave. Murgh has ' +
          'the recipe and the patience; what she does not have is stingers, ' +
          'because she used the last of them on a boy who stepped on a ' +
          'nest.<br><br>' +
          'Eight. Big ones. I have twenty-two fighters and eleven of them have ' +
          'never stood in a line, and a coated blade will not fix that, but it ' +
          'will shorten what they have to stand through.<br><br>' +
          'Bring them to me and I will take them to her myself.',
    cerinta: { fel: 'aduna', mob: 'scorpid', cati: 8, obiect: 'Black Stinger' },
    rasplata: { xp: 1850, bani: 1250, nivelObiect: 10, raritate: 'rar' }
  },
  {
    id: 'rd3', zona: 'Redwaste', dator: 'capitan', nivel: 10, cere: 'rd2',
    titlu: "The Exile's Banner",
    text: 'Murgh finally said the name. She said it to me, at night, outside the ' +
          'firelight, because she did not want the Chief to hear it from her ' +
          'first.<br><br>' +
          'He was one of ours. Cast out eleven years ago, before my time, for ' +
          'something nobody in this camp will describe in daylight. The red ' +
          'strips are his colour. He has been building that warband ever since ' +
          'and he has been building it toward us.<br><br>' +
          'That is why the barrels. That is why they camped close enough for a ' +
          'boy on watch to matter.<br><br>' +
          'Fifteen of them, and the banner comes down. I will be on your left. ' +
          'The Chief will be on your right, and whatever passed between him and ' +
          'that man eleven years ago, it ends on the flats tomorrow.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 15 },
    rasplata: { xp: 2350, bani: 1750, nivelObiect: 11, raritate: 'maiestru' }
  }
];


function gasesteMisiunea(id) {
  return MISIUNI.find(function (m) { return m.id === id; }) || null;
}


// ----------------------------------------------------------
//  Ce stie personajul despre misiuni
//
//  personaj.misiuni = {
//    'gv1': { stare: 'activa' | 'gata' | 'predata', cate: 3 }
//  }
// ----------------------------------------------------------
function starea(personajul, id) {
  const m = (personajul.misiuni || {})[id];
  return m ? m.stare : 'neluata';
}

function cate(personajul, id) {
  const m = (personajul.misiuni || {})[id];
  return m ? m.cate : 0;
}


// Poti lua misiunea asta acum?
function poateFiLuata(personajul, misiune) {
  if (starea(personajul, misiune.id) !== 'neluata') return false;
  if (personajul.nivel < misiune.nivel) return false;
  if (misiune.clasa && misiune.clasa !== personajul.idClasa) return false;
  if (misiune.cere && starea(personajul, misiune.cere) !== 'predata') return false;
  return true;
}


// Toate misiunile pe care le da un anumit personaj, in ordine.
//
// Misiunile de clasa au 'oriunde: true': antrenorul tau ti le da in
// orice oras, nu doar in cel in care s-a nimerit sa fie scrise. Si
// nu le vezi niciodata pe ale altei clase.
function misiunileLui(personajul, numeleZonei, felulNpc) {
  return MISIUNI.filter(function (m) {
    if (m.dator !== felulNpc) return false;
    if (!m.oriunde && m.zona !== numeleZonei) return false;
    if (m.clasa && m.clasa !== personajul.idClasa) return false;
    return true;
  });
}


// Ce semn ii punem deasupra capului:
//   '!'  are ceva de dat
//   '?'  ai terminat ceva si trebuie sa te intorci
//   '...' ai luat, dar n-ai terminat inca
//   ''   nimic
function semnulLui(personajul, numeleZonei, felulNpc) {

  const ale = misiunileLui(personajul, numeleZonei, felulNpc);
  if (ale.some(function (m) { return starea(personajul, m.id) === 'gata'; })) return '?';
  if (ale.some(function (m) { return poateFiLuata(personajul, m); })) return '!';
  if (ale.some(function (m) { return starea(personajul, m.id) === 'activa'; })) return '...';
  return '';
}


function iaMisiunea(personajul, id) {
  const misiune = gasesteMisiunea(id);
  if (!misiune || !poateFiLuata(personajul, misiune)) return false;
  personajul.misiuni = personajul.misiuni || {};
  personajul.misiuni[id] = { stare: 'activa', cate: 0 };
  return true;
}


// Renunti la o misiune luata. Se sterge de tot, deci o poti lua din
// nou de la cap de la acelasi om, si numaratoarea o ia de la zero.
// O misiune deja predata nu se atinge.
function renuntaLaMisiune(personajul, id) {
  const a = (personajul.misiuni || {})[id];
  if (!a || a.stare === 'predata') return false;
  delete personajul.misiuni[id];
  if (personajul.misiuneUrmarita === id) personajul.misiuneUrmarita = null;
  return true;
}


function misiuniActive(personajul) {
  return MISIUNI.filter(function (m) {
    const s = starea(personajul, m.id);
    return s === 'activa' || s === 'gata';
  });
}


// Adauga unu la numaratoarea unei misiuni si spune daca s-a umplut.
function adaugaLaMisiune(personajul, id) {

  const misiune = gasesteMisiunea(id);
  const a = personajul.misiuni[id];
  if (!misiune || !a || a.stare !== 'activa') return false;

  a.cate = Math.min(misiune.cerinta.cati, a.cate + 1);
  if (a.cate >= misiune.cerinta.cati) {
    a.stare = 'gata';
    return true;      // tocmai s-a terminat
  }
  return false;
}


// Ai omorat ceva. Se cheama din joc, la fiecare inamic ucis.
// Da inapoi lista misiunilor care au avansat, ca sa scrie pe ecran.
//  numeleMobului = numele scris deasupra lui, daca are unul (sefii
//  de temnita si cei rari au). O misiune care cere un SEF ANUME nu
//  trebuie bifata de oricare inamic de acelasi fel: "omoara-l pe
//  Corvin Ashe" nu se termina omorand un raider la intamplare.
function amUcis(personajul, felulMobului, numeleMobului) {

  const avansate = [];

  misiuniActive(personajul).forEach(function (m) {
    if (m.cerinta.fel !== 'ucide') return;
    if (m.cerinta.mob !== felulMobului) return;
    if (m.cerinta.numeSef && m.cerinta.numeSef !== numeleMobului) return;
    if (starea(personajul, m.id) !== 'activa') return;

    const terminata = adaugaLaMisiune(personajul, m.id);
    avansate.push({ misiune: m, cate: cate(personajul, m.id), terminata: terminata });
  });

  return avansate;
}


// Ai ajuns la un loc de pe harta (mina, pestera, cetatea).
// Se cheama din joc de cateva ori pe secunda, cu locul de langa tine.
// Misiunile de fel 'mergi' se termina singure, fara sa omori nimic.
function amAjunsLa(personajul, idLoc) {

  const avansate = [];

  misiuniActive(personajul).forEach(function (m) {
    if (m.cerinta.fel !== 'mergi') return;
    if (m.cerinta.loc !== idLoc) return;
    if (starea(personajul, m.id) !== 'activa') return;

    const terminata = adaugaLaMisiune(personajul, m.id);
    avansate.push({ misiune: m, cate: cate(personajul, m.id), terminata: terminata });
  });

  return avansate;
}


// Ce lucruri de misiune pot sa cada de la inamicul asta, acum.
// Se cheama cand moare un inamic, ca sa punem in trupul lui si
// ce cere misiunea, pe langa bani si obiecte.
function obiecteDeMisiuneDeLa(personajul, felulMobului) {

  const cazute = [];

  misiuniActive(personajul).forEach(function (m) {
    if (m.cerinta.fel !== 'aduna') return;
    if (m.cerinta.mob !== felulMobului) return;
    if (starea(personajul, m.id) !== 'activa') return;
    if (cate(personajul, m.id) >= m.cerinta.cati) return;
    if (Math.random() * 100 >= SANSA_OBIECT_DE_MISIUNE) return;

    cazute.push({ idMisiune: m.id, nume: m.cerinta.obiect });
  });

  return cazute;
}


// Cat scrie in carnet la o misiune: "Field Rat slain: 3/8"
function textulCerintei(personajul, misiune) {

  const c = misiune.cerinta;
  const cati = cate(personajul, misiune.id);

  if (c.fel === 'aduna') {
    return c.obiect + ': ' + cati + '/' + c.cati;
  }
  // La fel ca celelalte doua randuri de mai sus: numele lucrului,
  // doua puncte, cat ai facut din cat. Numele e cel scris in reteta
  // zonei, acelasi pe care il vezi si pe harta.
  if (c.fel === 'mergi') {
    return c.numeLoc + ': ' + cati + '/' + c.cati;
  }
  const numeMob = (typeof MOBI !== 'undefined' && MOBI[c.mob]) ? MOBI[c.mob].nume : c.mob;
  return numeMob + ' slain: ' + cati + '/' + c.cati;
}


// ----------------------------------------------------------
//  Rasplata
//
//  Obiectele de rasplata se fac o singura data, la prima privire,
//  si raman aceleasi - altfel s-ar schimba sub ochii tai de
//  fiecare data cand deschizi fereastra.
// ----------------------------------------------------------
const RASPLATA_FACUTA = {};

function obiecteleDeRasplata(misiune) {

  if (!misiune.rasplata.nivelObiect) return [];
  if (RASPLATA_FACUTA[misiune.id]) return RASPLATA_FACUTA[misiune.id];

  // Doua de ales, din sloturi diferite, ca alegerea sa insemne ceva.
  const alese = [];
  const amestecate = SLOTURI.slice().sort(function () { return Math.random() - 0.5; });
  for (let i = 0; i < 2; i++) {
    alese.push(faObiect(amestecate[i].id, misiune.rasplata.nivelObiect, misiune.rasplata.raritate));
  }

  RASPLATA_FACUTA[misiune.id] = alese;
  return alese;
}


// Preda misiunea si ia rasplata. idObiectAles poate lipsi daca
// misiunea nu da obiecte.
function predaMisiunea(personajul, id, idObiectAles) {

  const misiune = gasesteMisiunea(id);
  if (!misiune || starea(personajul, id) !== 'gata') return null;

  const alegeri = obiecteleDeRasplata(misiune);
  let obiect = null;

  if (alegeri.length > 0) {
    obiect = alegeri.find(function (o) { return o.id === idObiectAles; }) || alegeri[0];
    if (!maiEsteLocInRucsac(personajul)) return { rucsacPlin: true };
  }

  personajul.misiuni[id].stare = 'predata';
  iaBani(personajul, misiune.rasplata.bani);
  if (obiect) pomeneInRucsac(personajul, obiect);

  // Unele misiuni nu dau un lucru, ci te invata ceva.
  const invatate = [];
  (misiune.rasplata.abilitati || []).forEach(function (idAb) {
    const primita = daruiesteAbilitatea(personajul, idAb);
    if (primita) invatate.push(primita);
  });

  return {
    xp: misiune.rasplata.xp, bani: misiune.rasplata.bani,
    obiect: obiect, abilitati: invatate
  };
}
