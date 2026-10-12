# Manual profesional para crear personajes 3D estilo *Cube World*

**Edición ampliada basada en la imagen de referencia aportada por el usuario**  
**Ámbito:** diseño visual, modelado por piezas, materiales, rigging, animación y preparación para Three.js/Blender.  
**Fecha:** 12 de octubre de 2026

> **Cómo leer esta guía.** Las proporciones, medidas, colores y presupuestos que se proponen son puntos de partida de producción, no especificaciones oficiales de *Cube World*. La sección visual describe lo que se aprecia en la imagen compartida; las secciones técnicas proponen una forma reproducible de construir un personaje original con rasgos semejantes. La intención es estudiar un lenguaje visual general, no copiar un modelo de juego existente.

![Referencia de estilo compartida por el usuario: personaje humanoide compacto, cabeza grande, pelo amarillo en bloques, ropa violeta, cinturón y botas oscuras.](cube_world_reference.png)

## 1. Resumen ejecutivo

El efecto no se obtiene poniendo cubos al azar sobre una figura humana. El personaje de la referencia funciona por cinco decisiones coordinadas:

1. **Proporciones chibi:** la cabeza ocupa una parte muy grande de la altura total; el torso es corto y las extremidades se simplifican.
2. **Volúmenes grandes antes que pequeños:** cabeza, masa de pelo, túnica/cuerpo, manos y botas se leen a primera vista. Los detalles secundarios nunca sustituyen a una silueta clara.
3. **Bloques escalonados, no necesariamente voxels unitarios:** el pelo, la cara y la ropa están hechos de prismas de varios tamaños. La forma parece cúbica, pero no todas las piezas tienen que ser celdas idénticas de una rejilla.
4. **Rostro de pocos elementos:** ojos rectangulares saturados, piel casi plana, nariz y boca muy discretas o inexistentes. La expresión nace sobre todo del tamaño y la colocación de los ojos y del flequillo.
5. **Contraste de color y luz suave:** pelo amarillo, piel cálida, ropa violeta, un acento verde, cinturón marrón, hebilla plateada y botas carbón. La luz genera volumen sin introducir texturas realistas.

La meta práctica es que el personaje se reconozca en una miniatura, en vista frontal y en tres cuartos, y que todas las piezas puedan animarse sin que aparezcan separaciones accidentales.

## 2. Lectura visual de la imagen de referencia

Esta sección separa observaciones de la imagen de las recomendaciones propuestas.

### 2.1 Lo que se aprecia

- **Cabeza:** caja ancha y alta, con rostro color piel y esquinas cuadradas. El cráneo y la mandíbula no buscan anatomía realista; son masas geométricas.
- **Pelo:** amarillo intenso, muy volumétrico. Es una especie de casquete superior con mechones grandes que bajan sobre la frente. El contorno presenta escalones y entrantes; no es una superficie lisa ni una colección de cubitos idénticos.
- **Flequillo:** piezas frontales de distintas alturas. Algunas tapan parcialmente la parte superior de la cara y crean una silueta asimétrica. Es un elemento importante para que el pelo no parezca un simple bloque rectangular.
- **Ojos:** dos rectángulos verticales azules en la zona baja-media del rostro. El contraste es alto y no se observan iris, brillos ni líneas finas complejas.
- **Oreja visible:** una pieza lateral color piel/rosado, de forma prismática vertical; se añade al costado en lugar de esculpir una oreja orgánica.
- **Cuello y torso:** el cuerpo es pequeño bajo la cabeza. El cuello presenta un acento verde rodeado por ropa violeta. La ropa se resuelve con piezas sólidas, no con pliegues de tela realistas.
- **Brazos y manos:** los brazos salen a ambos lados del torso y se proyectan hacia delante. Las manos son cubos grandes del color de la piel; su volumen supera el detalle de los dedos, que no se modelan individualmente.
- **Cinturón:** franja oscura/marrón con hebilla rectangular plateada al frente. La hebilla sirve de punto focal secundario.
- **Parte inferior:** túnica o bloque violeta corto, piernas muy simplificadas y botas negras/gris carbón con una suela gris clara. El calzado es grande, ancho y de punta cuadrada.
- **Render:** fondo gris neutro, cámara en tres cuartos, sombras suaves que describen el volumen y pequeñas diferencias de iluminación entre caras. No se necesita una textura detallada para que el modelo tenga lectura.

### 2.2 Qué copiar del lenguaje visual y qué no

**Conviene conservar:** jerarquía de volúmenes, asimetría controlada del flequillo, ojos geométricos, manos y botas sobredimensionadas, pocos colores organizados por zonas y bordes mayoritariamente rectos.

**No conviene copiar de forma literal:** la identidad completa del personaje, el diseño exacto del peinado, una combinación única de accesorios o cualquier asset oficial. Cambia al menos la silueta del pelo, el patrón del traje, la forma de la hebilla y un rasgo distintivo para convertirlo en un diseño propio.

### 2.3 Principio de construcción

Piensa en **capas de lectura**:

| Prioridad | Piezas | Se deben reconocer… | Pregunta de revisión |
|---|---|---|---|
| 1 — Silueta | Cabeza, pelo, torso, manos, botas | A tamaño de icono | ¿Se entiende el personaje sin color ni detalles? |
| 2 — Identidad | Flequillo, cuello, cinturón, forma de las botas | A distancia media | ¿Tiene un rasgo distintivo propio? |
| 3 — Acabado | Hebilla, ribetes, mechones pequeños, costuras | De cerca | ¿Añaden calidad sin ensuciar la lectura? |

## 3. Proporciones iniciales medibles

Las dimensiones siguientes son una **plantilla de partida inspirada en la imagen**, no medidas oficiales. Se usa una altura total aproximada de **4,2 unidades**, con el suelo en `Y = 0`, eje `Y` vertical y eje `+Z` hacia la cara/cámara frontal. La anchura va sobre `X`.

### 3.1 Tabla de proporciones

| Módulo | Medidas iniciales (ancho × alto × fondo) | Centro/colocación aproximada | Intención visual |
|---|---:|---|---|
| Altura total con pelo | — | `Y ≈ 4,1–4,3` | Personaje compacto y de cabeza grande |
| Cabeza/rostro | `1,55 × 1,35 × 1,15` | Sobre el pivote de cabeza | Masa principal expresiva |
| Casquete de pelo | `1,65 × 0,32 × 1,25` | Encima de la cabeza | Sobrepasar ligeramente el cráneo |
| Mechones frontales grandes | `0,30–0,55 × 0,35–0,85 × 0,25–0,40` | Delante y arriba de la cara | Flequillo escalonado |
| Orejas | `0,18 × 0,40 × 0,18` | Laterales de la cabeza | Silueta secundaria |
| Ojos | `0,14–0,18 × 0,28–0,34 × 0,05–0,08` | En el tercio inferior/medio del rostro | Expresión clara a distancia |
| Torso | `0,95 × 0,62 × 0,62` | Debajo de la cabeza | Compacto, poco anatómico |
| Cuello/pañuelo | `0,45 × 0,24 × 0,42` | Entre torso y mandíbula | Acento de color visible |
| Túnica/pelvis | `1,00 × 0,65 × 0,70` | Debajo del torso | Masa violeta ancha |
| Brazo superior | `0,34 × 0,48 × 0,38` | Pivote a la altura del hombro | Volumen corto |
| Antebrazo | `0,32 × 0,42 × 0,36` | Debajo/hacia delante del brazo | Segmento simplificado |
| Mano/puño | `0,48 × 0,42 × 0,48` | Extremo del brazo | Mano sobredimensionada |
| Hebilla | `0,38 × 0,26 × 0,10` | Centro frontal del cinturón | Acento plateado |
| Bota completa | `0,56 × 0,38 × 0,75` | A nivel del suelo | Base ancha, punta cuadrada |
| Suela | `0,56 × 0,10 × 0,75` | Parte inferior de la bota | Franja gris clara |

**Cómo ajustar las medidas:** si el modelo parece demasiado humano, agranda cabeza, manos y calzado o reduce torso y piernas. Si parece un muñeco sin identidad, no aumentes todo indiscriminadamente: modifica un solo rasgo dominante y revisa la silueta.

### 3.2 Reparto aproximado de la altura

Como objetivo visual, la cabeza más el pelo puede ocupar alrededor del **40–46 %** de la altura total; torso, cuello y prenda inferior juntos, aproximadamente un **25–30 %**; piernas y calzado, el resto. Estas proporciones son una guía visual ajustable, no una ley. En la imagen, la cabeza domina claramente la figura y las botas funcionan como una base ancha.

### 3.3 Rejilla: dos enfoques posibles

**Enfoque A — bloques estilizados (recomendado para acercarse a la imagen):** usa cajas de tamaños diferentes que comparten una escala general. Es más rápido y permite que la cara, el pelo y la ropa tengan grandes planos limpios.

**Enfoque B — voxel estricto:** todas las formas se construyen con cubitos del mismo tamaño y las siluetas se aproximan mediante escalones de celdas. Es útil si el juego necesita destructibilidad o edición voxel real, pero suele necesitar más piezas y más control para no perder la limpieza del modelo de referencia.

No mezcles las dos reglas de forma arbitraria. Si utilizas bloques grandes, define una unidad de medida base y alinea sus bordes a múltiplos de ella cuando sea posible.

## 4. Diseño de silueta antes de modelar detalles

### 4.1 Bloqueo en cuatro pasadas

1. **Masa negra:** crea solo cabeza, pelo, torso, brazos, manos, piernas y botas. Pon un material negro uniforme.
2. **Comprobación frontal:** mira si ambos ojos podrían caber en el rostro, si la cabeza sobresale del torso y si las manos son visibles junto al cuerpo.
3. **Comprobación de perfil y tres cuartos:** comprueba cuánto sobresale el pelo del rostro, el fondo de la cabeza, la proyección del puño y la punta de la bota.
4. **Ajuste de vacíos:** deja huecos deliberados entre los mechones, entre brazo y torso y entre las dos botas. Los huecos hacen legible la forma; no cierres todos los espacios con bloques.

### 4.2 Regla de tres tamaños

Usa tres escalas de piezas:

- **Grandes:** cabeza, masa principal del pelo, torso, manos, botas.
- **Medianas:** mechones, antebrazos, cinturón, cuello, parte alta de las botas.
- **Pequeñas:** ojos, hebilla, una pieza decorativa o ribete.

Como límite inicial, intenta que el personaje se entienda con las piezas grandes y medianas. Si necesita muchas piezas pequeñas para parecer bien diseñado, vuelve al contorno y a la distribución de color.

## 5. Construcción de la cabeza

La cabeza es el módulo que más influye en la lectura. Conviene construirla como una caja principal, añadiendo piezas faciales y capas de pelo con control de profundidad.

### 5.1 Caja base y planos de la cara

1. Crea un prisma ancho y alto, de profundidad algo menor que su anchura.
2. Usa un tono de piel uniforme. Evita subdividir la cara en muchos tonos.
3. Coloca los ojos en el plano frontal, no exactamente sobre la superficie si el motor produce z-fighting. Adelántalos una pequeña cantidad.
4. Añade una extensión pequeña en barbilla o mejilla solo si el perfil necesita más carácter. La referencia tiene un rostro muy plano; no hace falta esculpir nariz realista.
5. Mira la cabeza desde tres cuartos. Si el rostro parece una lámina pegada a una caja, el ojo está demasiado adelantado o la profundidad de la cabeza es insuficiente.

### 5.2 Posición de los ojos

- Colócalos en una franja horizontal común y conserva la simetría de altura como punto de partida.
- Empieza con ojos rectangulares verticales de un único color azul. La variación de expresión puede lograrse moviendo su separación o altura, o añadiendo una ceja/bloque oscuro, antes que incorporando iris complejos.
- Deja suficiente distancia entre ojos para que no se conviertan en una única franja azul en vista de lejos.
- No los hagas demasiado pequeños: en este lenguaje visual, los ojos son un elemento gráfico de lectura primaria.
- Revisa que el flequillo no tape ambos ojos al mismo tiempo. Si el peinado oculta uno parcialmente, que sea una decisión clara y que la expresión continúe siendo legible.

**Prueba de escala:** reduce la imagen del personaje a unos 96 píxeles de alto. Si los ojos desaparecen, aumenta su tamaño o contraste; no compenses añadiendo muchos detalles faciales.

### 5.3 Nariz, boca y cejas

Para una cara como la referencia, la ausencia de una nariz visible y de una boca marcada funciona bien. Si el personaje necesita expresión:

- nariz: una pieza muy pequeña de piel, ligeramente más oscura, o un escalón discreto en el volumen;
- boca: una línea corta hecha con un bloque fino, no una curva realista;
- cejas: una o dos piezas oscuras pegadas por encima de los ojos, útiles para enfado, sorpresa o concentración.

Estos rasgos son opcionales. La prioridad es mantener la economía del rostro.

### 5.4 Orejas

Construye las orejas como prismas cortos a ambos lados de la cabeza. Un plano rosado frontal puede sugerir el interior, pero no crees demasiadas capas: desde cámara de juego, la oreja suele leerse como un pequeño bloque lateral. Comprueba que no atraviese el pelo de forma accidental.

## 6. Pelo volumétrico por bloques: módulo prioritario

El pelo es la pieza más característica de la referencia. Debe leerse como **una masa continua compuesta por salientes escalonados**, no como un casco liso ni como una nube de cubitos inconexos.

### 6.1 Estructura en capas

Trabaja el pelo en este orden:

1. **Casquete superior:** una caja ancha que cubra parte superior y laterales del cráneo. Deja un pequeño margen para que la cabeza no sobresalga por arriba.
2. **Masa trasera:** un volumen posterior para que la forma funcione en perfil. Sin él, el peinado se convierte en una fachada frontal.
3. **Mechones laterales:** piezas rectangulares que bajan junto a la sien y la oreja. No tienen que ser iguales a izquierda y derecha.
4. **Flequillo principal:** dos o tres volúmenes grandes en el frente, con alturas diferentes. Un mechón puede caer más que los demás para dar asimetría.
5. **Recortes y huecos:** retranquea uno de los bloques superiores o deja un escalón negativo. La variación del contorno evita que el pelo parezca una caja amarilla plana.
6. **Ajuste de la línea facial:** comprueba que se vea suficiente frente/rostro para los ojos y que ningún mechón flote separado por accidente.

### 6.2 Cómo dar forma sin añadir demasiados cubos

Es mejor resolver el peinado con 6–12 volúmenes legibles que con decenas de cubos pequeños sin jerarquía. Cada pieza debe tener una función: casquete, volumen posterior, patilla, flequillo largo, flequillo corto o mechón distintivo.

- Superpón las cajas ligeramente cuando se necesite ocultar juntas, pero evita intersecciones que produzcan sombras negras extrañas.
- Alterna alturas y profundidades: un mechón puede estar delante del otro, pero la superposición debe resultar obvia desde tres cuartos.
- Mantén un material amarillo base. En general, deja que la luz produzca diferencias entre caras antes de asignar un material distinto a cada bloque.
- Si usas variación de tono, limita el cabello a una base, una sombra cálida y un tono de luz. No pintes cada cubo de un amarillo diferente.
- En vista lateral, el casquete no debe atravesar la oreja de forma extraña. Decide qué queda delante: pelo, oreja o ambos por niveles.

### 6.3 Errores comunes del cabello

| Problema | Causa típica | Corrección |
|---|---|---|
| Parece un casco | Todo tiene la misma altura y el flequillo es recto | Cambia la profundidad y la longitud de 2–3 mechones |
| Parece una pila de ladrillos | Demasiadas piezas visibles e independientes | Agrupa en masas grandes y elimina cubos decorativos |
| No funciona de perfil | Solo se diseñó la vista frontal | Añade masa trasera y comprueba el volumen lateral |
| Tapa la expresión | Flequillo demasiado bajo o muy ancho | Levanta un mechón y abre un hueco visual sobre un ojo |
| Flota sobre el cráneo | El casquete y los mechones no se solapan lo suficiente | Introduce solape mínimo y revisa la profundidad |

### 6.4 Variaciones originales del mismo lenguaje

Para crear personajes diferentes sin abandonar esta estética, cambia la **silueta del pelo**, no solo su color: flequillo partido, cresta en escalones, dos mechones altos, bob cuadrado, coleta hecha con bloques, melena trasera en niveles o capucha rígida. Conserva las reglas de volumen, pero evita reproducir exactamente el peinado de la referencia.

## 7. Torso, cuello y prendas

### 7.1 Tronco principal

El torso de esta clase de personaje es un prisma corto. Empieza con una caja sencilla, ligeramente más estrecha que la cabeza. No intentes dibujar pecho, abdomen y hombros con anatomía realista: el material y las piezas superpuestas deben explicar la ropa.

El volumen superior puede ser más estrecho y la prenda inferior algo más ancha, creando una silueta de túnica o chaqueta corta. Evita cambios de escala demasiado bruscos que hagan parecer que la cabeza está desconectada del cuerpo.

### 7.2 Cuello y pieza verde

La zona verde de la referencia es pequeña, pero importante porque separa la piel del violeta y rompe la masa principal. Para lograr un efecto similar:

1. Coloca una pieza corta bajo la barbilla.
2. Haz que sobresalga ligeramente sobre el torso, pero no sobre toda la parte frontal del cuello.
3. Usa un verde distinto del violeta, con suficiente contraste pero sin competir con el pelo.
4. Añade el cuello o solapa violeta por los lados y delante, dejando visible el acento verde.

Puede interpretarse como camisa interior, pañuelo, corbata corta o cierre de chaqueta. El diseño narrativo queda a criterio del personaje nuevo.

### 7.3 Prenda violeta

La prenda se debe leer como una o dos grandes cajas: un torso superior y un bloque inferior tipo túnica. Una pequeña diferencia de anchura o altura basta para separar las piezas. Los pliegues realistas, costuras finísimas y arrugas simuladas por normales suelen ser contraproducentes para este estilo.

- Usa un violeta base medio, no demasiado claro.
- Conserva planos amplios para que la iluminación describa el volumen.
- Para una manga o hombrera, añade una pieza cúbica de color compatible.
- Si necesitas decorar, utiliza una sola franja, broche o emblema grande y legible.

### 7.4 Cinturón y hebilla

El cinturón ayuda a separar torso y parte inferior, y la hebilla sirve como centro visual. Construcción sugerida:

- banda marrón oscura que atraviese la zona frontal y laterales;
- una hebilla rectangular plateada, con profundidad suficiente para dar una sombra fina;
- opcionalmente, un pequeño marco oscuro detrás para que el metal no se funda con la ropa;
- sin texto diminuto, grabados ni remaches si no se distinguen en el tamaño final.

Mantén la hebilla centrada en el eje del cuerpo. Si una pieza está unida a una prenda que se anima por separado, parenta la hebilla al módulo correcto para que no se desplace.

## 8. Brazos, puños y manos

### 8.1 Construcción

La referencia utiliza brazos cortos que se extienden hacia delante y manos grandes, con muy pocos detalles. El diseño debe favorecer la pose y la lectura, no la anatomía realista.

Construye cada brazo con:

- **pivote de hombro** colocado en el borde superior-lateral del torso;
- **brazo superior**, un prisma corto;
- **antebrazo**, otra pieza rectangular, algo orientada hacia delante si la pose lo requiere;
- **mano/puño**, una caja grande que dé un final claro a la silueta.

Para una pose con los brazos levantados delante del cuerpo, rota los grupos de hombro y orienta el antebrazo o la mano en el eje frontal. No intentes resolver esa postura moviendo solo el cubo final: se notará que las articulaciones no siguen una jerarquía coherente.

### 8.2 Manos: formas simples

Las manos pueden ser puños cúbicos, guantes rectangulares o manos de piel. Un pulgar simplificado se añade como pieza secundaria en un lateral solo si se ve desde la cámara principal. Los dedos individuales no son necesarios para un diseño tan compacto.

**Relación de tamaño inicial:** cada mano puede medir entre el 30 y el 40 % de la anchura de la cabeza. Es una regla estilística aproximada; ajústala al rol del personaje. Un luchador necesita manos/guantes prominentes, mientras que un personaje delicado puede reducirlas.

### 8.3 Evitar brazos rígidos o flotantes

- Deja una pequeña separación visual entre brazo y costado, pero mantén un solape geométrico suficiente en el hombro.
- En pose neutra, verifica que las manos no se fusionen con el torso desde la cámara del juego.
- Para animar, coloca los pivotes en la articulación, no en el centro geométrico del brazo completo.
- Si el puño es un objeto separado, hazlo hijo del antebrazo o de un pivote de muñeca, según el nivel de animación requerido.

## 9. Pelvis, piernas y botas

### 9.1 Pelvis y faldón

La parte violeta inferior es un bloque corto, con la forma de una túnica o faldón. Puede ocultar la mayor parte de las piernas; eso es útil porque reduce el número de piezas visibles y conserva las proporciones caricaturescas.

Mantén el frente de la túnica bastante plano. Para que no parezca un cilindro cuadrado, comprueba el perfil y agrega una diferencia de profundidad discreta entre el torso superior y el faldón.

### 9.2 Piernas

Las piernas se pueden construir con uno o dos segmentos por lado, pero no todas las piezas necesitan ser visibles. Para una figura con faldón:

- usa muslos cortos parcialmente ocultos;
- coloca el pivote de cadera bajo el faldón;
- sitúa las botas con separación suficiente para que se distingan como dos volúmenes;
- comprueba que la pierna no atraviese el borde frontal del calzado al rotar.

Si el movimiento esperado es correr, saltar o agacharse, deja espacio para que las piernas puedan rotar sin colisionar con la prenda inferior.

### 9.3 Botas: forma, color y suela

Las botas son una de las masas que equilibran la cabeza grande. En la referencia tienen punta ancha y cuadrada, parte superior oscura y una suela gris clara.

Construcción sugerida por capas:

1. **Suela:** bloque bajo, un poco más ancho y largo que la parte superior. Tono gris medio-claro.
2. **Cuerpo de la bota:** caja carbón que se apoye en la suela y forme el volumen principal.
3. **Lengüeta/empeine:** pieza más alta o un escalón en la parte superior, opcional.
4. **Refuerzo frontal:** bloque pequeño si ayuda a distinguir la punta, pero no es imprescindible.

No redondees la punta hasta hacerla realista. Si aplicas bisel, que sea tan pequeño que las caras sigan leyendo como planas. La suela clara crea una línea de contraste que ayuda a reconocer el pie en una imagen pequeña.

### 9.4 Prueba de estabilidad visual

Observa el modelo frontal. Las botas no deben parecer dos rectángulos pegados sin relación con las piernas. Ajusta anchura, orientación y espacio central hasta que el peso de la figura parezca apoyado. Luego mira el perfil para verificar que el pie tenga profundidad suficiente.

## 10. Paleta y materiales de partida

Los siguientes valores HEX son **aproximaciones artísticas sugeridas**, no una extracción calibrada de píxeles ni colores oficiales del juego.

| Zona | Color propuesto | HEX | Uso |
|---|---|---|---|
| Pelo | Amarillo dorado | `#E2BE18` | Masa dominante superior |
| Piel | Beige cálido | `#E8C69A` | Cara, orejas y manos |
| Ojos | Azul intenso | `#174FB8` | Acento facial |
| Sombra de cabello (opcional) | Ocre | `#C69D12` | Solo para una separación puntual |
| Prenda principal | Violeta medio | `#5B4A70` | Torso, cuello exterior y faldón |
| Pieza de cuello | Verde | `#4B875B` | Acento pequeño |
| Cinturón | Marrón oscuro | `#46362F` | Banda y separación entre piezas |
| Hebilla | Plata grisácea | `#B7BEC2` | Centro secundario |
| Bota | Carbón | `#34383A` | Volumen principal |
| Suela | Gris claro | `#969B9D` | Franja inferior |
| Fondo de render | Gris oscuro | `#414141` | Contraste neutral |

### 10.1 Distribución del color

Como punto de partida, distribuye el peso visual así: un color de gran área (pelo o prenda), dos colores secundarios (piel y segunda prenda) y un par de acentos pequeños (ojos, cuello, hebilla). No es necesario aplicar porcentajes exactos; lo importante es que los colores de acento ocupen menos superficie que las masas principales.

### 10.2 Materiales

- **Piel y tela:** material mate o de rugosidad alta; evita reflejos plásticos.
- **Pelo:** mismo tipo de material que la tela, pero con color vivo. No necesita brillo capilar realista.
- **Hebilla:** rugosidad algo menor y, si encaja en el motor, metalness moderado. Que no refleje como cromo.
- **Ojos:** material opaco, bien saturado. El negro puro solo debe usarse si es intencional.
- **Botas:** material mate carbón y suela gris; separa las piezas por geometría y color antes de recurrir a texturas.

### 10.3 Iluminación y render

Para aproximarte a la referencia, usa una luz principal amplia y suave, relleno ambiental moderado y sombras difusas. El objetivo no es eliminar todas las sombras: una sombra de contacto tenue ayuda a que las piezas se sientan conectadas. Evita un contraluz dramático que convierta el rostro en una silueta oscura.

En Three.js, prueba una luz hemisférica o ambiental para levantar sombras y una luz direccional para definir caras. Si usas sombras dinámicas, activa solo las necesarias y ajusta el mapa de sombras para evitar bordes exagerados. Para una ilustración de presentación, añade oclusión ambiental suave si el flujo de render la admite; para un juego, valida su coste en tiempo real.

## 11. Flujo de modelado recomendado

Este flujo vale tanto para Blender como para un modelador de voxels. Se recomienda terminar cada fase antes de entrar en detalles.

### Fase 1 — Brief y referencias

- Define rol, personalidad, edad visual, equipo y rasgo distintivo.
- Crea vistas frontal, lateral y tres cuartos aunque sean bocetos sencillos.
- Marca en la referencia solo proporciones y lógica de formas; no calques un diseño completo.
- Decide si el modelo usará cajas de tamaños diferentes o voxels de una sola celda.

**Salida de la fase:** ficha de diseño de una página.

### Fase 2 — Blockout monocromo

- Crea cabeza, torso, pelvis, brazos, manos, piernas y botas.
- Usa un único material sin detalles.
- Ajusta el tamaño relativo de la cabeza, la longitud del torso y la anchura de las manos y botas.
- Revisa frente, perfil y tres cuartos.

**Criterio de salida:** la silueta debe leerse sin cabello detallado, ojos ni hebilla.

### Fase 3 — Cara y pelo

- Añade ojos rectangulares.
- Construye el casquete superior del pelo y su masa posterior.
- Diseña los mechones como grandes bloques escalonados.
- Comprueba que ojos y cara permanecen legibles desde la cámara principal.

**Criterio de salida:** la cabeza debe resultar reconocible y expresiva con pocos elementos.

### Fase 4 — Ropa y equipo

- Añade cuello, prenda superior y faldón.
- Separa cinturón y hebilla.
- Termina manos y botas.
- Añade un máximo de uno o dos adornos distintivos en esta pasada.

**Criterio de salida:** cada pieza secundaria debe cumplir una función de lectura, color o historia.

### Fase 5 — Materiales e iluminación

- Define una paleta pequeña y reutilizable.
- Mantén los materiales compartidos entre piezas equivalentes.
- Comprueba el modelo con una luz neutra antes de estilizar el render.
- Prueba sobre fondo claro y oscuro para ver si las piezas se separan bien.

### Fase 6 — Jerarquía y pivotes

- Decide qué partes son rígidas y cuáles necesitan animarse.
- Crea pivotes separados para cabeza, hombros, codos si se requieren, caderas y rodillas.
- Parentar accesorios a la parte que deben seguir: pelo/casco a cabeza, escudo a brazo, hebilla a cinturón/torso, botas a pies.
- Prueba rotaciones antes de añadir animación compleja.

### Fase 7 — Integración y QA

- Ajusta escala y origen del modelo al proyecto.
- Revisa iluminación, cámara, clipping y sombras en el entorno final.
- Perfila memoria/materiales/llamadas de dibujo según el presupuesto real del juego.
- Documenta qué piezas son intercambiables y cuáles forman parte fija del personaje.

## 12. Blender: procedimiento práctico

### 12.1 Preparar la escena

1. Abre una escena nueva y establece unidades o una escala de trabajo clara. No es obligatorio que una unidad de modelado equivalga a un metro; sí es importante mantenerla coherente.
2. Trabaja con la vista frontal ortográfica para crear el blockout y cambia luego a lateral y tres cuartos.
3. Añade un objeto de referencia en un plano de imagen, bloquea su selección y úsalo como guía de proporciones, no como molde para calcar.
4. Nombra los módulos desde el principio: `Head_Base`, `Hair_Cap`, `Hair_Bang_L`, `Hair_Bang_R`, `Torso`, `Tunic_Lower`, `Belt`, `Buckle`, `Hand_L`, `Boot_L`, etc.

### 12.2 Construcción con cubos

- Añade un cubo por volumen y modifica sus dimensiones en modo objeto o edición.
- Aplica la escala antes de usar modificadores sensibles a ella.
- Para conservar aristas nítidas, deja los cubos sin bisel durante el blockout.
- Si necesitas un borde suavizado, prueba un bisel mínimo (por ejemplo, una fracción pequeña del ancho de la unidad base y un único segmento). Revisa al 100 % de la resolución final: un bisel demasiado grande convierte las piezas en juguetes redondeados y pierde la estética cúbica.
- No añadas bevel a los ojos, la hebilla y todos los detalles por defecto. Decide pieza a pieza.

### 12.3 Organización por colecciones

Una organización posible:

```text
CHARACTER_ROOT
├── Head_Rig
│   ├── Head_Base
│   ├── Face_Eyes
│   ├── Hair_Cap
│   ├── Hair_Bangs
│   └── Ears
├── Torso_Rig
│   ├── Torso
│   ├── Collar
│   ├── Tunic_Lower
│   ├── Belt
│   └── Buckle
├── Arm_L_Rig
├── Arm_R_Rig
├── Leg_L_Rig
└── Leg_R_Rig
```

Usa colecciones para organizar el archivo y parenting/armature para definir movimiento. No confundas una colección visual con una articulación: si varias piezas deben rotar juntas, colócalas bajo un mismo pivote o hueso.

### 12.4 Pivotes y parenting

La cabeza debe girar desde la base del cuello; los brazos desde los hombros; las piernas desde las caderas. Para una malla rígida hecha de objetos independientes, puedes parentar cada grupo a un objeto vacío en la posición de su articulación. Si necesitas exportar animaciones complejas, considera un armature sencillo. El parenting mantiene los elementos hijos asociados a su objeto padre; revisa las transformaciones al establecer la jerarquía. Consulta el manual de Blender sobre [parenting de objetos](https://docs.blender.org/manual/en/5.0/scene_layout/object/editing/parent.html).

### 12.5 Pruebas de pose

Crea tres poses de comprobación: neutral, brazos elevados y paso de caminata. Si la geometría deja huecos, los corrige el modelado o los solapes; no intentes ocultarlos únicamente con sombras. Comprueba también que el pelo siga a la cabeza y que los accesorios no se queden atrás.

## 13. Three.js: estructura y ejemplo funcional

Para una escena de Three.js, los objetos cúbicos pueden construirse con `BoxGeometry`. `Group` permite crear jerarquías: al rotar un grupo de brazo o cabeza, sus piezas hijas lo acompañan. La documentación oficial contiene los detalles de [BoxGeometry](https://threejs.org/docs/pages/BoxGeometry.html), [Group](https://threejs.org/docs/pages/Group.html) y el [sistema de animación](https://threejs.org/manual/pages/animation-system.html).

### 13.1 Principio técnico

- Mantén una geometría y materiales reutilizables siempre que el diseño lo permita.
- Separa por grupos las partes que necesitan pivotes diferentes.
- No uses `InstancedMesh` para piezas que necesitan una jerarquía independiente sin planificar cómo controlarás cada instancia. Es útil para dibujar muchas copias de una geometría con menos draw calls, pero no sustituye automáticamente un rig. Consulta la [documentación de InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html).
- Para un solo personaje con pocas decenas de cajas, la claridad de la jerarquía suele importar más que aplicar optimizaciones prematuras.

### 13.2 Código de ejemplo

El siguiente ejemplo crea un personaje **original inspirado en el lenguaje de bloques**: cabeza grande, pelo amarillo escalonado, ojos azules, ropa violeta, cuello verde, cinturón y botas con suela. Está pensado para integrarse en una escena existente de Three.js; recibe el objeto `THREE` y devuelve un `Group`. La cámara, las luces y el bucle de render se configuran fuera de esta función.

```js
function createVoxelHero(THREE) {
  const root = new THREE.Group();
  root.name = "VoxelHero";

  const mat = (color, roughness = 0.9, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const M = {
    skin: mat(0xe8c69a),
    hair: mat(0xe2be18),
    eye: mat(0x174fb8),
    purple: mat(0x5b4a70),
    green: mat(0x4b875b),
    belt: mat(0x46362f),
    metal: mat(0xb7bec2, 0.45, 0.25),
    boot: mat(0x34383a),
    sole: mat(0x969b9d),
  };

  // Crea un prisma centrado en `position`, hijo de `parent`.
  function box(parent, name, size, position, material) {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Eje Y hacia arriba. La cara mira hacia +Z. El suelo está en Y = 0.
  // Botas y suelas.
  for (const side of [-1, 1]) {
    const x = side * 0.34;
    box(root, `BootSole_${side}`, [0.56, 0.10, 0.75], [x, 0.10, 0.10], M.sole);
    box(root, `Boot_${side}`, [0.53, 0.28, 0.68], [x, 0.27, 0.08], M.boot);
  }

  // Piernas cortas parcialmente ocultas por el faldón.
  const legL = new THREE.Group();
  legL.name = "Leg_L_Pivot";
  legL.position.set(-0.32, 0.76, 0);
  root.add(legL);
  box(legL, "Leg_L", [0.32, 0.56, 0.34], [0, -0.20, 0], M.purple);

  const legR = new THREE.Group();
  legR.name = "Leg_R_Pivot";
  legR.position.set(0.32, 0.76, 0);
  root.add(legR);
  box(legR, "Leg_R", [0.32, 0.56, 0.34], [0, -0.20, 0], M.purple);

  // Pelvis/túnica inferior y torso superior.
  box(root, "Tunic_Lower", [1.02, 0.68, 0.70], [0, 1.03, 0], M.purple);
  box(root, "Torso", [0.94, 0.60, 0.62], [0, 1.62, 0], M.purple);
  box(root, "Collar_Green", [0.44, 0.22, 0.42], [0, 2.05, 0.03], M.green);

  // Cinturón en la parte frontal (+Z).
  box(root, "Belt_Front", [1.02, 0.18, 0.74], [0, 1.20, 0.015], M.belt);
  box(root, "Buckle", [0.38, 0.26, 0.08], [0, 1.20, 0.405], M.metal);

  // Brazos con pivote en los hombros.
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.name = side < 0 ? "Arm_L_Pivot" : "Arm_R_Pivot";
    arm.position.set(side * 0.57, 1.88, 0.02);
    root.add(arm);

    box(arm, `UpperArm_${side}`, [0.36, 0.46, 0.38], [side * 0.12, -0.10, 0.03], M.skin);
    box(arm, `Forearm_${side}`, [0.34, 0.39, 0.36], [side * 0.23, -0.16, 0.14], M.skin);
    box(arm, `Hand_${side}`, [0.48, 0.40, 0.48], [side * 0.25, -0.20, 0.18], M.skin);
    arms.push(arm);
  }

  // Cabeza: el pivote está cerca de la base, para permitir el giro del cuello.
  const head = new THREE.Group();
  head.name = "Head_Pivot";
  head.position.set(0, 2.15, 0);
  root.add(head);

  box(head, "Head_Base", [1.55, 1.35, 1.15], [0, 0.66, 0], M.skin);

  // Ojos planos colocados delante del rostro. +Z es el frente.
  box(head, "Eye_L", [0.16, 0.32, 0.07], [-0.39, 0.57, 0.61], M.eye);
  box(head, "Eye_R", [0.16, 0.32, 0.07], [ 0.39, 0.57, 0.61], M.eye);

  // Orejas simples en los laterales.
  box(head, "Ear_L", [0.18, 0.38, 0.22], [-0.82, 0.57, 0.02], M.skin);
  box(head, "Ear_R", [0.18, 0.38, 0.22], [ 0.82, 0.57, 0.02], M.skin);

  // Pelo en capas: casquete, masa trasera, patillas y flequillo desigual.
  box(head, "Hair_Cap", [1.66, 0.34, 1.25], [0, 1.43, -0.01], M.hair);
  box(head, "Hair_Back", [1.45, 0.62, 0.30], [0, 1.13, -0.56], M.hair);
  box(head, "Hair_Side_L", [0.34, 0.78, 0.36], [-0.65, 1.00, 0.43], M.hair);
  box(head, "Hair_Side_R", [0.32, 0.60, 0.36], [ 0.66, 1.06, 0.42], M.hair);
  box(head, "Hair_Bang_L", [0.48, 0.70, 0.30], [-0.42, 1.02, 0.60], M.hair);
  box(head, "Hair_Bang_Center", [0.48, 0.48, 0.30], [0.08, 1.12, 0.60], M.hair);
  box(head, "Hair_Bang_R", [0.38, 0.62, 0.30], [0.48, 1.00, 0.59], M.hair);

  // Puntos de anclaje para equipamiento futuro.
  const handSocketR = new THREE.Group();
  handSocketR.name = "HandSocket_R";
  handSocketR.position.set(0.84, 1.70, 0.42);
  root.add(handSocketR);

  root.userData.rig = { head, arms, legs: [legL, legR], handSocketR };
  return root;
}
```

**Ajustes esperables:** la posición del cinturón, el cuello, el flequillo y las manos se deben ajustar según la cámara y la escala del proyecto. El código es un punto de partida modular, no una réplica exacta de la imagen. En producción, cachea/reutiliza geometrías y materiales cuando sea razonable; si se elimina el personaje, libera con `dispose()` los recursos que sean de su propiedad y no estén compartidos.

### 13.3 Actualización simple de una animación de caminar

Este fragmento muestra la idea de mover brazos y piernas por oposición. Debe ejecutarse dentro del bucle de animación existente, usando el tiempo transcurrido o el tiempo acumulado de tu aplicación. No crees un segundo bucle de render si el proyecto ya tiene uno.

```js
function animateWalk(character, elapsedSeconds, speed = 1) {
  const { arms, legs, head } = character.userData.rig;
  const swing = Math.sin(elapsedSeconds * 7 * speed) * 0.35;

  arms[0].rotation.x =  swing;
  arms[1].rotation.x = -swing;
  legs[0].rotation.x = -swing * 0.8;
  legs[1].rotation.x =  swing * 0.8;
  head.rotation.z = Math.sin(elapsedSeconds * 3) * 0.025;
}
```

El ejemplo anima en el eje `X` porque el modelo mira hacia `+Z`. Verifica los ejes del proyecto real: si la orientación del personaje o la convención del esqueleto es distinta, cambia el eje o el signo. Para animaciones exportadas en clips, utiliza el sistema oficial de animación de Three.js.

### 13.4 Optimización sensata

- Reutiliza materiales para todas las piezas que compartan color y propiedades.
- Reutiliza geometría cuando las dimensiones sean iguales; si cada cubo necesita dimensiones distintas, valora escalado de una caja base o geometrías cacheadas por tamaño.
- Agrupa o fusiona únicamente las piezas que no necesiten pivotar por separado.
- `InstancedMesh` puede reducir draw calls si aparecen muchas copias de una misma forma, especialmente en escenarios con muchos elementos. Para un avatar individual, no lo uses solo por moda: evalúa el número real de objetos y el coste de la animación.
- Evita generar cubos internos invisibles si el personaje va a convertirse a una única malla voxel. En una construcción modular con cajas superpuestas, prioriza el solape controlado y revisa sombras.
- No añadas luces con sombras dinámicas para cada pieza. Una luz principal y relleno suele ser suficiente.

## 14. Arquitectura modular y piezas intercambiables

Si el objetivo es producir muchas variantes, define puntos de anclaje y límites de cada módulo desde el primer personaje.

### 14.1 Contrato de módulos

| Módulo | Debe contener | No debería controlar |
|---|---|---|
| `Head` | cráneo, ojos, orejas, pelo fijo | rotación del torso |
| `Hair` | piezas del peinado | escala general del avatar |
| `Torso` | caja principal, cuello integrado si procede | animación de piernas |
| `Clothing` | camisa, túnica, faldón | pivote de hombros si puede moverse aparte |
| `Arm_L/R` | piezas del brazo y mano o guante | giro de la cabeza |
| `Leg_L/R` | pierna, pie/bota según el rig | rotación del torso completo |
| `Equipment` | armas, escudos, mochila, accesorios | transformaciones del mundo ajenas al personaje |

### 14.2 Anclajes recomendados

Define un `socket` para cada punto de equipamiento: mano derecha/izquierda, espalda, cintura y cabeza. El objeto equipable se añade como hijo del socket. Así es posible cambiar una espada por un bastón sin reconstruir el brazo y sin tener que adivinar posiciones en cada escena.

### 14.3 Evitar errores de intercambio

- Mantén los módulos dentro de una caja delimitadora prevista.
- Define un origen local consistente en cada categoría de pieza.
- Documenta unidades y orientación frontal.
- Comprueba que un casco alternativo no tape la cara y que un arma no atraviese el suelo durante el ciclo de caminata.

## 15. Errores frecuentes y soluciones

| Síntoma | Por qué sucede | Qué probar primero |
|---|---|---|
| Parece Minecraft genérico y no un personaje diseñado | Todas las piezas son cubos iguales y la silueta carece de jerarquía | Usa bloques grandes y medianos con formas intencionales; diseña pelo y botas como masas |
| Parece un juguete redondeado | Bisel excesivo o iluminación demasiado especular | Reduce/elimina bevel, sube roughness y usa luz más amplia |
| La cabeza está desconectada | Cuello ausente, hombros demasiado bajos o cabeza demasiado alta | Revisa distancia mandíbula-cuello y masa del torso |
| Los ojos se pierden | Son pequeños, están demasiado separados o carecen de contraste | Aumenta tamaño/contraste y prueba una miniatura |
| El pelo parece una peluca lisa | Solo tiene un casquete uniforme | Añade flequillo en 2–3 longitudes y volumen lateral/trasero |
| El flequillo parece una escalera sin sentido | Hay demasiados escalones del mismo tamaño | Elimina piezas y diseña una asimetría dominante |
| Las manos parecen cubos pegados | Hombro, antebrazo y puño no tienen una relación clara | Crea pivotes y solapes; alinea los volúmenes con la pose |
| Las botas parecen cajas flotantes | La pierna no conecta o falta una suela legible | Solapa la bota con la pierna y separa el tono de la suela |
| El personaje es difícil de leer sobre el escenario | La paleta tiene poco contraste de valor | Prueba un fondo neutro y revisa silueta y luminancia |
| Las caras de cubos quedan demasiado oscuras | Iluminación intensa desde un ángulo extremo o sombras duras | Sube relleno, suaviza sombras y reajusta la luz principal |
| Aparecen zonas negras en las uniones | Solapes problemáticos, normales o geometría duplicada casi coplanar | Inspecciona desde cerca, mueve ligeramente superficies conflictivas y revisa sombras |
| El brazo se desarma al animar | Pivote en el centro del objeto completo o parenting incorrecto | Sitúa el origen en la articulación y mueve la geometría en coordenadas locales |
| La hebilla se separa del cinturón al moverse | Está parentada al grupo equivocado | Parentarla al cinturón/torso que controla su transformación |

## 16. Lista de control de calidad

Marca una casilla solo cuando lo hayas comprobado en el modelo o en el motor real.

### Dirección artística

- [ ] La silueta funciona en negro, sin colores ni detalles.
- [ ] La cabeza domina, pero no oculta todo el torso.
- [ ] El personaje se reconoce en frontal, perfil y tres cuartos.
- [ ] El pelo tiene contorno escalonado y volumen trasero.
- [ ] Los ojos son legibles a tamaño pequeño.
- [ ] Manos y botas tienen un tamaño deliberado, no accidental.
- [ ] La paleta tiene un color dominante, secundarios y acentos limitados.
- [ ] El diseño contiene rasgos propios y no depende de copiar la referencia.

### Modelado

- [ ] Las piezas importantes tienen nombres claros.
- [ ] Las dimensiones y el origen están documentados.
- [ ] Los solapes no producen huecos visibles durante las poses.
- [ ] El pelo no atraviesa el rostro ni las orejas de forma accidental.
- [ ] Las botas se conectan visualmente a las piernas.
- [ ] No hay detalles minúsculos que desaparezcan en la cámara final.

### Rig y juego

- [ ] Los pivotes de cabeza, hombros y caderas están en las articulaciones.
- [ ] Los accesorios siguen a su socket.
- [ ] La animación de caminar no abre huecos ni hace atravesar la túnica.
- [ ] El origen del personaje y el nivel del suelo son coherentes.
- [ ] Las dimensiones no rompen colisiones, cámara ni controles existentes.

### Render e integración

- [ ] Los colores se revisan bajo la iluminación real del proyecto.
- [ ] No hay z-fighting ni sombras negras inesperadas.
- [ ] Las sombras refuerzan volumen sin ensuciar la cara.
- [ ] Los materiales y geometrías duplicados se han revisado.
- [ ] Se ha probado a resolución y distancia de cámara finales.
- [ ] Los resultados se han verificado realmente; no se declaran pruebas no ejecutadas.

## 17. Plantilla para diseñar un nuevo personaje

Copia esta ficha por cada personaje nuevo.

```text
ID/nombre interno:
Rol o clase:
Personalidad en tres palabras:
Silueta dominante:
Rasgo distintivo principal:
Forma de la cabeza:
Diseño del pelo/casco:
Forma y separación de ojos:
Prenda superior:
Prenda inferior:
Forma de las manos/guantes:
Forma de botas/calzado:
Accesorios y sockets:
Color dominante (HEX):
Color secundario (HEX):
Color de acento (HEX):
Materiales previstos:
Altura total y ancho máximo:
Unidad de rejilla:
Piezas animables:
Variantes intercambiables:
Presupuesto objetivo de geometría/materiales:
Cámara de validación:
Pruebas pendientes:
```

## 18. Prompt maestro para una herramienta de IA o un artista técnico

```text
Actúa como artista técnico de personajes 3D estilizados y desarrollador de Three.js.
Diseña un personaje ORIGINAL inspirado en principios visuales generales de los juegos voxel tipo Cube World, usando bloques prismáticos con silueta caricaturesca y lectura clara.

Prioriza:
- cabeza grande y cara de rasgos mínimos;
- pelo volumétrico hecho con un casquete, masa posterior y mechones escalonados;
- torso compacto, prendas construidas con cajas y acentos de color limitados;
- manos y botas anchas, con suelas diferenciadas;
- pocos detalles grandes/medianos/pequeños y aristas predominantemente rectas;
- material mate y luz suave que describa los planos.

Primero crea una silueta monocroma, después cabeza/cara/pelo, después ropa/equipo, después paleta, luego pivotes y animación. Valida frontal, perfil y tres cuartos.

No copies el personaje de referencia ni reutilices modelos, texturas o assets propietarios. Usa la imagen únicamente para estudiar proporciones, bloques, paleta y jerarquía visual general. Explica todas las medidas como parámetros ajustables, no como especificaciones oficiales.

Para Three.js, inspecciona primero el proyecto existente, respeta su versión y arquitectura, reutiliza materiales/geometrías, conserva el bucle de render existente y documenta pruebas reales y limitaciones.
```

## 19. Glosario

- **Voxel:** unidad discreta de volumen, normalmente una celda cúbica.
- **Bloque estilizado:** prisma 3D que mantiene una estética cúbica, aunque pueda abarcar varias celdas lógicas.
- **Blockout:** primer modelo de grandes volúmenes para validar proporciones y silueta.
- **Silueta:** contorno exterior que queda visible contra el fondo.
- **Pivote:** punto local que sirve como centro de rotación de una pieza o grupo.
- **Parenting:** relación padre-hijo en la que un objeto hereda las transformaciones del padre.
- **Socket/anclaje:** grupo vacío o transform de referencia al que se añade equipo intercambiable.
- **Draw call:** llamada de dibujo emitida durante el render; reducirlas puede ayudar cuando hay muchas piezas.
- **Instancing:** técnica para dibujar muchas copias de la misma geometría mediante transformaciones individuales.
- **Z-fighting:** parpadeo o patrón visual causado por superficies coplanares o casi coplanares.
- **Roughness:** parámetro que controla cuán amplio o definido es el reflejo de una superficie en materiales PBR.

## 20. Fuentes y recursos técnicos

Las fuentes técnicas explican herramientas y conceptos de modelado/render. No deben interpretarse como documentación oficial de las proporciones del personaje mostrado.

- **Sitio oficial de Cube World / Picroma:** https://picroma.com/index.html
- **Documentación de Three.js:** https://threejs.org/docs/
- **BoxGeometry:** https://threejs.org/docs/pages/BoxGeometry.html
- **Group:** https://threejs.org/docs/pages/Group.html
- **InstancedMesh:** https://threejs.org/docs/pages/InstancedMesh.html
- **Sistema de animación de Three.js:** https://threejs.org/manual/pages/animation-system.html
- **Blender Manual — parenting de objetos:** https://docs.blender.org/manual/en/5.0/scene_layout/object/editing/parent.html
- **Codrops — Turning 3D Models to Voxel Art with Three.js:** https://tympanus.net/codrops/2023/03/28/turning-3d-models-to-voxel-art-with-three-js/
- **Trove Art Guide (referencia comparativa, no fuente oficial de Cube World):** https://webcdn.triongames.com/trove/pdf/Trove_Art_Guide.pdf
- **Trovesaurus, guía comunitaria de estilo de Trove (referencia comparativa):** https://trovesaurus.com/page=3976

## 21. Resumen del proceso recomendado

1. Decide si vas a usar bloques estilizados de varios tamaños o voxels estrictos.
2. Fija una altura y una unidad de medida para todo el personaje.
3. Modela primero la silueta: cabeza, pelo como masa provisional, torso, manos y botas.
4. Ajusta las proporciones en frontal y perfil antes de añadir detalles.
5. Construye el pelo en capas y con pocos mechones grandes.
6. Simplifica la cara a ojos geométricos y solo los rasgos adicionales imprescindibles.
7. Resuelve ropa, cuello, cinturón, hebilla y suelas mediante volúmenes claros.
8. Define una paleta limitada y materiales mayoritariamente mates.
9. Crea pivotes y sockets antes de finalizar el detalle.
10. Prueba pose neutral, caminata y equipamiento desde la cámara final.
11. Optimiza después de medir: comparte materiales/geometrías y considera instancing cuando el caso lo justifique.
12. Usa la lista de control y registra las limitaciones que aún no se hayan verificado.

La regla más importante: **cada bloque visible debe ayudar a definir la silueta, el volumen, la identidad, el color o la función de una pieza**. Cuando un cubo no cumple ninguna de esas funciones, probablemente se puede eliminar.

---

# PARTE II — ESPECIFICACIÓN APLICADA AL PROYECTO «THE COURT»

La Parte I describe el lenguaje visual. Esta Parte II es la **especificación
real del proyecto**: qué se ha implementado, con qué parámetros, en qué archivo
y cómo comprobarlo. Todo lo que sigue está medido sobre el código y sobre
capturas del motor, no propuesto.

> **Regla de lectura.** Si algo de la Parte I contradice a la Parte II, manda la
> Parte II: son las decisiones tomadas después de medir el resultado en pantalla.

## 22. Contexto técnico real

| Dato | Valor |
|---|---|
| Motor | Three.js `0.170.0` (versión fijada, no se actualiza) |
| Lenguaje | TypeScript, Vite, sin framework de UI 3D |
| Construcción de geometría | **Motor voxel propio** (`VoxelWorld`), no modelos importados |
| Archivo del motor | `the-court/src/game/builders/util.ts` |
| Archivo del personaje | `the-court/src/game/builders/human.ts` |
| Archivo de props | `the-court/src/game/builders/props.ts` |
| Archivo de escenario | `the-court/src/game/builders/court.ts` |
| Archivo del plató de TV | `the-court/src/game/builders/tv.ts` |
| Voxelizadores de glTF | `the-court/src/game/builders/voxelize.ts` |

**Por qué geometría procedural y no modelos exportados.** El proyecto entero
—pista, gradas, props, personajes— se genera en código con `VoxelWorld`. Eso
permite que todo comparta material, culling de caras internas y oclusión de
ambiente. Un modelo exportado rompería esa unidad.

### 22.1 El motor voxel en dos reglas

1. **Culling de caras internas.** `VoxelWorld.build()` emite una cara sólo si la
   celda vecina está vacía. Un bloque macizo de 20³ celdas pasa de 96.000
   triángulos a ~2.400.
2. **Índice obligatorio.** La geometría se emite con `setIndex([0,1,2, 0,2,3])`
   por cara. **Sin índice, Three.js dibuja una `BufferGeometry` con
   `gl.TRIANGLES` y un quad de 4 vértices no se dibuja como quad**: sólo sale
   bien un triángulo de cada dos y el resto se cose entre caras distintas. Ese
   fue el bug que hacía que los modelos se vieran agujereados. Es la regla
   técnica más importante de todo el proyecto.

## 23. Sistema de escala: celdas de diseño

Cada elemento declara su **propia unidad de rejilla** según el detalle que
necesita. La unidad no es la misma para el suelo que para una cara, y eso es una
decisión, no un descuido: el grano fino sólo se aprovecha en formas curvas y
detalles pequeños; en masas planas cuesta triángulos sin cambiar la imagen.

| Elemento | Grano | Equivalente | Motivo medido |
|---|---:|---|---|
| Balón | 0,0129 m | 28 cubos de diámetro | Por debajo de ~24 cubos el contorno se ve a escalones |
| Personaje | 0,0185 m | 96 cubos de alto | Cabeza, cara y pelo necesitan celdas finas |
| Props de detalle (aro, red, tablero) | 0,03125 m | 3,125 cm | Detalle visible a la cámara de juego |
| Suelo de la pista (glTF) | 0,1 m | resolución nativa del modelo | Es la resolución real del archivo descargado |
| Props de masa (poste, túnel, plató, mesa) | 0,0625–0,125 m | 6–12 cm | Masas planas: el grano fino no se distingue |
| Gradas | 0,2 m | 20 cm | 46 m de ancho por 7 peldaños |
| Vegetación y rocas | 0,25 m | 25 cm | Objetos vistos a más de 20 m |

### 23.1 El patrón «celdas de diseño × D»

El cuerpo humano se dibuja en **48 celdas de diseño** (escala cómoda de ajustar
a mano) y luego cada celda de diseño se expande a un bloque de `D×D×D` celdas
reales. En `human.ts`:

```ts
export const CHAR_VOXEL = 0.0185;  // lado del voxel real
const D = 2;                        // cada celda de diseño = bloque 2x2x2
const u = (n: number): number => n * D * CHAR_VOXEL;   // celdas de diseño -> metros
```

El adaptador `designGrid()` traduce el dibujo a la rejilla real:

```ts
fillCells: (x0, y0, z0, x1, y1, z1, color) =>
  v.fillCells(x0*D, y0*D, z0*D, (x1+1)*D - 1, (y1+1)*D - 1, (z1+1)*D - 1, color),
```

**Ventaja:** se ajustan proporciones con números enteros pequeños y se obtiene
un modelo de 96 cubos de alto. **Regla:** nunca se escriben coordenadas a mano
en la rejilla real del personaje; todo pasa por `u()`.

## 24. Proporciones del personaje (especificación)

Reparto vertical en celdas de diseño, con `y = 0` en el suelo. Total **48**.

| Franja | Celdas | % de 48 | Contenido |
|---|---:|---:|---|
| `0 .. 2` | 3 | 6,3 % | Zapatilla (cuerpo, puntera, suela, cordones) |
| `3 .. 14` | 12 | 25,0 % | Pierna (calcetín, piel, rodillera) |
| `13 .. 19` | 7 | 14,6 % | Pantalón corto (cinturilla, franja lateral, perneras) |
| `20 .. 27` | 8 | 16,7 % | Torso (camiseta, hombreras, panel lateral, franja) |
| **`28 .. 47`** | **20** | **41,7 %** | **Cabeza + pelo** |

### 24.1 Ratios verificados en motor

Estos valores están **medidos sobre la geometría real** en el navegador, no
calculados a mano:

| Ratio | Objetivo | Medido | Estado |
|---|---:|---:|---|
| Cabeza + pelo / altura total | 35–45 % | **42,9 %** | ✓ |
| Ancho de cabeza / ancho de torso | 1,25–1,6× | **1,43×** | ✓ |
| Ancho de mano / ancho de cabeza | 30–40 % | **30 %** | ✓ |
| Altura total | ≈ 1,80 m | **1,813 m** | ✓ |

### 24.2 Anchos de referencia (celdas de diseño)

```ts
const HX = 9;   // semiancho de la cabeza  -> 18 celdas (0,666 m)
const HZ = 8;   // semiprofundidad        -> 16 celdas
const TX = 6;   // semiancho del torso    -> 12 celdas (0,444 m)
const TZ = 4;   // semiprofundidad        -> 8 celdas
```

**Aviso aprendido midiendo:** las hombreras deben sobresalir **una celda**, no
dos. Con dos, el torso quedaba tan ancho como la cabeza (ratio 1,13×) y el
personaje perdía la lectura de cabeza dominante. Una hombrera por lado deja el
torso en 14 celdas y el ratio en 1,43×.

### 24.3 Pivotes (contrato con la animación)

```ts
const C = {
  shoeTop: 3, hip: 15, shortsTop: 20,
  shoulder: 26, torsoTop: 28, headTop: 48,
} as const;
const HIP = u(C.hip);        // 0,555 m
const SHOULDER = u(C.shoulder); // 0,962 m
```

`animateHuman()` y `poseShoot()` no cambian al rediseñar el cuerpo: sólo
dependen de que los grupos `legL/legR` cuelguen de `C.hip` y `armL/armR` de
`C.shoulder`, y de que la geometría de cada miembro se escriba en **celdas
negativas hacia abajo** (local `y = 0` es la articulación).

## 25. Construcción de la cabeza y el pelo

### 25.1 Cabeza

Caja base de 18 × 14 × 16 celdas con las esquinas verticales recortadas
(`block(..., cut = 1)`), que es lo que separa un bloque «tallado» de un
ladrillo. Además se vacían las dos esquinas inferiores traseras para insinuar
mandíbula.

**Reparto de la cara** (sobre el plano frontal `z = HZ - 1 = 7`):

| Rasgo | Fila (celda) | Ancho | Nota |
|---|---:|---:|---|
| Boca | `chin + 1` | 6 | Franja de color, nunca curva |
| Nariz | `chin + 2 .. +3` | 2 | Bloque que **sobresale** una celda (`z = HZ`) |
| Ojos | `chin + 4 .. +6` | 4 cada uno | Blanco 4×3 con pupila 2×3, separados 4 celdas |
| Cejas | `chin + 6` y `+7` | 5 cada una | La derecha una celda más baja: enfado leve |
| Frente | `chin + 7 .. +11` | — | Piel libre hasta la línea del pelo |

**Error corregido dos veces:** las cejas caían **dentro de la línea del pelo**
(mismo color sobre mismo color) y desaparecían. La regla que lo evita: la línea
del pelo en el frente está en `capY = chin + 12`, y las cejas van **al menos dos
celdas por debajo**. Al mover el flequillo hay que volver a comprobarlo.

### 25.2 Pelo: cinco capas obligatorias

| Capa | Extensión | Función |
|---|---|---|
| 1. Masa trasera | `z = -HZ-2 .. -HZ-1`, `y = chin+4 .. crestY-1` | Sin ella el peinado es una fachada que no funciona de perfil |
| 2. Casquete | `y = capY .. crestY-1`, `z = -HZ-1 .. HZ-1` | **No avanza por delante del plano de la cara** |
| 3. Patillas | Sólo la **mitad trasera** del costado, desde media altura | Ver aviso abajo |
| 4. Flequillo | 3 bloques de alturas distintas en `z = HZ .. HZ+1` | La asimetría dominante del peinado |
| 5. Cresta | `y = crestY .. crestY+2` | El rasgo que se reconoce en silueta a tamaño icono |

**Aviso crítico sobre las patillas.** La primera versión las extendía por todo
el costado (`y = chin+4 .. capY+2`, `z = -HZ .. HZ-2`). Resultado medido: la
cabeza se leía como **un casco marrón macizo** de perfil y la oreja y la mejilla
desaparecían. La regla correcta:

```ts
// Sólo la mitad TRASERA del costado y desde media altura:
v.fillCells(-HX - 1, chin + 8, -HZ, -HX - 1, capY + 2, -1, hairAlt);
```

La oreja va en `x = ±(HX+1)`, `y = chin+3 .. chin+6`, `z = -2 .. 2`. Si una
patilla cubre esa franja, la oreja deja de existir visualmente.

### 25.3 Tono de sombra del pelo

`HumanOptions.hairAlt` da el tono de la masa trasera y las patillas. La guía
(§6.2 de la Parte I) limita el cabello a **base + sombra**; un tono distinto por
mechón convierte la cabeza en ruido. Nunca se usa `hairAlt` en el casquete ni en
el flequillo, que son las zonas que definen la silueta.

## 26. Ropa, extremidades y calzado

### 26.1 Camiseta (`torso`)

| Pieza | Color | Propósito |
|---|---|---|
| Cuerpo | `jersey` | Masa principal |
| Hombreras (1 celda por lado) | `jersey` | Da el ancho de hombros sin engordar el pecho |
| Panel lateral | `jerseyAlt` | Separa pecho y espalda; evita el bloque monocromo |
| Franja del pecho | `accent` | El detalle grande y legible |
| Cuello | `shoes` (tono claro) | Cierra la prenda contra el cuello |
| Bajos | `jerseyAlt` | Escalón de una celda que marca la cintura |

`HumanOptions.jerseyAlt` es obligatorio en la práctica: sin él la camiseta es un
bloque plano de un solo color.

### 26.2 Brazo

Cinco tramos con función propia: **manga** (`jersey`), **puño** (`accent`),
**antebrazo** (`skin`), **muñequera** (`accent`) y **mano**. La mano se modela
con `block(..., cut = 1)` y mide 6 celdas de ancho frente a las 4 del brazo, para
que cierre la silueta. El pulgar es **una sola pieza** en el lateral exterior.

### 26.3 Pierna y zapatilla

Cuatro capas: **calcetín** (`accent`), **piel**, **rodillera** (placa frontal,
nunca esfera) y **zapatilla**, que a su vez se descompone en cuerpo, puntera,
suela oscura, cordones y un refuerzo lateral de distinto color. La suela clara u
oscura es lo que permite reconocer el pie en una imagen pequeña.

## 27. Objetos esféricos: el balón

**Regla:** un objeto cuya forma característica es redonda no se representa con
un cubo. El balón se obtiene **voxelizando el modelo glTF descargado** con el
voxelizador de paridad de rayo:

```ts
const grid = (BALL.radius * BALL.visualScale * 2) / 28;  // 28 cubos de diámetro
const v = new VoxelWorld(grid);
voxelizeObject(v, glb, { grid, colorOf: (m) => m.material.color.getHex() });
```

- **28 cubos de diámetro** es el mínimo medido para que el contorno se lea
  redondo. Con 12 se veía a escalones.
- Diámetro final verificado en motor: **0,360 m**.
- Las costuras negras se conservan porque el voxelizador ordena las mallas de
  mayor a menor volumen: la costura (malla pequeña) se escribe después y gana la
  celda a la masa naranja.

El mismo criterio se aplica a **rocas, arbustos y copas de árbol**: se construyen
con `v.sphere()` a grano 0,25 m y se combinan **dos o tres masas escalonadas**,
nunca una sola bola.

## 28. Público y personajes secundarios

Antes cada espectador era **un cubo coloreado**. Ahora es una figura de cuatro
piezas montada con cuatro `InstancedMesh` que comparten la lista de asientos:
**4 llamadas de dibujo para todo el graderío**.

| Pieza | Tamaño | Variación |
|---|---|---|
| Cabeza | 0,24 × 0,24 × 0,22 | 5 tonos de piel |
| Pelo | 0,27 × 0,09 × 0,25 | 6 colores y altura variable (`0,7–1,4×`) |
| Torso | 0,26 × 0,32 × 0,20 | Paleta `CROWD_COLORS` |
| Brazos (2 por figura) | 0,08 × 0,24 × 0,08 | Bajados o **levantados** (20 % de la grada) |

Variación obligatoria por asiento: giro propio (`±0,3 rad`), giro de cabeza
(`±0,25 rad` adicional), escala (`0,9–1,1×`), desplazamiento (`±0,12 m`) y un
**16 % de asientos vacíos**. Una grada llena al 100 % parece un patrón, no un
público.

La cabeza va deliberadamente grande respecto al cuerpo: es la misma regla de
proporción que se aplica al jugador, sólo que a menor detalle porque se mira
desde lejos.

## 29. Escenario, terreno y decoración

### 29.1 Gradas

Anillo de **7 peldaños en los cuatro lados**, cada uno con huella horizontal y
contrahuella. Bandas de color por peldaño (bioma). Remate claro en el borde
interior para que el canto del escalón se lea.

**Error corregido:** la primera versión eran seis cajas de hasta 3,6 m de alto
apiladas en un solo lado. El frente de cada una era un muro: costaba 79.000
triángulos, la grada se leía como un muro y no rodeaba la pista.

### 29.2 Vegetación

Tres tipos con construcción propia, **nunca el mismo cubo**:

- **Árbol:** tronco con base ancha (`1,6×` el radio), **dos muñones de rama** en
  alturas distintas, y copa en **tres pisos decrecientes** de distinto tono.
- **Arbusto:** dos masas bajas solapadas.
- **Roca:** dos o tres masas escalonadas.

Distribución en anillo (`r = 24–66 m`, `z` comprimido a `0,75×`), con exclusión
explícita del recinto: `if (Math.abs(x) < 23 && Math.abs(z) < 17) continue;`

### 29.3 Terreno

Pradera de 180 × 180 m con textura pixel-art en **dos niveles de mancha**
(parcelas de 16 px + bloques finos de 4 px) y flores dispersas al 1,5 %. Con
mipmaps y `LinearMipmapLinearFilter`: es una superficie enorme vista en escorzo
y sin mipmaps parpadea en cuanto la cámara se mueve.

## 30. Materiales e iluminación

| Elemento | Material | Parámetros |
|---|---|---|
| Todo el voxel | `MeshStandardMaterial` con `vertexColors` | `roughness 0.92`, `metalness 0`, `flatShading false`, `side DoubleSide` |
| Oclusión de ambiente | Por vértice, calculada al construir | 4 niveles `[0.52, 0.70, 0.86, 1]` |
| Tinte de sombra | `0x6b6ad0` (violeta frío) | Se mezcla al 30 % en las esquinas ocluidas |
| Luces | Hemisférica (1,35) + direccional de relleno (0,55) + sol (2,0) con sombras | `normalBias 0.05` |

**Regla de la sombra teñida.** La oclusión no multiplica hacia negro: mezcla
hacia un violeta frío. Multiplicar hacia negro deja las zonas oscuras sucias y
sin vida; el tinte mantiene el volumen y la escena sigue siendo colorida.

**Regla de `normalBias`.** En superficies voxel hay que usar `normalBias`
(desplaza la muestra a lo largo de la normal del bloque), no sólo `bias`: con
`bias` aparece un patrón de tejas en las caras grandes de los postes.

## 31. Errores frecuentes en este proyecto (y su causa real)

| Síntoma | Causa real medida | Corrección |
|---|---|---|
| Los modelos se ven agujereados y se ve el fondo a través | `BufferGeometry` **sin índice**: Three.js dibuja con `gl.TRIANGLES` y un quad de 4 vértices no se dibuja como quad | `geo.setIndex([0,1,2, 0,2,3])` por cara |
| Franjas sin rellenar en una superficie plana | El rango de celdas se calculaba sólo con la caja del triángulo, y un triángulo justo en el borde entre dos capas daba rango **vacío** | Margen de 1 celda (`pad`) en el rango |
| Un modelo entero sale blanco | glTF sin `baseColorFactor`: el loader pone blanco puro, que no es una decisión de arte | Tratar `0xffffff` como ausencia de dato y usar el respaldo |
| El color de una celda es aleatorio según el archivo | Ganaba el **último** triángulo escrito; el orden del búfer de índices decidía | Prioridad por **distancia**: gana el triángulo más cercano |
| La página se cuelga al voxelizar | Un vértice con coordenada absurda genera una caja de billones de celdas | Guarda `MAX_CELLS_PER_TRIANGLE` y descartar avisando |
| La cabeza parece un casco marrón | Patillas extendidas por todo el costado | Sólo la mitad trasera, desde media altura |
| Las cejas desaparecen | Caen dentro de la línea del pelo, mismo color sobre mismo color | Al menos 2 celdas por debajo de `capY` |
| El torso y la cabeza tienen el mismo ancho | Hombreras de 2 celdas | 1 celda por lado |
| El balón tapa la cara del personaje | Se sostiene a 1,2 m, que con la cabeza nueva es altura de rostro | Altura de pecho (0,95 m) |
| La pista se lee como una isla flotante | Terreno de alrededor del mismo azul que el cielo | Pradera de 180 m con horizonte |

## 32. Lista de comprobación del proyecto

### Proporciones (medir en motor, no estimar)

- [ ] Cabeza + pelo entre el 35 % y el 45 % de la altura total.
- [ ] Ancho de cabeza entre 1,25× y 1,6× el ancho del torso.
- [ ] Ancho de mano entre el 30 % y el 40 % del ancho de la cabeza.
- [ ] Ninguna parte del pelo cubre los ojos ni las cejas.
- [ ] La oreja queda visible: ninguna patilla cubre su franja.

### Geometría

- [ ] Toda `BufferGeometry` emitida tiene índice.
- [ ] Ninguna superficie plana se voxeliza sin margen de celda.
- [ ] Cada objeto esférico son 2–3 masas escalonadas o 24+ cubos de diámetro.
- [ ] El público tiene cabeza, pelo, torso y brazos diferenciados.
- [ ] La vegetación usa tronco, ramas y copa por pisos.

### Integración

- [ ] `npx tsc --noEmit` sin errores.
- [ ] `npm test` en verde (13 pruebas de física).
- [ ] El juego alcanza `modo: play`.
- [ ] Los pivotes de cadera y hombro no han cambiado de nombre ni de contrato.
- [ ] Ningún objeto tapa la cara del personaje desde la cámara de juego.

### Límites conocidos del entorno de prueba

- El navegador de pruebas usa **SwiftShader** (renderizado por software). Con
  ~670.000 triángulos tarda decenas de segundos por fotograma: **cualquier
  medición de FPS o de fluidez hecha aquí no es representativa**. Las capturas
  de validación sí son válidas porque se toman del búfer ya renderizado.

---

## 33. Revisión de proporciones: segunda iteración

Tras la primera pasada, el propietario señaló que **las extremidades y el torso
seguían siendo grandes respecto a la cabeza**. Se recortaron otra vez. Valores
definitivos, medidos en motor:

| Módulo | 1.ª iteración | **2.ª iteración** | Medido |
|---|---:|---:|---:|
| Cabeza + pelo / altura | 42,9 % | **48,9 %** | ✓ |
| Torso (celdas de diseño) | 8 | **9** | 0,329 m |
| Pierna | 0,592 m | **0,481 m** | −19 % |
| Brazo | 0,592 m | **0,498 m** | −16 % |
| Ancho cabeza / torso | 1,43× | **1,42×** | ✓ |
| Altura total | 1,813 m | **1,818 m** | ✓ |

Reparto vertical vigente (`C` en `human.ts`):

```ts
const C = {
  shoeTop: 3, hip: 12, shortsTop: 17,
  shoulder: 22, torsoTop: 25, headTop: 48,
} as const;
```

**Nota sobre la guía.** La Parte I propone 35–45 % de cabeza. El proyecto está
en **48,9 %**, por encima de ese rango. Es una decisión deliberada: Cube World
lleva la cabeza a cerca de la mitad del personaje y el propietario pidió
explícitamente esa dirección. La regla vigente del proyecto es **45–50 %**.

### 33.1 Consecuencia sobre los brazos

Acortar el brazo a 12 celdas cambia `HAND_LOCAL_Y`:

```ts
export const HAND_LOCAL_Y = 10.5 * D * CHAR_VOXEL;  // 0,389 m
```

Si se vuelve a cambiar la longitud del brazo, **hay que actualizar esta
constante**: es la que usan los anclajes que cuelgan objetos de la mano.

## 34. Balón: construcción definitiva

| Decisión | Valor | Motivo medido |
|---|---|---|
| Diámetro | **36 cubos** | Con 28 el contorno aún se veía facetado; con 12, a escalones |
| Forma | Voxelizada del glTF del propietario | Es su asset y respeta el encargo |
| Costuras | **Pintadas encima**, no las del modelo | El glTF trae dos bandas en cruz: eso no es un balón |
| Patrón | 1 ecuador + 2 meridianos | El dibujo que hace que cualquier silueta se lea como balón |
| Color de costura | `0x241708` | Casi negro, nunca negro puro |
| Recorrido | Sólo la **corteza** (`d² > (R − 1,9·s)²`) | El interior no se ve: pintarlo es gastar celdas |

```ts
const grid = (R * 2) / 36;
// …voxelizar el glTF…
// …luego repintar la corteza sobre los tres anillos:
if (Math.abs(y) < w || Math.abs(x) < w || Math.abs(z) < w) v.putCell(i, j, k, 0x241708);
```

**Regla general para objetos esféricos:** la forma puede venir de un asset, pero
si el asset no trae el dibujo característico del objeto, **se pinta encima**.
Un balón sin sus costuras es una naranja.

## 35. Anclaje del balón durante el tiro

**Bug corregido.** El balón se colocaba en `y = 1,9 m` fijo. Con la cabeza nueva
(el pelo llega a 1,818 m) eso son **9 cm por encima del personaje**: el balón
flotaba suelto sobre la cabeza, separado de las manos.

**Solución vigente:** anclaje al **eje del jugador**, no a las manos.

```ts
x += f.x * 0.44;   // f = vector frontal del jugador
y = 0.99;          // altura de pecho
z += f.z * 0.44;
```

**Por qué no a las manos.** Se probó a leer la posición mundial de las dos
manos desde el rig (`handWorld`). Ambas devolvían la misma posición y el balón
salía pegado a un solo brazo. El anclaje al eje es determinista, siempre queda
centrado y las manos se cierran alrededor porque la pose de tiro las lleva justo
ahí.

**La pose de tiro se contiene a propósito:**

```ts
const a = -1.2 - k * 0.75;   // −1,2 a −1,95 rad
```

Subir más los brazos lleva el balón a la altura del rostro y, con una cabeza que
ocupa la mitad del personaje, **lo tapa entero**. Con la cabeza grande, la pose
de tiro tiene que ser más baja que en un personaje de proporción realista.

## 36. Público: segunda iteración

El propietario señaló que las figuras se veían **muy pequeñas en proporción al
jugador**. Medición: medían 0,6 m frente a los 1,818 m del jugador — un tercio.

| Parámetro | Antes | **Ahora** |
|---|---:|---:|
| Altura sentado | 0,60 m | **1,10 m** (60 % del jugador) |
| Cabeza | 0,24 m | **0,42 × 0,40 × 0,36** |
| Piezas | 4 | **5** (se añaden los muslos) |
| Separación entre asientos | 0,70 m | **0,95 m** |

La cabeza se lleva 0,40 m de los 1,10 m: **la misma proporción dominante que el
personaje jugable**, que es lo que hace que el público parezca del mismo mundo y
no una multitud de otro juego.

Los muslos van hacia delante porque el espectador está **sentado**; sin ellos la
figura parece flotar sobre el peldaño.

## 37. Animaciones

`animateHuman` es un único punto de entrada con la velocidad como parámetro, para
que no haya dos animaciones peleándose por los mismos huesos.

| Estado | Qué se mueve |
|---|---|
| **Reposo** | Respiración (`sin(t·1,7)`), balanceo corto de brazos, cabeceo del torso (`sin(t·0,6)`) |
| **Caminar / correr** | Zancada y braceo en oposición, rebote del cuerpo |
| **Sujetando el balón** | Brazos cerrados al pecho |
| **En el aire** | Piernas recogidas y brazos arriba: sin esto el salto parece un ascensor |
| **Tiro** (`poseShoot`) | Brazos arriba contenidos + inclinación del torso |
| **Celebración** (`poseCelebrate`) | Brazos en alto y saltos, 1,6 s tras anotar |

`speed01` interpola entre reposo y carrera, así que la transición es continua y
no hay saltos de pose al empezar a moverse.

**Regla:** un personaje perfectamente quieto parece una estatua. Siempre debe
haber algo que se mueva aunque sea 6 mm.

## 38. Pendiente declarado

- **Detalle de props**: canastas, mesa de anotadores, banquillo, túnel y plató
  siguen con el nivel de detalle de la primera pasada. Es el trabajo que queda.
- Optimizar el suelo de la pista (~76.000 triángulos recuperables).
- Voxelizar las gradas del glTF descargado.
- `public/og.png` y `VITE_FORM_ENDPOINT`.
- **FPS en GPU real**: el entorno de pruebas usa SwiftShader.

---

## 39. Tercera iteración: proporciones finales y pendientes cerrados

### 39.1 Proporciones definitivas

| Módulo | 2.ª iteración | **3.ª iteración** | Regla |
|---|---:|---:|---|
| Cabeza + pelo / altura | 48,9 % | **53,2 %** | Sube |
| Torso | 0,329 m | **0,298 m** | Se recorta |
| Pierna | 0,481 m | **0,444 m** | Se recorta |
| Brazo | 0,498 m | **0,423 m** | Se recorta |
| **Mano** | 0,222 m | **0,239 m** | **NO se recorta** |
| **Pie** | 3 celdas | **3 celdas** | **NO se recorta** |
| Ancho cabeza / torso | 1,42× | **1,40×** | Se mantiene |
| Altura total | 1,818 m | **1,809 m** | Se mantiene |

**La regla que gobierna esto:** al recortar el torso y los tramos de las
extremidades, **las manos y los pies conservan su tamaño**. Al acortar el brazo,
la mano gana peso relativo, y esa es exactamente la lectura de Cube World:
muñones cortos con manos y botas grandes. Es la versión extrema del principio
«exagerar manos y calzado» de la Parte I.

```ts
const C = {
  shoeTop: 3,   // pie: SIN recortar
  hip: 11, shortsTop: 16, shoulder: 21, torsoTop: 23, headTop: 48,
} as const;
```

Brazo en 10 celdas de diseño: manga 2, puño 1, antebrazo 3, muñequera 1 y
**mano 3**. `HAND_LOCAL_Y = 8.5`.

**Nota sobre el rango de la guía.** La Parte I propone 35–45 % de cabeza. El
proyecto está en **53,2 %**. Es una decisión del propietario, no un error de
medición: la regla vigente del proyecto es **50–55 %**.

### 39.2 Balón definitivo

| Parámetro | Valor |
|---|---|
| Diámetro | **48 cubos** (antes 28, luego 36) |
| Grosor de costura | **1,6 × celda** (antes 1,05: no se distinguía a distancia) |
| Patrón | 1 ecuador + 2 meridianos, pintados sobre la corteza |
| Triángulos | 44.032 |

**Regla de grosor de costura:** una costura de una celda desaparece en cuanto el
balón baja de ~80 px en pantalla. Hay que pintarla de **1,5 a 2 celdas** para que
el patrón se lea a la distancia de cámara del juego.

### 39.3 Anclaje del balón, versión final

| Momento | Posición |
|---|---|
| En reposo | `y = 0,78` y `0,52 m` al frente |
| Cargando el tiro | `y = 0,86` y `0,50 m` al frente |

Con la cabeza al 53 % de la altura, **el torso queda entre 0,55 y 0,85 m y la
cabeza empieza justo ahí**. Cualquier altura por encima de 0,85 pone el balón en
la franja del rostro. La regla: **el balón sostenido nunca sube de 0,86 m**.

### 39.4 El bug del suelo de la pista (resuelto)

El suelo emitía **80.397 caras donde sólo caben 42.000**. Causa: el voxelizador
marca **dos capas** de celdas porque el plano de la cancha cae justo en el borde
entre ellas, y `flatTop` emite la cara superior de las dos. Borrar sólo la capa
`-1` no bastaba.

```ts
// Vaciar TODO lo que no sea la capa 0, por arriba y por abajo:
vw.eraseCells(-hx - 4, -60, -hz - 4, hx + 3, -1, hz + 3);
vw.eraseCells(-hx - 4, 1, -hz - 4, hx + 3, 60, hz + 3);
```

**Resultado: 160.794 → 84.000 triángulos.** Regla general: cuando una superficie
plana se voxeliza, **comprobar el número de capas antes de construir**; el
`flatTop` no protege contra capas múltiples.

### 39.5 Pendientes cerrados en esta iteración

- **Canasta**: base con refuerzos y pernos, poste por tramos con collares,
  cartela, tres tornapuntas, marco perimetral del tablero, protector inferior,
  escuadra del aro y red de 12 hilos con dos aros.
- **Mesa de anotadores**: monitor encendido, teclado, papeles, dos vasos, dos
  sillas de anotador, cables y faldón frontal.
- **Banquillo**: asiento por lamas, respaldo con remate, patas con pie, bolsa
  con cremallera, toallas, nevera y botellas.
- **Túnel**: marco que sobresale del muro, jambas y dintel en tono claro,
  interior con dos escalones de profundidad, rótulo con pictograma, aros de
  señalización, marcas de suelo y dos focos.
- **Torres de luz**: zapata con refuerzos, mástil por tramos con anillos,
  tirantes en aspa y cabezal de 3×2 focos con visera.
- **`public/og.png`** (1200 × 630) generado desde la cámara real del juego.
- **`.env.example`** documentando `VITE_FORM_ENDPOINT`.

### 39.6 Pendiente

- Voxelizar las gradas del glTF descargado. Se intentó con recorte y **bloqueaba
  el hilo principal**: sus caras son enormes y hay que **subdividir los
  triángulos grandes antes de rasterizar**. No se ha hecho.
- **FPS en GPU real**: el entorno de pruebas usa SwiftShader.
