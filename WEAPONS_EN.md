# PLÉROMA — Weapon Progression

Complete map of the game's weapons, their upgrades, and **the three paths that lead to
legendary**. Source of truth: `data/items.js` (`GD.items` + `GD.recetas`) and the forge
at Durn's Forge (`engine/08_town.js` / `engine/09_npcwg.js`).

## General Rules

- **Smithy upgrade:** any upgradable weapon goes up to **+10** by paying gold
  (`upgradeCost = (20 + price·0.3) · (level+1)`). Each level adds `upgradeRate` % damage
  (4–7% depending on the weapon).
- **Forge:** combines world materials (drops + foraging) into new weapons. Foreign and legendary
  recipes also **consume the base weapon** (its upgrade level is lost: the new weapon starts at +0).
- **Legendaries:** cannot be upgraded (`upgradable: false`) — they are born complete, with a
  **unique weapon effect**. Their recipes are `secret: true`: they only appear in the forge when
  you already have the required base weapon at the required level.

> ⚠ **Fix v1.0.5:** legendary recipes previously required the foreign weapon at **+14**, but
> upgrades cap at **+10** — they were unreachable. They now require **+10** (the actual maximum).

## Tier 0 — Starting Gear and Shop

| Weapon | Damage | Stat | Type | Origin | Path to Legendary? |
|---|---|---|---|---|---|
| Bare claws | 1d4 | STR | — | starting | No (not upgradable) |
| Curved dagger | 2d4 | DEX | slash | Shop (25 gold) | No — dead branch |
| Iron mace | 2d6 | STR | blunt | Shop (40 gold) | No — dead branch |
| Runic staff | 1d6 | WIT | arcane | Shop (50 gold) | No — dead branch |

## Tier 1 — Smithy (Purchase)

| Weapon | Damage | Stat | Type | Price | Path to Legendary? |
|---|---|---|---|---|---|
| Greatsword | 3d6 | STR | slash | 120 | No — dead branch |
| Rapier | 3d5 | DEX | slash | 110 | No — dead branch |
| Arcane scepter | 2d8 | WIT | arcane | 140 | No — dead branch |

Shop/smithy weapons are mid-game bridges: they hit hard at +10, but **none of them evolve**.
To reach legendary you must go through the craftable weapons.

## Tier 2 — Forge (Craftable with Local Materials)

| Weapon | Damage | Stat | Type | Materials | Evolves? |
|---|---|---|---|---|---|
| **Gnarled club** | 3d6 | STR | blunt | Bear claw ×2 · Wolf fang | ✅ → Tidal Maul |
| **Swamp staff** | 2d9 | WIT | arcane | Swamp slime ×2 · Hydra scale | ✅ → Primordial Staff |
| **Field lance** | 3d7 | DEX | slash | Boar tusk ×2 · Bull horn | ✅ → Exile's Edge |
| Colossus mace | 4d7 | STR | blunt | Colossus fragment ×2 · Bear claw | ❌ dead branch (strong sidegrade) |
| Frost blade | 3d8 | DEX | slash | Giant's frost ×2 · Puma claw | ❌ dead branch (strong sidegrade) |

## Tier 3 — Foreign Weapons (Materials from Maritime Zones)

Require the base craftable weapon at **+10** (consumed) + materials from the ocean/islands.

| Weapon | Damage | Stat | Type | Requires | Materials |
|---|---|---|---|---|---|
| **Tidal Maul** | 5d7 | STR | blunt | Gnarled club +10 | Salted Tentacle ×2 · Abyssal Scale |
| **Exile's Edge** | 4d9 | DEX | slash | Field lance +10 | Scorpion Venom ×2 · Heat Scale |
| **Primordial Staff** | 3d11 | WIT | arcane | Swamp staff +10 | Ancient Sap ×2 · Giant Spore |

## Tier 4 — Legendaries (Secret Recipes)

Require the foreign weapon at **+10** (consumed) + a **boss material** + rare materials.

| Legendary | Damage | Stat | Unique Effect | Requires | Materials (boss in bold) |
|---|---|---|---|---|---|
| ✦ **Leviathan** | 5d7 ·sc 1.0 | STR | **Earthquake** — 20% chance to stun enemy per turn | Tidal Maul +10 | **Titan's Core** (Titan Marine, ocean) · Colossus fragment · Forest essence (Bandit captain) |
| ✦ **Swift shadow** | 4d8 ·sc 1.0 | DEX (+0.3·WIT) | **Shadow** — also scales with WIT | Exile's Edge +10 | **Sandy Core** (Sand Worm, The Sands of Solakh) · Puma claw · Swamp core (Hollow high priest) |
| ✦ **Eternal void** | 3d10 ·sc 1.1 | WIT | **Mana Regeneration** — +1 mana per hit | Primordial Staff +10 | **Heart of the Forest** (Canopy Guardian, The Great Canopy) · Frost crystal (Black frost archmage) · Swamp core |

## The Three Complete Paths

```
STR  Gnarled club ──(+10)──► Tidal Maul ──────(+10 + Titan's Core)──────► ✦ LEVIATHAN
DEX  Field lance  ──(+10)──► Exile's Edge ────(+10 + Sandy Core)─────────► ✦ SWIFT SHADOW
WIT  Swamp staff  ──(+10)──► Primordial Staff ─(+10 + Heart of the Forest)──► ✦ ETERNAL VOID
```

Where each boss material drops:

- **Titan's Core** — Titan Marine: 10% of encounters during the ship voyage
  (guaranteed drop on defeat).
- **Sandy Core** — Sand Worm: boss of the *Sunken Temple of Solakh* mini-event
  (The Sands of Solakh). Guaranteed drop.
- **Heart of the Forest** — Canopy Guardian: boss of the *Heart of the Canopy* mini-event
  (The Great Canopy). Guaranteed drop.
- **Forest essence / Swamp core / Frost crystal** — bosses of the continent's
  mini-events (Bandit captain / Hollow high priest / Black frost archmage). Guaranteed drop.

## Dead Branches Summary (By Design)

Curved dagger, Iron mace, Runic staff, Greatsword, Rapier, Arcane scepter, Colossus mace,
and Frost blade **do not evolve**: they are power bridges or sidegrades. If your goal is a
legendary, invest your upgrades in the Gnarled club, Field lance, or Swamp staff matching your
build — the upgrade gold spent on weapons consumed by the forge is not recovered.
