# Card icons

Drop real game icons here as **PNG** (square, transparent background works best).
Each card automatically uses `assets/icons/<slug>.png` if it exists, and falls back
to an emoji if it doesn't — so you can add them a few at a time with **no code changes**.

Filenames must match these slugs exactly:

## Cannons
- single-rapid-fire.png
- shotgun.png
- lucky-shot.png
- big-bertha.png
- double-shot.png
- triple-shot.png
- sniper.png
- flamethrower.png
- railshot.png
- golden.png
- plasma.png
- freeze.png

## Mobs
- normie.png
- paper-bag.png
- soldier.png
- bat.png
- raccoon.png
- ninja.png
- alien.png
- chicken.png
- knight.png
- bear.png
- caveman.png

## Champions
- optimus-prime.png
- bumblebee.png
- nexus.png
- sirion.png
- big-blob.png
- explodon.png
- great-normie.png
- megatron.png
- starscream.png

## Ultimates
- mass-abduct.png
- mob-copter.png
- rocket-barrage.png
- summon-gate.png
- rainbow-rage.png
- ufo-laser.png

(The slug rule: lowercase, drop anything in parentheses, replace non-alphanumeric
runs with a single hyphen. See `slugify()` in `app.js`.)
