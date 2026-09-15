// ==========================================================
//  CIFRELE LUPTEI
//
//  Fisierul asta n-a fost scris de la zero. Tot ce e aici statea
//  pana acum in game.js, la mijlocul celor 6100 de randuri care
//  deseneaza jocul 2D cu Phaser.
//
//  Si acolo era gresit asezat. Cat damage face o lovitura nu e o
//  chestiune de desen: e o REGULA a jocului, ca pretul unei sabii
//  sau cat XP da un lup. Regulile stau in fisierele lor si le
//  citeste oricine are nevoie de ele.
//
//  Cat timp au stat in game.js, lumea 3D nu putea ajunge la ele -
//  fiindca nu incarca game.js, si nici n-are de ce: ala e desenul
//  2D. Ar fi trebuit sa le rescriu acolo inca o data. Doua copii
//  ale aceleiasi formule se despart mai devreme sau mai tarziu, si
//  pe urma acelasi lup face alt damage in doua locuri si nimeni nu
//  stie care are dreptate.
//
//  Asa ca acum sunt aici, intr-un singur loc, si le incarca
//  amandoua paginile: si index.html, si 3d/index.html.
//
//  Cifrele NU s-au schimbat cu nimic. E aceeasi formula, mutata.
// ==========================================================


// Lovesti de atatea ori mai des decat scrie arma, si fiecare
// lovitura face de atatea ori mai putin:
//   1 = exact cat scrie arma (sabia: o lovitura la 2 secunde)
//   3 = de trei ori mai des, fiecare lovitura o treime din damage.
//       Damage-ul PE SECUNDA ramane acelasi, doar ca jocul se simte
//       mult mai viu.
// Daca vrei sa si omori mai repede, nu doar sa lovesti mai des,
// urca numarul FARA sa imparti damage-ul - vezi damageulTau().
const LOVITURI_MAI_DESE = 3;

// ---- Reglaje pentru pasivele de rasa ----
const SANSA_RATARE     = 5;   // % sanse sa ratezi o lovitura obisnuita
const WEAPON_TRAINING  = 3;   // Human: cu atat scad ratarile
const QUICKNESS_DODGE  = 5;   // Duskborn: % sanse sa eviti complet o lovitura
const SANSA_CRITIC_MOB = 5;   // ALES DE MINE - n-ai scris ca mobii dau critical,
                              // dar fara asta pasiva Thick Bone n-ar avea ce reduce


// Un numar intreg intre a si b, capetele incluse.
//
// Pana acum aici scria Phaser.Math.Between. Functia aia e din cutia
// de unelte a jocului 2D, si e singurul motiv pentru care formula
// de damage nu putea pleca din game.js. Face exact atat.
function intreDoua(a, b) {
  return Math.floor(a + Math.random() * (b - a + 1));
}


// ----------------------------------------------------------
//  Cu ce lovesti
//
//  Arma echipata daca ai una intreaga, altfel arma de start - adica
//  pumnii. O arma stricata de tot nu mai loveste, asa ca reparatul
//  chiar conteaza.
// ----------------------------------------------------------
function armaDeAtac() {

  const deStart = personaj.arme.distanta || personaj.arme.corpLaCorp;
  const echipata = (personaj.echipament || {}).armaPrincipala;

  if (!echipata || !echipata.arma || esteStricat(echipata)) return deStart;

  // Pastram numele armei de start (arc, toiag, sabie) - conteaza
  // pentru cum se deseneaza si pentru cum se lupta - dar luam
  // cifrele de la obiectul echipat.
  return {
    nume: deStart.nume,
    dmgMin: echipata.arma.dmgMin,
    dmgMax: echipata.arma.dmgMax,
    viteza: echipata.arma.viteza
  };
}


// ----------------------------------------------------------
//  Cat doare o lovitura
// ----------------------------------------------------------
function damageulTau(arma, attackPower) {
  const dinArma = intreDoua(arma.dmgMin, arma.dmgMax);
  const dinAP = (attackPower / 14) * arma.viteza;

  let damage = (dinArma + dinAP) / LOVITURI_MAI_DESE;

  // Talentele care cresc damage-ul cu arma.
  damage = damage * inmultitorTalent(personaj, 'dmgArma');

  const critic = (Math.random() * 100) < personaj.critical;
  if (critic) damage = damage * 2;

  return { damage: damage, critic: critic };
}


// Armura nu opreste damage-ul, il subtiaza. 485 e pragul: la atata
// armura incasezi jumatate.
function dupaArmura(damage, armura) {
  return damage * (1 - armura / (armura + 485));
}


// La cate milisecunde lovesti din nou.
function pauzaIntreLovituri(arma) {
  return (arma.viteza * 1000) / LOVITURI_MAI_DESE * reducereTalent(personaj, 'viteza');
}


// Dai pe langa?
function ratezi() {
  let sansa = SANSA_RATARE;
  if (personaj.idRasa === 'human') sansa = sansa - WEAPON_TRAINING;
  return (Math.random() * 100) < sansa;
}


// ==========================================================
//  PUTEREA VRAJII
//
//  Mutate tot din game.js, din acelasi motiv: o vraja face acelasi
//  damage indiferent cine deseneaza jocul.
//
//  O vraja lunga primeste tot sporul, una instant doar o parte -
//  altfel ar fi mereu mai bune cele scurte. O vraja care loveste tot
//  in jur primeste jumatate, fiindca loveste mai multi deodata. Iar
//  la ranile care rod in timp, sporul se imparte la ticuri.
// ==========================================================
const INCANTARE_DEPLINA = 3500;    // de la cat primeste o vraja tot
const INCANTARE_MINIMA  = 1500;    // cat se socoteste o vraja instant

function putereaVrajiiFolosita() {
  return (personaj && personaj.putereVrajii) || 0;
}

function coeficientulVrajii(ab) {
  const timp = Math.max(INCANTARE_MINIMA, ab.incantare || 0);
  let c = Math.min(1, timp / INCANTARE_DEPLINA);
  if (ab.fel === 'val') c = c * 0.5;              // loveste tot in jur
  return c;
}

// Cat adauga puterea vrajii la o aruncare.
function sporulVrajii(ab) {
  return putereaVrajiiFolosita() * coeficientulVrajii(ab);
}

// Pentru ranile care rod in timp: totalul se imparte la ticuri.
function sporulRanii(ab) {
  const ticuri = (ab.tine && ab.laCat) ? Math.max(1, ab.tine / ab.laCat) : 1;
  const cat = Math.min(1, (ab.tine || 0) / 15000);
  return (putereaVrajiiFolosita() * cat) / ticuri;
}
