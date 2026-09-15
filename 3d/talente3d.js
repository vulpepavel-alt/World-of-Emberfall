// ==========================================================
//  THE TALENT TREES
//
//  From level 10 you get a point every level, 51 by level 60. You
//  spend them in three trees, and what you spend them on is the
//  difference between two warriors of the same level.
//
//  Press N.
//
//  talente.js knows all of it: the three trees per class, what each
//  talent does, how many ranks it has, which tier it sits on, which
//  talent must come before it, and how many points that tier needs.
//  poateInvata() answers whether you may take one and says why not
//  if you may not. Nothing about any of that is decided here.
//
//  What IS here: showing the trees, and making sure every one of the
//  twelve effects actually reaches the game. That last part was the
//  real work - the talents existed and could be spent, but eight of
//  the twelve effects were not being read by anything in the 3D
//  world, so half the tree was decoration.
// ==========================================================


let arboriDeschisi = false;
let mesajTalente = '';

function deschideTalentele() {
  if (!cutiaFerestrei) faFereastra();
  if (arboriDeschisi) { inchideFerestrele(); arboriDeschisi = false; return; }

  inchideFerestrele();
  arboriDeschisi = true;
  mesajTalente = '';
  cutiaFerestrei.classList.remove('ascuns');
  cutiaFerestrei.classList.add('lat');
  scrieTalentele();
}


function scrieTalentele() {
  if (!arboriDeschisi || !personaj) return;

  const ramase = puncteRamase(personaj);
  document.getElementById('titlu3d').textContent =
    (TEXT.TALENTS_TITLE || 'Talents') + '  ·  ' + ramase + ' point' +
    (ramase === 1 ? '' : 's') + ' left';

  let html = '';
  if (mesajTalente) html += '<p class="mesaj">' + mesajTalente + '</p>';
  if (personaj.nivel < NIVEL_PRIMUL_TALENT) {
    html += '<p class="gol">The first point comes at level ' + NIVEL_PRIMUL_TALENT + '.</p>';
  }

  html += '<div class="arbori">';

  arboriiClasei(personaj.idClasa).forEach(function (arbore) {
    const inArbore = puncteInArbore(personaj.talente || {}, arbore);
    html += '<div class="arbore"><div class="cap-arbore">' + arbore.nume +
            ' <span>' + inArbore + '</span></div>';

    // Grouped by tier, so the shape of the tree is visible.
    const trepte = {};
    arbore.talente.forEach(function (tal) {
      (trepte[tal.treapta] = trepte[tal.treapta] || []).push(tal);
    });

    Object.keys(trepte).sort(function (a, b) { return a - b; }).forEach(function (tr) {
      const cerute = tr * PUNCTE_PE_TREAPTA;
      const deschisa = inArbore >= cerute;
      html += '<div class="treapta' + (deschisa ? '' : ' inchisa') + '">';
      if (!deschisa) html += '<span class="lacat">' + cerute + '</span>';

      trepte[tr].forEach(function (tal) {
        const rang = (personaj.talente || {})[tal.id] || 0;
        const poate = poateInvata(personaj, tal.id);
        html += '<div class="talent' + (rang ? ' luat' : '') +
                  (poate.poate ? ' poti' : '') + '" data-talent="' + tal.id + '">' +
                  '<div class="nume-talent">' + tal.nume + '</div>' +
                  '<div class="rang">' + rang + '/' + tal.maxRang + '</div>' +
                  '<div class="ce-face">' + descriereTalent(tal, Math.max(1, rang)) + '</div>' +
                '</div>';
      });
      html += '</div>';
    });

    html += '</div>';
  });

  html += '</div>';

  if (puncteCheltuite(personaj.idClasa, personaj.talente || {}) > 0) {
    html += '<button class="lat" id="uita-talente">' +
            (TEXT.TALENTS_RESET || 'Unlearn everything') + '</button>';
  }

  const corp = document.getElementById('corp3d');
  corp.innerHTML = html;

  corp.querySelectorAll('[data-talent]').forEach(function (el) {
    el.addEventListener('click', function () { iaTalentul(el.dataset.talent); });
  });
  const b = document.getElementById('uita-talente');
  if (b) b.addEventListener('click', function () {
    reseteazaTalentele(personaj);
    recalculeazaPersonajul3d();
    mesajTalente = TEXT.TALENTS_RESET_DONE || 'All points are yours again.';
    scrieTalentele();
  });
}


function iaTalentul(id) {
  // poateInvata() gives back {poate, motiv} - an object, never a
  // plain true. Treating it as a boolean would let you spend points
  // you do not have, because an object is always truthy.
  const poate = poateInvata(personaj, id);
  if (!poate.poate) { mesajTalente = poate.motiv; scrieTalentele(); return; }

  invataTalent(personaj, id);
  mesajTalente = '';

  // The numbers change the moment a point is spent - more health,
  // more armour, a better critical chance.
  recalculeazaPersonajul3d();
  scrieTalentele();
}


window.addEventListener('keydown', function (e) {
  if (!personaj || !zona) return;
  if (e.code === 'KeyN') deschideTalentele();
});
