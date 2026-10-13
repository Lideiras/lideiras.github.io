# THE COURT — Auditoría y plan de mejoras

> **Fecha:** 13 oct 2026 · **Alcance:** `the-court/` (motor, escena, HUD, menús, carga, jugabilidad)
> **Método:** lectura del código + ejecución real en navegador (GPU integrada Intel HD 4600, ANGLE/D3D11), capturas a 1440×900 y 828×1033, y sondas en vivo sobre la escena (`window.__court`, disponible solo en dev).
> **Veredicto en una línea:** el motor voxel y la identidad visual están bien construidos y medidos; lo que falta es **coherencia de dirección de arte** (un solo criterio de luz, techo, materiales), **limpieza de defectos visibles concretos** y **recortar el coste que hoy no se ve** (el pase de sombras es más caro que la escena visible).

---

## 0. Resumen ejecutivo

### Lo que ya está bien (no tocar sin motivo)

| Área | Estado |
|---|---|
| Motor voxel propio (`VoxelWorld`): culling de caras internas, AO por vértice, una malla por color | Correcto y con tests de estanqueidad (`watertight`, `tightness`) |
| Física del tiro y del balón | 65 tests en 6 ficheros, `npm test` verde |
| Contenido bilingüe con validación estricta (`validate --strict`) y versión clásica generada | Flujo sólido, imposible desplegar a medias |
| UI en DOM (no en canvas) con roles, `aria-live` de avisos, foco gestionado, `prefers-reduced-motion` en CSS | Base accesible mejor que la media |
| Teclado + joystick táctil + salto + celebración + cambio de mano por giro | Buen nivel de detalle para un portfolio |
| Etiquetas de rumbo con flecha y distancia (siempre en pantalla) | Idea excelente; la ejecución tiene 2 defectos (D4) |

### Los 12 hallazgos con más impacto

| # | Hallazgo | Evidencia medida | Impacto | Esfuerzo |
|---|---|---|---|---|
| 1 | **El pase de sombras cuesta más que toda la escena visible** → **YA IMPLEMENTADO, ver §12** | 173 draw calls y **367.480 triángulos solo en el shadow map**, frente a 49 calls / 339.064 tri del pase visible. Total 222 calls / **706.544 tri/frame** (medido con contador a nivel de WebGL, no con `renderer.info`, que no cuenta ese pase) | Muy alto | 2–3 h |
| 2 | **El balón se renderiza marrón oscuro/casi negro**, no naranja | Atributo `color` del balón en escena: `#3d1304`, `#37120b`, `#000001`. Origen: el `.glb` trae `BasketBall1_1 #864d24` y `BasketBall1_2 #01050b`, y `colorOf` usa el color del material en vez de `PALETTE.ball` (`#ff7a1a`) | Muy alto (es el objeto que más se mira) | 30 min |
| 3 | **Cuadro de tiro del tablero dibujado en la cara de atrás** + z-fighting del brazo con el tablero | Dos caras coplanares en `x = −12,75` (`hoopStructL` y `hoopFineL`) en el mismo punto; el raycast devuelve ambas a 2,213 m. En pantalla: mancha punteada en el tablero | Alto (visible en la sección Proyectos) | 1 h |
| 4 | **Cartel de la mesa de anotadores sale negro desde la pista** | Cara pintada en `z+0,34…z+0,38`, placa en `z+0,36…z+0,44`: la placa tapa la pintura desde el lado de la cancha | Alto | 15 min |
| 5 | **Etiquetas recortadas y solapadas** | A 828 px: 3 de 6 fuera de pantalla (`Proyectos` −29 px, `Experiencia` −22 px, `Entrevístame` +28 px). A 1440 px: `Skills/Stats` × `Experiencia` se solapan | Alto | 1–2 h |
| 6 | **El encuadre de la entrevista es un plano sucio** | La cámara queda detrás de la cámara de TV y del operador; sus cabezas llenan media pantalla; el reportero y el micro no se ven | Alto | 2 h |
| 7 | **No hay colisiones**: se atraviesa banquillo, mesa, poste de canasta, plató y personas | `PLAYER.bounds` es un rectángulo; no existe lista de obstáculos | Alto (rompe la ilusión) | 3–4 h |
| 8 | **Silkscreen no tiene minúsculas: el 100 % del texto sale en MAYÚSCULAS** | `'A'` y `'a'` renderizan bit a bit idénticos (diff = 0 px); el control con monoespaciada da 276 px de diferencia. Los párrafos largos de los paneles van en mayúsculas | Alto (legibilidad) | 2–3 h |
| 9 | **Se envían 480 KB de Inter que no se usa** (fuentes `unloaded`, nunca aplicadas) y 308 KB de `.woff` de respaldo | `dist/assets/inter-*` = 480 KB; `*.woff` = 308 KB | Medio | 30 min |
| 10 | **La carga inicial son ~9 MB, de los que 7,8 MB son un modelo que aporta 2 colores planos** | `voxel-court.glb` = 7.803.792 B; su suelo (`Object_2`) es una paleta de 256×1 px con 2 tonos; el suelo voxelizado resultante son 43.094 celdas y **3 colores** | Alto (primera impresión / móvil) | 3–4 h |
| 11 | **El pabellón no tiene techo**, pero la iluminación dice «interior» y el entorno incluye árboles, pradera y niebla | Capturas: vegetación por encima de las gradas, horizonte visible, `scene.background` sólido `#101a2c` + `Fog(0x1e2a44, 38, 96)` | Medio-alto (coherencia) | 4–6 h |
| 12 | **La calidad adaptativa es código muerto en pantallas 1×** y nunca vuelve a subir | `slowFrames > 90 && pixelRatio > 1`; con `devicePixelRatio = 1` el arranque deja `pixelRatio = 1` y la condición no se cumple jamás | Medio | 1 h |

---

## 1. Método y evidencia (con sus límites)

* **Entorno:** navegador real del panel de preview → `ANGLE (Intel, Intel HD Graphics 4600, D3D11)`. Nada de SwiftShader: las capturas y las cifras son de una GPU real (integrada de 2013, el peor caso razonable en portátil).
* **Medidas directas** (no estimaciones): `renderer.info`, recorrido del grafo de escena (triángulos y mallas por grupo), atributos de geometría (`color`), `getBoundingClientRect()` de las etiquetas, `document.fonts`, tiempos de `console.info` del propio juego y tamaños de `dist/`.
* **Límite honesto:** el bucle se quedó clavado en **33,4 ms (30 fps)** con mediana estable y **bajó a 33,3 ms al reducir la resolución a la mitad** (pixelRatio 0,5). Es decir, el techo de 30 fps es del compositor/superficie del panel, **no** de la GPU, así que desde aquí **no se puede certificar el margen real de FPS en GPU**. Todo lo demás (triángulos por pase, draw calls, colores, geometría, solapes de UI) sí son mediciones válidas.
* **No medido / pendiente:** FPS en móvil real, comportamiento en Safari/iOS, memoria de GPU, tiempo de carga en red lenta (medido sobre disco local: `voxel-court.glb` tarda 88 ms).

### Cifras de partida (para comparar cualquier mejora)

| Métrica | Valor medido |
|---|---|
| Triángulos en la escena | **589.604** |
| Pase visible | 49 draw calls · 339.064 triángulos |
| Pase de sombras | 173 draw calls · 367.480 triángulos |
| Total por fotograma | **222 draw calls · 706.544 triángulos** |
| Mallas / materiales únicos | **193 / 193** (un material por malla, casi todos clones idénticos). Tras el §12: 193 / 18 |
| Programas / texturas | 7 / 4 |
| Luces | 8 (1 `DirectionalLight` con sombras `2048²`, 4 de torre, 1 rebote, 1 relleno, 1 hemisférica) |
| Personaje | **42.036 triángulos** cada humano (jugador, reportero, operador = 126 k) |
| Público | 988 asientos · 82.992 tri en 5 `InstancedMesh` |
| Gradas (con público) | 189.656 tri |
| Suelo de la pista (glTF voxelizado) | 43.094 celdas a 0,1 m · grupo de 84.000 tri (malla grande 83.476) · **3 colores** |
| Tiempos de construcción | stands 464 ms · boards 43 ms · torres 20 ms · vegetación 107 ms (≈ 634 ms, más el voxelizado y los humanos) |
| `dist/` | 9,0 MB · `main.js` 648 kB (177 kB gzip) · CSS 32,9 kB (14,6 kB gzip) · modelos 7,87 MB · fuentes 780 kB |
| Tests | 65/65 verde en 6 ficheros |

---

## 2. Defectos verificados (con reproducción)

### D1 · El balón es marrón oscuro (casi negro)

**Repro:** jugar; en la vista de entrevista el balón se ve marrón; en escena, `window.__court.scene.getObjectByName('ball')` tiene colores `#3d1304`, `#37120b`, `#2c111a` y una malla negra (`#000001`).
**Causa:** `createBallMesh()` usa `colorOf: (m) => mat?.color?.getHex() ?? PALETTE.ball`. El `.glb` trae `#864d24` y `#01050b`, así que la paleta nunca entra; después `shadeColor()` (AO) lo oscurece aún más.
**Arreglo:** priorizar `PALETTE.ball` para la corteza y tratar el material oscuro del glTF como costura (`#9c4f18`), o subir el color del material a `#ff7a1a` al vuelo. Añadir un test que afirme que el color medio de la corteza está por encima de cierta luminancia.

### D2 · Cuadro de tiro al revés + z-fighting en el tablero

**Repro:** sección Proyectos (cámara del plano) → el tablero muestra una mancha punteada/moiré en el centro.
**Evidencia:** raycast a la pantalla: dos impactos **a la misma distancia 2,213 m y el mismo punto (−12,75; 3,316; 0,022)**, uno de `hoopStructL` y otro de `hoopFineL`, ambos con normal `+x` → superficies coplanares.
**Causa 1 (z-fighting):** el brazo horizontal (`lo → hi`, grano 0,0625) termina su última celda exactamente en `x = −12,75`, que es también la cara frontal del tablero (`span` redondea hacia fuera: celdas −411…−409).
**Causa 2 (cuadro al revés):** `const f = side * (t + s * 0.6)` → para `side = −1` desplaza a `x = −12,85`, es decir al lado de las gradas. Debe ser `−side`.
**Arreglo:** recortar el brazo 2 celdas antes del tablero (o desplazarlo ¼ de voxel), y pintar el cuadro sobre la cara que mira a la pista. Verificar con el raycast del propio `__court.clearShot` antes/después.

### D3 · El cartel de la mesa de anotadores se ve negro desde la pista

**Repro:** sección Skills (cámara de la mesa) → la placa aparece como un rectángulo negro de 1,8 × 0,54 m.
**Causa:** placa `z+0,36…z+0,44` y cara pintada `z+0,34…z+0,38`: la pintura queda **detrás** de la placa respecto a la cancha (`+z`). Igual que el rótulo del túnel: conviene una función `signPanel(z, facing)` que garantice el lado.

### D4 · Etiquetas: recorte por borde y solapes entre ellas

**Repro:** cualquier visita con la ventana estrecha (828 px): `Proyectos` (−29 px), `Experiencia` (−22 px) y `Entrevístame` (+28 px). A 1440 px: `Skills/Stats` × `Experiencia` solapadas.
**Causa:** `placeLabel()` clampa el **punto de anclaje** al rectángulo del 84 % y luego aplica `translate(-50%, …)`, sin conocer el tamaño real de la etiqueta; y no hay separación entre etiquetas.
**Arreglo:** (a) medir `offsetWidth/offsetHeight` y clampar por caja completa (`clamp(x, w/2+8, W−w/2−8)`); (b) repartir las etiquetas de borde en «carriles» (ordenar por ángulo y separar en Y o X) o dibujarlas en un `rail` flex en cada borde; (c) prueba automática: todas las etiquetas dentro del viewport y sin intersección (hoy fallaría).

### D5 · Encuadre de la entrevista

**Repro:** entrar en la zona de Contacto y pulsar `E`. La cámara (`INTERVIEW.cameraPos = [5.4, 2.1, 8.9]`, `look = [9.2, 1.3, 9.0]`) deja delante **la cámara de TV, el trípode y el operador** (cuyas cabezas ocupan media pantalla), y ni el reportero ni el micro entran en el plano. El panel tapa la otra mitad.
**Arreglo:** plano a dos (reportero + jugador) en perfil de tres cuartos, con la cámara de TV y el cartel ON AIR a un lado del encuadre; comprobar con `clearShot()` que la línea cámara↔(jugador+reportero) está limpia y que el sujeto no queda bajo el panel (regla: sujeto en el 60 % opuesto al panel).

### D6 · No existe colisión con nada

`PLAYER.bounds` = rectángulo `x ∈ [−16, 16], z ∈ [−8,8, 10,6]`. Se puede caminar **a través** del banquillo, la mesa de anotadores, el poste de la canasta, las personas del plató y el decorado. También se puede atravesar la pista por debajo/a través de props a altura de suelo.
**Arreglo mínimo (2 h):** lista de cajas AABB (`{min, max}`) para postes, banquillo, mesa, jambas del túnel, plató y personas; resolver con separación círculo–AABB (radio 0,35 m) en `update()`. Reutilizar `SCORER_TABLE`, `COURT`, y las posiciones de `tv.ts` como fuente de datos en vez de duplicarlas.

### D7 · Calidad adaptativa inerte a 1× y sin retorno

`slowFrames > 90 && pixelRatio > 1` → en un portátil `devicePixelRatio = 1` la condición nunca se cumple (medido: `pixelRatio = 1`, `devicePixelRatio = 1`). Además nunca vuelve a subir.
**Arreglo:** medir el **tiempo medio** de fotograma en una ventana de 2 s y oscilar entre niveles de calidad (0,6 → 1,0) ajustando además `shadowMap.mapSize`, `antialias` y densidad del público; exponer un `<select>` de calidad en Ajustes.

### D8 · Todo el texto en mayúsculas (Silkscreen no tiene minúsculas)

**Evidencia:** con `40px Silkscreen`, el render de `'a'` y de `'A'` es idéntico (0 px de diferencia); con monoespaciada, 276 px. `text-transform: none` en el CSS. Los párrafos de los paneles (16 px, varias líneas) son todo mayúsculas.
**Arreglo:** tipografía de cuerpo con minúsculas reales. `Inter` ya está instalado (y hoy no se usa): úsalo para `.panel__body p`, `.card p`, `form`, y reserva Silkscreen para títulos, menú, HUD y etiquetas. Alternativa: cambiar a una pixel con minúsculas (evaluar antes de decidir; hay que mantener la estética).

### D9 · Fuentes que se envían y no se usan

`@fontsource/inter/400.css` y `/700.css` se importan en `boot.ts` pero nunca se aplican (todas las declaraciones quedan `unloaded`): 480 KB en `dist/`. Y se emiten 308 KB de `.woff` de respaldo, que en 2026 nadie necesita.
**Arreglo:** o se usa Inter para el cuerpo (D8) y se reducen los subsets a `latin`/`latin-ext`, o se quita del bundle. `@fontsource/*/latin.css` recorta subsets.

### D10 · El pase de sombras es el elemento más caro y no se ve

Con la luz clave **vertical** (`position (1.5, 42, 3)`, objetivo por defecto), cada objeto esconde su propia sombra debajo: en las capturas **no hay ni una sombra proyectada** (banquillo, canasta, público, jugador). Se comprobó moviendo la luz a `(24, 12, 16)`: entonces sí aparecen sombras duras correctas (postes sobre el parqué, sombra del jugador) → la tubería funciona, la dirección de la luz la anula.
**Arreglo:** leer §4.

### D11 · El «pabellón» no tiene techo

El comentario del render dice «Techo del pabellón, no cielo… dentro no se ve el exterior» y la iluminación se declara de interior, pero **no hay geometría de techo**: se ven un horizonte sólido, una pradera pixel-art, árboles/rocas por encima de las gradas y niebla a 38–96 m. Es la incoherencia de dirección de arte más visible.
**Dos caminos (elegir uno, no los dos):**
1. **Pabellón cubierto de verdad:** cerchas, focos colgados, cubierta con paneles, marcador central suspendido, banderines, muros perimetrales; el fondo pasa a ser una pared/viga, no un cielo; la niebla se apaga o se cambia por un velo suave; los árboles y la pradera se retiran (o se ven por aberturas y no por encima de las gradas).
2. **Cancha exterior:** sol direccional bajo con sombras largas, cielo con degradado + nubes en canvas, sin niebla artificial, vegetación coherente. Es más barato y es donde el proyecto ya apunta de facto.

### D12 · Menores (rápidos)

* `styles.css`: `.label--locked { background: var(--ink, #6b7280) }` usa una variable **que no existe** (`--ink` no está definida) → siempre cae al gris de respaldo.
* Código muerto: `src/game/characterGlb.ts` completo, `assets.createLoadingManager`, `assets.firstMesh`, y en `util.ts` `mat()`, `box()`, `cylBetween()` ya no se usan (el `mat` de `court.ts` es otra función local).
* Comentarios corruptos de sesiones anteriores: «seIció el lado», «criteris», «se leerá como»→«se leerá», «paraSizes», «que growan», «hay que.leer», «ELSE se desplaza», «y y entrar», «accelering», «retiring», «grana GRUESO». Hay además duplicación de bloques de comentario (el de «ILUMINACIÓN…» y el de `drawFloor`) que conviene comprimir.
* `BITACORA.md`: la tabla de estado dice «13 tests» (fase F3); hoy hay **65**. Conviene regenerar la tabla, que es la primera cosa que lee cualquier agente que retome el proyecto.

---

## 3. Rendimiento: plan con efecto esperado

Ordenado por relación beneficio/riesgo. Lo primero es **gratis** (no cambia la imagen) y ya está cuantificado.

| # | Acción | Efecto esperado | Riesgo |
|---|---|---|---|
| 1 | **Sombras estáticas horneadas**: `renderer.shadowMap.autoUpdate = false` + `needsUpdate = true` solo cuando cambie algo (o cada N fotogramas si el público se anima). Segundo mapa pequeño (512²) solo para jugador + balón | −173 draw calls y −367 k tri/frame → **706 k → 339 k tri y 222 → ~55 calls**. Es el mayor recorte disponible | Medio: hay que decidir qué es dinámico |
| 2 | `castShadow = false` en lo que no proyecta dentro de la pista: `stands`, `scatter`, `lightTowers`, `boards`, `court-floor` | −~200 k tri del mapa de sombras aunque se deje `autoUpdate` | Bajo |
| 3 | **Encoger la cámara de sombras** de ±24×±20 a ~±17×±10 (o seguir al jugador) y bajar `far` de 90 a ~55 | Sombras más nítidas (de 2,3 cm/texel a ~1,6) sin subir el mapa | Bajo |
| 4 | **Un solo material compartido** para todas las mallas voxel (hoy 193 materiales clonados con los mismos parámetros: `vertexColors`, `roughness 0.92`, `metalness 0`, `DoubleSide`) | Menos cambios de estado; menos memoria; el mismo resultado píxel a píxel | Muy bajo |
| 5 | **Reducir el grano del personaje** de 0,0185 m (≈98 cubos de alto, 1,4 px por cubo a distancia de juego) a ~0,03–0,04 m | −50 %…−65 % de los 42 k tri de cada humano (126 k en escena), sin diferencia visible a la cámara de juego. Es **su propia regla**: «el grano se elige por tamaño en pantalla» (comentario del balón) | Bajo (revisar de cerca) |
| 6 | **Merja estática por sectores** (opcional): agrupar props de un mismo sector en una geometría con presupuesto espacial | Bajaría de 49 a ~10–15 calls visibles | Medio: se pierde culling fino; hacerlo por chunks de 8–12 m |
| 7 | **Presupuesto de calidad conmutable** en Ajustes (bajo/medio/alto) que toque: densidad del público, tamaño del mapa de sombras, pixel ratio máximo, niebla/vegetación | Permite 60 fps en portátil integrado y degradar en móvil | Bajo |
| 8 | **Carga**: quitar el `voxel-court.glb` (7,8 MB / 2 colores) o comprimirlo con Meshopt/Draco (−70 %…−90 %). Precarga de `ball.glb` con `<link rel="preload">`; `fetchpriority` | Primera carga de **~9 MB a ~1,2 MB** sin perder nada visible (el suelo procedural con parquet + líneas ya existe y es más rico) | Medio (decisión de arte del propietario) |
| 9 | Heredar mipmaps/anisotropía del suelo y `powerPreference` ya están bien; revisar `antialias: true` (MSAA) frente a un pase AA barato | Pocos ms en GPU integrada | Bajo |
| 10 | Culling: subir la escena fuera de cámara, pero **el suelo del glTF y las gradas están siempre en el frustum**; mover la vegetación a un `Group` con `matrixAutoUpdate = false` | Menos trabajo de CPU por frame (`updateMatrixWorld`) | Muy bajo |

> Nota: la medición de 30 fps de este entorno **no** sirve para decidir 1 vs 8; sí sirve para 1–4, que son recortes de geometría pura (medidos en triángulos y draw calls, no en fps).

---

## 4. Gráficos, iluminación y realismo

### 4.1 Iluminación: el cambio que más mueve la imagen

El pabellón tiene 8 luces y ninguna sombra visible; el resultado es plano y `MeshStandardMaterial` con `roughness 0.92` no tiene ninguna variación de material que dé información de forma. Propuesta:

1. **Inclinar la luz clave 20–25°** (`(9, 42, 12)`, `target (0,0,0)`) y bajar la hemisférica a ~0,35. Con eso cada objeto proyecta sombra fuera de su silueta → todo el mundo «se apoya» en el suelo. Es literalmente el cambio que se vio al probar la luz inclinada (sombra de los postes sobre el parqué y sombra del jugador).
2. **Sombra de contacto** (`blob shadow`) bajo jugador y balón: un quad con textura radial multiplicativa, siempre perpendicular al suelo, barato y **lo más eficaz para que el salto y el bote se lean**. Hoy el salto del tiro es prácticamente invisible.
3. **AO entre objetos** (hoy el AO es *por modelo*, no entre modelos): hornear una textura de AO en la pista (oscurecer 0,3–0,5 m alrededor de cada prop y en la base de las gradas) o generar un `AOmap`/decal por prop al construir. Cuesta una sola textura y da el 80 % del realismo.
4. **Reequilibrar intensidades**: 1 clave (1,4) + 1 de relleno cálido (0,35) + hemisférica baja (0,35) suele bastar. Menos luces = menos coste por fragmento y más contraste. Las 4 de torre se pueden colapsar en una sola direccional opuesta si no aportan dirección.
5. **Temperatura de color coherente**: focos de pabellón reales son 4000–5600 K; hoy todo es blanco cálido salvo el relleno azulado. Dar a cada familia un valor (~`0xfff2dc`, `0xe8f0ff`) y usarla también para los emisivos (focos de las torres, pantallas, tally, cartel ON AIR) mantiene el conjunto creíble.
6. **Sombras suaves por distancia** (PCF con `radius`) y `bias/normalBias` ya calibrados — pero revisar el `normalBias 0,06` al inclinar la luz (su comentario ya documenta que era para el patrón de tejas).

### 4.2 Materiales, color y post-proceso

* **Entorno (`PMREM` + `RoomEnvironment`)**: hoy no hay `scene.environment`. Es lo más barato para que los metales (postes, aros, torres) y los acabados pulidos (tablero, parqué barnizado) dejen de verse de plástico mate. Añadirlo y bajar `roughness` del metal a ~0,35 con `metalness` 0,6.
* **Tonemapping**: `ACESFilmic` + exposición 1,05 comprime y desatura los altos (es lo que apaga el naranja del balón y el rojo de la zona). Probar `THREE.NeutralToneMapping` (disponible en r170) o `AgX` y comparar el mismo encuadre; es un cambio de una línea con efecto grande en un mundo tan saturado.
* **Emisivos + bloom barato**: los focos, pantallas, LED de las vallas, `ON AIR` y el aro no emiten nada hoy. Marcar `emissive` + `emissiveIntensity` y añadir un pase de bloom (o un «glow» falso con sprites multiplicativos para no pagar post-proceso en móvil) es lo que da la sensación de pabellón iluminado.
* **Parqué**: la pista que se ve es la del glTF con 3 colores planos y una calcomanía de líneas encima. Propuesta: **bake del parquet procedural** (tablones con 3–4 tonos + juntas suaves + barniz) en la malla voxel del suelo, o usar `map` con la textura de canvas en lugar de colores de vértice. Coste: 0 triángulos y se recupera el detalle que hoy solo tiene la pradera.
* **Marca central / logo**: se retiró por decisión del propietario; se puede recuperar como opción (o cambiar por publicidad de las vallas: hoy son bloques de color con un remate oscuro).
* **Post-proceso mínimo** (si entra en presupuesto): viñeta sutil, ligero *sharpen* o `FXAA` y un `color grading` que suba la saturación en las sombras. Nada de SSAO si el AO va horneado.

### 4.3 El mundo: coherencia, escala y detalle

* **Elegir techo o exterior** (D11) antes de tocar luces: cambia el esquema entero.
* **Anillos de zona**: hoy son bandas de voxels con borde «en cuentas» (se ve el escalonado) y 25 cm de grosor; alternativas: línea vectorial dibujada en la textura del suelo (con pulso de opacidad), o anillo de 1 voxel + halo. Menos «valla», más «zona».
* **Vallas publicitarias**: 0,72 × 0,85 m cada panel con un remate oscuro; se leen como cajas gigantes. Con 0,5 m de alto, bandas alternas y un zócalo continuo ganan mucho.
* **Gradas**: bandas de color plenas (azul/verde/amarillo…) sin público en los extremos; el público se ve «pegado» a la primera fila. Añadir huecos/rampas de acceso (como ya se hizo en las vallas) y alguna fila superior vacía rompe el patrón.
* **Público**: 988 asientos con la cabeza a 0,42 m sobre un cuerpo de 0,40 m: a distancia media es un muro de cabezas. Propuesta: bajar la cabeza a ~0,30, variar la altura de hombros y usar 3 «arquetipos» con escala distinta (niño, adulto, adulto con gorra) y **animarlos** (ver §4.4).
* **Escala**: el jugador mide 1,809 m con cabeza al 53 %: es una decisión de estilo (Cube World/Funko) — coherencia perfecta con el público actual. Mantener, pero documentarlo en la guía de estilo (hoy la guía pide 35–45 % y el código va por 53 %).
* **Vegetación dentro del recinto cubierto**: fuera si se elige el camino «pabellón».
* **Mesa de anotadores**: el monitor es un prisma vertical de 0,33 × 0,40 × 0,08 m (no lee como pantalla) y el teclado/papeles son losas. Proporciones 16:9, pantalla en la cara buena, un par de sillas mirando a la mesa y una caja de cables bastan.
* **Canasta**: poste por tramos correcto; el tablero es una losa con marco (bien). Con D2 arreglado y un poco de AO en el protector queda redonda.

### 4.4 Vida y efectos (barato, mucho retorno)

* **Público animado**: hoy las 5 instancias son estáticas. Con un `onBeforeCompile` que añada una oscilación por instancia (fase en un atributo) se consigue respiración/balanceo sin tocar matrices en CPU. Y **reacción al enceste**: ola de brazos, salto, carteles (una animación de 2 s sobre un subconjunto de asientos).
* **Partículas**: polvo al aterrizar del salto, roce de zapatilla al frenar, confeti en la celebración del MVP. Un `Points` de 200 partículas recicladas es suficiente.
* **Cámara de repetición**: tras encestar, 1,5 s de repetición desde el lado del aro con la trayectoria del balón (ya se guarda todo lo necesario: se puede muestrear `ball.pos` en un buffer circular). Es el «wow» más barato de todo el documento y refuerza el enceste como recompensa.
* **Sacudida y FOV**: micro-sacudida al golpear el aro/tablero y un `FOV` de 32 → 34 durante la carga del tiro. Comunica impacto sin costar nada.

### 4.5 Cámara

* **Encuadre por formato**: en vertical la cámara se aleja ×1,875 (`dist = clamp(1.5/aspect, 1, 2.4)`) y el personaje queda diminuto en una piscina de pista. Alternativa: en vertical subir el FOV y bajar el offset (más cenital) en lugar de retroceder; o pasar a un plano lateral tipo «2.5D» y mover la canasta objetivo.
* **Seguimiento con adelanto**: desplazar el objetivo en la dirección de movimiento (hasta 1,5 m) hace que el jugador vea hacia donde va; hoy la cámara va centrada en él y siempre mira lo mismo.
* **Transiciones**: la cámara de sección espera `−ln(0.03)/4 ≈ 0,87 s` antes de abrir el panel (bien resuelto); añadir un fundido del panel (150 ms) y un ligero `ease` de cámara al volver.

---

## 5. Interfaz, HUD y menús

**Lo bueno:** pixel-art coherente (bordes duros, sombras duras, sin radios), HUD en DOM, etiquetas con distancia y flecha, panel con trampa de foco, aviso `aria-live`, medidor con zona verde que se estrecha con la distancia (y se mueve), táctil montado solo si `pointer: coarse`.

**Propuestas, por prioridad:**

1. **Tipografía legible** (D8): cuerpo en `Inter` (o pixel con minúsculas); títulos/HUD en `Silkscreen`. Regla: nada de párrafos de más de 3 líneas en mayúsculas.
2. **Etiquetas** (D4): clamp por caja + carriles + test automático. Añadir atenuación por distancia y agrupar cuando dos secciones estén al mismo rumbo.
3. **Panel**: hoy es modal a pantalla completa y **tapa la escena** que acabas de encuadrar. Propuesta: panel lateral (40 % en escritorio) con la escena visible al 60 %, y en móvil sheet inferior. En `interview` ya se hace el «tercio inferior»: extender ese patrón.
4. **Proyectos**: 10 tarjetas sin filtros. Añadir chips de filtro por tecnología/año (derivadas de `content.ts`, sin datos nuevos), orden por año, y `details` plegable (`<details>`) para no saturar.
5. **Menú ☰**: mostrar estado por sección (✓ visitada, 🔒 bloqueada, ○ pendiente) y el progreso; hoy solo hay una lista plana y el contador `0/6` aparte. Cerrar con `Esc` y con clic fuera (hoy solo el botón).
6. **Ajustes**: falta un sitio para volumen, calidad gráfica (acción 7 de §3), idioma y borrado de récord. Un botón ⚙ con 4 controles basta.
7. **Iconos**: el botón de sonido usa emoji del sistema (`🔊`/`🔇`), que rompe la estética y cambia según la plataforma. Dibujar 3 iconos pixel (altavoz, bandera/idioma, menú) en CSS/SVG.
8. **Medidor de tiro**: la barra mide 320 × 22 px con aguja de 6 px y una franja verde que se mueve; en móvil va al 14 % desde abajo, lejos del pulgar, y en pantallas estrechas el conjunto HUD (chip + etiquetas + aviso + medidor + botones) se apiña. Subirlo de tamaño (~30 %), acercarlo al pulgar en táctil y añadir **feedback textual** tras cada tiro («PERFECTO», «CORTO», «LARGO»), que es lo que enseña a jugar. También conviene explicar el barrido del verde en el onboarding (hoy no se explica).
9. **Marcador**: mostrar tiros/porcentaje (ya está abajo a la derecha), añadir racha actual y mejor racha; el récord se puede guardar con nombre en `localStorage` (sin backend).
10. **Ayuda/pausa**: añadir overlay con controles (WASD/flechas, Espacio, E, Esc), activable con `H` o `?` y accesible desde el menú. Hoy solo hay un toast de bienvenida de 6 s.
11. **Toast y chip**: el aviso de bienvenida ocupa el centro del encuadre al empezar; retrasarlo a los 900 ms o moverlo a la banda inferior.
12. **Gate de idioma**: `ASK_EVERY_VISIT = true` fuerza una decisión en cada visita; si se recuerda el idioma, el HUD ya tiene botón de idioma (duplicado). Sugerencia: gate solo en la primera visita (o recordar y ofrecer «cambiar» de forma discreta), y medir el efecto en rebote si hay analítica.
13. **Estados vacíos**: `stats` sin tiros muestra «—»; usar un tono que invite a jugar («Aún no has tirado» + atajo a la canasta).

---

## 6. Jugabilidad y contenido (lo que convertiría el portfolio en «juego»)

1. **Colisiones** (D6) + **límites por zonas**: que no se pueda atravesar el atrezzo ni salir del recinto por el césped.
2. **Reglas de baloncesto mínimas**: 2 puntos dentro del triple y 3 fuera, reloj de 24 s opcional, canasta con cuenta visual. Da sentido a la pista y al marcador.
3. **Progresión real**: hoy se desbloquea Projects al encestar y `stats` no desbloquea nada. Convertir las 6 secciones en un «partido»: 2 canastas (2 y 3 puntos), 4 zonas de pase; el MVP se concede con las 6 descubiertas (ya existe el toast). Añadir un tablero de logros local (enceste desde el centro, tiro perfecto, 3 seguidas).
4. **Tiro**: la parábola se resuelve con el ángulo más bajo que llega descendiendo (55°); añadir variación por distancia (bandeja cerca con ángulo alto y tablero; tiro largo con 62–70°) y un **«release» visual** en la mano (destello en el punto exacto del soltar) para enseñar el timing.
5. **Modo desafío** (post-partido): 60 s de tiro libre con dificultad creciente y tabla de récords local; es contenido nuevo con lo que ya hay (física + HUD + `localStorage`).
6. **Balón**: hoy rueda indefinidamente y no colisiona con props ni personas; añadir fricción con el suelo real (ya hay), colisión con jugador/reportero/banquillo, y devolver el balón a la mano si sale del recinto.
7. **Compañeros de pista**: un par de NPC que se muevan por la pista (probabilidad de bloqueo/canasta desde fuera). Reutiliza `buildHuman` + un movimiento simple por waypoints; multiplica la sensación de juego.
8. **Compartir récord**: URL con `#r=tiros/aciertos` y texto formateado para copiar; sin backend.

---

## 7. Accesibilidad e i18n

**Ya bien:** `aria-label` del canvas, paneles con `role="dialog"`, trampa de foco, `Esc`, `aria-live` para avisos, `prefers-reduced-motion` (CSS y cámara), versión clásica navegable sin WebGL, textos bilingües en fuente única.

**Faltas concretas:**
* `prefers-reduced-motion` no desactiva el pulso de los anillos, el parpadeo de `ON AIR`, el bote del balón ni las animaciones del personaje → extender el respeto al movimiento.
* El **marcador** y el **medidor** no se anuncian (`aria-live` solo en los avisos). Añadir anuncios mesurados: canasta, récord actualizado, sección desbloqueada.
* Navegación por teclado del menú: hoy no hay `role="menu"`, ni flechas, ni cierre con `Esc` (el `Esc` está capturado por el panel).
* **Contraste**: las etiquetas naranja `#ff6a1a` con blanco y sombra negra cumplen, pero `.label--locked` cae a gris `#6b7280` sobre parqué claro (bajo contraste) — arreglar con el `--ink` real y una banda oscura.
* **Zoom**: con `zoom`/texto al 200 % el HUD se desborda (etiquetas y medidor). Fijar tamaños en `rem`/`clamp` y probar.
* **Táctil**: el joystick no se puede usar con teclado ni el botón ACCIÓN tiene `aria-label`; añadir etiquetas y foco visible.
* **i18n**: 37 marcadores cerrados y terminología FIBA verificada; solo queda que el idioma del `document.documentElement.lang` se mantenga al cambiar (se hace) y que la versión clásica preserve el idioma elegido (hoy es un HTML aparte: sincronizar con `?lang=` o `localStorage`).

---

## 8. Arquitectura y calidad de código

* `main.ts` tiene **994 líneas** y mezcla render, cámara, input, reglas, UI y hooks de depuración. Dividir en módulos con una interfaz clara:
  * `game/session.ts` (estado + reglas + progreso), `game/renderLoop.ts` (bucle, calidad adaptativa), `game/cameraRig.ts` (juego + secciones + repeticiones), `game/world.ts` (construcción y registro de props), `game/labels.ts` (lógica de rumbo/clamp/carriles).
  * Beneficio inmediato: se puede **testear la UI de etiquetas** y el **rumbo** sin levantar el renderer.
* **Registro de props** con su caja de colisión (`{ id, boxes, interactive }`) como única fuente de verdad: hoy las posiciones están duplicadas entre `config.ts`, `props.ts`, `tv.ts` y `main.ts` (`SCORER_TABLE`, `INTERVIEW`, `SECTION_CAMERA`, `ZONES`).
* Un **sistema de constantes de arte** (`ART = { parquet, line, crowd, fog... }`) y otro de **calidad** (`QUALITY = { low, mid, high }`) en lugar de números sueltos por los builders.
* Tipar los colores de paleta (`type PaletteColor = (typeof PALETTE)[keyof typeof PALETTE]`) para que un `span()` no acepte un color arbitrario sin querer.
* Borrar el código muerto de D12 y **limpiar los comentarios corruptos**; la documentación interna es una de las fortalezas del proyecto y merece estar impecable.
* Valorar `THREE.Object3D.matrixAutoUpdate = false` en los grupos estáticos (gradas, vegetación, vallas) para ahorrar CPU.

---

## 9. Pruebas y CI

**Hoy:** 65 tests (física del tiro, balón, salto, cámara, humano, cancha) + dos comprobaciones de malla (`tightness`, `watertight`) que no están en `npm test` (son scripts). `validate --strict` + `tsc` + `build` en el prebuild.

**Propuesta:**
1. **Test de HUD sin navegador** (jsdom): las etiquetas nunca salen del viewport ni se solapan con la caja del aviso; el medidor siempre pinta la zona verde dentro de la barra (hoy `sweetCenterAt` puede llevar el centro a 0,2–0,8 y el ancho al 15 %: verificar bordes).
2. **Regresión visual** con Playwright: 7 capturas (juego, 6 secciones) con umbral de diferencia; es la única forma de que un cambio de iluminación no rompa el encuadre sin que nadie lo vea.
3. **Presupuesto de rendimiento en CI**: usando el hook `__court` fuera de producción, afirmar `escena ≤ 350 k tri`, `pase visible ≤ 60 calls`, `pase de sombras ≤ 60 k tri`, `materiales ≤ 12`.
4. **Test del contenido del glTF**: que el color del balón y del suelo caigan dentro de un rango esperado (habría cazado D1 solo).
5. **`npm test` incluye los `*.check.ts`** o se documenta por qué no.
6. **GitHub Actions**: `npm ci && npx tsc --noEmit && npm test && npm run validate -- --strict && npm run build`, con `dist` como artefacto. Hoy no hay CI visible.

---

## 10. Roadmap priorizado (con criterio de aceptación)

### Fase 1 — «Que no se vea roto» (½ día) · **HECHO (§13)**
* D1 balón naranja · D2 cuadro de tiro y z-fighting · D3 cartel de la mesa · D4 etiquetas · D12 `--ink`, código muerto y comentarios.
* **Aceptación:** captura de la sección Proyectos sin mancha en el tablero; balón con color medio > `#c05010` en la corteza; 6/6 etiquetas dentro del viewport y 0 solapes a 828 y 1440 px.

### Fase 2 — «Que se vea apoyado» (1 día) · **HECHO (§13)**, salvo el tonemapping (que se deja como está: `ACES` ya venía y la comparación no llegó a hacerse con capturas pareadas)
* Sombra clave inclinada + blob shadow del jugador/balón + AO horneado en la pista + reequilibrio de luces + tonemapping a comparar.
* **Aceptación:** sombras visibles bajo jugador, banquillo, canasta y público en las 6 secciones; misma escena con `NeutralToneMapping` vs `ACES` para decidir con capturas; ninguna superficie quemada (píxel máx. < 250).

### Fase 3 — «Que vaya suelto» (1 día)
* ~~Sombras estáticas + castShadow selectivo + material único~~ **HECHO (§12)** · ~~cámara de sombras ajustada~~ **RECHAZADO con medición (§12.3)**: cambiar el frustum altera el aspecto y no ahorra ni un draw call · quedan grano del personaje, Inter fuera/latin-only y preload.
* **Aceptación:** ≤ 60 draw calls y ≤ 350 k tri en el pase visible; pase de sombras ≤ 60 k tri o 0 por frame; `dist` ≤ 4 MB sin el `voxel-court.glb` o ≤ 2 MB con Meshopt; mismas capturas que la Fase 2 (sin cambios visuales). **El pase de sombras ya es 0 por frame y las capturas son idénticas píxel a píxel.**

### Fase 4 — «Que sea un pabellón» (1–2 días) · **PARCIAL (§13)**: techo y sol resueltos (luz de pabellón, sin sol exterior), vallas, gradas y público con animación HECHOS; quedan emisivos + glow, `PMREM`, cámara con adelanto, encuadre por formato y repetición tras canasta
* Decidir techo vs exterior y ejecutarlo (geometría + luces + niebla + vegetación), vallas, gradas, público con animación y reacción al enceste, emisivos + glow, materiales con `PMREM`, cámara con adelanto y encuadre por formato, repetición tras canasta.
* **Aceptación:** ninguna incoherencia visible (no se ve cielo si hay techo); el público se mueve y reacciona; capturas de las 6 secciones revisadas a 3 resoluciones.

### Fase 5 — «Que sea un juego» (2–3 días) · **PENDIENTE**
* Colisiones, reglas (2/3 puntos, racha), logros locales, modo desafío 60 s, NPC/s, compartir récord, ayuda/pausa, ajustes con calidad y volumen.
* **Aceptación:** no se atraviesa ningún prop; el récord muestra puntos y racha; el modo desafío se completa y persiste; test de logros.

---

## 11. Anexo · Constantes propuestas (punto de partida)

| Constante | Hoy | Propuesta | Motivo |
|---|---|---|---|
| Luz clave | `(1.5, 42, 3)` 1,9 sin objetivo | `(9, 40, 12)` → `target(0,0,0)`, intensidad ~1,35 | Sombra fuera de la silueta |
| Hemisférica | 0,55 | 0,30–0,35 | Recuperar contraste |
| Luces de torre | 4 × 0,7 | 2 × 0,45 (o 1 opuesta) | Menos coste por fragmento |
| `shadow.camera` | ±24 × ±20, far 90 | ±17 × ±10, far 55, 2048² | **NO hacerlo como está escrito**: medido, cambiar el frustum de 85 m a 16 m de rango de profundidad resucita sombras que el sesgo actual tapa (hasta 29.575 px). Ajustar frustum y `bias` JUNTOS y con la luz ya inclinada (§12.3) |
| `shadowMap.autoUpdate` | `true` | `false` + `needsUpdate` | −367 k tri/frame · **HECHO**: −174 draw calls y −367.482 tri por frame, 0 px de diferencia (§12) |
| `toneMappingExposure` | 1,05 | comparar 1,0 con `NeutralToneMapping` | Recuperar saturación |
| `roughness` suelo | 0,7 | 0,45 + `envMap` suave | Barniz, no plástico |
| `metalness/roughness` metal | 0/0,92 | 0,6 / 0,35 + `PMREM` | Postes y aros creíbles |
| Grano del personaje | 0,0185 m | 0,031–0,037 m | Su propia regla de tamaño en pantalla |
| Grano del balón | 0,034 m (12 cubos) | mantener | Ya está calibrado por comentario |
| Cámara en vertical | `dist` ×1,875 | subir FOV + bajar offset | El personaje no se pierde |
| Mapa de sombras del balón/jugador | — | 512² propio o blob | Dinámico y barato |
| Público | 988 asientos, 0 % animados | mantener + oscilación por shader + reacción | Vida sin coste de CPU |
| `preload` de modelos | — | `link rel=preload` + Meshopt | Primera carga |

> **Cómo comprobar cada fase sin GPU de gama alta:** usar `window.__court` en dev (`renderer.info`, recorrido de escena), capturas comparables a la misma cámara (`__court.previewSection(id)` + `__court.freeze`) y los tests de `tests/*.check.ts` para la malla.
---

## 12. Ejecutado · Sombras estáticas, proyectantes selectivos y material único

> **Fecha:** 13 oct 2026 · **Archivos tocados:** [builders/util.ts](the-court/src/game/builders/util.ts), [main.ts](the-court/src/game/main.ts), [builders/court.ts](the-court/src/game/builders/court.ts), [builders/tv.ts](the-court/src/game/builders/tv.ts) · **Criterio:** el fotograma no cambia ni un píxel y el pase de sombras desaparece del frame.

### 12.1 Cómo se midió (y por qué NO con `renderer.info`)

`renderer.info` **no cuenta el pase de sombras**: en Three.js `info.reset()` va *después* de `shadowMap.render()` (`three.module.js`, líneas 30081 y 30087). Por eso `info.render.calls` daba 49–108 en vez de 219–277, y por eso el «pase de sombras» de la primera versión de este informe había que leerlo del grafo de escena.

La sonda de esta fase envuelve el contexto (`renderer.getContext()`) y cuenta `drawElements`, `drawArrays` y sus variantes *instanced*, atribuyendo cada llamada al pase que toca según `renderer.getRenderTarget()`: si hay render target activo, es el mapa de sombras; si no, es el pase visible. Son las llamadas de dibujo reales, con los triángulos reales (los instanciados se multiplican por `instanceCount`).

Las vistas son 7: la del juego (cámara real, congelada con `__court.freeze = true`) y las 6 secciones con los mismos `pos`/`look` de `SECTION_CAMERA` + `INTERVIEW`, a la misma relación de aspecto (827 × 977 px). La comparación de píxeles es `getImageData` del canvas tras cada `render()`, con umbral de 2 niveles por canal.

### 12.2 Lo que se cambió

| Cambio | Dónde | Por qué |
|---|---|---|
| `shadowMap.autoUpdate = false` + `bakeShadows()` | `main.ts` | El mapa se hornea UNA vez (y a demanda). Cuesta −174 draw calls y −367.482 triángulos por fotograma |
| `castShadow` fuera en jugador, balón y los dos actores del plató | `main.ts`, `tv.ts` | Eran los únicos proyectantes que se mueven (los 3 humanos son ~87 de los 174 draw calls del horneado). Con ellos dentro, un mapa estático deja su silueta congelada en cuanto caminan |
| `castShadow` fuera en vegetación, torres de luz y muro del plató | `court.ts`, `tv.ts` | Su sombra cae al otro lado del objeto que la proyecta (luz vertical) y no se ve |
| Material único compartido (`VOXEL_MATERIAL`) | `builders/util.ts` | Cada malla por color traía su propio `MeshStandardMaterial` idéntico: 190 materiales con el mismo shader. Uno solo, con `vertexColors` |
| `noCastShadow()` y opción `castShadow` en `VoxelWorld.build()` | `builders/util.ts` | Poder apagar la sombra proyectada de un grupo sin tocar `receiveShadow` |
| `bakeShadows` expuesto en la sonda de dev | `main.ts` | Poder rehornear desde la consola tras tocar luces o proyectantes |

### 12.3 Cámara de sombras: la propuesta del informe, RECHAZADA con medición

El informe proponía ajustar el frustum a la pista (±19 × ±16 m, `near` 32, `far` 48) en vez de a la escena (±24 × ±20, `near` 5, `far` 90). Se implementó, se midió y **se revirtió**. Al recortar el rango de profundidad de 85 m a 16 m, el `bias` efectivo (que va en unidades del rango) y el radio real de la PCF cambian (el texel pasa de 2,34 cm a 1,86 cm), y **reaparecen sombras que el sesgo grande estaba tapando**: gradas, vallas, banquillo, postes y el muro del plató.

| Configuración | Diferencia contra el mismo fotograma SIN pase de sombras |
|---|---|
| Frustum original + `bias` original | **0 píxeles · máximo 0** en las 7 vistas |
| Frustum ajustado + `bias` compensado ×5,3 | hasta **29.575 píxeles**, **61 niveles** por canal |

Y no compraba nada: con el frustum ajustado el horneado dibuja **exactamente los mismos 65 draw calls y 198.932 triángulos** que con el original, porque los 65 proyectantes que quedan están dentro de los dos marcos. El coste lo decide la lista de proyectantes, no el marco. Se deja como estaba y se anota para la fase en la que la luz se incline: entonces habrá que elegir frustum y `bias` JUNTOS, y midiendo.

### 12.4 Resultado medido

Draw calls y triángulos **por fotograma**, contador a nivel de WebGL, 827 × 977 px:

| Vista | Antes (sombras + visible) | Ahora (sólo visible) | Ahorro |
|---|---|---|---|
| juego | 272 calls · 778.794 tri | **98 · 411.312** | −174 calls (−64 %) · −367.482 tri (−47 %) |
| entrevista (`contact`) | 277 · 793.736 | **103 · 426.254** | −174 (−63 %) · −367.482 (−46 %) |
| proyectos | 220 · 726.736 | **46 · 359.254** | −174 (−79 %) · −367.482 (−51 %) |
| skills/stats | 223 · 707.168 | **49 · 339.686** | −174 (−78 %) · −367.482 (−52 %) |
| récord (`stats`) | 220 · 726.520 | **46 · 359.038** | −174 (−79 %) · −367.482 (−51 %) |
| sobre mí (`about`) | 223 · 706.546 | **49 · 339.064** | −174 (−78 %) · −367.482 (−52 %) |
| experiencia | 222 · 716.084 | **48 · 348.602** | −174 (−78 %) · −367.482 (−51 %) |

El horneado, además, se ha abaratado de **174 draw calls / 367.482 triángulos a 65 / 198.932** (−63 % y −46 %), quitando del mapa los tres humanos y los cuatro grupos de atrezo (vegetación, torres, muro del plató y balón). Como sólo ocurre una vez (o cuando se pida), ese ahorro es tiempo de carga, no de frame.

### 12.5 Prueba de que el aspecto no cambia · **MÉTODO INVÁLIDO, re-medido en §13.6**

* ⚠️ **Esta prueba no vale.** Comparar con `shadowMap.enabled = false` NO fuerza recompilar los materiales: el programa cacheado sigue teniendo `USE_SHADOWMAP` y el fotograma sale idéntico **aunque las sombras se estén viendo**. Los «0 píxeles» que siguen no prueban nada; el método válido es apagar `light.castShadow` (eso sí cambia la `version` del estado de luces y obliga a recompilar), y con él se midió §13.6.
* Lo que sí se midió bien: el número de proyectantes (173 → 65) y los draw calls/triángulos del pase, que salen del contador de WebGL.
* **Quitar proyectantes de un pase que no aporta nada no puede aportar algo.** Si el conjunto completo de sombras deja el fotograma idéntico al mismo sin sombras, cualquier subconjunto también: las sombras no se «cancelan» entre sí, sólo se suman.
* Las capturas de la vista de juego y de las seis secciones siguen siendo las mismas (revisadas a ojo además del diff numérico).

### 12.6 Límites de estas medidas (honestidad)

* El bucle del panel sigue clavado en 30 fps y no cambia al bajar la resolución a la mitad, así que **el techo es del compositor, no de la GPU**: aquí se certifican draw calls y triángulos enviados, **no** un aumento de FPS.
* Medir el tiempo del horneado con `performance.now()` alrededor de un `render()` mide el **envío desde la CPU**, no el trabajo de GPU (los comandos WebGL son asíncronos). No se usa como prueba.
* Sigue sin medirse móvil real, Safari/iOS ni red lenta.

### 12.7 Lo que queda de la fase 3 y lo que NO se ha tocado

* Pendiente: grano del personaje, Inter fuera o latin-only, `preload` de modelos.
* El `VOXEL_MATERIAL` compartido **no baja draw calls** (sigue habiendo una por malla): su efecto es memoria y estado de render del pase de profundidad. Medido: los materiales únicos pasan de **193 a 18** (los `MeshStandardMaterial`, de **185 a 10**; los 8 `MeshBasicMaterial` —anillos, rótulos— siguen aparte). Se apunta aquí para no atribuirle un ahorro que no tiene.
* El **público nunca proyectó sombra**: un `InstancedMesh` es un `Mesh` y `castShadow` viene en `false` por defecto, así que los 5 instanciados no estaban entre los 173 proyectantes. Queda documentado en el código para que nadie lo «optimice» otra vez.
* El balón marrón (D1), el z-fighting del tablero (D2) y las etiquetas (D4) siguen ahí: son de la fase 1.

---

## 13. Ejecutado · Fases 1, 2 y 4 (parcial) y los paneles con pestañas

**Sesión:** 13 oct 2026 · **Bitácora con el detalle:** `the-court/BITACORA.md` §3j.
Lo de la fase 3 está en §12.

### 13.1 Fase 1 · «que no se vea roto» — HECHA

| Defecto | Solución | Prueba |
|---|---|---|
| D1 balón marrón | El color de la corteza lo pone la paleta, no el material del glTF: `colorOf` sólo acepta el material como costura si su luminancia < 0,22 (la banda oscura del modelo); el resto va a `PALETTE.ball`. La costura pasa de 2 celdas a 1 | `tests/ball.test.ts` (+2): cuero > 70 %, costuras > 3 %, rojo máx. > 230 |
| D2 cuadro de tiro y z-fighting | Corregido en `props.ts` | capturas de la sección Proyectos |
| D3 cartel de la mesa | Corregido en `props.ts` | capturas |
| D4 etiquetas | Recorte por caja real + carriles y 3 pasadas de empuje | `getBoundingClientRect` a **828** y **1.440** px: 6/6 dentro, **0 solapes** |
| D9 fuentes | Inter fuera del paquete; subsets `latin`; `--font-body` de sistema para el texto corrido | `dist/assets`: sólo Bebas + Silkscreen |
| Carga | `voxel-court.glb` (7,8 MB) sale del build a `assets-src/`; la cancha es procedural | `dist` **982 kB** (18 ficheros) |

### 13.2 Fase 2 · «que se vea apoyado» — HECHA, salvo el AO del suelo

* Foco clave **`(10, 34, 12)` a 2,0** (antes `(1,5, 42, 3)` a 1,9, casi vertical), con marco
  de sombras ±30 × ±26 / `far` 110, `bias` −0,0002 y `normalBias` 0,05. **El sol exterior se
  elimina**: bajo techo ninguna luz viene de fuera, y con el foco sesgado la sombra sale de
  la silueta (§13.6).
* Hemisférica 0,55 → **0,38**; rebote cálido 0,45 desde abajo; relleno frío 0,62 **del lado
  de la cámara** (estaba detrás: por eso el naranja del balón salía marrón); 4 torres a 0,7.
* **Sombra de contacto** del jugador (1,2 m) y del balón (0,34 m), generadas por código, con
  opacidad que se aclara al saltar.
* **El público proyecta sombra**: con el foco inclinado, cada fila cae sobre la de delante.
* **Pendiente de la fase 2:** el AO horneado en la pista (el suelo sigue sin oclusión propia:
  la única que hay es la de vértice del voxelizador) y la comparación `ACES` vs
  `NeutralToneMapping` con capturas pareadas.

### 13.3 Fase 4 · pabellón — PARCIAL

* **Público vivo**: oscilación de 4,5 cm en el vértice, con un único uniforme compartido por
  las cinco piezas y la fase de cada asiento sacada de su propia `instanceMatrix[3]` (ni una
  matriz en CPU). Longitud de onda ~25 m: olas que recorren la grada.
* **Medido** con `gl.readPixels` del fotograma completo (828 × 1.033) separando dos capturas
  0,7 s: control **0 px** (dos renders seguidos sin avanzar el reloj), banda del graderío
  **5.678 px cambiados** de 53.820 muestreados (**10,5 %**).
* Ya estaban de antes: techo y sol resueltos como pabellón, vallas, gradas, vegetación.
* **Pendiente**: emisivos + glow, materiales con `PMREM`, cámara con adelanto, encuadre por
  formato (vertical) y repetición tras canasta.

### 13.4 Paneles de sección (§5) — HECHA

* **Pestañas accesibles** (`role="tablist"/"tab"/"tabpanel"`, `aria-selected`,
  `aria-controls`, `aria-labelledby`, foco móvil, flechas ←/→ + Inicio/Fin), barra
  **pegajosa** y vuelta al principio al cambiar de pestaña.
* **Proyectos** `Todo · 10` + una pestaña por año; ficha de una frase con el párrafo largo
  plegado en «Detalles del proyecto».
* **Skills** una pestaña por grupo, con barra **y número /10** por fila.
* **Experiencia** `Todo · 11` / `Trabajo · 4` / `Estudios · 5` / `Deporte · 2`, por fecha
  descendente y con la fecha legible (`feb 2025 – Actualidad`, no `2025-02`).
* **Sobre mí** un tema por pestaña + `Datos`; **Récord** con cuatro cifras grandes y un aviso
  que invita a jugar si no hay tiros; **Contacto** con el CV siempre arriba y el formulario
  separado del resto.
* **Texto corrido en tipografía de sistema** (0 KB) con 1,6 de interlineado; la pixel se queda
  para títulos, chips, badges y botones.
* **Panel lateral desde 900 px**: deja la escena a la vista; por debajo, centrado.
* **Trampa de foco arreglada**: descarta lo invisible y cuenta `summary` (antes, con un
  `<details>` plegado, el «último» de la lista podía ser invisible y el tabulador se escapaba).
* **HUD**: menú con estado por sección (✓/○/✕ + texto para lectores de pantalla, cierra con
  Esc y clic fuera), iconos SVG en lugar de emoji, puerta de idioma sólo la primera visita, y
  `prefers-reduced-motion` que congela el reloj de las animaciones con una sola línea.
* **Verificado en navegador**: pestañas por sección (5/6/2/0 según el caso), un solo panel
  visible de N, `tabindex` móvil correcto, cambio de pestaña con flechas, trampa de foco
  cerrando por el último elemento visible, y 380 / 700 / 828 / 1.440 px sin desbordes.

### 13.5 Estado

`npx tsc --noEmit` 0 errores · `npm test` **67/67** · `npm run build` ✓ (prebuild con
`validate --strict` + `classic`) · `dist` **982 kB** en 18 ficheros, sin el glb de 7,8 MB
ni las fuentes Inter.

### 13.6 Sombras: la medición que faltaba (y una corrección de método)

El método de §12.5 no servía (ver allí). El válido es apagar `light.castShadow`, que cambia
la `version` del estado de luces y **fuerza recompilar**. Con él, en el estado actual:

| Vista | Píxeles que cambian al apagar las sombras | % del fotograma | Δ máx. por canal |
|---|---:|---:|---:|
| juego | 34.485 / 855.324 | **4,0 %** | 65 |
| sección Proyectos | 65.113 / 855.324 | **7,6 %** | 58 |

Es decir: con el foco ya inclinado, **el pase de sombras sí se ve** (antes, con la luz casi
vertical, su contribución era invisible porque caía dentro de la silueta de cada objeto).
Posiciones probadas para elegir la del código (misma escena, mismas capturas):

| Foco | vista de juego | vista de Proyectos |
|---|---:|---:|
| **`(10, 34, 12)` — elegida** | 4,0 % | 7,6 % |
| `(24, 30, 6)` | 4,9 % | 13,6 % |
| `(0, 34, −16)` | 6,8 % | 1,4 % |

La elegida es la geometría que proponía el informe (foco de techo del lado de la cámara) y da
sombra visible sin que el contraste se coma la pista; la lateral da más sombra en los planos
de sección pero deja las caras que mira el jugador casi sólo con el relleno.

**Y la selección de proyectantes de la fase 3 sigue siendo válida con el foco inclinado:**
encendiendo `castShadow` en los 16 meshes del atrezo que se dejaron fuera (vegetación, torres
de luz y muro del plató), la diferencia es de **0 píxeles** en la vista de juego **y** en la
de Proyectos.

### 13.7 Pendiente (honesto)

* **Fase 4**: emisivos + glow, `PMREM`, cámara con adelanto, encuadre por formato, repetición
  tras canasta; AO del suelo y comparación de tonemapping (fase 2).
* **Fase 3**: grano del personaje, `preload` de modelos.
* **Fase 5 (juego)**: colisiones, reglas 2/3 puntos, logros, modo desafío 60 s, NPC,
  compartir récord, ayuda/pausa y ajustes; §5 (HUD) propuestas 6, 8, 10 y 13 sin hacer.
* **No medido**: FPS real (el bucle del panel sigue clavado en 30 fps, techo del compositor,
  no de la GPU), móvil real, Safari/iOS ni red lenta. `prefers-reduced-motion` está
  verificado por código (una sola línea del bucle), no emulado en el navegador.
---

## 14. Ejecutado · Fusión de las mallas estáticas por material

**Sesión:** 13 oct 2026 · **Bitácora con el detalle:** `the-court/BITACORA.md` §3l.

### 14.1 Lo que se hizo

Un módulo nuevo (`the-court/src/game/builders/batch.ts`) que, en el arranque y ANTES de hornear el
mapa de sombras, cuece el `matrixWorld` de cada malla del mundo en su geometría y funde las que
comparten material y estado de render. Agrupa por `castShadow` + `receiveShadow` + `renderOrder` +
celda de 24 m en XZ, deja fuera lo que se mueve (jugador, balón y los dos actores del plató) y
libera las geometrías originales sólo si ya no las usa ninguna malla viva.

### 14.2 Resultado medido (827 × 979, contador a nivel de WebGL)

| Vista | Antes | **Después** | Triángulos antes → después |
|---|---:|---:|---|
| juego · pase visible | 95 | **51** | 326.946 → 387.554 |
| juego · horneado (una vez) | 70 | **9** | 281.388 → 281.388 |
| Proyectos | 44 | **13** | 275.144 → 321.184 |
| Skills | 47 | **15** | 255.552 → 329.648 |
| Sobre mí | 47 | **13** | 255.066 → 314.550 |
| Experiencia | 46 | **15** | 264.604 → 333.048 |
| Entrevista | 102 | **72** | 342.768 → 394.784 |
| Récord | 44 | **13** | 274.752 → 321.212 |

Las siete vistas pasan de 425 a 192 llamadas (−55 %). El precio es el culling más grueso (+20 % de
triángulos). El barrido del tamaño de celda está en §3l: con 12 m serían 201 llamadas y −11 % de
triángulos; se deja 24 m y el parámetro queda expuesto en el gancho de desarrollo.

### 14.3 Aspecto: idéntico, medido

En la misma página y dentro de una sola evaluación (sin que corra un fotograma de animación entre
capturas): captura de cada vista, `batch()`, captura de nuevo y `gl.readPixels` para contar píxeles
distintos. **0 píxeles** en las seis secciones a 828 × 1.035, **0** en Entrevista y Récord a 828 ×
1.035 y **0** a 640 × 360, con un control de dos renders seguidos en **0** píxeles (la medida es
reproducible).

El primer intento daba 0,5-5 % de píxeles distintos. La causa no era la geometría sino
**renormalizar normales que ya eran unitarias**; se arregló copiando verbo a verbo cuando
`matrixWorld` es la identidad (77 de las 81 mallas del mundo).

### 14.4 Límites

* No cubre el público (instanciado), los anillos ni los rótulos (`MeshBasicMaterial`) ni los
  personajes: son las 19 mallas de textura y los ~90 del rig de los tres humanos.
* Mide coste de CPU y llamadas, **no FPS**: el panel sigue clavado a 30 fps por el compositor.
* Los lotes no se pueden actualizar: si algo del mundo se mueve o cambia, hay que refundir.
---

## 15. Determinación · Más detalle sin perder rendimiento (estética voxel)

**Fecha:** 13 oct 2026. Presupuesto de partida medido en §14 y composición de la escena contada
malla a malla. Es el plan que sale de preguntar «¿cuánto detalle cabe aquí todavía?» con números
en la mano en lugar de a ojo.

### 15.1 La regla que hace barato el detalle

Estado de partida (vista de juego, 827 × 979): **51 llamadas y 387.554 triángulos** en el pase
visible, y **9 llamadas** en el horneado del mapa de sombras (una sola vez). El desglose medido de
la escena, antes de fundir:

| sistema | mallas | triángulos | ¿fusionable? |
|---|---:|---:|---|
| mundo y atrezo (material voxel) | 81 | 238.924 | **ya fundido** (6 lotes) |
| **rig del jugador** | **30** | 41.586 | sí: cada `part()` es rígida dentro de su pivote |
| rig de cada actor del plató | 29 y 31 | ~41.500 | igual |
| público | 5 (instanciado) | 60 | ya son 5 llamadas |
| pista, líneas, rótulos, anillos, sombras de contacto, balón | 19 | 55.118 | no: texturas y `MeshBasicMaterial` |

De ahí salen cinco reglas que son el presupuesto de todo lo que venga:

1. **El detalle estático del mundo es gratis en llamadas.** Lo que se construya con el material
   voxel sobre la rejilla de 3,125 cm entra en el fundido del arranque: se paga en triángulos —y
   aquí son baratos: la escena entera son ~390 k, cuando el solo pase de sombras ya movía 367 k por
   fotograma— y no en llamadas. Es la vía principal para «más detallado».
2. **Los personajes hay que fundirlos ANTES de añadir ninguno más.** Hoy cada rig son **30
   llamadas** y son la mayor partida restante: la vista de juego son 6 lotes + 30 del jugador + 15
   del resto, y la entrevista 6 + ~60 de los dos actores + 6. Fundir cada `part()` en una sola malla
   (son varias mallas por pieza, rígidas entre sí en el mismo pivote) baja un rig a 8-9 y **libera
   ~21 llamadas en juego y ~40 en la entrevista**: eso es lo que después paga los personajes nuevos
   y el detalle del jugador.
3. **Animar preferentemente por shader** sobre geometría ya fundida: el balanceo del público son
   5 llamadas para 5.678 píxeles en movimiento.
4. **Sin texturas nuevas** salvo los lienzos que ya existen (pista, dorsales, rótulos): el detalle
   va en geometría y color de vértice, que es lo que mantiene la estética voxel y evita material
   nuevo (que sería además otro shader que compilar).
5. **Criterio de aceptación**: la vista más cara no pasa de **60 llamadas** ni **500 k triángulos**;
   el horneado, de 12 llamadas. Todo se mide con `__court.draws()` en las siete vistas y se compara
   con `?nobatch=1`. Lo que no quepa, no entra.

### 15.2 Fase A · Cancha y microdetalle (lo que más se ve)

| Pieza | Dónde | Coste | Por qué se nota |
|---|---|---|---|
| **Red de voxels en los dos aros** | `props.ts` (`hoopFine`) | 0 llamadas, ~2-3 k tri | Es lo que hoy falta justo donde mira todo el mundo: el aro. Y da dónde animar (ondulación al entrar el balón) |
| **Tablero de anotación colgado del techo** | `court.ts` + rótulo | 0 llamadas de estructura, +1 del lienzo | Pabellón sin marcador no es un pabellón; puede llevar el récord en vivo |
| 24 segundos y cronómetro | mesa y postes | +1-2 (emisivo) | Ritmo de partido |
| Pista: junta de tablones, círculo de tiro libre, marcas de tres, logo central | `court.ts` (`drawFloor`/`drawLines`, ya hay lienzo) | **0** | Es gratis: ya se están pintando esas texturas |
| Banco: sillas, toallas, botellas, marcador de faltas, cesta de balones | `props.ts` | 0 llamadas | Convierte «una caja» en un banquillo |
| Mesa de anotadores: pantallas, cables, papeles, taza | `props.ts` | 0 (+1 pantalla) | Es una de las seis zonas: se mira de cerca |
| Gradería: barandillas, escaleras, carteles con el nombre, banderines | `court.ts` | 0 | Rellena el fondo que hoy son filas de cubos de color |
| Techo: cerchas, altavoces, cables, luces colgantes, ventiladores (giro por shader) | `court.ts` | 0 (+shader) | Cierra el espacio por arriba |
| Detalles de «uso»: flechas, extintores, puertas, reloj de pabellón | `court.ts` | 0 | Cuentan que el sitio existe |

### 15.3 Fase B · Personajes

* **Detalle en la rejilla de diseño** (cada celda de diseño son bloques de cubos reales): capas de
  pelo, cinta, muñequeras distintas por mano, tobilleras, dorsal también detrás, más variedad de
  tonos de piel y pelo por variante.
* **Animaciones que faltan**: respiración en reposo (el torso sube 1-2 %), mirada al aro antes de
  tirar (rotación de cabeza con tope), aterrizaje con flexión de rodillas, pausa de ritmo antes del
  tiro, celebración con puño y salto, cansancio (respiración más rápida tras correr) y giro visible
  del balón en el aire (costuras girando).
* **Público**: oleada de celebración al encestar (uniforme de «salto» sobre el balanceo que ya
  existe), cabezas que siguen al balón, carteles alzados en las filas altas.
* **Actores**: cabezal de la cámara de TV siguiendo al jugador, operador con trípode estable.
* **Árbitro** (opcional): reutiliza `buildHuman` con otra paleta y un estado «sigue la jugada»;
  cuesta 8-9 llamadas sólo después de fundir los rigs por pieza, razón por la que esa fusión va
  primero.

### 15.4 Fase C · Cámara

* **Adelanto proporcional a la velocidad** (lo que queda de la fase 4): el encuadre se desplaza
  hacia donde va el jugador, no hacia donde está.
* **Sacudida corta y amortiguada** (0,15 s, ±2 cm) al entrar el balón y al machacar: es el «golpe»
  que hoy no existe.
* **Dolly-in al cargar el tiro**: la distancia baja de 16,0 m a ~14,4 m según la carga; el medidor
  se lee mejor y el gesto tiene intención.
* **Vuelta en arco tras canasta** (fase 4): el reencuadre deja de ser un lerp recto.
* **Órbita lenta con el panel abierto**: la escena de al lado no queda congelada (0 coste, sólo la
  matriz de la cámara).
* **Composición vertical**: con 827 × 979 el `clamp(1.5 / aspect, 1, 2.4)` da el máximo y el jugador
  queda pequeño con el HUD encima; conviene encuadrar por «cancha visible» y no por aspecto.
* Todo pasa por el interruptor de `prefers-reduced-motion` que ya existe (una línea del bucle).

### 15.5 Fase D · Colisiones (presencia física)

Hoy el jugador sólo está acotado por un rectángulo (`PLAYER.bounds`) y **atraviesa** banco, mesa,
postes, vallas, muro del plató y árboles. Propuesta sin motor de físicas:

* **Volúmenes a mano**: cápsula del jugador (radio ~0,35 m) contra una lista de AABB y cilindros
  declarados por las propias piezas (o derivados del `boundingBox` de cada grupo **antes** de
  fundir, que sale gratis y no toca los constructores).
* **Resolución**: empuje hacia fuera con deslizamiento sobre la cara (proyección del vector de
  movimiento) y escalón de 10 cm para bordillos; así se camina pegado a la valla sin trabarse.
* **Balón**: rebote en bandas y poste, y que no atraviese tablero ni banco.
* **Coste**: 0 llamadas, ~30 volúmenes y una comprobación por fotograma.
* **Pruebas**: esquinas (dos caras a la vez), no quedarse dentro de un volumen al abrir el juego
  (resolver solapamiento en el arranque), y las **6 zonas siguen alcanzables** con los volúmenes
  nuevos (la parte delicada: una zona dentro de un volumen rompe el portfolio).

### 15.6 Fase E · Modelos y atrezo

Balón (costuras y logotipo), aros (protección de espuma, tensor, cadena, almohadilla del poste),
segunda equipación del jugador, vallas con texto real, vitrina con trofeos y pizarra táctica.

### 15.7 Qué NO hacer (para no romper lo medido)

* **Nada de post-proceso** (`UnrealBloomPass`, `SSAO`): un pase de pantalla completa con dos render
  targets y shaders nuevos cuesta más que todo lo de la fase A junto. El brillo se consigue con
  emisivos baratos y color de vértice.
* **Nada de sombras en tiempo real para lo nuevo**: el mapa se hornea una vez; lo que se mueva no
  proyecta o se rehornea a demanda (§3j).
* **Nada de librerías de físicas** (cannon, rapier): 30 volúmenes a mano son menos código, menos
  peso y no tocan el bucle de juego.
* **Nada de texturas nuevas** donde el color de vértice basta.

### 15.8 Orden propuesto

1. **Fundir los rigs por pieza** — habilita todo lo demás. Aceptación: juego ≤ 35 llamadas,
   entrevista ≤ 40, y la animación idéntica (comparación de píxeles de un ciclo de paso antes y
   después).
2. **Fase A** (cancha) — aceptación: ≤ 60 llamadas y ≤ 500 k triángulos, y ninguna vista peor que
   hoy en llamadas.
3. **Fase D** (colisiones) — aceptación: 6 zonas alcanzables, 12 objetos que ya no se atraviesan,
   0 llamadas nuevas.
4. **Fase B** (personajes y público), **Fase C** (cámara) y **Fase E** (atrezo), en ese orden.

Cada paso, con el ritual de siempre: `tsc` 0 errores, `npm test` verde con las pruebas nuevas de la
lógica que añada, `npm run build` y medida de llamadas y triángulos en las siete vistas.
