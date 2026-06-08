# PLÉROMA — Biblia del mundo (v0.1)

> *Pléroma* (gr. πλήρωμα): "plenitud, lo que llena". El nombre no es casual.

Documento vivo de world-building. El motor (`engine/` + `data/`) ya implementa la
mecánica; esto es la **ficción que la justifica** y el terreno para expandir. Nada acá
está cerrado: es el primer ladrillo.

---

## 1. La premisa cosmológica: la masa es maná

En Pléroma la materia viva no es neutra. Todo cuerpo acumula **savia** —una sustancia
mágica densa que se concentra en la grasa, en el peso, en lo que un cuerpo guarda—. Cuanto
más masa carga una criatura, más savia contiene, y la savia **es** poder: fuerza, calor,
resistencia, magia bruta.

De ahí la ley fundamental del mundo, conocida por todos y discutida por nadie:

> **Lo que comés, sos. Lo que devorás, te vuelve.**

Comer no es solo sobrevivir: es *crecer en sentido literal y mágico*. Un cuerpo grande es un
cuerpo rico. Por eso en Pléroma la gordura no se esconde ni se castiga — se exhibe como se
exhibiría una fortuna o una cicatriz de guerra.

**La tensión central** (y el corazón del juego): la savia pesa. Un cuerpo lleno de poder es
un cuerpo lento. Atiborrarse te vuelve fuerte y casi inmóvil a la vez. El arte de vivir en
Pléroma es administrar ese filo: comer lo suficiente para ser temible, no tanto como para
quedar varado y a merced de algo con más hambre que vos.

---

## 2. El Devorar (la institución sagrada)

Comer plantas y carne común transfiere savia despacio. Pero existe una vía rápida, antigua y
ritualmente cargada: **devorar a otra criatura entera y viva**, absorbiendo su savia de golpe.

El Devorar no es visto como asesinato sino como **herencia**. La criatura devorada "pasa" su
savia, su tamaño y parte de su esencia a quien la traga. En la teología popular, ser devorado
por alguien digno es una forma de trascendencia: *seguís existiendo, ahora como peso de otro*.
("Ahora sos parte del paisaje interior de otra criatura" — el game over no es un final triste
en el lore, es una conversión.)

Tres posturas culturales sobre el Devorar dan las **facciones** del mundo:

| Facción | Postura | Gancho de gameplay |
|---|---|---|
| **Los Plenos** | El Devorar es destino sagrado. Comen sin límite, veneran a los colosales. | Dan misiones de "alcanzá X peso", venden festines, idolatran al jugador grande. |
| **Los Ligeros** | Repudian el exceso. Cultivan agilidad y autocontrol; ven la inmovilidad como muerte en vida. | Misiones de sigilo/velocidad, recompensan mantenerse móvil, desconfían del jugador gordo. |
| **El Cabal del Hueco** | Cultistas del hambre infinita. Devoran por devorar, incluso a los suyos. Antagonistas. | Jefes vore peligrosos, el `glotoncillo` es su criatura menor, la amenaza de game-over. |

---

## 3. Geografía (los biomas como regiones de savia)

El mundo se ordena por **densidad de savia**, que crece a medida que te alejás de los pueblos
civilizados hacia lo salvaje. Cada bioma del motor (`data/world.js`) es una franja de esa
escala:

- **Vado de Solaz** (pueblo neutral) — punto de partida. Posada, tienda, descanso. Acá nadie
  te juzga por el tamaño del plato. Tierra de los Plenos moderados.
- **Senda del Bosque** — savia baja, fauna chica y cebada (conejos, lobos flacos, bandidos).
  Zona de aprendizaje.
- **Claro del Glotón** (pantano) — savia espesa, dulzona. Hábitat de criaturas que comen sin
  parar. Primer territorio donde *vos* podés ser la presa.
- **Llano Abierto** — caza gorda (jabalíes), caminos con bandidos. Savia media.
- **Colinas del Hartazgo** — savia alta, animales grandes, viento con olor a bestia. El peso
  se siente acá: la mochila, las patas, el destino.

**Para expandir:** ciudades de cada facción, una capital de los Plenos (mercado de festines),
un monasterio de los Ligeros (entrenamiento de stats de movilidad), las simas del Cabal del
Hueco (mazmorra vore endgame), costa/océano (criaturas marinas de TAM enorme), un Altar del
Devorar donde se sube de "rango" ritualmente.

---

## 4. Especies (las que ya existen + cómo leerlas)

Cada especie es una **inclinación de savia**, no un destino. Sus stats base
(`data/species.js`) cuentan una historia:

- **Vúlpor** (zorro) — glotón ágil. EST alto, AGI alta. Come mucho y rápido, pero frágil.
- **Ursaco** (oso) — la montaña. FUE/TAM/AGU brutales, AGI mínima. Tanque que aguanta el peso.
- **Mursa** (roedor) — estómago sin fondo. EST altísimo: el devorador puro, hecho para vore.
- **Lyncar** (felino) — duelista. AGI/INT altas: gana iniciativa, esquiva, controla el ritmo.
- **Saurio** (reptil) — fauces anchas. EST/TAM altos, sangre lenta: traga entero por diseño.

**Para expandir:** especies marinas (orca, tiburón — TAM masivo), aviares (ligeras, anti-vore),
híbridos de facción. Cada especie nueva es solo un bloque en `species.js`.

---

## 5. Magia (gancho para el sistema de hechizos)

La savia se puede *quemar* en lugar de cargar: ahí nace la magia. Tres escuelas, ancladas a INT:

- **Blanca** — sanación, saciedad controlada (convierte savia en vida sin engordar).
- **Gris** — utilidad: acelerar digestión, aligerar el cuerpo temporalmente, sigilo.
- **Negra** — daño arcano, drenar savia ajena a distancia (vore mágico sin tragar).

El motor ya reserva `maná` y un arma `baston` (escala con INT). El primer hechizo ya existe:

> **Feast** (escuela Negra/Gris) — la contracara mágica del Devorar. Donde el Devorar usa las
> mandíbulas para tragar a un rival debilitado, Feast usa el ingenio para *plegar al enemigo en
> comida* sin importar lo fuerte que sea. Es como un cazador domina a la "montaña inamovible":
> no la traga, la **transmuta**. La savia no se absorbe de golpe sino que queda condensada en un
> banquete que podés comer o guardar — pero ningún mago puede acumular comida conjurada sin
> límite (la reserva escala con INT). En la teología popular, Feast es controvertido: los Plenos
> lo ven como hacer trampa al ritual sagrado del Devorar; los Ligeros, irónicamente, lo toleran
> más, porque al menos no exige volverse un coloso para alimentarse.

El siguiente módulo natural es generalizarlo: un `data/spells.js` con la lista completa y una
acción "Lanzar" que englobe Feast, sanación, daño arcano y drenaje a distancia.

---

## 6. El protagonista (lienzo en blanco intencional)

El jugador no tiene biografía fija: elegís especie, repartís stats, te ponés un nombre. El lore
te da un **motor de deseo** sin atarte: llegaste al Vado "con un hambre vieja y la idea fija de
volverte grande". Por qué — venganza, gula, ambición de poder, trascendencia ritual — lo
decidís vos en tu cabeza, o lo definimos con un sistema de origen/trasfondo más adelante.

---

## 7. Ganchos narrativos sembrados (para misiones futuras)

- **La inmovilidad como crisis:** una quest donde comés tanto para un jefe que quedás varado y
  tenés que sobrevivir/digerir antes de poder moverte.
- **El converso:** un NPC Ligero que de a poco prueba el Devorar y se transforma.
- **El colosal dormido:** una criatura tan llena de savia que lleva siglos sin moverse; objetivo
  de endgame (¿devorarla? ¿liberarla? ¿volverte ella?).
- **Mercado de savia:** economía donde el peso se puede "vender" (digerir ritualmente por oro) —
  ya implementado en germen con el `digestivo`.
```
```

---

*Próximo paso sugerido: elegir UNA región nueva o UNA facción y profundizarla — escribir sus
NPCs, su tienda, sus 3-4 quests, sus enemigos. El motor ya soporta todo eso como pura data.*
