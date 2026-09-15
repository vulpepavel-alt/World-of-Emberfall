// ==========================================================
//  PROBA ABILITATILOR
//
//  Ia fiecare clasa, o duce la nivelul 60, ii da tot ce stie de
//  invatat, si APASA fiecare abilitate pe rand - intr-o lume
//  adevarata, cu un mob adevarat in fata - ca sa vada daca chiar
//  face ceva.
//
//  De ce trebuie sa fie in browser si nu in node, ca celelalte
//  verificatoare: abilitatile lucreaza pe lume - pe pozitii, pe
//  mobi, pe timp care trece prin bucla de cadre. Nu se pot proba
//  fara ea.
//
//  Preotul se probeaza de patru ori, o data cu fiecare rasa, fiindca
//  are cate doua abilitati numai ale rasei tale.
//
//  Se cheama asa:  http://localhost:8765/3d/?proba=1
//
//  Fisierul nu face NIMIC daca nu i se cere. Se incarca mereu, ca sa
//  fie numarat ca oricare altul, dar se opreste la prima linie daca
//  nu scrie proba=1 in adresa.
//
//  ATENTIE la ce s-a intamplat o data: o proba de felul asta a
//  raportat cinci abilitati de preot stricate, si nu era nimic
//  stricat - numaratoarea se facea dupa ce apucasera sa expire alte
//  efecte, si scadea la loc ce tocmai crescuse. De-aia fotografia
//  de dupa se ia IMEDIAT, si numai lucrurile care au nevoie de timp
//  ca sa se vada (ranile care pica, alinarile) mai asteapta o data.
// ==========================================================

const CHEAMA_PROBA = (typeof location !== 'undefined') &&
                     location.search.indexOf('proba=1') >= 0;


// ----------------------------------------------------------
//  Ce trebuie sa se schimbe, pentru fiecare fel de abilitate
//
//  Scrisa o data, aici, ca sa se vada dintr-o privire ce anume
//  socotim ca inseamna "merge" pentru fiecare fel.
// ----------------------------------------------------------
const CE_ASTEPTAM = {
  lovitura:     { ce: 'mobul pierde viata',        cum: function (a, b) { return b.viataMob < a.viataMob; } },
  sageata:      { ce: 'mobul pierde viata',        cum: function (a, b) { return b.viataMob < a.viataMob; } },
  vraja:        { ce: 'mobul pierde viata',        cum: function (a, b) { return b.viataMob < a.viataMob; } },
  val:          { ce: 'ceva din jur pierde viata', cum: function (a, b) { return b.viataInJur < a.viataInJur; } },
  arsura:       { ce: 'o rana care pica in timp',  cum: function (a, b) { return b.rani > a.rani; }, cuTimp: true },
  vindecare:    { ce: 'te vindeci',                cum: function (a, b) { return b.viataTa > a.viataTa; } },
  alinare:      { ce: 'vindecare care tine',       cum: function (a, b) { return b.alinari > a.alinari || b.viataAnimal > a.viataAnimal; }, cuTimp: true },
  intarire:     { ce: 'o intarire pe tine',        cum: function (a, b) { return b.intariri > a.intariri; } },
  scut:         { ce: 'un scut care inghite',      cum: function (a, b) { return b.scut > a.scut; } },
  slabire:      { ce: 'mobul slabit',              cum: function (a, b) { return b.slabit > a.slabit; } },
  frica:        { ce: 'mobii din jur fug',         cum: function (a, b) { return b.frica > a.frica; } },
  farmec:       { ce: 'mobul farmecat',            cum: function (a, b) { return b.farmec > a.farmec; } },
  saritura:     { ce: 'te muti din loc',           cum: function (a, b) { return Math.hypot(b.x - a.x, b.z - a.z) > 0.4; } },
  mortPrefacut: { ce: 'te faci mort',              cum: function (a, b) { return b.mort > a.mort; } },
  refacere:     { ce: 'iti vine resursa inapoi',   cum: function (a, b) { return b.mana > a.mana || b.rage > a.rage; } },
  capcana:      { ce: 'o capcana pe jos',          cum: function (a, b) { return b.capcane > a.capcane; } },
  cheama:       { ce: 'animalul e langa tine',     cum: function (a, b) { return b.areAnimal; } },
  invie:        { ce: 'animalul se ridica',        cum: function (a, b) { return b.viataAnimal > a.viataAnimal; } },
  imblanzire:   { ce: 'ai un animal, si e langa tine', cum: function (a, b) { return b.arePersonajAnimal && b.areAnimal; } },
  faceMancare:  { ce: 'apare in rucsac',           cum: function (a, b) { return b.inRucsac > a.inRucsac; } },
  teleport:     { ce: 'ajungi in alta zona',       cum: function (a, b) { return b.zona !== a.zona; } },
  intrerupere:  { ce: 'opreste o incantare',       cum: function (a, b) { return a.incantaTinta && !b.incantaTinta; } }
};


// ----------------------------------------------------------
//  Fotografia: tot ce se poate schimba, intr-un singur obiect
// ----------------------------------------------------------
function pozaProbei(mob) {
  const inJur = (zona.mobi || []).filter(function (m) {
    return m.viataMaxima !== undefined && !esteMort(m) &&
           Math.hypot(m.x - jucator.position.x, m.z - jucator.position.z) < 12;
  });

  return {
    viataTa: Math.round(personaj.viata),
    mana: Math.round(personaj.mana || 0),
    rage: Math.round(personaj.rage || 0),
    viataMob: mob ? Math.round(mob.viata) : 0,
    viataInJur: inJur.reduce(function (t, m) { return t + m.viata; }, 0),
    rani:     lucruriCareTin.filter(function (l) { return l.fel === 'rana'; }).length,
    alinari:  lucruriCareTin.filter(function (l) { return l.fel === 'alinare'; }).length,
    intariri: lucruriCareTin.filter(function (l) { return l.fel === 'intarire'; }).length,
    scut: scutulTau,
    capcane: capcanePuse.length,
    frica:  mob ? (mob.fricaPanaLa   || 0) : 0,
    farmec: mob ? (mob.farmecPanaLa  || 0) : 0,
    slabit: mob ? (mob.slabitPanaLa  || 0) : 0,
    mort: teFaciMortPanaLa,
    inRucsac: (personaj.inventar || []).length,
    // Trupul animalului din lume se cheama animalulDesenat, NU
    // animalul. Cautand un nume care nu exista, proba a raportat de
    // doua ori "n-ai niciun animal" pentru abilitati care tocmai
    // scosesera unul - typeof pe un nume gresit nu crapa, da false.
    areAnimal: !!(typeof animalulDesenat !== 'undefined' && animalulDesenat),
    arePersonajAnimal: !!(personaj.animal),
    viataAnimal: (personaj.animal && personaj.animal.viata) || 0,
    imblanzesti: !!(typeof imblanzireaInCurs !== 'undefined' && imblanzireaInCurs),
    x: jucator.position.x, z: jucator.position.z,
    zona: zona.id,
    incantaTinta: !!(mob && mob.incantare && mob.incantare.pana > performance.now()),
    spus: ultimulMesajProba
  };
}


// Ce a scris jocul pe ecran ultima data. Pentru abilitatile care nu
// schimba nimic masurabil - intreruperea - cuvantul e tot ce avem.
let ultimulMesajProba = '';
let spuneCevaAdevarat = null;

function ascultaMesajele() {
  if (spuneCevaAdevarat) return;
  spuneCevaAdevarat = spuneCeva;
  spuneCeva = function (text) {
    ultimulMesajProba = text;
    return spuneCevaAdevarat.apply(null, arguments);
  };
}


function asteapta(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}


// ----------------------------------------------------------
//  Un mob de proba, langa tine, intreg
// ----------------------------------------------------------
function pregatesteMobul() {
  const x = jucator.position.x, z = jucator.position.z;

  // Cel mai apropiat, VIU SAU MORT - il inviem oricum doua randuri
  // mai jos. Sarindu-i pe cei morti, proba ramanea fara mob dupa
  // prima abilitate care omoara ceva, si toate cele de dupa ramaneau
  // fara tinta.
  let ales = null, cat = Infinity;
  (zona.mobi || []).forEach(function (m) {
    const p = pozitiaFapturii(m);
    const d = Math.hypot(p.x - x, p.z - z);
    if (d < cat) { cat = d; ales = m; }
  });
  if (!ales) return null;

  trezesteMobul(ales);

  // Il aducem langa noi si il facem intreg, ca fiecare abilitate sa
  // porneasca din acelasi loc.
  //
  // Doi pasi si jumatate, nu unul: abilitatile care te arunca in
  // tinta n-au unde sa te arunce daca esti deja lipit de ea, si
  // raportau "nu te-ai miscat" cand de fapt nu aveau unde.
  jucator.position.x = ales.col + 2.2;
  jucator.position.z = ales.rand;
  ales.x = ales.col; ales.z = ales.rand;
  ales.viata = ales.viataMaxima;
  ales.mortPanaLa = 0;
  ales.suparat = false;
  ales.fricaPanaLa = 0;
  ales.farmecPanaLa = 0;
  ales.slabitPanaLa = 0;

  // Si sta locului. Lasat sa se plimbe, apuca sa iasa din bataia
  // abilitatilor scurte intre pregatire si apasare - asa a picat
  // intreruperea de warrior, care are bataie de doi pasi si jumatate.
  ales.plimbaLa = performance.now() + 999999;
  ales.tintaPlimbarii = null;
  alegeTinta(ales);
  return ales;
}


function pregatesteJucatorul() {

  // UN PROBATOR MORT NU PROBEAZA NIMIC, si nici nu se plange.
  //
  // folosesteAbilitatea3d() se intoarce din prima linie daca esti
  // mort, FARA sa spuna nimic. Deci prima data cand mobii te dobora
  // in timpul probei, toate abilitatile de dupa "nu fac nimic" - si
  // proba le raporteaza pe toate stricate, cu mesajul gol, desi nu e
  // nimic stricat la ele. Asa au iesit patru abilitati de preot
  // "stricate" care, luate una cate una, merg perfect.
  //
  // Si oprim lovitul automat, altfel omoara mobul de proba intre
  // doua masuratori.
  mortPanaLa = 0;
  luptiSingur = false;

  personaj.viata = Math.max(1, Math.round(personaj.viataMaxima * 0.5));   // loc de vindecat
  if (personaj.resursa === RESURSA_MANA) personaj.mana = Math.round(personaj.manaMaxima * 0.5);
  else personaj.rage = RAGE_MAXIM;
  scutulTau = 0;
  scutulPanaLa = 0;
  teFaciMortPanaLa = 0;
  lucruriCareTin.length = 0;
  incantareaInCurs = null;
  pauzaGlobalaPanaLa = 0;
  for (const k in pauzeAbilitati) delete pauzeAbilitati[k];
  recalculeazaPersonajul3d();
}


// ----------------------------------------------------------
//  O singura abilitate
// ----------------------------------------------------------
// Cateva abilitati cer sa fie ceva anume ADEVARAT inainte, altfel
// refuza pe buna dreptate - si un refuz corect nu e o stricaciune.
// "N-ai niciun animal" chiar asa e, daca n-ai imblanzit inca unul.
// Deci proba face intai adevarat ce trebuie.
function pregatesteLumeaPentru(ab) {

  // Vindecatul si inviatul animalului cer un animal. Daca nu s-a
  // imblanzit inca unul, i se da unul acum - ca sa se probeze
  // abilitatea, nu lipsa animalului.
  if ((ab.fel === 'alinare' && ab.peAnimal) || ab.fel === 'invie' || ab.fel === 'cheama') {
    if (!personaj.animal) {
      personaj.animal = { fel: 'wolf', nume: 'Proba', nivel: personaj.nivel,
                          viata: 100, viataMaxima: 100 };
    }
    if (ab.fel === 'invie') personaj.animal.viata = 0;       // numai un mort se invie
    else personaj.animal.viata = Math.round(personaj.animal.viataMaxima * 0.4);
    if (typeof scoateAnimalul === 'function' && ab.fel !== 'invie') scoateAnimalul();
  }

  // Intreruperea are nevoie de ceva de intrerupt. Nimic din lumea 3D
  // nu pregateste inca o lovitura - aia o fac sefii de temnita, si ei
  // nu sunt inca adusi aici - deci proba pune ea una, ca sa se vada
  // daca abilitatea chiar o opreste.
  if (ab.fel === 'intrerupere' && tintaEVie()) {
    tinta.incantare = { nume: 'Proba', pana: performance.now() + 4000 };
  }

  // Long Step te duce intr-un oras in care ai mai fost. Ii dam unul.
  if (ab.fel === 'teleport' && typeof noduriDeZbor === 'function') {
    const oras = noduriDeZbor().find(function (n) {
      return n.esteOras && n.zona !== zona.id;
    });
    if (oras) descoperaZborul(personaj, oras.id);
  }
}


async function probeazaAbilitatea(ab) {
  const mob = pregatesteMobul();
  pregatesteJucatorul();
  pregatesteLumeaPentru(ab);
  await asteapta(60);

  const asteptat = CE_ASTEPTAM[ab.fel];
  const inainte = pozaProbei(mob);
  ultimulMesajProba = '';

  folosesteAbilitatea3d(ab);

  // O incantare se termina in bucla de cadre, nu aici.
  if (ab.incantare) await asteapta(ab.incantare + 180);
  else await asteapta(70);

  // Numai ce are nevoie de timp ca sa se vada mai asteapta. Restul
  // se fotografiaza imediat, ca sa nu apuce sa expire.
  if (asteptat && asteptat.cuTimp) await asteapta(Math.max(200, (ab.laCat || 2000) * 0.2));

  const dupa = pozaProbei(mob);

  if (!asteptat) {
    return { id: ab.id, fel: ab.fel, nume: ab.nume, stare: 'NESTIUT',
             de_ce: 'nu stiu ce ar trebui sa faca un "' + ab.fel + '"' };
  }

  const bine = asteptat.cum(inainte, dupa);
  return {
    id: ab.id, fel: ab.fel, nume: ab.nume,
    stare: bine ? 'merge' : 'STRICAT',
    de_ce: bine ? asteptat.ce : ('asteptam: ' + asteptat.ce + '; mesaj: "' + dupa.spus + '"'),
    inainte: inainte, dupa: dupa
  };
}


// ----------------------------------------------------------
//  O clasa intreaga
// ----------------------------------------------------------
async function probeazaClasa(idRasa, idClasa) {
  const p = calculeazaPersonaj(idRasa, idClasa, infatisareImplicita(), NIVEL_MAXIM);
  p.nume = 'Proba';
  p.bani = 1000000;
  slotulCurent = null;            // nu scriem peste salvarile nimanui
  porneste(p, null);

  // Zona se construieste, si abia pe urma se aseaza fapturile.
  await asteapta(2500);

  // O proba isi face singura conditiile. porneste() da tot ce se
  // cuvine clasei, dar daca dintr-un motiv oarecare n-a apucat, nu
  // vrem sa raportam "0 din 0 merg" - care nu inseamna nimic si
  // arata ca un succes.
  personaj.stiute = personaj.stiute || {};
  const secuvine = daTotCeSeCuvine(personaj);
  Object.keys(secuvine).forEach(function (id) {
    personaj.stiute[id] = Math.max(personaj.stiute[id] || 0, secuvine[id]);
  });

  const rezultate = [];
  const ale = abilitatileClasei(idClasa).filter(function (ab) {
    return personaj.stiute[ab.id];
  });

  if (!ale.length) {
    return { rasa: idRasa, clasa: idClasa, nestiute: 0,
             rezultate: [{ id: '(nimic)', fel: '-', stare: 'STRICAT',
                           de_ce: 'clasa asta n-a invatat nicio abilitate' }] };
  }

  for (const baza of ale) {
    const ab = abilitateaLaRang(baza, personaj.stiute[baza.id]);
    // Teleportul te scoate din zona si strica tot ce urmeaza, deci
    // se probeaza la urma.
    if (ab.fel === 'teleport') continue;
    rezultate.push(await probeazaAbilitatea(ab));
  }

  const teleport = ale.find(function (a) { return a.fel === 'teleport'; });
  if (teleport) {
    rezultate.push(await probeazaAbilitatea(
      abilitateaLaRang(teleport, personaj.stiute[teleport.id])));
  }

  return { rasa: idRasa, clasa: idClasa, nestiute: ale.length, rezultate: rezultate };
}


// ----------------------------------------------------------
//  Toate
// ----------------------------------------------------------
async function probeazaTot() {
  ascultaMesajele();

  const deProbat = [
    ['human', 'warrior'], ['human', 'hunter'], ['human', 'mage'],
    // Preotul are doua abilitati pentru fiecare rasa.
    ['human', 'priest'], ['nightelf', 'priest'],
    ['orc', 'priest'], ['undead', 'priest']
  ];

  const tot = [];
  for (const pereche of deProbat) {
    console.log('%c ' + pereche[1] + ' (' + pereche[0] + ') ',
                'background:#2b3a5d;color:#dfe8ff');
    const r = await probeazaClasa(pereche[0], pereche[1]);
    r.rezultate.forEach(function (x) {
      console.log('   ' + (x.stare === 'merge' ? '  ok  ' : ' ' + x.stare + ' ') +
                  x.id.padEnd(26) + String(x.fel).padEnd(13) + x.de_ce);
    });
    tot.push(r);
  }

  const toate = tot.reduce(function (a, r) { return a.concat(r.rezultate); }, []);
  const rele = toate.filter(function (x) { return x.stare !== 'merge'; });

  console.log('%c ' + (toate.length - rele.length) + ' din ' + toate.length +
              ' abilitati fac ce spun ',
              rele.length ? 'background:#6d2b2b;color:#ffe0e0'
                          : 'background:#2f5d33;color:#dff0d8');

  window.PROBA = { tot: tot, toate: toate, rele: rele };
  return window.PROBA;
}


if (CHEAMA_PROBA) {
  window.probeazaTot = probeazaTot;
  console.log('%c Proba abilitatilor e gata. Scrie: probeazaTot() ',
              'background:#4a3a1a;color:#ffe9a8');
}
