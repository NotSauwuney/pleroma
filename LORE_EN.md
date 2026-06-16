# PLÉROMA — World Bible (v0.1)

> *Pléroma* (gr. πλήρωμα): "fullness, that which fills." The name is not a coincidence.

Living world-building document. The engine (`engine/` + `data/`) already implements the
mechanics; this is the **fiction that justifies them** and the ground for expansion. Nothing
here is set in stone: it's the first brick.

---

## 1. The Cosmological Premise: Mass Is Mana

In Pléroma, living matter is not neutral. Every body accumulates **sap** — a dense magical
substance that concentrates in fat, in weight, in what a body holds. The more mass a creature
carries, the more sap it contains, and sap **is** power: strength, heat, resilience, raw magic.

From this comes the world's fundamental law, known by all and disputed by none:

> **You are what you eat. What you devour, you become.**

Eating is not just survival: it is *growing in the literal and magical sense*. A large body
is a rich body. This is why in Pléroma fatness is not hidden or punished — it is displayed as
one would display a fortune or a battle scar.

**The central tension** (and the heart of the game): sap has weight. A body full of power is
a slow body. Gorging yourself makes you powerful and nearly immobile at once. The art of living
in Pléroma is managing that edge: eat enough to be formidable, not so much that you become
stranded and at the mercy of something hungrier than you.

---

## 2. Devouring (The Sacred Institution)

Eating plants and common meat transfers sap slowly. But there is a faster path, ancient and
ritually charged: **swallowing another creature whole and alive**, absorbing its sap all at once.

Devouring is not seen as murder but as **inheritance**. The devoured creature "passes on" its
sap, its size, and part of its essence to the one who swallows it. In popular theology, being
devoured by someone worthy is a form of transcendence: *you keep existing, now as someone
else's weight*. ("You are now part of the interior landscape of another creature" — the game
over is not a sad ending in the lore, it's a conversion.)

Three cultural stances on Devouring define the world's **factions**:

| Faction | Stance | Gameplay Hook |
|---|---|---|
| **The Plentiful** | Devouring is sacred destiny. They eat without limit, venerate the colossal. | Give quests to "reach X weight", sell feasts, idolize large players. |
| **The Lightborn** | Repudiate excess. They cultivate agility and self-control; they see immobility as a living death. | Stealth/speed quests, reward staying mobile, distrust fat players. |
| **The Hollow Cabal** | Cultists of infinite hunger. They devour for the sake of devouring, even their own. Antagonists. | Dangerous vore bosses, the `glutton` is their lesser creature, the game-over threat. |

---

## 3. Geography (Biomes as Sap Regions)

The world is ordered by **sap density**, which grows as you move away from civilized towns
toward the wild. Each biome in the engine (`data/world.js`) is a band of that scale:

- **Solace Ford** (`vado`) — starting point. Inn, shop, smithy. Land of the moderate Plentiful.
  Nobody judges the size of your plate here.
- **Solace Farms** (`granjas`) — fields north of town. No combat; fieldwork and foraging for
  fresh ingredients.
- **Forest Path** (`senda`) — low sap, small and fattened fauna (rabbits, wolves, bandits,
  bears). Learning zone.
- **Glutton's Clearing** (`claro`) — thick, sweet sap. Habitat of gluttons, cultists, toads
  and hydras. First territory where *you* can be the prey.
- **The Ancient's Cave** (`cueva_vadak`) — chamber at the back of the clearing. Seat of the
  **Tradition of Fullness**: the elder Vadak teaches the techniques of Devouring as sacred art.
- **Open Plain** (`llano`) — fat game (boars, rams, bulls), roads with bandits. Medium sap.
- **Hills of Surfeit** (`colina`) — high sap, large animals (boars, colossi, bears). Weight
  is felt here: the bag, the legs, the destination.
- **Frost Pass** (`paso_norte`) — high mountain. Pumas and giants; the most dangerous
  territory in the known world.
- **La Confluencia** (`confluencia`) — crossroads node in the mountain. Seat of the **School
  of Light** (master Síriel) and the **School of Flow** (master Kor).
- **School of the Depths** (`catacumba`) — depths below La Confluencia. Seat of the **School of the
  Depths** (archimage Vexara).
- **Port of Solace** (`puerto`) — the edge of the known world. A single boat, a boatman who knows
  too much, and coastal training (rowing, sails, sounding, nets).
- **Solace Shore** (`playa`) — combat coast: eels, sharks, armored crabs, arcane squids.
- **The Maw Sea** (ocean, ship voyage) — 30 turns of water with no promises.
  Rays, octopuses, jellyfish, sea serpents… and the **Titan Marine**, so fat that the water
  curves around it.

### 3.5. The Far Lands (The Two Islands)

On the other side of the Maw Sea lie two landmasses that the people of Solace know mostly
through rumor. Both are, literally, **corpses of Colossi** — see §II of History (the Age of
Colossi): in Pléroma, geography is what remains of the largest bodies that ever existed.

- **The Sands of Solakh** (`arenales_solakh`, desert) — the body of **Solakh, the Serpent
  Who Devoured the Sun**. A Colossus who grew by swallowing heat and light until the Great
  Famine left nothing left to swallow: she collapsed and her endless coils became dunes. That
  is why the sand never cools. Inland rules the **Kingdom of Solakh** (its navy patrols the
  Maw Sea and rescues shipwrecked sailors at no charge — the contempt is free); on the
  coast stands the **Caravan Post** (Nyssa), last heir to the pre-Famine trade routes. The
  **Sunken Temple** that the wind buries and unearths holds the **Solar Half of the Amulet**,
  guarded by the **Sand Worm** — a colossal scavenger that has spent generations fattening
  inside the Serpent's body.
- **The Great Canopy** (`gran_manto`, megaflora) — the body of **Vethra, the Rooted**. The
  only Colossus who saw the Famine coming and chose the unthinkable: to stop eating and take
  root, converting its mass into forest. The entire Canopy is Vethra, still alive in its own
  way — the heartbeat beneath the moss is hers. The **Canopy Guardian** is her immune system
  made of roots, and guards the **Root Half of the Amulet**, embedded in her heart-tree.
  At the roots of the coast lives **Yaro** (the **Root Nest**), from a lineage of foragers
  who only take what the Canopy sheds.

> **The Amulet of Intimidation** (secret quest): a disk split in two during the end of the
> Age of Colossi. Each half carries the *presence* of its Colossus — sun and root. Together,
> the bearer smells of something too old and too large to bite: the creatures of the Sea of
> Maws let the ship pass without a fight. The halves drop from the bosses of each island's
> mini-events and fuse automatically when brought together.

**For expansion:** cities of each faction, a Plentiful capital (feast market), a Lightborn
monastery (mobility stat training), the Hollow Cabal's pits (vore endgame dungeon), the inland
capital of the Kingdom of Solakh, the upper reaches of the Great Canopy (what lives above the
mist?), a Devouring Altar where you ritually advance in "rank".

---

## 4. Species (Existing Ones + How to Read Them)

Each species is a **sap inclination**, not a destiny. Their base stats
(`data/species.js`) tell a story:

- **Vulpor** (fox) — agile glutton. High STO, high DEX. Eats a lot and fast, but fragile.
- **Ursaco** (bear) — the mountain. Brutal STR/SIZ/END, minimal DEX. A tank that bears the weight.
- **Mursa** (rodent) — bottomless stomach. Very high STO: the pure devourer, built for vore.
- **Lyncar** (feline) — duelist. High DEX/WIT: wins initiative, dodges, controls the rhythm.
- **Saurian** (reptile) — wide jaws. High STO/SIZ, slow blood: designed to swallow whole.
- **Corvax** (corvid) — born mage. High WIT, light frame and a modest appetite: cunning over mass.
- **Leontaur** (lion-centaur) — four-legged hauler. High STR/SIZ/STO/END: carries more, eats
  double, barely tires; gentle, but its rarity paints a target on it.

**For expansion:** marine species (orca, shark — massive SIZ), avian species (light, anti-vore),
faction hybrids. Each new species is just a block in `species.js`.

---

## 5. Magic (Hook for the Spell System)

Sap can be *burned* instead of loaded: that's where magic comes from. Three schools, anchored to WIT:

- **White** — healing, controlled satiation (converts sap into HP without gaining weight).
- **Grey** — utility: accelerating digestion, temporarily lightening the body, stealth.
- **Black** — arcane damage, draining sap from others at range (magical vore without swallowing).

The engine has `mana`, a `staff` weapon (scales with WIT), and a complete school magic system
(`data/spells.js`). The three lore schools are implemented, plus a fourth:

> **School of Light** (white, La Confluencia) — healing and shields. Master Síriel guards it.
> Spells: Heal · Greater Heal · Light Shield · Greater Light Shield.
>
> **School of Flow** (grey, La Confluencia) — damage and debuffs. Master Kor leads it.
> Spells: Elemental Burst · Elemental Storm · Slow · Flow Paralysis.
>
> **School of the Depths** (black, in the depths below La Confluencia) — drain and corruption. Archimage Vexara presides.
> Spells: Drain · Grand Drain · Entropy · Total Entropy · **Feast**.
>
> **Tradition of Fullness** (legendary, The Ancient's Cave) — techniques of Devouring as sacred art.
> Not taught in a school: unlocked through quests and achievements. The elder Vadak acts as
> guide. Spells: Feast · Absorption · Levitation of Fullness.

> **Feast** — the magical counterpart of Devouring. Feast uses cunning to *fold the enemy into
> food* regardless of how strong they are: it doesn't swallow them, it **transmutes** them.
> The sap is condensed into a feast you can eat or store — the reserve scales with WIT. In
> popular theology, Feast is controversial: the Plentiful see it as a cheat of the sacred
> ritual; the Lightborn, ironically, tolerate it more, because it doesn't require becoming a
> colossus.

---

## 6. The Protagonist (Intentional Blank Canvas)

The player has no fixed biography: you choose a species, distribute stats, pick a name. The lore
gives you a **drive** without binding you: you arrived at the Ford "with an old hunger and a
fixed idea of becoming big." Why — revenge, gluttony, ambition for power, ritual transcendence —
you decide in your head, or we define it with an origin/background system later.

---

## 7. Planted Narrative Hooks (For Future Quests)

- **Immobility as crisis:** a quest where you eat so much for a boss that you get stranded and
  must survive/digest before you can move again.
- **The Convert:** a Lightborn NPC who gradually tries Devouring and transforms.
- **The sleeping colossus:** a creature so full of sap it hasn't moved in centuries; an endgame
  objective (devour it? free it? become it?).
- **Sap market:** an economy where weight can be "sold" (ritually digested for gold) — already
  seeded in the `digestive` item.
- **The Kingdom of Solakh:** a crown that lives on the corpse of a serpent goddess and knows it.
  What happens when the Sand Worm grows larger than the memory of Solakh?
- **Vethra dreams:** the Great Canopy is alive. If a Colossus can become a forest, can a
  forest become a Colossus again?

---

*Suggested next step: choose ONE new region or ONE faction and deepen it — write its NPCs,
its shop, its 3–4 quests, its enemies. The engine already supports all of that as pure data.*
