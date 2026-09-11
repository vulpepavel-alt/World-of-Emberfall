// ==========================================================
//  MISIUNILE FACUTE DUPA TIPARE
//
//  ATENTIE: acum fisierul asta NU MAI FACE NICIO MISIUNE.
//
//  Toate cele patruzeci de zone au misiuni scrise de mana, in
//  misiuni-scrise.js, iar motorul de aici sare peste orice zona
//  care are deja misiuni. L-am lasat in joc ca plasa de siguranta:
//  daca adaugi o zona noua si uiti sa-i scrii poveste, primeste
//  patru misiuni dupa tiparele de mai jos in loc de niciuna.
//
//  Restul comentariului povesteste de ce arata asa.
//
//  Cele 36 de misiuni din Greenvale si Redwaste sunt scrise de
//  mana, una cate una, cu poveste legata cap la cap.
//
//  Pentru celelalte 38 de zone asa ceva ar fi insemnat inca vreo
//  o suta cincizeci de povesti scrise pe rand. Aici misiunile se
//  fac dupa TIPARE.
//
//  Prima incercare avea sase tipare pentru o suta cincizeci de
//  misiuni - fiecare tipar se repeta de douazeci si cinci de ori
//  si se vedea de la o posta. Acum sunt treizeci si doua, si pe
//  deasupra:
//
//    - fiecare misiune dintr-o zona o da ALT OM, iar oamenii nu
//      vorbesc la fel: omul legii da ordine, negustorul socoteste
//      bani, vanatorul citeste urme, minerul vorbeste de pamant;
//    - in text intra cuvintele zonei tale. Intr-o padure se
//      pomeneste marginea padurii, intr-un pustiu dunele, intr-o
//      mlastina stuful. Acelasi tipar suna altfel in alta zona;
//    - misiunile te trimit la locurile adevarate de pe harta zonei:
//      mina ei, pestera ei, cetatea ei.
//
//  Tot nu sunt la fel de bune ca cele scrise de mana. Dar nu mai
//  citesti de patru ori acelasi text cu alt nume in el.
// ==========================================================


// Cate misiuni primeste fiecare zona care n-are scrise de mana.
const MISIUNI_PE_ZONA = 4;


// ----------------------------------------------------------
//  CUVINTELE FIECARUI CLIMAT
//
//  {teren} {drum} {apa} {vreme} se inlocuiesc cu astea, dupa
//  clima zonei. Asa acelasi tipar suna a padure intr-o zona si
//  a desert in alta.
// ----------------------------------------------------------
const VORBA_CLIMATULUI = {
  padure: {
    teren: 'the treeline', drum: 'the forest road',
    apa: 'the river', vreme: 'the wet season', pamant: 'soft ground'
  },
  pustiu: {
    teren: 'the red canyons', drum: 'the dust track',
    apa: 'the dry wash', vreme: 'the heat', pamant: 'baked ground'
  },
  campie: {
    teren: 'the tall grass', drum: 'the open road',
    apa: 'the creek', vreme: 'the dry wind', pamant: 'hard ground'
  },
  mlastina: {
    teren: 'the reeds', drum: 'the causeway',
    apa: 'the black water', vreme: 'the damp', pamant: 'sinking ground'
  },
  munte: {
    teren: 'the high passes', drum: 'the switchback road',
    apa: 'the melt stream', vreme: 'the cold', pamant: 'bare rock'
  },
  cenusa: {
    teren: 'the ash fields', drum: 'the burnt road',
    apa: 'the fire channels', vreme: 'the smoke', pamant: 'cinder'
  },
  coasta: {
    teren: 'the sea cliffs', drum: 'the coast road',
    apa: 'the shallows', vreme: 'the salt wind', pamant: 'wet sand'
  }
};


// Cum se cheama in joc fiecare fel de loc de pe harta.
const NUMELE_LOCULUI = {
  oras: 'the city', sat: 'the village', tabara: 'the camp',
  corturi: 'the camp', pestera: 'the cave', mina: 'the mine',
  cetate: 'the keep', post: 'the outpost', ferma: 'the farm',
  poiana: 'the clearing'
};


// Din ce breasla face parte cel care da misiunea. Fiecare breasla
// are tiparele ei, pentru ca un capitan si un negustor nu vorbesc
// despre acelasi lucru cand ii mananca lupii.
const BREASLA_OMULUI = {
  marshal: 'lege', chief: 'lege', cavaler: 'lege', capitan: 'lege',
  negustor: 'negot', armurier: 'negot', taran: 'negot',
  padurar: 'salbatic', vanator: 'salbatic', cercetas: 'salbatic',
  miner: 'adanc', samana: 'adanc'
};


// ==========================================================
//  TIPARELE
//
//  Pe fel: 'ucide' (omoara atatia), 'aduna' (adu atatea lucruri),
//  'mergi' (du-te pana intr-un loc si vezi ce e acolo).
// ==========================================================
const TIPARE = {

  // ----------------------------------------------------------
  //  OMUL LEGII: marshal, chief, cavaler, capitan
  //  Vorbeste in ordine si in pierderi. Nu se explica prea mult.
  // ----------------------------------------------------------
  lege: {
    ucide: [
      {
        titlu: 'The Road Is Closed',
        text: 'Nothing has come up {drum} into {zona} in eleven days. Not a cart, ' +
              'not a letter, not a traveller.<br><br>' +
              'I sent a man out on the ninth day. He came back on foot, without ' +
              'his horse and without most of his sense, and what he could say was ' +
              'one word: {mob}.<br><br>' +
              'So now I am sending somebody who might come back whole. {cati} of ' +
              'them, and the road opens again.<br><br>' +
              'Do not be brave about it. Be thorough.'
      },
      {
        titlu: 'What the Watch Saw',
        text: 'We keep a watch here. Two people, turn and turn about, on the high ' +
              'ground where you can see the whole of the low country.<br><br>' +
              'Both of them have told me the same thing this month, separately, ' +
              'without knowing the other had said it: the {mob} are not wandering. ' +
              'They are moving the same direction, night after night, and that ' +
              'direction is {loc}.<br><br>' +
              'I do not know what that means yet. I know what it will mean if we ' +
              'wait to find out.<br><br>' +
              '{cati}. Now, while they are still spread out.'
      },
      {
        titlu: 'Names in the Book',
        text: 'I keep a list of everyone who has not come back. It was four names ' +
              'when I took this post. It is now nineteen.<br><br>' +
              'Every one of them went out past {teren} and every one of them went ' +
              'out knowing the {mob} were there. That is the part I cannot forgive ' +
              'myself for. They knew, and they went, because I had not made it ' +
              'anyone\'s job to stop it.<br><br>' +
              'I am making it yours. {cati} of them.<br><br>' +
              'I would rather pay you than write a twentieth name.'
      },
      {
        titlu: 'An Order, Not a Favour',
        text: 'I will be plain with you, because I have no time to be anything ' +
              'else.<br><br>' +
              'The {mob} are between us and every other place that matters. I have ' +
              'six people fit to fight and four of them are needed where they ' +
              'stand. That leaves two, and two is not enough, and you are ' +
              'here.<br><br>' +
              'Kill {cati} of them. Not the strays near {loc} - the ones out where ' +
              'they gather, where it costs something.<br><br>' +
              'When you come back I will tell you what I think is really ' +
              'happening. Not before. I would rather you went with a clear head.'
      }
    ],
    aduna: [
      {
        titlu: 'Proof for the Ledger',
        obiect: '{mobUnul} Token',
        text: 'Everything that happens in {zona} goes in the book. Every raid, ' +
              'every loss, every head of livestock. That is the job, and it has ' +
              'been the job since before my grandmother.<br><br>' +
              'The trouble with a book is that it only convinces people who ' +
              'already believe you. I have written to the capital four times about ' +
              'the {mob} and had four polite letters back.<br><br>' +
              'So bring me {cati} pieces off them. Not for the book. For the sack ' +
              'I intend to empty onto a table in front of somebody ' +
              'important.<br><br>' +
              'They will believe a sack.'
      },
      {
        titlu: 'What They Carry',
        obiect: '{mobUnul} Mark',
        text: 'Strip {cati} of the {mob} and bring me what they are carrying. I am ' +
              'not interested in whether it is worth anything.<br><br>' +
              'Here is why. Three of them were killed near {loc} last month and ' +
              'all three carried the same mark. Not a family mark. Not a beast\'s ' +
              'markings. Something cut in on purpose, the same way, by the same ' +
              'hand or on the same order.<br><br>' +
              'Beasts do not get issued anything. So either I am wrong about what ' +
              'they are, or somebody is out past {teren} handing it to them.<br><br>' +
              'I want to know which before {vreme} turns.'
      }
    ],
    mergi: [
      {
        titlu: 'Go and Look',
        text: 'I am not going to send you into a fight you know nothing about. ' +
              'That is how I lost the last two.<br><br>' +
              'Go to {loc}. Do not go in if it is held. Do not start anything. ' +
              'Stand where you can see it, count what you see, and come ' +
              'back.<br><br>' +
              'You will find the way easily enough - take {drum} and keep {teren} ' +
              'on your left.<br><br>' +
              'Eyes, not blades. There will be time for the other.'
      },
      {
        titlu: 'The Post That Stopped Reporting',
        text: 'There were people at {loc}. Not many - it was never a big posting - ' +
              'but there were people, and every seventh day one of them walked ' +
              'here and told me it was quiet.<br><br>' +
              'Nobody has walked here in three weeks.<br><br>' +
              'It might be nothing. A broken leg, a flooded track, somebody who ' +
              'decided they had had enough of {vreme} and went home without ' +
              'telling me. It might also not be nothing.<br><br>' +
              'Go there. That is the whole task. Go there and see.'
      }
    ]
  },

  // ----------------------------------------------------------
  //  NEGUSTORUL: negustor, armurier, taran
  //  Socoteste. Totul are un pret si el il stie pe de rost.
  // ----------------------------------------------------------
  negot: {
    ucide: [
      {
        titlu: 'Bad for Business',
        text: 'I will tell you what the {mob} cost me last season, since nobody ' +
              'else in {zona} seems to want to put a number on it.<br><br>' +
              'Two carts. Eleven days of stock I could not move. One driver, who ' +
              'had a family, and whose family I now pay out of a purse that was ' +
              'never meant to stretch that way.<br><br>' +
              'People think a trader only counts coin. I count what I can no ' +
              'longer buy with it.<br><br>' +
              '{cati} of them. I will pay in coin, because that is what I have, ' +
              'and because it is worth it.'
      },
      {
        titlu: 'The Price of Everything',
        text: 'Flour is up a third. Salt has doubled. Nails - nails, of all things ' +
              '- I cannot get at any price.<br><br>' +
              'None of that is because there is less of it in the world. It is ' +
              'because nobody will drive a cart down {drum} while the {mob} are ' +
              'sitting on it, and a thing you cannot move is a thing that does not ' +
              'exist.<br><br>' +
              'Thin them out. {cati} should be enough to make a driver braver than ' +
              'he is today.<br><br>' +
              'Every person in this place will be better off and not one of them ' +
              'will know it was you.'
      },
      {
        titlu: 'I Am Not a Fighting Man',
        text: 'I want to be honest with you about what I am, because I think you ' +
              'will find out anyway.<br><br>' +
              'I am not a fighting man. I have never been one. When the {mob} came ' +
              'through the yard I stood behind a door and I stayed there, and I ' +
              'have thought about it every day since.<br><br>' +
              'I cannot go out past {teren} and do what needs doing. But I can pay ' +
              'somebody who can, and I can do it without pretending I am being ' +
              'generous about it.<br><br>' +
              '{cati}. Take my money and go.'
      },
      {
        titlu: 'The Seed Stock',
        text: 'Everything I have is in the ground or in that shed, and the {mob} ' +
              'have been at both.<br><br>' +
              'It is not the eating that ruins you. A beast eats what a beast ' +
              'eats. It is that they come through at night and open things - sacks, ' +
              'doors, fences - and then the rain gets in, or the rest of them do, ' +
              'and by morning a season is gone.<br><br>' +
              'I have seed for one more sowing. One.<br><br>' +
              '{cati} of them, and I will still be here when {vreme} comes round ' +
              'again.'
      }
    ],
    aduna: [
      {
        titlu: 'The Old Trade',
        obiect: '{mobUnul} Hide',
        text: 'Before all this, {zona} lived on trade. Not much of it, and not ' +
              'rich, but steady - and steady is worth more than rich when you have ' +
              'children.<br><br>' +
              'There is still one thing here worth money outside: what comes off ' +
              'the {mob}. Nobody wants to go and get it, which is exactly why it is ' +
              'still worth money.<br><br>' +
              'Bring me {cati}. I will get them down {drum} and out, and {loc} will ' +
              'eat this winter.<br><br>' +
              'It is not glory. It is bread.'
      },
      {
        titlu: 'A Buyer I Should Not Have',
        obiect: '{mobUnul} Piece',
        text: 'A man came through and asked for {cati} pieces off the {mob}. Paid ' +
              'half up front, in good coin, and did not blink at the price - which ' +
              'is the part that bothers me, because I named a stupid one.<br><br>' +
              'He did not say what they were for. He did not say where he was from. ' +
              'He said he would come back when {vreme} ends and he would like them ' +
              'ready.<br><br>' +
              'I have taken his money, so I am going to get him his pieces. But I ' +
              'would rather it was you out there than me, and I would rather you ' +
              'came back and told me if you see anything I should worry about.'
      }
    ],
    mergi: [
      {
        titlu: 'Somebody Should Check',
        text: 'I sell to {loc}. Or I did. Every month, same order, paid ' +
              'late but always paid.<br><br>' +
              'Two months now, nothing. No order, no letter, no apology - and ' +
              'whatever else they are out there, they were never rude.<br><br>' +
              'I am not asking you to fight anything. Go up {drum}, get close ' +
              'enough to see it properly, and come back and tell me what is ' +
              'standing.<br><br>' +
              'If there is nobody left I would like to be the one who knows it ' +
              'first. That sounds cold. It is how a trade survives.'
      },
      {
        titlu: 'The Cart Did Not Arrive',
        text: 'A cart of mine was due here four days ago by way of {loc}. Good ' +
              'driver, good horse, a load worth more than this whole ' +
              'building.<br><br>' +
              'I have stood at that door every morning since.<br><br>' +
              'Take {drum} out to {loc} and look. I am not asking you to bring ' +
              'anything back and I am not asking you to fight for it. I only want ' +
              'to stop standing at the door.<br><br>' +
              'Whatever you find, come and say it plainly. I would rather hear it ' +
              'plainly.'
      }
    ]
  },

  // ----------------------------------------------------------
  //  OMUL PADURII: padurar, vanator, cercetas
  //  Citeste urme. Vorbeste despre ce fac animalele, nu despre bani.
  // ----------------------------------------------------------
  salbatic: {
    ucide: [
      {
        titlu: 'They Are Not Behaving',
        text: 'I have tracked the {mob} in this country for nineteen years and ' +
              'this season they are wrong.<br><br>' +
              'Wrong how? They are not spread out. They are not holding ground ' +
              'the way they hold it every year. They have left good feeding near ' +
              '{apa} and gone up past {teren}, which no animal does unless ' +
              'something worse is behind it.<br><br>' +
              'I would like to leave them alone and watch. But there are people ' +
              'in the way, and people do not get to wait while I finish being ' +
              'curious.<br><br>' +
              '{cati}. I will tell you what I think when you get back.'
      },
      {
        titlu: 'Thin the Packs',
        text: 'You will not have been here long enough to know how {zona} used to ' +
              'look. Quieter. Emptier. Safer.<br><br>' +
              'The {mob} have come in from the edges since {vreme} started, and ' +
              'they have come in numbers nobody here can remember seeing. We have ' +
              'lost two carts and a boy on {drum} already.<br><br>' +
              'I cannot pay you the way a city would. But I can pay you, and I can ' +
              'tell you honestly that {cati} of them dead makes a difference to ' +
              'people who live here.<br><br>' +
              'Go out past {teren}. You will not have to look far.'
      },
      {
        titlu: 'Too Many for the Land',
        text: 'There is a number of {mob} this country can carry. I do not know ' +
              'what it is exactly. I know we are well past it.<br><br>' +
              'You can see it in what they are eating - bark, roots, each other. ' +
              'An animal that is eating bark is an animal that will come into a ' +
              'yard, and an animal that comes into a yard gets somebody\'s ' +
              'child.<br><br>' +
              'This is not cruelty. If we do nothing, {vreme} kills three times as ' +
              'many of them, slowly, and takes people with it.<br><br>' +
              '{cati}. Do it cleanly if you can.'
      },
      {
        titlu: 'The Tracks Go the Wrong Way',
        text: 'Come and look at this before you go. No - crouch. There.<br><br>' +
              'Those are {mob}, two days old, and they are heading toward {loc}. ' +
              'Not away from it, toward it. In nineteen years I have never once ' +
              'seen them go toward a place where people are, unless something ' +
              'made the rest of the country worse.<br><br>' +
              'I have followed them as far as {teren} and lost the trail on ' +
              '{pamant}.<br><br>' +
              'Kill {cati} and bring the pressure off. Then I will go further, and ' +
              'this time I will take somebody with me.'
      }
    ],
    aduna: [
      {
        titlu: 'Something Is in Them',
        obiect: '{mobUnul} Sample',
        text: 'I opened one. I will not apologise for it - you learn more from one ' +
              'opened animal than from a month of watching.<br><br>' +
              'There was something in it that should not have been. I am not going ' +
              'to tell you what I think it is, because if I tell you, you will ' +
              'look for it and find it whether it is there or not.<br><br>' +
              'Bring me the same part off {cati} of the {mob}. Different ones, ' +
              'different places - some from near {apa}, some from out past ' +
              '{teren}.<br><br>' +
              'If it is in all of them, it is not one sick animal. It is the ' +
              'country.'
      },
      {
        titlu: 'Teaching the Young Ones',
        obiect: '{mobUnul} Trophy',
        text: 'There are four of them here who want to hunt and not one who knows ' +
              'how. Their parents are dead or busy and I am what is left.<br><br>' +
              'I need {cati} pieces off the {mob} to teach on. Real ones. You ' +
              'cannot teach a child what a thing is by describing it and you ' +
              'certainly cannot teach them to be careful.<br><br>' +
              'Take them from the ones out past {teren}, not the sick ones near ' +
              '{loc}. I want them learning what a healthy one looks like.<br><br>' +
              'In three years these four will be doing this work and I will be ' +
              'too slow for it. That is the whole plan.'
      }
    ],
    mergi: [
      {
        titlu: 'Walk It With Your Own Eyes',
        text: 'I can tell you what is at {loc} and you will half believe me. Go ' +
              'and stand there and you will know it.<br><br>' +
              'Follow {drum} until it bends, then leave it and keep {teren} on ' +
              'your right. It is further than it looks on {pamant} - give ' +
              'yourself the day.<br><br>' +
              'Do not go inside. Do not throw anything. Do not be clever.<br><br>' +
              'Stand, look, remember, come back. Then we will talk about what to ' +
              'do, and we will talk about it knowing the same things.'
      },
      {
        titlu: 'Where the Birds Stopped',
        text: 'There is a thing you learn out here before you learn anything else: ' +
              'listen for what is missing.<br><br>' +
              'Everything past {loc} has gone quiet. Not empty - quiet. The birds ' +
              'are still in the country, they have just stopped going that way, ' +
              'and they have stopped all at once.<br><br>' +
              'I want somebody to walk to the edge of it and listen. That is all. ' +
              'You do not need to understand it; I have been at this long enough to ' +
              'know I would not either.<br><br>' +
              'Go as far as {loc} and come back and tell me what you heard.'
      }
    ]
  },

  // ----------------------------------------------------------
  //  OMUL ADANCULUI: miner, samana
  //  Vorbeste de pamant, de ce e dedesubt si de semne.
  // ----------------------------------------------------------
  adanc: {
    ucide: [
      {
        titlu: 'They Came Up',
        text: 'We went down a long way this year. Further than the old workings, ' +
              'further than anybody here has been.<br><br>' +
              'Three days after we broke through, the {mob} were on the surface in ' +
              'numbers. People will tell you that is a coincidence. I have worked ' +
              '{pamant} my whole life and I have never once been paid for ' +
              'believing in coincidences.<br><br>' +
              'I think we opened something. I think they came up.<br><br>' +
              'Kill {cati} of them while I decide whether to seal it, and do not ' +
              'repeat any of this in {loc}.'
      },
      {
        titlu: 'The Shift That Will Not Go Down',
        text: 'I have thirty-one people and not one of them will go down today. ' +
              'They are not cowards. They have been doing this since they were ' +
              'children.<br><br>' +
              'They will not go because the {mob} are at the mouth of it, and a ' +
              'man underground cannot run and cannot see what is between him and ' +
              'the light.<br><br>' +
              'I cannot make them and I would not want to.<br><br>' +
              'Clear {cati} of them off and I will have a working mine by ' +
              'nightfall and thirty-one people who eat this month.'
      },
      {
        titlu: 'A Bad Sign, Plainly Told',
        text: 'I am going to tell you this the plain way, without the drums and ' +
              'the smoke, because you look like somebody who would rather have ' +
              'it plain.<br><br>' +
              'The {mob} are gathering where the ground is thinnest. Not where ' +
              'the food is. Where the ground is thinnest. Whatever draws them is ' +
              'under {zona}, not on it.<br><br>' +
              'I cannot fight what is under. Nobody can, yet.<br><br>' +
              'But {cati} fewer of them above ground buys time, and time is what I ' +
              'am asking for. Go, before {vreme} makes the way out past {teren} ' +
              'impossible.'
      },
      {
        titlu: 'What the Deep Owes Us',
        text: 'Four generations of my people have taken things out of this ground ' +
              'and given nothing back to it. I used to think that was a saying. I ' +
              'am less sure now.<br><br>' +
              'The {mob} came the year we opened the lower seam. They have not ' +
              'left. They do not behave like anything that was here before, and ' +
              'they are worst near {loc}, which is exactly where we dug.<br><br>' +
              'I am not asking you to believe me. I am asking you to kill ' +
              '{cati}.<br><br>' +
              'Believe whatever you like afterward.'
      }
    ],
    aduna: [
      {
        titlu: 'For the Reading',
        obiect: '{mobUnul} Fragment',
        text: 'I need {cati} pieces off the {mob}, and I need them fresh, and I ' +
              'need them from different ones.<br><br>' +
              'You will want to know what for. The honest answer is that I read ' +
              'them, and the equally honest answer is that I do not fully ' +
              'understand how, only that my teacher did it and was right more ' +
              'often than a guess.<br><br>' +
              'Laugh if you want. Everyone here does, until {vreme} comes early ' +
              'and I was the one who said it would.<br><br>' +
              'Fresh. Different ones. As many as I asked for, not fewer.'
      },
      {
        titlu: 'Something in the Ore',
        obiect: '{mobUnul} Shard',
        text: 'Look at this. Go on, hold it.<br><br>' +
              'That came out of the seam last week and there is no reason for it ' +
              'to be that colour. And the {mob} out past {teren} have the same ' +
              'colour in them - in the bone, not on it. I checked twice because I ' +
              'did not believe it the first time.<br><br>' +
              'Bring me {cati} pieces off them and I will know whether the ground ' +
              'is getting into the animals or the animals are getting into the ' +
              'ground.<br><br>' +
              'Neither answer is a good one. I would still rather know.'
      }
    ],
    mergi: [
      {
        titlu: 'The Old Workings',
        text: 'There is a way in at {loc} that is older than this settlement. ' +
              'Older than the records. We did not dig it and we do not know who ' +
              'did.<br><br>' +
              'Every few years somebody decides to go and look and every few years ' +
              'I talk them out of it. I am not talking you out of it. You have the ' +
              'look of somebody who gets back out.<br><br>' +
              'Go to {loc}. Stand at the mouth of it. Do not go in.<br><br>' +
              'Come and tell me if it is still shut. That is all I want to ' +
              'know - whether it is still shut.'
      },
      {
        titlu: 'Stand Where I Cannot',
        text: 'My knees are done. That is the whole of it - no omen, no vision, ' +
              'just a man who cannot walk to {loc} any more and needs to know what ' +
              'is there.<br><br>' +
              'Take {drum} out. When {pamant} gives way to stone you are close. ' +
              'Stand where you can see the whole of it, and take your time about ' +
              'looking, because you will be telling it to somebody who knew that ' +
              'place when it worked.<br><br>' +
              'I built half of what is out there. I would like to hear what is ' +
              'left of it while I am still here to hear it.'
      }
    ]
  }
};


// Din ce fel de inamic se face fiecare misiune, dupa nivelul ei.
function feluriPentruMisiune(reteta, nivel) {
  return reteta.feluriPeNivel(Math.max(reteta.nivelDeLa, Math.min(reteta.nivelPanaLa, nivel)));
}


// Numele unui fel de inamic, asa cum se vede in joc.
function numeleFelului(fel) {
  return (typeof MOBI !== 'undefined' && MOBI[fel]) ? MOBI[fel].nume : fel;
}


// In text inamicii sunt pomeniti la MULTI ("the Wolves are on the
// road"), dar obiectul luat de la unul singur e la unul ("Wolf
// Token"). Fara asta iesea "the Forest Spider are sitting on it".
function laMaiMulti(nume) {
  if (/(s|x|ch|sh)$/i.test(nume)) return nume + 'es';
  if (/[^aeiou]y$/i.test(nume)) return nume.slice(0, -1) + 'ies';
  return nume + 's';
}


function umple(sablon, valori) {
  return sablon.replace(/\{([a-zA-Z]+)\}/g, function (tot, cheie) {
    return (valori[cheie] !== undefined) ? valori[cheie] : tot;
  });
}


// ----------------------------------------------------------
//  Cine da misiunile intr-o zona
//
//  Pana la patru oameni, si pe cat se poate din BRESLE DIFERITE -
//  ca sa nu-ti dea doua misiuni la rand doi negustori care spun
//  cam acelasi lucru.
// ----------------------------------------------------------
function datoriiZonei(reteta) {

  const vazute = {};
  const toti = [];

  (reteta.npci || []).forEach(function (n) {
    if (vazute[n.fel]) return;
    if (!BREASLA_OMULUI[n.fel]) return;    // negustorii orci si altii fara tipare
    vazute[n.fel] = true;
    toti.push({ fel: n.fel, breasla: BREASLA_OMULUI[n.fel] });
  });

  // Intai cate unul din fiecare breasla, apoi restul.
  const alese = [], bresleLuate = {};
  toti.forEach(function (o) {
    if (bresleLuate[o.breasla]) return;
    bresleLuate[o.breasla] = true;
    alese.push(o);
  });
  toti.forEach(function (o) {
    if (alese.indexOf(o) < 0) alese.push(o);
  });

  return alese;
}


// Locul spre care poate trimite o misiune de cercetare: oricare
// de pe harta, numai nu cel in care stai oricum de la inceput.
function loculDeCercetat(reteta) {
  const start = (reteta.start || {}).la;
  const bune = (reteta.locuri || []).filter(function (l) {
    return l.id !== start && NUMELE_LOCULUI[l.fel];
  });
  return bune.length ? bune[reteta.samanta % bune.length] : null;
}


// Face cele patru misiuni ale unei zone.
function faMisiunileZonei(reteta) {

  // Zonele cu misiuni scrise de mana nu primesc si de-astea.
  if (MISIUNI.some(function (m) { return m.zona === reteta.nume; })) return [];

  const datori = datoriiZonei(reteta);
  if (!datori.length) return [];

  const vorba = VORBA_CLIMATULUI[reteta.climat] || VORBA_CLIMATULUI.campie;
  const deCercetat = loculDeCercetat(reteta);

  // Ordinea misiunilor din zona. Sunt trei asezari, si zona alege
  // una dupa samanta ei.
  //
  // Fara asta, misiunea de cercetare cadea MEREU pe al doilea om din
  // zona - si cum al doilea om era aproape peste tot negustorul, toate
  // cele treizeci si opt de misiuni de cercetare din lume ieseau din
  // cele doua tipare ale negustorului. Le-am numarat: un singur text
  // se repeta de douazeci si unu de ori.
  const ASEZARI = [
    ['ucide', 'mergi', 'ucide', 'aduna'],
    ['ucide', 'ucide', 'mergi', 'aduna'],
    ['ucide', 'aduna', 'mergi', 'ucide']
  ];
  let feluriMisiune = ASEZARI[reteta.samanta % ASEZARI.length];
  if (!deCercetat) {
    feluriMisiune = feluriMisiune.map(function (f) { return f === 'mergi' ? 'ucide' : f; });
  }

  // Tot din acelasi motiv: cu ce om incepe zona se roteste si el,
  // ca sa nu inceapa toate zonele cu marshal-ul.
  const deUnde = reteta.samanta % datori.length;

  const facute = [];
  const deLa = reteta.nivelDeLa, panaLa = reteta.nivelPanaLa;

  for (let i = 0; i < MISIUNI_PE_ZONA; i++) {

    // Nivelurile se intind peste intervalul zonei.
    const nivel = Math.round(deLa + (panaLa - deLa) * (i / Math.max(1, MISIUNI_PE_ZONA - 1)) * 0.8);

    // Inamicul cerut trebuie sa fie pe masura zonei. Fara randul de
    // mai jos, o zona de nivelul 30 cerea "opt Field Rats" - sunt
    // chiar de nivelul 30 acolo, dar suna caraghios.
    let feluri = feluriPentruMisiune(reteta, nivel);
    if (reteta.nivelDeLa > 15) {
      const fara = feluri.filter(function (f) { return f !== 'rat'; });
      if (fara.length) feluri = fara;
    }
    const fel = feluri[i % feluri.length];
    const numeMob = numeleFelului(fel);

    const dator = datori[(deUnde + i) % datori.length];
    const felMisiune = feluriMisiune[i];
    const pungaTipare = TIPARE[dator.breasla][felMisiune];

    // Care tipar din punga. Amestecam numele zonei cu felul misiunii
    // in loc sa adunam pur si simplu samanta cu i: adunarea simpla
    // lasa tipare care nu ies niciodata la sorti.
    const tipar = pungaTipare[numarDinText(reteta.id + felMisiune, i) % pungaTipare.length];

    // Locul pomenit in text: cel de cercetat daca exista, altfel
    // primul loc de pe harta zonei.
    const locPomenit = deCercetat || (reteta.locuri || [])[0];
    const numeLoc = locPomenit ? (NUMELE_LOCULUI[locPomenit.fel] || 'the camp') : 'the camp';

    const cati = (felMisiune === 'mergi') ? 1
               : (felMisiune === 'aduna') ? (6 + i) : (8 + i * 2);

    const valori = {
      zona: reteta.nume, mob: laMaiMulti(numeMob), mobUnul: numeMob,
      cati: cati, loc: numeLoc,
      teren: vorba.teren, drum: vorba.drum, apa: vorba.apa,
      vreme: vorba.vreme, pamant: vorba.pamant
    };

    // Cam trei sferturi dintr-un nivel. O misiune de mers nu e o
    // lupta, deci plateste jumatate.
    const catDeGreu = (felMisiune === 'mergi') ? 0.4 : 0.75;
    const rasplata = {
      xp: Math.round(140 * Math.pow(nivel, 1.22) * catDeGreu),
      bani: Math.round(60 * Math.pow(nivel, 1.1) * catDeGreu)
    };
    if (i > 0 && felMisiune !== 'mergi') {
      rasplata.nivelObiect = Math.min(60, nivel + 1);
      rasplata.raritate = (i === MISIUNI_PE_ZONA - 1) ? 'rar' : 'bun';
    }

    let cerinta;
    if (felMisiune === 'mergi') {
      cerinta = { fel: 'mergi', cati: 1, numeLoc: numeLoc,
                  loc: reteta.id + ':' + deCercetat.id };
    } else if (felMisiune === 'aduna') {
      cerinta = { fel: 'aduna', mob: fel, cati: cati,
                  obiect: umple(tipar.obiect, valori) };
    } else {
      cerinta = { fel: 'ucide', mob: fel, cati: cati };
    }

    facute.push({
      id: reteta.id + '-q' + (i + 1),
      zona: reteta.nume,
      dator: dator.fel,
      nivel: nivel,
      cere: (i > 0) ? (reteta.id + '-q' + i) : undefined,
      titlu: umple(tipar.titlu, valori),
      text: umple(tipar.text, valori),
      cerinta: cerinta,
      rasplata: rasplata
    });
  }

  return facute;
}


// Se cheama o singura data, dupa ce s-au incarcat toate zonele.
function faMisiunileTuturorZonelor() {
  ZONE.forEach(function (reteta) {
    faMisiunileZonei(reteta).forEach(function (m) { MISIUNI.push(m); });
  });
}
