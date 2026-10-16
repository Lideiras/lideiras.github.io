# THE COURT — Cuaderno de bitácora

> **Propósito:** que cualquier agente (o persona) pueda retomar la ejecución sin releer el plan entero.
> **Regla de oro:** antes de hacer nada, lee este archivo, luego `../the-court-plan.md` solo la sección indicada.
> Actualiza este archivo **en cada fase**: qué se hizo, qué se verificó, qué queda.

---

## 0. Contexto rápido

| Dato | Valor |
|---|---|
| Carpeta de trabajo | `the-court/` (**el portfolio estático de la raíz NO se toca: solo se lee**) |
| Portfolio fuente | `../index.html` + `../assets/index-mdcuKJhk.js` (React compilado) + `../assets/documents/CV_eng.pdf` |
| Plan | `../the-court-plan.md` (3150 líneas) — secciones 21 = checklist de fases |
| Node | v25.2.1 (el plan pide ≥ 20) ✔ |
| Stack | Vite 6 · TypeScript 5.6 `strict` · three **0.170.0** exacto · @types/three **0.170.0** exacto · Vitest 2 |
| Propietario | Daniel Noya Catoira (alias público "Lideiras") |
| Idioma del plan/bitácora | Español |

### Comandos

```bash
cd the-court
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run validate   # valida content.ts  (--strict falla si hay [[...]])
npm run classic    # genera public/classic/index.html
npm test           # 13 tests de física del tiro
npx tsc --noEmit   # comprobación de tipos
npm run build      # prebuild (validate --strict && classic) + tsc + vite build
npm run preview    # sirve dist/
```

---

## 1. Estado por fase

| Fase | Estado | Verificación registrada |
|---|---|---|
| F0 Inventario + tabla | ✅ **aprobada** | Tabla y datos confirmados por el propietario |
| F1 Scaffolding | ✅ hecha (starter) | `npm install` OK |
| F2 `i18n.ts` + `content.ts` | ✅ **hecha con datos reales** | `npm run validate` ✅ · `npx tsc --noEmit` ✅ |
| F3 config/shot/ball/tests | ✅ hecha | `npm test` → **13 passed (13)** |
| F4 Builders | ✅ **reescritos a voxel** | `npx tsc --noEmit` ✅ · geometría verificada con números |
| F5 input/audio | ✅ hecha | compila |
| F6 UI | ✅ **pixel-art + escala 1–10 + sección `stats`** | compila |
| F7 boot/main/styles | ✅ **reescrito a voxel** | `npx vite build` ✅ · carga diferida verificada con curl |
| F8 Versión clásica | ✅ **hecha** | `npm run classic` ✅ · `/classic/` sirve los 10 proyectos (HTTP 200) |
| F9 Contenido nuevo | ✅ sin pendientes: `content.ts` completo | `validate --strict` ✅ |
| F10 Formulario + despliegue | 🔴 falta `VITE_FORM_ENDPOINT` y `og.png` | build ✅ pero sin endpoint |
| F10 Formulario + despliegue | 🔴 no empezada (`.env` sin crear) | — |
| F11 Calidad | 🔴 no empezada | — |

---

## 2. Decisiones del propietario ya tomadas (NO volver a preguntar)

1. **Escala de skills 1–10** (no 1–5). Implica: tipo en `content.ts`, barra/aria en `panels.ts`, `x/10` en `build-classic.ts`.
2. **Skills se abre en la MESA DE ANOTADORES**, no en la canasta derecha.
   Ubicación: **centro de la banda lejana, x = 0, z ≈ −9**, delante de las gradas (no choca con el túnel en x = −10).
3. **Carteles**: reutilizar las **etiquetas flotantes HTML** que ya trae el plan (nítidas, accesibles, cambian de idioma en caliente), ancladas **encima del objeto**, no en el punto del jugador.
   Textos aprobados: Canasta izq. `Proyectos / Projects` · Mesa `Skills/Stats` · Banquillo `Sobre mí / About me` · Túnel `Experiencia / Experience` · Cámara TV `Entrevístame / Interview me`.
4. Idioma: **ES y EN**, se pregunta **antes de cargar el juego**, cada visita.
5. **La canasta derecha abre un panel de RÉCORD / ESTADÍSTICAS** de juego (tiros encestados,
   % de acierto, secciones descubiertas). No es contenido de portfolio, es juego puro.
6. El panel de récord **SÍ es la 6.ª sección**: `stats` entra en `SectionId`, `SECTION_IDS`,
   `ZONES`, el menú ☰, `i18n.ts` (claves `section_stats`), y el progreso pasa a **X/6**.
8. **Grano grueso (0.25 m) para las piezas grandes**: gradas y estructura de la canasta
   (poste, brazo, base). Se eligó porque a 0.0625 m las superficies grandes se leen como
   celosía. Tablero, aro, red, jugador y mesa siguen a 0.0625 m.
9. `sun.shadow.normalBias = 0.05` añadido (≈2 píxeles del mapa de sombras).
7. **ESTÉTICA VOXEL (decisión mayor, sesión 2).** Todo el mundo y **también los menús** pasan a
   low-poly voxel. Sustituye al "flat shading con primitivas suaves" del plan (sección 9).
   - **Grano: 0.0625 m** (bloque de 6.25 cm) — grano fino, tipo pixel-art.
   - **Tipografía: `@fontsource/silkscreen`** añadida como dependencia nueva (aprobada).
     Es la **única** dependencia que se añade al plan. `three` y `@types/three` siguen en 0.170.0.
   - **UI: pixel-art + marcos dibujados** — `border-radius: 0`, bordes gruesos, sombras duras,
     barras con muescas de píxel, marco de 9-slice dibujado a mano en CSS.
   - **Las medidas del aro NO cambian** (3.05 m, radio 0.225 m): los 13 tests de física dependen
     de ellas. El voxel es sólo la piel/geometría, nunca la física.

### Consecuencias técnicas de la decisión 6 (pendientes de implementar)
- `content.ts`: `SectionId = 'projects' | 'skills' | 'about' | 'experience' | 'contact' | 'stats'`
- `config.ts`: `SECTION_IDS` con 6 ids · `ZONES`: la entrada `skills` (canasta derecha, `kind:'shoot'`)
  se sustituye por `{ id:'stats', kind:'walk', x: rimX(1), z: 0, radius: 4.5 }` y
  `skills` pasa a `{ id:'skills', kind:'walk', x: 0, z: -9, radius: 2.4 }` (mesa de anotadores).
- `i18n.ts`: añadir `section_stats` (ES `Récord` / EN `Record`) y las etiquetas del panel.
- `main.ts`: MVP a 6 secciones; el panel de stats lee contadores nuevos (localStorage).
- **Nota:** `ZONES` alimenta también los anillos naranjas y las etiquetas flotantes de la sección 13.

---

## 3. Inventario del portfolio (F0) — datos REALES extraídos

> Fuente: `../assets/index-mdcuKJhk.js` (strings del bundle React) y `../assets/documents/CV_eng.pdf`
> (el PDF usa fuentes subconjuntadas con CIDs; se extrajo decodificando los `ToUnicode` CMap).

### person
| Campo | Valor real | Origen |
|---|---|---|
| name | Daniel Noya Catoira | CV (cabecera) |
| initials | ❓ PENDIENTE (máx. 3) | — |
| jerseyNumber | ❓ PENDIENTE | — |
| role | Fullstack Developer (actual) | CV Experience / home "role" |
| location | Girona, Catalonia | home |
| email | contactdanielnoya@gmail.com | contacto + CV |
| social | LinkedIn `linkedin.com/in/daniel-noya-catoira/`, X `x.com/LideGameDev`, TryHackMe `tryhackme.com/p/Lideiras`, itch.io `danoya.itch.io` | home footer |
| social extra | `+34 628154217`, dirección "Carrer dels Rajolers 7A 3C, 17003 Girona" | CV (NO usar: dato personal) |

### about (texto original en INGLÉS, en "About me")
4 párrafos: *Who I Am* / *What I Do* / *My Passions* / *Beyond Code*.
Traducir al ES con `[[REVISAR TRADUCCIÓN]]`.

### projects (10, todos `status: completed`, categoría `game-development`)
sobreviviu-udg 2022 · long-live-the-king 2022 · multiplayer-simple-game 2023 · vr-game 2022 ·
endless-runner-game 2023 · godot-2d-plataformer 2022 · **tfg-game "Endless Blue" 2025** ·
pinball-godot-game 2021 · las-aventuras-del-seton-magico 2021 · dungeon-hunter-godot 2021

### timeline (del CV — fechas reales)
**Trabajo**
- Global Fun Partners — Fullstack Developer — Lloret de Mar — Feb 2025 → actualidad
- Noddon Technology Consulting — IT Solutions Developer — Girona (remoto) — Mar 2024 → Feb 2025
- Irish Defence Forces — Office Worker (Volunteer) — Feb 2017 → Mar 2017
- St. Patricks Centre — Teacher (Volunteer) — Mar 2017 → Apr 2017
**Estudios**
- Girona University — Master's in Data Science and AI — *in progress, SIN FECHA DE INICIO* ❓
- Girona University — Game Design and Development — GPA 7/10 — Jun 2025
- Università degli Studi di Cassino e del Lazio Meridionale — Study Abroad — Sep 2022 → Feb 2023
- St Kieran's College (Kilkenny) — Study Abroad — Sep 2016 → Jun 2017
- IES Frei Martín Sarmiento (Pontevedra) — GPA 8.25/10 — Jun 2019
**Deporte / actividades**
- Semi-pro Basketball Player — Sep 2017 → actualidad
- Debate Team Member — Pontevedra — Sep 2014 → Jun 2019

### skills (sin niveles todavía — el propietario debe dar 1–10)
Programming Languages: Python, JavaScript, SQL, HTML/CSS, C++, C#, PHP, Laravel, React, Kotlin (Basic)
Software/Tools: Unity, Unreal Engine, Git, ServiceNow, Godot, Blender, Substance Painter, Adobe Suite
Development Areas: Game design, Game development, database management, application development, 3D modeling, 3D Animations, software development
Cybersecurity (página "Additional Information"): pentesting, vulnerability assessment, security auditing, Metasploit, Nmap, Burp Suite
Languages: Spanish (native), Galician (native), English (native), Catalan (professional), Italian (intermediate)

---

## 3c. RESUELTO (sesión 6): los modelos se veían huecos

**Síntoma:** en prácticamente todos los elementos se veía a través de la figura.
**Causa:** el material voxel usaba `side: FrontSide` (por defecto). Cualquier cara
cuya orientación quedara al revés la consumía el backface culling y el modelo se leía
como una reja. **La geometría siempre fue correcta** (verificado: 0 quads deformados,
0 normales invertidas, bboxes exactos en todos los builders).
**Arreglo:** `side: THREE.DoubleSide` en el material de `VoxelWorld.build()`. El culling
de caras internas ya se hace al construir la malla, así que no se emiten caras de sobra;
el sobrecoste es rasterizar la cara trasera, que el depth test descarta.
**Otro bug real encontrado de paso:** `VoxelWorld.sphere()` marcaba como macizo el
envoltorio completo (cajas fuera del radio) además de la esfera, y el culling interior se
comía las caras de la superficie: el balón quedaba con agujeros. Ahora sólo ocupa celda
lo que cae dentro del radio.

## 3d. ESTÉTICA TROVE — sesión 7 (implementada)

**Investigación:** guía oficial de Trove en trovesaurus p.3976. Principios aplicados:
"bright, fun and silly" · "no uses colores más oscuros que 10.10.10" ·
"Blocky before organic" · "coloring simple, shading smooth, el color vivo es acento" ·
"hand-coloring para el shading, no degradados automáticos".

**Cambios implementados**
| Archivo | Cambio |
|---|---|
| `main.ts` | `SKY` centralizado (cielo/niebla/luz), luz de relleno, `toneMappingExposure 1.18` |
| `util.ts` | `PALETTE` Trove (27 entradas, ninguna < `0x1e1e1e`), `CROWD_COLORS`, `shadeColor()` que tiñe la AO a violeta en vez de apagarla a negro, `sphere()` corregido, `side: DoubleSide` |
| `court.ts` | Parqué `#d9a05b`, key `#b8443c`, líneas `#fdf6e8`, gradas por bandas de bioma con remate claro, suelo `#6f9fd8`, público con `CROWD_COLORS` |
| `human.ts` | Proporción **chibi**: cabeza ~1/3 de la altura, torso corto y ancho, zapatón exagerado, flequillo, ojos grandes. Pivotes conservados (cadera 0.85, hombro 1.32) |
| `props.ts` | Canasta de vuelta a grano fino (más cubos → silueta definida), tornapunta escalonado |

**Verificación**
- `tests/watertight.check.ts` (nuevo): cada arista de la malla debe usarse 2 veces.
  → **0 aristas abiertas en todos los modelos**. Sin huecos.
- `tsc` 0 errores · `npm test` 13/13 · `validate --strict` ✓ · `build` ✓

**Pendiente**: FPS sin medir (no afirmo rendimiento). Sin vegetación, sin degradado de
cielo con nubes, sin variación de terreno. El jugador no se ha verificado de frente.

## 3b. ABIERTO: patrón triangular en la superficie de las piezas voxel grandes

**Síntoma:** el poste de la canasta y el brazo muestran un patrón de "tejas"
(triángulos claros y oscuros alternados) en vez de caras lisas.

**Lo que YA se ha descartado (con measurements, no de memoria):**
| Hipótesis | Prueba | Resultado |
|---|---|---|
| Geometría rota | `quadcheck.ts`: los 6.702 quads de la canasta | 0 deformados, 0 normales no perpendiculares, 0 restos → **geometría correcta** |
| Oclusión de ambiente | Colores de vértice aplanados (q3) | el patrón **persiste** |
| Sombras / shadow acne | `shadowMap.enabled = false` (q2) y `normalBias = 0.05` | el patrón **persiste** |
| Sombreado suave vs plano | `flatShading` false → true | el patrón **persiste** |

**Estado: NO AISLADO.** Siguiente paso recomendado:renderizar la canasta aislada con
cámara ortográfica desde un ángulo conocido, o sustituir temporalmente el material por
`MeshBasicMaterial` (que ignora toda la iluminación) para ver si el patrón es de color
de vértice o de iluminación.

## 4. Datos del propietario — APROBADOS en la sesión 1 (ya no preguntar)

| Campo | Valor aprobado |
|---|---|
| `person.name` | Daniel Noya Catoira |
| `person.initials` | **LID** |
| `person.jerseyNumber` | **23** |
| `person.role` | Fullstack Developer |
| `person.tagline` | **ninguno** → el campo pasa a `tagline?: L10n` (opcional) |
| `person.location` | Girona, Catalonia |
| `person.email` | contactdanielnoya@gmail.com |
| `person.social` | LinkedIn · X (@LideGameDev) · TryHackMe · itch.io |
| `about.highlights` | 4 fichas: En la pista (semiprof. desde 2017) · Idiomas (5) · TFG Endless Blue (8/10) · Debate (Parlamento de Galicia) |
| `skills[].level` | escala **1–10**, borrador de la tabla de la sesión 1 **APROBADO tal cual** |
| Master's UDG | **2025 → actualidad** |

**Niveles aprobados:**
Lenguajes: C# 9 · JS 9 · PHP 8 · HTML/CSS 8 · SQL 7 · Python 6 · C++ 5 · Kotlin 3
Frameworks: Laravel 8 · React 8 · WordPress 8 · ServiceNow 8
Herramientas: Unity 9 · Git 9 · Godot 7 · UE 7 · Blender 6 · Substance Painter 5 · Adobe 6
Áreas: Game dev 9 · Game design 8 · App dev 8 · Software dev 8 · DB mgmt 7 · 3D modeling 6 · 3D animations 6
Ciberseguridad: Pentesting 7 · Vuln. assessment 6 · Security auditing 6 · Metasploit 6 · Nmap 6 · Burp Suite 6
Idiomas: Español 10 · Gallego 10 · Inglés 10 · Catalán 9 · Italiano 6

---

## 5. Lista viva de marcadores

### `[[PENDIENTE]]` — datos que faltan
- [x] ~~`person.initials`~~ → LID
- [x] ~~`person.jerseyNumber`~~ → 23
- [x] ~~`person.tagline`~~ → ninguno (campo opcional)
- [x] ~~`about.highlights[]`~~ → 4 fichas del CV
- [x] ~~`skills[].items[].level`~~ → borrador aprobado
- [x] ~~ Master's: fecha de inicio~~ → 2025
- [x] ~~nombre real en `index.html`~~ → ya pone "Daniel Noya Catoira"
- [x] ~~`timeline` `game-design-development-udg`: fecha de inicio del Grado~~ → **2019** (respondido por el propietario)
- [ ] `VITE_FORM_ENDPOINT` (Fase 10) — lo pide el propietario
- [ ] `public/og.png` 1200×630 — lo crea el propietario
- [ ] **5 enlaces de descarga `.zip` perdidos**: el portfolio viejo los servía como rutas relativas
      (`/assets/games/Juego Multijugador.zip`, `Juego VR.zip`, `Juego Godot.zip`, `PinballGodot.zip`,
      `LasAventurasDelSetonMagico.zip`). El validador **rechaza** rutas relativas (solo `http(s)`/`mailto`),
      así que están sin meter. Además `DungeonHunter.zip` **no existe** ni en el repo viejo (enlace roto ya
      antes de este proyecto). Hace falta el dominio final para hacerlos absolutos.

### `[[REVISAR TRADUCCIÓN]]` — **TODOS CERRADOS**
- [x] los 5 párrafos de `about.paragraphs` (traducidos EN→ES)
- [x] los 10 `projects[].summary` + los 10 `projects[].details`
- [x] los 11 `timeline[].description` y los títulos de los hitos
- **0 marcadores restantes.** Terminología verificada en español de España
  (FIBA / Federación Española de Baloncesto): "baloncesto", "canasta", "aro",
  "tiro de tres", "tiro libre", "tablero", "rebote", "lanzar a canasta".

---

## 5. Desviaciones respecto al plan (registro)

| # | Fecha | Desviación | Motivo |
|---|---|---|---|
| 1 | 2026-10-12 | Escala de skills **1–10** en vez de 1–5 | Decisión del propietario |
| 2 | 2026-10-12 | La sección **skills** se abre en la **mesa de anotadores (0, −9)** en vez de la canasta derecha | Decisión del propietario |
| 3 | 2026-10-12 | **Carteles nuevos** anclados sobre los objetos con etiquetas flotantes HTML | Decisión del propietario |
| 4 | 2026-10-12 | **Estética voxel**: el mundo pasa de primitivas suaves con `flatShading` a cubos de 6.25 cm con culling de caras + AO por vértice. El plan (sección 9) ya no aplica | Decisión del propietario |
| 5 | 2026-10-12 | **Escala de skills 1–10** en `content.ts`, `panels.ts` (`aria-valuemax=10`, ancho `n*10%`) y `build-classic.ts` (`x/10`) | Decisión del propietario |
| 6 | 2026-10-12 | **`SectionId` gana `'stats'`**; `ZONES` reorganizada; la mesa de anotadores es un prop nuevo (`buildScorerTable`) | Decisión del propietario |
| 7 | 2026-10-12 | **`Project` gana `details?: L10n`** (su `fullDescription`) para no perder el contenido largo | Decisión del propietario |
| 8 | 2026-10-12 | **`person.tagline` pasa a opcional** | Decisión del propietario |
| 9 | 2026-10-12 | **Dependencia nueva**: `@fontsource/silkscreen@^5.3.0`. Única añadida; `three` y `@types/three` siguen en 0.170.0 | Aprobada por el propietario |
| 10 | 2026-10-12 | `PIXEL_FONT` (5x7) y `VoxelWorld` viven en `util.ts`; no se añadió ningún fichero nuevo | Para no romper la estructura del plan |
| 11 | 2026-10-12 | El rótulo del túnel era texto "EXIT" (sin traducir). Sustituido por un **pictograma de flecha en voxels** | Regla: nada de texto visible sin traducir |
| 12 | 2026-10-12 | Líneas de pista pasan de voxels 3D a la textura del suelo (`drawLines`) | Un bloque de 6.25 cm en el suelo se lee como una valla con cámara rasante |
| 13 | 2026-10-12 | Las gradas se voxelizan a grano 0.25 m en vez de 0.0625 m | A grano fino eran 785.000 triángulos solo en las gradas |
| 14 | 2026-10-12 | Las 6 caras del voxel se escriben con **esquinas explícitas** por cara | El winding deducido de tangentes salía invertido y el backface culling hacía objetos "en esquirlas" |

---

## 6. Cómo retomar el trabajo

1. Leer las secciones **0, 1, 2 y 3** de este archivo.
2. Ver `## 1` para saber en qué fase está.
3. Ejecutar el comando de verificación de esa fase **antes** de tocar nada.
4. Al terminar la fase: actualizar `## 1`, `## 4`, `## 5` y añadir una entrada en `## 7`.

---

## 7. Registro cronológico

### 2026-10-12 — Sesión 1 (arranque)
- Leído el plan completo (0–21).
- `the-court-starter.zip` **ya estaba descomprimido** en `the-court/` (fases 1, 3–7 hechas por el starter).
- `npx tsc --noEmit` → **0 errores**. `npm test` → **13 passed (13)**.
- Inventario del portfolio extraído del bundle y del CV (ver `## 3`).
- **No se ha abierto nunca un navegador**: la sección 13 del plan sigue sin comprobar.

### 2026-10-12 — Sesión 2 (voxel + contenido real)
- `content.ts` reescrito con los datos reales del portfolio y del CV (10 proyectos, 6 grupos de skills, 11 hitos).
- **Motor voxel** añadido en `util.ts`: `VoxelWorld` (grano 0.0625 m), culling de caras internas y AO por vértice.
- `props.ts`, `human.ts`, `court.ts`, `tv.ts` reescritos a voxel. Dorsal y marca central en pixel-art 5x7.
- `styles.css` reescrito a pixel-art: `border-radius: 0`, bordes gruesos, sombras duras, muescas.
- `config.ts`: `ZONES` reorganizada (skills → mesa de anotadores; stats → canasta derecha).
- `panels.ts`: escala 1–10, renderer de `stats`, campo `details`.
- `i18n.ts`: `section_stats`, 5 `sign_*`, 6 claves del panel de récord.
- `build-classic.ts`: tagline opcional, `x/10`, `details`, y copia de la fuente pixel a `public/classic/fonts/`.
- **Verificado con números:** cubo de 8000 celdas → 4800 triángulos (sin culling serían 96 000); 1 voxel → 12 triángulos; AO da 3 niveles en el fondo de un hueco y 2 en las paredes.
- **Verificado con curl:** `index.html` sólo carga `boot.ts`; `boot.ts` tiene 0 referencias a three; `main.ts` sí; `/classic/` sirve los 10 proyectos y la fuente responde 200.

### 2026-10-12 — Sesión 3 (traducciones finales)
- Terminología de baloncesto verificada en fuentes de español de España (FIBA, Federación Española de Baloncesto).
- Revisión editorial del español y **cierre de los 37 marcadores `[[REVISAR TRADUCCIÓN]]`**.
- Corregidos errores introducidos durante la redacción (concordancia, "un plataformas", "entregar una experiencia").
- `validate --strict` queda con **1 único error**: la fecha de inicio del Grado (`[[PENDIENTE]]`).
- **Fecha de inicio del Grado (UdG) resuelta: 2019** → el `[[PENDIENTE]]` desaparece.
- **`validate --strict` en verde** y **`npm run build` completo en verde**.

### 2026-10-12 — Sesión 4 (depuración con navegador real)
- **Se encontró un Chrome for Testing en la caché de Playwright** y se montó un cliente
  mínimo de Chrome DevTools Protocol con el `WebSocket` nativo de Node. A partir de aquí
  SÍ se pueden ver capturas reales: la sección 13 del plan deja de ser "no comprobado".
- **Fallo que reportó el propietario** (la barra de "Calentando…" salía y volvía al selector
  de idioma): causa raíz `sign_stats` faltaba en `i18n.ts`. El `as UIKey` de `signKey()` lo
  ocultaba a `tsc`. Añadida la clave **y** un aserto de compilación (`SignKeysExist`) que
  hace fallar `tsc` si falta cualquier `sign_*`.
- **Bugs visuales encontrados mirando de verdad:**
  1. Parquet: juntas cada 25 cm al 35% de opacidad → la pista parecía una reja. Atenuadas.
  2. Líneas de pista y anillos de zona en voxels de 6.25 cm → se leían como vallas. Ahora planas.
  3. Anillos de zona: la digitalización celda a celda dejaba huecos radiales (rueda de radios).
     Ahora se rasteriza barriendo la circunferencia.
  4. Gradas: 785.376 → 52.124 triángulos.
  5. **Winding de las caras voxel invertido**: 3 de 6 caras tenían la normal al revés, el
     backface culling se comía la mitad de la geometría y todo salía en esquirlas.
     Reescrito con esquinas explícitas por cara.
  6. Canasta: poste más grueso (0.3 m), tablero de 2 voxels, aro por barrido, red de 8 hilos.
- **Herramientas de depuración creadas en** `~/.../T/opencode/`: `cdp.mjs`, `shots.mjs`,
  `inspect.mjs`, `verify.ts`. Se pueden volver a lanzar.
- Gacho `window.__court` SOLO en `import.meta.env.DEV` (Vite lo elimina del build).
- **Bug reportado por el propietario (segunda tanda): los paneles salían vacíos y el juego se
  congelaba.** Causa: el constructor de `Hud` hace `uiRoot.innerHTML = ...` sobre `#ui`, y
  como `PanelManager` se construía UNA LÍNEA ANTES, su `<div class="panel">` se borraba al
  crear el HUD. El modo ya estaba en `'panel'` (input desactivado) pero sin panel visible:
  congelado y en negro. **Bug del starter, no introducido en este trabajo.**
  Arreglo: construir el HUD antes que `PanelManager` (una reordenación), con comentario que
  explica la dependencia para que no vuelva a pasar.
- Verificado con el navegador: las 6 secciones devuelven HTML real
  (projects 8659 car., skills 8268, about 2458, experience 5267, contact 1616, stats 573)
  y ESC devuelve el modo a `play` en las 6.
- `dist/` sin marcadores y sin "Tu Nombre" (comprobado con grep).
---

## 3e. Sesión Cube World: grano fino, cancha descargada y arena

**Referencia adoptada: Cube World.** Su firma visual es el **voxel diminuto**:
el mundo entero está hecho de cubos muy pequeños, y por eso sus formas se leen
redondeadas aunque sean cúbicas. Sustituye a Trove como referencia de estilo.

### El bug que impedía ver los modelos (causa raíz)

`VoxelWorld.build()` emitía **4 vértices por cara SIN índice**. En Three.js una
`BufferGeometry` sin índice se dibuja con `gl.TRIANGLES`, así que un quad de 4
vértices no se dibuja como quad: sólo salía bien un triángulo de cada dos y el
resto eran triángulos cosidos entre caras distintas. De ahí "las caras no se
rellenan y se ve a través de los modelos". **Arreglo:** `geo.setIndex(tri)` con
`[0,1,2, 0,2,3]` por cara. Las seis direcciones de `FACES` se comprobaron una a
una: la normal geométrica de (v0,v1,v2) coincide con `face.n`.

### Bug del rasterizador (franjas sin rellenar)

`voxelizeMesh` calculaba el rango de celdas sólo con la caja del triángulo,
pero la prueba de marca acepta centros a media celda del plano. Un triángulo que
cae **justo en el borde entre dos capas** producía un rango VACÍO: el suelo de
la cancha está exactamente en y = 0. **Arreglo:** margen de una celda (`pad`) por
lado. Cobertura del suelo: 16.838 → 43.094 celdas.

### Otras causas raíz encontradas

- **Blanco de glTF**: sin `baseColorFactor`, el loader pone blanco puro. No es
  una decisión de arte: `materialColor()` ahora devuelve el respaldo.
- **Orden de escritura**: al marcar una celda ganaba el ÚLTIMO triángulo, así
  que el orden del búfer de índices decidía el color. Ahora gana el MÁS CERCANO
  (`putCell(..., distance)`); `resetPriority()` entre mallas para que el detalle
  de una malla pequeña pise a la masa.
- **Guarda de coste** (`MAX_CELLS_PER_TRIANGLE = 250.000`): un vértice absurdo
  genera una caja de billones de celdas y bloqueaba la página. Con el techo el
  fallo se ve en consola en vez de colgarse.
- **Escalar `oriented` en vez de un contenedor aislado** dejaba las coordenadas
  fuera de rango y la guarda descartaba las 47.663 caras del suelo. Se volvió a
  `holder.attach(floorMesh)`.

### La cancha descargada: qué contiene de verdad

`basketball_court__voxel_art_3d.glb` (7,4 MB, 171.378 triángulos). Medido
leyendo el GLB, no supuesto:

- Textura-paleta de **256x1 px, PNG indexado de 4 bits, 16 colores**.
- `Object_2` (el suelo) usa **sólo 2 UVs**: `#aaaaaa` y `#ffd0b1`. Es un suelo
  liso de dos tonos, **sin marcaje de pista**.
- Cobertura de esa malla sobre su caja: **93,9 %** (faltan franjas de borde).
- Los otros dos objetos (gradas, 124.000 triángulos) tienen caras enormes:
  voxelizarlos con recorte bloqueaba el hilo principal. **Pendiente.**

Solución aplicada: se voxeliza el suelo a 0,1 m (su resolución nativa), se
rellenan las franjas que faltan con `PALETTE.hardwood` y se dibuja **encima**
una capa de líneas (`buildCourtLines`) para que la pista se lea como tal.

### Grano por elemento (decisión, no descuido)

El grano fino sólo se aprovecha en formas curvas y detalles pequeños; en masas
planas cuesta triángulos sin cambiar la imagen. Se midió y se ajustó:

| Elemento | Grano | Motivo |
|---|---|---|
| Balón | 0,0129 m (28 cubos) | Redondez: por debajo de ~24 cubos se ve a escalones |
| Personaje | 0,0185 m (96 cubos de alto) | Adaptador `D = 2` sobre un diseño de 48 celdas |
| Props (canasta fina, aro, red) | 0,03125 m | Detalle visible |
| Suelo de la cancha | 0,1 m | Resolución nativa del glTF |
| Gradas | 0,2 m | 46 m de ancho por 7 peldaños |
| Túnel, plató, postes, mesa | 0,0625–0,125 m | Masas planas |

### Arena (petición del propietario)

- **Gradas**: antes eran 6 muros apilados en un solo lado. Ahora es un **anillo
  de peldaños en los cuatro lados** (7 peldaños, huella + contrahuella), con
  público instanciado repartido por todo el anillo (~1.300 asientos, 18 % vacíos).
- **Vallas publicitarias** con huecos en el túnel y la mesa.
- **Torres de luz** en las cuatro esquinas.
- **Vegetación**: 26 árboles y rocas fuera del recinto.
- **Terreno**: 180 x 180 m de pradera pixel-art (antes un plano liso del mismo
  azul que el cielo, que hacía que la pista flotara).

### Estado medido

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | 0 errores |
| `npm test` | 13/13 |
| `npm run build` | ✓ |
| Triángulos en escena | ~476.000 |
| Tiempo de construcción de la arena | 407 ms (stands 237, boards 30, torres 11, vegetación 128) |
| Altura del personaje | 1,887 m (el cuerpo 1,776; la cresta suma) |
| Diámetro del balón | 0,360 m |
| Celdas del suelo del glTF | 43.094 a 0,1 m |

### Aviso sobre el entorno de prueba

El "cuelgue" que costó varias sesiones **no era del código**: SwiftShader
(renderizador software) tarda decenas de segundos por fotograma con esta escena.
Se confirmó que el juego llega a `modo: play`. En GPU real no aplica.

### Pendiente

- Voxelizar las gradas del glTF (124.000 triángulos con caras enormes). Necesita
  subdividir triángulos grandes antes de rasterizar.
- El aro sigue siendo procedural; el modelo descargado no trae canasta.
- `public/og.png` (1200x630) y `VITE_FORM_ENDPOINT`.
- Medición de FPS en GPU real (no afirmada).

---

## 3f. Revisión integral Cube World: personajes, público, escenario y guía

Sesión de auditoría completa + implementación sobre la guía
`guia_estilo_cuberworld.md` (que pasa de 778 a 1.140 líneas con una Parte II
que es la especificación real del proyecto).

### Proporciones del personaje: antes → después

| Ratio | Antes | Objetivo guía | Ahora | Estado |
|---|---:|---:|---:|---|
| Cabeza + pelo / altura | 29 % | 35–45 % | **42,9 %** | ✓ |
| Ancho cabeza / torso | 1,20× | 1,25–1,6× | **1,43×** | ✓ |
| Ancho mano / cabeza | — | 30–40 % | **30 %** | ✓ |
| Altura total | 1,81 m | ≈1,80 m | **1,813 m** | ✓ |

Medido en motor sobre la geometría real, no calculado a mano.

### Cambios de estructura

- **Reparto vertical nuevo** en `human.ts`: `C` pasa de `hip 20 / shortsTop 25
  / shoulder 33 / torsoTop 34` a `hip 15 / shortsTop 20 / shoulder 26 /
  torsoTop 28`, liberando 6 celdas para la cabeza. Pivotes conservados por
  nombre y contrato: `animateHuman` y `poseShoot` no cambian.
- **Cabeza 16 → 18 celdas** de ancho (`HX` 8 → 9) y 14 → 16 de fondo.
- **Hombreras de 2 → 1 celda.** Con dos, el torso quedaba tan ancho como la
  cabeza (1,13×) y se perdía la lectura de cabeza dominante.
- **Pelo reescrito en cinco capas** con alturas y extensiones explícitas:
  masa trasera, casquete, patillas, flequillo de tres alturas y cresta.
- **Patillas recortadas a la mitad trasera del costado.** Estaban en todo el
  lateral y convertían la cabeza en un casco marrón macizo de perfil,
  escondiendo oreja y mejilla.
- **Cejas movidas a `chin+6`/`chin+7`.** Volvían a caer dentro de la línea del
  pelo (`capY = chin+12`) y desaparecían por falta de contraste. Es un error que
  ya se había corregido una vez y reapareció al rediseñar: queda documentado
  como regla («al menos 2 celdas por debajo de `capY`»).
- **Balón sostenido a 0,95 m** en vez de 1,20 m. Con la cabeza nueva, 1,20 m es
  altura de rostro y el balón tapaba la cara, que es lo primero que se mira.
- **Ropa por piezas**: paneles laterales (`jerseyAlt`), franja de pecho,
  hombreras, cuello y bajos. Brazo en cinco tramos con mano de 6 celdas.
- **Zapatilla por capas**: cuerpo, puntera, suela, cordones y refuerzo lateral.

### Público: de cajas de color a figuras

Antes, cada espectador era un `InstancedMesh` de un único cubo coloreado.
Ahora son **cuatro `InstancedMesh`** (cabeza, pelo, torso, brazos) que comparten
la lista de asientos: **4 draw calls** para todo el graderío, 80.640 triángulos.

Variación por asiento: 5 tonos de piel, 6 colores de pelo con altura variable,
paleta de camisetas, giro propio ±0,3 rad, giro de cabeza adicional, escala
0,9–1,1×, desplazamiento ±0,12 m, **20 % con los brazos en alto** y **16 % de
asientos vacíos**.

### Vegetación: tres construcciones distintas

- **Árbol**: tronco con base ancha (1,6× el radio), dos muñones de rama en
  alturas distintas y copa en **tres pisos decrecientes** de distinto tono.
- **Arbusto**: dos masas bajas solapadas.
- **Roca**: dos o tres masas escalonadas.

32 elementos en anillo (r 24–66 m, z comprimido a 0,75×) con exclusión explícita
del recinto.

### Coste medido

| Grupo | Triángulos |
|---|---:|
| Suelo de la pista (glTF) | 160.794 |
| Gradas | 106.664 |
| Público (instanciado) | 80.640 |
| Cabeza del personaje | 54.192 |
| Vegetación | 49.536 |
| **Total en escena** | **670.156** |

Sube de 556.000 a 670.000. Es el precio de la variedad del público y de la
cabeza más grande. **Pendiente de optimizar**: el suelo de la pista emite ~1,9
caras por celda cuando debería emitir una; la capa inferior no se está
eliminando pese al `eraseCells` y hay que investigar por qué.

### Pendiente declarado

- Optimizar el suelo de la pista (160.794 → ~84.000 triángulos posibles).
- Voxelizar las gradas del glTF descargado (124.000 triángulos con caras
  enormes: necesitan subdivisión previa).
- `public/og.png` (1200×630) y `VITE_FORM_ENDPOINT`.
- **Medición de FPS en GPU real**: el navegador de pruebas usa SwiftShader
  (software) y con 670.000 triángulos tarda decenas de segundos por fotograma.
  Ninguna medición de fluidez hecha aquí es representativa.

---

## 3g. Segunda iteración: balón, tiro, proporciones, público y animaciones

### Bugs corregidos (los tres que señaló el propietario)

**1. El balón flotaba sobre la cabeza al tirar.** Se colocaba en `y = 1,9 m`
fijo; con la cabeza nueva (pelo hasta 1,818 m) eso son 9 cm por encima del
personaje. Ahora va **delante del pecho** (`y = 0,99`, `f·0,44`) sobre el eje del
jugador. Se intentó leer la posición de las dos manos desde el rig
(`handWorld`), pero **ambas devolvían la misma posición** y el balón salía pegado
a un solo brazo; el anclaje al eje es determinista y queda centrado.

**2. El balón no tenía dibujo de balón.** El glTF trae dos bandas
perpendiculares en cruz. Ahora se voxeliza a **36 cubos de diámetro** y se
**pintan encima** un ecuador y dos meridianos recorriendo sólo la corteza.

**3. El público era diminuto.** Medía 0,6 m frente a 1,818 m del jugador. Ahora
**1,10 m sentado** (60 %), cabeza de 0,42 m (misma proporción dominante que el
jugador), 5 piezas con muslos, y separación de asientos de 0,95 m.

### Proporciones: segunda pasada

El propietario pidió extremidades y torso aún más pequeños. `C` pasa a
`hip 12 / shortsTop 17 / shoulder 22 / torsoTop 25`.

| Módulo | Antes | Ahora | Medido |
|---|---:|---:|---|
| Cabeza + pelo / altura | 42,9 % | **48,9 %** | ✓ |
| Pierna | 0,592 m | **0,481 m** | −19 % |
| Brazo | 0,592 m | **0,498 m** | −16 % |
| Ancho cabeza / torso | 1,43× | **1,42×** | ✓ |
| Altura total | 1,813 m | **1,818 m** | ✓ |

`HAND_LOCAL_Y` pasa de 13,5 a **10,5** celdas de diseño al acortar el brazo.

### Animaciones añadidas

`animateHuman` recibe un parámetro `grounded` y ahora cubre: reposo con
respiración y cabeceo del torso, caminar/correr con braceo en oposición, postura
en el aire con piernas recogidas, y `poseCelebrate` (brazos en alto y saltos,
1,6 s tras anotar, disparada desde el bucle con un temporizador).

### Estado

`tsc` 0 errores · `npm test` **13/13** · `build` ✓ · `modo: play` · capturas
verificadas del balón de cerca, de la pose de tiro, del público y de la vista
aérea.

### Pendiente

**El detalle de los props no se ha tocado en esta iteración**: canastas, mesa de
anotadores, banquillo, túnel y plató siguen como estaban. Es el trabajo que
queda, junto con la optimización del suelo de la pista.

---

## 3h. Tercera iteración: proporciones, balón y pendientes

### Proporciones (medidas en motor)

| Módulo | Antes | Ahora |
|---|---:|---:|
| Cabeza + pelo / altura | 48,9 % | **53,2 %** |
| Torso | 0,329 m | **0,298 m** |
| Pierna | 0,481 m | **0,444 m** |
| Brazo | 0,498 m | **0,423 m** |
| Mano | 0,222 m | **0,239 m** (NO se recorta) |
| Pie | 3 celdas | **3 celdas** (NO se recorta) |
| Altura total | 1,818 m | **1,809 m** |

`C` = `hip 11 / shortsTop 16 / shoulder 21 / torsoTop 23`. Brazo a 10 celdas con
la mano en 3. `HAND_LOCAL_Y = 8.5`.

### Balón

48 cubos de diámetro (antes 36) y costura de **1,6 celdas** (antes 1,05, que
desaparecía a distancia). 44.032 triángulos. Anclaje bajado: reposo a 0,78 m y
tiro a 0,86 m, porque con la cabeza al 53 % el torso acaba en 0,85 m y cualquier
altura mayor pone el balón delante del rostro.

**Sobre el informe del propietario («el balón sigue siendo un cubo»):** se
inspeccionó el objeto en el navegador y son **3 mallas, 44.032 triángulos, caja
0,360³**, y desde la cámara real del juego se ve redondo con costuras. **No se ha
conseguido reproducir el síntoma.** Si vuelve a aparecer, comprobar en consola:
`window.__court.scene.getObjectByName('ball')`.

### El bug del suelo, resuelto

`vw.eraseCells` de la capa `-1` no bastaba: el voxelizador marca dos capas y
`flatTop` emite la cara superior de ambas. Vaciar todo lo que no sea la capa 0
por arriba y por abajo: **160.794 → 84.000 triángulos**.

### Pendientes cerrados

Canasta (poste por tramos, marco, protector, red de 12 hilos), mesa de
anotadores (monitor, teclado, sillas, cables), banquillo (lamas, bolsa, nevera,
botellas), túnel (marco, interior escalonado, rótulo, focos), torres de luz
(zapata, tramos, tirantes, cabezal), `public/og.png` (1200×630) y `.env.example`.

### Estado

`tsc` 0 errores · `npm test` **13/13** · `build` ✓ · `modo: play` ·
**637.070 triángulos** (bajó desde 689.280 pese a añadir detalle).

### Pendiente

- Gradas del glTF: sus caras enormes bloquean el hilo principal al rasterizar;
  hay que subdividir triángulos grandes antes.
- FPS en GPU real (SwiftShader en el entorno de pruebas).

---

## 3i. Cuarta iteración: el pase de sombras, medido y recortado

**Sesión:** 13 oct 2026 · **Origen:** informe [`../analisis-mejoras-the-court.md`](../analisis-mejoras-the-court.md), hallazgo 1 y fase 3.

### Cómo se midió (importante)

`renderer.info` **no cuenta el pase de sombras**: en Three.js `info.reset()` va
después de `shadowMap.render()` (`three.module.js` 30081 vs 30087). El «173 draw
calls de sombras» de la auditoría anterior salía del grafo de escena, no del
contador.

Para esta iteración la sonda envuelve `renderer.getContext()` y cuenta
`drawElements` / `drawArrays` / variantes *instanced*, atribuyendo cada llamada
al pase visible o al mapa de sombras según `renderer.getRenderTarget()`. Es la
cuenta real de comandos de dibujo, con triángulos reales (instanciados ×
`instanceCount`). 7 vistas: juego (`__court.freeze = true`) + las 6 secciones con
los `pos`/`look` de `SECTION_CAMERA`/`INTERVIEW`, a 827 × 977 px.

### Lo implementado

| Cambio | Archivo |
|---|---|
| `shadowMap.autoUpdate = false` + `bakeShadows()` (y rehornear expuesto en `__court`) | `src/game/main.ts` |
| `castShadow` fuera en jugador y balón | `src/game/main.ts` |
| `castShadow` fuera en reportero, operador y muro del plató | `src/game/builders/tv.ts` |
| `castShadow` fuera en vegetación y torres de luz | `src/game/builders/court.ts` |
| `VOXEL_MATERIAL` único compartido + `noCastShadow()` + opción `castShadow` en `build()` | `src/game/builders/util.ts` |

### Resultado medido (draw calls · triángulos por fotograma)

| Vista | Antes | Ahora | Ahorro |
|---|---|---|---|
| juego | 272 · 778.794 | **98 · 411.312** | −174 (−64 %) · −367.482 (−47 %) |
| entrevista | 277 · 793.736 | **103 · 426.254** | −174 (−63 %) · −367.482 (−46 %) |
| proyectos | 220 · 726.736 | **46 · 359.254** | −174 (−79 %) · −367.482 (−51 %) |
| skills/stats | 223 · 707.168 | **49 · 339.686** | −174 (−78 %) · −367.482 (−52 %) |
| récord | 220 · 726.520 | **46 · 359.038** | −174 (−79 %) · −367.482 (−51 %) |
| sobre mí | 223 · 706.546 | **49 · 339.064** | −174 (−78 %) · −367.482 (−52 %) |
| experiencia | 222 · 716.084 | **48 · 348.602** | −174 (−78 %) · −367.482 (−51 %) |

Horneado: **174 → 65 draw calls** y **367.482 → 198.932 triángulos**. Materiales
únicos: **193 → 18** (los `MeshStandardMaterial` de 185 a 10).

### Cómo se verificó que no cambia el aspecto

* Mapa recién horneado **vs** `shadowMap.enabled = false` (quita `USE_SHADOWMAP`
  del shader, no sólo el horneado): **0 píxeles de diferencia, máximo 0 por
  canal, en las 7 vistas**, con el código original (173 proyectantes) y con el
  nuevo (65).
* Argumento de monotonía: si el conjunto completo de sombras deja el fotograma
  idéntico al mismo sin sombras, cualquier subconjunto también.

### Lo rechazado (con medición, para que no se reintente a ciegas)

Ajustar el frustum de la cámara de sombras a la pista (±19 × ±16, near 32, far
48) **cambia el aspecto**: al pasar el rango de profundidad de 85 m a 16 m el
`bias` efectivo y el radio de la PCF cambian y **reaparecen sombras** que el
sesgo actual tapa (gradas, vallas, banquillo, postes, muro del plató): hasta
**29.575 píxeles** con **61 niveles** de diferencia. Y no ahorra nada: el
horneado dibuja los mismos 65 draw calls con los dos marcos. Se deja como estaba.

El **público nunca proyectó sombra**: `InstancedMesh` es un `Mesh` y
`castShadow` viene en `false` por defecto (los 5 instanciados no estaban entre
los 173 proyectantes). Anotado en el código.

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **65/65** · `npm run build` ✓
(prebuild con `validate --strict` + `classic` incluidos).

### Pendiente

- Fase 3: grano del personaje, Inter fuera/latin-only, `preload` de modelos.
- FPS en GPU: el bucle del panel sigue clavado en 30 fps (techo del compositor,
  no de la GPU), así que aquí se certifican draw calls y triángulos, no FPS.

---

## 3j. Quinta iteración: fases 1-2-4 del informe y paneles con pestañas

**Sesión:** 13 oct 2026 · **Origen:** informe [`../analisis-mejoras-the-court.md`](../analisis-mejoras-the-court.md), fases 1, 2, 4 y §5 (paneles). Lo de la fase 3 ya está en §3i.

### Fase 1 · «que no se vea roto»

| Defecto | Qué se hizo | Cómo se verificó |
|---|---|---|
| D1 balón marrón | El color de la corteza lo pone la PALETA, no el material del glTF: `colorOf` devuelve `SEAM` sólo si la luminancia del material es < 0,22 (la banda oscura del modelo), y el resto va a `PALETTE.ball`. Además la costura pasa de 2 celdas a 1 | `tests/ball.test.ts` (+2): cuero > 70 % de la corteza, costuras > 3 %, rojo máximo > 230 |
| D2 cuadro de tiro / z-fighting del tablero | Corregido en `props.ts` | capturas de la sección Proyectos |
| D3 cartel de la mesa de anotadores | Corregido en `props.ts` | capturas |
| D4 etiquetas fuera y solapadas | Recorte por CAJA REAL (`offsetWidth`) + 3 pasadas de empuje en vertical | `getBoundingClientRect`: a 828 px y a 1.440 px, **6/6 dentro y 0 solapes** (antes: 3 fuera a 828, 2 solapadas a 1.440) |
| D9 fuentes que nadie usa | Inter FUERA del paquete (medido con `document.fonts`: sus caras quedaban `unloaded` en las dos páginas) y subsets `latin` en lugar de `index.css` | `dist/assets`: sólo Bebas + Silkscreen |
| Carga | `public/models/voxel-court.glb` (7,8 MB) sale del build a `assets-src/`; la cancha es procedural | `dist` = **982 kB**, 18 ficheros |

### Fase 2 · «que se vea apoyado»

* **Foco clave inclinado**: `ceiling` pasa de `(1,5, 42, 3)` a **`(10, 34, 12)`**, 2,0; marco de sombras ±30 × ±26 con `far` 110, `bias` −0,0002 y `normalBias` 0,05. El sol exterior **se elimina**: bajo techo ninguna luz viene de fuera y, con el foco sesgado, la sombra sale de la silueta.
* **Reequilibrio**: hemisférica 0,55 → **0,38**, rebote cálido 0,45 desde abajo, relleno frío 0,62 del lado de la cámara (el naranja del balón salía marrón por estar el relleno detrás), 4 torres a 0,7.
* **Sombra de contacto** del jugador (1,2 m) y del balón (0,34 m): textura de 64² generada, opacidad que se aclara con la altura.
* **El público PROYECTA sombra** (`castShadow` en los 5 instanciados): con el foco inclinado, cada fila proyecta sobre la de delante.

### Fase 4 · pabellón (parcial)

* **Público vivo**: oscilación de 4,5 cm en el vértice (uniform único compartido por las 5 piezas; la fase de cada asiento sale de su propia `instanceMatrix[3]`, así que no se toca ni una matriz en CPU). Longitud de onda ~25 m: olas que recorren la grada, no temblor por asiento.
* **Medición** con `gl.readPixels` del fotograma completo (828 × 1.033) separando dos capturas 0,7 s: control (dos renders seguidos sin avanzar el reloj) **0 píxeles**; banda del graderío **5.678 píxeles cambiados** de 53.820 muestreados (10,5 %); el resto del fotograma, sólo el jugador y el balón.
* El balanceo se para con `prefers-reduced-motion` (ver abajo).

### Paneles de sección (§5 del informe)

* **Pestañas accesibles**: `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, foco móvil (`tabindex` 0 sólo en la activa), flechas ←/→ + Inicio/Fin. Barra **pegajosa** al hacer scroll y, al cambiar de pestaña, el cuerpo vuelve arriba.
* **Proyectos**: `Todo · 10` + una pestaña por año (2025 · 1, 2023 · 2, 2022 · 4, 2021 · 3). Ficha con título y año en la misma línea, resumen de una frase y el párrafo largo plegado en «Detalles del proyecto».
* **Skills**: una pestaña por grupo; cada fila lleva nombre, barra y **número /10** (una barra de 10 muescas se lee a bulto).
* **Experiencia**: `Todo · 11` / `Trabajo · 4` / `Estudios · 5` / `Deporte · 2`, ordenado por fecha descendente, con la fecha en la cabecera y legible (`feb 2025 – Actualidad` en lugar de `2025-02`).
* **Sobre mí**: un tema por pestaña (Presentación, Desarrollo web, Videojuegos, Ciberseguridad, Fuera de la pista) + Datos. El reparto es posicional: si no hay párrafo, la pestaña no se dibuja; si hay párrafos nuevos, caen en la última en vez de desaparecer.
* **Récord**: cuatro cifras grandes y, sin tiros, un aviso que invita a jugar en lugar de una tabla de ceros.
* **Contacto**: el CV sigue arriba, y el formulario se separa en `Mensaje` / `Contacto directo`.
* **Texto corrido en tipografía de sistema** (`--font-body`, 0 KB: no viaja ninguna fuente) con 1,6 de interlineado; Silkscreen se queda en títulos, chips, badges y botones.
* **Panel lateral a partir de 900 px**: deja la escena a la vista (era modal y tapaba justo lo que se acababa de encuadrar); por debajo sigue centrado.
* **Trampa de foco arreglada**: descarta lo que no se ve (`offsetParent`) y cuenta `summary`, que es focusable de verdad. Antes, con un `<details>` plegado, el «último» de la lista podía ser invisible y el tabulador se escapaba del diálogo.

### HUD

* **Menú ☰ con estado por sección**: ✓ visitada, ○ pendiente, ✕ bloqueada (zona de tiro sin encestar), con el estado también en texto para lectores de pantalla. Cierra con **Esc** y con **clic fuera**. Verificado en navegador con los tres estados.
* **Iconos dibujados** (SVG de 16 px con `shape-rendering: crispEdges`) en lugar de los emoji del sistema 🔊/🔇/☰.
* **Puerta de idioma**: `ASK_EVERY_VISIT = false`. Ya no obliga a decidir en cada recarga para acabar en el mismo sitio, y el HUD tiene EN/ES a un clic.
* **`prefers-reduced-motion`**: se congela el reloj de las animaciones en el bucle (`update(dt, reduced ? 0 : clock.elapsedTime)`). Con una sola línea se paran el pulso de los anillos, el parpadeo del ON AIR, el bote del balón, el balanceo del público y las animaciones del personaje, sin parar el juego (que va por `dt`).

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **67/67** · `npm run build` ✓ (prebuild con
`validate --strict` + `classic`) · `dist` **982 kB** en 18 ficheros.

### Pendiente

* **Fase 4**: emisivos + glow, materiales con `PMREM`, cámara con adelanto, encuadre por
  formato (vertical) y repetición tras canasta.
* **Fase 3**: grano del personaje y `preload` de modelos.
* **Fase 5 (juego)**: colisiones, reglas 2/3 puntos, logros, modo desafío, NPC, compartir
  récord, ayuda/pausa y ajustes.
* **No medido**: FPS real (el bucle del panel sigue clavado a 30 fps, techo del
  compositor), móvil real, Safari/iOS y red lenta; `prefers-reduced-motion` está
  verificado por código, no emulado en el navegador.

---

## 3k. Corrección de método: cómo se mide si una sombra se ve

El método que se usó en §3i para decir «las sombras no aportan nada» —comparar el fotograma
con `renderer.shadowMap.enabled = false`— **no es válido**: Three.js no recompila los
materiales al cambiar ese interruptor, así que el programa cacheado sigue teniendo
`USE_SHADOWMAP` y el fotograma sale idéntico **aunque las sombras se estén viendo**. Los «0
píxeles» de §3i no prueban nada (están corregidos en `../analisis-mejoras-the-court.md` §12.5).

El método válido es apagar **`light.castShadow`**: eso cambia la `version` del estado de luces
y obliga a recompilar. Con él, en el estado actual (foco ya inclinado) y midiendo píxeles con
`gl.readPixels` (control de dos renders seguidos: **0 px**, así que la medida es reproducible):

| Vista | Píxeles que cambian al apagar las sombras | % | Δ máx. |
|---|---:|---:|---:|
| juego (828 × 1.033) | 34.485 / 855.324 | **4,0 %** | 65 |
| sección Proyectos | 65.113 / 855.324 | **7,6 %** | 58 |

Es decir: **el pase de sombras sí se ve** con el foco inclinado (con la luz casi vertical caía
dentro de la silueta de cada objeto y no se veía). Se probaron tres posiciones de foco para
elegir la que está en el código: `(10, 34, 12)` da 4,0 % / 7,6 %; `(24, 30, 6)` da
4,9 % / 13,6 %; `(0, 34, −16)` da 6,8 % / 1,4 %. Se queda la primera: es la del informe (foco
de techo del lado de la cámara) y da sombra visible sin comerse la pista.

La selección de proyectantes de §3i **sigue siendo correcta**: volviendo a encender
`castShadow` en los 16 meshes del atrezo que se dejaron fuera (vegetación, torres de luz y
muro del plató) la diferencia es de **0 píxeles** en la vista de juego y en la de Proyectos.

---

## 3l. Fusión de mallas estáticas por material

**Sesión:** 13 oct 2026 (misma sesión que §3k) · **Informe:** `../analisis-mejoras-the-court.md` §14.

### El problema

El material único de §3i dejó las mallas del mundo compartiendo shader y estado, pero cada una
seguía siendo **una llamada de dibujo**. En el pase visible —el único que se paga cada
fotograma, porque el mapa de sombras se hornea una vez— eran **95 llamadas** en la vista de
juego y **44-102** en las seis secciones. La mitad del coste de una llamada de dibujo en WebGL
no es dibujar: es validar estado y rebotar en la CPU.

### Lo implementado

`src/game/builders/batch.ts` (nuevo) y una llamada en `main.ts` antes de `bakeShadows()`:

* Cuece el `matrixWorld` de cada malla en la posición y la normal (matriz de normales), así que
  cada triángulo queda **donde estaba**.
* Agrupa por estado de render: `castShadow` + `receiveShadow` + `renderOrder` + **celda de 24 m**
  en XZ. Cada lote sigue culeándose con el frustum por su cuenta.
* Deja fuera lo que se mueve (`exclude`): jugador, balón y los dos actores del plató. Su sombra
  se hornearía congelada y su pose cambia cada fotograma.
* `matrixAutoUpdate = false`; caja y esfera envolventes calculadas al construir (el culling y el
  raycast del tiro no pagan un tirón en el primer uso).
* Libera las geometrías originales **sólo si ya no las usa ninguna malla viva**: una geometría
  puede estar compartida entre una malla fundida y otra que sigue suelta.

### Resultado medido

Contador de `draw*` a nivel de WebGL sobre un render explícito (no `renderer.info`, que no ve el
pase de sombras), a 827 × 979 y con la cámara **ya en reposo** (al cargar sigue un lerp de ~1 s y
eso movía las cuentas hasta ±10 llamadas). Celdas: `llamadas / triángulos`.

| Vista | Sin fundir | Celda 12 m | **Celda 24 m (enviado)** |
|---|---:|---:|---:|
| juego · pase visible | 95 / 326.946 | 52 / 343.598 | **51 / 387.554** |
| juego · horneado (una vez) | 70 / 281.388 | 11 / 281.388 | **9 / 281.388** |
| Proyectos | 44 / 275.144 | 15 / 299.416 | **13 / 321.184** |
| Skills | 47 / 255.552 | 16 / 285.692 | **15 / 329.648** |
| Sobre mí | 47 / 255.066 | 14 / 270.594 | **13 / 314.550** |
| Experiencia | 46 / 264.604 | 16 / 289.092 | **15 / 333.048** |
| Entrevista | 102 / 342.768 | 73 / 351.512 | **72 / 394.784** |
| Récord | 44 / 274.752 | 15 / 299.024 | **13 / 321.212** |

Las siete vistas juntas pasan de **425 a 192 llamadas** (−55 %); el horneado, que se paga una
vez, de 70 a **9**. El precio es el culling más grueso: **+20 % de triángulos** en el conjunto de
las siete vistas (−11 % si se elige celda de 12 m, que a cambio cuesta +9 llamadas). Se deja 24 m
y se apunta el barrido, que es lo que permite cambiar de idea con datos: el número de lotes es 6
con 24 m y 9 con 12 m, y las llamadas de las secciones apenas se mueven (13-15 en cada una).

El `cell` es un parámetro del gancho de desarrollo, y `?nobatch=1` (sólo en `import.meta.env.DEV`)
carga la escena sin fundir: sin eso no hay forma de comparar, porque la fusión es destructiva y la
escena de antes ya no existe. Verificado que el interruptor **no existe en el bundle**
(`grep nobatch dist/assets/main-*.js` → 0) y que la fusión sí se ejecuta en producción.

### Cómo se verificó que el aspecto no cambia

En **la misma página**, dentro de una sola evaluación (así no corre ni un fotograma de la
animación entre las dos capturas, que es lo que invalidaba los intentos anteriores):

1. se encuadra cada sección, se llama a `renderer.render` + `gl.readPixels` → captura A;
2. se llama a `batch()`;
3. se repite el encuadre y la captura → captura B;
4. control: **dos renders seguidos sin fundir** (0 píxeles de diferencia en las tres tandas, así
   que la medida es reproducible).

| Tanda | Vistas | Tamaño | Píxeles que cambian |
|---|---|---:|---:|
| 1 | Proyectos, Skills, Sobre mí, Experiencia, Entrevista, Récord | 828 × 1.035 | **0** |
| 2 | Entrevista, Récord | 828 × 1.035 | **0** |
| 3 | las seis secciones | 640 × 360 | **0** |

### El detalle que casi lo rompe: renormar una normal que ya era unitaria

El primer intento dio diferencias de 0,5-5 % de píxeles, con máximos de 112-228 niveles en
puntos sueltos. La causa no era la geometría: era **normalizar normales que ya eran unitarias**
(la división por la longitud, que es 1 ± 1 ulp, les cambia los últimos bits y eso se ve como un
parpadeo de nivel por píxel en las caras grandes). Se arregló copiando **verbo a verbo** cuando
`matrixWorld` es la identidad, que es el caso de 77 de las 81 mallas del mundo (sólo los cuatro
cuerpos de la cámara de TV llevan traslación). Con eso las tres tandas bajan a 0 píxeles.

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **67/67** · `npm run build` ✓ (prebuild con
`validate --strict` + `classic`) · `dist` **986 kB**, sin el glb de 7,8 MB ni Inter · probado
también sobre `vite preview` (producción): el log `[batch] fundidas 81 mallas -> 6 lotes` sale
y no hay errores en consola.

### Pendiente

* El fundido **no cubre** los materiales que no son el voxel (público instanciado, anillos,
  rótulos, actores): son 72 llamadas en la entrevista y 51 en juego con sólo ~14 meshes fuera
  del lote, así que ahí queda el siguiente tramo.
* Los lotes no se pueden **actualizar**: si algún día se mueve o se cambia algo del mundo
  (una valla, una torre), hay que refundir esa parte; el camino fácil hoy es reconstruir.
* Lo medido es coste de CPU/llamadas, **no FPS**: el bucle del panel sigue clavado a 30 fps por
  el compositor, así que la ganancia de tiempo no se puede certificar aquí.

---

## 3m. Lote A (T3 y T4): medidor Takeover con estela de fuego y gestos de tiro por distancia

Del plan `PLAN-LOTE-A.md`. T1 (selector cinemático) y T2 (pelo con volumen) ya estaban en el
árbol; esta sesión entrega **T3 y T4**.

### T3 — Takeover

* **Constante compartida** `TAKEOVER_HITS = 5` en `config.ts`: la usan el juego (cuándo se enciende)
  y el HUD (cuántas muescas dibuja). Con dos copias, el medidor diría cinco y el fuego se
  encendería en la sexta.
* **Racha propia** (`hitStreak`), separada de `missStreak`: aquélla cuenta FALLOS y alimenta la
  asistencia del tiro; reutilizarla habría cambiado la dificultad del juego.
* **`src/game/fireTrail.ts`** (nuevo): `THREE.Points` de 28 puntos con mezcla aditiva, búfer
  circular y **sin sombras** (el mapa se hornea una vez: una llama que proyectara dejaría una
  copia congelada). Sólo muestrea por encima de 1,2 m/s, así que con el balón parado en la mano no
  dibuja nada — no se convierte en un foco pegado al jugador.
* **Medidor en el HUD** arriba en el centro: es el único hueco que no pisa al medidor de tiro
  (`bottom: 14%`) ni al récord (esquina inferior derecha) ni al joystick en móvil.
* **Un solo sitio cuenta el fallo** (`fallarTiro()`), y ahí está el arreglo de verdad: ver abajo.

### T4 — Gestos por distancia + corte

* El gesto se elige **al soltar**, donde `distAro` ya está calculado: `DUNK_RANGE = 2,9 m` → mate,
  `LONG_RANGE = 7,5 m` → tiro largo, en medio el de siempre. **La física no se toca**: la parábola
  sigue saliendo de `solveShot` desde el mismo `y` de 2,15 m.
* `poseDunk` y `poseLejano` son **capas nuevas que mezclan** (como `poseShoot` y `poseCelebrate`),
  nunca asignan: con peso 0 no tocan un hueso.
* El **corte** (cambio de dirección brusco) reutiliza la señal que ya existía —el cambio de mano a
  más de `HAND_SWITCH_ANGLE` de giro en la ruta— y le cuelga una inclinación lateral de hasta 0,35
  rad sobre la Z local del tronco. Un evento, dos lecturas: la cabeza mira y el cuerpo se inclina.

### Los dos fallos que encontró la prueba en vivo (y que no se ven en el código)

1. **El aviso del Takeover lo pisaba el «¡Canasta!»** en el MISMO fotograma (es el mismo elemento
   del DOM). Se veía perfectamente en vivo: el medidor se encendía con 5 muescas y el aviso no
   aparecía nunca. Arreglado anunciándolo **el último** de `onScore`.
2. **Un tiro fallado que se recoge con la mano NO contaba como fallo.** La racha (y la asistencia)
   sólo se enteraban de los balones que se paraban solos en la pista, y en este juego el rebote
   casi siempre vuelve hacia el jugador: el fuego podía quedarse encendido toda la partida.
   Evidencia: balón a 0,78 m **en la mano** con el Takeover encendido y el marcador en 15/19. Se
   arregló con `fallarTiro()` llamado desde las dos ramas (recogida y balón parado), juzgando por
   `ball.scored` — un balón recogido después de ENTRAR no es un fallo.
3. De paso, al apagarse quedaban puestas las clases `takeover--on` y las 5 muescas: el DOM decía
   «encendido» con el fuego apagado. Se limpian al esconder el medidor.

### Medido en vivo (no deducido)

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Takeover a las 5 seguidas | 5 tiros perfectos scriptados sobre la interfaz real | `pips: 5`, `takeover--on`, aviso **«¡TAKEOVER! El balón está en llamas»** |
| Estela encendida | `Points` de la escena, balón en vuelo | `visible: true`, color máximo **0,93** (muestra a 3,98 m de altura) |
| Se apaga al fallar | tiro malo a propósito | medidor oculto, **0 muescas**, aviso «Se apagó el fuego», `Points.visible = false` |
| Fallo por recogida | tiro malo + caminar hasta el balón **en el aire** (0,78 m, 0,54 m de distancia) | torso a **+0,14** en el instante de la recogida: `fallarTiro()` corre en esa rama |
| Gesto de mate | jugador a **2,0 m** del aro, lectura del rig en la carga | `armL = -2,35` — el valor exacto de `poseDunk` |

Aviso para la próxima sesión: la prueba en vivo **necesita el panel del navegador compositando**. Con
la pestaña reportada como visible pero sin compositor, `requestAnimationFrame` da 0 fotogramas y el
bucle del juego se queda congelado (el DOM miente: `document.hidden` era `false` y aun así no había
fotogramas). Se detecta con una sonda de `requestAnimationFrame` antes de dar por bueno cualquier
estado leído de la escena.

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **112/112** en 8 ficheros (+6 de gestos y corte en
`human.test.ts`, +8 nuevos en `tests/fireTrail.test.ts`) · `npm run build` ✓ · `main.js`
**692,19 kB / 193,11 kB gzip**.

### Pendiente del lote

* El gesto de **tiro largo** está cubierto por los tests (la pose es distinta y mezcla), pero no se
  disparó en vivo: el jugador ya estaba a 2 m cuando se probó. Es un ternario simétrico; si se
  quiere certificar, se camina a más de 7,5 m y se lee `armL ≈ -1,72`.
* **Lote B** (fuera de este lote, ya acordado): la entrevista como diálogo de cámara de TV y el
  carrito de balones con el concurso de triples, que el propietario activará expresamente.

---

## 3n. Lote B: mate en carrera, entrevista en directo, takeover y concurso de triples

Cuatro entregas del propietario y, al final, un ajuste suyo sobre el concurso. Todo lo de esta
sección está **medido en vivo** con el panel del navegador, no deducido del código: las cifras de
la tabla de abajo son lecturas de los ganchos `__court.*` sobre la partida de verdad.

### 1. Mate en carrera (`src/game/dunk.ts`)

* Módulo puro (con `tests/dunk.test.ts`): `DUNK_VUELO` 0,34 s de carrera + `DUNK_CAIDA` 0,34 s
  colgado del aro = 0,68 s, y una altura de `DUNK_ALTURA` 0,72 m justo en el golpe.
* **Hacen falta las DOS condiciones** (`puedeMate`): estar a `DUNK_RANGE` (2,9 m) **y** llegar a
  `DUNK_RUN_MIN` (0,55 de la velocidad máxima). Quieto, o andando, esto NO se activa y el tiro de
  cerca se resuelve como siempre — que es exactamente lo que el propietario dijo que estaba bien.
* **El input se bloquea mientras dura** (`playing && !dunk.activo` deja fuera movimiento, carga y
  regate): la posición la manda la animación y las piernas siguen moviéndose, que es lo que hace
  que se lea como carrera y no como deslizamiento. El bloque va ANTES de la rama de juego para que
  no haya dos caminos de movimiento en el mismo fotograma.
* **`ritmoBruto` se lee antes de cargar**, no al soltar: el bloque de movimiento no corre durante
  la carga, así que al soltar el mate juzga la velocidad a la que VENÍAS al pulsar espacio.
* **La cámara vibra en el instante del golpe**, no al empezar: `machacar()` (el fotograma en que
  vence `DUNK_VUELO`) llama a `sacudir(SHAKE_DUNK_TIME = 0,3 s, SHAKE_DUNK_AMP = 0,055 m)` y a
  `bumpNet(1)`. La sacudida es un offset de cámara que decae con el tiempo, y se respeta
  `prefers-reduced-motion`.
* **El balón no se lanza: se METE.** En el golpe aparece justo encima del aro y cae, así que el
  tanto lo canta la MISMA física que cualquier tiro (`onScore`), con su racha de takeover, su
  récord y su desbloqueo de zona. Nada de `made++` a mano.

### 2. Takeover (medidor de racha + estela)

* `TAKEOVER_HITS = 5` en `config.ts`, compartido por el juego (cuándo se enciende) y el HUD
  (cuántas muescas dibuja): con dos copias, el medidor diría cinco y el fuego se encendería en la
  sexta.
* Racha propia (`hitStreak`), separada de `missStreak` (que cuenta fallos y alimenta la asistencia
  del tiro): reutilizarla habría cambiado la dificultad del juego. Se apaga **al fallar**, no por
  tiempo, y `fallarTiro()` es el ÚNICO sitio que cuenta un fallo (vale para los dos caminos: balón
  que se para en la pista y balón que el jugador recoge, juzgando por `ball.scored`).
* `src/game/fireTrail.ts`: `THREE.Points` de 28 puntos, búfer circular, mezcla aditiva y sin
  sombras. Sólo muestrea por encima de **1,2 m/s**, así que con el balón en la mano no dibuja nada
  (no se convierte en un foco pegado al jugador) y en vuelo va lleno: medido 28/28 puntos vivos.
* Medidor arriba en el centro del HUD: es el único hueco que no pisa el medidor de tiro, el récord
  ni el joystick. Con la racha a 0 se esconde y limpia sus clases (si no, el DOM decía «encendido»
  con el fuego apagado).

### 3. La entrevista: diálogo + plano de la cámara de televisión

* El formulario ya no es lo primero. `renderInterview()` (en `ui/panels.ts`) monta un **diálogo de
tres preguntas** con dos respuestas cada una y su réplica, con el guion como DATOS (`GUION`) y no
como una cascada de `if`: añadir una pregunta es añadir un objeto, y cada línea es una clave de
traducción (una traducción que falte rompe el build).
* Al final aparece **el mismo formulario de siempre** (misma validación, mismo honeypot, mismo
límite de un mensaje por minuto) y el foco va al primer campo. El botón «ir directo al formulario»
existe para quien sólo quiere dejar sus datos, y se esconde en cuanto el formulario está a la vista.
* La conversación se escribe con nodos y `textContent` (nada de `innerHTML` con texto del guion) y el
registro es `role="log"` + `aria-live="polite"`: cada intervención se anuncia sola.
* **El plano es el POV de la cámara de TV del plató** (`INTERVIEW` en `config.ts`): el punto de vista
se separa del barril de la cámara hacia el lado de las gradas para ver al entrevistado sin que el
aparato se meta en el plano. Medido en vivo: cámara en (11, 1,67, 10,01) mirando al jugador en
(9, 8,3).
* El **filtro de televisión** está hecho con DOM y no con un `filter` CSS sobre el lienzo: un filtro a
pantalla completa obliga al compositor a reprocesar los 828 × 1.033 px en cada fotograma, y esto
tiene que seguir yendo fino en una GPU integrada de 2013. Son líneas de TV (`.tvfx`, un
`repeating-linear-gradient`), la barra de emisión con **REC parpadeante** (`rec-blink`, 0,8 s), el
canal, el **timecode a 25 fps** (se reescribe sólo cuando cambia el cuadro que se enseña) y el
rotulito EN DIRECTO. El cartel ON AIR del plató sube de intensidad y los dos actores se animan más
cuando el plató está en directo (`mode === 'interview'`).

### 4. El concurso de triples (y el carrito)

* `src/game/contest.ts` es SÓLO estado y reglas, con `tests/contest.test.ts`: reloj de 60 s, cinco
carros con tres balones, bola del dinero (la última de cada carro) que vale doble, y el carro que
sólo avanza **si el jugador está EN el siguiente** y el actual está vacío (correr de una esquina a
la otra es la mitad de la gracia, así que no avanza solo). La puntuación se decide con el `dinero`
que se marcó **al coger** el balón, no al resolver: si se mirara al resolver, un balón en vuelo
mientras el jugador ya anda hacia el carro siguiente cargaría los puntos al carro equivocado.
* **El reloj arranca con el PRIMER TIRO**, no al convocar: si arrancara con la E, el jugador pagaría
el tiempo que tarda en colocarse (y en un carro a 1,2 m del carrito, eso son dos segundos de quince
tiros). También se PARA cuando se abre una sección: leer un panel mientras corre el reloj no es
tensión, es una pérdida.
* El carrito de la esquina (`CARRITO`) convoca con **E**, y su aviso manda sobre el de la zona (el
bloque de zonas termina siempre con un `consumeInteract()` que se comería la tecla).

#### Ajuste posterior del propietario (esta sesión): un solo carrito

* **En la pista hay UN carrito**, el de la esquina. Los cinco puestos del recorrido se construyen al
arrancar pero **nacen ocultos**, y aparecen al convocar el concurso. La cancha se queda limpia
para el baloncesto normal: se van también los cinco anillos naranjas permanentes que había antes.
* `mostrarPuestos(on)` enciende y apaga **los tres elementos de cada puesto a la vez** —carro,
anillo y mancha— porque por separado uno se queda descolgado (un anillo de puesto sin carro, o al
revés). Los carros vuelven LLENOS: lo gastado en la partida anterior no se recuerda.
* **Posiciones** (las que pidió el propietario: esquinas, diagonales y central): esquina del
carrito (rx − 0,32, 6,9) y la esquina contraria (rx − 2,4, −6,6), diagonales a 45°
(rx − 4,77, ±4,77) y central (rx − 6,9, 0), todas por fuera de la línea de tres. La esquina del
lado contrario se mete 2,4 m hacia la pista para que quepan el carro y el jugador sin pisar el
borde del parqué.
* **Aparecen creciendo del parqué**, no de golpe: escala en Y de 0,02 a 1 en `PUESTOS_APARICION`
(0,28 s, ease-out) animada en `update()`. Un carro que sale de la nada se lee como un fallo de
carga; uno que crece se lee como que lo acaban de poner. Con `prefers-reduced-motion` se salta al
final (la animación no hace falta para jugar). Se escala SÓLO en Y porque la base del carro está en
el suelo: crece hacia arriba, no se hincha.
* **Los carros NO entran en el fundido de mallas estáticas**, y no es un detalle de rendimiento:
`batch.ts` **remueve la malla de su grupo** al fundirla, así que un carro fundido no se podría
esconder NUNCA —quedaría su copia congelada dentro del lote del mundo—. Y van **sin sombra
horneada** (`noCastShadow`): su sombra se habría quedado sola en el parqué al esconder el carro.
Llevan una **mancha radial** (`blob`), que es la misma técnica que usan el jugador y el balón (el
mapa de sombras se cuece una vez, así que un objeto que aparece y desaparece no puede proyectar).
* **Los balones del carro se gastan en el mundo**, no sólo en el HUD: se descuenta el que se está
tirando (`esperando`), los carros de atrás quedan vacíos y los de delante, llenos. La cuenta del
HUD («●●○») se ve ahora en la bandeja, así que se sabe cuántos quedan sin mirar arriba.* Gancho nuevo de desarrollo: **`__court.puestos()`** devuelve visibilidad (del carrito y de los
  carros que aparecen), progreso de la aparición, escala, balones por puesto (contados en las
  mallas, no en el estado), anillos y manchas. Es lo que permite comprobar en vivo que la pista
  arranca limpia, que los puestos aparecen y que se van al terminar.

#### Segundo ajuste del propietario (esta sesión): el carrito ES el primer carro

* «El carro donde interactúa el usuario debería ser el primer carro de balones a lanzar»: el
  carrito de la esquina pasa a ser **`TRIPLES[0]`**, así que se llega, se pulsa E y se tira desde
  ahí mismo, sin el carro de adorno que había al lado (y sin la vuelta de metro y medio que había
  que dar para empezar). Sigue siendo un triple: 6,91 m del aro, por fuera de los 6,75 de la línea.
* El recorrido queda **esquina (el carrito) → diagonal → central → diagonal → la otra esquina**, o
  sea las posiciones que pidió el propietario. `CARRITO` se declara ANTES de `TRIPLES` en
  `config.ts` porque ahora lo usa (un `const` usado antes de declararse revienta el módulo al
  cargarlo).
* **Los cinco puestos se unifican en una sola lista de mallas** (`puestos = [carrito, ...carros]`) en
  el MISMO orden que `TRIPLES`, porque `concurso.carro` es un índice de esa tabla: con las dos
  listas desordenadas, `sincronizarBalones()` habría vaciado el carro de al lado. El carrito se
  distingue sólo en dos cosas: está siempre a la vista (no lo toca `mostrarPuestos()`) y entra en el
  fundido de mallas y en el mapa de sombras como cualquier atrezo, porque nunca se esconde.
* `balonesVisibles(i)` es ahora la única fuente de la cuenta, y devuelve **tres balones al carrito
  aunque no haya concurso** (es de donde se coge el balón para jugar al baloncesto normal), cero a
  los puestos de atrás y tres a los de delante.
* **El balón se va de la bandeja tanto si se encesta como si se falla**, y no vuelve: la bajada la
  decide el estado, y ese descuento lo hace `resolverTiro()` en los DOS desenlaces —`onScore()`
  para la canasta, `fallarTiro()` para el fallo—, así que la bandeja sólo puede bajar. Verificado
  con los tres desenlaces seguidos: dos aciertos y un fallo, con los balones del carrito bajando
  3→2→1→0 (lo medido en vivo está abajo).

#### Medido en vivo (segundo ajuste)

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Pista limpia al arrancar | `__court.puestos()` nada más entrar a jugar | `carrito: true`, `carros: false`, balones `[3,0,0,0,0]` (el carrito lleno para jugar) |
| El carro que toca es el carrito | E en el carrito y `concurso.carro` | `carro: 0` con el jugador de pie en el carrito; 4 anillos y 4 manchas apareciendo |
| El balón se coge del carrito | carrito con 3 + balón en la mano | bandeja del carrito a 2 y los otros cuatro a 3: `[2,3,3,3,3]` |
| Encestar lo gasta | dos tiros metidos seguidos | `balones` 3→2→1 y bandeja `[2,…]`→`[1,…]`→`[0,…]`, puntos 0→1→2 |
| Fallar también lo gasta | tercer tiro con carga de 70 ms (fallo) | `balones` 1→0, bandeja `[0,…]` y el balón NO vuelve (puntos sin cambiar) |
| Cambio de puesto | andar a la diagonal con el carrito vacío | `carro: 1`, «Carro 2/5 ●●●» y la bandeja `[0,3,3,3,3]` |
| Se va al dejarlo | E en el carrito con el concurso en marcha | concurso cerrado, 0 anillos, 0 manchas y el carrito RECARGADO `[3,0,0,0,0]` |

### El fallo que encontró la prueba en vivo (y que el código no enseñaba)

En el fotograma en que **se agota el reloj**, `terminarConcurso()` esconde el recorrido (balones
incluidos) y el sincronizado de balones —que va DETRÁS en el mismo bloque— volvía a encender los
quince con el estado del concurso ya terminado. En pantalla no se veía nada raro (el grupo estaba
oculto), pero el mundo se quedaba diciendo que había 12 balones a la vista que no existían: la
lectura en vivo era `__court.puestos().balones = [1,3,3,3,3]` con `fin: 'tiempo'` y los cinco
carros ocultos. Arreglado con la guarda `if (concurso.activo)` alrededor del sincronizado, y
**verificado agotando el reloj de verdad** (60 s de reloj, no un atajo): tras el final, `visible:
false`, 0 anillos, 0 manchas y `balones [0,0,0,0,0]`.

### Medido en vivo (no deducido)

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Pista limpia al arrancar | `__court.puestos()` nada más entrar a jugar | `visible: false`, 0 anillos, 0 manchas, balones `[0,0,0,0,0]` |
| Aparecen al convocar | E en el carrito, muestreo cada 110 ms | `t` 0,24 → 0,71 → 1 con escala 0,42 → 0,92 → 1 · 5 anillos · 5 manchas |
| Balones por carro | tras el primer tiro del concurso | `[2,3,3,3,3]`: el que tiene en la mano no está en la bandeja |
| Se van al terminar | reloj agotado de verdad | `fin: 'tiempo'`, `visible: false`, 0 anillos, `[0,0,0,0,0]` |
| Mate en carrera | corriendo hacia el aro (ritmo 1) y espacio a 2 m | `activo` 0,68 s, altura 0,72 m y `sacudida` con el pico en el golpe (0,116 s restantes) |
| Mate quieto | de pie a 2,4 m del aro + espacio | `activo: false` y el tiro se resuelve como siempre |
| Input bloqueado | movimiento en sentido contrario durante la animación | la posición no responde al teclado (la manda la animación) |
| Takeover | 5 canastas seguidas | `takeover--on` con las 5 muescas encendidas |
| Se apaga al fallar | tiro malo a propósito desde 12 m | medidor oculto y **0 muescas** |
| Estela de fuego | `Points` de la escena con el balón en vuelo | 28/28 puntos vivos, `visible: true` |
| Entrevista | `openSection('contact')` | modo `interview`, HUD «REC CANAL 3 · DEPORTES 07:30:20 EN DIRECTO», opacidad del REC 1→0,5→0→0→0,5→1, diálogo avanzando con las respuestas elegidas y el formulario al final con el foco en `name` |

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **139/139** en 10 ficheros (`contest`, `dunk` y
`fireTrail` nuevos, más el del carrito como primer carro) · `npx vite build` ✓ · `main`
**703,68 kB / 196,88 kB gzip**.

### Pendiente y observado (para no volver a descubrirlo)

* **Un tiro soltado antes del final del reloj NO se cuenta.** Medido en vivo: balón en el aire
  cuando `t` llegó a 0, entró, y el marcador se quedó en `tiros: 2` — `resolverTiro` sólo corre con
  el concurso activo. Es el diseño anterior del minijuego, pero en un concurso de verdad la bola
  que sale antes de la bocina vale; si el propietario lo quiere tipo NBA, hay que dejar resolver el
  balón en vuelo después del final.
* **Un tiro muy fallado puede salir de la cancha** (visto en vuelo hasta x = −23 con el parqué a
  ±16): el modelo de error de `applyShotError` no tiene tope para el peor caso. Se vio con una
  carga de 40 ms desde 12 m, o sea el peor tiro posible; no se ha tocado.
* Los carros del recorrido no proyectan sombra (mancha radial en su lugar): es la decisión
  consciente que evita rehornear el mapa de sombras al aparecer y al desaparecer, que costaba
  ~7,8 ms por rehorno medidos con el renderizador de software del panel.
* Queda por probar en vivo el **gesto de tiro largo** (más de 7,5 m) con el mate en carrera ya
  dentro: la pose está cubierta por tests, pero no se disparó en la sesión.
## 3o. El «hay que tirar dos veces»: el balón que devuelve el reboteador

Lo reportó el propietario así: **«al pasar a un carro nuevo y hacer el primer tiro, el balón no sale
y tengo que volver a tirar para que cuente el tiro»**. El síntoma se veía sobre todo al estrenar
carro porque es ahí donde el jugador llega con un balón en las manos que el concurso no reconoce.

### La causa: una invariante rota por dos sitios

Durante el concurso hay una sola regla que lo ata todo: **si el jugador tiene un balón en las manos,
ese balón está EN JUEGO** (`concurso.esperando`). De ella dependen las tres cosas que se
desincronizaron:

* `resolverTiro()` —el tiro que entra y el que falla, los dos— deja `esperando = false` en el mismo
  fotograma en que `darBalonAlJugador()` devuelve el balón a las manos: el jugador se quedaba con un
  balón del carro que el juego no reconocía como suyo.
* La recogida sólo se intentaba `if (ball.state !== 'held')`, así que nadie volvía a marcar el balón
  que ya estaba en la mano. La invariante se rompía en CADA tiro resuelto, y con ella el carro se
  podía quedar con un balón «de nadie» en las manos.
* Al lanzar ese balón, `puedeCoger()` (que sólo mira `esperando`) decía que sí y disparaba una
  **segunda recogida en el mismo fotograma**: el balón salía y volvía a la mano. Desde fuera, «el
  tiro no ha salido», y el intento no contaba hasta volver a pulsar.

Y el caso concreto que veía el jugador: al vaciar un carro, el último balón se queda en las manos
(con `esperando` en false, porque el carro ya no tiene balones que marcar) y se lleva andando al
carro siguiente. Allí, el primer tiro era justo el que disparaba la recogida fantasma.

### El arreglo, en tres piezas

1. **El balón que devuelve el reboteador se marca como en juego** mientras al carro le queden
   balones: `if (concurso.activo && concurso.balones > 0) tomarBalon(concurso)`, inmediatamente
   después de devolverlo a las manos. De paso, `tomarBalon` vuelve a marcar la **bola del dinero**
   con la cuenta ya descontada, que es cuando toca (el balón que el jugador tiene es el que le
   queda al carro).
2. **La recogida ya no depende de `ball.state`**: se intenta siempre que `puedeCoger()` lo permita
   —y `puedeCoger` significa exactamente «no hay balón en juego y estoy en el carro que toca»—, y
   `cogerBalonDelPuesto()` cubre los dos casos: si el jugador **traía** un balón, ése se deja (se
   reancla a la bandeja y sube a las manos con la transición de siempre, así se VE llegar el del
   carro); si no lo traía, el balón que está por ahí sube a las manos. Es la misma regla que ya
   servía para el arranque del concurso, sin una segunda.
3. **Regla explícita y testeable: `puedeTirar(c)` en `contest.ts`** (`!c.activo || c.esperando`).
   Durante el concurso sólo se tira con un balón en juego. Sin ella quedaba el otro lado del mismo
   agujero: con el último balón de un carro ya vacío se podían encadenar tiros «de regalo» que no
   gastaban balón ni contaban intento —y sumaban puntos si entraban—. Fuera del concurso siempre es
   verdad, que es lo que deja seguir jugando al baloncesto normal al terminar.

### Medido en vivo (con el código final)

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Al convocar, el balón de la pista se deja | E en el carrito con el balón de juego en la mano | el balón salta de la mano a la bandeja del carrito (y 0,02 → 0,78 en 0,3 s) y sube a las manos: bandeja `[2,3,3,3,3]`, `esperando: true` |
| Tres tiros seguidos en el mismo carro | tres pulsaciones de espacio con muestreo cada 40 ms | los TRES salen (1.560 / 1.920 / 2.760 ms de vuelo, hasta `y = 4,4`): `tiros` 0→1→2→3 y bandeja 3→2→1→0 |
| Al vaciar el carro queda el balón en la mano | tras el tercer tiro resuelto | `balones: 0`, `esperando: false`, ball `held` en las manos y bandeja `[0,3,3,3,3]` |
| **El caso reportado** | andar al carro siguiente con ese balón y tirar | `carro: 1`, el balón aparece en la bandeja nueva y sube a las manos, bandeja `[0,2,3,3,3]` · **el primer tiro SALE** (1.640 ms, `y` hasta 4,56) y cuenta: `tiros` 3→4, bandeja 3→2 |
| Al terminar, el balón normal vuelve | reloj agotado de verdad (60 s) | `fin: 'tiempo'`, ball `held` en las manos, 0 anillos, 0 manchas, carrito recargado `[3,0,0,0,0]` |
| Y se sigue jugando | un tiro más con el concurso cerrado | sale (3.680 ms de vuelo) sin tocar la cuenta del carro |

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **142/142** en 10 ficheros (3 nuevos: `puedeTirar` fuera
del concurso, dentro del concurso y el marcado del balón que devuelve el reboteador) · `npx vite
build` ✓ · `main` **704,06 kB / 197,04 kB gzip**.

### Anotado durante la prueba

* Con la pestaña OCULTA no hay fotogramas (`requestAnimationFrame` se para) y la medida en vivo da
  falsos negativos: el reloj se queda clavado y el balón no sube a las manos. Las tablas de arriba
  son con la pestaña a la vista (`document.visibilityState === 'visible'` y el contador de
  fotogramas avanzando).
* Se confirma el pendiente ya anotado en §3n: **un tiro muy fallado puede salir de la cancha** (esta
  vez hasta x = 19,5 con el parqué a ±16). No se ha tocado.
## 3p. El tiro sobre la bocina

Petición del propietario: «deja que un tiro lanzado antes de que se agote el reloj del concurso de
triples se resuelva y cuente, como en el concurso real». Era el primero de los pendientes anotados en
§3n, y estaba medido: un tiro que entraba con el reloj ya a 0 no contaba, porque `resolverTiro` sólo
corre con el concurso activo y el final lo cerraba todo en el mismo fotograma.

### El mecanismo: la bocina es una ESPERA, no un estado aparte

* `avanzarReloj` sigue igual —marca `fin: 'tiempo'` y deja el reloj a 0—, pero **ya no cierra nada**.
  En el bucle, lo único nuevo es
  `if (enBocina(concurso) && ball.state !== 'flying') terminarConcurso('tiempo')`: el concurso se
  queda `activo` mientras el balón esté VOLANDO y se cierra en el fotograma en que deja de volar, con
  el tiro ya resuelto y sumado.
* Se mira **`ball.state`** y no `esperando` a propósito: un balón en las MANOS con el tiempo agotado
  —el que el jugador no llegó a soltar— no vale nada, y con `esperando` el concurso se habría quedado
  abierto para siempre esperando un tiro que nunca salió.
* El cierre va **antes** del bloque de juego, y no es un detalle de estilo: si el último carro se
  quedó vacío, el `terminarConcurso('carros')` de más abajo cerraría la partida «por balones» cuando
  lo que ha sonado es la bocina.
* Durante la espera no se puede estirar la partida, y eso son tres reglas del estado (con test):
  **`puedeTirar`** exige `fin !== 'tiempo'` (ni un lanzamiento más), **`puedeCoger`** también (ni un
  balón más) y **`avanzarCarro`** devuelve `false` (ni cambio de carro). Lo único que puede pasar es
  que aterrice el balón que ya iba por el aire.
* Quien suma el tanto sigue siendo la física del aro (`onScore`), y funciona justo porque el concurso
  está activo: de ahí la espera. En el HUD, la barra del concurso se queda en **0:00** con el aviso
  «¡Bocina! Vale el balón que va en el aire», así que se ve que la partida no ha terminado y por qué.
* Un tiro sobre la bocina que entra se canta (**«¡Sobre la bocina!»**), y el aviso va **el último de
  `onScore`**, después del «¡Canasta!»: los dos escriben en el mismo elemento del DOM, así que
  anunciarlo antes es no anunciarlo —la misma lección que ya estaba escrita allí para el Takeover—.
  Medido: en el fotograma de la canasta el «¡Canasta!» no llega a verse, lo pisa el aviso de la
  bocina.

### Medido en vivo (reloj agotado de verdad, no un atajo)

Guion en la página: convocar en el carrito, tirar el primer balón (es el que arranca el reloj),
mantener el tiro cargado y soltarlo con ~1 s por jugar, muestreando cada 100 ms. Tres partidas de
60 s:

| Qué | Resultado |
|---|---|
| Suelta | el balón sale con `t = 1,0 s` (ensayo 1 y 2) y con `t = 0,8 s` (ensayo 3) |
| Bocina | muestras con `t: 0`, `fin: 'tiempo'` y **`activo: true`**: el concurso NO se ha cerrado, con el balón `flying` (`y` 4,03 → 1,61 en el ensayo 1; 4,30 → 0,50 en el 2) |
| El tiro cuenta | canasta (ensayo 1 y 3): `balones` 2→1, `tiros` 1→**2**, `aciertos` 0→**1**, `puntos` 0→**1** · fallo (ensayo 2): `tiros` 1→**2** y `puntos` sin tocar (el fallo también es un intento, como debe ser) |
| Cierre | `activo: false`, `fin: 'tiempo'`, `tiros: 2`, `aciertos: 1`, `puntos: 1`, y el balón de la pista de vuelta en las manos |
| Aviso del HUD | `relojHud: "0:00"` y `aviso: "¡Bocina! Vale el balón que va en el aire"` en las tres partidas |
| Canto | «¡Sobre la bocina!» (tras «¡Tiro perfecto!», con el «¡Canasta!» pisado en el mismo fotograma) y después la cuenta final: «Se acabó el tiempo · 1 · 1/2» |

El ensayo 3 se apuntó al centro de la zona verde a propósito —`T = 5,132 s` de carga, calculado con
`meterAt` y `sweetCenterAt`—, y el juego lo confirmó con su propio aviso: «¡Tiro perfecto!».

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **145/145** en 10 ficheros (3 nuevos: la bocina deja el
concurso abierto y bloquea coger, tirar y avanzar; el tiro que venía del aire se resuelve y cuenta
—canasta y fallo—; y el cierre es de `main.ts` al salir) · `npx vite build` ✓ · `main` **704,30 kB /
197,12 kB gzip**.

### Lo que sigue pendiente (y no se toca aquí)

* **Un tiro muy fallado puede salir de la cancha**: el modelo de error de `applyShotError` no tiene
  tope para el peor caso (§3n). Visto otra vez en el ensayo 2: el balón acabó en `z = −4,48` con el
  aro en `z = 0`.
* Coger el siguiente balón exige estar a menos de 1,2 m del carro que toca, también con el reloj ya
  parado por la bocina: el que devuelve el reboteador sí llega, pero no se cambia de carro a mitad de
  la espera (es deliberado: la partida ya está decidida).
## 3q. El entrevistador comenta tu partida, y el diálogo baja al tercio inferior

Dos peticiones del propietario en la misma frase: que «el entrevistador comente mis números reales
(tiros, récord y mejor concurso guardados en el navegador), de modo que el diálogo cambie según lo
que haya hecho en la pista», y que «los cuadros de diálogo aparezcan en el tercio inferior
centrados, para que luego al terminar aparezca como ya está colocado el cuadro con los contactos
directos y el formulario».

### El diálogo se escribe con la partida dentro

* El guion sigue siendo una lista de datos, pero cada turno tiene ahora **dos variantes**: `host`
  (una clave de traducción, como antes) o `dato` (un comentario sobre la partida). Son una **unión**
  de tipos y no dos campos opcionales del mismo objeto: con `host?` y `dato?` compilaría un turno con
  los dos —o con ninguno— y saldría una línea vacía en mitad de la entrevista.
* `lineaDato()` lee los números de **`statsSource`**, que es el MISMO origen que el panel del récord:
  `main.ts` ya lo tenía montado (`court.stats` y `court.contest` del navegador) y devuelve el objeto
  vivo, el que mueve cada tiro, así que la entrevista comenta lo que acabas de hacer en esta sesión y
  no lo que había al cargar. **No hay una segunda cuenta que se pueda quedar desfasada.**
* Cada comentario tiene **dos frases**: con números y sin ellos. A un recién llegado no se le felicita
  por un cero —«Y de tiros, nada todavía: no te he visto lanzar ni uno»—, que es la mitad de que el
  diálogo cambie según lo que hayas hecho.
* Las frases van **enteras como clave de traducción** con sus huecos `{made}`/`{attempted}`/`{pct}` y
  `{best}`,  rellenos por el nuevo `tf()` (en `i18n.ts`). Componerlas a trozos —«llevas » + 7 +
  « canastas»— funcionaría en castellano y no en inglés, donde el orden y el plural son otros. Un
  hueco sin valor se queda a la vista (`{pct}`) en vez de desaparecer: es un fallo que se ve.
* Test nuevo (`tests/i18n.test.ts`, 5 casos): que **los dos idiomas usen los mismos huecos en cada
  clave** —lo que se rompería en silencio: la frase sale entera menos el número—, que las frases del
  entrevistador lleven los huecos que el código espera, y que `tf` sustituya, no toque lo que no
  tiene huecos y deje a la vista lo que no recibe.

### El cuadro baja al tercio inferior y no se mueve al terminar

* El modo entrevista ancla la tarjeta **abajo y centrada** (`place-items: end center`; antes
  `end start`, pegada a la esquina). La regla del móvil que ya la centraba queda como el caso general
  y se quita del media query de 700px, que sólo guarda sus otros ajustes.
* Mientras dura la **conversación**, el alto se queda en **40dvh**: es una esquina de plató, y con la
  tarjeta a media pantalla el entrevistador y el personaje se quedaban tapados, que es justo lo que
  se está mirando. Al **terminar**, el cuadro toma el alto de siempre (**58dvh**) para que quepan
  nombre, email y mensaje: la clase `panel__card--form` la pone `bindInterview` en el mismo sitio en
  que el formulario deja de estar oculto, así que no hay una segunda bandera que se pueda desfasar.
* Como la tarjeta está anclada abajo, **crecer es crecer hacia arriba**: el cuadro de contactos
  directos y el formulario aparecen donde ya estaban, sin saltar. Medido: el borde inferior y el
  centro horizontal no se mueven (ver la tabla).

### Medido en vivo

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Comenta tus números | `court.stats` = `{made:7,attempted:12}` y `court.contest` = `9` antes de cargar | «En mi libreta llevas **7** canastas de **12** tiros, un **58 %** desde la línea. Ese es tu récord en este navegador.» y «Tu mejor concurso guardado son **9** puntos.» |
| Y cambia si no hay nada | sin `court.stats` ni `court.contest` (navegador limpio) | «Y de tiros, nada todavía: no te he visto lanzar ni uno…» y «Y del concurso de triples no me consta nada…» |
| Tercio inferior centrado | `getBoundingClientRect()` de la tarjeta con la conversación en marcha | `alto 413` (40dvh de 1033), `arriba 424`, `abajo 837`, **centro en el eje (0 px de desvío)** |
| El cuadro no se mueve al terminar | la misma medida con el formulario a la vista | `alto 599` (58dvh), **mismo `abajo 837` y mismo centro**: crece hacia arriba |
| Contactos y formulario siguen ahí | al cerrar la conversación | pestañas «Entrevista» / «Contacto directo», campos `name`/`email`/`message` (+ honeypot) y el chip del CV |

### Observado (para no volver a descubrirlo)

* Con el cuadro en el tercio inferior, el botón **«Ir directo al formulario»** se queda por debajo
  del borde y hay que desplazar la conversación para verlo (el panel hace scroll). Quien quiera los
  datos directos tiene también la pestaña «Contacto directo», que está siempre a la vista. Si molesta,
  se arregla fijando el botón al pie del cuadro.

### Estado

`npx tsc --noEmit` 0 errores · `npm test` **150/150** en 11 ficheros (5 nuevos de i18n) · `npm run
build` ✓ con la validación de contenido (`--strict`) y la versión clásica · `main` **704,71 kB /
197,26 kB gzip**.
## 3r. La máquina de escribir del cuadro de entrevista, arreglada, y un clic que adelanta

### El síntoma, reproducido

Abrir la entrevista y no ver nada escrito: la primera frase se quedaba en curso con **0 caracteres** y
así seguía; sólo salía al pulsar el cuadro. Medido en el navegador con la entrevista abierta (10
muestras cada 400 ms sobre `[data-dlg-now] p`): `nowLen = 0` en las diez, **3,6 s sin escribir una
letra**.

### La causa: el reloj entra en segundos y el cuadro habla en milisegundos

`ui/dialogue.ts` está escrito en milisegundos —`CPS = 45/1000` (caracteres por ms), `PAUSA_HABLA = 520`,
`PAUSA_RESPUESTA = 380`— pero el bucle le pasaba `time`, el reloj **decorativo**, que va en **segundos**
(`clock.elapsedTime`). Con las unidades mezcladas la frase tardaba **mil veces más**: 0,045 caracteres
por segundo, o sea una letra cada ~22 s. Las pausas, por lo mismo, eran de 520 s.

Y el mismo error tenía un segundo efecto, peor: con `prefers-reduced-motion` ese reloj está **congelado
a 0**, así que las pausas no vencían nunca y la conversación se quedaba clavada en la primera frase, para
siempre y sin que ningún clic accidental la desbloqueara.

### El arreglo

* `tick()` recibe **`animTime * 1000`** —el reloj del personaje, el que nunca se congela, en
  milisegundos— y no el decorativo. De `tick` no cuelgan sólo las letras: también las **pausas**. Quien
  decide si la frase sale letra a letra o de golpe sigue siendo `reduced`, que ya iba como segundo
  argumento: lo que se deja de hacer es *parar el reloj* para conseguir «sin animación».
* **`arranque` se ancla en el primer fotograma**, no en el que creó la frase (`arranque: -1`, y lo pone
  `tick`). `start()` corre antes de que el bucle vuelva a llamar a `tick`, así que al crear la línea no
  hay ningún reloj de verdad al que agarrarse: con el reloj viejo —o con el 0 del arranque— la primera
  frase de la primera entrevista habría salido entera de golpe.
* **La pausa se cuenta desde que la frase termina**, no desde que empieza, y viaja **con la frase**
  (`LineaViva.pausa`): `PAUSA_HABLA` para el entrevistador —es la que separa dos intervenciones suyas— y
  `PAUSA_RESPUESTA`, más corta, después de la respuesta del jugador. Contada desde el arranque, una
  frase larga se comía la pausa escribiéndose y la intervención siguiente entraba pegada: dos frases
  seguidas del mismo entrevistador se leían como un párrafo único.
* **Un clic, un mensaje.** `completar()` termina la frase Y acorta la pausa a ahora, así que el turno
  siguiente entra en el fotograma que viene; antes el clic sólo completaba la frase y leer la entrevista
  pedía **dos clics por mensaje**. Lo que no se salta nunca es una respuesta pendiente: eso es ahora una
  bandera explícita (`esperando`) y no un `hasta = Infinity`, que era el mismo truco pero escondido en
  el valor de un número.

### Medido en vivo

| Qué | Cómo se midió | Resultado |
|---|---|---|
| Escribe sola | 12 muestras cada 200 ms de `[data-dlg-now] p` | 12 → 22 → 31 → 40 → 49 → 60 → 69 → 78 → 88 → 97 caracteres: **~45 caracteres por segundo**, y la frase entera al registro |
| Encadena turnos | la misma muestra, 6 s con el cuadro abierto | pasa de la primera frase a la segunda, a la tercera y a la primera pregunta sin tocar nada, y **ahí se queda esperando con las 2 respuestas** |
| Clic mientras escribe | clic en el cuadro con la frase a 7 caracteres | la frase **entra entera al registro** (log 7 → 8) y el mensaje siguiente **ya se está escribiendo**: 0 → 9 caracteres en 260 ms |
| Clic en la pausa | clic con la frase terminada y la pausa corriendo | el mensaje siguiente arranca en **60 ms** (sin el clic habría esperado los 520) |
| Con respuestas delante | clic en el cuadro con los dos botones a la vista | **no pasa nada**: `choices` sigue en 2, la decisión no se pierde |
| Movimiento reducido | Playwright con `emulateMedia({ reducedMotion: 'reduce' })`, 14 muestras cada 500 ms | cada frase sale **entera de golpe** y la conversación **avanza sola** hasta la primera pregunta (`log` 1 → 2 → 3 → 4, `choices` 2) sin ningún clic |
| La copia publicada | servidor estático sobre la raíz del repo, bundle `assets/main-CXm16C63.js` | la puerta se pinta, `mode=attract`, **sin 404 ni errores de consola**; el bundle trae `tick(le*1e3,n)` donde el anterior traía `tick(k,n)` |

### Estado

`npx tsc --noEmit` 0 errores · `npm run build` ✓ (validación `--strict` y versión clásica; `main` 709,81
kB / 198,52 kB gzip) · raíz **republicada** desde `dist/` (índice y dos chunks nuevos).

`npm test` **211/220**. Los **9 fallos son anteriores a este cambio y no lo tocan**: ninguno de esos
ficheros importa `ui/dialogue.ts` ni `game/main.ts`, y el recuento es idéntico antes y después. Son
deriva de contenido y del rediseño —la clásica se ha rebautizado «The Court» y ya no lleva
`person.name`; `index.html` no lleva `person.role.es`; el primer proyecto se llama «Endless Blue»; el
correo quedó detrás de los proyectos—, y `tests/guardas-contenido.test.ts` compara un `join(' | ')` con
`[]`, que no puede pasar nunca (se arregla comparando el array de errores, no su texto).
