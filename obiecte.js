// ==========================================================
//  OBIECTELE SI ECHIPAMENTUL
//
//  Sloturile sunt cele obisnuite intr-un RPG: cap, gat, umeri
//  si asa mai departe. Obiectele NU sunt scrise unul cate unul -
//  se fac dupa reteta, din trei bucati:
//
//     [ adjectiv ]  [ numele piesei ]  [ of ... ]
//       Sturdy           Helm           of Stone
//
//  Adjectivul vine din raritate, piesa din slot, iar coada
//  "of ..." spune ce statistica da mai mult. Asa ies mii de
//  obiecte diferite fara sa scriem fiecare de mana.
// ==========================================================


// Sloturile, in ordinea in care apar in meniu.
// coloana: 'stanga', 'dreapta' sau 'jos'
const SLOTURI = [
  { id: 'cap',          nume: 'Head',      coloana: 'stanga' },
  { id: 'gat',          nume: 'Neck',      coloana: 'stanga' },
  { id: 'umeri',        nume: 'Shoulders', coloana: 'stanga' },
  { id: 'spate',        nume: 'Back',      coloana: 'stanga' },
  { id: 'piept',        nume: 'Chest',     coloana: 'stanga' },
  { id: 'incheieturi',  nume: 'Wrists',    coloana: 'stanga' },

  { id: 'maini',        nume: 'Hands',     coloana: 'dreapta' },
  { id: 'brau',         nume: 'Waist',     coloana: 'dreapta' },
  { id: 'picioare',     nume: 'Legs',      coloana: 'dreapta' },
  { id: 'talpi',        nume: 'Feet',      coloana: 'dreapta' },
  { id: 'inel1',        nume: 'Ring 1',    coloana: 'dreapta', fel: 'inel' },
  { id: 'inel2',        nume: 'Ring 2',    coloana: 'dreapta', fel: 'inel' },

  { id: 'talisman',     nume: 'Trinket',   coloana: 'jos', fel: 'talisman' },
  { id: 'armaPrincipala', nume: 'Main Hand', coloana: 'jos', fel: 'arma' },
  { id: 'armaSecundara',  nume: 'Off Hand',  coloana: 'jos', fel: 'scut' }
];

function gasesteSlot(id) {
  return SLOTURI.find(function (s) { return s.id === id; }) || null;
}


// Raritatile, de la cea mai simpla la cea mai buna.
// putere = de cate ori mai bune sunt statisticile
const RARITATI = [
  { id: 'comun',    nume: 'Common',    culoare: '#c8c2b4', putere: 1.0, sansa: 50, adjective: ['Worn', 'Plain', 'Rough'] },
  { id: 'bun',      nume: 'Uncommon',  culoare: '#5fbf5f', putere: 1.5, sansa: 32, adjective: ['Sturdy', 'Fine', 'Keen'] },
  { id: 'rar',      nume: 'Rare',      culoare: '#5f9fe0', putere: 2.2, sansa: 14, adjective: ['Gleaming', 'Runed', 'Tempered'] },
  { id: 'maiestru', nume: 'Epic',      culoare: '#b06fd8', putere: 3.2, sansa: 4,  adjective: ['Ancient', 'Dread', 'Storied'] }
];

function gasesteRaritate(id) {
  return RARITATI.find(function (r) { return r.id === id; }) || RARITATI[0];
}


// Numele piesei, pentru fiecare slot.
const NUME_PIESA = {
  cap: 'Helm', gat: 'Amulet', umeri: 'Pauldrons', spate: 'Cloak',
  piept: 'Breastplate', incheieturi: 'Bracers', maini: 'Gloves',
  brau: 'Belt', picioare: 'Greaves', talpi: 'Boots',
  inel1: 'Band', inel2: 'Band', talisman: 'Charm',
  armaPrincipala: 'Blade', armaSecundara: 'Shield'
};


// Coada "of ...": ce statistica primeste mai mult.
const COZI = [
  { text: 'of Might',    atribut: 'str' },
  { text: 'of the Wind', atribut: 'agi' },
  { text: 'of Stone',    atribut: 'sta' },
  { text: 'of Insight',  atribut: 'int' },
  { text: 'of the Spring', atribut: 'spi' }
];


// Cate puncte de statistica da un obiect. Creste cu nivelul si
// cu raritatea. Sloturile mari (piept, picioare) dau mai mult.
const MARIME_SLOT = {
  cap: 1.0, gat: 0.6, umeri: 0.85, spate: 0.6, piept: 1.2,
  incheieturi: 0.6, maini: 0.8, brau: 0.8, picioare: 1.2, talpi: 0.8,
  inel1: 0.7, inel2: 0.7, talisman: 0.9,
  armaPrincipala: 1.3, armaSecundara: 0.9
};

// Sloturile astea dau si armura; inelele si talismanele nu.
const DA_ARMURA = ['cap', 'umeri', 'spate', 'piept', 'incheieturi',
                   'maini', 'brau', 'picioare', 'talpi', 'armaSecundara'];


let urmatorulIdObiect = 1;

// Face un obiect nou pentru slotul dat.
function faObiect(idSlot, nivel, idRaritate) {

  const slot = gasesteSlot(idSlot);
  if (!slot) return null;

  const raritate = gasesteRaritate(idRaritate);
  const marime = MARIME_SLOT[idSlot] || 0.8;
  const coada = COZI[Math.floor(Math.random() * COZI.length)];
  const adjectiv = raritate.adjective[Math.floor(Math.random() * raritate.adjective.length)];

  // Cat de tare e obiectul, in mare: creste cu nivelul.
  const putere = (1 + nivel * 0.55) * raritate.putere * marime;

  const statistici = {};
  statistici[coada.atribut] = Math.max(1, Math.round(putere * 0.7));

  // Un al doilea atribut, mai mic, ales la intamplare.
  const altul = COZI[Math.floor(Math.random() * COZI.length)].atribut;
  if (altul !== coada.atribut) {
    statistici[altul] = Math.max(1, Math.round(putere * 0.35));
  }

  const armura = DA_ARMURA.includes(idSlot) ? Math.max(1, Math.round(putere * 2.2)) : 0;

  return {
    id: urmatorulIdObiect++,
    slot: idSlot,
    nume: adjectiv + ' ' + NUME_PIESA[idSlot] + ' ' + coada.text,
    nivel: nivel,
    nivelCerut: nivel,    // de la ce nivel il poti pune pe tine
    raritate: raritate.id,
    culoare: raritate.culoare,
    statistici: statistici,
    armura: armura
  };
}


// Alege o raritate la intamplare, dupa sansele de mai sus.
function raritateLaIntamplare() {
  let total = 0;
  RARITATI.forEach(function (r) { total += r.sansa; });

  let n = Math.random() * total;
  for (const r of RARITATI) {
    n -= r.sansa;
    if (n <= 0) return r.id;
  }
  return RARITATI[0].id;
}


// Ce lasa in urma un inamic. Da inapoi null daca n-a lasat nimic.
const SANSA_SA_LASE_OBIECT = 35;   // din 100
const SANSA_AL_DOILEA_OBIECT = 12; // sansa sa mai cada inca unul

function obiectDeLaMob(nivelMob) {
  if (Math.random() * 100 >= SANSA_SA_LASE_OBIECT) return null;
  const slot = SLOTURI[Math.floor(Math.random() * SLOTURI.length)];
  return faObiect(slot.id, Math.max(1, nivelMob), raritateLaIntamplare());
}


// TOT ce lasa un inamic cand moare: bani si obiecte, la un loc.
// Asta ajunge in trupul lui, de unde iei tu ce vrei - nu mai intra
// singur in inventar, ca in WoW.
function pradaDeLaMob(nivelMob, esteUmanoid) {

  const obiecte = [];
  const unul = obiectDeLaMob(nivelMob);
  if (unul) {
    obiecte.push(unul);
    if (Math.random() * 100 < SANSA_AL_DOILEA_OBIECT) {
      const slot = SLOTURI[Math.floor(Math.random() * SLOTURI.length)];
      obiecte.push(faObiect(slot.id, Math.max(1, nivelMob), raritateLaIntamplare()));
    }
  }

  return {
    bani: baniDeLaMob(nivelMob, esteUmanoid),
    obiecte: obiecte
  };
}


// Are ceva de luat, sau e un trup gol?
function pradaAreCeva(prada) {
  return !!prada && (prada.bani > 0 || prada.obiecte.length > 0);
}


// ==========================================================
//  RUCSACUL
//
//  Nu mai incape orice, oricat. Rucsacul are un numar de locuri,
//  ca in WoW, si cand se umple nu mai poti lua nimic de pe jos.
// ==========================================================
const LOCURI_IN_RUCSAC = 20;

function locuriLibere(personajul) {
  return LOCURI_IN_RUCSAC - (personajul.inventar || []).length;
}

function maiEsteLocInRucsac(personajul) {
  return locuriLibere(personajul) > 0;
}

// Pune un obiect in rucsac. Da inapoi false daca nu mai e loc.
function pomeneInRucsac(personajul, obiect) {
  personajul.inventar = personajul.inventar || [];
  if (!maiEsteLocInRucsac(personajul)) return false;
  personajul.inventar.push(obiect);
  return true;
}


// ==========================================================
//  ECHIPAREA
// ==========================================================

// Ce da, la un loc, tot ce ai pe tine.
function bonusEchipament(personajul) {
  const total = { str: 0, agi: 0, sta: 0, int: 0, spi: 0, armura: 0 };
  const echipate = personajul.echipament || {};

  Object.keys(echipate).forEach(function (idSlot) {
    const obiect = echipate[idSlot];
    if (!obiect) return;
    Object.keys(obiect.statistici).forEach(function (a) {
      total[a] = (total[a] || 0) + obiect.statistici[a];
    });
    total.armura += obiect.armura;
  });

  return total;
}


// Pui un obiect pe tine. Ce aveai in slotul ala se intoarce in
// inventar. Da inapoi true daca a mers.
// Esti destul de mare ca sa porti obiectul asta?
function nivelulCerut(obiect) {
  return obiect.nivelCerut || obiect.nivel || 1;
}

function poateFiEchipat(personajul, obiect) {
  return personajul.nivel >= nivelulCerut(obiect);
}


function echipeaza(personajul, idObiect) {

  personajul.inventar = personajul.inventar || [];
  personajul.echipament = personajul.echipament || {};

  const locInInventar = personajul.inventar.findIndex(function (o) { return o.id === idObiect; });
  if (locInInventar < 0) return false;

  const obiect = personajul.inventar[locInInventar];

  // Prea mic pentru el: ramane in rucsac.
  if (!poateFiEchipat(personajul, obiect)) return false;
  const vechi = personajul.echipament[obiect.slot] || null;

  personajul.inventar.splice(locInInventar, 1);
  personajul.echipament[obiect.slot] = obiect;
  if (vechi) personajul.inventar.push(vechi);

  return true;
}


// Scoti obiectul dintr-un slot si il pui inapoi in inventar.
function dezechipeaza(personajul, idSlot) {
  personajul.echipament = personajul.echipament || {};
  const obiect = personajul.echipament[idSlot];
  if (!obiect) return false;

  personajul.inventar = personajul.inventar || [];
  personajul.inventar.push(obiect);
  personajul.echipament[idSlot] = null;
  return true;
}


// Textul scurt cu ce da un obiect: "+7 Strength, +3 Stamina, +18 Armor"
const NUME_ATRIBUT = { str: 'Strength', agi: 'Agility', sta: 'Stamina',
                       int: 'Intellect', spi: 'Spirit' };

function descriereObiect(obiect) {
  const bucati = [];
  Object.keys(obiect.statistici).forEach(function (a) {
    bucati.push('+' + obiect.statistici[a] + ' ' + NUME_ATRIBUT[a]);
  });
  if (obiect.armura > 0) bucati.push('+' + obiect.armura + ' Armor');
  return bucati.join(', ');
}
