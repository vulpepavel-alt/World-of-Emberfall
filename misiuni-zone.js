// ==========================================================
//  MISIUNILE DIN CELELALTE ZONE
//
//  Cele 36 de misiuni din Greenvale si Redwaste sunt scrise de
//  mana, una cate una, cu poveste legata cap la cap.
//
//  Pentru celelalte 38 de zone asa ceva ar fi insemnat inca vreo
//  o suta cincizeci de povesti scrise pe rand. Aici misiunile se
//  fac dupa TIPARE: un inceput, un miez si un sfarsit, in care se
//  aseaza numele zonei, felul inamicului si cati ai de omorat.
//
//  Sunt mai putin bune decat cele scrise de mana - se simte ca
//  sunt turnate in acelasi calup. Dar iti dau un motiv sa intri
//  intr-o zona si o tinta cand ajungi acolo, in loc de nimic.
// ==========================================================


// Cate misiuni primeste fiecare zona care n-are scrise de mana.
const MISIUNI_PE_ZONA = 4;


// Tiparele. {zona} {mob} {cati} {loc} se inlocuiesc.
const TIPARE_UCIDE = [
  {
    titlu: 'Thin the {mob} Packs',
    text: 'You will not have been here long enough to know how {zona} used to ' +
          'look. Quieter. Emptier. Safer.<br><br>' +
          'The {mob} have come in from the edges since spring, and they have ' +
          'come in numbers nobody here can remember seeing. We have lost two ' +
          'carts and a boy on the road already.<br><br>' +
          'I cannot pay you the way a city would. But I can pay you, and I can ' +
          'tell you honestly that {cati} of them dead makes a difference to ' +
          'people who live here.<br><br>' +
          'Take the road out. You will not have to look far.'
  },
  {
    titlu: 'The Road Is Closed',
    text: 'Nothing has come up the road into {zona} in eleven days. Not a cart, ' +
          'not a letter, not a traveller.<br><br>' +
          'I sent a man out on the ninth day. He came back on foot, without his ' +
          'horse and without most of his sense, and what he could say was one ' +
          'word: {mob}.<br><br>' +
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
          'direction is here.<br><br>' +
          'I do not know what that means yet. I know what it will mean if we ' +
          'wait to find out.<br><br>' +
          '{cati}. Now, while they are still spread out.'
  },
  {
    titlu: 'A Debt of Blood',
    text: 'There were four of us at the {loc} when I was young. Now there is me.<br><br>' +
          'The {mob} took the last one in the autumn. Not in a fight - he was ' +
          'asleep, and he was eighty-one, and they came in through a wall that ' +
          'needed mending and that I had said I would mend.<br><br>' +
          'I am not going to pretend this is about keeping {zona} safe. It is ' +
          'about me, and a wall I did not mend.<br><br>' +
          '{cati} of them. I will pay whatever I have.'
  }
];

const TIPARE_ADUNA = [
  {
    titlu: 'Proof for the Ledger',
    obiect: '{mob} Token',
    text: 'Everything that happens in {zona} goes in the book. Every raid, ' +
          'every loss, every head of livestock. That is the job, and it has ' +
          'been the job since before my grandmother.<br><br>' +
          'The trouble with a book is that it only convinces people who already ' +
          'believe you. I have written to the capital four times about the ' +
          '{mob} and had four polite letters back.<br><br>' +
          'So bring me {cati} pieces off them. Not for the book. For the sack ' +
          'I intend to empty onto a table in front of somebody important.<br><br>' +
          'They will believe a sack.'
  },
  {
    titlu: 'The Old Trade',
    obiect: '{mob} Token',
    text: 'Before all this, {zona} lived on trade. Not much of it, and not rich, ' +
          'but steady - and steady is worth more than rich when you have ' +
          'children.<br><br>' +
          'There is still one thing here worth money outside: what comes off the ' +
          '{mob}. Nobody wants to go and get it, which is exactly why it is ' +
          'still worth money.<br><br>' +
          'Bring me {cati}. I will get them to the {loc} and from there down the ' +
          'road, and the {loc} will eat this winter.<br><br>' +
          'It is not glory. It is bread.'
  }
];


// Din ce fel de inamic se face fiecare misiune, dupa nivelul ei.
function feluriPentruMisiune(reteta, nivel) {
  return reteta.feluriPeNivel(Math.max(reteta.nivelDeLa, Math.min(reteta.nivelPanaLa, nivel)));
}


// Numele unui fel de inamic, asa cum se vede in joc.
function numeleFelului(fel) {
  return (typeof MOBI !== 'undefined' && MOBI[fel]) ? MOBI[fel].nume : fel;
}


function umple(sablon, valori) {
  return sablon
    .replace(/\{zona\}/g, valori.zona)
    .replace(/\{mob\}/g, valori.mob)
    .replace(/\{cati\}/g, valori.cati)
    .replace(/\{loc\}/g, valori.loc);
}


// Face cele patru misiuni ale unei zone.
function faMisiunileZonei(reteta) {

  // Zonele cu misiuni scrise de mana nu primesc si de-astea.
  if (MISIUNI.some(function (m) { return m.zona === reteta.nume; })) return [];

  // Cine le da: cel mai important personaj din zona.
  const dator = (reteta.npci && reteta.npci.length) ? reteta.npci[0].fel : null;
  if (!dator) return [];

  const facute = [];
  const deLa = reteta.nivelDeLa, panaLa = reteta.nivelPanaLa;
  const locNume = (reteta.locuri && reteta.locuri.length) ? 'camp' : 'camp';

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

    // Ultima din lant e de adunat; restul, de omorat.
    const eDeAdunat = (i === MISIUNI_PE_ZONA - 1);
    const tipar = eDeAdunat
      ? TIPARE_ADUNA[(reteta.samanta + i) % TIPARE_ADUNA.length]
      : TIPARE_UCIDE[(reteta.samanta + i) % TIPARE_UCIDE.length];

    const cati = eDeAdunat ? (6 + i) : (8 + i * 2);
    const valori = { zona: reteta.nume, mob: numeMob, cati: cati, loc: locNume };

    // Cam trei sferturi dintr-un nivel. Cu patru misiuni pe zona,
    // plus ce omori pe drum, o zona te duce cam trei niveluri mai sus.
    const rasplata = {
      xp: Math.round(140 * Math.pow(nivel, 1.22) * 0.75),
      bani: Math.round(60 * Math.pow(nivel, 1.1))
    };
    if (i > 0) {
      rasplata.nivelObiect = Math.min(60, nivel + 1);
      rasplata.raritate = (i === MISIUNI_PE_ZONA - 1) ? 'rar' : 'bun';
    }

    facute.push({
      id: reteta.id + '-q' + (i + 1),
      zona: reteta.nume,
      dator: dator,
      nivel: nivel,
      cere: (i > 0) ? (reteta.id + '-q' + i) : undefined,
      titlu: umple(tipar.titlu, valori),
      text: umple(tipar.text, valori),
      cerinta: eDeAdunat
        ? { fel: 'aduna', mob: fel, cati: cati, obiect: umple(tipar.obiect, valori) }
        : { fel: 'ucide', mob: fel, cati: cati },
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
