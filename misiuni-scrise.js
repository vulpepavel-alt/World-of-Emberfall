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
    //
    // Numele care se vede in carnet NU se scrie aici. Se ia din
    // reteta zonei, adica din exact acelasi loc din care il ia si
    // harta. Cat era scris de doua ori, se putea intampla ca harta
    // sa spuna "Cave" iar misiunea "the river cave".
    if (cerinta.fel === 'mergi') {
      const reteta = retetaZonei(idZona);
      const locul = reteta && (reteta.locuri || []).find(function (l) {
        return l.id === cerinta.loc;
      });
      if (!locul) {
        console.warn('Misiune care trimite intr-un loc inexistent: ' +
                     idZona + ':' + cerinta.loc);
        return;
      }
      cerinta.numeLoc = locul.nume;
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
    cerinta: { fel: 'mergi', loc: 'groapa' }
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
    cerinta: { fel: 'mergi', loc: 'groapa' }
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
    cerinta: { fel: 'mergi', loc: 'post' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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
    cerinta: { fel: 'mergi', loc: 'post' }
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
    cerinta: { fel: 'mergi', loc: 'vizuina' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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
    cerinta: { fel: 'mergi', loc: 'far' }
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
    cerinta: { fel: 'mergi', loc: 'popas' }
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
    cerinta: { fel: 'mergi', loc: 'minaVeche' }
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
    cerinta: { fel: 'mergi', loc: 'mina' }
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
    cerinta: { fel: 'mergi', loc: 'groapa' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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
    cerinta: { fel: 'mergi', loc: 'gaura' }
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
    cerinta: { fel: 'mergi', loc: 'tabara' }
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
    cerinta: { fel: 'mergi', loc: 'groapa' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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
    cerinta: { fel: 'mergi', loc: 'cetate' }
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


// ==========================================================
//  KARADOR
//
//  Continentul celalalt: canion rosu, coasta si gheata. Aici incep
//  Orc si Duskborn, si aici se vede: mai putine comitate si
//  castele, mai multe asezari de frontiera, capitani de ceata si
//  cercetasi. Oamenii vorbesc mai scurt si se plang mai putin.
// ==========================================================


// ----------------------------------------------------------
//  SILVERBOUGH (1-10) - navoadele nu se rup, se taie
// ----------------------------------------------------------
scrieZona('Silverbough', 'silverbough', [
  {
    dator: 'marshal', nivel: 1,
    titlu: 'Rats in the Net Lofts',
    text: 'Welcome to Silverbough. You will hear the sea from every bed in this ' +
          'village and after a week you will stop hearing it at all.<br><br>' +
          'We live on what the boats bring in and we have not brought much in ' +
          'this season, which I will explain when you have done something ' +
          'useful.<br><br>' +
          'The something useful is upstairs. The net lofts are full of rats and ' +
          'a rat will go through a season\'s netting in a night for no reason ' +
          'at all.<br><br>' +
          'Eight of them. It is the smallest job I have and it is still the ' +
          'difference between a boat going out on Tuesday and not.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'cercetas', nivel: 3,
    titlu: 'Cut, Not Torn',
    text: 'Here is the part the marshal did not want to say to a stranger on ' +
          'the first afternoon.<br><br>' +
          'The nets are coming up open. Everybody has been saying torn, because ' +
          'torn is what happens to nets and torn is nobody\'s fault.<br><br>' +
          'They are not torn. I have had four of them across my knee and every ' +
          'one is a clean straight line. That is a blade and a steady ' +
          'hand.<br><br>' +
          'Somebody is out there at night in a boat. A boat has to sleep ' +
          'somewhere, and there is exactly one place on this coast where a boat ' +
          'can lie out of the weather and out of sight.<br><br>' +
          'Go and look at the sea cave. Look, and come back.',
    cerinta: { fel: 'mergi', loc: 'pestera' }
  },
  {
    dator: 'negustor', nivel: 6,
    titlu: 'Silk for the Menders',
    text: 'So there is a boat in the cave. Good. Now I need the village able to ' +
          'fish again while somebody else works out whose it is.<br><br>' +
          'Netting wants thread that does not rot in salt, and the only thread ' +
          'like that on this coast comes off the cliff spiders. It has been ' +
          'gathered here since before anybody thought to write anything ' +
          'down.<br><br>' +
          'Eight bundles. The menders are four old women and they can put a ' +
          'boat back to work in a day if they have the thread.<br><br>' +
          'Mind the cliff. I have lost a nephew to that path and I would rather ' +
          'not lose a customer.',
    cerinta: { fel: 'aduna', mob: 'spider', cati: 8, obiect: 'Cliff-Spider Silk' }
  },
  {
    dator: 'capitan', nivel: 8,
    titlu: 'Whose Boat',
    text: 'It is a Silverbough boat. Built here, four years ago, and sold down ' +
          'the coast when its owner died.<br><br>' +
          'Sold to people who have spent this season cutting our nets so that ' +
          'the price of fish on this whole shore goes up, and then selling ' +
          'their catch into it.<br><br>' +
          'It is not a grand crime. Nobody has been killed. It is just eleven ' +
          'families eating less so that somebody forty miles away eats ' +
          'better.<br><br>' +
          'Fourteen of them at the cove. Then the boat comes back up the beach ' +
          'and goes to the family that lost the most, which is the ' +
          'menders.<br><br>' +
          'That is the whole of it. Small place, small justice, done properly.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  PALEWOOD (10-20) - fantanile s-au facut sarate
// ----------------------------------------------------------
scrieZona('Palewood', 'palewood', [
  {
    dator: 'vanator', nivel: 10,
    titlu: 'A Wood That Died Standing',
    text: 'Look at it. Every tree from here to the shore is dead and every one ' +
          'of them is still upright.<br><br>' +
          'That happened in one year. A wood that burns falls down. A wood that ' +
          'is felled falls down. A wood that dies standing has had something ' +
          'taken out of the ground under it.<br><br>' +
          'The boars came in when the undergrowth went, and they are rooting ' +
          'through the last gardens anybody here still has.<br><br>' +
          'Eight of them, in the lower gardens.<br><br>' +
          'Then talk to the bonecaster, and try not to make the face people ' +
          'make when she starts talking.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'samana', nivel: 13,
    titlu: 'Taste the Well',
    text: 'You will want to hear a curse. I have one ready if you do; it is ' +
          'good and it frightens children.<br><br>' +
          'The true answer is duller. Draw a cup from any well in Palewood and ' +
          'taste it. It is salt. Not brackish - salt, enough that you will spit ' +
          'it out, and it was sweet when I was young.<br><br>' +
          'Salt in a well means the sea has got under the land, and the sea only ' +
          'gets under the land where something used to stop it.<br><br>' +
          'Go out to the clearing on the shore side. There was a dyke there ' +
          'when my mother walked it.<br><br>' +
          'See whether there still is.',
    cerinta: { fel: 'mergi', loc: 'luminis' }
  },
  {
    dator: 'negustor', nivel: 15,
    titlu: 'Crusted Skins',
    text: 'A broken dyke is a thing anybody could see if they walked. What I ' +
          'want to know is how long it has been broken, and the snakes will ' +
          'tell us that better than the villagers will.<br><br>' +
          'A serpent that lives in salt ground crusts its shed skin. One salt ' +
          'season and the crust is a film. Four seasons and it is a shell you ' +
          'can crack.<br><br>' +
          'Bring me seven, from the shore side only.<br><br>' +
          'If they are shells then that dyke has been open for years and every ' +
          'single person in this village walked past it and decided it was ' +
          'somebody else\'s.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 7, obiect: 'Salt-Crusted Skin' }
  },
  {
    dator: 'marshal', nivel: 18,
    titlu: 'Dead Timber Sells Better',
    text: 'Four seasons. And a broken dyke does not stay broken for four ' +
          'seasons in a village this size unless somebody is keeping it ' +
          'broken.<br><br>' +
          'Here is why. Living Palewood timber is soft and nobody wants it. ' +
          'Standing dead Palewood - dried on the stump, salt-cured, hard as ' +
          'iron - sells on the coast for six times the price.<br><br>' +
          'Somebody worked that out and opened the sea onto their neighbours\' ' +
          'wells to make it happen.<br><br>' +
          'Fourteen of them at the cutting camp. Then we close the dyke, and in ' +
          'thirty years this will be a wood again.<br><br>' +
          'None of us will see it. Close it anyway.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  DUSTPLAIN (10-20) - apa orasului Karrak Hold
// ----------------------------------------------------------
scrieZona('Dustplain', 'dustplain', [
  {
    dator: 'chief', nivel: 10,
    titlu: 'The Hold Drinks First',
    text: 'You are inside Karrak Hold. Everything you see was built on one ' +
          'thing: there is water under this rock and there is no water anywhere ' +
          'else for four days\' ride.<br><br>' +
          'The cisterns have dropped four feet in two years. I have not said ' +
          'that out loud outside this room and you will not either.<br><br>' +
          'What I can say out loud is that the lower galleries are full of rats ' +
          'and rats foul water faster than people drink it. Eight of ' +
          'them.<br><br>' +
          'Do it well and I will let you into the part of this I cannot solve ' +
          'by killing something.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'samana', nivel: 13,
    titlu: 'Go Down to the Deep Cistern',
    text: 'Four feet in two years. The council says the spring is failing and ' +
          'the council is comfortable with that, because a failing spring is ' +
          'nobody\'s fault and everybody can go on as they are.<br><br>' +
          'A spring that fails, fails evenly. Ours dropped a foot in a month and ' +
          'then nothing for eight, and then a foot in a month again.<br><br>' +
          'Water does not do that. People do that.<br><br>' +
          'Go down to the deep cistern. Walk the whole gallery, all the way to ' +
          'the rock face where the water comes in.<br><br>' +
          'Count the channels cut into that face. There should be one.',
    cerinta: { fel: 'mergi', loc: 'mina' }
  },
  {
    dator: 'cercetas', nivel: 15,
    titlu: 'Water Has a Tally Too',
    text: 'Two channels. Of course there are.<br><br>' +
          'Everything drawn out of the Hold is tallied - grain, iron, water, ' +
          'all of it, on notched sticks at the gate. The outer camps have been ' +
          'buying water all summer at four times what the Hold charges and ' +
          'paying it without complaint, because the alternative is ' +
          'thirst.<br><br>' +
          'Whoever sells it has to move it, and anything moved past the gate ' +
          'gets a tally whether the carrier likes it or not.<br><br>' +
          'Seven tallies off the bandits on the camp road. That is enough to ' +
          'show the council a number, and a council will believe a number when ' +
          'it will not believe a bonecaster.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 7, obiect: 'Water Tally Stick' }
  },
  {
    dator: 'capitan', nivel: 18,
    titlu: 'Take the Second Channel',
    text: 'The spring never failed. Somebody cut a second channel in the rock ' +
          'face, took a third of the flow off before it reaches our cisterns, ' +
          'and has spent two years selling Karrak Hold\'s own water back to the ' +
          'camps outside its walls.<br><br>' +
          'The raiders on the camp road are the delivery. They will not give ' +
          'that up on being asked.<br><br>' +
          'Fourteen of them. Then the masons go down and the second channel ' +
          'gets filled with the same rock it was cut out of.<br><br>' +
          'When the cisterns come back up, the chief will announce that the ' +
          'spring recovered. Let him. A city that thinks its water can be stolen ' +
          'never sleeps again.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  DUNEHOLT (15-25) - dunele castiga
// ----------------------------------------------------------
scrieZona('Duneholt', 'duneholt', [
  {
    dator: 'vanator', nivel: 15,
    titlu: 'The Holt and the Sand',
    text: 'Duneholt is a wall around a well and about nine hundred people who ' +
          'have agreed not to talk about the dunes.<br><br>' +
          'You can see them from the gate. They are closer than they were when ' +
          'I was a girl and I can prove it, and when I do prove it people find ' +
          'somewhere else to be.<br><br>' +
          'Meanwhile: rats in the grain pits. Eight of them, and watch your ' +
          'footing - the pits have sand in them now and they did not used ' +
          'to.<br><br>' +
          'Everything here comes back to that sentence eventually.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 18,
    titlu: 'The Post We Stopped Manning',
    text: 'There is a watchpost a mile out on the west side. Two rooms and a ' +
          'roof, built in my grandfather\'s time, manned until eleven years ' +
          'ago.<br><br>' +
          'We did not abandon it because of danger. We abandoned it because the ' +
          'sand reached the sill and nobody wanted to dig a doorway out every ' +
          'morning.<br><br>' +
          'Go out and look at it. I want somebody who has not seen it slowly, ' +
          'over eleven years, to look at it once and tell me what they ' +
          'see.<br><br>' +
          'If the roof is under, then the sand has moved the height of a man in ' +
          'eleven years and this wall is nine hundred people standing in a ' +
          'queue.',
    cerinta: { fel: 'mergi', loc: 'post' }
  },
  {
    dator: 'samana', nivel: 20,
    titlu: 'There Was a Thorn Forest Here',
    text: 'The roof is under. I know. I have known for four years and being ' +
          'right about it has made me no friends.<br><br>' +
          'Now the useful part. The scorpids dig deeper than anything else ' +
          'alive out there, and they throw up what they find, and what they ' +
          'have been throwing up is root.<br><br>' +
          'Not scrub root. Thick, woody, a hand across. There was a thorn ' +
          'forest standing on this plain and it held the sand still, and ' +
          'somebody cut it down long enough ago that we have forgotten we did ' +
          'it.<br><br>' +
          'Bring me eight pieces. I am going to put them on a table in front of ' +
          'the council and say: this grew here, and it can grow here again.',
    cerinta: { fel: 'aduna', mob: 'scorpid', cati: 8, obiect: 'Deep Thorn Root' }
  },
  {
    dator: 'armurier', nivel: 23,
    titlu: 'Guard the Seedlings',
    text: 'The council voted for it. Eleven thousand thorn seedlings along the ' +
          'west line, watered by hand from the holt\'s own well, for twenty ' +
          'years before they hold anything.<br><br>' +
          'It is the least popular decision anybody has taken here in a ' +
          'lifetime, and it is right.<br><br>' +
          'The raiders pull them up. Seedling thorn is the only burnable wood ' +
          'within four days\' ride and they can sell a cartload in an ' +
          'afternoon.<br><br>' +
          'Fourteen of them.<br><br>' +
          'Nobody alive today gets anything out of this. That is the part I ' +
          'want you to understand before you take my money: you are being paid ' +
          'to protect a thing that only makes sense to people who are not born ' +
          'yet.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  STONECALL (15-25) - muntele raspunde gresit
// ----------------------------------------------------------
scrieZona('Stonecall', 'stonecall', [
  {
    dator: 'marshal', nivel: 15,
    titlu: 'The Valley That Answers',
    text: 'Shout here. Go on, anything.<br><br>' +
          'Heard it? Four times, and the last one comes back from a different ' +
          'direction than you sent it. That is Stonecall, and this village has ' +
          'been built on it for six hundred years.<br><br>' +
          'We count sheep by it. We find lost children by it. A shepherd on the ' +
          'far ridge can talk to the square without moving.<br><br>' +
          'Boars in the home pasture first. Eight. A boar in a walled pasture ' +
          'is a wall down, and a wall down here is a flock gone in a ' +
          'night.<br><br>' +
          'Then we will get to why I have not slept properly since ' +
          'midsummer.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'samana', nivel: 18,
    titlu: 'Pelts With Somebody Else\'s Notches',
    text: 'Every wolf taken in this valley gets its ears notched before it is ' +
          'skinned. One notch a year, a pattern per shepherd, six hundred years ' +
          'of it. That is how we know how many there are without counting ' +
          'live ones.<br><br>' +
          'Pelts have started coming in with notches that belong to ' +
          'nobody.<br><br>' +
          'Not wrong-shaped - correct. Correct notch, correct place, correct ' +
          'depth, and a pattern that is not in the book and has never been in ' +
          'the book.<br><br>' +
          'Bring me seven of them. Somebody is working this valley who knows ' +
          'exactly how we do things, and I would rather find that out from ' +
          'seven pelts than from a person.',
    cerinta: { fel: 'aduna', mob: 'wolf', cati: 7, obiect: 'Ear-Notched Pelt' }
  },
  {
    dator: 'vanator', nivel: 20,
    titlu: 'The Echo Changed',
    text: 'Now the thing the marshal cannot sleep about.<br><br>' +
          'The echo is wrong. Since midsummer it comes back three times instead ' +
          'of four, and the last one is late.<br><br>' +
          'Before you tell me a sound cannot change: a sound cannot, but the ' +
          'shape it bounces off can. The old shaft above the village is part of ' +
          'that shape. It always has been. Half of what makes Stonecall answer ' +
          'is that hole.<br><br>' +
          'Go up to the old shaft. Look at the mouth and look at the ' +
          'ground.<br><br>' +
          'If it has fallen in, we have lost more than a shaft. We have lost ' +
          'how this village talks to itself.',
    cerinta: { fel: 'mergi', loc: 'minaVeche' }
  },
  {
    dator: 'armurier', nivel: 23,
    titlu: 'Wider, Not Fallen',
    text: 'Not fallen. Wider.<br><br>' +
          'The burrowers have been opening that shaft from underneath for two ' +
          'years and a bigger hole makes a slower echo. That is all it ever ' +
          'was. Six hundred years of a village\'s hearing, changed by animals ' +
          'that do not know the village is there.<br><br>' +
          'And somebody has noticed. Notched pelts, an echo nobody trusts, and ' +
          'shepherds who have started walking to the square instead of calling ' +
          'to it - which means for the first time in six centuries nobody on ' +
          'the ridges knows what is happening below.<br><br>' +
          'Fourteen of them in the shaft. We will shore the mouth ourselves and ' +
          'get our fourth answer back.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  SUNSPIRE (20-30) - umbra spune alta data
// ----------------------------------------------------------
scrieZona('Sunspire', 'sunspire', [
  {
    dator: 'marshal', nivel: 20,
    titlu: 'Sown Three Weeks Wrong',
    text: 'That stone out on the flat is the Sunspire. It is older than any ' +
          'record we keep and its shadow is our calendar: when the tip touches ' +
          'the first marker you sow, the second you cut hay, the third you ' +
          'harvest.<br><br>' +
          'Half this steppe sowed three weeks late this year on the shadow\'s ' +
          'word and half the crop failed.<br><br>' +
          'The boars came in on what was left because a thin field is an open ' +
          'field. Eight of them.<br><br>' +
          'And then somebody is going to explain to me how a stone that has not ' +
          'moved in a thousand years told nine villages the wrong month.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 8 }
  },
  {
    dator: 'cercetas', nivel: 23,
    titlu: 'Count the Markers',
    text: 'A shadow needs two things: the stone, and the markers it falls ' +
          'on.<br><br>' +
          'Everybody has spent the summer staring at the stone. Nobody has ' +
          'looked at the markers, because markers are just posts and posts are ' +
          'boring.<br><br>' +
          'Go out to the shadow post on the east flat. Look at the ground ' +
          'around the posts - whether the grass is grown over the foot of them ' +
          'or whether it has been cut and turned.<br><br>' +
          'A post that has stood a thousand years has a thousand years of grass ' +
          'round it.<br><br>' +
          'One that was put in last autumn does not, and you can see that from ' +
          'a horse.',
    cerinta: { fel: 'mergi', loc: 'post' }
  },
  {
    dator: 'negustor', nivel: 25,
    titlu: 'Somebody Owns a Chain',
    text: 'Turned earth at the foot of three posts. So they were moved, and ' +
          'moved carefully, which takes a surveyor\'s chain - and there is not ' +
          'one honest chain on this whole steppe.<br><br>' +
          'A chain is links and links break and get dropped.<br><br>' +
          'Bring me seven links off the bandits camped on the flat. I have ' +
          'bought and sold across nine villages for twenty years and if those ' +
          'links match a maker I will know the maker.<br><br>' +
          'A thousand years of a stone telling the truth, undone by a man with ' +
          'a measuring chain and a patient idea.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 7, obiect: 'Surveyor\'s Chain Link' }
  },
  {
    dator: 'capitan', nivel: 28,
    titlu: 'Bought Cheap as Failed',
    text: 'The chain belongs to a grain factor on the coast. He moved three ' +
          'markers, the steppe sowed late, the crop failed, and he bought nine ' +
          'villages\' harvest at the price of a failed one.<br><br>' +
          'He will not be caught. He is four hundred miles away and he has ' +
          'never once come here.<br><br>' +
          'What is here is the crew he paid to hold the flat while the posts ' +
          'were moved, and they are still sitting on it because nobody has ' +
          'made them leave.<br><br>' +
          'Fourteen of them.<br><br>' +
          'Then we put the markers back with old men who remember where they ' +
          'were, and we cut the new grass around them, and in ten years nobody ' +
          'will be able to tell.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  SALTCLIFF (20-30) - sarea s-a facut amara
// ----------------------------------------------------------
scrieZona('Saltcliff', 'saltcliff', [
  {
    dator: 'marshal', nivel: 20,
    titlu: 'The Pans Are the Town',
    text: 'Everything flat you can see between here and the water is a salt ' +
          'pan. Fill, wait, rake, sell. Four hundred families, one trade, no ' +
          'second plan.<br><br>' +
          'The ship for the far continent leaves from below this cliff every ' +
          'eight days and most of what it carries is ours.<br><br>' +
          'The vultures have got onto the drying racks and a bird on a rack ' +
          'spoils a week of work in an hour. Eight of them.<br><br>' +
          'After that I am going to hand you to the merchant, because the ' +
          'problem I actually have is one I do not understand and he at least ' +
          'understands half of it.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 8 }
  },
  {
    dator: 'negustor', nivel: 23,
    titlu: 'Salt That Will Not Keep',
    text: 'Salt has one job. It stops meat going bad.<br><br>' +
          'Saltcliff salt has stopped doing it. Three shipments returned this ' +
          'season with the barrels opened and the contents ruined, and the ' +
          'buyers were polite about it, which was worse than shouting.<br><br>' +
          'It looks right. It tastes bitter at the back.<br><br>' +
          'The serpents live in the pan walls and crust up with whatever is in ' +
          'the brine. Bring me seven of those crusts.<br><br>' +
          'If the bitterness is in the animals too then it is in the water ' +
          'before it ever reaches a pan, and this is not something four hundred ' +
          'families did wrong with a rake.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 7, obiect: 'Bitter Brine Crust' }
  },
  {
    dator: 'cercetas', nivel: 25,
    titlu: 'Follow the Brine Back',
    text: 'Bitter in the animals. So it comes in with the water.<br><br>' +
          'The pans are not filled from the open sea - they are filled through ' +
          'the brine cave under the cliff, which concentrates it and is the ' +
          'entire reason a town exists on a rock with no harbour.<br><br>' +
          'One channel in, one channel out, and it has run the same way since ' +
          'the town was founded.<br><br>' +
          'Go into the brine cave as far as the inflow. Look for a second ' +
          'stream and look for whether it was always there.<br><br>' +
          'Take a rope. Two people have gone in this month without one and only ' +
          'one of them is having this conversation with anybody.',
    cerinta: { fel: 'mergi', loc: 'pestera' }
  },
  {
    dator: 'capitan', nivel: 28,
    titlu: 'A Cut and a Competitor',
    text: 'A cut channel, three years old, bringing a bitter spring down into ' +
          'our inflow.<br><br>' +
          'Whoever did it did not steal anything and did not kill anybody. They ' +
          'simply made Saltcliff salt worthless, and then sold their own down ' +
          'the same coast into a market that had nowhere else to go.<br><br>' +
          'Patient, clean, and it nearly finished a four-hundred-year ' +
          'town.<br><br>' +
          'Fourteen of them at the cave mouth. Then the masons block the cut ' +
          'and we rake off the bitter crust and start again with the next ' +
          'tide.<br><br>' +
          'Three bad seasons and a lesson. We will take it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  VERDANTMIRE (25-35) - mlastina prea verde
// ----------------------------------------------------------
scrieZona('Verdantmire', 'verdantmire', [
  {
    dator: 'vanator', nivel: 25,
    titlu: 'Too Green by Half',
    text: 'You have come at the pretty time of year, and I want you to ' +
          'understand straight away that the pretty is the problem.<br><br>' +
          'The mire has gone green. Not the ordinary green - a bright, flat ' +
          'green lying on the water like paint, and it has been spreading since ' +
          'the thaw.<br><br>' +
          'The reeds love it. They are growing twice as fast as I have ever ' +
          'seen and the cutters are having the best year of their ' +
          'lives.<br><br>' +
          'The fish are dead. All of them.<br><br>' +
          'Spiders in the cutting paths first - eight. The green has brought ' +
          'them in off the water and a cutter cannot work with one on his arm.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 8 }
  },
  {
    dator: 'samana', nivel: 28,
    titlu: 'It Is in Everything Now',
    text: 'Half this village is rich and half is starving and both halves are ' +
          'standing in the same water.<br><br>' +
          'The reed cutters say it is a good year. The fishers say it is a ' +
          'poison. Nobody will agree to find out which, because finding out ' +
          'costs one of them the argument.<br><br>' +
          'So bring me seven serpent skins with the green film on them.<br><br>' +
          'A film on a snake is not an opinion. If it is in the snakes it is in ' +
          'the frogs and if it is in the frogs it is in the children who play ' +
          'in that water, and then it stops being a question about reeds.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 7, obiect: 'Green-Filmed Skin' }
  },
  {
    dator: 'marshal', nivel: 30,
    titlu: 'The Pit Upstream',
    text: 'It is in the snakes. So now I am allowed to be the marshal about ' +
          'this instead of a neighbour.<br><br>' +
          'There is a dye pit a mile upstream. Cloth was dyed there for two ' +
          'hundred years and the work stopped before I was born - the pit was ' +
          'sealed and everybody agreed that was that.<br><br>' +
          'The green arrives from upstream. There is exactly one thing upstream ' +
          'and it is full of dye.<br><br>' +
          'Go to the pit. Look at the seal.<br><br>' +
          'And look at the path to it, because a pit nobody has visited in ' +
          'forty years should not have a path.',
    cerinta: { fel: 'mergi', loc: 'groapa' }
  },
  {
    dator: 'negustor', nivel: 33,
    titlu: 'The Cutters Knew',
    text: 'A worn path and a broken seal, and the cutters knew. Of course they ' +
          'knew. They opened it.<br><br>' +
          'Dye-water grows reed like nothing else on earth. They have had two ' +
          'seasons of the best cutting in living memory and they watched the ' +
          'fish die and said nothing, and the ones who said nothing loudest ' +
          'were the ones with the biggest stacks.<br><br>' +
          'They are not going to let it be closed. There are bandits camped on ' +
          'the pit now who are being paid in reed money by people I sell flour ' +
          'to.<br><br>' +
          'Fourteen of them, and then we seal it with stone.<br><br>' +
          'This village is going to be unpleasant for about ten years. It will ' +
          'still be here, which is more than the fish managed.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  SHATTERHORN (25-35) - muntele cade mereu la aceeasi ora
// ----------------------------------------------------------
scrieZona('Shatterhorn', 'shatterhorn', [
  {
    dator: 'vanator', nivel: 25,
    titlu: 'Just After Dawn',
    text: 'Rockfall on this mountain every three or four days since the ' +
          'spring.<br><br>' +
          'People shrug. It is a mountain, mountains shed, and Shatterhorn is ' +
          'named for exactly that.<br><br>' +
          'Here is what nobody shrugs at once I say it: every single one has ' +
          'come just after dawn. Not one at midday. Not one at night. Twenty-odd ' +
          'falls and all of them within half an hour of sunrise.<br><br>' +
          'A mountain does not keep an appointment.<br><br>' +
          'Wolves on the upper track before anything else - eight. They have ' +
          'learned that a fall means something dead underneath it and they wait ' +
          'for it now.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 28,
    titlu: 'From the Broken Keep',
    text: 'If you want to see where the falls start you have to be above ' +
          'them, and there is one place above them.<br><br>' +
          'The old keep on the shoulder. Half of it came down in my ' +
          'grandmother\'s time and the half standing is sound - we store hay in ' +
          'it.<br><br>' +
          'From its wall you can see the whole north face.<br><br>' +
          'Go up before the light and stand there. I am not asking you to ' +
          'catch anybody. I am asking you to look at the north face at dawn ' +
          'with your own eyes and come back and describe it.<br><br>' +
          'Take the hay path. The direct way is where the falls come down and ' +
          'I have lost a man on it already.',
    cerinta: { fel: 'mergi', loc: 'cetate' }
  },
  {
    dator: 'samana', nivel: 30,
    titlu: 'Stone With a Flat Face',
    text: 'You saw dust on the north face at first light. I know. I have seen ' +
          'it for two seasons and been told I was seeing weather.<br><br>' +
          'Bring me the proof instead, because proof does not get argued ' +
          'with.<br><br>' +
          'The burrowers work the scree and bring the stone down where we can ' +
          'reach it. Eight pieces, and I want pieces with a flat face on ' +
          'them.<br><br>' +
          'Mountain stone breaks rough. Stone that has had a wedge driven into ' +
          'it breaks flat, with a half-hole at the edge where the wedge ' +
          'sat.<br><br>' +
          'Eight flat faces and it is not weather. It is a quarry, above our ' +
          'heads, that nobody asked us about.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Wedge-Cut Stone' }
  },
  {
    dator: 'armurier', nivel: 33,
    titlu: 'Quarrying Over Our Roofs',
    text: 'Eight out of eight. A wedge line as clean as anything I have struck ' +
          'in forty years at an anvil.<br><br>' +
          'They cut at dawn because the valley wind comes up at dawn and ' +
          'carries the noise away over the ridge. They have been doing it for ' +
          'two seasons and sending the stone down the far side where nobody ' +
          'from here ever goes.<br><br>' +
          'The spoil comes down our side. That is all the rockfall ever was - ' +
          'somebody\'s rubbish, landing on our pasture and twice on our ' +
          'people.<br><br>' +
          'Fourteen of them on the north face. Take the wedges as well as the ' +
          'men.<br><br>' +
          'I want to look at them. I want to know if they were made here.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THE LONG STEPPE (30-40) - turmele nu mai trec
// ----------------------------------------------------------
scrieZona('The Long Steppe', 'longsteppe', [
  {
    dator: 'cercetas', nivel: 30,
    titlu: 'Nine Hundred Years of Autumn',
    text: 'The herds cross this steppe in autumn. They have crossed it every ' +
          'autumn for nine hundred years, on the same line, in the same week, ' +
          'and everything about this place is built on that week.<br><br>' +
          'We do not own the herds. Nobody owns them. We take what we need as ' +
          'they pass and then they are gone for a year.<br><br>' +
          'This autumn they turned aside forty miles north.<br><br>' +
          'Wolves first - eight on the west line. They followed the herd ' +
          'route too and they are the only ones still keeping to it, which ' +
          'means they are hungry and we are what is left.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'capitan', nivel: 33,
    titlu: 'Where They Used to Come Through',
    text: 'The herd comes through one gap. Always the same one - a cut in the ' +
          'ridge wide enough for them and narrow enough that they have to funnel ' +
          'through it, which is why this village stands where it does and ' +
          'nowhere else.<br><br>' +
          'Nobody has been up to that gap since they failed to come.<br><br>' +
          'We have all been busy explaining it to each other in the square ' +
          'instead. Bad grass. A dry spring. Wolves. The gods. Every explanation ' +
          'you can have without walking four miles.<br><br>' +
          'Go and walk the four miles. Look at the ground in the gap and look ' +
          'at what is on it.',
    cerinta: { fel: 'mergi', loc: 'vizuina' }
  },
  {
    dator: 'negustor', nivel: 35,
    titlu: 'Somebody Has Been Branding',
    text: 'Bones in the gap, then, and old fire.<br><br>' +
          'Here is my half of it. For two seasons I have been offered steppe ' +
          'cattle for sale, out of season, by people with no herd. Good ' +
          'animals. Lead animals, some of them - big, old, the ones a herd ' +
          'follows.<br><br>' +
          'Every one carried a brand I did not know and I bought them anyway ' +
          'because they were cheap, and I would like that written ' +
          'down.<br><br>' +
          'Bring me eight branding irons off the raiders on the north ' +
          'line.<br><br>' +
          'If those irons match the marks on the animals I bought, then I have ' +
          'been paying the people who did this.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Herd-Brand Iron' }
  },
  {
    dator: 'marshal', nivel: 38,
    titlu: 'An Animal Remembers',
    text: 'They took the lead animals in the gap. Two autumns running, at the ' +
          'narrow place, where a herd cannot scatter.<br><br>' +
          'And a herd remembers. Not one animal - the whole moving thing ' +
          'remembers, and this year it came to the ridge and turned north and ' +
          'took nine hundred years of our lives with it.<br><br>' +
          'Nobody stole anything from us. They stole from the herd, and the ' +
          'herd punished us for it.<br><br>' +
          'Fourteen of them on the north line.<br><br>' +
          'It will not bring them back next autumn. The old people say three ' +
          'generations, if we never let it happen again. I am forty-six. I am ' +
          'doing this for somebody I will never meet.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  WINDSCOUR (35-45) - vantul si-a schimbat directia
// ----------------------------------------------------------
scrieZona('Windscour', 'windscour', [
  {
    dator: 'marshal', nivel: 35,
    titlu: 'Every Door Opens Wrong',
    text: 'Walk through this holt and look at the doors. Every one of them ' +
          'opens into the wind.<br><br>' +
          'They were not built stupid. They were built four generations ago ' +
          'when the wind came out of the west, the way it had come out of the ' +
          'west since anybody started counting.<br><br>' +
          'Two years ago it turned. It comes out of the east now, every day, ' +
          'and every windbreak, every shutter, every wall in Windscour is on ' +
          'the wrong side of the building.<br><br>' +
          'Vultures first - eight. They ride the new wind straight over the ' +
          'drying racks and we have not worked out how to stop them.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 8 }
  },
  {
    dator: 'cercetas', nivel: 38,
    titlu: 'Nobody Went to Look',
    text: 'I will tell you the most embarrassing thing about this holt and then ' +
          'you can decide what you think of us.<br><br>' +
          'The wind changed two years ago. In two years not one person has ' +
          'walked east to find out why.<br><br>' +
          'We have prayed about it. We have argued about it. We have rebuilt ' +
          'two roofs because of it. Nobody has walked.<br><br>' +
          'There is a gap in the east ridge that used to break the easterly and ' +
          'send it over us. Everything we are is downwind of that gap.<br><br>' +
          'Go to the wind gap. Look at it. That is the whole task and it should ' +
          'have been done by somebody from here twenty-three months ago.',
    cerinta: { fel: 'mergi', loc: 'crapatura' }
  },
  {
    dator: 'negustor', nivel: 40,
    titlu: 'Scoured on the Wrong Side',
    text: 'A fallen ridge. Two years of prayer for a pile of rock.<br><br>' +
          'I want one more piece of proof before the holt spends a season\'s ' +
          'labour on this, and I want it from something that cannot have an ' +
          'opinion.<br><br>' +
          'The scorpids out east carry sand-scouring on their shells. It ' +
          'polishes whichever side faces the wind and it takes years to ' +
          'build.<br><br>' +
          'Bring me eight. If the old ones are worn on the west face and the ' +
          'young ones on the east, then the wind turned within the lifetime of ' +
          'an animal that lives four years, and the ridge is the reason.<br><br>' +
          'Then we build a wall in the gap, and I will pay for the first ' +
          'hundred feet of it myself.',
    cerinta: { fel: 'aduna', mob: 'scorpid', cati: 8, obiect: 'Wind-Scoured Shell' }
  },
  {
    dator: 'capitan', nivel: 43,
    titlu: 'Hold the Gap',
    text: 'Old ones west, young ones east. Every single shell.<br><br>' +
          'So we build. Four hundred feet of dry stone across that gap, every ' +
          'able back in the holt, before winter.<br><br>' +
          'The raiders have been using the gap for two years - it is the only ' +
          'way through the east ridge and it has been free of us since the day ' +
          'it fell. They have got used to that.<br><br>' +
          'Fourteen of them, and they stay gone until the wall is up.<br><br>' +
          'Two years of arguing and the answer was a four-mile walk. I would ' +
          'like that carved into the wall when it is finished, honestly. It ' +
          'would do this holt good to have to read it every day.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  EMBERDUNE (35-45) - casa dezgropata de furtuna
// ----------------------------------------------------------
scrieZona('Emberdune', 'emberdune', [
  {
    dator: 'capitan', nivel: 35,
    titlu: 'The Storm Uncovered Something',
    text: 'Three weeks ago a storm took the top off a dune east of the holt and ' +
          'left a building standing in the hollow.<br><br>' +
          'Not ruins. A building. Roof on, door shut, and when the door was ' +
          'opened there were tables laid.<br><br>' +
          'Everybody has been out to look and nobody will say the thing that is ' +
          'bothering them, so I will: the plates on those tables are our ' +
          'pattern. The same pattern this holt eats off tonight.<br><br>' +
          'Scorpids have moved into the hollow. Eight of them, before somebody\'s ' +
          'child goes out there for a look and does not come ' +
          'back.<br><br>' +
          'Then we can talk about the plates.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 8 }
  },
  {
    dator: 'cercetas', nivel: 38,
    titlu: 'Go Inside It',
    text: 'I have been to the edge of that hollow four times and I have not ' +
          'gone in, and I am supposed to be the one who goes in.<br><br>' +
          'It is not fear of anything living. It is that I know roughly how ' +
          'deep the sand is here, and a house under that much sand was not ' +
          'buried in a storm. It was buried over lifetimes.<br><br>' +
          'Which would make it older than the holt. And the holt has been here, ' +
          'we are told, since the beginning.<br><br>' +
          'Go into the uncovered house. Walk it room by room and remember what ' +
          'is in it.<br><br>' +
          'Take nothing. Somebody will take everything soon enough and I would ' +
          'rather it was not us.',
    cerinta: { fel: 'mergi', loc: 'crapatura' }
  },
  {
    dator: 'negustor', nivel: 40,
    titlu: 'I Have Been Selling Them Back',
    text: 'You have seen the rooms. Then you will understand why I have had a ' +
          'bad week.<br><br>' +
          'For two months I have been buying plateware off travellers and ' +
          'selling it in this holt as new work from the coast. Good prices. ' +
          'Everybody pleased.<br><br>' +
          'It is not from the coast.<br><br>' +
          'Bring me eight shards off the raiders east of the hollow. If they ' +
          'match the pattern on my shelf then I have spent two months selling ' +
          'this holt its own ancestors\' dishes at a markup, and I will stand in ' +
          'the square and say so.<br><br>' +
          'I would rather say it than have it said about me.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Matched Plate Shard' }
  },
  {
    dator: 'marshal', nivel: 43,
    titlu: 'Close the Hollow',
    text: 'They match. Every one.<br><br>' +
          'So there was an Emberdune before this Emberdune, the sand took it, ' +
          'and the people who are left kept making the same plates for four ' +
          'hundred years without knowing why that pattern and not another.<br><br>' +
          'The raiders have been stripping it since the day the storm passed ' +
          'and will strip it to the floors if we let them.<br><br>' +
          'Fourteen of them. Then we shovel the hollow shut with our own hands ' +
          'and we leave it shut.<br><br>' +
          'Somebody will call that superstition. It is not. It is a town ' +
          'deciding it would rather have ancestors than a market stall.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THE GLASSWASTES (40-50) - ce s-a aruncat se intoarce
// ----------------------------------------------------------
scrieZona('The Glasswastes', 'glasswastes', [
  {
    dator: 'cercetas', nivel: 40,
    titlu: 'Where Things Go to Stay Gone',
    text: 'You cannot dig here. The plain is glass a spear deep and it will ' +
          'break a pick before it takes a hole.<br><br>' +
          'So this is where the whole of Karador sends what it does not want ' +
          'coming back. Bad iron. Broken weapons. Things off a field that ' +
          'nobody wants reforged. They are carted out, thrown on the glass, and ' +
          'that is understood to be final.<br><br>' +
          'The vultures nest in the heaps. Eight of them - they have stopped ' +
          'being frightened of carts and a bird that is not frightened of a ' +
          'cart will take a hand.<br><br>' +
          'And keep your eyes on the heaps while you work.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 8 }
  },
  {
    dator: 'capitan', nivel: 43,
    titlu: 'The Watch Nobody Funds',
    text: 'There is supposed to be a watch on the dump. One post, two men, ' +
          'paid by everybody who sends a cart.<br><br>' +
          'Everybody sends carts. Nobody has paid in eleven years.<br><br>' +
          'So there are two men out there who have not been relieved, not been ' +
          'paid, and not been visited by anybody who was not throwing something ' +
          'away.<br><br>' +
          'Go out to the dump watch. Find out whether there are still two men, ' +
          'and if there are, find out what they have been living on.<br><br>' +
          'I have a guess and I do not like it. Go and make me wrong.',
    cerinta: { fel: 'mergi', loc: 'post' }
  },
  {
    dator: 'armurier', nivel: 45,
    titlu: 'I Know That Mark',
    text: 'Now I will tell you what set me off, before you heard any of ' +
          'this.<br><br>' +
          'Two months ago I bought a blade off a traveller and it had my ' +
          'grandfather\'s mark under the grip. Not a copy. His.<br><br>' +
          'That blade was broken and carted to the glass in my own lifetime. I ' +
          'watched the cart go.<br><br>' +
          'Bring me eight blades off the raiders on the plain. I want to look ' +
          'under every grip.<br><br>' +
          'If the marks are all ours then somebody has been standing on that ' +
          'dump for years, pulling out what four countries decided should never ' +
          'be used again, and putting it back into the world.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Reforged Blade' }
  },
  {
    dator: 'marshal', nivel: 48,
    titlu: 'Two Men and a Forge',
    text: 'Eight marks. Six of them from this valley.<br><br>' +
          'The two watchmen are alive. They built a forge out there eleven ' +
          'years ago because nobody was coming and nobody was paying, and they ' +
          'have been living off the one thing they were put there to guard.<br><br>' +
          'I find it hard to be angry at them and I am going to have to ' +
          'be.<br><br>' +
          'What I can be angry at is the crew that took the trade off them ' +
          'three years ago and left them the forge and the risk.<br><br>' +
          'Fourteen on the plain. Then the watch gets paid, properly, out of ' +
          'the cart toll, starting this month.<br><br>' +
          'Eleven years. We did this.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  BONEMARCH (40-50) - o coasta care nu e fosila
// ----------------------------------------------------------
scrieZona('Bonemarch', 'bonemarch', [
  {
    dator: 'capitan', nivel: 40,
    titlu: 'We Build Out of Bone',
    text: 'There is no timber within nine days of here and the stone splits ' +
          'wrong, so Bonemarch is built out of what Bonemarch has, and what ' +
          'Bonemarch has is bone.<br><br>' +
          'The valley is full of it. Ribs you could roof a hall with. It has ' +
          'been quarried out of the cut since the holt was founded and nobody ' +
          'has ever thought it strange, because it is simply what the ground ' +
          'here is made of.<br><br>' +
          'Scorpids nest in the cut. Eight of them, and mind the loose ' +
          'spoil.<br><br>' +
          'Do that and then come and look at the face with me. The quarry ' +
          'master will not, and he is the one who found it.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 43,
    titlu: 'Go and Look at the Face',
    text: 'I am not going to describe it to you first. If I describe it you ' +
          'will see what I described.<br><br>' +
          'Go down into the bone cut. Walk to the working face - the new one, ' +
          'on the left, not the old gallery.<br><br>' +
          'Look at what they broke into on the eleventh day of this ' +
          'month.<br><br>' +
          'Put your hand on it if you can make yourself.<br><br>' +
          'Then come back and tell me what you think, in your own words, ' +
          'without me having put any in your mouth. I have had four accounts ' +
          'already and all four have been useless because all four came after ' +
          'somebody else had talked.',
    cerinta: { fel: 'mergi', loc: 'crapatura' }
  },
  {
    dator: 'negustor', nivel: 45,
    titlu: 'Green Bone',
    text: 'You said green. So did the other four, and I have stopped being able ' +
          'to pretend that is a trick of the light.<br><br>' +
          'Fossil bone is stone. It rings, it takes a polish, it has been dead ' +
          'so long it has stopped being bone at all.<br><br>' +
          'Green bone is bone. It is greasy. It smells. It is what you find ' +
          'under a beast that died last season.<br><br>' +
          'Bring me eight splinters off the vultures - they have been at the ' +
          'new face and they carry it back to their nests, which no vulture ' +
          'does with stone.<br><br>' +
          'A bird knows the difference between a rock and a meal. That will ' +
          'settle it for me.',
    cerinta: { fel: 'aduna', mob: 'vulture', cati: 8, obiect: 'Green Bone Splinter' }
  },
  {
    dator: 'cercetas', nivel: 48,
    titlu: 'Wall the New Face',
    text: 'The birds are eating it. So something that size was alive recently ' +
          'enough for a vulture to still be interested, and I am not going to ' +
          'finish that thought out loud.<br><br>' +
          'The quarry master has agreed to close the new face and work the old ' +
          'gallery, which will cost this holt a third of its stone and is the ' +
          'first sensible thing anybody has said this month.<br><br>' +
          'The raiders have worked out that Bonemarch is walling something up ' +
          'and have decided that means it is worth having.<br><br>' +
          'Fourteen of them at the cut.<br><br>' +
          'Then we lay the wall. And on it, in plain letters, how deep it is ' +
          'and why - because the people who dug here before us left us nothing ' +
          'and look where that got us.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  HOLLOWROOT (45-55) - satul sta pe o singura radacina
// ----------------------------------------------------------
scrieZona('Hollowroot', 'hollowroot', [
  {
    dator: 'capitan', nivel: 45,
    titlu: 'One Tree Holds This Up',
    text: 'Everything you are standing on is root.<br><br>' +
          'There was a tree here once. One tree, and by every account a ' +
          'ridiculous one, and it has been dead for longer than there have been ' +
          'records. What is left is its roots, and the roots are the only thing ' +
          'in forty miles of mire that will hold a house.<br><br>' +
          'Hollowroot is not built near a tree. It is built on one.<br><br>' +
          'Spiders have got into the under-galleries where we store grain. ' +
          'Eight of them.<br><br>' +
          'Watch where you put your weight down there. Some of it is softer ' +
          'than it was last year, and that is the whole of my problem.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 48,
    titlu: 'Bring Me Rot',
    text: 'Soft. That is the word everybody uses and nobody wants to finish.<br><br>' +
          'I have had the under-galleries sounded twice this year. The root is ' +
          'going punky in patches - not everywhere, and not evenly, which is ' +
          'what makes it hard to argue about.<br><br>' +
          'The serpents live in the wet root and they come out carrying it. ' +
          'Eight skins with root-rot in the scales.<br><br>' +
          'Bring them from the north side only. The north side is where the old ' +
          'pool was, and I have a suspicion I would like either confirmed or ' +
          'taken away from me.<br><br>' +
          'I have a daughter in a house on the north side. That is not why I am ' +
          'asking. It is why I am asking today.',
    cerinta: { fel: 'aduna', mob: 'serpent', cati: 8, obiect: 'Root-Rot Skin' }
  },
  {
    dator: 'cercetas', nivel: 50,
    titlu: 'Under the Hall',
    text: 'The rot is all north side. Which means it started where we drained ' +
          'the pool three years ago.<br><br>' +
          'We were proud of that. It was the biggest thing this village had ' +
          'done in a century - a ditch, a season of work, and four more acres ' +
          'of firm ground out of a swamp.<br><br>' +
          'Drained ground lets air in. Air in a wet root is rot, and rot is a ' +
          'door.<br><br>' +
          'Go down into the hollow under the hall. It is the lowest point on ' +
          'the north side and if anything has come up through the root it has ' +
          'come up there.<br><br>' +
          'Do not go alone in the dark. Take a lamp and do not put it down.',
    cerinta: { fel: 'mergi', loc: 'gaura' }
  },
  {
    dator: 'negustor', nivel: 53,
    titlu: 'Flood It Back',
    text: 'They are in the root under the hall, eating it from the inside, and ' +
          'they got in through the dry ground we made ourselves.<br><br>' +
          'The council has voted to break the ditch and let the pool back. Four ' +
          'acres lost, a century\'s proudest work undone, and every family on ' +
          'the north side moving their grain uphill in the ' +
          'meantime.<br><br>' +
          'They will not go quietly out of a root they have had three years ' +
          'in.<br><br>' +
          'Fourteen of them under the hall, before the water comes in on top of ' +
          'them and us.<br><br>' +
          'Wet root rots slowly. Dry root rots fast. We learned that at the ' +
          'price of four acres and nearly a village.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  RIFTMARCH (45-55) - orasul se vinde pe bucati
// ----------------------------------------------------------
scrieZona('Riftmarch', 'riftmarch', [
  {
    dator: 'marshal', nivel: 45,
    titlu: 'The Crack Is Wider Every Year',
    text: 'There is a crack across this land you could drop this whole town ' +
          'into, and we measure it. Posts on both sides, a chain between, read ' +
          'on the first of every month.<br><br>' +
          'A hand\'s width a year. Not a rumour - a number, in a book, in my ' +
          'handwriting.<br><br>' +
          'The serpents came up out of it the year I started measuring and they ' +
          'have never gone back down. Eight of them along the edge path.<br><br>' +
          'Everybody here will tell you the rift is the problem. Stay a week ' +
          'and you will work out that the rift is the slowest problem we ' +
          'have.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 8 }
  },
  {
    dator: 'cercetas', nivel: 48,
    titlu: 'Stand on the Edge',
    text: 'Go out to the rift edge and stand at the measuring posts.<br><br>' +
          'Look down, by all means. Everybody does and it is worth ' +
          'doing.<br><br>' +
          'Then turn round and look back at the town.<br><br>' +
          'That is the part I want. Count the buildings with their facing ' +
          'stone stripped off. Count the ones with no roof that had a roof when ' +
          'the last census was taken.<br><br>' +
          'I have counted twice and got a number I did not believe, so I would ' +
          'like somebody who has never seen this place before to count it once ' +
          'and say it out loud.',
    cerinta: { fel: 'mergi', loc: 'groapa' }
  },
  {
    dator: 'negustor', nivel: 50,
    titlu: 'Warm Stone Sells',
    text: 'Nineteen buildings. Yes. I know, and I am the reason.<br><br>' +
          'Stone from the rift edge comes out warm and stays warm. I do not ' +
          'know why and neither does anybody else. What I know is that a coast ' +
          'mason will pay more for one block of it than for a cartload of ' +
          'anything else on this continent.<br><br>' +
          'So the town has been quarrying itself. Facing stone off the walls, ' +
          'then the walls, and the ship takes it out every eight days.<br><br>' +
          'Bring me eight pieces of the ore the burrowers throw up at the edge. ' +
          'If the deep stuff is warm too, we can quarry the rift instead of the ' +
          'houses, and I can stop being the man who is selling his own town.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Rift-Warm Ore' }
  },
  {
    dator: 'capitan', nivel: 53,
    titlu: 'Quarry the Rift, Not the Town',
    text: 'The deep ore is warm. Warmer, in fact. So there is no reason on ' +
          'earth to take another stone off a standing wall, and the merchant ' +
          'has said as much in the square with everybody watching.<br><br>' +
          'The crews who have been stripping buildings do not want to go down ' +
          'into a rift for the same money. They would rather keep taking ' +
          'roofs.<br><br>' +
          'Fourteen of them.<br><br>' +
          'A hand\'s width a year. At that rate this town has four hundred ' +
          'years before the crack reaches it, and it very nearly took itself ' +
          'apart in nine.<br><br>' +
          'Four hundred years is a long time. Long enough to be worth having a ' +
          'town in.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  THE PALE REACH (50-60) - un tinut care vorbeste din semne
// ----------------------------------------------------------
scrieZona('The Pale Reach', 'palereach', [
  {
    dator: 'cercetas', nivel: 50,
    titlu: 'You Cannot Shout Here',
    text: 'Try it. Shout as loud as you can and watch it die about forty feet ' +
          'out.<br><br>' +
          'Nobody knows why. Thin air, the shape of the rock, both. What ' +
          'matters is that on the Pale Reach you cannot call for help and you ' +
          'never could.<br><br>' +
          'So we do not talk with our mouths out here. We talk with our hands ' +
          'and with boards on the ridges, keep to keep, all the way down the ' +
          'range. A man falling can be answered in four minutes if he is in ' +
          'sight of a board.<br><br>' +
          'Wolves on the lower track - eight. They have learned that a person ' +
          'out of sight of a board is a person who cannot be helped.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'capitan', nivel: 53,
    titlu: 'The Relay Keep',
    text: 'Every sign on this range passes through the relay keep. It reads ' +
          'from the high boards and repeats to the low ones, and it has done it ' +
          'without a break for two hundred years.<br><br>' +
          'Four calls for help this winter were answered late. Not unanswered - ' +
          'late, by about the time it takes to think about something before ' +
          'passing it on.<br><br>' +
          'Two of those four people died.<br><br>' +
          'Go up to the relay keep. Watch them work a full pass. I am not ' +
          'asking you to accuse anybody of anything.<br><br>' +
          'I am asking whether a sign goes out of that keep exactly as it comes ' +
          'in.',
    cerinta: { fel: 'mergi', loc: 'cetate' }
  },
  {
    dator: 'negustor', nivel: 55,
    titlu: 'Boards That Are Not Ours',
    text: 'The keep is clean. Good. I never thought it was them.<br><br>' +
          'Here is the other way a sign gets delayed: it gets answered first by ' +
          'somebody else.<br><br>' +
          'I have had three sign-boards through my hands this season, bought off ' +
          'travellers as scrap timber. Painted boards, our marks, our sizes - ' +
          'and not one of them came off a keep of ours. I have checked ' +
          'every keep on the range.<br><br>' +
          'Bring me eight off the raiders on the high ground.<br><br>' +
          'If they are carrying our language painted on their own boards then ' +
          'they are not intercepting us. They are talking.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Copied Sign-Board' }
  },
  {
    dator: 'marshal', nivel: 58,
    titlu: 'They Learned to Read Us',
    text: 'Eight boards. Our marks, correct to the stroke, on timber that has ' +
          'never been near a keep of ours.<br><br>' +
          'They have learned it. Every sign this range has - help, wolves, ' +
          'stranger, come, do not come. They have been reading the whole ' +
          'mountain for two years and answering the calls they liked the sound ' +
          'of.<br><br>' +
          'Two hundred years of a people whose only voice is something you can ' +
          'see, and somebody sat on a ridge and watched until they could read ' +
          'it.<br><br>' +
          'Fourteen of them on the high ground. Take the boards.<br><br>' +
          'Then we change every sign on the range. All of them. It will take a ' +
          'winter and everybody will be half deaf until it is done.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  COLDSPINE (50-60) - gheata se retrage
// ----------------------------------------------------------
scrieZona('Coldspine', 'coldspine', [
  {
    dator: 'vanator', nivel: 50,
    titlu: 'A Mile in Four Years',
    text: 'That ice has been the north wall of this village for as long as ' +
          'there has been a village. It is also our clock, our water and our ' +
          'larder - you cut into it and take out last year.<br><br>' +
          'It has gone back a mile in four years.<br><br>' +
          'Behind it is ground. Bare ground, that no living person has ever ' +
          'stood on, and it gets bigger every summer.<br><br>' +
          'The wolves found it before we did. They den on the new ground and ' +
          'come down at the flocks. Eight of them.<br><br>' +
          'I am fifty-one and I am the first hunter in the history of this ' +
          'place with new country to learn. It does not feel like a gift.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 8 }
  },
  {
    dator: 'samana', nivel: 53,
    titlu: 'Walk to the Ice Face',
    text: 'Everybody in this village has an opinion about the ice and not one ' +
          'of them has walked to it this year, because it is a long cold day ' +
          'and the opinions are free.<br><br>' +
          'Go to the face. Walk right up to it.<br><br>' +
          'Look at the ground in front of it - whether it is bare rock or ' +
          'whether there is anything on it. Look at the face itself, low down, ' +
          'where the melt runs.<br><br>' +
          'I will tell you what I expect and then you can tell me if I am ' +
          'wrong: I expect you to find things in it. Shapes. Dark ones, held in ' +
          'the ice at about the height of your chest.<br><br>' +
          'I would very much like to be wrong.',
    cerinta: { fel: 'mergi', loc: 'minaVeche' }
  },
  {
    dator: 'negustor', nivel: 55,
    titlu: 'What the Thaw Gives Up',
    text: 'Iron. Coming out of a glacier, in a country that has never had a ' +
          'forge worth the name.<br><br>' +
          'I have bought eleven pieces this month and sold every one at four ' +
          'times what I paid on the coast, and I am not going to pretend I am ' +
          'sorry about that.<br><br>' +
          'What I am sorry about is the rush. Two hundred strangers camped at ' +
          'the face by midsummer, and Coldspine has forty houses.<br><br>' +
          'Bring me eight pieces off the burrowers - they are turning the new ' +
          'ground over faster than any man with a spade.<br><br>' +
          'I want to know what we are actually sitting on before somebody ' +
          'decides to take it off us.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Thawed Iron' }
  },
  {
    dator: 'marshal', nivel: 58,
    titlu: 'Forty Houses, Two Hundred Strangers',
    text: 'A village of forty houses cannot police two hundred armed strangers ' +
          'and I have stopped pretending otherwise.<br><br>' +
          'What I can do is hold the road. One way up, one way down, everything ' +
          'that comes off that ice passes through this village, and this ' +
          'village takes a tenth.<br><br>' +
          'Not because we found it. Because we are the reason anybody up there ' +
          'can eat.<br><br>' +
          'The raiders on the road say no, at present loudly.<br><br>' +
          'Fourteen of them.<br><br>' +
          'The ice will be gone in my grandchildren\'s time. When it is, I want ' +
          'there to still be a Coldspine standing where the ice used to be.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);


// ----------------------------------------------------------
//  SUNDERCRAG (50-60) - locul unde nimeni nu intreaba cum te cheama
// ----------------------------------------------------------
scrieZona('Sundercrag', 'sundercrag', [
  {
    dator: 'vanator', nivel: 50,
    titlu: 'Nobody Asks Here',
    text: 'You have reached the end of the road. There is nothing past ' +
          'Sundercrag but the split in the mountain and then the sea on the ' +
          'wrong side of the world.<br><br>' +
          'There is one rule here and everybody keeps it: nobody asks your ' +
          'name and nobody writes anything down.<br><br>' +
          'Every single person in this town came here to stop being findable. ' +
          'Including me. Including whoever pours your drink ' +
          'tonight.<br><br>' +
          'Serpents in the lower street - eight. They come up out of the split ' +
          'when the wind is warm and we have no children left to lose to ' +
          'them.<br><br>' +
          'Do the work. Do not ask anybody anything.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 8 }
  },
  {
    dator: 'marshal', nivel: 53,
    titlu: 'Somebody Started Writing',
    text: 'I am called the marshal here, which means I keep the peace and ' +
          'nothing else. I have no book. That is the job.<br><br>' +
          'Three weeks ago a page turned up in the street. Names down one side, ' +
          'in a good clerk\'s hand. Descriptions down the other. Eleven of them ' +
          'and I knew nine.<br><br>' +
          'Two of the nine have left town since. One did not leave.<br><br>' +
          'Bring me eight more pages off the raiders in the upper crag. They ' +
          'carry the runs down to the coast.<br><br>' +
          'I want to know how long the list is, and I want to know before the ' +
          'people on it do.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 8, obiect: 'Name-List Page' }
  },
  {
    dator: 'samana', nivel: 55,
    titlu: 'Who Sits in the Split Keep',
    text: 'Eight pages is a hundred and thirty names. That is most of this ' +
          'town.<br><br>' +
          'Somebody has been sitting still, watching, and writing, for a long ' +
          'time - long enough to have learned faces that only come out at ' +
          'night.<br><br>' +
          'There is one building in Sundercrag with a clear view of both ' +
          'streets and the whole of the lower town, and it is the half of the ' +
          'keep that did not fall into the split.<br><br>' +
          'Everyone assumes it is empty because everyone can see the crack ' +
          'running through it.<br><br>' +
          'Go up to the split keep. Go carefully, and come back. A hundred and ' +
          'thirty people need you to come back.',
    cerinta: { fel: 'mergi', loc: 'cetate' }
  },
  {
    dator: 'armurier', nivel: 58,
    titlu: 'The Last Rule',
    text: 'A desk, a lamp, four years of ledgers, and a clear view of both ' +
          'streets.<br><br>' +
          'He was not hunting anybody himself. He wrote, and he sold what he ' +
          'wrote, to whoever came asking - and the raiders in the upper crag ' +
          'carried it down to the coast eight pages at a time.<br><br>' +
          'Sundercrag has exactly one law. He broke it for money, quietly, for ' +
          'four years, in a room above people who would have fed him for ' +
          'nothing.<br><br>' +
          'Fourteen on the upper crag, and every page you can carry.<br><br>' +
          'We are going to burn them in the street where everybody can watch, ' +
          'and then this town goes back to not knowing anybody\'s name. It is ' +
          'not much of a rule. It is the only one we have.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 14 }
  }
]);
