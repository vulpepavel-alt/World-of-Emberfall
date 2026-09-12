// ==========================================================
//  LANTUL DE LA CAPAT
//
//  Sase misiuni care inchid povestea jocului.
//
//  Firul a fost pornit de mult, fara sa fie legat:
//
//    In Greenvale, marsalul spunea ca cineva CU BANI a platit ca
//    mina veche sa fie deschisa si valea golita, si ca ce a venit
//    apoi n-a fost o navala, ci "o revendicare".
//
//    In Sundercrag, un om vindea o lista de o suta treizeci de nume,
//    iar raiderii "o duceau la coasta, opt pagini deodata".
//
//  Nimeni n-a mers vreodata pana la capatul drumului aluia. Aici se
//  merge. La capat nu e un dragon si nu e un vrajitor: e un om cu o
//  carte de socoteli, care a cumparat tot ce s-a intamplat in joc.
//
//  Se pornesc de la marsalul din Sundercrag, la nivelul 58, si se
//  termina in The Quiet Coast.
// ==========================================================

const MISIUNI_DE_FINAL = [

  // ---------- Sundercrag: de unde vine hartia ----------
  {
    id: 'fin_1', zona: 'Sundercrag', dator: 'marshal', nivel: 58,
    titlu: 'The Other Half of the Page',
    text: 'We burned them in the street, like I said we would, and the town ' +
          'watched and then went back to not knowing each other.<br><br>' +
          'I kept one. I am not proud of it.<br><br>' +
          'There is a mark on the back of every sheet. Same mark, four years ' +
          'of it. Not his - he was a clerk, and clerks do not put their own ' +
          'mark on a thing they are selling.<br><br>' +
          'That is a buyer\'s mark. Somebody was paying him by the page, and ' +
          'that somebody is still out there with four years of names.<br><br>' +
          'The raiders on the upper crag carried the runs. Bring me what they ' +
          'carry now.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 10, obiect: 'Sealed Runsheet' },
    rasplata: { xp: 14200, bani: 6400 }
  },
  {
    id: 'fin_2', zona: 'Sundercrag', dator: 'marshal', nivel: 58, cere: 'fin_1',
    titlu: 'Eight Pages at a Time',
    text: 'Same mark. Ten more sheets, same mark, and these are dated this ' +
          'month.<br><br>' +
          'So it did not stop when he did. He was one clerk on one street in ' +
          'one town nobody can find. If they are still buying with him dead, ' +
          'then he was never the point.<br><br>' +
          'There is a road east out of the split. I have been told my whole ' +
          'life it goes nowhere - that there is only the sea on the wrong ' +
          'side of the world past here.<br><br>' +
          'Somebody has been driving carts down it for four years.<br><br>' +
          'Thin out whatever is sitting on that road. I want it walkable.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 20 },
    rasplata: { xp: 16800, bani: 7600, nivelObiect: 58, raritate: 'rar' }
  },
  {
    id: 'fin_3', zona: 'Sundercrag', dator: 'marshal', nivel: 59, cere: 'fin_2',
    titlu: 'The Road Was Always There',
    text: 'The road is open, and it is not a goat track. It is graded, it is ' +
          'wide enough for two carts abreast, and somebody keeps it.<br><br>' +
          'You do not grade a road for four years to move paper.<br><br>' +
          'I am not coming. I am the law in a town of a hundred and thirty ' +
          'people who are on a list, and if I leave, they are alone.<br><br>' +
          'Follow it east. Whatever is at the end of it has been there longer ' +
          'than any of us, and has been writing us down the whole time.<br><br>' +
          'Walk to the gate at the end of the road, and look at what you find.',
    // Cheia locului are zona in fata, ca peste tot: "mina" din
    // Ironhill nu e aceeasi cu "mina" din Mistwood. Aici misiunea e
    // data intr-o zona si se termina in ALTA, si tocmai asta e ideea.
    cerinta: { fel: 'mergi', loc: 'quietcoast:poarta',
               numeLoc: 'The Landward Gate', cati: 1 },
    rasplata: { xp: 9800, bani: 4200 }
  },

  // ---------- The Quiet Coast ----------
  {
    id: 'fin_4', zona: 'The Quiet Coast', dator: 'marshal', nivel: 60, cere: 'fin_3',
    titlu: 'Nobody Told Us It Was Here',
    text: 'You came down the road. Nobody comes down the road.<br><br>' +
          'This is a port. A working one, with a graded approach, deep water ' +
          'and sheds you could hide a village in. It is not on any map I have ' +
          'ever seen, and I have seen the ones they sell in Karrak Hold.<br><br>' +
          'I have been posted here eleven weeks. I was told it was a customs ' +
          'gate. I have not seen a customs officer once.<br><br>' +
          'What I have seen is carts in, and ships out, and men at the sheds ' +
          'who do not answer when you speak to them.<br><br>' +
          'Go and look in the sheds. I will keep the gate, and I will not ' +
          'write down that you were here.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 18 },
    rasplata: { xp: 18400, bani: 8200, nivelObiect: 60, raritate: 'rar' }
  },
  {
    id: 'fin_5', zona: 'The Quiet Coast', dator: 'marshal', nivel: 60, cere: 'fin_4',
    titlu: 'The Waiting Camp',
    text: 'Ledgers. Sheds full of ledgers, and under them, in crates, ' +
          'everything a village owns when a village stops existing: tools, ' +
          'seed, a church bell, somebody\'s loom.<br><br>' +
          'And up the slope there is a camp of people who are waiting to be ' +
          'put on a ship, and not one of them will tell me their name.<br><br>' +
          'Now I understand what I have been guarding.<br><br>' +
          'Greenvale, eleven years ago. The mine that was opened by somebody ' +
          'with money. Every valley that emptied out and got a new name.<br><br>' +
          'It was not raids. It was purchases. Somebody has been buying ' +
          'places, one page at a time, and shipping what is left.<br><br>' +
          'The guards on the quay are theirs. Take the quay.',
    cerinta: { fel: 'ucide', mob: 'garda', cati: 12 },
    rasplata: { xp: 21600, bani: 9800 }
  },
  {
    id: 'fin_6', zona: 'The Quiet Coast', dator: 'marshal', nivel: 60, cere: 'fin_5',
    titlu: 'The Counting House',
    text: 'The quay is quiet. The ship that was loading has cut its lines and ' +
          'gone, half full, which tells you what they think is worth saving.<br><br>' +
          'There is one building left, at the top of the shingle, with a lamp ' +
          'in the window and a clear view of the whole coast.<br><br>' +
          'He has not run. In eleven weeks I have never seen him hurry, and ' +
          'he is not hurrying now.<br><br>' +
          'He is not a warlord. He has no army left and he never had a sword. ' +
          'He is a man with a book, who has been buying this world in small ' +
          'pieces for longer than anyone has been counting - and who has ' +
          'written down every name he ever paid for.<br><br>' +
          'Go up. End it.',
    cerinta: { fel: 'ucide', mob: 'factor', cati: 1 },
    esteFinalul: true,
    rasplata: { xp: 40000, bani: 30000, nivelObiect: 60, raritate: 'maiestru' }
  }
];


MISIUNI_DE_FINAL.forEach(function (m) { MISIUNI.push(m); });
