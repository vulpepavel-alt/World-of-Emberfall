// ==========================================================
//  MENIUL DIN JOC
//
//  Se deschide cu butonul MENU si are trei file:
//    Character - statisticile tale complete
//    Spells    - abilitatile si pasiva de clasa
//    Talents   - cei trei arbori, unde cheltuiesti punctele
//
//  Sta ca un strat peste joc, la fel ca ecranul de creare.
//  Cat timp e deschis, jocul nu-ti mai citeste tastele de mers.
// ==========================================================

const ecranMeniu   = document.getElementById('ecran-meniu');
const scenaMeniu   = document.getElementById('scena-meniu');
const inchideMeniu = document.getElementById('inchide-meniu');

let meniuDeschis = false;
let filaCurenta = 'character';


// ----------------------------------------------------------
//  Scena meniului are marime fixa si se micsoreaza ca sa incapa
// ----------------------------------------------------------
function potrivesteMeniul() {
  // Adunam cate 16 pixeli la fiecare latura: chenarul si umbra se
  // adauga peste marimea socotita, iar fara marja panoul iesea
  // cu cativa pixeli in afara ecranului pe telefon.
  const cat = Math.min(window.innerWidth / 1196, window.innerHeight / 676, 1);
  scenaMeniu.style.transform = 'scale(' + cat + ')';
}


// ----------------------------------------------------------
//  Deschide / inchide
// ----------------------------------------------------------
function deschideMeniul() {
  // Daca era deschisa prada sau taraba, o inchidem: una odata.
  if (typeof fereastraDeschisa !== 'undefined' && fereastraDeschisa) {
    inchideFereastraDeschisa();
  }
  meniuDeschis = true;
  ecranMeniu.classList.remove('ascuns');
  potrivesteMeniul();
  scrieMeniul();
}

function inchideMeniul() {
  ascundeFisa();
  meniuDeschis = false;
  ecranMeniu.classList.add('ascuns');

  // Rucsacul nu ramane in modul de aruncat peste noapte: daca il
  // uitai pornit, data viitoare apasai un obiect ca sa-l imbraci si
  // jocul te intreba daca vrei sa-l arunci.
  modAruncare = false;
  ceIntrebam = null;
}

function comutaMeniul() {
  if (meniuDeschis) inchideMeniul();
  else deschideMeniul();
}


// ----------------------------------------------------------
//  Scrie fila care e deschisa acum
// ----------------------------------------------------------
function scrieMeniul() {
  if (!personaj) return;
  scriePaginaCharacter();
  scriePaginaSpells();
  scriePaginaTalents();
  scriePaginaInventory();
  scriePaginaQuests();
}


// ==========================================================
//  CUTIA UNUI OBIECT SI FISA LUI
//
//  Cutia = patratul cu icoana, cu chenar de culoarea raritatii.
//  Fisa  = ce scrie despre obiect cand tii apasat pe el.
//  Le folosesc si meniul, si prada, si taraba negustorului.
// ==========================================================

// Cauta un obiect dupa numarul lui, oriunde s-ar afla: in rucsac,
// pe tine, intr-un sac de prada sau pe taraba negustorului.
function gasesteObiectDupaId(id) {

  const locuri = [];
  locuri.push(personaj.inventar || []);
  locuri.push(Object.values(personaj.echipament || {}).filter(Boolean));
  if (typeof saculDeschis !== 'undefined' && saculDeschis) {
    locuri.push(saculDeschis.prada.obiecte);
  }
  if (typeof negustorulDeschis !== 'undefined' && negustorulDeschis) {
    locuri.push(negustorulDeschis.marfa);
  }

  for (const lista of locuri) {
    const gasit = lista.find(function (o) { return o.id === id; });
    if (gasit) return gasit;
  }
  return null;
}


function cutieObiect(obiect, latura) {
  if (!obiect) {
    return '<span class="cutie-obiect goala" style="width:' + latura +
           'px;height:' + latura + 'px"></span>';
  }
  return '<span class="cutie-obiect" style="width:' + latura + 'px;height:' + latura +
         'px;border-color:' + obiect.culoare + '">' +
         htmlIcoana(obiect, latura) + '</span>';
}


// Ce scrie pe fisa obiectului, in ordinea din WoW: numele colorat
// dupa raritate, unde se poarta, nivelul obiectului, armura,
// statisticile, nivelul cerut si cat face la negustor.
function htmlFisa(obiect) {

  // O vechitura n-are slot, n-are statistici si n-are nivel cerut.
  // Are doar un pret - de-aia o tii.
  if (obiect.vechitura) {
    const cap = '<div class="fisa-nume" style="color:' + obiect.culoare + '">' + obiect.nume +
                (obiect.cate > 1 ? ' <span class="stins">x' + obiect.cate + '</span>' : '') + '</div>';
    const pret = '<div class="fisa-rand stins">Sell price: ' +
                 baniHtml(pretDeVandut(obiect)) + '</div>';

    // Ce se bea sau se mananca spune ce face, si ca se foloseste
    // dintr-o apasare. Un material spune doar ca e material.
    if (obiect.consumabil) {
      return cap +
             '<div class="fisa-rand bun">' + obiect.consumabil.descriere + '</div>' +
             '<div class="fisa-rand stins">Tap to use</div>' + pret;
    }
    if (obiect.retetaDe) {
      const r = gasesteReteta(obiect.retetaDe);
      const stiu = stiiReteta(personaj, obiect.retetaDe);
      return cap +
             '<div class="fisa-rand bun">' + MESERII[r.meserie].nume + ' \u00b7 ' +
             TEXT.SKILL + ' ' + r.invatataLa + '</div>' +
             '<div class="fisa-rand stins">' +
             (stiu ? TEXT.RECIPE_KNOWN : TEXT.TAP_TO_LEARN) + '</div>' + pret;
    }
    if (obiect.material) {
      return cap + '<div class="fisa-rand stins">Trade material</div>' + pret;
    }
    return cap + '<div class="fisa-rand stins">Junk</div>' + pret;
  }

  const slot = gasesteSlot(obiect.slot);
  const raritate = gasesteRaritate(obiect.raritate);
  const preaMic = personaj.nivel < nivelulCerut(obiect);

  let html = '<div class="fisa-nume" style="color:' + obiect.culoare + '">' +
             obiect.nume + '</div>';
  html += '<div class="fisa-rand fisa-doua"><span>' + raritate.nume + '</span>' +
          '<span>' + slot.nume + '</span></div>';
  html += '<div class="fisa-rand stins">Item Level ' + obiect.nivel + '</div>';

  if (obiect.arma) {
    html += '<div class="fisa-rand fisa-doua"><span>' +
            obiect.arma.dmgMin + ' &ndash; ' + obiect.arma.dmgMax + ' Damage</span>' +
            '<span>Speed ' + obiect.arma.viteza.toFixed(1) + '</span></div>';
    const dps = ((obiect.arma.dmgMin + obiect.arma.dmgMax) / 2 / obiect.arma.viteza).toFixed(1);
    html += '<div class="fisa-rand stins">(' + dps + ' damage per second)</div>';
  }

  if (obiect.armura > 0) {
    html += '<div class="fisa-rand">' + obiect.armura + ' Armor</div>';
  }
  Object.keys(obiect.statistici).forEach(function (a) {
    html += '<div class="fisa-rand bun">+' + obiect.statistici[a] + ' ' + NUME_ATRIBUT[a] + '</div>';
  });

  html += '<div class="fisa-rand' + (preaMic ? ' rau' : '') + '">Requires Level ' +
          nivelulCerut(obiect) + '</div>';
  html += '<div class="fisa-rand stins">Sell price: ' + baniHtml(pretDeVandut(obiect)) + '</div>';
  return html;
}


// ----------------------------------------------------------
//  Aratarea fisei: cu mouse-ul treci peste, pe telefon TII APASAT
// ----------------------------------------------------------
const fisaObiect = document.getElementById('fisa-obiect');
let ceasFisa = null;

function aratafisa(obiect, element) {
  fisaObiect.innerHTML = htmlFisa(obiect);
  fisaObiect.classList.remove('ascuns');

  // O asezam langa obiect, dar fara sa iasa din ecran.
  const cutie = element.getBoundingClientRect();
  const a = fisaObiect.getBoundingClientRect();
  let st = cutie.right + 10;
  let sus = cutie.top;
  if (st + a.width > window.innerWidth - 6) st = cutie.left - a.width - 10;
  if (st < 6) st = 6;
  if (sus + a.height > window.innerHeight - 6) sus = window.innerHeight - a.height - 6;
  if (sus < 6) sus = 6;
  fisaObiect.style.left = st + 'px';
  fisaObiect.style.top = sus + 'px';
}

function ascundeFisa() {
  if (ceasFisa) { clearTimeout(ceasFisa); ceasFisa = null; }
  fisaObiect.classList.add('ascuns');
}

// Leaga fisa de toate elementele dintr-o bucata de pagina care au
// scris pe ele data-fisa="<numarul obiectului>".
function legafisele(radacina) {

  radacina.querySelectorAll('[data-fisa]').forEach(function (el) {

    const obiect = gasesteObiectDupaId(Number(el.dataset.fisa));
    if (!obiect) return;

    // pe calculator: treci cu mouse-ul peste
    el.addEventListener('mouseenter', function () { aratafisa(obiect, el); });
    el.addEventListener('mouseleave', ascundeFisa);

    // pe telefon: tii degetul apasat o jumatate de secunda
    el.addEventListener('touchstart', function () {
      ceasFisa = setTimeout(function () { aratafisa(obiect, el); }, 450);
    }, { passive: true });
    el.addEventListener('touchend', ascundeFisa);
    el.addEventListener('touchmove', ascundeFisa, { passive: true });
  });
}


function randStat(eticheta, valoare) {
  return '<div class="rand-stat"><span>' + eticheta + '</span><span>' + valoare + '</span></div>';
}


function slotHtml(idSlot) {

  const slot = gasesteSlot(idSlot);
  const obiect = (personaj.echipament || {})[idSlot];

  if (!obiect) {
    return '<div class="slot gol">' + cutieObiect(null, 26) +
           '<span class="text-slot"><span class="nume-slot">' + slot.nume + '</span>' +
           '<span class="nume-obiect">Empty</span></span></div>';
  }

  return '<button class="slot" data-scoate="' + idSlot + '" data-fisa="' + obiect.id + '">' +
         cutieObiect(obiect, 26) +
         '<span class="text-slot">' +
         '<span class="nume-slot">' + slot.nume + '</span>' +
         '<span class="nume-obiect" style="color:' + obiect.culoare + '">' + obiect.nume + '</span>' +
         '<span class="stat-obiect">' + descriereObiect(obiect) + '</span>' +
         '</span></button>';
}


function scriePaginaCharacter() {

  const p = personaj;
  const resursa = (p.resursa === 'mana') ? 'Mana' : 'Rage';
  const valoareResursa = (p.resursa === 'mana')
    ? Math.round(p.mana) + ' / ' + p.manaMaxima
    : Math.round(p.furie) + ' / 100';

  const stanga = SLOTURI.filter(function (s) { return s.coloana === 'stanga'; });
  const dreapta = SLOTURI.filter(function (s) { return s.coloana === 'dreapta'; });
  const jos = SLOTURI.filter(function (s) { return s.coloana === 'jos'; });

  let html = '<div class="foaie-personaj">';

  html += '<div class="coloana-sloturi">' +
          stanga.map(function (s) { return slotHtml(s.id); }).join('') + '</div>';

  // Silueta are nevoie de invelisul ei: bucatile din ea sunt asezate
  // fata de el, iar fara el nu se vede nimic.
  html += '<div class="mijloc-personaj"><div class="silueta">' + htmlSilueta(p) + '</div></div>';

  html += '<div class="coloana-sloturi">' +
          dreapta.map(function (s) { return slotHtml(s.id); }).join('') + '</div>';

  // Panoul cu statistici, in dreapta de tot.
  let stat = '<div class="cutie"><h3>' + p.nume + '</h3>' +
    randStat(TEXT.LEVEL, p.nivel) +
    randStat('Race', p.rasa) +
    randStat('Class', p.clasa) +
    randStat('Health', Math.round(p.viata) + ' / ' + p.viataMaxima) +
    randStat(resursa, valoareResursa) +
    randStat('Experience', (p.nivel >= NIVEL_MAXIM)
      ? TEXT.MAX_LEVEL : Math.floor(p.xp) + ' / ' + p.xpNecesar) +
    randStat('Money', baniHtml(p.bani || 0)) +
    '</div>';

  stat += '<div class="cutie"><h3>Attributes</h3>' +
    randStat('Strength', p.atribute.str) +
    randStat('Agility', p.atribute.agi) +
    randStat('Stamina', p.atribute.sta) +
    randStat('Intellect', p.atribute.int) +
    randStat('Spirit', p.atribute.spi) +
    '</div>';

  stat += '<div class="cutie"><h3>Combat</h3>' +
    randStat('Attack Power', p.attackPower) +
    (p.attackPowerDistanta !== null ? randStat('Ranged Attack Power', p.attackPowerDistanta) : '') +
    randStat('Armor', p.armura) +
    randStat('Critical', p.critical.toFixed(2) + '%') +
    '</div>';

  html += '<div class="coloana-stat">' + stat + '</div>';

  // Randul de jos: talisman si armele.
  html += '<div class="sub-personaj">' +
          jos.map(function (s) { return slotHtml(s.id); }).join('') + '</div>';

  html += '</div>';

  // Meseriile, sub personaj.
  html += htmlMeseriile();

  document.getElementById('pagina-character').innerHTML = html;

  legafisele(document.getElementById('pagina-character'));

  // Apesi meseria si se deschide fereastra ei de facut lucruri.
  document.querySelectorAll('[data-meserie]').forEach(function (b) {
    b.addEventListener('click', function () { deschideMeseria(b.dataset.meserie); });
  });

  document.querySelectorAll('[data-scoate]').forEach(function (b) {
    b.addEventListener('click', function () {
      ascundeFisa();
      if (dezechipeaza(personaj, b.dataset.scoate)) {
        aplicaTalentele();
        scrieMeniul();
      }
    });
  });
}


// ----------------------------------------------------------
//  MESERIILE, in fila Character
//
//  Nu i-am facut o fila a ei: doua-trei randuri incap sub
//  statistici, si asa nu mai e inca un buton de apasat.
// ----------------------------------------------------------
function htmlMeseriile() {

  const ale = meseriileTale(personaj);
  const id_uri = Object.keys(ale);

  let html = '<div class="cutie"><h3>' + TEXT.PROFESSIONS + '</h3>';

  if (!id_uri.length) {
    html += '<div class="ajutor-rucsac">' + TEXT.NO_PROFESSIONS + '</div></div>';
    return html;
  }

  id_uri.forEach(function (id) {
    const m = MESERII[id];
    if (!m) return;
    const skill = skillulTau(personaj, id);
    const plafon = plafonulTau(personaj, id);
    const treapta = TREPTE_MESERIE[treaptaTa(personaj, id) - 1];

    html += '<button class="o-stiuta" data-meserie="' + id + '">' +
            '<span><b>' + m.nume + '</b> <span class="stins">' +
            (treapta ? treapta.nume : '') + '</span></span>' +
            '<span>' + skill + ' / ' + plafon + '</span></button>';
    html += '<div class="bara-skill"><span style="width:' +
            Math.round(skill / plafon * 100) + '%"></span></div>';
  });

  html += '</div>';
  return html;
}


function scriePaginaSpells() {

  const p = personaj;

  // ---- stanga: pasiva si bara de butoane ----
  let stanga = '<div class="cutie"><h3>Class Passive</h3><ul>' +
    '<li><b>' + p.pasivaClasa.nume + '</b> &ndash; ' + p.pasivaClasa.descriere + '</li>' +
    '</ul></div>';

  stanga += '<div class="cutie"><h3>' + TEXT.ABILITY_BAR + '</h3>';
  stanga += '<div class="ajutor-rucsac">' + TEXT.BAR_HELP + '</div>';
  stanga += '<div class="pagini-bara">';
  for (let pg = 0; pg < PAGINI_BARA; pg++) {
    stanga += '<button class="buton mic' + (pg === paginaAratata ? ' apasat' : '') +
              '" data-pagina="' + pg + '">' + TEXT.BAR_PAGE + ' ' + (pg + 1) + '</button>';
  }
  stanga += '</div><div class="locuri-bara">';

  for (let i = 0; i < BUTOANE_PE_PAGINA; i++) {
    const loc = paginaAratata * BUTOANE_PE_PAGINA + i;
    const id = (p.bara || [])[loc];
    const ab = id ? gasesteAbilitatea(id) : null;
    stanga += '<button class="loc-bara' + (ab ? '' : ' gol') +
              (abilitateaAleasa ? ' tinta' : '') + '" data-loc="' + loc + '">' +
              '<span class="nr-loc">' + (i + 1) + '</span>' +
              (ab ? ab.nume : TEXT.BAR_EMPTY_SLOT) + '</button>';
  }
  stanga += '</div></div>';

  // ---- dreapta: ce stii ----
  const stiute = abilitatileStiute(p).sort(function (a, b) { return a.nivel - b.nivel; });

  let dreapta = '<div class="cutie"><h3>' + TEXT.KNOWN_ABILITIES + '</h3>';

  if (!stiute.length) {
    dreapta += '<div class="gol-fereastra">' + TEXT.NOTHING_LEARNED + '</div>';
  } else {
    dreapta += '<div class="stiute-lista">';
    stiute.forEach(function (ab) {

      const costuri = [];
      if (ab.costMana > 0) costuri.push(costulAbilitatii(ab, 'mana') + ' mana');
      if (ab.costRage > 0) costuri.push(costulAbilitatii(ab, 'rage') + ' rage');
      if (ab.pauza > 0) costuri.push(Math.round(ab.pauza * reducereTalent(p, 'pauza') / 100) / 10 + 's cooldown');
      if (ab.incantare > 0) costuri.push(ab.incantare / 1000 + 's cast');

      dreapta += '<button class="o-stiuta' +
                 (abilitateaAleasa === ab.id ? ' aleasa' : '') +
                 '" data-aleg="' + ab.id + '">' +
                 '<span><b>' + ab.nume + '</b> <span class="stins">' +
                 TEXT.RANK + ' ' + ab.rang + '</span><br>' +
                 '<span class="stins">' + ab.descriere + '</span>' +
                 (costuri.length ? '<br><span class="stins">' + costuri.join(' &middot; ') + '</span>' : '') +
                 '</span></button>';
    });
    dreapta += '</div>';
  }
  dreapta += '</div>';

  document.getElementById('pagina-spells').innerHTML =
    '<div class="doua-coloane"><div>' + stanga + '</div><div>' + dreapta + '</div></div>';

  const pagina = document.getElementById('pagina-spells');

  pagina.querySelectorAll('[data-pagina]').forEach(function (b) {
    b.addEventListener('click', function () {
      paginaAratata = Number(b.dataset.pagina);
      scriePaginaSpells();
    });
  });

  // Alegi o abilitate, apoi apesi locul in care o vrei.
  pagina.querySelectorAll('[data-aleg]').forEach(function (b) {
    b.addEventListener('click', function () {
      abilitateaAleasa = (abilitateaAleasa === b.dataset.aleg) ? null : b.dataset.aleg;
      scriePaginaSpells();
    });
  });

  pagina.querySelectorAll('[data-loc]').forEach(function (b) {
    b.addEventListener('click', function () {
      const loc = Number(b.dataset.loc);
      // Fara nimic ales, o apasare pe un loc il goleste.
      puneInLoc(p, loc, abilitateaAleasa || null);
      abilitateaAleasa = null;
      if (typeof scrieButoaneleAbilitatilor === 'function') scrieButoaneleAbilitatilor();
      salveaza();
      scriePaginaSpells();
    });
  });
}


// Ce pagina a barei se vede in meniu, si ce abilitate ai ales sa muti.
let paginaAratata = 0;
let abilitateaAleasa = null;


function scriePaginaTalents() {

  const p = personaj;
  const arbori = arboriiClasei(p.idClasa);
  const ramase = puncteRamase(p);

  let html = '<div class="puncte-ramase">' +
    '<span>Unspent talent points: <b>' + ramase + '</b> of ' + p.puncteTalent + '</span>' +
    '<button class="buton" id="reseteaza-talente">Reset all</button>' +
    '</div><div class="arbori">';

  arbori.forEach(function (arbore) {

    const inArbore = puncteInArbore(p.talente || {}, arbore);
    html += '<div class="arbore"><h4>' + arbore.nume + ' &mdash; ' + inArbore + '</h4>';

    // Talentele se aseaza pe trepte: 0, 1, 2...
    const trepte = {};
    arbore.talente.forEach(function (t) {
      (trepte[t.treapta] = trepte[t.treapta] || []).push(t);
    });

    Object.keys(trepte).sort(function (a, b) { return a - b; }).forEach(function (nr) {

      const cerute = nr * PUNCTE_PE_TREAPTA;
      html += '<div class="treapta">';
      html += '<div class="eticheta-treapta">' +
              (cerute === 0 ? 'Open' : 'Requires ' + cerute + ' points') + '</div>';
      html += '<div class="talente-rand">';

      trepte[nr].forEach(function (t) {

        const rang = (p.talente || {})[t.id] || 0;
        const verdict = poateInvata(p, t.id);

        let clasa = 'talent';
        if (rang >= t.maxRang) clasa += ' plin';
        else if (rang > 0) clasa += ' luat';
        if (!verdict.poate && rang < t.maxRang) clasa += ' blocat';

        html += '<button class="' + clasa + '" data-talent="' + t.id + '">' +
                '<span class="nume-t">' + t.nume + '</span>' +
                '<span class="rang-t">' + rang + ' / ' + t.maxRang + '</span>' +
                '<span class="desc-t">' + descriereTalent(t, rang) + '</span>' +
                (!verdict.poate && rang < t.maxRang && verdict.motiv
                  ? '<span class="motiv-t">' + verdict.motiv + '</span>' : '') +
                '</button>';
      });

      html += '</div></div>';
    });

    html += '</div>';
  });

  html += '</div>';
  document.getElementById('pagina-talents').innerHTML = html;

  // Butoanele capata viata abia dupa ce au fost scrise pe pagina.
  document.getElementById('reseteaza-talente').addEventListener('click', function () {
    reseteazaTalentele(personaj);
    aplicaTalentele();
    scrieMeniul();
  });

  document.querySelectorAll('[data-talent]').forEach(function (buton) {
    buton.addEventListener('click', function () {
      if (invataTalent(personaj, buton.dataset.talent)) {
        aplicaTalentele();
        scrieMeniul();
      }
    });
  });
}


// ----------------------------------------------------------
//  ARUNCATUL DIN RUCSAC
//
//  Pana acum un obiect putea sa iasa din rucsac doar vandut. Daca
//  ti se umplea rucsacul cu vechituri departe de negustor, ramaneai
//  blocat: nu mai puteai lua nimic si nu puteai scapa de nimic.
//
//  Acum apesi "Drop items", rucsacul se face rosu, si fiecare obiect
//  are un X. Ce arunci NU se mai intoarce, deci jocul intreaba
//  inainte - o singura data, cu numele obiectului in intrebare.
// ----------------------------------------------------------
let modAruncare = false;
let ceIntrebam = null;      // id-ul obiectului pentru care asteptam raspuns

function scriePaginaInventory() {

  const obiecte = personaj.inventar || [];
  const libere = locuriLibere(personaj);
  const vechituri = obiecte.filter(function (o) { return o.vechitura; }).length;

  let html = '<div class="cutie"><h3>Backpack &mdash; ' + obiecte.length + ' / ' +
             LOCURI_IN_RUCSAC + '</h3>';

  // ---- randul de butoane ----
  html += '<div class="unelte-rucsac">' +
          '<button class="buton mic' + (modAruncare ? ' apasat' : '') +
          '" id="comuta-aruncarea">' +
          (modAruncare ? TEXT.DONE : TEXT.DROP_ITEMS) + '</button>';
  if (vechituri > 0) {
    html += '<button class="buton mic" id="arunca-vechiturile">' +
            TEXT.DROP_ALL_JUNK + '</button>';
  }
  html += '</div>';

  // ---- intrebarea de confirmare, daca asteptam un raspuns ----
  const deAruncat = ceIntrebam ? gasesteObiectDupaId(ceIntrebam) : null;
  if (deAruncat) {
    html += '<div class="intrebare-rucsac">' +
            '<span>' + TEXT.DROP_ASK.replace('{item}',
              deAruncat.nume + (deAruncat.cate > 1 ? ' x' + deAruncat.cate : '')) + '</span>' +
            '<button class="buton mic rau" id="da-arunca">' + TEXT.YES_DROP + '</button>' +
            '<button class="buton mic" id="nu-arunca">' + TEXT.CANCEL + '</button>' +
            '</div>';
  }

  html += '<div class="ajutor-rucsac">' +
          (modAruncare ? TEXT.DROP_HELP : 'Tap an item to equip it. ' +
           'Press and hold to see what it does.') + '</div>';
  html += '<div class="grila-rucsac' + (modAruncare ? ' de-aruncat' : '') + '">';

  // Intai lucrurile tale, apoi locurile goale ramase - ca sa se vada
  // cat mai ai loc, la fel ca rucsacul din WoW.
  obiecte.forEach(function (o) {

    // O vechitura nu se poate purta, deci n-are semn de nivel;
    // in schimb arata cate bucati sunt in gramada.
    // Cat tine modul de aruncare, orice obiect are un X si apasarea
    // lui nu mai echipeaza nimic - intreaba daca sa-l arunce.
    const semnX = modAruncare ? '<span class="semn-arunca">&times;</span>' : '';
    const ceFace = modAruncare ? ' data-arunca="' + o.id + '"'
                 : (o.consumabil || o.retetaDe) ? ' data-folosesc="' + o.id + '"'
                 : (o.vechitura ? '' : ' data-echipeaza="' + o.id + '"');

    if (o.vechitura) {
      html += '<button class="loc-rucsac vechitura"' + ceFace +
              ' data-fisa="' + o.id + '">' +
              cutieObiect(o, 44) +
              (o.cate > 1 ? '<span class="cate-in-gramada">' + o.cate + '</span>' : '') +
              semnX + '</button>';
      return;
    }

    const preaMic = personaj.nivel < nivelulCerut(o);
    html += '<button class="loc-rucsac' + (preaMic ? ' preaMic' : '') + '"' + ceFace +
            ' data-fisa="' + o.id + '">' +
            cutieObiect(o, 44) +
            (preaMic ? '<span class="semn-nivel">' + nivelulCerut(o) + '</span>' : '') +
            semnX + '</button>';
  });

  for (let i = 0; i < libere; i++) {
    html += '<span class="loc-rucsac gol"></span>';
  }

  html += '</div></div>';
  document.getElementById('pagina-inventory').innerHTML = html;

  const pagina = document.getElementById('pagina-inventory');
  legafisele(pagina);

  pagina.querySelectorAll('[data-echipeaza]').forEach(function (b) {
    b.addEventListener('click', function () {
      ascundeFisa();
      if (echipeaza(personaj, Number(b.dataset.echipeaza))) {
        aplicaTalentele();
        scrieMeniul();
      }
    });
  });

  // ---- bautura si mancarea: se folosesc dintr-o apasare ----
  pagina.querySelectorAll('[data-folosesc]').forEach(function (b) {
    b.addEventListener('click', function () {
      ascundeFisa();
      const r = folosesteConsumabil(Number(b.dataset.folosesc));
      if (r && r.gresit) {
        document.querySelector('.ajutor-rucsac').textContent = r.gresit;
        return;
      }
      scrieMeniul();
    });
  });

  // ---- butoanele de aruncat ----
  pagina.querySelectorAll('[data-arunca]').forEach(function (b) {
    b.addEventListener('click', function () {
      ascundeFisa();
      ceIntrebam = Number(b.dataset.arunca);
      scriePaginaInventory();
    });
  });

  const comuta = document.getElementById('comuta-aruncarea');
  if (comuta) comuta.addEventListener('click', function () {
    modAruncare = !modAruncare;
    ceIntrebam = null;
    scriePaginaInventory();
  });

  const daArunca = document.getElementById('da-arunca');
  if (daArunca) daArunca.addEventListener('click', function () {
    const aruncat = aruncaDinRucsac(personaj, ceIntrebam);
    ceIntrebam = null;
    if (aruncat) salveaza();
    scrieMeniul();
  });

  const nuArunca = document.getElementById('nu-arunca');
  if (nuArunca) nuArunca.addEventListener('click', function () {
    ceIntrebam = null;
    scriePaginaInventory();
  });

  const totGunoiul = document.getElementById('arunca-vechiturile');
  if (totGunoiul) totGunoiul.addEventListener('click', function () {
    if (aruncaVechiturile(personaj) > 0) salveaza();
    ceIntrebam = null;
    scrieMeniul();
  });
}


function scriePaginaQuests() {

  const active = misiuniActive(personaj);
  const predate = MISIUNI.filter(function (m) { return starea(personaj, m.id) === 'predata'; });

  let html = '<div class="cutie"><h3>' + TEXT.QUEST_LOG + ' &mdash; ' + active.length + '</h3>';

  if (active.length === 0) {
    html += '<div class="gol-fereastra">' + TEXT.EMPTY_LOG + '</div>';
  } else {
    active.forEach(function (m) {
      const gata = starea(personaj, m.id) === 'gata';
      html += '<div class="misiune-carnet' + (gata ? ' gata' : '') + '">' +
              '<div class="titlu-misiune">' + m.titlu +
              ' <span class="nivel-misiune">(' + TEXT.LEVEL + ' ' + m.nivel + ')</span></div>' +
              '<div class="text-misiune">' + m.text + '</div>' +
              '<div class="cerinta-misiune' + (gata ? ' gata' : '') + '">' +
              textulCerintei(personaj, m) + '</div>' +
              '</div>';
    });
  }
  html += '</div>';

  if (predate.length > 0) {
    html += '<div class="cutie"><h3>Completed &mdash; ' + predate.length + '</h3>' +
            '<div class="misiuni-predate">' +
            predate.map(function (m) { return m.titlu; }).join(' &middot; ') +
            '</div></div>';
  }

  document.getElementById('pagina-quests').innerHTML = html;
}


// ----------------------------------------------------------
//  Filele de sus
// ----------------------------------------------------------
document.querySelectorAll('[data-fila]').forEach(function (buton) {
  buton.addEventListener('click', function () {
    filaCurenta = buton.dataset.fila;

    document.querySelectorAll('[data-fila]').forEach(function (b) {
      b.classList.toggle('aleasa', b.dataset.fila === filaCurenta);
    });
    ['character', 'spells', 'talents', 'inventory', 'quests'].forEach(function (nume) {
      document.getElementById('pagina-' + nume).classList.toggle('ascuns', nume !== filaCurenta);
    });
  });
});

inchideMeniu.addEventListener('click', inchideMeniul);

// Butonul de sunet: scrie singur daca e pornit sau oprit, si tine
// minte alegerea in telefon, nu in personaj - e o setare a ta.
const butonSunet = document.getElementById('buton-sunet');

function scrieButonulDeSunet() {
  if (!butonSunet) return;
  butonSunet.textContent = TEXT.SOUND + ': ' +
    (sunetulPornit ? TEXT.SOUND_ON : TEXT.SOUND_OFF);
  butonSunet.classList.toggle('stins-buton', !sunetulPornit);
}
scrieButonulDeSunet();

if (butonSunet) butonSunet.addEventListener('click', function () {
  porneisteOpresteSunetul();
  scrieButonulDeSunet();
});


document.getElementById('log-out').addEventListener('click', function () {
  inchideMeniul();
  iesiDinLume();
  arataSloturile();
});
window.addEventListener('resize', potrivesteMeniul);

// Tasta Escape inchide meniul, tasta M il deschide si il inchide.
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && meniuDeschis) inchideMeniul();
  if ((e.key === 'm' || e.key === 'M') && personaj) comutaMeniul();
});
