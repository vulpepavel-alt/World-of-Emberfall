// ==========================================================
//  CROSSING FROM ONE ZONE TO THE NEXT
//
//  Until now the only way out of a zone was the box in the top
//  corner, which is a menu, not a world. The 52 zones were 52
//  separate places rather than one map.
//
//  faZona() already cut the gates. Every zone carries a list -
//  zona.treceri - saying which square is a gate, which zone is on
//  the other side, and which way is inwards. City gates and dungeon
//  mouths are on that same list, so they all work the same way
//  without a single line about them here.
//
//  Two things have to be right, and both bit the 2D game first:
//
//  1. You must not arrive ON the gate. Arriving on it puts you
//     straight back where you came from, for ever. You arrive ten
//     squares inside.
//
//  2. Even ten squares in, walking backwards for a second would
//     take you through again. So a gate ignores you until you have
//     stepped off every gate once.
// ==========================================================


// How close to a gate counts as standing on it.
const RAZA_TRECERII = 2.2;

// How far inside the new zone you appear.
const CAT_INAUNTRU = 10;

let treceInCurs3d = false;
let abiaAmIntrat3d = false;

// Marks on the ground, so a gate can be seen before you fall through
// one. The 2D game has a signpost; this is the same idea.
const semneleTrecerilor = [];

function faSemneleTrecerilor() {
  stergeSemneleTrecerilor();
  if (!zona) return;

  (zona.treceri || []).forEach(function (tr) {
    const inel = new THREE.Mesh(
      new THREE.RingGeometry(1.1, RAZA_TRECERII, 20),
      new THREE.MeshBasicMaterial({ color: 0x9adcf8, transparent: true, opacity: 0.30,
                                    side: THREE.DoubleSide })
    );
    inel.rotation.x = -Math.PI / 2;
    inel.position.set(tr.col, inaltimeaSolului(tr.col, tr.rand) + 0.05, tr.rand);
    lumea.add(inel);

    const r = retetaZonei(tr.catre);
    const semn = faEticheta(r ? r.nume : tr.catre, '#bfe4ff', 1.6);
    semn.position.x = tr.col;
    semn.position.z = tr.rand;
    semn.position.y = inaltimeaSolului(tr.col, tr.rand) + 1.6;
    lumea.add(semn);

    semneleTrecerilor.push({ inel: inel, semn: semn, tr: tr });
  });

  if (zona.portul) {
    const p = zona.portul;
    const r = retetaZonei(p.catre);
    const semn = faEticheta((r ? r.nume : p.catre) + ' — by sea', '#bfe4ff', 1.6);
    semn.position.set(p.col, inaltimeaSolului(p.col, p.rand) + 1.6, p.rand);
    lumea.add(semn);
    semneleTrecerilor.push({ inel: null, semn: semn, tr: null });
  }
}

function stergeSemneleTrecerilor() {
  semneleTrecerilor.forEach(function (s) {
    if (s.inel) lumea.remove(s.inel);
    lumea.remove(s.semn);
  });
  semneleTrecerilor.length = 0;
}


// ----------------------------------------------------------
//  Once a frame: are you standing on a gate?
// ----------------------------------------------------------
function verificaTrecerea3d() {

  if (treceInCurs3d || !zona || !zona.treceri) return;

  const x = jucator.position.x, z = jucator.position.z;
  let peVreoPoarta = false;

  const toate = (zona.treceri || []).slice();
  if (zona.portul) toate.push(zona.portul);

  for (const tr of toate) {
    if (Math.hypot(tr.col - x, tr.rand - z) > RAZA_TRECERII) continue;

    peVreoPoarta = true;
    if (abiaAmIntrat3d) continue;

    treceInCurs3d = true;
    treciInZona3d(tr.catre, zona.id);
    return;
  }

  // Off every gate: they can take you again.
  if (abiaAmIntrat3d && !peVreoPoarta) abiaAmIntrat3d = false;

  // Keep the signs a steady size on screen.
  semneleTrecerilor.forEach(function (s) {
    const f = marimePeEcran(s.semn);
    s.semn.scale.set(s.semn.latBaza * f, s.semn.inaltBaza * f, 1);
  });
}


function treciInZona3d(idZona, dinspre) {
  const reteta = retetaZonei(idZona);
  if (!reteta) { treceInCurs3d = false; return; }

  intraInZona(idZona, null, dinspre);
}


// Where you appear, coming into a zone from somewhere. Called by
// intraInZona() in prototip.js once the new zone exists.
function undeIntriDinspre(dinspre) {
  if (!dinspre || !zona) return null;

  // Came by sea? You appear beside the harbour, not on the shore.
  if (zona.portul && zona.portul.catre === dinspre) {
    return { col: zona.portul.col + 8, rand: zona.portul.rand + 8 };
  }

  const intrare = (zona.treceri || []).find(function (tr) { return tr.catre === dinspre; });
  if (!intrare) return null;

  return {
    col: intrare.col + (intrare.spreInauntruC || 0) * CAT_INAUNTRU,
    rand: intrare.rand + (intrare.spreInauntruR || 0) * CAT_INAUNTRU
  };
}


// Called at the end of entering a zone.
function gataDeTrecere() {
  treceInCurs3d = false;
  abiaAmIntrat3d = true;
  faSemneleTrecerilor();
}
