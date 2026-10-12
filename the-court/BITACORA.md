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
