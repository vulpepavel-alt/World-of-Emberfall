// ==========================================================
//  ZONA: Dustplain
//
//  Campie intinsa de praf, cea mai mare zona a continentului.
//  Aici coboara zeppelinul de pe celalalt continent.
//
//  Harta NU e scrisa aici. Fisierul asta e o RETETA: spune cat e
//  de mare, ce culori are si unde stau locurile care conteaza.
//  Harta se construieste cand intri in zona, din samanta de mai
//  jos - aceeasi samanta da mereu aceeasi harta.
// ==========================================================

inregistreazaZona({

  id: 'dustplain',
  nume: 'Dustplain',
  continent: 'karador',
  factiune: null,

  nivelDeLa: 12,
  nivelPanaLa: 22,

  COL: 900,
  RND: 600,
  samanta: 52003,

  // Unde sta pe harta lumii (coloana, randul)
  peHarta: { c: 1, r: 1 },

  litere: LITERE,
  teren: climat('campie'),


  // De aici pleci pe celalalt continent.
  port: { fel: 'zeppelin', catre: 'thornmoor', la: 'port' },

  locuri: [
    { fel: 'tabara', id: 'tabara', c: 0.14, r: 0.48 },
    { fel: 'post', id: 'port', c: 0.2, r: 0.26 },
    { fel: 'corturi', id: 'tabara1', c: 0.56, r: 0.3 },
    { fel: 'corturi', id: 'tabara2', c: 0.66, r: 0.74 },
    { fel: 'pestera', id: 'gaura', c: 0.38, r: 0.66 },
    { fel: 'mina', id: 'mina', c: 0.8, r: 0.52 }
  ],

  npci: [
    { fel: 'negustorOrc', la: 'tabara', dc: -6, dr: -1 },
    { fel: 'armurierOrc', la: 'tabara', dc: 16, dr: -2 },
    { fel: 'cercetas', la: 'tabara', dc: 10, dr: 6 }
  ],

  tabere: 78,

  // Cine apare la fiecare nivel din zona.
  feluriPeNivel: function (n) {
    if (n <= 14) return ['boar', 'vulture'];
    if (n <= 17) return ['vulture', 'serpent'];
    if (n <= 20) return ['serpent', 'scorpid', 'raider'];
    return ['raider', 'scorpid'];
  },

  start: { la: 'tabara', dc: 6, dr: 1 },

  vecini: { sud: 'redwaste', nord: 'silverbough', est: 'saltcliff' }
});
