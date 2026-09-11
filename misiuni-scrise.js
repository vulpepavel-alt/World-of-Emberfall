// ==========================================================
//  MISIUNILE SCRISE DE MANA, ZONA CU ZONA
//
//  Fisierul asta e raspunsul la o nemultumire dreapta: misiunile
//  facute dupa tipare se simteau turnate in acelasi calup. Oricat
//  am marit numarul tiparelor, tot tipare ramaneau.
//
//  Aici fiecare zona are POVESTEA EI. Nu "te ataca lupii", ci un
//  lucru anume care se intampla acolo si nicaieri altundeva: un
//  far care se stinge in noptile proaste, o mina veche pecetluita
//  de bunici cu un motiv scris pe usa pe care nu-l mai citeste
//  nimeni, o padure care a inaintat patru sute de pasi intr-un
//  singur anotimp si a inghitit un drum.
//
//  Cele patru misiuni ale unei zone spun impreuna povestea aia,
//  de la primul om care iti zice ca e ceva in neregula pana la
//  cel care iti spune ce era.
//
//  CUM SE LEAGA CU RESTUL:
//  Motorul din misiuni-zone.js sare peste orice zona care are deja
//  misiuni in lista MISIUNI. Deci fiecare zona scrisa aici inceteaza
//  singura sa mai primeasca misiuni facute dupa tipare. Nu trebuie
//  schimbat nimic in alta parte.
//
//  Rasplata se socoteste cu ACEEASI formula ca la cele generate,
//  ca sa nu se strice cat de repede urci in niveluri.
// ==========================================================


// Cati bani si cata experienta da o misiune. Aceleasi numere ca la
// misiunile generate: o misiune de lupta face cam trei sferturi
// dintr-un nivel, una de mers doar mers plateste mai putin.
function rasplataScrisa(nivel, felCerintei, esteUltima, estePrima) {

  const greu = (felCerintei === 'mergi') ? 0.4 : 0.75;

  const r = {
    xp: Math.round(140 * Math.pow(nivel, 1.22) * greu),
    bani: Math.round(60 * Math.pow(nivel, 1.1) * greu)
  };

  // Prima misiune a unei zone da doar bani si experienta. Restul
  // dau si un obiect de ales, iar ultima unul rar.
  if (!estePrima && felCerintei !== 'mergi') {
    r.nivelObiect = Math.min(60, nivel + 1);
    r.raritate = esteUltima ? 'rar' : 'bun';
  }
  return r;
}


// Adauga in lista cele patru misiuni ale unei zone, legate in lant:
// a doua o poti lua abia dupa ce o predai pe prima.
function scrieZona(numeZona, idZona, lista) {

  lista.forEach(function (m, i) {

    const cerinta = Object.assign({}, m.cerinta);

    // O misiune de mers are nevoie de numele intreg al locului, cu
    // zona in fata - altfel "mina" din Ironhill ar fi aceeasi cu
    // "mina" din Mistwood.
    if (cerinta.fel === 'mergi') {
      cerinta.loc = idZona + ':' + cerinta.loc;
      cerinta.cati = 1;
    }

    MISIUNI.push({
      id: idZona + '-q' + (i + 1),
      zona: numeZona,
      dator: m.dator,
      nivel: m.nivel,
      cere: (i > 0) ? (idZona + '-q' + i) : undefined,
      titlu: m.titlu,
      text: m.text,
      cerinta: cerinta,
      rasplata: rasplataScrisa(m.nivel, cerinta.fel,
                               i === lista.length - 1, i === 0)
    });
  });
}


// ==========================================================
//  EASTMARCH
// ==========================================================


// ----------------------------------------------------------
//  GRAVEMOOR (1-10) - mlastina da inapoi ce a inghitit
// ----------------------------------------------------------
scrieZona('Gravemoor', 'gravemoor', [
  {
    dator: 'chief', nivel: 1,
    titlu: 'The Water Came Up Early',
    text: 'You have arrived in a bad month and I am not going to pretend ' +
          'otherwise.<br><br>' +
          'The water comes up every spring. That is not news and nobody here ' +
          'would call it a disaster. What is news is that it came up in the ' +
          'second week instead of the sixth, and it came into the grain store ' +
          'before anyone had thought to move the grain.<br><br>' +
          'Now the store is full of rats and the rats are full of our winter.<br><br>' +
          'Kill eight of them. It is not a great task and I will not pay you ' +
          'like it was one, but it is the task in front of us.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'taran', nivel: 3,
    titlu: 'Where It Came From',
    text: 'The chief thinks the water rose. I have farmed this edge for ' +
          'thirty-one years and I am telling you the water did not rise. It ' +
          'came sideways.<br><br>' +
          'There is a cutting out past the reeds where they took peat before I ' +
          'was born. That cutting has been dry my whole life. It is not dry ' +
          'now, and whatever is filling it is filling it faster than rain ' +
          'could.<br><br>' +
          'Go and stand at the edge of it. Do not climb down.<br><br>' +
          'I would go myself, but I am sixty-four and the last person who went ' +
          'down there was my brother.',
    cerinta: { fel: 'mergi', loc: 'groapa', numeLoc: 'the old peat cutting' }
  },
  {
    dator: 'cavaler', nivel: 6,
    titlu: 'Eight Coffins and No Thread',
    text: 'The bog has given back four coffins this month and the wood on all ' +
          'four has gone. We cannot carry what is inside them up to dry ground ' +
          'in our arms, and I will not let it be done with a shovel.<br><br>' +
          'So they get wound and they get carried properly.<br><br>' +
          'The only thread strong enough in this country comes off the spiders ' +
          'in the deep reeds. Eight bundles will do the four we have and the ' +
          'ones I expect next week.<br><br>' +
          'These were people. Some of them are somebody\'s grandmother. Bring ' +
          'me the thread and we will do this the way it should be done.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 8, obiect: 'Bog-Silk Bundle' }
  },
  {
    dator: 'chief', nivel: 8,
    titlu: 'What Came Up With It',
    text: 'I owe you an apology. You said it was not the season and I said it ' +
          'was, and I said it because I wanted it to be.<br><br>' +
          'The water brought something up with it. They are in the flooded ' +
          'ground between here and the cutting, they are digging, and they are ' +
          'digging toward the dry side, which is where we keep everything and ' +
          'everyone.<br><br>' +
          'Fourteen of them. I have counted more than that but fourteen is what ' +
          'I think one person can do without dying, and I have had enough of ' +
          'being wrong this month.<br><br>' +
          'Take whatever you want off them. Come back.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  HOLLOWMERE (10-20) - un secret tinut pentru salarii
// ----------------------------------------------------------
scrieZona('Hollowmere', 'hollowmere', [
  {
    dator: 'marshal', nivel: 10,
    titlu: 'Nothing Unusual, Officially',
    text: 'Welcome to Hollowmere. Everything here is normal and I will thank ' +
          'you to keep saying so where the miners can hear.<br><br>' +
          'What is not normal is the rats. They came out of the cutting three ' +
          'weeks ago, all at once, in daylight, and they came out of the ' +
          'cutting rather than into it, which is backwards for a rat.<br><br>' +
          'I have asked the mine foreman about it twice and been told twice ' +
          'that it is nothing.<br><br>' +
          'Kill eight. Then, if you have the patience for it, go and ask him ' +
          'yourself. He will not lie to a stranger as easily as he lies to me.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'miner', nivel: 13,
    titlu: 'Come and Look at the Floor',
    text: 'All right. Yes. There is something.<br><br>' +
          'We cut peat. Peat is dead plants pressed flat for a thousand years ' +
          'and there is nothing under peat except more peat, and then clay, and ' +
          'then rock, in that order, always.<br><br>' +
          'Nine days ago the cutting went through onto a floor. A flat one. ' +
          'Laid, not fallen. With a pattern.<br><br>' +
          'I have not reported it because the day I report it a man from ' +
          'somewhere else closes my cutting and eighty people here stop eating. ' +
          'So I am telling you instead.<br><br>' +
          'Go down to the cutting and see it. Then tell me I am imagining it.',
    cerinta: { fel: 'mergi', loc: 'groapa', numeLoc: 'the peat cutting' }
  },
  {
    dator: 'padurar', nivel: 15,
    titlu: 'The Skins Are Wrong',
    text: 'Forget the floor for an hour. Look at this instead.<br><br>' +
          'Serpent skin, shed this month, out of the wet ground on the cutting ' +
          'side. Now feel it. That is not the skin of a thing that lives in a ' +
          'bog. A bog animal sheds soft. This is hard, and it is pale, and I ' +
          'have seen skins off the same kind of animal a mile east that are ' +
          'exactly what they should be.<br><br>' +
          'So it is not the species. It is the ground.<br><br>' +
          'Bring me seven of the pale ones. Only from the cutting side - if you ' +
          'take one from the east you have wasted both our time.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 7, obiect: 'Pale Shed Skin' }
  },
  {
    dator: 'armurier', nivel: 18,
    titlu: 'Then We Close It Ourselves',
    text: 'The foreman has come round. He is not a stupid man; he only needed ' +
          'to be shown twice.<br><br>' +
          'We are going to fill that cutting in. Not report it, not sell it, ' +
          'not let anybody down there for a look. Fill it, and put the workings ' +
          'a quarter mile west where the peat is worse and the ground is only ' +
          'ground.<br><br>' +
          'We cannot do it while the burrowers are working the same hole from ' +
          'underneath. Fourteen of them and we can start carting.<br><br>' +
          'Eighty people keep their wages and nobody has to be brave. That is ' +
          'the best ending I know how to arrange.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THORNMOOR (10-20) - orasul si tinutul nu cad de acord
// ----------------------------------------------------------
scrieZona('Thornmoor', 'thornmoor', [
  {
    dator: 'marshal', nivel: 10,
    titlu: 'The Moor Owes Ambervault',
    text: 'You are standing in Ambervault, which is the second city of this ' +
          'coast and never lets anybody forget it was not the first.<br><br>' +
          'The moor outside the wall owes the city eleven cartloads and has ' +
          'sent none. The council has decided this is banditry. I am the one ' +
          'who has to make that decision true.<br><br>' +
          'Start small and start honest: the rats in the grain yards inside the ' +
          'wall. Eight of them. It is a city job and it needs doing.<br><br>' +
          'When that is done, go outside and ask somebody who was not born in ' +
          'here what they think is happening. I would like an answer that did ' +
          'not come out of a council chamber.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'negustor', nivel: 13,
    titlu: 'Ask at the Toll Post',
    text: 'Eleven cartloads. I have heard the number so often this month I ' +
          'could sing it.<br><br>' +
          'Here is what nobody in the chamber wants said out loud: the carts ' +
          'left. I have four sellers on the moor and all four swear their carts ' +
          'went out on the road, on the day, loaded.<br><br>' +
          'Between them and this gate there is exactly one place where a cart ' +
          'has to stop, and that is the toll post on the moor road.<br><br>' +
          'Go out there. Look at it. Count the people standing in it and ' +
          'remember their faces.<br><br>' +
          'I am not accusing anybody. I am asking somebody to go and look, ' +
          'which is apparently a radical idea here.',
    cerinta: { fel: 'mergi', loc: 'post', numeLoc: 'the moor toll post' }
  },
  {
    dator: 'padurar', nivel: 15,
    titlu: 'Tally Sticks in the Heather',
    text: 'City folk keep count on tally sticks. A notch for every cartload, ' +
          'split down the middle, half for the carter and half for the clerk, ' +
          'so neither can lie about it afterward.<br><br>' +
          'I have been finding halves of them out in the heather where the ' +
          'bandits camp. Only the clerk\'s halves. Never the carter\'s.<br><br>' +
          'That means the bandits are getting them from somebody who was ' +
          'holding the clerk\'s half, which is not a carter and is not a ' +
          'bandit.<br><br>' +
          'Bring me seven off them. Seven is enough that no magistrate in ' +
          'Ambervault can call it a coincidence, and I intend to make one of ' +
          'them try.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 7, obiect: 'Clerk\'s Tally Half' }
  },
  {
    dator: 'cavaler', nivel: 18,
    titlu: 'The Arrests Nobody Wanted',
    text: 'Two clerks are in a cell under this keep and a third got out of the ' +
          'city before dawn. The council is furious, mostly at me.<br><br>' +
          'That is the clean half. The dirty half is out on the moor: the men ' +
          'they were paying, who have just discovered they are not being paid ' +
          'any more and have no reason left to be careful about who they ' +
          'rob.<br><br>' +
          'Fourteen of them. Take the ones on the road first - that is where ' +
          'they will hurt somebody who did nothing.<br><br>' +
          'You will not be thanked in there. You will be thanked out here, ' +
          'which in my experience is the half worth having.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  BRAMBLEWATCH (15-25) - taranii tin granita in locul soldatilor
// ----------------------------------------------------------
scrieZona('Bramblewatch', 'bramblewatch', [
  {
    dator: 'marshal', nivel: 15,
    titlu: 'We Are Not Soldiers',
    text: 'I want you to understand what you have walked into before you ' +
          'decide to stay.<br><br>' +
          'This is a border watch. It is supposed to be held by sixty ' +
          'professionals. It is currently held by me, a blacksmith, two ' +
          'brothers who farm turnips, and a woman who is very good with a ' +
          'billhook and eleven years older than my mother.<br><br>' +
          'The soldiers were called east in the spring. Nobody has told us ' +
          'anything since.<br><br>' +
          'Start with the boars in the lower fields. Eight. They are the only ' +
          'enemy we have that we can definitely beat, and the turnip brothers ' +
          'could use a win.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'padurar', nivel: 18,
    titlu: 'A Tally for People Who Cannot Come',
    text: 'The watch gets paid by the pelt. It always has. Seven pelts is a ' +
          'month for a family and that is how this place has fed itself since ' +
          'before the soldiers ever came.<br><br>' +
          'Half the people entitled to draw it cannot walk out and earn it any ' +
          'more. Not since the wolves got bold enough to take somebody off the ' +
          'path in daylight.<br><br>' +
          'So bring me seven pelts and I will put them against the names that ' +
          'cannot come and get them.<br><br>' +
          'It is charity dressed up as a tally. Everybody here knows it. ' +
          'Nobody says it, and I would take it kindly if you did not either.',
    cerinta: { fel: 'aduna', mob: 'wolf', cati: 7, obiect: 'Watch Tally Pelt' }
  },
  {
    dator: 'miner', nivel: 20,
    titlu: 'Somebody Has to Go Up',
    text: 'There is a watchkeep on the high ground. Stone, four floors, built ' +
          'when this border meant something.<br><br>' +
          'Nobody has been up since the soldiers left. Not because it is ' +
          'dangerous - because it is theirs, and going up feels like admitting ' +
          'they are not coming back.<br><br>' +
          'I am the only one here who has said that out loud, which is why I am ' +
          'the one asking you.<br><br>' +
          'Go up to the keep. See whether the beacon wood is dry, whether the ' +
          'well still gives, whether the doors hold.<br><br>' +
          'If we ever have to put everybody inside those walls, I would rather ' +
          'know beforehand than find out with the whole village behind me.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the watchkeep' }
  },
  {
    dator: 'marshal', nivel: 23,
    titlu: 'They Know We Are Thin',
    text: 'The keep is sound. Thank you. I have not slept properly since the ' +
          'spring and I slept last night.<br><br>' +
          'Now the bad half. Bandits have started using the east track in ' +
          'daylight, in numbers, without scouts out. You only travel like that ' +
          'when you are certain nobody will stop you.<br><br>' +
          'Which means somebody has told them exactly how many of us there ' +
          'are.<br><br>' +
          'Fourteen. Do it where they can see it being done, and do not be ' +
          'quiet about it.<br><br>' +
          'I would rather they thought the soldiers came back than knew the ' +
          'truth, which is that they did not and we are still here anyway.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  RAVENSREACH (15-25) - cine aprinde focul la post?
// ----------------------------------------------------------
scrieZona('Ravensreach', 'ravensreach', [
  {
    dator: 'marshal', nivel: 15,
    titlu: 'The Chain of Fires',
    text: 'Nine posts across this reach, one every four miles, each in sight of ' +
          'the next. Light the first and in a quarter of an hour the coast ' +
          'knows.<br><br>' +
          'It is the only thing this stretch of nothing is good for and it has ' +
          'worked for ninety years.<br><br>' +
          'Before I put anything else on you: the boars have got into the ' +
          'ground between the third and fourth posts and a runner cannot get ' +
          'through at night. Eight of them.<br><br>' +
          'A chain is only as good as the people who can walk between the ' +
          'links, and right now mine will not.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'cavaler', nivel: 18,
    titlu: 'The Sixth Post',
    text: 'Here is the thing I have not been able to say to anybody without ' +
          'sounding like a fool.<br><br>' +
          'The sixth post lights every night. On time. Correct height, correct ' +
          'colour, damped at dawn the way the drill says.<br><br>' +
          'Nobody has seen a living soul at the sixth post in thirty-one days. ' +
          'Its two watchmen came off duty in the spring and were never replaced, ' +
          'because I could not find anybody to replace them with.<br><br>' +
          'So somebody is up there doing the drill perfectly, every night, and ' +
          'has not once come down for food or pay.<br><br>' +
          'Ride out and look. I am not sending a boy to do this.',
    cerinta: { fel: 'mergi', loc: 'post', numeLoc: 'the sixth signal post' }
  },
  {
    dator: 'taran', nivel: 20,
    titlu: 'Feathers Off the Fire',
    text: 'You have seen it, then. Good. Now here is mine, because mine is ' +
          'smaller and older and nobody listened to it either.<br><br>' +
          'The vultures over this reach have scorched feathers. Not burnt ' +
          'through - scorched, on the underside, like a thing that has flown ' +
          'low over a fire on purpose and more than once.<br><br>' +
          'They are not doing that at our fires. Ours are ringed and they know ' +
          'better.<br><br>' +
          'Bring me seven. If all seven are scorched the same way then whatever ' +
          'burns at that post burns hotter and lower than a beacon should, and ' +
          'that is not somebody being helpful.',
    cerinta: { fel: 'aduna', mob: 'vulture', cati: 7, obiect: 'Scorched Feather' }
  },
  {
    dator: 'marshal', nivel: 23,
    titlu: 'Nine Fires, One Lie',
    text: 'A signal chain does two things. It warns the coast that somebody is ' +
          'coming, and it tells anybody watching from outside exactly how many ' +
          'of us are awake and where.<br><br>' +
          'The raiders worked that out before I did. Their own people have been ' +
          'sitting on my sixth post all month, running my drill, learning my ' +
          'reach one night at a time.<br><br>' +
          'They will move within the week.<br><br>' +
          'Fourteen of them, and take the sixth post back. I will light it ' +
          'myself tonight and for once it will mean what it is supposed to ' +
          'mean.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  MISTWOOD (20-30) - raul se opreste in fiecare noapte
// ----------------------------------------------------------
scrieZona('Mistwood', 'mistwood', [
  {
    dator: 'padurar', nivel: 20,
    titlu: 'The River Stopped Working',
    text: 'Everything Mistwood has ever earned went down that river on the end ' +
          'of a rope. You cut above, you float it down, somebody else pays you ' +
          'at the bottom. Simple trade, hard work, four hundred years of ' +
          'it.<br><br>' +
          'Since midsummer the river dams overnight and clears by mid-morning. ' +
          'Every night. Nobody clears it. Nobody sees it dam.<br><br>' +
          'Before you laugh at that, understand that eleven people have now ' +
          'sat up to watch it and eleven people have fallen asleep.<br><br>' +
          'Wolves first. Eight of them on the cutting paths, because I cannot ' +
          'send crews up there while they hunt in daylight.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'miner', nivel: 23,
    titlu: 'Where the Water Goes Under',
    text: 'I am not a river man. I am a stone man, and a stone man will tell ' +
          'you something a river man will not.<br><br>' +
          'Two miles above the mill the water goes under a shelf of rock and ' +
          'comes out the other side. Always has. There is a cave mouth there ' +
          'wide enough to walk into if the water is low, and the water is ' +
          'low.<br><br>' +
          'If something dams that river every night, it is not doing it in the ' +
          'open where eleven people can watch it. It is doing it in there, and ' +
          'the mill only sees the result four hours later.<br><br>' +
          'Go to the cave. Look at the mouth. Do not wade in.',
    cerinta: { fel: 'mergi', loc: 'vizuina', numeLoc: 'the river cave' }
  },
  {
    dator: 'negustor', nivel: 25,
    titlu: 'Read the Timber',
    text: 'The logs come back up. Not all of them - maybe one in nine - and ' +
          'when they do they are chewed.<br><br>' +
          'I have bought and sold timber for twenty-two years and I know what ' +
          'every animal in this wood does to wood. This is none of them. The ' +
          'marks are paired, top and bottom, like something took hold rather ' +
          'than gnawed.<br><br>' +
          'Bring me seven pieces off the burrowers up on the cutting. I want to ' +
          'lay their teeth against those marks and be either right or ' +
          'wrong.<br><br>' +
          'If I am wrong I will say so publicly, which around here is worth ' +
          'more than the timber.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 7, obiect: 'Gnawed Timber Length' }
  },
  {
    dator: 'marshal', nivel: 28,
    titlu: 'Open the River',
    text: 'The teeth match. So now we all know, and knowing has not floated a ' +
          'single log.<br><br>' +
          'They are nesting in the dry part of that cave and building across ' +
          'the channel every night, the way a beaver does and for the same ' +
          'reason: they want still water and they do not care whose river it ' +
          'is.<br><br>' +
          'Fourteen. Deep in, where the nest is, not the ones you meet on the ' +
          'way.<br><br>' +
          'The crews will clear the dam themselves in the morning and they will ' +
          'be glad of the work. Four hundred years is a long thing to lose in ' +
          'one summer and I am not going to be the warden who lost it.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  DUSKVALE (20-30) - nimeni nu vrea sa se intoarca stapanul
// ----------------------------------------------------------
scrieZona('Duskvale', 'duskvale', [
  {
    dator: 'marshal', nivel: 20,
    titlu: 'A Quiet Valley, We Say',
    text: 'Duskvale is a quiet valley. We say that to travellers and we say it ' +
          'firmly enough that most of them stop asking.<br><br>' +
          'It is even true. Nobody has been robbed here in three years. Nobody ' +
          'has been taxed here in three years either, and I will let you work ' +
          'out which of those the valley notices.<br><br>' +
          'The boars are the only honest problem I have. They have come down ' +
          'into the lower fields and those fields are fed by people who do not ' +
          'have a second field.<br><br>' +
          'Eight of them. Then stay a while, and do not ask about the keep on ' +
          'your first evening.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'taran', nivel: 23,
    titlu: 'His Seal, in the Wrong Hands',
    text: 'You are going to hear the story from somebody, so hear it from ' +
          'somebody who was here.<br><br>' +
          'The lord of this valley went east three years ago with eleven men ' +
          'and has not written since. We waited a year. Then we ploughed his ' +
          'lower fields because they were going to waste and children were ' +
          'thin.<br><br>' +
          'Now the bandits on the east road are carrying his seal. Stamped ' +
          'lead, his mark, and they use it to pass themselves off at farms that ' +
          'do not know better.<br><br>' +
          'Seven of them. I want to see how they came by it before somebody ' +
          'decides it proves he is alive, or decides it proves we killed him.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 7, obiect: 'Stamped Estate Seal' }
  },
  {
    dator: 'cavaler', nivel: 25,
    titlu: 'Somebody Has to Open the Door',
    text: 'I served him. I am the only one left here who did, and I have not ' +
          'gone up to that keep in three years, and I have run out of honest ' +
          'reasons why not.<br><br>' +
          'The truth is the same as everybody\'s. While the door is shut he ' +
          'might come back and we are tenants who took liberties. Once it is ' +
          'open we will know, and knowing goes one of two ways.<br><br>' +
          'I cannot do it. I have tried twice and turned back at the ' +
          'bridge.<br><br>' +
          'Go up to the keep. You owe him nothing, which is exactly why you can ' +
          'do it properly.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the empty keep' }
  },
  {
    dator: 'marshal', nivel: 28,
    titlu: 'The Valley Decides',
    text: 'Empty. Stripped from the inside, three years ago, by somebody who ' +
          'knew where the plate was kept.<br><br>' +
          'So the eleven men did not go east. Eleven men went up the hill, ' +
          'emptied the house, and became the people who have been working the ' +
          'east road with his seal in their pockets ever since.<br><br>' +
          'Fourteen of them. Every one you take is a year the valley gets to ' +
          'stop pretending.<br><br>' +
          'And when it is done I am going to stand in the square and say out ' +
          'loud that we ploughed his fields and we are keeping them. Let ' +
          'somebody come and argue. It has been three years. Somebody should ' +
          'have come by now.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  STORMHOLLOW (25-35) - farul se stinge in noptile proaste
// ----------------------------------------------------------
scrieZona('Stormhollow', 'stormhollow', [
  {
    dator: 'marshal', nivel: 25,
    titlu: 'Three Ships in One Year',
    text: 'Stand on the head there and look down. Those are ribs. Three sets, ' +
          'and the newest one is eight weeks old.<br><br>' +
          'Before last year this coast took a ship every decade or so and ' +
          'everybody agreed that was the sea being the sea.<br><br>' +
          'Three in a year is not the sea.<br><br>' +
          'The vultures came with the wrecks and they have got used to being ' +
          'fed. They come down at the fishing racks now, in daylight, at ' +
          'people. Eight of them before somebody loses an eye.<br><br>' +
          'Then I will tell you the rest, and you will like it less.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 8 }
  },
  {
    dator: 'cavaler', nivel: 28,
    titlu: 'The Light Goes Out',
    text: 'Here is the rest.<br><br>' +
          'All three ships went down on nights when the light was out. The ' +
          'keeper says it was not out. The keeper has kept that light for ' +
          'nineteen years, his father kept it before him, and I would have ' +
          'called him the most reliable man on this coast.<br><br>' +
          'Two fishermen swear to darkness. He swears to light. All three of ' +
          'them are honest.<br><br>' +
          'Go out to the lighthouse. Walk up it. Look at the lamp, the oil, the ' +
          'stair, the door.<br><br>' +
          'I am not asking you to catch him at anything. I am asking whether ' +
          'there is a way for a man to be telling the truth and the coast to be ' +
          'dark at the same time.',
    cerinta: { fel: 'mergi', loc: 'far', numeLoc: 'the lighthouse' }
  },
  {
    dator: 'negustor', nivel: 30,
    titlu: 'Nails Come Back Before Bodies',
    text: 'A wreck gives up its nails first. Timber floats off whole and gets ' +
          'claimed; nails wash in for a month, a handful at a tide, and nobody ' +
          'thinks about them except me.<br><br>' +
          'I buy them. Eight a bundle, straightened, resold to the ' +
          'boatyard.<br><br>' +
          'What I want you to bring me is eight off the bandit camp above the ' +
          'cove, because they have been selling me ship nails since before the ' +
          'first of those three wrecks came ashore, and I have only just done ' +
          'the arithmetic on that.<br><br>' +
          'I took the money and I asked nothing. I would like to be the one who ' +
          'brings that up first.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 8, obiect: 'Salvaged Ship Nail' }
  },
  {
    dator: 'marshal', nivel: 33,
    titlu: 'A Blanket and a Winch',
    text: 'A blanket and a winch. That is all it was.<br><br>' +
          'They rigged a screen on the seaward arc and drew it across on the ' +
          'bad nights. From the tower the lamp is burning and the keeper is ' +
          'telling the truth. From a deck three miles out the coast is black ' +
          'and you are steering for a gap that is really rock.<br><br>' +
          'Then they came down and took what came ashore, and sold me the ' +
          'nails.<br><br>' +
          'Fourteen. Do not leave the cove until the winch is in pieces.<br><br>' +
          'The keeper has not spoken since we showed him. Nineteen years, and ' +
          'his light was the thing they used.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  GREYFEN (25-35) - o a doua vama, luata de nimeni stiut
// ----------------------------------------------------------
scrieZona('Greyfen', 'greyfen', [
  {
    dator: 'marshal', nivel: 25,
    titlu: 'Six Generations of Toll',
    text: 'The causeway is the only dry line across this fen and my family has ' +
          'kept it for six generations. We mend it, we drain it, we take a ' +
          'copper a cart, and in two hundred years nobody has once said that ' +
          'was unfair.<br><br>' +
          'Traffic is down to a third.<br><br>' +
          'Part of that is honest: the spiders in the reed banks have got into ' +
          'the causeway timbers and a horse will not pass a nest. Eight of ' +
          'them, and I can get the boards back.<br><br>' +
          'The other part is not honest, and I will need you sober for it.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 8 }
  },
  {
    dator: 'taran', nivel: 28,
    titlu: 'Paying Twice',
    text: 'They pay at the gate. Then, four miles out where the causeway bends ' +
          'behind the alders, they pay again.<br><br>' +
          'Same copper. Same wording - to the word, I have had it repeated to ' +
          'me by nine different carters. And a token handed back, because ' +
          'whoever is doing it is doing it properly.<br><br>' +
          'Bring me seven of those tokens off the bandits in the reeds.<br><br>' +
          'I want to hold seven in my hand and see whether they were struck ' +
          'from one die. Because if they were, then this is not robbery. ' +
          'Robbery does not have a mint.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 7, obiect: 'Second Toll Token' }
  },
  {
    dator: 'cavaler', nivel: 30,
    titlu: 'The Wayhouse at the Bend',
    text: 'There is a wayhouse at the bend. Four walls, a hearth, a roof that ' +
          'was good in my father\'s time. Anybody crossing late can sleep ' +
          'there.<br><br>' +
          'Nobody has kept it for eleven years. It is not a post; it is a ' +
          'kindness left standing.<br><br>' +
          'The carters say the second toll is taken within sight of it.<br><br>' +
          'Go out to the wayhouse. Walk round it. Look at the hearth - whether ' +
          'it is cold, whether it has been cold for eleven years, and whether ' +
          'there is a track worn to the door.<br><br>' +
          'A kindness with a track worn to it is not a kindness any more.',
    cerinta: { fel: 'mergi', loc: 'popas', numeLoc: 'the wayhouse' }
  },
  {
    dator: 'marshal', nivel: 33,
    titlu: 'One Die, One Man',
    text: 'One die. Seven tokens, one die, and a fire in that hearth that has ' +
          'been fed every night since long before the traffic fell off.<br><br>' +
          'They did not steal our toll. They copied it. Same copper, same words, ' +
          'a token in the hand - so that an honest carter goes home believing he ' +
          'paid two legal tolls and that Greyfen has got greedy.<br><br>' +
          'Six generations of a name, undone by a man with a die and a good ' +
          'memory.<br><br>' +
          'Fourteen of them at the bend. Bring me the die itself. I am going to ' +
          'nail it to the gate where every carter who thinks he was cheated ' +
          'twice can see exactly who did it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  IRONHILL (30-40) - pecetea pusa de bunici
// ----------------------------------------------------------
scrieZona('Ironhill', 'ironhill', [
  {
    dator: 'miner', nivel: 30,
    titlu: 'Two Mines, One Working',
    text: 'Ironhill has two mines. The new one pays. The old one has been shut ' +
          'since my grandmother was a girl.<br><br>' +
          'Shut, not exhausted. There is good ore in there and everybody knows ' +
          'it, and in sixty years nobody has been stupid enough to open ' +
          'it.<br><br>' +
          'Before any of that, there are boars in the spoil heaps and a man ' +
          'broke his arm getting away from one last week. Eight of them.<br><br>' +
          'Do the work, take the pay, and then come and stand in front of the ' +
          'old door with me. I want to show you what is written on it.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'padurar', nivel: 33,
    titlu: 'Splinters Off the Door',
    text: 'The old mine door is oak, a foot thick, and it has been sealed twice ' +
          '- once with iron, and once, later, from the outside, with beams.<br><br>' +
          'Somebody has been working at those beams. Not this year. Over ' +
          'years.<br><br>' +
          'The spiders that nest in the scree carry the splinters back to line ' +
          'their holes; I have been picking them out of nests for two seasons ' +
          'and telling myself it was rot.<br><br>' +
          'Bring me seven. Fresh splinters have a pale edge and old ones do ' +
          'not, and seven is enough to tell me whether the door is being worked ' +
          'now or was worked long ago and I am frightening myself for nothing.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 7, obiect: 'Pale Door Splinter' }
  },
  {
    dator: 'marshal', nivel: 35,
    titlu: 'The Writing on the Door',
    text: 'Pale edges. All seven. So it is now.<br><br>' +
          'There is writing carved above that door. Our grandparents put it ' +
          'there when they sealed it and it is in a hand nobody in Ironhill can ' +
          'read any more. We lost the reading of it in two generations - which ' +
          'is, I think, the single most frightening fact about this ' +
          'place.<br><br>' +
          'They knew something worth carving and we let the carving go ' +
          'quiet.<br><br>' +
          'Go up to the old mine. Stand at the door. Look at the beams and look ' +
          'at what is written, and come back and tell me the shape of the ' +
          'letters even if you cannot read them either.',
    cerinta: { fel: 'mergi', loc: 'minaVeche', numeLoc: 'the sealed mine' }
  },
  {
    dator: 'armurier', nivel: 38,
    titlu: 'Seal It Again, Properly',
    text: 'A scribe two valleys over read your copy for the price of a meal. ' +
          'Three words. "It was dug."<br><br>' +
          'Not mined. Dug. From the other side.<br><br>' +
          'The burrowers have had sixty years at those beams and they are ' +
          'nearly through, and I have no intention of finding out what our ' +
          'grandparents were shutting in or shutting out.<br><br>' +
          'Fourteen of them at the door. Then we brick it - stone, not timber, ' +
          'and the words cut again deeper and in plain letters that a child can ' +
          'read in two hundred years.<br><br>' +
          'That is the only part of this I feel good about. We are going to ' +
          'leave a warning that still works.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  SABLEWOOD (35-45) - padurea a inaintat si harta e gresita
// ----------------------------------------------------------
scrieZona('Sablewood', 'sablewood', [
  {
    dator: 'padurar', nivel: 35,
    titlu: 'Four Hundred Paces',
    text: 'I walk the treeline every spring and I mark it. Same stones, same ' +
          'walk, nineteen years.<br><br>' +
          'This spring the line was four hundred paces further out than last ' +
          'spring. It has swallowed a stretch of the north road and two ' +
          'cottages that people were living in at midwinter.<br><br>' +
          'A wood does not do that. A wood creeps a pace a decade and argues ' +
          'about it.<br><br>' +
          'The wolves came out with it - they are hunting ground that was open ' +
          'field last year and they have not adjusted. Eight of them, on the ' +
          'new edge.<br><br>' +
          'Then I will show you my stones and you can tell me I am mad.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'miner', nivel: 38,
    titlu: 'The Mine Is Inside It Now',
    text: 'My mine head was in open ground. You could see it from the ' +
          'village.<br><br>' +
          'It is in the wood now. Not near the wood - in it, under canopy, with ' +
          'trees standing between the head and the village that were not ' +
          'standing there when we cut the last shift.<br><br>' +
          'My crews will not walk it. I have raised the pay twice.<br><br>' +
          'Go out to the mine head. I am not asking you to go down. I am asking ' +
          'whether the winding gear is still there, and whether the trees ' +
          'around it are grown trees or something else, because two men have ' +
          'come back and used the phrase "something else" without being able to ' +
          'finish the sentence.',
    cerinta: { fel: 'mergi', loc: 'mina', numeLoc: 'the swallowed mine head' }
  },
  {
    dator: 'negustor', nivel: 40,
    titlu: 'The Resin Is Worth More Than the Timber',
    text: 'I have sold Sablewood timber my whole life and I will tell you ' +
          'something that nobody who buys it knows.<br><br>' +
          'The new growth bleeds. Not sap - resin, dark, and it sets hard as ' +
          'horn in a night. The spiders work it into their webs and the webs ' +
          'come out stiff.<br><br>' +
          'A bowyer would pay more for eight pieces of that than I make in a ' +
          'season of planks.<br><br>' +
          'Bring me eight. I am going to make a great deal of money out of ' +
          'something that is frightening everybody, and I would rather say that ' +
          'plainly than pretend I am being useful.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 8, obiect: 'Hardened Sable Resin' }
  },
  {
    dator: 'marshal', nivel: 43,
    titlu: 'Cut the Road Back Open',
    text: 'We are not going to stop the wood. I have listened to four people ' +
          'explain how and all four plans end with the same village and less of ' +
          'it.<br><br>' +
          'What we are going to do is keep one road open. The north road, wide, ' +
          'cut back twice a year, for as long as this place has arms.<br><br>' +
          'The burrowers are in the new ground along it and they bring the ' +
          'surface down under a cart.<br><br>' +
          'Fourteen. Then the crews go in with axes and Sablewood stays a place ' +
          'you can leave from.<br><br>' +
          'That is the whole of my ambition now. A road out. It used to be more ' +
          'than that.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  ASHENMOOR (35-45) - a trai de pe urma unui dezastru
// ----------------------------------------------------------
scrieZona('Ashenmoor', 'ashenmoor', [
  {
    dator: 'miner', nivel: 35,
    titlu: 'Eleven Years of Ash',
    text: 'Ash has fallen here every day for eleven years. Nothing grows. ' +
          'Nothing has grown since the year the mountain opened.<br><br>' +
          'People ask why anybody stays. The answer is under your boots: the ' +
          'burn made glass, and glass out of that pit is worth four times ' +
          'grain, and a family can dig it with two hands and a ' +
          'bucket.<br><br>' +
          'We stayed because the disaster pays better than the farm ever ' +
          'did.<br><br>' +
          'The scorpids nest in the warm ash and come into the diggings. Eight ' +
          'of them. Every one is a child who gets to keep both hands.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 8 }
  },
  {
    dator: 'negustor', nivel: 38,
    titlu: 'The Good Glass Is Gone',
    text: 'I buy glass. I have bought it for nine years and I know it the way ' +
          'you know a face.<br><br>' +
          'What is coming up this season is wrong. Cloudy through, not clear, ' +
          'and it goes to powder if you drop it. The buyers on the coast have ' +
          'started refusing whole loads and they are right to.<br><br>' +
          'The burrowers throw it up from deeper than any of our diggers ' +
          'reach.<br><br>' +
          'Bring me seven shards off them. If the deep glass is clear and ours ' +
          'is cloudy, then we are digging the wrong layer. If the deep glass is ' +
          'cloudy too, then this place has about two more seasons of trade in ' +
          'it and people need telling.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 7, obiect: 'Deep Ash-Glass Shard' }
  },
  {
    dator: 'padurar', nivel: 40,
    titlu: 'How Hot Is the Pit',
    text: 'I am called a warden here, which is a joke, because there has not ' +
          'been a tree in this country since before the children were ' +
          'born.<br><br>' +
          'What I actually do is watch the pit.<br><br>' +
          'It has been warm since the year it opened - warm is why we can work ' +
          'it in winter. In the last two months the warm has come up the walls. ' +
          'I can put my hand flat on stone at chest height now and take it ' +
          'away.<br><br>' +
          'Go to the pit. Stand where the diggings start and put your hand on ' +
          'the wall.<br><br>' +
          'You will know what I mean when you do it. Then come back and say it ' +
          'to the merchant, because he will believe a stranger before me.',
    cerinta: { fel: 'mergi', loc: 'groapa', numeLoc: 'the glass pit' }
  },
  {
    dator: 'marshal', nivel: 43,
    titlu: 'Buy the Season',
    text: 'Cloudy glass and a hot wall. Eleven years of luck ending in the same ' +
          'month.<br><br>' +
          'We are going to work the pit through this season and then leave. ' +
          'Every family gets whatever they can dig and carry, and the carts go ' +
          'out before the winter.<br><br>' +
          'The raiders have worked out that everything portable in Ashenmoor is ' +
          'about to be on a road at once.<br><br>' +
          'Fourteen of them. I do not need them gone for good. I need them gone ' +
          'for eight weeks.<br><br>' +
          'Eight weeks and three hundred people get to start again somewhere ' +
          'with money in their hands instead of arriving as beggars. That is ' +
          'what you are being paid for.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  GRAVEHOLD (40-50) - vama de la poarta cimitirului
// ----------------------------------------------------------
scrieZona('Gravehold', 'gravehold', [
  {
    dator: 'marshal', nivel: 40,
    titlu: 'They Carried Them Up Here',
    text: 'For four hundred years the rich of this coast were carried up this ' +
          'mountain to be buried, with everything they thought they would ' +
          'need.<br><br>' +
          'Which means the mountain is full of gold and everybody in the world ' +
          'knows it.<br><br>' +
          'One road up. One gate. One family has held that gate since the first ' +
          'body came through it, and that family is mine, and I am telling you ' +
          'this because you are going to hear it said unkindly before the week ' +
          'is out.<br><br>' +
          'The wolves have got onto the road and a gate is no use if nobody can ' +
          'reach it. Eight.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'negustor', nivel: 43,
    titlu: 'Grave Goods on My Counter',
    text: 'I will say the unkind thing, then, since somebody has to and I am ' +
          'old enough not to care.<br><br>' +
          'Grave goods are being sold openly two valleys over. Named pieces. ' +
          'Pieces with families still living who could point at them in a ' +
          'window.<br><br>' +
          'There is one road up that mountain and one gate on it.<br><br>' +
          'Bring me seven tokens off the raiders on the high track - the little ' +
          'lead squares they carry. I have been told those are what the gate ' +
          'hands out to people it has decided not to see.<br><br>' +
          'Seven of them and I will say it to his face instead of behind it, ' +
          'which I would prefer.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 7, obiect: 'Gate-Pass Token' }
  },
  {
    dator: 'miner', nivel: 45,
    titlu: 'Go and See the Gate',
    text: 'I cut stone for the tombs. Forty years. I know every foot of that ' +
          'road and every man on that gate by name.<br><br>' +
          'Three months ago they stopped searching carts coming down. I asked ' +
          'why. I was told the orders changed.<br><br>' +
          'Orders on that gate have not changed in four hundred years. That is ' +
          'the entire point of it.<br><br>' +
          'Go up to the gatehouse. Stand there an hour. Watch what goes down ' +
          'and whether anybody looks in it.<br><br>' +
          'I have known the marshal since we were boys and I would rather be ' +
          'wrong about this than right. Go and let me be wrong.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the gatehouse' }
  },
  {
    dator: 'marshal', nivel: 48,
    titlu: 'My Own Gate',
    text: 'You do not need to say it. I have had two days to work out that you ' +
          'would come back with exactly that.<br><br>' +
          'Four of my own men. Taking a cut to look at the wall while carts ' +
          'went down. Four hundred years and it took three months.<br><br>' +
          'They are off the gate and they are in a cell, and now the people who ' +
          'were paying them are up on the mountain with no way down and no ' +
          'reason left to be quiet about it.<br><br>' +
          'Fourteen on the high track. Bring back anything with a name on ' +
          'it.<br><br>' +
          'I am going to spend the rest of my life giving those back one at a ' +
          'time and it will not be enough.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  BLACKFEN (40-50) - drumul scufundat a iesit la iveala
// ----------------------------------------------------------
scrieZona('Blackfen', 'blackfen', [
  {
    dator: 'padurar', nivel: 40,
    titlu: 'The Driest Year Anyone Remembers',
    text: 'Blackfen is water. That is the whole of it. Water, reed, and a ' +
          'hundred miles of ground that will not hold a man.<br><br>' +
          'This year it has not rained since the thaw and the fen has dropped ' +
          'four feet.<br><br>' +
          'Everybody is delighted. I am not, and I will tell you why in a ' +
          'moment.<br><br>' +
          'First: the serpents have come up onto the dry ground where the ' +
          'children play, because their water went away and they followed it in ' +
          'the wrong direction. Eight of them.<br><br>' +
          'Nobody has been bitten yet. I would like to keep that sentence in ' +
          'the shape it is.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 8 }
  },
  {
    dator: 'miner', nivel: 43,
    titlu: 'A Road That Should Not Be There',
    text: 'The water went down and left a road.<br><br>' +
          'Stone, laid, cambered so the rain runs off, kerbed both sides. Better ' +
          'built than anything standing in this county today.<br><br>' +
          'It runs from nowhere I can find toward the sink hole at the fen\'s ' +
          'heart, and people have started walking it because it is the first ' +
          'dry mile Blackfen has ever had.<br><br>' +
          'Follow it as far as the sink. Do not go down into it.<br><br>' +
          'Somebody built that to carry weight in both directions, and I would ' +
          'like to know what was heavy enough to need it before half the ' +
          'village is using it as a shortcut.',
    cerinta: { fel: 'mergi', loc: 'gaura', numeLoc: 'the sink hole' }
  },
  {
    dator: 'negustor', nivel: 45,
    titlu: 'Milestones With Numbers On',
    text: 'The road has milestones. The burrowers have been bringing them up ' +
          'for years and I have been buying them for years as kerb ' +
          'stone.<br><br>' +
          'I never turned one over.<br><br>' +
          'They are numbered. On the underside. In a counting I do not know, ' +
          'but the shapes repeat and repeat in order, and there are more of ' +
          'them than there are miles in this whole fen.<br><br>' +
          'Bring me eight. I am going to lay them in a row on my own floor and ' +
          'work out how long that road was.<br><br>' +
          'I have a suspicion about the answer and I am not going to say it ' +
          'until I have the stones.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Numbered Milestone' }
  },
  {
    dator: 'marshal', nivel: 48,
    titlu: 'Before the Rain Comes Back',
    text: 'Two hundred and nine miles, if the merchant has counted right. A ' +
          'road two hundred miles long, under a fen, that nobody in any ' +
          'chronicle we have ever bothered to write down.<br><br>' +
          'The rain will come back. It always does, and when it does that road ' +
          'goes under for another lifetime.<br><br>' +
          'Which is fine by me, honestly. What is not fine is that the ' +
          'burrowers have opened half the sink getting at those stones, and ' +
          'when the water returns it will go down that hole and take the ' +
          'village with it.<br><br>' +
          'Fourteen of them, and we fill the sink. Let it be a story instead of ' +
          'a shortcut.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  ASHEN REACH (45-55) - marfa buna, oamenii gresiti
// ----------------------------------------------------------
scrieZona('Ashen Reach', 'ashenreach', [
  {
    dator: 'cavaler', nivel: 45,
    titlu: 'The Reach Eats Caravans',
    text: 'Every load that crosses this continent crosses the Ashen Reach, ' +
          'because there is no other way through and the mountains on both ' +
          'sides are not negotiable.<br><br>' +
          'Nine days of ash, four wells, no shade. We lose caravans to it every ' +
          'year and that is nobody\'s fault.<br><br>' +
          'What we do not lose them to is vultures, and the vultures have ' +
          'learned to follow the line and take the animals at night. Eight of ' +
          'them at the second well.<br><br>' +
          'That is the straightforward job. Do it first, because the next thing ' +
          'I have to tell you is not straightforward at all.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 8 }
  },
  {
    dator: 'negustor', nivel: 48,
    titlu: 'The Right Cargo, The Wrong Men',
    text: 'Four caravans in, this season. Every one arrived with its cargo ' +
          'correct to the last crate.<br><br>' +
          'Not one arrived with the men who left.<br><br>' +
          'Different drivers. Different names in the book. All of them with an ' +
          'explanation that holds if you do not ask a second ' +
          'question - sickness, a change at the wells, a man who turned ' +
          'back.<br><br>' +
          'Every driver carries a bond. Stamped, sealed, worth nothing to a ' +
          'thief and everything to me.<br><br>' +
          'Bring me eight bonds off the bandits in the ash. If those are my ' +
          'missing drivers\' bonds then I know what happened to them, and I ' +
          'would rather know.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 8, obiect: 'Driver\'s Sealed Bond' }
  },
  {
    dator: 'taran', nivel: 50,
    titlu: 'The Camp at the Third Well',
    text: 'I keep the third well. It is not farming but it is what there is, ' +
          'and my family has drawn water for the line for as long as there has ' +
          'been a line.<br><br>' +
          'There is a camp beside it now. Came in the spring, said they were ' +
          'caravan hands waiting on work, paid for their water like anyone ' +
          'else.<br><br>' +
          'They have never once waited on work. Caravans come in and caravans ' +
          'go out and the camp stays exactly the same size.<br><br>' +
          'Go and look at it. Count the tents. Count the horses, and then count ' +
          'the tents again.<br><br>' +
          'I have been selling those people water for seven months and I think ' +
          'I have been paid in it.',
    cerinta: { fel: 'mergi', loc: 'tabara', numeLoc: 'the camp at the third well' }
  },
  {
    dator: 'marshal', nivel: 53,
    titlu: 'Take the Wells Back',
    text: 'It is the simplest scheme I have ever had to explain to a ' +
          'magistrate, and that is why it worked for four caravans.<br><br>' +
          'They do not steal the cargo. Stolen cargo has to be sold and selling ' +
          'is where thieves get caught. They take the men, put their own on the ' +
          'benches, and deliver the load properly - and now they are a trusted ' +
          'crew with a bond and a route and a name in my book.<br><br>' +
          'Fourteen at the third well.<br><br>' +
          'And every bond you bring back goes to a family that has spent this ' +
          'season being told their father simply turned round and walked home.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  CINDERPEAK (45-55) - meseria care o sa-i omoare
// ----------------------------------------------------------
scrieZona('Cinderpeak', 'cinderpeak', [
  {
    dator: 'armurier', nivel: 45,
    titlu: 'The Mountain Does the Heating',
    text: 'Look at the forge. Now look for the fire.<br><br>' +
          'There is no fire. There has never been a fire in a Cinderpeak forge. ' +
          'The floor is hot because the mountain is hot, and it is hotter and ' +
          'steadier than any fuel a smith can buy, and it never goes ' +
          'out.<br><br>' +
          'That is why steel comes off this rock that nobody on the coast can ' +
          'match, and why eight hundred people live on a mountain that is ' +
          'plainly trying to kill them.<br><br>' +
          'The scorpids come up through the floor vents where it is warmest. ' +
          'Eight of them in the lower shops. Mind your feet.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 8 }
  },
  {
    dator: 'taran', nivel: 48,
    titlu: 'Stand at the Vent',
    text: 'I grow what can be grown here, which is not much and gets less every ' +
          'year, and I am the only person in this town who measures anything ' +
          'that is not iron.<br><br>' +
          'Two years ago I could keep goats on the west slope. Last year I ' +
          'could not. This year the west slope has no grass at all.<br><br>' +
          'The smiths tell me the heat is the same as it always was. They ' +
          'measure it by how the steel behaves, which is like measuring the ' +
          'weather by how you feel.<br><br>' +
          'Go up to the main vent. Get as close as you can stand and remember ' +
          'exactly how close that was.<br><br>' +
          'Then ask a smith how close he could stand when he was your age.',
    cerinta: { fel: 'mergi', loc: 'groapa', numeLoc: 'the main vent' }
  },
  {
    dator: 'negustor', nivel: 50,
    titlu: 'Even the Snakes Have Changed',
    text: 'I will give you a reason to believe the farmer that does not involve ' +
          'grass, because nobody here will be argued out of a forge by a ' +
          'goat.<br><br>' +
          'The serpents on this mountain have changed their skins. Thicker, ' +
          'plated, dull instead of bright. I have traded snakeskin off ' +
          'Cinderpeak for twenty years and the stuff I am handling now is a ' +
          'different article.<br><br>' +
          'An animal does not put on armour for nothing.<br><br>' +
          'Bring me eight hides. I intend to lay them next to eight I kept from ' +
          'ten years ago, on a table, in front of the guild, and let them ' +
          'explain that with steel.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 8, obiect: 'Heat-Plated Hide' }
  },
  {
    dator: 'cavaler', nivel: 53,
    titlu: 'Nobody Is Leaving Yet',
    text: 'The guild has looked at the hides. The guild has agreed the mountain ' +
          'is warming. The guild has voted to continue.<br><br>' +
          'I am not going to pretend to you that I can overrule eight hundred ' +
          'people who would rather die rich than move poor. I have tried, and ' +
          'they have a vote and I do not.<br><br>' +
          'What I can do is make sure that when they finally run, the road down ' +
          'is clear.<br><br>' +
          'The raiders hold the lower switchbacks. Fourteen of them.<br><br>' +
          'One day this town will come down that road in the dark with children ' +
          'on its back. I would like the road to be the one thing about that ' +
          'night that goes well.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  DIREHOLD (50-60) - garnizoana care s-a facut regat
// ----------------------------------------------------------
scrieZona('Direhold', 'direhold', [
  {
    dator: 'cavaler', nivel: 50,
    titlu: 'Nine Years Without Relief',
    text: 'Direhold is the last fortress on this road and it has not been ' +
          'relieved in nine years.<br><br>' +
          'Nine years is long enough for a garrison to forget it is a ' +
          'garrison. We have our own writs now. Our own tolls. A man was hanged ' +
          'here in the spring on the captain\'s word alone and nobody thought ' +
          'that was strange until I said it out loud.<br><br>' +
          'I am saying it out loud to you because you have no rank here and ' +
          'cannot be broken for it.<br><br>' +
          'Wolves on the approach first. Eight. Half the village will not come ' +
          'up to market while they hunt the road, and I want the village ' +
          'coming up.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'taran', nivel: 53,
    titlu: 'Writs With No King on Them',
    text: 'I farm the terraces below the walls and I pay what I am told to pay. ' +
          'I have never once seen a writ with a king\'s name on it.<br><br>' +
          'They carry the fortress mark and nothing else. The men who collect ' +
          'have started selling the surplus themselves on the north side, ' +
          'through the raiders, and they do not trouble to hide it any ' +
          'more.<br><br>' +
          'Bring me seven of those writs off the raiders on the north ' +
          'track.<br><br>' +
          'Seven with the fortress mark and no crown, and even a knight who ' +
          'still believes in this place has to look at them. He is a good man. ' +
          'He needs it put in his hand.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 7, obiect: 'Unsigned Direhold Writ' }
  },
  {
    dator: 'marshal', nivel: 55,
    titlu: 'Walk Into the Keep',
    text: 'I hold this village. I do not hold that fortress, and in nine years ' +
          'I have been inside it twice.<br><br>' +
          'You can go in. Nobody knows your face and the gate is open at ' +
          'market.<br><br>' +
          'Walk the yard. Count the men who are actually soldiers. Look at the ' +
          'stores - whether they are provisioned for a garrison waiting on ' +
          'orders, or stocked like a household that means to stay.<br><br>' +
          'There is a difference and anybody who has ever run a kitchen can ' +
          'see it in a minute.<br><br>' +
          'Do not draw anything. Walk in, look, walk out. That is all I want ' +
          'and it is more than I have managed in nine years.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the fortress yard' }
  },
  {
    dator: 'cavaler', nivel: 58,
    titlu: 'Stocked Like a Household',
    text: 'Provisioned for eleven years. Eleven. You do not lay in eleven years ' +
          'of stores while you wait for orders. You lay them in when you have ' +
          'decided the orders are not coming and this is yours now.<br><br>' +
          'I have taken it to the captain. He did not deny any of it. He asked ' +
          'me what I thought a fortress was supposed to do when the people who ' +
          'built it stopped writing.<br><br>' +
          'I did not have an answer. I still do not.<br><br>' +
          'What I have is this: the raiders on the north track are his suppliers ' +
          'now. Fourteen of them, and the surplus stays on the terraces where it ' +
          'was grown.<br><br>' +
          'Start there. It is where I can still tell right from wrong.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THORNSPIRE (50-60) - focul de veghe aprins la ore gresite
// ----------------------------------------------------------
scrieZona('Thornspire', 'thornspire', [
  {
    dator: 'cavaler', nivel: 50,
    titlu: 'Four Hundred Feet',
    text: 'A convoy went off the high road in the winter. Eleven carts, ' +
          'thirty-odd people, four hundred feet down.<br><br>' +
          'The inquiry said bad weather and bad judgement, which is what an ' +
          'inquiry always says when everybody who could contradict it is at the ' +
          'bottom of a gorge.<br><br>' +
          'The survivor said they were steering by the beacon.<br><br>' +
          'That is the part I have not been able to put down, because the ' +
          'beacon that night should not have been lit at all.<br><br>' +
          'Wolves on the pass before anything else. Eight. They have been fed ' +
          'well this year and they no longer move off the road for people.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 53,
    titlu: 'Who Keeps the Beacon',
    text: 'The beacon on Thornspire is lit on three nights of the year and on ' +
          'any night the pass is closed. That is the rule and it has been the ' +
          'rule since the road was cut.<br><br>' +
          'Lit on any other night it means the pass is safe when it is ' +
          'not.<br><br>' +
          'The keep that tends it has one old man and a woman who signs for the ' +
          'oil. I have written to them twice. The replies were correct, ' +
          'courteous, and told me nothing.<br><br>' +
          'Go up to the beacon keep. See who is actually there.<br><br>' +
          'Take the west stair. The east one has been out since the winter and ' +
          'nobody has troubled to put a rope across it, which tells you ' +
          'something on its own.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the beacon keep' }
  },
  {
    dator: 'taran', nivel: 55,
    titlu: 'Somebody Is Buying Oil',
    text: 'Beacon oil is signed for. A flask a night on a burning night, and in ' +
          'a normal year the keep signs for eleven flasks.<br><br>' +
          'Last year they signed for ninety-four.<br><br>' +
          'I know because I cart it up. I have carted it up for nineteen years ' +
          'and I said nothing, because a carter who asks questions about a load ' +
          'stops being given loads.<br><br>' +
          'The raiders on the low road are carrying flasks with the keep mark ' +
          'on them. Bring me eight.<br><br>' +
          'Ninety-four flasks. Eleven carts off the road. I have done that ' +
          'arithmetic every night since the winter and I would like somebody ' +
          'else to do it too.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Marked Beacon Flask' }
  },
  {
    dator: 'cavaler', nivel: 58,
    titlu: 'The Light That Lies',
    text: 'It was never about the carts. They did not want the cargo - they ' +
          'wanted the pass empty.<br><br>' +
          'Light the beacon on a closed night and honest traffic comes up ' +
          'thinking the road is clear. Enough of it goes over the edge and the ' +
          'road gets a reputation. Enough reputation and nobody uses Thornspire ' +
          'at all, and the only people who know the pass are the ones who made ' +
          'it frightening.<br><br>' +
          'They have had a private road across this range for two years and ' +
          'thirty people paid for it.<br><br>' +
          'Fourteen on the low road. Then we light the beacon properly, on the ' +
          'right nights, and take the mountain back one honest cart at a time.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THE EMBERWASTES (50-60) - ultima poarta inainte de nimic
// ----------------------------------------------------------
scrieZona('The Emberwastes', 'emberwastes', [
  {
    dator: 'marshal', nivel: 50,
    titlu: 'The Last Gate',
    text: 'East of here the maps stop. Not "unexplored" - stop. The parchment ' +
          'is blank and the blank is where the ash comes from.<br><br>' +
          'This is the last gate. Sixty of us, a wall, a well, and a road ' +
          'behind us that takes nine days to reach anybody who cares.<br><br>' +
          'The serpents come in off the blank side and they come in numbers ' +
          'nobody at home would believe. Eight at the wall.<br><br>' +
          'You will find people here strange. Understand that every one of us ' +
          'has stood a watch facing something with no name on it, and it does ' +
          'things to how a person talks.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 8 }
  },
  {
    dator: 'miner', nivel: 53,
    titlu: 'Look at the Wall Yourself',
    text: 'I dug the cistern under this gate and I have patched the wall every ' +
          'season for twenty-two years, so when I tell you it is thinner than ' +
          'it was I am not being poetic.<br><br>' +
          'The ash eats mortar. Slowly, and only on the east face, and only on ' +
          'the east face.<br><br>' +
          'I have said this in four reports. The replies say the wall was built ' +
          'to a standard and the standard allows for weathering.<br><br>' +
          'Go and stand at the east face. Put your hand in a joint. If your ' +
          'fingers go in to the second knuckle, that is not weathering, that is ' +
          'a wall with a date on it.<br><br>' +
          'Then say so where the garrison can hear you.',
    cerinta: { fel: 'mergi', loc: 'cetate', numeLoc: 'the east wall' }
  },
  {
    dator: 'padurar', nivel: 55,
    titlu: 'Orders to Close',
    text: 'Letters keep arriving that close this post.<br><br>' +
          'Not one of them is signed by anybody who exists. I have checked ' +
          'three names against the roll at Ashen Reach and none of the three ' +
          'has ever held a commission.<br><br>' +
          'They are good forgeries. Correct seal, correct phrasing, correct ' +
          'paper. And every single one arrives in the week after we lose ' +
          'somebody, when the garrison is tired and would very much like to be ' +
          'told to go home.<br><br>' +
          'The raiders carry them. Bring me eight.<br><br>' +
          'Somebody out there wants this gate opened without having to take it, ' +
          'and they have worked out that paper is cheaper than a siege.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Forged Closure Order' }
  },
  {
    dator: 'marshal', nivel: 58,
    titlu: 'We Are Not Going Home',
    text: 'I read all eight to the garrison in the yard. Every forged word, in ' +
          'order, and then I burned them in front of sixty people who have not ' +
          'been relieved and have every right to want to go.<br><br>' +
          'Nobody left. Two asked to take a double watch.<br><br>' +
          'So now the people who wrote them know that paper will not do it, and ' +
          'they will come and do it the other way.<br><br>' +
          'Fourteen of them, out past the wall, before they gather properly. Hit ' +
          'them where they are camped and not where they are formed.<br><br>' +
          'Whatever happens after that, it will not be said that this gate was ' +
          'closed by a letter.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);
