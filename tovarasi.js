// ==========================================================
//  TOVARASII DE INCHIRIAT
//
//  Jocul e de unul singur, dar o temnita e facuta pentru un grup.
//  Solutia: oameni pe care ii angajezi din oras si care vin cu tine.
//
//  Nu e un sistem nou. Animalul vanatorului face de mult exact asta
//  - te urmeaza, se bate, incaseaza in locul tau, moare si il ridici
//  la loc. Tovarasii sunt animalul ala, generalizat: mai multi
//  deodata si cu trei roluri diferite.
//
//  CATI POTI LUA depinde de unde esti, exact cum ai cerut:
//
//    in lume        1   (unul singur, oricare)
//    in temnita     3   un scutier, un vindecator, un tragator
//    in raid        5   un scutier, doi vindecatori, doi tragatori
//
//  Nu trebuie sa-i chemi: cine e angajat vine singur, atati cati
//  incap in locul in care esti. Intri intr-o temnita si vin trei,
//  iesi in lume si ramane unul.
// ==========================================================


// ---- cele trei feluri ----
//
// viata / dmg = de cate ori mai mult decat un inamic obisnuit de
// nivelul tau. Scutierul tine mult si loveste moale, tragatorul
// invers, vindecatorul nu se bate aproape deloc.
const TOVARASI = {

  scutier: {
    id: 'scutier', rol: 'tanc',
    nume: TEXT.HIRE_SHIELD, titlu: TEXT.HIRE_SHIELD_T,
    pret: 4000, viata: 2.6, dmg: 0.55, viteza: 2.2,
    culoare: '#8fb0d0',
    forme: [
      { fel: 'dr',   x:  -9, y:  4, w:  9, h: 12, culoare: 0x9aa0ab },  // scut
      { fel: 'dr',   x:   0, y:  5, w: 18, h: 17, culoare: 0x6b6f78 },
      { fel: 'dr',   x:   0, y:  2, w: 18, h:  4, culoare: 0x8f5a2c },
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },
      { fel: 'dr',   x:   0, y:-13, w: 18, h:  8, culoare: 0x8a8f98 },
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  medic: {
    id: 'medic', rol: 'vindecator',
    nume: TEXT.HIRE_MEDIC, titlu: TEXT.HIRE_MEDIC_T,
    pret: 4000, viata: 1.4, dmg: 0.30, viteza: 2.6,
    vindeca: 0.26,          // din viata maxima a celui vindecat
    pauzaVindecare: 4200,   // milisecunde intre doua vindecari
    culoare: '#9fd8a0',
    forme: [
      { fel: 'dr',   x:   0, y:  8, w: 18, h: 14, culoare: 0xe6ddc4 },  // roba alba
      { fel: 'dr',   x:   0, y:  4, w: 18, h:  8, culoare: 0xd8cdb0 },
      { fel: 'dr',   x:   0, y:  5, w:  4, h: 12, culoare: 0xc25a4a },  // cruce
      { fel: 'dr',   x:  -5, y:  8, w: 14, h:  4, culoare: 0xc25a4a },
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xefc49e },
      { fel: 'dr',   x:   0, y:-14, w: 17, h:  6, culoare: 0x6b5a3a },
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  },

  arcas: {
    id: 'arcas', rol: 'lovitor',
    nume: TEXT.HIRE_BOW, titlu: TEXT.HIRE_BOW_T,
    pret: 4000, viata: 1.2, dmg: 1.55, viteza: 2.4,
    deLaDistanta: true,
    culoare: '#d8c08a',
    forme: [
      { fel: 'dr',   x:  10, y: -2, w:  3, h: 20, culoare: 0x6b4a28 },  // arc
      { fel: 'dr',   x:   0, y:  6, w: 17, h: 15, culoare: 0x4a5a3a },
      { fel: 'dr',   x:   0, y:  3, w: 17, h:  3, culoare: 0x8f5a2c },
      { fel: 'cerc', x:   0, y: -9, r:  8,        culoare: 0xd8b08a },
      { fel: 'dr',   x:   0, y:-14, w: 17, h:  6, culoare: 0x3a4a2c },
      { fel: 'dr',   x:  -3, y: -8, w:  2, h:  2, culoare: 0x120f0c },
      { fel: 'dr',   x:   3, y: -8, w:  2, h:  2, culoare: 0x120f0c }
    ]
  }
};


// ---- cati incap, si de ce fel, dupa locul in care esti ----
const LIMITE_TOVARASI = {
  lume:    { total: 1, tanc: 1, vindecator: 1, lovitor: 1 },
  temnita: { total: 3, tanc: 1, vindecator: 1, lovitor: 1 },
  raid:    { total: 5, tanc: 1, vindecator: 2, lovitor: 2 }
};

function limiteleLocului(z) {
  if (z && z.esteRaid) return LIMITE_TOVARASI.raid;
  if (z && z.esteTemnita) return LIMITE_TOVARASI.temnita;
  return LIMITE_TOVARASI.lume;
}


// ---- cine e angajat ----
//
// personaj.tovarasi e o lista de {fel, viata}. Poate avea doi de
// acelasi fel (un raid cere doi vindecatori), de asta e lista si nu
// un obiect cu chei.
function tovarasiiTai(personajul) {
  return (personajul && personajul.tovarasi) || [];
}


function catiAiDinRol(personajul, rol) {
  return tovarasiiTai(personajul).filter(function (t) {
    return TOVARASI[t.fel] && TOVARASI[t.fel].rol === rol;
  }).length;
}


// Poti sa mai angajezi unul de felul asta?
//
// Limita de angajare e cea mai larga din joc (a raidului): ii tii
// angajati pe toti, si vin cu tine atatia cati incap unde esti.
function potiAngaja(personajul, fel) {

  const f = TOVARASI[fel];
  if (!f) return { poti: false, motiv: 'fel' };

  const max = LIMITE_TOVARASI.raid;
  if (tovarasiiTai(personajul).length >= max.total) {
    return { poti: false, motiv: 'plin' };
  }
  if (catiAiDinRol(personajul, f.rol) >= max[f.rol]) {
    return { poti: false, motiv: 'rol' };
  }
  if ((personajul.bani || 0) < f.pret) {
    return { poti: false, motiv: 'bani' };
  }
  return { poti: true, cost: f.pret };
}


function angajeaza(personajul, fel) {
  const se = potiAngaja(personajul, fel);
  if (!se.poti) return null;
  personajul.bani -= se.cost;
  personajul.tovarasi = tovarasiiTai(personajul).slice();
  personajul.tovarasi.push({ fel: fel, viata: null });
  return TOVARASI[fel];
}


function concediaza(personajul, indice) {
  const ai = tovarasiiTai(personajul).slice();
  if (indice < 0 || indice >= ai.length) return false;
  ai.splice(indice, 1);
  personajul.tovarasi = ai;
  return true;
}


// Care dintre cei angajati vin cu tine AICI, in ordinea in care
// incap. Scutierul intai: daca e loc pentru unul singur, vrei sa fie
// cel care incaseaza.
const ORDINEA_ROLURILOR = ['tanc', 'vindecator', 'lovitor'];

function tovarasiiDeFata(personajul, z) {

  const limite = limiteleLocului(z);
  const alesi = [];
  const peRol = { tanc: 0, vindecator: 0, lovitor: 0 };

  ORDINEA_ROLURILOR.forEach(function (rol) {
    tovarasiiTai(personajul).forEach(function (t, i) {
      const f = TOVARASI[t.fel];
      if (!f || f.rol !== rol) return;
      if (alesi.length >= limite.total) return;
      if (peRol[rol] >= limite[rol]) return;
      peRol[rol]++;
      alesi.push({ fel: t.fel, indice: i });
    });
  });

  return alesi;
}


// ---- statisticile unuia, la nivelul tau ----
function statsleTovarasului(fel, nivel) {
  const f = TOVARASI[fel];
  const s = statsPentruNivel(nivel, 'normal');
  return {
    viataMaxima: Math.round(s.viata * f.viata),
    dmgMin: Math.round(s.dmgMin * f.dmg),
    dmgMax: Math.round(s.dmgMax * f.dmg),
    viteza: f.viteza,
    armura: s.armura
  };
}


// ==========================================================
//  IN JOC: cum apar, cum se bat, cum vindeca
//
//  Merg dupa acelasi tipar ca animalul vanatorului: un container
//  Phaser cu formele lui, o bara de viata deasupra, si o functie
//  care se cheama la fiecare cadru.
// ==========================================================

let tovarasii = [];              // cei de pe ecran, acum
const RAZA_TOVARAS = 300;        // pana unde vede un inamic
const RAZA_ATAC_TOVARAS = 34;    // de aproape
const RAZA_TRAS_TOVARAS = 220;   // de departe, pentru arcas
const VITEZA_TOVARAS = 155;


function stergeTovarasii() {
  tovarasii.forEach(function (t) { if (t.destroy) t.destroy(); });
  tovarasii = [];
}


// Ii aduce pe cei care incap in zona in care tocmai ai intrat.
// Se cheama din create(), ca si animalul.
function cheamaTovarasii(scena) {

  stergeTovarasii();
  if (!personaj || !jucator) return;

  const alesi = tovarasiiDeFata(personaj, zona);

  alesi.forEach(function (ales, i) {

    const f = TOVARASI[ales.fel];
    const st = statsleTovarasului(ales.fel, personaj.nivel);
    const unghi = (i / Math.max(1, alesi.length)) * Math.PI * 2;

    const p = scena.add.container(jucator.x + Math.cos(unghi) * 46,
                                  jucator.y + Math.sin(unghi) * 34);
    p.add(faUmbra(scena, 22));
    deseneazaForme(scena, f.forme).forEach(function (b) { p.add(b); });

    p.add(scena.add.text(0, -34, f.nume, {
      fontFamily: UI.FONT, fontSize: '10px', color: f.culoare,
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5));

    const fundal = scena.add.rectangle(0, -26, 30, 4, 0x2a1206);
    const bara = scena.add.rectangle(-15, -26, 30, 3, 0x5fbf5f).setOrigin(0, 0.5);
    p.add(fundal); p.add(bara);

    p.setDepth(8);
    p.bara = bara;
    p.fel = ales.fel;
    p.rol = f.rol;
    p.indice = ales.indice;
    p.stats = st;
    p.viata = st.viataMaxima;
    p.viataMaxima = st.viataMaxima;
    p.urmatoareaLovitura = 0;
    p.urmatoareaVindecare = 0;
    p.locBun = { dc: Math.cos(unghi) * 46, dr: Math.sin(unghi) * 34 };

    tovarasii.push(p);
  });
}


function actualizeazaBaraTovarasului(t) {
  if (!t || !t.bara) return;
  const parte = Math.max(0, t.viata) / t.viataMaxima;
  t.bara.setDisplaySize(30 * parte, 3);
  t.bara.fillColor = parte > 0.5 ? 0x5fbf5f : (parte > 0.25 ? 0xd0a03a : 0xc94a3a);
}


// Cine are cea mai mare nevoie de vindecare: tu sau unul dintre ei.
// Sub 70% din viata, si cel mai jos intai.
function cineAreNevoieDeVindecare() {

  let celMaiJos = null, parteaLui = 0.7;

  if (!mort && personaj.viata / personaj.viataMaxima < parteaLui) {
    celMaiJos = 'tu';
    parteaLui = personaj.viata / personaj.viataMaxima;
  }

  tovarasii.forEach(function (t) {
    if (t.viata <= 0) return;
    const p = t.viata / t.viataMaxima;
    if (p < parteaLui) { celMaiJos = t; parteaLui = p; }
  });

  return celMaiJos;
}


function actualizeazaTovarasii(scena, delta) {

  if (!tovarasii.length || !jucator) return;

  // pe cine se bat: cel mai apropiat inamic furios
  const tinta = mobi.find(function (m) {
    return m.viu && m.furios &&
      Phaser.Math.Distance.Between(jucator.x, jucator.y, m.x, m.y) < RAZA_TOVARAS;
  });

  tovarasii.forEach(function (t) {

    if (t.viata <= 0) { t.setAlpha(0.3); return; }
    t.setAlpha(1);

    const f = TOVARASI[t.fel];

    // ---- vindecatorul: intai vindeca, si abia pe urma se bate ----
    if (t.rol === 'vindecator' && scena.time.now >= t.urmatoareaVindecare) {
      const bolnav = cineAreNevoieDeVindecare();
      if (bolnav) {
        t.urmatoareaVindecare = scena.time.now + f.pauzaVindecare;
        if (bolnav === 'tu') {
          const cat = Math.round(personaj.viataMaxima * f.vindeca);
          personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + cat);
          actualizeazaBaraViata();
          aratacifraVerde(scena, jucator.x, jucator.y - 44, cat);
        } else {
          const cat = Math.round(bolnav.viataMaxima * f.vindeca);
          bolnav.viata = Math.min(bolnav.viataMaxima, bolnav.viata + cat);
          actualizeazaBaraTovarasului(bolnav);
          aratacifraVerde(scena, bolnav.x, bolnav.y - 40, cat);
        }
        suna('vindecare');
      }
    }

    // ---- unde vrea sa stea ----
    //
    // Scutierul se baga INTRE tine si inamic - de aia il platesti.
    // Arcasul trage de departe. Vindecatorul sta langa tine.
    let spreX, spreY, opreste;

    if (tinta && t.rol === 'tanc') {
      spreX = tinta.x; spreY = tinta.y; opreste = RAZA_ATAC_TOVARAS - 6;
    } else if (tinta && t.rol === 'lovitor') {
      spreX = tinta.x; spreY = tinta.y; opreste = RAZA_TRAS_TOVARAS - 20;
    } else {
      spreX = jucator.x + t.locBun.dc;
      spreY = jucator.y + t.locBun.dr;
      opreste = 12;
    }

    const cat = Phaser.Math.Distance.Between(t.x, t.y, spreX, spreY);
    if (cat > opreste) {
      const pas = VITEZA_TOVARAS * (delta / 1000);
      const vx = (spreX - t.x) / cat, vy = (spreY - t.y) / cat;
      if (potMerge(t.x + vx * pas, t.y)) t.x += vx * pas;
      if (potMerge(t.x, t.y + vy * pas)) t.y += vy * pas;

      // s-a departat prea tare de tine? il aducem inapoi
      if (Phaser.Math.Distance.Between(t.x, t.y, jucator.x, jucator.y) > 620) {
        t.x = jucator.x + t.locBun.dc;
        t.y = jucator.y + t.locBun.dr;
      }
    }

    // ---- loveste ----
    const razaLui = (t.rol === 'lovitor') ? RAZA_TRAS_TOVARAS : RAZA_ATAC_TOVARAS;
    if (tinta && cat <= razaLui && scena.time.now >= t.urmatoareaLovitura) {
      t.urmatoareaLovitura = scena.time.now + t.stats.viteza * 1000;
      loveste(scena, tinta, Phaser.Math.Between(t.stats.dmgMin, t.stats.dmgMax), false);
    }
  });
}


// ---- inamicul loveste un tovaras in locul tau ----
//
// Cine e mai aproape de inamic decat tine ii ia lovitura. Scutierul
// e mereu ales primul daca e in joc: aia e treaba lui.
function tovarasulCareTeAcopera(mob) {

  let ales = null, celMaiAproape = Infinity;
  const laTine = Phaser.Math.Distance.Between(mob.x, mob.y, jucator.x, jucator.y);

  tovarasii.forEach(function (t) {
    if (t.viata <= 0) return;
    const d = Phaser.Math.Distance.Between(mob.x, mob.y, t.x, t.y);
    if (d >= laTine) return;
    // scutierul are intaietate chiar daca nu e cel mai aproape
    const scor = (t.rol === 'tanc') ? d - 60 : d;
    if (scor < celMaiAproape) { celMaiAproape = scor; ales = t; }
  });

  return ales;
}


function mobLovesteTovarasul(scena, mob, t) {

  const brut = Phaser.Math.Between(mob.stats.dmgMin, mob.stats.dmgMax);
  const damage = Math.max(1, Math.round(dupaArmura(brut, t.stats.armura)));

  t.viata -= damage;
  aratacifraRosie(scena, t.x, t.y - 40, damage);
  actualizeazaBaraTovarasului(t);

  if (t.viata <= 0) {
    t.viata = 0;
    t.setAlpha(0.3);
    aratacuvant(scena, t.x, t.y - 50, TEXT.HIRE_DOWN, '#c94a3a');
  }
}


// Dupa lupta, cei cazuti se ridica singuri. Nu-i lasam morti pana la
// urmatoarea zona: ar insemna sa te intorci in oras dupa fiecare
// greseala, si asta n-ar fi greu, ar fi doar plictisitor.
function ridicaTovarasiiCazuti() {
  tovarasii.forEach(function (t) {
    if (t.viata > 0) return;
    t.viata = Math.round(t.viataMaxima * 0.5);
    t.setAlpha(1);
    actualizeazaBaraTovarasului(t);
  });
}
