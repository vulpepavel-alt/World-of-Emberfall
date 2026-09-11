// ==========================================================
//  VERIFICA UN FISIER DE ZONA
//
//  Deschide fisierul, il citeste ca pe o zona adevarata si se
//  uita daca e ceva in neregula: randuri de lungimi diferite,
//  litere fara descriere, bucati de harta la care nu se poate
//  ajunge, inamici asezati in stanca, si asa mai departe.
//
//      node unelte/verifica-zone.js zone/zona-greenvale.js ZONA_GREENVALE
//
//  Daca gaseste ceva, iese cu un cod de eroare - ca sa nu treaca
//  neobservat.
// ==========================================================

const fs = require('fs');
const cale = process.argv[2];
const numeVar = process.argv[3];

const src = fs.readFileSync(cale, 'utf8').replace(/inregistreazaZona\(.*\);/, '');
const z = new Function(src + '; return ' + numeVar + ';')();
const H = z.harta, R = H.length, C = H[0].length;

let ok = true;
const nu = m => { ok = false; console.log('  PROBLEMA: ' + m); };

console.log('== ' + z.nume + ' (' + C + ' x ' + R + ') ==');


// ---------- randurile si literele ----------
H.forEach((r, i) => { if (r.length !== C) nu('randul ' + i + ' are ' + r.length + ' litere, nu ' + C); });

const folosite = new Set();
H.forEach((rand, i) => {
  for (let c = 0; c < rand.length; c++) {
    const ch = rand[c];
    folosite.add(ch);
    if (!z.teren[ch]) nu("litera necunoscuta '" + ch + "' la randul " + i + ', coloana ' + c);
  }
});
Object.keys(z.teren).forEach(ch => {
  if (!folosite.has(ch)) nu("litera '" + ch + "' e descrisa dar nefolosita");
});

Object.entries(z.teren).forEach(([ch, t]) => {
  if (typeof t.culoare !== 'number' || t.culoare < 0 || t.culoare > 0xffffff) {
    nu("litera '" + ch + "' are culoare invalida");
  }
  if (t.variatie !== undefined && (typeof t.variatie !== 'number' || t.variatie > 0xffffff)) {
    nu("litera '" + ch + "' are variatie invalida");
  }
});

const TEXTURI_CUNOSCUTE = ['iarba','flori','pamant','crapat','nisip','apa','piatra',
                           'frunzis','lemn','zid','tigla','foc','neted'];
Object.entries(z.teren).forEach(([ch, t]) => {
  if (!t.textura) nu("litera '" + ch + "' nu are textura");
  else if (!TEXTURI_CUNOSCUTE.includes(t.textura)) {
    nu("litera '" + ch + "' are textura necunoscuta: " + t.textura);
  }
});


// ---------- unde se poate pasi, si unde se poate ajunge ----------
const blocat = {};
Object.entries(z.teren).forEach(([ch, t]) => { blocat[ch] = !!t.blocat; });

const liber = (c, r) => r >= 0 && r < R && c >= 0 && c < C &&
                        z.teren[H[r][c]] && !blocat[H[r][c]];

const vazut = [];
for (let r = 0; r < R; r++) vazut.push(new Uint8Array(C));

const q = [[z.start.col, z.start.rand]];
vazut[z.start.rand][z.start.col] = 1;
while (q.length) {
  const p = q.pop();
  const c = p[0], r = p[1];
  const v = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]];
  for (const n of v) {
    if (!liber(n[0], n[1]) || vazut[n[1]][n[0]]) continue;
    vazut[n[1]][n[0]] = 1;
    q.push(n);
  }
}

let tot = 0, atinse = 0;
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    if (liber(c, r)) tot++;
    if (vazut[r][c]) atinse++;
  }
}
console.log('  casute libere: ' + tot + ', se ajunge la: ' + atinse +
            ' (' + (tot ? Math.round(atinse / tot * 100) : 0) + '%)');

// Cateva ostroave mici, inchise de stanci, nu strica nimic. Daca
// ramane pe dinafara mai mult de o suta din harta, e o problema.
if (atinse / tot < 0.99) nu((tot - atinse) + ' casute libere sunt izolate');

if (!liber(z.start.col, z.start.rand)) nu('punctul de start e blocat');
if (!liber(z.reinviere.col, z.reinviere.rand)) nu('punctul de reinviere e blocat');


// ---------- podurile ----------
// Un pod trebuie sa se lege de drum sau de alt pod; altfel e o
// lespede de piatra ramasa singura in mijlocul apei.
let poduri = 0, poduriRupte = 0;
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    if (H[r][c] !== 'B') continue;
    poduri++;
    const vecini = [H[r][c + 1], H[r][c - 1],
                    H[r + 1] && H[r + 1][c], H[r - 1] && H[r - 1][c]];
    if (!vecini.some(v => v === 'B' || v === 'P')) poduriRupte++;
  }
}
if (poduri > 0) {
  console.log('  casute de pod: ' + poduri);
  if (poduriRupte > 0) nu(poduriRupte + ' casute de pod nu se leaga de niciun drum');
}


// ---------- personajele prietenoase ----------
(z.npci || []).forEach(n => {
  if (!liber(n.col, n.rand)) nu('NPC ' + n.fel + ' la (' + n.col + ',' + n.rand + ') e pe teren blocat');
  else if (!vazut[n.rand][n.col]) nu('NPC ' + n.fel + ' e izolat');
});


// ---------- inamicii ----------
const peNivel = {};
const peFel = {};
let celMaiApropiat = Infinity;

z.mobi.forEach(m => {

  if (!liber(m.col, m.rand)) {
    nu(m.fel + ' la (' + m.col + ',' + m.rand + ') e pe teren blocat: ' + H[m.rand][m.col]);
  } else if (!vazut[m.rand][m.col]) {
    nu(m.fel + ' la (' + m.col + ',' + m.rand + ') e izolat');
  }

  const niv = m.nivel || 1;
  if (niv < 1 || niv > 10) nu(m.fel + ' are nivelul ' + niv + ', in afara lui 1-10');
  peNivel[niv] = (peNivel[niv] || 0) + 1;
  peFel[m.fel] = (peFel[m.fel] || 0) + 1;

  const dc = m.col - z.start.col, dr = m.rand - z.start.rand;
  celMaiApropiat = Math.min(celMaiApropiat, Math.sqrt(dc * dc + dr * dr));
});

console.log('  inamici: ' + z.mobi.length);
console.log('  pe feluri: ' + Object.keys(peFel).sort()
  .map(f => f + ' ' + peFel[f]).join(', '));
console.log('  pe niveluri: ' + Object.keys(peNivel).sort((a, b) => a - b)
  .map(n => n + ':' + peNivel[n]).join('  '));

for (let n = 1; n <= 10; n++) {
  if (!peNivel[n]) nu('nu exista niciun inamic de nivel ' + n);
}

// Nu trebuie sa te sara nimeni in cap fix cand intri in joc.
console.log('  cel mai apropiat inamic de start: ' + Math.round(celMaiApropiat) + ' casute');
if (celMaiApropiat < 8) nu('un inamic e prea aproape de locul de start');

// Nivelul trebuie sa creasca pe masura ce te departezi de start.
let aproape = 0, aproapeCati = 0, departe = 0, departeCati = 0;
const maxDist = Math.sqrt(C * C + R * R);
z.mobi.forEach(m => {
  const dc = m.col - z.start.col, dr = m.rand - z.start.rand;
  const d = Math.sqrt(dc * dc + dr * dr);
  if (d < maxDist * 0.25) { aproape += (m.nivel || 1); aproapeCati++; }
  if (d > maxDist * 0.55) { departe += (m.nivel || 1); departeCati++; }
});
const medAproape = aproapeCati ? aproape / aproapeCati : 0;
const medDeparte = departeCati ? departe / departeCati : 0;
console.log('  nivel mediu aproape de start: ' + medAproape.toFixed(1) +
            ', departe: ' + medDeparte.toFixed(1));
if (medDeparte <= medAproape + 2) nu('nivelul nu creste destul cu departarea de start');

console.log(ok ? '  >> TOTUL E BINE' : '  >> SUNT PROBLEME');
process.exit(ok ? 0 : 1);
