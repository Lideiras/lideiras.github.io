# PLAN — LOTE A · the-court

> **Qué es este documento.** El plan de implementación del primer lote de mejoras que pidió el
> propietario. Escrito para que una sesión futura lo ejecute sin haber estado aquí.
>
> **Estado:** pendiente de **APRUEBO** (checkpoint 1). No se ha escrito código de este lote.
> **Baseline verificado** el 2026-10-14 antes de redactarlo: `npm test` → **98/98** (7 ficheros) y
> `npm run build` → OK. `main.js` = 687,79 kB / **191,77 kB gzip**.

---

## 0. Antes de ejecutar: dos cosas obligatorias

1. **Commitear el árbol.** Hay **11 ficheros modificados sin commit** más `AGENTS.md` sin trackear:
   `boot.ts`, `main.ts`, `human.ts`, `tests/human.test.ts`, `styles.css`, `ball.ts`, `court.ts`,
   `tv.ts`, `util.ts`, `.gitignore`, `../notas.md`. Sin un punto de retorno no se puede distinguir
   lo que rompe el cambio propio de lo que ya estaba roto.
2. **Leer `AGENTS.md` y `handoff.md`.** Contienen invariantes y decisiones ya tomadas. Este plan no
   los repite salvo donde hay que entender el porqué.

---

## 1. Qué entra y qué no

| id | Entrega | size | riesgo | Ficheros |
|---|---|---|---|---|
| **T1** | Selector de idioma cinemático sobre la escena ya cargada | L | medium | `boot.ts`, `main.ts`, `index.html`, `styles.css`, `i18n.ts` |
| **T2** | Pelo con más volumen (laterales y nuca) | S | low | `human.ts`, `tests/human.test.ts` |
| **T3** | Medidor Takeover: 5 canastas seguidas → estela de fuego | M | medium | `ball.ts`, `hud.ts`, `styles.css`, `main.ts` |
| **T4** | Gestos de tiro por distancia + cambios de dirección bruscos | M | medium | `human.ts`, `main.ts` |

**Orden: T1 → {T2, T3} → T4.** No es arbitrario: ver §5 (colisiones).

### Fuera de alcance, y por qué
- **Entrevista como diálogo de cámara TV** (POV, REC parpadeante, canal). Acordado como **Lote B**;
  el propietario quiere **diálogo + formulario al final**, conservando el envío real y su rate-limit.
- **Carrito de balones + concurso de triples.** Es un minijuego completo (objeto, modo, reglas,
  cronómetro, 5 puestos, gestión de balones). **El propietario lo activará expresamente más adelante.**
- **Experiencia / túnel dinámica.** No hay definición. No se implementa nada de esto.
- **Marcador del techo con los dígitos cortados.** Es `T1` del lote ANTERIOR (de rendimiento), sigue
  vivo y aparte. No lo mezcles con este lote.

---

## 2. T1 — Selector de idioma cinemático

### Lo que pidió el propietario
> «la idea es que cargue todo antes, durante la barra de carga, es decir, el usuario entra en el link,
> carga todo como hasta ahora y aparece la escena cinemática, agrega quizás más texto y algo más de UI
> en la barra de carga para hacerla más vistosa durante la carga»

Más: cámara enseñando **el escenario en movimiento circular**, con **el personaje de fondo**, con
**información del juego, controles y qué se puede hacer dentro de él**.

Flujo resultante: **entrar → barra de carga → cinemática → elegir idioma → juego.**

### Por qué sale barato (hallazgo verificado)
`createGame()` (main.ts:90) hace **todo** el trabajo pesado y devuelve `{ start, dispose }`.
Cuando resuelve, la escena **ya está construida y horneada**: `mergeStaticLots()` (2349) →
`bakeShadows()` (3008) → `precargaShaders()`/`precargaTexturas()` (3023-3024) →
`elegirEscalaInicial()` (3025) → `onProgress(1)` (3030).

Y `start()` (main.ts:3381) son **seis líneas** que no construyen nada:
`sfx.unlock()`, `setMode('play')`, `updateCamera(0,true)`, toast, `clock.start()`, `requestAnimationFrame(frame)`.

→ **No hay que reordenar la carga: hay que añadirle un hermano.** La escena ya existe antes de que
se pregunte el idioma. El miedo al "192 kB antes de elegir" quedaoise neutralizado por el propio
diseño del propietario: el 3D se descarga igual, solo cambia el orden en que se ve.

### Diseño

**a) Comprobación de WebGL2 ANTES que el selector.** Hoy la comprobación está *dentro* de
`start()`, detrás de `setLang`. Si la cinemática va antes del selector, quien no tenga WebGL2
descargaría 192 kB para nada y además vería un selector antes de caer a `/classic/`.
→ Mover `webgl2Available()` y su `location.replace('/classic/')` al principio del arranque, antes de
todo. Los **dos** redirects a `/classic/` (sin WebGL2 y excepción en `createGame`, boot.ts:99-100)
siguen intactos. Es la red de seguridad de quien no tiene GPU: es lo más importante que no puede romperse.

**b) Idioma sin decidir, y sin persistir.** `i18n.ts:5` → `let current: Lang = 'es'`. `setLang`
(18-27) fija `current`, actualiza `document.documentElement.lang`, **persiste en `localStorage`** y
dispara `langchange`. El HUD y los paneles **ya se re-tuentalo en caliente** con ese evento.
→ **Durante la cinemática no se llama a `setLang`.** La puerta se pinta **bilingüe y estática**
(como la frase actual «Elige tu idioma · Choose your language»), con la lista de controles en ES y EN.
Al elegir: `setLang()` persiste y dispara `langchange`, que re-tuente lo ya construido. Sin doble trabajo.

**c) La cámara.** `updateCamera(dt, snap)` (main.ts:1436-1493) tiene **dos** ramas: `sectionCam ?
SECTION_CAMERA[sectionCam]` (1438-1445) y el plano de juego (1446-1475). Lo más parecido que existe
a lo pedido es una micro-órbita de ±9° con `mode === 'panel'` (1467-1473).
→ Añadir una **tercera rama** de órbita para `mode === 'attract'`. Órbita lenta, altura deista,
mostrando la pista y el personaje de fondo. **Reutilizar el lerp y el `shake` que ya están ahí.**

**d) El arranque.** `Mode = 'play' | 'panel' | 'interview'` (27) → añadir `'attract'`. Y añadir
`beginAttract()` al `GameHandle`: arranca el rAF con la cámara de órbita, **sin** `sfx.unlock()`,
**sin** input y **sin** el toast de bienvenida. `start()` se queda como está.
En modo `attract` el input del jugador debe estar inerte: no hay controles hasta elegir idioma.
`dbg.freeze` (1437) ya permite congelar el objetivo a mano en DEV para depurar la órbita.
`__court.previewSection(id)` (3125/3377) sirve de patrón para exponer una sonda nueva si hace falta.

**e) La barra, más vistosa.** El `#loader` (index.html:31-34) son `.loader-bar > i#loader-fill` y
`p#loader-text`. Se puede ennriquecer con una línea de etapa legible y texto de ayuda. Ojo al coste:
el **prewarm ya cuesta 536 ms en la barra** (125 ms sin él) y el propietario lo aceptó explícitamente
a cambio de fluidez. **No añadir trabajo pesado a la barra**, solo presentación. `onProgress` tiene que
seguir respondiendo en cada fase: cede un fotograma (`nextFrame()`) antes de cada compilación y de
cada dos texturas, y la barra es lo que se pinta en ese hueco.

### ⚠ Decisión que hay que confirmar (checkpoint 1)
Hoy `ASK_EVERY_VISIT = false` (boot.ts:28): **la puerta solo aparece si no hay idioma guardado**, y el
código documenta por qué —«una pantalla entera de fricción para una decisión que ya estaba tomada»
(líneas 19-27).

**Este plan recomienda mantener `false`**: la cinemática se ve en la **primera visita**; quien ya
tiene idioma guardado sigue viendo exactamente lo de hoy (barra → juego), sin fricción nueva.
La alternativa (mostrarla siempre) es attractive pero **contradice una decisión previa y medida** del
propietario, y obliga a decidir idioma en cada visita. **Con una palabra tuya se cambia.**

### Criterio de terminado
- Primera visita sin idioma guardado: barra → órbita cinemática con controles visibles en ES/EN →
  elegir idioma → el juego entra con **todo** el texto en el idioma elegido, incluido lo ya construido.
- Visita con idioma guardado: comportamiento idéntico al actual.
- Sin WebGL2: cae a `/classic/` **sin** haber descargado el chunk 3D.
- `npm test` sigue en 98/98 y `npm run build` OK.
- Ningún texto nuevo sin ES **y** EN: `i18n.ts` es `satisfies Record<string, L10n>`, así que falta una
  traducción = **falla el typecheck y rompe el build**, no los tests.

---

## 3. T2 — Pelo con más volumen

### Lo que pidió el propietario
> «me gustaría mejorar también el diseño del pelo de los personajes para dar más volumen ya que ahora
> se ve bastante básico sobre todo en los laterales»

### Dónde está el hueco (verificado)
Bloque **«Cabeza y pelo»** en `src/game/builders/human.ts` **409-464**. El pelo son 5 capas + cejas,
**9 `fillCells`**:

| Línea | Capa | Región |
|---|---|---|
| 427 | Masa trasera / nuca | `x −10..9, y 24..45, z −10..−9`, `hairAlt` |
| 429 | Casquete | `x −10..9, y 37..45, z −9..7`, `o.hair` |
| **432-433** | **Patillas ← AQUÍ** | `x = −11` (y 32..39) y `x = +10` (y 34..39), `z −8..−1`, `hairAlt` |
| 436-439 | Flequillo | 3 mechones en `z = 8..9` |
| 441-442 | Cresta | 2 bloques |

Referenciales: `chin = C.torsoTop = 20`, `skullTop = capY = 37`, `crestY = 46`. `HX = 10`, `HZ = 8`.

**El diagnóstico del propietario es exacto:** las patillas cubren **solo media altura** (y 32-39 de un
casquete que llega a 45) y **solo la mitad trasera del costado** (`z −8..−1`). Y la **nuca por debajo
de `y = 24` está descubierta**, porque la masa trasera arranca en `chin + 4`.

### Cómo
- Extender las **patillas** (432-433) a toda la altura del casquete y a todo el costado.
- Bajar la **masa trasera** (427) para cubrir la nuca por debajo de `y = 24`, escalonada.
- **Respetar la paleta:** la guía limita el cabello a una base y **un** tono de sombra, y `hairAlt` es
  «sólo para la masa trasera y las patillas». Los laterales y la nuca **son** sombra del mismo pelo →
  `hairAlt`. **No inventar un tercer tono.**
- `VOXEL_MATERIAL` se comparte **por identidad**: los rellenos deben usar el mismo material o no se
  funden y es un draw call extra.

### ⚠ El riesgo serio
El reparto vertical está **documentado como decisión de diseño** (human.ts:139-164): «cabeza + pelo =
28 de 48 celdas = 58,3 %, proporción de vinilo». Subir ese porcentaje **es un cambio de diseño
consciente y hay que decirlo**, no un accidente.

Y `tests/human.test.ts` fija **geometría absoluta** (altura 1,809 m; pivote de cadera).
Si las cifras se mueven, se mueven **POR DISEÑO**: se actualizan **con justificación escrita, nunca
relajando el aserto para que pase**.

### Criterio de terminado
Laterales y nuca con volumen visible en el juego; `npm test` verde; si cambiaron cifras de
`human.test.ts`, el commit explica **por qué** se movieron.

---

## 4. T3 — Medidor Takeover + estela de fuego

### Lo que pidió el propietario
> «que haya un medidor "Takeover" que si el usuario encesta 5 veces seguidas el balón tenga una estela
> de fuego hasta que falle canasta»

### Lo que ya existe (y lo que NO)
- **Ya existe `missStreak`**: `let missStreak = 0` (main.ts:1092), se pone a 0 en `onScore` (1187) y
  sube en **1981** (el `else` de `ball.settled` cuando `!ball.scored`). No se persiste y **solo** se
  usa como `assist = missStreak >= 3 ? 0.4 : 0.85` en `shoot` (1228).
  → **Cuenta FALLOS. El Takeover cuenta ACIERTOS.** Son la racha complementaria: **no reutilizar esa
  variable**, o se rompe el assist.
- **Ya existe `stats`** = `{made, attempted}` en `localStorage['court.stats']` (71-88, 1004). Se sube en
  `onScore` (1187-1191) y `attempted` en `shoot` (1212).
- **No existe ningún contador de racha en el HUD.** Ese es el hueco.
- API de `Hud` (hud.ts): `setRecord` 358, `setProgress` 366, `setPrompt` 371, **`showMeter` 384**,
  `toast` 405, `mountTouch` 414.

### Cómo
- **Estado nuevo y propio**: racha de aciertos consecutivos, `+= 1` en `onScore` y `= 0` en el punto
  donde hoy sube `missStreak` (1981). **No tocar `missStreak`.**
- **El HUD necesita un elemento nuevo** y **no puede ocupar el mismo sitio en pantalla que
  `showMeter`**: ese medidor se oculta con `showMeter(null)` (main.ts:1817, 1861) y vive en ese hueco.
- La estela **no puede proyectar sombra**: `shadowMap.autoUpdate = false` y el horneado es único
  (invariante 1). El balón ya va sin `noCastShadow`.
- **Coste**: el dueño mide en una **HD 4600 de 2012**, con `B ≈ 22,4 ms` por píxel. Una estela
  `AdditiveBlending` sin sombras es barata; una cinta de geometría pesada no lo es. **Presupuesto:
  que la estela no se note en la mediana.** Si se nota, es un trimado de billboards, no un ajuste
  de la física.
- Todo texto nuevo necesita clave en `i18n.ts` **en los dos idiomas**.

### Criterio de terminado
5 canastas seguidas → el modo se enciende y es visible; al fallar se apaga; el medidor no pisa al
medidor de tiro ni en móvil en vertical; `npm test` + `npm run build` verdes.

---

## 5. T4 — Gestos de tiro por distancia

### Lo que pidió el propietario
> «se podrían agregar más animaciones al personaje principal jugable? Por ejemplo que si está cerca de
> canasta haga un mate o una entrada a canasta en vez de un tiro, que el tiro si es muy lejos sea un
> movimiento diferente, movimiento de cambios de dirección o cambios de dirección bruscos»

### El hallazgo que lo abarata
**La física NO depende del gesto.** En `shoot(meter)` (main.ts:1211-1249) la trayectoria sale de un
**`y` fijo de 2,15 m** (1218) y `solveShot`/`applyShotError` no miran la pose. `SHOOT_JUMP` (config.ts:24)
lo dice en su comentario: «NO toca la trayectoria».

→ **El gesto se puede cambiar libremente sin mover la física ni los tests de tiro.**
→ **Prohibido tocar `solveShot` o `applyShotError`**: rebalancearían el juego y no es lo que se pidió.

### El punto de enganche
En `update()`, **`distAro` ya se calcula en main.ts:1813** y el tiro se suelta en **1814-1818**
(`if (!input.shootHeld) shoot(meterAt(chargeT))`). **La distancia al aro ya está en el bucle un
fotograma antes de `shoot()`.** Ese es el sitio natural para elegir la variante del gesto.

Y la escala de distancia **ya existe**: `difficultyAt(dist) = clamp((dist−1.5)/(SHOOT_RANGE−1.5), 0, 1)`,
`SHOOT_RANGE = 11` (shot.ts:44-46). 0 = debajo del aro, 1 = a distancia máxima.

### Cómo (el patrón del repo, no uno nuevo)
El rig mezcla poses por peso: `POSE_TASA = 12` (576), `mezclaPeso()` (586), `recogePeso`/`holdPeso`
(599-628), `animateHuman` (685). **`poseShoot` (849-861) y `poseCelebrate` (872-881) son las únicas dos
capas de pose y ambas MEZCLAN sobre la pose base; no asignan.** Hay tests que lo verifican: mezcla
por peso, poses con peso 0 no tocan ningún hueso, continuidad sin saltos.

→ **Añadir funciones nuevas** (`poseDunk`, `poseLejano`, …) siguiendo ese patrón de mezcla.
→ **NO ensanchar `poseShoot` ni convertirla en un `switch`**: rompe los tests de mezcla.

### Cambios de dirección bruscos
Ya existe `HAND_SWITCH_ANGLE = 0.7` (~40°, config.ts:27) para el cambio de mano de regate, y
`REGATE_HZ = 11` / `regateAltura()` (533-553). **Antes de inventar nada, leer cómo `animateHuman`
detecta ya la velocidad de giro** y colgar el gesto de brusquedad de esa medida existente.

### ⚠ Punto de encuentro
T3 y T4 se tocan en el **mismo bloque ~1900-1945** y en `update()`. **Quien implemente T3 debe dejar
la estela acotada en una función/objeto propio** para que T4 no tenga que adivinar. De ahí el orden
**T1 → {T2, T3} → T4**: `human.ts` no lo tocan T1 ni T3, así que T2 y T3 sí pueden ir en paralelo.

### Criterio de terminado
Mate/entrada al acercarse, gesto distinto en el tiro lejano, y giro brusco que se note — **sin mover
un solo número de la física**. `npm test` verde con los 98 casos, incluidos los 28 de `human.test.ts`.

---

## 6. Mapa de ficheros y colisiones

```
src/boot.ts               -> T1
index.html                -> T1
src/i18n.ts               -> T1   (bloquea el BUILD si falta una traducción)
src/game/main.ts          -> T1 -> T4        <-- CUELLO DE BOTELLA
src/game/builders/human.ts -> T2 -> T4
tests/human.test.ts       -> T2
src/game/ball.ts          -> T3
src/ui/hud.ts             -> T3
src/styles.css            -> T1 -> T3
```

- `main.ts` aparece en **T1, T3 y T4**. T1 → `updateCamera` 1436-1493, `sectionCam` 1045, `setMode`
  1049, `start()` 3381. T3 → `onScore` 1178 y el bloque de animación ~1900-1945. T4 → `update`
  1800-1818 y ~1944.
- **T3 y T4 se solapan en el MISMO bloque ~1900-1945.** Por eso T3 deja la estela delimitada.
- `human.ts`: T2 toca 409-464 (pelo) y T4 toca 849-881 (poses). **No se solapan.**

---

## 7. Verificación

**Puerta del lote, en este orden:** `npm test` → `npm run build`.

- `npm test` **no** pasa `tsc` ni `validate`, y `npm run build` **no** corre los tests. **Ninguno
  de los dos cubre al otro.** Los dos verdes son el mínimo.
- `npm run build` = `validate --strict && classic` (prebuild) + `tsc --noEmit` + `vite build`.
- `tests/*.check.ts` (**tightness**, **watertight**) **NO entran en vitest**: son guiones manuales con
  `npx tsx`. Si se tocan, cerrarlos a mano. No decir que «pasan» sin haberlos ejecutado.
- Sin CI, sin linter, sin formateador, sin `vitest.config.ts`: **no hay gate de estilo.**
- No bajar de 98 tests. Si un test falla, **arreglar el código, nunca el assert** —salvo que el
  número se mueva por diseño, y entonces con justificación escrita (§3).

---

## 8. Riesgo asumido

La referencia de rendimiento es un **Intel HD 4600 de 2012** (ANGLE/D3D11), no una máquina moderna.
El fotograma se ajusta a `A + B·s²` con **A ≈ 8,9 ms** fijos y **B ≈ 22,4 ms por píxel**. La mediana
actual a escala 0,7 es ~18,0 ms (~55 fps).

**Lo que este lote puede costar:** la órbita de la cinemática (solo durante la puerta, pero en la
máquina más débil y con más Thermal sensible), la estela de fuego (cada fotograma, siempre que haya
racha) y las capas de pose adicionales (matrices, barato).

**Regla:** nada entra sin justificarse con una medición. Si algo se nota en la mediana, se recorta la
feature, no se baja `ESCALA_MIN` (que es suelo desde 0,7: bajar más solo emborrona).

---

## 9. Lo que este plan NO puede responder

- **Cuánto costará de verdad la cinemática** en el HD 4600 del propietario: no se ha medido, y sin
  la máquina no se puede.
- **Cómo se ve realmente el pelo** desde el encuadre de juego: los números del rig dicen dónde está
  el hueco, pero el juicio «básico» es del propietario y necesita una captura.
- **Si la cinemática aguanta en vertical** (móvil): `CAMERA.portraitGrow` (config.ts:75) ya altera la
  distancia en aspect estrecho y no se ha comprobado el efecto de una órbita encima.

---

*Plan redactado con el código leído directamente (numeración de línea verificada el 2026-10-14).
Lo que no se pudo verificar está en §9, y no se ha rellenado con suposiciones.*