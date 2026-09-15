// Intalniri scrise pentru fiecare camera, dupa incarcarea retetelor.
// Cifrele sunt pentru echipa offline: trei tovarasi in temnita, cinci in raid.
const INTALNIRI_INSTANTE = {
  moorhollowdeep: {
    culcus: ['chemare:WATCH_CALL:bandit', 'con:WATCH_SWEEP'],
    groapa: ['lovituraSol:ROOT_ERUPTION', 'inel:ROOT_RING'],
    camara: ['zonaSol:WEB_POOL', 'chemare:WEB_BROOD:spider'],
    masa: ['lovituraSol:HOLLOW_BOSS_STRIKE', 'con:CORVIN_CLEAVE', 'chemare:CORVIN_CALL:bandit']
  },
  greyfendepths: {
    sala: ['con:SILT_BREATH', 'zonaSol:SILT_POOL'],
    bolta: ['zonaSol:PALE_WEB', 'chemare:PALE_BROOD:spider'],
    put: ['lovituraSol:WELL_ERUPTION', 'inel:WELL_RING'],
    inima: ['aruncator:MAREN_BOLT', 'zonaSol:MAREN_FLOOD', 'chemare:MAREN_CALL:serpent']
  },
  ironhillshafts: {
    galerie: ['con:BASK_SWEEP', 'chemare:BASK_CALL:raider'],
    atelier: ['lovituraSol:SHAFT_COLLAPSE', 'inel:SHAFT_RING'],
    surpat: ['con:RUST_BREATH', 'zonaSol:RUST_POOL'],
    fund: ['lovituraSol:GRANGE_COLLAPSE', 'chemare:GRANGE_CALL:scorpid', 'zonaSol:GRANGE_FIRE']
  },
  gravehollow: {
    cripta: ['con:SHELF_SWOOP', 'chemare:SHELF_FLOCK:vulture'],
    sala: ['aruncator:IVO_BOLT', 'vindecator:IVO_MEND', 'zonaSol:IVO_SEAL'],
    camara: ['con:COIL_BREATH', 'zonaSol:COIL_POOL'],
    fund: ['inel:HALE_RING', 'chemare:HALE_CALL:bandit', 'con:HALE_CLEAVE']
  },
  glasswastepit: {
    sticla: ['con:SHARD_SPRAY', 'zonaSol:SHARD_POOL'],
    cuptor: ['con:GLASS_BREATH', 'inel:GLASS_RING'],
    fisura: ['lovituraSol:TESSIN_BLAST', 'chemare:TESSIN_CALL:raider'],
    fund: ['zonaSol:KILN_FIRE', 'inel:KILN_RING', 'aruncator:KILN_BOLT']
  },
  hollowrootwarren: {
    impletit: ['zonaSol:BRAIDER_WEB', 'chemare:BRAIDER_CALL:spider'],
    cuib: ['con:NINE_FANGS', 'chemare:NINE_PACK:wolf'],
    putred: ['lovituraSol:ROT_ERUPTION', 'zonaSol:ROT_POOL'],
    inima: ['zonaSol:ROOK_FIRE', 'con:ROOK_SWEEP', 'chemare:ROOK_CALL:burrower']
  },
  coldspinevault: {
    sala: ['con:DOOR_SWEEP', 'inel:DOOR_RING'],
    arhiva: ['aruncator:QUILL_BOLT', 'zonaSol:QUILL_SEAL'],
    trezorerie: ['con:VORR_CLEAVE', 'chemare:VORR_CALL:raider'],
    fund: ['inel:VAULT_RING', 'lovituraSol:VAULT_CRUSH', 'chemare:VAULT_CALL:garda']
  },
  thornspirehold: {
    curte: ['con:GATE_SWEEP', 'chemare:GATE_CALL:garda'],
    sala: ['con:LYND_CLEAVE', 'lovituraSol:LYND_STRIKE'],
    turn: ['aruncator:SIGNAL_SHOT', 'chemare:SIGNAL_CALL:garda'],
    varf: ['zonaSol:REYN_FIRE', 'chemare:REYN_CALL:raider', 'inel:REYN_RING']
  },
  longaccount: {
    cantar: ['con:WEIGH_SWEEP', 'inel:WEIGH_RING'],
    depozit: ['lovituraSol:HASK_CRATES', 'chemare:HASK_CALL:raider'],
    copisti: ['aruncator:COPY_BOLT', 'zonaSol:COPY_INK', 'chemare:COPY_CALL:bandit'],
    seif: ['con:SERJEANT_CLEAVE', 'inel:SERJEANT_RING'],
    arhiva: ['zonaSol:SHELF_WEB', 'chemare:SHELF_BROOD:spider', 'con:SHELF_BREATH'],
    consiliu: ['zonaSol:VAILE_SEAL', 'vindecator:VAILE_MEND', 'chemare:VAILE_CALL:garda'],
    presa: ['lovituraSol:PRESS_CRUSH', 'inel:PRESS_RING', 'con:PRESS_SWEEP'],
    birou: ['zonaSol:KEEPER_INK', 'chemare:KEEPER_CALL:garda', 'inel:KEEPER_RING', 'con:KEEPER_CLEAVE']
  }
};

function faAbilitateaInstantei(descriere, raid) {
  const [fel, text, invoca] = descriere.split(':');
  const c = { fel, text, pregatire: 1800, pauza: 6000, raza: raid ? 110 : 88, putere: 1.8 };
  if (fel === 'con') { c.raza = 150; c.unghi = Math.PI / 3; c.putere = 2; }
  if (fel === 'inel') { c.raza = 185; c.razaInterioara = 72; c.pregatire = 2200; }
  if (fel === 'zonaSol') { c.raza = raid ? 82 : 64; c.durata = 5000; c.putere = 0.65; }
  if (fel === 'chemare') { c.invoca = invoca; c.cati = raid ? 3 : 2; c.raza = 220; c.pauza = 8000; c.putere = 1; }
  if (fel === 'aruncator') { c.raza = 240; c.putere = 1.5; c.pregatire = 1500; }
  if (fel === 'vindecator') { c.raza = 260; c.parteVindecata = 0.12; c.pregatire = 2200; c.pauza = 9000; }
  return c;
}

function pregatesteIntalnirileInstantelor() {
  ZONE.filter(function (z) { return z.esteTemnita || z.esteRaid; }).forEach(function (z) {
    const intalniri = INTALNIRI_INSTANTE[z.id];
    if (!intalniri) throw new Error('Lipsesc intalnirile: ' + z.id);
    z.camere.forEach(function (cam, i) {
      if (!cam.sef) return;
      const lista = intalniri[cam.id];
      if (!lista) throw new Error('Lipseste seful: ' + z.id + '/' + cam.id);
      cam.sef.comportament = { abilitati: lista.map(function (a) { return faAbilitateaInstantei(a, z.esteRaid); }),
        pragFurie: i === z.camere.length - 1 ? 0.4 : 0.3, sporFurie: 1.2 };
      cam.sef.sporViata = z.esteRaid ? 1.6 : i === z.camere.length - 1 ? 1.4 : 1.15;
      // Verde la inceput, albastru in temnitele avansate, mov in raid.
      cam.sef.lasa.forEach(function (obiect) {
        if (z.esteRaid) obiect.raritate = 'maiestru';
        else if (z.nivelDeLa >= 34 || i === z.camere.length - 1) obiect.raritate = 'rar';
      });
    });
    if (!z.comportamenteTrash) {
      z.comportamenteTrash = {};
      z.feluriPeNivel(z.nivelPanaLa).forEach(function (fel) {
        const tip = ({ bandit: 'vindecator', spider: 'vindecator', raider: 'aruncator', burrower: 'lovituraSol', serpent: 'zonaSol' })[fel] || 'con';
        const c = faAbilitateaInstantei(tip + ':' + (tip === 'aruncator' ? 'INSTANCE_SHOT' : tip === 'vindecator' ? 'INSTANCE_MEND' : tip === 'zonaSol' || tip === 'lovituraSol' ? 'INSTANCE_GROUND' : 'INSTANCE_SWEEP'), false);
        c.putere = 1.2; c.pregatire = 1500; c.pauza = 6500;
        z.comportamenteTrash[fel] = c;
      });
    }
  });
}
pregatesteIntalnirileInstantelor();
