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

  // Daca esti intr-un oras, deschidem direct harta orasului: harta
  // lumii n-are unde sa-l arate, si oricum aia vrei s-o vezi.
  ceAratam = (zona.esteOras || zona.esteTemnita || zona.esteRaid) ? zona.id : 'lume';
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

    // intai orasele principale, ca sa le gasesti primele
    oraseleContinentului(c.id).forEach(function (o) {
      html += '<option value="' + o.id + '">' + o.nume + '  (city)' +
              (zona && o.id === zona.id ? '  ★' : '') + '</option>';
    });

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

// Semnul unei capitale pe harta lumii.
//
// FARA SCRIS pe harta: am incercat intai cu numele scris sub turn,
// dar harta e o grila deasa si textul se suprapunea peste numele
// zonelor. Numele capitalei se scrie in panoul din dreapta, unde e
// loc si unde oricum te uiti dupa lamuriri.
function semnDeCapitala(g, x, y, oras) {

  const aTa = personaj && oras.factiune && oras.factiune === personaj.factiune;
  const auriu = aTa ? '#f0d890' : '#b3a894';

  // turnul
  g.fillStyle = '#2b241c';
  g.fillRect(x - 9, y - 18, 18, 22);
  g.fillStyle = aTa ? '#e0c070' : '#9d9384';
  g.fillRect(x - 7, y - 16, 14, 18);
  g.fillStyle = '#2b241c';
  g.fillRect(x - 3, y - 6, 6, 8);
  g.fillStyle = auriu;
  [-7, -2, 3].forEach(function (dx) { g.fillRect(x + dx, y - 20, 4, 4); });

  // steagul
  g.fillStyle = '#2b241c';
  g.fillRect(x - 1, y - 32, 2, 14);
  g.fillStyle = auriu;
  g.beginPath();
  g.moveTo(x + 1, y - 32);
  g.lineTo(x + 12, y - 28);
  g.lineTo(x + 1, y - 24);
  g.closePath();
  g.fill();

  // steaua, doar la capitala taberei tale
  if (aTa) {
    g.fillStyle = '#f0d890';
    g.font = '700 14px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.strokeStyle = 'rgba(10,7,4,.9)';
    g.lineWidth = 3;
    g.strokeText('\u2605', x, y + 12);
    g.fillText('\u2605', x, y + 12);
  }
}


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
    g.font = '600 22px Georgia, serif';
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
        // Un drum adevarat: o dunga inchisa dedesubt si una deschisa
        // peste ea. Inainte era o linie alba punctata si arata a
        // zgarietura pe sticla.
        g.lineCap = 'round';
        g.strokeStyle = 'rgba(24, 16, 8, .45)';
        g.lineWidth = 7;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(c2.x, c2.y); g.stroke();
        g.strokeStyle = 'rgba(214, 190, 150, .75)';
        g.lineWidth = 3;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(c2.x, c2.y); g.stroke();
      });
    });

    // ---- numele si semnele, peste tot desenul ----
    b.ale.forEach(function (z) {
      const x = x0 + z.peHarta.c * CASUTA_LAT;
      const yy = y0 + z.peHarta.r * CASUTA_INALT;
      scrieNumeleZonei(g, z, x, yy);
    });

    // ---- CAPITALELE, peste toate ----
    //
    // Pana acum un oras principal era un semn mic printre alte cinci
    // semne mici, si nu aveai de unde sti ca acolo sunt TOTI
    // antrenorii de meserie si de clasa. Acum are steag, nume scris
    // si o coroana daca e al taberei tale.
    b.ale.forEach(function (z) {
      (z.intrari || []).forEach(function (intrare) {
        const oras = retetaZonei(intrare.catre);
        if (!oras || !oras.esteOras) return;
        // Semnul se pune in MIJLOCUL casutei, nu chiar peste locul
        // orasului: numele e lat si la marginea continentului iesea
        // din harta si se taia.
        semnDeCapitala(g,
          x0 + (z.peHarta.c + 0.5) * CASUTA_LAT,
          y0 + (z.peHarta.r + 0.38) * CASUTA_INALT,
          oras);
      });
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

  // Tot ce desenam ramane in casuta zonei. Fara asta, o pata de
  // padure de langa margine se varsa peste zona vecina si acolo
  // arata ca o greseala, nu ca o padure.
  g.save();
  g.beginPath();
  g.rect(x, y, CASUTA_LAT, CASUTA_INALT);
  g.clip();

  // ---- pamantul ----
  g.fillStyle = fond;
  g.fillRect(x, y, CASUTA_LAT, CASUTA_INALT);

  // ---- petice deschise: poieni, nisip. Sub padure, si sterse. ----
  g.fillStyle = petec;
  g.globalAlpha = 0.26;
  for (let i = 0; i < 6; i++) {
    const px = x + zarDinZona(z, 200 + i * 3) * CASUTA_LAT;
    const py = y + zarDinZona(z, 201 + i * 3) * CASUTA_INALT;
    g.beginPath();
    g.arc(px, py, 10 + zarDinZona(z, 202 + i * 3) * 14, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  // ---- padurea / stancile: pete de marimi diferite, ca sa nu iasa
  //      un sirag de bulinele egale ----
  g.fillStyle = des;
  for (let i = 0; i < 15; i++) {
    const px = x + zarDinZona(z, i * 3 + 1) * CASUTA_LAT;
    const py = y + zarDinZona(z, i * 3 + 2) * CASUTA_INALT;
    const cat = zarDinZona(z, i * 3 + 3);
    g.globalAlpha = 0.45 + cat * 0.3;
    g.beginPath();
    g.arc(px, py, 4 + cat * cat * 15, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  // ---- raul: trece pe unde trece si in zona adevarata ----
  g.strokeStyle = apa;
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.lineWidth = 6;
  g.beginPath();
  const cRau = x + (z.apaLa || 0.46) * CASUTA_LAT;
  for (let i = 0; i <= 12; i++) {
    const py = y + (i / 12) * CASUTA_INALT;
    const px = cRau + Math.sin(i / 1.7 + z.samanta) * 11;
    if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
  }
  g.stroke();

  // ---- drumurile din zona, la fel ca in generator ----
  g.strokeStyle = drum;
  g.lineWidth = 3;
  g.globalAlpha = 0.5;
  g.beginPath();
  g.moveTo(x, y + CASUTA_INALT * 0.55); g.lineTo(x + CASUTA_LAT, y + CASUTA_INALT * 0.55);
  g.moveTo(x, y + CASUTA_INALT * 0.22); g.lineTo(x + CASUTA_LAT, y + CASUTA_INALT * 0.22);
  g.moveTo(x + CASUTA_LAT * 0.20, y); g.lineTo(x + CASUTA_LAT * 0.20, y + CASUTA_INALT);
  g.moveTo(x + CASUTA_LAT * 0.72, y); g.lineTo(x + CASUTA_LAT * 0.72, y + CASUTA_INALT);
  g.stroke();
  g.globalAlpha = 1;

  // ---- semnele locurilor ----
  (z.locuri || []).forEach(function (loc) {
    semnulLocului(g, loc.fel, x + loc.c * CASUTA_LAT, y + loc.r * CASUTA_INALT, 0.85);
  });

  // ---- unde sunt temnitele ----
  //
  // Pe harta lumii nu se vedea nicaieri ca o zona are temnita. Cine
  // nu stia dinainte trebuia sa dea peste gura ei din intamplare,
  // undeva pe o harta de sapte sute de casute. Acum zona care are una
  // poarta un inel violet fix pe locul prin care se intra.
  (typeof ZONE !== 'undefined' ? ZONE : []).forEach(function (t) {
    if (!t.intrareDin || t.intrareDin.zona !== z.id) return;
    const loc = (z.locuri || []).find(function (l) { return l.id === t.intrareDin.loc; });
    if (!loc) return;

    const mx = x + loc.c * CASUTA_LAT, my = y + loc.r * CASUTA_INALT;
    g.fillStyle = 'rgba(150, 70, 190, .55)';
    g.beginPath(); g.arc(mx, my, 11, 0, Math.PI * 2); g.fill();
    g.strokeStyle = t.esteRaid ? '#ffce5a' : '#e2a8f5';
    g.lineWidth = 2.5;
    g.beginPath(); g.arc(mx, my, 11, 0, Math.PI * 2); g.stroke();
  });

  g.restore();

  // ---- hotarul, subtire si sters ----
  //
  // Inainte era o linie neagra groasa in jurul fiecarei casute si tot
  // continentul arata a tabel, nu a uscat. Acum e doar atat cat sa se
  // vada unde se termina o zona si incepe alta.
  g.strokeStyle = 'rgba(18, 12, 6, .22)';
  g.lineWidth = 1;
  g.strokeRect(x + 0.5, y + 0.5, CASUTA_LAT - 1, CASUTA_INALT - 1);
}


// Numele zonei, nivelurile ei si inelul de aur daca esti acolo.
function scrieNumeleZonei(g, z, x, y) {

  const aici = (zona && z.id === zona.id);
  const aleasa = (z.id === zonaAleasa);

  // O panglica sub nume, ca sa se citeasca peste orice culoare.
  //
  // Inainte se intindea pe toata latimea casutei si harta arata a
  // siruri de bare negre. Acum e doar cat tine numele.
  const mij = x + CASUTA_LAT / 2;
  g.textAlign = 'center';
  const latDisponibila = CASUTA_LAT - 18;
  potrivesteScrisulHartii(g, z.nume, 13, latDisponibila);

  const latNume = Math.min(CASUTA_LAT - 6, Math.max(g.measureText(z.nume).width, 44) + 12);
  g.fillStyle = 'rgba(10, 7, 4, .66)';
  g.fillRect(mij - latNume / 2, y + CASUTA_INALT - 42, latNume, 34);

  g.fillStyle = aici ? '#ffd34d' : '#f0e4c8';
  g.fillText(z.nume, mij, y + CASUTA_INALT - 27, latDisponibila);

  g.fillStyle = CULOAREA_NIVELULUI[culoareaZonei(z)] || '#cdbb9a';
  g.font = '600 11px Georgia, serif';
  g.fillText(z.nivelDeLa + ' – ' + z.nivelPanaLa, mij, y + CASUTA_INALT - 12);

  if (aici) {
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 3;
    g.strokeRect(x + 2, y + 2, CASUTA_LAT - 4, CASUTA_INALT - 4);
    g.fillStyle = '#ffd34d';
    g.font = '600 12px Georgia, serif';
    g.fillText('★ ' + TEXT.YOU_ARE_HERE, mij, y + 18);

    // Si UNDE anume in zona. Casuta zonei e mica, dar tot e altceva
    // sa vezi ca esti in coltul de miazazi fata de doar "esti aici".
    if (typeof jucator !== 'undefined' && jucator && zona.COL) {
      const px = x + (jucator.x / TILE / zona.COL) * CASUTA_LAT;
      const py = y + (jucator.y / TILE / zona.RND) * CASUTA_INALT;
      g.fillStyle = '#1a1206';
      g.beginPath(); g.arc(px, py, 6, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ffd34d';
      g.beginPath(); g.arc(px, py, 4, 0, Math.PI * 2); g.fill();
    }
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

    case 'cetate':                     // turn cu creneluri si steag
      g.fillStyle = '#7d776c';
      g.fillRect(-9, -9, 18, 18);
      g.fillStyle = piatra;
      g.fillRect(-9, -9, 18, 11);
      // creneluri
      g.fillStyle = piatra;
      for (let i = -9; i < 9; i += 6) g.fillRect(i, -13, 4, 5);
      g.fillStyle = negru;
      g.fillRect(-2.5, 2, 5, 7);        // poarta
      g.strokeRect(-9, -9, 18, 18);
      g.fillStyle = '#6b4a2c';
      g.fillRect(-0.8, -24, 1.6, 11);
      g.fillStyle = '#8a2f22';
      g.beginPath(); g.moveTo(0.8, -24); g.lineTo(8, -21.5); g.lineTo(0.8, -19); g.fill();
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

    case 'cartier':                    // trei case stranse, un cartier
      g.fillStyle = '#b0402f';
      g.beginPath(); g.moveTo(-12, -1); g.lineTo(-7, -8); g.lineTo(-2, -1); g.fill();
      g.beginPath(); g.moveTo(-1, -3); g.lineTo(4, -10); g.lineTo(9, -3); g.fill();
      g.fillStyle = '#d6c8a8';
      g.fillRect(-11, -1, 8, 8);
      g.fillRect(0, -3, 8, 10);
      g.fillStyle = negru;
      g.fillRect(-8, 3, 3, 4);
      g.fillRect(3, 1, 3, 6);
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

  // Zona in care te afli se deseneaza DE FIECARE DATA din nou.
  //
  // Harta o data desenata se tine minte, ca sa nu se mai construiasca
  // a doua oara. Numai ca semnul "You are here" e desenat pe ea, si
  // asa ramanea unde erai cand ai deschis harta prima oara: te duceai
  // in celalalt capat al zonei, deschideai harta si punctul statea tot
  // langa sat. Pentru zona ta n-avem oricum ce construi - e deja facuta
  // in joc - deci desenul dureaza o clipa.
  const esteZonaTa = (zona && zona.id === id);

  if (!esteZonaTa && hartiFacute[id]) {
    puneHartaZonei(hartiFacute[id]);
    return;
  }

  if (esteZonaTa) {
    puneHartaZonei(faHartaZonei(id));
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

  // Un oras are cam un sfert din casutele unei zone, deci harta lui
  // iesea mica si numele cartierelor se calcau unele pe altele. Il
  // desenam la dublu: doi pixeli pe casuta in loc de unul.
  const ori = (z.esteOras || z.esteTemnita || z.esteRaid) ? 2 : 1;

  const panza = document.createElement('canvas');
  panza.width = COL * ori;
  panza.height = RND * ori;
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
  if (ori === 1) {
    g.putImageData(poza, 0, 0);
  } else {
    // putImageData nu stie sa mareasca, asa ca trecem printr-o panza
    // mica si o desenam marita peste cea mare.
    const mica = document.createElement('canvas');
    mica.width = COL; mica.height = RND;
    mica.getContext('2d').putImageData(poza, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(mica, 0, 0, COL * ori, RND * ori);
    g.imageSmoothingEnabled = true;
  }

  // De aici incolo desenam in casute, nu in pixeli de panza.
  g.save();
  g.scale(ori, ori);

  // ---- locurile care conteaza ----
  // In oras totul e desenat la dublu, deci semnele si scrisul pot fi
  // mai mici in casute si sa iasa la fel de mari pe ecran.
  const marimeSemn = (z.esteOras || z.esteTemnita || z.esteRaid) ? 1.0 : 1.9;
  const marimeScris = (z.esteOras || z.esteTemnita || z.esteRaid) ? 8 : 13;

  (z.locuri || []).forEach(function (loc) {
    semnulLocului(g, loc.fel, loc.col, loc.rand, marimeSemn);
    // Numele lui adevarat - acelasi pe care ti-l spune si misiunea.
    eticheta(g, loc.nume || numeleStructurii(loc.fel), loc.col, loc.rand + 18,
             COL, RND, marimeScris);
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
  //
  // Gura unei temnite se desena la fel ca o granita spre zona
  // vecina: acelasi punct alb, aceeasi sageata. Nu aveai de unde sti
  // ca acolo e o temnita - trebuia sa nimeresti peste ea. Acum e
  // violeta, mai mare, cu un inel in jur, si scrie ce e si de ce
  // nivel.
  (z.treceri || []).forEach(function (tr) {
    const v = retetaZonei(tr.catre);
    const eTemnita = v && (v.esteTemnita || v.esteRaid);

    g.fillStyle = eTemnita ? '#c07ad8' : '#e8dcc0';
    g.beginPath();
    g.arc(tr.col, tr.rand, eTemnita ? 9 : 7, 0, Math.PI * 2);
    g.fill();

    if (eTemnita) {
      g.strokeStyle = '#f0d4ff';
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(tr.col, tr.rand, 14, 0, Math.PI * 2);
      g.stroke();
    }

    const scris = (v ? v.nume : tr.catre) +
      (eTemnita ? '  ' + (v.esteRaid ? TEXT.RAID_SIGN : TEXT.DUNGEON_SIGN) +
                  ' ' + v.nivelDeLa + '–' + v.nivelPanaLa
                : ' →');
    eticheta(g, scris, tr.col, tr.rand - (eTemnita ? 24 : 18), COL, RND,
             (z.esteOras || z.esteTemnita || z.esteRaid) ? 8 : 13);
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

    // O cruce care taie toata harta, ca sa gasesti punctul dintr-o
    // privire chiar si cand harta e micsorata pe un ecran de telefon.
    g.strokeStyle = 'rgba(255, 211, 77, .35)';
    g.lineWidth = 1.5;
    g.setLineDash([7, 7]);
    g.beginPath();
    g.moveTo(0, r); g.lineTo(COL, r);
    g.moveTo(c, 0); g.lineTo(c, RND);
    g.stroke();
    g.setLineDash([]);

    // doua inele si un punct la mijloc
    g.strokeStyle = '#1a1206';
    g.lineWidth = 7;
    g.beginPath(); g.arc(c, r, 16, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 4;
    g.beginPath(); g.arc(c, r, 16, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2;
    g.strokeStyle = 'rgba(255, 211, 77, .55)';
    g.beginPath(); g.arc(c, r, 25, 0, Math.PI * 2); g.stroke();

    g.fillStyle = '#1a1206';
    g.beginPath(); g.arc(c, r, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffd34d';
    g.beginPath(); g.arc(c, r, 5, 0, Math.PI * 2); g.fill();

    eticheta(g, TEXT.YOU_ARE_HERE, c, r - 34, COL, RND, (z.esteOras || z.esteTemnita || z.esteRaid) ? 8 : 13);
  }

  g.restore();
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

// Masuram cu acelasi font cu care desenam. Un nume lung trebuie sa
// incapa in locul sau, nu sa intre peste zona vecina.
function potrivesteScrisulHartii(g, text, marime, latMaxima) {
  let font = marime;
  do {
    g.font = '600 ' + font + 'px Georgia, serif';
    if (g.measureText(text).width <= latMaxima || font <= marime * 0.7) return font;
    font -= 0.5;
  } while (true);
}

function eticheta(g, text, x, y, lat, inalt, marime) {
  const margine = 3;
  const latText = Math.max(1, Math.min(lat - 20, lat * 0.48));
  const font = potrivesteScrisulHartii(g, text, marime || 13, latText);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const w = Math.min(g.measureText(text).width, latText) + 10;
  const h = Math.ceil(font + 8);
  const limitaX = function (cx) { return Math.min(lat - w / 2 - margine, Math.max(w / 2 + margine, cx)); };
  const limitaY = function (cy) { return Math.min(inalt - h / 2 - margine, Math.max(h / 2 + margine, cy)); };
  const pas = h + 3;
  // Cautam mai intai aproape de semn, apoi in lateral. Fostul cod
  // incerca doar sapte pozitii verticale si desena peste ultima
  // eticheta chiar daca toate cele sapte erau ocupate.
  for (let inel = 0; inel <= 8; inel++) {
    const mutari = inel === 0 ? [[0, 0]] : [
      [0, -inel * pas], [0, inel * pas],
      [-inel * pas, 0], [inel * pas, 0],
      [-inel * pas, -inel * pas], [inel * pas, -inel * pas],
      [-inel * pas, inel * pas], [inel * pas, inel * pas]
    ];
    for (const mutare of mutari) {
      const cx = limitaX(x + mutare[0]), cy = limitaY(y + mutare[1]);
      const cutie = { x1: cx - w / 2, x2: cx + w / 2, y1: cy - h / 2, y2: cy + h / 2 };
      if (etichetePuse.some(function (e) { return seLovesc(e, cutie); })) continue;
      etichetePuse.push(cutie);
      g.fillStyle = 'rgba(10, 7, 4, .78)';
      g.fillRect(cutie.x1, cutie.y1, w, h);
      g.fillStyle = '#f0e4c8';
      g.fillText(text, cx, cy, latText);
      return;
    }
  }
  // Si intr-o zona foarte deasa, numele ramane in lista din panoul
  // hartii. Nu desenam un text peste altul daca nu exista loc liber.
}


function numeleStructurii(fel) {
  return {
    oras: TEXT.PLACE_CITY, sat: TEXT.PLACE_VILLAGE, tabara: TEXT.PLACE_CAMP,
    corturi: TEXT.PLACE_CAMP, pestera: TEXT.PLACE_CAVE, mina: TEXT.PLACE_MINE,
    cetate: TEXT.PLACE_KEEP, post: TEXT.PLACE_OUTPOST, ferma: TEXT.PLACE_FARM,
    poiana: TEXT.PLACE_CLEARING, cartier: TEXT.PLACE_DISTRICT
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

  if (z.esteOras) {
    html += '<div class="rand-detaliu"><span>' + TEXT.PLACE_CITY + '</span><span>' +
            TEXT.CITY_SAFE + '</span></div>';
  } else {
    html += '<div class="rand-detaliu"><span>' + TEXT.LEVEL + '</span><span style="color:' +
            (CULOAREA_NIVELULUI[culoareaZonei(z)] || '#cdbb9a') + '">' +
            z.nivelDeLa + ' &ndash; ' + z.nivelPanaLa + '</span></div>';
  }
  html += '<div class="rand-detaliu"><span>Continent</span><span>' +
          (continent ? continent.nume : '') + '</span></div>';
  html += '<div class="rand-detaliu"><span>Home of</span><span>' +
          (z.factiune || 'Both factions') + '</span></div>';

  // ---- capitala, daca zona asta tine una ----
  //
  // Aici se scrie, nu pe harta: e loc destul si oricum te uiti
  // incoace dupa lamuriri. Spune ce gasesti acolo, ca sa se vada
  // de ce merita drumul.
  (z.intrari || []).forEach(function (intrare) {
    const oras = retetaZonei(intrare.catre);
    if (!oras || !oras.esteOras) return;
    const aTa = personaj && oras.factiune && oras.factiune === personaj.factiune;

    html += '<div class="capitala' + (aTa ? ' a-ta' : '') + '">';
    html += '<div class="nume-capitala">' + oras.nume +
            (aTa ? ' \u2605' : '') + '</div>';
    html += '<div class="stins">' +
            (aTa ? TEXT.YOUR_CAPITAL : TEXT.PLACE_CITY) + ' \u00b7 ' +
            oras.factiune + '</div>';
    html += '<ul class="ce-gasesti">' +
            '<li>' + TEXT.CAP_CLASS + '</li>' +
            '<li>' + TEXT.CAP_TRADES + '</li>' +
            '<li>' + TEXT.CAP_VENDORS + '</li></ul>';
    html += '<button class="buton mic" data-zona="' + oras.id + '">' +
            TEXT.CAP_LOOK.replace('{c}', oras.nume) + '</button>';
    html += '</div>';
  });

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

  // ---- temnitele din zona asta ----
  //
  // Pana acum nu scria nicaieri ca zona are o temnita. In lista de
  // locuri aparea doar "Moor Hollow - Cave", ca orice alta pestera
  // din lume, si in lista de drumuri nu aparea deloc. Cine nu stia
  // dinainte n-avea cum sa ajunga acolo decat din intamplare.
  const temnitele = (typeof ZONE !== 'undefined' ? ZONE : []).filter(function (t) {
    return t.intrareDin && t.intrareDin.zona === z.id;
  });

  if (temnitele.length) {
    html += '<div class="cap-detaliu">' + TEXT.DUNGEONS_HERE + '</div><ul class="drumuri">';
    temnitele.forEach(function (t) {
      const prin = (z.locuri || []).find(function (l) { return l.id === t.intrareDin.loc; });
      html += '<li><b>' + t.nume + '</b> <span class="stins">(' +
              t.nivelDeLa + '&ndash;' + t.nivelPanaLa + ') &middot; ' +
              (t.esteRaid ? TEXT.RAID_SIGN : TEXT.DUNGEON_SIGN) +
              (prin ? ' &middot; ' + TEXT.DUNGEON_VIA.replace('{l}', prin.nume) : '') +
              '</span></li>';
    });
    html += '</ul>';
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
              : d.fel === 'poarta' ? 'through the gate'
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

  // Butonul din blocul de capitala: duce direct la harta orasului.
  // Fara randul asta butonul se desena si nu facea nimic.
  detaliiZona.querySelectorAll('[data-zona]').forEach(function (b) {
    b.addEventListener('click', function () {
      zonaAleasa = b.dataset.zona;
      ceAratam = b.dataset.zona;
      alegeHarta.value = ceAratam;
      scrieHarta();
    });
  });

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
