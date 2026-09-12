// ==========================================================
//  ICONITELE OBIECTELOR
//
//  Fiecare obiect are un desen de 16 pe 16, facut din dreptunghiuri
//  - la fel ca personajele si ca inamicii. Nicio poza, niciun
//  fisier: tot ce se vede e scris aici in cifre.
//
//  Pana acum desenul se alegea DUPA SLOT, deci o sabie si un topor
//  aratau identic, iar minereul, poitunea, tarnacopul si foaia de
//  reteta erau toate aceeasi legaturica de carpe.
//
//  Acum se alege dupa CE ESTE lucrul:
//    - arma, dupa felul ei (sase desene)
//    - armura, dupa slot SI dupa din ce e facuta (panza, piele,
//      zale, placi) - o gluga de panza nu seamana cu un coif
//    - podoabele si pelerina, fiecare cu desenul lui
//    - materialele, uneltele, poitunile si retetele, fiecare altfel
//
//  CULORILE nu sunt scrise in desen. Desenul spune doar "aici baza,
//  aici lumina, aici umbra, aici ornament", iar culorile vin din
//  treapta de material a obiectului (Dull, Bright, ... Ember) si
//  din raritatea lui. Asa acelasi desen arata altfel la nivelul 5
//  si la nivelul 55, fara sa-l desenam de doua ori.
// ==========================================================


// ---- Culorile, pe treapta de material si pe clasa de armura ----
//
// Metalul ia culorile treptei. Panza si pielea au ale lor: o roba
// nu trebuie sa arate ca o platosa doar fiindca e de acelasi nivel.
const CULORI_PANZA = [
  { baza: '#6d6558', lumina: '#8b8272', umbra: '#443f37' },
  { baza: '#7a6f8c', lumina: '#9a8ead', umbra: '#4b4456' },
  { baza: '#4f6b74', lumina: '#6e8f99', umbra: '#31434a' },
  { baza: '#8a5f43', lumina: '#ad7d5c', umbra: '#553a29' },
  { baza: '#53588f', lumina: '#7278b5', umbra: '#333658' },
  { baza: '#8c3f4a', lumina: '#b35d68', umbra: '#55262d' }
];

const CULORI_PIELE = [
  { baza: '#6b5540', lumina: '#8a7055', umbra: '#433527' },
  { baza: '#7a6244', lumina: '#9c7f5c', umbra: '#4b3c2a' },
  { baza: '#5f5142', lumina: '#7d6c59', umbra: '#3b3229' },
  { baza: '#87653c', lumina: '#ab8452', umbra: '#533e25' },
  { baza: '#4f4436', lumina: '#6b5d4a', umbra: '#302a21' },
  { baza: '#7d4a2e', lumina: '#a2653f', umbra: '#4c2c1c' }
];


function treaptaDupaNume(nume) {
  for (let i = 0; i < TREPTE_MATERIAL.length; i++) {
    if (TREPTE_MATERIAL[i].nume === nume) return i;
  }
  return 0;
}


// Cele patru culori cu care se deseneaza obiectul asta.
function culorileObiectului(obiect) {

  const i = treaptaDupaNume(obiect.treapta);
  const metal = TREPTE_MATERIAL[i] || TREPTE_MATERIAL[0];

  let set = { baza: metal.baza, lumina: metal.lumina, umbra: metal.umbra };
  if (obiect.felArmura === 'panza') set = CULORI_PANZA[i] || CULORI_PANZA[0];
  if (obiect.felArmura === 'piele') set = CULORI_PIELE[i] || CULORI_PIELE[0];

  // Ornamentul vine din RARITATE, nu din material: asa vezi dintr-o
  // privire si cat de vechi e lucrul, si cat de bun.
  const rar = (typeof MATERIALE !== 'undefined' && MATERIALE[obiect.raritate])
    ? MATERIALE[obiect.raritate] : null;

  return {
    b: set.baza,
    l: set.lumina,
    u: set.umbra,
    o: rar ? rar.ornament : metal.ornament
  };
}


// ==========================================================
//  ARMELE - sase desene
// ==========================================================
function desenArma(fel, c) {
  switch (fel) {

    case 'topor':   // coada lunga, tais lat intr-o parte
      return [
        { x: 7,  y: 2,  w: 2,  h: 12, c: c.u },
        { x: 7,  y: 2,  w: 1,  h: 12, c: c.l },
        { x: 9,  y: 2,  w: 5,  h: 6,  c: c.b },
        { x: 12, y: 2,  w: 2,  h: 6,  c: c.l },
        { x: 9,  y: 1,  w: 4,  h: 1,  c: c.o },
        { x: 6,  y: 13, w: 4,  h: 2,  c: c.o }
      ];

    case 'buzdugan':  // coada scurta, cap greu si patrat
      return [
        { x: 7,  y: 6,  w: 2,  h: 9,  c: c.u },
        { x: 5,  y: 1,  w: 6,  h: 6,  c: c.b },
        { x: 5,  y: 1,  w: 6,  h: 2,  c: c.l },
        { x: 4,  y: 3,  w: 1,  h: 2,  c: c.o },
        { x: 11, y: 3,  w: 1,  h: 2,  c: c.o },
        { x: 6,  y: 13, w: 4,  h: 2,  c: c.o }
      ];

    case 'pumnal':  // scurt si indesat: lama groasa, garda lata,
                    // maner mare. Prima data semana cu o sabie mica
                    // si nu se putea deosebi de ea dintr-o privire.
      return [
        { x: 6,  y: 5,  w: 4,  h: 5,  c: c.l },
        { x: 8,  y: 5,  w: 2,  h: 5,  c: c.b },
        { x: 7,  y: 3,  w: 2,  h: 2,  c: c.l },
        { x: 3,  y: 10, w: 10, h: 2,  c: c.o },
        { x: 6,  y: 12, w: 4,  h: 3,  c: c.u },
        { x: 5,  y: 14, w: 6,  h: 1,  c: c.o }
      ];

    case 'toiag':   // bat lung cu piatra in varf
      return [
        { x: 7,  y: 4,  w: 2,  h: 11, c: c.u },
        { x: 7,  y: 4,  w: 1,  h: 11, c: c.b },
        { x: 6,  y: 1,  w: 4,  h: 4,  c: c.o },
        { x: 7,  y: 2,  w: 2,  h: 2,  c: c.l },
        { x: 6,  y: 8,  w: 4,  h: 1,  c: c.o }
      ];

    case 'arc':     // lemn curbat si coarda
      return [
        { x: 4,  y: 2,  w: 2,  h: 3,  c: c.b },
        { x: 3,  y: 5,  w: 2,  h: 6,  c: c.b },
        { x: 4,  y: 11, w: 2,  h: 3,  c: c.b },
        { x: 5,  y: 1,  w: 2,  h: 2,  c: c.o },
        { x: 5,  y: 13, w: 2,  h: 2,  c: c.o },
        { x: 7,  y: 2,  w: 1,  h: 12, c: c.l }
      ];

    default:        // sabie: lama dreapta, garda lata
      return [
        { x: 7,  y: 1,  w: 2,  h: 9,  c: c.l },
        { x: 8,  y: 1,  w: 1,  h: 9,  c: c.b },
        { x: 7,  y: 1,  w: 2,  h: 1,  c: c.o },
        { x: 4,  y: 10, w: 8,  h: 2,  c: c.o },
        { x: 7,  y: 12, w: 2,  h: 3,  c: c.u },
        { x: 6,  y: 14, w: 4,  h: 1,  c: c.o }
      ];
  }
}


// ==========================================================
//  ARMURA - acelasi slot arata altfel dupa din ce e facut
//
//  Regula de desen, ca sa se citeasca dintr-o privire:
//    panza - moale, cade in jos, fara margini drepte
//    piele - curele si custuri
//    zale  - tesatura de inele, punctata
//    placi - bucati mari, drepte, cu tinte
// ==========================================================
function desenArmura(slot, fel, c) {

  const panza = (fel === 'panza'), piele = (fel === 'piele');
  const placi = (fel === 'placi');

  switch (slot) {

    case 'cap':
      if (panza) return [                       // gluga cu varf
        { x: 7, y: 0,  w: 2,  h: 3, c: c.l },
        { x: 5, y: 2,  w: 6,  h: 3, c: c.l },
        { x: 3, y: 4,  w: 10, h: 6, c: c.b },
        { x: 5, y: 7,  w: 6,  h: 4, c: c.u },
        { x: 2, y: 10, w: 12, h: 3, c: c.b },
        { x: 2, y: 12, w: 12, h: 1, c: c.o }
      ];
      if (piele) return [                       // capelina cu boruri
        { x: 4, y: 3, w: 8,  h: 6, c: c.b },
        { x: 5, y: 2, w: 6,  h: 2, c: c.l },
        { x: 2, y: 9, w: 12, h: 2, c: c.u },
        { x: 6, y: 5, w: 4,  h: 2, c: c.o }
      ];
      if (placi) return [                       // coif inchis cu creasta
        { x: 3, y: 3, w: 10, h: 8, c: c.b },
        { x: 4, y: 2, w: 8,  h: 2, c: c.l },
        { x: 7, y: 1, w: 2,  h: 3, c: c.o },
        { x: 4, y: 7, w: 8,  h: 2, c: c.u },
        { x: 5, y: 8, w: 2,  h: 1, c: c.o },
        { x: 9, y: 8, w: 2,  h: 1, c: c.o },
        { x: 2, y: 11, w: 12, h: 2, c: c.b }
      ];
      return [                                  // coif de zale
        { x: 3, y: 4, w: 10, h: 7, c: c.b },
        { x: 4, y: 3, w: 8,  h: 2, c: c.l },
        { x: 2, y: 10, w: 12, h: 2, c: c.o },
        { x: 5, y: 6, w: 2,  h: 2, c: c.u },
        { x: 9, y: 6, w: 2,  h: 2, c: c.u }
      ];

    case 'umeri':
      if (panza) return [                       // mantie moale pe umeri
        { x: 2, y: 5, w: 12, h: 3, c: c.b },
        { x: 2, y: 4, w: 12, h: 2, c: c.l },
        { x: 3, y: 8, w: 4,  h: 4, c: c.b },
        { x: 9, y: 8, w: 4,  h: 4, c: c.b }
      ];
      if (placi) return [                       // doi umeri mari cu tinte
        { x: 0, y: 4, w: 7,  h: 7, c: c.b },
        { x: 9, y: 4, w: 7,  h: 7, c: c.b },
        { x: 0, y: 3, w: 7,  h: 2, c: c.l },
        { x: 9, y: 3, w: 7,  h: 2, c: c.l },
        { x: 2, y: 7, w: 2,  h: 2, c: c.o },
        { x: 12, y: 7, w: 2, h: 2, c: c.o },
        { x: 7, y: 6, w: 2,  h: 4, c: c.u }
      ];
      return [                                  // umeri obisnuiti
        { x: 1, y: 5, w: 6, h: 6, c: c.b },
        { x: 9, y: 5, w: 6, h: 6, c: c.b },
        { x: 1, y: 4, w: 6, h: 2, c: c.l },
        { x: 9, y: 4, w: 6, h: 2, c: c.l },
        { x: 7, y: 6, w: 2, h: 5, c: c.u },
        { x: 2, y: 8, w: 4, h: 1, c: c.o },
        { x: 10, y: 8, w: 4, h: 1, c: c.o }
      ];

    case 'piept':
      if (panza) return [                       // roba lunga
        { x: 5, y: 2, w: 6,  h: 3,  c: c.l },
        { x: 4, y: 5, w: 8,  h: 4,  c: c.b },
        { x: 3, y: 9, w: 10, h: 5,  c: c.b },
        { x: 7, y: 5, w: 2,  h: 9,  c: c.o },
        { x: 3, y: 13, w: 10, h: 1, c: c.u }
      ];
      if (piele) return [                       // vesta cu custuri
        { x: 3, y: 3, w: 10, h: 10, c: c.b },
        { x: 3, y: 3, w: 10, h: 2,  c: c.l },
        { x: 7, y: 5, w: 2,  h: 8,  c: c.u },
        { x: 4, y: 6, w: 1,  h: 1,  c: c.o },
        { x: 4, y: 9, w: 1,  h: 1,  c: c.o },
        { x: 11, y: 6, w: 1, h: 1,  c: c.o },
        { x: 11, y: 9, w: 1, h: 1,  c: c.o }
      ];
      if (placi) return [                       // platosa in doua bucati
        { x: 3, y: 3, w: 10, h: 10, c: c.b },
        { x: 2, y: 3, w: 3,  h: 5,  c: c.l },
        { x: 11, y: 3, w: 3, h: 5,  c: c.l },
        { x: 6, y: 4, w: 4,  h: 6,  c: c.o },
        { x: 4, y: 10, w: 8, h: 2,  c: c.u },
        { x: 3, y: 12, w: 10, h: 1, c: c.o }
      ];
      return [                                  // zale: punctata
        { x: 3, y: 3, w: 10, h: 10, c: c.b },
        { x: 3, y: 3, w: 10, h: 2,  c: c.l },
        { x: 4, y: 6, w: 2,  h: 2,  c: c.u },
        { x: 7, y: 6, w: 2,  h: 2,  c: c.u },
        { x: 10, y: 6, w: 2, h: 2,  c: c.u },
        { x: 5, y: 9, w: 2,  h: 2,  c: c.u },
        { x: 8, y: 9, w: 2,  h: 2,  c: c.u },
        { x: 5, y: 12, w: 6, h: 1,  c: c.o }
      ];

    case 'incheieturi':
      return [
        { x: 2, y: 4, w: 5, h: 8, c: c.b },
        { x: 9, y: 4, w: 5, h: 8, c: c.b },
        { x: 2, y: 4, w: 5, h: 1, c: c.l },
        { x: 9, y: 4, w: 5, h: 1, c: c.l },
        { x: 2, y: (placi ? 7 : 6), w: 5, h: 2, c: c.o },
        { x: 9, y: (placi ? 7 : 6), w: 5, h: 2, c: c.o }
      ];

    case 'maini':
      if (panza) return [                       // manusa moale
        { x: 4, y: 3, w: 8,  h: 8, c: c.b },
        { x: 4, y: 3, w: 8,  h: 2, c: c.l },
        { x: 4, y: 11, w: 8, h: 2, c: c.o },
        { x: 6, y: 6, w: 4,  h: 3, c: c.u }
      ];
      if (placi) return [                       // manusa de fier cu degete
        { x: 4, y: 1, w: 2,  h: 5, c: c.l },
        { x: 7, y: 0, w: 2,  h: 6, c: c.l },
        { x: 10, y: 1, w: 2, h: 5, c: c.l },
        { x: 3, y: 6, w: 10, h: 6, c: c.b },
        { x: 3, y: 8, w: 10, h: 1, c: c.o },
        { x: 3, y: 12, w: 10, h: 2, c: c.u },
        { x: 6, y: 9, w: 4,  h: 2, c: c.o }
      ];
      return [
        { x: 4, y: 2, w: 2,  h: 4, c: c.l },
        { x: 7, y: 1, w: 2,  h: 5, c: c.l },
        { x: 10, y: 2, w: 2, h: 4, c: c.l },
        { x: 3, y: 5, w: 10, h: 7, c: c.b },
        { x: 3, y: 9, w: 10, h: 2, c: c.o }
      ];

    case 'brau':
      return [
        { x: 1, y: 6, w: 14, h: 4, c: c.b },
        { x: 1, y: 6, w: 14, h: 1, c: c.l },
        { x: 6, y: 5, w: 4,  h: 6, c: c.o },
        { x: 7, y: 7, w: 2,  h: 2, c: c.u },
        { x: 2, y: 9, w: 3,  h: 1, c: c.u },
        { x: 11, y: 9, w: 3, h: 1, c: c.u }
      ];

    case 'picioare':
      if (panza) return [                       // pantaloni largi
        { x: 3, y: 2, w: 10, h: 3, c: c.l },
        { x: 2, y: 5, w: 5,  h: 9, c: c.b },
        { x: 9, y: 5, w: 5,  h: 9, c: c.b },
        { x: 2, y: 12, w: 5, h: 2, c: c.u },
        { x: 9, y: 12, w: 5, h: 2, c: c.u }
      ];
      if (placi) return [                       // pulpane de fier
        { x: 3, y: 2, w: 10, h: 4, c: c.b },
        { x: 3, y: 2, w: 10, h: 1, c: c.l },
        { x: 3, y: 6, w: 4,  h: 8, c: c.b },
        { x: 9, y: 6, w: 4,  h: 8, c: c.b },
        { x: 3, y: 8, w: 4,  h: 1, c: c.o },
        { x: 9, y: 8, w: 4,  h: 1, c: c.o },
        { x: 3, y: 11, w: 4, h: 1, c: c.o },
        { x: 9, y: 11, w: 4, h: 1, c: c.o }
      ];
      return [
        { x: 3, y: 2, w: 10, h: 4, c: c.b },
        { x: 3, y: 6, w: 4,  h: 8, c: c.b },
        { x: 9, y: 6, w: 4,  h: 8, c: c.b },
        { x: 3, y: 2, w: 10, h: 1, c: c.l },
        { x: 3, y: 7, w: 4,  h: 1, c: c.o },
        { x: 9, y: 7, w: 4,  h: 1, c: c.o }
      ];

    case 'talpi':
      // Toate trei sunt in forma de L: carambul in sus, laba
      // inainte. Prima data erau patrate si aratau a cutie.
      if (panza) return [                       // papuc moale, scurt
        { x: 4, y: 6,  w: 5,  h: 5, c: c.b },
        { x: 4, y: 6,  w: 5,  h: 1, c: c.l },
        { x: 4, y: 11, w: 9,  h: 2, c: c.b },
        { x: 11, y: 10, w: 2, h: 3, c: c.l },
        { x: 3, y: 13, w: 10, h: 1, c: c.u }
      ];
      if (placi) return [                       // sabaton greu, cu varf
        { x: 4, y: 1,  w: 6,  h: 9, c: c.b },
        { x: 4, y: 1,  w: 2,  h: 9, c: c.l },
        { x: 4, y: 4,  w: 6,  h: 1, c: c.o },
        { x: 4, y: 7,  w: 6,  h: 1, c: c.o },
        { x: 4, y: 10, w: 10, h: 3, c: c.b },
        { x: 12, y: 9, w: 2,  h: 4, c: c.l },
        { x: 2, y: 13, w: 12, h: 2, c: c.u },
        { x: 2, y: 15, w: 12, h: 1, c: c.o }
      ];
      return [                                  // cizma obisnuita
        { x: 4, y: 2,  w: 6,  h: 9, c: c.b },
        { x: 4, y: 2,  w: 2,  h: 9, c: c.l },
        { x: 4, y: 5,  w: 6,  h: 1, c: c.o },
        { x: 4, y: 11, w: 9,  h: 3, c: c.b },
        { x: 11, y: 10, w: 2, h: 4, c: c.l },
        { x: 3, y: 14, w: 11, h: 2, c: c.u }
      ];
  }

  return null;
}


// ==========================================================
//  PODOABELE, PELERINA SI SCUTUL
// ==========================================================
function desenPodoaba(slot, c) {
  switch (slot) {

    case 'spate':   // pelerina prinsa cu doua agrafe
      return [
        { x: 3, y: 2, w: 3,  h: 2, c: c.o },
        { x: 10, y: 2, w: 3, h: 2, c: c.o },
        { x: 4, y: 4, w: 8,  h: 4, c: c.l },
        { x: 3, y: 8, w: 10, h: 6, c: c.b },
        { x: 3, y: 13, w: 10, h: 1, c: c.u }
      ];

    case 'gat':     // lant cu piatra
      return [
        { x: 3, y: 2, w: 2, h: 6, c: c.o },
        { x: 11, y: 2, w: 2, h: 6, c: c.o },
        { x: 4, y: 7, w: 3, h: 2, c: c.o },
        { x: 9, y: 7, w: 3, h: 2, c: c.o },
        { x: 6, y: 8, w: 4, h: 5, c: c.l },
        { x: 7, y: 9, w: 2, h: 3, c: c.b }
      ];

    case 'inel1':
    case 'inel2':   // inel cu piatra sus
      return [
        { x: 4, y: 6,  w: 8, h: 2, c: c.o },
        { x: 4, y: 11, w: 8, h: 2, c: c.o },
        { x: 3, y: 7,  w: 2, h: 5, c: c.o },
        { x: 11, y: 7, w: 2, h: 5, c: c.o },
        { x: 6, y: 3,  w: 4, h: 4, c: c.l },
        { x: 7, y: 4,  w: 2, h: 2, c: c.b }
      ];

    case 'talisman': // amuleta pe snur
      return [
        { x: 7, y: 0, w: 2, h: 4, c: c.u },
        { x: 4, y: 4, w: 8, h: 9, c: c.b },
        { x: 4, y: 4, w: 8, h: 2, c: c.l },
        { x: 6, y: 7, w: 4, h: 4, c: c.o },
        { x: 7, y: 8, w: 2, h: 2, c: c.u }
      ];
  }
  return null;
}


function desenScut(c) {
  return [
    { x: 3, y: 2, w: 10, h: 7, c: c.b },
    { x: 5, y: 9, w: 6,  h: 3, c: c.b },
    { x: 7, y: 12, w: 2, h: 2, c: c.b },
    { x: 3, y: 2, w: 10, h: 2, c: c.l },
    { x: 3, y: 2, w: 2,  h: 7, c: c.l },
    { x: 6, y: 5, w: 4,  h: 4, c: c.o },
    { x: 7, y: 6, w: 2,  h: 2, c: c.u }
  ];
}


// ==========================================================
//  CE NU SE POARTA
//
//  Minereul, poitunea, tarnacopul si foaia de reteta aratau toate
//  la fel: o legaturica de carpe. Acum fiecare are desenul lui.
// ==========================================================
function desenLucru(obiect) {

  // ---- unealta ----
  if (obiect.unealta) {
    if (obiect.nume === 'Fishing Rod') return [
      { x: 2,  y: 12, w: 3,  h: 2,  c: '#6b4a28' },
      { x: 4,  y: 3,  w: 2,  h: 10, c: '#8a6236' },
      { x: 5,  y: 2,  w: 8,  h: 1,  c: '#c8c2b4' },
      { x: 12, y: 3,  w: 1,  h: 5,  c: '#d8dce4' },
      { x: 11, y: 8,  w: 3,  h: 2,  c: '#c2543f' }
    ];
    if (obiect.nume === 'Flensing Knife') return [
      { x: 6,  y: 2,  w: 3,  h: 7,  c: '#d8dce4' },
      { x: 8,  y: 2,  w: 1,  h: 7,  c: '#9aa0ab' },
      { x: 5,  y: 9,  w: 6,  h: 1,  c: '#c9a961' },
      { x: 7,  y: 10, w: 2,  h: 4,  c: '#6b4a28' }
    ];
    return [                                    // tarnacop
      { x: 7,  y: 5,  w: 2,  h: 10, c: '#6b4a28' },
      { x: 2,  y: 3,  w: 12, h: 2,  c: '#9aa0ab' },
      { x: 2,  y: 2,  w: 3,  h: 2,  c: '#d8dce4' },
      { x: 11, y: 2,  w: 3,  h: 2,  c: '#d8dce4' },
      { x: 6,  y: 4,  w: 4,  h: 2,  c: '#c9a961' }
    ];
  }

  // ---- foaia de reteta ----
  if (obiect.retetaDe) return [
    { x: 3, y: 2,  w: 10, h: 12, c: '#e0d7bd' },
    { x: 3, y: 2,  w: 10, h: 2,  c: '#f0e8d2' },
    { x: 5, y: 5,  w: 6,  h: 1,  c: '#8a7f66' },
    { x: 5, y: 7,  w: 6,  h: 1,  c: '#8a7f66' },
    { x: 5, y: 9,  w: 4,  h: 1,  c: '#8a7f66' },
    { x: 3, y: 13, w: 10, h: 1,  c: '#b3a789' },
    { x: 9, y: 10, w: 4,  h: 4,  c: '#a0508a' }
  ];

  // ---- ce se bea sau se mananca ----
  if (obiect.consumabil) {
    const ce = obiect.consumabil;
    const licoare = (ce.efect === 'mana') ? '#5f8fd0'
                  : (ce.efect === 'vindecare') ? '#c2413f'
                  : (ce.efect === 'alinare') ? '#d8c88a' : '#7ad07a';
    // Bandajul si mancarea nu-s sticle.
    if (ce.efect === 'alinare' && obiect.nume.indexOf('Bandage') >= 0) return [
      { x: 2, y: 5, w: 12, h: 6, c: '#e6ddc4' },
      { x: 2, y: 5, w: 12, h: 2, c: '#f2ecd8' },
      { x: 6, y: 4, w: 4,  h: 8, c: '#cfc3a2' },
      { x: 2, y: 10, w: 12, h: 1, c: '#b5a988' }
    ];
    return [
      { x: 6, y: 1,  w: 4,  h: 3,  c: '#9aa0ab' },
      { x: 5, y: 4,  w: 6,  h: 2,  c: '#c8c2b4' },
      { x: 4, y: 6,  w: 8,  h: 8,  c: licoare },
      { x: 5, y: 7,  w: 2,  h: 5,  c: '#ffffff', },
      { x: 4, y: 13, w: 8,  h: 1,  c: '#2f2a24' }
    ];
  }

  // ---- material de meserie ----
  if (obiect.material && !obiect.unealta) {
    const n = obiect.nume;
    if (n.indexOf('Ore') >= 0) return [         // bulgari de minereu
      { x: 2, y: 7,  w: 6, h: 6, c: '#6f6a62' },
      { x: 8, y: 5,  w: 6, h: 8, c: '#5c5850' },
      { x: 3, y: 8,  w: 2, h: 2, c: '#c9a961' },
      { x: 10, y: 7, w: 2, h: 2, c: '#c9a961' },
      { x: 9, y: 10, w: 2, h: 2, c: '#8fa8c0' }
    ];
    if (n.indexOf('Ingot') >= 0) return [       // lingouri stivuite
      { x: 2, y: 8,  w: 12, h: 4, c: '#8a8f96' },
      { x: 2, y: 8,  w: 12, h: 1, c: '#b3b8c0' },
      { x: 4, y: 4,  w: 8,  h: 4, c: '#9aa0ab' },
      { x: 4, y: 4,  w: 8,  h: 1, c: '#c2c7cf' },
      { x: 2, y: 12, w: 12, h: 1, c: '#5a5f66' }
    ];
    if (n.indexOf('Leather') >= 0 || n.indexOf('Hide') >= 0) return [
      { x: 3, y: 3,  w: 10, h: 10, c: '#7a6244' },
      { x: 3, y: 3,  w: 10, h: 2,  c: '#9c7f5c' },
      { x: 5, y: 6,  w: 6,  h: 1,  c: '#5a4630' },
      { x: 5, y: 9,  w: 6,  h: 1,  c: '#5a4630' }
    ];
    if (n.indexOf('Cloth') >= 0 || n.indexOf('Bolt') >= 0 ||
        n.indexOf('Wrapping') >= 0) return [
      { x: 2, y: 5,  w: 12, h: 7, c: '#c9bfa6' },
      { x: 2, y: 5,  w: 12, h: 2, c: '#ded4bb' },
      { x: 6, y: 5,  w: 1,  h: 7, c: '#a89d84' },
      { x: 10, y: 5, w: 1,  h: 7, c: '#a89d84' }
    ];
    if (n.indexOf('Dust') >= 0) return [        // praf stralucitor
      { x: 4, y: 8,  w: 8, h: 4, c: '#6f5790' },
      { x: 5, y: 6,  w: 2, h: 2, c: '#b08fd0' },
      { x: 9, y: 5,  w: 2, h: 2, c: '#d0b0e8' },
      { x: 7, y: 3,  w: 2, h: 2, c: '#e8d0f0' }
    ];
    // plante si peste si restul: o legaturica verde
    return [
      { x: 7, y: 8,  w: 2,  h: 6, c: '#5a7a3a' },
      { x: 3, y: 4,  w: 5,  h: 4, c: '#7aa04a' },
      { x: 8, y: 3,  w: 5,  h: 5, c: '#8fb85a' },
      { x: 5, y: 2,  w: 3,  h: 3, c: '#a8d070' },
      { x: 4, y: 12, w: 8,  h: 2, c: '#4a6330' }
    ];
  }

  // ---- vechitura de vandut ----
  return [
    { x: 3, y: 6,  w: 10, h: 7, c: '#6b6259' },
    { x: 4, y: 4,  w: 8,  h: 3, c: '#847a6f' },
    { x: 6, y: 2,  w: 4,  h: 3, c: '#5a524a' },
    { x: 3, y: 11, w: 10, h: 2, c: '#443e38' },
    { x: 5, y: 7,  w: 2,  h: 2, c: '#9d9d9d' }
  ];
}


// ==========================================================
//  Desenul unui obiect, oricare ar fi el
// ==========================================================
function formeleIconitei(obiect) {

  // Ce nu se poarta are desenele lui si nu tine de material.
  if (obiect.vechitura) return desenLucru(obiect);

  const c = culorileObiectului(obiect);

  if (obiect.arma) return desenArma(obiect.arma.fel, c);
  if (obiect.slot === 'armaSecundara') return desenScut(c);

  const armura = desenArmura(obiect.slot, obiect.felArmura, c);
  if (armura) return armura;

  const podoaba = desenPodoaba(obiect.slot, c);
  if (podoaba) return podoaba;

  return desenScut(c);
}
