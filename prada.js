// ==========================================================
//  PRADA SI TARABA
//
//  Doua ferestre care se deschid peste joc, amandoua facute
//  din acelasi cadru (#ecran-fereastra):
//
//    PRADA   - ce a lasat un inamic cand a murit. Pana nu o iei,
//              trupul lui ramane pe jos si sclipeste. Ca in WoW,
//              banii si obiectele NU sar singure in inventar.
//
//    TARABA  - negustorul. Ii cumperi marfa cu bani si ii vinzi
//              ce nu-ti trebuie, pe un sfert din pret.
// ==========================================================

const ecranFereastra  = document.getElementById('ecran-fereastra');
const scenaFereastra  = document.getElementById('scena-fereastra');
const titluFereastra  = document.getElementById('titlu-fereastra');
const corpFereastra   = document.getElementById('corp-fereastra');
const inchideFereastra = document.getElementById('inchide-fereastra');

let fereastraDeschisa = null;   // 'prada' | 'taraba' | null
let saculDeschis = null;        // sacul de prada la care te uiti
let negustorulDeschis = null;   // negustorul la care te uiti
let filaTarabei = 'buy';
let mesajFereastra = '';
let npcCuMisiuni = null;       // cu cine vorbesti
let antrenorulDeschis = null;  // la ce antrenor te uiti
let intrebamDeLasat = null;    // la ce meserie te intreaba daca renunti
let misiuneaAratata = null;    // ce misiune se vede acum
let rasplataAleasa = null;     // ce obiect ai ales din rasplata


function potrivesteFereastra() {
  const cat = Math.min(window.innerWidth / 740, window.innerHeight / 596, 1);
  scenaFereastra.style.transform = 'scale(' + cat + ')';
}


function inchideFereastraDeschisa() {
  if (typeof ascundeFisa === 'function') ascundeFisa();
  fereastraDeschisa = null;
  saculDeschis = null;
  negustorulDeschis = null;
  npcCuMisiuni = null;
  misiuneaAratata = null;
  rasplataAleasa = null;
  antrenorulDeschis = null;
  intrebamDeLasat = null;
  mesajFereastra = '';
  ecranFereastra.classList.add('ascuns');
}


// ==========================================================
//  PRADA
// ==========================================================
function deschidePrada(sac) {

  // Doar o fereastra odata: pe telefon, doua una peste alta
  // nu se mai inteleg.
  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();

  fereastraDeschisa = 'prada';
  saculDeschis = sac;
  mesajFereastra = '';
  ecranFereastra.classList.remove('ascuns');
  potrivesteFereastra();
  scriePrada();
}


function scriePrada() {

  if (!saculDeschis) return;
  const prada = saculDeschis.prada;

  titluFereastra.textContent = TEXT.LOOT;

  if (!pradaAreCeva(prada)) {
    corpFereastra.innerHTML = '<div class="gol-fereastra">' + TEXT.NOTHING_LEFT + '</div>';
    return;
  }

  let html = '<div class="lista-prada">';

  if (prada.bani > 0) {
    html += '<button class="rand-prada" data-bani="1">' +
            '<span class="cutie-obiect punga-mica"></span>' +
            '<span class="text-prada"><span class="nume-obiect">' +
            baniHtml(prada.bani) + '</span></span></button>';
  }

  (prada.obiecteMisiune || []).forEach(function (q, i) {
    html += '<button class="rand-prada misiune" data-misiune="' + i + '">' +
            '<span class="cutie-obiect semn-misiune">!</span>' +
            '<span class="text-prada">' +
            '<span class="nume-obiect">' + q.nume + '</span>' +
            '<span class="stat-obiect">' + TEXT.QUESTS + '</span>' +
            '</span></button>';
  });

  prada.obiecte.forEach(function (o) {
    html += '<button class="rand-prada" data-iau="' + o.id + '" data-fisa="' + o.id + '">' +
            cutieObiect(o, 30) +
            '<span class="text-prada">' +
            '<span class="nume-obiect" style="color:' + o.culoare + '">' + o.nume + '</span>' +
            '<span class="stat-obiect">' + descriereObiect(o) + '</span>' +
            '</span></button>';
  });

  // ---- jupuitul, daca a fost fiara si stii meseria ----
  if (prada.deJupuit) {
    const cerut = skillDeJupuit(prada.deJupuit.nivel);
    const ai = aiMeseria(personaj, 'hidecraft');
    const skill = skillulTau(personaj, 'hidecraft');
    const poti = ai && skill >= cerut;
    const motiv = !ai ? TEXT.NEED_PROFESSION.replace('{p}', MESERII.hidecraft.nume)
                      : TEXT.NEED_SKILL.replace('{n}', cerut);

    html += '<button class="rand-prada' + (poti ? '' : ' misiune') + '" ' +
            (poti ? 'data-jupui="1"' : 'disabled') + '>' +
            '<span class="cutie-obiect punga-mica"></span>' +
            '<span class="text-prada">' +
            '<span class="nume-obiect">' + TEXT.SKIN + ': ' + PIELEA_DE_LA_FIARA + '</span>' +
            '<span class="stat-obiect' + (poti ? '' : ' rau') + '">' +
            (poti ? (TEXT.SKILL + ' ' + cerut) : motiv) + '</span>' +
            '</span></button>';
  }

  html += '</div>';
  html += '<div class="jos-fereastra">' +
          '<button class="buton" id="ia-tot">' + TEXT.TAKE_ALL + '</button>' +
          (mesajFereastra ? '<span class="mesaj-fereastra">' + mesajFereastra + '</span>' : '') +
          '<span class="punga">' + locuriLibere(personaj) + ' / ' + LOCURI_IN_RUCSAC + '</span>' +
          '</div>';

  corpFereastra.innerHTML = html;
  legafisele(corpFereastra);

  const banii = corpFereastra.querySelector('[data-bani]');
  if (banii) banii.addEventListener('click', function () { iaBaniiDinSac(); });

  corpFereastra.querySelectorAll('[data-iau]').forEach(function (b) {
    b.addEventListener('click', function () { iaObiectulDinSac(Number(b.dataset.iau)); });
  });

  corpFereastra.querySelectorAll('[data-misiune]').forEach(function (b) {
    b.addEventListener('click', function () { iaObiectulDeMisiune(Number(b.dataset.misiune)); });
  });

  const jup = corpFereastra.querySelector('[data-jupui]');
  if (jup) jup.addEventListener('click', jupoaie);

  document.getElementById('ia-tot').addEventListener('click', iaTotDinSac);
}


// Jupuitul: piele in rucsac si, daca fiara e destul de grea pentru
// skill-ul tau, un punct in plus la meserie.
function jupoaie() {

  const sac = saculDeschis;
  if (!sac || !sac.prada.deJupuit) return;

  const cerut = skillDeJupuit(sac.prada.deJupuit.nivel);
  if (!aiMeseria(personaj, 'hidecraft')) return;
  if (skillulTau(personaj, 'hidecraft') < cerut) return;

  if (!maiEsteLocInRucsac(personaj)) {
    mesajFereastra = TEXT.BAG_FULL;
    scriePrada();
    return;
  }

  const cate = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < cate; i++) {
    pomeneInRucsac(personaj, faMaterial(PIELEA_DE_LA_FIARA,
                                        Math.max(2, Math.round(cerut / 4) + 2)));
  }

  const crescut = adaugaSkill(personaj, 'hidecraft', pragurileJupuitului(cerut));
  mesajFereastra = crescut
    ? (MESERII.hidecraft.nume + ' ' + skillulTau(personaj, 'hidecraft'))
    : '';

  sac.prada.deJupuit = null;
  salveaza();
  dupaCeAiLuat();
}


// Ia tot dintr-o data. Se face pe sacul intreg, nu lucru cu lucru:
// altfel, la un trup care are DOAR bani, sacul se golea si se inchidea
// dupa primul pas, iar pasul urmator cauta obiecte intr-un sac care
// nu mai exista.
function iaTotDinSac() {

  const sac = saculDeschis;
  if (!sac) return;

  if (sac.prada.bani > 0) {
    iaBani(personaj, sac.prada.bani);
    sac.prada.bani = 0;
  }

  // Lucrurile cerute de misiuni se iau intotdeauna: nu ocupa loc.
  while ((sac.prada.obiecteMisiune || []).length > 0) {
    const q = sac.prada.obiecteMisiune.shift();
    adaugaLaMisiune(personaj, q.idMisiune);
  }
  if (typeof actualizeazaSemnele === 'function') actualizeazaSemnele();

  // Luam cat incape. Ce nu incape ramane in sac.
  const ramase = [];
  sac.prada.obiecte.forEach(function (o) {
    if (!pomeneInRucsac(personaj, o)) ramase.push(o);
  });
  sac.prada.obiecte = ramase;
  mesajFereastra = ramase.length > 0 ? TEXT.BAG_FULL : '';

  dupaCeAiLuat();
}


// Un lucru cerut de o misiune nu intra in rucsac: se scrie direct
// in carnet. De aceea nu se poate umple rucsacul din misiuni.
function iaObiectulDeMisiune(indice) {

  if (!saculDeschis) return;
  const lista = saculDeschis.prada.obiecteMisiune || [];
  const q = lista[indice];
  if (!q) return;

  adaugaLaMisiune(personaj, q.idMisiune);
  lista.splice(indice, 1);

  if (typeof actualizeazaSemnele === 'function') actualizeazaSemnele();
  dupaCeAiLuat();
}


function iaBaniiDinSac() {
  if (!saculDeschis || saculDeschis.prada.bani <= 0) return;
  iaBani(personaj, saculDeschis.prada.bani);
  saculDeschis.prada.bani = 0;
  dupaCeAiLuat();
}


function iaObiectulDinSac(idObiect) {
  if (!saculDeschis) return;
  const lista = saculDeschis.prada.obiecte;
  const unde = lista.findIndex(function (o) { return o.id === idObiect; });
  if (unde < 0) return;

  if (!pomeneInRucsac(personaj, lista[unde])) {
    mesajFereastra = TEXT.BAG_FULL;
    scriePrada();
    return;
  }

  mesajFereastra = '';
  lista.splice(unde, 1);
  dupaCeAiLuat();
}


// Dupa fiecare lucru luat: rescriem lista, si daca sacul s-a golit,
// il facem sa dispara de pe jos si inchidem fereastra.
function dupaCeAiLuat() {
  if (!saculDeschis) return;
  scriePrada();
  if (!pradaAreCeva(saculDeschis.prada)) {
    stergeSacul(saculDeschis);
    inchideFereastraDeschisa();
  }
}


// ==========================================================
//  TARABA NEGUSTORULUI
// ==========================================================

// Ce tine pe taraba. Se face o data, cand intri in zona, si
// ramane la fel cat timp joci.
function faMarfa(ceVinde) {

  const sloturi = SLOTURI.filter(function (s) {
    const eArma = (s.id === 'armaPrincipala' || s.id === 'armaSecundara');
    return (ceVinde === 'arma') ? eArma : !eArma;
  });

  const marfa = [];
  for (let i = 0; i < 12; i++) {
    const slot = sloturi[i % sloturi.length];
    const nivel = 1 + Math.floor(i * 11 / 12);          // de la 1 pana la 11
    // Negustorul tine mai ales lucruri simple. Ceva rar, rar de tot.
    const zar = Math.random() * 100;
    const raritate = (zar < 62) ? 'comun' : (zar < 93) ? 'bun' : 'rar';
    marfa.push(faObiect(slot.id, nivel, raritate));
  }
  return marfa;
}


function deschideTaraba(npcul) {

  // Doar o fereastra odata: pe telefon, doua una peste alta
  // nu se mai inteleg.
  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();

  fereastraDeschisa = 'taraba';
  negustorulDeschis = npcul;
  filaTarabei = 'buy';
  mesajFereastra = '';
  ecranFereastra.classList.remove('ascuns');
  potrivesteFereastra();
  scrieTaraba();
}


function scrieTaraba() {

  if (!negustorulDeschis) return;
  const cine = negustorulDeschis.cine;

  titluFereastra.textContent = cine.nume + '  <' + cine.titlu + '>';

  let html = '<div class="file-taraba">' +
    '<button class="fila' + (filaTarabei === 'buy' ? ' aleasa' : '') + '" data-fila-taraba="buy">' + TEXT.BUY + '</button>' +
    '<button class="fila' + (filaTarabei === 'sell' ? ' aleasa' : '') + '" data-fila-taraba="sell">' + TEXT.SELL + '</button>' +
    '</div>';

  html += '<div class="lista-prada">';

  if (filaTarabei === 'buy') {

    negustorulDeschis.marfa.forEach(function (o) {
      const pret = pretDeCumparat(o);
      const potPlati = aiDestuiBani(personaj, pret);
      html += '<button class="rand-prada' + (potPlati ? '' : ' scump') +
              '" data-cumpar="' + o.id + '" data-fisa="' + o.id + '">' +
              cutieObiect(o, 30) +
              '<span class="text-prada">' +
              '<span class="nume-obiect" style="color:' + o.culoare + '">' + o.nume + '</span>' +
              '<span class="stat-obiect">' + descriereObiect(o) + '</span>' +
              '</span>' +
              '<span class="pret">' + baniHtml(pret) + '</span></button>';
    });

  } else {

    const ale = personaj.inventar || [];
    if (ale.length === 0) {
      html += '<div class="gol-fereastra">' + TEXT.NOTHING_TO_SELL + '</div>';
    }
    ale.forEach(function (o) {
      html += '<button class="rand-prada" data-vand="' + o.id + '" data-fisa="' + o.id + '">' +
              cutieObiect(o, 30) +
              '<span class="text-prada">' +
              '<span class="nume-obiect" style="color:' + o.culoare + '">' + o.nume +
              (o.cate > 1 ? ' x' + o.cate : '') + '</span>' +
              '<span class="stat-obiect">' + descriereObiect(o) + '</span>' +
              '</span>' +
              '<span class="pret">' + baniHtml(pretDeVandut(o)) + '</span></button>';
    });
  }

  html += '</div>';

  html += '<div class="jos-fereastra">' +
          (mesajFereastra ? '<span class="mesaj-fereastra">' + mesajFereastra + '</span>' : '<span></span>') +
          '<span class="punga">' + locuriLibere(personaj) + ' / ' + LOCURI_IN_RUCSAC +
          ' &middot; ' + TEXT.YOUR_MONEY + ': ' + baniHtml(personaj.bani || 0) + '</span>' +
          '</div>';

  corpFereastra.innerHTML = html;

  legafisele(corpFereastra);

  corpFereastra.querySelectorAll('[data-fila-taraba]').forEach(function (b) {
    b.addEventListener('click', function () {
      filaTarabei = b.dataset.filaTaraba;
      mesajFereastra = '';
      scrieTaraba();
    });
  });

  corpFereastra.querySelectorAll('[data-cumpar]').forEach(function (b) {
    b.addEventListener('click', function () { cumpara(Number(b.dataset.cumpar)); });
  });

  corpFereastra.querySelectorAll('[data-vand]').forEach(function (b) {
    b.addEventListener('click', function () { vindeObiectul(Number(b.dataset.vand)); });
  });
}


function cumpara(idObiect) {

  const marfa = negustorulDeschis.marfa;
  const unde = marfa.findIndex(function (o) { return o.id === idObiect; });
  if (unde < 0) return;

  const obiect = marfa[unde];
  const pret = pretDeCumparat(obiect);

  if (!maiEsteLocInRucsac(personaj)) {
    mesajFereastra = TEXT.BAG_FULL;
    scrieTaraba();
    return;
  }

  if (!dauBani(personaj, pret)) {
    mesajFereastra = TEXT.NOT_ENOUGH;
    scrieTaraba();
    return;
  }

  // Ce cumperi pleaca de pe taraba si ajunge la tine.
  marfa.splice(unde, 1);
  pomeneInRucsac(personaj, obiect);

  mesajFereastra = TEXT.BOUGHT + ': ' + obiect.nume;
  scrieTaraba();
}


function vindeObiectul(idObiect) {

  const ale = personaj.inventar || [];
  const unde = ale.findIndex(function (o) { return o.id === idObiect; });
  if (unde < 0) return;

  const obiect = ale[unde];
  const pret = pretDeVandut(obiect);

  ale.splice(unde, 1);
  iaBani(personaj, pret);

  // Ce ii vinzi ajunge pe taraba lui: te poti razgandi si il iei inapoi,
  // dar la pretul intreg - exact ca in WoW. Vechiturile nu: nimeni
  // n-ar cumpara inapoi un colt de lup.
  if (!obiect.vechitura) negustorulDeschis.marfa.push(obiect);

  mesajFereastra = TEXT.SOLD + ': ' + obiect.nume +
                  (obiect.cate > 1 ? ' x' + obiect.cate : '') + ' (' + baniText(pret) + ')';
  scrieTaraba();
}


// ==========================================================
//  Butoanele cadrului
// ==========================================================
inchideFereastra.addEventListener('click', inchideFereastraDeschisa);
window.addEventListener('resize', potrivesteFereastra);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && fereastraDeschisa) inchideFereastraDeschisa();
});


// ==========================================================
//  FEREASTRA DE MISIUNE
//
//  Cand vorbesti cu cineva care are un semn deasupra capului.
//  Trei infatisari, dupa cum stau lucrurile:
//    - iti DA o misiune: textul ei, ce ai de facut, ce primesti
//    - te ASTEAPTA cu una terminata: alegi rasplata si o predai
//    - n-are nimic nou: iti arata la ce esti in mijloc
// ==========================================================
// ==========================================================
//  ANTRENORUL
//
//  Deocamdata NU invata pe nimeni nimic: invatatul abilitatilor si
//  al meseriilor se face la pasul urmator. Fereastra asta e starea
//  LUI GOALA - ce vezi cand omul n-are inca nimic de predat.
//
//  Am facut-o acum, in loc sa-l las mut, pentru ca un om cu titlu
//  de antrenor care raspunde "Nothing for you right now" te pune pe
//  ganduri degeaba: crezi ca e stricat.
// ==========================================================
function deschideAntrenorul(npcul) {

  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();

  fereastraDeschisa = 'antrenor';
  antrenorulDeschis = npcul;
  mesajFereastra = '';

  ecranFereastra.classList.remove('ascuns');
  potrivesteFereastra();
  scrieAntrenorul();
}


function scrieAntrenorul() {

  const cine = antrenorulDeschis.cine;
  titluFereastra.textContent = cine.nume + '  <' + cine.titlu + '>';

  // Antrenor de MESERIE? Atunci are alta fereastra.
  const meseria = Object.keys(MESERII).find(function (id) {
    return MESERII[id].antrenor === antrenorulDeschis.felul;
  });
  if (meseria) { scrieAntrenorulDeMeserie(meseria); return; }

  // Antrenor de clasa, dar de ALTA clasa decat a ta.
  if (cine.invata !== personaj.idClasa) {
    const ceStie = cine.titlu.replace(/\s*Trainer$/, '');
    corpFereastra.innerHTML =
      '<div class="cutie">' +
        '<div class="rand-detaliu"><span>' + TEXT.TRAINER_TEACHES + '</span>' +
        '<span>' + ceStie + '</span></div>' +
        '<div class="gol-fereastra">' + TEXT.TRAINER_SOON + '</div>' +
      '</div>';
    return;
  }

  const de_invatat = ceAreAntrenorul(personaj);

  let html = '<div class="cutie">';
  html += '<div class="rand-detaliu"><span>' + TEXT.YOUR_MONEY + '</span>' +
          '<span>' + baniHtml(personaj.bani || 0) + '</span></div>';

  if (mesajFereastra) {
    html += '<div class="mesaj-fereastra">' + mesajFereastra + '</div>';
  }

  if (!de_invatat.length) {
    html += '<div class="gol-fereastra">' + TEXT.TRAINER_EMPTY + '</div></div>';
    corpFereastra.innerHTML = html;
    return;
  }

  html += '<div class="lista-invatat">';

  de_invatat.forEach(function (c) {

    const ab = c.abilitate;
    const poate = !c.preaMic && !c.faraBani;

    // De ce NU poti: se scrie rosu, langa pret, ca sa nu cauti.
    const motiv = c.preaMic ? (TEXT.REQUIRES + ' ' + c.nivelCerut)
                : c.faraBani ? TEXT.NOT_ENOUGH_GOLD : '';

    html += '<div class="rand-invatat' + (poate ? '' : ' nu-poti') + '">';
    html += '<div class="cap-invatat">' +
              '<b>' + ab.nume + '</b>' +
              '<span class="stins">' + TEXT.RANK + ' ' + c.rang + '</span>' +
            '</div>';
    html += '<div class="desc-invatat">' + ab.descriere + '</div>';
    html += '<div class="jos-invatat">' +
              '<span>' + baniHtml(c.cost) + '</span>' +
              (motiv ? '<span class="rau">' + motiv + '</span>'
                     : '<button class="buton mic" data-invat="' + ab.id +
                       '" data-rang="' + c.rang + '">' + TEXT.LEARN + '</button>') +
            '</div>';
    html += '</div>';
  });

  html += '</div></div>';
  corpFereastra.innerHTML = html;

  corpFereastra.querySelectorAll('[data-invat]').forEach(function (b) {
    b.addEventListener('click', function () {
      const r = invataAbilitatea(personaj, b.dataset.invat, Number(b.dataset.rang));
      if (!r) return;

      mesajFereastra = TEXT.LEARNED + ': ' + r.abilitate.nume +
                       '  (' + TEXT.RANK + ' ' + r.abilitate.rang + ')';
      // Butoanele din joc se refac: poate abilitatea noua a intrat
      // chiar pe bara, sau un rang nou l-a inlocuit pe cel vechi.
      if (typeof scrieButoaneleAbilitatilor === 'function') scrieButoaneleAbilitatilor();
      salveaza();
      scrieAntrenorul();
    });
  });
}


// ==========================================================
//  ANTRENORUL DE MESERIE
//
//  Aici inveti meseria, si tot aici cumperi treapta urmatoare cand
//  skill-ul s-a oprit la plafon. Si tot de aici renunti la ea, cu o
//  intrebare inainte - skill-ul se face zero si nu se mai intoarce.
// ==========================================================
function scrieAntrenorulDeMeserie(id) {

  const m = MESERII[id];
  const ai = aiMeseria(personaj, id);

  let html = '<div class="cutie">';
  html += '<div class="rand-detaliu"><span>' + TEXT.YOUR_MONEY + '</span>' +
          '<span>' + baniHtml(personaj.bani || 0) + '</span></div>';

  if (mesajFereastra) {
    html += '<div class="mesaj-fereastra">' + mesajFereastra + '</div>';
  }

  html += '<div class="rand-invatat"><div class="cap-invatat">' +
          '<b>' + m.nume + '</b><span class="stins">' +
          (m.principala ? TEXT.PROFESSION : TEXT.PROFESSIONS) + '</span></div>' +
          '<div class="desc-invatat">' + m.descriere + '</div>';

  // ---- n-ai meseria inca ----
  if (!ai) {
    const se = potiLuaMeseria(personaj, id);
    const motiv = se.poti ? '' :
      se.motiv === 'soon'  ? TEXT.PROF_SOON :
      se.motiv === 'full'  ? TEXT.PROF_FULL :
      se.motiv === 'level' ? (TEXT.REQUIRES + ' ' + se.nivel) :
      se.motiv === 'money' ? TEXT.NOT_ENOUGH_GOLD : '';

    html += '<div class="jos-invatat"><span>' +
            (m.gata ? baniHtml(costulTreptei(1)) : '') + '</span>' +
            (se.poti
              ? '<button class="buton mic" id="iau-meseria">' + TEXT.LEARN_PROFESSION + '</button>'
              : '<span class="rau">' + motiv + '</span>') +
            '</div></div>';

  // ---- o ai deja ----
  } else {
    const skill = skillulTau(personaj, id);
    const plafon = plafonulTau(personaj, id);
    const treapta = TREPTE_MESERIE[treaptaTa(personaj, id) - 1];

    html += '<div class="jos-invatat"><span>' + TEXT.SKILL + ' ' + skill +
            ' / ' + plafon + '</span><span class="stins">' +
            TEXT.TIER + ': ' + treapta.nume + '</span></div>';
    html += '<div class="bara-skill"><span style="width:' +
            Math.round(skill / plafon * 100) + '%"></span></div>';

    const u = urmatoareaTreapta(personaj, id);
    if (u) {
      const motiv = u.preaMic ? (TEXT.REQUIRES + ' ' + u.treapta.nivel)
                  : u.faraBani ? TEXT.NOT_ENOUGH_GOLD
                  : u.preaDevreme ? TEXT.PROF_CAP : '';
      html += '<div class="jos-invatat"><span>' + u.treapta.nume + ' &middot; ' +
              baniHtml(u.cost) + '</span>' +
              (motiv ? '<span class="rau">' + motiv + '</span>'
                     : '<button class="buton mic" id="urc-treapta">' +
                       TEXT.NEXT_TIER + '</button>') +
              '</div>';
    }

    html += '</div>';

    // ---- renuntarea ----
    if (intrebamDeLasat === id) {
      html += '<div class="intrebare-rucsac"><span>' +
              TEXT.ABANDON_ASK.replace('{p}', m.nume) + '</span>' +
              '<button class="buton mic rau" id="da-las">' + TEXT.YES_ABANDON + '</button>' +
              '<button class="buton mic" id="nu-las">' + TEXT.CANCEL + '</button></div>';
    } else {
      html += '<div class="jos-invatat"><span></span>' +
              '<button class="buton mic" id="las-meseria">' + TEXT.ABANDON + '</button></div>';
    }
  }

  html += '</div>';
  corpFereastra.innerHTML = html;

  const iau = document.getElementById('iau-meseria');
  if (iau) iau.addEventListener('click', function () {
    const r = invataMeseria(personaj, id);
    if (r) { mesajFereastra = TEXT.LEARNED + ': ' + r.meserie.nume; salveaza(); }
    scrieAntrenorul();
  });

  const urc = document.getElementById('urc-treapta');
  if (urc) urc.addEventListener('click', function () {
    const r = ridicaTreapta(personaj, id);
    if (r) { mesajFereastra = TEXT.LEARNED + ': ' + r.treapta.nume; salveaza(); }
    scrieAntrenorul();
  });

  const las = document.getElementById('las-meseria');
  if (las) las.addEventListener('click', function () {
    intrebamDeLasat = id; scrieAntrenorul();
  });

  const daLas = document.getElementById('da-las');
  if (daLas) daLas.addEventListener('click', function () {
    lasaMeseria(personaj, id);
    intrebamDeLasat = null;
    mesajFereastra = '';
    salveaza();
    scrieAntrenorul();
  });

  const nuLas = document.getElementById('nu-las');
  if (nuLas) nuLas.addEventListener('click', function () {
    intrebamDeLasat = null; scrieAntrenorul();
  });
}


function deschideMisiunile(npcul) {

  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();

  fereastraDeschisa = 'misiuni';
  npcCuMisiuni = npcul;
  mesajFereastra = '';
  rasplataAleasa = null;

  // Ce ii aratam: intai ce e gata de predat, apoi ce poate fi luat.
  const ale = misiunileLui(personaj, zona.nume, npcul.felul);
  misiuneaAratata =
    ale.find(function (m) { return starea(personaj, m.id) === 'gata'; }) ||
    ale.find(function (m) { return poateFiLuata(personaj, m); }) ||
    null;

  ecranFereastra.classList.remove('ascuns');
  potrivesteFereastra();
  scrieMisiunile();
}


function scrieMisiunile() {

  const cine = npcCuMisiuni.cine;
  titluFereastra.textContent = cine.nume + '  <' + cine.titlu + '>';

  // --- n-are nimic nou de spus ---
  if (!misiuneaAratata) {
    let html = '';
    const active = misiunileLui(personaj, zona.nume, npcCuMisiuni.felul)
      .filter(function (m) { return starea(personaj, m.id) === 'activa'; });

    if (active.length === 0) {
      html = '<div class="gol-fereastra">' + TEXT.NO_QUESTS + '</div>';
    } else {
      html = '<div class="lista-prada">';
      active.forEach(function (m) {
        html += '<div class="rand-misiune"><span class="titlu-misiune">' + m.titlu + '</span>' +
                '<span class="cerinta-misiune">' + textulCerintei(personaj, m) + '</span></div>';
      });
      html += '</div>';
    }
    corpFereastra.innerHTML = html;
    return;
  }

  const m = misiuneaAratata;
  const gata = starea(personaj, m.id) === 'gata';
  const alegeri = obiecteleDeRasplata(m);

  let html = '<div class="corp-misiune">';
  html += '<div class="titlu-mare-misiune">' + m.titlu + '</div>';
  html += '<div class="text-misiune">' + m.text + '</div>';

  html += '<div class="cap-sectiune">' + TEXT.OBJECTIVES + '</div>';
  html += '<div class="cerinta-misiune' + (gata ? ' gata' : '') + '">' +
          textulCerintei(personaj, m) + '</div>';

  html += '<div class="cap-sectiune">' + TEXT.REWARDS + '</div>';
  html += '<div class="rasplata-randuri">' +
          '<span>' + TEXT.EXPERIENCE + ': <b>' + m.rasplata.xp + '</b></span>' +
          '<span>' + baniHtml(m.rasplata.bani) + '</span></div>';

  if (alegeri.length > 0) {
    if (rasplataAleasa === null) rasplataAleasa = alegeri[0].id;
    html += '<div class="cap-sectiune">' + TEXT.CHOOSE_REWARD + '</div>';
    html += '<div class="alegeri-rasplata">';
    alegeri.forEach(function (o) {
      html += '<button class="alegere' + (rasplataAleasa === o.id ? ' aleasa' : '') +
              '" data-aleg="' + o.id + '" data-fisa="' + o.id + '">' +
              cutieObiect(o, 34) +
              '<span class="text-prada">' +
              '<span class="nume-obiect" style="color:' + o.culoare + '">' + o.nume + '</span>' +
              '<span class="stat-obiect">' + descriereObiect(o) + '</span>' +
              '</span></button>';
    });
    html += '</div>';
  }

  html += '</div>';

  html += '<div class="jos-fereastra">' +
          (gata ? '<button class="buton" id="preda-misiune">' + TEXT.COMPLETE + '</button>'
                : '<button class="buton" id="ia-misiune">' + TEXT.ACCEPT + '</button>') +
          (mesajFereastra ? '<span class="mesaj-fereastra">' + mesajFereastra + '</span>' : '<span></span>') +
          '</div>';

  corpFereastra.innerHTML = html;
  legafisele(corpFereastra);

  corpFereastra.querySelectorAll('[data-aleg]').forEach(function (b) {
    b.addEventListener('click', function () {
      rasplataAleasa = Number(b.dataset.aleg);
      scrieMisiunile();
    });
  });

  const deLuat = document.getElementById('ia-misiune');
  if (deLuat) deLuat.addEventListener('click', function () {
    iaMisiunea(personaj, m.id);
    if (typeof actualizeazaSemnele === 'function') actualizeazaSemnele();
    inchideFereastraDeschisa();
  });

  const dePredat = document.getElementById('preda-misiune');
  if (dePredat) dePredat.addEventListener('click', function () {

    const primit = predaMisiunea(personaj, m.id, rasplataAleasa);
    if (!primit) return;

    if (primit.rucsacPlin) {
      mesajFereastra = TEXT.BAG_FULL;
      scrieMisiunile();
      return;
    }

    // Experienta o da jocul, ca sa se vada si sa urci in nivel.
    if (typeof primesteXp === 'function' && jucator) {
      primesteXp(jucator.scene, primit.xp);
    }
    if (typeof actualizeazaSemnele === 'function') actualizeazaSemnele();
    if (typeof aplicaTalentele === 'function') aplicaTalentele();

    inchideFereastraDeschisa();
  });
}
