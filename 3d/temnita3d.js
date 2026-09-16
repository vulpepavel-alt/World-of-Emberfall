// ==========================================================
//  WHAT THE THINGS IN A DUNGEON DO
//
//  Nine instances, thirty-six bosses and an eight-boss raid have
//  been written down in intalniri-instante.js all along - which
//  ability each one uses, how hard, how often, how long it takes to
//  wind up - and NOTHING IN THE 3D WORLD HAS EVER READ ANY OF IT.
//  Every boss in every dungeon simply walked up and hit you with a
//  sword, exactly like a field rat with more health.
//
//  Not one number is invented here. The whole table comes out of
//  intalniri-instante.js, which has already run by the time this
//  file loads and has already hung a 'comportament' on every boss
//  and on the ordinary things between them. This file only does what
//  that table says, in three dimensions.
//
//  THE SIX THINGS THEY DO
//
//    con           a wedge in front of it. Walk out of the wedge.
//    lovituraSol   a circle at YOUR feet. Walk off the circle.
//    inel          a ring - safe in the middle, safe outside, hurt
//                  in the band. Walk IN, not out.
//    zonaSol       a pool that stays on the floor and burns while
//                  you stand in it.
//    aruncator     a bolt from across the room. Nowhere to stand.
//    chemare       it calls for help.
//    vindecator    it mends itself.
//
//  WHY THE WIND-UP MATTERS: every one of them draws its shape on the
//  floor first and only lands when the wind-up runs out. That is the
//  whole game of a dungeon - the floor tells you where not to be,
//  and you have a second and a half to be somewhere else.
//
//  And the wind-up is a CAST, so the interrupt in your bar finally
//  has something to interrupt. Until this file there was nothing in
//  the world that prepared anything.
// ==========================================================


// Ranges in the table are the 2D game's pixels, at 32 to a tile.
const PIXELI_PE_CASUTA_TEMNITA = 32;

function inCasuteTemnita(pixeli) {
  return (pixeli || 0) / PIXELI_PE_CASUTA_TEMNITA;
}

const CULOAREA_PERICOLULUI = 0xff5b46;   // anything that lands on the floor
const CULOAREA_ALTORA      = 0xffc967;   // bolts, calls, mending
const CULOAREA_VINDECARII  = 0x65da92;

const pericoleDeFata = [];     // pools still burning on the floor


// ----------------------------------------------------------
//  Drawing the warning on the floor
//
//  Flat shapes laid just over the ground, see-through, so you can
//  see what is under them. A wedge, a disc or a ring, built from
//  Three.js's own geometry - there is no picture anywhere in this.
// ----------------------------------------------------------
function faSemnulPericolului(c, x, z, unghi, culoare) {
  const raza = inCasuteTemnita(c.raza);
  let geometrie;

  if (c.fel === 'con') {
    // A wedge: a circle sector, turned to point at whoever it is for.
    geometrie = new THREE.CircleGeometry(raza, 24, -c.unghi / 2, c.unghi);
  } else if (c.fel === 'inel') {
    geometrie = new THREE.RingGeometry(inCasuteTemnita(c.razaInterioara), raza, 28);
  } else {
    geometrie = new THREE.CircleGeometry(raza, 24);
  }

  const semn = new THREE.Mesh(geometrie, new THREE.MeshBasicMaterial({
    color: culoare, transparent: true, opacity: 0.30,
    side: THREE.DoubleSide, depthWrite: false
  }));

  semn.rotation.x = -Math.PI / 2;
  // A circle sector is drawn with its 0 angle along +x; turning it by
  // -unghi about the up axis points it along the world direction we
  // want. (rotation.z, because the mesh has already been laid flat.)
  if (c.fel === 'con') semn.rotation.z = -unghi;

  semn.position.set(x, inaltimeaSolului(Math.round(x), Math.round(z)) + 0.05, z);
  semn.renderOrder = 3;
  lumea.add(semn);
  return semn;
}


// ----------------------------------------------------------
//  Who is standing in it
// ----------------------------------------------------------
function totiCeiLoviti() {
  const lista = [jucator];
  if (typeof tovarasii !== 'undefined') {
    tovarasii.forEach(function (t) { if (t.viata > 0) lista.push(t); });
  }
  if (typeof animalulDesenat !== 'undefined' && animalulDesenat) lista.push(animalulDesenat);
  return lista;
}


// Is this point inside the shape? The three shapes are three
// different questions, and getting them right is the whole
// difference between a dungeon you can learn and one that is unfair.
function estiInPericol(c, centru, unghi, p) {
  const dx = p.x - centru.x, dz = p.y - centru.z;
  const cat = Math.hypot(dx, dz);
  const raza = inCasuteTemnita(c.raza);

  if (c.fel === 'inel') {
    // Safe in the middle AND safe outside. Only the band hurts.
    return cat >= inCasuteTemnita(c.razaInterioara) && cat <= raza;
  }

  if (cat > raza) return false;

  if (c.fel === 'con') {
    // Inside the wedge, measured as the angle between "where it is
    // pointing" and "where you are".
    if (cat < 0.2) return true;
    let diferenta = Math.atan2(dz, dx) - unghi;
    while (diferenta >  Math.PI) diferenta -= Math.PI * 2;
    while (diferenta < -Math.PI) diferenta += Math.PI * 2;
    return Math.abs(diferenta) <= c.unghi / 2;
  }

  return true;
}


// ----------------------------------------------------------
//  Landing a blow from a dungeon mechanic
//
//  It goes through the ordinary way of being hit - mobLoveste() -
//  so armour, shields, dodging and every other rule still applies.
//  A mechanic that had its own private damage would drift out of
//  step with everything else in a week.
// ----------------------------------------------------------
function loveaPericolul(m, c, cine, acum) {
  const putere = putereaMecanicii(m, c);

  // The blow is the monster's own swing, multiplied by the strength
  // the table gives that mechanic.
  const inainte = m.dmgMin, inainteMax = m.dmgMax;
  m.dmgMin = Math.round(m.dmgMin * putere);
  m.dmgMax = Math.round(m.dmgMax * putere);
  // It swings out of turn here, so its ordinary swing timer is put
  // back afterwards - otherwise a mechanic would also eat the blow
  // it was going to throw anyway.
  const candAvea = m.urmatoareaLovitura;
  mobLoveste(m, cine, acum);
  m.urmatoareaLovitura = candAvea;
  m.dmgMin = inainte;
  m.dmgMax = inainteMax;
}


// Below the anger threshold it hits harder - the table's own
// pragFurie and sporFurie.
function putereaMecanicii(m, c) {
  const cmp = m.comportament;
  let putere = c.putere || 1;
  if (cmp && cmp.pragFurie && (m.viata / m.viataMaxima) <= cmp.pragFurie) {
    putere *= (cmp.sporFurie || 1);
  }
  return putere;
}


// ----------------------------------------------------------
//  Starting one
// ----------------------------------------------------------
function incepePregatirea3d(m, c, acum) {
  const pe = (typeof tintaMobului === 'function') ? tintaMobului(m) : jucator;
  const undeE = pozitiaCelui(pe);
  if (!undeE) return;

  // A wedge and a bolt come FROM the monster; a slam and a pool land
  // where its target is standing RIGHT NOW and stay there, which is
  // what makes them dodgeable at all.
  const dinTinta = (c.fel === 'lovituraSol' || c.fel === 'zonaSol');
  const centru = dinTinta ? { x: undeE.x, z: undeE.y } : { x: m.x, z: m.z };
  const unghi = Math.atan2(undeE.y - m.z, undeE.x - m.x);

  const culoare = (c.fel === 'vindecator') ? CULOAREA_VINDECARII
                : (c.fel === 'con' || c.fel === 'inel' ||
                   c.fel === 'lovituraSol' || c.fel === 'zonaSol')
                  ? CULOAREA_PERICOLULUI : CULOAREA_ALTORA;

  const areSemn = ['con', 'inel', 'lovituraSol', 'zonaSol'].indexOf(c.fel) >= 0;

  m.pregatirea3d = {
    c: c, centru: centru, unghi: unghi,
    pana: acum + (c.pregatire || 1500),
    semn: areSemn ? faSemnulPericolului(c, centru.x, centru.z, unghi, culoare) : null
  };

  // THIS IS A CAST. Now the interrupt in your action bar has
  // something to stop - see intrerupeTinta() in abilitati3d.js.
  m.incantare = { nume: TEXT[c.text] || c.text, pana: m.pregatirea3d.pana };

  cifraPeMob(m, TEXT[c.text] || c.text, '#ffe184', false);
}


function anuleazaPregatirea3d(m) {
  if (!m.pregatirea3d) return;
  if (m.pregatirea3d.semn) lumea.remove(m.pregatirea3d.semn);
  m.pregatirea3d = null;
  m.incantare = null;
}


// ----------------------------------------------------------
//  Finishing one
// ----------------------------------------------------------
function terminaPregatirea3d(m, acum) {
  const p = m.pregatirea3d;
  const c = p.c;

  if (p.semn) lumea.remove(p.semn);
  m.pregatirea3d = null;
  m.incantare = null;
  m.urmatoareaMecanica = acum + (c.pauza || 6000);

  if (c.fel === 'vindecator') {
    const cat = Math.round(m.viataMaxima * (c.parteVindecata || 0.1));
    m.viata = Math.min(m.viataMaxima, m.viata + cat);
    cifraPeMob(m, '+' + cat, '#65da92', false);
    return;
  }

  if (c.fel === 'chemare') {
    cheamaAjutoare3d(m, c, acum);
    return;
  }

  if (c.fel === 'aruncator') {
    // Nowhere to stand: it simply throws at whoever it is on.
    const pe = (typeof tintaMobului === 'function') ? tintaMobului(m) : jucator;
    if (pe) loveaPericolul(m, c, pe, acum);
    return;
  }

  // Everything else is a shape on the floor: whoever is standing in
  // it when it lands takes it, and whoever walked out does not.
  totiCeiLoviti().forEach(function (cine) {
    const unde = pozitiaCelui(cine);
    if (unde && estiInPericol(c, p.centru, p.unghi, unde)) {
      loveaPericolul(m, c, cine, acum);
    }
  });

  // A pool stays on the floor and keeps burning.
  if (c.fel === 'zonaSol') {
    pericoleDeFata.push({
      m: m, c: c, centru: p.centru, unghi: p.unghi,
      pana: acum + (c.durata || 5000), urmatorul: acum + 1000,
      semn: faSemnulPericolului(c, p.centru.x, p.centru.z, p.unghi, CULOAREA_PERICOLULUI)
    });
  }
}


// ----------------------------------------------------------
//  Calling for help
//
//  The adds are real monsters of the kind the table names, built the
//  same way every other monster in the zone is, and dropped into
//  zona.mobi so that everything else - threat, loot, the health bar
//  over their head - simply works on them.
// ----------------------------------------------------------
function cheamaAjutoare3d(m, c, acum) {
  if (!zona) return;
  const cati = c.cati || 2;

  for (let i = 0; i < cati; i++) {
    const unghi = (i / cati) * Math.PI * 2 + Math.random();
    const cat = 2 + Math.random() * 2;
    const x = Math.round(m.x + Math.cos(unghi) * cat);
    const z = Math.round(m.z + Math.sin(unghi) * cat);
    if (esteBlocat(x, z)) continue;

    const ajutor = {
      fel: c.invoca, col: x, rand: z,
      nivel: Math.max(1, m.nivel - 1), rang: 'normal',
      chemat: true
    };
    trezesteMobul(ajutor);
    ajutor.suparat = true;
    zona.mobi.push(ajutor);
    if (typeof adaugaAmenintare === 'function') adaugaAmenintare(ajutor, jucator, 1);
  }

  cifraPeMob(m, TEXT[c.text] || c.text, '#ffc967', false);
  actualizeazaFapturile();
}


// ----------------------------------------------------------
//  Once a frame
// ----------------------------------------------------------
function actualizeazaTemnita3d(delta, acum) {
  if (!zona) return;

  // ---- pools already on the floor ----
  for (let i = pericoleDeFata.length - 1; i >= 0; i--) {
    const p = pericoleDeFata[i];
    if (acum >= p.pana) {
      lumea.remove(p.semn);
      pericoleDeFata.splice(i, 1);
      continue;
    }
    if (acum < p.urmatorul) continue;
    p.urmatorul = acum + 1000;
    totiCeiLoviti().forEach(function (cine) {
      const unde = pozitiaCelui(cine);
      if (unde && estiInPericol(p.c, p.centru, p.unghi, unde)) {
        loveaPericolul(p.m, p.c, cine, acum);
      }
    });
  }

  // ---- and what the monsters themselves are winding up ----
  (zona.mobi || []).forEach(function (m) {
    if (!m.comportament || m.viataMaxima === undefined) return;

    // Dead, calmed down, frightened or frozen: whatever it was
    // preparing is dropped. A boss that goes on casting through its
    // own death is the sort of thing you only see once.
    if (esteMort(m) || !m.suparat || m.fricaPanaLa > acum || mobulEImpiedicat(m, acum)) {
      anuleazaPregatirea3d(m);
      return;
    }

    if (m.pregatirea3d) {
      if (acum >= m.pregatirea3d.pana) terminaPregatirea3d(m, acum);
      else if (m.pregatirea3d.semn) {
        // The warning breathes as the moment gets closer, so it is
        // read out of the corner of your eye.
        const ramas = (m.pregatirea3d.pana - acum) / (m.pregatirea3d.c.pregatire || 1500);
        m.pregatirea3d.semn.material.opacity = 0.22 + (1 - ramas) * 0.30;
      }
      return;
    }

    if (!m.urmatoareaMecanica) m.urmatoareaMecanica = acum + 2200;
    if (acum < m.urmatoareaMecanica) return;

    // Which one this time: round and round the list it was given.
    const ale = m.comportament.abilitati || [m.comportament];
    m.mecanicaAcum = ((m.mecanicaAcum === undefined) ? -1 : m.mecanicaAcum) + 1;
    const c = ale[m.mecanicaAcum % ale.length];

    // Nothing to do it to, or too far away to bother.
    const pe = (typeof tintaMobului === 'function') ? tintaMobului(m) : jucator;
    const undeE = pozitiaCelui(pe);
    if (!undeE) return;
    if (Math.hypot(undeE.x - m.x, undeE.y - m.z) > inCasuteTemnita(c.raza) + 3) return;

    incepePregatirea3d(m, c, acum);
  });
}


// Leaving the zone: nothing keeps burning behind you.
function uitaTemnita3d() {
  pericoleDeFata.forEach(function (p) { lumea.remove(p.semn); });
  pericoleDeFata.length = 0;
  if (!zona) return;
  (zona.mobi || []).forEach(anuleazaPregatirea3d);
}
