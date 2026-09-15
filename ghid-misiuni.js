// Busola misiunilor indica o directie, fara sa miste personajul.
// Folosim harta deja construita; nu construim alte zone in bucla jocului.
//
// TOT CE E AICI SOCOTESTE IN CASUTE, nu in pixeli. Fisierul e folosit
// si de jocul 2D (unde o casuta are 32 de pixeli) si de lumea 3D
// (unde o casuta e o casuta), asa ca masura comuna e casuta, iar
// fiecare joc inmulteste cu ce are nevoie la el acasa. viiInZona()
// si casutaTa() sunt scrise de doua ori, o data in game.js si o data
// in 3d/busola3d.js, si amandoua raspund in casute.
function misiuneaPentruGhid(p) {
  if (!p) return null;
  const ale = Object.keys(p.misiuni || {}).filter(function (id) {
    return ['activa', 'gata'].includes(starea(p, id));
  });
  if (!ale.includes(p.misiuneUrmarita)) p.misiuneUrmarita = ale[0] || null;
  return p.misiuneUrmarita ? gasesteMisiunea(p.misiuneUrmarita) : null;
}

function veciniiPentruGhid(id) {
  const reteta = retetaZonei(id);
  if (!reteta) return [];
  const vecini = undePotiMerge(id).map(function (d) { return d.catre; });
  ZONE.forEach(function (z) {
    if (z.intrareDin && z.intrareDin.zona === id) vecini.push(z.id);
  });
  if (reteta.intrareDin) vecini.push(reteta.intrareDin.zona);
  return Array.from(new Set(vecini));
}

function primulDrumPentruGhid(deLa, destinatii) {
  const cautate = new Set(destinatii);
  const coada = [{ id: deLa, prima: null }];
  const vazute = new Set([deLa]);
  for (let i = 0; i < coada.length; i++) {
    const pas = coada[i];
    if (cautate.has(pas.id)) return pas;
    veciniiPentruGhid(pas.id).forEach(function (id) {
      if (vazute.has(id)) return;
      vazute.add(id);
      coada.push({ id: id, prima: pas.prima || id });
    });
  }
  return null;
}

function celMaiApropiatPunctDeGhid(puncte, pozitie) {
  let ales = null, distanta = Infinity;
  puncte.forEach(function (punct) {
    const d = Math.hypot(punct.x - pozitie.x, punct.y - pozitie.y);
    if (d < distanta) { ales = punct; distanta = d; }
  });
  return ales;
}

// Ce e viu in zona chiar acum, in casute. Daca jocul nu raspunde,
// mergem dupa ce scrie in tabelul zonei - adica dupa unde STAU
// lucrurile, nu unde s-au mutat intre timp. E mai putin exact, dar
// nu greseste directia.
function viiPentruGhid(z) {
  if (z === zona && typeof viiInZona === 'function') return viiInZona();
  return { npci: [], mobi: new Map(), saci: [] };
}

function punctulMisiuniiInZona(m, p, z, pozitie, acum) {
  const inCasute = function (loc) { return { x: loc.col, y: loc.rand }; };
  const acumVii = viiPentruGhid(z);

  if (starea(p, m.id) === 'gata') {
    const vii = acumVii.npci.filter(function (npc) { return npc.felul === m.dator; });
    const puncte = vii.length ? vii.map(function (npc) { return { x: npc.x, y: npc.y }; }) :
      (z.npci || []).filter(function (loc) { return loc.fel === m.dator; }).map(inCasute);
    return celMaiApropiatPunctDeGhid(puncte, pozitie);
  }
  const c = m.cerinta;
  if (c.fel === 'mergi') {
    const idLoc = c.loc.includes(':') ? c.loc.slice(c.loc.indexOf(':') + 1) : c.loc;
    const loc = (z.locuri || []).find(function (l) { return l.id === idLoc; });
    return loc ? inCasute(loc) : null;
  }
  if (c.fel === 'aduna') {
    const prada = acumVii.saci.filter(function (s) {
      return (s.prada.obiecteMisiune || []).some(function (q) { return q.idMisiune === m.id; });
    });
    const deLuat = celMaiApropiatPunctDeGhid(prada, pozitie);
    if (deLuat) return { x: deLuat.x, y: deLuat.y };
  }
  const vii = acumVii.mobi;
  const puncte = (z.mobi || []).filter(function (loc) {
    if (loc.mortInInstanta || loc.fel !== c.mob || (c.numeSef && loc.nume !== c.numeSef)) return false;
    if (loc.mortPanaLa && acum < loc.mortPanaLa) return false;
    const viu = vii.get(loc);
    return !viu || viu.viu;
  }).map(function (loc) {
    const viu = vii.get(loc);
    return viu ? { x: viu.x, y: viu.y } : inCasute(loc);
  });
  return celMaiApropiatPunctDeGhid(puncte, pozitie);
}

function destinatiileMisiunii(m, p, z) {
  const gata = starea(p, m.id) === 'gata';
  if (!gata && m.cerinta.fel === 'mergi' && m.cerinta.loc.includes(':')) return [m.cerinta.loc.split(':')[0]];
  if (!gata && m.cereTemnita) return [m.cereTemnita];
  if (!m.oriunde) return ZONE.filter(function (r) { return r.nume === m.zona; }).map(function (r) { return r.id; });
  if (gata) return ZONE.filter(function (r) {
    return (!r.factiune || r.factiune === p.factiune) && (r.npci || []).some(function (n) { return n.fel === m.dator; });
  }).map(function (r) { return r.id; });
  // Misiunile de clasa permit acelasi fel de inamic in mai multe
  // zone. Alegem zona apropiata in care nivelul este potrivit.
  if ((z.mobi || []).some(function (loc) { return loc.fel === m.cerinta.mob; })) return [z.id];
  return ZONE.filter(function (r) {
    return !r.esteTemnita && !r.esteRaid && !r.esteOras && r.nivelDeLa <= p.nivel &&
      r.feluriPeNivel && r.feluriPeNivel(p.nivel).includes(m.cerinta.mob);
  }).map(function (r) { return r.id; });
}

function tintaPentruGhid(m, p, z, pozitie, acum) {
  if (!m || !z || !pozitie) return null;
  const traseu = primulDrumPentruGhid(z.id, destinatiileMisiunii(m, p, z));
  if (!traseu) return null;
  if (!traseu.prima) return punctulMisiuniiInZona(m, p, z, pozitie, acum);
  const iesiri = (z.treceri || []).filter(function (tr) { return tr.catre === traseu.prima; });
  if (z.portul && z.portul.catre === traseu.prima) iesiri.push(z.portul);
  return celMaiApropiatPunctDeGhid(iesiri.map(function (tr) {
    return { x: tr.col, y: tr.rand };
  }), pozitie);
}

function faSageataMisiunii(scena) {
  // Varful este orientat spre dreapta; rotatia il indreapta spre tinta.
  const s = scena.add.graphics().setDepth(45).setVisible(false);
  s.fillStyle(0xffd34d, 1);
  s.lineStyle(2, 0x33250b, 1);
  s.beginPath();
  s.moveTo(9, 0); s.lineTo(-6, -6); s.lineTo(-3, 0); s.lineTo(-6, 6); s.closePath();
  s.fillPath(); s.strokePath();
  scena.sageataMisiunii = s;
  scena.tintaSagetiiMisiunii = null;
  scena.urmatoareaCautareMisiune = 0;
}

function actualizeazaSageataMisiunii(scena) {
  const s = scena.sageataMisiunii;
  if (!s) return;
  const m = misiuneaPentruGhid(personaj);
  if (!m || mort || treceInCurs) { s.setVisible(false); return; }
  const stare = starea(personaj, m.id);
  const schimbata = scena.misiuneSageata !== m.id || scena.stareMisiuneSageata !== stare;
  if (schimbata || scena.time.now >= scena.urmatoareaCautareMisiune) {
    // tintaPentruGhid socoteste in casute; sageata, in pixeli.
    const eu = casutaTa();
    const gasit = eu ? tintaPentruGhid(m, personaj, zona, { x: eu.c, y: eu.r }, scena.time.now) : null;
    scena.tintaSagetiiMisiunii = gasit
      ? { x: (gasit.x + 0.5) * TILE, y: (gasit.y + 0.5) * TILE } : null;
    scena.misiuneSageata = m.id;
    scena.stareMisiuneSageata = stare;
    scena.urmatoareaCautareMisiune = scena.time.now + 200;
  }
  const tinta = scena.tintaSagetiiMisiunii;
  if (!tinta) { s.setVisible(false); return; }
  const dx = tinta.x - jucator.x, dy = tinta.y - jucator.y;
  const distanta = Math.hypot(dx, dy);
  if (distanta < 18) { s.setVisible(false); return; }
  const unghi = Math.atan2(dy, dx);
  const raza = Math.min(48, distanta - 10);
  s.setPosition(jucator.x + Math.cos(unghi) * raza, jucator.y + Math.sin(unghi) * raza)
    .setRotation(unghi).setVisible(true);
}
