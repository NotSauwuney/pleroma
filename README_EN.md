# Pléroma — base engine

Turn-based, text-based RPG, fatfur/vore. Inspired by the mechanics of a vore-RPG built in
Twine/SugarCube, rewritten from scratch: **data-driven, no dependencies, no build step**.

## How to Play

Double-click **`index.html`**. It opens in the browser and you're done. No server needed,
nothing to install.

> Data files are `.js` (not `.json`) on purpose: this lets the game load from `file://`
> without CORS issues. They are just as easy to edit as JSON.

## Structure

```
motor/
├── index.html        ← UI + styles (open this)
├── engine/           ← engine split by domain (load in order 01→12)
│   ├── 01_core.js          ← config, stats, global state, events, mini-events
│   ├── 02_body.js          ← body/feedism: composition, BMI, energy, state
│   ├── 03_systems.js       ← eat/digest, time, progression, inventory
│   ├── 04_render.js        ← log + view render, sprites
│   ├── 05_charcreation.js  ← character creation
│   ├── 06_exploration.js   ← overworld + Solace farms
│   ├── 07_screens.js       ← bag, check status, stat allocation
│   ├── 08_town.js          ← shop/inn/schools + forge
│   ├── 09_npcwg.js         ← WG NPC system (observe, feed, bond)
│   ├── 10_magic_quests.js  ← learned spells, school quests, achievements
│   ├── 11_combat.js        ← combat and in-combat magic
│   └── 12_endgame.js       ← death/respawn, saving, menu and startup
├── i18n.js           ← localization layer: t() for UI, L() for content
├── data/
│   ├── species.js    ← playable species (stats) — text in lang/
│   ├── items.js      ← food, drink, potions, weapons, armor — text in lang/
│   ├── enemies.js    ← creatures by biome + encounter pools — text in lang/
│   ├── world.js      ← zones, connections, locations — text in lang/
│   ├── bodies.js     ← weight states + body logic — text in lang/
│   ├── npcs.js       ← NPCs + safe-zone jobs — text in lang/
│   ├── npcWG.js      ← NPCs with WG system (observe, feed, bond) — text in lang/
│   ├── spells.js     ← GD.hechizos + GD.quests + GD.logros — text in lang/
│   ├── miniEventos.js← chained mini-events — text in lang/
│   └── lang/
│       ├── es.js     ← ALL game text: UI + content in Spanish (base language)
│       └── en.js     ← ALL game text: UI + content in English
├── assets/sprites/   ← optional PNGs (enemy/ · npc/ · zone/); see README there
├── LORE.md / LORE_EN.md           ← world bible (world-building)
├── GAMEPLAY.md / GAMEPLAY_EN.md   ← design, play styles, roadmap
├── LANG.md / LANG_EN.md           ← how to add a new language
├── WEAPONS.md / WEAPONS_EN.md     ← weapon progression and paths to legendary
├── CHANGELOG.md      ← version history
├── HANDOFF.md        ← session resume guide
└── README.md / README_EN.md       ← this file
```

## What Is Implemented

- **Multi-language** (Spanish + English by default) with a selector in the top bar; changes
  the screen live and remembers your choice. To add languages: see **LANG_EN.md**.
- Character creation (name, **7 species** + custom with free stats, pronouns,
  height, body coverage)
- Body as a system: fullness, fat, weight, waist, immobility from excess (**19 states**,
  from malnourished and ripped to singularity); body messages with 3 voices (light / fat /
  muscular)
- Eat / digest (fullness becomes weight over time); fasting burns fat toward the minimum
- **13 connected zones** (combat and safe) + **ship voyage** across the Maw Sea toward
  **two endgame islands** (The Sands of Solakh · The Great Canopy), each with its own
  settlement, shop, job, enemies, and boss
- **✦ Secret quest:** the two halves of the **Amulet of Intimidation** (one per island) fuse
  into an amulet that lets you cross the sea without combat
- **37 enemies** with flavor text and individual weight states (30 encounter + 7 bosses)
- **Chained mini-events** with choices and special bosses (also on the islands)
- **Turn-based combat:** attack, devour (3 techniques), **cast spell**, items, flee,
  struggle; enemy AI with vore and special attacks
- **School magic system** (4 schools: Light · Flow · Depths · Fullness), purchasable spells,
  unlockable evolutions and legendaries
- **Chained school quests** that unlock spells; **achievements** by lifetimeStats
- **Forge crafting:** craftable weapons → foreign weapons → **3 secret legendaries**
  (see **WEAPONS_EN.md**); armor in two branches with triple tier 3
- **Death → respawn** (no reset): 5 causes with their own narrative; dying at sea drops
  you at the port with a naval rescue. You lose 50% XP and gold; bag and equipment intact.
- Progression: XP, level, stat points, gold; weapon upgrades up to +10 and armor up to +5
- Shop, inn, smithy, schools, farms with cooking, port with training;
  **WG NPCs** (feed, bond, weight states)
- **Save v2:** 5 slots + export/import file
- **🎮 Cheats** in the topbar: makemerich · makemestronger · makemeweightless ·
  makemeravenous · makemeeternal

## How to Extend (Everything Is Data)

- **New species:** copy a block in `data/species.js`.
- **New enemy:** copy a block in `data/enemies.js` and add it to a biome pool.
  Special fields: `puedeDevorar: true` (can swallow you → death by devouring),
  `tipoDano: "arcano"` (magic attack → death by magic).
- **New zone:** add an entry in `data/world.js` and connect it with `salidas`.
- **New item:** add to `data/items.js` (and to the shop catalog in `engine/08_town.js` if you want to sell it).
- **New spell:** add to `GD.hechizos` in `data/spells.js` and add it to the corresponding
  local catalog in `engine/08_town.js`.
- **New quest:** add to `GD.quests` in `data/spells.js`.
- **New mini-event:** add to `data/miniEventos.js`.
- **New language:** see **LANG_EN.md** (one file in `data/lang/`).

All visible text is translatable: UI via `t("key")` in `data/lang/`, content via
`@@path` references resolved with `L()` — text lives in `data/lang/es.js` / `en.js`.

See **GAMEPLAY_EN.md** §5 for the roadmap of upcoming modules.
