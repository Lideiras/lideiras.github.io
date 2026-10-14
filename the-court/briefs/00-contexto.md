# 00 — Contexto verificado para el LOTE A

> Documento de entrada común a los dos planificadores. Todo lo de aquí está **verificado leyendo el código** con número de línea. No lo vuelvas a descubrir ni lo contradigas. Lo que **NO** está aquí es lo único que tienes que investigar.

## Identidad del proyecto
Juego web Three.js que hace de portfolio. Vite 6 · TypeScript 5.6 `strict` · three **0.170.0 exacto** · Vitest 2.
Código, comentarios y ficheros **en español**. Los comentarios explican *por qué* y citan la medición que justifica el número.

## Baseline VERDE hoy (2026-10-14)
- `npm test` → **98/98 tests en 7 ficheros** `.test.ts`.
- `npm run build` → OK. `prebuild` = `validate --strict && classic`; luego `tsc --noEmit`; luego `vite build`.
- Bundle: `main.js` **687,79 kB / 191,77 kB gzip** (el chunk de Three.js).
- **No hay CI, ni linter, ni formateador, ni `vitest.config.ts`.** No inventes un gate de estilo.
- `tests/*.check.ts` (tightness, watertight) **NO entran en vitest**: son guiones manuales con `npx tsx`.

## Invariantes duros (vienen de AGENTS.md, verificados)
1. **`shadowMap.autoUpdate = false`**, horneado una sola vez con `bakeShadows()` (main.ts:3008). **Nada que se mueva puede proyectar sombra** (`noCastShadow`): jugador, balón y los dos actores del plató están fuera por eso.
2. **`VOXEL_MATERIAL` se comparte por identidad**: `batch.ts` agrupa mallas comparando material por *referencia*. Un segundo material del mundo no se funde = draw call extra.
3. **`mergeStaticLots()`** (main.ts:2349) funde el mundo estático al arrancar, excluyendo los rigs.
4. **`tests/human.test.ts` fija geometría ABSOLUTA** (altura 1,809 m; pivote de cadera). Si un cambio mueve esos números es **POR DISEÑO**: se actualizan con justificación, **nunca se relajan para que pase**.
5. **i18n**: `UI` es `satisfies Record<string, L10n>` (i18n.ts:32) y `L10n = {es, en}`. Falta `es` o `en` → **falla el typecheck → rompe el BUILD**, no los tests. `validate --strict` es la puerta.
6. **Rendimiento medido** en Intel HD 4600 (2012), ANGLE/D3D11: `A ≈ 8,9 ms` fijos + `B ≈ 22,4 ms` por píxel. Mediana a escala 0,7 ≈ 18,0 ms (~55 fps); mejor caso 16,6 ms. Draw calls 53-70. `ESCALA_MIN = 0,7` es suelo.
   - La **escala de render se MIDE** (`elegirEscalaInicial`), no se adivina. **Prohibido reintroducir heurística por nombre de GPU.**
   - **El prewarm cuesta 536 ms en la barra** (125 ms sin él) y el propietario lo acepta explícitamente a cambio de fluidez. Cualquier trabajo que se mueva a la barra se paga en esa cifra.
7. `time` = reloj decorativo (se congela con `prefers-reduced-motion`); `animTime` = reloj del personaje, **nunca** se congela. El feedback de input va con `animTime`.

## Las 4 tareas

### T1 — Selector de idioma cinemático  ·  size L · riesgo medium
Ficheros: `src/boot.ts`, `src/game/main.ts`, `index.html`, `src/styles.css`, `src/i18n.ts`

**Lo que el propietario ha decidido** (no lo abras a debate):
> «La idea es que cargue todo antes, durante la barra de carga, es decir, el usuario entra en el link, carga todo como hasta ahora y aparece la escena cinemática, agrega quizás más texto y algo más de UI en la barra de carga para hacerla más vistosa durante la carga.»

Flujo deseado: **entrar → barra de carga (como hoy, quizá más vistosa) → cámara cinemática girando sobre la pista con info de controles y de qué se puede hacer → el usuario elige idioma → juego.**

**Arquitectura verificada que lo hace barato:**
- `createGame(opts)` (main.ts:90) devuelve **`{ start, dispose }`** y TODO lo pesado ocurre dentro, ANTES de devolver: `mergeStaticLots()` 2349 → `bakeShadows()` 3008 → `precargaShaders()`/`precargaTexturas()` 3023-3024 → `elegirEscalaInicial()` 3025 → `onProgress(1)` 3030.
- `start()` (main.ts:3381) es **solo** 6 líneas: `sfx.unlock()`, `setMode('play')`, `updateCamera(0,true)`, toast de bienvenida con `t()`, `clock.start()`, `requestAnimationFrame(frame)`. **No construye nada.** → hace falta un hermano tipo `beginAttract()` que arranque el rAF con la cámara cinemática.
- `mode` es `type Mode = 'play' | 'panel' | 'interview'` (main.ts:27) y se fija en `setMode` (main.ts:1049). Añadir `'attract'` es el sitio natural.
- **NO existe hoy ninguna cámara cinemática.** `updateCamera(dt, snap)` (main.ts:1436-1493) tiene dos ramas: `sectionCam ? SECTION_CAMERA[sectionCam]` (1438-1445) y el plano de juego (1446-1475); luego lerp, `shake` y `lookAt`. Lo más parecido que hay es una micro-órbita de ±9° cuando `mode === 'panel'` (1467-1473). → una órbita es una **tercera rama**.
- `sectionCam: SectionId | null` (main.ts:1045), asignado solo en `openSection` (1148).
- `CAMERA` en config.ts:34-76 (fov 32, offset [0,12.4,10.2], lerp 4). `SECTION_CAMERA` config.ts:146-166 = seis planos `{pos, look, face}` fijos.
- `dbg.freeze` (1437) congela el objetivo de cámara en DEV — útil para depurar la órbita a mano. Ya existe `__court.previewSection(id)` (3125/3377) que llama a `encuadrar(id)`.
- `index.html` (46 líneas): `<body data-mode="gate">` (16) · `#lang-gate` (19-29) con `.gate-card` > `h1#lang-title` + `<p>` bilingüe + `.gate-buttons` con `button[data-lang=es|en]` + `a.gate-classic` · `#loader hidden` (31-34) con `.loader-bar > i#loader-fill` y `p#loader-text` · `canvas#game tabindex=0` (36) · `#ui` (37).
- `boot.ts` (115 líneas): `ASK_EVERY_VISIT = false` (**28**) · `webgl2Available()` (36-42) con `location.replace('/classic/')` en 47-50 · **`setLang(lang)` es la LÍNEA 45, la primera de `start()`** · import dinámico de `./game/main` (56) · `game.start()` (92) · `catch` → `/classic/` (99-100).

**El idioma, resuelto:** `i18n.ts:5` → `let current: Lang = 'es'`. `setLang` (18-27) fija `current`, actualiza `document.documentElement.lang`, **persiste en `localStorage` y dispara `langchange`**. El HUD y los paneles **ya se re-texto-es en caliente** con ese evento. → una puerta **bilingüe** sobre la cinemática no necesita `t()` hasta que se elige, y al elegir hay que dejar que `langchange` re-tuente lo ya construido. Ojo: si `setLang` se sigue llamando antes de tiempo, **persiste un idioma que el usuario aún no ha elegido**.

**Decisión abierta que debes resolver en el plan (recomiéndala, no la esquives):** con `ASK_EVERY_VISIT = false` hoy la puerta solo aparece si no hay idioma guardado. Al mover la cinemática *después* de cargar, se puede mostrar **siempre**. Eso choca de frente con una decisión previa del propietario documentada en el propio código (líneas 19-27: «una pantalla entera de fricción para una decisión que ya estaba tomada»). **Argumenta las dos opciones con su coste y recomienda una.** Si la recomiendas distinta, deja el cambio de `ASK_EVERY_VISIT` explícito y reversible.

**Los dos redirect a `/classic/` (WebGL2 ausente, 47-50; y excepción en createGame, 99-100) deben seguir funcionando intactos.** Es la red de seguridad de quien no tiene GPU. Si aparece la cinemática ANTES de comprobar WebGL2, quien no tiene WebGL2 carga 192 kB para nada y además ve un selector antes de la caída.

### T2 — Pelo con más volumen  ·  size S · riesgo low
Fichero: `src/game/builders/human.ts` (+ `tests/human.test.ts` solo si cambian celdas)

- `CHAR_VOXEL = 0.0185` (94), `D = 2` (97) → cada celda de diseño es 2×2×2 reales; `u(n) = n·D·CHAR_VOXEL` metros. Alto total **48 celdas de diseño**.
- Referenciales: `C.hip = 9` (167), `C.shoulder = 18`, `C.torsoTop = 20`, `C.headTop = 48`; `HX = 10`, `HZ = 8` (203-215).
- Bloque **"Cabeza y pelo"**: main las líneas **409-464**. Pelo = 5 capas + cejas, **9 `fillCells`**:
  - **427** masa trasera/nuca: `x −10..9, y 24..45, z −10..−9`, `hairAlt`
  - **429** casquete: `x −10..9, y 37..45, z −9..7`, `o.hair`
  - **432-433** **patillas** ← **AQUÍ ESTÁ EL HUECO QUE PIDE EL PROPIETARIO**: `x = −11` (y 32..39, z −8..−1) y `x = +10` (y 34..39, z −8..−1), `hairAlt`. Solo media altura y **solo la mitad trasera del costado**.
  - **436-439** flequillo: 3 mechones en `z = 8..9`, por delante, alturas 32/34/33 hasta 36
  - **441-442** cresta: 2 bloques en y 46-47 y 48
  - **458-459** cejas (NO son pelo)
- `chin = C.torsoTop = 20`, `skullTop = capY = chin+17 = 37`, `crestY = chin+26 = 46` (414-417).
- La **nuca por debajo de y=24 está descubierta**: la masa trasera arranca en `chin+4 = 24`.
- El reparto vertical está **documentado como decisión de diseño** (139-164): «cabeza + pelo = 28 de 48 celdas = 58,3 %, proporción de vinilo». Si subes ese porcentaje, es un cambio de diseño consciente y hay que decirlo, no un accidente.
- `o.hair` / `o.hairAlt` (15-21): la guía limita el cabello a una base y un tono de sombra, usado «sólo en la masa trasera y las patillas». **Usa `hairAlt` para lo que sea sombra del mismo pelo** (laterales/nuca) y no inventes un tercer tono.

### T3 — Medidor Takeover + estela de fuego  ·  size M · riesgo medium
Ficheros: `src/game/ball.ts`, `src/ui/hud.ts`, `src/styles.css`, `src/game/main.ts`

- **Ya existe un `missStreak`**: `let missStreak = 0` (**main.ts:1092**), se pone a 0 en `onScore` (1187) y se incrementa en **1981**, en el `else` de `ball.settled` cuando `!ball.scored`. **No se persiste** y **solo se usa** como `assist = missStreak >= 3 ? 0.4 : 0.85` en `shoot` (1228).
- **Ya existe `stats`** con `{made, attempted}` en `localStorage['court.stats']` (`loadStats` 71-79, `saveStats` 82-88, `stats = loadStats()` 1004). `stats.made++` + `hud.setRecord()` + `scoreboard.setScore()` en `onScore` (1187-1191). `stats.attempted++` en `shoot` (1212).
- **No existe ningún contador de racha en el HUD.** Ese es el hueco.
- API de `Hud` (hud.ts): `setRecord(made, attempted)` 358, `setProgress(n)` 366, `setPrompt(text|null)` 371, **`showMeter(value|null, sweet, charge, center)` 384**, `toast(text, ms)` 405, `addLabel` 214, `layoutLabels` 278, `mountTouch` 414. `refreshText()` 164 + `langchange` (128, 174).
- **Ojo al solape visual**: `showMeter(null)` oculta el medidor de tiro (main.ts:1817, 1861). Un medidor Takeover **no puede ocupar el mismo sitio en pantalla**.
- **La estela NO puede proyectar sombra** (invariante 1). Piensa además en el coste: el dueño mide en una HD 4600 de 2012, con `B ≈ 22,4 ms/píxel`. Un `AdditiveBlending` sin sombras es barato; un trail de geometría pesada no.

### T4 — Gestos de tiro por distancia  ·  size M · riesgo medium
Ficheros: `src/game/builders/human.ts`, `src/game/main.ts`

- `shoot(meter)` (**main.ts:1211-1249**), en orden: `stats.attempted++` (1212) · `nearestSide()` (1216) · `rim` (1217) · **`from` con `y` FIJO 2,15 m** (1218) · `solveShot(from, rim)` (1219) · **`dist` y `difficultyAt(dist)`** (1222-1223) · `evaluateMeter(meter, diff, sweetCenterAt(chargeT))` (1227) · `assist` (1228) · `applyShotError(...)` (1229) · `ball.launch(...)` (1235) · `flick = FLICK_TIME` (1237) · `launchJump(jump)` (1241, deliberadamente DESPUÉS de la trayectoria).
- **La trayectoria sale de un `y` fijo y NO depende del gesto.** `SHOOT_JUMP` (config.ts:24) lo dice en su comentario: «NO toca la trayectoria». → **T4 puede cambiar el gesto libremente sin mover la física ni los tests de tiro.** Lo que NO puedes tocar es `solveShot`/`applyShotError`, que rebalancearían el juego.
- `difficultyAt(dist) = clamp((dist−1.5)/(SHOOT_RANGE−1.5), 0, 1)`, `SHOOT_RANGE = 11` (shot.ts:44-46). Es decir **ya existe una escala de distancia**; 0 = debajo del aro.
- **Punto de enganche natural**: en `update()`, **`distAro` ya se calcula en main.ts:1813** y el tiro se suelta en 1814-1818 (`if (!input.shootHeld) shoot(meterAt(chargeT))`). La distancia ya está en el bucle un fotograma antes de `shoot()`.
- **Sistema de poses** (`human.ts`): `POSE_TASA = 12` (576), `mezclaPeso(actual, objetivo, dt, tasa)` (586), `RECOGE_TIME = 0.3` (599), `recogePeso` (614), `holdPeso` (628), `REGATE_HZ = 11` (533), `regateAltura` (553), `animateHuman` (685).
- **`poseShoot` (849-861) y `poseCelebrate` (872-881) son las ÚNICAS dos capas de pose, y ambas MEZCLAN sobre la pose base; no asignan.** Hay 28 tests que lo verifican (mezcla por peso, poses con peso 0 no tocan ningún hueso, continuidad sin saltos). → **añade una función NUEVA** (`poseDunk`/`poseLejano`) siguiendo el mismo patrón; **no ensanches `poseShoot`** ni la conviertas en un `switch`, o rompes los tests de mezcla.
- El regate ya tiene `HAND_SWITCH_ANGLE = 0.7` (~40°, config.ts:27) para el cambio de mano. El propietario también pidió «cambios de dirección bruscos»: mira cómo se detecta la velocidad de giro en `animateHuman` antes de inventar nada.

## Mapa de ficheros y colisiones (respetalo, es por donde se pierde el trabajo)
```
src/boot.ts              -> T1
index.html               -> T1
src/i18n.ts              -> T1
src/game/main.ts         -> T1 -> T4          <-- CUELLO DE BOTELLA
src/game/builders/human.ts-> T2 -> T4
tests/human.test.ts      -> T2
src/game/ball.ts         -> T3
src/ui/hud.ts            -> T3
src/styles.css           -> T1 -> T3
```
- `main.ts` aparece en **T1, T3 y T4**. Regiones: T1 → `updateCamera` 1436-1493, `sectionCam` 1045, `setMode` 1049, `start()` 3381. T3 → `onScore` 1178, bloque de animación ~1900-1945. T4 → `update` 1800-1818 y ~1944.
- **T3 y T4 se solapan en el MISMO bloque ~1900-1945.** Quien haga T3 debe dejar el estado de la estela **acotado y delimitado** (una función propia, un objeto propio) para que T4 no tenga que adivinar.
- `human.ts`: T2 toca 409-464 (pelo) y T4 toca 849-881 (poses). **No se solapan.** Buen par.
- Orden de ejecución: **T1 → {T2, T3} → T4**.

## Aviso de coordinación
Hay **11 ficheros modificados SIN COMMIT** en el árbol (`boot.ts`, `main.ts`, `human.ts`, `tests/human.test.ts`, `styles.css`, `ball.ts`, `court.ts`, `tv.ts`, `util.ts`, `.gitignore`, `../notas.md`) más `AGENTS.md` sin trackear. Se commitearán antes de empezar. No es tu problema, pero sí la razón por la que **no puedes relajar ningún assert**: si algo falla, puede que ya estuviera roto antes.

## Restricciones de salida
- Plan de **producto, ≤ 150 líneas**. Sin código de implementación, sin diffs.
- Español. Cada decisión con su **porqué** y, cuando venga de una medición, con el número.
- **Si algo no lo puedes verificar con lo que hay aquí, dilo explícitamente** en una sección final `NO VERIFICADO`. Es preferible a rellenar.
- No propongas pasos que el repo ya preclude (heurísticas de GPU, sombras dinámicas, segundo material del mundo, tocar `solveShot`).