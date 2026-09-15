// Probe de control: node verifica-control-lupta.js
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
let intoarceriProba=0, mesajeProba=[];
intoarceTeSpre=()=>{intoarceriProba++;};
aratacuvant=(s,x,y,text)=>{mesajeProba.push(text);};
intraInLupta=()=>{};
personaj={idClasa:'warrior',viata:100,viataMaxima:100,animal:null};
jucator={x:0,y:0}; mort=false;treceInCurs=false;abilitateInCurs=null;
const a={x:20,y:0,viu:true,active:true,marime:1,locul:{},furios:true};
const b={x:40,y:0,viu:true,active:true,marime:1,locul:{},furios:true};
mobi=[a,b];
alegeTintaLupta(b);
assert.equal(celMaiApropiatMob(0,0,60),b,'selectia are prioritate fata de distanta');
assert.equal(celMaiApropiatMob(0,0,30),null,'nu schimba tinta selectata cand este prea departe');
urmatoareaTintaLupta();assert.equal(tintaAleasaLupta,null,'ciclul permite anularea selectiei');
urmatoareaTintaLupta();assert.equal(tintaAleasaLupta,a);
assert.equal(selecteazaMobAtins(40,0),true);assert.equal(tintaAleasaLupta,b);
assert.equal(selecteazaMobAtins(400,400),false);
b.viu=false;assert.equal(tintaAleasaEsteVie(),false);assert.equal(celMaiApropiatMob(0,0,60),a);b.viu=true;
const scena={time:{now:100}};
const pregatire=()=>({sfarsit:2000,desen:{destroy(){}},aviso:null});
potMerge=()=>true;
alegeTintaLupta(a);a.pregatireTemnita=pregatire();a.comportament={};
pauzaGlobalaPanaLa=5000;
assert.equal(intrerupeAtaculAles(scena),true,'intreruperea functioneaza in pauza globala');
assert.equal(a.pregatireTemnita,null);assert.equal(a.specialTemnitaLa,4100);
assert.equal(pauzaAbilitati.warrior_interrupt_01,12100);
a.pregatireTemnita=pregatire();assert.equal(intrerupeAtaculAles(scena),false,'pauza de 12 secunde se respecta');
assert.ok(a.pregatireTemnita);
pauzaAbilitati={};a.x=100;assert.equal(intrerupeAtaculAles(scena),false,'warrior cere apropiere');assert.equal(pauzaAbilitati.warrior_interrupt_01,undefined);
a.x=20;potMerge=()=>false;assert.equal(intrerupeAtaculAles(scena),false,'zidul blocheaza intreruperea');
potMerge=()=>true;a.pregatireTemnita.sfarsit=99;assert.equal(intrerupeAtaculAles(scena),false,'un atac deja incheiat nu se intrerupe');
a.pregatireTemnita=pregatire();abilitateInCurs={};assert.equal(intrerupeAtaculAles(scena),false);abilitateInCurs=null;
for(const clasa of ['hunter','mage','priest']) {
  personaj.idClasa=clasa; a.x=200;a.pregatireTemnita=pregatire();
  assert.equal(intrerupeAtaculAles(scena),true,clasa+': intrerupere la distanta');
}
const aliat={fel:'scutier',rol:'tanc',x:0,y:0,viata:100,viataMaxima:100,locBun:{dc:0,dr:0},
  urmatoareaProvocare:0,urmatoareaLovitura:0,stats:{dmgMin:1,dmgMax:2,viteza:2},setAlpha(){}};
tovarasii=[aliat];a.x=20;alegeTintaLupta(a);
assert.equal(daComandaEchipei('ataca',scena),true);assert.equal(tintaComandataEchipei(),a);
alegeTintaLupta(b);assert.equal(tintaComandataEchipei(),a,'schimbarea selectiei nu schimba ordinul dat');
assert.equal(daComandaEchipei('retrage',scena),true);assert.equal(tintaComandataEchipei(),null);
let atacuriProba=0, provocariProba=0;
loveste=()=>{atacuriProba++;};provoaca=()=>{provocariProba++;};evitaPericolulInstantei=()=>false;
actualizeazaTovarasii(scena,16);
assert.equal(atacuriProba,0);assert.equal(provocariProba,0,'retragerea opreste si provocarea');
assert.equal(daComandaEchipei('urmeaza',scena),true);assert.equal(tintaEchipei,null);
alegeTintaLupta(a);daComandaEchipei('ataca',scena);a.viu=false;
assert.equal(tintaComandataEchipei(),null);assert.equal(comandaEchipei,'urmeaza');a.viu=true;
tovarasii=[];assert.equal(daComandaEchipei('ataca',scena),false,'fara echipa nu porneste o lupta');
document.getElementById=()=>({classList:{contains:()=>false}});
assert.equal(comenziLuptaPermise(),false,'meniurile blocheaza comenzile');
`,context);
console.log('Tinta stabila, selectie, intreruperile celor 4 clase, raza/ziduri/pauze si comenzile echipei: trecute.');
