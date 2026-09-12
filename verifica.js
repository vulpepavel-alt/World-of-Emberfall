// ==========================================================
//  VERIFICAREA DATELOR
//
//  Jocul e facut aproape numai din tabele: abilitati, retete,
//  noduri, misiuni, zone, seturi. Cand o legatura dintre ele se
//  rupe, nu crapa nimic - pur si simplu ceva nu mai apare, si nu
//  se vede nicio eroare nicaieri.
//
//  Asa am pierdut vremea de trei ori:
//    - o cheie de text scrisa de doua ori, si a doua o inghitea
//      pe prima
//    - o functie de sunet cu acelasi nume ca una din joc
//    - un nod de planta scris sub o cheie deja folosita, deci
//      materialul ramanea fara sursa
//
//  Fisierul asta cauta singur genul ala de rupturi si le scrie in
//  consola. NU ruleaza in joc: ca sa-l pornesti, deschizi jocul cu
//  ?verifica=1 la capatul adresei.
//
//    http://localhost:8765/index.html?verifica=1
//
//  Daca totul e in regula, scrie o singura linie verde.
// ==========================================================

function verificaTot() {

  const probleme = [];
  function rau(unde, ce) { probleme.push(unde + ': ' + ce); }

  // ---- ajutor: cauta id-uri scrise de doua ori ----
  function dubluri(unde, lista, iaId) {
    const vazute = {};
    lista.forEach(function (x) {
      const id = iaId(x);
      if (vazute[id]) rau(unde, 'id scris de doua ori: ' + id);
      vazute[id] = true;
    });
  }

  const id = function (x) { return x.id; };

  // ==========================================================
  //  1. ID-URI SCRISE DE DOUA ORI
  // ==========================================================
  dubluri('abilitati', ABILITATI, id);
  dubluri('retete', RETETE, id);
  dubluri('misiuni', MISIUNI, id);
  dubluri('seturi', SETURI, id);
  dubluri('zone', ZONE, id);
  dubluri('sloturi', SLOTURI, id);

  // Nodurile si mobii sunt obiecte, nu liste: acolo dublura s-ar fi
  // pierdut deja. Verificam ca fiecare cheie se potriveste cu ce
  // scrie inauntru - asa se prinde totusi o suprascriere.
  Object.keys(NODURI).forEach(function (k) {
    if (NODURI[k].cheie !== k) {
      rau('noduri', 'cheia "' + k + '" tine un nod care se crede "' +
          NODURI[k].cheie + '" - probabil unul l-a acoperit pe celalalt');
    }
  });

  // ==========================================================
  //  2. MATERIALELE: fiecare cerut trebuie sa aiba de unde veni
  // ==========================================================
  const seObtin = {};
  Object.values(NODURI).forEach(function (n) { seObtin[n.material] = 'nod pe harta'; });
  PIEI.forEach(function (p) { seObtin[p.nume] = 'jupuit'; });
  PANZE.forEach(function (p) { seObtin[p.nume] = 'de la umanoizi'; });
  PESTII.forEach(function (p) { seObtin[p.nume] = 'pescuit'; });
  RETETE.forEach(function (r) {
    if (r.face.fel === 'material') seObtin[r.face.nume] = 'reteta ' + r.id;
  });

  const seCer = {};
  RETETE.forEach(function (r) {
    r.cere.forEach(function (c) {
      seCer[c.nume] = true;
      if (!seObtin[c.nume]) {
        rau('retete', 'reteta "' + r.id + '" cere "' + c.nume +
            '", dar asta nu se poate obtine de nicaieri');
      }
    });
  });

  // Si invers: ceva ce se poate strange dar nu foloseste la nimic e
  // greutate moarta in rucsac.
  //
  // ATENTIE - aici am scris eu insumi conditia pe dos prima data:
  // "daca nu-l cere nimeni, treci mai departe". Adica taman cazul
  // pe care trebuia sa-l raportez era singurul sarit, si verificarea
  // iesea curata degeaba.
  Object.keys(seObtin).forEach(function (nume) {
    if (seCer[nume]) return;
    rau('materiale', '"' + nume + '" se poate obtine (' + seObtin[nume] +
        ') dar nu-l cere nicio reteta');
  });

  // ==========================================================
  //  3. RETETELE: ce iese din ele trebuie sa aiba sens
  // ==========================================================
  RETETE.forEach(function (r) {
    if (!MESERII[r.meserie]) rau('retete', r.id + ': meserie necunoscuta "' + r.meserie + '"');
    if (r.face.fel === 'echipament' && !gasesteSlot(r.face.slot)) {
      rau('retete', r.id + ': slot necunoscut "' + r.face.slot + '"');
    }
    if (r.statie && ['Anvil', 'Cookfire', 'Rune Table'].indexOf(r.statie) < 0) {
      rau('retete', r.id + ': statie necunoscuta "' + r.statie + '"');
    }
  });

  // ==========================================================
  //  4. ABILITATILE
  // ==========================================================
  ABILITATI.forEach(function (ab) {
    if (!CLASE[ab.clasa]) rau('abilitati', ab.id + ': clasa necunoscuta "' + ab.clasa + '"');
    if (ab.rasa && !RASE[ab.rasa]) rau('abilitati', ab.id + ': rasa necunoscuta "' + ab.rasa + '"');
    if (!ab.ranguri || ab.ranguri < 1) rau('abilitati', ab.id + ': fara ranguri');
  });

  // Abilitatile marcate ca venind din misiune chiar trebuie sa fie
  // date de o misiune, altfel nu le mai poti invata NICIODATA.
  const dateDeMisiuni = {};
  MISIUNI.forEach(function (m) {
    ((m.rasplata && m.rasplata.abilitati) || []).forEach(function (idAb) {
      dateDeMisiuni[idAb] = m.id;
      if (!gasesteAbilitatea(idAb)) {
        rau('misiuni', m.id + ': da abilitatea "' + idAb + '", care nu exista');
      }
    });
  });
  ABILITATI.forEach(function (ab) {
    if (ab.prinQuest && !dateDeMisiuni[ab.id]) {
      rau('abilitati', ab.id + ' e marcata "prin misiune", dar n-o da nicio misiune');
    }
  });

  // Id-urile vechi trebuie sa duca undeva
  Object.keys(ID_VECHI_NOI).forEach(function (vechi) {
    if (!gasesteAbilitatea(ID_VECHI_NOI[vechi])) {
      rau('mutarea id-urilor', vechi + ' duce la "' + ID_VECHI_NOI[vechi] + '", care nu exista');
    }
  });

  // ==========================================================
  //  5. MISIUNILE
  // ==========================================================
  MISIUNI.forEach(function (m) {
    if (m.cere && !gasesteMisiunea(m.cere)) {
      rau('misiuni', m.id + ': cere misiunea "' + m.cere + '", care nu exista');
    }
    if (m.clasa && !CLASE[m.clasa]) {
      rau('misiuni', m.id + ': clasa necunoscuta "' + m.clasa + '"');
    }
    const c = m.cerinta || {};
    if ((c.fel === 'ucide' || c.fel === 'aduna') && !MOBI[c.mob]) {
      rau('misiuni', m.id + ': cere inamicul "' + c.mob + '", care nu exista');
    }
  });

  // ==========================================================
  //  6. SETURILE
  // ==========================================================
  SETURI.forEach(function (s) {
    if (!FELURI_ARMURA[s.felArmura]) {
      rau('seturi', s.id + ': clasa de armura necunoscuta "' + s.felArmura + '"');
    }
    SLOTURI_DE_SET.forEach(function (sl) {
      if (!s.piese[sl]) rau('seturi', s.id + ': ii lipseste piesa de "' + sl + '"');
    });
    s.deLa.forEach(function (fel) {
      if (!MOBI[fel]) rau('seturi', s.id + ': pica de la "' + fel + '", care nu exista');
    });
  });

  // ==========================================================
  //  7. INAMICII
  // ==========================================================
  Object.keys(MOBI).forEach(function (k) {
    const m = MOBI[k];
    if (!m.nume) rau('inamici', k + ': fara nume');
    const p = m.prada;
    if (p) {
      (p.arme || []).forEach(function (a) {
        if (!FELURI_ARMA.find(function (f) { return f.id === a; })) {
          rau('inamici', k + ': arma necunoscuta "' + a + '"');
        }
      });
      (p.armuri || []).forEach(function (a) {
        if (!FELURI_ARMURA[a]) rau('inamici', k + ': armura necunoscuta "' + a + '"');
      });
      (p.sloturi || []).forEach(function (sl) {
        if (!gasesteSlot(sl)) rau('inamici', k + ': slot necunoscut "' + sl + '"');
      });
    }
  });

  // ==========================================================
  //  8. ZONELE: fiecare drum trebuie sa duca undeva
  // ==========================================================
  ZONE.forEach(function (z) {
    if (z.port && !retetaZonei(z.port.catre)) {
      rau('zone', z.id + ': portul duce spre "' + z.port.catre + '", care nu exista');
    }
    (z.intrari || []).forEach(function (i) {
      if (!retetaZonei(i.catre)) {
        rau('zone', z.id + ': intrarea duce spre "' + i.catre + '", care nu exista');
      }
    });
    if (z.iesire && !retetaZonei(z.iesire.catre)) {
      rau('zone', z.id + ': iesirea duce spre "' + z.iesire.catre + '", care nu exista');
    }
    (z.npci || []).forEach(function (n) {
      if (!NPC[n.fel]) rau('zone', z.id + ': personajul "' + n.fel + '" nu exista');
    });
  });

  // ==========================================================
  //  9. DESENELE: fiecare obiect trebuie sa aiba unul
  // ==========================================================
  SLOTURI.forEach(function (sl) {
    for (let i = 0; i < 40; i++) {
      const o = faObiect(sl.id, 1 + i, raritateLaIntamplare());
      const forme = formeIcoana(o);
      if (!forme || !forme.length) {
        rau('desene', 'slotul "' + sl.id + '" da un obiect fara desen');
        break;
      }
    }
  });

  // ==========================================================
  //  Raportul
  // ==========================================================
  if (probleme.length === 0) {
    console.log('%c Verificarea a trecut: toate tabelele se leaga intre ele. ',
                'background:#2f5d33;color:#dff0d8;font-size:13px');
  } else {
    console.log('%c ' + probleme.length + ' probleme gasite in date ',
                'background:#6b2320;color:#f5d0cd;font-size:13px');
    probleme.forEach(function (p) { console.log('  - ' + p); });
  }
  return probleme;
}


// Ruleaza numai daca ai cerut-o din adresa.
if (typeof location !== 'undefined' && location.search.indexOf('verifica=1') >= 0) {
  window.addEventListener('load', function () { verificaTot(); });
}
