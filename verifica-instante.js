// Probe independente de browser: node verifica-instante.js
// Nu se incarca in joc si nu ating salvarile.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const context = vm.createContext({ console, performance, Phaser: { Math: { Between: (a,b) => Math.round((a+b)/2), Distance: { Between: (x,y,a,b) => Math.hypot(x-a,y-b) } }, AUTO: 0, Scale: { FIT: 0, CENTER_BOTH: 0 } }, Math, setTimeout, clearTimeout, window: { addEventListener() {} }, document: { addEventListener() {}, getElementById() { return null; } } });
const excluse = new Set(['meniu.js', 'meniu-joc.js', 'titlu.js', 'prada.js', 'harta.js', 'personaj-test.js']);
for (const m of fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)) {
  if (m[1].startsWith('https:') || excluse.has(m[1])) continue;
  vm.runInContext(fs.readFileSync(path.join(__dirname, m[1]), 'utf8'), context, { filename: m[1] });
}
vm.runInContext('leagaZonele(); faMisiunileTuturorZonelor();', context);
context.assert = assert;
vm.runInContext(`

const instante = ZONE.filter(z => z.esteTemnita || z.esteRaid);
assert.equal(instante.length, 9);
assert.equal(instante.reduce((n,z) => n + z.camere.filter(c => c.sef).length, 0), 40);
for (const reteta of instante) {
  const z = faZona(reteta);
  const sefi = z.mobi.filter(m => m.sefDeTemnita);
  assert.equal(sefi.length, reteta.camere.filter(c => c.sef).length);
  for (const sef of sefi) {
    assert.ok(sef.comportament.abilitati.length >= 2);
    for (const c of sef.comportament.abilitati) {
      assert.ok(TEXT[c.text]);
      assert.ok(c.pregatire >= 1500 && c.pauza >= 5000 && c.raza > 0);
      if (c.fel === 'chemare') assert.ok(MOBI[c.invoca] && c.cati <= 3);
    }
    assert.ok(sef.sporViata > 1);
    assert.ok(sef.lasa.length >= 2);
    assert.ok(z.harta[sef.rand][sef.col] && !z.teren[z.harta[sef.rand][sef.col]].blocat);
  }
  assert.ok(z.treceri.some(t => t.catre === reteta.intrareDin.zona));
  assert.ok(z.mobi.filter(m => !m.sefDeTemnita).every(m => m.comportament));
  // Verificam drumul fizic catre toti sefii, nu doar legaturile dintre zone.
  const coada = [[z.start.col, z.start.rand]], vizitate = new Set();
  for (let i = 0; i < coada.length; i++) {
    const [c,r] = coada[i], k = c + ',' + r;
    if (vizitate.has(k) || !z.harta[r] || !z.harta[r][c] || z.teren[z.harta[r][c]].blocat) continue;
    vizitate.add(k);
    coada.push([c+1,r],[c-1,r],[c,r+1],[c,r-1]);
  }
  assert.ok(z.mobi.every(m => vizitate.has(m.col + ',' + m.rand)), reteta.id + ': sef inaccesibil');
  console.log(reteta.id + ': ' + sefi.length + ' sefi, intrare/iesire si drumuri verificate');
}
const cerc = { x:0,y:0,abilitate:faAbilitateaInstantei('lovituraSol:ROOT_ERUPTION',false) };
assert.ok(punctInPericolulInstantei({x:20,y:20},cerc));
assert.ok(!punctInPericolulInstantei({x:100,y:100},cerc));
const inel = { x:0,y:0,abilitate:faAbilitateaInstantei('inel:ROOT_RING',false) };
assert.ok(!punctInPericolulInstantei({x:20,y:20},inel));
assert.ok(punctInPericolulInstantei({x:100,y:0},inel));
const con = { x:0,y:0,unghi:Math.PI-0.1,abilitate:faAbilitateaInstantei('con:WATCH_SWEEP',false) };
assert.ok(punctInPericolulInstantei({x:-100,y:-1},con));
assert.ok(!punctInPericolulInstantei({x:100,y:0},con));
`, context);
console.log('Toate cele 9 instante si geometria mecanicilor au trecut.');
vm.runInContext(`
function nodProba() {
  return { width: 0, active: true, add() { return this; }, setDepth() { return this; },
    setStrokeStyle() { return this; }, setOrigin() { return this; }, setScrollFactor() { return this; },
    destroy() { this.active = false; }, lineStyle() {}, lineBetween() {} };
}
const scenaProba = { time: { now: 1000 }, add: {}, tweens: { add() {} } };
for (const tip of ['container','circle','rectangle','text','polygon','graphics']) scenaProba.add[tip] = nodProba;
const lovituriProba = [];
potMerge = () => true;
aplicaLovituraTemnitei = (s,m,t,putere) => { lovituriProba.push({ t,putere }); };
tintaMobului = () => jucator;
actualizeazaBaraMob = () => {};
aratacifraVerde = () => {};
suna = () => {};
personaj = { viata: 100, animal: null }; jucator = { x: 50, y: 50 }; mort = false; treceInCurs = false;
tovarasii = []; animalul = null;
const mobProba = { x: 50, y: 50, viata: 100, viataMaxima: 100, viu: true, furios: true,
  locul: { sefDeTemnita: true }, stats: { viteza: 2, nivel: 60 } };
mobi = [mobProba];
const atacProba = faAbilitateaInstantei('lovituraSol:ROOT_ERUPTION',false);
mobProba.comportament = { abilitati: [atacProba], pragFurie: 0.3, sporFurie: 1.2 };
incepePregatireaTemnitei(scenaProba,mobProba,jucator,atacProba);
assert.equal(mobProba.pregatireTemnita.x,50);
jucator.x=200;
assert.equal(mobProba.pregatireTemnita.x,50, 'cercul nu urmareste tinta');
scenaProba.time.now += atacProba.pregatire;
terminaPregatireaTemnitei(scenaProba,mobProba);
assert.equal(lovituriProba.length,0,'iesirea din cerc evita atacul');
assert.equal(mobProba.indexAbilitate,1);
assert.ok(mobProba.urmatoareaLovitura > scenaProba.time.now);
mobProba.viata=29;
actualizeazaPurtareaTemnitei(scenaProba,mobProba);
assert.ok(mobProba.furieInstanta);
assert.equal(putereaInstantei(mobProba,atacProba),atacProba.putere*1.2);
reseteazaIntalnireaTemnitei(mobProba);
assert.ok(!mobProba.furieInstanta && mobProba.indexAbilitate===0);
const solProba = faAbilitateaInstantei('zonaSol:KEEPER_INK',true);
incepePregatireaTemnitei(scenaProba,mobProba,jucator,solProba);
terminaPregatireaTemnitei(scenaProba,mobProba);
assert.equal(mobProba.pericoleInstanta.length,1);
const solCreat = mobProba.pericoleInstanta[0];
actualizeazaPericoleleInstantelor(scenaProba);
assert.equal(lovituriProba.length,0,'zona nu loveste inainte de primul tic');
scenaProba.time.now += 1000;
actualizeazaPericoleleInstantelor(scenaProba);
assert.equal(lovituriProba.length,1);
jucator.x+=200; scenaProba.time.now +=1000;
actualizeazaPericoleleInstantelor(scenaProba);
assert.equal(lovituriProba.length,1,'iesirea din zona opreste damage-ul');
scenaProba.time.now = solCreat.sfarsit;
actualizeazaPericoleleInstantelor(scenaProba);
assert.equal(mobProba.pericoleInstanta.length,0);
assert.equal(solCreat.desen.active,false);
creeazaMob = (s,loc) => { mobi.push({ locul:loc,viu:true,active:true,destroy() {this.active=false;} }); };
const chemareProba = faAbilitateaInstantei('chemare:KEEPER_CALL:garda',true);
cheamaAjutoareleInstantei(scenaProba,mobProba,chemareProba);
cheamaAjutoareleInstantei(scenaProba,mobProba,chemareProba);
assert.equal(mobProba.ajutoareInstanta.length,3,'chemari repetate au limita comuna');
assert.ok(mobProba.ajutoareInstanta.every(a => a.locul.invocat && a.furios));
const ajutoareCreate = mobProba.ajutoareInstanta.slice();
reseteazaIntalnireaTemnitei(mobProba);
assert.ok(ajutoareCreate.every(a => !a.active && !a.viu));
assert.equal(mobProba.ajutoareInstanta.length,0);
mobi=[mobProba]; mobProba.viata=100;
const vindecareProba = faAbilitateaInstantei('vindecator:IVO_MEND',false);
mobProba.comportament={abilitati:[vindecareProba,atacProba]};
actualizeazaPurtareaTemnitei(scenaProba,mobProba);
assert.equal(mobProba.indexAbilitate,1,'fara raniti se trece la urmatoarea abilitate');
mobProba.pericoleInstanta=[{x:0,y:0,abilitate:solProba,desen:nodProba(),sfarsit:scenaProba.time.now+5000}];
const aliatProba={x:0,y:0};
assert.ok(evitaPericolulInstantei(aliatProba,scenaProba,100));
assert.ok(Math.hypot(aliatProba.x,aliatProba.y)>0 && Math.hypot(aliatProba.x,aliatProba.y)<=15.51);
potMerge=()=>false;
const inainteProba={...aliatProba};
assert.equal(evitaPericolulInstantei(aliatProba,scenaProba,100),false);
assert.equal(aliatProba.x,inainteProba.x);
assert.equal(aliatProba.y,inainteProba.y);
mort=true;
actualizeazaPericoleleInstantelor(scenaProba);
assert.equal(mobProba.pericoleInstanta.length,0,'moartea curata zonele');
`, context);
console.log('Casturi, evitare, faza finala, vindecare, limita ajutoarelor si curatare: trecute.');

vm.runInContext(`
let xpProba=0, saciProba=0, misiuniProba=0;
primesteXp=()=>{xpProba++;};
faSac=()=>{saciProba++;};
amUcis=()=>{misiuniProba++; return [];};
aratacifra=()=>{};
adaugaAmenintare=()=>{};
personaj={nivel:60,misiuni:{},echipament:{}};
mort=false;
const locMortProba={fel:'bandit',col:1,rand:1,nume:'Probe boss',sefDeTemnita:true,
  lasa:[{nume:'Probe chain',slot:'gat',raritate:'rar'}]};
const sefMortProba={x:48,y:48,active:true,viu:true,viata:1,viataMaxima:100,
  stats:{nivel:20,armura:0},rang:RANGURI.elit,fel:MOBI.bandit,felul:'bandit',locul:locMortProba};
zona={esteTemnita:true,nume:'Probe dungeon',mobi:[locMortProba]};
mobi=[sefMortProba];
loveste(scenaProba,sefMortProba,999,false);
loveste(scenaProba,sefMortProba,999,false);
assert.equal(xpProba,1,'un sef da XP o singura data');
assert.equal(saciProba,1,'un sef lasa un singur sac');
assert.equal(misiuniProba,1,'un sef numara o singura ucidere');
assert.equal(locMortProba.mortInInstanta,true);
actualizeazaMobii(scenaProba);
assert.equal(mobi.filter(m=>m.viu).length,0,'seful invins nu reapare');
const invocatMortProba={...sefMortProba,viu:true,active:true,viata:1,locul:{fel:'bandit',invocat:true}};
loveste(scenaProba,invocatMortProba,999,false);
assert.equal(xpProba,1,'ajutoarele nu dau XP repetabil');
assert.equal(saciProba,1,'ajutoarele nu dau prada repetabila');
assert.equal(misiuniProba,1,'ajutoarele nu numara ucideri de misiune');
`,context);
console.log('Recompense unice, fara reapartie in instanta si fara farm de ajutoare: trecute.');
