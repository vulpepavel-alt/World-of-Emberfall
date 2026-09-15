// ==========================================================
//  RAID: The Long Account        (nivel 60)
//
//  Singurul raid din joc, si ultimul loc construit.
//
//  Unde se leaga de poveste: The Factor cumpara locuri si trimitea
//  pe apa ce ramanea din ele. Nimeni n-a intrebat vreodata UNDE
//  pleaca vapoarele. In registrele din casa de socoteli scrie: la
//  Contul cel Lung - biroul care il platea pe el, si care il platea
//  si pe cel dinaintea lui, si tot asa mai departe decat tine
//  cartea.
//
//  Se ajunge de pe cheiul de apa adanca din The Quiet Coast. Nu se
//  poate merge acolo pe jos: e dincolo de apa.
//
//  CUM E DIFERIT DE O TEMNITA
//    - opt sefi in loc de patru
//    - vin cu tine CINCI tovarasi, nu trei (un scutier, doi
//      vindecatori, doi tragatori)
//    - prada cea mai buna din joc
//
//  Se reface cand iesi, la fel ca temnitele. In Classic un raid se
//  reface o data pe saptamana, ca sa nu-l poata face lumea de zece
//  ori pe zi - dar aici joci singura si n-are pe cine sa deranjeze.
//  Un ceas de asteptare n-ar face jocul mai bun, doar mai incet.
// ==========================================================

inregistreazaZona({

  id: 'longaccount',
  nume: 'The Long Account',
  continent: 'karador',
  esteTemnita: true,
  esteRaid: true,

  intrareDin: { zona: 'quietcoast', loc: 'chei' },

  nivelDeLa: 60,
  nivelPanaLa: 60,

  COL: 460,
  RND: 300,
  samanta: 60999,

  litere: LITERE,
  climat: 'pestera',

  // Nu e o pestera: e o cladire. Piatra taiata, podele de lemn,
  // lampi. Pornim de la pestera si o facem sa arate a birou vechi.
  teren: climat('pestera', {
    fond: 0x3a342c, fondVariatie: 0x423b32, texturaFond: 'piatra',
    drum: 0x5e5344, drumVariatie: 0x6b5f4e, texturaDrum: 'lemn',
    piatra: 0x6e6355, zid: 0x1d1913,
    des: 0x241f19, marunt: 0x2e2820, stanca: 0x6e6355
  }),

  apaLa: -1, apaUnduire: 0, apaLatime: 0,

  // Noua camere. Prima e debarcaderul, ultima e biroul.
  camere: [
    { id: 'debarcader', nume: 'The Landing', c: 0.07, r: 0.50, lat: 28, inalt: 22 },

    { id: 'cantar', nume: 'The Weighing Floor', c: 0.20, r: 0.26, lat: 34, inalt: 26,
      sef: { fel: 'garda', nume: 'The Weighmaster', nivel: 60,
             lasa: [
               { nume: 'Weighmaster\'s Chain', slot: 'gat', raritate: 'rar' },
               { nume: 'The Even Scale', slot: 'talisman', raritate: 'rar' }
             ] } },

    { id: 'depozit', nume: 'The Bonded Store', c: 0.33, r: 0.72, lat: 36, inalt: 28,
      sef: { fel: 'raider', nume: 'Hask, Who Counts the Crates', nivel: 60,
             lasa: [
               { nume: 'Bonded Store Gauntlets', slot: 'maini', felArmura: 'zale', raritate: 'rar' },
               { nume: 'Crate-Hook', slot: 'armaPrincipala', raritate: 'rar' }
             ] } },

    { id: 'copisti', nume: 'The Copying Room', c: 0.44, r: 0.30, lat: 34, inalt: 26,
      sef: { fel: 'bandit', nume: 'The First Copyist', nivel: 60,
             lasa: [
               { nume: 'Copyist\'s Sleeves', slot: 'incheieturi', felArmura: 'panza', raritate: 'rar' },
               { nume: 'A Hand That Never Tires', slot: 'inel1', raritate: 'maiestru' }
             ] } },

    { id: 'seif', nume: 'The Standing Vault', c: 0.56, r: 0.70, lat: 32, inalt: 26,
      sef: { fel: 'garda', nume: 'The Vault Serjeant', nivel: 60,
             lasa: [
               { nume: 'Vault Serjeant\'s Plate', slot: 'piept', felArmura: 'placi', raritate: 'maiestru' },
               { nume: 'The Key That Opens Inward', slot: 'talisman', raritate: 'maiestru' }
             ] } },

    { id: 'arhiva', nume: 'The Old Shelves', c: 0.66, r: 0.28, lat: 36, inalt: 28,
      sef: { fel: 'spider', nume: 'What Lives in the Old Shelves', nivel: 60,
             lasa: [
               { nume: 'Shelfdweller\'s Wrap', slot: 'piept', felArmura: 'panza', raritate: 'maiestru' },
               { nume: 'Eight Hundred Small Legs', slot: 'talpi', felArmura: 'piele', raritate: 'rar' }
             ] } },

    { id: 'consiliu', nume: 'The Standing Table', c: 0.77, r: 0.66, lat: 38, inalt: 30,
      sef: { fel: 'factor', nume: 'Factor Enna Vaile', nivel: 60,
             lasa: [
               { nume: 'Vaile\'s Standing Order', slot: 'spate', raritate: 'maiestru' },
               { nume: 'The Second Signature', slot: 'inel1', raritate: 'maiestru' }
             ] } },

    { id: 'presa', nume: 'The Press Room', c: 0.86, r: 0.30, lat: 34, inalt: 26,
      sef: { fel: 'garda', nume: 'The Press Warden', nivel: 60,
             lasa: [
               { nume: 'Press Warden\'s Legplates', slot: 'picioare', felArmura: 'placi', raritate: 'maiestru' },
               { nume: 'The Setting Hammer', slot: 'armaPrincipala', raritate: 'maiestru' }
             ] } },

    { id: 'birou', nume: 'The Long Account', c: 0.93, r: 0.62, lat: 44, inalt: 34,
      sef: { fel: 'factor', nume: 'The Keeper of the Long Account', nivel: 60, rang: 'sef',
             lasa: [
               { nume: 'The Last Page', slot: 'talisman', raritate: 'maiestru' },
               { nume: 'Keeper\'s Robe of Quiet Sums', slot: 'piept', felArmura: 'panza', raritate: 'maiestru' },
               { nume: 'The Pen That Emptied Valleys', slot: 'armaPrincipala', raritate: 'maiestru' },
               { nume: 'Ledgerbound Sabatons', slot: 'talpi', felArmura: 'placi', raritate: 'maiestru' }
             ] } }
  ],

  // Mai multi decat intr-o temnita: e o cladire plina de oameni.
  trash: 140,

  // Cum se cheama inamicii marunti AICI. Un bandit din temnita nu e
  // acelasi lucru cu unul de pe camp, si trebuie sa se vada.
  numeTrash: {
    garda:       'Ledger Guard',
    raider:      'Debt-Collector',
    bandit:      'Quiet Clerk'
  },

  feluriPeNivel: function () {
    return ['garda', 'raider', 'bandit'];
  }
});
