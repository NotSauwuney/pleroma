# Pléroma — Guía del traductor

Guía completa para crear un idioma nuevo o editar los textos existentes.
El español es la voz canónica del proyecto. El inglés es la segunda lengua de respaldo.

> **Novedad importante:** ahora **TODO el texto del juego vive en UN solo archivo por
> idioma** (`data/lang/<código>.js`). Los archivos de `data/*.js` ya **no contienen texto**:
> solo lógica y *referencias* de contenido. Traducir el juego entero = editar un archivo.

---

## Cómo está organizado el texto

Un archivo de idioma `data/lang/<código>.js` define **dos tablas**:

| Tabla | Qué contiene | Se lee con |
|---|---|---|
| `GD.i18n.<código>` | **UI**: botones, etiquetas, mensajes del log, menús, muertes | `t("clave")` |
| `GD.content.<código>` | **CONTENIDO**: nombres y descripciones de especies, ítems, enemigos, zonas, NPCs, eventos, estados de cuerpo… | `L("@@ref")` |

Los `data/*.js` (enemies, items, world, npcs, npcWG, bodies, species, spells, miniEventos)
solo guardan **lógica** (stats, precios, mecánicas) y, donde antes había texto, una
**referencia** con el formato `"@@ruta.del.dato"`. Por ejemplo:

```js
// data/enemies.js  (lógica + referencia, SIN texto)
conejoGordo: {
  id: "conejoGordo",
  nombre: "@@enemies.conejoGordo.nombre",
  stats: [2, 6, 2, 3, 4, 3], vidaMax: 22, ...
  flavor: {
    encuentro: "@@enemies.conejoGordo.flavor.encuentro",
    ataque: ["@@enemies.conejoGordo.flavor.ataque.0", "@@enemies.conejoGordo.flavor.ataque.1"],
  },
},
```

```js
// data/lang/es.js  (el texto vive acá)
GD.content.es = {
  "enemies.conejoGordo.nombre": "Conejo",
  "enemies.conejoGordo.flavor.encuentro": "Un conejo de campo se yergue sobre las patas traseras y te mide.",
  "enemies.conejoGordo.flavor.ataque.0": "El conejo embiste con la cabeza, sorprendentemente firme.",
  ...
};
```

El motor resuelve `L("@@enemies.conejoGordo.nombre")` buscando esa clave en
`GD.content[idioma activo]`, con respaldo a **inglés** y después a **español**. Si una clave
falta, se muestra la referencia cruda (`@@…`) para que la caces fácil.

**Nunca toques las referencias `@@…` de los `data/*.js`.** Son punteros, no texto.

---

## PARTE A — Crear un idioma nuevo (un solo archivo)

### 1. Copiá `data/lang/en.js`

Es la plantilla completa: trae la tabla de UI (`GD.i18n.en`) **y** la tabla de contenido
(`GD.content.en`) con las ~900 claves traducibles. Ojo con las claves de UI con sufijo de
variante corporal (`sb.semiImmobile.bajo` / `.alto` / `.ripped`, etc.): el sufijo es parte
de la clave y no se traduce. Duplicalo y renombralo con el **código
ISO 639-1** de tu idioma: `fr`, `de`, `pt`, `ja`, etc. Ejemplo: `data/lang/fr.js`.

### 2. Cambiá la cabecera de cada tabla

```js
GD.i18n.en = {            →   GD.i18n.fr = {
  _langName: "English",   →     _langName: "Français",
...
GD.content.en = {         →   GD.content.fr = {
```

- El código (`fr`) debe coincidir en **las dos tablas** y con el nombre del archivo.
- `_langName` es el nombre que ve el jugador en el selector.

### 3. Traducí los valores, no las claves

Cada línea es `"clave": "texto"`. **La clave (izquierda) nunca se toca.** Solo cambiás el
texto de la derecha, tanto en `GD.i18n.fr` (UI) como en `GD.content.fr` (contenido).

### 4. Cargá tu idioma — dos formas

**a) En caliente, sin tocar el juego (recomendado para probar):**
En la barra superior, al lado del selector de idioma, está el botón **`＋`**. Hacé clic,
elegí tu archivo `.js`, y si está bien formado tu idioma aparece al instante en el selector
y queda activo **durante esa sesión**. (No se guarda en disco: es para probar y compartir.)

**b) Permanente, registrándolo en `index.html`:**
Agregá una línea junto a las otras, **antes** de `i18n.js`:

```html
<script src="data/lang/es.js"></script>
<script src="data/lang/en.js"></script>
<script src="data/lang/fr.js"></script>   <!-- nuevo -->
<script src="i18n.js"></script>
```

El idioma aparece en el selector automáticamente.

---

## Reglas que no podés romper

### 1. Las claves nunca se traducen
`"cb.attack"` y `"enemies.conejoGordo.nombre"` se quedan igual. Solo cambia el lado derecho.

### 2. Los `{huecos}` se conservan tal cual
El juego inyecta valores en tiempo real. Si los renombrás, se muestran en blanco:

```js
"log.foundGold": "You find {n} gold in the brush.",
"log.foundGold": "Tu trouves {n} pièces d'or.",      // ✔ {n} intacto
"log.foundGold": "Tu trouves {nombre} pièces...",     // ✗ {nombre} NO existe
```

### 3. Los tokens de pronombre `{PronS}` `{PronO}` `{PronP}` también se conservan
Aparecen en algunos textos de contenido (eventos, etc.) y el motor los reemplaza con los
pronombres del personaje. Movelos si la gramática lo pide, pero no cambies el nombre.

| Token | Reemplaza | Ej. (jugador usa "elle/le/su") |
|---|---|---|
| `{PronS}` | Pronombre sujeto | "**elle** sabe lo que hace" |
| `{PronO}` | Pronombre objeto | "nadie mira a **le**" |
| `{PronP}` | Pronombre posesivo | "**su** mochila" |

### 4. El HTML adentro es parte del texto
Etiquetas como `<b>`, `<i>` son decorativas: copialas como están.

### 5. Una traducción incompleta no rompe el juego
Si dejás una clave sin traducir (o la borrás), el motor cae a **inglés** y después a
**español**. Podés traducir de a poco: primero la UI más visible, después el contenido.

### 6. Emojis y símbolos son opcionales
`⚔ 🦷 ✦ 💤` — dejalos o cambialos, no afectan la funcionalidad.

---

## Estructura de las claves de contenido

Las claves de `GD.content` siguen la ruta del dato dentro de los `data/*.js`:

| Prefijo | De dónde sale |
|---|---|
| `species.<id>.nombre` / `.descripcion` | `data/species.js` |
| `items.<id>.nombre` / `.sabor` / `.texto` | `data/items.js` |
| `enemies.<id>.nombre` · `enemies.<id>.flavor.encuentro` · `…flavor.ataque.<n>` · `…flavor.cuerpo.<peso>` | `data/enemies.js` |
| `world.zonas.<id>.nombre` / `.descripcion.<n>` / `.salidas.<n>.texto` / `.eventos.<n>` | `data/world.js` |
| `npcs.<id>.nombre` / `.saludo.<n>` / `.dialogos.<n>` · `trabajos.<id>.desc` | `data/npcs.js` |
| `npcWG.<id>.estados.<n>.label` / `.desc` · `.bondNames.<n>` · `.feedFlavor.<n>` · `.avanceFlavor.<n>` | `data/npcWG.js` |
| `pesos.<id>.label` / `.desc` · `estadosJugador.<id>.label` / `.desc` | `data/bodies.js` |
| `hechizos.<id>.nombre` / `.desc` · `quests.<id>.nombre` / `.desc` | `data/spells.js` |
| `miniEventos.<id>.intro` / `.opcionEntrar` / `.pasos.<n>.texto` / `.textoFin` | `data/miniEventos.js` |

Las claves con `.<n>` (un número) son **variantes**: el juego elige una al azar cada vez. Si
querés más variedad podés sumar variantes, pero entonces también tenés que sumar la referencia
correspondiente en el `data/*.js`. Para solo traducir, alcanza con cambiar el texto.

---

## Probar tu idioma

1. Abrí `index.html`.
2. Cargá tu idioma con el botón **`＋`** (o registralo en `index.html`).
3. Elegilo en el selector. La pantalla se redibuja al instante.
4. ¿Ves una clave cruda tipo `@@enemies.lobo.nombre` o `ex.escuelaBl` en pantalla? Esa línea
   falta en tu archivo. Se muestran literales **a propósito**, para cazarlas fácil.

El idioma elegido se recuerda entre sesiones (los que estén registrados en `index.html`).

---

## Checklist para una traducción completa

### UI (`GD.i18n.<código>`)
- [ ] Copiaste `en.js`, cambiaste el código y `_langName` en **las dos** tablas
- [ ] Tradujiste todos los bloques: topbar, menú, creación, barras, stats, exploración,
      mochila, tienda, mejoras, combate, devorar, Feast, victoria, muerte, magia, misiones,
      forja, granjas, sistema WG, locales
- [ ] No hay claves crudas (`clave.cruda`) visibles en el juego

### Contenido (`GD.content.<código>`)
- [ ] Especies, ítems, enemigos (nombre + flavor + cuerpo), zonas (nombre/descripción/salidas/eventos)
- [ ] NPCs (nombre/saludo/diálogos), trabajos, NPCs con sistema WG (estados, vínculos, reacciones)
- [ ] Estados de cuerpo (enemigos y jugador), hechizos, misiones, mini-eventos
- [ ] No hay referencias crudas (`@@…`) visibles en el juego

### Tokens
- [ ] `{huecos}` de UI intactos · tokens `{PronS}`/`{PronO}`/`{PronP}` con equivalentes correctos

---

## Notas de tono (para el contenido)

El juego tiene una voz muy específica. Si traducís el contenido, tené en cuenta:

- **Matter-of-fact.** Los cuerpos se reportan, no se editorializan.
- **Directo.** Sin eufemismos médicos ni recato. Panza, lonjas, grasa, masa.
- **Disfruta del cuerpo, no lo juzga.** El texto es goloso, no clínico.
- **2ª persona para el jugador** ("tu panza", "te cuesta", "sos").
- **3ª persona neutra de especie para los enemigos** — no asumas pelaje ni escamas; usá
  "cuerpo", "carne", "masa".
- **Los eventos son observaciones**, no dramatismo. Breve, concreto, con textura.
