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

// Cand incarcam un personaj salvat, numerele obiectelor noi trebuie
// sa continue de unde a ramas, nu de la 1.
function pornesteIdurileObiectelor(deLa) {
  urmatorulIdObiect = Math.max(urmatorulIdObiect, deLa || 1);
}

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

  // O arma are si DAMAGE-UL ei, nu doar statistici.
  //
  // Fara asta, la nivelul 60 loveai tot cu sabia de start, 3-6
  // damage, si un inamic cu 3.500 de viata nu putea fi omorat
  // niciodata. Ca in WoW, arma din mana e cea care creste.
  let arma = null;
  if (idSlot === 'armaPrincipala') {
    const dmgMin = Math.max(2, Math.round((1 + nivel * 0.9) * raritate.putere));
    arma = {
      dmgMin: dmgMin,
      dmgMax: Math.round(dmgMin * 1.6),
      viteza: 2.0 + (nivel % 3) * 0.2,      // intre 2,0 si 2,4 secunde
      nume: NUME_PIESA[idSlot]
    };
  }

  return {
    id: urmatorulIdObiect++,
    slot: idSlot,
    nume: adjectiv + ' ' + NUME_PIESA[idSlot] + ' ' + coada.text,
    nivel: nivel,
    nivelCerut: nivel,    // de la ce nivel il poti pune pe tine
    raritate: raritate.id,
    culoare: raritate.culoare,
    statistici: statistici,
    armura: armura,
    arma: arma
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


// ==========================================================
//  CE LASA IN URMA UN INAMIC
//
//  Cum e in WoW Classic, si cum NU era la noi pana acum:
//
//    - VECHITURILE (gri) cad foarte des, peste jumatate din
//      inamici. Nu se pot purta, sunt doar de vandut - si sunt
//      principala sursa de bani.
//    - Obiectele PURTABILE cad rar. Un verde (Uncommon) e o mica
//      sarbatoare, un albastru (Rare) e o zi buna.
//
//  Inainte aveam 35% sanse de obiect purtabil si zero vechituri.
//  De aceea se umplea rucsacul in zece minute si nimic nu se
//  simtea ca o gasire.
//
//  Sansele cresc putin cu nivelul inamicului: la nivel 1 aproape
//  tot ce cade e alb, pe la 60 incep sa apara si albastrele.
// ==========================================================

function sansaDeObiect(nivelMob) {
  return 5 + Math.min(nivelMob, 30) * 0.23;      // 5,2% la nivel 1 -> ~12% la 30+
}

// Cat de des cade fiecare raritate, la un anumit nivel de inamic.
function sanseleRaritatilor(nivelMob) {
  const n = Math.min(nivelMob, 60);
  return {
    comun:    78 - n * 0.40,
    bun:      20 + n * 0.30,
    rar:     1.8 + n * 0.08,
    maiestru: 0.2 + n * 0.02
  };
}

function raritateDupaNivel(nivelMob) {
  const sanse = sanseleRaritatilor(nivelMob);
  let total = 0;
  Object.keys(sanse).forEach(function (id) { total += sanse[id]; });

  let n = Math.random() * total;
  for (const id of Object.keys(sanse)) {
    n -= sanse[id];
    if (n <= 0) return id;
  }
  return 'comun';
}

function obiectDeLaMob(nivelMob) {
  if (Math.random() * 100 >= sansaDeObiect(nivelMob)) return null;
  const slot = SLOTURI[Math.floor(Math.random() * SLOTURI.length)];
  return faObiect(slot.id, Math.max(1, nivelMob), raritateDupaNivel(nivelMob));
}


// ----------------------------------------------------------
//  VECHITURILE
//
//  Gri, fara statistici, bune doar de vandut. Fiecare fel de
//  inamic lasa altceva - un lup lasa colti, un bandit lasa
//  catarame - iar lucrurile la fel se aduna intr-o singura
//  gramada in rucsac, ca sa nu-ti ocupe zece locuri.
// ----------------------------------------------------------
const SANSA_VECHITURA = 55;        // din 100
const CULOARE_VECHITURA = '#9d9d9d';
const CULOARE_MATERIAL  = '#6fa8c0';   // materialele de meserie, albastrui
const MAXIM_PE_GRAMADA = 20;

function vechituraDeLaMob(nivelMob, felulMobului) {

  if (Math.random() * 100 >= SANSA_VECHITURA) return null;

  const fel = (typeof MOBI !== 'undefined') ? MOBI[felulMobului] : null;
  const lista = (fel && fel.vechituri) ? fel.vechituri : ['Worn Scrap'];
  const nume = lista[Math.floor(Math.random() * lista.length)];
  const nivel = Math.max(1, nivelMob);

  return {
    id: urmatorulIdObiect++,
    vechitura: true,
    nume: nume,
    nivel: nivel,
    culoare: CULOARE_VECHITURA,
    cate: 1,
    valoare: Math.max(1, Math.round(nivel * 1.8 + 2))
  };
}


// Un material de meserie: minereu, planta, piele. Se poarta ca o
// vechitura - se aduna in gramada si se vinde - dar are culoarea
// lui, ca sa nu-l arunci din greseala cu "Drop all junk".
function faMaterial(nume, valoare) {
  return {
    id: urmatorulIdObiect++,
    vechitura: true,          // ca sa mearga gramezile si vanzarea
    material: true,           // dar NU e gunoi: nu se arunca la gramada
    nume: nume,
    nivel: 1,
    culoare: CULOARE_MATERIAL,
    cate: 1,
    valoare: Math.max(1, valoare)
  };
}


// TOT ce lasa un inamic cand moare: bani si obiecte, la un loc.
// Asta ajunge in trupul lui, de unde iei tu ce vrei - nu mai intra
// singur in inventar, ca in WoW.
function pradaDeLaMob(nivelMob, esteUmanoid) {

  // Un singur obiect purtabil pe inamic, si acela rar. Inainte mai
  // exista o sansa sa cada si al doilea; acum, cu sansele coborate
  // la cat sunt in WoW, doua obiecte de la acelasi mob n-ar avea sens.
  const obiecte = [];
  const unul = obiectDeLaMob(nivelMob);
  if (unul) obiecte.push(unul);

  return {
    bani: baniDeLaMob(nivelMob, esteUmanoid),
    obiecte: obiecte
  };
}


// Acelasi lucru, dar stiind si ce fel de inamic a fost - ca sa
// putem pune si vechitura potrivita in trupul lui.
function pradaCompleta(nivelMob, esteUmanoid, felulMobului, rang) {

  const prada = pradaDeLaMob(nivelMob, esteUmanoid);
  const vechitura = vechituraDeLaMob(nivelMob, felulMobului);
  if (vechitura) prada.obiecte.push(vechitura);

  // Cei rari si cei elit lasa INTOTDEAUNA ceva bun - de aceea ii
  // cauti. Un rar da sigur verde, uneori albastru. Un elit da sigur
  // albastru, si cam unul din patru da mov.
  if (rang === 'rar' || rang === 'elit') {
    const zar = Math.random() * 100;
    let raritate;
    if (rang === 'elit') raritate = (zar < 25) ? 'maiestru' : 'rar';
    else                 raritate = (zar < 22) ? 'rar' : 'bun';

    const slot = SLOTURI[Math.floor(Math.random() * SLOTURI.length)];
    prada.obiecte.push(faObiect(slot.id, Math.max(1, nivelMob), raritate));

    // Si mai multi bani: au fost mai greu de omorat.
    prada.bani = Math.round(prada.bani * (rang === 'elit' ? 8 : 3));
    if (prada.bani === 0) {
      // Chiar si o fiara rara lasa ceva: ce a inghitit de la altii.
      prada.bani = Math.max(1, Math.round(nivelMob * nivelMob * 0.6 *
                                          (rang === 'elit' ? 4 : 1.5)));
    }
  }

  return prada;
}


// Are ceva de luat, sau e un trup gol?
function pradaAreCeva(prada) {

  if (!prada) return false;

  // O fiara pe care inca n-ai jupuit-o are ceva de dat, chiar daca
  // nu i-a cazut nici ban, nici obiect.
  if (prada.deJupuit) return true;

  const deMisiune = (prada.obiecteMisiune || []).length;
  return prada.bani > 0 || prada.obiecte.length > 0 || deMisiune > 0;
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
//
// Vechiturile la fel se aduna intr-o gramada, pana la 20 bucati.
// Fara asta, cincizeci de colti de lup ar umple rucsacul de doua ori.
function pomeneInRucsac(personajul, obiect) {

  personajul.inventar = personajul.inventar || [];

  if (obiect.vechitura) {
    const gramada = personajul.inventar.find(function (o) {
      return o.vechitura && o.nume === obiect.nume && o.cate < MAXIM_PE_GRAMADA;
    });
    if (gramada) {
      gramada.cate += (obiect.cate || 1);
      return true;
    }
  }

  if (!maiEsteLocInRucsac(personajul)) return false;
  personajul.inventar.push(obiect);
  return true;
}


// Arunca un obiect din rucsac. Se duce de tot - nu se poate lua
// inapoi, la fel ca in WoW. De-aia jocul intreaba inainte.
//
// Da inapoi obiectul aruncat, ca sa putem scrie pe ecran ce a fost.
function aruncaDinRucsac(personajul, idObiect) {

  const inventar = personajul.inventar || [];
  const unde = inventar.findIndex(function (o) { return o.id === idObiect; });
  if (unde < 0) return null;

  return inventar.splice(unde, 1)[0];
}


// Arunca toate vechiturile deodata. Cand ti se umple rucsacul
// departe de un negustor, asta e butonul care te scoate din impas.
function aruncaVechiturile(personajul) {

  const inventar = personajul.inventar || [];
  let cate = 0;

  for (let i = inventar.length - 1; i >= 0; i--) {
    if (!inventar[i].vechitura) continue;
    if (inventar[i].material) continue;   // materialele nu sunt gunoi
    cate += (inventar[i].cate || 1);
    inventar.splice(i, 1);
  }
  return cate;
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
  if (obiect.vechitura) return false;      // o vechitura nu se poarta
  return personajul.nivel >= nivelulCerut(obiect);
}


function echipeaza(personajul, idObiect) {

  personajul.inventar = personajul.inventar || [];
  personajul.echipament = personajul.echipament || {};

  const locInInventar = personajul.inventar.findIndex(function (o) { return o.id === idObiect; });
  if (locInInventar < 0) return false;

  const obiect = personajul.inventar[locInInventar];

  // O vechitura sau ceva peste nivelul tau: ramane in rucsac.
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
  if (obiect.vechitura) return 'Junk';
  const bucati = [];
  if (obiect.arma) bucati.push(obiect.arma.dmgMin + '-' + obiect.arma.dmgMax + ' dmg');
  Object.keys(obiect.statistici).forEach(function (a) {
    bucati.push('+' + obiect.statistici[a] + ' ' + NUME_ATRIBUT[a]);
  });
  if (obiect.armura > 0) bucati.push('+' + obiect.armura + ' Armor');
  return bucati.join(', ');
}
