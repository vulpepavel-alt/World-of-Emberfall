# Predare scurta pentru Claude Code

Proiect: `/Users/sandrabalu/Projects/joc-rpg`

Joc RPG 2D offline, single-player, inspirat ca structura de WoW Classic, dar cu
lume si nume originale. Foloseste JavaScript clasic + Phaser 3.90 din CDN, fara
npm si fara module. Toate scripturile impart acelasi spatiu global. Textul
afisat sta in `texte.js`; codul si comentariile noi sunt in romana fara
diacritice. Documentatia lunga existenta este `PREDARE.md`.

## Ce am facut in acest chat

- Am analizat jocul prin comparatie cu WoW Classic si am decis sa aprofundam
  continutul offline existent, fara multiplayer sau dependente online.
- Am transformat Moor Hollow Deep intr-o temnita reala de nivel 18-22:
  inamici la distanta, vindecatori, atacuri avertizate pe sol si mecanica
  speciala pentru Corvin Ashe. Motorul este in `comportamente-temnita.js`.
- Am facut temporar un personaj de test nivel 20, apoi l-am retras la cererea
  utilizatoarei. `personaj-test.js` nu mai creeaza personajul. Poate doar
  retrage/restaura copia de proba prin `?sterge-test=moorhollow20` si
  `?restaureaza-test=moorhollow20`.
- Am micsorat si reasezat textele hartilor in `harta.js`. Pe toate cele 52 de
  harti au fost verificate 425 de etichete: zero suprapuneri si zero iesiri in
  afara hartii.
- Am adaugat sageata galbena de quest in `ghid-misiuni.js`. Indica tinta locala,
  obiectele cazute, NPC-ul de predare sau iesirea potrivita spre alta zona.
  Din Quests se poate alege `Track quest`; alegerea se salveaza.
- Am completat toate instantele existente in `intalniri-instante.js`:
  8 temnite x 4 sefi si raidul The Long Account cu 8 sefi, 40 in total.
  Sefii au rotatii de 2-4 mecanici: cercuri, con frontal, inel cu centru sigur,
  zone persistente, atac la distanta, vindecare si ajutoare chemate. Au faza
  finala, panou de progres, viata si prada reglate. Inamicii obisnuiti vin in
  grupuri. Tovarasii si animalul evita pericolele. Inamicii invinsi nu reapar
  pana la iesirea din instanta; ajutoarele nu dau XP/prada/credit de quest.
- Am adaugat tinta persistenta si comenzile de lupta in `control-lupta.js`:
  atingere sau Target/Tab pentru selectie; Follow/F, Attack/G, Retreat/R pentru
  echipa; Stop cast/Q pentru intrerupere. Fiecare clasa are o intrerupere
  gratuita cu cooldown 12 secunde in `abilitati.js`. Warrior o foloseste de
  aproape, celelalte clase de la distanta. Atacurile prin zid sunt blocate.
- Serverul de test asculta doar pe `127.0.0.1:8765` si dezactiveaza cache-ul.

## Fisiere noi

- `comportamente-temnita.js` - mecanicile efective ale instantelor.
- `intalniri-instante.js` - configuratia tuturor celor 40 de sefi.
- `ghid-misiuni.js` - sageata si traseul logic al questului urmarit.
- `control-lupta.js` - tinta, intreruperea si comenzile echipei.
- `verifica-instante.js` - probe Node pentru cele 9 instante.
- `verifica-control-lupta.js` - probe Node pentru noile controale.
- `personaj-test.js` - numai retragerea/restaurarea probei vechi.

## Verificare

Pornire:

```bash
cd /Users/sandrabalu/Projects/joc-rpg
python3 server-test.py
```

Apoi: `http://localhost:8765/` sau `?verifica=1` pentru verificarea generala.

Comenzi care trebuie sa ramana verzi:

```bash
node verifica-instante.js
node verifica-control-lupta.js
node verifica-dubluri.js
git diff --check
```

Ultima rulare a trecut: 9 instante, 40 de sefi, drumuri fizice accesibile,
geometria mecanicilor, curatarea intalnirilor, recompense unice, selectia,
intreruperile celor 4 clase si comenzile echipei. Jocul final a pornit in
browser cu verificarea generala verde si fara warnings/errors.

## Stare si pasul urmator

Toate schimbarile din acest chat sunt in working tree si nu au fost comise.
Nu sterge sau rescrie modificarile existente. Urmatorul pas potrivit este
testarea practica si reglarea dificultatii pentru fiecare clasa, incepand cu
Moor Hollow la nivelul 20, apoi temnitele urmatoare si raidul. Verifica si
aranjarea butoanelor pe iPhone; aceasta parte nu a fost testata fizic.

