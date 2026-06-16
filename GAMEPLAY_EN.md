# PLÉROMA — Game Design and Play Styles

How the base engine plays today, which archetypes (play styles) are already supported, and the
roadmap to evolve it into a **simplistic turn-based RPG**.

---

## 1. The Core Loop

```
   EXPLORE  ──►  ENCOUNTER  ──►  TURN-BASED COMBAT
      ▲                                  │
      │                                  ▼
   REST / SHOP  ◄──  REWARD: XP · gold · (devour = weight)
                                         │
                                         ▼
                              GROW (level up, get bigger)
                                  ⇅  tension
                          MORE POWER  ↔  LESS MOBILITY
```

The decision the player makes over and over is **managing the mass/mobility edge**.
Eating and devouring make you stronger (weight → sap → effective stats via rewards) but push
you toward **immobility** (`fat + ful·1.2 > STR·16`), which prevents dodging and fleeing. That
trade-off *is* the game. Everything else hangs from it.

---

## 1.5. Metabolism, Weight, and Energy (Body System)

The body is no longer a single number — it now has **two weight categories** calculated differently:

- **Lean mass** (`height²·15 + STR·1.8`) — muscle and build. It "carries itself": tied to height
  and strength, it barely penalizes movement. Raising **STR** increases it.
- **Fat mass** (`fat`) — what you eat and digest. This is what **costs energy** to move and what
  pushes you toward immobility.

**Recomposition:** training STR converts fat into muscle (−5 fat per point). Total weight barely
changes, but it becomes "useful": less dead weight, more strength. Rewards investing in STR.

**Action energy (stamina):** moving in the overworld costs
`4 + (fat above minimum)·0.5 / (1 + (STR+DEX)·0.18)`. High fat + low STR/DEX = costs skyrocket.
When you run out of stamina for another action you are **out of breath** (semi-immobile):
you can only *catch your breath* (rest) or open your bag. One rest is always enough to move
again (anti-softlock cap). Stamina **no longer regenerates on its own** — resting (or drinking
water) is the only recovery.

**Fasting and weight loss:** if you rest or act on an **empty stomach** (`ful < 8`), the body
draws from reserves and **fat slowly drops** toward a minimum (`FAT_FLOOR`).
This is how you *lose weight*. But it has a cost: each action while fasting adds to the
starvation counter, and at **20 empty actions you pass out** (→ hospital). Eating anything
resets the counter. The result: cutting weight is a deliberate act that requires eating
occasionally to avoid collapse. The sidebar warns you as you approach collapse.

> Tunable constants at the top of `engine/01_core.js`: `FAT_FLOOR`, `EMPTY_THRESHOLD`, `MAX_VACIO`,
> `METAB` (fat burned per turn while fasting).

---

## 2. How Turn-Based Combat Works (Already Implemented)

Deliberately simple model, JRPG menu-style:

1. **Initiative:** whoever has higher `DEX + WIT` acts first that turn.
2. **The player chooses an action** from a menu:
   - **⚔ Attack** — damage = `weapon roll + stat·scale − defense`, with damage types (slash/blunt/arcane)
     that have resistances and weaknesses.
   - **🦷 Devour** — *physical win-condition*. Skill test
     (`DEX+STR+STO+40` vs enemy's defense). Available when the enemy is weakened
     (≤50% HP) or when your `STO` clearly exceeds theirs. Success = you swallow them whole:
     combat ends, +weight immediately (you fill up on the spot), +bonus XP.
   - **✦ Feast** — *magical win-condition* (costs mana). Test via `WIT·3+20` vs
     `WIT+END+vitality` of the enemy. **Does not require weakening them:** it's the answer to the
     "immovable mountain" you can't swallow by force. Success = you convert the enemy into a
     **food item** (Feast of X) that you can *eat right there* or *store* — but the magical food
     reserve has a cap (`2 + WIT/3`). Deferred and controlled reward, instead of the immediate mass
     hit of Devour.
   - **🎒 Item** — eat/drink/potion mid-fight (costs the turn).
   - **🏃 Flee** — test of `DEX+WIT`. **Fails automatically if immobile.** (Your weight catches up.)
   - **💪 Struggle** — only if grabbed; reduce the grapple using your best physical stat.
3. **The enemy responds** with minimal AI: attacks; if it's a *devourer* and you're weak, it tries
   to **grab** you and then **swallow** you (game over if it succeeds and you don't escape).
4. HP/status is resolved and returns to the menu, until someone falls.

Skill tests: `prob% = clamp(attacker − defender, min, max)`. Clean, readable, easy to balance.

**Difficulty (anti-mindless-click):** enemies deal ×1.75 damage and have ×1.3 HP (constants
`DIF_DANO` / `DIF_VIDA` in `engine/01_core.js`). You can't win by just trading hits mindlessly:
you need to heal, devour/Feast at the right window, or flee. Combined with the stamina cost of
the overworld, the early game demands real decisions.

---

## 2.5. Death → Wake Up in Town (No Reset)

Falling doesn't erase your save: you get "brought home". Five causes, each with its own narrative:

| Cause | Trigger | Where you wake up |
|---|---|---|
| **Damage** | HP reaches 0 from physical hit | Hospital |
| **Magic** | HP reaches 0 from `arcane` attack (e.g. cultist) | Academy of Magic |
| **Devouring** | A `canDevour` enemy swallows you (failed struggle) | Academy reincarnates you |
| **Overstuffed** | You exceed your fullness capacity by +75% | Food coma → town |
| **Starvation** | 20 actions on empty stomach | Hospital (fed on arrival) |

**Consequences:** −50% XP and −50% gold; bag and equipment intact; you wake up with
HP/mana restored and an empty stomach. **Exception:** starvation doesn't take gold (nobody
robbed you) and the hospital wakes you already fed. All configurable in `die()` / `revive()`.

**Death at sea:** if you fall during the ocean voyage (sea combat or shipboard hunger),
you see the cause of death + rescue by the Solakh military ship, and wake up **at the port**
(not in the Ford), healed and with the starvation counter reset.

**Body state:** low tiers (`malnourished`/`thin`/`lean`) are evaluated by **direct fat**
(fast to the floor = malnourished); high tiers, by BMI. The 3 *ripped* states require fat ≤14
and STR ≥14. Body warnings ("out of breath", "too full", "can't flee") have **3 voices**
depending on your state: light, fat, or muscular.

**Cheats (topbar):** a code screen for testing/free play — `makemerich` (+10k gold),
`makemestronger` (+1 level), and toggles `makemeweightless` / `makemeravenous` /
`makemeeternal` (no stamina cost / no overstuffing death / no starvation or damage death).
Persist in the save file.

---

## 3. Play Styles (Archetypes the Engine ALREADY Supports)

The point-buy stat system produces genuinely different builds. Four play fantasies:

### 🐗 The Colossus (STR / SIZ / END)
You move slow but nothing knocks you down. You tank hits, hit hard with a mace, and devour
the big ones once you've softened them up. You accept immobility as the price of power.
**Ideal species:** Ursaco. **Risk:** you can never flee — every fight is to the death.

### 🦷 The Devourer (STO / STR)
Your plan isn't to kill: it's to *swallow*. You raise STO to open the Devour window earlier
and absorb mass from everything. You grow faster than anyone. Your belly is your weapon.
**Ideal species:** Mursa or Saurian. **Risk:** gorge yourself and get stranded in a hostile zone.

### 🗡 The Duelist (DEX / WIT)
You always hit first, dodge, and flee if things go south. You stay light on purpose.
Fast dagger, hit-and-run. Controlling the rhythm is everything.
**Ideal species:** Lyncar or Vulpor. **Risk:** fragile; one badly read fight kills you.

### ✦ The Sorcerer / Arcane Devourer (WIT + STO)
You burn sap instead of loading it. Your signature is **Feast**: instead of swallowing the
rival with your jaws, you *transmute them into food* with WIT. You solve enemies a physical
build can't devour (high END/SIZ tanks like the Stone Colossus). But beware: creating food is
half the battle — your `STO` decides how much you can *eat* without going immobile, and the
storable reserve has a cap. WIT opens the door; the stomach is still the bottleneck.
**Ideal species:** Lyncar (high WIT) or a Mursa/Saurian (STO) that puts points into WIT.
**Right now:** fully playable (Feast + staff that scales WIT).

> **Design suggestion:** show these four archetypes as "suggested paths" in the stat allocation
> screen, without forcing them. They orient new players without boxing them in.

---

## 4. Progression

- **Level/XP:** killing gives XP; **devouring gives +30% XP** (incentivizes the signature mechanic).
  Leveling up gives 3 stat points and full heal.
- **Weight as a second progression:** parallel to level. Weight doesn't go up with XP but with
  *food and vore*, and feeds STR checks (carry) and immobility. It's a "bar" the player decides
  how far to push.
- **Equipment:** weapons scale with different stats (STR/DEX/WIT), so loot reinforces your build.

---

## 5. Roadmap Toward a More Complete Turn-Based RPG (In Order of Impact)

Each item is a module of **pure data + a little engine work**, no rewrites needed:

1. ✅ **Spell system** — `data/spells.js` + "Cast" action in combat. Implemented:
   4 schools (Light · Flow · Depths · Fullness), base spells + evolutions +
   legendaries, quests that unlock them, achievements by lifetimeStats.
2. **Combat statuses** → poison, stun, "overstuffed" (penalizes overfullness), burn.
   The engine already has the hook (`tempStats`, status). Adds tactical depth to the menu.
3. ✅ **NPCs and dialogue** — `data/npcs.js` with greetings and rotating dialogue. NPCs at inn,
   shop, smithy and all schools; WG system in `data/npcWG.js` for NPCs with weight progression.
4. ✅ **Staged quests** — `GD.quests` in `data/spells.js` with `{progress, completed}` structure.
   Implemented for the schools; town NPCs (Borek/Vella/Durn) don't give quests yet.
5. ✅ **Region bosses** — chained mini-events (`data/miniEventos.js`) with unique bosses
   (banditBoss, highPriest, campMage, archimage) and crafting rewards.
6. ✅ **Non-combat choice encounters** — `data/miniEventos.js`: multi-step events with text
   options, gamebook-style.
7. **Origin/background system** → modifies starting stats and unlocks dialogues. Gives identity
   to the blank-slate protagonist.

---

## 6. Balance Philosophy (Keeping It "Simple but Meaningful")

- **Few stats that matter a lot.** Six axes, each with a clear and readable role.
- **One dominant decision per turn.** The menu should never have 9 options; 4–5 good ones.
- **Trade-off over number.** What's memorable isn't "+3 damage", it's "do I eat now and get
  slow, or hold the hunger and stay agile?". Protect that tension above all else.
- **Devouring must always be a choice with a cost,** not the obvious option. That's why it
  requires a window (weak enemy / high STO) and fills you up (risk of immobility). If it's
  ever free, the game breaks.
