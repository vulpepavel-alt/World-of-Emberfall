// ==========================================================
//  TEMNITA: Moor Hollow Deep        (nivel 18-22)
//
//  Prima temnita din joc. Se intra prin gura de pestera care sta de
//  mult pe harta din Thornmoor si pana acum n-a dus nicaieri:
//  "Moor Hollow", locul cu id-ul 'vizuina'.
//
//  Harta NU se genereaza ca o padure. E construita din camere si
//  coridoare, scrise mai jos una cate una - vezi construiesteTemnita
//  din generator.js. Coridoarele se sapa singure, de la o camera la
//  urmatoarea, in ordinea din lista.
//
//  Povestea: talharii din Thornmoor nu dormeau sub cerul liber. Sub
//  maracini e o vizuina veche, cu camere sapate mai demult decat ei,
//  si cineva le-a spus unde sa sape ca sa dea de ele.
// ==========================================================

inregistreazaZona({

  id: 'moorhollowdeep',
  nume: 'Moor Hollow Deep',
  continent: 'eastmarch',
  esteTemnita: true,

  // De unde se intra: zona si locul de pe harta ei.
  intrareDin: { zona: 'thornmoor', loc: 'vizuina' },

  nivelDeLa: 18,
  nivelPanaLa: 22,

  COL: 300,
  RND: 220,
  samanta: 18022,

  litere: LITERE,
  climat: 'pestera',
  teren: climat('pestera'),

  // Fara rau si fara apa: suntem sub pamant.
  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  // Camerele, in ordinea in care se leaga. Prima e intrarea.
  camere: [
    { id: 'gura',    nume: 'The Thorn Mouth',  c: 0.10, r: 0.72, lat: 24, inalt: 18 },
    { id: 'culcus',  nume: 'The Sleeping Floor', c: 0.30, r: 0.50, lat: 34, inalt: 26,
      sef: { fel: 'bandit', nume: 'Wren Alder, Who Keeps the Watch', nivel: 19,
             lasa: [
               { nume: 'Watchkeeper\'s Hood', slot: 'cap', felArmura: 'piele', raritate: 'bun' },
               { nume: 'The Long Whistle', slot: 'gat', raritate: 'bun' }
             ] } },
    { id: 'groapa',  nume: 'The Old Digging',  c: 0.50, r: 0.74, lat: 30, inalt: 24,
      sef: { fel: 'burrower', nume: 'The Thing They Dug Into', nivel: 20,
             lasa: [
               { nume: 'Root-Torn Bracers', slot: 'incheieturi', felArmura: 'zale', raritate: 'bun' },
               { nume: 'Digger\'s Broken Tooth', slot: 'talisman', raritate: 'bun' }
             ] } },
    { id: 'camara',  nume: 'The Stores',       c: 0.70, r: 0.44, lat: 32, inalt: 24,
      sef: { fel: 'spider', nume: 'Longleg', nivel: 21,
             lasa: [
               { nume: 'Longleg\'s Wrap', slot: 'piept', felArmura: 'panza', raritate: 'bun' },
               { nume: 'Eight Small Eyes', slot: 'inel1', raritate: 'rar' }
             ] } },
    { id: 'masa',    nume: 'The Long Table',   c: 0.88, r: 0.68, lat: 40, inalt: 30,
      sef: { fel: 'raider', nume: 'Corvin Ashe, Who Was Paid', nivel: 22, rang: 'elit',
             comportament: { fel: 'lovituraSol', pregatire: 1800, pauza: 8000, raza: 88, putere: 2.2, text: 'HOLLOW_BOSS_STRIKE' },
             lasa: [
               { nume: 'The Hand That Was Paid', slot: 'armaPrincipala', raritate: 'rar' },
               { nume: 'Corvin\'s Ledger Key', slot: 'talisman', raritate: 'rar' },
               { nume: 'Ashe-Marked Greaves', slot: 'picioare', felArmura: 'piele', raritate: 'rar' }
             ] } }
  ],

  // Cati inamici marunti pe coridoare si prin camere.
  trash: 70,

  // Cum se cheama inamicii marunti AICI. Un bandit din temnita nu e
  // acelasi lucru cu unul de pe camp, si trebuie sa se vada.
  numeTrash: {
    bandit:      'Hollow Cutthroat',
    spider:      'Deepweb Spinner',
    burrower:    'Root-Gnawer'
  },

  // Purtarile proprii ale creaturilor; sefii sunt completati in intalniri-instante.js.
  comportamenteTrash: {
    bandit: { fel: 'aruncator', pregatire: 900, pauza: 2800, raza: 180, putere: 1, text: 'HOLLOW_THROW' },
    spider: { fel: 'vindecator', pregatire: 1400, pauza: 6500, raza: 220, parteVindecata: 0.18, text: 'HOLLOW_MEND' },
    burrower: { fel: 'lovituraSol', pregatire: 1400, pauza: 6000, raza: 56, putere: 1.6, text: 'HOLLOW_BURST' }
  },

  feluriPeNivel: function () {
    return ['bandit', 'spider', 'burrower'];
  }
});
