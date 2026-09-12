# PROMPT: refă acest joc în 3D

*(Copiază tot ce urmează, de la linia cu „Ce ai de făcut" până la sfârșit, și dă-i-l celuilalt chat.)*

---

## Ce ai de făcut

Am un RPG 2D terminat, scris în JavaScript + Phaser 3, jucabil pe telefon. Vreau să-l refaci **în 3D**, păstrând **exact aceleași reguli, formule și conținut**. Documentul ăsta conține tot: statistici, formule, rase, clase, talente, obiecte, bani, pradă, misiuni, hărți, inamici, interfață. Nu inventa mecanici noi și nu schimba cifrele fără să mă întrebi.

**Eu sunt începătoare la programare.** Lucrează cu mine așa:
- **Un singur pas pe mesaj.** Oprește-te și așteaptă confirmarea mea.
- După fiecare pas, spune-mi **ce ar trebui să văd pe ecran** și ce să fac dacă văd altceva.
- **Zero jargon neexplicat.** Dacă folosești un termen tehnic, explică-l în aceeași propoziție, cu un exemplu din viața reală.
- Explică-mi codul în 2–3 propoziții simple **înainte** să-l scrii. Tu scrii codul.
- **Nu presupune că eu am greșit.** Întreabă ce văd, cere-mi eroarea, rezolvă pas cu pas.
- **Fii sincer** când ceva e prea complicat sau imposibil.
- Vorbește cu mine în **română**. Tot textul **care apare în joc** trebuie să fie în **engleză**, ținut într-un singur fișier de texte.

### Limitare importantă de drepturi de autor
Mecanicile sunt luate din World of Warcraft Classic și reimplementate. **Nu copia conținut Blizzard**: nici arta, nici arborii de talente reali, nici numele de obiecte sau de zone, nici harta din Classic. Numele, poveștile și desenele din documentul ăsta sunt ale mele — folosește-le pe ele.

### Ce vreau de la varianta 3D
- Aceleași formule și același echilibru, cu aceleași cifre.
- Cameră din spate-sus (third person), personajul văzut din spate.
- Comenzi pe telefon: joystick virtual stânga, butoane de abilități dreapta.
- Stil vizual: low-poly, culori plate, fără texturi fotografice. Vreau să semene cu pixel-artul din varianta 2D: simplu, citibil, anii '90.
- Spune-mi tu ce tehnologie e cea mai potrivită (Three.js? Babylon.js? Godot? Unity?) și **de ce**, cu argumente pentru un telefon și pentru cineva care învață.

---

# 1. STRUCTURA JOCULUI

Jocul are **două ecrane**:

1. **Ecranul de creare a personajului** — alegi facțiunea, rasa, clasa, înfățișarea, numele.
2. **Jocul propriu-zis** — o zonă deschisă în care umbli, lupți, iei misiuni, cumperi.

Peste joc se deschid ferestre: **meniul** (5 file), **prada**, **taraba negustorului**, **fereastra de misiune**. **Doar una odată.**

Jocul 2D are canvas logic de 800×450, care se scalează. Nu există salvare — la reîncărcare începi un personaj nou.

---

# 2. STATISTICI ȘI FORMULE

Cinci atribute: **Strength (str), Agility (agi), Stamina (sta), Intellect (int), Spirit (spi)**.

## 2.1 Formulele de conversie — NU le schimba

```
Health      = 20 + (primele 20 de Stamina × 1) + (fiecare Stamina peste 20 × 10)
Mana        = Intellect × 15          (doar clasele cu mana; Warrior are Rage)
AttackPower = Strength × apPerStr
AttackPowerDistanță = Strength × apPerStr + Agility × apPerAgi   (doar Hunter; altfel null)
Armor       = Agility × 2
Critical    = 5% + (Agility / 20)%    (critical = damage dublu)
```

Exemplu: 22 Stamina → 20 + 20 + (2 × 10) = **60 Health**.

## 2.2 Damage și armură

```
damagePeLovitură = (aleatoriu între arma.dmgMin și arma.dmgMax + (AttackPower / 14) × arma.viteza)
                   / LOVITURI_MAI_DESE
                   × înmulțitorulTalentelor('dmgArma')
dacă e critical: × 2

damageFinal = damage × (1 − armura / (armura + 485))
```

`LOVITURI_MAI_DESE = 3`. Asta înseamnă că lovești de 3 ori mai des decât spune viteza armei, dar fiecare lovitură face o treime. **Damage-ul pe secundă rămâne același**, doar că lupta se simte mai vie.

```
pauzaÎntreLovituri (ms) = (arma.viteza × 1000) / 3 × reducereaTalentelor('viteza')
```

## 2.3 Ratare, dodge, critical de la inamic

```
SANSA_RATARE     = 5%   — șansa să ratezi o lovitură obișnuită
WEAPON_TRAINING  = 3%   — Human ratează cu atât mai puțin (deci 2%)
QUICKNESS_DODGE  = 5%   — Duskborn evită complet o lovitura
SANSA_CRITIC_MOB = 5%   — șansa ca un inamic să te lovească critic
```

Ultimele două numere le-am adăugat eu, ca pasivele Slip Aside și Thick Bone să aibă ce reduce.

## 2.4 Resurse

```
IESIRE_DIN_LUPTA  = 5000 ms fără lovituri = ai ieșit din luptă
RAGE_MAXIM        = 100
RAGE_PE_LOVITURA  = 12    (împărțit la LOVITURI_MAI_DESE)
RAGE_LA_INCASARE  = 6     (când ești lovit tu)
RAGE_SCURS_PE_SEC = 25    (în afara luptei rage-ul se scurge)
SPIRIT_PER_MANA   = 5     (mana pe secundă în afara luptei = Spirit / 5)
REGEN_VIATA_SPIRIT= 10    (viață pe secundă în afara luptei = Spirit / 10)
```

**Rage și Mana se umplu invers.** Mana e plină la început și scade când o folosești; se reface în afara luptei. Rage e goală la început, se umple lovind și încasând, și se scurge în afara luptei. Sunt două comportamente diferite care folosesc același element vizual (o bară sub bara de viață).

**Atacurile obișnuite nu costă mana.** Mage și Priest lovesc cu toiagul pe gratis; Hunter trage cu arcul pe gratis. Doar abilitățile costă.

---

# 3. NIVELURI ȘI EXPERIENȚĂ

```
NIVEL_MAXIM          = 60
NIVEL_PRIMUL_TALENT  = 10          (primul punct de talent)
puncteTalentLaNivel(n) = n < 10 ? 0 : n − 9      → 51 de puncte la nivelul 60

XP_BAZA   = 60
XP_PUTERE = 1.7
xpPentruNivel(n) = round(60 × n^1.7 / 5) × 5     (rotunjit la 5)

XP_MOB_BAZA = 45
xpDeLaMob(nivelMob, nivelTau):
    diferenta = nivelMob − nivelTau
    dacă diferenta <= −6  → 0 (nu mai dă nimic)
    spor = max(0.15, 1 + diferenta × 0.12)
    return max(1, round(45 × nivelMob × spor))
```

**La urcarea în nivel se schimbă DOAR trei lucruri:** nivelul, experiența necesară și punctele de talent. Restul (atribute, viață, attack power) se recalculează din nivelul nou. **Echipamentul, rucsacul, banii, misiunile și talentele rămân neatinse.**

> ⚠️ **Capcană pe care am pățit-o.** În prima variantă, urcarea în nivel construia un personaj nou de nivelul următor și îl copia peste cel vechi, salvând înapoi doar numele, experiența și talentele. Asta ștergea echipamentul, rucsacul și banii la fiecare nivel. Nu face asta.

---

# 4. RASELE (4)

Fiecare rasă are atributele de bază și **două pasive**.

| Rasă | Facțiune | str | agi | sta | int | spi |
|---|---|---|---|---|---|---|
| **Human** | Concord | 20 | 20 | 20 | 20 | 20 |
| **Duskborn** | Concord | 18 | 24 | 19 | 20 | 20 |
| **Orc** | Pact | 23 | 18 | 22 | 18 | 22 |
| **Undead** | Pact | 20 | 19 | 21 | 19 | 24 |

### Cele 8 pasive de rasă

| Rasă | Pasivă | Efect exact |
|---|---|---|
| Human | **Stubborn Heart** | Spirit × 1.05, rotunjit în jos |
| Human | **Drilled Hand** | șansa de ratare scade de la 5% la 2% |
| Duskborn | **Slip Aside** | 5% șansă să eviți complet o lovitură |
| Duskborn | **Go Unseen** | stai nemișcat 2 secunde → inamicii te pierd și ieși din luptă |
| Orc | **Red Surge** | +50% Attack Power timp de 15 secunde, o dată la 2 minute |
| Orc | **Thick Bone** | primești cu 15% mai puțin damage din loviturile critice |
| Undead | **Grave Feast** | după ce omori ceva, îți revin 30% din viața maximă, întins pe 10 secunde |
| Undead | **Unquiet Flesh** | 1% din viața maximă pe secundă, **și în luptă** |

### Culori pentru înfățișare

```
Human     piele: #f0c9a6 #e3b78f #cf9a69 #b07d57 #8d5f3f
          păr:   #3d2b1c #1b1512 #7a4a24 #caa96b #8d8d95
Duskborn piele: #9d7fd8 #8f6fce #b192e6 #7d5fb8 #c7aef0
          păr:   #2f7f76 #1f5f58 #4aa89c #6f4fa8 #d8dce8
Orc       piele: #5f9e63 #4e8552 #6faf72 #3f6d45 #84bd84
          păr:   #24331f #131a10 #4a3a22 #6b6b60 #8f2f2f
Undead    piele: #adc0bb #98aca7 #c3d2cd #8195a0 #6f8188
          păr:   #3a3a44 #1c1c22 #5c4a3a #8a2f3a #c9c9d2
```

Alegi și: **Face** (Round / Narrow / Wide), **Hair Style** (Short / Long / Spiky / Bald), **Facial Hair** (Clean / Moustache / Full Beard).

Nume de exemplu pentru butonul „Randomize":
Human: Aldric, Elena, Marcus, Isolde, Roland, Brianna ·
Duskborn: Shaeya, Talyndris, Ilyana, Kaelen, Nyssara, Faerin ·
Orc: Grokar, Murgash, Uzrek, Kagra, Thruk, Zolga ·
Undead: Mordris, Nezra, Ossian, Valka, Cryven, Gwynn

---

# 5. CLASELE (4)

`modificatori` se **adună** peste atributele rasei. `crestere` se adaugă la fiecare nivel.

| Clasă | Culoare | Modificatori | Creștere / nivel | Resursă | apPerStr | apPerAgi |
|---|---|---|---|---|---|---|
| **Warrior** | `#a04747` | str +3, sta +2 | str 1.2, agi 0.6, sta 1.2, int 0.2, spi 0.4 | Rage | 2 | 0 |
| **Hunter** | `#4e8f6a` | agi +3, sta +1, spi +1 | str 0.5, agi 1.3, sta 0.9, int 0.4, spi 0.6 | Mana | 1 | 2 |
| **Mage** | `#4a6fd6` | int +3, spi +2 | str 0.3, agi 0.5, sta 0.7, int 1.4, spi 0.9 | Mana | 1 | 0 |
| **Priest** | `#e2e6f0` | int +2, spi +3 | str 0.3, agi 0.4, sta 0.7, int 1.2, spi 1.2 | Mana | 1 | 0 |

### Armele de start

| Clasă | Armă | dmgMin | dmgMax | viteza (s) |
|---|---|---|---|---|
| Warrior | Sword (corp la corp) | 3 | 6 | 2.0 |
| Hunter | **Bow (doar la distanță)** | 3 | 5 | 2.4 |
| Mage | Staff (corp la corp) | 2 | 4 | 2.6 |
| Priest | Staff (corp la corp) | 2 | 4 | 2.4 |

**Hunter luptă DOAR cu arcul** — n-are armă de corp la corp. Rază de tragere 260 (în unități 2D; în 3D alege echivalentul).

### Pasivele de clasă

| Clasă | Pasivă | Efect exact |
|---|---|---|
| Warrior | **Battle Fury** | sub 30% viață câștigă până la +50% rage (crește liniar cu cât ești mai aproape de moarte) |
| Hunter | **Hunter's Eye** | primele 3 secunde ale unei lupte: +25% damage la săgeți |
| Mage | **Arcane Barrier** | la începutul fiecărei lupte capătă un scut care înghite 15 damage; se reface în afara luptei |
| Priest | **Inner Will** | 2 mana pe secundă, **și în luptă** |

### Abilitățile (buton propriu lângă ATTACK, cu cooldown vizibil)

| Clasă | Abilitate | Cost | Cooldown | Cast | Efect |
|---|---|---|---|---|---|
| Warrior | **Heavy Strike** | 25 rage | 0 | 0 | lovitură cu damage dublu |
| Hunter | **Drawn Shot** | 25 mana | 6 s | 0 | săgeată cu damage dublu |
| Mage | **Arcane Bolt** | 20 mana | 3 s | **1.5 s** | 8–12 damage, rază 200, culoare `#2f6fd0` |
| Priest | **Holy Spark** | 18 mana | 2.5 s | 0 | 6–10 damage, rază 200, culoare `#e8c15a` |
| Priest | **Mend Wounds** | 25 mana | 6 s | 0 | vindecă 15–20 |

Abilitățile sunt **manuale** — nu se folosesc singure. Butonul arată câte secunde mai are până poate fi apăsat din nou, și se stinge dacă n-ai resursa.

---

# 6. TALENTELE

- **3 arbori pe clasă, 7 talente pe arbore** = 21 de talente pe clasă.
- **5 trepte** (0–4). Ca să deschizi treapta N îți trebuie **5 × N puncte cheltuite în acel arbore** (`PUNCTE_PE_TREAPTA = 5`).
- Unele talente cer alt talent din același arbore (câmpul `cere`).
- La nivelul 60 ai **51 de puncte**, dar arborii au 76–77 de ranguri în total → **nu poți lua tot**, trebuie să alegi. Exact ca în WoW Classic.
- Buton **Reset all** care întoarce toate punctele.

### Efectele posibile

`dmgArma` · `dmgAbilitate` · `critic` · `viteza` · `viata` · `armura` · `damageIncasat` · `costResursa` · `pauza` · `regen` · `vindecare` · `dodge`

Fiecare talent are `valoare` = cât dă **un singur rang**. Trei rânduri în `Honed Edge` (valoare 2) = +6% damage cu arma.

### WARRIOR

**Bladework** — t0 Honed Edge (5×2% dmgArma) · t0 Steady Grip (3×1% critic) · t1 Quick Arm (5×2% viteza) · t1 Deep Cuts (3×5% dmgAbilitate, cere Honed Edge) · t2 Ruthless (5×2% dmgArma) · t3 Executioner (3×2% critic) · t4 Bladestorm (1×30% dmgAbilitate, cere Executioner)

**Bulwark** — t0 Toughened Hide (5×4% armura) · t0 Hardened Body (5×2% viata) · t1 Absorb Blow (5×2% damageIncasat) · t2 Sure Footing (3×1% dodge) · t2 Iron Will (5×2% viata, cere Hardened Body) · t3 Wall of Steel (3×3% damageIncasat, cere Absorb Blow) · t4 Unbreakable (1×15% viata)

**Ironblood** — t0 Hot Blood (5×6% regen) · t0 Cheap Blows (5×4% costResursa) · t1 Catch Breath (3×6% pauza) · t2 Wild Swings (5×2% viteza, cere Hot Blood) · t3 Red Hunger (3×3% dmgArma) · t3 Reckless Rage (2×2% critic) · t4 War Cry (1×12% dmgArma, cere Red Hunger)

### HUNTER

**Marksmanship** — t0 Steady Aim (5×2% dmgArma) · t0 Taut String (5×2% viteza) · t1 Barbed Tips (3×1% critic) · t1 Heavy Arrows (5×2% dmgArma, cere Steady Aim) · t2 Dead Eye (3×6% dmgAbilitate) · t3 Rapid Draw (3×8% pauza) · t4 Perfect Shot (1×6% critic, cere Dead Eye)

**Wilderness** — t0 Weathered Skin (5×4% armura) · t0 Long Breath (5×2% viata) · t1 Light Step (3×1% dodge) · t2 Live Off the Land (5×6% regen) · t2 Hardened (5×2% damageIncasat, cere Weathered Skin) · t3 Beast Instinct (3×1% dodge, cere Light Step) · t4 Lord of the Wild (1×15% viata)

**Cunning** — t0 Frugal (5×4% costResursa) · t0 Clear Mind (5×6% regen) · t1 Trapper (3×5% dmgAbilitate) · t2 Patience (3×7% pauza, cere Trapper) · t2 Guile (5×1% critic) · t3 Ambush (3×7% dmgAbilitate) · t4 Master Hunter (1×12% dmgArma)

### MAGE

**Destruction** — t0 Living Flame (5×3% dmgAbilitate) · t0 Spark (3×1% critic) · t1 Swift Casting (5×5% pauza) · t1 Lingering Burn (5×3% dmgAbilitate, cere Living Flame) · t2 Detonation (3×2% critic) · t3 Raw Power (3×5% dmgAbilitate) · t4 Cataclysm (1×25% dmgAbilitate, cere Raw Power)

**Arcane** — t0 Deep Well (5×8% regen) · t0 Temperance (5×4% costResursa) · t1 Focus (3×6% pauza) · t2 Reinforced Barrier (5×2% damageIncasat) · t2 Wellspring (5×8% regen, cere Deep Well) · t3 Equilibrium (3×5% costResursa, cere Temperance) · t4 Boundless (1×20% costResursa)

**Warding** — t0 Woven Robes (5×5% armura) · t0 Frail No More (5×2% viata) · t1 Sidestep (3×1% dodge) · t2 Aegis (5×2% damageIncasat, cere Woven Robes) · t2 Inner Calm (3×7% regen) · t3 Warded (3×3% viata, cere Frail No More) · t4 Untouchable (1×12% damageIncasat)

### PRIEST

**Light** — t0 Warm Hands (5×4% vindecare) · t0 Short Prayer (5×4% costResursa) · t1 Blessing (3×7% pauza) · t2 Radiant Touch (5×4% vindecare, cere Warm Hands) · t2 Faith (3×7% regen) · t3 Grace (3×5% vindecare) · t4 Miracle (1×25% vindecare, cere Grace)

**Shadow** — t0 Cutting Shadow (5×3% dmgAbilitate) · t0 Whisper (3×1% critic) · t1 Gathering Dark (5×3% dmgAbilitate, cere Cutting Shadow) · t2 Shadow Veil (3×1% dodge) · t2 Torment (5×1% critic) · t3 Deep Night (3×6% dmgAbilitate, cere Gathering Dark) · t4 Shadowlord (1×25% dmgAbilitate)

**Discipline** — t0 Tempered Body (5×2% viata) · t0 Blessed Vestments (5×5% armura) · plus încă 5 talente pe același tipar (dodge, damageIncasat, regen, viata) — completează-le ca în ceilalți arbori.

---

# 7. INAMICII

## 7.1 Statistici după nivel

```
Nivel 1:  viata 42, dmg 1–3, viteza 2.0 s, armura 20

statsPentruNivel(n):
  viata  = round(42 × 1.20^(n−1))
  dmgMin = round(1 + (n−1) × 0.8)
  dmgMax = round(3 + (n−1) × 1.1)
  viteza = 2.0
  armura = 20 + (n−1) × 5
```

Nivel 10 → 217 viață, 8–13 damage, 65 armură.

## 7.2 Comportament

```
VITEZA_MOB          = 45     (se plimbă liniștit)
VITEZA_MOB_FURIOS   = 95     (te urmărește — mai lent ca tine, ca să poți fugi)
VITEZA (jucătorul)  = 160
RAZA_AGRO           = 92     (de la ce distanță te observă)
RAZA_LESA           = 260    (dacă se depărtează atât de locul lui, renunță și se întoarce)
RAZA_ATAC_MOB       = 30     (de aproape trebuie să fie ca să te lovească)
RAZA_ATAC (tu)      = 34
RAZA_PLIMBARE       = 96     (cât se depărtează de locul lui când e liniștit)
TIMP_REAPARITIE     = 10000 ms
REGENERARE_MOB_SECUNDE = 40  (își reface TOATĂ viața în 40 s după ce iese din luptă)
TIMP_REINVIERE      = 3500 ms (cât stai mort înainte să te întorci în tabără)
```

## 7.3 Cele 10 feluri

**Neam** decide dacă lasă bani: **fiarele nu lasă bani** (ca în WoW), doar umanoizii.

| Fel | Nume în joc | Neam | Zonă |
|---|---|---|---|
| rat | Field Rat | fiară | ambele |
| boar | Boar | fiară | ambele |
| wolf | Wolf | fiară | Greenvale |
| spider | Forest Spider | fiară | Greenvale |
| burrower | Burrower | fiară | Greenvale |
| bandit | Bandit | **umanoid** | Greenvale |
| vulture | Dust Vulture | fiară | Redwaste |
| serpent | Sand Serpent | fiară | Redwaste |
| scorpid | Scorpid | fiară | Redwaste |
| raider | Raider | **umanoid** | Redwaste |

Fiecare arată diferit. În 2D sunt desenați din dreptunghiuri și cercuri colorate; în 3D fă-le modele low-poly care se recunosc de la distanță după siluetă.

---

# 8. BANII

```
100 arame (copper) = 1 argint (silver)
100 arginți        = 1 aur    (gold)
```

**Ține UN SINGUR număr**: câte arame ai. Aurul și argintul se calculează doar când le scrii pe ecran. Altfel poți ajunge la socoteli imposibile de tipul „2 arginți și 137 de arame".

```
desfaBanii(arame):
  aur    = floor(arame / 10000)
  argint = floor((arame % 10000) / 100)
  arama  = arame % 100
```

Verificat: `100 → 1s 0c`, `1234 → 12s 34c`, `10000 → 1g 0s 0c`, `123456 → 12g 34s 56c`.

Culori: aur `#e6c669`, argint `#c9ccd4`, aramă `#c8825a`.

### Cât lasă un inamic

```
baniDeLaMob(nivel, esteUmanoid):
  dacă nu e umanoid → 0
  baza = nivel² × 0.9 + nivel × 2
  return max(1, round(baza × (0.65 + random × 0.7)))       // între 65% și 135%
```

Un bandit de nivel 6 lasă în jur de 40 de arame. 13 bandiți → cam 530 de arame (5s 30c).

---

# 9. OBIECTELE ȘI ECHIPAMENTUL

## 9.1 Cele 15 sloturi

Stânga: Head, Neck, Shoulders, Back, Chest, Wrists
Dreapta: Hands, Waist, Legs, Feet, Ring 1, Ring 2
Jos: Trinket, Main Hand, Off Hand

## 9.2 Rarități

| id | Nume | Culoare | putere | șansă la drop | adjective |
|---|---|---|---|---|---|
| comun | Common | `#c8c2b4` | 1.0 | 50 | Worn, Plain, Rough |
| bun | Uncommon | `#5fbf5f` | 1.5 | 32 | Sturdy, Fine, Keen |
| rar | Rare | `#5f9fe0` | 2.2 | 14 | Gleaming, Runed, Tempered |
| maiestru | Epic | `#b06fd8` | 3.2 | 4 | Ancient, Dread, Storied |

## 9.3 Cum se fac obiectele

Nu sunt scrise unul câte unul. Se compun din trei bucăți: **adjectiv + piesă + coadă**.
*Runed Helm of Stone*, *Keen Blade of the Spring*.

```
NUME_PIESA = { cap: Helm, gat: Amulet, umeri: Pauldrons, spate: Cloak,
               piept: Breastplate, incheieturi: Bracers, maini: Gloves,
               brau: Belt, picioare: Greaves, talpi: Boots,
               inel1/inel2: Band, talisman: Charm,
               armaPrincipala: Blade, armaSecundara: Shield }

COZI = of Might (str) · of the Wind (agi) · of Stone (sta)
       of Insight (int) · of the Spring (spi)

MARIME_SLOT = cap 1.0, gat 0.6, umeri 0.85, spate 0.6, piept 1.2,
              incheieturi 0.6, maini 0.8, brau 0.8, picioare 1.2, talpi 0.8,
              inel1/2 0.7, talisman 0.9, armaPrincipala 1.3, armaSecundara 0.9

putere = (1 + nivel × 0.55) × raritate.putere × MARIME_SLOT[slot]

statistica principală (din coadă) = max(1, round(putere × 0.7))
a doua statistică (aleasă aleatoriu) = max(1, round(putere × 0.35))
armura = max(1, round(putere × 2.2))   — doar pentru sloturile care dau armură
```

Sloturi care dau armură: cap, umeri, spate, piept, încheieturi, mâini, brâu, picioare, tălpi, Off Hand. **Inelele și talismanul nu dau armură.**

`nivelCerut = nivel`. Ce e peste nivelul tău stă stins în rucsac cu nivelul scris în colț cu roșu și nu se poate echipa.

## 9.4 Preț

```
valoare = max(1, round((nivel² × 0.6 + nivel × 8 + 4) × raritate.putere))
preț de cumpărat  = valoare              (plătești tu)
preț de vândut    = round(valoare × 0.25) (primești tu)
```

Nu poți trăi din cumpărat și revândut. Ce îi vinzi negustorului ajunge **pe taraba lui** și îl poți lua înapoi, dar la prețul întreg.

## 9.5 Rucsacul

**20 de locuri.** Când e plin nu mai poți lua obiecte de pe jos (banii intră oricum — nu ocupă loc). Grilă de pătrate, cu icoana obiectului. Ții apăsat pe un obiect (sau treci cu mouse-ul) și apare **fișa** lui:

```
Dread Helm of the Spring     ← numele, colorat după raritate
Epic                  Head   ← raritatea și slotul
Item Level 9
42 Armor
+13 Spirit                   ← verde
+7 Intellect
Requires Level 9             ← roșu dacă ești prea mic
Sell price: 1s 0c
```

---

# 10. PRADA DE LA INAMICI

**Nimic nu sare singur în inventar.** Când omori ceva, pe locul lui rămâne **un sac care sclipește**. Te duci lângă el, îl atingi, se deschide fereastra, iei ce vrei sau apeși **Take All**.

```
SANSA_SA_LASE_OBIECT   = 35%   (primul obiect)
SANSA_AL_DOILEA_OBIECT = 12%   (încă unul, doar dacă a căzut primul)
TIMP_SAC               = 90000 ms  (după atât se face praf)
RAZA_PRADA             = 70     (de cât de aproape îl poți deschide)
```

Dacă atingi un sac de departe: **„Too far away"** și nu te duce acolo.

Sacul conține: **bani** (doar de la umanoizi), **obiecte**, și **lucrurile cerute de misiuni** (marcate cu un `!` galben). Lucrurile de misiune **nu ocupă loc în rucsac** — se scriu direct în carnet, ca să nu poți rămâne blocat.

> ⚠️ **Capcană.** „Take All" trebuie să ia tot **într-o singură mișcare**, pe sacul întreg. Dacă ia banii întâi, sacul se golește, fereastra se închide, și pasul următor caută obiecte într-un sac care nu mai există → crapă. Mie mi s-a întâmplat exact asta.

---

# 11. NEGUSTORII

Doi în fiecare tabără: unul de **armuri**, unul de **arme**. Te apropii, îi atingi, se deschide taraba cu două file: **Buy** și **Sell**.

- Marfa: **12 obiecte**, de nivel 1–11, mai ales Common (62%) și Uncommon (31%), rar Rare (7%). Se face o singură dată, la intrarea în zonă.
- Ce nu-ți permiți stă stins și nu se poate apăsa.
- Când n-ai destui bani: **„Not enough money"**, și nu-ți ia nimic.
- Când rucsacul e plin: **„Your bags are full"**.

Numele: Alden Hobb ‹Trade Goods›, Mira Steelhand ‹Weaponsmith› (Concord) · Gurtok Ashpaw ‹Trade Goods›, Zelka Ironjaw ‹Weaponsmith› (Pact).

---

# 12. MISIUNILE

## 12.1 Cum funcționează

Patru stări: **neluată → activă → gata → predată**.

Semnul de deasupra capului:

| semn | înseamnă |
|---|---|
| **!** galben | are ceva de dat |
| **?** stins (`#7a6748`) | ai luat, dar n-ai terminat |
| **?** galben (`#ffd34d`) | ai terminat, întoarce-te |

Două feluri de cerințe:
- **ucide** — omoară N inamici de un fel. Numărătoarea apare deasupra capului la fiecare ucidere: *Field Rat slain: 3/8*.
- **adună** — strânge N lucruri care cad de la un fel de inamic. `SANSA_OBIECT_DE_MISIUNE = 45%`.

O misiune poate cere alta dinainte (`cere`) și un **nivel minim**. Răsplată: experiență, bani, și de la a doua misiune **două obiecte din care alegi unul** (generate o singură dată și rămân aceleași).

Fila **Quest Log** în meniu arată la ce ești și cât mai ai.

## 12.2 Zece oameni care dau misiuni

**Greenvale (Concord):** Marshal Bren ‹Greenvale Marshal› (6 misiuni) · Edda Marrow ‹Barley Farmer› (3) · Coll Ashfen ‹Forest Warden› (3) · Prospector Dunn ‹Mine Foreman› (3) · Knight Ansel ‹Keep Captain› (3)

**Redwaste (Pact):** Chief Gorrash ‹Warband Chief› (6) · Kaza Boneclaw ‹Beast Tracker› (3) · Old Murgh ‹Bonecaster› (3) · Zib Sandrunner ‹Warband Scout› (3) · Captain Drex ‹Warband Captain› (3)

**36 de misiuni**, 18 pe zonă. Fiecare are **90–135 de cuvinte** de text, în 4 paragrafe.

## 12.3 Poveștile

**GREENVALE.** Începi cu șobolani în hambar. Marshalul observă că au venit toți într-o singură noapte și că mistreții n-ar părăsi pământ bun degeaba — ceva i-a mutat. Un cărăuș e jefuit dar **lăsat în viață**, ceea ce e ciudat: bandiții care vor să mănânce nu lasă martori. Punga lui are un sigiliu pe care nimeni din vale nu-l recunoaște. Șase pungi cu același sigiliu înseamnă o **stat de plată** — iar o stat de plată are pe cineva la celălalt capăt. Sigiliul aparține unei case care vrea valea de trei generații și a fost refuzată de trei ori. Nu pot cumpăra valea și nu o pot lua cât timp trăiesc oameni în ea, **deci fac traiul aici scump**: șobolani, mistreți, lupi împinși de pe creastă, un drum pe care nu mai umblă nimeni. Mina veche n-a fost epuizată, ci **pecetluită** — iar cineva a deschis-o primăvara asta, cu bani și cu tâmplari buni, fără să știe ce e în spatele zidului. Cavalerul de la cetate a primit o scrisoare în martie care cerea voie să cerceteze mina; a refuzat-o, dar **n-a spus nimănui**, fiindcă voia o primăvară liniștită.

Personajele **se contrazic**: Edda vrea lupii morți fiindcă i-au omorât câinele; Coll îți spune că lupii fug de ceva de pe creastă. Amândoi au dreptate. Un tăietor de lemne iese din pădure fără topor, cu mâinile tăiate, și nu spune un cuvânt o săptămână. Apoi spune o singură propoziție: *„They were put there."*

**REDWASTE.** O tabără mutată de patru ori, într-un canion uscat, cu prea puțină apă. Șobolani în saci. Corturi de patru ani prin care trece vântul, și copii care nu dorm. Patru butoaie de apă furate, și un băiat de cincisprezece ani mort păzindu-le, fiindcă paza butoaielor e ce dai cuiva care nu e gata de altceva. Fiecare jefuitor poartă **o fâșie de pânză roșie** — iar jefuitorii nu poartă o culoare, poartă ce au luat de la ultimul om; **o culoare înseamnă că cineva a împărțit-o.** Bătrâna care citește oasele refuză să spună numele cu voce tare, ceea ce nu făcuse în treizeci de ani. Omul care i-a îmbrăcat **a fost al lor**, alungat acum unsprezece ani, iar un șef alungat își petrece restul vieții construind unul mai mare. Căpitanul era pe butoaie cu băiatul și s-a dus douăzeci de pași să vadă un zgomot; șeful nu i-a spus un cuvânt despre asta în patru luni, și ar fi preferat să-i fi rupt falca.

## 12.4 Cerințele și răsplățile

| Zonă | Dător | Nivel | Titlu | Cerință | XP | Bani | Obiect |
|---|---|---|---|---|---|---|---|
| GV | marshal | 1 | Rats in the Cellar | 8 × rat | 140 | 90 | — |
| GV | marshal | 2 | What the Boars Turned Up | 10 × boar | 260 | 160 | niv 3 comun |
| GV | marshal | 5 | The Sealed Purse | 6 × Sealed Purse (bandit) | 700 | 450 | niv 6 bun |
| GV | marshal | 7 | A Name on Paper | 12 × bandit | 1150 | 780 | niv 8 rar |
| GV | marshal | 9 | The Thing Under Greenvale | 12 × burrower | 1800 | 1200 | niv 10 rar |
| GV | marshal | 10 | Hold the Valley | 15 × bandit | 2400 | 1800 | niv 11 epic |
| GV | taran | 2 | Trampled Barley | 10 × boar | 260 | 170 | niv 3 comun |
| GV | taran | 3 | Tusks for the Tanner | 6 × Boar Tusk | 380 | 260 | niv 4 bun |
| GV | taran | 4 | The Dog Did Not Come Back | 10 × wolf | 520 | 350 | niv 5 bun |
| GV | padurar | 4 | Thin the Pack | 12 × wolf | 560 | 380 | niv 5 comun |
| GV | padurar | 5 | Webs in the Deep Wood | 12 × spider | 760 | 480 | niv 6 bun |
| GV | padurar | 6 | Eight Sacs | 8 × Venom Sac | 950 | 640 | niv 7 bun |
| GV | miner | 7 | Who Opened the Mine | 10 × bandit | 1200 | 820 | niv 8 bun |
| GV | miner | 8 | Things That Dig | 12 × burrower | 1500 | 1000 | niv 9 rar |
| GV | miner | 9 | Chitin for the Smith | 8 × Chitin Claw | 1750 | 1150 | niv 10 rar |
| GV | cavaler | 6 | Short of Hands | 12 × bandit | 1000 | 700 | niv 7 bun |
| GV | cavaler | 8 | The Hill Road | 12 × spider | 1550 | 1050 | niv 9 bun |
| GV | cavaler | 10 | What Ansel Knew | 15 × burrower | 2300 | 1700 | niv 11 epic |
| RW | chief | 1 | Vermin in the Stores | 8 × rat | 140 | 90 | — |
| RW | chief | 2 | Thick Hides | 10 × boar | 260 | 160 | niv 3 comun |
| RW | chief | 5 | Take Back the Water | 12 × raider | 780 | 500 | niv 6 bun |
| RW | chief | 7 | Red Strips | 6 × Red Strip | 1200 | 820 | niv 8 rar |
| RW | chief | 9 | The Nest | 12 × scorpid | 1800 | 1200 | niv 10 rar |
| RW | chief | 10 | Break the Warband | 15 × raider | 2400 | 1800 | niv 11 epic |
| RW | vanator | 3 | Feathers for the Fletcher | 6 × Stiff Feather | 400 | 270 | niv 4 bun |
| RW | vanator | 4 | They Circle the Camp | 10 × vulture | 560 | 380 | niv 5 comun |
| RW | vanator | 5 | Serpents in the Wash | 12 × serpent | 760 | 480 | niv 6 bun |
| RW | samana | 5 | Venom Keeps a Wound Open | 8 × Curved Stinger | 800 | 520 | niv 6 bun |
| RW | samana | 6 | Shed Skins | 6 × Shed Skin | 1000 | 660 | niv 7 bun |
| RW | samana | 7 | The Bones Say East | 12 × scorpid | 1250 | 850 | niv 8 rar |
| RW | cercetas | 4 | Scouts Do Not Come Back | 12 × serpent | 600 | 400 | niv 5 bun |
| RW | cercetas | 6 | Count the Tents | 10 × raider | 1050 | 700 | niv 7 bun |
| RW | cercetas | 8 | The Vultures Know First | 12 × vulture | 1500 | 1000 | niv 9 rar |
| RW | capitan | 8 | Blood for the Barrels | 12 × raider | 1600 | 1100 | niv 9 bun |
| RW | capitan | 9 | Stingers for the Blades | 8 × Black Stinger | 1850 | 1250 | niv 10 rar |
| RW | capitan | 10 | The Exile's Banner | 15 × raider | 2350 | 1750 | niv 11 epic |

---

# 13. ZONELE

## 13.1 Scara — luată din fișierul de hărți al Blizzard

Am scos dimensiunile din tabelul `UiMapAssignment` (zona 12 = Elwynn Forest, 14 = Durotar), nu dintr-o estimare:

| Zona din WoW | Lățime | Înălțime |
|---|---|---|
| Elwynn Forest | **3.470,8 yarzi** | **2.314,6 yarzi** |
| Durotar | **5.287,5 yarzi** | **3.525 yarzi** |

Ambele sunt exact **3:2**. Durotar e de **1,52 ori** mai mare liniar, de **2,3 ori** ca suprafață.

**La 5 yarzi pe căsuță** (un yard ≈ 90 cm, un pas mare de om):

| Zona mea | Căsuțe | Echivalent |
|---|---|---|
| **Greenvale** (Concord) | **694 × 463** | Elwynn Forest |
| **Redwaste** (Pact) | **1058 × 705** | Durotar |

În 2D o căsuță are 32 px, deci Greenvale e 22.208 × 14.816 px. Cu viteza 160 px/s, traversarea durează **~2 min 20 s**. În 3D păstrează **raportul dintre zone** și traversarea de ~2 minute; alege tu unitatea potrivită.

## 13.2 Ce e în fiecare zonă

**GREENVALE** — pădure de primăvară. Un râu care șerpuiește de sus în jos, trecut prin poduri de piatră. Drumuri care se încrucișează. Dealuri însorite în jumătatea de răsărit. Poieni cu flori. Pădure deasă la nord-vest. Brâu gros de pădure de jur împrejur, ca să nu ieși din hartă.

Locuri: **satul** (case cu acoperiș roșu, fântână, Marshal + doi negustori) · **ferma Eddei** (casă, lan de orz împrejmuit cu gard viu, cu o spărtură) · **vizuina lupilor** (stânci, gaură neagră) · **coliba pădurarului** · **tabăra de bandiți** (corturi + foc) · **mina** (gura minei, grămezi de steril) · **cetatea de piatră** pe deal.

**REDWASTE** — canion uscat. O albie secată, palidă, pe care **se poate merge** (spre deosebire de râu). Pete de nisip bătut de vânt. Cactuși, tufe uscate, stânci. Pereți de canion de jur împrejur plus pinteni de stâncă în interior.

Locuri: **tabăra** (colibe cu acoperiș de piele, palisadă de lemn cu o singură poartă, foc în mijloc, Chief + Bonecaster + Captain + doi negustori) · **coliba vânătoarei** · **postul de pază al cercetașului** · **crăpătura scorpionilor** · **tabăra jefuitorilor** (palisadă + corturi + foc).

## 13.3 Inamicii pe hartă

| | Greenvale | Redwaste |
|---|---|---|
| total | **1171** | **1610** |
| pe feluri | bandit 344, wolf 227, spider 170, rat 162, boar 136, burrower 132 | vulture 410, rat 290, raider 278, scorpid 264, serpent 216, boar 152 |

**Nivelul crește cu depărtarea de tabără**: nivel mediu 2,2 lângă sat, 7,9 în colțurile îndepărtate. Cel mai apropiat inamic e la 10–16 căsuțe de locul unde începi, ca să nu te sară nimeni în cap din prima.

Inamicii stau în **tabere**: un punct, o rază, și un număr. În jurul fiecărui punct se împrăștie pe căsuțe libere, la minimum 3 căsuțe unul de altul.

## 13.4 Cum sunt construite hărțile

O hartă de 694 × 463 are peste 320.000 de căsuțe — **nu se poate scrie de mână**. Am scris un program care o construiește strat cu strat: iarbă → dealuri (zgomot) → poieni → râu (șerpuit, mijloc și lățime care se schimbă lin) → drumuri (cu abatere din zgomot, ca să nu fie trase cu rigla) → pădure (mai deasă spre nord-vest) → margine → locurile care contează → taberele de inamici.

**Trucuri care contează:**
- Folosește **praguri după procent**, nu praguri fixe: „vreau ca 17% din hartă să fie pădure" e mai ușor de reglat decât „zgomotul peste 0,86". Iei 20.000 de puncte la întâmplare, le sortezi, și afli de la ce valoare în sus e procentul cerut.
- **Astupă poienile închise.** Pădurea deasă lasă poieni la care nu se poate ajunge. După ce faci harta, pornește un flood-fill din locul de start și umple cu copaci tot ce n-a fost atins. Așa tot ce se vede verde e și de ajuns. (Mie mi-au ieșit 4704 căsuțe de astupat în Greenvale.)
- **Pune inamicii doar pe căsuțe la care se poate ajunge**, nu doar pe căsuțe libere.
- **Sămânța (seed)**: același număr dă mereu aceeași hartă.

**Scrie și un program de verificare.** Al meu verifică: rânduri de aceeași lungime, litere necunoscute, litere descrise dar nefolosite, culori valide, texturi cunoscute, **accesibilitate 100%**, podurile se leagă de drumuri, niciun NPC sau inamic în stâncă, există inamici de fiecare nivel 1–10, nivelul chiar crește cu depărtarea, fiecare misiune are pe cineva pe hartă, lanțul de misiuni e în ordine, și sunt destui inamici de felul cerut ca să poți termina.

---

# 14. RANDAREA (lecțiile din 2D)

Astea sunt lucrurile pe care le-am învățat construind varianta 2D. În 3D problemele sunt altele, dar principiile rămân.

## 14.1 Desenează doar ce e în jurul jucătorului

Prima variantă desena **toată harta într-o singură poză**, făcută la intrare. Mergea pentru o hartă mică. La scara lui Elwynn, poza ar fi avut 22.000 × 14.800 pixeli — **peste un gigabait**. Telefonul s-ar fi închis.

Soluția: harta tăiată în **bucăți de 8 × 8 căsuțe**. Se desenează doar cele din jurul camerei, cu o margine de o bucată; cele rămase la mai mult de 3 bucăți se șterg **și li se eliberează textura**. Un buget de **4 ms pe cadru** pentru desenat bucăți noi, ca să nu se blocheze jocul.

**Rezultat măsurat pe o hartă de 22.208 × 14.816 px:** 60 de cadre pe secundă și în mers și pe loc, 24 de bucăți vii, 22 MB.

## 14.2 Inamicii la fel

1600 de inamici creați toți la început ar însemna zeci de mii de obiecte desenate degeaba. Fiecare inamic din fișierul zonei e doar **o însemnare**: „aici stă un lup de nivel 3". Se face cu adevărat când te apropii (rază 700) și se șterge când te depărtezi (rază 1100). **Unul care se bate cu tine nu se șterge niciodată.**

**Măsurat în cea mai deasă tabără:** 28 de inamici pe ecran odată, 69–81 de cadre pe secundă, 43 MB.

## 14.3 Miniharta

Are **poza ei separată**, cu 2 pixeli pe căsuță — mică și ușoară, se ține toată în memorie. Nu micșora harta mare.

Pe ea: tu în mijloc (alb), personajele prietenoase (auriu), inamicii (roșu). **Cine are o misiune pentru tine se vede mai mare și mai aprins**, iar **inamicii de care ai nevoie pentru o misiune sunt portocalii**, nu roșii — altfel îi cauți pe o hartă de sute de căsuțe.

## 14.4 Zgomotul — o eroare pe care am pățit-o

Funcția mea de zgomot folosea înmulțire obișnuită:

```js
n = (n ^ (n >> 13)) * 1274126177;   // GREȘIT
```

Numărul iese peste 2^53, se rotunjește, și **zgomotul nu trecea niciodată de 0,5**. Jumătate din nuanțele fiecărei texturi nu se foloseau niciodată și nu-mi dădeam seama de ce totul arată plat. Corect:

```js
n = Math.imul(n ^ (n >>> 13), 1274126177);   // Math.imul nu pierde cifre
```

**Verifică distribuția oricărei funcții de zgomot** înainte s-o folosești: ia 100.000 de valori și uită-te la minim, mediană și maxim.

---

# 15. INTERFAȚA

## 15.1 Stil

RPG de calculator din anii '90 (Diablo, Baldur's Gate): piatră întunecată, chenare de alamă, litere cu serife, pergament.

```
piatra        #14100c   fundalul panourilor
piatraMoale   #241c12   fundalul cutiilor dinăuntru
alama         #8a6a2f   chenarul
alamaInchisa  #2e2311   linia din afara chenarului
alamaLucioasa #c9a961   muchia luminată și țintele din colțuri
text          #e8dcc0   pergament
textAuriu     #d9b555
textStins     #a08a63
viata         #4a7c2f   verde închis
rage          #9c3323
mana          #33529c
santBara      #0d0a06   adâncitura în care stă bara

font: Georgia, "Palatino Linotype", "Times New Roman", serif
```

## 15.2 Pe ecran în timpul jocului

- **Stânga sus**: unit frame — portret, nume, nivel, bară de viață verde, bară de resursă (rage roșu / mana albastru), bară de experiență.
- **Dreapta sus**: miniharta, cu ramă de piatră; sub ea butonul **MENU**.
- **Stânga jos**: joystick virtual (rază 58, bila 26, zonă moartă 9). Pe calculator merge și **WASD**.
- **Dreapta jos**: butonul **ATTACK** (rază 52), iar spre stânga lui butoanele de abilități (rază 44), fiecare cu cooldown-ul scris pe el. Pe calculator, tastele **1** și **2**.
- Zonele de atins sunt cu 12 px mai mari decât cercul desenat, și **se alege butonul cel mai apropiat de deget**, nu primul nimerit — altfel rămân găuri moarte între butoane.
- Deasupra fiecărui inamic: numele și nivelul, plus o bară roșie de viață. Deasupra personajelor prietenoase: numele **auriu** și titlul în paranteze ascuțite, **fără** bară de viață — ca să se vadă dintr-o privire că nu sunt inamici.

## 15.3 Meniul (5 file)

**Character** — sloturile de echipament: 6 în stânga, 6 în dreapta, personajul la mijloc, 3 jos (Trinket / Main Hand / Off Hand), și panoul de statistici în dreapta de tot (nivel, rasă, clasă, viață, resursă, experiență, **bani**, atribute, Attack Power, armură, critical).

**Spells** — pasiva de clasă și abilitățile, cu costuri și cooldown-uri.

**Talents** — cei trei arbori, pe trepte, cu „Requires N points" scris pe fiecare treaptă.

**Inventory** — grila rucsacului.

**Quests** — carnetul de misiuni.

Tasta **M** deschide/închide, **Escape** închide.

## 15.4 Echipamentul se VEDE pe personaj

Ăsta e un lucru la care am ținut. Când schimbi o piesă, se vede pe personaj:

| Raritate | Metalul |
|---|---|
| Common | fier tocit, gri |
| Uncommon | bronz |
| Rare | oțel albăstrui cu auriu |
| Epic | violet închis, coif **cu creastă și coarne** |

Piesele mari cresc cu raritatea: umerii se lățesc, coiful capătă creastă la Rare și coarne la Epic, pelerina se lungește. Arma și scutul își iau metalul din ce ai echipat.

**Un singur desen al personajului**, folosit și de joc, și de meniu. Două desene înseamnă două locuri de greșit.

---

# 16. ORDINEA ÎN CARE AM CONSTRUIT (îți recomand aceeași)

1. Ecranul de creare: rase, clase, atribute, formulele de conversie
2. Mersul pe hartă, o zonă mică de probă
3. Lupta de bază: lovești, primește damage, moare
4. Unit frame cu bara de viață și bara de resursă
5. Zonele ca fișiere de date, cu inamici așezați
6. Luptă adevărată: inamicii ripostează, moarte și reînviere
7. Pasivele de clasă și cele 8 pasive de rasă
8. Abilitățile pe butoane manuale, cu cooldown
9. Nivelurile 1–60 și experiența
10. Talentele
11. Meniul din joc
12. Obiectele, sloturile, inventarul
13. **Desenarea pe bucăți** (fără asta, hărțile mari nu sunt posibile)
14. Zonele la scara reală, cu inamici de nivel 1–10
15. Banii, prada din trupuri, negustorii
16. Rucsacul cu locuri, icoane, fișa obiectului, nivel cerut
17. Misiunile

---

# 17. CE NU EXISTĂ ÎNCĂ (și nici nu trebuie în prima variantă)

- **Salvare** — la reîncărcare începi un personaj nou
- **Trecerea dintr-o zonă în alta** — alegi facțiunea și rămâi în zona ei
- **Hartă mare** (doar miniharta)
- Sunet, muzică
- Multiplayer
- Abandonarea unei misiuni
- Aruncarea unui obiect (doar vânzare)
- Mutarea obiectelor în rucsac
- Genți care să adauge locuri peste cele 20
- Marfa negustorului nu se împrospătează
- Nicio urmărire pe hartă care să-ți arate unde e ținta misiunii

---

# 18. CUM VREAU SĂ ÎNCEPI

**Nu scrie cod încă.** Spune-mi:

1. **Ce tehnologie** îmi recomanzi pentru 3D pe telefon și **de ce** — cu argumente pentru cineva care învață, nu pentru un studio.
2. **Ce se schimbă neapărat** când treci de la 2D la 3D: coliziuni, cameră, cum arată harta, cum se face „desenarea pe bucăți" în 3D.
3. **Ce din documentul ăsta nu merge la fel în 3D** și ce propui în loc.
4. **Primul pas**, unul singur, cu ce ar trebui să văd pe ecran la sfârșitul lui.

Apoi mergem pas cu pas, cu confirmare de la mine între pași.
