// ==========================================================
//  LISTA ZONELOR
//
//  Fiecare fisier de zona se adauga singur aici, chemand
//  inregistreazaZona() cu RETETA lui. Harta nu e in lista -
//  se construieste abia cand intri in zona.
//
//  Ca sa adaugi o zona noua: faci fisierul in dosarul "zone",
//  ii pui un rand in index.html, si ii scrii vecinii. Atat.
// ==========================================================

const ZONE = [];

function inregistreazaZona(reteta) {
  ZONE.push(reteta);
}

// ----------------------------------------------------------
//  Vecinii se afla SINGURI din harta lumii
//
//  Fiecare zona isi stie casuta pe grila continentului. Doua zone
//  alaturate pe grila sunt vecine, si drumul dintre ele merge in
//  amandoua sensurile. Asa nu se poate intampla sa scriu intr-un
//  fisier "la est e Mistwood" si sa uit sa scriu in Mistwood "la
//  vest e zona asta" - greseala pe care am facut-o deja o data.
// ----------------------------------------------------------
function leagaZonele() {

  ZONE.forEach(function (z) { z.vecini = {}; });

  ZONE.forEach(function (a) {
    ZONE.forEach(function (b) {
      if (a === b || a.continent !== b.continent) return;

      const dc = b.peHarta.c - a.peHarta.c;
      const dr = b.peHarta.r - a.peHarta.r;

      if (dc === 1 && dr === 0) a.vecini.est = b.id;
      else if (dc === -1 && dr === 0) a.vecini.vest = b.id;
      else if (dc === 0 && dr === 1) a.vecini.sud = b.id;
      else if (dc === 0 && dr === -1) a.vecini.nord = b.id;
    });
  });
}


function retetaZonei(id) {
  return ZONE.find(function (z) { return z.id === id; }) || null;
}

// Zona in care incepi, dupa factiunea rasei tale. Fiecare continent
// are cate o zona de inceput pentru fiecare tabara, ca in WoW.
const ZONA_DE_START = {
  human:    'greenvale',
  nightelf: 'silverbough',
  orc:      'redwaste',
  undead:   'gravemoor'
};


// ==========================================================
//  CONTINENTELE
// ==========================================================
const CONTINENTE = [
  { id: 'eastmarch', nume: 'Eastmarch',
    descriere: 'Padure, campie si munti de fier. Aici incep Human si Undead.' },
  { id: 'karador',   nume: 'Karador',
    descriere: 'Canion rosu, coasta si gheata. Aici incep Orc si Night Elf.' }
];

function zoneleContinentului(idContinent) {
  return ZONE.filter(function (z) { return z.continent === idContinent; });
}


// Zonele in care se poate ajunge pe jos sau cu corabia, din zona data.
function undePotiMerge(idZona) {

  const z = retetaZonei(idZona);
  if (!z) return [];

  const drumuri = Object.keys(z.vecini || {}).map(function (latura) {
    return { fel: 'drum', latura: latura, catre: z.vecini[latura] };
  });

  if (z.port) {
    drumuri.push({ fel: z.port.fel, catre: z.port.catre, la: z.port.la });
  }
  return drumuri;
}
