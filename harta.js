// ==========================================================
//  HARTA LUMII
//
//  Se deschide apasand pe miniharta din dreapta sus. Arata cele
//  doua continente si toate zonele lor: numele, nivelurile, si
//  drumurile dintre ele.
//
//  Pe ea NU apar inamicii. Harta e pentru drum - ca sa stii unde
//  sa te duci cand o misiune spune "east of the river" - nu ca
//  sa vezi unde e fiecare lup.
//
//  NU te teleporteaza nicaieri. Ca in WoW, te duci pe jos.
// ==========================================================

const ecranHarta = document.getElementById('ecran-harta');
const plansaHarta = document.getElementById('plansa-harta');
const detaliiZona = document.getElementById('detalii-zona');
const fileContinente = document.getElementById('file-continente');

let continentulAratat = null;
let zonaAleasa = null;


function deschideHarta() {
  if (!zona) return;
  if (typeof meniuDeschis !== 'undefined' && meniuDeschis) inchideMeniul();
  if (typeof fereastraDeschisa !== 'undefined' && fereastraDeschisa) inchideFereastraDeschisa();

  continentulAratat = zona.continent;
  zonaAleasa = zona.id;
  ecranHarta.classList.remove('ascuns');
  scrieHarta();
}


function inchideHarta() {
  ecranHarta.classList.add('ascuns');
}


// Culoarea unei zone dupa cat de potrivita e pentru nivelul tau:
// verde = esti bun de ea, galben = e cam sus, rosu = te omoara,
// cenusiu = ai depasit-o demult.
function culoareaZonei(z) {
  const n = personaj.nivel;
  if (n < z.nivelDeLa - 2) return 'prea-tare';
  if (n < z.nivelDeLa)     return 'cam-tare';
  if (n <= z.nivelPanaLa)  return 'potrivita';
  if (n <= z.nivelPanaLa + 6) return 'usoara';
  return 'depasita';
}


function scrieHarta() {

  // ---- filele celor doua continente ----
  fileContinente.innerHTML = CONTINENTE.map(function (c) {
    return '<button class="fila' + (c.id === continentulAratat ? ' aleasa' : '') +
           '" data-continent="' + c.id + '">' + c.nume + '</button>';
  }).join('');

  fileContinente.querySelectorAll('[data-continent]').forEach(function (b) {
    b.addEventListener('click', function () {
      continentulAratat = b.dataset.continent;
      const ale = zoneleContinentului(continentulAratat);
      zonaAleasa = ale.length ? ale[0].id : null;
      scrieHarta();
    });
  });

  // ---- plansa cu zonele ----
  const ale = zoneleContinentului(continentulAratat);

  // Cat de mare e grila pe care stau zonele continentului asta.
  const maxC = Math.max.apply(null, ale.map(function (z) { return z.peHarta.c; })) + 1;
  const maxR = Math.max.apply(null, ale.map(function (z) { return z.peHarta.r; })) + 1;

  let html = '<div class="grila-harta" style="grid-template-columns:repeat(' + maxC +
             ',1fr);grid-template-rows:repeat(' + maxR + ',1fr)">';

  ale.forEach(function (z) {
    const aici = (zona && z.id === zona.id);
    html += '<button class="zona-harta ' + culoareaZonei(z) +
            (aici ? ' aici' : '') + (z.id === zonaAleasa ? ' aleasa' : '') +
            '" data-zona="' + z.id + '"' +
            ' style="grid-column:' + (z.peHarta.c + 1) + ';grid-row:' + (z.peHarta.r + 1) + '">' +
            '<span class="nume-zona">' + z.nume + '</span>' +
            '<span class="nivel-zona">' + z.nivelDeLa + ' &ndash; ' + z.nivelPanaLa + '</span>' +
            (z.factiune ? '<span class="steag-zona">' + z.factiune + '</span>' : '') +
            (aici ? '<span class="esti-aici">You are here</span>' : '') +
            '</button>';
  });

  html += '</div>';
  plansaHarta.innerHTML = html;

  plansaHarta.querySelectorAll('[data-zona]').forEach(function (b) {
    b.addEventListener('click', function () {
      zonaAleasa = b.dataset.zona;
      scrieHarta();
    });
  });

  scrieDetaliile();
}


function scrieDetaliile() {

  const z = retetaZonei(zonaAleasa);
  if (!z) { detaliiZona.innerHTML = ''; return; }

  const continent = CONTINENTE.find(function (c) { return c.id === z.continent; });

  let html = '<h3>' + z.nume + '</h3>';
  html += '<div class="rand-detaliu"><span>' + TEXT.LEVEL + '</span><span>' +
          z.nivelDeLa + ' &ndash; ' + z.nivelPanaLa + '</span></div>';
  html += '<div class="rand-detaliu"><span>Continent</span><span>' +
          (continent ? continent.nume : '') + '</span></div>';
  html += '<div class="rand-detaliu"><span>Home of</span><span>' +
          (z.factiune || 'Both factions') + '</span></div>';

  // ---- cum ajungi acolo ----
  html += '<div class="cap-detaliu">' + TEXT.ROADS + '</div><ul class="drumuri">';

  const iesiri = undePotiMerge(z.id);
  if (iesiri.length === 0) {
    html += '<li>Nowhere from here.</li>';
  }
  iesiri.forEach(function (d) {
    const catre = retetaZonei(d.catre);
    if (!catre) return;
    const cum = d.fel === 'drum' ? ('road ' + LATURA_IN_ENGLEZA[d.latura])
              : d.fel === 'corabie' ? 'by ship'
              : 'by zeppelin';
    html += '<li><b>' + catre.nume + '</b> <span class="stins">(' +
            catre.nivelDeLa + '&ndash;' + catre.nivelPanaLa + ') &middot; ' + cum + '</span></li>';
  });
  html += '</ul>';

  if (zona && z.id === zona.id) {
    html += '<div class="nota-harta">' + TEXT.YOU_ARE_HERE_NOTE + '</div>';
  }

  detaliiZona.innerHTML = html;
}


const LATURA_IN_ENGLEZA = {
  nord: 'north', sud: 'south', vest: 'west', est: 'east'
};


document.getElementById('inchide-harta').addEventListener('click', inchideHarta);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !ecranHarta.classList.contains('ascuns')) inchideHarta();
  if ((e.key === 'h' || e.key === 'H') && personaj && zona) {
    if (ecranHarta.classList.contains('ascuns')) deschideHarta();
    else inchideHarta();
  }
});
