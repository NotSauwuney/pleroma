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

- **Vado de Solaz** (`vado`) — punto de partida. Posada, tienda, herrería. Tierra de los
  Plenos moderados. Acá nadie te juzga por el tamaño del plato.
- **Granjas de Solaz** (`granjas`) — campos al norte del pueblo. Sin combate; trabajos de
  campo y forrajeo de ingredientes frescos.
- **Senda del Bosque** (`senda`) — savia baja, fauna chica y cebada (conejos, lobos, bandidos,
  osos). Zona de aprendizaje.
- **Claro del Glotón** (`claro`) — savia espesa, dulzona. Hábitat de glotones, cultistas, sapos
  e hidras. Primer territorio donde *vos* podés ser la presa.
- **Cueva de Vadak** (`cueva_vadak`) — cámara al fondo del claro. Sede de la **Tradición de la
  Plenitud**: el anciano Vadak enseña las técnicas del Devorar como arte sagrado.
- **Llano Abierto** (`llano`) — caza gorda (jabalíes, carneros, toros), caminos con bandidos.
  Savia media.
- **Colinas del Hartazgo** (`colina`) — savia alta, animales grandes (jabalíes, colosos, osos).
  El peso se siente acá: la mochila, las patas, el destino.
- **Paso del Norte** (`paso_norte`) — montaña alta. Pumas y gigantes; el territorio más peligroso
  del mundo conocido.
- **La Confluencia** (`confluencia`) — nodo de caminos en la montaña. Sede de la **Escuela de
  la Luz** (maestra Siriel) y la **Escuela del Flujo** (maestro Kor).
- **La Catacumba** (`catacumba`) — profundidades bajo la Confluencia. Sede de la **Escuela de
  las Profundidades** (archimaga Vexara).
- **Puerto de Solaz** (`puerto`) — el borde del mundo conocido. Un solo bote, un barquero que
  sabe demasiado, y el entrenamiento costero (remar, velas, sondeo, redes).
- **Playa de los Restos** (`playa`) — costa de combate: anguilas, tiburones, cangrejos
  acorazados, calamares arcanos.
- **El Mar de las Fauces** (océano, travesía en barco) — 30 turnos de agua sin promesas.
  Rayas, pulpos, medusas, serpientes marinas… y el **Titán Marino**, tan gordo que el agua
  se curva alrededor.

### 3.5. Las Tierras Lejanas (las dos islas)

Al otro lado del Mar de las Fauces hay dos masas de tierra que la gente de Solaz conoce
sobre todo por rumores. Las dos son, literalmente, **cadáveres de Colosos** — ver §II de
la Historia (la Era de los Colosos): en Pléroma la geografía es lo que queda de los cuerpos
más grandes que existieron.

- **Los Arenales de Solakh** (`arenales_solakh`, desierto) — el cuerpo de **Solakh, la
  Serpiente que Devoró el Sol**. Una Colosa que creció tragando calor y luz hasta que la
  Gran Hambruna la dejó sin nada que tragar: se desplomó y sus anillos infinitos se
  volvieron dunas. Por eso la arena nunca se enfría. Tierra adentro gobierna el **Reino de
  Solakh** (su armada patrulla el Mar de las Fauces y rescata náufragos sin cobrar — el
  desprecio es gratis); en la costa queda el **Puesto de la Caravanera** (Nyssa), última
  heredera de las rutas comerciales pre-Hambruna. El **Templo Hundido** que el viento
  entierra y desentierra guarda la **Mitad Solar del Amuleto**, custodiada por el **Gusano
  de Arena** — carroñero colosal que lleva generaciones engordando dentro del cuerpo de la
  Serpiente.
- **El Gran Manto** (`gran_manto`, megaflora) — el cuerpo de **Vethra, la Enraizada**. La
  única Colosa que vio venir la Hambruna y eligió lo impensable: dejar de comer y echar
  raíces, convirtiendo su masa en bosque. El Manto entero es Vethra, todavía viva a su
  manera — el latido bajo el musgo es suyo. El **Guardián del Manto** es su sistema
  inmunológico hecho raíces, y custodia la **Mitad Raíz del Amuleto**, incrustada en su
  árbol-corazón. En las raíces de la costa vive **Yaro** (el **Nido de Raíces**), de un
  linaje de recolectores que solo toman lo que el Manto suelta.

> **El Amuleto de Intimidación** (misión secreta): un disco partido en dos durante el fin de
> la Era de los Colosos. Cada mitad carga la *presencia* de su Coloso — sol y raíz. Juntas,
> el portador huele a algo demasiado viejo y demasiado grande para morder: las criaturas del
> Mar de las Fauces dejan pasar el barco sin pelear. Las mitades caen de los jefes de los
> mini-eventos de cada isla y se funden solas al juntarlas.

**Para expandir:** ciudades de cada facción, una capital de los Plenos (mercado de festines),
un monasterio de los Ligeros (entrenamiento de stats de movilidad), las simas del Cabal del
Hueco (mazmorra vore endgame), la capital tierra adentro del Reino de Solakh, las copas altas
del Gran Manto (¿qué vive arriba de la niebla?), un Altar del Devorar donde se sube de
"rango" ritualmente.

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

El motor tiene `maná`, un arma `baston` (escala con INT) y un sistema de magia escolar
completo (`data/spells.js`). Las tres escuelas del lore están implementadas, más una cuarta:

> **Escuela de la Luz** (blanca, Confluencia) — sanación y escudos. La maestra Siriel la
> custodia. Hechizos: Curar · Curar Mayor · Escudo · Escudo Mayor.
>
> **Escuela del Flujo** (gris, Confluencia) — daño y debuffs. El maestro Kor la dirige.
> Hechizos: Ráfaga · Ráfaga Mayor · Ralentizar · Ralentizar Mayor.
>
> **Escuela de las Profundidades** (negra, Catacumba) — drenaje y corrupción. La archimaga
> Vexara la preside. Hechizos: Drenaje · Drenaje Mayor · Entropía · Entropía Mayor · **Feast**.
>
> **Tradición de la Plenitud** (legendaria, Cueva de Vadak) — técnicas del Devorar como arte
> sagrado. No se enseña en escuela: se desbloquea por quests y logros. El anciano Vadak actúa
> como guía. Hechizos: Feast + técnicas de Absorción.

> **Feast** — la contracara mágica del Devorar. Feast usa el ingenio para *plegar al enemigo
> en comida* sin importar lo fuerte que sea: no lo traga, lo **transmuta**. La savia queda
> condensada en un banquete que podés comer o guardar — la reserva escala con INT. En la
> teología popular, Feast es controvertido: los Plenos lo ven como trampa al ritual sagrado;
> los Ligeros, irónicamente, lo toleran más, porque no exige volverse un coloso.

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
- **El Reino de Solakh:** una corona que vive sobre el cadáver de una diosa-serpiente y lo
  sabe. ¿Qué pasa cuando el Gusano de Arena crece más que el recuerdo de Solakh?
- **Vethra sueña:** el Gran Manto está vivo. Si una Colosa puede volverse bosque, ¿puede un
  bosque volver a ser Colosa?

---

*Próximo paso sugerido: elegir UNA región nueva o UNA facción y profundizarla — escribir sus
NPCs, su tienda, sus 3-4 quests, sus enemigos. El motor ya soporta todo eso como pura data.*
