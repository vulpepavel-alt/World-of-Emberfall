// ==========================================================
//  HARTA LUMII
//
//  Se deschide apasand pe miniharta din dreapta sus.
//
//  Are doua vederi, si treci de la una la alta din meniul de sus:
//
//    1. LUMEA INTREAGA - amandoua continentele deodata, desenate,
//       nu scrise intr-un tabel: fiecare zona are culoarea pamantului
//       ei, raul ei, padurea ei, si semne pentru ce e in ea (oras,
//       sat, mina, pestera, cetate). Drumurile dintre zone sunt
//       trase cu linie, iar corabia si zeppelinul cu linie punctata.
//
//    2. O SINGURA ZONA - harta ei adevarata, aceeasi pe care umbli,
//       micsorata ca sa incapa pe ecran, cu locurile insemnate.
//       Harta zonei se CONSTRUIESTE cand o ceri (dureaza vreo doua
//       zecimi de secunda) si pe urma se tine minte.
//
//  Pe harta NU apar inamicii. Harta e pentru drum - ca sa stii unde
//  sa te duci cand o misiune spune "the old mine" - nu ca sa vezi
//  unde e fiecare lup.
//
//  NU te teleporteaza nicaieri. Ca in WoW, te duci pe jos.
// ==========================================================

const ecranHarta = document.getElementById('ecran-harta');
const plansaHarta = document.getElementById('plansa-harta');
const detaliiZona = document.getElementById('detalii-zona');
const alegeHarta = document.getElementById('alege-harta');

// 'lume' sau id-ul unei zone
let ceAratam = 'lume';
let zonaAleasa = null;

// Hartile de zona desenate pana acum. Una are cateva sute de mii de
// pixeli, deci nu le tinem pe toate patruzeci - doar ultimele cateva.
const hartiFacute = {};
const ordineaHartilor = [];
const CATE_HARTI_TINEM = 6;


// ----------------------------------------------------------
//  Culori
// ----------------------------------------------------------
function culoareCss(n) {
  return '#' + ('000000' + (n >>> 0).toString(16)).slice(-6);
}

// Culoarea unei litere din terenul zonei ('.', 'T', 'W'...).
function culoareaLiterei(reteta, litera, deRezerva) {
  const f = reteta.teren[litera];
  return culoareCss(f ? f.culoare : deRezerva);
}

// Numar mereu acelasi pentru aceeasi zona, ca desenul sa nu joace
// de fiecare data cand deschizi harta.
function zarDinZona(reteta, adaos) {
  const n = Math.imul((reteta.samanta + adaos * 2654435761) | 0, 1597334677);
  return ((n >>> 8) % 10000) / 10000;
}


// ==========================================================
//  DESCHIDEREA
// ==========================================================
function deschideHarta() {
  if (!zona) return;
  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();
  if (typeof fereastraDeschisa !== 'undefined' && fereastraDeschisa) inchideFereastraDeschisa();

  ceAratam = 'lume';
  zonaAleasa = zona.id;
  ecranHarta.classList.remove('ascuns');
  faMeniulHartii();
  scrieHarta();
}


function inchideHarta() {
  ecranHarta.classList.add('ascuns');
}


// Meniul derulant de sus: lumea intreaga, apoi zonele pe continente.
function faMeniulHartii() {

  let html = '<option value="lume">' + TEXT.WHOLE_WORLD + '</option>';

  CONTINENTE.forEach(function (c) {
    html += '<optgroup label="' + c.nume + '">';
    zoneleContinentului(c.id).forEach(function (z) {
      html += '<option value="' + z.id + '">' + z.nume +
              '  (' + z.nivelDeLa + '–' + z.nivelPanaLa + ')' +
              (zona && z.id === zona.id ? '  ★' : '') + '</option>';
    });
    html += '</optgroup>';
  });

  alegeHarta.innerHTML = html;
  alegeHarta.value = ceAratam;
}


// Culoarea unei zone dupa cat de potrivita e pentru nivelul tau:
// verde = esti bun de ea, galben = e cam sus, rosu = te omoara,
// cenusiu = ai depasit-o demult.
function culoareaZonei(z) {
  const n = personaj.nivel;
  if (n < z.nivelDeLa - 2) return 'prea-tare';
  if (n < z.nivelDeLa)     return 'cam-tare';
  if (n <= z.nivelPanaLa)  return 'potrivita';
  if (n <= z.nivelPanaLa + 6) return 'usoara';
  return 'depasita';
}

const CULOAREA_NIVELULUI = {
  'prea-tare': '#e06a5a', 'cam-tare': '#e0c15a', 'potrivita': '#6fd06f',
  'usoara': '#9ac4e8', 'depasita': '#8d7a58'
};


function scrieHarta() {
  if (ceAratam === 'lume') deseneazaLumea();
  else arataZona(ceAratam);
  scrieDetaliile();
}


// ==========================================================
//  1. HARTA LUMII INTREGI
// ==========================================================
const CASUTA_LAT = 176;      // cat de lata e o zona pe harta lumii
const CASUTA_INALT = 132;
const MARGINE_LUME = 26;

// Unde sta fiecare zona pe panza, ca sa stim si unde ai apasat.
let casuteleLumii = [];

function deseneazaLumea() {

  const bucati = CONTINENTE.map(function (c) {
    const ale = zoneleContinentului(c.id);
    return {
      continent: c, ale: ale,
      maxC: Math.max.apply(null, ale.map(function (z) { return z.peHarta.c; })) + 1,
      maxR: Math.max.apply(null, ale.map(function (z) { return z.peHarta.r; })) + 1
    };
  });

  const lat = MARGINE_LUME * 2 +
              Math.max.apply(null, bucati.map(function (b) { return b.maxC; })) * CASUTA_LAT;

  let y = MARGINE_LUME;
  bucati.forEach(function (b) {
    b.sus = y + 30;
    y = b.sus + b.maxR * CASUTA_INALT + 34;
  });
  const inalt = y;

  const panza = document.createElement('canvas');
  panza.width = lat;
  panza.height = inalt;
  const g = panza.getContext('2d');

  // ---- marea ----
  g.fillStyle = '#123049';
  g.fillRect(0, 0, lat, inalt);
  g.strokeStyle = 'rgba(255,255,255,.05)';
  g.lineWidth = 1;
  for (let i = 0; i < inalt; i += 18) {
    g.beginPath();
    g.moveTo(0, i);
    for (let x = 0; x <= lat; x += 24) g.lineTo(x, i + Math.sin(x / 40 + i) * 3);
    g.stroke();
  }

  casuteleLumii = [];

  bucati.forEach(function (b) {

    // ---- numele continentului ----
    g.fillStyle = '#d9b555';
    g.font = '600 26px Georgia, serif';
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(b.continent.nume, MARGINE_LUME, b.sus - 9);

    // ---- tarmul: o margine neregulata in jurul intregului continent ----
    const x0 = MARGINE_LUME, y0 = b.sus;
    const w = b.maxC * CASUTA_LAT, h = b.maxR * CASUTA_INALT;
    g.save();
    g.beginPath();
    tarm(g, x0, y0, w, h, b.ale[0]);
    g.fillStyle = '#0d1c14';
    g.shadowColor = 'rgba(0,0,0,.6)';
    g.shadowBlur = 14;
    g.fill();
    g.shadowBlur = 0;
    g.clip();

    // ---- fiecare zona ----
    b.ale.forEach(function (z) {
      const x = x0 + z.peHarta.c * CASUTA_LAT;
      const yy = y0 + z.peHarta.r * CASUTA_INALT;
      deseneazaCasutaZonei(g, z, x, yy);
      casuteleLumii.push({ id: z.id, x: x, y: yy, w: CASUTA_LAT, h: CASUTA_INALT });
    });

    g.restore();

    // ---- drumurile dintre zone ----
    b.ale.forEach(function (z) {
      Object.keys(z.vecini || {}).forEach(function (latura) {
        const v = retetaZonei(z.vecini[latura]);
        if (!v || v.peHarta.c < z.peHarta.c || v.peHarta.r < z.peHarta.r) return;
        const a = { x: x0 + (z.peHarta.c + 0.5) * CASUTA_LAT,
                    y: y0 + (z.peHarta.r + 0.5) * CASUTA_INALT };
        const c2 = { x: x0 + (v.peHarta.c + 0.5) * CASUTA_LAT,
                     y: y0 + (v.peHarta.r + 0.5) * CASUTA_INALT };
        g.strokeStyle = 'rgba(232, 220, 192, .34)';
        g.lineWidth = 3;
        g.setLineDash([9, 7]);
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(c2.x, c2.y);
        g.stroke();
        g.setLineDash([]);
      });
    });

    // ---- numele si semnele, peste tot desenul ----
    b.ale.forEach(function (z) {
      const x = x0 + z.peHarta.c * CASUTA_LAT;
      const yy = y0 + z.peHarta.r * CASUTA_INALT;
      scrieNumeleZonei(g, z, x, yy);
    });
  });

  // ---- corabiile si zeppelinele, intre continente ----
  ZONE.forEach(function (z) {
    if (!z.port) return;
    const de = undeECasuta(z.id), la = undeECasuta(z.port.catre);
    if (!de || !la) return;
    g.strokeStyle = z.port.fel === 'corabie' ? 'rgba(150, 200, 240, .65)'
                                             : 'rgba(220, 170, 120, .65)';
    g.lineWidth = 2.5;
    g.setLineDash([3, 9]);
    g.beginPath();
    g.moveTo(de.x + de.w / 2, de.y + de.h / 2);
    g.lineTo(la.x + la.w / 2, la.y + la.h / 2);
    g.stroke();
    g.setLineDash([]);
  });

  plansaHarta.innerHTML = '';
  panza.className = 'panza-harta';
  plansaHarta.appendChild(panza);
  legaApasarea(panza);
}


function undeECasuta(id) {
  return casuteleLumii.find(function (c) { return c.id === id; }) || null;
}


// Tarmul: dreptunghiul continentului, dar cu marginea imblanzita
// si putin strambata, ca sa arate a uscat, nu a tabel.
function tarm(g, x, y, w, h, deUnde) {
  const colt = 40;
  const j = function (i) { return (zarDinZona(deUnde, i) - 0.5) * 30; };
  g.moveTo(x + colt, y - 6 + j(1));
  g.lineTo(x + w - colt, y - 4 + j(2));
  g.quadraticCurveTo(x + w + 16 + j(3), y, x + w + 8, y + colt);
  g.lineTo(x + w + 6 + j(4), y + h - colt);
  g.quadraticCurveTo(x + w + 10, y + h + 12 + j(5), x + w - colt, y + h + 6);
  g.lineTo(x + colt, y + h + 8 + j(6));
  g.quadraticCurveTo(x - 14 + j(7), y + h + 10, x - 8, y + h - colt);
  g.lineTo(x - 6 + j(8), y + colt);
  g.quadraticCurveTo(x - 12, y - 8 + j(9), x + colt, y - 6);
  g.closePath();
}


// O zona pe harta lumii: pamantul ei, padurea ei, raul ei si
// semnele locurilor care conteaza.
function deseneazaCasutaZonei(g, z, x, y) {

  const fond = culoareaLiterei(z, '.', 0x4f9440);
  const des = culoareaLiterei(z, 'T', 0x1f4d22);
  const petec = culoareaLiterei(z, 'f', 0x8fc46a);
  const apa = culoareaLiterei(z, 'W', 0x4b93d6);
  const drum = culoareaLiterei(z, 'P', 0xb59567);

  // ---- pamantul ----
  g.fillStyle = fond;
  g.fillRect(x, y, CASUTA_LAT, CASUTA_INALT);

  // ---- pete de padure / stanca, imprastiate dar mereu la fel ----
  g.fillStyle = des;
  for (let i = 0; i < 26; i++) {
    const px = x + zarDinZona(z, i * 3 + 1) * CASUTA_LAT;
    const py = y + zarDinZona(z, i * 3 + 2) * CASUTA_INALT;
    const raza = 5 + zarDinZona(z, i * 3 + 3) * 11;
    g.beginPath();
    g.arc(px, py, raza, 0, Math.PI * 2);
    g.fill();
  }

  // ---- petice deschise ----
  g.fillStyle = petec;
  g.globalAlpha = 0.5;
  for (let i = 0; i < 7; i++) {
    const px = x + zarDinZona(z, 200 + i * 3) * CASUTA_LAT;
    const py = y + zarDinZona(z, 201 + i * 3) * CASUTA_INALT;
    g.beginPath();
    g.arc(px, py, 7 + zarDinZona(z, 202 + i * 3) * 9, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  // ---- raul: trece pe unde trece si in zona adevarata ----
  g.strokeStyle = apa;
  g.lineWidth = 5;
  g.beginPath();
  const cRau = x + (z.apaLa || 0.46) * CASUTA_LAT;
  for (let i = 0; i <= 10; i++) {
    const py = y + (i / 10) * CASUTA_INALT;
    const px = cRau + Math.sin(i / 1.7 + z.samanta) * 11;
    if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
  }
  g.stroke();

  // ---- drumurile din zona, ca in generator ----
  g.strokeStyle = drum;
  g.lineWidth = 2.5;
  g.globalAlpha = 0.75;
  g.beginPath();
  g.moveTo(x, y + CASUTA_INALT * 0.55); g.lineTo(x + CASUTA_LAT, y + CASUTA_INALT * 0.55);
  g.moveTo(x, y + CASUTA_INALT * 0.22); g.lineTo(x + CASUTA_LAT, y + CASUTA_INALT * 0.22);
  g.moveTo(x + CASUTA_LAT * 0.20, y); g.lineTo(x + CASUTA_LAT * 0.20, y + CASUTA_INALT);
  g.moveTo(x + CASUTA_LAT * 0.72, y); g.lineTo(x + CASUTA_LAT * 0.72, y + CASUTA_INALT);
  g.stroke();
  g.globalAlpha = 1;

  // ---- semnele locurilor ----
  (z.locuri || []).forEach(function (loc) {
    semnulLocului(g, loc.fel, x + loc.c * CASUTA_LAT, y + loc.r * CASUTA_INALT, 1);
  });

  // ---- chenarul ----
  g.strokeStyle = 'rgba(0,0,0,.45)';
  g.lineWidth = 1;
  g.strokeRect(x + .5, y + .5, CASUTA_LAT - 1, CASUTA_INALT - 1);
}


// Numele zonei, nivelurile ei si inelul de aur daca esti acolo.
function scrieNumeleZonei(g, z, x, y) {

  const aici = (zona && z.id === zona.id);
  const aleasa = (z.id === zonaAleasa);

  // O panglica sub nume, ca sa se citeasca peste orice culoare.
  const mij = x + CASUTA_LAT / 2;
  g.fillStyle = 'rgba(10, 7, 4, .72)';
  g.fillRect(x + 10, y + CASUTA_INALT - 44, CASUTA_LAT - 20, 36);

  g.textAlign = 'center';
  g.fillStyle = aici ? '#ffd34d' : '#f0e4c8';
  g.font = '600 17px Georgia, serif';
  g.fillText(z.nume, mij, y + CASUTA_INALT - 28);

  g.fillStyle = CULOAREA_NIVELULUI[culoareaZonei(z)] || '#cdbb9a';
  g.font = '600 15px Georgia, serif';
  g.fillText(z.nivelDeLa + ' – ' + z.nivelPanaLa, mij, y + CASUTA_INALT - 13);

  if (aici) {
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 3;
    g.strokeRect(x + 2, y + 2, CASUTA_LAT - 4, CASUTA_INALT - 4);
    g.fillStyle = '#ffd34d';
    g.font = '600 12px Georgia, serif';
    g.fillText('★ ' + TEXT.YOU_ARE_HERE, mij, y + 18);
  } else if (aleasa) {
    g.strokeStyle = '#c9a961';
    g.lineWidth = 2;
    g.strokeRect(x + 2, y + 2, CASUTA_LAT - 4, CASUTA_INALT - 4);
  }
}


// ----------------------------------------------------------
//  Semnele locurilor
//
//  Desenate din dreptunghiuri si triunghiuri, ca sa se recunoasca
//  si cand sunt de opt pixeli. m = de cate ori mai mare.
// ----------------------------------------------------------
function semnulLocului(g, fel, x, y, m) {

  g.save();
  g.translate(x, y);
  g.scale(m, m);
  g.lineWidth = 1.4;
  g.strokeStyle = '#120d08';

  const negru = '#241a10', piatra = '#cfc6b4', lemn = '#a8763a';

  switch (fel) {

    case 'oras':                       // zid cu trei turnuri
      g.fillStyle = piatra;
      g.fillRect(-13, -5, 26, 12);
      g.fillRect(-15, -12, 7, 19);
      g.fillRect(-3.5, -14, 7, 21);
      g.fillRect(8, -12, 7, 19);
      g.strokeRect(-13, -5, 26, 12);
      g.fillStyle = negru;
      g.fillRect(-2, 1, 4, 6);
      break;

    case 'sat':                        // doua case cu acoperis
      g.fillStyle = '#b0402f';
      g.beginPath(); g.moveTo(-11, -2); g.lineTo(-6, -9); g.lineTo(-1, -2); g.fill();
      g.beginPath(); g.moveTo(1, 0); g.lineTo(6, -7); g.lineTo(11, 0); g.fill();
      g.fillStyle = '#d6c8a8';
      g.fillRect(-10, -2, 8, 8);
      g.fillRect(2, 0, 8, 6);
      break;

    case 'tabara':
    case 'corturi':                    // doua corturi si focul
      g.fillStyle = '#8d7b5a';
      g.beginPath(); g.moveTo(-11, 6); g.lineTo(-6, -8); g.lineTo(-1, 6); g.fill();
      g.beginPath(); g.moveTo(2, 6); g.lineTo(7, -5); g.lineTo(12, 6); g.fill();
      g.fillStyle = '#e8862f';
      g.beginPath(); g.arc(-2, 7, 2.6, 0, Math.PI * 2); g.fill();
      break;

    case 'pestera':                    // o gura neagra in stanca
      g.fillStyle = '#8a8478';
      g.beginPath(); g.arc(0, 3, 12, Math.PI, 0); g.fill();
      g.fillStyle = '#0c0906';
      g.beginPath(); g.arc(0, 4, 6, Math.PI, 0); g.fill();
      g.fillRect(-6, 3, 12, 3);
      break;

    case 'mina':                       // gura cu grinzi de lemn
      g.fillStyle = '#6a6a62';
      g.beginPath(); g.arc(0, 4, 11, Math.PI, 0); g.fill();
      g.fillStyle = '#0c0906';
      g.beginPath(); g.arc(0, 5, 6, Math.PI, 0); g.fill();
      g.fillStyle = lemn;
      g.fillRect(-8, -3, 2.5, 9);
      g.fillRect(5.5, -3, 2.5, 9);
      g.fillRect(-8, -4.5, 16, 2.5);
      break;

    case 'cetate':                     // turn cu steag
      g.fillStyle = piatra;
      g.fillRect(-8, -9, 16, 17);
      g.fillRect(-10, -13, 5, 6);
      g.fillRect(5, -13, 5, 6);
      g.strokeRect(-8, -9, 16, 17);
      g.fillStyle = '#8a2f22';
      g.fillRect(-0.8, -22, 1.6, 9);
      g.beginPath(); g.moveTo(0.8, -22); g.lineTo(8, -19.5); g.lineTo(0.8, -17); g.fill();
      break;

    case 'post':                       // palisada mica
      g.fillStyle = lemn;
      for (let i = -9; i <= 9; i += 4.5) {
        g.fillRect(i, -6, 3, 13);
        g.beginPath(); g.moveTo(i, -6); g.lineTo(i + 1.5, -9); g.lineTo(i + 3, -6); g.fill();
      }
      break;

    case 'ferma':                      // casa si brazde
      g.fillStyle = '#b0402f';
      g.beginPath(); g.moveTo(-11, -3); g.lineTo(-6, -10); g.lineTo(-1, -3); g.fill();
      g.fillStyle = '#d6c8a8';
      g.fillRect(-10, -3, 8, 7);
      g.fillStyle = '#8a7440';
      for (let i = 0; i < 4; i++) g.fillRect(1, -4 + i * 3, 11, 1.6);
      break;

    case 'poiana':                     // cerc de iarba deschisa
      g.fillStyle = '#c9d46b';
      g.beginPath(); g.arc(0, 0, 8, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#4a5a28';
      g.beginPath(); g.arc(0, 0, 8, 0, Math.PI * 2); g.stroke();
      break;
  }

  g.restore();
}


// Apasarea pe harta lumii: alege zona pe care ai apasat.
function legaApasarea(panza) {
  panza.addEventListener('click', function (e) {
    const cutie = panza.getBoundingClientRect();
    const sc = panza.width / cutie.width;
    const x = (e.clientX - cutie.left) * sc;
    const y = (e.clientY - cutie.top) * sc;

    const gasita = casuteleLumii.find(function (c) {
      return x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h;
    });
    if (!gasita) return;

    zonaAleasa = gasita.id;
    deseneazaLumea();
    scrieDetaliile();
  });
}


// ==========================================================
//  2. HARTA UNEI SINGURE ZONE
//
//  Harta adevarata, la un pixel pe casuta. O zona are vreo sapte
//  sute pe patru sute cincizeci de casute, deci iese o poza de
//  fix marimea aia, pe care browserul o micsoreaza singur ca sa
//  incapa pe ecran.
// ==========================================================
function arataZona(id) {

  // Daca cineva cere o zona care nu exista, aratam lumea in loc sa
  // crapam. Se intampla daca vine un id vechi dintr-o salvare.
  if (!retetaZonei(id)) { ceAratam = 'lume'; deseneazaLumea(); return; }

  zonaAleasa = id;

  if (hartiFacute[id]) {
    puneHartaZonei(hartiFacute[id]);
    return;
  }

  // Constructia dureaza vreo doua zecimi de secunda. Scriem intai
  // ca lucram, si abia pe urma ne apucam - altfel ecranul ramane
  // gol si pare ca s-a blocat.
  plansaHarta.innerHTML = '<div class="asteapta-harta">' + TEXT.DRAWING_MAP + '</div>';

  setTimeout(function () {
    if (ceAratam !== id) return;        // ai schimbat intre timp
    const panza = faHartaZonei(id);
    tineMinteHarta(id, panza);
    puneHartaZonei(panza);
  }, 30);
}


function tineMinteHarta(id, panza) {
  hartiFacute[id] = panza;
  ordineaHartilor.push(id);
  while (ordineaHartilor.length > CATE_HARTI_TINEM) {
    delete hartiFacute[ordineaHartilor.shift()];
  }
}


function puneHartaZonei(panza) {
  plansaHarta.innerHTML = '';
  panza.className = 'panza-harta';
  plansaHarta.appendChild(panza);
}


function faHartaZonei(id) {

  // Zona in care esti chiar acum e deja construita in joc: o
  // folosim pe aia, ca sa n-o mai facem inca o data degeaba.
  const z = (zona && zona.id === id) ? zona : faZona(retetaZonei(id));

  const COL = z.COL, RND = z.RND;
  const panza = document.createElement('canvas');
  panza.width = COL;
  panza.height = RND;
  const g = panza.getContext('2d');

  // ---- terenul, un pixel pe casuta ----
  etichetePuse = [];

  const poza = g.createImageData(COL, RND);
  const d = poza.data;
  const culori = {};
  Object.keys(z.teren).forEach(function (litera) {
    const n = z.teren[litera].culoare;
    culori[litera] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  });

  for (let r = 0; r < RND; r++) {
    const rand = z.harta[r];
    for (let c = 0; c < COL; c++) {
      const cul = culori[rand[c]];
      const i = (r * COL + c) * 4;
      if (cul) { d[i] = cul[0]; d[i + 1] = cul[1]; d[i + 2] = cul[2]; }
      d[i + 3] = 255;
    }
  }
  g.putImageData(poza, 0, 0);

  // ---- locurile care conteaza ----
  (z.locuri || []).forEach(function (loc) {
    semnulLocului(g, loc.fel, loc.col, loc.rand, 1.9);
    // Numele lui adevarat - acelasi pe care ti-l spune si misiunea.
    eticheta(g, loc.nume || numeleStructurii(loc.fel), loc.col, loc.rand + 34, COL, RND);
  });

  // ---- oamenii cu care poti vorbi ----
  g.fillStyle = '#ffd34d';
  g.strokeStyle = '#3a2400';
  g.lineWidth = 1.5;
  (z.npci || []).forEach(function (n) {
    g.beginPath();
    g.arc(n.col, n.rand, 5, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  });

  // ---- portile catre zonele vecine ----
  (z.treceri || []).forEach(function (tr) {
    const v = retetaZonei(tr.catre);
    g.fillStyle = '#e8dcc0';
    g.beginPath();
    g.arc(tr.col, tr.rand, 7, 0, Math.PI * 2);
    g.fill();
    eticheta(g, (v ? v.nume : tr.catre) + ' →', tr.col, tr.rand - 18, COL, RND);
  });

  // ---- portul ----
  if (z.portul) {
    const v = retetaZonei(z.portul.catre);
    g.fillStyle = z.portul.fel === 'corabie' ? '#96c8f0' : '#dcaa78';
    g.beginPath();
    g.arc(z.portul.col, z.portul.rand, 8, 0, Math.PI * 2);
    g.fill();
    eticheta(g, (z.portul.fel === 'corabie' ? 'Ship to ' : 'Zeppelin to ') +
                (v ? v.nume : z.portul.catre), z.portul.col, z.portul.rand - 20, COL, RND);
  }

  // ---- unde esti tu ----
  if (zona && zona.id === id && typeof jucator !== 'undefined' && jucator) {
    const c = Math.round(jucator.x / TILE), r = Math.round(jucator.y / TILE);
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(c, r, 13, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#ffd34d';
    g.beginPath();
    g.arc(c, r, 5, 0, Math.PI * 2);
    g.fill();
    eticheta(g, TEXT.YOU_ARE_HERE, c, r - 26, COL, RND);
  }

  return panza;
}


// ----------------------------------------------------------
//  Numele scrise pe harta zonei
//
//  Doua lucruri strica un nume scris pe o harta: sa iasa afara din
//  ea, si sa cada peste altul. Amandoua se intamplau - "Ship to
//  Saltcliff" statea exact peste "Stormhollow", si numele portilor
//  de pe margine erau taiate in jumatate.
//
//  Asa ca tinem minte unde am scris pana acum. Un nume nou care
//  cade peste unul vechi se muta mai sus sau mai jos pana gaseste
//  loc, iar daca ar iesi din harta e tras inauntru.
// ----------------------------------------------------------
let etichetePuse = [];

function seLovesc(a, b) {
  return !(a.x2 < b.x1 || b.x2 < a.x1 || a.y2 < b.y1 || b.y2 < a.y1);
}

function eticheta(g, text, x, y, lat, inalt) {

  g.font = '600 17px Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  const w = g.measureText(text).width + 14;
  const h = 23;

  // sa nu iasa din harta pe laturi
  const cx = Math.min(lat - w / 2 - 3, Math.max(w / 2 + 3, x));

  // sa nu cada peste un nume scris mai devreme
  const incercari = [0, -26, 26, -52, 52, -78, 78];
  let cy = y;
  for (const dy of incercari) {
    const unde = Math.min(inalt - h / 2 - 3, Math.max(h / 2 + 3, y + dy));
    const cutie = { x1: cx - w / 2, x2: cx + w / 2, y1: unde - h / 2, y2: unde + h / 2 };
    if (!etichetePuse.some(function (e) { return seLovesc(e, cutie); })) {
      etichetePuse.push(cutie);
      cy = unde;
      break;
    }
    cy = unde;
  }

  g.fillStyle = 'rgba(10, 7, 4, .78)';
  g.fillRect(cx - w / 2, cy - 12, w, h);
  g.fillStyle = '#f0e4c8';
  g.fillText(text, cx, cy);
}


function numeleStructurii(fel) {
  return {
    oras: TEXT.PLACE_CITY, sat: TEXT.PLACE_VILLAGE, tabara: TEXT.PLACE_CAMP,
    corturi: TEXT.PLACE_CAMP, pestera: TEXT.PLACE_CAVE, mina: TEXT.PLACE_MINE,
    cetate: TEXT.PLACE_KEEP, post: TEXT.PLACE_OUTPOST, ferma: TEXT.PLACE_FARM,
    poiana: TEXT.PLACE_CLEARING
  }[fel] || fel;
}


// ==========================================================
//  PANOUL DIN DREAPTA
// ==========================================================
function scrieDetaliile() {

  const z = retetaZonei(zonaAleasa);
  if (!z) { detaliiZona.innerHTML = ''; return; }

  const continent = CONTINENTE.find(function (c) { return c.id === z.continent; });

  let html = '<h3>' + z.nume + '</h3>';
  html += '<div class="rand-detaliu"><span>' + TEXT.LEVEL + '</span><span style="color:' +
          (CULOAREA_NIVELULUI[culoareaZonei(z)] || '#cdbb9a') + '">' +
          z.nivelDeLa + ' &ndash; ' + z.nivelPanaLa + '</span></div>';
  html += '<div class="rand-detaliu"><span>Continent</span><span>' +
          (continent ? continent.nume : '') + '</span></div>';
  html += '<div class="rand-detaliu"><span>Home of</span><span>' +
          (z.factiune || 'Both factions') + '</span></div>';

  // ---- ce e in zona ----
  if ((z.locuri || []).length) {
    html += '<div class="cap-detaliu">' + TEXT.WHATS_HERE + '</div><ul class="drumuri">';
    z.locuri.forEach(function (loc) {
      html += '<li><b>' + (loc.nume || numeleStructurii(loc.fel)) + '</b>' +
              ' <span class="stins">' + numeleStructurii(loc.fel) + '</span></li>';
    });
    html += '<li>' + (z.npci || []).length + ' <span class="stins">' +
            TEXT.PLACE_PEOPLE + '</span></li></ul>';
  }

  // ---- cum ajungi acolo ----
  html += '<div class="cap-detaliu">' + TEXT.ROADS + '</div><ul class="drumuri">';

  const iesiri = undePotiMerge(z.id);
  if (iesiri.length === 0) {
    html += '<li>Nowhere from here.</li>';
  }
  iesiri.forEach(function (d) {
    const catre = retetaZonei(d.catre);
    if (!catre) return;
    const cum = d.fel === 'drum' ? ('road ' + LATURA_IN_ENGLEZA[d.latura])
              : d.fel === 'corabie' ? 'by ship'
              : 'by zeppelin';
    html += '<li><b>' + catre.nume + '</b> <span class="stins">(' +
            catre.nivelDeLa + '&ndash;' + catre.nivelPanaLa + ') &middot; ' + cum + '</span></li>';
  });
  html += '</ul>';

  // ---- butonul care deschide harta zonei alese ----
  if (ceAratam === 'lume') {
    html += '<button class="buton mic" id="vezi-zona">Look at ' + z.nume + '</button>';
  } else {
    html += '<button class="buton mic" id="vezi-lumea">' + TEXT.WHOLE_WORLD + '</button>';
    html += '<div class="nota-harta">' + TEXT.ZONE_MAP_NOTE + '</div>';
  }

  if (zona && z.id === zona.id && ceAratam === 'lume') {
    html += '<div class="nota-harta">' + TEXT.YOU_ARE_HERE_NOTE + '</div>';
  }

  detaliiZona.innerHTML = html;

  const vezi = document.getElementById('vezi-zona');
  if (vezi) vezi.addEventListener('click', function () {
    ceAratam = zonaAleasa;
    alegeHarta.value = ceAratam;
    scrieHarta();
  });

  const lumea = document.getElementById('vezi-lumea');
  if (lumea) lumea.addEventListener('click', function () {
    ceAratam = 'lume';
    alegeHarta.value = 'lume';
    scrieHarta();
  });
}


const LATURA_IN_ENGLEZA = {
  nord: 'north', sud: 'south', vest: 'west', est: 'east'
};


// ==========================================================
//  BUTOANELE
// ==========================================================
alegeHarta.addEventListener('change', function () {
  ceAratam = alegeHarta.value;
  if (ceAratam !== 'lume') zonaAleasa = ceAratam;
  scrieHarta();
});

document.getElementById('inchide-harta').addEventListener('click', inchideHarta);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !ecranHarta.classList.contains('ascuns')) inchideHarta();
  if ((e.key === 'h' || e.key === 'H') && personaj && zona) {
    if (ecranHarta.classList.contains('ascuns')) deschideHarta();
    else inchideHarta();
  }
});
