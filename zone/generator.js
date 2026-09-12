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
// ==========================================================
//  ORASUL, CA HARTA A LUI
//
//  Un oras principal nu e un loc pe harta unei zone. E o harta a
//  lui, in care intri pe poarta, la fel cum treci dintr-o zona in
//  alta: acelasi drum prin cod, doar ca harta de dincolo e facuta
//  din strazi si case in loc de padure.
//
//  Ce are altfel fata de o zona obisnuita:
//    - nu are inamici deloc (asazaMobii se opreste din prima)
//    - nu are margini spre vecini, are O POARTA inapoi in zona
//    - pamantul lui e pavaj, nu iarba
//
//  Ce are LA FEL: aceleasi litere, acelasi tabel de teren, aceleasi
//  personaje, aceeasi miniharta, aceeasi harta din meniu. Tot ce
//  stie jocul despre o zona stie si despre un oras.
// ==========================================================


// O casa de oras: acoperis, perete si o usa pe latura de miazazi.
function faCasaOras(t, c, r, lat, inalt, L) {
  dreptunghi(t, c, r, lat, inalt - 2, L.acoperis);
  dreptunghi(t, c, r + inalt - 2, lat, 2, L.perete);
  pune(t, c + Math.floor(lat / 2), r + inalt - 1, L.usa);
}


// Un cvartal: cate case incap intre doua strazi, insirate.
function faCvartal(t, c0, r0, lat, inalt, L, zar) {
  let c = c0;
  while (c + 9 <= c0 + lat) {
    const w = 8 + Math.floor(zar() * 3);          // 8, 9 sau 10 casute
    if (c + w > c0 + lat) break;
    let r = r0;
    while (r + 7 <= r0 + inalt) {
      const h = 6 + Math.floor(zar() * 2);
      if (r + h > r0 + inalt) break;
      faCasaOras(t, c, r, w - 1, h, L);
      r += h + 2;                                  // ulita din spate
    }
    c += w + 2;                                    // ulita dintre case
  }
}


function construiesteOras(reteta) {

  const COL = reteta.COL, RND = reteta.RND;
  const L = reteta.litere;
  const zar = faZaruri(reteta.samanta);

  // In afara zidului nu se poate merge.
  const t = faTabla(COL, RND, L.zid);

  const zona = {
    id: reteta.id, nume: reteta.nume, continent: reteta.continent,
    factiune: reteta.factiune || null, esteOras: true,
    nivelDeLa: reteta.nivelDeLa, nivelPanaLa: reteta.nivelPanaLa,
    vecini: {}, peHarta: reteta.peHarta || null,
    teren: reteta.teren, harta: null,
    COL: COL, RND: RND, tabla: t, npci: [], mobi: []
  };

  // ---- 1. zidul, si pavajul dinauntru ----
  const M = 5;
  dreptunghi(t, M, M, COL - M * 2, RND - M * 2, L.piatra);
  dreptunghi(t, M + 3, M + 3, COL - M * 2 - 6, RND - M * 2 - 6, L.drum);

  const turn = function (c, r) { dreptunghi(t, c - 4, r - 4, 8, 8, L.piatra); };
  [[M, M], [COL - M, M], [M, RND - M], [COL - M, RND - M],
   [Math.round(COL / 2), M], [Math.round(COL / 2), RND - M],
   [M, Math.round(RND / 2)], [COL - M, Math.round(RND / 2)]]
    .forEach(function (p) { turn(p[0], p[1]); });

  // ---- 2. locurile care nu primesc case ----
  const cPiata = Math.round(COL / 2);
  const rPiata = Math.round(RND * 0.46);
  const RAZA_PIATA = 26;
  const rCetate = M + 14, INALT_CETATE = 26, LAT_CETATE = 54;

  // ---- 3. cvartalele ----
  //
  // Strazile NU se deseneaza: pavajul e deja peste tot, iar strazile
  // sunt chiar golurile dintre cvartale. Asa nu se mai poate intampla
  // ca o strada si un cvartal sa fie socotite din doua colturi
  // diferite si sa ramana petece mari de pavaj gol intre ele.
  const PAS_C = 34, PAS_R = 28;          // cvartal + strada
  const BLOC_C = 27, BLOC_R = 21;        // cat tine cvartalul
  const marginea = M + 5;

  for (let r = marginea; r + BLOC_R <= RND - marginea; r += PAS_R) {
    for (let c = marginea; c + BLOC_C <= COL - marginea; c += PAS_C) {

      const mc = c + BLOC_C / 2, mr = r + BLOC_R / 2;

      // piata din mijloc
      if (Math.abs(mc - cPiata) < RAZA_PIATA + BLOC_C / 2 &&
          Math.abs(mr - rPiata) < RAZA_PIATA + BLOC_R / 2) continue;
      // bulevardul de la poarta in sus
      if (Math.abs(mc - cPiata) < BLOC_C / 2 + 6 && mr > rPiata) continue;
      // curtea cetatii
      if (Math.abs(mc - cPiata) < LAT_CETATE / 2 + BLOC_C / 2 &&
          mr < rCetate + INALT_CETATE + BLOC_R / 2) continue;

      // Unul din cinci cvartale e gradina, nu case. Fara ele orasul
      // ar fi o lespede de piatra de la un zid la altul.
      if (zar() < 0.2 && L.petec) {
        dreptunghi(t, c + 1, r + 1, BLOC_C - 2, BLOC_R - 2, L.petec);
        for (let i = 0; i < 5; i++) {
          disc(t, c + 3 + Math.floor(zar() * (BLOC_C - 6)),
                  r + 3 + Math.floor(zar() * (BLOC_R - 6)), 2, L.des || L.piatra);
        }
        continue;
      }

      faCvartal(t, c, r, BLOC_C, BLOC_R, L, zar);
    }
  }

  // ---- 4. bulevardul de la poarta pana in piata ----
  dreptunghi(t, cPiata - 6, rPiata, 13, RND - M - rPiata, L.drum);

  // ---- 5. cetatea, la miazanoapte ----
  dreptunghi(t, cPiata - LAT_CETATE / 2, rCetate, LAT_CETATE, INALT_CETATE, L.piatra);
  dreptunghi(t, cPiata - LAT_CETATE / 2 + 5, rCetate + 4, LAT_CETATE - 10, INALT_CETATE - 9, L.drum);
  dreptunghi(t, cPiata - 4, rCetate + INALT_CETATE - 5, 9, 5, L.usa);
  // drumul de la cetate spre piata - se opreste INAINTE de fantana,
  // altfel o taia in doua si apa ramanea in doua bucati laterale
  dreptunghi(t, cPiata - 4, rCetate + INALT_CETATE,
             9, (rPiata - RAZA_PIATA) - (rCetate + INALT_CETATE), L.drum);

  // ---- 6. piata, cu fantana la mijloc ----
  disc(t, cPiata, rPiata, RAZA_PIATA, L.drum);
  if (L.petec) {
    // patru petece de iarba in colturile pietei
    [[-17, -13], [17, -13], [-17, 13], [17, 13]].forEach(function (p) {
      disc(t, cPiata + p[0], rPiata + p[1], 5, L.petec);
    });
  }
  disc(t, cPiata, rPiata, 9, L.piatra);
  disc(t, cPiata, rPiata, 7, L.drum);
  disc(t, cPiata, rPiata, 4, L.piatra);
  disc(t, cPiata, rPiata, 3, L.apa);

  // ---- 7. poarta de la miazazi ----
  const cPoarta = cPiata;
  const rPoarta = RND - M - 1;
  dreptunghi(t, cPoarta - 6, RND - M - 4, 13, 8, L.drum);
  dreptunghi(t, cPoarta - 13, RND - M - 8, 7, 12, L.piatra);
  dreptunghi(t, cPoarta + 6, RND - M - 8, 7, 12, L.piatra);
  zona.poarta = { col: cPoarta, rand: rPoarta };

  // ---- 8. statiile de meserie ----
  //
  // Nicovala si masa de rune stau in piata, unde ajunge oricine.
  // Focul de gatit e chiar fantana... nu: il punem langa ea.
  if (L.nicovala) dreptunghi(t, cPiata - 20, rPiata + 14, 3, 2, L.nicovala);
  if (L.masaRune) dreptunghi(t, cPiata + 18, rPiata + 14, 3, 2, L.masaRune);
  if (L.foc) pune(t, cPiata, rPiata + 20, L.foc);

  // ---- 9. felinare pe marginea strazilor mari ----
  for (let r = marginea + BLOC_R + 3; r < RND - marginea; r += PAS_R) {
    for (let c = marginea + 6; c < COL - marginea; c += 16) {
      if (ia(t, c, r) === L.drum) pune(t, c, r, L.piatra);
    }
  }

  zona.drumOrizontal = function (rand, c1, c2) {
    dreptunghi(t, Math.min(c1, c2), rand - 1, Math.abs(c2 - c1), 3, L.drum);
  };
  zona.drumVertical = function (col, r1, r2) {
    dreptunghi(t, col - 1, Math.min(r1, r2), 3, Math.abs(r2 - r1), L.drum);
  };

  return zona;
}



// ==========================================================
//  TEMNITELE
//
//  O temnita NU e o bucata de padure cu inamici mai grasi. E o
//  harta inchisa, construita din camere si coridoare, la fel cum
//  orasul e construit din ziduri si cvartale - si merge mai departe
//  prin exact acelasi cod ca orice alta zona.
//
//  Ce o face temnita:
//    - totul e stanca, afara de ce sapam noi
//    - camerele sunt scrise in reteta, una cate una, cu numele lor
//    - coridoarele se sapa singure, de la o camera la urmatoarea
//    - in unele camere sta cate un sef, scris tot in reteta
//    - o singura iesire, inapoi de unde ai intrat
//
//  Cum se intra: dintr-un loc care exista deja pe harta unei zone
//  obisnuite - o pestera, o mina, o cetate. Nu inventam locuri noi,
//  le folosim pe cele care stau acolo degeaba.
// ==========================================================

const LAT_CORIDOR = 5;

function construiesteTemnita(reteta) {

  const COL = reteta.COL, RND = reteta.RND;
  const L = reteta.litere;

  // Totul e stanca. Sapam pe urma.
  const t = faTabla(COL, RND, L.zid);

  const zona = {
    id: reteta.id, nume: reteta.nume, continent: reteta.continent,
    factiune: null, esteTemnita: true, esteRaid: !!reteta.esteRaid,
    nivelDeLa: reteta.nivelDeLa, nivelPanaLa: reteta.nivelPanaLa,
    vecini: {}, peHarta: null,
    teren: reteta.teren, harta: null,
    COL: COL, RND: RND, tabla: t, npci: [], mobi: [], locuri: []
  };

  // ---- camerele ----
  const camere = (reteta.camere || []).map(function (cam) {
    const c = Math.round(cam.c * COL);
    const r = Math.round(cam.r * RND);
    return {
      id: cam.id, nume: cam.nume, sef: cam.sef || null,
      col: c, rand: r,
      lat: cam.lat || 26, inalt: cam.inalt || 20
    };
  });

  camere.forEach(function (cam) {
    // podeaua, si un chenar de piatra in jur ca sa se vada camera
    dreptunghi(t, cam.col - cam.lat / 2 - 1, cam.rand - cam.inalt / 2 - 1,
               cam.lat + 2, cam.inalt + 2, L.piatra);
    dreptunghi(t, cam.col - cam.lat / 2, cam.rand - cam.inalt / 2,
               cam.lat, cam.inalt, L.drum);
  });

  // ---- coridoarele: de la fiecare camera la urmatoarea ----
  //
  // In forma de L: intai pe orizontala, apoi pe verticala. Simplu si
  // de inteles cand te uiti pe harta, si nu se poate intampla sa
  // ramana o camera nelegata de restul.
  for (let i = 1; i < camere.length; i++) {
    const a = camere[i - 1], b = camere[i];
    const jum = Math.floor(LAT_CORIDOR / 2);
    dreptunghi(t, Math.min(a.col, b.col), a.rand - jum,
               Math.abs(b.col - a.col) + 1, LAT_CORIDOR, L.drum);
    dreptunghi(t, b.col - jum, Math.min(a.rand, b.rand),
               LAT_CORIDOR, Math.abs(b.rand - a.rand) + 1, L.drum);
  }

  // ---- locurile, pentru harta si pentru misiunile de mers ----
  zona.locuri = camere.map(function (cam) {
    return { fel: 'cartier', id: cam.id, nume: cam.nume,
             col: cam.col, rand: cam.rand,
             inima: { col: cam.col, rand: cam.rand } };
  });

  // ---- iesirea: in prima camera ----
  const intrare = camere[0];
  if (intrare) {
    zona.poarta = { col: intrare.col, rand: intrare.rand + Math.round(intrare.inalt / 2) - 1 };
  }

  zona.camere = camere;
  return zona;
}

function construiesteZona(reteta) {

  // Un oras principal are harta lui, facuta din strazi si case.
  // Mai departe merge prin exact acelasi cod ca orice zona.
  if (reteta.esteOras) return construiesteOras(reteta);
  if (reteta.esteTemnita || reteta.esteRaid) return construiesteTemnita(reteta);

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

  // INIMA locului: casuta la care trebuie sa poti ajunge ca sa spui
  // ca ai fost acolo. La un sat e chiar mijlocul lui. La o pestera,
  // la o mina sau la o cetate NU e mijlocul: mijlocul e stanca sau
  // zid, iar camera dinauntru e ceva mai jos. Fara randul asta,
  // pesterile si cetatile ramaneau inchise de tot - aratau a locuri,
  // dar erau bucati pline de piatra in care nu se putea intra.
  let inima = null;

  switch (loc.fel) {

    // ==========================================================
    //  ORASUL
    //
    //  Un oras nu e un sat mai mare. E altceva: zid de piatra de jur
    //  imprejur, patru porti, strazi care se taie in cruce, un piata
    //  cu fantana la mijloc, si case insirate pe strazi in loc de
    //  imprastiate pe camp.
    //
    //  Cate unul pe continent, in zona de langa cele doua tabere de
    //  inceput - ca sa poti ajunge la el de devreme, ca in WoW.
    // ==========================================================
    // ==========================================================
    //  POARTA ORASULUI
    //
    //  Pana acum tot orasul era desenat AICI, pe harta zonei. Acum
    //  orasul are harta lui, si ce ramane in zona e poarta prin care
    //  intri in el: un zid cu doua turnuri si o bolta.
    //
    //  Asa se ajunge la oras la fel cum se trece dintr-o zona in
    //  alta - te duci la poarta si intri.
    // ==========================================================
    case 'oras': {
      const LAT = 46, INALT = 16;
      const c0 = c - LAT / 2, r0 = r - INALT / 2;

      // pamant curatat in fata portii
      dreptunghi(t, c0 - 10, r0 - 10, LAT + 20, INALT + 26, L.fond);
      dreptunghi(t, c0 - 10, r0 + INALT, LAT + 20, 16, L.drum);

      // zidul, cu bolta la mijloc
      dreptunghi(t, c0, r0, LAT, INALT - 4, L.piatra);
      dreptunghi(t, c - 5, r0, 10, INALT, L.drum);

      // doua turnuri de poarta
      dreptunghi(t, c - 13, r0 - 5, 8, INALT + 5, L.piatra);
      dreptunghi(t, c + 5, r0 - 5, 8, INALT + 5, L.piatra);

      // drumurile care duc la ea
      zona.drumVertical(c, r + INALT, Math.round(zona.RND * 0.55));
      zona.drumOrizontal(r + INALT + 8, c - 40, c + 40);
      break;
    }

    // O nicovala langa fiecare sat: fara ea nu se poate forja nimic.
    case 'sat':
      dreptunghi(t, c - 26, r - 20, 56, 44, L.fond);
      LOCURI_CASE.forEach(function (x) { faCasa(t, c + x[0], r + x[1], L); });
      disc(t, c, r - 3, 3, L.piatra || L.perete);
      if (L.apa) disc(t, c, r - 3, 1, L.apa);
      zona.drumOrizontal(r, c, Math.round(zona.COL * 0.20) + 6);
      // Nicovala si focul, PESTE sat - daca le puneam inainte, le
      // acoperea chiar pamantul satului, desenat dupa ele.
      if (L.nicovala) dreptunghi(t, c + 2, r + 9, 3, 2, L.nicovala);
      if (L.foc) pune(t, c - 4, r + 10, L.foc);
      break;

    case 'tabara':
      dreptunghi(t, c - 28, r - 22, 60, 48, L.fond);
      dreptunghi(t, c - 24, r - 18, 52, 1, L.palisada);
      dreptunghi(t, c - 24, r + 18, 52, 1, L.palisada);
      dreptunghi(t, c - 24, r - 18, 1, 37, L.palisada);
      dreptunghi(t, c + 27, r - 18, 1, 37, L.palisada);
      dreptunghi(t, c + 27, r - 2, 1, 5, L.fond);              // poarta
      if (L.nicovala) dreptunghi(t, c + 2, r + 14, 3, 2, L.nicovala);
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
      inima = { col: c, rand: r + 2 };
      break;

    case 'mina':
      disc(t, c, r, 12, L.stanca || L.zid);
      disc(t, c, r + 3, 7, L.fond);
      dreptunghi(t, c - 2, r - 4, 4, 3, L.gaura);
      [[-9, 6], [8, 5], [-7, 9]].forEach(function (x) {
        disc(t, c + x[0], r + x[1], 2, L.stanca || L.zid);
      });
      zona.drumVertical(c, r, Math.round(zona.RND * 0.55));
      inima = { col: c, rand: r + 3 };
      break;

    case 'cetate':
      dreptunghi(t, c - 18, r - 12, 36, 24, L.inalt || L.fond);
      dreptunghi(t, c - 15, r - 10, 30, 20, L.piatra || L.perete);
      dreptunghi(t, c - 11, r - 6,  22, 12, L.inalt || L.fond);
      pune(t, c, r + 10, L.usa);
      zona.drumVertical(c, r + 11, Math.round(zona.RND * 0.22));
      inima = { col: c, rand: r };
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

    // Un cartier de oras nu se deseneaza aici: orasul e desenat deja,
    // cu strazi si case. Cartierul e doar un punct de care se agata
    // oamenii, ca sa stim unde sta fierarul si unde negustorul.
    case 'cartier':
      break;
  }

  return { col: c, rand: r, inima: inima || { col: c, rand: r } };
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
function sapaSprePuncte(zona, reteta, ajuns, start) {

  let aSapat = false;

  // Personajele prietenoase SI portul trebuie sa fie de ajuns.
  // Portul se intampla sa cada in mijlocul unei cetati de piatra,
  // si atunci n-ai cum sa te urci pe corabie.
  const puncte = zona.npci.slice();
  if (zona.portul) puncte.push(zona.portul);

  // Si spre inima fiecarui loc de pe harta. O pestera e un disc de
  // stanca cu o camera inauntru, si camera aia nu era legata de
  // nimic: se astupa singura la pasul urmator si pestera ramanea o
  // piatra plina. La fel cetatile. Acum li se sapa o intrare.
  (zona.locuri || []).forEach(function (l) {
    if (l.inima) puncte.push(l.inima);
  });

  puncte.forEach(function (n) {

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
// ==========================================================
//  NODURILE DE STRANS
//
//  Minereu si plante, imprastiate pe teren la care se poate ajunge.
//  Nu se aduna gramada si nu cad in casute blocate: se aseaza la
//  fel ca inamicii, pe ce s-a dovedit deja ca e umblabil.
//
//  Ce noduri intra intr-o zona depinde de nivelul ei: intr-o zona
//  de inceput n-are rost sa fie minereu pe care nu-l poate atinge
//  nimeni de nivelul ala.
// ==========================================================
function asazaNodurile(zona, reteta, ajuns) {

  if (reteta.esteOras || reteta.esteTemnita || reteta.esteRaid) return [];
  if (typeof NODURI === 'undefined') return [];   // fara meserii, fara noduri

  const feluri = nodurilePotriviteZonei(reteta.nivelDeLa);
  if (!feluri.length) return [];

  const zar = faZaruri(reteta.samanta + 9191);
  const noduri = [];
  const cate = reteta.noduri || 70;

  let incercari = 0;
  while (noduri.length < cate && incercari < cate * 400) {
    incercari++;

    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r][c]) continue;

    // Nu doua noduri unul in altul.
    const inghesuit = noduri.some(function (n) {
      return Math.abs(n.col - c) < 14 && Math.abs(n.rand - r) < 14;
    });
    if (inghesuit) continue;

    noduri.push({
      fel: feluri[Math.floor(zar() * feluri.length)],
      col: c, rand: r
    });
  }

  return noduri;
}


// ----------------------------------------------------------
//  GARZILE ORASULUI
//
//  Un oras e AL unei tabere. Cine vine din cealalta da de garzi:
//  la poarta, pe bulevard si in piata.
//
//  Se aseaza ca ORICE alt inamic - acelasi fel de punct, aceeasi
//  lupta, aceeasi prada. Ce le face deosebite e un singur camp,
//  'doarStraini': jocul le sare cu totul daca esti din tabara
//  orasului, si atunci orasul e linistit exact ca pana acum.
// ----------------------------------------------------------
const GARZI_LA_POARTA = 4;
const GARZI_LA_CARTIER = 3;

function asazaGarzile(zona, reteta, ajuns) {

  if (!reteta.factiune) return [];          // oras fara tabara: nimeni

  const garzi = [];
  const nivel = 60;

  function pune(col, rand) {
    if (rand < 0 || col < 0 || rand >= zona.RND || col >= zona.COL) return;
    if (!ajuns[rand][col]) return;
    const inghesuit = garzi.some(function (g) {
      return Math.abs(g.col - col) < 3 && Math.abs(g.rand - rand) < 3;
    });
    if (inghesuit) return;
    garzi.push({ fel: 'garda', col: col, rand: rand, nivel: nivel,
                 rang: 'elit', doarStraini: true });
  }

  // La poarta, in doua randuri de o parte si de alta a drumului.
  if (zona.poarta) {
    for (let i = 0; i < GARZI_LA_POARTA; i++) {
      const latura = (i % 2 === 0) ? -1 : 1;
      const adanc = 6 + Math.floor(i / 2) * 7;
      pune(zona.poarta.col + latura * 5, zona.poarta.rand - adanc);
    }
  }

  // Cateva in fiecare cartier, unde stau oamenii.
  (zona.locuri || []).forEach(function (loc) {
    for (let i = 0; i < GARZI_LA_CARTIER; i++) {
      const unghi = (i / GARZI_LA_CARTIER) * Math.PI * 2;
      pune(Math.round(loc.col + Math.cos(unghi) * 11),
           Math.round(loc.rand + Math.sin(unghi) * 11));
    }
  });

  return garzi;
}


function asazaMobii(zona, reteta, ajuns, start) {

  // Intr-un oras nu intra fiarele. Nici sobolani, nici talhari -
  // doar garzile, si alea numai pentru cine nu e de-al casei.
  if (reteta.esteOras) return asazaGarzile(zona, reteta, ajuns);
  if (reteta.esteTemnita || reteta.esteRaid) return asazaTrashul(zona, reteta, ajuns);

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

  // ---- CATE TABERE ----
  //
  // Numarul scris in fisierul zonei nu tinea cont de cat e zona de
  // mare, si iesea altfel in fiecare loc. Masurat in Thornmoor: din
  // 300 de puncte pe unde puteai umbla, 98 (o treime) n-aveau NICIUN
  // inamic in raza in care apar - adica mergeai minute intregi prin
  // gol. In WoW sunt si acolo bucati goale, dar nu o treime din zona.
  //
  // Acum taberele ies din SUPRAFATA zonei, una la fiecare 3600 de
  // casute (adica o tabara la un patrat de vreo 60x60). Numarul scris
  // de mana ramane ca prag de jos: nicio zona nu primeste mai putin
  // decat avea.
  const cateTabere = Math.max(reteta.tabere || 0,
                              Math.round(zona.COL * zona.RND / 3600));

  // Cat de aproape pot sta doua tabere. Mai stranse decat inainte,
  // altfel n-ar incapea cele noi si s-ar opri la jumatate.
  const DEPARTE_INTRE_TABERE = 30;

  const tabere = [];
  let incercari = 0;
  while (tabere.length < cateTabere && incercari < cateTabere * 900) {
    incercari++;

    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r][c]) continue;

    const inghesuit = tabere.some(function (tab) {
      const dc = tab.c - c, dr = tab.r - r;
      return Math.sqrt(dc * dc + dr * dr) < DEPARTE_INTRE_TABERE;
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
//  CEI RARI SI CEL ELIT
//
//  Trei rari si un elit in fiecare zona, ca in WoW.
//
//  Nu stau in tabere: stau SINGURI, prin colturi, departe de
//  drumuri si de locul unde intri. Pe cel elit il pui in cel mai
//  departat colt la care se poate ajunge - trebuie sa fie greu de
//  gasit, nu doar greu de omorat.
//
//  Locurile lor nu sunt la intamblare de la o intrare la alta:
//  ies din samanta zonei, deci ii gasesti mereu in acelasi loc.
// ==========================================================
// Sefii unei temnite: unul in fiecare camera care are unul scris.
// Nu se aseaza la intamplare, fiindca o temnita e un drum, nu un
// camp - vrei sa stii unde te duci si pe cine gasesti acolo.
function asazaSefiiTemnitei(zona, reteta) {
  const cei = [];
  (zona.camere || []).forEach(function (cam) {
    if (!cam.sef) return;
    cei.push({
      fel: cam.sef.fel, col: cam.col, rand: cam.rand,
      nivel: cam.sef.nivel || reteta.nivelPanaLa,
      rang: cam.sef.rang || 'elit',
      nume: cam.sef.nume,
      lasa: cam.sef.lasa || null,
      sefDeTemnita: true
    });
  });
  return cei;
}


// Inamicii marunti dintr-o temnita: pe coridoare si prin camere, in
// grupuri mici, ca sa ai ce face intre sefi.
function asazaTrashul(zona, reteta, ajuns) {

  const zar = faZaruri(reteta.samanta + 808);
  const mobi = [];
  const cati = reteta.trash || 60;

  let incercari = 0;
  while (mobi.length < cati && incercari < cati * 400) {
    incercari++;
    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r] || !ajuns[r][c]) continue;

    // nu chiar in poala unui sef
    const langaSef = (zona.camere || []).some(function (cam) {
      return cam.sef && Math.abs(cam.col - c) < 10 && Math.abs(cam.rand - r) < 10;
    });
    if (langaSef) continue;

    const preaAproape = mobi.some(function (m) {
      return Math.abs(m.col - c) < 4 && Math.abs(m.rand - r) < 4;
    });
    if (preaAproape) continue;

    const feluri = reteta.feluriPeNivel(reteta.nivelPanaLa);
    mobi.push({ fel: feluri[Math.floor(zar() * feluri.length)],
                col: c, rand: r,
                nivel: reteta.nivelDeLa +
                       Math.floor(zar() * (reteta.nivelPanaLa - reteta.nivelDeLa + 1)) });
  }

  return mobi;
}


function asazaRariiSiElitul(zona, reteta, ajuns, start, mobi) {

  if (reteta.esteOras) return [];
  // Intr-o temnita, sefii sunt scrisi de mana in reteta: nu punem
  // si rari la intamplare peste ei.
  if (reteta.esteTemnita || reteta.esteRaid) return asazaSefiiTemnitei(zona, reteta);

  const zar = faZaruri(reteta.samanta + 777);
  const cei = [];

  // Cat de departe de start e fiecare casuta buna.
  function departare(c, r) {
    const dc = c - start.col, dr = r - start.rand;
    return Math.sqrt(dc * dc + dr * dr);
  }

  const maxDist = Math.sqrt(zona.COL * zona.COL + zona.RND * zona.RND);

  // --- cei trei rari ---
  let pusi = 0, incercari = 0;
  while (pusi < 3 && incercari < 4000) {
    incercari++;

    const c = Math.floor(zar() * zona.COL);
    const r = Math.floor(zar() * zona.RND);
    if (!ajuns[r][c]) continue;

    // nu chiar langa tabara, si nu unul peste altul
    if (departare(c, r) < maxDist * 0.25) continue;
    if (cei.some(function (x) { return departare(x.col - c + start.col,
                                                 x.rand - r + start.rand) < 60; })) continue;
    const preaAproapeDeAltul = cei.some(function (x) {
      return Math.sqrt((x.col - c) * (x.col - c) + (x.rand - r) * (x.rand - r)) < 120;
    });
    if (preaAproapeDeAltul) continue;

    // nivelul lor: spre capatul de sus al zonei
    const nivel = Math.min(reteta.nivelPanaLa,
                           reteta.nivelDeLa + Math.round((reteta.nivelPanaLa - reteta.nivelDeLa) * 0.7) + pusi);
    const feluri = reteta.feluriPeNivel(nivel);
    const fel = feluri[Math.floor(zar() * feluri.length)];

    cei.push({ fel: fel, col: c, rand: r, nivel: nivel, rang: 'rar',
               nume: numeDeRar(reteta.samanta + pusi * 37) });
    pusi++;
  }

  // --- elitul: in cel mai departat colt la care se poate ajunge ---
  let celMaiDeparte = null, ceaMaiMare = 0;
  for (let r = 0; r < zona.RND; r += 4) {
    for (let c = 0; c < zona.COL; c += 4) {
      if (!ajuns[r][c]) continue;
      const d = departare(c, r);
      if (d > ceaMaiMare) { ceaMaiMare = d; celMaiDeparte = { c: c, r: r }; }
    }
  }

  if (celMaiDeparte) {
    const feluri = reteta.feluriPeNivel(reteta.nivelPanaLa);
    const fel = feluri[feluri.length - 1];
    const numeFel = (typeof MOBI !== 'undefined' && MOBI[fel]) ? MOBI[fel].nume : fel;
    cei.push({ fel: fel, col: celMaiDeparte.c, rand: celMaiDeparte.r,
               nivel: reteta.nivelPanaLa, rang: 'elit',
               nume: numeDeElit(reteta.samanta, numeFel) });
  }

  // --- SEFUL, daca zona are unul scris in reteta ---
  //
  // Elitul obisnuit se aseaza singur, in coltul cel mai departat.
  // Seful nu: el sta intr-un loc anume, scris de mana, fiindca
  // povestea spune unde e. Zona ii da numele si locul.
  if (reteta.sef) {
    const unde = (zona.locuri || []).find(function (l) {
      return l.id === reteta.sef.la;
    });
    if (unde) {
      const inima = unde.inima || unde;
      cei.push({ fel: reteta.sef.fel, col: inima.col, rand: inima.rand,
                 nivel: reteta.sef.nivel || reteta.nivelPanaLa,
                 rang: 'sef', nume: reteta.sef.nume, esteSeful: true });
    }
  }

  // Facem loc in jurul lor: nimeni nu vrea sa se bata cu un elit
  // lipit de un copac.
  cei.forEach(function (x) { disc(zona.tabla, x.col, x.rand, 4, reteta.litere.fond); });

  return cei;
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
  //
  // Le si TINEM MINTE pe zona, nu doar le desenam. Harta lumii are
  // nevoie de ele ca sa puna semne pe ea, si misiunile ca sa te
  // trimita undeva anume ("du-te si vezi ce e la mina").
  const asezate = {};

  // La o temnita, "locurile" sunt camerele, si ele s-au asezat deja
  // cand s-a construit harta. Nu le mai facem o data si mai ales nu
  // le stergem: fara randul asta, harta temnitei ramanea fara nume
  // de camere si intrarea nu se mai gasea dupa id.
  if (reteta.esteTemnita || reteta.esteRaid) {
    (zona.locuri || []).forEach(function (loc) { asezate[loc.id] = loc; });
  }

  (reteta.locuri || []).forEach(function (loc) {
    asezate[loc.id] = faLocul(zona, loc);
  });

  if (!reteta.esteTemnita && !reteta.esteRaid) zona.locuri = (reteta.locuri || []).map(function (loc) {
    return { id: loc.id, fel: loc.fel,
             // Numele adevarat al locului, scris in reteta zonei. E
             // SINGURUL loc unde e scris: si harta, si misiunile il
             // iau de aici, ca sa nu se poata intampla ca harta sa
             // spuna "Cave" iar misiunea "the river cave".
             nume: loc.nume || null,
             col: asezate[loc.id].col, rand: asezate[loc.id].rand,
             inima: asezate[loc.id].inima };
  });

  // de unde incepi
  //
  // O temnita nu scrie asta in reteta: intri mereu prin prima
  // camera, si acolo e si iesirea. Ar fi un rand in plus de scris
  // la fiecare temnita, si unul in plus de gresit.
  const undeStart = reteta.start
    || ((reteta.esteTemnita || reteta.esteRaid) && zona.camere && zona.camere.length
        ? { la: zona.camere[0].id } : { la: null });

  const acasa = asezate[undeStart.la] || { col: Math.round(zona.COL / 2), rand: Math.round(zona.RND / 2) };
  const start = { col: acasa.col + (undeStart.dc || 0), rand: acasa.rand + (undeStart.dr || 0) };

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

  // ---- intrarile in orase si iesirea din ele ----
  //
  // Nu e un sistem nou: le punem in ACEEASI lista zona.treceri in
  // care stau portile catre zonele vecine. Asa merg din prima si
  // verificarea din joc, si stalpul cu numele, si semnul de pe
  // miniharta, si harta din meniu - nimic de racordat.
  // Temnitele nu se scriu in reteta zonei-mama. Fiecare isi spune
  // singura de unde se intra in ea ('intrareDin'), iar aici le
  // cautam pe toate care arata spre zona asta. Asa, o temnita noua
  // inseamna UN FISIER NOU si nimic altceva - nu umblam si prin
  // reteta zonei ca sa n-o stricam.
  const intrariTemnite = (typeof ZONE !== 'undefined' ? ZONE : [])
    .filter(function (z) {
      return z.intrareDin && z.intrareDin.zona === reteta.id;
    })
    .map(function (z) {
      return { la: z.intrareDin.loc, catre: z.id };
    });

  (reteta.intrari || []).concat(intrariTemnite).forEach(function (intrare) {
    const unde = asezate[intrare.la];
    if (!unde) return;
    zona.treceri.push({
      latura: 'poarta', catre: intrare.catre,
      col: unde.col, rand: unde.rand,
      // cand te intorci din oras, apari in fata portii, nu in ea
      spreInauntruC: 0, spreInauntruR: 1
    });
  });

  // Iesirea dintr-o temnita: inapoi in zona din care ai intrat.
  // Nu trebuie scrisa de mana, se stie din 'intrareDin'.
  if ((reteta.esteTemnita || reteta.esteRaid) && reteta.intrareDin && zona.poarta) {
    zona.treceri.push({
      latura: 'poarta', catre: reteta.intrareDin.zona,
      col: zona.poarta.col, rand: zona.poarta.rand,
      spreInauntruC: 0, spreInauntruR: -1
    });
  }

  if (reteta.iesire && zona.poarta) {
    zona.treceri.push({
      latura: 'poarta', catre: reteta.iesire.catre,
      col: zona.poarta.col, rand: zona.poarta.rand,
      // cand intri in oras, apari inauntrul lui, la nord de poarta
      spreInauntruC: 0, spreInauntruR: -1
    });
  }

  // ce e liber si la ce se poate ajunge
  let ajuns = undeSePoateAjunge(zona, start);

  // Se mai intampla ca un personaj sa cada intr-un buzunar inchis -
  // langa gura minei, in spatele zidului cetatii. Ii sapam o poteca
  // spre locul de start, altfel ar ramane acolo, de nevazut.
  if (sapaSprePuncte(zona, reteta, ajuns, start)) {
    ajuns = undeSePoateAjunge(zona, start);
  }

  const astupate = astupaPoieniileInchise(zona, ajuns, reteta.litere.zid);
  if (astupate > 0) ajuns = undeSePoateAjunge(zona, start);

  zona.mobi = asazaMobii(zona, reteta, ajuns, start);

  // Minereul si plantele, pe acelasi teren umblabil.
  zona.noduri = asazaNodurile(zona, reteta, ajuns);

  // Cei trei rari si elitul, pe deasupra.
  zona.mobi = zona.mobi.concat(asazaRariiSiElitul(zona, reteta, ajuns, start, zona.mobi));

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
