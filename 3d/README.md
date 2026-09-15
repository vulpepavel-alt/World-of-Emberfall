# The 3D prototype

This folder is **not** the game. It is one question, asked as cheaply
as possible:

> Does walking around this world in 3D feel good enough to be worth
> rebuilding the game for?

Nothing here is meant to be kept. If the answer turns out to be no,
this folder gets deleted and the 2D game is untouched — it does not
load a single file from here.

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

- **W A S D** or the **arrow keys** — walk
- **drag with the mouse** — swing the camera around your character
- **scroll wheel** — pull the camera in or push it out
- **the Zone box, top left** — drop into a different zone

That is the whole list. There is no combat, no menus, no inventory
and no saving. The monsters and townspeople are there to look at,
nothing more — they do not move or fight. Adding any of that before
the walking feels right would be wasted work.

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
| Zones tried | 6 outdoor, 1 city, 1 dungeon — all loaded, no errors |

The world is built in a square about 90 tiles around you and built
again as you walk out of it, the same way the 2D game builds its
terrain in chunks. A whole zone is up to 860×567 — nearly half a
million tiles — which is far too many to draw at once.
