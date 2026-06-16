# Pléroma — Translator's Guide

Complete guide to creating a new language or editing existing text.
Spanish is the canonical voice of the project. English is the second fallback language.

> **Important update:** now **ALL game text lives in a single file per language**
> (`data/lang/<code>.js`). The `data/*.js` files **no longer contain text**: only logic
> and content *references*. Translating the entire game = editing one file.

---

## How the Text Is Organized

A language file `data/lang/<code>.js` defines **two tables**:

| Table | What it contains | Read with |
|---|---|---|
| `GD.i18n.<code>` | **UI**: buttons, labels, log messages, menus, death screens | `t("key")` |
| `GD.content.<code>` | **CONTENT**: names and descriptions of species, items, enemies, zones, NPCs, events, body states… | `L("@@ref")` |

The `data/*.js` files (enemies, items, world, npcs, npcWG, bodies, species, spells, miniEventos)
only store **logic** (stats, prices, mechanics) and, where text used to be, a
**reference** in the format `"@@path.to.data"`. For example:

```js
// data/enemies.js  (logic + reference, NO text)
fatRabbit: {
  id: "fatRabbit",
  nombre: "@@enemies.fatRabbit.nombre",
  stats: [2, 6, 2, 3, 4, 3], vidaMax: 22, ...
  flavor: {
    encuentro: "@@enemies.fatRabbit.flavor.encuentro",
    ataque: ["@@enemies.fatRabbit.flavor.ataque.0", "@@enemies.fatRabbit.flavor.ataque.1"],
  },
},
```

```js
// data/lang/en.js  (text lives here)
GD.content.en = {
  "enemies.fatRabbit.nombre": "Rabbit",
  "enemies.fatRabbit.flavor.encuentro": "A field rabbit rises on its hind legs and sizes you up.",
  "enemies.fatRabbit.flavor.ataque.0": "The rabbit headbutts you, surprisingly solid.",
  ...
};
```

The engine resolves `L("@@enemies.fatRabbit.nombre")` by looking up that key in
`GD.content[active language]`, with fallback to **English** and then **Spanish**. If a key is
missing, the raw reference (`@@…`) is displayed so you can catch it easily.

**Never touch the `@@…` references in the `data/*.js` files.** They are pointers, not text.

---

## PART A — Creating a New Language (One File)

### 1. Copy `data/lang/en.js`

This is the complete template: it contains the UI table (`GD.i18n.en`) **and** the content table
(`GD.content.en`) with all ~900 translatable keys. Watch for UI keys with body-state variant
suffixes (`sb.semiImmobile.bajo` / `.alto` / `.ripped`, etc.): the suffix is part of the key
and is not translated. Duplicate it and rename it with the **ISO 639-1 code** of your language:
`fr`, `de`, `pt`, `ja`, etc. Example: `data/lang/fr.js`.

### 2. Change the Header of Each Table

```js
GD.i18n.en = {            →   GD.i18n.fr = {
  _langName: "English",   →     _langName: "Français",
...
GD.content.en = {         →   GD.content.fr = {
```

- The code (`fr`) must match in **both tables** and in the file name.
- `_langName` is the name the player sees in the language selector.

### 3. Translate the Values, Not the Keys

Each line is `"key": "text"`. **The key (left side) is never touched.** You only change the
text on the right, both in `GD.i18n.fr` (UI) and `GD.content.fr` (content).

### 4. Load Your Language — Two Ways

**a) Hot-load, without touching the game (recommended for testing):**
In the top bar, next to the language selector, there is a **`＋`** button. Click it,
choose your `.js` file, and if it's well-formed your language appears instantly in the selector
and becomes active **for that session**. (It is not saved to disk — it's for testing and sharing.)

**b) Permanent, by registering it in `index.html`:**
Add a line next to the others, **before** `i18n.js`:

```html
<script src="data/lang/es.js"></script>
<script src="data/lang/en.js"></script>
<script src="data/lang/fr.js"></script>   <!-- new -->
<script src="i18n.js"></script>
```

The language will appear in the selector automatically.

---

## Rules You Cannot Break

### 1. Keys Are Never Translated
`"cb.attack"` and `"enemies.fatRabbit.nombre"` stay the same. Only the right side changes.

### 2. `{placeholders}` Are Preserved As-Is
The game injects values at runtime. If you rename them, they appear blank:

```js
"log.foundGold": "You find {n} gold in the brush.",
"log.foundGold": "Tu trouves {n} pièces d'or.",      // ✔ {n} intact
"log.foundGold": "Tu trouves {nombre} pièces...",     // ✗ {nombre} DOES NOT exist
```

### 3. Pronoun Tokens `{PronS}` `{PronO}` `{PronP}` Are Also Preserved
They appear in some content texts (events, etc.) and the engine replaces them with the
character's pronouns. Move them if grammar requires it, but don't change the name.

| Token | Replaces | Example (player uses "they/them/their") |
|---|---|---|
| `{PronS}` | Subject pronoun | "**they** know what they're doing" |
| `{PronO}` | Object pronoun | "nobody looks at **them**" |
| `{PronP}` | Possessive pronoun | "**their** bag" |

### 4. HTML Inside Text Is Part of the Text
Tags like `<b>`, `<i>` are decorative: copy them as-is.

### 5. An Incomplete Translation Does Not Break the Game
If you leave a key untranslated (or delete it), the engine falls back to **English** and then
**Spanish**. You can translate incrementally: start with the most visible UI, then the content.

### 6. Emojis and Symbols Are Optional
`⚔ 🦷 ✦ 💤` — keep them or change them, they don't affect functionality.

---

## Content Key Structure

The keys in `GD.content` follow the data path inside the `data/*.js` files:

| Prefix | Source |
|---|---|
| `species.<id>.nombre` / `.descripcion` | `data/species.js` |
| `items.<id>.nombre` / `.sabor` / `.texto` | `data/items.js` |
| `enemies.<id>.nombre` · `enemies.<id>.flavor.encuentro` · `…flavor.ataque.<n>` · `…flavor.cuerpo.<weight>` | `data/enemies.js` |
| `world.zonas.<id>.nombre` / `.descripcion.<n>` / `.salidas.<n>.texto` / `.eventos.<n>` | `data/world.js` |
| `npcs.<id>.nombre` / `.saludo.<n>` / `.dialogos.<n>` · `trabajos.<id>.desc` | `data/npcs.js` |
| `npcWG.<id>.estados.<n>.label` / `.desc` · `.bondNames.<n>` · `.feedFlavor.<n>` · `.avanceFlavor.<n>` | `data/npcWG.js` |
| `pesos.<id>.label` / `.desc` · `estadosJugador.<id>.label` / `.desc` | `data/bodies.js` |
| `hechizos.<id>.nombre` / `.desc` · `quests.<id>.nombre` / `.desc` | `data/spells.js` |
| `miniEventos.<id>.intro` / `.opcionEntrar` / `.pasos.<n>.texto` / `.textoFin` | `data/miniEventos.js` |

Keys with `.<n>` (a number) are **variants**: the game picks one at random each time. If you
want more variety you can add variants, but then you must also add the corresponding reference
in the `data/*.js` file. For translating only, changing the text is enough.

---

## Testing Your Language

1. Open `index.html`.
2. Load your language with the **`＋`** button (or register it in `index.html`).
3. Select it in the selector. The screen redraws instantly.
4. Do you see a raw key like `@@enemies.lobo.nombre` or `ex.escuelaBl` on screen? That line is
   missing from your file. They are displayed literally **on purpose**, so you can catch them easily.

The chosen language is remembered between sessions (for those registered in `index.html`).

---

## Checklist for a Complete Translation

### UI (`GD.i18n.<code>`)
- [ ] Copied `en.js`, changed the code and `_langName` in **both** tables
- [ ] Translated all blocks: topbar, menu, creation, bars, stats, exploration,
      bag, shop, upgrades, combat, devour, Feast, victory, death, magic, quests,
      forge, farms, WG system, locals
- [ ] No raw keys (`raw.key`) visible in the game

### Content (`GD.content.<code>`)
- [ ] Species, items, enemies (name + flavor + body), zones (name/description/exits/events)
- [ ] NPCs (name/greeting/dialogues), jobs, WG-system NPCs (states, bonds, reactions)
- [ ] Body states (enemies and player), spells, quests, mini-events
- [ ] No raw references (`@@…`) visible in the game

### Tokens
- [ ] UI `{placeholders}` intact · `{PronS}`/`{PronO}`/`{PronP}` tokens with correct equivalents

---

## Tone Notes (for Content)

The game has a very specific voice. If you're translating content, keep in mind:

- **Matter-of-fact.** Bodies are reported, not editorialized.
- **Direct.** No clinical euphemisms, no squeamishness. Gut, rolls, fat, mass.
- **Enjoys the body, doesn't judge it.** The text is indulgent, not clinical.
- **2nd person for the player** ("your gut", "it costs you", "you are").
- **3rd person species-neutral for enemies** — don't assume fur or scales; use
  "body", "flesh", "mass".
- **Events are observations**, not drama. Brief, concrete, with texture.
