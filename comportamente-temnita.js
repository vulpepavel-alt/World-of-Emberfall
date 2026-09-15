// Purtari alese in reteta temnitei. Fara date noi, inamicul foloseste
// lupta obisnuita. Pregatirile sunt urmarite de bucla jocului, pentru
// a putea fi anulate imediat la moarte, frica sau parasirea luptei.
function anuleazaPregatireaTemnitei(mob) {
  const p = mob.pregatireTemnita;
  if (!p) return;
  p.desen.destroy();
  if (p.aviso) p.aviso.destroy();
  mob.pregatireTemnita = null;
}

// Nu aruncam si nu vindecam prin pereti. Verificam si mijlocul
// traseului, fiindca doua capete libere pot avea un zid intre ele.
function caleLiberaTemnita(a, b) {
  const pasi = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (TILE / 4)));
  for (let i = 0; i <= pasi; i++) {
    if (!potMerge(a.x + (b.x - a.x) * i / pasi, a.y + (b.y - a.y) * i / pasi)) return false;
  }
  return true;
}

function tintaVieTemnita(cine) {
  if (cine === jucator) return !mort && personaj.viata > 0;
  if (typeof animalul !== 'undefined' && cine === animalul) {
    return !!personaj.animal && personaj.animal.viata > 0;
  }
  return !!cine && cine.active !== false && cine.viata > 0;
}

function aplicaLovituraTemnitei(scena, mob, cine, putere) {
  if (!mob.viu || !tintaVieTemnita(cine)) return;
  if (cine === jucator) mobTeLoveste(scena, mob, putere);
  else if (typeof animalul !== 'undefined' && cine === animalul) mobLovesteAnimalul(scena, mob, putere);
  else mobLovesteTovarasul(scena, mob, cine, putere);
}

function incepePregatireaTemnitei(scena, mob, tinta, abilitate) {
  const c = abilitate || mob.comportament;
  const peSol = ['lovituraSol', 'zonaSol', 'con', 'inel'].includes(c.fel);
  // Centrul ramane unde era tinta la inceput, astfel incat cercul
  // sa poata fi evitat. Nu urmareste jucatorul in timpul pregatirii.
  const sursa = ['lovituraSol', 'zonaSol'].includes(c.fel) ? tinta : mob;
  const x = sursa.x, y = sursa.y;
  const unghi = Math.atan2(tinta.y - mob.y, tinta.x - mob.x);
  const desen = scena.add.container(x, y).setDepth(8);
  const culoare = c.fel === 'vindecator' ? 0x65da92 : peSol ? 0xff654c : 0xffc967;
  if (c.fel === 'con') {
    const forme = [{ x: 0, y: 0 }];
    for (let i = 0; i <= 16; i++) {
      const a = unghi - c.unghi / 2 + c.unghi * i / 16;
      forme.push({ x: Math.cos(a) * c.raza, y: Math.sin(a) * c.raza });
    }
    desen.add(scena.add.polygon(0, 0, forme, culoare, 0.22).setOrigin(0, 0).setStrokeStyle(2, culoare));
  } else {
    desen.add(scena.add.circle(0, 0, peSol ? c.raza : 24, culoare, 0.18).setStrokeStyle(3, culoare, 0.9));
    if (c.fel === 'inel') desen.add(scena.add.circle(0, 0, c.razaInterioara, 0x65da92, 0.35).setStrokeStyle(2, 0x65da92));
  }
  const bara = scena.add.rectangle(-24, peSol ? c.raza + 10 : -34, 0, 4, culoare).setOrigin(0, 0.5);
  desen.add(bara);
  const avisoFijo = mob.locul.sefDeTemnita;
  const aviso = scena.add.text(avisoFijo ? LATIME / 2 : 0, avisoFijo ? 148 : -62, TEXT[c.text], {
    fontFamily: UI.FONT, fontSize: '12px', color: '#fff0d8',
    stroke: '#000000', strokeThickness: 3, align: 'center',
    wordWrap: { width: 300 }
  }).setOrigin(0.5);
  if (avisoFijo) aviso.setScrollFactor(0).setDepth(40);
  else desen.add(aviso);
  mob.pregatireTemnita = { debut: scena.time.now, sfarsit: scena.time.now + c.pregatire,
    abilitate: c, unghi: unghi, tinta: tinta, x: x, y: y, desen: desen, aviso: avisoFijo ? aviso : null, bara: bara };
  mob.dx = 0;
  mob.dy = 0;
}

function terminaPregatireaTemnitei(scena, mob) {
  const p = mob.pregatireTemnita;
  const c = p.abilitate || mob.comportament;
  anuleazaPregatireaTemnitei(mob);
  mob.indexAbilitate = (mob.indexAbilitate || 0) + 1;
  mob.specialTemnitaLa = scena.time.now + c.pauza * (mob.furieInstanta ? 0.85 : 1);
  // Lasam o pauza si pana la lovitura obisnuita: doua lovituri in
  // acelasi cadru ar ascunde folosul evitarii atacului pregatit.
  mob.urmatoareaLovitura = scena.time.now + mob.stats.viteza * 1000;
  if (c.fel === 'zonaSol') {
    const desen = scena.add.circle(p.x, p.y, c.raza, 0xff654c, 0.3).setStrokeStyle(2, 0xff654c).setDepth(8);
    mob.pericoleInstanta = mob.pericoleInstanta || [];
    mob.pericoleInstanta.push({ x: p.x, y: p.y, abilitate: c, desen: desen, sfarsit: scena.time.now + c.durata, lovesteLa: scena.time.now + 1000 });
  } else if (c.fel === 'chemare') {
    cheamaAjutoareleInstantei(scena, mob, c);
  } else if (['lovituraSol', 'con', 'inel'].includes(c.fel)) {
    const tinte = [jucator].concat(typeof tovarasii !== 'undefined' ? tovarasii.slice() : []);
    if (typeof animalul !== 'undefined' && animalul) tinte.push(animalul);
    tinte.forEach(function (cine) {
      if (mort || !mob.viu) return;
      if (tintaVieTemnita(cine) && punctInPericolulInstantei(cine, p) &&
          caleLiberaTemnita(p, cine)) aplicaLovituraTemnitei(scena, mob, cine, putereaInstantei(mob, c));
    });
    const urma = deseneazaUrmaInstantei(scena, p);
    scena.tweens.add({ targets: urma, alpha: 0, duration: 350,
      onComplete: function () { urma.destroy(); } });
  } else if (c.fel === 'vindecator') {
    const tinta = p.tinta;
    if (!tinta.viu || !tinta.furios || Math.hypot(tinta.x - mob.x, tinta.y - mob.y) > c.raza ||
        !caleLiberaTemnita(mob, tinta)) return;
    const cat = Math.min(tinta.viataMaxima - tinta.viata, Math.round(tinta.viataMaxima * c.parteVindecata));
    tinta.viata += cat;
    actualizeazaBaraMob(tinta);
    aratacifraVerde(scena, tinta.x, tinta.y - 44, cat);
    suna('vindecare');
  } else if (tintaVieTemnita(p.tinta) && Math.hypot(p.tinta.x - mob.x, p.tinta.y - mob.y) <= c.raza &&
             caleLiberaTemnita(mob, p.tinta)) {
    const linie = scena.add.graphics().setDepth(10);
    linie.lineStyle(3, 0xffc967, 1);
    linie.lineBetween(mob.x, mob.y - 12, p.tinta.x, p.tinta.y - 12);
    scena.tweens.add({ targets: linie, alpha: 0, duration: 180,
      onComplete: function () { linie.destroy(); } });
    aplicaLovituraTemnitei(scena, mob, p.tinta, putereaInstantei(mob, c));
  }
}

function actualizeazaPurtareaTemnitei(scena, mob) {
  const reteta = mob.comportament;
  if (!reteta || !mob.furios || mort) return false;
  if (reteta.pragFurie && !mob.furieInstanta && mob.viata / mob.viataMaxima <= reteta.pragFurie) {
    mob.furieInstanta = true;
    // Faza apare in panoul luptei, fara un al doilea text peste sef.
  }
  const c = reteta.abilitati ? reteta.abilitati[(mob.indexAbilitate || 0) % reteta.abilitati.length] : reteta;
  if (mob.pregatireTemnita) {
    const p = mob.pregatireTemnita;
    if (scena.time.now >= p.sfarsit) terminaPregatireaTemnitei(scena, mob);
    else p.bara.width = 48 * (scena.time.now - p.debut) / (p.abilitate || c).pregatire;
    return true;
  }
  const tinta = tintaMobului(mob);
  if (!tinta || !tintaVieTemnita(tinta)) return false;
  const gata = scena.time.now >= (mob.specialTemnitaLa || 0);
  if (c.fel === 'vindecator') {
    if (!gata) return false;
    const raniti = mobi.filter(function (m) {
      return m.viu && m.furios && m.viata < m.viataMaxima * 0.75 &&
        Math.hypot(m.x - mob.x, m.y - mob.y) <= c.raza && caleLiberaTemnita(mob, m);
    }).sort(function (a, b) { return a.viata / a.viataMaxima - b.viata / b.viataMaxima; });
    if (!raniti.length) {
      if (reteta.abilitati) { mob.indexAbilitate = (mob.indexAbilitate || 0) + 1; mob.specialTemnitaLa = scena.time.now + 500; }
      return false;
    }
    incepePregatireaTemnitei(scena, mob, raniti[0], c);
    return true;
  }
  if (c.fel === 'aruncator') {
    if (Math.hypot(tinta.x - mob.x, tinta.y - mob.y) > c.raza || !caleLiberaTemnita(mob, tinta)) return false;
    if (gata) incepePregatireaTemnitei(scena, mob, tinta, c);
    mob.dx = 0;
    mob.dy = 0;
    return true;
  }
  if (['lovituraSol', 'zonaSol', 'con', 'inel', 'chemare'].includes(c.fel) && gata) {
    // Seful pune presiune pe jucator chiar cand scutierul tine lupta;
    // creaturile mici lovesc in jurul tintei pe care sunt suparate.
    const cui = mob.locul.sefDeTemnita && ['lovituraSol', 'zonaSol'].includes(c.fel) ? jucator : tinta;
    if (Math.hypot(cui.x - mob.x, cui.y - mob.y) > 220 || !caleLiberaTemnita(mob, cui)) return false;
    incepePregatireaTemnitei(scena, mob, cui, c);
    return true;
  }
  return false;
}

function putereaInstantei(mob, c) {
  return c.putere * (mob.furieInstanta ? mob.comportament.sporFurie || 1.2 : 1);
}

// Aceeasi geometrie pentru damage si pentru evitarea tovarasilor.
function punctInPericolulInstantei(punct, pericol, margine) {
  const c = pericol.abilitate;
  const m = margine || 0;
  const dx = punct.x - pericol.x, dy = punct.y - pericol.y;
  const distanta = Math.hypot(dx, dy);
  if (distanta > c.raza + m) return false;
  if (c.fel === 'inel') return distanta >= c.razaInterioara - m;
  if (c.fel === 'con') {
    const diferenta = Math.atan2(Math.sin(Math.atan2(dy, dx) - pericol.unghi), Math.cos(Math.atan2(dy, dx) - pericol.unghi));
    return Math.abs(diferenta) <= c.unghi / 2 + m / Math.max(1, distanta);
  }
  return ['lovituraSol', 'zonaSol'].includes(c.fel);
}

function reseteazaIntalnireaTemnitei(mob) {
  anuleazaPregatireaTemnitei(mob);
  (mob.pericoleInstanta || []).forEach(function (p) { p.desen.destroy(); });
  mob.pericoleInstanta = [];
  (mob.ajutoareInstanta || []).forEach(function (a) {
    a.viu = false; a.furios = false;
    if (a.active !== false) a.destroy();
  });
  mob.ajutoareInstanta = [];
  mob.furieInstanta = false;
  mob.indexAbilitate = 0;
  mob.specialTemnitaLa = 0;
}

function cheamaAjutoareleInstantei(scena, mob, c) {
  mob.ajutoareInstanta = (mob.ajutoareInstanta || []).filter(function (a) { return a.viu && a.active !== false; });
  // Limita tine de intalnire, nu de numarul de incantari.
  const lipsesc = c.cati - mob.ajutoareInstanta.length;
  for (let i = 0; i < lipsesc; i++) {
    let loc = null;
    for (let pas = 0; pas < 16; pas++) {
      const unghi = (i / c.cati + pas / 16) * Math.PI * 2;
      const x = mob.x + Math.cos(unghi) * 100, y = mob.y + Math.sin(unghi) * 100;
      if (potMerge(x, y) && caleLiberaTemnita(mob, { x, y })) {
        loc = { fel: c.invoca, col: Math.floor(x / TILE), rand: Math.floor(y / TILE),
          nivel: mob.stats.nivel, invocat: true, nume: TEXT.INSTANCE_ADD };
        break;
      }
    }
    if (!loc) continue;
    creeazaMob(scena, loc);
    const ajutor = mobi[mobi.length - 1];
    ajutor.furios = true;
    mob.ajutoareInstanta.push(ajutor);
  }
}

function actualizeazaPericoleleInstantelor(scena) {
  mobi.forEach(function (mob) {
    if (!mob.pericoleInstanta || !mob.pericoleInstanta.length) return;
    if (!mob.viu || !mob.furios || mort || treceInCurs) { reseteazaIntalnireaTemnitei(mob); return; }
    mob.pericoleInstanta = mob.pericoleInstanta.filter(function (p) {
      if (scena.time.now >= p.sfarsit) { p.desen.destroy(); return false; }
      if (scena.time.now >= p.lovesteLa) {
        p.lovesteLa = scena.time.now + 1000;
        const tinte = [jucator].concat(tovarasii);
        if (animalul) tinte.push(animalul);
        tinte.forEach(function (t) {
          if (tintaVieTemnita(t) && punctInPericolulInstantei(t, p) && caleLiberaTemnita(p, t)) {
            aplicaLovituraTemnitei(scena, mob, t, putereaInstantei(mob, p.abilitate));
          }
        });
      }
      return true;
    });
  });
}

function pericoleleInstantei() {
  const pericole = [];
  mobi.forEach(function (m) {
    if (!m.viu || !m.furios) return;
    if (m.pregatireTemnita) pericole.push(m.pregatireTemnita);
    pericole.push.apply(pericole, m.pericoleInstanta || []);
  });
  return pericole;
}

function evitaPericolulInstantei(t, scena, delta) {
  const pericole = pericoleleInstantei();
  if (!pericole.some(function (p) { return punctInPericolulInstantei(t, p, 12); })) return false;
  // Cercetam locuri libere; un tovaras nu se teleporteaza si nu trece prin ziduri.
  let ales = null, aproape = Infinity;
  for (let raza = 48; raza <= 288; raza += 48) {
    for (let i = 0; i < 24; i++) {
      const unghi = i * Math.PI / 12;
      const punct = { x: t.x + Math.cos(unghi) * raza, y: t.y + Math.sin(unghi) * raza };
      if (!potMerge(punct.x, punct.y) || !caleLiberaTemnita(t, punct)) continue;
      if (pericole.some(function (p) { return punctInPericolulInstantei(punct, p, 16); })) continue;
      if (raza < aproape) { ales = punct; aproape = raza; }
    }
    if (ales) break;
  }
  if (!ales) return false;
  const d = Math.hypot(ales.x - t.x, ales.y - t.y);
  const pas = Math.min(d, VITEZA_TOVARAS * Math.min(delta, 100) / 1000);
  const x = t.x + (ales.x - t.x) / d * pas, y = t.y + (ales.y - t.y) / d * pas;
  if (potMerge(x, y)) { t.x = x; t.y = y; }
  return true;
}

function faPanoulInstantei(scena) {
  if (!zona.esteTemnita && !zona.esteRaid) return;
  scena.fundalPanouInstanta = scena.add.rectangle(LATIME / 2, 88, 366, 88, 0x17130e, 0.96)
    .setOrigin(0.5, 0).setStrokeStyle(1, 0x8b7043).setScrollFactor(0).setDepth(39);
  scena.panouInstanta = scena.add.text(LATIME / 2, 92, '', {
    fontFamily: UI.FONT, fontSize: '12px', color: '#ffe3a3', align: 'center',
    stroke: '#000000', strokeThickness: 3, wordWrap: { width: 360 }
  }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
}

function actualizeazaPanoulInstantei(scena) {
  if (!scena.panouInstanta) return;
  const sefi = zona.mobi.filter(function (m) { return m.sefDeTemnita; });
  const invinsi = sefi.filter(function (m) { return m.mortInInstanta; }).length;
  const sef = mobi.find(function (m) { return m.viu && m.furios && m.locul.sefDeTemnita; });
  let text = TEXT.INSTANCE_PROGRESS.replace('{n}', invinsi).replace('{total}', sefi.length);
  if (sef) text += '\n' + sef.locul.nume + ' · ' + Math.max(0, Math.ceil(sef.viata / sef.viataMaxima * 100)) + '%' +
    (sef.furieInstanta ? '\n' + TEXT.INSTANCE_FURY : '');
  else if (invinsi === sefi.length && sefi.length) text += '\n' + TEXT.INSTANCE_COMPLETE;
  if (scena.panouInstanta.text !== text) scena.panouInstanta.setText(text);
  const inalt = sef ? (sef.pregatireTemnita ? 88 : sef.furieInstanta ? 58 : 44) : invinsi === sefi.length ? 44 : 28;
  scena.fundalPanouInstanta.setDisplaySize(366, inalt);
}

function deseneazaUrmaInstantei(scena, p) {
  const c = p.abilitate;
  const urma = scena.add.container(p.x, p.y).setDepth(8);
  if (c.fel === 'con') {
    const puncte = [{ x: 0, y: 0 }];
    for (let i = 0; i <= 16; i++) {
      const a = p.unghi - c.unghi / 2 + c.unghi * i / 16;
      puncte.push({ x: Math.cos(a) * c.raza, y: Math.sin(a) * c.raza });
    }
    urma.add(scena.add.polygon(0, 0, puncte, 0xff654c, 0.4).setOrigin(0, 0));
  } else {
    urma.add(scena.add.circle(0, 0, c.raza, 0xff654c, 0.4));
    if (c.fel === 'inel') urma.add(scena.add.circle(0, 0, c.razaInterioara, 0x65da92, 0.7));
  }
  return urma;
}
