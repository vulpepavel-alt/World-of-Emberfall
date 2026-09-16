// ==========================================================
//  AMENINTAREA: pe cine loveste inamicul
//
//  CUM ERA
//  Inamicul venea mereu dupa TINE si lovea pe cine se nimerea sa fie
//  mai aproape de el decat tine. Atat. Scutierul pe care il platesti
//  "te acoperea" doar daca apuca sa stea fizic in fata ta - adica din
//  intamplare. Un tanc care nu tine nimic pe el nu e un tanc, e inca
//  un damage.
//
//  CUM E ACUM, CA IN CLASSIC
//  Fiecare inamic tine socoteala: cine i-a facut cat rau. Aia e
//  AMENINTAREA. Loveste pe cel cu socoteala cea mai mare, nu pe cel
//  mai apropiat.
//
//    - damage-ul da amenintare unu la unu
//    - vindecatul da si el amenintare, jumatate din cat vindeca, si
//      se imparte la toti inamicii care se bat acum. De-aia in Classic
//      vindecatorul isi ia inamicii in cap daca tancul nu tine bine.
//    - scutierul face de DOUA ORI SI JUMATATE mai multa amenintare din
//      acelasi damage. Asta e tot ce inseamna "a fi tanc".
//    - ca sa-i iei inamicul de pe el, trebuie sa-l intreci cu 10%, nu
//      doar sa-l ajungi. Fara regula asta inamicul s-ar intoarce dupa
//      fiecare lovitura, cand doi sunt aproape la fel.
//    - PROVOCAREA (taunt) nu adauga amenintare: te pune peste cel mai
//      mare, cu 10%. Scutierul o foloseste singur, din cand in cand.
//
//  De ce conteaza: asa o temnita se joaca cum trebuie. Tancul tine,
//  tu dai, vindecatorul are grija sa nu iasa in fata.
//
//  ---------------------------------------------------------
//  FISIERUL ASTA E FOLOSIT DE AMANDOUA JOCURILE, deci nu stie nimic
//  despre lume. Tot ce are nevoie, intreaba - si fiecare joc
//  raspunde cu ale lui:
//
//    pozitiaCelui(cine)   unde sta, IN CASUTE
//    mobiiCareSeBat()     inamicii care se bat chiar acum
//    mobSeBate(mob)       asta se bate acum?
//    jucatorulEMort()     esti mort?
//
//  Perechea din 2D e in game.js, cea din 3D in 3d/tovarasi3d.js.
//  Socoteala se face in CASUTE, ca in ghid-misiuni.js: jocul 2D
//  imparte pixelii la 32, lumea 3D nu are ce imparti.
//  ---------------------------------------------------------
// ==========================================================


// Cat de mult trebuie sa-l intreci pe cel de acum ca sa-l iei tu.
const PRAG_SCHIMBARE = 1.10;

// De cate ori mai multa amenintare face fiecare, din acelasi damage.
const SPOR_AMENINTARE = {
  tanc: 2.5,          // asta e tot ce inseamna sa fii tanc
  vindecator: 1,
  lovitor: 0.8,       // lovitorii trag putin inapoi, sa nu fure inamicul
  jucator: 1,
  animal: 1.3         // animalul vanatorului tine si el ceva
};

// Cat din vindecare se face amenintare.
const AMENINTARE_DIN_VINDECARE = 0.5;

// La cata departare inamicul renunta la tinta lui si se uita la
// altul. In casute (erau 700 de pixeli de-ai jocului 2D).
const RAZA_TINTEI = 22;


// Cine poate fi lovit: tu, un tovaras, animalul. Le tinem ca obiecte,
// nu ca nume, ca sa nu se incurce daca se schimba lista intre timp.
function rolulCelui(cine) {
  if (cine === jucator) return 'jucator';
  if (typeof animalul !== 'undefined' && cine === animalul) return 'animal';
  return cine && cine.rol ? cine.rol : 'jucator';
}


// Mai e bun de lovit? Un mort sau unul sters din joc nu e.
function maiEDeLovit(cine) {
  if (!cine) return false;
  if (cine === jucator) return !jucatorulEMort();
  if (typeof animalul !== 'undefined' && cine === animalul) {
    return !!(personaj.animal && personaj.animal.viata > 0);
  }
  if (typeof animalulDesenat !== 'undefined' && cine === animalulDesenat) {
    return !!(personaj.animal && personaj.animal.viata > 0);
  }
  return cine.viata > 0 && typeof tovarasii !== 'undefined' && tovarasii.indexOf(cine) >= 0;
}


function listaAmenintarii(mob) {
  if (!mob.amenintare) mob.amenintare = [];
  return mob.amenintare;
}


function adaugaAmenintare(mob, cine, cat) {

  if (!mob || !mobSeBate(mob) || !cine || cat <= 0) return;

  const spor = SPOR_AMENINTARE[rolulCelui(cine)] || 1;
  const lista = listaAmenintarii(mob);

  let gasit = lista.find(function (a) { return a.cine === cine; });
  if (!gasit) { gasit = { cine: cine, cat: 0 }; lista.push(gasit); }
  gasit.cat += cat * spor;
}


// Vindecatul face amenintare la TOTI inamicii care se bat acum, nu doar
// la unul: vindecatorul n-a lovit pe nimeni, dar toti il vad.
function amenintareDinVindecare(cine, cat) {
  if (!cine || cat <= 0) return;
  const inLupta = mobiiCareSeBat();
  if (!inLupta.length) return;
  const peFiecare = (cat * AMENINTARE_DIN_VINDECARE) / inLupta.length;
  inLupta.forEach(function (m) { adaugaAmenintare(m, cine, peFiecare); });
}


// PROVOCAREA. Nu aduna: te aseaza peste cel mai mare, cu zece la suta.
// Exact ca in Classic, si de-aia merge chiar daca ai stat deoparte.
function provoaca(mob, cine) {

  if (!mob || !mobSeBate(mob) || !cine) return false;

  const lista = listaAmenintarii(mob);
  let celMaiMare = 0;
  lista.forEach(function (a) { if (a.cat > celMaiMare) celMaiMare = a.cat; });

  let alCelui = lista.find(function (a) { return a.cine === cine; });
  if (!alCelui) { alCelui = { cine: cine, cat: 0 }; lista.push(alCelui); }
  alCelui.cat = Math.max(alCelui.cat, celMaiMare * PRAG_SCHIMBARE + 1);

  mob.tintaAleasa = cine;
  return true;
}


// Pe cine loveste inamicul acum.
//
// Cel de acum ramane ales pana cand altul il intrece cu zece la suta.
// Fara lipiciul asta, inamicul s-ar intoarce dupa fiecare lovitura
// cand doi sunt aproape la fel, si s-ar invarti pe loc.
function tintaMobului(mob) {

  const alMobului = pozitiaCelui(mob);

  const lista = listaAmenintarii(mob).filter(function (a) {
    if (!maiEDeLovit(a.cine)) return false;
    const alLui = pozitiaCelui(a.cine);
    if (!alLui || !alMobului) return false;
    return Math.hypot(alMobului.x - alLui.x, alMobului.y - alLui.y) < RAZA_TINTEI;
  });

  // Nimeni nu i-a facut nimic inca: vine dupa tine, ca pana acum.
  if (!lista.length) {
    mob.tintaAleasa = (!jucatorulEMort() && jucator) ? jucator : null;
    return mob.tintaAleasa;
  }

  let celMaiSus = lista[0];
  lista.forEach(function (a) { if (a.cat > celMaiSus.cat) celMaiSus = a; });

  const acum = mob.tintaAleasa;
  const alLui = maiEDeLovit(acum)
    ? lista.find(function (a) { return a.cine === acum; })
    : null;

  if (!alLui) { mob.tintaAleasa = celMaiSus.cine; return mob.tintaAleasa; }
  if (celMaiSus.cine !== alLui.cine && celMaiSus.cat > alLui.cat * PRAG_SCHIMBARE) {
    mob.tintaAleasa = celMaiSus.cine;
  }
  return mob.tintaAleasa;
}


// AMENINTAREA PE ZONA, a scutierului.
//
// Fara ea, un tanc nu poate tine decat inamicul pe care il loveste
// chiar acum. Masurat intr-o proba cu cinci inamici: doi paianjeni pe
// care scutierul nu-i atinsese niciodata se duceau la vindecator, cu
// socoteala tanc=1, vindecator=28 - si provocarea la sase secunde
// n-avea cum sa tina pasul cu vindecatul.
//
// In Classic asta se rezolva cu loviturile care prind tot grupul
// (strigatul, izbitura in pamant). Aici e acelasi lucru, mai simplu:
// cand scutierul loveste pe cineva, toti ceilalti din jurul lui simt
// si ei o parte. Nu e damage - e doar socoteala.
const AMENINTARE_IN_JUR = 0.8;     // cat din lovitura simt ceilalti
const RAZA_AMENINTARII_IN_JUR = 4.7;   // casute (erau 150 de pixeli)

function amenintareInJur(celCareLoveste, tintaLui, damage) {

  if (!celCareLoveste || rolulCelui(celCareLoveste) !== 'tanc') return;

  const alLui = pozitiaCelui(celCareLoveste);
  if (!alLui) return;

  mobiiCareSeBat().forEach(function (m) {
    if (m === tintaLui) return;
    const alMobului = pozitiaCelui(m);
    if (!alMobului) return;
    if (Math.hypot(alLui.x - alMobului.x, alLui.y - alMobului.y)
        > RAZA_AMENINTARII_IN_JUR) return;
    adaugaAmenintare(m, celCareLoveste, damage * AMENINTARE_IN_JUR);
  });
}


// Cand se linisteste sau moare, uita tot. Altfel, data viitoare cand
// il ataci ar sari direct la cine l-a suparat acum zece minute.
function uitaAmenintarile(mob) {
  if (!mob) return;
  mob.amenintare = [];
  mob.tintaAleasa = null;
}
