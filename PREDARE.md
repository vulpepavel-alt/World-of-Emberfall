# World of Emberfall — tot ce trebuie să știi ca să preiei proiectul

Documentul ăsta e scris ca să poată cineva (sau alt asistent) să continue jocul
fără să fi fost de față când s-a construit. Conține unde stau lucrurile, cum se
pornește, ce reguli s-au stabilit și de ce, ce e gata și ce nu.

---

## 1. Ce este

Un joc RPG 2D pentru telefon, în stilul World of Warcraft Classic, jucat de o
singură persoană. Scris în JavaScript cu Phaser 3.90. Nu e un proiect npm: nu
are build, nu are `package.json`, nu are dependențe instalate. Se deschide
`index.html` și merge.

**Unde stă:** `/Users/sandrabalu/Projects/joc-rpg`
**Git:** da, repo local pe branch-ul `main`. 71 de commituri.
**Autoare:** Sandra Balu. Commiturile sunt scrise în română.

Mărimea: ~32.000 de rânduri, 32 de fișiere `.js` în rădăcină + 55 în `zone/`.

---

## 2. Cum îl pornești — CITEȘTE ASTA ÎNTÂI

```bash
cd /Users/sandrabalu/Projects/joc-rpg
python3 server-test.py
```

apoi deschizi `http://localhost:8765/index.html`.

**NU folosi `python3 -m http.server`.** Serverul obișnuit lasă browserul să
țină fișierele în memorie. S-a pierdut o jumătate de oră căutând o greșeală
care nu exista, fiindcă browserul servea versiunea veche a fișierelor.
`server-test.py` trimite `Cache-Control: no-store` la fiecare cerere și
rezolvă asta.

Se poate deschide și direct fișierul (`file://`), dar atunci unele lucruri nu
merg la fel; serverul e drumul sigur.

---

## 3. Cum e construit — partea care surprinde cel mai des

Toate fișierele se încarcă cu `<script src="...">` în `index.html` (87 de
scripturi, în ordine). **NU sunt module.** Asta înseamnă:

- Toate funcțiile și constantele globale stau în **același spațiu de nume**.
- Dacă două fișiere definesc o funcție cu același nume, **cea din fișierul
  încărcat mai târziu o șterge pe cealaltă, în tăcere**. Nicio eroare.
  Restul codului cheamă mai departe numele și primește funcția greșită.

Asta a pățit-o proiectul de două ori:

1. `zgomot()` din `sunete.js` peste `zgomot()` din `game.js` — toate sunetele
   de lovitură și-au pierdut bufnitura, fără nicio eroare.
2. `zgomotNeted()` din `game.js` peste cea din `zone/generator.js` (una lua
   doi parametri, cealaltă patru) — **drumurile din toată lumea s-au rupt în
   bucăți** și terenul s-a așezat altfel. Iarăși fără nicio eroare.

De aceea `verifica-dubluri.js` caută acum automat funcții globale scrise de
două ori. **Rulează-l după orice funcție nouă.**

Ordinea de încărcare contează: `texte.js` primul, apoi datele, apoi
`zone/`, apoi `game.js` ultimul. Dacă adaugi un fișier, pune-l unde trebuie și
scrie în `index.html` de ce acolo.

---

## 4. Harta fișierelor

### Motorul și jocul propriu-zis
| Fișier | Rânduri | Ce face |
|---|---|---|
| `game.js` | 6065 | Inima jocului: bucla de update, mișcarea, lupta, desenul terenului pe bucăți, moartea, călăritul, abilitățile în execuție. Cel mai mare fișier, se umblă în el cel mai des. |
| `index.html` | 407 | Încarcă toate scripturile, în ordine. Conține și HTML-ul ferestrelor. |
| `meniu.css` | 1203 | Tot stilul: meniuri, ferestre, hartă. |

### Datele (tabele, aproape fără logică)
| Fișier | Ce ține |
|---|---|
| `texte.js` | **TOT textul care se vede în joc.** Vezi regula de limbă, secțiunea 6. |
| `personaj.js` | Rasele (4), clasele (4), formulele de statistici, `calculeazaPersonaj`. |
| `abilitati.js` | 69 de abilități, cu ranguri, niveluri, prețuri de învățare. |
| `talente.js` | 84 de talente, 3 arbori pe clasă, regulile de învățare. |
| `mobi.js` | 12 feluri de inamici (desen + statistici) și cele 4 ranguri. |
| `npc.js` | 36 de feluri de oameni prietenoși, cu desenul lor. |
| `obiecte.js` | Cum se nasc obiectele: trepte de material, raritate, sloturi, durabilitate, echipamentul de start. |
| `seturi.js` | 6 seturi de echipament, cu bonusuri la 2/4/6 piese. |
| `icoane.js` | Desenul fiecărui obiect, 16×16, din dreptunghiuri. |
| `infatisare.js` | Cum se desenează personajul (și în meniu, și în joc). |
| `meserii.js` | 12 meserii, trepte, unelte. |
| `retete.js` | 55 de rețete de meserie. |
| `bani.js` | Aramă / argint / aur. 1 aur = 10.000 arame. |
| `tovarasi.js` | Tovarășii de închiriat (tanc, vindecător, lovitor) și mintea lor. |
| `drumuri.js` | Caii, piatra de întoarcere, opririle de zbor. |
| `amenintare.js` | Cine ține inamicul pe el (socoteala de amenințare). |
| `sunete.js` | 24 de sunete făcute din cod, fără fișiere audio. |

### Misiunile
| Fișier | Ce ține |
|---|---|
| `misiuni.js` | Motorul: stări, cerințe, predare, semnele `!` și `?`. |
| `misiuni-scrise.js` | Misiunile scrise de mână, cu poveste. |
| `misiuni-zone.js` | Misiunile generate pe zone. |
| `misiuni-clasa.js` | 15 misiuni de clasă (dau primul rang la câteva abilități). |
| `misiuni-temnite.js` | 16 misiuni de temniță. |
| `misiuni-final.js` | 6 misiuni de final de poveste. |

### Lumea
| Fișier | Ce ține |
|---|---|
| `zone/generator.js` | Construiește harta unei zone din rețeta ei. Cel mai delicat fișier după `game.js`. |
| `zone/climat.js` | 8 climate (pădure, câmpie, pustiu, mlaștină, munte, cenușă, peșteră, coastă) — culorile și texturile terenului. |
| `zone/lista-zone.js` | Ține evidența zonelor înregistrate. |
| `zone/zona-*.js` | 41 de zone de lume. Fiecare e o **rețetă**, nu o hartă: cât e de mare, ce climat, unde stau locurile, ce inamici. |
| `zone/oras-*.js` | 2 capitale (Ambervault, Karrak Hold), cu hărți construite de mână. |
| `zone/temnita-*.js` | 8 temnițe. |
| `zone/raid-longaccount.js` | Singurul raid, nivel 60, 9 camere, 8 șefi. |

### Ferestre și meniuri
| Fișier | Ce face |
|---|---|
| `titlu.js` | Ecranul de titlu și alegerea slotului. |
| `meniu.js` | Crearea personajului. |
| `meniu-joc.js` | Meniul din joc (fișă, abilități, talente, rucsac, misiuni). |
| `prada.js` | Ferestrele: tarabă, antrenor, prada, teleportare, grajd, han, zbor. |
| `harta.js` | Harta lumii și harta zonei. |
| `salvare.js` | Salvarea în `localStorage`, 3 sloturi. |

### Verificatoare
| Fișier | Cum se rulează |
|---|---|
| `verifica.js` | În browser: `http://localhost:8765/index.html?verifica=1`. Verifică legăturile dintre tabele, drumul de la 1 la 60, arborii de talente. |
| `verifica-dubluri.js` | `node verifica-dubluri.js`. Chei scrise de două ori + **funcții globale cu același nume în fișiere diferite**. |
| `server-test.py` | Serverul fără cache. Vezi secțiunea 2. |

---

## 5. Regulile de lucru cerute de Sandra

Astea nu sunt sugestii, sunt cerute explicit:

1. **Un singur pas pe mesaj.** Se oprește și se așteaptă confirmarea.
2. **După fiecare pas, se spune ce trebuie să vadă pe ecran** și ce să facă
   dacă vede altceva.
3. **Zero jargon neexplicat.** Orice cuvânt tehnic se explică în aceeași
   propoziție, cu un exemplu din viața de zi cu zi.
4. **Înainte de cod, 2-3 propoziții simple** despre ce urmează să facă.
   Codul îl scrie asistentul, nu ea.
5. **Nu se presupune niciodată că ea a greșit.** Se întreabă ce vede, se cere
   eroarea, se rezolvă pas cu pas.
6. **Se spune cinstit** când ceva e prea complicat sau nu se poate.

Ea e începătoare completă în programare. Lucrează pe Mac, joacă pe iPhone,
are cam 4-7 ore pe săptămână.

### Lista ei „DO NOT IMPLEMENT NOW"

Și-a scris singură o listă de lucruri de amânat, și a cerut **să fie
reamintită că a scris-o** dacă cere vreunul dintre ele:

> alte zone, călătorie între zone, hartă sau minihartă, orașe cu NPC-uri,
> misiuni, echipament, magazine, talente, sunet, multiplayer, monetizare

Dintre astea, 9 s-au construit pe parcurs, cu acordul ei. **Au rămas
neatinse, dinadins: multiplayer și monetizare.**

---

## 6. Regula de limbă — se respectă strict

- **Tot ce se vede în joc e în ENGLEZĂ.**
- **Tot textul din joc stă într-un singur fișier: `texte.js`.** Nu se scrie
  text direct în cod.
- **Codul, comentariile și numele de funcții sunt în ROMÂNĂ** (fără diacritice).
- Conversația cu ea e în română.
- **Niciodată text românesc în joc.**

---

## 7. Regula de drepturi de autor — se respectă strict

Nu se preia nimic din Warcraft. Cuvintele ei:

> Copiem doar mecanici: ce face o abilitate, când se învață, cum funcționează.
> Nu preluăm nume, texte de tooltip, iconițe sau sunete din Warcraft — le
> inventezi tu, să aibă sens. Numele din Classic sunt DOAR referință.
> Niciunul nu ajunge în joc, nici în ce vede jucătorul, nici în ID-urile
> interne. ID-urile sunt neutre, de exemplu `warrior_strike_01`.

Ce înseamnă în practică:
- Fără artă, fără sunete, fără iconițe, fără texte de tooltip din joc.
- Fără nume de zone, temnițe, raiduri, obiecte, abilități sau NPC-uri.
- Fără harta lumii din Classic. Fără arborii de talente din Classic.
- Fără Alliance/Horde — facțiunile se cheamă **Concord** și **Pact**.
- ID-urile interne sunt neutre și descriptive.

**Ea a cerut ca la finalul fiecărei faze să se caute în tot proiectul numele
din Classic și să i se raporteze rezultatul.** S-a făcut de fiecare dată.

Greșeli prinse așa, ca să știi ce fel de lucruri scapă:
- `Silverleaf`, 14 nume de talente, 8 pasive de rasă, Alliance/Horde/Night Elf.
- Echipamentul de start scris prima dată ca „Recruit's", „Apprentice's Robe",
  „Novice's", „Spring Water" — **toate sunt chiar numele obiectelor de start
  din Classic.**
- Al doilea cal, scris „Swift Courser" — „Swift + <cal>" e tiparul de nume al
  cailor din Classic.

---

## 8. Convenții din cod

- **Un pas de hartă** se cheamă căsuță. `TILE = 32` pixeli.
- **Terenul** se scrie cu litere (vezi `LITERE` în `zone/climat.js`):
  `.` pământ, `T` des (nu se trece), `P` drum, `W` apă, `X` zid, `F` foc...
  Aceleași litere peste tot; doar culorile diferă de la un climat la altul.
- **Zonele sunt rețete, nu hărți.** Harta se construiește când intri, din
  `samanta` zonei — aceeași sămânță dă mereu aceeași hartă.
- **Texturile** se desenează din sub-pixeli: `PIXEL = 2`, deci 16×16
  sub-pixeli pe căsuță. Paleta are 12 nuanțe (0-3 umbre, 4 bază, 5-8 lumini,
  9-11 a doua culoare).
- **Personajele și inamicii** sunt desenați din dreptunghiuri și cercuri,
  scriși ca liste de forme. Fiecare formă primește automat un contur negru;
  cu `faraContur: true` nu-l primește (pentru umbre și lumini puse peste).
- **Obiectele:** câmpul pentru treapta de material se cheamă **`treapta`**,
  NU `material` — `material: true` înseamnă deja „ăsta e material de meserie".
- **Banii** se țin în arame. 1 argint = 100 arame, 1 aur = 10.000 arame.
- **Schimbarea zonei** se face cu `scene.restart()`, nu cu un joc nou.

---

## 9. Capcane știute — toate au costat timp

### În cod
1. **Două funcții globale cu același nume** — vezi secțiunea 3. Rulează
   `node verifica-dubluri.js`.
2. **Chei scrise de două ori într-un tabel** — a doua o înghite pe prima, în
   tăcere. Același verificator le prinde.
3. `poateInvata()` din `talente.js` întoarce un **obiect** `{poate: true}`,
   nu `true`. `if (poateInvata(...))` e mereu adevărat.
4. Variabilele declarate cu `let` la nivelul de sus al unui fișier **nu stau
   pe `window`**. `window.personaj = x` nu schimbă `personaj`-ul din joc.

### La testat în browser
5. **Serverul obișnuit servește fișiere vechi.** Folosește `server-test.py`.
6. **Un panou de browser ascuns oprește `requestAnimationFrame`**, deci bucla
   jocului nu mai rulează: `scene.restart()` și `delayedCall` nu se mai
   întâmplă. Fă o captură de ecran întâi, ca să-l trezești.
7. **Consola browserului păstrează mesajele de la încărcarea anterioară.**
   Deschide un tab nou înainte să judeci erorile.
8. **După teleportare, bucățile de teren nu-s desenate încă** — ecranul e
   negru câteva secunde. Nu e o eroare, așteaptă.
9. Când muți personajul de test cu mâna, **verifică `potMerge(x, y)`** — dacă
   îl pui pe o căsuță prin care nu se trece, inamicii se izbesc de teren și
   pare că nu mai atacă.
10. Nu înlocui `Math.random` ca să obții măsurători curate: Phaser îl
    folosește pentru numele texturilor și crapă cu „Texture key already in use".

---

## 10. Ce e construit

**Lumea:** 41 de zone de lume + 2 capitale + 8 temnițe + 1 raid = 52 de zone.
Două continente, legate cu vapor și zepelin. Hartă a lumii și hartă de zonă.

**Personajul:** 4 rase (human, nightelf, orc, undead), 4 clase (warrior,
hunter, mage, priest), 2 facțiuni (Concord, Pact). Înfățișare aleasă la
creare. 3 sloturi de salvare.

**Lupta:** 69 de abilități cu ranguri, bară cu două pagini, 84 de talente în
3 arbori pe clasă, critice, dodge, reflect, furt de viață.

**Progresul:** nivel 1-60, 225 de misiuni, antrenori de clasă în ambele
capitale, echipament de start la creare.

**Obiecte:** 6 trepte de material, 4 rarități, 6 seturi cu bonusuri,
durabilitate care se strică și se repară pe bani.

**Meserii:** 12, cu unelte, rețete, noduri de cules pe hartă, pescuit, gătit.

**Temnițe:** 8 + 1 raid, cu camere construite de mână, șefi cu nume și prada
lor, inamici mărunți cu nume proprii pentru fiecare temniță.

**Tovarăși de închiriat:** tanc, vindecător, lovitor. Limite după unde ești
(1 în lume, 3 în temniță, 5 în raid). **Socoteală de amenințare**: tancul
chiar ține inamicii pe el.

**Călătorie:** cal la nivelul 40 și unul mai bun la 60, piatră de întoarcere
legată de un han, 43 de opriri de zbor pe care le descoperi mergând pe jos.

**Moartea:** rămâi duh, mergi înapoi la trup, sau te ridici pe loc cu rău de
înviere. Echipamentul se strică la moarte.

**Altele:** animal pentru hunter, teleportare pentru mag, 24 de sunete făcute
din cod, poveste cu final (cumpărătorul din spatele a tot).

---

## 11. Ce NU e construit

- **Multiplayer** — pe lista ei de amânat, dinadins.
- **Monetizare** — la fel.
- **Jocul pe iPhone (Capacitor)** — amânat de ea, „ultima chestie".
- **Statul jos să mănânci și să bei** + experiență de odihnă — propus,
  ea a zis să-l lăsăm.
- **Reputație cu facțiuni** — propus, neales încă.
- **Conținut de nivel 60** dincolo de raid — a zis „vedem după".

---

## 12. Cifre măsurate (nu estimate)

Astea s-au măsurat în joc, nu ghicit. Sunt utile ca să știi ce e normal:

- Traversarea unei zone pe jos: **2 minute și 36 de secunde**. Un continent
  dintr-un capăt în altul: **13 minute** de mers neîntrerupt.
- Toate cele 225 de misiuni la un loc dau **50 de aur**.
- La nivelul 40, o sută de umanoizi dau ~15 aur; la 60, ~34 aur.
- Învățarea tuturor abilităților până la 60 costă 6-8 aur, după clasă.
- 51 de puncte de talent la nivelul 60; ai nevoie de 76 ca să iei un arbore
  întreg, deci trebuie să alegi.
- O bucată de teren se construiește în ~3,6 ms. În joc: 78-120 fps.
- O zonă se construiește în ~277 ms (ecranul de încărcare acoperă asta).
- Cu tanc și 5 inamici: tancul încasează 100% din lovituri dacă lovești
  normal, 88% dacă lovești de zece ori mai tare.

---

## 13. Cum se adaugă lucruri

**O zonă nouă:** un fișier în `zone/`, copiat după unul existent, plus un
rând în `index.html`. Primește automat oprire de zbor și intră în hartă.

**O temniță nouă:** un fișier `zone/temnita-*.js`. Își spune singură de unde
se intră (`intrareDin: { zona, loc }`) — nu se umblă în zona-mamă. **Locul
trebuie să existe în zona aia**; `verifica.js` verifică asta (s-a greșit deja
de trei ori aici).

**O abilitate nouă:** un bloc în `abilitati.js`. Dacă are un fel nou (`fel`),
trebuie tratat și în `porneisteEfectul` din `game.js`, altfel nu face nimic
și nu spune nimic.

**Un talent nou:** în `talente.js`. Efectul (`efect`) trebuie să fie unul
dintre cele 12 pe care jocul le citește, altfel rămâne text frumos.
`verifica.js` prinde asta.

**Un obiect, un inamic, un NPC:** un bloc în tabelul lui. Desenul e o listă
de dreptunghiuri.

**După ORICE schimbare:**
```bash
node --check <fisierul>          # sintaxa
node verifica-dubluri.js         # nume scrise de doua ori
```
și în browser: `index.html?verifica=1` — trebuie să scrie un singur rând verde.

---

## 14. Cum s-a lucrat până acum (merită păstrat)

- **Se măsoară, nu se presupune.** Aproape fiecare problemă găsită a fost
  găsită printr-o măsurătoare, nu din privit. Când ceva „pare" stricat, se
  scrie un test care să dea o cifră.
- **Se verifică dacă nu cumva testul e de vină.** S-a întâmplat de multe ori:
  distanța greșită, personajul pus pe teren blocat, măsurătoarea făcută
  înainte să treacă un cadru. Un „bug" care nu se reproduce printr-un joc
  normal probabil nu există.
- **Comentariile spun DE CE, nu CE.** Unde s-a greșit odată, comentariul
  explică greșeala, ca să nu se repete. Sunt multe astfel de comentarii în
  cod și merită păstrate.
- **Commiturile sunt lungi și explică ce s-a măsurat.** `git log` e o parte
  din documentație.
