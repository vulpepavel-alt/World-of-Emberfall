// ==========================================================
//  GENERATORUL DE ZONE
//
//  Pana acum hartile erau scrise in fisiere, litera cu litera:
//  350 KB pentru Greenvale, 790 KB pentru Redwaste. Cu douasprezece
//  zone am fi ajuns la vreo sase megabaiti de text, pe care
//  telefonul ar fi trebuit sa-i citeasca de fiecare data.
//
//  Acum harta NU se mai tine scrisa. Fiecare zona e o RETETA de
//  vreo cincizeci de randuri - cat de mare e, ce culori are, unde
//  sunt satul si pestera - iar harta se construieste cand intri
//  in ea, in vreo trei zecimi de secunda.
//
//  SAMANTA (seed) e numarul de la care porneste intamplarea.
//  Aceeasi samanta da mereu exact aceeasi harta, deci zona ta
//  arata la fel de fiecare data cand te intorci in ea.
// ==========================================================


// ----------------------------------------------------------
//  Intamplare statornica si zgomot
// ----------------------------------------------------------
function faZaruri(samanta) {
  let s = samanta >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Math.imul inmulteste numere intregi fara sa piarda cifre. Cu
// inmultirea obisnuita numarul iese prea mare, se rotunjeste, si
// zgomotul n-ar trece niciodata de 0,5.
function zgomotBrut(x, y, samanta) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) +
           Math.imul(samanta, 2246822519)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

// Acelasi zgomot, dar neted: intre doua puncte trece lin, nu sare.
function zgomotNeted(x, y, marime, samanta) {
  const fx = x / marime, fy = y / marime;
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const tx = fx - x0, ty = fy - y0;
  const nx = tx * tx * (3 - 2 * tx);
  const ny = ty * ty * (3 - 2 * ty);

  const a = zgomotBrut(x0,     y0,     samanta);
  const b = zgomotBrut(x0 + 1, y0,     samanta);
  const c = zgomotBrut(x0,     y0 + 1, samanta);
  const d = zgomotBrut(x0 + 1, y0 + 1, samanta);

  return (a * (1 - nx) + b * nx) * (1 - ny) + (c * (1 - nx) + d * nx) * ny;
}

// Mai multe zgomote suprapuse, tot mai marunte: forme mari plus detalii.
function zgomotBogat(x, y, marime, straturi, samanta) {
  let total = 0, greutate = 0, m = marime, g = 1;
  for (let i = 0; i < straturi; i++) {
    total += zgomotNeted(x, y, m, samanta + i * 101) * g;
    greutate += g;
    m /= 2;
    g /= 2;
  }
  return total / greutate;
}

// "Vreau ca o cincime din harta sa fie padure" e mai usor de reglat
// decat "vreau ca zgomotul sa fie peste 0,86". Luam cateva mii de
// puncte, le punem in ordine, si aflam de la ce valoare in sus se
// afla procentul cerut.
function pragPentruProcent(COL, RND, formula, procent) {
  const probe = [];
  for (let i = 0; i < 12000; i++) {
    const c = Math.floor(zgomotBrut(i, 1, 12345) * COL);
    const r = Math.floor(zgomotBrut(i, 2, 54321) * RND);
    probe.push(formula(c, r));
  }
  probe.sort(function (a, b) { return a - b; });
  return probe[Math.floor((1 - procent) * (probe.length - 1))];
}


// ----------------------------------------------------------
//  Tabla de litere
// ----------------------------------------------------------
function faTabla(coloane, randuri, litera) {
  const t = [];
  for (let r = 0; r < randuri; r++) t.push(new Array(coloane).fill(litera));
  return t;
}

function pune(t, c, r, litera) {
  if (r < 0 || r >= t.length || c < 0 || c >= t[0].length) return;
  t[r][c] = litera;
}

function ia(t, c, r) {
  if (r < 0 || r >= t.length || c < 0 || c >= t[0].length) return null;
  return t[r][c];
}

function disc(t, c0, r0, raza, litera) {
  for (let r = Math.floor(r0 - raza); r <= r0 + raza; r++) {
    for (let c = Math.floor(c0 - raza); c <= c0 + raza; c++) {
      const dc = c - c0, dr = r - r0;
      if (dc * dc + dr * dr <= raza * raza) pune(t, c, r, litera);
    }
  }
}

function dreptunghi(t, c0, r0, lat, inalt, litera) {
  for (let r = r0; r < r0 + inalt; r++) {
    for (let c = c0; c < c0 + lat; c++) pune(t, c, r, litera);
  }
}


// ==========================================================
//  CONSTRUIREA UNEI ZONE DIN RETETA EI
// ==========================================================
function construiesteZona(reteta) {

  const COL = reteta.COL, RND = reteta.RND, S = reteta.samanta;
  const L = reteta.litere;          // ce litera inseamna ce, in zona asta
  const t = faTabla(COL, RND, L.fond);

  const zona = {
    id: reteta.id,
    nume: reteta.nume,
    continent: reteta.continent,
    factiune: reteta.factiune || null,
    nivelDeLa: reteta.nivelDeLa,
    nivelPanaLa: reteta.nivelPanaLa,
    vecini: reteta.vecini || {},
    peHarta: reteta.peHarta,        // unde sta pe harta lumii
    teren: reteta.teren,
    harta: null,
    COL: COL, RND: RND,
    tabla: t,
    npci: [],
    mobi: []
  };


  // ---- 1. petele mari: dealuri, nisip, mlastina ----
  if (L.inalt) {
    const formula = function (c, r) {
      return zgomotBogat(c, r, 90, 3, S) + (c / COL) * (reteta.inclinare || 0);
    };
    const prag = pragPentruProcent(COL, RND, formula, reteta.procentInalt || 0.26);
    for (let r = 0; r < RND; r++) {
      for (let c = 0; c < COL; c++) if (formula(c, r) > prag) t[r][c] = L.inalt;
    }
  }

  // ---- 2. petice deschise: flori, nisip batut de vant ----
  if (L.petec) {
    const formula = function (c, r) { return zgomotBogat(c, r, 45, 2, S + 5000); };
    const prag = pragPentruProcent(COL, RND, formula, reteta.procentPetec || 0.09);
    for (let r = 0; r < RND; r++) {
      for (let c = 0; c < COL; c++) {
        if (t[r][c] !== L.fond) continue;
        if (formula(c, r) > prag) t[r][c] = L.petec;
      }
    }
  }

  // ---- 3. apa: rau (blocat) sau albie secata (se poate merge) ----
  if (L.apa) {
    for (let r = 0; r < RND; r++) {
      const mijloc = Math.round(COL * (reteta.apaLa || 0.46)
        + Math.sin(r / 52) * (reteta.apaUnduire || 42)
        + (zgomotNeted(0, r, 30, S + 77) - 0.5) * 60);
      const lat = (reteta.apaLatime || 6) + Math.round(zgomotNeted(0, r, 40, S + 91) * 5);
      for (let c = mijloc - lat; c <= mijloc + lat; c++) pune(t, c, r, L.apa);
      if (L.malApa) {
        pune(t, mijloc - lat - 1, r, L.malApa);
        pune(t, mijloc + lat + 1, r, L.malApa);
      }
    }
  }


  // ---- 4. drumurile ----
  // Serpuiesc: abaterea vine dintr-un zgomot neted, altfel ar fi
  // linii trase cu rigla si s-ar vedea ca sunt facute de un program.
  function drumOrizontal(rand, c1, c2) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
      const abatere = Math.round((zgomotNeted(c, 0, 55, S + 31) - 0.5) * 46);
      for (let r = rand + abatere - 1; r <= rand + abatere + 1; r++) {
        if (L.apa && ia(t, c, r) === L.apa && L.pod) pune(t, c, r, L.pod);
        else pune(t, c, r, L.drum);
      }
    }
  }

  function drumVertical(col, r1, r2) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      const abatere = Math.round((zgomotNeted(0, r, 55, S + 47) - 0.5) * 46);
      for (let c = col + abatere - 1; c <= col + abatere + 1; c++) {
        if (L.apa && ia(t, c, r) === L.apa && L.pod) pune(t, c, r, L.pod);
        else pune(t, c, r, L.drum);
      }
    }
  }

  zona.drumOrizontal = drumOrizontal;
  zona.drumVertical = drumVertical;

  drumOrizontal(Math.round(RND * 0.55), 20, COL - 20);
  drumOrizontal(Math.round(RND * 0.22), 20, COL - 20);
  drumVertical(Math.round(COL * 0.20), 20, RND - 20);
  drumVertical(Math.round(COL * 0.72), 20, RND - 20);


  // ---- 5. ce creste peste: padure, stanci, cactusi ----
  function langaDrum(c, r, cat) {
    for (let dr = -cat; dr <= cat; dr++) {
      for (let dc = -cat; dc <= cat; dc++) {
        const l = ia(t, c + dc, r + dr);
        if (l === L.drum || (L.pod && l === L.pod)) return true;
      }
    }
    return false;
  }

  const formulaDes = function (c, r) {
    const spreColt = (1 - c / COL) * 0.3 + (1 - r / RND) * 0.25;
    return zgomotBogat(c, r, 26, 3, S + 1200) + spreColt * (reteta.inclinareDes || 1);
  };
  const pragMare = pragPentruProcent(COL, RND, formulaDes, reteta.procentMare || 0.17);
  const pragMic  = pragPentruProcent(COL, RND, formulaDes, (reteta.procentMare || 0.17) + 0.07);

  const formulaStanca = function (c, r) { return zgomotBogat(c, r, 18, 2, S + 640); };
  const pragStanca = pragPentruProcent(COL, RND, formulaStanca, reteta.procentStanca || 0.09);

  const peCarePoate = [L.fond, L.petec, L.inalt].filter(Boolean);

  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      const l = t[r][c];
      if (peCarePoate.indexOf(l) < 0) continue;
      if (langaDrum(c, r, 3)) continue;

      const cat = formulaDes(c, r);
      if (L.des && cat > pragMare) t[r][c] = L.des;
      else if (L.marunt && cat > pragMic) t[r][c] = L.marunt;
      else if (L.stanca && formulaStanca(c, r) > pragStanca) t[r][c] = L.stanca;
    }
  }


  // ---- 6. marginea zonei ----
  const gros = reteta.margine || 7;
  for (let r = 0; r < RND; r++) {
    for (let c = 0; c < COL; c++) {
      if (r < gros || c < gros || r >= RND - gros || c >= COL - gros) t[r][c] = L.zid;
    }
  }

  return zona;
}


// ==========================================================
//  LOCURILE CARE CONTEAZA
//
//  Sat, tabara, pestera, mina, cetate, post de paza. Se pun peste
//  harta deja facuta, la locul spus in reteta.
// ==========================================================
function faCasa(t, c, r, L) {
  dreptunghi(t, c, r, 7, 3, L.acoperis);
  dreptunghi(t, c, r + 3, 7, 2, L.perete);
  pune(t, c + 3, r + 4, L.usa);
}


const LOCURI_CASE = [
  [-24, -17], [-13, -17], [-2, -17], [9, -17], [20, -17],
  [-24,  -8], [-13,  -8],            [9,  -8], [20,  -8],
  [-24,   5], [-13,   5], [-2,   5], [9,   5], [20,   5],
  [-24,  14], [-13,  14], [-2,  14], [9,  14]
];


function faLocul(zona, loc) {

  const t = zona.tabla, L = zona.litereScurt;
  const c = Math.round(zona.COL * loc.c), r = Math.round(zona.RND * loc.r);

  switch (loc.fel) {

    case 'sat':
      dreptunghi(t, c - 26, r - 20, 56, 44, L.fond);
      LOCURI_CASE.forEach(function (x) { faCasa(t, c + x[0], r + x[1], L); });
      disc(t, c, r - 3, 3, L.piatra || L.perete);
      if (L.apa) disc(t, c, r - 3, 1, L.apa);
      zona.drumOrizontal(r, c, Math.round(zona.COL * 0.20) + 6);
      break;

    case 'tabara':
      dreptunghi(t, c - 28, r - 22, 60, 48, L.fond);
      dreptunghi(t, c - 24, r - 18, 52, 1, L.palisada);
      dreptunghi(t, c - 24, r + 18, 52, 1, L.palisada);
      dreptunghi(t, c - 24, r - 18, 1, 37, L.palisada);
      dreptunghi(t, c + 27, r - 18, 1, 37, L.palisada);
      dreptunghi(t, c + 27, r - 2, 1, 5, L.fond);              // poarta
      [[-20, -14], [-10, -14], [2, -14], [12, -14],
       [-20,   2], [-10,   2],          [12,   2],
       [-20,  10], [-10,  10], [2,  10], [12,  10]].forEach(function (x) {
        dreptunghi(t, c + x[0], r + x[1], 6, 3, L.acoperis);
        dreptunghi(t, c + x[0], r + x[1] + 3, 6, 2, L.perete);
        pune(t, c + x[0] + 2, r + x[1] + 4, L.usa);
      });
      pune(t, c, r - 4, L.foc);
      zona.drumOrizontal(r, c + 28, Math.round(zona.COL * 0.20) + 6);
      break;

    case 'pestera':
      disc(t, c, r, 10, L.stanca || L.zid);
      disc(t, c, r + 2, 6, L.fond);
      dreptunghi(t, c - 1, r - 3, 3, 3, L.gaura);
      break;

    case 'mina':
      disc(t, c, r, 12, L.stanca || L.zid);
      disc(t, c, r + 3, 7, L.fond);
      dreptunghi(t, c - 2, r - 4, 4, 3, L.gaura);
      [[-9, 6], [8, 5], [-7, 9]].forEach(function (x) {
        disc(t, c + x[0], r + x[1], 2, L.stanca || L.zid);
      });
      zona.drumVertical(c, r, Math.round(zona.RND * 0.55));
      break;

    case 'cetate':
      dreptunghi(t, c - 18, r - 12, 36, 24, L.inalt || L.fond);
      dreptunghi(t, c - 15, r - 10, 30, 20, L.piatra || L.perete);
      dreptunghi(t, c - 11, r - 6,  22, 12, L.inalt || L.fond);
      pune(t, c, r + 10, L.usa);
      zona.drumVertical(c, r + 11, Math.round(zona.RND * 0.22));
      break;

    case 'corturi':
      disc(t, c, r, 15, L.fond);
      [[-9, -7], [8, -8], [-10, 6], [9, 5], [0, -10], [-2, 9]].forEach(function (x) {
        dreptunghi(t, c + x[0], r + x[1], 3, 3, L.cort);
      });
      pune(t, c, r, L.foc);
      break;

    case 'post':
      disc(t, c, r, 9, L.fond);
      dreptunghi(t, c - 5, r - 4, 10, 1, L.palisada);
      dreptunghi(t, c - 5, r + 4, 10, 1, L.palisada);
      dreptunghi(t, c - 5, r - 4, 1, 9, L.palisada);
      pune(t, c, r - 2, L.foc);
      zona.drumOrizontal(r, c - 12, c + 12);
      break;

    case 'ferma':
      dreptunghi(t, c - 20, r - 14, 44, 30, L.fond);
      faCasa(t, c - 3, r - 6, L);
      if (L.petec) {
        dreptunghi(t, c - 14, r + 2, 26, 10, L.petec);
        if (L.marunt) {
          dreptunghi(t, c - 14, r + 2, 26, 1, L.marunt);
          dreptunghi(t, c - 14, r + 11, 26, 1, L.marunt);
          dreptunghi(t, c + 2, r + 11, 6, 1, L.petec);
        }
      }
      zona.drumOrizontal(r - 2, c - 24, c + 24);
      break;

    case 'poiana':
      disc(t, c, r, loc.raza || 12, L.fond);
      if (L.foc) pune(t, c, r, L.foc);
      break;
  }

  return { col: c, rand: r };
}


// ==========================================================
//  UNDE SE POATE AJUNGE
// ==========================================================
function undeSePoateAjunge(zona, start) {

  const t = zona.tabla, COL = zona.COL, RND = zona.RND;
  const ajuns = [];
  for (let r = 0; r < RND; r++) ajuns.push(new Uint8Array(COL));

  const coada = [[start.col, start.rand]];
  ajuns[start.rand][start.col] = 1;

  while (coada.length > 0) {
    const p = coada.pop();
    const c = p[0], r = p[1];
    const vecini = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]];
    for (const v of vecini) {
      if (v[0] < 0 || v[1] < 0 || v[0] >= COL || v[1] >= RND) continue;
      if (ajuns[v[1]][v[0]]) continue;
      const felul = zona.teren[t[v[1]][v[0]]];
      if (!felul || felul.blocat) continue;
      ajuns[v[1]][v[0]] = 1;
      coada.push(v);
    }
  }
  return ajuns;
}


// Padurea deasa lasa poieni inchise de jur imprejur: teren pe care
// s-ar putea pasi, dar la care nu se poate ajunge. Le umplem, ca tot
// ce se vede liber pe harta sa fie si de ajuns.
function astupaPoieniileInchise(zona, ajuns, litera) {
  let astupate = 0;
  for (let r = 0; r < zona.RND; r++) {
    for (let c = 0; c < zona.COL; c++) {
      if (ajuns[r][c]) continue;
      const felul = zona.teren[zona.tabla[r][c]];
      if (!felul || felul.blocat) continue;
      zona.tabla[r][c] = litera;
      astupate++;
    }
  }
  return astupate;
}


// Sapa o poteca de la fiecare personaj prietenos inchis in buzunar
// pana da de teren la care se poate ajunge. Da inapoi true daca a
// sapat ceva, ca sa stim sa socotim din nou accesibilitatea.
function sapaSprePersonaje(zona, reteta, ajuns, start) {

  let aSapat = false;

  zona.npci.forEach(function (n) {

    if (ajuns[n.rand] && ajuns[n.rand][n.col]) return;

    // Mergem in linie dreapta spre locul de start si curatam pe unde
    // trecem, pana dam de o casuta la care se poate ajunge.
    let c = n.col, r = n.rand;
    for (let pas = 0; pas < 400; pas++) {

      disc(zona.tabla, c, r, 1, reteta.litere.drum);
      aSapat = true;

      if (ajuns[r] && ajuns[r][c]) break;

      const dc = start.col - c, dr = start.rand - r;
      if (dc === 0 && dr === 0) break;
      if (Math.abs(dc) > Math.abs(dr)) c += Math.sign(dc);
      else r += Math.sign(dr);
    }
  });

  return aSapat;
}


// ==========================================================
//  INAMICII
//
//  Nivelul lor creste cu departarea de locul unde intri in zona,
//  intre nivelDeLa si nivelPanaLa. Asa fiecare zona are un colt
//  bland si un colt care te omoara, ca in WoW.
// ==========================================================
function asazaMobii(zona, reteta, ajuns, start) {

  const zar = faZaruri(reteta.samanta + 4242);
  const mobi = [];
  const maxDist = Math.sqrt(zona.COL * zona.COL + zona.RND * zona.RND);
  const deLa = reteta.nivelDeLa, panaLa = reteta.nivelPanaLa;

  function nivelulDupaDistanta(c, r) {
    const dc = c - start.col, dr = r - start.rand;
    const dist = Math.sqrt(dc * dc + dr * dr);
    const raza1 = maxDist * 0.10;
    if (dist <= raza1) return deLa;
    const parte = Math.min(1, (dist - raza1) / (maxDist * 0.62 - raza1));
    return Math.max(deLa, Math.min(panaLa, Math.round(deLa + parte * (panaLa - deLa))));
  }

  const tabere = [];
  let incercari = 0;
  while (tabere.length < reteta.tabere && incercari < reteta.tabere * 900) {
    incercari++;

    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r][c]) continue;

    const inghesuit = tabere.some(function (tab) {
      const dc = tab.c - c, dr = tab.r - r;
      return Math.sqrt(dc * dc + dr * dr) < 40;
    });
    if (inghesuit) continue;

    const nivel = nivelulDupaDistanta(c, r);
    const feluri = reteta.feluriPeNivel(nivel);
    tabere.push({ fel: feluri[Math.floor(zar() * feluri.length)],
                  nivel: nivel, c: c, r: r, raza: 20, cati: 16 });
  }

  tabere.forEach(function (tabara) {
    let pusi = 0, incerc = 0;
    while (pusi < tabara.cati && incerc < tabara.cati * 200) {
      incerc++;
      const unghi = zar() * Math.PI * 2;
      const raza = Math.sqrt(zar()) * tabara.raza;
      const c = Math.round(tabara.c + Math.cos(unghi) * raza);
      const r = Math.round(tabara.r + Math.sin(unghi) * raza);

      if (r < 0 || c < 0 || r >= zona.RND || c >= zona.COL) continue;
      if (!ajuns[r][c]) continue;

      const preaAproape = mobi.some(function (m) {
        return Math.abs(m.col - c) < 3 && Math.abs(m.rand - r) < 3;
      });
      if (preaAproape) continue;

      mobi.push({ fel: tabara.fel, col: c, rand: r, nivel: tabara.nivel });
      pusi++;
    }
  });

  return mobi;
}


// ==========================================================
//  TOT LA UN LOC
//
//  Se cheama o singura data, cand intri in zona.
// ==========================================================
function faZona(reteta) {

  const inceput = (typeof performance !== 'undefined') ? performance.now() : Date.now();

  const zona = construiesteZona(reteta);
  zona.litereScurt = reteta.litere;

  // locurile care conteaza
  const asezate = {};
  (reteta.locuri || []).forEach(function (loc) {
    asezate[loc.id] = faLocul(zona, loc);
  });

  // de unde incepi
  const acasa = asezate[reteta.start.la] || { col: Math.round(zona.COL / 2), rand: Math.round(zona.RND / 2) };
  const start = { col: acasa.col + (reteta.start.dc || 0), rand: acasa.rand + (reteta.start.dr || 0) };

  // personajele prietenoase
  //
  // In jurul fiecaruia curatam o pata mica de teren. Fara asta, unul
  // pus langa gura minei ajungea in mijlocul stancii si nu se putea
  // ajunge la el - se intampla la Ironhill si la Saltcliff.
  zona.npci = (reteta.npci || []).map(function (n) {
    const unde = asezate[n.la] || acasa;
    const col = unde.col + (n.dc || 0), rand = unde.rand + (n.dr || 0);
    disc(zona.tabla, col, rand, 2, reteta.litere.fond);
    return { fel: n.fel, col: col, rand: rand };
  });

  // tot asa in jurul locului de start
  disc(zona.tabla, start.col, start.rand, 2, reteta.litere.fond);

  // Portile catre zonele vecine se taie ACUM, inainte sa socotim la ce
  // se poate ajunge - altfel astuparea poienilor le-ar putea inchide.
  zona.treceri = faTreceri(zona, reteta);

  // Portul: de aici pleci pe celalalt continent, cu corabia sau cu
  // zeppelinul. Sta intr-un loc obisnuit de pe harta, nu pe margine.
  if (reteta.port) {
    const unde = asezate[reteta.port.la];
    if (unde) {
      zona.portul = { fel: reteta.port.fel, catre: reteta.port.catre,
                      col: unde.col, rand: unde.rand };
      disc(zona.tabla, unde.col, unde.rand, 3, reteta.litere.drum);
    }
  }

  // ce e liber si la ce se poate ajunge
  let ajuns = undeSePoateAjunge(zona, start);

  // Se mai intampla ca un personaj sa cada intr-un buzunar inchis -
  // langa gura minei, in spatele zidului cetatii. Ii sapam o poteca
  // spre locul de start, altfel ar ramane acolo, de nevazut.
  if (sapaSprePersonaje(zona, reteta, ajuns, start)) {
    ajuns = undeSePoateAjunge(zona, start);
  }

  const astupate = astupaPoieniileInchise(zona, ajuns, reteta.litere.zid);
  if (astupate > 0) ajuns = undeSePoateAjunge(zona, start);

  zona.mobi = asazaMobii(zona, reteta, ajuns, start);

  zona.start = start;
  zona.reinviere = start;
  zona.harta = zona.tabla.map(function (rand) { return rand.join(''); });
  zona.timpDeFacut = Math.round(((typeof performance !== 'undefined') ? performance.now() : Date.now()) - inceput);

  delete zona.tabla;
  delete zona.drumOrizontal;
  delete zona.drumVertical;
  delete zona.litereScurt;

  return zona;
}


// ----------------------------------------------------------
//  Trecerile dintr-o zona in alta
//
//  Pe fiecare latura care are vecin se taie o poarta prin marginea
//  de padure sau de stanca. Cand ajungi pe ea, treci in zona vecina.
// ----------------------------------------------------------
function faTreceri(zona, reteta) {

  const treceri = [];
  const t = zona.tabla, L = reteta.litere;
  const gros = reteta.margine || 7;

  const laturi = {
    nord:   { c: Math.round(zona.COL * 0.20), r: 0,              dc: 0, dr: 1 },
    sud:    { c: Math.round(zona.COL * 0.72), r: zona.RND - 1,   dc: 0, dr: -1 },
    vest:   { c: 0,                           r: Math.round(zona.RND * 0.55), dc: 1, dr: 0 },
    est:    { c: zona.COL - 1,                r: Math.round(zona.RND * 0.22), dc: -1, dr: 0 }
  };

  Object.keys(laturi).forEach(function (latura) {

    const catre = (reteta.vecini || {})[latura];
    if (!catre) return;

    const p = laturi[latura];

    // Taiem un coridor prin marginea groasa, spre interior.
    //
    // ATENTIE: nu e destul sa trecem de margine. Daca ne oprim acolo,
    // coridorul se poate infunda in padurea deasa de dincolo de ea si
    // poarta ramane o fundatura. Asa ca sapam pana dam de un DRUM -
    // drumurile trec oricum prin dreptul fiecarei porti.
    const adancimeMaxima = 90;
    for (let pas = 0; pas <= adancimeMaxima; pas++) {

      const c = p.c + p.dc * pas, r = p.r + p.dr * pas;

      for (let lat = -3; lat <= 3; lat++) {
        if (p.dc === 0) pune(t, c + lat, r, L.drum);
        else pune(t, c, r + lat, L.drum);
      }

      // Am ajuns la un drum adevarat? Atunci ne oprim.
      if (pas > gros + 2) {
        let gasitDrum = false;
        for (let lat = -6; lat <= 6; lat++) {
          const urm = p.dc === 0
            ? ia(t, c + lat, r + p.dr * 2)
            : ia(t, c + p.dc * 2, r + lat);
          if (urm === L.drum) { gasitDrum = true; break; }
        }
        if (gasitDrum) break;
      }
    }

    treceri.push({
      latura: latura,
      catre: catre,
      col: p.c + p.dc * 2,
      rand: p.r + p.dr * 2,
      // incotro e interiorul zonei, ca sa stim unde sa te punem
      // cand intri: pe poarta nu se poate, te-ar trimite inapoi
      spreInauntruC: p.dc,
      spreInauntruR: p.dr
    });
  });

  return treceri;
}
