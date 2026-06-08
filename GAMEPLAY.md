# PLÉROMA — Diseño de juego y estilos de partida

Cómo se juega el motor base hoy, qué arquetipos (estilos de juego) ya soporta, y el roadmap
para acercarlo cada vez más a un **turn-based RPG simplista**.

---

## 1. El bucle central (core loop)

```
   EXPLORAR  ──►  ENCUENTRO  ──►  COMBATE POR TURNOS
      ▲                                  │
      │                                  ▼
   DESCANSAR / COMPRAR  ◄──  RECOMPENSA: XP · oro · (devorar = peso)
                                         │
                                         ▼
                              CRECER (subir nivel, engordar)
                                  ⇅  tensión
                          MÁS PODER  ↔  MENOS MOVILIDAD
```

La decisión que el jugador toma una y otra vez es la **gestión del filo masa/movilidad**.
Comer y devorar te hacen más fuerte (peso → savia → stats efectivos vía recompensas) pero te
acercan a la **inmovilidad** (`fat + ful·1.2 > FUE·16`), que te impide esquivar y huir. Ese
trade-off *es* el juego. Todo lo demás cuelga de ahí.

---

## 1.5. Metabolismo, peso y energía (sistema de cuerpo)

El cuerpo dejó de ser un número y pasó a tener **dos categorías de peso** que se calculan
distinto:

- **Peso magro** (`45 + FUE·5 + TAM·4`) — músculo y contextura. Se "carga solo": atado a la
  fuerza, casi no penaliza moverte. Subir **FUE** lo aumenta.
- **Peso graso** (`fat`) — lo que comés y digerís. Es lo que **cuesta energía** mover y lo que
  te empuja a la inmovilidad.

**Recomposición:** entrenar FUE convierte grasa en músculo (−5 grasa por punto). Así el peso
total casi no cambia, pero se vuelve "útil": menos lastre, más fuerza. Premia invertir en FUE.

**Energía por acción (stamina):** moverte en el overworld cuesta
`4 + (grasa sobre el mínimo)·0.5 / (1 + (FUE+AGI)·0.18)`. Mucha grasa + poca FUE/AGI = el costo
se dispara. Cuando no te queda stamina para otra acción quedás **sin aliento** (semi-inmóvil):
solo podés *recuperar el aliento* (descansar) o abrir la mochila. Un descanso siempre alcanza
para volver a moverte (hay tope anti-softlock). La stamina ya **no se regenera sola con el
tiempo** — descansar (o beber agua) es la única recuperación.

**Ayuno y pérdida de peso:** si descansás o actuás con el **estómago vacío** (`ful < 8`), el
cuerpo se cobra de sus reservas y la **grasa baja** poco a poco hacia un mínimo (`FAT_FLOOR`).
Es la vía para *adelgazar*. Pero tiene un precio: cada acción en ayunas suma al contador de
inanición, y a las **20 acciones vacías te desmayás** (→ hospital). Comer cualquier cosa
reinicia el contador. Resultado: cortar peso es un acto deliberado que exige comer de a ratos
para no colapsar. El sidebar avisa cuando te acercás al desmayo.

> Constantes tuneables al inicio de `engine/01_core.js`: `FAT_FLOOR`, `EMPTY_THRESHOLD`, `MAX_VACIO`,
> `METAB` (grasa quemada por turno en ayuno).

---

## 2. Cómo funciona el combate por turnos (ya implementado)

Modelo deliberadamente simple, estilo JRPG de menú:

1. **Iniciativa:** quien tenga más `AGI + INT` actúa primero ese turno.
2. **El jugador elige una acción** de un menú:
   - **⚔ Atacar** — daño = `tirada(arma) + stat·escala − defensa`, con tipos (corte/golpe/arcano)
     que tienen resistencias y debilidades.
   - **🦷 Devorar** — *win-condition física*. Test de habilidad
     (`AGI+FUE+EST+40` vs defensa del enemigo). Disponible cuando el enemigo está debilitado
     (≤50% vida) o cuando tu `EST` lo supera holgado. Éxito = te lo tragás entero: termina el
     combate, +peso **ya** (te llenás en el acto), +XP bonus.
   - **✦ Feast** — *win-condition mágica* (cuesta maná). Test por `INT·3+20` vs
     `INT+AGU+vitalidad` del enemigo. **No exige debilitarlo:** es la respuesta a la "montaña
     inamovible" que no podés tragar por la fuerza. Éxito = convertís al enemigo en un **ítem de
     comida** (Banquete de X) que podés *comer ahí mismo* o *guardar* — pero la reserva de comida
     mágica tiene tope (`2 + INT/3`). Recompensa diferida y controlada, en vez del golpe de masa
     inmediato del Devorar.
   - **🎒 Item** — comer/beber/pócima a media pelea (cuesta el turno).
   - **🏃 Huir** — test de `AGI+INT`. **Falla automáticamente si estás inmóvil.** (El peso te alcanza.)
   - **💪 Forcejear** — solo si te agarraron; reducís el agarre con tu mejor stat físico.
3. **El enemigo responde** con una IA mínima: ataca; si es un *devorador* y estás débil, intenta
   **agarrarte** y luego **tragarte** (game over si lo logra y no zafás).
4. Se resuelve vida/estado y vuelve al menú, hasta que alguien cae.

Tests de habilidad: `prob% = clamp(atacante − defensor, min, max)`. Limpio, legible, fácil de balancear.

**Dificultad (anti-mindless-click):** los enemigos pegan ×1.75 y aguantan ×1.3 (constantes
`DIF_DANO` / `DIF_VIDA` en `engine/01_core.js`). Ya no se gana intercambiando golpes sin pensar: tenés
que curarte, devorar/Feastear en la ventana correcta, o huir. Sumado al gasto de energía del
overworld, el early game pide decisiones reales.

---

## 2.5. Muerte → despertar en el pueblo (no reinicio)

Caer no borra la partida: te llevan "a casa". Cinco causas, cada una con su narrativa:

| Causa | Disparador | A dónde |
|---|---|---|
| **Daño** | vida a 0 por golpe físico | Hospital |
| **Magia** | vida a 0 por ataque `arcano` (ej. cultista) | Academia de Magias |
| **Devoración** | un enemigo `puedeDevorar` te traga (fallaste el forcejeo) | la Academia te reencarna |
| **Empacho** | superás tu capacidad de llenura en +75% | coma por comida → pueblo |
| **Inanición** | 20 acciones con el estómago vacío | Hospital (te alimentan) |

**Consecuencias:** −50% de XP y −50% de oro; mochila y equipo intactos; despertás con vida/maná
restaurados y el estómago vacío. **Excepción:** la inanición no te quita oro (nadie te robó) y
el hospital te despierta ya alimentado. Todo configurable en `morir()` / `revivir()`.

---

## 3. Estilos de juego (arquetipos que el motor YA soporta)

El point-buy de stats produce builds genuinamente distintas. Cuatro fantasías de partida:

### 🐗 El Coloso (FUE / TAM / AGU)
Andás lento pero no te tumba nada. Tanqueás los golpes, pegás durísimo con maza, y devorás a
los grandes una vez que los ablandás. Aceptás la inmovilidad como precio del poder.
**Especie ideal:** Ursaco. **Riesgo:** nunca podés huir — todo combate es a muerte.

### 🦷 El Devorador (EST / FUE)
Tu plan no es matar: es *tragar*. Subís EST para abrir la ventana de Devorar antes y absorber
masa de todo. Crecés más rápido que nadie. La panza es tu arma.
**Especie ideal:** Mursa o Saurio. **Riesgo:** atiborrarte y quedar varado en zona hostil.

### 🗡 El Duelista (AGI / INT)
Golpeás primero siempre, esquivás, y si la cosa se pone fea, huís. Te mantenés liviano a
propósito. Daga rápida, hit-and-run. El control del ritmo es todo.
**Especie ideal:** Lyncar o Vúlpor. **Riesgo:** frágil; un combate mal leído te liquida.

### ✦ El Hechicero / Devorador arcano (INT + EST)
Quemás savia en vez de cargarla. Tu firma es **Feast**: en vez de tragar al rival con las
mandíbulas, lo *transmutás en comida* con INT. Resolvés los enemigos que un build físico no
puede devorar (tanques de AGU/TAM altos como el Coloso de Piedra). Pero ojo: crear la comida es
la mitad — tu `EST` decide cuánta podés *comer* sin quedar inmóvil, y la reserva guardable tiene
tope. INT abre la puerta; el estómago sigue siendo el cuello de botella.
**Especie ideal:** Lyncar (INT alto) o un Mursa/Saurio (EST) que mete puntos en INT.
**Hoy:** totalmente jugable (Feast + bastón que escala INT).

> **Sugerencia de diseño:** mostrar estos cuatro arquetipos como "vías sugeridas" en la pantalla
> de reparto de puntos, sin obligarlos. Orientan al jugador nuevo sin encajonarlo.

---

## 4. Progresión

- **Nivel/XP:** matar da XP; **devorar da +30% XP** (incentiva la mecánica de firma). Subir nivel
  da 3 puntos de stat y cura full.
- **Peso como segunda progresión:** paralela al nivel. El peso no sube con XP sino con *comida y
  vore*, y alimenta los chequeos de FUE (carga) y la inmovilidad. Es una "barra" que el jugador
  decide cuánto empujar.
- **Equipo:** armas escalan con stats distintos (FUE/AGI/INT), así el loot refuerza tu build.

---

## 5. Roadmap hacia un RPG turn-based más completo (en orden de impacto)

Cada ítem es un módulo de **pura data + un poco de motor**, sin reescribir nada:

1. **Sistema de hechizos** → `data/spells.js` + acción "Lanzar" en combate. **Feast ya está
   implementado** como primer hechizo (acción dedicada en combate); el siguiente paso es
   generalizarlo a una lista de hechizos data-driven y sumar las 3 escuelas del lore. *(Mayor impacto.)*
2. **Estados de combate** → veneno, aturdir, "empacho" (penaliza por sobrellenado), quemadura.
   El motor ya tiene el gancho (`tempStats`, status). Da profundidad táctica al menú.
3. **NPCs y diálogo** → un `data/npcs.js` con árboles simples. Convierte el Vado en un pueblo vivo.
4. **Quests con etapas** → estructura `{progreso, listo, completado}` (el original la usaba).
   Da rumbo entre combate y combate.
5. **Más biomas y un jefe por región** → cada jefe como un enemigo de `data/enemies.js` con
   `puedeDevorar: true` y flavor propio. Picos de dificultad y de narrativa.
6. **Encuentros con elección no-combate** → eventos de texto ("una criatura herida te ofrece
   savia a cambio de…") tipo gamebook. Variedad fuera de la pelea.
7. **Sistema de origen/trasfondo** → modifica stats iniciales y desbloquea diálogos. Da identidad
   al protagonista-lienzo.

---

## 6. Filosofía de balance (para que se mantenga "simplista pero con miga")

- **Pocas stats, que importen mucho.** Seis ejes, cada uno con un rol claro y legible.
- **Una decisión dominante por turno.** El menú nunca debería tener 9 opciones; 4-5 buenas.
- **El trade-off antes que el número.** Lo memorable no es "+3 daño", es "¿como ahora y quedo
  lento, o aguanto el hambre y sigo ágil?". Proteger esa tensión por encima de todo.
- **Devorar siempre debe ser una elección con costo,** no la opción obvia. Por eso requiere
  ventana (enemigo débil / EST alto) y te llena (riesgo de inmovilidad). Si alguna vez es
  gratis, el juego se rompe.
