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

That is the whole list. There is no combat, no menus, no inventory,
no saving, no enemies, no other people. Adding any of those before
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

## What it does not do yet, on purpose

- **No ceiling on the dungeons.** You can see out over the walls.
- **Houses look wrong.** In the 2D map a house is drawn top-down: a
  band of roof, then a band of front wall, side by side. In 3D that
  becomes two blocks next to each other instead of a roof sitting on
  top of walls. Buildings would need real shapes, not tiles.
- **Nothing is alive.** No enemies, no townspeople, no animals.
- **No phone controls.** Keyboard and mouse only.

## The numbers, measured

Measured in Chrome on this Mac, on 15 September 2026:

| | |
|---|---|
| Frame rate | 120 per second (as fast as the screen refreshes) |
| Building one outdoor zone | 180–300 milliseconds |
| Ground tiles drawn at once | 32.761 |
| Trees, rocks and walls drawn at once | 4.500–16.600 |
| Zones tried | 6 outdoor, 1 city, 1 dungeon — all loaded, no errors |

The world is built in a square about 90 tiles around you and built
again as you walk out of it, the same way the 2D game builds its
terrain in chunks. A whole zone is up to 860×567 — nearly half a
million tiles — which is far too many to draw at once.
