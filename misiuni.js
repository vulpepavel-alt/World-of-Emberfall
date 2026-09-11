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

  // ---------- GREENVALE (Alliance) ----------
  {
    id: 'gv1', zona: 'Greenvale', dator: 'marshal', nivel: 1,
    titlu: 'Rats in the Cellar',
    text: 'The storehouse is overrun. I cannot spare a single guard, ' +
          'but I can spare a few coins. Thin them out for me.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 },
    rasplata: { xp: 140, bani: 90 }
  },
  {
    id: 'gv2', zona: 'Greenvale', dator: 'marshal', nivel: 2, cere: 'gv1',
    titlu: 'Trampled Fields',
    text: 'Boars have been rooting through the barley east of the village. ' +
          'Drive them off before there is nothing left to harvest.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 10 },
    rasplata: { xp: 260, bani: 160, nivelObiect: 3, raritate: 'comun' }
  },
  {
    id: 'gv3', zona: 'Greenvale', dator: 'marshal', nivel: 3, cere: 'gv2',
    titlu: 'Tusks for the Tanner',
    text: 'Since you are already out among the boars: the tanner pays well ' +
          'for good tusks, and the village pays the tanner. Bring me six.',
    cerinta: { fel: 'aduna', mob: 'boar', cati: 6, obiect: 'Boar Tusk' },
    rasplata: { xp: 380, bani: 240, nivelObiect: 4, raritate: 'bun' }
  },
  {
    id: 'gv4', zona: 'Greenvale', dator: 'marshal', nivel: 4, cere: 'gv3',
    titlu: 'The Wolf Den',
    text: 'There is a den in the rocks north-west of here. The pack has grown ' +
          'bold enough to come down to the road. Make them afraid of it again.',
    cerinta: { fel: 'ucide', mob: 'wolf', cati: 10 },
    rasplata: { xp: 520, bani: 330, nivelObiect: 5, raritate: 'comun' }
  },
  {
    id: 'gv5', zona: 'Greenvale', dator: 'marshal', nivel: 5, cere: 'gv4',
    titlu: 'Something in the Thicket',
    text: 'Two woodcutters went into the deep wood. Only one walked out, and ' +
          'he will not speak of what he saw. Burn out the webs.',
    cerinta: { fel: 'ucide', mob: 'spider', cati: 12 },
    rasplata: { xp: 700, bani: 450, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'gv6', zona: 'Greenvale', dator: 'marshal', nivel: 6, cere: 'gv5',
    titlu: 'Bandits on the Road',
    text: 'No merchant has reached us in a fortnight. They camp east of the ' +
          'river and they are getting fat on our grain. Break the camp.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 12 },
    rasplata: { xp: 900, bani: 600, nivelObiect: 7, raritate: 'bun' }
  },
  {
    id: 'gv7', zona: 'Greenvale', dator: 'marshal', nivel: 7, cere: 'gv6',
    titlu: 'Marked Purses',
    text: 'Their purses carry a stamped seal. I want six of those seals on my ' +
          'desk - then I will know who is paying them.',
    cerinta: { fel: 'aduna', mob: 'bandit', cati: 6, obiect: 'Stamped Seal' },
    rasplata: { xp: 1150, bani: 780, nivelObiect: 8, raritate: 'rar' }
  },
  {
    id: 'gv8', zona: 'Greenvale', dator: 'marshal', nivel: 8, cere: 'gv7',
    titlu: 'What Digs Below',
    text: 'The old mine in the south-east was abandoned for a reason. Whatever ' +
          'is down there has started digging upward. End it.',
    cerinta: { fel: 'ucide', mob: 'burrower', cati: 12 },
    rasplata: { xp: 1450, bani: 980, nivelObiect: 9, raritate: 'bun' }
  },
  {
    id: 'gv9', zona: 'Greenvale', dator: 'marshal', nivel: 9, cere: 'gv8',
    titlu: 'Proof of the Deep',
    text: 'Bring me eight of their claws. I mean to send them to the capital, ' +
          'and a written report will not be believed.',
    cerinta: { fel: 'aduna', mob: 'burrower', cati: 8, obiect: 'Chitin Claw' },
    rasplata: { xp: 1800, bani: 1200, nivelObiect: 10, raritate: 'rar' }
  },
  {
    id: 'gv10', zona: 'Greenvale', dator: 'marshal', nivel: 10, cere: 'gv9',
    titlu: 'Hold the Valley',
    text: 'They have come back in force, and this time they have made camp on ' +
          'the hill under the keep. Finish what you started.',
    cerinta: { fel: 'ucide', mob: 'bandit', cati: 15 },
    rasplata: { xp: 2400, bani: 1800, nivelObiect: 11, raritate: 'maiestru' }
  },


  // ---------- REDWASTE (Horde) ----------
  {
    id: 'rw1', zona: 'Redwaste', dator: 'chief', nivel: 1,
    titlu: 'Vermin in the Stores',
    text: 'Rats in the grain sacks. A warrior does not hunt rats - but you are ' +
          'not a warrior yet. Prove me wrong later. Kill them now.',
    cerinta: { fel: 'ucide', mob: 'rat', cati: 8 },
    rasplata: { xp: 140, bani: 90 }
  },
  {
    id: 'rw2', zona: 'Redwaste', dator: 'chief', nivel: 2, cere: 'rw1',
    titlu: 'Thick Hides',
    text: 'The boars out past the wash are fat and slow. We need hide, and ' +
          'you need practice. Both problems, one answer.',
    cerinta: { fel: 'ucide', mob: 'boar', cati: 10 },
    rasplata: { xp: 260, bani: 160, nivelObiect: 3, raritate: 'comun' }
  },
  {
    id: 'rw3', zona: 'Redwaste', dator: 'chief', nivel: 3, cere: 'rw2',
    titlu: 'Feathers for the Fletcher',
    text: 'Vultures circle wherever something dies here, so they are never far. ' +
          'Six good feathers will make six good arrows.',
    cerinta: { fel: 'aduna', mob: 'vulture', cati: 6, obiect: 'Stiff Feather' },
    rasplata: { xp: 380, bani: 240, nivelObiect: 4, raritate: 'bun' }
  },
  {
    id: 'rw4', zona: 'Redwaste', dator: 'chief', nivel: 4, cere: 'rw3',
    titlu: 'Circling Overhead',
    text: 'They have started circling the camp itself. That means they expect ' +
          'us to die. Teach them patience.',
    cerinta: { fel: 'ucide', mob: 'vulture', cati: 10 },
    rasplata: { xp: 520, bani: 330, nivelObiect: 5, raritate: 'comun' }
  },
  {
    id: 'rw5', zona: 'Redwaste', dator: 'chief', nivel: 5, cere: 'rw4',
    titlu: 'Serpents in the Wash',
    text: 'The dry riverbed is the only easy road south, and it is full of ' +
          'serpents. Clear it, and the road is ours again.',
    cerinta: { fel: 'ucide', mob: 'serpent', cati: 12 },
    rasplata: { xp: 700, bani: 450, nivelObiect: 6, raritate: 'bun' }
  },
  {
    id: 'rw6', zona: 'Redwaste', dator: 'chief', nivel: 6, cere: 'rw5',
    titlu: 'Stingers',
    text: 'Scorpid venom keeps a wound from closing. Ours, or theirs - it does ' +
          'not care. Bring me eight stingers and we will use them first.',
    cerinta: { fel: 'aduna', mob: 'scorpid', cati: 8, obiect: 'Curved Stinger' },
    rasplata: { xp: 900, bani: 600, nivelObiect: 7, raritate: 'bun' }
  },
  {
    id: 'rw7', zona: 'Redwaste', dator: 'chief', nivel: 7, cere: 'rw6',
    titlu: 'The Raider Camp',
    text: 'They took our water barrels and left a man dead for them. Go east. ' +
          'Take the barrels back. Leave nothing standing.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 12 },
    rasplata: { xp: 1150, bani: 780, nivelObiect: 8, raritate: 'rar' }
  },
  {
    id: 'rw8', zona: 'Redwaste', dator: 'chief', nivel: 8, cere: 'rw7',
    titlu: 'Torn Banners',
    text: 'Every one of them wears a strip of red. Bring me six, and I will ' +
          'hang them where the next warband can see.',
    cerinta: { fel: 'aduna', mob: 'raider', cati: 6, obiect: 'Red Strip' },
    rasplata: { xp: 1450, bani: 980, nivelObiect: 9, raritate: 'bun' }
  },
  {
    id: 'rw9', zona: 'Redwaste', dator: 'chief', nivel: 9, cere: 'rw8',
    titlu: 'The Nest',
    text: 'There is a crack in the rock north of here that the scorpids come ' +
          'out of. Go in. Come out. That is the whole of it.',
    cerinta: { fel: 'ucide', mob: 'scorpid', cati: 12 },
    rasplata: { xp: 1800, bani: 1200, nivelObiect: 10, raritate: 'rar' }
  },
  {
    id: 'rw10', zona: 'Redwaste', dator: 'chief', nivel: 10, cere: 'rw9',
    titlu: 'Break the Warband',
    text: 'What is left of them has gathered in the south. You have earned the ' +
          'right to finish this yourself. Go.',
    cerinta: { fel: 'ucide', mob: 'raider', cati: 15 },
    rasplata: { xp: 2400, bani: 1800, nivelObiect: 11, raritate: 'maiestru' }
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
  if (misiune.cere && starea(personajul, misiune.cere) !== 'predata') return false;
  return true;
}


// Toate misiunile pe care le da un anumit personaj, in ordine.
function misiunileLui(personajul, numeleZonei, felulNpc) {
  return MISIUNI.filter(function (m) {
    return m.zona === numeleZonei && m.dator === felulNpc;
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
function amUcis(personajul, felulMobului) {

  const avansate = [];

  misiuniActive(personajul).forEach(function (m) {
    if (m.cerinta.fel !== 'ucide') return;
    if (m.cerinta.mob !== felulMobului) return;
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

  return { xp: misiune.rasplata.xp, bani: misiune.rasplata.bani, obiect: obiect };
}
