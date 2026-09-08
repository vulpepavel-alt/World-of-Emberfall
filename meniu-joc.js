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
  meniuDeschis = true;
  ecranMeniu.classList.remove('ascuns');
  potrivesteMeniul();
  scrieMeniul();
}

function inchideMeniul() {
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
}


function randStat(eticheta, valoare) {
  return '<div class="rand-stat"><span>' + eticheta + '</span><span>' + valoare + '</span></div>';
}


function scriePaginaCharacter() {

  const p = personaj;
  const resursa = (p.resursa === 'mana') ? 'Mana' : 'Rage';
  const valoareResursa = (p.resursa === 'mana')
    ? Math.round(p.mana) + ' / ' + p.manaMaxima
    : Math.round(p.furie) + ' / 100';

  let stanga = '<div class="cutie"><h3>' + p.nume + '</h3>' +
    randStat(TEXT.LEVEL, p.nivel) +
    randStat('Race', p.rasa) +
    randStat('Class', p.clasa) +
    randStat('Faction', p.factiune) +
    randStat('Health', Math.round(p.viata) + ' / ' + p.viataMaxima) +
    randStat(resursa, valoareResursa) +
    randStat('Experience', (p.nivel >= NIVEL_MAXIM)
      ? TEXT.MAX_LEVEL
      : Math.floor(p.xp) + ' / ' + p.xpNecesar) +
    '</div>';

  stanga += '<div class="cutie"><h3>Attributes</h3>' +
    randStat('Strength', p.atribute.str) +
    randStat('Agility', p.atribute.agi) +
    randStat('Stamina', p.atribute.sta) +
    randStat('Intellect', p.atribute.int) +
    randStat('Spirit', p.atribute.spi) +
    '</div>';

  let dreapta = '<div class="cutie"><h3>Combat</h3>' +
    randStat('Attack Power', p.attackPower) +
    (p.attackPowerDistanta !== null ? randStat('Ranged Attack Power', p.attackPowerDistanta) : '') +
    randStat('Armor', p.armura) +
    randStat('Critical', p.critical.toFixed(2) + '%') +
    '</div>';

  dreapta += '<div class="cutie"><h3>Weapon</h3>';
  Object.keys(p.arme).forEach(function (fel) {
    const a = p.arme[fel];
    dreapta += randStat(a.nume + ((fel === 'distanta') ? ' (ranged)' : ' (melee)'),
                        a.dmgMin + '-' + a.dmgMax + ' dmg, ' + a.viteza.toFixed(1) + 's');
  });
  dreapta += '</div>';

  dreapta += '<div class="cutie"><h3>Racial Traits</h3><ul>';
  p.pasiveRasa.forEach(function (pasiva) {
    dreapta += '<li><b>' + pasiva.nume + '</b> &ndash; ' + pasiva.descriere + '</li>';
  });
  dreapta += '</ul></div>';

  document.getElementById('pagina-character').innerHTML =
    '<div class="doua-coloane"><div>' + stanga + '</div><div>' + dreapta + '</div></div>';
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


// ----------------------------------------------------------
//  Filele de sus
// ----------------------------------------------------------
document.querySelectorAll('[data-fila]').forEach(function (buton) {
  buton.addEventListener('click', function () {
    filaCurenta = buton.dataset.fila;

    document.querySelectorAll('[data-fila]').forEach(function (b) {
      b.classList.toggle('aleasa', b.dataset.fila === filaCurenta);
    });
    ['character', 'spells', 'talents'].forEach(function (nume) {
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
