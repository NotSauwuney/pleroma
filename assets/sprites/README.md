# Sprites de Pléroma — convención de archivos

El motor intenta cargar un sprite para cada **enemigo**, **NPC** y **zona**.
Si el archivo **no existe**, no se renderiza nada y la vista queda *exactamente*
como antes (degradación elegante, sin errores). Podés ir agregando arte de a poco.

## Reglas generales

- Formato: **PNG** con transparencia.
- Ubicación: `assets/sprites/<categoría>/<archivo>.png`
  - categorías: `enemy/`, `npc/`, `zone/`
- Nombre = el **id** interno de la entidad (ver listas abajo).
- **Fallback por capas** (de más específico a más genérico):
  1. `<id>__<variante>.png`  → arte para un estado de peso concreto
  2. `<id>.png`              → arte genérico del personaje/zona
  3. *(nada)*               → no se dibuja
  Doble guion bajo `__` separa id y variante.

## Tamaños sugeridos (según el CSS)

- **enemy**: ~180 px de ancho (se centra arriba del nombre en combate). `image-rendering:pixelated`, ideal para pixel art.
- **npc**: ~120 px (flota a la derecha del diálogo).
- **zone**: banner ancho, hasta 240 px de alto (`object-fit:cover`), p. ej. 1024×320.

---

## Enemigos — `assets/sprites/enemy/`

Genérico: `<id>.png`. Variantes de peso opcionales: `<id>__<peso>.png`.
Pesos posibles: `flaco`, `promedio`, `rellenito`, `gordo`, `obeso`, `ultraObeso`, `fornido`, `hipermusculoso`.
Cada enemigo solo usa el subconjunto que declara en su campo `pesos`:

| id | variantes de peso que puede mostrar |
|---|---|
| conejoGordo | flaco, promedio, rellenito, gordo, obeso |
| lobo | flaco, promedio, gordo, fornido |
| jabali | promedio, gordo, obeso, fornido, hipermusculoso |
| glotoncillo | gordo, obeso, ultraObeso |
| bandido | flaco, promedio, fornido |
| cultista | flaco, promedio, obeso |
| coloso | hipermusculoso |
| hidra | rellenito, gordo, obeso |
| toro | gordo, obeso, fornido, hipermusculoso |
| jefeBandidos | promedio, gordo, fornido |
| sumoSacerdote | flaco, promedio |
| magoCampamento | flaco, promedio |
| archimago | flaco, promedio |
| oso | promedio, gordo, obeso, ultraObeso, fornido |
| sapo | rellenito, gordo, obeso, ultraObeso |
| carnero | promedio, gordo, fornido, hipermusculoso |
| puma | flaco, promedio, gordo, fornido |
| gigante | gordo, obeso, ultraObeso |

Ejemplos: `enemy/oso.png` (genérico), `enemy/oso__ultraObeso.png` (variante).
Con solo `oso.png` alcanza: cualquier peso del oso usará ese mientras no exista la variante.

## NPCs — `assets/sprites/npc/`

Genérico: `<id>.png`. Los NPCs con sistema WG admiten variante por **índice de estado**
`<id>__<idx>.png`, donde `idx` va de `0` (más liviano) al tope de sus `estados`:

| id | variantes por estado (idx) |
|---|---|
| tabernero | 0 (gordo) · 1 (muy gordo) · 2 (obeso) · 3 (mole) |
| granjero | 0 (fornido) · 1 (gordo) · 2 (obeso) · 3 (enorme) |
| cocinera | 0 (rellena) · 1 (gorda) · 2 (muy gorda) · 3 (esférica) |
| mercader | 0 (esbelta) · 1 (rellena) · 2 (gorda) · 3 (obesa) |
| herrero | *(sin WG: solo `herrero.png`)* |
| maestraSiriel | *(solo `maestraSiriel.png`)* |
| maestroKor | *(solo `maestroKor.png`)* |
| archimagaVexara | *(solo `archimagaVexara.png`)* |

Ejemplos: `npc/tabernero.png` (genérico), `npc/tabernero__3.png` (Borek "mole").

## Zonas — `assets/sprites/zone/`

Una imagen por zona: `<id>.png`.

`vado`, `granjas`, `senda`, `claro`, `llano`, `colina`, `paso_norte`, `confluencia`, `catacumba`

---

Todo es opcional e incremental: agregá los PNG que tengas y el resto sigue
funcionando en modo solo-texto.
