// ==========================================================
//  GETTING ABOUT, AND USING WHAT IS IN YOUR BAG
//
//  Four ways to cross a world of 52 zones without walking every
//  step of it, and they were all already written down in
//  drumuri.js - they simply had no way of being asked for:
//
//    the flight stops   43 of them, one per landmark worth landing
//                       at. You may fly to any you have walked to
//                       once. costulZborului() sets the fare by how
//                       far apart the two zones sit on the map.
//    the hearthstone    bound at an inn, brings you back, once an
//                       hour.
//    the horses         one at level 40, one at 60.
//    Long Step          the mage's own way to a city.
//
//  And the things in your bag that DO something - bread, water,
//  bandages - which until now just sat there.
// ==========================================================


// How close to a landmark counts as having been there.
const RAZA_DESCOPERIRII = 6;


// ----------------------------------------------------------
//  Finding a stop by walking to it
// ----------------------------------------------------------
function descoperaOpririle() {
  if (!zona || !personaj) return;

  const x = jucator.position.x, z = jucator.position.z;

  (zona.locuri || []).forEach(function (loc) {
    if (LOCURI_DE_ZBOR.indexOf(loc.fel) < 0) return;

    const inima = loc.inima || loc;
    if (Math.hypot(inima.col - x, inima.rand - z) > RAZA_DESCOPERIRII) return;

    const idNod = zona.id + ':' + loc.id;
    if (descoperaZborul(personaj, idNod)) {
      spuneCeva((TEXT.FLIGHT_FOUND || 'Flight stop found: {p}')
                  .replace('{p}', loc.nume || zona.nume));
    }
  });

  // A whole city is its own stop.
  if (retetaZonei(zona.id) && retetaZonei(zona.id).esteOras) {
    if (descoperaZborul(personaj, zona.id + ':oras')) {
      spuneCeva((TEXT.FLIGHT_FOUND || 'Flight stop found: {p}').replace('{p}', zona.nume));
    }
  }
}


// Which stop you are standing at, if any - the flight master needs
// to know where the fare is being counted from.
function oprireaDeAici() {
  if (!zona) return null;
  const nod = nodulZoneiDeZbor(zona.id);
  return nod || null;
}


// ----------------------------------------------------------
//  The flight master
// ----------------------------------------------------------
let zborDeschis = false;

function deschideZborul(n) {
  if (!cutiaFerestrei) faFereastra();
  zborDeschis = true;
  npcDeschis = n;
  cutiaFerestrei.classList.remove('ascuns');
  scrieZborul();
}

function scrieZborul() {
  const aici = oprireaDeAici();
  document.getElementById('titlu3d').textContent =
    (TEXT.FLIGHT_TITLE || 'Flight paths') + '  ·  ' + baniText(personaj.bani || 0);

  let html = '';
  if (mesaj3d) html += '<p class="mesaj">' + mesaj3d + '</p>';

  const unde = undePotiZbura(personaj, aici ? aici.id : null);
  if (!unde.length) {
    html += '<p class="gol">' + (TEXT.FLIGHT_NONE ||
            'You have walked to no other stop yet. Find them on foot first.') + '</p>';
  }

  html += '<div class="lista">';
  unde.forEach(function (u) {
    const potiPlati = (personaj.bani || 0) >= u.cost;
    html += '<div class="rand zbor' + (potiPlati ? ' poti' : '') +
            '" data-zbor="' + u.nod.id + '">' +
              '<div class="text">' + u.nod.nume +
                '<span class="mic-zona"> · ' + (u.nod.numeZona || '') + '</span></div>' +
              '<div class="pret">' + baniHtml(u.cost) + '</div>' +
            '</div>';
  });
  html += '</div>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;
  corp.querySelectorAll('[data-zbor]').forEach(function (el) {
    el.addEventListener('click', function () { zboaraLa(el.dataset.zbor); });
  });
}

function zboaraLa(idNod) {
  const aici = oprireaDeAici();
  const nod = gasesteNodulDeZbor(idNod);
  if (!nod) return;

  const cost = costulZborului(aici, nod);
  if (!dauBani(personaj, cost)) {
    mesaj3d = TEXT.NOT_ENOUGH || 'Not enough money';
    scrieZborul();
    return;
  }

  inchideFerestrele();
  coboriLaOprirea3d = nod.loc;      // where in the new zone to land
  intraInZona(nod.zona, null, null);
}


// Set just before entering a zone by air; read once on arrival.
let coboriLaOprirea3d = null;

function undeCoboriDinZbor() {
  const oprirea = coboriLaOprirea3d;
  coboriLaOprirea3d = null;
  if (!oprirea || !zona) return null;

  const loc = (zona.locuri || []).find(function (l) { return l.id === oprirea; });
  if (!loc) return null;

  const inima = loc.inima || loc;
  return { col: inima.col, rand: inima.rand + 4 };
}


// ----------------------------------------------------------
//  The innkeeper and the hearthstone
// ----------------------------------------------------------
function legPiatra3d(n) {
  // Which landmark this inn belongs to: the nearest one.
  let celMaiAproape = null, ceaMaiMica = Infinity;
  (zona.locuri || []).forEach(function (loc) {
    const inima = loc.inima || loc;
    const d = Math.hypot(inima.col - n.col, inima.rand - n.rand);
    if (d < ceaMaiMica) { ceaMaiMica = d; celMaiAproape = loc; }
  });

  const numeLoc = celMaiAproape ? (celMaiAproape.nume || zona.nume) : zona.nume;
  legPiatraDe(personaj, zona.id, celMaiAproape ? celMaiAproape.id : null, numeLoc);

  // You are given the stone itself the first time you bind.
  if (!aiPiatraDeIntoarcere(personaj) && maiEsteLocInRucsac(personaj)) {
    pomeneInRucsac(personaj, faPiatraDeIntoarcere());
  }

  mesaj3d = (TEXT.HEARTH_BOUND || 'Your stone is bound to {p}').replace('{p}', numeLoc);
  scrieNpc();
}


function folosestePiatra3d(o) {
  const acasa = personaj.acasa;
  if (!acasa) return { gresit: TEXT.HEARTH_UNBOUND || 'Your stone is not bound anywhere' };

  const acum = Date.now();
  if ((personaj.piatraGataLa || 0) > acum) {
    const min = Math.ceil((personaj.piatraGataLa - acum) / 60000);
    return { gresit: (TEXT.HEARTH_SOON || 'Ready in {n} minutes').replace('{n}', min) };
  }
  if (typeof mortPanaLa !== 'undefined' && mortPanaLa) {
    return { gresit: TEXT.NOT_NOW || 'Not now' };
  }

  personaj.piatraGataLa = acum + PAUZA_PIATRA;
  coboriLaOprirea3d = acasa.loc;
  inchideFerestrele();
  intraInZona(acasa.zona, null, null);
  return { bun: true };
}


// ----------------------------------------------------------
//  Riding
// ----------------------------------------------------------
let caliaresti = false;

function urciSauCobori3d(o) {
  if (caliaresti) { caliaresti = false; spuneCeva(TEXT.DISMOUNT || 'You get down'); return { bun: true }; }

  // Not in a fight, and not while something is angry at you.
  const inLupta = (zona.mobi || []).some(function (m) { return m.suparat; });
  if (inLupta) return { gresit: TEXT.NOT_IN_COMBAT || 'Not in combat' };

  caliaresti = true;
  spuneCeva(o.nume);
  return { bun: true };
}

// How fast you walk. Called by prototip.js instead of the bare
// constant, so a horse actually carries you faster.
function vitezaTa3d() {
  if (!caliaresti || !personaj) return VITEZA;
  const cal = celMaiBunCal(personaj);
  return VITEZA * (cal ? cal.spor : 1);
}

// Getting hit knocks you off, as it should.
function teDaJosDeCal() {
  if (!caliaresti) return;
  caliaresti = false;
  spuneCeva(TEXT.KNOCKED_OFF || 'You are knocked from the saddle');
}


// ----------------------------------------------------------
//  Using a thing from your bag
//
//  The same shapes the 2D game knows: a stone, a mount, a recipe
//  sheet, or something to eat or drink.
// ----------------------------------------------------------
let bandajPanaLa3d = 0;
const PAUZA_BANDAJULUI = 60000;

function folosesteDinRucsac(i) {
  const o = (personaj.inventar || [])[i];
  if (!o) return;

  let r = null;

  if (o.piatraAcasa)      r = folosestePiatra3d(o);
  else if (o.calarie)     r = urciSauCobori3d(o);
  else if (o.retetaDe)    r = invataFoaia3d(o);
  else if (o.consumabil)  r = inghiteObiectul(o);
  else return;                                  // nothing to use

  if (r && r.gresit) { spuneCeva(r.gresit); return; }
  if (!r || !r.bun) return;

  // A stone and a horse are kept; everything else is used up.
  if (!o.piatraAcasa && !o.calarie) {
    o.cate = (o.cate || 1) - 1;
    if (o.cate <= 0) personaj.inventar.splice(i, 1);
  }
  if (typeof scrieFereastra === 'function') scrieFereastra();
}


function invataFoaia3d(o) {
  if (stiiReteta(personaj, o.retetaDe)) {
    return { gresit: TEXT.ALREADY_KNOWN || 'You know this already' };
  }
  const r = gasesteReteta(o.retetaDe);
  if (!r || !aiMeseria(personaj, r.meserie)) {
    return { gresit: TEXT.NOT_FOR_YOU || 'Not for you' };
  }
  invataReteta(personaj, o.retetaDe, true);
  spuneCeva(r.nume);
  return { bun: true };
}


function inghiteObiectul(o) {
  const ce = o.consumabil;
  const acum = performance.now();

  if (ce.efect === 'alinare') {
    if (acum < bandajPanaLa3d) {
      return { gresit: (TEXT.BANDAGE_SOON || 'Wait {n} seconds')
                 .replace('{n}', Math.ceil((bandajPanaLa3d - acum) / 1000)) };
    }
    bandajPanaLa3d = acum + PAUZA_BANDAJULUI;
    lucruriCareTin.push({
      fel: 'alinare', ab: ce, peTic: ce.peTura || 0,
      laCat: ce.laCat || 2000, urmatorul: acum + (ce.laCat || 2000),
      pana: acum + (ce.tine || 0)
    });
    spuneCeva(o.nume);
    return { bun: true };
  }

  if (ce.efect === 'vindecare') {
    if (personaj.viata >= personaj.viataMaxima) return { gresit: TEXT.ALREADY_FULL || 'Already full' };
    personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + ce.cat);
    spuneCeva('+' + ce.cat);
    return { bun: true };
  }

  if (ce.efect === 'mana') {
    if (personaj.resursa !== RESURSA_MANA) return { gresit: TEXT.NOT_FOR_YOU || 'Not for you' };
    if (personaj.mana >= personaj.manaMaxima) return { gresit: TEXT.ALREADY_FULL || 'Already full' };
    personaj.mana = Math.min(personaj.manaMaxima, personaj.mana + ce.cat);
    spuneCeva('+' + ce.cat + ' mana');
    return { bun: true };
  }

  return { gresit: TEXT.NOT_FOR_YOU || 'Nothing happens' };
}


// ----------------------------------------------------------
//  The two abilities that make food, and the one that travels
// ----------------------------------------------------------
function faceMancare3d(ab) {
  const cate = ab.cate || 1;
  let puse = 0;
  for (let i = 0; i < cate; i++) {
    if (!maiEsteLocInRucsac(personaj)) break;
    if (pomeneInRucsac(personaj, faConsumabil(ab.face))) puse++;
  }
  if (!puse) { spuneCeva(TEXT.BAG_FULL || 'Your bag is full'); return; }
  spuneCeva('+' + puse + ' ' + ab.face.nume);
}


// Long Step: the mage's own road to a capital. Only to a city you
// have already found, so it is not a way of skipping the world.
function teleporteazaTe(ab) {
  const orase = noduriDeZbor().filter(function (n) {
    return n.esteOras && aiDescoperitZborul(personaj, n.id) && n.zona !== zona.id;
  });
  if (!orase.length) { spuneCeva(TEXT.NO_CITY_FOUND || 'You have found no other city yet'); return; }

  coboriLaOprirea3d = null;
  inchideFerestrele();
  intraInZona(orase[0].zona, null, null);
}


// Once a frame.
function actualizeazaDrumurile() {
  descoperaOpririle();
}
