// ==========================================================
//  ZONA: The Quiet Coast        (karador, nivel 60)
//
//  ULTIMA ZONA DIN JOC.
//
//  De ce aici: povestea scrisa in zonele mari se tot uita intr-un
//  singur loc, fara sa ajunga vreodata acolo. In Greenvale, cineva
//  cu bani voia valea goala. In Sundercrag, un om vindea o lista de
//  nume, iar raiderii "o duceau la coasta, opt pagini deodata".
//  Nimeni n-a mers niciodata pana la capatul drumului ala.
//
//  Coasta e capatul. Se ajunge doar prin Sundercrag, care in
//  misiunile lui e "capatul lumii, si dincolo marea pe partea
//  gresita" - deci zona asta sta chiar dincolo de el pe grila.
//
//  Nu e un taram fermecat si nu are dragoni. E un port de lucru:
//  depozite, un chei, corturi de asteptare si o casa de socoteli.
//  Asta si trebuie sa fie, dupa toata povestea de pana aici.
// ==========================================================

inregistreazaZona({

  id: 'quietcoast',
  nume: 'The Quiet Coast',
  continent: 'karador',
  factiune: null,

  // Singura zona din joc care incepe si se termina la 60.
  nivelDeLa: 60,
  nivelPanaLa: 60,

  COL: 700,
  RND: 520,
  samanta: 60601,

  // A sasea coloana, dincolo de Sundercrag. Restul grilei are cinci.
  peHarta: { c: 5, r: 3 },

  litere: LITERE,
  climat: 'coasta',

  // Pornim de la coasta obisnuita, dar o impingem spre pietris si
  // nisip batut de vant. Zonele de dinainte au fost verzi, rosii sau
  // arse; asta trebuie sa arate altfel decat toate, fiindca e
  // ultima si pentru ca aici nu creste nimic - e un loc de munca.
  teren: climat('coasta', {
    fond: 0x9c9482, fondVariatie: 0x948c7a, texturaFond: 'nisip',
    petec: 0x8a8478, petecVariatie: 0x7e786c, texturaPetec: 'piatra',
    inalt: 0x8a8272, inaltVariatie: 0x7e7668,
    drum: 0xb0a894, drumVariatie: 0xa49c88,
    apa: 0x2a5f80, apaVariatie: 0x32708f, mal: 0xb8ae96,
    des: 0x4a5246, marunt: 0x646a5a, stanca: 0x7a7a74
  }),

  // Multa apa: e coasta. Raul lat taie zona pe mijloc ca un golf.
  apaLa: 0.40, apaUnduire: 60, apaLatime: 14,

  locuri: [
    { fel: 'post',    id: 'poarta',  nume: 'The Landward Gate', c: 0.10, r: 0.50 },
    { fel: 'corturi', id: 'asteptare', nume: 'The Waiting Camp', c: 0.30, r: 0.28 },
    { fel: 'tabara',  id: 'depozite', nume: 'The Long Sheds',   c: 0.44, r: 0.66 },
    { fel: 'post',    id: 'chei',    nume: 'The Deepwater Quay', c: 0.68, r: 0.40 },
    { fel: 'cetate',  id: 'socoteli', nume: 'The Counting House', c: 0.86, r: 0.62 }
  ],

  npci: [
    { fel: 'marshal',   la: 'poarta', dc: 3, dr: 2 },
    { fel: 'negustor',  la: 'poarta', dc: -9, dr: 0 },
    { fel: 'armurier',  la: 'poarta', dc: 12, dr: -2 }
  ],

  // Mai putine tabere decat in zonele obisnuite: aici nu e salbaticie,
  // e un loc pazit. Cine e aici, e aici cu un rost.
  tabere: 60,

  feluriPeNivel: function () {
    return ['raider', 'bandit', 'garda'];
  },

  // Capatul povestii. Sta in casa de socoteli, la masa lui.
  sef: { fel: 'factor', la: 'socoteli', nivel: 60, nume: 'The Factor' },

  start: { la: 'poarta', dc: 5, dr: 0 }
});
