# PLÉROMA — Progresión de armas

Mapa completo de las armas del juego, sus mejoras y **los tres caminos que llegan a
legendario**. Fuente de verdad: `data/items.js` (`GD.items` + `GD.recetas`) y la forja
de la Herrería de Durn (`engine/08_town.js` / `engine/09_npcwg.js`).

## Reglas generales

- **Mejora en herrería:** toda arma mejorable sube hasta **+10** pagando oro
  (`costoMejora = (20 + precio·0.3) · (nivel+1)`). Cada nivel suma `mejoraRate` % de daño
  (4–7% según el arma).
- **Forja:** combina materiales del mundo (drops + forrajeo) en armas nuevas. Las recetas
  *foranas* y *legendarias* además **consumen el arma base** (y su nivel de mejora se pierde:
  el arma nueva arranca en +0).
- **Legendarias:** no se mejoran (`mejorable: false`) — nacen completas, con un
  **efecto de arma único**. Sus recetas son `secreto: true`: solo aparecen en la forja cuando
  ya tenés el arma base requerida al nivel pedido.

> ⚠ **Fix v1.0.5:** las recetas legendarias pedían el arma forana **+14**, pero la mejora
> capea en **+10** — eran inalcanzables. Ahora piden **+10** (el máximo real).

## Tier 0 — Inicio y mercado

| Arma | Daño | Stat | Tipo | Origen | ¿Camino a legendaria? |
|---|---|---|---|---|---|
| Garras | 1d4 | FUE | — | inicial | No (no mejorable) |
| Daga | 2d4 | AGI | corte | Tienda (25 oro) | No — rama muerta |
| Maza | 2d6 | FUE | golpe | Tienda (40 oro) | No — rama muerta |
| Bastón | 1d6 | INT | arcano | Tienda (50 oro) | No — rama muerta |

## Tier 1 — Herrería (compra)

| Arma | Daño | Stat | Tipo | Precio | ¿Camino a legendaria? |
|---|---|---|---|---|---|
| Espadón | 3d6 | FUE | corte | 120 | No — rama muerta |
| Estoque | 3d5 | AGI | corte | 110 | No — rama muerta |
| Cetro | 2d8 | INT | arcano | 140 | No — rama muerta |

Las armas de tienda/herrería son puentes de mitad de juego: pegan bien con +10, pero
**ninguna evoluciona**. Para legendaria hay que pasar por las crafteables.

## Tier 2 — Forja (crafteables con materiales locales)

| Arma | Daño | Stat | Tipo | Materiales | ¿Evoluciona? |
|---|---|---|---|---|---|
| **Garrote Nudoso** | 3d6 | FUE | golpe | zarpa de osa ×2 · colmillo de lobo | ✅ → Mazo de las Mareas |
| **Bastón del Pantano** | 2d9 | INT | arcano | baba de pantano ×2 · escama de hidra | ✅ → Báculo Primordial |
| **Lanza de Campo** | 3d7 | AGI | corte | colmillo de jabalí ×2 · cuerno de toro | ✅ → Filo del Exilio |
| Maza del Coloso | 4d7 | FUE | golpe | fragmento de coloso ×2 · zarpa de osa | ❌ rama muerta (sidegrade fuerte) |
| Espada de Escarcha | 3d8 | AGI | corte | escarcha de gigante ×2 · garra de puma | ❌ rama muerta (sidegrade fuerte) |

## Tier 3 — Armas foranas (materiales de las zonas marítimas)

Requieren el arma crafteable base **+10** (se consume) + materiales del océano/islas.

| Arma | Daño | Stat | Tipo | Requiere | Materiales |
|---|---|---|---|---|---|
| **Mazo de las Mareas** | 5d7 | FUE | golpe | Garrote Nudoso +10 | tentáculo salado ×2 · escama abisal |
| **Filo del Exilio** | 4d9 | AGI | corte | Lanza de Campo +10 | veneno de escorpión ×2 · escama del calor |
| **Báculo Primordial** | 3d11 | INT | arcano | Bastón del Pantano +10 | savia antigua ×2 · esporo gigante |

## Tier 4 — Legendarias (recetas secretas)

Requieren la forana **+10** (se consume) + un **material de jefe** + materiales raros.

| Legendaria | Daño | Stat | Efecto único | Requiere | Materiales (jefe en negrita) |
|---|---|---|---|---|---|
| ✦ **Leviatán** | 5d7 ·esc 1.0 | FUE | **Terremoto** — 20% de aturdir al enemigo por turno | Mazo de las Mareas +10 | **Núcleo del Titán** (Titán Marino, océano) · fragmento de coloso · esencia del bosque (Jefe Bandidos) |
| ✦ **Sombra Veloz** | 4d8 ·esc 1.0 | AGI (+0.3·INT) | **Sombra** — escala también con INT | Filo del Exilio +10 | **Núcleo Arenoso** (Gusano de Arena, Arenales) · garra de puma · núcleo del pantano (Sumo Sacerdote) |
| ✦ **Vacío Eterno** | 3d10 ·esc 1.1 | INT | **Regeneración de maná** — +1 maná por golpe | Báculo Primordial +10 | **Corazón del Bosque** (Guardián del Manto, Gran Manto) · cristal de escarcha (Archimago) · núcleo del pantano |

## Los tres caminos completos

```
FUE  Garrote Nudoso ──(+10)──► Mazo de las Mareas ──(+10 + Núcleo del Titán)──► ✦ LEVIATÁN
AGI  Lanza de Campo ──(+10)──► Filo del Exilio ────(+10 + Núcleo Arenoso)────► ✦ SOMBRA VELOZ
INT  Bastón Pantano ──(+10)──► Báculo Primordial ──(+10 + Corazón del Bosque)► ✦ VACÍO ETERNO
```

Dónde cae cada material de jefe:

- **Núcleo del Titán** — Titán Marino: 10% de los encuentros durante la travesía en barco
  (drop garantizado al vencerlo).
- **Núcleo Arenoso** — Gusano de Arena: jefe del mini-evento *Templo Hundido de Solakh*
  (Los Arenales). Drop garantizado.
- **Corazón del Bosque** — Guardián del Manto: jefe del mini-evento *El Corazón del Manto*
  (El Gran Manto). Drop garantizado.
- **Esencia del Bosque / Núcleo del Pantano / Cristal de Escarcha** — jefes de los
  mini-eventos del continente (Jefe de Bandidos / Sumo Sacerdote / Archimago). Drop garantizado.

## Resumen de ramas muertas (a propósito)

Daga, Maza, Bastón, Espadón, Estoque, Cetro, Maza del Coloso y Espada de Escarcha **no
evolucionan**: son puentes de poder o sidegrades. Si el objetivo es una legendaria, invertí
las mejoras en Garrote Nudoso, Lanza de Campo o Bastón del Pantano según tu build —
el oro de mejora de las armas que se consumen en la forja no se recupera.
