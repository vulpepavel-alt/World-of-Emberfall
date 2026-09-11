// ==========================================================
//  CLIMATELE
//
//  Fiecare zona foloseste ACELEASI litere - '.' e pamantul,
//  'T' e ce e des si nu se trece, 'P' e drumul - dar culorile
//  si texturile difera. O padure de primavara si o mlastina au
//  aceeasi harta pe dedesubt; se schimba doar cum arata.
//
//  Asa un fisier de zona are cincizeci de randuri, nu trei sute.
// ==========================================================

// Literele, aceleasi peste tot. Generatorul le cunoaste pe nume.
const LITERE = {
  fond: '.', petec: 'f', inalt: 'h', apa: 'W', malApa: 'm',
  pod: 'B', drum: 'P', des: 'T', marunt: 's', stanca: 'r',
  zid: 'X', acoperis: 'R', perete: 'H', usa: 'D', piatra: 'S',
  palisada: 'w', cort: 'A', foc: 'F', gaura: 'c'
};


// Face tabelul de teren dintr-o mana de culori.
// apaBlocata = false inseamna albie secata: se poate merge pe ea.
function faClimat(op) {

  const t = {};
  function adauga(litera, culoare, blocat, textura, variatie) {
    t[litera] = { culoare: culoare, blocat: blocat, textura: textura };
    if (variatie !== undefined) t[litera].variatie = variatie;
  }

  adauga('.', op.fond,   false, op.texturaFond, op.fondVariatie);
  adauga('f', op.petec,  false, op.texturaPetec || 'flori', op.petecVariatie);
  adauga('h', op.inalt,  false, op.texturaFond, op.inaltVariatie);
  adauga('P', op.drum,   false, 'pamant', op.drumVariatie);
  adauga('W', op.apa,    op.apaBlocata !== false, op.texturaApa || 'apa', op.apaVariatie);
  adauga('m', op.mal,    false, 'nisip');
  adauga('B', op.pod,    false, 'piatra');
  adauga('T', op.des,    true,  op.texturaDes || 'frunzis');
  adauga('s', op.marunt, true,  op.texturaDes || 'frunzis');
  adauga('r', op.stanca, true,  'piatra');
  adauga('X', op.zid,    true,  op.texturaZid || 'frunzis');
  adauga('R', op.acoperis, true, 'tigla');
  adauga('H', op.perete, true,  'zid');
  adauga('D', op.usa,    false, 'lemn');
  adauga('S', op.piatra, true,  'piatra');
  adauga('w', op.palisada, true, 'lemn');
  adauga('A', op.cort,   true,  'lemn');
  adauga('F', op.foc,    true,  'foc');
  adauga('c', op.gaura,  true,  'neted');

  return t;
}


// ----------------------------------------------------------
//  Sapte climate gata facute. O zona ia unul si schimba ce vrea.
// ----------------------------------------------------------
const CLIMATE = {

  padure: {          // verde bogat, de primavara
    fond: 0x4f9440, fondVariatie: 0x589e48, texturaFond: 'iarba',
    petec: 0x8fc46a, petecVariatie: 0xc9d46b,
    inalt: 0x86c163, inaltVariatie: 0x90ca6d,
    drum: 0xb59567, drumVariatie: 0xab8b5f,
    apa: 0x4b93d6, apaVariatie: 0x5aa0e0, mal: 0xa89570, pod: 0x9a9384,
    des: 0x1f4d22, marunt: 0x376b32, stanca: 0x9c9689, zid: 0x163a19,
    acoperis: 0xb0402f, perete: 0xd6c8a8, usa: 0x6b4a2c, piatra: 0xb0aa9c,
    palisada: 0x6b4a2c, cort: 0x8d7b5a, foc: 0xd87a2a, gaura: 0x161f16
  },

  pustiu: {          // canion rosu, uscat
    fond: 0x6b3a1e, fondVariatie: 0x633519, texturaFond: 'crapat',
    petec: 0x8a6a42, petecVariatie: 0x80613b, texturaPetec: 'nisip',
    inalt: 0x7a4526, inaltVariatie: 0x714022,
    drum: 0x543018, drumVariatie: 0x4d2c15,
    apa: 0xa89570, apaVariatie: 0x9d8a65, apaBlocata: false, texturaApa: 'nisip',
    mal: 0x503a2b, pod: 0x8a7550,
    des: 0x2f5230, marunt: 0x554626, stanca: 0x503a2b,
    zid: 0x2c1409, texturaZid: 'piatra',
    acoperis: 0x3a1f0f, perete: 0x8a7a5e, usa: 0x1c1208, piatra: 0x6b5a44,
    palisada: 0x3a2513, cort: 0x7d6c50, foc: 0xe8862f, gaura: 0x120a06
  },

  campie: {          // ierburi uscate, dealuri intinse
    fond: 0x9c9245, fondVariatie: 0x948b41, texturaFond: 'iarba',
    petec: 0xc4b862, petecVariatie: 0xd8cc70,
    inalt: 0xa89a4e, inaltVariatie: 0xb0a254,
    drum: 0x8a7440, drumVariatie: 0x816c3b,
    apa: 0x4f86b0, apaVariatie: 0x5c93bd, mal: 0xbdae74, pod: 0x8f8879,
    des: 0x4a5a28, marunt: 0x5e6b32, stanca: 0x8a8478, zid: 0x3a4a20,
    acoperis: 0x8a5a2f, perete: 0xcabb90, usa: 0x5b3f22, piatra: 0xa39a86,
    palisada: 0x6b5230, cort: 0x9c8a64, foc: 0xe0872f, gaura: 0x1f1a12
  },

  mlastina: {        // verde-cenusiu, apa peste tot
    fond: 0x4a5a3a, fondVariatie: 0x445436, texturaFond: 'iarba',
    petec: 0x62724a, petecVariatie: 0x74845a,
    inalt: 0x556546, inaltVariatie: 0x5c6c4c,
    drum: 0x5a5140, drumVariatie: 0x534a3a,
    apa: 0x3a5246, apaVariatie: 0x44604f, mal: 0x6a6a52, pod: 0x6b6558,
    des: 0x1e2e1e, marunt: 0x2e4028, stanca: 0x6a6a62, zid: 0x18281a,
    acoperis: 0x4a3a2a, perete: 0x8a8270, usa: 0x352a1c, piatra: 0x7a7468,
    palisada: 0x3f3426, cort: 0x6e6350, foc: 0xc9762a, gaura: 0x101810
  },

  munte: {           // piatra si zapada
    fond: 0x8a9098, fondVariatie: 0x828890, texturaFond: 'piatra',
    petec: 0xd4dce4, petecVariatie: 0xe4ecf4, texturaPetec: 'nisip',
    inalt: 0x9aa2aa, inaltVariatie: 0xa2aab2,
    drum: 0x6e6a62, drumVariatie: 0x656158,
    apa: 0x6f9ec4, apaVariatie: 0x7cabd0, mal: 0xb4bcc4, pod: 0x7a7a82,
    des: 0x2a3a34, marunt: 0x46504a, stanca: 0x6a7078,
    zid: 0x4a5058, texturaZid: 'piatra',
    acoperis: 0x5a4a3a, perete: 0xc2c8d0, usa: 0x3a2e20, piatra: 0x8a9098,
    palisada: 0x4a3c2a, cort: 0x7a7264, foc: 0xe8a24a, gaura: 0x141a1e
  },

  cenusa: {          // pamant ars, foc pe dedesubt
    fond: 0x3e3630, fondVariatie: 0x38312b, texturaFond: 'crapat',
    petec: 0x7a4028, petecVariatie: 0x8a4a2e, texturaPetec: 'foc',
    inalt: 0x4a4038, inaltVariatie: 0x52473e,
    drum: 0x2e2824, drumVariatie: 0x282320,
    apa: 0xc45a24, apaVariatie: 0xd4682c, apaBlocata: true, texturaApa: 'foc',
    mal: 0x5a4a3a, pod: 0x5a5450,
    des: 0x241e1a, marunt: 0x342c26, stanca: 0x544a42,
    zid: 0x1e1a18, texturaZid: 'piatra',
    acoperis: 0x5a2a1a, perete: 0x6e6258, usa: 0x1a1512, piatra: 0x605850,
    palisada: 0x322824, cort: 0x584c42, foc: 0xff9a2a, gaura: 0x0c0a08
  },

  coasta: {          // stanci, nisip, mare
    fond: 0x6f8a52, fondVariatie: 0x68824c, texturaFond: 'iarba',
    petec: 0xd8c894, petecVariatie: 0xe4d4a4, texturaPetec: 'nisip',
    inalt: 0x7a9458, inaltVariatie: 0x829c60,
    drum: 0xa89470, drumVariatie: 0x9e8a67,
    apa: 0x2f6f9c, apaVariatie: 0x3a7cab, mal: 0xd8c894, pod: 0x8f8879,
    des: 0x2a4a2c, marunt: 0x3e6238, stanca: 0x8a8a84, zid: 0x24402a,
    acoperis: 0x8a4a3a, perete: 0xd0c4a8, usa: 0x5a422c, piatra: 0xa8a49a,
    palisada: 0x6a5238, cort: 0x8a7c60, foc: 0xd87a2a, gaura: 0x141c14
  }
};


// Copiaza un climat si schimba din el ce vrei.
function climat(nume, schimbari) {
  const baza = Object.assign({}, CLIMATE[nume]);
  return faClimat(Object.assign(baza, schimbari || {}));
}
