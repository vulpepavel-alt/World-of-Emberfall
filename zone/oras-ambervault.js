// ==========================================================
//  ORASUL: Ambervault        (eastmarch, harta lui proprie)
//
//  Orasul principal al oamenilor. NU e un loc pe harta unei zone -
//  e o harta a lui, in care intri pe poarta din Thornmoor, la fel
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
//  "iesire" e poarta de la miazazi: pe ea te intorci in Thornmoor.
//  Perechea ei, intrarea, e scrisa in reteta Thornmoor-ului.
// ==========================================================

inregistreazaZona({

  id: 'ambervault',
  nume: 'Ambervault',
  continent: 'eastmarch',
  // Orasul e AL unei tabere. Cine vine din cealalta da de garzi.
  factiune: 'Concord',
  esteOras: true,

  // Nu se lupta nimeni aici. Nivelurile sunt scrise doar ca harta
  // sa stie ce culoare sa-i dea si de la ce nivel are rost sa vii.
  nivelDeLa: 10,
  nivelPanaLa: 20,

  // Un oras e mai mic decat o zona, dar tot iti ia un minut bun
  // sa-l strabati dintr-un capat in altul.
  COL: 260,
  RND: 180,
  samanta: 71104,

  peHarta: null,          // orasele nu stau pe grila continentului

  litere: LITERE,

  // Pavaj, zid de piatra si acoperisuri rosii. Pornim de la muntele
  // de piatra si schimbam ce trebuie.
  climat: 'munte',
  teren: climat('munte', {
    fond: 0x8d8578, fondVariatie: 0x968e80, texturaFond: 'piatra',
    petec: 0x6f8a52, petecVariatie: 0x7a9458, texturaPetec: 'iarba',
    inalt: 0x8d8578, inaltVariatie: 0x968e80,
    drum: 0x9c948a, drumVariatie: 0xa49c92,
    apa: 0x4b93d6, apaVariatie: 0x5aa0e0,
    piatra: 0x6e6862, stanca: 0x6e6862,
    zid: 0x141210, texturaZid: 'piatra',
    acoperis: 0xb0402f, perete: 0xd6c8a8, usa: 0x6b4a2c
  }),

  // Cartierele. Nu se deseneaza - orasul e desenat deja. Sunt doar
  // punctele de care se agata oamenii, si numele de pe harta.
  locuri: [
    { fel: 'cartier', id: 'piata',   nume: 'Market Square',  c: 0.50, r: 0.46 },
    { fel: 'cartier', id: 'arme',    nume: 'Hall of Arms',   c: 0.50, r: 0.20 },
    { fel: 'cartier', id: 'forja',   nume: 'Forge Row',      c: 0.24, r: 0.30 },
    { fel: 'cartier', id: 'tesut',   nume: 'Weavers Lane',   c: 0.76, r: 0.30 },
    { fel: 'cartier', id: 'ierburi', nume: 'Herb Lane',      c: 0.24, r: 0.68 },
    { fel: 'cartier', id: 'apa',     nume: 'The Waterside',  c: 0.76, r: 0.68 }
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
    { fel: 'negustor',          la: 'piata', dc: -20, dr: 10 },
    { fel: 'armurier',          la: 'piata', dc:  20, dr: 10 }
  ],

  // Poarta de la miazazi duce inapoi in campie.
  iesire: { catre: 'thornmoor' },

  start: { la: 'piata', dc: 0, dr: 26 }
});
