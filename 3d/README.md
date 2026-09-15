# The 3D prototype

This folder is **not** the game. It is one question, asked as cheaply
as possible:

> Does walking around this world in 3D feel good enough to be worth
> rebuilding the game for?

Nothing here is meant to be kept. If the answer turns out to be no,
this folder gets deleted and the 2D game is untouched — it does not
load a single file from here.

## It is a whole game's front door now, not just a test page

The title screen, the three save slots and the character creation
screen are **the 2D game's own files**, loaded unchanged — same
`meniu.css`, same `titlu.js`, same `meniu.js`, same markup. Pick a
race, a class, a face, a name, press Accept, and you walk into the
3D world.

Those files ask exactly one thing of whatever comes after them: a
function called `porneste()`. In the 2D game that function lives in
`game.js` and starts Phaser. Here it lives in `prototip.js` and walks
you into the 3D world instead. Neither file knows the other exists.

Saves are shared, and in both directions: positions are written in
the 2D game's own units (32 pixels to a tile), so a character you
leave in one can be picked up in the other.

**All 52 zones** are loaded — 41 of the world, 2 cities, 8 dungeons
and the raid — and the box at the top left drops you into any of
them.

## How to open it

Start the test server, from the game folder:

```bash
python3 server-test.py
```

Then open **http://localhost:8765/3d/** in Chrome.

No app to install and nothing to build — the same as the 2D game.
The 3D drawing toolbox (Three.js) is fetched from the internet the
same way Phaser is.

## What you can do

- **W S** or **up/down** — walk forwards and back
- **A D** or **left/right** — turn, the way they do in Warcraft. The
  camera swings round with you and stays at your back.
- **Q E** — step sideways without turning
- **drag with the mouse** — look around without turning your character
- **scroll wheel** — pull the camera in or push it out
- **the Zone box, top left** — drop into a different zone
- **P** — how chunky the picture is: smooth, 2×, 3×, 4×, 6×

The chunky look is not a filter laid over the top. The picture is
drawn **small** — at 3× it is a third of the window wide and a third
tall — and then blown up, each small dot becoming a square block of
screen with nothing smeared in between. Exactly what the 2D game
does with `pixelArt: true`. It also costs *less*: a third by a third
is a ninth of the work.

- **Tab** — pick the nearest monster, or **click** one
- **Space** — start and stop swinging at it
- **Escape** — let go of your target

## It fights now, with the game's real numbers

Monsters wander a few steps from home, notice you within 9 tiles,
come at you, hit back, die, and come back after 45 seconds. Wander
too far from home and they give up and walk back, healing on the way
— as they do in the 2D game.

Not one formula was rewritten for this. The fight calls:

| | |
|---|---|
| `statsPentruNivel()` | `mobi.js` — a monster's health, damage and armour for its level and rank |
| `damageulTau()` | `lupta.js` — how hard you hit |
| `dupaArmura()` | `lupta.js` — how much armour swallows |
| `ratezi()` | `lupta.js` — whether you miss |
| `xpDeLaMob()` | `personaj.js` — what killing it is worth |
| `xpPentruNivel()` | `personaj.js` — when you level up |

`lupta.js` is new, but nothing in it is: those five functions were
lifted out of the middle of `game.js`, where the 3D world could not
reach them. **Both pages load it now.** There is no second copy of
the damage formula to drift out of step with the first.

Measured: a level 5 warrior kills a level 1 rat (52 health) in about
9 seconds and gets exactly 26 XP — which is what `xpDeLaMob(1, 5)`
returns. Die and you lie there 4 seconds, then get up with full
health at the zone's own resurrection point, with everything calmed
down.

## The action bar

A row of twelve buttons along the bottom, on keys **1–9, 0, − and
=**, with your own frame top left and your target's beside it, and a
cast bar above the buttons. That arrangement is a convention — it is
what a player's hands already know.

**Every picture in it is drawn by us, in code, out of shapes.** Not
one icon, border or colour is taken from any other game. The icons
are one drawing per *kind* of ability — a slash for a weapon blow, a
flame for a burn, rings for something that hits everything around
you, a shield for something that holds — tinted with the colour the
ability already carries in `abilitati.js`. The names come from
`abilitati.js` and `texte.js`, which are ours as well. Nothing here
needs anyone's permission.

The buttons do what buttons in these games do: an icon, the key
printed in the corner, a dark curtain that sinks as the cooldown
runs out with the seconds left across it, dimming when you cannot
afford it, and a tooltip on hover with the cost, the cast time and
the cooldown.

The bar went from 8 slots to 12 **in both games** — three pages of
four in the 2D one, all twelve at once in 3D. Old saves are padded
to 12 rather than thrown away, so nobody loses the arrangement they
had.

## The abilities

There are **22 kinds** of ability in `abilitati.js`, not the nine
the file first claimed — I only found that out by firing all 67 of
them one at a time and looking at which did nothing. **Seventeen are
done**, covering 61 abilities: weapon blows, shots, spells, heals,
heals over time, wounds over time, things that hit everything
around you, strengthenings, leaps that close or open the gap,
weakenings, absorb shields, fear, charm, playing dead, mana
restores, and traps that wait on the ground.

**Five are not, and say so when pressed rather than pretending:**
`cheama`, `invie` and `imblanzire` need the hunter's pet;
`faceMancare` needs bags; `teleport` needs city travel. None of
those exist in the 3D world yet. The four interrupts run, but there
is nothing casting to interrupt yet.

Rage and mana both work, in opposite directions: rage fills by
hitting and being hit and drains out of combat, mana starts full and
comes back at Spirit ÷ 5 per second. Both numbers are the game's,
not new ones.

## Loot and bags

Kill something and it leaves a sack on the ground with a ring of
light under it. Walk up and press **F**, or click it. **B** or **I**
opens your bag — twenty slots, click a piece to put it on.

Nothing about *what* drops is decided in the 3D code.
`pradaCompleta()` in `obiecte.js` already knew all of it: how much
money, how likely an item is, what a wolf leaves versus a bandit,
that only humanoids carry coins, that a rare one always leaves
something good. The 3D world only picks it up and shows it.

The item pictures are the 2D game's own as well.
`formeleIconitei()` hands back a list of coloured rectangles on a
16×16 grid — the very same list the 2D game paints from — and here
they become rectangles in an SVG. One description, drawn twice by
two different pieces of code.

Putting something on works the numbers out again through the game's
own calculators (`calculeazaViata`, `calculeazaAttackPower`,
`bonusEchipament` and the rest), so a helmet changes exactly what it
should.

## Quests and merchants

People with something for you carry a **!** over their head, a **?**
when you have finished it, and **···** while you are still on it.
Walk up and press **F**, or click them.

None of that is decided in the 3D code either. `misiuni.js` already
knew every quest — who gives it, what it asks for, what it pays,
whether your level is high enough, and how far along you are. It
even works out the `!` and `?` itself. Killing something reports to
`amUcis()` and the count moves.

Merchants sell from `faMarfa()`, which decides what is on the shelf,
and `bani.js` sets what things cost. Sell something back and it sits
on their shelf so you can change your mind — at full price. Junk
does not: nobody buys back a wolf's tooth.

`faMarfa` used to live inside `prada.js`, the 2D merchant *window*.
What a merchant keeps on the shelf is a rule about items, not about
the window showing them, so it moved to `obiecte.js` where both
games can read it. Same twelve items, same rarities.

Measured end to end: talk to Marshal Bren, accept "Rats in the
Cellar", kill 8 field rats — the objective moves 0/8 → 8/8 and his
mark turns from ! to ? — hand it in for 90 copper and 140 XP, level
up, and his mark turns back to ! because the next quest has opened.
At the merchant: buy for 19 copper, sell back for 5 (the game's own
25% cut), and with an empty purse it says so and takes nothing.

**Still missing:** no talents in combat, no pet, no professions, no
travel between zones.

## The point: where the world comes from

None of this world was drawn by hand here. The page loads the **same
zone files the 2D game loads**, calls the **same `faZona()`** with the
**same seed**, and gets back the same grid of letters — `.` is ground,
`P` is road, `T` is thick forest, `W` is water, `X` is the wall at the
edge of the zone.

Each letter already carries its colour and whether you can walk on it,
in `zone/climat.js`. So the 3D world is the 2D world seen from a
different angle, not a copy of it — and the colours match because they
are literally the same numbers.

That is the thing worth knowing before committing to a rebuild: the
data layer really does survive. Around 13.000 of the game's 21.000
lines are rules, items, quests, zones and tables that never knew
whether the game was 2D or 3D.

## The monsters and the townspeople come from the data too

This was the surprise. Every creature in the game is already stored
as **a list of coloured rectangles** — `MOBI['wolf'].forme` is 23 of
them, `NPC['hangiu'].forme` is 20 — each with an x, a y, a width and
a height. That is a flat side view. All it needs to become a body is
a depth.

So nothing here is modelled by hand. The wolves in the prototype are
the wolves from `mobi.js`. Repaint one there and it changes here.
Where they stand comes from the data as well: `faZona()` placed 1300
monsters and 9 townspeople around Greenvale, and this page just reads
the list.

A creature gets a body when you come within 55 tiles and gives it
back when you walk away. Monster names only show within 22 tiles —
fifty of them at once is noise.

## What it does not do yet, on purpose

- **Nothing moves.** Creatures stand where they were placed. No
  combat, no wandering, no reacting to you.
- **No ceiling on the dungeons.** You can see out over the walls.
- **Wolves are front-on.** A creature drawn in profile in 2D ends up
  facing sideways in 3D. Only a problem once they need to face you.
- **No phone controls.** Keyboard and mouse only.

## Fixed after the first look

- **W A S D were wrong.** The camera sits at `(sin, cos)` away from
  you, so forward is `(-sin, -cos)` — the Z half of that had the
  wrong sign, mirroring everything. With the camera behind you W and
  S were reversed; swing it a quarter turn and A and D were instead.
  Verified since: all 16 key-and-camera-angle combinations match
  exactly.
- **Houses were two slabs.** In the 2D map a house is drawn from
  above — a band of roof, and in front of it a band of front wall.
  Stood up as-is that made a red slab beside a cream slab. Now every
  tile of a building gets a wall from the ground up with the roof
  colour laid across the top, and the doorway stays a hole.
- **The camera went through walls.** It now walks the line from your
  head outwards and stops at the first thing tall enough to be in the
  way. Spinning all the way round in the village street, it pulls in
  at 7 of 18 angles and ends up inside a wall at none of them.

## The numbers, measured

Measured in Chrome on this Mac, on 15 September 2026:

| | |
|---|---|
| Work per frame | 0,04–1,23 milliseconds (the budget at 60 frames a second is 16,7) |
| Building one outdoor zone | 180–300 milliseconds |
| Ground tiles drawn at once | 32.761 |
| Trees, rocks, walls and roofs at once | 6.900–16.600 |
| Creatures with bodies at once | 6–83 |
| Zones | all 52 built, entered and drawn — no errors, and you stand on walkable ground in every one |
| Monsters placed across all 52 | 72.980 |
| Townspeople placed across all 52 | 306 |
| Building all 52 zones back to back | 9,8 seconds (303 ms for the largest) |

## Keeping the two pages honest

Both pages load the same data files, so two things can break quietly:
a new file added to one page and not the other, and two files using
the same name. The second one is nasty — every script shares one
namespace, so a repeated `const` is a syntax error that stops the
whole page before a single line runs. Black screen, no message. It
happened while building this.

So there is a check:

```bash
node verifica-3d.js
```

It reports the file count, and fails if a script is missing, loaded
twice, points at a file that does not exist, or shares a top-level
name with another file.

The world is built in a square about 90 tiles around you and built
again as you walk out of it, the same way the 2D game builds its
terrain in chunks. A whole zone is up to 860×567 — nearly half a
million tiles — which is far too many to draw at once.
