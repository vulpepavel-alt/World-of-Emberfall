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

  const slot = gasesteSlot(obiect.slot);
  const raritate = gasesteRaritate(obiect.raritate);
  const preaMic = personaj.nivel < nivelulCerut(obiect);

  let html = '<div class="fisa-nume" style="color:' + obiect.culoare + '">' +
             obiect.nume + '</div>';
  html += '<div class="fisa-rand fisa-doua"><span>' + raritate.nume + '</span>' +
          '<span>' + slot.nume + '</span></div>';
  html += '<div class="fisa-rand stins">Item Level ' + obiect.nivel + '</div>';

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
  document.getElementById('pagina-character').innerHTML = html;

  legafisele(document.getElementById('pagina-character'));

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


function scriePaginaSpells() {

  const p = personaj;

  let stanga = '<div class="cutie"><h3>Class Passive</h3><ul>' +
    '<li><b>' + p.pasivaClasa.nume + '</b> &ndash; ' + p.pasivaClasa.descriere + '</li>' +
    '</ul></div>';

  let dreapta = '<div class="cutie"><h3>Abilities</h3><ul>';
  p.abilitati.forEach(function (ab) {
    const costuri = [];
    if (ab.costMana > 0) costuri.push(costulAbilitatii(ab, 'mana') + ' mana');
    if (ab.costRage > 0) costuri.push(costulAbilitatii(ab, 'rage') + ' rage');
    if (ab.pauza > 0) costuri.push(Math.round(ab.pauza * reducereTalent(p, 'pauza') / 100) / 10 + 's cooldown');
    if (ab.incantare > 0) costuri.push(ab.incantare / 1000 + 's cast');

    dreapta += '<li><b>' + ab.nume + '</b> &ndash; ' + ab.descriere +
               (costuri.length ? '<br><i>' + costuri.join(' &middot; ') + '</i>' : '') + '</li>';
  });
  dreapta += '</ul></div>';

  document.getElementById('pagina-spells').innerHTML =
    '<div class="doua-coloane"><div>' + stanga + '</div><div>' + dreapta + '</div></div>';
}


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


function scriePaginaInventory() {

  const obiecte = personaj.inventar || [];
  const libere = locuriLibere(personaj);

  let html = '<div class="cutie"><h3>Backpack &mdash; ' + obiecte.length + ' / ' +
             LOCURI_IN_RUCSAC + '</h3>';
  html += '<div class="ajutor-rucsac">Tap an item to equip it. ' +
          'Press and hold to see what it does.</div>';
  html += '<div class="grila-rucsac">';

  // Intai lucrurile tale, apoi locurile goale ramase - ca sa se vada
  // cat mai ai loc, la fel ca rucsacul din WoW.
  obiecte.forEach(function (o) {
    const preaMic = personaj.nivel < nivelulCerut(o);
    html += '<button class="loc-rucsac' + (preaMic ? ' preaMic' : '') +
            '" data-echipeaza="' + o.id + '" data-fisa="' + o.id + '">' +
            cutieObiect(o, 44) +
            (preaMic ? '<span class="semn-nivel">' + nivelulCerut(o) + '</span>' : '') +
            '</button>';
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
window.addEventListener('resize', potrivesteMeniul);

// Tasta Escape inchide meniul, tasta M il deschide si il inchide.
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && meniuDeschis) inchideMeniul();
  if ((e.key === 'm' || e.key === 'M') && personaj) comutaMeniul();
});
