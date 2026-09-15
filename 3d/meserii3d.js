// ==========================================================
//  TRADES: GATHERING AND MAKING
//
//  Ore and herbs are already scattered across every zone - faZona()
//  placed them, on walkable ground, at levels that suit the zone.
//  They were simply not being drawn.
//
//  Everything about them is already written down in meserii.js:
//  which trade a node belongs to, what material it gives, how much,
//  the skill it needs, and the four thresholds that say whether it
//  is still worth a skill point. sansaDePunct() and adaugaSkill()
//  do the skilling up. deCeNuPotiCulege() says why you cannot.
//
//  retete.js knows every recipe, what it costs in materials, what it
//  makes, and which ones a trainer will teach you next.
//
//  K opens your trades. F gathers whatever you are standing next to.
// ==========================================================


const RAZA_CULESULUI = 2.6;
const DUREAZA_CULESUL_3D = 2600;     // milliseconds, same as the 2D game
const REVINE_NODUL = 180000;         // three minutes

// The four difficulty colours, the same ones the 2D game paints
// recipes and nodes with.
const CULORILE_GREUTATII = {
  portocaliu: '#ff8040',   // always a point
  galben:     '#ffd100',   // usually
  verde:      '#40bf40',   // sometimes
  gri:        '#9d9d9d'    // never again
};


// ----------------------------------------------------------
//  Drawing the nodes
// ----------------------------------------------------------
const noduriDeFata3d = new Map();

function esteGolNodul(loc, acum) {
  return !!loc.culesLa && (acum - loc.culesLa) < REVINE_NODUL;
}

function faNodul(loc) {
  const fel = NODURI[loc.fel];
  if (!fel) return;

  const grup = new THREE.Group();

  // Ore is a lump of rock; a herb is a tuft. Both are built from the
  // node's own colour, so a new node added to meserii.js needs
  // nothing written here.
  const eMinereu = fel.meserie === 'delving';
  const material = new THREE.MeshLambertMaterial({ color: fel.culoare });

  if (eMinereu) {
    const piatra = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.55), material);
    piatra.position.y = 0.21;
    piatra.rotation.y = amestecul(loc.col, loc.rand) * Math.PI;
    grup.add(piatra);
    const varf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.28), material);
    varf.position.set(0.1, 0.5, -0.06);
    grup.add(varf);
  } else {
    for (let i = 0; i < 4; i++) {
      const frunza = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.11), material);
      const u = (i / 4) * Math.PI * 2 + amestecul(loc.col, loc.rand) * 6;
      frunza.position.set(Math.cos(u) * 0.14, 0.22, Math.sin(u) * 0.14);
      frunza.rotation.z = Math.cos(u) * 0.35;
      frunza.rotation.x = Math.sin(u) * 0.35;
      grup.add(frunza);
    }
  }

  grup.inaltimeaLui = eMinereu ? 0.62 : 0.5;

  // The name, in the colour of how much it is still worth to you.
  const skill = aiMeseria(personaj, fel.meserie) ? skillulTau(personaj, fel.meserie) : 0;
  const cul = aiMeseria(personaj, fel.meserie)
    ? CULORILE_GREUTATII[culoareaGreutatii(fel.praguri, skill)]
    : '#9d9d9d';
  const scris = aiMeseria(personaj, fel.meserie)
    ? fel.material
    : fel.material + ' (' + MESERII[fel.meserie].nume + ')';

  grup.numeleScris = faEticheta(scris, cul, grup.inaltimeaLui + 0.35);
  grup.add(grup.numeleScris);

  grup.position.set(loc.col, inaltimeaSolului(loc.col, loc.rand), loc.rand);
  lumea.add(grup);
  noduriDeFata3d.set(loc, grup);
}

function uitaNodul(loc) {
  const g = noduriDeFata3d.get(loc);
  if (!g) return;
  lumea.remove(g);
  noduriDeFata3d.delete(loc);
}

function uitaToateNodurile() {
  noduriDeFata3d.forEach(function (g) { lumea.remove(g); });
  noduriDeFata3d.clear();
}

function actualizeazaNodurile(acum) {
  if (!zona || !personaj) return;

  const x = jucator.position.x, z = jucator.position.z;

  (zona.noduri || []).forEach(function (loc) {
    const aproape = Math.abs(loc.col - x) <= RAZA_FAPTURI && Math.abs(loc.rand - z) <= RAZA_FAPTURI;
    const gol = esteGolNodul(loc, acum);

    if (!aproape || gol) { uitaNodul(loc); return; }
    if (!noduriDeFata3d.has(loc)) faNodul(loc);
  });

  noduriDeFata3d.forEach(function (g) {
    const f = marimePeEcran(g.numeleScris);
    g.numeleScris.scale.set(g.numeleScris.latBaza * f, g.numeleScris.inaltBaza * f, 1);
  });
}


function nodulDeLangaTine() {
  if (!zona) return null;
  const x = jucator.position.x, z = jucator.position.z;
  const acum = performance.now();
  return (zona.noduri || []).find(function (loc) {
    return !esteGolNodul(loc, acum) &&
           Math.hypot(loc.col - x, loc.rand - z) <= RAZA_CULESULUI;
  }) || null;
}


// ----------------------------------------------------------
//  Gathering
//
//  It takes a couple of seconds and walking away stops it - the same
//  rule the 2D game uses, and the reason a node in the middle of a
//  camp is a decision and not just a pickup.
// ----------------------------------------------------------
let culesulInCurs3d = null;

function incepeCulesul3d(loc) {
  const motiv = deCeNuPotiCulege(loc);
  if (motiv) { spuneCeva(motiv); return; }
  if (!maiEsteLocInRucsac(personaj)) { spuneCeva(TEXT.BAG_FULL || 'Your bag is full'); return; }

  culesulInCurs3d = {
    loc: loc,
    dela: performance.now(),
    cat: DUREAZA_CULESUL_3D,
    unde: { x: jucator.position.x, z: jucator.position.z }
  };
}

function actualizeazaCulesul(acum) {
  if (!culesulInCurs3d) return;
  const c = culesulInCurs3d;

  if (Math.hypot(jucator.position.x - c.unde.x, jucator.position.z - c.unde.z) > 0.35) {
    culesulInCurs3d = null;
    spuneCeva(TEXT.GATHER_STOPPED || 'Stopped');
    return;
  }

  if (acum - c.dela < c.cat) return;

  culesulInCurs3d = null;
  terminaCulesul3d(c.loc, acum);
}

function terminaCulesul3d(loc, acum) {
  const fel = NODURI[loc.fel];
  if (!fel) return;

  const cate = intreDoua(fel.cat[0], fel.cat[1]);
  let puse = 0;
  for (let i = 0; i < cate; i++) {
    if (pomeneInRucsac(personaj, faMaterial(fel.material, fel.valoare))) puse++;
  }
  spuneCeva('+' + puse + ' ' + fel.material);

  // The skill goes up by the node's own colour - adaugaSkill() in
  // meserii.js decides, not us.
  if (adaugaSkill(personaj, fel.meserie, fel.praguri)) {
    aratacifra(jucator.position.x, jucator.position.y + 2.6, jucator.position.z,
               MESERII[fel.meserie].nume + ' ' + skillulTau(personaj, fel.meserie),
               '#ffd34d', false);
  }

  loc.culesLa = acum;
  uitaNodul(loc);
}


// ----------------------------------------------------------
//  The trades window
// ----------------------------------------------------------
let meseriiDeschise = false;
let meseriaAratata3d = null;
let mesajMeserii = '';

function deschideMeseriile() {
  if (!cutiaFerestrei) faFereastra();
  if (meseriiDeschise) { inchideFerestrele(); return; }

  inchideFerestrele();
  meseriiDeschise = true;
  mesajMeserii = '';
  cutiaFerestrei.classList.remove('ascuns');
  scrieMeseriile();
}

function scrieMeseriile() {
  if (!meseriiDeschise || !personaj) return;

  document.getElementById('titlu3d').textContent = TEXT.TRADES_TITLE || 'Trades';

  let html = '';
  if (mesajMeserii) html += '<p class="mesaj">' + mesajMeserii + '</p>';

  const ale = meseriileTale(personaj);
  if (!ale.length) {
    html += '<p class="gol">' + (TEXT.NO_TRADES ||
            'You have learnt no trade yet. Trainers in the towns teach them.') + '</p>';
  }

  ale.forEach(function (id) {
    const m = MESERII[id];
    const skill = skillulTau(personaj, id);
    const plafon = plafonulTau(personaj, id);
    html += '<div class="rand meserie' + (meseriaAratata3d === id ? ' aleasa' : '') +
            '" data-meserie="' + id + '">' +
              '<div class="text">' + m.nume + '</div>' +
              '<div class="pret">' + skill + ' / ' + plafon + '</div>' +
            '</div>';
  });

  // The recipes of whichever trade is open.
  if (meseriaAratata3d && aiMeseria(personaj, meseriaAratata3d)) {
    const skill = skillulTau(personaj, meseriaAratata3d);
    html += '<div class="lista retete">';
    let cate = 0;
    reteteleStiute(personaj, meseriaAratata3d).forEach(function (r) {
      const cul = CULORILE_GREUTATII[culoareaGreutatii(r.praguri, skill)];
      const poti = aiMaterialele(personaj, r);
      html += '<div class="rand reteta' + (poti ? ' poti' : '') + '" data-reteta="' + r.id + '">' +
                '<div class="text" style="color:' + cul + '">' + r.nume + '</div>' +
                '<div class="pret">' + costulRetetei(r) + '</div>' +
              '</div>';
      cate++;
    });
    if (!cate) html += '<p class="gol">No recipes yet.</p>';
    html += '</div>';
  }

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-meserie]').forEach(function (el) {
    el.addEventListener('click', function () {
      meseriaAratata3d = (meseriaAratata3d === el.dataset.meserie) ? null : el.dataset.meserie;
      scrieMeseriile();
    });
  });
  corp.querySelectorAll('[data-reteta]').forEach(function (el) {
    el.addEventListener('click', function () { faci3d(el.dataset.reteta); });
  });
}


// Some recipes need a place to work at: an anvil, a rune table, a
// cooking fire. Those are squares on the map - 'N', 'U' and 'F' -
// so the question is just whether one of them is close by.
const LITERA_STATIEI_3D = { 'Anvil': 'nicovala', 'Rune Table': 'masaRune', 'Cookfire': 'foc' };
const RAZA_STATIEI_3D = 3;

function estiLangaStatie3d(numeStatie) {
  if (!numeStatie) return true;                 // this one needs nowhere
  if (!zona || !zona.harta) return false;

  const litera = LITERE[LITERA_STATIEI_3D[numeStatie]];
  if (!litera) return false;

  const c0 = Math.round(jucator.position.x), r0 = Math.round(jucator.position.z);
  for (let r = r0 - RAZA_STATIEI_3D; r <= r0 + RAZA_STATIEI_3D; r++) {
    if (r < 0 || r >= zona.RND) continue;
    for (let c = c0 - RAZA_STATIEI_3D; c <= c0 + RAZA_STATIEI_3D; c++) {
      if (c < 0 || c >= zona.COL) continue;
      if (zona.harta[r][c] === litera) return true;
    }
  }
  return false;
}


function faci3d(idReteta) {
  const r = gasesteReteta(idReteta);
  if (!r) return;

  if (!aiMaterialele(personaj, r)) {
    mesajMeserii = TEXT.NEED_MATERIALS || 'You do not have the materials';
    scrieMeseriile(); return;
  }
  if (!estiLangaStatie3d(r.statie)) {
    mesajMeserii = (TEXT.NEED_STATION || 'You need to stand at a {s}').replace('{s}', r.statie);
    scrieMeseriile(); return;
  }
  if (!maiEsteLocInRucsac(personaj)) {
    mesajMeserii = TEXT.BAG_FULL || 'Your bag is full';
    scrieMeseriile(); return;
  }

  iaMaterialele(personaj, r);

  // What comes out, exactly as the 2D game builds it: a material, a
  // piece of equipment, or something to drink.
  const ce = r.face;
  if (ce.fel === 'material') {
    for (let k = 0; k < (ce.cate || 1); k++) {
      pomeneInRucsac(personaj, faMaterial(ce.nume, ce.valoare));
    }
  } else if (ce.fel === 'echipament') {
    pomeneInRucsac(personaj, faObiect(ce.slot, ce.nivel, ce.raritate));
  } else if (ce.fel === 'consumabil') {
    for (let k = 0; k < (ce.cate || 1); k++) {
      pomeneInRucsac(personaj, faConsumabil(ce));
    }
  }

  const crescut = adaugaSkill(personaj, r.meserie, r.praguri);
  mesajMeserii = (TEXT.MADE || 'Made') + ': ' + r.nume +
    (crescut ? '  \u00b7  ' + MESERII[r.meserie].nume + ' ' + skillulTau(personaj, r.meserie) : '');

  recalculeazaPersonajul3d();
  scrieMeseriile();
}


function uitaMeseriile() {
  culesulInCurs3d = null;
  meseriiDeschise = false;
  meseriaAratata3d = null;
  uitaToateNodurile();
}


window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  if (e.code === 'KeyK') deschideMeseriile();
});
