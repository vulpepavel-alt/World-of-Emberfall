// ==========================================================
//  THE PEOPLE YOU HIRE, AND WHO THE MONSTER DECIDES TO HIT
//
//  Two things that only make sense together.
//
//  A shield-bearer who cannot hold a monster off you is not a tank,
//  he is a second sword. Holding something off you means the monster
//  keeping a tally of who has hurt it and going for whoever is
//  highest - which is THREAT, and it has been written in
//  amenintare.js all along, used by the 2D game and by nothing in
//  here. Until now every monster in this world walked at YOU, always,
//  whatever anybody else did to it.
//
//  So this file does both: it gives the hirelings bodies and a life,
//  and it answers the four questions amenintare.js asks about the
//  world so that the same tally works here.
//
//  Nothing about WHO you may hire, what they cost, how many come
//  with you, or how strong they are is decided here. TOVARASI,
//  limiteleLocului(), potiAngaja(), tovarasiiDeFata() and
//  statsleTovarasului() are all in tovarasi.js, shared with the 2D
//  game, and their bodies are built out of the same 'forme' lists
//  every creature in this world is built from.
// ==========================================================


// ----------------------------------------------------------
//  The four answers amenintare.js needs
//
//  All in tiles. In this world that is simply where things are; the
//  2D game's copies, in game.js, divide by 32.
// ----------------------------------------------------------
function pozitiaCelui(cine) {
  if (!cine) return null;
  // You, the companion, and anything else with a 3D body.
  if (cine.position) return { x: cine.position.x, y: cine.position.z };
  // A monster, or one of the hired: plain x and z on the object.
  if (cine.x !== undefined && cine.z !== undefined) return { x: cine.x, y: cine.z };
  return null;
}

function mobiiCareSeBat() {
  if (!zona) return [];
  return (zona.mobi || []).filter(function (m) {
    return m.viataMaxima !== undefined && !esteMort(m) && m.suparat;
  });
}

function mobSeBate(mob) {
  return !!(mob && mob.viataMaxima !== undefined && !esteMort(mob) && mob.viata > 0);
}

function jucatorulEMort() {
  // A spirit counts as dead: nothing can see it and nothing can hit
  // it, which is the whole point of the walk back.
  return !!mortPanaLa || ((typeof estiDuh === 'function') && estiDuh());
}


// ----------------------------------------------------------
//  How they behave
//
//  The 2D numbers are in pixels at 32 to a tile; these are the same
//  distances in tiles.
// ----------------------------------------------------------
const RAZA_VEDERII_TOV   = 9.4;    // how far off it notices a fight
const RAZA_LOVIRII_TOV   = 2.2;    // close enough to swing
const RAZA_TRAGERII_TOV  = 6.9;    // the archer's reach
const RAZA_PROVOCARII    = 8.1;
const PAUZA_PROVOCARII   = 6000;
const VITEZA_TOV         = 4.8;    // tiles a second
const LANGA_TINE         = 2.2;    // how close behind you they walk
const LOVESTE_LA         = 2000;   // milliseconds between their swings


// The array itself lives in tovarasi.js, because amenintare.js looks
// in it to decide whether somebody is still worth hitting. The 2D
// game fills it with Phaser containers; this page fills it with
// these. Only one of the two ever runs.
function uitaTovarasii3d() {
  tovarasii.forEach(function (t) { if (t.grup) lumea.remove(t.grup); });
  tovarasii.length = 0;
}


// ----------------------------------------------------------
//  Calling in whoever fits where you are
//
//  You do not summon them. tovarasiiDeFata() says who comes along
//  HERE - one in the open world, three in a dungeon, five in a raid -
//  and this makes bodies for exactly those.
// ----------------------------------------------------------
function cheamaTovarasii3d() {
  if (!zona || !personaj) return;

  const vin = tovarasiiDeFata(personaj, zona);

  // Anybody already out who is no longer on the list goes home.
  for (let i = tovarasii.length - 1; i >= 0; i--) {
    const t = tovarasii[i];
    const ramane = vin.some(function (v) { return v.indice === t.indice; });
    if (!ramane) { lumea.remove(t.grup); tovarasii.splice(i, 1); }
  }

  vin.forEach(function (v) {
    if (tovarasii.some(function (t) { return t.indice === v.indice; })) return;

    const f = TOVARASI[v.fel];
    const st = statsleTovarasului(v.fel, personaj.nivel);

    const grup = fapturaDinForme(f.forme);
    grup.inaltimeaLui = inaltimeaFapturii(grup);
    grup.position.set(jucator.position.x, jucator.position.y, jucator.position.z + 1.6);

    grup.baraLui = faBaraDeViata(grup.inaltimeaLui + 0.22);
    grup.add(grup.baraLui);
    grup.numeleScris = faEticheta(f.nume, f.culoare, grup.inaltimeaLui + 0.5);
    grup.add(grup.numeleScris);
    lumea.add(grup);

    tovarasii.push({
      fel: v.fel, indice: v.indice, rol: f.rol, nume: f.nume,
      x: grup.position.x, z: grup.position.z,
      viata: st.viataMaxima, viataMaxima: st.viataMaxima,
      dmgMin: st.dmgMin, dmgMax: st.dmgMax, armura: st.armura,
      deLaDistanta: !!f.deLaDistanta,
      vindeca: f.vindeca || 0, pauzaVindecare: f.pauzaVindecare || 4200,
      grup: grup,
      urmatoareaLovitura: 0, urmatoareaVindecare: 0, urmatoareaProvocare: 0
    });
  });
}


// ----------------------------------------------------------
//  Who needs mending most
//
//  The medic looks at everybody in the party including itself, and
//  goes for whoever is lowest - but only below three quarters, so it
//  does not spend the whole fight topping up a scratch.
// ----------------------------------------------------------
function cineAreNevoieDeVindecare3d() {
  let ales = null, parteaCeaMaiMica = 0.75;

  const partea = personaj.viata / personaj.viataMaxima;
  if (partea < parteaCeaMaiMica) { ales = jucator; parteaCeaMaiMica = partea; }

  tovarasii.forEach(function (t) {
    if (t.viata <= 0) return;
    const p = t.viata / t.viataMaxima;
    if (p < parteaCeaMaiMica) { ales = t; parteaCeaMaiMica = p; }
  });

  return ales;
}


function vindecaCeva(t, cui, acum) {
  const cat = Math.round((cui === jucator ? personaj.viataMaxima : cui.viataMaxima) * t.vindeca);

  if (cui === jucator) {
    personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + cat);
    aratacifra(jucator.position.x, jucator.position.y + 2, jucator.position.z,
               '+' + cat, '#9ad8c8', false);
  } else {
    cui.viata = Math.min(cui.viataMaxima, cui.viata + cat);
    aratacifra(cui.x, cui.grup.position.y + 1.6, cui.z, '+' + cat, '#9ad8c8', false);
  }

  // Mending is noticed. Every monster in the fight feels a share of
  // it, which is exactly why a medic who over-heals gets eaten.
  amenintareDinVindecare(t, cat);
  t.urmatoareaVindecare = acum + t.pauzaVindecare;
}


// ----------------------------------------------------------
//  One of them, once a frame
// ----------------------------------------------------------
function miscaTovarasul(t, delta, acum) {

  if (t.viata <= 0) {
    // Down, not gone: face down on the floor until the fight ends.
    t.grup.rotation.z = Math.PI / 2;
    t.grup.visible = true;
    if (t.grup.baraLui) t.grup.baraLui.visible = false;
    if (t.grup.numeleScris) t.grup.numeleScris.visible = false;
    return;
  }
  t.grup.rotation.z = 0;
  if (t.grup.baraLui) t.grup.baraLui.visible = true;
  if (t.grup.numeleScris) t.grup.numeleScris.visible = true;

  // ---- the medic mends before anything else ----
  if (t.vindeca && acum >= t.urmatoareaVindecare) {
    const cui = cineAreNevoieDeVindecare3d();
    if (cui) {
      const p = pozitiaCelui(cui);
      if (p && Math.hypot(p.x - t.x, p.y - t.z) <= RAZA_TRAGERII_TOV) {
        vindecaCeva(t, cui, acum);
      }
    }
  }

  // ---- what it is fighting ----
  //
  // Whichever monster in the fight is nearest to it. Not whatever YOU
  // have picked: a hireling that only ever hits your target is no
  // help at all when three things are chewing on the medic.
  let spre = null, catPanaLaEl = Infinity;
  mobiiCareSeBat().forEach(function (m) {
    const cat = Math.hypot(m.x - t.x, m.z - t.z);
    if (cat < catPanaLaEl && cat <= RAZA_VEDERII_TOV) { catPanaLaEl = cat; spre = m; }
  });

  // ---- the shield-bearer's taunt ----
  //
  // Not damage and not a tally - it puts him over the top of whoever
  // is highest. He uses it on anything that has wandered off him, so
  // the medic stops being the most interesting person in the room.
  if (t.rol === 'tanc' && acum >= t.urmatoareaProvocare) {
    const ratacite = mobiiCareSeBat().filter(function (m) {
      if (m.tintaAleasa === t) return false;
      return Math.hypot(m.x - t.x, m.z - t.z) <= RAZA_PROVOCARII;
    });
    if (ratacite.length) {
      t.urmatoareaProvocare = acum + PAUZA_PROVOCARII;
      ratacite.forEach(function (m) { provoaca(m, t); });
      aratacifra(t.x, t.grup.position.y + 1.8, t.z, TEXT.TAUNT, '#ffd34d', false);
    }
  }

  // ---- walking ----
  const razaLui = t.deLaDistanta ? RAZA_TRAGERII_TOV : RAZA_LOVIRII_TOV;
  const tintaX = spre ? spre.x : jucator.position.x;
  const tintaZ = spre ? spre.z : jucator.position.z;
  const opreste = spre ? razaLui : LANGA_TINE;

  const dx = tintaX - t.x, dz = tintaZ - t.z;
  const cat = Math.hypot(dx, dz);

  if (cat > opreste) {
    const pas = Math.min(cat - opreste, VITEZA_TOV * delta);
    const nx = t.x + (dx / cat) * pas;
    const nz = t.z + (dz / cat) * pas;
    if (!esteBlocat(Math.round(nx), Math.round(t.z))) t.x = nx;
    if (!esteBlocat(Math.round(t.x), Math.round(nz))) t.z = nz;
  }

  // Left too far behind - through a wall, or because you rode off -
  // and they are simply put at your heel again.
  if (Math.hypot(t.x - jucator.position.x, t.z - jucator.position.z) > 30) {
    t.x = jucator.position.x;
    t.z = jucator.position.z + 1.6;
  }

  // ---- swinging ----
  if (spre && cat <= razaLui + 0.4 && acum >= t.urmatoareaLovitura) {
    t.urmatoareaLovitura = acum + LOVESTE_LA;
    const brut = intreDoua(t.dmgMin, t.dmgMax);
    daiDamage(spre, brut, false, acum, t);
  }

  // ---- and where all that puts its body ----
  t.grup.position.set(t.x, inaltimeaSolului(Math.round(t.x), Math.round(t.z)), t.z);
  t.grup.rotation.y = Math.atan2(tintaX - t.x, tintaZ - t.z);

  potrivesteBara(t.grup.baraLui, t.viata / t.viataMaxima);
  indreaptaBara(t.grup.baraLui, t.grup.rotation.y);
  const f = marimePeEcran(t.grup.baraLui);
  t.grup.baraLui.scale.set(f, f, 1);
  const fn = marimePeEcran(t.grup.numeleScris);
  t.grup.numeleScris.scale.set(t.grup.numeleScris.latBaza * fn,
                               t.grup.numeleScris.inaltBaza * fn, 1);
}


function actualizeazaTovarasii3d(delta, acum) {
  if (!zona || !personaj) return;
  tovarasii.forEach(function (t) { miscaTovarasul(t, delta, acum); });
}


// ----------------------------------------------------------
//  Taking a blow
// ----------------------------------------------------------
function mobLovesteTovarasul3d(m, t, acum) {
  m.urmatoareaLovitura = acum + m.vitezaLovirii;

  let brut = intreDoua(m.dmgMin, m.dmgMax) * damageMobului(m, acum);
  const cat = Math.max(1, Math.round(dupaArmura(brut, t.armura)));

  t.viata = Math.max(0, t.viata - cat);
  aratacifra(t.x, t.grup.position.y + 1.6, t.z, '-' + cat, '#f0a0a0', false);

  if (t.viata <= 0) {
    spuneCeva(t.nume + ' — ' + TEXT.HIRE_DOWN);
    // Whatever was on them has to go somewhere else now.
    mobiiCareSeBat().forEach(function (alt) {
      if (alt.tintaAleasa === t) alt.tintaAleasa = null;
    });
  }
}


// When the fight is over, the fallen get up. They are hired, not
// killed - you paid for them and they are still on the books.
function ridicaTovarasiiCazuti3d() {
  tovarasii.forEach(function (t) {
    if (t.viata <= 0) t.viata = Math.round(t.viataMaxima * 0.35);
  });
}


// ==========================================================
//  HIRING THEM
//
//  The window the hiring agent opens. Who may be hired, what it
//  costs and how many of each you may keep is decided by
//  potiAngaja() in tovarasi.js - this only shows the answer and
//  presses the button.
// ==========================================================
let angajareaDeschisa = false;

function scrieAngajarea3d() {
  const limite = limiteleLocului(zona);

  document.getElementById('titlu3d').textContent = TEXT.HIRE_TITLE;

  let html = '<p class="mic">' + TEXT.HIRE_HERE.replace('{n}', limite.total) + '</p>';
  if (mesaj3d) html += '<p class="mesaj">' + mesaj3d + '</p>';
  html += '<p class="cerinta"><b>' + TEXT.UI_MONEY + '</b> ' + baniText(personaj.bani || 0) + '</p>';

  // ---- who is already yours ----
  const ai = tovarasiiTai(personaj);
  if (ai.length) {
    html += '<div class="cutie"><h3>' + TEXT.HIRE_HIRED + '</h3>';
    ai.forEach(function (t, i) {
      const f = TOVARASI[t.fel];
      html += '<div class="rand"><div class="text"><span style="color:' + f.culoare + '">' +
              f.nume + '</span><br><span class="mic-zona">' + f.titlu + '</span></div>' +
              '<button class="pret inapoi" data-concediez="' + i + '">' +
              TEXT.HIRE_DISMISS + '</button></div>';
    });
    html += '</div>';
  }

  // ---- and who else there is ----
  html += '<div class="cutie"><h3>' + TEXT.HIRE_TITLE + '</h3>';
  Object.keys(TOVARASI).forEach(function (fel) {
    const f = TOVARASI[fel];
    const se = potiAngaja(personaj, fel);
    const motiv = se.poti ? ''
      : se.motiv === 'bani' ? TEXT.NOT_ENOUGH_GOLD
      : se.motiv === 'rol'  ? TEXT.HIRE_ROLE_FULL
      : TEXT.HIRE_FULL;

    html += '<div class="rand' + (se.poti ? '' : ' zbor') + '"' +
            (se.poti ? ' data-angajez="' + fel + '"' : '') + '>' +
              '<div class="text"><span style="color:' + f.culoare + '">' + f.nume +
              '</span><br><span class="mic-zona">' + f.titlu + '</span></div>' +
              '<div class="pret">' + (se.poti ? baniText(f.pret) : motiv) + '</div>' +
            '</div>';
  });
  html += '</div>';

  html += '<button class="lat inapoi" id="inapoi-angajare">Back</button>';

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-angajez]').forEach(function (el) {
    el.addEventListener('click', function () {
      const f = angajeaza(personaj, el.dataset.angajez);
      mesaj3d = f ? (TEXT.HIRE_HIRED + ': ' + f.nume) : (TEXT.NOT_ENOUGH || 'Not enough money');
      cheamaTovarasii3d();
      scrieNpc();
    });
  });

  corp.querySelectorAll('[data-concediez]').forEach(function (el) {
    el.addEventListener('click', function () {
      concediaza(personaj, Number(el.dataset.concediez));
      mesaj3d = '';
      cheamaTovarasii3d();
      scrieNpc();
    });
  });

  document.getElementById('inapoi-angajare').addEventListener('click', function () {
    angajareaDeschisa = false;
    mesaj3d = '';
    scrieNpc();
  });
}
