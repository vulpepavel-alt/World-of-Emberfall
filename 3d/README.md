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

## The world joins up

Walk to the edge of a zone and you cross into the next one. Every
gate has a ring on the ground and the name of what is on the other
side floating over it.

`faZona()` had already cut the gates — `zona.treceri` says which
square is a gate, which zone is beyond it, and which way is inwards.
City gates and dungeon mouths are on that same list, so they all
work without a line written about them.

Two things had to be right, and both had bitten the 2D game first:
you must not arrive **on** a gate, or it sends you straight back for
ever — you arrive ten squares inside; and a gate ignores you until
you have stepped off every gate once.

Measured: Greenvale → Thornmoor → Gravemoor → Thornmoor →
Gravemoor, arriving exactly 10 squares from the return gate every
time, never inside anything.

## The hunter's companion

Tame a beast off the map with **Bind Beast**, call it, and it walks
at your heel and fights what you fight. If it goes down, **Rouse
Companion** brings it back at half health; **Tend Companion** mends
it.

A tamed beast *is* the beast you tamed — the same entry in
`mobi.js`, the same coloured rectangles, so a tamed wolf looks like
a wild one. Its health and damage come from `statsleAnimalului()`
and the 1.15× it gets for being content comes from
`sporulFericirii()` — two more rules that were stuck inside
`game.js` and now live in `mobi.js` where both games read them.

While it is fighting, roughly half the bites aimed at you land on it
instead. That is the whole point of having one.

Measured: a tamed wolf bites every 2 seconds for 3–6 — its base 2–5
times the contentment bonus.

## Talents

**N** opens the three trees. From level 10 you get a point a level,
51 by level 60, and what you spend them on is the difference between
two warriors of the same level. Locked tiers show how many points
they still want; a talent that needs another one first says so.

`talente.js` knew all of that already — the trees, the ranks, the
tiers, the prerequisites — and `poateInvata()` answers whether you
may take one and why not.

The real work was not the window. It was that **eight of the twelve
effects were not being read by anything in the 3D world**, so half
of every tree was decoration. Each is now applied exactly where the
2D game applies it:

| Effect | Where it lands |
|---|---|
| `dmgArma` | your weapon damage |
| `viteza` | how often you swing |
| `viata`, `armura`, `critic` | worked out with your stats |
| `dmgAbilitate` | every ability's damage |
| `costResursa` | what an ability costs — asked once, for both "can you afford it" and "what are you charged" |
| `pauza` | how long until you can use it again |
| `damageIncasat` | what reaches you through armour |
| `dodge` | your chance to slip a blow |
| `regen` | health and mana out of combat |
| `vindecare` | how much a heal mends |

Measured one at a time, each talent taken to full rank on its own:
armour 110→132, ability cost 25→20 rage, critical 7.75→10.75%,
damage taken ×0.90, ability damage ×1.15, weapon damage ×1.10, dodge
0→3%, cooldowns ×0.82, regeneration ×1.30, health 760→836, swing
667→600 ms. Healing, averaged over 400 casts: **×1.195 against
×1.200 expected.**

## One thing this turned up in the 2D game

The reasons a talent refuses you — "needs 15 points in this tree" —
were written by hand in `talente.js`, **in Romanian**, and
`meniu-joc.js` shows them straight to the player. So the 2D game has
been showing Romanian to a player whose game is meant to be entirely
in English. They are in `texte.js` now, in English, which fixes both
games at once.

## Trades

Ore and herbs were already scattered across every zone — `faZona()`
placed them, on walkable ground, at levels that suit the zone.
Greenvale alone has **70**. They simply were not being drawn.

Now they are: a lump of rock, a tuft of leaves, built from the
node's own colour, with the material's name over it **in the colour
of what it is still worth to you** — orange, yellow, green, grey,
the game's own four thresholds. Walk up and press **F**; it takes a
couple of seconds and walking away stops it.

**K** opens your trades: what you know, your skill, and the recipes
you can make. Trainers in the towns teach a trade for money.

Everything is the game's own: which trade a node belongs to, what it
gives and how much, `deCeNuPotiCulege()` for why you cannot,
`adaugaSkill()` for whether you earn a point, `retete.js` for what a
recipe costs and makes, and the rule that an anvil or a rune table
or a cooking fire has to be within three squares.

Measured, end to end: standing on a vein without the trade says "You
need Delving"; learning Delving asks for a Pick; with the pick it
gathers Dull Ore and the skill goes 1 → 2 and the vein empties. In
Ambervault the Forge Master teaches Smithing and hands over its
first recipe; at an anvil that recipe makes a Dull Ingot and the
skill goes 1 → 2. Away from an anvil it says "Needs Anvil", makes
nothing — **and leaves your materials alone**, which is the part
worth checking.

`deCeNuPotiCulege` moved out of `game.js` into `meserii.js` on the
way: it asks whether you have the trade, the skill and the tool,
which is nothing to do with drawing.

## Getting about

Four ways across a world of 52 zones, all of them already written
down in `drumuri.js` with no way of being asked for:

- **Flight paths.** 43 stops, one per landmark worth landing at.
  Walk to one and it is yours; after that the flight master will
  take you to any you have found. The fare comes from how far apart
  the two zones sit on the world map.
- **The homeward stone.** An innkeeper binds it to their village and
  hands you the stone. It brings you back, once an hour.
- **Horses.** One at level 40, one at 60. Not in a fight, and a hit
  knocks you out of the saddle.
- **Long Step**, the mage's own road to a city.

And the things in your bag do things now: bread, water, bandages,
recipe sheets. Click one in the bag — something you wear goes on,
something you use gets used. That also gave the mage's two cooking
abilities somewhere to put what they make, so **every ability in the
game now does something**.

Measured: walking into Greenvale village discovers `greenvale:sat`;
Wren Tallow offers nowhere to go while it is your only stop, which
is right; after finding Reed Camp, the flight there costs 1800
copper and lands you on open ground in Gravemoor. Corin Mallow binds
the stone, and from another zone it brings you home with a 60 minute
wait. A Valley Horse takes you from 6.5 tiles a second to 10.4 —
exactly its 1.6×. Drawn Water is made two at a time and drinking one
fills your mana.

## A bug the horse found

Trying to mount kept saying "Not while fighting" when nothing was
near me. It turned out to be right twice — both times something
really was angry — but chasing it turned up a real fault:

**A monster you woke and then ran away from stayed angry for ever.**
Out of range it stops being given a turn, so nothing ever calmed it
down. And since "am I in a fight?" asks whether *any* monster in the
zone is angry, one left behind in a corner quietly stopped your
health coming back, stopped your rage draining, and made it
impossible to mount — anywhere in that zone, for the rest of the
session.

Now a monster that falls out of range goes home and mends, the way
it would if it had chased you and given up.

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

## The controls, done the way this kind of game does them

They were spread across three files, and it showed: one press of
Escape both dropped your target *and* threw the settings window
open, because two files were listening for it and neither knew about
the other. They all live in `3d/comenzi3d.js` now.

| | |
|---|---|
| **W / S** | walk forward and back |
| **A / D** | turn left and right |
| **Q / E** | step sideways without turning |
| **Space** | jump |
| **X** | sit down; you stand up the moment you move |
| **left drag** | swing the view around you — you do not turn |
| **right drag** | turn *yourself*, view following at your back |
| **both buttons** | walk forward |
| **wheel** | closer or further away |
| **left click** | pick something |
| **right click** | pick it and go at it |
| **Tab / Shift+Tab** | nearest enemy in front, then the next / previous |
| **T** | start and stop swinging |
| **Escape** | shut a window, then drop your target, then the menu |

Three things about it are worth writing down.

**Tab looks in front of you, and not through walls.** It takes
everything alive within thirty tiles, works out the angle between
your facing and each one, and sorts those inside a 76° cone ahead of
the rest — so Tab walks outwards from what is under your nose and
only turns round to look behind you once it has run out of things
ahead. It also marches a line to each one and drops any with a wall
in the way.

**Auto-attack says when it is doing nothing.** Out of reach you do
not swing, and it tells you — once, not every frame. A silent
auto-attack that is idle because you are half a step too far away is
the most confusing thing a fight can do.

**Swapping targets restarts your swing**, as it does in Warcraft.
Without it you could stand between two wolves and hit both on one
weapon timer by tabbing back and forth — twice the damage the weapon
is worth.

Measured from four camera angles: W and S go along your facing, Q
and E go left and right **of the screen** (0.85–1.0 against the
camera's own right-hand axis every time), and A/D with the right
button held do exactly what Q and E do. Right-dragging moves your
facing and the camera by the same amount; left-dragging moves the
camera and leaves your facing untouched, to the digit.

## Everything moves now

`3d/animatii3d.js`. Until this, everything slid about like a chess
piece and a dead wolf simply stopped existing between one moment and
the next.

- **Walking** — arms and legs swing from the hip and the shoulder,
  and you bob twice a stride, because both feet come down.
- **Standing** — you breathe, and so does every wolf and every
  townsperson, each on its own timing so a row of them is not one
  row breathing in unison.
- **Jumping** — legs tuck up, and how far depends on how high you
  are. It reaches 0.66 tiles and lands clean.
- **Swinging** — the sword arm comes over and back, on top of the
  walk rather than instead of it, so you can do both at once.
- **Being hit** — you flinch back; a wolf jerks and flashes red.
- **Striking** — a wolf lunges at you along its own facing as it
  bites.
- **Dying** — creatures fall over sideways through a full quarter
  turn and sink into the ground. Measured: the body now stays for
  about 1.8 seconds and is then cleared.

**The one idea worth keeping:** the phase of a walk is driven by how
far you have *walked*, not by the clock. Step length then stays the
same on foot and on a horse at 1.6×, so the feet never skate. Doing
it from the clock is what makes characters in cheap games look like
they are on a conveyor belt.

Two things had to be got right to make it safe:

- **The limbs hang from joints.** Turning a box turns it about its
  own middle, which makes the foot swing forward while the knee
  swings backward, like a propeller. Each limb now sits inside an
  empty group at the hip or shoulder, and it is the group that
  turns.
- **Creature animation is SET, never ADDED.** `lupta3d.js` has
  already put each monster where it belongs this frame, so the
  animation is an offset from that, worked out fresh. Adding to the
  position would have been fine for monsters — and would have sent
  the townspeople slowly drifting up into the sky, because nothing
  ever writes theirs again.

A hundred wolves share one set of colours, which is what makes a
hundred wolves cheap. So the red flash gives a creature colours of
its own the first time it is actually hit, and only then. Fight
three wolves out of a hundred and three wolves pay for it.

## The world got its grain

`3d/texturi3d.js`. Everything drawn in code on a blank canvas at the
moment the page opens — there is no image file in this project.

- **Every surface carries a pattern that multiplies its colour.** The
  grass stays exactly the green `climat.js` says it is; it just has
  speckle in it now, and walls have courses.
- **A tree is a trunk with a crown on it.** It used to be one solid
  block from the ground up, which is why a wood looked like a hedge.
  The bark colour is worked out from that climate's leaf colour, so
  a pine wood and a dead marsh do not get the same trunks. Trunks
  are built with the world, out to the full ninety tiles — put with
  the grass at thirty, a wood in the distance would have been crowns
  floating with nothing holding them up.
- **Tufts, flowers and pebbles** are sown over the thirty tiles
  around you and rebuilt as you walk, positioned from each tile's own
  numbers — so the same corner of the same field has the same
  daisies every time you come back to it. Real randomness would make
  them jump about as you moved, which the eye catches instantly.
- **Rivers run**: the ripple picture is slid along in both
  directions at different speeds. Two numbers a frame.

**Grass took three goes.** A blade really is about five centimetres
across and twenty tall, and that is what the first version drew. It
looked like a field of little green fence posts — you cannot afford
one box per real blade, and four posts to the square metre is a
fence, not a lawn. So the fine grass went into the ground texture as
short strokes lying every which way, and what stands up out of it
became low, wide, squat tufts. Squat was the opposite of what seemed
obvious, and right.

**And distance had to be smoothed.** Left unsmoothed, a wood seen
from across the valley turned into corduroy: the pattern is finer
than the screen can show, so the dots beat against the pixels and
come out as stripes that crawl as you walk. Small copies of the
picture picked by distance fix it. Up close it is still perfectly
blocky.

120 frames a second with 6.000 tufts, 33.000 ground slabs and 20.000
standing boxes in view.

## A bug hiding behind all of it

`amestecul()` — the scrambler that decides how far each tile sits
between its two shades, and which way each creature faces — **could
only ever return a number between 0 and a half.**

The last line said `n >> 16`. That shift keeps the sign bit, so
shifting a negative number right fills the top with ones; the top
bit of `n` and the top bit of `n >> 16` were therefore always equal,
and the XOR of two equal bits is zero. The answer's top bit could
never be one. `>>>` fills with zeros instead, so the bit survives.

Nothing crashed, which is why it sat there: every ground colour
still mixed, just never past halfway towards its second shade, and
every creature still turned to face somewhere — in only half the
compass. Both look right until you know. It surfaced because the
flowers, which want the top of the range, never appeared at all: 156
of them where there had been none.
