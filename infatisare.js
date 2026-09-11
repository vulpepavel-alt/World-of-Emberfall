// ==========================================================
//  CUM ARATA PERSONAJUL
//
//  Pana acum personajul era desenat de doua ori, in doua feluri:
//  o data in joc (din forme Phaser) si o data in meniu (din
//  casute HTML). Doua desene inseamna doua locuri de schimbat.
//
//  Aici e UN SINGUR desen. Functia de mai jos nu deseneaza
//  nimic - doar intoarce o lista de forme:
//
//     { fel: 'dr', x: 0, y: 2, w: 18, h: 19, culoare: '#3355cc' }
//
//  Jocul citeste lista si face dreptunghiuri Phaser. Meniul
//  citeste aceeasi lista si face casute HTML. Amandoua arata la
//  fel, si orice schimbare se face intr-un singur loc.
//
//  Masurile sunt in "pasi de joc": 0 e mijlocul personajului,
//  y mai mic inseamna mai sus. Corpul tine de la -24 (parul) pana
//  la +23 (talpile).
// ==========================================================


// ----------------------------------------------------------
//  Culori scrise ca text ('#3355cc'), ca sa le inteleaga si
//  jocul, si meniul. Mai deschis / mai inchis cu cat vrem.
// ----------------------------------------------------------
function nuanta(text, cat) {
  const n = parseInt(text.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + cat));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + cat));
  const b = Math.max(0, Math.min(255, (n & 255) + cat));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}


// ----------------------------------------------------------
//  Din ce e facut echipamentul
//
//  Fiecare raritate are alt metal, ca sa se vada din prima ce
//  ai pe tine: fier ruginit, bronz, otel albastrui, iar la Epic
//  un violet inchis cu auriu. "Marimea" spune cat de incarcata
//  e piesa: umeri mai lati, coif cu creasta, pelerina mai lunga.
// ----------------------------------------------------------
const MATERIALE = {
  comun:    { baza: '#7a7168', lumina: '#9c9288', umbra: '#4c4640', ornament: '#8b7d5f', marime: 0 },
  bun:      { baza: '#7d6a3c', lumina: '#a88f52', umbra: '#4d4124', ornament: '#d9c17b', marime: 1 },
  rar:      { baza: '#5c718f', lumina: '#8098bb', umbra: '#38455a', ornament: '#d9c07a', marime: 2 },
  maiestru: { baza: '#4b3a63', lumina: '#6f5790', umbra: '#2b2038', ornament: '#e6c669', marime: 3 }
};


// Ce material are piesa dintr-un slot. Intoarce null daca slotul
// e gol, iar atunci desenul foloseste culoarea clasei sau pielea.
function materialul(p, idSlot) {
  const obiect = (p.echipament || {})[idSlot];
  if (!obiect) return null;
  return MATERIALE[obiect.raritate] || MATERIALE.comun;
}


// ----------------------------------------------------------
//  Lista de forme din care e facut personajul
//
//  Ordinea conteaza: ce e scris primul se deseneaza dedesubt.
//  optiuni.cuArma = false cand jocul isi tine singur arma
//  (in joc arma se misca atunci cand lovesti, deci sta separat).
// ----------------------------------------------------------
function formePersonaj(p, optiuni) {

  optiuni = optiuni || {};
  const cuArma = optiuni.cuArma !== false;

  const pielea = p.aspect.piele;
  const parul  = p.aspect.par;
  const clasa  = p.culoareClasa;
  const forme  = [];

  // ---- masurile trupului, dupa sex ----
  //
  // Nu doua desene separate: acelasi desen, cu alte masuri. O femeie
  // are trupul mai ingust si talia stransa, umerii mai mici si
  // picioarele putin mai subtiri. Restul - armura, arma, parul -
  // merge exact la fel, deci fiecare piesa de echipament pe care o
  // pui se vede pe amandoua.
  const eaEste = (p.aspect.sex === 'femeie');

  // Trupul se face din felii orizontale: latime si inaltime pentru
  // fiecare. La un barbat sunt doua felii de aceeasi latime, deci
  // iese un trunchi drept. La o femeie sunt trei - piept, talie
  // stransa, solduri - si de aceea silueta se vede altfel dintr-o
  // privire, nu doar "putin mai ingusta".
  const T = eaEste
    ? { felii: [ { w: 15, y: -1.5, h: 9 },     // piept
                 { w: 10, y:  7,   h: 5 },     // talia
                 { w: 15, y: 12,   h: 5 } ],   // soldurile
        talie: 10, umar: 3.2, brat: 2.6, picior: 5.2, latUmeri: -1.5 }
    : { felii: [ { w: 18, y: -0.5, h: 12 },
                 { w: 18, y:  9,   h: 8 } ],
        talie: 18, umar: 4, brat: 3, picior: 6, latUmeri: 0 };

  const mCap    = materialul(p, 'cap');
  const mUmeri  = materialul(p, 'umeri');
  const mSpate  = materialul(p, 'spate');
  const mPiept  = materialul(p, 'piept');
  const mBrau   = materialul(p, 'brau');
  const mManusi = materialul(p, 'maini');
  const mPicioare = materialul(p, 'picioare');
  const mTalpi  = materialul(p, 'talpi');
  const mGat    = materialul(p, 'gat');
  const mScut   = materialul(p, 'armaSecundara');
  const mInel   = materialul(p, 'inel1') || materialul(p, 'inel2');
  const mTalisman = materialul(p, 'talisman');

  function pune(f) { forme.push(f); }

  // ---- pelerina, in spatele tuturor ----
  if (mSpate) {
    // Iese in afara umerilor si trece de genunchi, ca sa se vada
    // ca ai pelerina si din fata, nu doar din spate.
    // Se vad doar marginile ei, de o parte si de alta a corpului,
    // plus gulerul de pe umeri. Daca am desena-o intreaga, ar
    // acoperi tot personajul si n-ai mai vedea nimic din rest.
    const lung = 26 + mSpate.marime * 2;
    const mijloc = -3 + lung / 2;
    pune({ fel: 'dr', x: -11.5, y: mijloc, w: 6, h: lung, culoare: mSpate.umbra });
    pune({ fel: 'dr', x:  11.5, y: mijloc, w: 6, h: lung, culoare: mSpate.umbra });
    pune({ fel: 'dr', x: -12,   y: mijloc, w: 4, h: lung - 2, culoare: mSpate.baza });
    pune({ fel: 'dr', x:  12,   y: mijloc, w: 4, h: lung - 2, culoare: mSpate.baza });
    pune({ fel: 'dr', x: 0, y: -6, w: 21, h: 4, culoare: mSpate.lumina });   // gulerul
  }

  // ---- picioarele ----
  const culPicioare = mPicioare ? mPicioare.baza : nuanta(clasa, -55);
  pune({ fel: 'dr', x: -3.6, y: 14, w: T.picior, h: 9, culoare: culPicioare });
  pune({ fel: 'dr', x:  3.6, y: 14, w: T.picior, h: 9, culoare: culPicioare });
  // genunchii, o dunga mai deschisa
  pune({ fel: 'dr', x: -4, y: 12, w: 6, h: 2,
         culoare: mPicioare ? mPicioare.lumina : nuanta(clasa, -30) });
  pune({ fel: 'dr', x:  4, y: 12, w: 6, h: 2,
         culoare: mPicioare ? mPicioare.lumina : nuanta(clasa, -30) });

  // ---- cizmele ----
  const culTalpi = mTalpi ? mTalpi.baza : '#2a2018';
  pune({ fel: 'dr', x: -4, y: 19, w: 7, h: 5, culoare: culTalpi });
  pune({ fel: 'dr', x:  4, y: 19, w: 7, h: 5, culoare: culTalpi });
  if (mTalpi) {
    pune({ fel: 'dr', x: -4, y: 16.5, w: 8, h: 2, culoare: mTalpi.ornament });
    pune({ fel: 'dr', x:  4, y: 16.5, w: 8, h: 2, culoare: mTalpi.ornament });
  }

  // ---- trupul, cu umbra pe stanga si lumina pe dreapta ----
  const culPiept = mPiept ? mPiept.baza : clasa;

  // Fiecare felie, cu umbra pe stanga si lumina pe dreapta.
  const culUmbra = mPiept ? mPiept.umbra : nuanta(clasa, -30);
  const culLumina = mPiept ? mPiept.lumina : nuanta(clasa, 25);

  T.felii.forEach(function (f) {
    pune({ fel: 'dr', x: 0, y: f.y, w: f.w, h: f.h, culoare: culPiept });
    pune({ fel: 'dr', x: -(f.w / 2 - 2), y: f.y, w: 4, h: f.h, culoare: culUmbra });
    pune({ fel: 'dr', x:  (f.w / 2 - 1), y: f.y, w: 2, h: f.h, culoare: culLumina });
  });
  if (mPiept) {
    // placa de pe piept si doua nituri
    pune({ fel: 'dr', x: 0, y: -1, w: 10, h: 8, culoare: mPiept.lumina });
    pune({ fel: 'cerc', x: -3, y: -1, r: 1.2, culoare: mPiept.ornament });
    pune({ fel: 'cerc', x:  3, y: -1, r: 1.2, culoare: mPiept.ornament });
  }

  // ---- bratele si mainile ----
  const culBrate = mPiept ? mPiept.umbra : nuanta(clasa, -18);
  const xBrat = 10 + T.latUmeri;
  pune({ fel: 'dr', x: -xBrat, y: 3, w: T.brat, h: 12, culoare: culBrate });
  pune({ fel: 'dr', x:  xBrat, y: 3, w: T.brat, h: 12, culoare: culBrate });
  const culMaini = mManusi ? mManusi.baza : pielea;
  pune({ fel: 'dr', x: -xBrat, y: 10, w: 4, h: 4, culoare: culMaini });
  pune({ fel: 'dr', x:  xBrat, y: 10, w: 4, h: 4, culoare: culMaini });
  // inelul: o sclipire mica pe mana dreapta
  if (mInel) pune({ fel: 'cerc', x: xBrat, y: 10, r: 1, culoare: mInel.ornament });

  // ---- cureaua ----
  pune({ fel: 'dr', x: 0, y: 8, w: T.talie, h: 3, culoare: mBrau ? mBrau.baza : '#2a2018' });
  pune({ fel: 'dr', x: 0, y: 8, w:  4, h: 3, culoare: mBrau ? mBrau.ornament : '#b08d3a' });
  // talismanul atarna de curea
  if (mTalisman) pune({ fel: 'cerc', x: -6, y: 9, r: 1.6, culoare: mTalisman.ornament });

  // ---- umerii ----
  const latUmar = mUmeri ? 5 + mUmeri.marime + T.latUmeri : T.umar;
  const inaltUmar = mUmeri ? 7 + mUmeri.marime : 7;
  const culUmeri = mUmeri ? mUmeri.baza : nuanta(clasa, 16);
  const xUmar = 9 + T.latUmeri;
  pune({ fel: 'dr', x: -xUmar, y: -4, w: latUmar, h: inaltUmar, culoare: culUmeri });
  pune({ fel: 'dr', x:  xUmar, y: -4, w: latUmar, h: inaltUmar, culoare: culUmeri });
  if (mUmeri) {
    pune({ fel: 'dr', x: -xUmar, y: -6, w: latUmar, h: 2, culoare: mUmeri.lumina });
    pune({ fel: 'dr', x:  xUmar, y: -6, w: latUmar, h: 2, culoare: mUmeri.lumina });
    if (mUmeri.marime >= 2) {
      pune({ fel: 'cerc', x: -xUmar, y: -3, r: 1.4, culoare: mUmeri.ornament });
      pune({ fel: 'cerc', x:  xUmar, y: -3, r: 1.4, culoare: mUmeri.ornament });
    }
  }

  // ---- lantul de la gat ----
  if (mGat) {
    pune({ fel: 'dr', x: 0, y: -5, w: 9, h: 1.5, culoare: mGat.ornament });
    pune({ fel: 'cerc', x: 0, y: -3, r: 1.6, culoare: mGat.lumina });
  }

  // ---- suvitele lungi stau IN SPATELE capului ----
  if (p.aspect.parStil === 'lung') {
    pune({ fel: 'dr', x: -8, y: -11, w: 4, h: 15, culoare: parul });
    pune({ fel: 'dr', x:  8, y: -11, w: 4, h: 15, culoare: parul });
  }

  // ---- gatul si capul ----
  pune({ fel: 'dr', x: 0, y: -7, w: 7, h: 5, culoare: nuanta(pielea, -25) });
  pune({ fel: 'cerc', x: 0, y: -14, r: 7.5, culoare: pielea });
  pune({ fel: 'dr', x: -5, y: -14, w: 3, h: 10, culoare: nuanta(pielea, -22) });

  // ---- ochii ----
  // Capul are raza 8, deci ochii trebuie sa ramana mici si
  // departati, altfel se lipesc intr-o pata neagra.
  if (p.aspect.fata === 'ingusta') {
    pune({ fel: 'dr', x: -3.5, y: -14, w: 3, h: 2, culoare: '#16120f' });
    pune({ fel: 'dr', x:  3.5, y: -14, w: 3, h: 2, culoare: '#16120f' });
  } else if (p.aspect.fata === 'lata') {
    pune({ fel: 'dr', x: -3.5, y: -15, w: 3, h: 4, culoare: '#16120f' });
    pune({ fel: 'dr', x:  3.5, y: -15, w: 3, h: 4, culoare: '#16120f' });
  } else {
    pune({ fel: 'dr', x: -3.5, y: -15, w: 2, h: 2, culoare: '#16120f' });
    pune({ fel: 'dr', x:  3.5, y: -15, w: 2, h: 2, culoare: '#16120f' });
  }

  // ---- barba ----
  if (p.aspect.barba === 'mustata') {
    pune({ fel: 'dr', x: 0, y: -10, w: 9, h: 2, culoare: parul });
  } else if (p.aspect.barba === 'barba') {
    pune({ fel: 'dr', x: 0, y: -8, w: 12, h: 7, culoare: parul });
  }

  // ---- parul de deasupra ----
  if (p.aspect.parStil === 'tepi') {
    pune({ fel: 'dr', x:  0, y: -20, w: 16, h: 4, culoare: parul });
    pune({ fel: 'dr', x: -5, y: -24, w:  3, h: 5, culoare: parul });
    pune({ fel: 'dr', x:  0, y: -25, w:  3, h: 6, culoare: parul });
    pune({ fel: 'dr', x:  5, y: -24, w:  3, h: 5, culoare: parul });
  } else if (p.aspect.parStil !== 'chel') {
    pune({ fel: 'dr', x: 0, y: -19, w: 16, h: 6, culoare: parul });
    pune({ fel: 'dr', x: 0, y: -21, w: 12, h: 3, culoare: nuanta(parul, 18) });
  }

  // ---- coiful, peste par ----
  if (mCap) {
    pune({ fel: 'dr', x: 0, y: -18.5, w: 16, h: 5, culoare: mCap.baza });   // banda de pe frunte
    pune({ fel: 'dr', x: 0, y: -22,   w: 13, h: 5, culoare: mCap.lumina }); // calota
    pune({ fel: 'dr', x: 0, y: -16.5, w: 16, h: 1.5, culoare: mCap.ornament });
    if (mCap.marime >= 2) {
      pune({ fel: 'dr', x: 0, y: -25, w: 3, h: 6, culoare: mCap.ornament }); // creasta
    }
    if (mCap.marime >= 3) {
      pune({ fel: 'dr', x: -8.5, y: -22, w: 3, h: 7, culoare: mCap.ornament }); // coarne
      pune({ fel: 'dr', x:  8.5, y: -22, w: 3, h: 7, culoare: mCap.ornament });
    }
  }

  // ---- scutul din mana stanga ----
  if (optiuni.cuScut !== false) {
    formeScut(p).forEach(function (f) {
      pune({ fel: f.fel, x: f.x - 14, y: f.y + 5, w: f.w, h: f.h, r: f.r, culoare: f.culoare });
    });
  }

  // ---- arma din mana dreapta ----
  if (cuArma) {
    formeArma(p).forEach(function (f) {
      pune({ fel: f.fel, x: f.x + 16, y: f.y + 5, w: f.w, h: f.h, r: f.r, culoare: f.culoare });
    });
  }

  return forme;
}


// ----------------------------------------------------------
//  Scutul
//
//  Se vede doar daca ai ceva echipat in "Off Hand". Formele se
//  intorc in jurul lui zero, ca sa poata fi asezate oriunde.
// ----------------------------------------------------------
function formeScut(p) {
  const m = materialul(p, 'armaSecundara');
  if (!m) return [];
  return [
    { fel: 'dr', x: 0, y: 0, w: 9, h: 13, culoare: m.umbra },
    { fel: 'dr', x: 0, y: 0, w: 6, h: 10, culoare: m.baza },
    { fel: 'cerc', x: 0, y: 0, r: 2, culoare: m.ornament }
  ];
}


// ----------------------------------------------------------
//  Arma
//
//  Forma vine din clasa (sabie, arc, toiag, buzdugan), dar
//  metalul vine din ce ai echipat in "Main Hand". Daca n-ai
//  nimic echipat, ramane arma simpla de la inceput.
// ----------------------------------------------------------
const FORMA_ARMA_CLASA = {
  warrior: 'sabie',
  hunter:  'arc',
  mage:    'toiag',
  priest:  'toiag'
};

function formeArma(p) {

  const m = materialul(p, 'armaPrincipala');
  const forma = FORMA_ARMA_CLASA[p.idClasa] || 'sabie';
  const forme = [];

  if (forma === 'arc') {
    const lemn = m ? m.baza : '#7d5735';
    forme.push({ fel: 'dr', x: 0, y: 0, w: 2, h: 26, culoare: m ? m.ornament : '#e8e2d4' });
    forme.push({ fel: 'dr', x: 3, y: -10, w: 4, h: 9, culoare: nuanta(lemn, -20) });
    forme.push({ fel: 'dr', x: 5, y: 0, w: 4, h: 12, culoare: lemn });
    forme.push({ fel: 'dr', x: 3, y: 10, w: 4, h: 9, culoare: nuanta(lemn, -20) });
    return forme;
  }

  if (forma === 'toiag') {
    forme.push({ fel: 'dr', x: 0, y: 3, w: 4, h: 30, culoare: m ? m.umbra : '#6a6152' });
    forme.push({ fel: 'cerc', x: 0, y: -13, r: 6, culoare: m ? m.baza : '#2f6fd0' });
    forme.push({ fel: 'cerc', x: 0, y: -13, r: 3, culoare: m ? m.ornament : '#bfe6ff' });
    return forme;
  }

  // sabie
  forme.push({ fel: 'dr', x: 0, y: 0, w: 4, h: 9, culoare: '#5b3a1a' });
  forme.push({ fel: 'dr', x: 0, y: -5, w: 12, h: 3, culoare: m ? m.ornament : '#b08d3a' });
  forme.push({ fel: 'dr', x: 0, y: -15, w: 5, h: 20, culoare: m ? m.lumina : '#d8d8e0' });
  return forme;
}


// ==========================================================
//  ICOANELE OBIECTELOR
//
//  In rucsac obiectele nu mai sunt doar niste patrate colorate:
//  fiecare are desenul lui, dupa slotul in care intra. Coif,
//  sabie, cizma, inel - se vede dintr-o privire ce e.
//
//  Formele se socotesc intr-un patrat de 16 pe 16, ca sa poata fi
//  marite la orice masura. Metalul vine din raritate, deci un
//  coif Epic e violet cu auriu, iar unul Common e gri.
// ==========================================================
const ICOANA_LATURA = 16;

function formeIcoana(obiect) {

  // Vechiturile n-au slot: le desenam ca o legaturica de carpe.
  if (obiect.vechitura) {
    return [
      { x: 3, y: 6, w: 10, h: 7, c: '#6b6259' },
      { x: 4, y: 4, w: 8,  h: 3, c: '#847a6f' },
      { x: 6, y: 2, w: 4,  h: 3, c: '#5a524a' },
      { x: 3, y: 11, w: 10, h: 2, c: '#443e38' },
      { x: 5, y: 7, w: 2,  h: 2, c: '#9d9d9d' }
    ];
  }

  const m = MATERIALE[obiect.raritate] || MATERIALE.comun;
  const b = m.baza, l = m.lumina, u = m.umbra, o = m.ornament;

  switch (obiect.slot) {

    case 'cap':   // coif: calota si banda de pe frunte
      return [
        { x: 3, y: 4, w: 10, h: 7, c: b },
        { x: 4, y: 3, w: 8,  h: 2, c: l },
        { x: 2, y: 10, w: 12, h: 2, c: o },
        { x: 5, y: 6, w: 6,  h: 3, c: u }
      ];

    case 'gat':   // amuleta: lant si piatra
      return [
        { x: 3, y: 3, w: 2, h: 6, c: o },
        { x: 11, y: 3, w: 2, h: 6, c: o },
        { x: 5, y: 8, w: 6, h: 2, c: o },
        { x: 6, y: 9, w: 4, h: 4, c: l }
      ];

    case 'umeri': // doi umeri lati
      return [
        { x: 1, y: 5, w: 6, h: 6, c: b },
        { x: 9, y: 5, w: 6, h: 6, c: b },
        { x: 1, y: 4, w: 6, h: 2, c: l },
        { x: 9, y: 4, w: 6, h: 2, c: l },
        { x: 7, y: 6, w: 2, h: 5, c: u }
      ];

    case 'spate': // pelerina
      return [
        { x: 4, y: 2, w: 8,  h: 2, c: l },
        { x: 3, y: 4, w: 10, h: 9, c: b },
        { x: 3, y: 11, w: 10, h: 2, c: u }
      ];

    case 'piept': // platosa
      return [
        { x: 3, y: 3, w: 10, h: 10, c: b },
        { x: 2, y: 3, w: 3,  h: 4,  c: l },
        { x: 11, y: 3, w: 3, h: 4,  c: l },
        { x: 6, y: 5, w: 4,  h: 5,  c: o },
        { x: 3, y: 11, w: 10, h: 2, c: u }
      ];

    case 'incheieturi': // doua bratari
      return [
        { x: 2, y: 4, w: 5, h: 8, c: b },
        { x: 9, y: 4, w: 5, h: 8, c: b },
        { x: 2, y: 6, w: 5, h: 2, c: o },
        { x: 9, y: 6, w: 5, h: 2, c: o }
      ];

    case 'maini': // manusa
      return [
        { x: 4, y: 2, w: 2, h: 4, c: l },
        { x: 7, y: 1, w: 2, h: 5, c: l },
        { x: 10, y: 2, w: 2, h: 4, c: l },
        { x: 3, y: 5, w: 10, h: 7, c: b },
        { x: 3, y: 9, w: 10, h: 2, c: o }
      ];

    case 'brau': // curea cu catarama
      return [
        { x: 1, y: 6, w: 14, h: 4, c: b },
        { x: 1, y: 6, w: 14, h: 1, c: l },
        { x: 6, y: 5, w: 4,  h: 6, c: o },
        { x: 7, y: 7, w: 2,  h: 2, c: u }
      ];

    case 'picioare': // doua pulpane
      return [
        { x: 3, y: 2, w: 10, h: 4, c: b },
        { x: 3, y: 6, w: 4,  h: 8, c: b },
        { x: 9, y: 6, w: 4,  h: 8, c: b },
        { x: 3, y: 2, w: 10, h: 1, c: l },
        { x: 3, y: 7, w: 4,  h: 1, c: o },
        { x: 9, y: 7, w: 4,  h: 1, c: o }
      ];

    case 'talpi': // cizma
      return [
        { x: 4, y: 2, w: 6, h: 8, c: b },
        { x: 4, y: 2, w: 2, h: 8, c: l },
        { x: 2, y: 10, w: 12, h: 3, c: u },
        { x: 4, y: 6, w: 6, h: 1, c: o }
      ];

    case 'inel1':
    case 'inel2': // inel cu piatra
      return [
        { x: 4, y: 6, w: 8, h: 2, c: o },
        { x: 4, y: 10, w: 8, h: 2, c: o },
        { x: 3, y: 7, w: 2, h: 4, c: o },
        { x: 11, y: 7, w: 2, h: 4, c: o },
        { x: 6, y: 3, w: 4, h: 4, c: l }
      ];

    case 'talisman': // talisman cu snur
      return [
        { x: 7, y: 1, w: 2, h: 4, c: u },
        { x: 4, y: 5, w: 8, h: 8, c: b },
        { x: 6, y: 7, w: 4, h: 4, c: o }
      ];

    case 'armaPrincipala': // sabie, pe diagonala
      return [
        { x: 6, y: 1, w: 4, h: 9, c: l },
        { x: 7, y: 1, w: 2, h: 9, c: b },
        { x: 3, y: 10, w: 10, h: 2, c: o },
        { x: 7, y: 12, w: 2, h: 3, c: u }
      ];

    default:      // scut
      return [
        { x: 3, y: 2, w: 10, h: 7, c: b },
        { x: 5, y: 9, w: 6,  h: 3, c: b },
        { x: 7, y: 12, w: 2, h: 2, c: b },
        { x: 3, y: 2, w: 10, h: 2, c: l },
        { x: 6, y: 5, w: 4,  h: 4, c: o }
      ];
  }
}


// Icoana ca HTML, intr-un patrat de "latura" pixeli.
function htmlIcoana(obiect, latura) {
  const pas = latura / ICOANA_LATURA;
  let html = '';
  formeIcoana(obiect).forEach(function (f) {
    html += '<i style="position:absolute;left:' + (f.x * pas).toFixed(1) +
            'px;top:' + (f.y * pas).toFixed(1) +
            'px;width:' + (f.w * pas).toFixed(1) +
            'px;height:' + (f.h * pas).toFixed(1) +
            'px;background:' + f.c + '"></i>';
  });
  return html;
}
