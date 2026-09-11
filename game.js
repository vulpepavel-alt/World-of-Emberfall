// ================================================
//  JOCUL: harta, personajul, inamicii si lupta
// ================================================

const TILE = 32;
const LATIME = 800;
const INALTIME = 450;

const VITEZA = 160;       // viteza personajului tau
const VITEZA_MOB = 45;    // viteza inamicilor cand se plimba linistiti
const VITEZA_MOB_FURIOS = 95;   // viteza cand te urmaresc (tot mai lenta ca tine, ca sa poti fugi)

const RAZA_ATAC = 34;     // cat de aproape trebuie sa fie inamicul ca sa-l lovesti corp la corp
const RAZA_ATAC_DISTANTA = 260;  // de la ce distanta poate trage Hunter cu arcul
const RAZA_PLIMBARE = 96; // cat de departe de locul lui se indeparteaza un inamic linistit
const TIMP_REAPARITIE = 10000;  // dupa cat timp reapare un inamic ucis
const REGENERARE_MOB_SECUNDE = 40;  // in cat timp isi reface un inamic TOATA viata,
                                    // dupa ce a iesit din lupta cu tine

// ---- Lupta ----
const RAZA_AGRO = 92;       // de la ce distanta te observa un inamic si porneste spre tine
const RAZA_LESA = 260;      // daca se departeaza atat de locul lui, renunta si se intoarce
const RAZA_ATAC_MOB = 30;   // de aproape de tot trebuie sa fie ca sa te loveasca
const RAGE_LA_INCASARE = 6; // cat rage castiga Warrior cand INCASEAZA o lovitura
const TIMP_REINVIERE = 3500;  // dupa cat timp te intorci in tabara, dupa ce mori

// Cat de des lovesti, fata de cat scrie viteza armei tale.
//   1 = exact cat scrie arma (sabia: o lovitura la 2 secunde)
//   3 = de trei ori mai des, dar fiecare lovitura face o treime
//       din damage. Damage-ul PE SECUNDA ramane acelasi, doar ca
//       jocul se simte mult mai viu.
// Daca vrei sa si omori mai repede, nu doar sa lovesti mai des,
// urca numarul de aici FARA sa imparti damage-ul - vezi damageulTau().
const LOVITURI_MAI_DESE = 3;


// ================================================
//  TEXTURILE TERENULUI
//
//  Casutele hartii raman de 32 de pixeli - altfel s-ar strica
//  toate coordonatele. Dar fiecare casuta NU mai e o pata de o
//  singura culoare: o desenam din 8 x 8 pixeli mici de cate 4,
//  adica 64 de bucatele, fiecare cu nuanta ei. De aici vine
//  detaliul de joc pe 16 biti.
//
//  Ce textura are fiecare litera se scrie in fisierul zonei,
//  langa culoare: textura: 'iarba'.
// ================================================
const PIXEL = 4;                 // latura unui pixel mare
const PIXELI_PE_CASUTA = TILE / PIXEL;   // 8

// Zgomot statornic: acelasi loc da mereu acelasi numar intre 0 si 1.
// Asa textura nu "fierbe" cand misti camera.
function zgomot(x, y) {
  // Math.imul inmulteste numere intregi FARA sa piarda cifre.
  // Cu inmultirea obisnuita, numarul iesea prea mare, se rotunjea,
  // si zgomotul nu trecea niciodata de 0,5 - adica jumatate din
  // nuantele fiecarei texturi nu se foloseau niciodata.
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

// Face o culoare mai deschisa (cat pozitiv) sau mai inchisa (negativ).
function schimbaLumina(culoare, cat) {
  const r = Math.max(0, Math.min(255, ((culoare >> 16) & 255) + cat));
  const g = Math.max(0, Math.min(255, ((culoare >> 8) & 255) + cat));
  const b = Math.max(0, Math.min(255, (culoare & 255) + cat));
  return (r << 16) | (g << 8) | b;
}

function catreCss(culoare) {
  return '#' + culoare.toString(16).padStart(6, '0');
}

// Cele OPT nuante din care se face textura unei litere.
// Cu sase iesea plat; cu opt incap si umbre adanci, si sclipiri.
//   0-2 = umbre, 3 = culoarea de baza, 4-5 = lumini,
//   6-7 = culoarea a doua (variatie), pentru pete si accente
function paletaTexturii(felul) {
  const baza = felul.culoare;
  const alta = (felul.variatie !== undefined) ? felul.variatie : baza;
  return [
    catreCss(schimbaLumina(baza, -46)),
    catreCss(schimbaLumina(baza, -28)),
    catreCss(schimbaLumina(baza, -13)),
    catreCss(baza),
    catreCss(schimbaLumina(baza, 13)),
    catreCss(schimbaLumina(baza, 28)),
    catreCss(schimbaLumina(alta, 4)),
    catreCss(schimbaLumina(alta, 30))
  ];
}


// Ce nuanta primeste fiecare pixel mic.
//   sx, sy = al catelea pixel e in casuta (0..7)
//   gx, gy = pozitia lui pe toata harta
//   z      = zgomotul acelui loc, intre 0 si 1
//
//  Fiecare textura se face din straturi: un fond pestrit, peste el
//  forme mai mari (smocuri, blocuri, valuri), si la urma cateva
//  sclipiri razlete. Formele mari se socotesc dupa un zgomot "gros"
//  (se uita din 2 in 2 sau din 4 in 4 pixeli), ca sa iasa pete
//  legate, nu punct cu punct.
function nuantaPixelului(textura, sx, sy, gx, gy, z) {
  switch (textura) {

    case 'iarba': {
      // Smocuri inchise, fire mai deschise peste ele, si din loc in
      // loc cate un varf luminat de soare.
      const smoc = zgomot(gx >> 1, gy >> 1);
      const petec = zgomot(gx >> 2, (gy >> 2) + 300);

      if (smoc < 0.16) return z < 0.5 ? 0 : 1;          // smoc des, umbrit
      if (petec > 0.86 && z > 0.72) return 7;           // varf luminat
      if (z > 0.93) return 5;                           // fir strabatut de soare
      if (petec > 0.70) return z < 0.5 ? 4 : 5;         // petec mai insorit
      return z < 0.22 ? 1 : z < 0.50 ? 2 : z < 0.82 ? 3 : 4;
    }

    case 'flori': {
      // Iarba deschisa, presarata cu floricele de doua culori.
      const floare = zgomot(gx >> 1, (gy >> 1) + 51);
      if (floare > 0.955) return 7;                     // petala aprinsa
      if (floare > 0.925) return 6;                     // petala a doua
      if (floare < 0.06) return 1;                      // umbra de sub ele
      return z < 0.18 ? 2 : z < 0.55 ? 3 : z < 0.85 ? 4 : 5;
    }

    case 'pamant': {
      // Drum batatorit: urme late de roata, pietricele, praf.
      const urma = zgomot(gx >> 3, (gy >> 1) + 17);
      const piatra = zgomot(gx, gy + 91);

      if (piatra > 0.975) return 5;                     // pietricica luminata
      if (piatra < 0.02) return 0;                      // gaura mica
      if (urma < 0.24) return z < 0.5 ? 1 : 2;          // urma de roata, mai adanca
      return z < 0.20 ? 2 : z < 0.62 ? 3 : z < 0.88 ? 4 : 5;
    }

    case 'crapat': {
      // Pamant uscat: placi despartite de crapaturi, pe doua marimi.
      const mare = zgomot(Math.floor(gx / 5) + 311, Math.floor(gy / 5) + 977);
      const mica = zgomot(Math.floor(gx / 2) + 44, Math.floor(gy / 2) + 12);

      if (mare < 0.10) return 0;                        // crapatura adanca
      if (mica < 0.07) return 1;                        // crapatura subtire
      if (mare > 0.88) return z < 0.5 ? 4 : 5;          // placa ridicata, insorita
      return z < 0.22 ? 2 : z < 0.70 ? 3 : 4;
    }

    case 'nisip': {
      // Valuri de vant, unele peste altele, si boabe stralucitoare.
      const val = Math.sin(gx * 0.22 + Math.sin(gy * 0.09) * 3.4);
      const bob = zgomot(gx, gy + 7);

      if (bob > 0.985) return 7;                        // bob care sclipeste
      if (val > 0.75) return 5;                         // creasta valului
      if (val < -0.75) return 1;                        // adancitura dintre valuri
      return z < 0.25 ? 2 : z < 0.60 ? 3 : 4;
    }

    case 'apa': {
      // Adancime pe pete mari, valuri peste ea, spuma pe creste.
      const adanc = zgomot(gx >> 2, (gy >> 2) + 61);
      const val = (sy + Math.floor(gx / 3)) % 5;

      if (val === 0 && z > 0.55) return 7;              // spuma
      if (val === 1) return 5;                          // creasta valului
      if (adanc < 0.28) return z < 0.5 ? 0 : 1;         // apa adanca
      return z < 0.35 ? 2 : z < 0.75 ? 3 : 4;
    }

    case 'piatra': {
      // Blocuri cioplite, cu rost intre ele. Fiecare bloc are nuanta
      // lui, muchia de sus luminata si cate o ciobitura.
      if (sx % 4 === 0 || sy % 4 === 0) return 0;       // rostul

      const bloc = zgomot(Math.floor(gx / 4) + 7, Math.floor(gy / 4) + 53);
      const baza = bloc < 0.30 ? 2 : bloc < 0.68 ? 3 : 4;

      if (sy % 4 === 1) return Math.min(5, baza + 1);   // muchia de sus, luminata
      if (sx % 4 === 3) return Math.max(0, baza - 1);   // muchia din dreapta, umbrita
      if (z > 0.96) return 1;                           // ciobitura
      return baza;
    }

    case 'frunzis': {
      // Coroana de copac: manunchiuri de frunze, gauri intre ele,
      // si lumina care cade pe partea de sus-stanga a fiecarui manunchi.
      const petec = zgomot(gx >> 1, (gy >> 1) + 17);
      const gaura = zgomot(gx >> 2, (gy >> 2) + 401);

      if (gaura < 0.16) return 0;                       // gaura dintre ramuri
      if (petec < 0.26) return 1;
      if (petec > 0.80 && z > 0.55) return 5;           // frunza luminata
      if (petec > 0.62) return 4;
      return z < 0.30 ? 2 : z < 0.78 ? 3 : 4;
    }

    case 'lemn': {
      // Scanduri verticale: rost intre ele, fibra pe lung, noduri.
      if (sx % 3 === 0) return 0;                       // rostul dintre scanduri

      const scandura = zgomot(Math.floor(gx / 3) + 5, 0);
      const nod = zgomot(Math.floor(gx / 3) + 5, gy >> 2);
      const fibra = zgomot(Math.floor(gx / 3) + 5, gy);

      if (nod > 0.985) return 0;                        // nod in lemn
      if (fibra < 0.14) return 1;                       // fibra inchisa
      const baza = scandura < 0.40 ? 2 : scandura < 0.75 ? 3 : 4;
      return (sx % 3 === 1) ? Math.min(5, baza + 1) : baza;
    }

    case 'zid': {
      // Randuri de caramizi, decalate din doua in doua, cu mortar.
      const rand = Math.floor(gy / 3);
      const decalaj = (rand % 2) ? 2 : 0;
      const colCaramida = Math.floor((gx + decalaj) / 5);

      if (gy % 3 === 0) return 1;                       // mortarul orizontal
      if ((gx + decalaj) % 5 === 0) return 1;           // mortarul vertical

      const caramida = zgomot(colCaramida + 3, rand + 71);
      const baza = caramida < 0.32 ? 2 : caramida < 0.70 ? 3 : 4;
      if (gy % 3 === 1) return Math.min(5, baza + 1);   // muchia de sus
      return z > 0.90 ? Math.max(0, baza - 1) : baza;
    }

    case 'tigla': {
      // Olane suprapuse: fiecare rand isi umbreste randul de dedesubt.
      const rand = Math.floor(gy / 3);
      const decalaj = (rand % 2) ? 2 : 0;
      const olan = zgomot(Math.floor((gx + decalaj) / 4) + 9, rand + 31);

      if (gy % 3 === 0) return Math.min(5, 4 + (olan > 0.6 ? 1 : 0));  // muchia luminata
      if (gy % 3 === 2) return 1;                                       // umbra de sub olan
      if ((gx + decalaj) % 4 === 0) return 2;                           // santul dintre olane
      return olan < 0.45 ? 3 : 4;
    }

    case 'foc': {
      // Flacara: miez alb-galben, valuri de foc in jur, funingine la margini.
      const limba = zgomot(gx >> 1, (gy >> 1) + 5);
      if (limba > 0.80 && z > 0.4) return 7;            // miezul
      if (limba > 0.55) return 5;
      if (limba < 0.18) return 1;                       // fum
      return z < 0.4 ? 3 : 4;
    }

    default:
      // 'neted' - o singura culoare, cu o urma de zgomot ca sa nu fie
      // o suprafata moarta.
      return z < 0.15 ? 2 : z < 0.85 ? 3 : 4;
  }
}


// ================================================
//  CULORILE INTERFETEI
//
//  Stil de RPG pe calculator din anii '90: piatra intunecata,
//  chenare de alama, litere cu serife, pergament.
//  Toate culorile stau AICI, intr-un singur loc - schimbi una
//  si se schimba peste tot.
// ================================================
const UI = {
  piatra:       0x14100c,   // fundalul panourilor
  piatraMoale:  0x241c12,   // fundalul cutiilor dinauntru
  alama:        0x8a6a2f,   // chenarul
  alamaInchisa: 0x2e2311,   // linia din afara chenarului
  alamaLucioasa: 0xc9a961,  // muchia luminata si tintele din colturi

  text:       '#e8dcc0',    // pergament
  textAuriu:  '#d9b555',
  textStins:  '#a08a63',

  viata:       0x4a7c2f,    // verde inchis, ca ai cerut bara verde
  rage:        0x9c3323,
  mana:        0x33529c,
  santBara:    0x0d0a06,    // adancitura in care sta bara

  FONT: 'Georgia, "Palatino Linotype", "Times New Roman", serif'
};


// Construieste un panou de piatra cu chenar de alama si tinte
// in colturi. Da inapoi bucatile, in ordinea de desenat.
function faPanou(scena, x, y, latime, inaltime) {

  const bucati = [];

  // linia intunecata din afara
  const afara = scena.add.rectangle(x, y, latime, inaltime, UI.alamaInchisa).setOrigin(0, 0);
  bucati.push(afara);

  // chenarul de alama
  const chenar = scena.add.rectangle(x + 2, y + 2, latime - 4, inaltime - 4, UI.alama).setOrigin(0, 0);
  bucati.push(chenar);

  // piatra dinauntru
  const piatra = scena.add.rectangle(x + 4, y + 4, latime - 8, inaltime - 8, UI.piatra, 0.94).setOrigin(0, 0);
  bucati.push(piatra);

  // tintele din cele patru colturi
  [[x + 4, y + 4], [x + latime - 8, y + 4],
   [x + 4, y + inaltime - 8], [x + latime - 8, y + inaltime - 8]]
    .forEach(function (p) {
      bucati.push(scena.add.rectangle(p[0], p[1], 4, 4, UI.alamaLucioasa).setOrigin(0, 0));
    });

  return bucati;
}


// O bara (viata, resursa) sapata in piatra, cu chenar de alama.
function faSantBara(scena, x, y, latime, inaltime) {
  const sant = scena.add.rectangle(x, y, latime, inaltime, UI.santBara).setOrigin(0, 0);
  sant.setStrokeStyle(1, UI.alama);
  return sant;
}


// ---- HARTA ----
// Harta NU mai este scrisa aici. Fiecare zona sta in fisierul ei,
// in dosarul "zone". Jocul citeste zona din variabila de mai jos
// si construieste totul din ea.
let zona = null;

// Unde e butonul de ATAC pe ecran si cat de mare e.
// Butoanele sunt facute pentru DEGET, nu pentru mouse: cercurile
// sunt mari, iar zona pe care o poti atinge e cu inca 12 pixeli mai
// larga decat cercul desenat, ca sa nu ratezi cand apesi grabit.
const BUTON_X = LATIME - 64;
const BUTON_Y = INALTIME - 64;
const BUTON_RAZA = 52;
const BUTON_RAZA_ABILITATE = 44;
const MARGINE_ATINGERE = 12;       // cu cat e zona de atins mai mare decat cercul
const SPATIU_BUTOANE = 20;         // spatiul dintre doua butoane vecine
const CULOARE_ABILITATE_GATA   = 0x2b3d6b;   // piatra albastra: abilitatea poate fi apasata
const CULOARE_ABILITATE_STINSA = 0x241f19;   // piatra stinsa: n-ai mana sau rage

// ---- Joystick-ul de pe telefon ----
// Un cerc in stanga jos: pui degetul pe el si tragi incotro vrei
// sa mergi. Cu cat tragi mai departe de mijloc, cu atat mai clar
// e directia (viteza ramane aceeasi).
const JOY_X = 116;
const JOY_Y = INALTIME - 104;
const JOY_RAZA = 58;             // cercul mare, de fundal
const JOY_RAZA_MANETA = 26;      // bila pe care o tragi
const JOY_ZONA_MOARTA = 9;       // sub atatia pixeli de la mijloc, nu te misti

// ---- Miniharta din dreapta sus ----
const MINI_LAT = 132;                    // latura ferestrei
const MINI_X = LATIME - MINI_LAT - 12;
const MINI_Y = 12;
const MINI_SCARA = 0.17;                 // cat de mult se micsoreaza harta in ea

// ---- Butonul care deschide meniul, sub miniharta ----
// ---- Butonul de interactiune ----
const INTERACT_RAZA = 40;
const INTERACT_X = BUTON_X;
const INTERACT_Y = BUTON_Y - BUTON_RAZA - INTERACT_RAZA - 10;
const CULOARE_INTERACT_GATA  = 0x2f5a2b;   // piatra verde: ai ceva langa tine
const CULOARE_INTERACT_STINS = 0x241f19;   // piatra stinsa: n-ai ce deschide

let butonInteract = null;

const MENU_RAZA = 30;
const MENU_X = MINI_X + MINI_LAT / 2;
const MENU_Y = MINI_Y + MINI_LAT + 30;


const config = {
  type: Phaser.AUTO,
  width: LATIME,
  height: INALTIME,
  backgroundColor: '#111111',
  pixelArt: true,
  // Jocul se micsoreaza/mareste singur ca sa incapa mereu in fereastra,
  // pastrandu-si forma. Asta ne trebuie si mai tarziu, pe ecranul telefonului.
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    create: create,
    update: update
  }
};

// ATENTIE: jocul NU mai porneste singur.
// Porneste abia cand apesi "Intra in lume" in meniul de creare,
// care apeleaza functia porneste() de mai jos cu personajul ales.
// salvarea (optional) spune in ce zona erai si pe ce loc de pe harta.
let locDePornire = null;

function porneste(personajAles, salvarea) {

  personaj = personajAles;

  // Daca vii dintr-o salvare, te intorci in zona in care erai -
  // nu in cea a rasei, ca sa nu te mute jocul din greseala.
  const reteta = (salvarea && salvarea.zona && retetaZonei(salvarea.zona))
    || retetaZonei(ZONA_DE_START[personaj.idRasa])
    || ZONE[0];

  zona = faZona(reteta);

  locDePornire = (salvarea && salvarea.x !== null && salvarea.x !== undefined)
    ? { x: salvarea.x, y: salvarea.y }
    : null;

  jocul = new Phaser.Game(config);
}


// Tinem minte jocul pornit, ca sa-l putem opri la Log out.
let jocul = null;


// Iesi din lume si te intorci la alegerea personajului.
// Salvam intai: n-are rost sa pierzi ultimele minute de joc.
function iesiDinLume() {

  salveaza();

  const g = jocul;
  jocul = null;
  if (g) g.destroy(true);

  // ATENTIE: Phaser NU se inchide pe loc. Mai face un pas - miscarile
  // in curs, ceasurile - si abia apoi se opreste. Pasul ala are inca
  // nevoie de personaj. Daca golim aici, el cauta un personaj care nu
  // mai exista si crapa. De aceea golim abia dupa ce a trecut pasul.
  setTimeout(curataLumea, 0);
}


function curataLumea(pastreazaPersonajul) {

  if (!pastreazaPersonajul) personaj = null;
  zona = null;
  jucator = null;
  mobi = [];
  npci = [];
  saci = [];
  bucatiTeren = {};
  terenMic = null;
  butonInteract = null;
  tinteDeMisiune = null;
  if (!pastreazaPersonajul) slotulCurent = null;

  // Panza jocului inchis trebuie scoasa din pagina cu mana. Altfel
  // ramane acolo, si la urmatoarea intrare ai doua panze una peste alta.
  document.querySelectorAll('body > canvas').forEach(function (c) { c.remove(); });
}


// ----------------------------------------------------------
//  Ecranul de incarcare
// ----------------------------------------------------------
const ecranIncarcare = document.getElementById('ecran-incarcare');

function aratafIncarcarea(numeZona, niveluri) {
  document.getElementById('nume-zonei-noi').textContent = numeZona;
  document.getElementById('nivel-zonei-noi').textContent = TEXT.LEVEL + ' ' + niveluri;
  ecranIncarcare.classList.remove('ascuns');
}

function ascundeIncarcarea() {
  ecranIncarcare.classList.add('ascuns');
}


// ==========================================================
//  TRECEREA DINTR-O ZONA IN ALTA
//
//  Zona noua nu e scrisa nicaieri: se construieste acum, si dureaza
//  vreo trei zecimi de secunda. In timpul asta se vede un ecran de
//  incarcare, ca sa nu para ca jocul a inghetat.
// ==========================================================
function treciInZona(idZona, dinspre) {

  const reteta = retetaZonei(idZona);
  if (!reteta) { treceInCurs = false; return; }

  salveaza();
  aratafIncarcarea(reteta.nume, reteta.nivelDeLa + '-' + reteta.nivelPanaLa);

  // Lasam browserul sa deseneze ecranul de incarcare inainte sa ne
  // apucam de treaba grea. Fara pauza asta, ecranul n-ar apuca sa
  // apara si ai vedea doar o secunda de joc inghetat.
  setTimeout(function () {

    const scena = jucator.scene;

    // ATENTIE - aici era eroarea.
    //
    // Prima data inchideam tot jocul Phaser si porneam altul pentru
    // zona noua. Jocul nou pornea, desena o data, si apoi scena lui
    // nu mai era pusa niciodata la treaba: ceasul mergea, se vedea
    // imaginea, dar update() nu se mai chema deloc. Nu se mai misca
    // nimic si nicio poarta nu mai raspundea.
    //
    // Acum NU mai inchidem jocul. Pastram aceeasi scena si o pornim
    // din nou cu restart(), care cheama create() inca o data - de
    // data asta cu zona cea noua. Un singur joc, de la inceput pana
    // la sfarsit, si nimic de racordat intre ele.
    curataZonaVeche(scena);
    zona = faZona(reteta);

    // Daca ai venit pe apa, apari langa portul de aici, nu pe margine.
    const peApa = zona.portul && zona.portul.catre === dinspre;

    if (peApa) {
      locDePornire = {
        x: (zona.portul.col + 8) * TILE + TILE / 2,
        y: (zona.portul.rand + 8) * TILE + TILE / 2
      };
    } else {
      // Intri pe latura dinspre care ai venit, dar NU chiar pe poarta:
      // te-ar trimite inapoi pe loc. Cu zece casute mai inauntru.
      const intrare = zona.treceri.find(function (tr) { return tr.catre === dinspre; });
      locDePornire = intrare
        ? { x: (intrare.col + intrare.spreInauntruC * 10) * TILE + TILE / 2,
            y: (intrare.rand + intrare.spreInauntruR * 10) * TILE + TILE / 2 }
        : { x: zona.start.col * TILE + TILE / 2,
            y: zona.start.rand * TILE + TILE / 2 };
    }

    abiaAmIntrat = true;
    scena.scene.restart();

    // restart() cheama create() la urmatorul cadru, nu acum. Asteptam
    // sa se faca, altfel am ascunde ecranul de incarcare peste o zona
    // care inca nu e desenata.
    setTimeout(function () {
      ascundeIncarcarea();
      treceInCurs = false;
      salveaza();
    }, 60);
  }, 60);
}


// Ce trebuie sters cand schimbam zona, dar PASTRAM jocul.
//
// Bucatile de harta si poza minihartii sunt poze tinute de Phaser.
// Ele nu dispar odata cu scena, asa ca daca nu le stergem cu mana
// raman acolo pentru totdeauna si se aduna la fiecare zona.
function curataZonaVeche(scena) {

  vietati = [];

  Object.keys(bucatiTeren).forEach(function (nume) {
    const imagine = bucatiTeren[nume];
    const cheie = imagine && imagine.texture && imagine.texture.key;
    if (cheie && scena.textures.exists(cheie)) scena.textures.remove(cheie);
  });
  bucatiTeren = {};
  coadaBucati = [];

  if (terenMic) {
    const cheie = terenMic.texture && terenMic.texture.key;
    if (cheie && scena.textures.exists(cheie)) scena.textures.remove(cheie);
    terenMic = null;
  }

  // Listele se golesc; obiectele din ele le sterge restart() singur.
  mobi = [];
  npci = [];
  saci = [];
  vietati = [];
  butonInteract = null;
  tinteDeMisiune = null;
}


// Cat timp treci dintr-o zona in alta, personajul ramane al tau:
// golim doar lumea, nu si pe tine.
let treceInCurs = false;

const RAZA_TRECERE = 42;    // de cat de aproape de poarta te ia

// Cat timp e true, portile nu te iau. Se face false de indata ce
// te-ai departat de toate - ca sa nu fii trimis inapoi imediat ce
// ai intrat intr-o zona noua.
let abiaAmIntrat = false;


// Se cheama in fiecare cadru: ai ajuns pe o poarta catre alta zona?
function verificaTrecerea() {

  if (treceInCurs || !zona || !zona.treceri) return;

  let langaVreoPoarta = false;

  for (const tr of zona.treceri) {
    const x = tr.col * TILE + TILE / 2;
    const y = tr.rand * TILE + TILE / 2;
    if (Phaser.Math.Distance.Between(jucator.x, jucator.y, x, y) > RAZA_TRECERE) continue;

    langaVreoPoarta = true;
    if (abiaAmIntrat) continue;

    treceInCurs = true;
    treciInZona(tr.catre, zona.id);
    return;
  }

  // --- portul: corabia sau zeppelinul spre celalalt continent ---
  if (zona.portul) {
    const x = zona.portul.col * TILE + TILE / 2;
    const y = zona.portul.rand * TILE + TILE / 2;
    if (Phaser.Math.Distance.Between(jucator.x, jucator.y, x, y) <= RAZA_TRECERE) {
      langaVreoPoarta = true;
      if (!abiaAmIntrat) {
        treceInCurs = true;
        treciInZona(zona.portul.catre, zona.id);
        return;
      }
    }
  }

  // Te-ai departat de toate portile: de acum te pot lua din nou.
  if (abiaAmIntrat && !langaVreoPoarta) abiaAmIntrat = false;
}


// ---- Lucruri pe care le tinem minte cat timp jocul ruleaza ----
let personaj = null;        // personajul ales in meniu (rasa, clasa, statistici)
let jucator;
let armaJucator;
let scutJucator = null;
let etichetaNume;
let bucatiCorp = [];
let directie = 'jos';       // incotro e intors personajul
let taste;
let tinta = null;

let mobi = [];              // toti inamicii de pe harta
let urmatorulAtac = 0;      // momentul cand ai voie sa lovesti din nou
let mort = false;           // esti mort si astepti sa te intorci?
let butoane = [];           // butoanele din dreapta jos
let manetaJoystick;         // bila din mijlocul joystick-ului
let degetJoystick = null;   // ce deget tine joystick-ul (pe telefon poti avea mai multe)
let mersJoystick = { x: 0, y: 0 };
let npci = [];              // personajele prietenoase, ca sa le punem pe miniharta
let nivelText;              // scrisul cu nivelul, din rama
let barXp;                  // bara de experienta
let textXp;
let terenMic;               // harta micsorata, din care decupam miniharta
let minihartaPanza;         // fereastra minihartii

// Bucatile din rama personajului, ca sa le putem schimba mai tarziu.
let barViata;
let textViata;
let barResursa;
let textResursa;
const LATIME_BARA = 130;    // lungimea barei cand esti plin
const LATIME_BARA_XP = 182;  // lungimea barei de experienta cand e plina

// Cand ai lovit ultima oara. Din asta stim daca esti "in lupta".
let ultimaLupta = -99999;

// ---- Numere de reglaj pentru resurse ----
// ATENTIE: astea sunt alese de mine, nu sunt din specificatia ta.
// Le schimbi linistita cand vrei sa echilibram jocul.
const IESIRE_DIN_LUPTA   = 5000;  // dupa atatea milisecunde fara lovituri, esti iesit din lupta
const RAGE_MAXIM         = 100;
const RAGE_PE_LOVITURA   = 12;    // cat rage castigi cand nimeresti
const RAGE_SCURS_PE_SEC  = 25;    // cat rage pierzi pe secunda in afara luptei
const SPIRIT_PER_MANA    = 5;     // mana pe secunda = Spirit impartit la 5


// ---- Reglaje pentru cele 4 pasive de clasa ----
// Cifrele vin din descrierile scrise de tine in personaj.js.
const BATTLE_FURY_PRAG    = 0.30; // Warrior: sub 30% viata incepe sa dea mai mult rage
const BATTLE_FURY_SPOR    = 0.50; // ...pana la +50% cand esti aproape mort
const HUNTERS_EYE_SECUNDE = 3;    // Hunter: primele 3 secunde de lupta
const HUNTERS_EYE_SPOR    = 0.25; // ...+25% damage la sageti
const ARCANE_BARRIER_SCUT = 15;   // Mage: scut care inghite 15 damage
const INNER_WILL_MANA     = 2;    // Priest: 2 mana pe secunda, chiar si in lupta

// ---- Reglaje pentru cele 8 pasive de RASA ----
const SANSA_RATARE        = 5;      // % sanse sa ratezi o lovitura obisnuita
const WEAPON_TRAINING     = 3;      // Human: cu atat scad ratarile
const QUICKNESS_DODGE     = 5;      // Night Elf: % sanse sa eviti complet o lovitura
const SHADOWMELD_SECUNDE  = 2;      // Night Elf: cat stai nemiscat ca sa te piarda
const BLOOD_FURY_SPOR     = 0.50;   // Orc: +50% Attack Power
const BLOOD_FURY_DUREAZA  = 15000;  // ...timp de 15 secunde
const BLOOD_FURY_PAUZA    = 120000; // ...o data la 2 minute
const HARDINESS_REDUCERE  = 0.15;   // Orc: cu 15% mai putin damage din critical
const SANSA_CRITIC_MOB    = 5;      // ALES DE MINE - tu n-ai scris ca mobii dau critical,
                                    // dar fara asta pasiva Hardiness n-ar avea ce reduce
const CANIBALIZARE_PARTE  = 0.30;   // Undead: 30% din viata maxima...
const CANIBALIZARE_SECUNDE = 10;    // ...intinsa pe 10 secunde, dupa ce omori ceva
const WILL_FORSAKEN_PARTE = 0.01;   // Undead: 1% viata maxima pe secunda, mereu
const REGEN_VIATA_SPIRIT  = 10;     // ALES DE MINE - viata pe secunda in afara luptei
                                    // = Spirit impartit la 10

// Cat tine Blood Fury si cand poate reveni.
let bloodFuryPanaLa = 0;
let bloodFuryUrmatorul = 0;

// Cat mai tine vindecarea de la Cannibalize.
let canibalizarePanaLa = 0;

// Cand te-ai miscat ultima oara (pentru Shadowmeld).
let ultimaMiscare = 0;


// Cifrele abilitatilor NU mai stau aici: fiecare abilitate isi are
// costul, pauza si damage-ul scrise langa ea, in personaj.js.

// Bara de incantare de deasupra capului.
let baraCast;
let fundalCast;

// Cand a INCEPUT lupta de acum (nu cand ai lovit ultima oara).
let inceputLupta = -99999;

// Scutul de la Arcane Barrier: cat damage mai poate inghiti.
let scut = 0;
let textScut;


// ================================================
//  create - se intampla O SINGURA DATA, la pornire
// ================================================
function create() {

  const coloane = zona.harta[0].length;
  const randuri = zona.harta.length;

  // --- Harta ---
  // Fiecare casuta se desenaza din 8 x 8 pixeli mici, fiecare cu
  // nuanta lui, dupa textura scrisa in fisierul zonei.
  //
  // Tot desenul se face O SINGURA DATA, pe o panza, care apoi se
  // pune pe ecran ca o singura poza. Altfel telefonul ar avea de
  // desenat peste 180.000 de patratele in fiecare clipa.
  deseneazaTerenul(this, coloane, randuri);

  // --- Personajul tau ---
  jucator = this.add.container(
    locDePornire ? locDePornire.x : zona.start.col * TILE + TILE / 2,
    locDePornire ? locDePornire.y : zona.start.rand * TILE + TILE / 2
  );
  // Culorile si infatisarea vin din meniul de creare.
  const umbraJucator = faUmbra(this, 22);
  const bucatiPersonaj = deseneazaForme(this, deseneazaInfatisarea(this));

  // Numele personajului, scris deasupra capului.
  const eticheta = this.add.text(0, -38, personaj.nume, {
    fontFamily: UI.FONT,
    fontSize: '11px',
    color: UI.textAuriu,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5);

  // Arma sta intr-un container separat, ca sa se poata misca
  // singura atunci cand ataci. Hunter tine arc, restul sabie.
  armaJucator = faArmaJucator(this);
  scutJucator = faScutJucator(this);
  asazaArma();

  // Bara de incantare, deasupra capului. Se vede doar la Mage,
  // cat timp se pregateste vraja.
  fundalCast = this.add.rectangle(0, -47, 46, 8, 0x000000, 0.75).setVisible(false);
  baraCast = this.add.rectangle(-22, -50, 44, 4, 0x8fd0ff).setOrigin(0, 0).setVisible(false);

  bucatiCorp = bucatiPersonaj;
  etichetaNume = eticheta;
  jucator.add([umbraJucator].concat(bucatiPersonaj,
    scutJucator ? [scutJucator] : [], [armaJucator, fundalCast, baraCast, eticheta]));
  jucator.setDepth(10);

  // --- Inamicii, exact unde ii scrie zona ---
  mobi = [];
  vietati = [];
  saci.forEach(function (sac) { sac.destroy(); });
  saci = [];
  // Inamicii apar si dispar dupa cum te apropii, la fel ca bucatile
  // de harta. Aici doar stergem semnele ramase de la o intrare veche.
  zona.mobi.forEach(function (loc) { loc.aparut = false; loc.mortPanaLa = 0; });
  actualizeazaMobii(this);

  // --- Personajele prietenoase din zona ---
  npci = [];
  (zona.npci || []).forEach(loc => creeazaNpc(this, loc));

  // --- Comenzi ---
  // Mersul se face din W A S D. Fiecare litera primeste un nume
  // romanesc, ca sa se citeasca usor mai jos, in update().
  taste = this.input.keyboard.addKeys({
    sus:     Phaser.Input.Keyboard.KeyCodes.W,
    stanga:  Phaser.Input.Keyboard.KeyCodes.A,
    jos:     Phaser.Input.Keyboard.KeyCodes.S,
    dreapta: Phaser.Input.Keyboard.KeyCodes.D
  });

  // Tasta Spatiu = atac (pe calculator).
  this.input.keyboard.on('keydown-SPACE', () => ataca(this));

  // Pe telefon poti tine un deget pe joystick si apasa cu altul
  // pe un buton, deci ii cerem lui Phaser sa urmareasca mai multe.
  this.input.addPointer(2);

  // Click / deget: intai joystick-ul, apoi butoanele, apoi harta.
  this.input.on('pointerdown', (pointer) => {

    // Ai pus degetul pe joystick?
    if (degetJoystick === null &&
        Phaser.Math.Distance.Between(pointer.x, pointer.y, JOY_X, JOY_Y) <= JOY_RAZA + 14) {
      degetJoystick = pointer.id;
      mutaJoystick(pointer);
      return;
    }

    // Zonele de atins ale butoanelor se ating intre ele, ca sa nu
    // ramana gauri moarte. De aceea nu luam primul buton nimerit,
    // ci pe CEL MAI APROPIAT de locul unde ai pus degetul.
    let celMaiAproape = null;
    let ceaMaiMicaDistanta = Infinity;

    for (const b of butoane) {
      const d = Phaser.Math.Distance.Between(pointer.x, pointer.y, b.x, b.y);
      if (d <= b.raza && d < ceaMaiMicaDistanta) {
        ceaMaiMicaDistanta = d;
        celMaiAproape = b;
      }
    }

    if (celMaiAproape) {
      clipesteButonul(this, celMaiAproape);
      celMaiAproape.apasa(this);
      return;
    }

    // Ai apasat pe miniharta? Atunci se deschide harta lumii.
    if (pointer.x >= MINI_X && pointer.x <= MINI_X + MINI_LAT &&
        pointer.y >= MINI_Y && pointer.y <= MINI_Y + MINI_LAT) {
      deschideHarta();
      return;
    }

    // Ai atins un sac de prada sau un negustor? Atunci nu pornim
    // spre locul atins, ci deschidem fereastra lui.
    if (atingiCeva(this, pointer.worldX, pointer.worldY)) return;

    tinta = { x: pointer.worldX, y: pointer.worldY };
  });

  this.input.on('pointermove', (pointer) => {
    if (degetJoystick === pointer.id) mutaJoystick(pointer);
  });

  this.input.on('pointerup', (pointer) => {
    if (degetJoystick === pointer.id) lasaJoystick();
  });

  // Pe calculator: tastele 1, 2... pentru abilitati.
  this.input.keyboard.on('keydown-ONE', () => {
    if (personaj.abilitati[0]) folosesteAbilitate(this, personaj.abilitati[0]);
  });
  this.input.keyboard.on('keydown-TWO', () => {
    if (personaj.abilitati[1]) folosesteAbilitate(this, personaj.abilitati[1]);
  });

  // --- Camera ---
  this.cameras.main.setBounds(0, 0, coloane * TILE, randuri * TILE);
  this.cameras.main.startFollow(jucator, true, 0.12, 0.12);

  // Punem camera pe tine ACUM, nu la primul cadru: altfel primele
  // bucati de harta s-ar desena in coltul din stanga sus, unde nu esti.
  this.cameras.main.centerOn(jucator.x, jucator.y);

  // Bucatile din jurul tau se deseneaza inainte de primul cadru, ca
  // sa nu intri intr-o zona goala. Cele mai departate vin din mers.
  actualizeazaTerenul(this, true);

  // --- Joystick-ul, butoanele si miniharta ---
  faJoystick(this);
  faButoane(this);
  faMiniharta(this);

  // --- Rama personajului, stanga sus ---
  faRamaPersonaj(this);

  // Statisticile se socotesc din nou acum, la sfarsit.
  //
  // Conteaza mai ales cand vii dintr-o salvare: personajul incarcat
  // are echipamentul pe el, dar cifrele lui erau inca cele de la un
  // personaj gol. Fara randul asta, intrai cu un coif care iti dadea
  // +5 Strength si +2 Stamina scrise in meniu, dar cu viata si
  // attack power ca si cum n-ai fi avut nimic pe tine.
  aplicaTalentele();
  personaj.viata = personaj.viataMaxima;
  if (personaj.resursa === 'mana') personaj.mana = personaj.manaMaxima;
  actualizeazaBaraViata();
  actualizeazaBaraResursa();
  actualizeazaNivelul();
}


// ================================================
//  DESENAREA TERENULUI, PE BUCATI
//
//  Pana acum desenam TOATA harta intr-o singura poza, la intrare.
//  Mergea pentru o harta mica. La o harta cat Elwynn Forest, poza
//  ar avea 22.000 x 14.800 de pixeli - peste un gigabait de
//  memorie. Telefonul s-ar inchide.
//
//  Acum harta e taiata in bucati patrate de cate 8 casute.
//  Desenam doar bucatile din jurul tau, iar pe cele ramase mult
//  in urma le stergem. Pe ecran arata exact la fel; diferenta e
//  ca jocul nu mai tine minte decat o mana de bucati o data.
// ================================================
const CHUNK = 8;                    // cate casute are o bucata pe latura
const CHUNK_PX = CHUNK * TILE;      // 256 de pixeli
const MARGINE_CHUNK = 1;            // cate bucati tinem gata in jurul ecranului
const MARGINE_STERGERE = 3;         // dincolo de atatea bucati, stergem
const MILISECUNDE_PE_CADRU = 4;     // cat lucram la bucati noi intr-un cadru

let bucatiTeren = {};      // 'coloana,rand' -> imaginea acelei bucati
let coadaBucati = [];      // bucatile care mai trebuie desenate
let paleteTeren = {};      // nuantele fiecarei litere, socotite o data


function cheiaBucatii(bc, br) {
  return 'teren-' + zona.nume + '-' + bc + '-' + br;
}


// Deseneaza o singura bucata de harta si o pune pe ecran.
function construiesteBucata(scena, bc, br) {

  const nume = bc + ',' + br;
  if (bucatiTeren[nume]) return;

  const coloane = zona.harta[0].length;
  const randuri = zona.harta.length;

  const cheie = cheiaBucatii(bc, br);
  if (scena.textures.exists(cheie)) scena.textures.remove(cheie);

  const panza = scena.textures.createCanvas(cheie, CHUNK_PX, CHUNK_PX);
  const ctx = panza.getContext();

  for (let r = br * CHUNK; r < (br + 1) * CHUNK; r++) {
    if (r >= randuri) break;

    for (let c = bc * CHUNK; c < (bc + 1) * CHUNK; c++) {
      if (c >= coloane) break;

      const litera = zona.harta[r][c];
      const felul = zona.teren[litera];
      if (!felul) continue;

      const paleta = paleteTeren[litera];
      const textura = felul.textura || 'neted';

      // Unde cade casuta INAUNTRUL bucatii.
      const localX = (c - bc * CHUNK) * TILE;
      const localY = (r - br * CHUNK) * TILE;

      for (let sy = 0; sy < PIXELI_PE_CASUTA; sy++) {
        for (let sx = 0; sx < PIXELI_PE_CASUTA; sx++) {

          // Zgomotul se socoteste dupa locul de pe TOATA harta, nu
          // dupa cel din bucata. Altfel s-ar vedea cusatura dintre
          // bucati, fiindca fiecare ar incepe textura de la capat.
          const gx = c * PIXELI_PE_CASUTA + sx;
          const gy = r * PIXELI_PE_CASUTA + sy;

          ctx.fillStyle = paleta[nuantaPixelului(textura, sx, sy, gx, gy, zgomot(gx, gy))];
          ctx.fillRect(localX + sx * PIXEL, localY + sy * PIXEL, PIXEL, PIXEL);
        }
      }
    }
  }

  panza.refresh();
  bucatiTeren[nume] = scena.add.image(bc * CHUNK_PX, br * CHUNK_PX, cheie)
    .setOrigin(0, 0).setDepth(0);
}


// Sterge o bucata si elibereaza memoria ei.
function stergeBucata(scena, nume) {
  const imagine = bucatiTeren[nume];
  if (!imagine) return;
  const cheie = imagine.texture.key;
  imagine.destroy();
  delete bucatiTeren[nume];
  if (scena.textures.exists(cheie)) scena.textures.remove(cheie);
}


// Ce bucati se vad acum, cu totul cu marginea de siguranta.
function bucatileDinJur(scena, margine) {
  const cam = scena.cameras.main;
  return {
    c1: Math.floor(cam.scrollX / CHUNK_PX) - margine,
    c2: Math.floor((cam.scrollX + cam.width) / CHUNK_PX) + margine,
    r1: Math.floor(cam.scrollY / CHUNK_PX) - margine,
    r2: Math.floor((cam.scrollY + cam.height) / CHUNK_PX) + margine
  };
}


// Se cheama in fiecare cadru: cere bucatile noi si le sterge pe
// cele ramase departe in urma.
// totOdata = true doar la intrarea in zona: atunci le desenam pe
// toate dintr-un foc, ca sa nu apuci sa vezi harta pe jumatate goala.
function actualizeazaTerenul(scena, totOdata) {

  if (!zona || !scena || !scena.cameras) return;

  const ultimaColoana = Math.ceil(zona.harta[0].length / CHUNK) - 1;
  const ultimulRand   = Math.ceil(zona.harta.length / CHUNK) - 1;

  // --- ce ne trebuie ---
  const nevoie = bucatileDinJur(scena, MARGINE_CHUNK);
  coadaBucati = [];

  for (let br = Math.max(0, nevoie.r1); br <= Math.min(ultimulRand, nevoie.r2); br++) {
    for (let bc = Math.max(0, nevoie.c1); bc <= Math.min(ultimaColoana, nevoie.c2); bc++) {
      if (!bucatiTeren[bc + ',' + br]) coadaBucati.push([bc, br]);
    }
  }

  // --- desenam cat apucam intr-un cadru ---
  const inceput = performance.now();
  while (coadaBucati.length > 0 &&
         (totOdata || performance.now() - inceput < MILISECUNDE_PE_CADRU)) {
    const b = coadaBucati.shift();
    construiesteBucata(scena, b[0], b[1]);
  }

  // --- ce e departe, aruncam ---
  const pastram = bucatileDinJur(scena, MARGINE_STERGERE);
  Object.keys(bucatiTeren).forEach(function (nume) {
    const parti = nume.split(',');
    const bc = Number(parti[0]);
    const br = Number(parti[1]);
    if (bc < pastram.c1 || bc > pastram.c2 || br < pastram.r1 || br > pastram.r2) {
      stergeBucata(scena, nume);
    }
  });
}


// ================================================
//  HARTA MICA, PENTRU MINIHARTA
//
//  O poza in care o casuta intreaga e doar 2 pixeli. Pentru o
//  harta uriasa iese o poza mica si usoara, si o putem tine
//  toata in memorie ca sa avem mereu miniharta completa.
// ================================================
const MINI_PIXEL_PE_CASUTA = 2;

function faHartaMica(scena) {

  const coloane = zona.harta[0].length;
  const randuri = zona.harta.length;

  const cheie = 'harta-mica-' + zona.nume;
  if (terenMic) { terenMic.destroy(); terenMic = null; }
  if (scena.textures.exists(cheie)) scena.textures.remove(cheie);

  const panza = scena.textures.createCanvas(cheie,
    coloane * MINI_PIXEL_PE_CASUTA, randuri * MINI_PIXEL_PE_CASUTA);
  const ctx = panza.getContext();

  for (let r = 0; r < randuri; r++) {
    for (let c = 0; c < coloane; c++) {
      const felul = zona.teren[zona.harta[r][c]];
      if (!felul) continue;
      ctx.fillStyle = catreCss(felul.culoare);
      ctx.fillRect(c * MINI_PIXEL_PE_CASUTA, r * MINI_PIXEL_PE_CASUTA,
                   MINI_PIXEL_PE_CASUTA, MINI_PIXEL_PE_CASUTA);
    }
  }
  panza.refresh();

  // O casuta are TILE pixeli in joc si MINI_PIXEL_PE_CASUTA in poza
  // asta, deci o marim de atatea ori ca socoteala minihartii sa ramana
  // aceeasi: un pixel de joc inseamna MINI_SCARA pixeli de miniharta.
  terenMic = scena.add.image(0, 0, cheie)
    .setOrigin(0, 0)
    .setScale(TILE * MINI_SCARA / MINI_PIXEL_PE_CASUTA)
    .setVisible(false);
}


// Se cheama o data, la intrarea in zona.
function deseneazaTerenul(scena, coloane, randuri) {

  const inceput = performance.now();

  // Daca venim dintr-o alta zona, aruncam tot ce era desenat.
  Object.keys(bucatiTeren).forEach(function (nume) { stergeBucata(scena, nume); });
  bucatiTeren = {};
  coadaBucati = [];

  // Nuantele fiecarei litere se calculeaza o singura data, nu la
  // fiecare pixel - altfel ar dura mult prea mult.
  paleteTeren = {};
  Object.keys(zona.teren).forEach(function (litera) {
    paleteTeren[litera] = paletaTexturii(zona.teren[litera]);
  });

  faHartaMica(scena);

  window.__timpTeren = Math.round(performance.now() - inceput);
}


// ================================================
//  DESENAREA CU CONTUR
//
//  Trucul din pixel art: intai desenam toate bucatile putin mai
//  mari, in negru; abia apoi bucatile adevarate peste ele. Iese
//  un contur inchis in jurul intregii siluete, care o desprinde
//  de fundal, oricat de incarcat ar fi terenul.
// ================================================
const CULOARE_CONTUR = 0x14100a;

function deseneazaForme(scena, forme) {
  const bucati = [];

  // Culorile vin scrise ca text ('#3355cc'), fiindca aceeasi lista
  // de forme e folosita si de meniu. Phaser le vrea ca numere.
  function cul(c) { return (typeof c === 'string') ? culoareDinText(c) : c; }

  // pasul 1: conturul
  forme.forEach(function (f) {
    if (f.fel === 'cerc') bucati.push(scena.add.circle(f.x, f.y, f.r + 2, CULOARE_CONTUR));
    else bucati.push(scena.add.rectangle(f.x, f.y, f.w + 3, f.h + 3, CULOARE_CONTUR));
  });

  // pasul 2: formele adevarate, peste contur
  forme.forEach(function (f) {
    if (f.fel === 'cerc') bucati.push(scena.add.circle(f.x, f.y, f.r, cul(f.culoare)));
    else bucati.push(scena.add.rectangle(f.x, f.y, f.w, f.h, cul(f.culoare)));
  });

  return bucati;
}

// Umbra de pe pamant. Nu primeste contur - e doar o pata.
function faUmbra(scena, latime) {
  return scena.add.ellipse(0, 21, latime, 8, 0x000000, 0.3);
}


// ================================================
//  INFATISAREA PERSONAJULUI IN JOC
//
//  Aceleasi alegeri ca in meniu: culoarea pielii si a parului,
//  stilul parului, ochii si barba. Bucatile se intorc in ordinea
//  in care trebuie desenate: primele dedesubt, ultimele deasupra.
// ================================================
function deseneazaInfatisarea(scena) {
  // Lista de forme e scrisa in infatisare.js, ca sa fie una singura
  // si pentru joc, si pentru meniu. Arma si scutul le lasam pe
  // dinafara: in joc stau in containere ale lor, ca sa poata trece
  // dintr-o mana in alta cand te intorci si sa se roteasca la lovit.
  return formePersonaj(personaj, { cuArma: false, cuScut: false });
}


// ================================================
//  REFACEREA PERSONAJULUI DUPA CE SCHIMBI UN OBIECT
//
//  Cand pui sau scoti ceva din echipament, silueta din joc
//  trebuie desenata din nou: alt metal, alti umeri, alt coif.
//  Stergem bucatile vechi si punem altele in locul lor, avand
//  grija ca numele si barele sa ramana deasupra.
// ================================================
function reconstruiestePersonaj() {

  if (!jucator || !jucator.scene) return;
  const scena = jucator.scene;

  bucatiCorp.forEach(function (b) { jucator.remove(b, true); });
  // Daca tocmai loveai, arma e prinsa intr-o miscare. O oprim
  // inainte s-o stergem, altfel miscarea ramane fara arma si crapa.
  if (armaJucator) scena.tweens.killTweensOf(armaJucator);
  if (armaJucator) jucator.remove(armaJucator, true);
  if (scutJucator) jucator.remove(scutJucator, true);

  bucatiCorp = deseneazaForme(scena, deseneazaInfatisarea(scena));
  armaJucator = faArmaJucator(scena);
  scutJucator = faScutJucator(scena);

  jucator.add(bucatiCorp.concat(scutJucator ? [scutJucator] : [], [armaJucator]));

  // Bucatile noi s-au asezat deasupra tuturor. Le trimitem sub
  // numele si barele care trebuie sa ramana vizibile.
  [fundalCast, baraCast, etichetaNume].forEach(function (x) {
    if (x) jucator.bringToTop(x);
  });

  asazaArma();
}


// ================================================
//  BUTOANELE DIN DREAPTA JOS
//
//  ATTACK sta cel mai in dreapta. Abilitatile clasei se
//  insira spre stanga lui. Fiecare buton isi arata singur
//  cate secunde mai are pana poate fi apasat din nou.
// ================================================
function faButoane(scena) {

  butoane = [];

  // --- ATTACK ---
  const atac = scena.add.container(BUTON_X, BUTON_Y);
  atac.add(scena.add.circle(0, 0, BUTON_RAZA, UI.alamaInchisa));        // umbra din afara
  atac.add(scena.add.circle(0, 0, BUTON_RAZA - 3, UI.alama));           // inelul de alama
  atac.add(scena.add.circle(0, 0, BUTON_RAZA - 7, 0x6e1f16));           // piatra rosie
  atac.add(scena.add.circle(0, -6, BUTON_RAZA - 13, 0x8f2c1f, 0.55));   // lumina de sus
  atac.add(scena.add.text(0, 0, TEXT.ATTACK, {
    fontFamily: UI.FONT,
    fontSize: '18px',
    fontStyle: 'bold',
    color: UI.text
  }).setOrigin(0.5));
  atac.setScrollFactor(0).setDepth(1000);

  butoane.push({
    x: BUTON_X, y: BUTON_Y, raza: BUTON_RAZA + MARGINE_ATINGERE,
    cerc: atac,
    apasa: function (sc) { ataca(sc); }
  });

  // --- INTERACT ---
  // Deasupra lui ATTACK. Nu trebuie sa mai nimeresti cu degetul exact
  // pe sac sau pe negustor: apesi butonul si se deschide cel mai
  // apropiat lucru de langa tine. Se stinge cand nu e nimic in jur.
  const inter = scena.add.container(INTERACT_X, INTERACT_Y);
  inter.add(scena.add.circle(0, 0, INTERACT_RAZA, UI.alamaInchisa));
  inter.add(scena.add.circle(0, 0, INTERACT_RAZA - 3, UI.alama));
  const piatraInteract = scena.add.circle(0, 0, INTERACT_RAZA - 7, CULOARE_INTERACT_STINS);
  inter.add(piatraInteract);
  inter.add(scena.add.text(0, 0, TEXT.INTERACT, {
    fontFamily: UI.FONT,
    fontSize: '13px',
    fontStyle: 'bold',
    color: UI.text
  }).setOrigin(0.5));
  inter.setScrollFactor(0).setDepth(1000);

  butonInteract = { cerc: inter, piatra: piatraInteract };

  butoane.push({
    x: INTERACT_X, y: INTERACT_Y, raza: INTERACT_RAZA + MARGINE_ATINGERE,
    cerc: inter,
    apasa: function (sc) { interactioneaza(sc); }
  });

  // --- butonul MENU, sub miniharta ---
  const meniu = scena.add.container(MENU_X, MENU_Y);
  meniu.add(scena.add.circle(0, 0, MENU_RAZA, UI.alamaInchisa));
  meniu.add(scena.add.circle(0, 0, MENU_RAZA - 3, UI.alama));
  meniu.add(scena.add.circle(0, 0, MENU_RAZA - 7, 0x2b2114));
  meniu.add(scena.add.text(0, 0, TEXT.MENU, {
    fontFamily: UI.FONT,
    fontSize: '13px',
    fontStyle: 'bold',
    color: UI.text
  }).setOrigin(0.5));
  meniu.setScrollFactor(0).setDepth(1000);

  butoane.push({
    x: MENU_X, y: MENU_Y, raza: MENU_RAZA + MARGINE_ATINGERE,
    cerc: meniu,
    apasa: function () { comutaMeniul(); }
  });

  // --- cate un buton pentru fiecare abilitate ---
  personaj.abilitati.forEach(function (ab, i) {

    // Primul buton sta langa ATTACK, urmatoarele se insira spre stanga.
    const x = BUTON_X - BUTON_RAZA - SPATIU_BUTOANE - BUTON_RAZA_ABILITATE
                      - i * (BUTON_RAZA_ABILITATE * 2 + SPATIU_BUTOANE);
    const y = BUTON_Y;

    const b = scena.add.container(x, y);
    b.add(scena.add.circle(0, 0, BUTON_RAZA_ABILITATE, UI.alamaInchisa));
    b.add(scena.add.circle(0, 0, BUTON_RAZA_ABILITATE - 3, UI.alama));

    const disc = scena.add.circle(0, 0, BUTON_RAZA_ABILITATE - 7, CULOARE_ABILITATE_GATA);
    b.add(disc);
    b.add(scena.add.circle(0, -5, BUTON_RAZA_ABILITATE - 13, 0x3a4f7a, 0.45));

    // Numele, taiat pe doua randuri ca sa incapa in cerc.
    const numeAb = scena.add.text(0, 0, ab.nume.replace(' ', '\n'), {
      fontFamily: UI.FONT,
      fontSize: '13px',
      fontStyle: 'bold',
      color: UI.text,
      align: 'center'
    }).setOrigin(0.5);
    b.add(numeAb);

    // Perdeaua neagra care acopera butonul cat timp e in pauza.
    const perdea = scena.add.circle(0, 0, BUTON_RAZA_ABILITATE - 7, 0x000000, 0.7).setVisible(false);
    b.add(perdea);

    const cifra = scena.add.text(0, 0, '', {
      fontFamily: UI.FONT,
      fontSize: '26px',
      fontStyle: 'bold',
      color: UI.textAuriu,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setVisible(false);
    b.add(cifra);

    b.setScrollFactor(0).setDepth(1000);

    butoane.push({
      x: x, y: y, raza: BUTON_RAZA_ABILITATE + MARGINE_ATINGERE,
      abilitate: ab, disc: disc, perdea: perdea, cifra: cifra, nume: numeAb, cerc: b,
      apasa: function (sc) { folosesteAbilitate(sc, ab); }
    });
  });
}


// Butonul se micsoreaza o clipa cand il apesi, ca sa se vada
// ca l-ai nimerit - pe telefon degetul acopera butonul.
function clipesteButonul(scena, b) {
  if (!b.cerc) return;
  scena.tweens.add({
    targets: b.cerc,
    scale: 0.88,
    duration: 70,
    yoyo: true
  });
}


// Ai pus degetul pe ceva cu care se poate face ceva? Sacul de
// prada si negustorul se deschid numai daca esti langa ei; altfel
// iti spune ca esti prea departe, ca in WoW.
function atingiCeva(scena, x, y) {

  const sac = saculDeLangaTine(x, y);
  if (sac) {
    if (Phaser.Math.Distance.Between(jucator.x, jucator.y, sac.x, sac.y) > RAZA_PRADA) {
      aratacuvant(scena, jucator.x, jucator.y - 40, TEXT.TOO_FAR, UI.textStins);
      return true;
    }
    deschidePrada(sac);
    return true;
  }

  const cineva = npcDeLangaTine(x, y);
  if (cineva) {
    if (Phaser.Math.Distance.Between(jucator.x, jucator.y, cineva.x, cineva.y) > 90) {
      aratacuvant(scena, jucator.x, jucator.y - 40, TEXT.TOO_FAR, UI.textStins);
      return true;
    }
    // Cine are marfa deschide taraba; ceilalti, misiunile.
    if (cineva.marfa) deschideTaraba(cineva);
    else deschideMisiunile(cineva);
    return true;
  }

  return false;
}


// Cel mai apropiat lucru cu care se poate face ceva: un sac de
// prada, sau cineva prietenos. Sacii au intaietate - daca stai
// peste un trup langa un negustor, cel mai probabil vrei trupul.
function ceEDeschisLangaTine() {
  const sac = saculDeLangaTine(jucator.x, jucator.y);
  if (sac) return { fel: 'sac', ce: sac };

  const cineva = npcDeLangaTine(jucator.x, jucator.y);
  if (cineva) return { fel: 'npc', ce: cineva };

  return null;
}


function interactioneaza(scena) {
  const gasit = ceEDeschisLangaTine();
  if (!gasit) return;

  if (gasit.fel === 'sac') { deschidePrada(gasit.ce); return; }
  if (gasit.ce.marfa) deschideTaraba(gasit.ce);
  else deschideMisiunile(gasit.ce);
}


// Butonul se aprinde doar cand chiar ai ce deschide.
function actualizeazaButonulInteract() {
  if (!butonInteract) return;
  const areCeva = ceEDeschisLangaTine() !== null;
  butonInteract.piatra.setFillStyle(areCeva ? CULOARE_INTERACT_GATA : CULOARE_INTERACT_STINS);
  butonInteract.cerc.setAlpha(areCeva ? 1 : 0.55);
}


// ================================================
//  VIETATILE MARUNTE SI OAMENII CARE SE PLIMBA
//
//  Nimic din ce e aici nu schimba jocul. Un iepure care traverseaza
//  poteca si un taran care se plimba prin sat nu-ti dau nimic si nu
//  te pot rani.
//
//  Dar o lume in care singurul lucru care se misca in afara de tine
//  e ceva care vrea sa te omoare nu se simte ca o lume. De aceea
//  sunt aici.
// ================================================
const CATE_VIETATI = 14;        // cate se plimba odata in jurul tau
const RAZA_VIETATI = 620;       // cat de departe de tine se nasc
const VITEZA_VIETATE = 26;

let vietati = [];


function faVietate(scena, x, y) {

  const fel = VIETATI[ID_VIETATI[Math.floor(Math.random() * ID_VIETATI.length)]];
  const v = scena.add.container(x, y);

  v.add(faUmbra(scena, 12));
  deseneazaForme(scena, fel.forme).forEach(function (b) { v.add(b); });
  v.setScale(0.75);
  v.setDepth(7);

  v.fel = fel;
  v.tinta = null;
  v.asteaptaPanaLa = 0;
  vietati.push(v);
  return v;
}


function stergeVietate(v) {
  vietati = vietati.filter(function (x) { return x !== v; });
  v.destroy();
}


// Se nasc in jurul tau, se plimba fara rost, si dispar cand te
// departezi. Nu se tin minte nicaieri: la fiecare intrare in zona
// sunt altele, si nu conteaza.
function actualizeazaVietatile(scena, delta) {

  if (!zona || !jucator) return;

  // ---- se nasc ----
  while (vietati.length < CATE_VIETATI) {

    const unghi = Math.random() * Math.PI * 2;
    const raza = 260 + Math.random() * (RAZA_VIETATI - 260);
    const x = jucator.x + Math.cos(unghi) * raza;
    const y = jucator.y + Math.sin(unghi) * raza;

    const col = Math.floor(x / TILE), rand = Math.floor(y / TILE);
    if (rand < 0 || col < 0 || rand >= zona.harta.length || col >= zona.harta[0].length) break;
    if (esteBlocat(zona.harta[rand][col])) break;

    faVietate(scena, x, y);
  }

  // ---- se plimba ----
  const pas = VITEZA_VIETATE * (delta / 1000);

  vietati.slice().forEach(function (v) {

    if (Phaser.Math.Distance.Between(v.x, v.y, jucator.x, jucator.y) > RAZA_VIETATI + 200) {
      stergeVietate(v);
      return;
    }

    // Cand te apropii, fuge. Ca in viata.
    const panaLaTine = Phaser.Math.Distance.Between(v.x, v.y, jucator.x, jucator.y);
    if (panaLaTine < 70) {
      const unghi = Math.atan2(v.y - jucator.y, v.x - jucator.x);
      v.tinta = { x: v.x + Math.cos(unghi) * 140, y: v.y + Math.sin(unghi) * 140 };
      v.asteaptaPanaLa = 0;
    }

    if (scena.time.now < v.asteaptaPanaLa) return;

    if (!v.tinta) {
      const unghi = Math.random() * Math.PI * 2;
      const cat = 40 + Math.random() * 90;
      v.tinta = { x: v.x + Math.cos(unghi) * cat, y: v.y + Math.sin(unghi) * cat };
    }

    const dx = v.tinta.x - v.x, dy = v.tinta.y - v.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d < 4) {
      v.tinta = null;
      v.asteaptaPanaLa = scena.time.now + 800 + Math.random() * 2600;
      return;
    }

    const nx = v.x + (dx / d) * pas;
    const ny = v.y + (dy / d) * pas;

    const col = Math.floor(nx / TILE), rand = Math.floor(ny / TILE);
    if (rand < 0 || col < 0 || rand >= zona.harta.length || col >= zona.harta[0].length ||
        esteBlocat(zona.harta[rand][col])) {
      v.tinta = null;
      return;
    }

    v.x = nx;
    v.y = ny;
    v.setScale(0.75 * (v.x < jucator.x ? 1 : 1));     // ramane la fel; loc de intors mai tarziu
  });
}


// Oamenii din sate nu mai stau ca niste stalpi: fac cativa pasi in
// jurul locului lor si se opresc, apoi iar.
const RAZA_PLIMBARE_NPC = 46;

function actualizeazaNpcii(scena, delta) {

  const pas = 18 * (delta / 1000);

  npci.forEach(function (p) {

    if (p.acasaX === undefined) { p.acasaX = p.x; p.acasaY = p.y; }
    if (scena.time.now < (p.asteaptaPanaLa || 0)) return;

    if (!p.tinta) {
      const unghi = Math.random() * Math.PI * 2;
      const cat = Math.random() * RAZA_PLIMBARE_NPC;
      p.tinta = { x: p.acasaX + Math.cos(unghi) * cat,
                  y: p.acasaY + Math.sin(unghi) * cat };
    }

    const dx = p.tinta.x - p.x, dy = p.tinta.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d < 3) {
      p.tinta = null;
      p.asteaptaPanaLa = scena.time.now + 2000 + Math.random() * 5000;
      return;
    }

    const nx = p.x + (dx / d) * pas, ny = p.y + (dy / d) * pas;
    const col = Math.floor(nx / TILE), rand = Math.floor(ny / TILE);
    if (rand < 0 || col < 0 || rand >= zona.harta.length || col >= zona.harta[0].length ||
        esteBlocat(zona.harta[rand][col])) {
      p.tinta = null;
      return;
    }
    p.x = nx;
    p.y = ny;
  });
}


// ================================================
//  SACII DE PRADA
//
//  Cand un inamic moare si a lasat ceva, pe locul lui ramane un
//  sac care sclipeste. Te duci langa el, il atingi, si se deschide
//  fereastra de unde iei ce vrei. Daca nu te duci, dupa un minut
//  si jumatate se face praf, ca in WoW.
// ================================================
const TIMP_SAC = 90000;        // cat sta pe jos un sac, in milisecunde
const RAZA_PRADA = 70;         // de cat de aproape il poti deschide

let saci = [];

function faSac(scena, x, y, prada) {

  const sac = scena.add.container(x, y);

  sac.add(scena.add.ellipse(0, 6, 26, 9, 0x000000, 0.35));          // umbra
  sac.add(scena.add.rectangle(0, 0, 18, 16, 0x2e2214));             // conturul
  sac.add(scena.add.rectangle(0, 0, 14, 12, 0x7a5c34));             // sacul
  sac.add(scena.add.rectangle(0, -7, 10, 4, 0x5b4326));             // gura legata
  const lucire = scena.add.circle(0, -2, 9, 0xffe9ad, 0.28);        // sclipirea
  sac.add(lucire);

  // Sclipirea creste si scade, ca sa se vada de departe ca e ceva de luat.
  scena.tweens.add({
    targets: lucire, scale: 1.45, alpha: 0.08,
    duration: 900, yoyo: true, repeat: -1
  });

  sac.setDepth(8);
  sac.prada = prada;
  sac.dispareLa = scena.time.now + TIMP_SAC;
  saci.push(sac);
  return sac;
}


function stergeSacul(sac) {
  saci = saci.filter(function (s) { return s !== sac; });
  sac.destroy();
}


// Sacul cel mai apropiat de un loc, daca e destul de aproape.
function saculDeLangaTine(x, y) {
  let celMaiAproape = null;
  let ceaMaiMica = RAZA_PRADA;
  saci.forEach(function (sac) {
    const d = Phaser.Math.Distance.Between(x, y, sac.x, sac.y);
    if (d < ceaMaiMica) { ceaMaiMica = d; celMaiAproape = sac; }
  });
  return celMaiAproape;
}


// Acelasi lucru pentru personajele prietenoase: negustori, dar si
// cei care dau misiuni.
function npcDeLangaTine(x, y) {
  let celMaiAproape = null;
  let ceaMaiMica = 90;
  npci.forEach(function (p) {
    const d = Phaser.Math.Distance.Between(x, y, p.x, p.y);
    if (d < ceaMaiMica) { ceaMaiMica = d; celMaiAproape = p; }
  });
  return celMaiAproape;
}


// Sacii nesters se fac praf singuri, dupa un timp.
function actualizeazaSacii(scena) {
  saci.slice().forEach(function (sac) {
    if (scena.time.now < sac.dispareLa) return;
    if (saculDeschis === sac) return;      // nu-l luam de sub mana ta
    stergeSacul(sac);
  });
}


// ================================================
//  INAMICII APAR DOAR IN JURUL TAU
//
//  O zona mare are cateva sute de inamici. Daca i-am face pe toti
//  la intrare, telefonul ar desena cateva mii de bucatele in
//  fiecare clipa, degeaba: nu vezi decat ce e pe ecran.
//
//  Asa ca fiecare inamic din fisierul zonei e doar o insemnare:
//  "aici sta un lup de nivel 3". Se face cu adevarat abia cand
//  te apropii, si se sterge cand te departezi. Unul care se bate
//  cu tine nu se sterge niciodata.
// ================================================
const RAZA_APARITIE = 700;     // de la ce distanta se face un inamic
const RAZA_DISPARITIE = 1100;  // de la ce distanta il stergem la loc

function actualizeazaMobii(scena) {

  if (!zona || !jucator || !personaj) return;

  // --- ce trebuie sa apara ---
  zona.mobi.forEach(function (loc) {

    if (loc.aparut) return;
    if (loc.mortPanaLa && scena.time.now < loc.mortPanaLa) return;

    const x = loc.col * TILE + TILE / 2;
    const y = loc.rand * TILE + TILE / 2;
    if (Phaser.Math.Distance.Between(x, y, jucator.x, jucator.y) > RAZA_APARITIE) return;

    creeazaMob(scena, loc);
  });

  // --- ce a ramas mult in urma ---
  mobi = mobi.filter(function (mob) {

    if (!mob.viu || mob.furios) return true;
    if (Phaser.Math.Distance.Between(mob.casaX, mob.casaY, jucator.x, jucator.y) <= RAZA_DISPARITIE) {
      return true;
    }

    if (mob.locul) mob.locul.aparut = false;
    mob.destroy();
    return false;
  });
}


// ================================================
//  MINIHARTA
//
//  O fereastra in dreapta sus care arata bucata de harta din
//  jurul tau. Tu esti mereu in mijloc. Punctele rosii sunt
//  inamici, cele aurii personajele prietenoase.
// ================================================
function faMiniharta(scena) {

  // rama de piatra cu alama, ca restul interfetei
  faPanou(scena, MINI_X - 5, MINI_Y - 5, MINI_LAT + 10, MINI_LAT + 10)
    .forEach(function (b) { b.setScrollFactor(0).setDepth(1200); });

  minihartaPanza = scena.add.renderTexture(MINI_X, MINI_Y, MINI_LAT, MINI_LAT)
    .setOrigin(0, 0).setScrollFactor(0).setDepth(1201);
}


function actualizeazaMiniharta() {

  if (!minihartaPanza || !terenMic) return;

  const mijloc = MINI_LAT / 2;

  // Mutam harta micsorata astfel incat tu sa cazi fix in mijloc.
  minihartaPanza.clear();
  minihartaPanza.draw(terenMic,
    mijloc - jucator.x * MINI_SCARA,
    mijloc - jucator.y * MINI_SCARA);

  // Un punct pentru fiecare lucru viu, daca incape in fereastra.
  function pune(x, y, culoare, marime) {
    const px = mijloc + (x - jucator.x) * MINI_SCARA;
    const py = mijloc + (y - jucator.y) * MINI_SCARA;
    if (px < marime || py < marime || px > MINI_LAT - marime || py > MINI_LAT - marime) return;
    minihartaPanza.fill(culoare, 1, px - marime / 2, py - marime / 2, marime, marime);
  }

  // Cine are ceva pentru tine se vede mai mare si mai aprins.
  npci.forEach(function (p) {
    const semn = p.semn ? p.semn.text : '';
    if (semn) pune(p.x, p.y, 0xffd34d, 8);
    else pune(p.x, p.y, 0xd9b555, 5);
  });

  // Inamicii de care ai nevoie pentru o misiune se vad altfel
  // colorati, ca sa nu-i cauti pe o harta de sute de casute.
  mobi.forEach(function (m) {
    if (!m.viu) return;
    pune(m.x, m.y, esteTintaDeMisiune(m.felul) ? 0xffb02e : 0xcc3322,
         esteTintaDeMisiune(m.felul) ? 7 : 5);
  });

  pune(jucator.x, jucator.y, 0xf2e6c8, 7);
}


// Inamicul asta imi trebuie pentru vreo misiune pe care o am acum?
// Raspunsul se tine minte pana la urmatoarea schimbare, fiindca se
// intreaba de cateva sute de ori pe secunda, pentru miniharta.
let tinteDeMisiune = null;

function recalculeazaTintele() {
  tinteDeMisiune = {};
  if (typeof misiuniActive !== 'function' || !personaj) return;
  misiuniActive(personaj).forEach(function (m) {
    if (starea(personaj, m.id) !== 'activa') return;
    tinteDeMisiune[m.cerinta.mob] = true;
  });
}

function esteTintaDeMisiune(felul) {
  if (tinteDeMisiune === null) recalculeazaTintele();
  return !!tinteDeMisiune[felul];
}


// Joystick-ul: cerc de piatra cu inel de alama si o bila in mijloc.
function faJoystick(scena) {

  const fundal = scena.add.circle(JOY_X, JOY_Y, JOY_RAZA, UI.alamaInchisa, 0.55);
  const inel   = scena.add.circle(JOY_X, JOY_Y, JOY_RAZA - 3, UI.alama, 0.45);
  const gaura  = scena.add.circle(JOY_X, JOY_Y, JOY_RAZA - 7, UI.piatra, 0.5);

  manetaJoystick = scena.add.circle(JOY_X, JOY_Y, JOY_RAZA_MANETA, UI.alama, 0.9);
  const lucire = scena.add.circle(JOY_X, JOY_Y, JOY_RAZA_MANETA - 8, UI.alamaLucioasa, 0.5);
  manetaJoystick.lucire = lucire;

  [fundal, inel, gaura, manetaJoystick, lucire].forEach(function (b) {
    b.setScrollFactor(0).setDepth(1000);
  });
}


// Muta bila dupa deget si afla incotro mergi.
function mutaJoystick(pointer) {

  let dx = pointer.x - JOY_X;
  let dy = pointer.y - JOY_Y;
  const lungime = Math.sqrt(dx * dx + dy * dy);

  // Bila nu iese din cerc.
  const maxim = JOY_RAZA - JOY_RAZA_MANETA + 6;
  if (lungime > maxim) {
    dx = dx / lungime * maxim;
    dy = dy / lungime * maxim;
  }

  manetaJoystick.setPosition(JOY_X + dx, JOY_Y + dy);
  manetaJoystick.lucire.setPosition(JOY_X + dx, JOY_Y + dy);

  const acum = Math.sqrt(dx * dx + dy * dy);
  if (acum < JOY_ZONA_MOARTA) {
    mersJoystick = { x: 0, y: 0 };
  } else {
    mersJoystick = { x: dx / acum, y: dy / acum };
  }
}


// Ridici degetul: bila sare inapoi in mijloc si te opresti.
function lasaJoystick() {
  degetJoystick = null;
  mersJoystick = { x: 0, y: 0 };
  manetaJoystick.setPosition(JOY_X, JOY_Y);
  manetaJoystick.lucire.setPosition(JOY_X, JOY_Y);
}


// Se cheama in fiecare cadru: aprinde sau stinge butoanele.
function actualizeazaButoane(scena) {

  butoane.forEach(function (b) {
    if (!b.abilitate) return;

    const secunde = secundeRamase(scena, b.abilitate);

    if (secunde > 0) {
      // In pauza: perdea neagra si cifra cu secundele ramase.
      // Numele se ascunde, altfel se citeste pe sub perdea.
      b.perdea.setVisible(true);
      b.cifra.setVisible(true).setText('' + secunde);
      b.nume.setVisible(false);
    } else {
      b.perdea.setVisible(false);
      b.cifra.setVisible(false);
      b.nume.setVisible(true);
      // Fara pauza, dar poate n-ai mana/rage: butonul se stinge.
      b.disc.setFillStyle(poateFolosi(scena, b.abilitate) ? CULOARE_ABILITATE_GATA : CULOARE_ABILITATE_STINSA);
    }
  });
}


// ================================================
//  RAMA PERSONAJULUI (stanga jos)
//  Portret, nume, nivel si bara de viata.
//  Ramane lipita de ecran, nu se plimba cu harta.
// ================================================
function faRamaPersonaj(scena) {

  const rama = scena.add.container(8, 8);
  const bucati = faPanou(scena, 0, 0, 204, 96);

  // --- Portretul, intr-o firida de piatra ---
  const firida = scena.add.rectangle(8, 8, 46, 46, UI.piatraMoale).setOrigin(0, 0);
  firida.setStrokeStyle(2, UI.alama);
  const pielePortret = scena.add.circle(31, 34, 13, culoareDinText(personaj.aspect.piele));
  const parPortret   = scena.add.rectangle(31, 23, 24, 7, culoareDinText(personaj.aspect.par));
  bucati.push(firida, pielePortret, parPortret);

  // --- Numele si nivelul ---
  bucati.push(scena.add.text(62, 8, personaj.nume, {
    fontFamily: UI.FONT,
    fontSize: '15px',
    fontStyle: 'bold',
    color: UI.textAuriu
  }).setOrigin(0, 0));

  nivelText = scena.add.text(196, 11, '', {
    fontFamily: UI.FONT,
    fontSize: '11px',
    color: UI.textStins
  }).setOrigin(1, 0);
  bucati.push(nivelText);

  // --- Bara de viata ---
  bucati.push(faSantBara(scena, 62, 28, 134, 16));
  barViata = scena.add.rectangle(64, 30, LATIME_BARA, 12, UI.viata).setOrigin(0, 0);
  bucati.push(barViata);

  textViata = scena.add.text(129, 36, '', {
    fontFamily: UI.FONT,
    fontSize: '11px',
    color: UI.text,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5, 0.5);
  bucati.push(textViata);

  // --- Bara de resursa: rosie pentru rage, albastra pentru mana ---
  const culoareResursa = (personaj.resursa === 'furie') ? UI.rage : UI.mana;

  bucati.push(faSantBara(scena, 62, 46, 134, 14));
  barResursa = scena.add.rectangle(64, 48, LATIME_BARA, 10, culoareResursa).setOrigin(0, 0);
  bucati.push(barResursa);

  textResursa = scena.add.text(129, 53, '', {
    fontFamily: UI.FONT,
    fontSize: '10px',
    color: UI.text,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5, 0.5);
  bucati.push(textResursa);

  // --- Scutul de la Arcane Barrier (doar la Mage se vede vreodata) ---
  textScut = scena.add.text(196, 64, '', {
    fontFamily: UI.FONT,
    fontSize: '10px',
    color: '#8fc2e8'
  }).setOrigin(1, 0);
  bucati.push(textScut);

  // --- Bara de experienta, subtire, jos de tot ---
  bucati.push(faSantBara(scena, 10, 78, 186, 10));
  barXp = scena.add.rectangle(12, 80, LATIME_BARA_XP, 6, 0x8a5fbf).setOrigin(0, 0);
  bucati.push(barXp);

  textXp = scena.add.text(103, 83, '', {
    fontFamily: UI.FONT,
    fontSize: '9px',
    color: UI.text,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5, 0.5);
  bucati.push(textXp);

  // --- Rasa si clasa, scris marunt jos ---
  bucati.push(scena.add.text(10, 64, personaj.rasa + ' ' + personaj.clasa, {
    fontFamily: UI.FONT,
    fontSize: '10px',
    color: UI.textStins
  }).setOrigin(0, 0));

  rama.add(bucati);
  rama.setScrollFactor(0).setDepth(1000);

  // Mage porneste cu scutul pus.
  scut = (personaj.idClasa === 'mage') ? ARCANE_BARRIER_SCUT : 0;

  actualizeazaBaraViata();
  actualizeazaBaraResursa();
  actualizeazaScut();
  actualizeazaNivelul();
}


// ================================================
//  TALENTELE, PUSE IN JOC
//
//  Talentele nu schimba fisierul personajului, ci se aplica
//  PESTE statisticile lui de baza. De aceea, ori de cate ori
//  cheltuiesti sau resetezi puncte, recalculam totul de la zero.
// ================================================
function aplicaTalentele() {

  const baza = calculeazaPersonaj(personaj.idRasa, personaj.idClasa,
                                 personaj.infatisare, personaj.nivel);
  const dinEchipament = bonusEchipament(personaj);
  const clasa = CLASE[personaj.idClasa];

  // Cat la suta din viata si din resursa ai acum - le pastram.
  const parteViata = personaj.viataMaxima ? personaj.viata / personaj.viataMaxima : 1;
  const parteMana = personaj.manaMaxima ? personaj.mana / personaj.manaMaxima : 1;

  // Atributele: cele de baza plus ce aduce echipamentul.
  personaj.atribute = {
    str: baza.atribute.str + dinEchipament.str,
    agi: baza.atribute.agi + dinEchipament.agi,
    sta: baza.atribute.sta + dinEchipament.sta,
    int: baza.atribute.int + dinEchipament.int,
    spi: baza.atribute.spi + dinEchipament.spi
  };

  // Din atribute ies restul, cu formulele din specificatia ta.
  const atr = personaj.atribute;
  personaj.viataMaxima = Math.round(calculeazaViata(atr.sta) * inmultitorTalent(personaj, 'viata'));
  personaj.manaMaxima  = calculeazaMana(atr.int, personaj.resursa);
  personaj.attackPower = calculeazaAttackPower(atr, clasa);
  personaj.attackPowerDistanta = calculeazaAttackPowerDistanta(atr, clasa);
  personaj.armura   = Math.round((calculeazaArmura(atr.agi) + dinEchipament.armura) *
                                 inmultitorTalent(personaj, 'armura'));
  personaj.critical = calculeazaCritical(atr.agi) + bonusTalent(personaj, 'critic');

  personaj.viata = Math.max(1, Math.min(personaj.viataMaxima,
                            Math.round(personaj.viataMaxima * parteViata)));

  if (personaj.resursa === 'mana') {
    personaj.mana = Math.min(personaj.manaMaxima, Math.round(personaj.manaMaxima * parteMana));
  }

  actualizeazaBaraViata();
  actualizeazaBaraResursa();

  // Echipamentul nu schimba doar cifrele: se si vede pe personaj.
  reconstruiestePersonaj();

  // S-a schimbat ceva important: salvam pe loc, sa nu se piarda.
  if (typeof salveaza === 'function') salveaza();
}


// ================================================
//  EXPERIENTA SI NIVELURILE
// ================================================

// Scrie nivelul si bara de experienta din rama.
function actualizeazaNivelul() {
  if (!nivelText) return;

  nivelText.setText(TEXT.LEVEL + ' ' + personaj.nivel);

  if (personaj.nivel >= NIVEL_MAXIM) {
    barXp.setDisplaySize(LATIME_BARA_XP, 6);
    textXp.setText(TEXT.MAX_LEVEL);
    return;
  }

  const parte = Math.min(1, personaj.xp / personaj.xpNecesar);
  barXp.setDisplaySize(LATIME_BARA_XP * parte, 6);
  textXp.setText(Math.floor(personaj.xp) + ' / ' + personaj.xpNecesar);
}


// Primesti experienta. Daca ajunge, urci in nivel - poate chiar
// de mai multe ori, daca ai primit dintr-o data foarte multa.
function primesteXp(scena, cat) {

  if (personaj.nivel >= NIVEL_MAXIM || cat <= 0) return;

  personaj.xp += cat;
  aratacuvant(scena, jucator.x, jucator.y - 56, '+' + cat + ' XP', '#c9a0e8');

  while (personaj.nivel < NIVEL_MAXIM && personaj.xp >= personaj.xpNecesar) {
    personaj.xp -= personaj.xpNecesar;
    urcaInNivel(scena);
  }

  actualizeazaNivelul();
}


// Un nivel in plus: statisticile se recalculeaza, viata si resursa
// se umplu la loc, iar de la nivelul 10 primesti si un punct de talent.
function urcaInNivel(scena) {

  const nivelNou = personaj.nivel + 1;
  const proaspat = calculeazaPersonaj(personaj.idRasa, personaj.idClasa,
                                      personaj.infatisare, nivelNou);

  // ATENTIE: pana acum copiam TOT peste personaj si salvam inapoi
  // doar numele, experienta si talentele. Asta insemna ca la fiecare
  // urcare in nivel iti pierdeai echipamentul, rucsacul, banii si
  // misiunile - se faceau la loc goale, ca la un personaj nou.
  //
  // Acum luam doar cele trei lucruri pe care le schimba chiar nivelul.
  // Restul (statisticile, viata, attack power) se socotesc oricum din
  // nou in aplicaTalentele(), pornind de la nivelul cel nou.
  personaj.nivel        = proaspat.nivel;
  personaj.xpNecesar    = proaspat.xpNecesar;
  personaj.puncteTalent = proaspat.puncteTalent;

  // La nivel nou esti ca nou.
  personaj.viata = personaj.viataMaxima;
  if (personaj.resursa === 'mana') personaj.mana = personaj.manaMaxima;
  else personaj.furie = 0;

  aplicaTalentele();
  personaj.viata = personaj.viataMaxima;
  actualizeazaBaraViata();
  actualizeazaBaraResursa();
  aratacuvant(scena, jucator.x, jucator.y - 74, TEXT.LEVEL_UP, '#ffd76b');

  scena.tweens.add({ targets: jucator, scale: 1.25, duration: 180, yoyo: true });

  if (typeof salveaza === 'function') salveaza();
}


// Reface bara de viata dupa cifrele din personaj.
// O apelam de fiecare data cand viata se schimba.
function actualizeazaBaraViata() {
  const viata = Math.max(0, personaj.viata);
  const parte = viata / personaj.viataMaxima;

  // Bara se deseneaza dupa valoarea exacta, ca sa curga lin,
  // dar CIFRA se rotunjeste. Altfel, cand viata creste incet
  // din regenerare, ar scrie 32.074980000000444.
  barViata.setDisplaySize(LATIME_BARA * parte, 12);
  textViata.setText(Math.round(viata) + ' / ' + personaj.viataMaxima);
}


// Reface bara de resursa. Rage si mana se citesc din locuri
// diferite, asa ca intrebam intai ce fel de resursa are clasa.
function actualizeazaBaraResursa() {
  let valoare;
  let maxim;

  if (personaj.resursa === 'furie') {
    valoare = personaj.furie;
    maxim = RAGE_MAXIM;
  } else {
    valoare = personaj.mana;
    maxim = personaj.manaMaxima;
  }

  valoare = Math.max(0, Math.round(valoare));

  barResursa.setDisplaySize(LATIME_BARA * (valoare / maxim), 10);
  textResursa.setText(valoare + ' / ' + maxim);
}


// ================================================
//  CELE 4 PASIVE DE CLASA
//
//  Pasiva = un efect care merge singur, tot timpul, fara sa
//  apesi nimic. Fiecare clasa are una, scrisa de tine in
//  personaj.js. Aici sunt facute sa functioneze.
// ================================================

// Esti in lupta acum?
function esteInLupta(scena) {
  return (scena.time.now - ultimaLupta) < IESIRE_DIN_LUPTA;
}


// Se cheama de fiecare data cand dai sau primesti o lovitura.
// Daca tocmai ai intrat in lupta (erai linistit), tine minte
// clipa asta - de ea depind Hunter's Eye si Arcane Barrier.
function intraInLupta(scena) {
  if (!esteInLupta(scena)) {
    inceputLupta = scena.time.now;

    // ARCANE BARRIER (Mage): la inceputul FIECAREI lupte primesti scut.
    if (personaj.idClasa === 'mage') {
      scut = ARCANE_BARRIER_SCUT;
      actualizeazaScut();
    }

    // BLOOD FURY (Orc): porneste singura la inceput de lupta.
    porneisteBloodFury(scena);
  }
  ultimaLupta = scena.time.now;
}


// BATTLE FURY (Warrior): cu cat esti mai aproape de moarte sub 30%
// din viata, cu atat castigi mai mult rage - pana la jumatate in plus.
// Da inapoi 0 pentru celelalte clase.
function sporBattleFury() {
  if (personaj.idClasa !== 'warrior') return 0;

  const parte = personaj.viata / personaj.viataMaxima;
  if (parte >= BATTLE_FURY_PRAG) return 0;

  const catDeRau = 1 - (parte / BATTLE_FURY_PRAG);   // 0 la 30% viata, 1 la 0
  return BATTLE_FURY_SPOR * catDeRau;
}


// HUNTER'S EYE (Hunter): in primele 3 secunde ale luptei,
// sagetile fac cu 25% mai mult damage.
function sporHuntersEye(scena) {
  if (personaj.idClasa !== 'hunter') return 0;
  if (scena.time.now - inceputLupta > HUNTERS_EYE_SECUNDE * 1000) return 0;
  return HUNTERS_EYE_SPOR;
}


// ARCANE BARRIER (Mage): scutul inghite damage inainte sa ajunga
// la viata ta. Da inapoi cat damage a mai ramas de incasat.
function scutulInghite(scena, damage) {
  if (scut <= 0) return damage;

  const inghitit = Math.min(scut, damage);
  scut = scut - inghitit;
  actualizeazaScut();
  aratacifraAlbastra(scena, jucator.x, jucator.y - 56, inghitit);

  return damage - inghitit;
}


// Cifra albastra: cat damage a oprit scutul.
function aratacifraAlbastra(scena, x, y, cat) {
  const t = scena.add.text(x, y, '(' + Math.round(cat) + ')', {
    fontFamily: UI.FONT,
    fontSize: '14px',
    color: '#7fd0ff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(50);

  scena.tweens.add({
    targets: t, y: y - 22, alpha: 0, duration: 800,
    onComplete: function () { t.destroy(); }
  });
}


// Scrie in rama cat scut mai ai. Cand n-ai deloc, nu se vede nimic.
function actualizeazaScut() {
  if (!textScut) return;
  textScut.setText(scut > 0 ? 'Shield ' + Math.round(scut) : '');
}


// ================================================
//  ABILITATILE, PE BUTOANE
//
//  Fiecare clasa are butoanele ei, langa ATTACK. Toate
//  cifrele (cost, pauza, incantare, damage) sunt scrise
//  langa abilitate in personaj.js - aici doar le folosim.
// ================================================

// Cand poate fi folosita din nou fiecare abilitate.
let pauzaAbilitati = {};

// Abilitatea care se incanta acum (doar Arcane Bolt are incantare).
let abilitateInCurs = null;
let vrajaGata = 0;
let tintaVrajii = null;


// Poti folosi acum abilitatea asta?
function poateFolosi(scena, ab) {
  if (mort) return false;
  if (abilitateInCurs) return false;
  if (scena.time.now < (pauzaAbilitati[ab.id] || 0)) return false;
  if (ab.costMana > 0 && personaj.mana < costulAbilitatii(ab, 'mana')) return false;
  if (ab.costRage > 0 && personaj.furie < costulAbilitatii(ab, 'rage')) return false;
  return true;
}


// Cat costa o abilitate, dupa ce talentele o ieftinesc.
function costulAbilitatii(ab, fel) {
  const brut = (fel === 'mana') ? ab.costMana : ab.costRage;
  return Math.round(brut * reducereTalent(personaj, 'costResursa'));
}


// Cate secunde mai sunt pana o poti folosi (0 = gata).
function secundeRamase(scena, ab) {
  const ramas = (pauzaAbilitati[ab.id] || 0) - scena.time.now;
  return ramas > 0 ? Math.ceil(ramas / 1000) : 0;
}


// Apesi butonul: se verifica totul, apoi porneste.
function folosesteAbilitate(scena, ab) {

  if (!poateFolosi(scena, ab)) return;

  // Are nevoie de o tinta? O cautam inainte sa platesti ceva.
  let tintaAb = null;
  if (ab.fel === 'lovitura') {
    const p = punctInFata();
    tintaAb = celMaiApropiatMob(p.x, p.y, RAZA_ATAC);
  } else if (ab.fel === 'sageata') {
    tintaAb = celMaiApropiatMob(jucator.x, jucator.y, RAZA_ATAC_DISTANTA);
  } else if (ab.fel === 'vraja') {
    tintaAb = celMaiApropiatMob(jucator.x, jucator.y, ab.raza);
  }
  if (ab.fel !== 'vindecare' && !tintaAb) return;   // n-ai pe cine

  // Se plateste, cu reducerea de la talente.
  if (ab.costMana > 0) personaj.mana = personaj.mana - costulAbilitatii(ab, 'mana');
  if (ab.costRage > 0) personaj.furie = personaj.furie - costulAbilitatii(ab, 'rage');
  actualizeazaBaraResursa();

  pauzaAbilitati[ab.id] = scena.time.now + ab.pauza * reducereTalent(personaj, 'pauza');
  intraInLupta(scena);
  numeleAbilitatii(scena, ab.nume);

  // Are incantare? Atunci porneste bara si asteptam.
  if (ab.incantare > 0) {
    abilitateInCurs = ab;
    tintaVrajii = tintaAb;
    vrajaGata = scena.time.now + ab.incantare;
    intoarceTeSpre(tintaAb.x, tintaAb.y);
    baraCast.setDisplaySize(0, 4);
    fundalCast.setVisible(true);
    baraCast.setVisible(true);
    return;
  }

  porneisteEfectul(scena, ab, tintaAb);
}


// Ce face de fapt abilitatea, cand pleaca.
function porneisteEfectul(scena, ab, tintaAb) {

  if (ab.fel === 'lovitura') {
    animatiaSabiei(scena);
    const lovitura = damageulTau(armaDeAtac(), attackPowerFolosit(scena, false));
    const sporAb = inmultitorTalent(personaj, 'dmgAbilitate');
    loveste(scena, tintaAb, lovitura.damage * ab.inmultit * sporAb, lovitura.critic);

  } else if (ab.fel === 'sageata') {
    intoarceTeSpre(tintaAb.x, tintaAb.y);
    animatiaArcului(scena);
    tragiSageata(scena, tintaAb, armaDeAtac(), ab.inmultit);

  } else if (ab.fel === 'vraja') {
    if (!tintaAb || !tintaAb.viu) return;
    intoarceTeSpre(tintaAb.x, tintaAb.y);
    const damageVraja = Phaser.Math.Between(ab.dmgMin, ab.dmgMax) *
                        inmultitorTalent(personaj, 'dmgAbilitate');
    trimiteGlob(scena, tintaAb, Math.round(damageVraja), ab.culoare);

  } else if (ab.fel === 'vindecare') {
    const cat = Math.round(Phaser.Math.Between(ab.vindecaMin, ab.vindecaMax) *
                           inmultitorTalent(personaj, 'vindecare'));
    personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + cat);
    actualizeazaBaraViata();
    aratacifraVerde(scena, jucator.x, jucator.y - 44, cat);
  }
}


// Se cheama din update: duce incantarea mai departe si reface butoanele.
function actualizeazaAbilitati(scena) {

  if (abilitateInCurs) {
    const ramas = vrajaGata - scena.time.now;
    const gata = 1 - Math.max(0, ramas) / abilitateInCurs.incantare;
    baraCast.setDisplaySize(44 * gata, 4);

    if (ramas <= 0) {
      const ab = abilitateInCurs;
      const t = tintaVrajii;
      abilitateInCurs = null;
      tintaVrajii = null;
      fundalCast.setVisible(false);
      baraCast.setVisible(false);
      porneisteEfectul(scena, ab, t);
    }
  }

  actualizeazaButoane(scena);
}


// Globul de energie care zboara spre inamic.
function trimiteGlob(scena, tintaLovita, damage, culoare) {

  const plecX = jucator.x;
  const plecY = jucator.y - 6;

  const glob = scena.add.container(plecX, plecY);
  glob.add(scena.add.circle(0, 0, 8, culoare));
  glob.add(scena.add.circle(0, 0, 5, 0xffffff, 0.75));
  glob.setDepth(20);

  const cat = Phaser.Math.Distance.Between(plecX, plecY, tintaLovita.x, tintaLovita.y);

  scena.tweens.add({
    targets: glob,
    x: tintaLovita.x,
    y: tintaLovita.y,
    duration: Math.max(100, cat * 1.4),
    onComplete: function () {
      glob.destroy();
      if (tintaLovita.viu) loveste(scena, tintaLovita, damage, false);
    }
  });
}


// Numele abilitatii, scris scurt deasupra capului tau.
function numeleAbilitatii(scena, nume) {
  const t = scena.add.text(jucator.x, jucator.y - 64, nume, {
    fontFamily: UI.FONT,
    fontSize: '12px',
    color: '#e0913c',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(60);

  scena.tweens.add({
    targets: t, y: jucator.y - 86, alpha: 0, duration: 900,
    onComplete: function () { t.destroy(); }
  });
}


// Cifra verde: cata viata ai primit inapoi.
function aratacifraVerde(scena, x, y, cat) {
  const t = scena.add.text(x, y, '+' + cat, {
    fontFamily: UI.FONT,
    fontSize: '16px',
    color: '#7ce87c',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(50);

  scena.tweens.add({
    targets: t, y: y - 26, alpha: 0, duration: 900,
    onComplete: function () { t.destroy(); }
  });
}


// ================================================
//  CELE 8 PASIVE DE RASA
//
//  Doua pentru fiecare rasa, scrise de tine in personaj.js.
// ================================================

// WEAPON TRAINING (Human): ratezi mai rar decat ceilalti.
// Ratarea se aplica doar loviturilor obisnuite, nu si abilitatilor.
function ratezi() {
  let sansa = SANSA_RATARE;
  if (personaj.idRasa === 'human') sansa = sansa - WEAPON_TRAINING;
  return (Math.random() * 100) < sansa;
}


// QUICKNESS (Night Elf): sansa sa eviti complet o lovitura.
function evitiLovitura() {
  let sansa = bonusTalent(personaj, 'dodge');
  if (personaj.idRasa === 'nightelf') sansa += QUICKNESS_DODGE;
  return sansa > 0 && (Math.random() * 100) < sansa;
}


// BLOOD FURY (Orc): porneste singura cand intri in lupta, daca a
// trecut pauza. Cat tine, Attack Power-ul tau e cu 50% mai mare.
function porneisteBloodFury(scena) {
  if (personaj.idRasa !== 'orc') return;
  if (scena.time.now < bloodFuryUrmatorul) return;

  bloodFuryPanaLa = scena.time.now + BLOOD_FURY_DUREAZA;
  bloodFuryUrmatorul = scena.time.now + BLOOD_FURY_PAUZA;
  numeleAbilitatii(scena, RASE[personaj.idRasa].pasive[0].nume);
}

// Attack Power-ul de folosit ACUM, cu Blood Fury daca e pornita.
function attackPowerFolosit(scena, laDistanta) {
  let ap = laDistanta ? personaj.attackPowerDistanta : personaj.attackPower;
  if (personaj.idRasa === 'orc' && scena.time.now <= bloodFuryPanaLa) {
    ap = ap * (1 + BLOOD_FURY_SPOR);
  }
  return ap;
}


// SHADOWMELD (Night Elf): daca stai nemiscat 2 secunde in lupta,
// inamicii te pierd din ochi si iesi din lupta.
function shadowmeld(scena) {
  if (personaj.idRasa !== 'nightelf' || mort) return;
  if (!esteInLupta(scena)) return;
  if (scena.time.now - ultimaMiscare < SHADOWMELD_SECUNDE * 1000) return;

  mobi.forEach(function (m) { m.furios = false; });
  ultimaLupta = -99999;
  numeleAbilitatii(scena, RASE[personaj.idRasa].pasive[1].nume);
}


// ================================================
//  REGENERAREA VIETII TALE
//
//  Trei izvoare, care se aduna:
//    - in afara luptei, dupa Spirit (pentru toata lumea)
//    - WILL OF THE FORSAKEN (Undead): mereu, si in lupta
//    - CANNIBALIZE (Undead): dupa ce omori ceva, 10 secunde
// ================================================
function regenerareViata(scena, delta) {

  if (mort) return;
  if (personaj.viata >= personaj.viataMaxima) return;

  const secunde = delta / 1000;
  let castig = 0;

  if (!esteInLupta(scena)) {
    castig += (personaj.atribute.spi / REGEN_VIATA_SPIRIT) * secunde *
              inmultitorTalent(personaj, 'regen');
  }

  if (personaj.idRasa === 'undead') {
    castig += personaj.viataMaxima * WILL_FORSAKEN_PARTE * secunde;

    if (scena.time.now < canibalizarePanaLa) {
      castig += (personaj.viataMaxima * CANIBALIZARE_PARTE / CANIBALIZARE_SECUNDE) * secunde;
    }
  }

  if (castig <= 0) return;

  personaj.viata = Math.min(personaj.viataMaxima, personaj.viata + castig);
  actualizeazaBaraViata();
}


// Un cuvant scurt deasupra capului: Miss, Dodge...
function aratacuvant(scena, x, y, cuvant, culoare) {
  const t = scena.add.text(x, y, cuvant, {
    fontFamily: UI.FONT,
    fontSize: '13px',
    color: culoare,
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(50);

  scena.tweens.add({
    targets: t, y: y - 24, alpha: 0, duration: 800,
    onComplete: function () { t.destroy(); }
  });
}


// ================================================
//  CELE DOUA RESURSE, IN AFARA LUPTEI
//
//  Sunt doua purtari opuse, scrise separat inadins:
//    - rage-ul se GOLESTE cand nu mai lupti
//    - mana se UMPLE cand nu mai lupti, dupa Spirit
// ================================================
function actualizeazaResursa(scena, delta) {

  const secunde = delta / 1000;
  const inLupta = esteInLupta(scena);

  // INNER WILL (Priest): mana curge mereu, si in toiul luptei.
  if (personaj.idClasa === 'priest' && personaj.mana < personaj.manaMaxima) {
    personaj.mana = Math.min(personaj.manaMaxima, personaj.mana + INNER_WILL_MANA * secunde);
    actualizeazaBaraResursa();
  }

  if (inLupta) return;

  // ARCANE BARRIER (Mage): scutul se reface cand nu mai lupti.
  if (personaj.idClasa === 'mage' && scut < ARCANE_BARRIER_SCUT) {
    scut = ARCANE_BARRIER_SCUT;
    actualizeazaScut();
  }

  if (personaj.resursa === 'furie') {
    if (personaj.furie > 0) {
      personaj.furie = Math.max(0, personaj.furie - RAGE_SCURS_PE_SEC * secunde);
      actualizeazaBaraResursa();
    }
  } else {
    if (personaj.mana < personaj.manaMaxima) {
      const castig = (personaj.atribute.spi / SPIRIT_PER_MANA) * secunde *
                     inmultitorTalent(personaj, 'regen');
      personaj.mana = Math.min(personaj.manaMaxima, personaj.mana + castig);
      actualizeazaBaraResursa();
    }
  }
}


// ================================================
//  update - de ~60 de ori pe secunda
// ================================================
function update(time, delta) {

  // Cand apesi Log out, jocul se opreste - dar Phaser mai apuca sa
  // treaca o data prin update inainte sa se inchida de tot. Fara
  // randul asta, cadrul ala cauta un personaj care nu mai exista.
  if (!personaj || !jucator || !jucator.scene) return;

  // Ai ajuns pe o poarta catre alta zona?
  verificaTrecerea();

  // Harta se deseneaza pe bucati, pe masura ce te apropii de ele,
  // iar inamicii apar si dispar la fel. Se face in orice situatie -
  // si cu meniul deschis, si cat esti mort.
  actualizeazaTerenul(this);
  actualizeazaMobii(this);
  actualizeazaSacii(this);
  actualizeazaVietatile(this, delta);
  actualizeazaNpcii(this, delta);
  actualizeazaButonulInteract();
  salveazaDinCandInCand();

  // Cat timp e meniul deschis, jocul merge mai departe, dar
  // tastele si joystick-ul nu te mai misca.
  const hartaDeschisa = (typeof ecranHarta !== 'undefined') &&
                        !ecranHarta.classList.contains('ascuns');

  if ((typeof meniuDeschis !== 'undefined' && meniuDeschis) ||
      (typeof fereastraDeschisa !== 'undefined' && fereastraDeschisa) ||
      hartaDeschisa) {
    miscaMobii(this, delta);
    actualizeazaResursa(this, delta);
    regenerareViata(this, delta);
    actualizeazaAbilitati(this);
    actualizeazaMiniharta();
    return;
  }

  // Cat esti mort nu te poti misca. Inamicii se misca in continuare:
  // ei trebuie sa se linisteasca si sa se intoarca la locul lor.
  if (mort) {
    miscaMobii(this, delta);
    actualizeazaAbilitati(this);
    return;
  }

  const pas = VITEZA * (delta / 1000);

  let dx = 0;
  let dy = 0;

  if (taste.stanga.isDown)  dx -= 1;
  if (taste.dreapta.isDown) dx += 1;
  if (taste.sus.isDown)     dy -= 1;
  if (taste.jos.isDown)     dy += 1;

  // Daca nu apesi nicio tasta, ne uitam la joystick.
  if (dx === 0 && dy === 0 && (mersJoystick.x !== 0 || mersJoystick.y !== 0)) {
    dx = mersJoystick.x;
    dy = mersJoystick.y;
    tinta = null;
  }

  if (dx !== 0 || dy !== 0) {
    tinta = null;
    const lungime = Math.sqrt(dx * dx + dy * dy);
    dx = dx / lungime;
    dy = dy / lungime;

  } else if (tinta) {
    const vx = tinta.x - jucator.x;
    const vy = tinta.y - jucator.y;
    const distanta = Math.sqrt(vx * vx + vy * vy);
    if (distanta < 4) {
      tinta = null;
    } else {
      dx = vx / distanta;
      dy = vy / distanta;
    }
  }

  // Tinem minte incotro e intors personajul (conteaza la atac).
  if (dx !== 0 || dy !== 0) {
    if (Math.abs(dx) > Math.abs(dy)) {
      directie = (dx > 0) ? 'dreapta' : 'stanga';
    } else {
      directie = (dy > 0) ? 'jos' : 'sus';
    }
    asazaArma();
  }

  // Miscarea, separat pe orizontala si verticala (ca sa aluneci pe langa ziduri).
  if (dx !== 0) {
    const nouX = jucator.x + dx * pas;
    if (potMerge(nouX, jucator.y)) jucator.x = nouX;
    else tinta = null;
  }
  if (dy !== 0) {
    const nouY = jucator.y + dy * pas;
    if (potMerge(jucator.x, nouY)) jucator.y = nouY;
    else tinta = null;
  }

  // Tinem minte cand te-ai miscat ultima oara - de asta depinde Shadowmeld.
  if (dx !== 0 || dy !== 0) ultimaMiscare = this.time.now;

  miscaMobii(this, delta);
  actualizeazaResursa(this, delta);
  regenerareViata(this, delta);
  shadowmeld(this);
  actualizeazaAbilitati(this);
  actualizeazaMiniharta();
}


// ================================================
//  ATACUL
// ================================================
function ataca(scena) {

  if (mort) return;

  const arma = armaDeAtac();
  if (scena.time.now < urmatorulAtac) return;

  if (tragiCuArcul()) {
    // ---- HUNTER: trage in cel mai apropiat inamic din raza arcului ----
    // Nu conteaza incotro esti intors: te intorci singur spre el.
    const tintaLovita = celMaiApropiatMob(jucator.x, jucator.y, RAZA_ATAC_DISTANTA);
    if (!tintaLovita) return;          // fara tinta nu se trage degeaba

    urmatorulAtac = scena.time.now + pauzaIntreLovituri(arma);
    intoarceTeSpre(tintaLovita.x, tintaLovita.y);
    animatiaArcului(scena);
    intraInLupta(scena);

    // WEAPON TRAINING: uneori sageata trece pe langa.
    if (ratezi()) {
      aratacuvant(scena, jucator.x, jucator.y - 44, 'Miss', '#cfd6e0');
      return;
    }

    consumaResursa(scena);
    tragiSageata(scena, tintaLovita, arma);

  } else {
    // ---- CELELALTE CLASE: lovitura corp la corp, in fata ta ----
    urmatorulAtac = scena.time.now + pauzaIntreLovituri(arma);
    animatiaSabiei(scena);

    const p = punctInFata();
    const tintaLovita = celMaiApropiatMob(p.x, p.y, RAZA_ATAC);
    if (!tintaLovita) return;

    intraInLupta(scena);

    // WEAPON TRAINING: uneori dai pe langa.
    if (ratezi()) {
      aratacuvant(scena, jucator.x, jucator.y - 44, 'Miss', '#cfd6e0');
      return;
    }

    consumaResursa(scena);
    const lovitura = damageulTau(arma, attackPowerFolosit(scena, false));
    loveste(scena, tintaLovita, lovitura.damage, lovitura.critic);
  }
}


// Cat astepti intre doua lovituri. Talentele de viteza o scurteaza.
function pauzaIntreLovituri(arma) {
  return (arma.viteza * 1000) / LOVITURI_MAI_DESE * reducereTalent(personaj, 'viteza');
}


// Clasa ta trage cu arcul? (Hunter are arma "distanta", ceilalti nu.)
function tragiCuArcul() {
  return !!personaj.arme.distanta;
}

// Cu ce arma ataci in mod obisnuit.
//
// Daca ai ceva in "Main Hand", aceea e arma ta si damage-ul ei
// conteaza. Daca n-ai nimic, ramai cu arma de start a clasei.
// Hunter trage cu arcul oricum, dar arcul lui devine mai bun odata
// cu ce are echipat.
function armaDeAtac() {

  const deStart = personaj.arme.distanta || personaj.arme.corpLaCorp;
  const echipata = (personaj.echipament || {}).armaPrincipala;

  if (!echipata || !echipata.arma) return deStart;

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


// Rage-ul castigat si mana consumata se impart la fel ca damage-ul,
// altfel lovind de trei ori mai des ai castiga si de trei ori mai mult.
function consumaResursa(scena) {

  intraInLupta(scena);

  // Doar Warrior castiga ceva dintr-o lovitura obisnuita: rage.
  // Celelalte clase NU platesc mana ca sa dea cu arma - mana se
  // consuma doar la abilitati.
  if (personaj.resursa === 'furie') {
    // BATTLE FURY: sub 30% viata, castiga pana la 50% mai mult rage.
    const rageLovitura = (RAGE_PE_LOVITURA / LOVITURI_MAI_DESE) * (1 + sporBattleFury());
    personaj.furie = Math.min(RAGE_MAXIM, personaj.furie + rageLovitura);
    actualizeazaBaraResursa();
  }
}


// Animatia sabiei: se roteste inainte si inapoi.
function animatiaSabiei(scena) {
  const semn = (directie === 'stanga') ? -1 : 1;
  scena.tweens.add({
    targets: armaJucator,
    angle: 120 * semn,
    duration: 110,
    yoyo: true,
    onComplete: () => armaJucator.setAngle(20 * semn)
  });
}


// Animatia arcului: se trage inapoi, ca o coarda intinsa, si revine.
function animatiaArcului(scena) {
  const semn = (directie === 'stanga') ? -1 : 1;
  scena.tweens.add({
    targets: armaJucator,
    x: 5 * semn,
    duration: 90,
    yoyo: true,
    onComplete: () => armaJucator.setPosition(12 * semn, 0)
  });
}


// ================================================
//  SAGEATA
//
//  Damage-ul se calculeaza cand tragi, dar se aplica abia
//  cand sageata ajunge la tinta.
// ================================================
function tragiSageata(scena, tintaLovita, arma, inmultit) {
  inmultit = inmultit || 1;

  const plecX = jucator.x;
  const plecY = jucator.y - 4;
  const unghi = Phaser.Math.Angle.Between(plecX, plecY, tintaLovita.x, tintaLovita.y);

  const sageata = scena.add.container(plecX, plecY);
  // Sageata de la Aimed Shot e mai mare si aurie, ca sa se vada.
  const incarcata = inmultit > 1;
  sageata.add(scena.add.rectangle(0, 0, incarcata ? 24 : 18, incarcata ? 3 : 2, incarcata ? 0xc9922f : 0x8a6a3f));
  sageata.add(scena.add.rectangle(incarcata ? 13 : 10, 0, incarcata ? 7 : 5, incarcata ? 6 : 4, incarcata ? 0xffd76b : 0xd2d6de));
  sageata.add(scena.add.rectangle(incarcata ? -12 : -9, 0, 4, incarcata ? 8 : 6, 0xe8e2d4));
  sageata.setRotation(unghi).setDepth(20);

  // Hunter foloseste Attack Power-ul DE LA DISTANTA, cel cu Agility.
  const lovitura = damageulTau(arma, attackPowerFolosit(scena, true));

  // HUNTER'S EYE: in primele secunde de lupta, sageata loveste mai tare.
  lovitura.damage = lovitura.damage * (1 + sporHuntersEye(scena)) * inmultit;
  if (inmultit > 1) lovitura.damage *= inmultitorTalent(personaj, 'dmgAbilitate');

  const cat = Phaser.Math.Distance.Between(plecX, plecY, tintaLovita.x, tintaLovita.y);

  scena.tweens.add({
    targets: sageata,
    x: tintaLovita.x,
    y: tintaLovita.y,
    duration: Math.max(100, cat * 1.5),
    onComplete: function () {
      sageata.destroy();
      // Poate a murit intre timp - atunci sageata trece pe langa.
      if (tintaLovita.viu) {
        loveste(scena, tintaLovita, lovitura.damage, lovitura.critic);
      }
    }
  });
}


// Te intorci cu fata spre un punct de pe harta.
function intoarceTeSpre(x, y) {
  const dx = x - jucator.x;
  const dy = y - jucator.y;
  if (Math.abs(dx) > Math.abs(dy)) directie = (dx > 0) ? 'dreapta' : 'stanga';
  else directie = (dy > 0) ? 'jos' : 'sus';
  asazaArma();
}


// ================================================
//  DAMAGE-UL, DUPA FORMULELE DIN SPECIFICATIA TA
//
//    damage    = damage-ul armei + (Attack Power / 14) x viteza armei
//    critical  = damage dublu
//    din armura se scade: armura / (armura + 485)
// ================================================
function damageulTau(arma, attackPower) {
  const dinArma = Phaser.Math.Between(arma.dmgMin, arma.dmgMax);
  const dinAP = (attackPower / 14) * arma.viteza;

  // Lovesti de LOVITURI_MAI_DESE ori mai des, deci fiecare lovitura
  // face de atatea ori mai putin. Pe secunda iese acelasi damage.
  let damage = (dinArma + dinAP) / LOVITURI_MAI_DESE;

  // Talentele care cresc damage-ul cu arma.
  damage = damage * inmultitorTalent(personaj, 'dmgArma');

  const critic = (Math.random() * 100) < personaj.critical;
  if (critic) damage = damage * 2;

  return { damage: damage, critic: critic };
}

function dupaArmura(damage, armura) {
  return damage * (1 - armura / (armura + 485));
}


// Cel mai apropiat inamic viu fata de un punct, in raza data.
function celMaiApropiatMob(x, y, raza) {
  let gasit = null;
  let ceaMaiMica = raza;

  mobi.forEach(function (mob) {
    if (!mob.viu) return;
    const d = Phaser.Math.Distance.Between(x, y, mob.x, mob.y);
    if (d <= ceaMaiMica) { ceaMaiMica = d; gasit = mob; }
  });

  return gasit;
}


// Unde ajunge varful sabiei, in functie de incotro esti intors.
function punctInFata() {
  if (directie === 'dreapta') return { x: jucator.x + 24, y: jucator.y };
  if (directie === 'stanga')  return { x: jucator.x - 24, y: jucator.y };
  if (directie === 'sus')     return { x: jucator.x, y: jucator.y - 24 };
  return { x: jucator.x, y: jucator.y + 24 };
}


// Muta sabia in mana potrivita cand te intorci spre stanga sau dreapta.
function asazaArma() {
  const semn = (directie === 'stanga') ? -1 : 1;
  const forma = FORMA_ARMA_CLASA[personaj.idClasa] || 'sabie';

  // Scutul sta mereu in mana cealalta decat arma.
  if (scutJucator) scutJucator.setPosition(-12 * semn, 3);

  if (!armaJucator) return;

  if (forma === 'arc') {
    armaJucator.setPosition(12 * semn, 0);
    armaJucator.setAngle(0);
  } else if (forma === 'toiag') {
    armaJucator.setPosition(11 * semn, 0);
    armaJucator.setAngle(10 * semn);
  } else {
    armaJucator.setPosition(11 * semn, 2);
    armaJucator.setAngle(20 * semn);
  }
}


// ================================================
//  INAMICII
//
//  Nu mai exista un singur orc. Fiecare zona isi spune
//  singura ce inamici are si unde, in lista "mobi" din
//  fisierul ei. Cum arata fiecare fel scrie in mobi.js.
// ================================================

// Face un inamic la locul lui din zona.
// loc = { fel: 'wolf', col: 9, rand: 9 }
function creeazaMob(scena, loc) {

  const fel = MOBI[loc.fel];
  if (!fel) {
    console.warn('Zona cere un fel de inamic care nu exista: ' + loc.fel);
    return;
  }

  // Nivelul si rangul sunt scrise la fiecare inamic in zona.
  const stats = statsPentruNivel(loc.nivel || 1, loc.rang);
  const rang = RANGURI[loc.rang] || RANGURI.normal;

  const x = loc.col * TILE + TILE / 2;
  const y = loc.rand * TILE + TILE / 2;

  const mob = scena.add.container(x, y);

  // Umbra pe pamant, apoi bucatile scrise in mobi.js, cu contur.
  mob.add(faUmbra(scena, 24 * rang.marime));
  deseneazaForme(scena, fel.forme).forEach(function (bucata) { mob.add(bucata); });

  // Cei rari si cei elit sunt si mai MARI, ca sa se vada de departe
  // ca nu-s de rand.
  if (rang.id !== 'normal') {
    mob.list.forEach(function (b) {
      b.x = b.x * rang.marime;
      b.y = b.y * rang.marime;
      if (b.setScale) b.setScale(rang.marime);
    });
  }

  // Numele. Unul de rand se cheama dupa felul lui; unul rar are nume
  // propriu, scris cu ARGINTIU; unul elit, cu AURIU.
  const numeArata = loc.nume || fel.nume;
  mob.add(scena.add.text(0, -40 * rang.marime,
    numeArata + ' (' + TEXT.LEVEL + ' ' + stats.nivel + ')', {
    fontFamily: UI.FONT,
    fontSize: (rang.id === 'normal') ? '10px' : '12px',
    fontStyle: (rang.id === 'normal') ? '' : 'bold',
    color: rang.culoare,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5));

  // Rama din jurul barei de viata: argintie la rari, aurie la eliti.
  if (rang.id !== 'normal') {
    mob.add(scena.add.text(0, -52 * rang.marime,
      rang.id === 'rar' ? TEXT.RARE : TEXT.ELITE, {
      fontFamily: UI.FONT,
      fontSize: '9px',
      fontStyle: 'bold',
      color: rang.culoare,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5));
  }

  // Bara lui de viata.
  const susBara = -28 * rang.marime;
  mob.add(scena.add.rectangle(0, susBara, 34, 8, culoareDinText(rang.culoare)).setOrigin(0.5));
  mob.add(scena.add.rectangle(0, susBara, 32, 6, 0x000000).setOrigin(0.5));
  const bara = scena.add.rectangle(-15, susBara - 3, 30, 4, 0xcc3322).setOrigin(0, 0);
  mob.add(bara);

  mob.setDepth(9);

  // Ce tine minte fiecare inamic.
  mob.fel = fel;
  mob.felul = loc.fel;      // 'wolf', 'bandit'... numele scurt, pentru misiuni
  mob.rang = rang;
  mob.stats = stats;
  mob.viataMaxima = stats.viata;
  mob.viata = stats.viata;
  mob.viu = true;
  mob.bara = bara;
  mob.locul = loc;          // de unde a pornit, ca sa reapara tot acolo
  loc.aparut = true;
  mob.casaX = x;
  mob.casaY = y;
  mob.dx = 0;
  mob.dy = 0;
  mob.timp = Math.random() * 1200;

  // Lupta: e furios pe tine? si cand poate lovi din nou?
  mob.furios = false;
  mob.urmatoareaLovitura = 0;

  mobi.push(mob);

  // Apare cu o mica animatie.
  mob.setScale(0);
  scena.tweens.add({ targets: mob, scale: 1, duration: 260, ease: 'Back.Out' });
}


// ================================================
//  PERSONAJELE PRIETENOASE (NPC)
//
//  Nu sunt pusi in lista "mobi", asa ca atacul tau nu-i
//  gaseste niciodata: nu ai cum sa-i lovesti din greseala.
//  Nu se misca si nu au bara de viata.
// ================================================
function creeazaNpc(scena, loc) {

  const cine = NPC[loc.fel];
  if (!cine) {
    console.warn('Zona cere un personaj care nu exista: ' + loc.fel);
    return;
  }

  const p = scena.add.container(loc.col * TILE + TILE / 2, loc.rand * TILE + TILE / 2);

  p.add(faUmbra(scena, 24));
  deseneazaForme(scena, cine.forme).forEach(function (bucata) { p.add(bucata); });

  // Numele AURIU - asa se vede dintr-o privire ca nu e inamic.
  p.add(scena.add.text(0, -44, cine.nume, {
    fontFamily: UI.FONT,
    fontSize: '11px',
    color: UI.textAuriu,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5));

  p.add(scena.add.text(0, -33, '<' + cine.titlu + '>', {
    fontFamily: UI.FONT,
    fontSize: '9px',
    color: UI.textStins,
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5));

  // Semnul de deasupra capului: ! daca are ceva de dat, ? daca ai
  // terminat ceva si te asteapta. Acelasi lucru ca in WoW.
  const semn = scena.add.text(0, -62, '', {
    fontFamily: UI.FONT,
    fontSize: '26px',
    fontStyle: 'bold',
    color: '#ffd34d',
    stroke: '#000000',
    strokeThickness: 5
  }).setOrigin(0.5);
  p.add(semn);

  p.setDepth(9);

  p.cine = cine;
  p.felul = loc.fel;
  p.semn = semn;

  // Negustorii isi fac taraba o data, cand intri in zona.
  if (cine.vinde) p.marfa = faMarfa(cine.vinde);

  npci.push(p);
  actualizeazaSemnul(p);
}


// Pune semnul potrivit deasupra unui personaj prietenos.
function actualizeazaSemnul(p) {
  if (!p.semn) return;
  const semn = semnulLui(personaj, zona.nume, p.felul);
  p.semn.setText(semn === '...' ? '?' : semn);
  // Semnul stins inseamna "ai luat, dar n-ai terminat inca".
  p.semn.setColor(semn === '...' ? '#7a6748' : '#ffd34d');
}

function actualizeazaSemnele() {
  tinteDeMisiune = null;      // se socoteste din nou la prima nevoie
  npci.forEach(actualizeazaSemnul);
  if (typeof salveaza === 'function') salveaza();
}


// Reface bara de viata de deasupra capului unui inamic.
function actualizeazaBaraMob(mob) {
  const parte = Math.max(0, mob.viata) / mob.viataMaxima;
  mob.bara.setDisplaySize(30 * parte, 4);
}


// Inamicul incaseaza damage.
function loveste(scena, mob, damageBrut, critic) {

  // Armura lui ii taie o parte din damage.
  const damage = Math.max(1, Math.round(dupaArmura(damageBrut, mob.stats.armura)));

  mob.viata -= damage;
  actualizeazaBaraMob(mob);
  aratacifra(scena, mob.x, mob.y - 46, damage, critic);

  // L-ai lovit: se infurie pe tine, chiar daca nu te vazuse.
  mob.furios = true;

  // Tresare, ca sa se vada ca a fost lovit.
  scena.tweens.add({
    targets: mob,
    x: mob.x + Phaser.Math.Between(-6, 6),
    duration: 60,
    yoyo: true
  });

  if (mob.viata <= 0) {
    mob.viu = false;

    // Experienta pentru inamicul ucis.
    primesteXp(scena, Math.round(xpDeLaMob(mob.stats.nivel, personaj.nivel) * mob.rang.xp));

    // Ce a lasat in urma NU sare singur la tine, ca pana acum.
    // Ramane in trupul lui, iar tu te duci si il iei - ca in WoW.
    const prada = pradaCompleta(mob.stats.nivel, mob.fel.neam === 'umanoid',
                                mob.felul, mob.rang.id);

    // Lucrurile cerute de misiuni cad in acelasi trup.
    prada.obiecteMisiune = obiecteDeMisiuneDeLa(personaj, mob.felul);

    if (pradaAreCeva(prada)) faSac(scena, mob.x, mob.y, prada);

    // Misiunile de tip "omoara atatia" isi numara singure.
    amUcis(personaj, mob.felul).forEach(function (avans) {
      aratacuvant(scena, jucator.x, jucator.y - 70,
        avans.terminata ? TEXT.QUEST_COMPLETE
                        : textulCerintei(personaj, avans.misiune),
        avans.terminata ? '#ffd34d' : UI.text);
    });
    actualizeazaSemnele();

    // CANNIBALIZE (Undead): dupa ce omori ceva, te refaci 10 secunde.
    if (personaj.idRasa === 'undead') {
      canibalizarePanaLa = scena.time.now + CANIBALIZARE_SECUNDE * 1000;
      numeleAbilitatii(scena, RASE[personaj.idRasa].pasive[0].nume);
    }

    const celMort = mob;
    const locul = mob.locul;

    scena.tweens.add({
      targets: celMort,
      scale: 0,
      angle: 200,
      alpha: 0,
      duration: 320,
      onComplete: function () {
        mobi = mobi.filter(function (m) { return m !== celMort; });
        celMort.destroy();
      }
    });

    // Locul lui se elibereaza. Reapare singur, dupa ce trece timpul
    // si daca esti destul de aproape ca sa merite desenat.
    locul.aparut = false;
    locul.mortPanaLa = scena.time.now + mob.rang.reaparitie;
  }
}


// Cifra de damage care sare in sus si dispare.
function aratacifra(scena, x, y, damage, critic) {
  const t = scena.add.text(x, y, critic ? damage + '!' : '' + damage, {
    fontFamily: UI.FONT,
    fontSize: critic ? '19px' : '14px',
    color: critic ? '#ffd34d' : '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(50);

  scena.tweens.add({
    targets: t,
    y: y - 26,
    alpha: 0,
    duration: 750,
    onComplete: function () { t.destroy(); }
  });
}


// ================================================
//  CE FAC INAMICII
//
//  Doua purtari, ca in WoW:
//    LINISTIT - se plimba prin jurul locului lui. Daca te apropii
//               prea mult, te observa si se infurie.
//    FURIOS   - vine dupa tine si te loveste. Daca l-ai tras prea
//               departe de casa, renunta, se intoarce si se vindeca.
// ================================================
function miscaMobii(scena, delta) {

  mobi.forEach(function (mob) {
    if (!mob.viu) return;

    const departeDeCasa = Phaser.Math.Distance.Between(mob.x, mob.y, mob.casaX, mob.casaY);
    const panaLaTine = Phaser.Math.Distance.Between(mob.x, mob.y, jucator.x, jucator.y);

    // --- se infurie daca te apropii ---
    if (!mob.furios && !mort && panaLaTine <= RAZA_AGRO) {
      mob.furios = true;
    }

    // --- l-ai tras prea departe, sau ai murit: renunta ---
    if (mob.furios && (departeDeCasa > RAZA_LESA || mort)) {
      mob.furios = false;
    }

    // Cand nu mai lupta, isi reface viata INCET, nu dintr-o data:
    // toata bara in REGENERARE_MOB_SECUNDE secunde.
    if (!mob.furios && mob.viata < mob.viataMaxima) {
      const peSecunda = mob.viataMaxima / REGENERARE_MOB_SECUNDE;
      mob.viata = Math.min(mob.viataMaxima, mob.viata + peSecunda * (delta / 1000));
      actualizeazaBaraMob(mob);
    }

    if (mob.furios) {
      // --- vine dupa tine ---
      if (panaLaTine <= RAZA_ATAC_MOB) {
        // E langa tine: sta pe loc si loveste cand ii vine randul.
        mob.dx = 0;
        mob.dy = 0;
        if (scena.time.now >= mob.urmatoareaLovitura) {
          mob.urmatoareaLovitura = scena.time.now + mob.stats.viteza * 1000;
          mobTeLoveste(scena, mob);
        }
      } else {
        const vx = jucator.x - mob.x;
        const vy = jucator.y - mob.y;
        const lung = Math.sqrt(vx * vx + vy * vy) || 1;
        mob.dx = vx / lung;
        mob.dy = vy / lung;
      }

    } else {
      // --- se plimba linistit prin jurul locului lui ---
      mob.timp -= delta;
      if (mob.timp <= 0) {
        if (departeDeCasa > RAZA_PLIMBARE) {
          const vx = mob.casaX - mob.x;
          const vy = mob.casaY - mob.y;
          const lung = Math.sqrt(vx * vx + vy * vy) || 1;
          mob.dx = vx / lung;
          mob.dy = vy / lung;
        } else {
          const optiuni = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
          const aleasa = optiuni[Math.floor(Math.random() * optiuni.length)];
          mob.dx = aleasa[0];
          mob.dy = aleasa[1];
        }
        mob.timp = 700 + Math.random() * 1400;
      }
    }

    const pas = (mob.furios ? VITEZA_MOB_FURIOS : VITEZA_MOB) * (delta / 1000);

    if (mob.dx !== 0) {
      const nouX = mob.x + mob.dx * pas;
      if (potMerge(nouX, mob.y)) mob.x = nouX;
      else mob.dx = 0;
    }
    if (mob.dy !== 0) {
      const nouY = mob.y + mob.dy * pas;
      if (potMerge(mob.x, nouY)) mob.y = nouY;
      else mob.dy = 0;
    }
  });
}


// ================================================
//  INAMICUL TE LOVESTE PE TINE
//
//  Acelasi calcul ca al tau, doar ca acum armura ta
//  e cea care taie din damage.
// ================================================
function mobTeLoveste(scena, mob) {

  if (mort) return;

  intraInLupta(scena);

  // QUICKNESS (Night Elf): uneori te dai la o parte si nu incasezi nimic.
  if (evitiLovitura()) {
    aratacuvant(scena, jucator.x, jucator.y - 44, 'Dodge', '#a8e8ff');
    return;
  }

  const s = mob.stats;
  let brut = Phaser.Math.Between(s.dmgMin, s.dmgMax);

  // Si inamicii dau critical, ca sa aiba ce reduce Hardiness.
  const criticMob = (Math.random() * 100) < SANSA_CRITIC_MOB;
  if (criticMob) {
    brut = brut * 2;
    // HARDINESS (Orc): incasezi cu 15% mai putin din critical.
    if (personaj.idRasa === 'orc') brut = brut * (1 - HARDINESS_REDUCERE);
  }

  let damage = Math.max(1, Math.round(dupaArmura(brut, personaj.armura) *
                                      reducereTalent(personaj, 'damageIncasat')));

  // ARCANE BARRIER: scutul inghite primul, pana se termina.
  damage = scutulInghite(scena, damage);

  if (damage > 0) {
    personaj.viata = personaj.viata - damage;
    aratacifraRosie(scena, jucator.x, jucator.y - 44, damage);
  }

  // Warrior castiga rage si cand INCASEAZA, exact cum ai scris tu.
  // BATTLE FURY il ajuta si aici, cand e la ananghie.
  if (personaj.resursa === 'furie') {
    const castig = RAGE_LA_INCASARE * (1 + sporBattleFury());
    personaj.furie = Math.min(RAGE_MAXIM, personaj.furie + castig);
    actualizeazaBaraResursa();
  }

  actualizeazaBaraViata();

  // Tresari, ca sa se vada ca ai fost lovit.
  scena.tweens.add({
    targets: jucator,
    x: jucator.x + Phaser.Math.Between(-5, 5),
    duration: 60,
    yoyo: true
  });

  if (personaj.viata <= 0) {
    personaj.viata = 0;
    actualizeazaBaraViata();
    mori(scena);
  }
}


// Cifra rosie cu damage-ul pe care il incasezi TU.
function aratacifraRosie(scena, x, y, damage) {
  const t = scena.add.text(x, y, '-' + damage, {
    fontFamily: UI.FONT,
    fontSize: '16px',
    color: '#ff6b5e',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(50);

  scena.tweens.add({
    targets: t, y: y - 26, alpha: 0, duration: 800,
    onComplete: function () { t.destroy(); }
  });
}


// ================================================
//  MOARTEA SI INTOARCEREA IN TABARA
// ================================================
function mori(scena) {

  mort = true;
  tinta = null;

  // Te faci gri si transparent.
  scena.tweens.add({ targets: jucator, alpha: 0.35, angle: 90, duration: 400 });

  const mesaj = scena.add.text(LATIME / 2, INALTIME / 2 - 20,
    TEXT.YOU_DIED + '\n' + TEXT.RETURNING, {
      fontFamily: UI.FONT,
      fontSize: '26px',
      color: '#c94a3a',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2000);

  scena.time.delayedCall(TIMP_REINVIERE, function () {
    mesaj.destroy();
    reinvie(scena);
  });
}


function reinvie(scena) {

  // Te intorci in punctul de reinviere scris in fisierul zonei.
  jucator.x = zona.reinviere.col * TILE + TILE / 2;
  jucator.y = zona.reinviere.rand * TILE + TILE / 2;
  jucator.setAlpha(1).setAngle(0);

  personaj.viata = personaj.viataMaxima;
  if (personaj.resursa === 'furie') personaj.furie = 0;
  else personaj.mana = personaj.manaMaxima;

  mort = false;
  ultimaLupta = -99999;
  scut = (personaj.idClasa === 'mage') ? ARCANE_BARRIER_SCUT : 0;

  // Abilitatile se iau de la capat, iar incantarea inceputa se pierde.
  pauzaAbilitati = {};
  abilitateInCurs = null;
  tintaVrajii = null;
  canibalizarePanaLa = 0;
  bloodFuryPanaLa = 0;
  if (fundalCast) fundalCast.setVisible(false);
  if (baraCast) baraCast.setVisible(false);

  actualizeazaBaraViata();
  actualizeazaBaraResursa();
  actualizeazaScut();
  actualizeazaNivelul();
}


// ================================================
//  UNELTE
// ================================================

// Transforma o culoare scrisa ca text ('#e8b98a') in numarul
// pe care il intelege Phaser (0xe8b98a).
function culoareDinText(text) {
  return parseInt(text.replace('#', ''), 16);
}


// Arma si scutul se fac din aceleasi liste de forme ca personajul
// (infatisare.js), deci isi schimba metalul odata cu ce ai echipat.
function faArmaJucator(scena) {
  const arma = scena.add.container(0, 0);
  arma.add(deseneazaForme(scena, formeArma(personaj)));
  return arma;
}

// Intoarce null daca n-ai nimic in "Off Hand".
function faScutJucator(scena) {
  const forme = formeScut(personaj);
  if (forme.length === 0) return null;
  const scut = scena.add.container(0, 0);
  scut.add(deseneazaForme(scena, forme));
  return scut;
}


// Se poate trece peste litera asta? O litera pe care zona nu o
// cunoaste o socotim blocata, ca sa nu iesim din harta din greseala.
function esteBlocat(litera) {
  const felul = zona.teren[litera];
  return !felul || felul.blocat;
}


// Are voie cineva sa stea in pozitia (x, y)?
function potMerge(x, y) {
  const colturi = [
    [x - 9, y + 2],
    [x + 9, y + 2],
    [x - 9, y + 15],
    [x + 9, y + 15]
  ];

  for (const colt of colturi) {
    const c = Math.floor(colt[0] / TILE);
    const r = Math.floor(colt[1] / TILE);
    if (r < 0 || r >= zona.harta.length || c < 0 || c >= zona.harta[0].length) return false;
    if (esteBlocat(zona.harta[r][c])) return false;
  }
  return true;
}
