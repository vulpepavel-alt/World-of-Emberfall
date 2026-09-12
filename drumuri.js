// ==========================================================
//  DRUMURILE: calul si piatra de intoarcere
//
//  DE CE
//  Am masurat: sa traversezi o zona pe jos ia 2 minute si 36 de
//  secunde, iar sa treci un continent dintr-un capat in altul, 13
//  minute de mers neintrerupt. Lumea are 41 de zone. Fara nimic care
//  sa scurteze drumul, jocul se face din mers, nu din joc.
//
//  In Classic raspunsul la exact problema asta e din trei bucati:
//  calul la nivelul 40, piatra care te duce acasa, si drumurile de
//  zbor. Astea sunt primele doua; zborul sta in acelasi fisier, mai
//  jos.
//
//  CUM SE FOLOSESC
//  Amandoua sunt OBIECTE IN RUCSAC, ca in Classic - nu butoane noi pe
//  ecran. Le apesi in rucsac, ca pe orice altceva. Asa nu se mai
//  inghesuie inca doua butoane pe un ecran de telefon, si se si
//  potrivesc cu felul in care merge deja jocul.
//
//  PRETURILE, DE UNDE VIN
//  Nu sunt scoase din burta. Masurat in joc:
//    - toate cele 225 de misiuni, la un loc, dau 50 de aur
//    - la nivelul 40, o suta de umanoizi dau cam 15 aur
//    - la nivelul 60, o suta de umanoizi dau cam 34 de aur
//  Deci 40 de aur pentru primul cal inseamna cam tot ce ai strans din
//  misiuni pana acolo, plus ceva vanat - un tel adevarat, dar nu unul
//  care sa ceara zile intregi. Al doilea, 150, e un tel de nivelul 60.
//  Se pot regla de aici, dintr-un singur loc.
// ==========================================================


// ---- CAII ----
// spor = de cate ori mai repede mergi. In Classic primul cal da cu
// 60% mai mult, al doilea dubleaza viteza. Am pastrat cifrele.
const CAI = [
  {
    id: 'cal1', nivel: 40, spor: 1.6, pret: 40 * 10000,
    nume: TEXT.MOUNT1_NAME, descriere: TEXT.MOUNT1_DESC,
    culoare: 0x7a5a3a, coama: 0x4a3524
  },
  {
    id: 'cal2', nivel: 60, spor: 2.0, pret: 150 * 10000,
    nume: TEXT.MOUNT2_NAME, descriere: TEXT.MOUNT2_DESC,
    culoare: 0x3e4450, coama: 0x22262e
  }
];


function gasesteCalul(id) {
  return CAI.find(function (c) { return c.id === id; }) || null;
}


// Cel mai bun cal pe care il ai. Null daca n-ai niciunul.
function celMaiBunCal(personajul) {
  if (!personajul || !personajul.cai) return null;
  let cel = null;
  CAI.forEach(function (c) {
    if (personajul.cai[c.id] && (!cel || c.spor > cel.spor)) cel = c;
  });
  return cel;
}


// Poti cumpara calul asta? Intoarce si motivul, ca sa se poata scrie
// pe ecran de ce nu - nu doar un buton stins.
function potiCumparaCalul(personajul, id) {
  const c = gasesteCalul(id);
  if (!c) return { poti: false, motiv: 'nu exista' };
  if (personajul.cai && personajul.cai[c.id]) return { poti: false, motiv: 'ai' };
  if (personajul.nivel < c.nivel) return { poti: false, motiv: 'nivel', nivel: c.nivel };
  if ((personajul.bani || 0) < c.pret) return { poti: false, motiv: 'bani' };
  return { poti: true };
}


// Cumparat: se scad banii si iti intra in rucsac obiectul cu care il
// chemi. Daca rucsacul e plin, nu se cumpara - altfel ai plati si n-ai
// primi nimic.
function cumparaCalul(personajul, id) {

  const se = potiCumparaCalul(personajul, id);
  if (!se.poti) return se;

  if (!maiEsteLocInRucsac(personajul)) return { poti: false, motiv: 'rucsac' };

  const c = gasesteCalul(id);
  personajul.bani -= c.pret;
  personajul.cai = personajul.cai || {};
  personajul.cai[c.id] = true;
  pomeneInRucsac(personajul, faObiectDeCalarie(c.id));
  return { poti: true, cal: c };
}


// Obiectul din rucsac cu care chemi calul. NU se consuma: il apesi si
// te urci, il apesi din nou si cobori.
function faObiectDeCalarie(idCal) {
  const c = gasesteCalul(idCal);
  if (!c) return null;
  return {
    id: urmatorulIdObiect++,
    vechitura: true,          // ca sa se aseze in rucsac ca orice altceva
    material: true,           // dar sa NU-l mature butonul de aruncat gunoiul
    calarie: c.id,
    nume: c.nume,
    nivel: c.nivel,
    culoare: '#c9a84a',
    cate: 1,
    valoare: Math.round(c.pret / 4)
  };
}


// ==========================================================
//  PIATRA DE INTOARCERE
//
//  O legi de un han, si de acolo incolo te duce inapoi la el, oriunde
//  ai fi, o data la o ora. In Classic asta e ce face ca o iesire in
//  lume sa fie o bucla, nu un drum dus-intors: stii ca ai mereu un
//  drum gratis spre casa.
//
//  Numele nu e cel din Warcraft. Acolo se cheama altfel, si numele ala
//  e azi si numele unui joc intreg al lor.
// ==========================================================
const PAUZA_PIATRA = 60 * 60 * 1000;      // o ora, ca in Classic


function faPiatraDeIntoarcere() {
  return {
    id: urmatorulIdObiect++,
    vechitura: true,
    material: true,
    piatraAcasa: true,
    nume: TEXT.HOME_STONE,
    nivel: 1,
    culoare: '#9ad0e8',
    cate: 1,
    valoare: 0                 // nu se vinde: ai ramane fara ea
  };
}


function aiPiatraDeIntoarcere(personajul) {
  return (personajul.inventar || []).some(function (o) { return o && o.piatraAcasa; });
}


// Legarea de un han. Tine minte zona si locul din ea.
function legPiatraDe(personajul, idZona, idLoc, numeLoc) {
  personajul.acasa = { zona: idZona, loc: idLoc, nume: numeLoc };
  return personajul.acasa;
}


// ==========================================================
//  DRUMURILE DE ZBOR
//
//  Fiecare asezare are un om cu pasari. Prima data trebuie sa ajungi
//  la el PE JOS - atunci i se deschide locul pe harta ta. Dupa aceea
//  poti zbura, pe bani, intre oricare doua locuri pe care le-ai
//  descoperit deja.
//
//  Asta e ce face harta din Classic sa se simta castigata: fiecare
//  drum nou il mergi o data, pe urma il ai pentru totdeauna.
//
//  Nodurile NU se scriu de mana. Se afla din zone: fiecare zona de
//  lume are un loc unde sta lumea (tabara, post, sat, mina), iar ala
//  devine oprirea ei. Asa o zona noua primeste automat drum de zbor,
//  fara sa umblam prin doua fisiere.
// ==========================================================

// In ce fel de loc sta omul cu pasarile, in ordinea preferintei.
//
// ATENTIE la ordine. Prima data 'oras' era primul, si iesea o
// incurcatura: intr-o zona ca Thornmoor, locul numit 'oras' e chiar
// POARTA capitalei, care are si ea oprirea ei, ca harta separata.
// Deci in lista de zboruri apareau doua opriri numite amandoua
// "Ambervault", iar jucatorul n-avea cum sa stie care e care. Acum
// tabara si postul trec inaintea portii, iar portile de oras se sar
// de tot (vezi mai jos): capitala isi are oprirea ei.
const LOCURI_DE_ZBOR = ['corturi', 'post', 'sat', 'mina', 'cetate', 'oras'];

let noduriZborInMemorie = null;

function noduriDeZbor() {

  if (noduriZborInMemorie) return noduriZborInMemorie;
  if (typeof ZONE === 'undefined') return [];

  const noduri = [];

  ZONE.forEach(function (z) {
    if (z.esteTemnita || z.esteRaid) return;

    // Orasele mari sunt harti separate: oprirea lor e chiar orasul.
    if (z.esteOras) {
      noduri.push({ id: z.id + ':oras', zona: z.id, loc: null,
                    nume: z.nume, continent: z.continent,
                    nivel: z.nivelDeLa, esteOras: true });
      return;
    }

    // Locurile care sunt de fapt USI catre harta unei capitale nu se
    // pun ca opriri: capitala are deja oprirea ei, si ar iesi doua
    // opriri cu acelasi nume.
    const usiDeOras = (z.intrari || []).map(function (i) { return i.la; });
    const bune = (z.locuri || []).filter(function (l) {
      return usiDeOras.indexOf(l.id) < 0;
    });

    let ales = null;
    for (const fel of LOCURI_DE_ZBOR) {
      ales = bune.find(function (l) { return l.fel === fel; });
      if (ales) break;
    }
    if (!ales) ales = bune[0];
    if (!ales) return;

    noduri.push({ id: z.id + ':' + ales.id, zona: z.id, loc: ales.id,
                  nume: ales.nume || z.nume, numeZona: z.nume,
                  continent: z.continent, nivel: z.nivelDeLa,
                  c: ales.c, r: ales.r });
  });

  noduriZborInMemorie = noduri;
  return noduri;
}


function gasesteNodulDeZbor(id) {
  return noduriDeZbor().find(function (n) { return n.id === id; }) || null;
}


// Nodul dintr-o zona anume, daca are unul.
function nodulZoneiDeZbor(idZona) {
  return noduriDeZbor().find(function (n) { return n.zona === idZona; }) || null;
}


function aiDescoperitZborul(personajul, idNod) {
  return !!(personajul.zboruri && personajul.zboruri[idNod]);
}


// Se cheama cand ajungi la omul cu pasarile. Intoarce true daca abia
// acum l-ai descoperit, ca sa se poata scrie pe ecran.
function descoperaZborul(personajul, idNod) {
  personajul.zboruri = personajul.zboruri || {};
  if (personajul.zboruri[idNod]) return false;
  personajul.zboruri[idNod] = true;
  return true;
}


// Cat costa un zbor. Dupa cat de departe e pe harta lumii, ca sa nu
// coste la fel doua zone vecine si doua din capete opuse.
function costulZborului(deLa, panaLa) {

  if (!deLa || !panaLa) return 0;

  const a = retetaZonei(deLa.zona), b = retetaZonei(panaLa.zona);
  let departare = 6;
  if (a && b && a.peHarta && b.peHarta) {
    const dc = a.peHarta.c - b.peHarta.c, dr = a.peHarta.r - b.peHarta.r;
    departare = Math.sqrt(dc * dc + dr * dr);
  }
  // Alt continent: drumul e mai lung oricum.
  if (a && b && a.continent !== b.continent) departare += 6;

  return Math.max(200, Math.round(departare * 900));
}


// Unde poti zbura de aici: tot ce ai descoperit, in afara de locul in
// care esti deja.
function undePotiZbura(personajul, idNodAici) {
  return noduriDeZbor()
    .filter(function (n) {
      return n.id !== idNodAici && aiDescoperitZborul(personajul, n.id);
    })
    .map(function (n) {
      return { nod: n, cost: costulZborului(gasesteNodulDeZbor(idNodAici), n) };
    })
    .sort(function (x, y) { return x.cost - y.cost; });
}
