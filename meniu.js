// ==========================================================
//  MENIUL DE CREARE A PERSONAJULUI
//
//  Tot ce apare aici este citit din tabelele RASE si CLASE
//  din personaj.js. Daca adaugi acolo o rasa noua, ea apare
//  singura in meniu - nu trebuie sa modifici fisierul asta.
// ==========================================================

// Ce a ales jucatorul in acest moment.
let rasaAleasa = 'human';
let clasaAleasa = 'warrior';
let infatisareAleasa = infatisareImplicita();

// Cele cinci randuri de infatisare, in ordinea de pe ecran.
//   cheie   - dupa ce se cauta lista de optiuni
//   eticheta- ce scrie in stanga randului (textul sta in texte.js)
//   culoare - true daca optiunile sunt culori (se arata o mostra)
const RANDURI_INFATISARE = [
  { cheie: 'sex',        eticheta: TEXT.SEX,         culoare: false },
  { cheie: 'piele',      eticheta: TEXT.SKIN_COLOR,  culoare: true  },
  { cheie: 'fata',       eticheta: TEXT.FACE,        culoare: false },
  { cheie: 'parStil',    eticheta: TEXT.HAIR_STYLE,  culoare: false },
  { cheie: 'parCuloare', eticheta: TEXT.HAIR_COLOR,  culoare: true  },
  { cheie: 'barba',      eticheta: TEXT.FACIAL_HAIR, culoare: false }
];

// Scurtaturi catre bucatile din pagina.
const ecran        = document.getElementById('ecran-creare');
const scena        = document.getElementById('scena');
const tilesAlianta = document.getElementById('tiles-alianta');
const tilesHoarda  = document.getElementById('tiles-hoarda');
const grilaClase   = document.getElementById('grila-clase');
const silueta      = document.getElementById('silueta');
const zonaInfatisare = document.getElementById('infatisare');
const numeRasa     = document.getElementById('nume-rasa');
const portretRasa  = document.getElementById('portret-rasa');
const portretClasa = document.getElementById('portret-clasa');
const titluRasa    = document.getElementById('titlu-rasa');
const titluClasa   = document.getElementById('titlu-clasa-panou');
const corpRasa     = document.getElementById('corp-rasa');
const corpClasa    = document.getElementById('corp-clasa');
const panouStats   = document.getElementById('blocuri-stats');
const campNume     = document.getElementById('nume');
const mesajNume    = document.getElementById('mesaj-nume');
const butonIntra   = document.getElementById('intra');
const butonZar     = document.getElementById('zar');


// ----------------------------------------------------------
//  Scena are marime fixa 1280x720. O micsoram cat trebuie
//  ca sa incapa in fereastra, pastrandu-i forma orizontala.
// ----------------------------------------------------------
function potrivesteScena() {
  const cat = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  scena.style.transform = 'scale(' + cat + ')';
}


// ----------------------------------------------------------
//  Construim patratelele de rasa si de clasa din tabele
// ----------------------------------------------------------
function chipul(rasa) {
  return '<span class="fata">' +
           '<span class="p" style="background:' + rasa.optiuni.par[0] + '"></span>' +
           '<span class="c" style="background:' + rasa.optiuni.piele[0] + '"></span>' +
         '</span>';
}

function construiesteOptiunile() {

  ID_RASE.forEach(function (id) {
    const rasa = RASE[id];
    const buton = document.createElement('button');
    buton.className = 'tile';
    buton.dataset.rasa = id;
    buton.title = rasa.nume;
    buton.innerHTML = chipul(rasa);
    buton.addEventListener('click', function () {
      rasaAleasa = id;
      actualizeaza();
    });

    if (rasa.factiune === 'Concord') tilesAlianta.appendChild(buton);
    else tilesHoarda.appendChild(buton);
  });

  ID_CLASE.forEach(function (id) {
    const clasa = CLASE[id];
    const buton = document.createElement('button');
    buton.className = 'tile-clasa';
    buton.dataset.clasa = id;
    buton.title = clasa.nume;
    buton.innerHTML =
      '<span class="patura" style="background:' + clasa.culoare + '"></span>' +
      '<span class="icon-arma"><span class="arma" data-arma="' + FORMA_ARMA_CLASA[id] + '"></span></span>';
    buton.addEventListener('click', function () {
      clasaAleasa = id;
      actualizeaza();
    });
    grilaClase.appendChild(buton);
  });
}


// ----------------------------------------------------------
//  Randurile de infatisare: eticheta, sageti si ce ai ales
// ----------------------------------------------------------
function construiesteInfatisarea() {

  zonaInfatisare.innerHTML = '';

  RANDURI_INFATISARE.forEach(function (rand) {

    const linie = document.createElement('div');
    linie.className = 'rand-infatisare';

    const eticheta = document.createElement('span');
    eticheta.className = 'et';
    eticheta.textContent = rand.eticheta;

    const inapoi = document.createElement('button');
    inapoi.className = 'sag';
    inapoi.textContent = '\u2039';
    inapoi.addEventListener('click', function () { schimbaInfatisarea(rand.cheie, -1); });

    const valoare = document.createElement('span');
    valoare.className = 'val';
    valoare.id = 'val-' + rand.cheie;

    const inainte = document.createElement('button');
    inainte.className = 'sag';
    inainte.textContent = '\u203a';
    inainte.addEventListener('click', function () { schimbaInfatisarea(rand.cheie, 1); });

    linie.dataset.rand = rand.cheie;
    linie.appendChild(eticheta);
    linie.appendChild(inapoi);
    linie.appendChild(valoare);
    linie.appendChild(inainte);
    zonaInfatisare.appendChild(linie);
  });

  const zar = document.createElement('button');
  zar.className = 'buton mic';
  zar.id = 'zar-infatisare';
  zar.textContent = 'Randomize';
  zar.addEventListener('click', function () {
    infatisareAleasa = infatisareLaIntamplare(rasaAleasa);
    actualizeaza();
  });
  zonaInfatisare.appendChild(zar);
}


// Treci la optiunea urmatoare sau la cea dinainte. Cand ajungi
// la capatul listei, o iei de la inceput.
function schimbaInfatisarea(cheie, pas) {
  const lista = optiuniInfatisare(rasaAleasa)[cheie];
  const cate = lista.length;
  infatisareAleasa[cheie] = (infatisareAleasa[cheie] + pas + cate) % cate;
  actualizeaza();
}


// Scrie in fiecare rand ce ai ales acum.
function scrieInfatisarea() {
  const op = optiuniInfatisare(rasaAleasa);

  // O femeie n-are barba: randul dispare de tot, ca sa nu stai sa
  // dai prin trei optiuni care nu schimba nimic.
  const eFemeie = op.sex[infatisareAleasa.sex].id === 'femeie';

  RANDURI_INFATISARE.forEach(function (rand) {
    const casuta = document.getElementById('val-' + rand.cheie);
    const linie = casuta.closest('[data-rand]');
    if (linie) linie.style.display = (rand.cheie === 'barba' && eFemeie) ? 'none' : '';

    const ales = op[rand.cheie][infatisareAleasa[rand.cheie]];
    const dinCate = ' (' + (infatisareAleasa[rand.cheie] + 1) + '/' + op[rand.cheie].length + ')';

    if (rand.culoare) {
      casuta.innerHTML = '<i class="mostra" style="background:' + ales + '"></i>' +
                         '<span>' + dinCate.trim() + '</span>';
    } else {
      casuta.textContent = ales.nume + dinCate;
    }
  });
}


// ----------------------------------------------------------
//  Desenam personajul din forme colorate
// ----------------------------------------------------------
// Silueta ca text HTML. O foloseste si ecranul de creare, si
// fila Character din meniul de joc.
function htmlSilueta(p) {

  // Formele vin din infatisare.js - aceleasi pe care le deseneaza
  // si jocul. Aici le transformam in casute HTML: fiecare forma
  // devine un <div> asezat la locul lui.
  //
  // O forma e masurata in "pasi de joc" (personajul are vreo 22 pasi
  // latime). Ca sa se vada mare in meniu, inmultim tot cu SCARA.
  const SCARA = 6;
  const CX = 100;   // mijlocul siluetei, pe latime
  const CY = 178;   // linia taliei, pe inaltime

  function casuta(f, crestere, culoare) {
    let st, sus, lat, inalt, rotund = '';

    if (f.fel === 'cerc') {
      const r = f.r + crestere / 2;
      lat = inalt = r * 2 * SCARA;
      st  = (CX + (f.x - r) * SCARA);
      sus = (CY + (f.y - r) * SCARA);
      rotund = 'border-radius:50%;';
    } else {
      lat   = (f.w + crestere) * SCARA;
      inalt = (f.h + crestere) * SCARA;
      st  = (CX + f.x * SCARA) - lat / 2;
      sus = (CY + f.y * SCARA) - inalt / 2;
    }

    return '<div style="position:absolute;left:' + st.toFixed(1) + 'px;top:' + sus.toFixed(1) +
           'px;width:' + lat.toFixed(1) + 'px;height:' + inalt.toFixed(1) +
           'px;background:' + culoare + ';' + rotund + '"></div>';
  }

  const forme = formePersonaj(p);

  // Intai toate formele putin mai mari si negre: asa iese conturul
  // inchis din jurul siluetei. Apoi formele adevarate, peste el.
  let html = '';
  forme.forEach(function (f) { html += casuta(f, 3, '#14100a'); });
  forme.forEach(function (f) { html += casuta(f, 0, f.culoare); });
  return html;
}


function deseneazaSilueta(p) {
  silueta.innerHTML = htmlSilueta(p);
}


// ----------------------------------------------------------
//  Panoul rasei si panoul clasei, din dreapta
// ----------------------------------------------------------
function scriePanourile(p) {

  titluRasa.textContent = p.rasa;
  titluClasa.textContent = p.clasa;
  portretRasa.style.background = p.aspect.piele;
  portretClasa.style.background = p.culoareClasa;

  let htmlRasa = '<ul>';
  p.pasiveRasa.forEach(function (pasiva) {
    htmlRasa += '<li><b>' + pasiva.nume + '</b> &ndash; ' + pasiva.descriere + '</li>';
  });
  htmlRasa += '</ul><div class="nota">Faction: ' + p.factiune +
              '. Faction is only a label for now, it has no effect in the game.</div>';
  corpRasa.innerHTML = htmlRasa;

  const resursa = (p.resursa === 'mana') ? 'Mana' : 'Rage';
  let htmlClasa = '<ul>';
  htmlClasa += '<li><b>Resource</b> &ndash; ' + resursa + '</li>';

  for (const felArma of Object.keys(p.arme)) {
    const a = p.arme[felArma];
    const unde = (felArma === 'distanta') ? ' (ranged)' : ' (melee)';
    htmlClasa += '<li><b>' + a.nume + unde + '</b> &ndash; ' +
                 a.dmgMin + '-' + a.dmgMax + ' dmg, ' + a.viteza.toFixed(1) + 's per swing</li>';
  }

  htmlClasa += '<li><b>' + p.pasivaClasa.nume + '</b> &ndash; ' + p.pasivaClasa.descriere + '</li>';
  p.abilitati.forEach(function (a) {
    htmlClasa += '<li><b>' + a.nume + '</b> &ndash; ' + a.descriere + '</li>';
  });
  htmlClasa += '</ul><div class="nota">The passive works by itself. ' +
               'The abilities have their own buttons next to ATTACK.</div>';
  corpClasa.innerHTML = htmlClasa;
}


// ----------------------------------------------------------
//  Panoul cu statisticile calculate
// ----------------------------------------------------------
function scrieStatisticile(p) {

  function bloc(eticheta, valoare, lat) {
    return '<div class="stat' + (lat ? ' lat' : '') + '">' +
             '<span class="eticheta">' + eticheta + '</span>' +
             '<span class="valoare">' + valoare + '</span>' +
           '</div>';
  }

  let html = '<div class="blocuri">';

  html += bloc('Strength',  p.atribute.str);
  html += bloc('Agility',   p.atribute.agi);
  html += bloc('Stamina',   p.atribute.sta);
  html += bloc('Intellect', p.atribute.int);
  html += bloc('Spirit',    p.atribute.spi);

  html += bloc('Health', p.viata);
  html += bloc(p.resursa === 'mana' ? 'Mana' : 'Rage',
               p.resursa === 'mana' ? p.mana : '0 / 100');

  html += bloc('Attack Power', p.attackPower);

  if (p.attackPowerDistanta !== null) {
    html += bloc('Ranged AP', p.attackPowerDistanta);
  }

  html += bloc('Armor', p.armura);
  html += bloc('Critical', p.critical.toFixed(2) + '%');

  html += '</div>';
  panouStats.innerHTML = html;
}


// ----------------------------------------------------------
//  Verificam numele scris de jucator
// ----------------------------------------------------------
function numeValid(text) {
  return /^[A-Za-z]{2,12}$/.test(text);
}

function verificaNumele() {
  const text = campNume.value.trim();

  if (text.length === 0) {
    mesajNume.textContent = '';
    butonIntra.disabled = true;
  } else if (!numeValid(text)) {
    mesajNume.textContent = 'The name must be 2 to 12 letters, with no digits, spaces or symbols.';
    butonIntra.disabled = true;
  } else {
    mesajNume.textContent = '';
    butonIntra.disabled = false;
  }
}

function cuMajuscula(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}


// ----------------------------------------------------------
//  Se apeleaza dupa fiecare alegere: reface tot ecranul
// ----------------------------------------------------------
function actualizeaza() {

  // Daca ai schimbat rasa, alegerile se aduc in listele ei.
  infatisareAleasa = potrivesteInfatisarea(rasaAleasa, infatisareAleasa);

  const p = calculeazaPersonaj(rasaAleasa, clasaAleasa, infatisareAleasa);

  document.querySelectorAll('[data-rasa]').forEach(function (b) {
    b.classList.toggle('aleasa', b.dataset.rasa === rasaAleasa);
  });
  document.querySelectorAll('[data-clasa]').forEach(function (b) {
    b.classList.toggle('aleasa', b.dataset.clasa === clasaAleasa);
  });

  numeRasa.textContent = p.rasa;
  scrieInfatisarea();
  deseneazaSilueta(p);
  scriePanourile(p);
  scrieStatisticile(p);
  verificaNumele();
}


// ----------------------------------------------------------
//  Butonul de nume la intamplare
// ----------------------------------------------------------
function numeLaIntamplare() {
  const lista = RASE[rasaAleasa].nume_exemplu;
  campNume.value = lista[Math.floor(Math.random() * lista.length)];
  verificaNumele();
}


// ----------------------------------------------------------
//  Intrarea in joc
// ----------------------------------------------------------
function intraInLume() {

  // Personajul nou merge in slotul pe care l-ai ales inainte. Daca
  // ai ajuns aici fara slot (n-ar trebui), il punem in primul liber.
  if (!slotulCurent) {
    const goale = toateSloturile();
    slotulCurent = goale.findIndex(function (x) { return x === null; }) + 1 || 1;
  }

  const p = calculeazaPersonaj(rasaAleasa, clasaAleasa, infatisareAleasa);
  p.nume = cuMajuscula(campNume.value.trim());

  ecran.classList.add('ascuns');
  porneste(p);
}


// ----------------------------------------------------------
//  Pornirea meniului
// ----------------------------------------------------------
construiesteOptiunile();
construiesteInfatisarea();
actualizeaza();
potrivesteScena();

window.addEventListener('resize', potrivesteScena);
campNume.addEventListener('input', verificaNumele);
campNume.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !butonIntra.disabled) intraInLume();
});
butonZar.addEventListener('click', numeLaIntamplare);
butonIntra.addEventListener('click', intraInLume);
