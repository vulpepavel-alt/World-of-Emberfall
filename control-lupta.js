// Selectia si comenzile tin de scena curenta, nu de salvarea personajului.
let tintaAleasaLupta = null;
let comandaEchipei = 'urmeaza';
let tintaEchipei = null;

function tintaAleasaEsteVie() {
  return !!tintaAleasaLupta && tintaAleasaLupta.viu && tintaAleasaLupta.active !== false && mobi.includes(tintaAleasaLupta);
}

function comenziLuptaPermise() {
  return !!personaj && !!jucator && !mort && !treceInCurs &&
    !['ecran-meniu', 'ecran-harta', 'ecran-fereastra'].some(function (id) {
      const el = document.getElementById(id);
      return el && !el.classList.contains('ascuns');
    });
}

function alegeTintaLupta(mob) {
  tintaAleasaLupta = mob;
  tinta = null;
  if (mob) intoarceTeSpre(mob.x, mob.y);
}

function selecteazaMobAtins(x, y) {
  const aproape = mobi.filter(function (m) {
    return m.viu && m.active !== false && Math.hypot(m.x - jucator.x, m.y - jucator.y) <= 600 &&
      Math.hypot(m.x - x, m.y - y) <= Math.min(75, 30 * (m.marime || 1));
  }).sort(function (a,b) { return Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y); });
  if (!aproape.length) return false;
  alegeTintaLupta(aproape[0]);
  return true;
}

function urmatoareaTintaLupta() {
  if (!comenziLuptaPermise()) return;
  const ale = mobi.filter(function (m) { return m.viu && m.active !== false && Math.hypot(m.x-jucator.x,m.y-jucator.y)<=600; })
    .sort(function (a,b) { return Math.hypot(a.x-jucator.x,a.y-jucator.y)-Math.hypot(b.x-jucator.x,b.y-jucator.y); });
  alegeTintaLupta(ale.length ? ale[ale.indexOf(tintaAleasaLupta)+1] || null : null);
}

function daComandaEchipei(comanda, scena) {
  if (!comenziLuptaPermise() || !['urmeaza','ataca','retrage'].includes(comanda)) return false;
  if (!tovarasii.some(function(t){return t.viata>0;}) && !(animalul && personaj.animal && personaj.animal.viata>0)) return false;
  if (comanda === 'ataca') {
    if (!tintaAleasaEsteVie()) { aratacuvant(scena,jucator.x,jucator.y-60,TEXT.SELECT_TARGET,'#e0b45a'); return false; }
    if (Math.hypot(tintaAleasaLupta.x-jucator.x,tintaAleasaLupta.y-jucator.y)>300 || !caleLiberaTemnita(jucator,tintaAleasaLupta)) {
      aratacuvant(scena,jucator.x,jucator.y-60,TEXT.TARGET_TOO_FAR,'#e0b45a'); return false;
    }
    tintaEchipei = tintaAleasaLupta;
    tintaEchipei.furios = true;
    intraInLupta(scena);
  } else tintaEchipei = null;
  comandaEchipei = comanda;
  return true;
}

function tintaComandataEchipei() {
  if (comandaEchipei !== 'ataca') return null;
  if (!tintaEchipei || !tintaEchipei.viu || tintaEchipei.active === false || !mobi.includes(tintaEchipei)) {
    comandaEchipei = 'urmeaza'; tintaEchipei = null; return null;
  }
  if (Math.hypot(tintaEchipei.x-jucator.x,tintaEchipei.y-jucator.y)>400) {
    comandaEchipei = 'urmeaza'; tintaEchipei = null; return null;
  }
  return tintaEchipei;
}

function abilitateaDeIntrerupere() {
  return gasesteAbilitatea(personaj.idClasa + '_interrupt_01');
}

function intrerupeAtaculAles(scena) {
  if (!comenziLuptaPermise() || abilitateInCurs) return false;
  const ab = abilitateaDeIntrerupere();
  if (!ab || scena.time.now < (pauzaAbilitati[ab.id] || 0)) return false;
  const mob = tintaAleasaEsteVie() ? tintaAleasaLupta : mobi.filter(function (m) {
    return m.viu && m.pregatireTemnita && Math.hypot(m.x-jucator.x,m.y-jucator.y)<=ab.raza;
  }).sort(function (a,b) { return Math.hypot(a.x-jucator.x,a.y-jucator.y)-Math.hypot(b.x-jucator.x,b.y-jucator.y); })[0];
  let mesaj = null;
  if (!mob || !mob.pregatireTemnita || scena.time.now >= mob.pregatireTemnita.sfarsit) mesaj = TEXT.NO_CAST_TO_STOP;
  else if (Math.hypot(mob.x-jucator.x,mob.y-jucator.y)>ab.raza) mesaj = TEXT.TARGET_TOO_FAR;
  else if (!caleLiberaTemnita(jucator,mob)) mesaj = TEXT.INTERRUPT_BLOCKED;
  if (mesaj) { aratacuvant(scena,jucator.x,jucator.y-60,mesaj,'#e0b45a'); return false; }
  alegeTintaLupta(mob);
  anuleazaPregatireaTemnitei(mob);
  mob.indexAbilitate = (mob.indexAbilitate || 0) + 1;
  mob.specialTemnitaLa = scena.time.now + 4000;
  mob.urmatoareaLovitura = scena.time.now + 1000;
  pauzaAbilitati[ab.id] = scena.time.now + ab.pauza;
  intraInLupta(scena);
  aratacuvant(scena,mob.x,mob.y-70,TEXT.INTERRUPTED,'#ffe184');
  return true;
}

function faButonControlLupta(scena, x, y, text, actiune) {
  const cerc = scena.add.container(x,y).setScrollFactor(0).setDepth(1000);
  cerc.add(scena.add.circle(0,0,23,0x8b7043));
  cerc.add(scena.add.circle(0,0,20,0x282016));
  const eticheta = scena.add.text(0,0,text,{fontFamily:UI.FONT,fontSize:'9px',color:'#ffe3a3',align:'center'}).setOrigin(0.5);
  cerc.add(eticheta);
  butoane.push({ x,y,raza:25,cerc,apasa:actiune });
  return { cerc,eticheta };
}

function faControlulLuptei(scena) {
  tintaAleasaLupta=null; tintaEchipei=null; comandaEchipei='urmeaza';
  const ab=abilitateaDeIntrerupere();
  personaj.stiute=personaj.stiute||{};
  if (ab) personaj.stiute[ab.id]=1;
  scena.butonIntrerupere=faButonControlLupta(scena,650,232,TEXT.STOP_CAST,()=>intrerupeAtaculAles(scena));
  faButonControlLupta(scena,650,178,TEXT.TARGET_BUTTON,urmatoareaTintaLupta);
  scena.butoaneComanda={};
  ['urmeaza','ataca','retrage'].forEach(function (c,i) {
    const text={urmeaza:TEXT.TEAM_FOLLOW,ataca:TEXT.TEAM_ATTACK,retrage:TEXT.TEAM_RETREAT}[c];
    scena.butoaneComanda[c]=faButonControlLupta(scena,32+i*56,134,text,()=>daComandaEchipei(c,scena));
  });
  scena.marcajTinta=scena.add.circle(0,0,30,0xffd34d,0.08).setStrokeStyle(2,0xffd34d).setDepth(8).setVisible(false);
  scena.panouTinta=scena.add.text(400,12,'',{fontFamily:UI.FONT,fontSize:'11px',color:'#ffe3a3',align:'center',backgroundColor:'#17130e',padding:{x:8,y:5},wordWrap:{width:320}})
    .setOrigin(0.5,0).setScrollFactor(0).setDepth(41);
  scena.input.keyboard.on('keydown-TAB',function(e){e.preventDefault();urmatoareaTintaLupta();});
  scena.input.keyboard.on('keydown-Q',()=>intrerupeAtaculAles(scena));
  scena.input.keyboard.on('keydown-F',()=>daComandaEchipei('urmeaza',scena));
  scena.input.keyboard.on('keydown-G',()=>daComandaEchipei('ataca',scena));
  scena.input.keyboard.on('keydown-R',()=>daComandaEchipei('retrage',scena));
}

function actualizeazaControlulLuptei(scena) {
  if (!scena.marcajTinta) return;
  if (mort || treceInCurs) { tintaAleasaLupta=null; tintaEchipei=null; comandaEchipei='urmeaza'; }
  if (tintaAleasaEsteVie() && Math.hypot(tintaAleasaLupta.x-jucator.x,tintaAleasaLupta.y-jucator.y)<=700) {
    const m=tintaAleasaLupta;
    scena.marcajTinta.setVisible(true).setPosition(m.x,m.y+10).setRadius(Math.min(60,28*(m.marime||1)));
    scena.panouTinta.setVisible(true).setText((m.locul.nume||m.fel.nume)+' · '+Math.max(0,Math.ceil(m.viata/m.viataMaxima*100))+'%');
  } else { tintaAleasaLupta=null; scena.marcajTinta.setVisible(false); scena.panouTinta.setVisible(false).setText(''); }
  const ab=abilitateaDeIntrerupere(), sec=secundeRamase(scena,ab);
  scena.butonIntrerupere.eticheta.setText(sec?String(sec):TEXT.STOP_CAST);
  scena.butonIntrerupere.cerc.setAlpha(mort?0.4:1);
  tintaComandataEchipei();
  const aiEchipa = tovarasii.length || animalul;
  Object.keys(scena.butoaneComanda).forEach(function(c){
    scena.butoaneComanda[c].cerc.setAlpha(aiEchipa?(comandaEchipei===c?1:0.55):0.25);
  });
}
