// ==========================================================
//  ORASUL: Karrak Hold       (karador, harta lui proprie)
//
//  Orasul principal al Hoardei. NU e un loc pe harta unei zone -
//  e o harta a lui, in care intri pe poarta din Dustplain, la fel
//  cum treci dintr-o zona in alta.
//
//  esteOras: true face trei lucruri:
//    - harta se construieste din strazi si case, nu din padure
//    - nu apare niciun inamic, nici marunt, nici rar, nici elit
//    - nu primeste misiuni facute dupa tipare
//
//  Tot restul merge prin acelasi cod ca orice zona: aceleasi litere,
//  aceeasi miniharta, aceeasi harta din meniu, aceiasi oameni.
//
//  "iesire" e poarta de la miazazi: pe ea te intorci in Dustplain.
//  Perechea ei, intrarea, e scrisa in reteta Dustplain-ului.
// ==========================================================

inregistreazaZona({

  id: 'karrakhold',
  nume: 'Karrak Hold',
  continent: 'karador',
  // Orasul e AL unei tabere. Cine vine din cealalta da de garzi.
  factiune: 'Pact',
  esteOras: true,

  // Nu se lupta nimeni aici. Nivelurile sunt scrise doar ca harta
  // sa stie ce culoare sa-i dea si de la ce nivel are rost sa vii.
  nivelDeLa: 10,
  nivelPanaLa: 20,

  // Un oras e mai mic decat o zona, dar tot iti ia un minut bun
  // sa-l strabati dintr-un capat in altul.
  COL: 260,
  RND: 180,
  samanta: 38517,

  peHarta: null,          // orasele nu stau pe grila continentului

  litere: LITERE,

  // Pavaj, zid de piatra si acoperisuri rosii. Pornim de la muntele
  // de piatra si schimbam ce trebuie.
  climat: 'pustiu',
  teren: climat('pustiu', {
    fond: 0x8a6a4a, fondVariatie: 0x926f4e, texturaFond: 'piatra',
    petec: 0x7a4526, petecVariatie: 0x854c2a, texturaPetec: 'nisip',
    inalt: 0x8a6a4a, inaltVariatie: 0x926f4e,
    drum: 0x9a7a56, drumVariatie: 0xa2825c,
    apa: 0x4b93d6, apaVariatie: 0x5aa0e0, apaBlocata: true, texturaApa: 'apa',
    piatra: 0x6b4f38, stanca: 0x6b4f38,
    zid: 0x14100c, texturaZid: 'piatra',
    acoperis: 0x7a3a24, perete: 0xa89070, usa: 0x3a2513
  }),

  // Cartierele. Nu se deseneaza - orasul e desenat deja. Sunt doar
  // punctele de care se agata oamenii, si numele de pe harta.
  locuri: [
    { fel: 'cartier', id: 'piata',   nume: 'The Great Ring',  c: 0.50, r: 0.46 },
    { fel: 'cartier', id: 'arme',    nume: 'Warband Grounds',   c: 0.50, r: 0.20 },
    { fel: 'cartier', id: 'forja',   nume: 'The Ash Forges',      c: 0.24, r: 0.30 },
    { fel: 'cartier', id: 'tesut',   nume: 'Hide and Thread',   c: 0.76, r: 0.30 },
    { fel: 'cartier', id: 'ierburi', nume: 'Root Market',      c: 0.24, r: 0.68 },
    { fel: 'cartier', id: 'apa',     nume: 'The Well Yard',  c: 0.76, r: 0.68 }
  ],

  npci: [
    // ---- antrenorii de clasa, in Hall of Arms ----
    { fel: 'antrenorRazboinic', la: 'arme', dc: -14, dr: 4 },
    { fel: 'antrenorVanator',   la: 'arme', dc:  -5, dr: 8 },
    { fel: 'antrenorMag',       la: 'arme', dc:   5, dr: 8 },
    { fel: 'antrenorPreot',     la: 'arme', dc:  14, dr: 4 },

    // ---- fierarie, minerit, inginerie ----
    { fel: 'antrenorFierarie',  la: 'forja', dc: -8, dr: -4 },
    { fel: 'antrenorMinerit',   la: 'forja', dc:  8, dr: -4 },
    { fel: 'antrenorInginerie', la: 'forja', dc:  0, dr:  9 },

    // ---- tesut si piele ----
    { fel: 'antrenorCroitorie', la: 'tesut', dc: -8, dr: -4 },
    { fel: 'antrenorPielarie',  la: 'tesut', dc:  8, dr: -4 },
    { fel: 'antrenorJupuit',    la: 'tesut', dc:  0, dr:  9 },

    // ---- ierburi, fierturi, semne ----
    { fel: 'antrenorIerburi',   la: 'ierburi', dc: -8, dr: -4 },
    { fel: 'antrenorAlchimie',  la: 'ierburi', dc:  8, dr: -4 },
    { fel: 'antrenorVrajire',   la: 'ierburi', dc:  0, dr:  9 },

    // ---- meseriile de pe langa casa ----
    { fel: 'antrenorGatit',     la: 'apa', dc: -8, dr: -4 },
    { fel: 'antrenorPrimAjutor',la: 'apa', dc:  8, dr: -4 },
    { fel: 'antrenorPescuit',   la: 'apa', dc:  0, dr:  9 },

    // ---- negustorii din piata ----
    { fel: 'negustorUnelte',    la: 'piata', dc: -20, dr: -6 },
    { fel: 'negustorMateriale', la: 'piata', dc:  20, dr: -6 },
    { fel: 'negustorOrc',       la: 'piata', dc: -20, dr: 10 },
    { fel: 'armurierOrc',       la: 'piata', dc:  20, dr: 10 }
  ],

  // Poarta de la miazazi duce inapoi in stepa.
  iesire: { catre: 'dustplain' },

  start: { la: 'piata', dc: 0, dr: 26 }
});
