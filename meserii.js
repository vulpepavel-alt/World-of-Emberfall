// ==========================================================
//  MESERIILE
//
//  Douasprezece meserii, toate cu numele pe care le-ai aprobat.
//  Ca in WoW Classic: cel mult DOUA principale, oricate din cele
//  de pe langa casa.
//
//  Aici sunt scrise REGULILE si DATELE. Nimic din ce urmeaza nu e
//  in cod: treptele, pragurile de culoare, ce noduri sunt pe harta,
//  la ce adancime de skill se gasesc si ce material dau. Adaugi un
//  material nou scriindu-i un rand in lista de mai jos.
//
//  CE MERGE ACUM: cele trei meserii de STRANS - Delving (minereu),
//  Foraging (plante) si Hidecraft (piei de la fiare).
//  Cele de facut lucruri si cele de pe langa casa sunt scrise aici,
//  dar antrenorii lor iti spun cinstit ca inca nu predau.
// ==========================================================


// ----------------------------------------------------------
//  CELE PATRU TREPTE
//
//  Fara treapta urmatoare, skill-ul se opreste la plafonul treptei
//  pe care esti. Nivelurile sunt cele din Classic: jocul are tot
//  nivel maxim 60, deci se potrivesc unu la unu.
// ----------------------------------------------------------
const TREPTE_MESERIE = [
  { nr: 1, nume: 'Apprentice', maxim: 75,  nivel: 5  },
  { nr: 2, nume: 'Journeyman', maxim: 150, nivel: 10 },
  { nr: 3, nume: 'Expert',     maxim: 225, nivel: 20 },
  { nr: 4, nume: 'Artisan',    maxim: 300, nivel: 35 }
];


// Cat costa sa inveti o treapta. De opt ori cat un rang de
// abilitate la acelasi nivel: te costa, dar nu te opreste.
function costulTreptei(nr) {
  const t = TREPTE_MESERIE[nr - 1];
  if (!t) return 0;
  return Math.round(12 * Math.pow(t.nivel, 1.3)) * 8;
}


// ----------------------------------------------------------
//  MESERIILE
//
//  fel: 'strangere' (o culegi de pe harta), 'facut' (faci lucruri),
//       'langaCasa' (secundara, fara limita de numar)
// ----------------------------------------------------------
const MESERII = {

  // ---- se strang de pe harta ----
  delving: {
    id: 'delving', nume: 'Delving', fel: 'strangere', principala: true,
    descriere: 'Cutting ore out of the rock. You need a pick.',
    unealta: 'Pick', antrenor: 'antrenorMinerit', gata: true
  },
  foraging: {
    id: 'foraging', nume: 'Foraging', fel: 'strangere', principala: true,
    descriere: 'Finding and cutting useful plants. Your hands are tool enough.',
    unealta: null, antrenor: 'antrenorIerburi', gata: true
  },
  hidecraft: {
    id: 'hidecraft', nume: 'Hidecraft', fel: 'strangere', principala: true,
    descriere: 'Taking the hide off a dead beast. You need a flensing knife.',
    unealta: 'Flensing Knife', antrenor: 'antrenorJupuit', gata: true,
    peCadavre: true
  },

  // ---- fac lucruri (vin la pasul urmator) ----
  smithing: {
    id: 'smithing', nume: 'Smithing', fel: 'facut', principala: true,
    descriere: 'Beating ore into something that holds an edge.',
    statie: 'Anvil', antrenor: 'antrenorFierarie', gata: true
  },
  brewing: {
    id: 'brewing', nume: 'Brewing', fel: 'facut', principala: true,
    descriere: 'Boiling plants down into something you can drink.',
    statie: null, antrenor: 'antrenorAlchimie', gata: true
  },
  runecarving: {
    id: 'runecarving', nume: 'Runecarving', fel: 'facut', principala: true,
    descriere: 'Cutting marks into gear so it carries more than metal.',
    statie: 'Rune Table', antrenor: 'antrenorVrajire', gata: true
  },
  tinkering: {
    id: 'tinkering', nume: 'Tinkering', fel: 'facut', principala: true,
    descriere: 'Small machines that mostly work.',
    statie: 'Anvil', antrenor: 'antrenorInginerie', gata: true
  },
  tanning: {
    id: 'tanning', nume: 'Tanning', fel: 'facut', principala: true,
    descriere: 'Turning raw hide into leather that lasts.',
    statie: null, antrenor: 'antrenorPielarie', gata: true
  },
  weaving: {
    id: 'weaving', nume: 'Weaving', fel: 'facut', principala: true,
    descriere: 'Cloth, thread and everything cut from them.',
    statie: null, antrenor: 'antrenorCroitorie', gata: true
  },

  // ---- de pe langa casa, fara limita de numar ----
  cookery: {
    id: 'cookery', nume: 'Cookery', fel: 'langaCasa', principala: false,
    descriere: 'Food that keeps you standing longer. Needs a cookfire.',
    statie: 'Cookfire', antrenor: 'antrenorGatit', gata: true
  },
  bandaging: {
    id: 'bandaging', nume: 'Bandaging', fel: 'langaCasa', principala: false,
    descriere: 'Cloth bindings that close a wound while you walk.',
    statie: null, antrenor: 'antrenorPrimAjutor', gata: true
  },
  angling: {
    id: 'angling', nume: 'Angling', fel: 'langaCasa', principala: false,
    descriere: 'Standing at the water with a line in it.',
    unealta: 'Fishing Rod', antrenor: 'antrenorPescuit', gata: true,
    laApa: true
  }
};


const CATE_PRINCIPALE = 2;   // cel mult doua meserii principale


// ----------------------------------------------------------
//  UNELTELE
//
//  Trei meserii cer o unealta: mineritul un tarnacop, jupuitul un
//  cutit, pescuitul o undita. Culesul de plante nu cere nimic.
//
//  Unealta sta in rucsac si atat: n-o echipezi si n-o apesi. Se
//  cumpara de la antrenorul meseriei si de la negustorul de unelte
//  din oras. Nu se strica si nu se consuma - o cumperi o data.
// ----------------------------------------------------------
const UNELTE = {
  'Pick':           { nume: 'Pick',           valoare: 38 },
  'Flensing Knife': { nume: 'Flensing Knife', valoare: 30 },
  'Fishing Rod':    { nume: 'Fishing Rod',    valoare: 24 }
};


// Ce scrie sub numele uneltei in fereastra. Textul sta in texte.js,
// ca tot ce se vede pe ecran.
function descriereaUneltei(nume) {
  if (nume === 'Pick') return TEXT.TOOL_PICK;
  if (nume === 'Flensing Knife') return TEXT.TOOL_KNIFE;
  if (nume === 'Fishing Rod') return TEXT.TOOL_ROD;
  return '';
}


// Unealta ceruta de o meserie, sau null daca nu cere niciuna.
function uneltaMeseriei(id) {
  const m = MESERII[id];
  return (m && m.unealta) ? m.unealta : null;
}


// O ai in rucsac?
function aiUnealta(personajul, nume) {
  if (!nume) return true;                       // meseria nu cere nimic
  return (personajul.inventar || []).some(function (o) {
    return o && o.nume === nume;
  });
}


// Ce unealta iti lipseste ca sa lucrezi la meseria asta? null daca
// nu-ti lipseste nimic.
function uneltaCareItiLipseste(personajul, idMeserie) {
  const nume = uneltaMeseriei(idMeserie);
  return aiUnealta(personajul, nume) ? null : nume;
}


// ----------------------------------------------------------
//  CULORILE DE GREUTATE
//
//  Fiecare nod si fiecare reteta are patru praguri:
//    portocaliu - iti da SIGUR un punct
//    galben     - sansa scade lin catre gri
//    verde      - tot mai rar
//    gri        - nu mai inveti nimic de aici
//
//  Sansa intre galben si gri: (gri - skill) / (gri - galben)
// ----------------------------------------------------------
function culoareaGreutatii(praguri, skill) {
  if (skill >= praguri.gri) return 'gri';
  if (skill >= praguri.verde) return 'verde';
  if (skill >= praguri.galben) return 'galben';
  return 'portocaliu';
}

function sansaDePunct(praguri, skill) {
  if (skill >= praguri.gri) return 0;
  if (skill < praguri.galben) return 1;                     // portocaliu
  return (praguri.gri - skill) / (praguri.gri - praguri.galben);
}


// ----------------------------------------------------------
//  NODURILE DE PE HARTA
//
//  cheie      - cum se cheama in generator
//  material   - ce iti pune in rucsac
//  minim      - de la ce skill se poate atinge
//  praguri    - portocaliu / galben / verde / gri
//  culoare    - cum se vede pe harta si pe miniharta
//  cat        - cate bucati ies dintr-un nod
// ----------------------------------------------------------
const NODURI = {

  // ---- minereu (Delving) ----
  oreDull: {
    cheie: 'oreDull', meserie: 'delving', material: 'Dull Ore',
    minim: 1, praguri: { portocaliu: 1, galben: 25, verde: 50, gri: 100 },
    culoare: 0x9a9490, cat: [1, 2], valoare: 4
  },
  oreBright: {
    cheie: 'oreBright', meserie: 'delving', material: 'Bright Ore',
    minim: 65, praguri: { portocaliu: 65, galben: 90, verde: 115, gri: 165 },
    culoare: 0xd8c88a, cat: [1, 2], valoare: 12
  },
  oreDeep: {
    cheie: 'oreDeep', meserie: 'delving', material: 'Deep Ore',
    minim: 125, praguri: { portocaliu: 125, galben: 150, verde: 175, gri: 225 },
    culoare: 0x7c9ad0, cat: [1, 3], valoare: 26
  },
  oreRich: {
    cheie: 'oreRich', meserie: 'delving', material: 'Rich Ore',
    minim: 175, praguri: { portocaliu: 175, galben: 205, verde: 235, gri: 290 },
    culoare: 0xd07c9a, cat: [2, 3], valoare: 48
  },

  // ---- plante (Foraging) ----
  herbField: {
    cheie: 'herbField', meserie: 'foraging', material: 'Fieldleaf',
    minim: 1, praguri: { portocaliu: 1, galben: 25, verde: 50, gri: 100 },
    culoare: 0x8fc46a, cat: [1, 2], valoare: 4
  },
  herbNight: {
    cheie: 'herbNight', meserie: 'foraging', material: 'Nightbloom',
    minim: 70, praguri: { portocaliu: 70, galben: 95, verde: 120, gri: 170 },
    culoare: 0x9a6fd8, cat: [1, 2], valoare: 13
  },
  herbSilver: {
    cheie: 'herbSilver', meserie: 'foraging', material: 'Mistleaf',
    minim: 130, praguri: { portocaliu: 130, galben: 155, verde: 180, gri: 230 },
    culoare: 0xcfd6dc, cat: [1, 3], valoare: 27
  },
  herbEmber: {
    cheie: 'herbEmber', meserie: 'foraging', material: 'Emberroot',
    minim: 180, praguri: { portocaliu: 180, galben: 210, verde: 240, gri: 290 },
    culoare: 0xe8862f, cat: [2, 3], valoare: 50
  }
};


// Ce noduri are rost sa punem intr-o zona, dupa nivelul ei. O zona
// de inceput n-are de ce sa aiba minereu pe care nu-l poate atinge
// nimeni de nivelul ala.
function nodurilePotriviteZonei(nivelDeLa) {
  return Object.keys(NODURI).filter(function (cheie) {
    const n = NODURI[cheie];
    // Skill-ul creste cam de cinci ori mai repede decat nivelul.
    const skillPeAcolo = nivelDeLa * 5 + 10;
    return n.minim <= skillPeAcolo + 40;
  });
}


// Cat de des reapare un nod dupa ce l-ai cules.
const REAPARITIE_NOD = 180000;         // trei minute


// ----------------------------------------------------------
//  JUPUITUL
//
//  Skill-ul cerut de un cadavru, dupa nivelul fiarei. Regula ta:
//  pana la 10 e 1, intre 11 si 20 e (nivel-10) x 10, peste 20 e
//  nivel x 5.
// ----------------------------------------------------------
function skillDeJupuit(nivelFiara) {
  if (nivelFiara <= 10) return 1;
  if (nivelFiara <= 20) return (nivelFiara - 10) * 10;
  return nivelFiara * 5;
}


// Pragurile de culoare la jupuit se socotesc din skill-ul cerut.
function pragurileJupuitului(cerut) {
  return {
    portocaliu: cerut,
    galben: cerut + 10,
    verde: cerut + 25,
    gri: cerut + 50
  };
}


const PIELEA_DE_LA_FIARA = 'Raw Hide';


// ----------------------------------------------------------
//  CE STIE PERSONAJUL
//
//  personaj.meserii = {
//    delving: { skill: 42, treapta: 1 }
//  }
// ----------------------------------------------------------
function meseriileTale(personajul) {
  return personajul.meserii || {};
}

function aiMeseria(personajul, id) {
  return !!meseriileTale(personajul)[id];
}

function skillulTau(personajul, id) {
  const m = meseriileTale(personajul)[id];
  return m ? m.skill : 0;
}

function treaptaTa(personajul, id) {
  const m = meseriileTale(personajul)[id];
  return m ? m.treapta : 0;
}

// Plafonul de acum: cat te lasa treapta pe care esti.
function plafonulTau(personajul, id) {
  const t = TREPTE_MESERIE[treaptaTa(personajul, id) - 1];
  return t ? t.maxim : 0;
}


function catePrincipaleAi(personajul) {
  return Object.keys(meseriileTale(personajul)).filter(function (id) {
    return MESERII[id] && MESERII[id].principala;
  }).length;
}


// Poti lua meseria asta acum? Daca nu, spune de ce.
function potiLuaMeseria(personajul, id) {

  const m = MESERII[id];
  if (!m) return { poti: false, motiv: 'unknown' };
  if (!m.gata) return { poti: false, motiv: 'soon' };
  if (aiMeseria(personajul, id)) return { poti: false, motiv: 'known' };

  const t = TREPTE_MESERIE[0];
  if (personajul.nivel < t.nivel) {
    return { poti: false, motiv: 'level', nivel: t.nivel };
  }
  if (m.principala && catePrincipaleAi(personajul) >= CATE_PRINCIPALE) {
    return { poti: false, motiv: 'full' };
  }
  if ((personajul.bani || 0) < costulTreptei(1)) {
    return { poti: false, motiv: 'money', cost: costulTreptei(1) };
  }
  return { poti: true, cost: costulTreptei(1) };
}


function invataMeseria(personajul, id) {
  const se = potiLuaMeseria(personajul, id);
  if (!se.poti) return null;
  personajul.bani -= se.cost;
  personajul.meserii = personajul.meserii || {};
  personajul.meserii[id] = { skill: 1, treapta: 1 };
  return { meserie: MESERII[id], cost: se.cost };
}


// Treapta urmatoare, daca exista si daca o poti lua.
function urmatoareaTreapta(personajul, id) {

  if (!aiMeseria(personajul, id)) return null;

  const acum = treaptaTa(personajul, id);
  const t = TREPTE_MESERIE[acum];              // urmatoarea
  if (!t) return null;

  const cost = costulTreptei(t.nr);
  return {
    treapta: t, cost: cost,
    preaMic: personajul.nivel < t.nivel,
    faraBani: (personajul.bani || 0) < cost,
    // N-are rost sa cumperi treapta urmatoare cat mai ai loc pe asta.
    preaDevreme: skillulTau(personajul, id) < plafonulTau(personajul, id)
  };
}


function ridicaTreapta(personajul, id) {
  const u = urmatoareaTreapta(personajul, id);
  if (!u || u.preaMic || u.faraBani) return null;
  personajul.bani -= u.cost;
  personajul.meserii[id].treapta = u.treapta.nr;
  return u;
}


// Renuntarea: skill-ul se face zero si meseria dispare de tot.
function lasaMeseria(personajul, id) {
  if (!aiMeseria(personajul, id)) return false;
  delete personajul.meserii[id];
  return true;
}


// ----------------------------------------------------------
//  CRESTEREA SKILL-ULUI
//
//  Da inapoi true daca ai castigat un punct, ca sa se poata arata
//  pe ecran.
// ----------------------------------------------------------
function poateCresteSkillul(personajul, id, praguri) {
  const skill = skillulTau(personajul, id);
  if (skill >= plafonulTau(personajul, id)) return false;   // te opreste treapta
  return Math.random() < sansaDePunct(praguri, skill);
}


function adaugaSkill(personajul, id, praguri) {
  if (!poateCresteSkillul(personajul, id, praguri)) return false;
  personajul.meserii[id].skill += 1;
  return true;
}


// ----------------------------------------------------------
//  PESCUITUL
//
//  Nu are noduri pe harta: apa e peste tot unde e apa. Ce scoti
//  depinde de skill, si ce scoti se gateste.
// ----------------------------------------------------------
const PESTII = [
  { nume: 'Silver Minnow', minim: 1,   valoare: 5,
    praguri: { portocaliu: 1, galben: 30, verde: 55, gri: 100 } },
  { nume: 'Reed Carp',     minim: 50,  valoare: 14,
    praguri: { portocaliu: 50, galben: 80, verde: 105, gri: 150 } },
  { nume: 'Deepwater Pike', minim: 120, valoare: 34,
    praguri: { portocaliu: 120, galben: 150, verde: 175, gri: 220 } },
  { nume: 'Glass Eel',     minim: 200, valoare: 72,
    praguri: { portocaliu: 200, galben: 230, verde: 255, gri: 295 } }
];


// Ce prinzi acum: cel mai bun peste pe care il poate scoate skill-ul
// tau, dar nu de fiecare data - uneori iese unul mai marunt.
function pestelePrins(skill) {
  const potriviti = PESTII.filter(function (p) { return skill >= p.minim; });
  if (!potriviti.length) return PESTII[0];
  // Cu cat esti mai bun, cu atat mai des iese cel bun.
  const zar = Math.random();
  if (zar < 0.55) return potriviti[potriviti.length - 1];
  return potriviti[Math.floor(Math.random() * potriviti.length)];
}
