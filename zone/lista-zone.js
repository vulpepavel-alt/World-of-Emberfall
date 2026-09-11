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
