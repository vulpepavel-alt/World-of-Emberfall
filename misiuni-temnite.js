// ==========================================================
//  MISIUNILE DE TEMNITA
//
//  Fiecare temnita are doua misiuni, date de marsalul din zona in
//  care se intra in ea. Prima te trimite dupa seful cel mare, a
//  doua te trimite inapoi sa o cureti de tot.
//
//  De ce exista: pana acum o temnita era o usa in stanca pe langa
//  care puteai trece fara sa stii ca e acolo. Acum cineva iti spune
//  ce e inauntru si de ce conteaza - si, ca in Classic, prada e doar
//  jumatate din motiv.
//
//  Cele de la Coldspine si Thornspire umplu si bucata cea mai goala
//  din joc, 56-60. Ultima, Under-Factor, te trimite spre coasta -
//  adica spre lantul de final.
//
//  'cereTemnita' nu opreste nimic: e scris ca sa se stie, la o
//  cautare, ce misiune tine de ce temnita.
// ==========================================================

const MISIUNI_DE_TEMNITA = [
  {
    id: 'tem_moorhollowdeep_1', zona: 'Thornmoor', dator: 'marshal', nivel: 20,
    titlu: 'They Slept Somewhere',
    text: 'A dozen of them working this moor and not one tent between them. I have walked every hedge on this road and there is no camp.<br><br>There is a hollow under the thorns that my grandfather called Moor Hollow and told me never to go into. It is open now, and the grass around the mouth is beaten flat by boots.<br><br>Go down. Find who is paying them, because somebody is, and bring me his name.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 1, numeSef: 'Corvin Ashe, Who Was Paid' },
    cereTemnita: 'moorhollowdeep',
    rasplata: { xp: 7732, bani: 2429, nivelObiect: 22, raritate: 'rar' }
  },
  {
    id: 'tem_moorhollowdeep_2', zona: 'Thornmoor', dator: 'marshal', nivel: 22, cere: 'tem_moorhollowdeep_1',
    titlu: 'A Name and a Hand',
    text: 'Corvin Ashe. Twelve years on this moor and I never knew he could write.<br><br>He could not, much. But he could take money, and he could tell men where to dig, and somebody told him.<br><br>There is always somebody further along. Go back down and finish the hollow - all of them, not just him - and then this road is mine again for a while.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 25 },
    cereTemnita: 'moorhollowdeep',
    rasplata: { xp: 10422, bani: 3297, nivelObiect: 22, raritate: 'rar' }
  },
  {
    id: 'tem_greyfendepths_1', zona: 'Greyfen', dator: 'marshal', nivel: 28,
    titlu: 'What the Fen Gave Back',
    text: 'The fen dropped four feet in one night and gave up rooms. Not caves - rooms, with corners, older than anybody\'s grandfather.<br><br>Two of my people went down to look and neither came back up, and the third came back up and will not speak.<br><br>There is a map being sold in this fen - who lives where, who keeps what, who is alone. Somebody down there is drawing it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 1, numeSef: 'Maren Coss, Who Sold the Map' },
    cereTemnita: 'greyfendepths',
    rasplata: { xp: 11656, bani: 3517, nivelObiect: 30, raritate: 'rar' }
  },
  {
    id: 'tem_greyfendepths_2', zona: 'Greyfen', dator: 'marshal', nivel: 30, cere: 'tem_greyfendepths_1',
    titlu: 'Burn the Map',
    text: 'Maren Coss is dead and the map is in my hands and I have read it, which I wish I had not.<br><br>Every house in this fen, and who sleeps in it, and whether anyone would come looking.<br><br>Go back and take the rest of them. I will not leave the fen to people who were drawing my neighbours.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 25 },
    cereTemnita: 'greyfendepths',
    rasplata: { xp: 15216, bani: 4637, nivelObiect: 30, raritate: 'rar' }
  },
  {
    id: 'tem_ironhillshafts_1', zona: 'Ironhill', dator: 'marshal', nivel: 36,
    titlu: 'The Third Level',
    text: 'This mine has three levels. The third was walled up before I was born, and the wall was built from the inside, which is the part nobody likes to say aloud.<br><br>The wall came down last month. Not fell - came down, tidily, and the stones were stacked.<br><br>Somebody bought the deed to this hill two years ago. I have never met him. Go down and see whether he is home.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 1, numeSef: 'Alder Grange, Who Bought the Deed' },
    cereTemnita: 'ironhillshafts',
    rasplata: { xp: 15839, bani: 4636, nivelObiect: 38, raritate: 'rar' }
  },
  {
    id: 'tem_ironhillshafts_2', zona: 'Ironhill', dator: 'marshal', nivel: 38, cere: 'tem_ironhillshafts_1',
    titlu: 'The Deed Is Void',
    text: 'Alder Grange held the deed to this hill, bought fair, stamped and sealed, from an office nobody in Ironhill has ever been to.<br><br>He never once came up. Four years in the third level, with a desk.<br><br>Clear the shafts. All of them. I will burn the deed at the head of the road where the whole village can watch it go.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 25 },
    cereTemnita: 'ironhillshafts',
    rasplata: { xp: 20302, bani: 6014, nivelObiect: 38, raritate: 'rar' }
  },
  {
    id: 'tem_gravehollow_1', zona: 'Gravehold', dator: 'marshal', nivel: 44,
    titlu: 'Under the Keep',
    text: 'There is a cellar under this keep that is older than the keep, and whoever built on top of it knew and said nothing.<br><br>I have the keep\'s book back to four hundred years. The cellar is not in it. Not once. That takes effort.<br><br>What is in it now is the warden we buried last spring, walking, and a great many names that were never buried at all.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 1, numeSef: 'Warden Hale, Who Sold the Dead' },
    cereTemnita: 'gravehollow',
    rasplata: { xp: 20232, bani: 5781, nivelObiect: 46, raritate: 'rar' }
  },
  {
    id: 'tem_gravehollow_2', zona: 'Gravehold', dator: 'marshal', nivel: 46, cere: 'tem_gravehollow_1',
    titlu: 'Close It Properly',
    text: 'Hale is down. So is whatever was on the shelves.<br><br>Now go back and finish it, and then we wall the stair again - and this time it goes in the book, in my hand, so the next warden four hundred years from now knows exactly what is under his floor.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 25 },
    cereTemnita: 'gravehollow',
    rasplata: { xp: 25632, bani: 7420, nivelObiect: 46, raritate: 'rar' }
  },
  {
    id: 'tem_glasswastepit_1', zona: 'The Glasswastes', dator: 'marshal', nivel: 44,
    titlu: 'The Green Floor',
    text: 'The sand here was melted once and turned to glass, and the pit goes down through it. The walls cut. Everybody knows not to go in.<br><br>Carts go in anyway, at night, and come out lighter.<br><br>There is a kiln down there that somebody is still firing. Find out what it is making, and stop it making any more of it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 1, numeSef: 'The Kiln Master' },
    cereTemnita: 'glasswastepit',
    rasplata: { xp: 20232, bani: 5781, nivelObiect: 46, raritate: 'rar' }
  },
  {
    id: 'tem_glasswastepit_2', zona: 'The Glasswastes', dator: 'marshal', nivel: 46, cere: 'tem_glasswastepit_1',
    titlu: 'Put the Kiln Out',
    text: 'Glass. They were making glass, in a pit made of glass, and shipping it east in carts at night.<br><br>I asked a carter once what it was for. He said windows. There is not a window within ninety miles of here.<br><br>Go back down and put the fire out, and take everyone still standing near it.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 25 },
    cereTemnita: 'glasswastepit',
    rasplata: { xp: 25632, bani: 7420, nivelObiect: 46, raritate: 'rar' }
  },
  {
    id: 'tem_hollowrootwarren_1', zona: 'Hollowroot', dator: 'marshal', nivel: 50,
    titlu: 'The Braided Hall',
    text: 'The roots here grow hollow and they grow into each other, and if you follow one far enough it stops being a root and starts being a corridor.<br><br>Something made rooms down there. Something else moved into them.<br><br>And last week a man came up out of the ground carrying a lit torch and asked me, politely, how many people live in this village.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 1, numeSef: 'Ossian Rook, Who Lit the Fires' },
    cereTemnita: 'hollowrootwarren',
    rasplata: { xp: 23647, bani: 6654, nivelObiect: 52, raritate: 'rar' }
  },
  {
    id: 'tem_hollowrootwarren_2', zona: 'Hollowroot', dator: 'marshal', nivel: 52, cere: 'tem_hollowrootwarren_1',
    titlu: 'Nobody Counts Us',
    text: 'Rook counted us. Forty-one, he wrote, and a number beside it that I take to be what we are worth.<br><br>Go back into the roots and clear them out - the nest, the rot, all of it. Then nobody is counting anybody in Hollowroot.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 25 },
    cereTemnita: 'hollowrootwarren',
    rasplata: { xp: 29767, bani: 8492, nivelObiect: 52, raritate: 'rar' }
  },
  {
    id: 'tem_coldspinevault_1', zona: 'Coldspine', dator: 'marshal', nivel: 56,
    titlu: 'The Strongroom',
    text: 'The hold has been empty a hundred years. The vault under it has not.<br><br>Every winter somebody comes up the pass, goes in, and comes out again in spring with a full cart. Always different men. Always the same cart.<br><br>There is a door down there that opens inward, which means it was never meant to keep anybody out. Go and see what it keeps in.',
    cerinta: { fel: 'ucide', mob: 'garda', cati: 1, numeSef: 'The Vaultkeeper' },
    cereTemnita: 'coldspinevault',
    rasplata: { xp: 27153, bani: 7538, nivelObiect: 58, raritate: 'rar' }
  },
  {
    id: 'tem_coldspinevault_2', zona: 'Coldspine', dator: 'marshal', nivel: 58, cere: 'tem_coldspinevault_1',
    titlu: 'What It Kept In',
    text: 'Ledgers. A strongroom under a dead hold, full of ledgers, and a door built to keep them from leaving.<br><br>Somebody has been storing four hundred years of paper in the coldest place on this continent, because paper keeps.<br><br>Go back and take the rest of the vault. I want that room empty.',
    cerinta: { fel: 'ucide', mob: 'garda', cati: 25 },
    cereTemnita: 'coldspinevault',
    rasplata: { xp: 34009, bani: 9576, nivelObiect: 58, raritate: 'rar' }
  },
  {
    id: 'tem_thornspirehold_1', zona: 'Thornspire', dator: 'marshal', nivel: 58,
    titlu: 'Bought, Not Taken',
    text: 'Thornspire Hold did not fall. Nobody besieged it, nobody breached it. One spring the flags changed and the same men stayed on the walls.<br><br>They are still being paid. Monthly. I have seen the carts.<br><br>Whoever signs those wages is one name away from whoever signs everything else in this world, and I would very much like that name.',
    cerinta: { fel: 'ucide', mob: 'factor', cati: 1, numeSef: 'Under-Factor Reyn' },
    cereTemnita: 'thornspirehold',
    rasplata: { xp: 28341, bani: 7835, nivelObiect: 60, raritate: 'rar' }
  },
  {
    id: 'tem_thornspirehold_2', zona: 'Thornspire', dator: 'marshal', nivel: 60, cere: 'tem_thornspirehold_1',
    titlu: 'Under-Factor',
    text: 'Under-Factor. That is what he called himself, on his own seal, in his own hand, in a hold he was paying for out of an account he did not own.<br><br>Under means there is an Over.<br><br>Finish the hold - the gate, the yard, the tower, all of them - and then, if you are the kind who follows a thing to the end, look east. The road goes to the water, and the water goes somewhere.',
    cerinta: { fel: 'ucide', mob: 'factor', cati: 25 },
    cereTemnita: 'thornspirehold',
    rasplata: { xp: 35445, bani: 9939, nivelObiect: 60, raritate: 'rar' }
  }
];


MISIUNI_DE_TEMNITA.forEach(function (m) { MISIUNI.push(m); });
