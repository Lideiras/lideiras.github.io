## Problema

- El nombre y el oficio de la persona **no están en la superficie del juego**: `content.person.name` sólo aparece dentro de «Sobre mí» (`src/ui/panels.ts:264`) y el HUD sólo enseña «Secciones 3/6» (`src/ui/hud.ts:217`); la puerta de idioma dice `MY PORTFOLIO` sin nombre ni rol (`the-court/index.html:28,49`). AC1 falla en la primera pantalla.
- La misma persona está escrita **cinco veces**: `content.ts:64,67`, los `<title>`/`description` de `the-court/index.html:6,7,11-12`, los de `build-classic.ts:18-19`, `classic/index.html:6-7` y el `index.html` raíz. Ningún gate comprueba que coincidan.
- El reparto de «Sobre mí» es **posicional** (`panels.ts:251-260`): añadir un párrafo al principio descoloca los cinco temas sin error; los sobrantes caen en el último.
- Nombres de skills y chips de `stack` son monolingües (`content.ts:326-329` «Game development», `:351-355` «Español/Gallego», `:135` «Puzzles»): en el panel en español salen palabras en inglés. AC7 incumplido.
- `classic/` no es un portfolio legible: contacto al final de 10 artículos, sin índice (`build-classic.ts:47-69`), fechas crudas `2025-02` frente a `feb 2025` del juego (`classic/index.html:45`), `details` siempre extendido, `<p></p>` vacíos (`classic/index.html:41`), `<h2>Skills</h2>` como literal (`build-classic.ts:59`), sin CV ni `og:*`.
- El enlace de salto a texto plano está **muerto**: `the-court/index.html:17` usa `.skip` y `styles.css` no define esa clase (el lienzo lo tapa). AC3 depende de suerte.
- La publicación es manual y silenciosa: `classic/index.html` raíz e `index.html` raíz se copian a mano, y `the-court/public/index.html:15-16` + `public/assets/assets/` son restos del build React que Vite copia a `dist/` en cada build.

## Propuesta

| # | Qué | Por qué | Fichero | Riesgo | Cómo se verifica |
|---|---|---|---|---|---|
| X1 | **Capa de vista `src/data/view.ts`**: puro y derivado, define una sola vez identidad, `projectGroups` (Todo + años desc con contador), `timeline` ordenada desc, `skills` ordenadas por nivel desc, `topics`, `fmtDate`, `MONTHS`. Lo consumen **los dos** renderizadores | Hoy el orden, el agrupado y el formato están duplicados en `panels.ts` y `build-classic.ts`, y por eso las superficies discrepan; con una capa, crecer el contenido no puede desincronizarlas | nuevo `view.ts`; `panels.ts`, `build-classic.ts` | bajo | `tests/view.test.ts` + diff de HTML generado |
| X2 | **`about` con temas declarados** (`{id, label: L10n, paragraphs: L10n[]}`) en vez de índices `0..4` | Mata el acoplamiento posicional de `panels.ts:251-260`: un párrafo nuevo va a su tema, y un tema sin párrafo no existe | `content.ts`, `panels.ts`, `build-classic.ts`, `i18n.ts` (retirar `tab_intro…tab_offcourt`) | medio | mover un párrafo de sitio y comprobar que ningún tema cambia de texto |
| X3 | **`skills[].items[].name` y `Project.stack` pasan a `L10n`** con un helper `tech(s)` para nombres propios | Cierra AC7 sin inventar traducción: «Game development»/«Desarrollo de videojuegos» dejan de ser literales en el panel en español | `content.ts`, `panels.ts`, `build-classic.ts` | medio | `tests/view.test.ts` con lista corta de tokens técnicos permitidos en inglés |
| X4 | **Identidad permanente en el juego**: el chip de progreso pasa a chip de identidad (nombre + rol) y abre «Sobre mí»; botón ✉ a la derecha de la barra superior que abre `mailto:` de `content.person.email`; cabecera de la puerta de idioma con nombre + rol + ubicación | AC1 pide nombre, oficio, saberes y contacto sin abrir nada: hoy hacen falta dos paneles y una pestaña | `hud.ts`, `index.html`, `styles.css` | bajo | abrir el juego y leer los tres datos sin pulsar nada |
| X5 | **`tests/meta.test.ts`**: `index.html` (subproyecto y raíz), `classic/index.html` y el `<title>`/`<meta description>` generados deben contener `person.name`, `role.es`, `role.en` y `location` | Convierte la copia manual en un fallo de test en vez de una desincronización silenciosa | `tests/meta.test.ts` | bajo | tocar el nombre en `content.ts` y ver fallar el test |
| X6 | **Publicación verificable**: `scripts/publish.ts` (`npm run publish`) que copia `dist/` → raíz y `public/classic/` → `classic/`, y `scripts/check-publish.ts` que compara ambas, comprueba que el `index.html` raíz carga un `assets/main-*.js` existente y lista assets huérfanos | `04-contract` prohíbe pasos manuales nuevos sin automatizar; hoy el único control es mirar a mano | `scripts/publish.ts`, `scripts/check-publish.ts`, `package.json` | medio | ejecutar el check y ver 0 diferencias tras publicar |
| X7 | **`classic/` reconstruido desde `view.ts` + `UI`**: cabecera con nombre, rol, ubicación, email y redes; índice de anclas a las 5 secciones; `details` plegado; skills ordenadas por nivel con barra; hitos ordenados desc con fecha formateada y tipo; sin párrafos vacíos; `og:*`, `aria-label` en el botón de idioma, enlace al CV, `<h2>` tomados de `UI.section_*` | Es la superficie que se consulta de verdad en un portfolio; hoy exige scroll largo para el dato más importante (contacto) | `build-classic.ts` (+ `classic/index.html` al publicar) | medio | abrir `/classic/` en ES y EN y recorrer las 5 secciones sin scroll infinito |
| X8 | **Barra de pestañas acotada**: `max-height` + scroll en `.tabs__list` y `overflow-wrap` donde hoy hay `nowrap` | Con 6 pestañas cabe; con 8 años o 8 grupos se comería la tarjeta (AC5/AC2) | `styles.css` | bajo | forzar 10 pestañas y medir el alto de la barra |
| X9 | **Escala de lectura**: nada por debajo de `.8rem` en superficies de lectura; pestañas, año, fecha de hito y «Detalles del proyecto» a `--font-body` | `styles.css:916-921` pone la navegación de un panel de 10 proyectos en pixel a `.72rem` (~11,5 px) | `styles.css` | bajo | comparar captura antes/después a 828 px |
| X10 | **Guardas de contenido** (`validate-content.ts`): nivel entero 1–10, ningún grupo/proyecto/tema vacío, `topics` con id único, y avisos de longitud (resumen ≤200 car., detalles ≤ 600, párrafo ≤ 700); en `--strict`, error | Los párrafos sin punto final (`content.ts:82`) y las frases de 400 caracteres (`content.ts:170-172`) son legales hoy; la regla es lo que la hace aguantar cuando el contenido crezca | `validate-content.ts` | bajo | `npm run validate` y `npm run validate -- --strict` |
| X11 | **`.skip` con estilo visible al enfocar y por encima del lienzo**, más atajo de teclado dentro del juego hacia `/classic/` | `index.html:17` es un enlace que nadie ve ni puede tabular; AC3 depende de que exista | `styles.css`, `index.html` | bajo | tabular desde el inicio y ver el enlace |
| X12 | **Limpieza de `the-court/public/`**: borrar `public/index.html` y `public/assets/` (restos React con `assets/assets/` duplicado) | Vite los copia a `dist/` en cada build: peso muerto y riesgo de que `public/index.html` pise `dist/index.html` | `the-court/public/` | medio | medir `dist/` antes y después; comprobar que el juego arranca |

## Plan de trabajo

- **W1 — Capa de vista única.** Objetivo: una sola definición de orden, agrupado y formato que usen juego y clásico. Ficheros: `src/data/view.ts` (nuevo), `tests/view.test.ts`. **S**, riesgo bajo. Base de W2 y W7.
- **W2 — «Sobre mí» por temas.** Objetivo: eliminar el reparto posicional. Ficheros: `content.ts`, `panels.ts`, `build-classic.ts`, `i18n.ts`, `tests/view.test.ts`. **M**, riesgo medio. Depende de W1.
- **W3 — Skills y stack traducibles.** Objetivo: que ninguna etiqueta de contenido quede en inglés dentro de la interfaz en español. Ficheros: `content.ts`, `panels.ts`, `build-classic.ts`. **M**, riesgo medio. Depende de W1.
- **W4 — Identidad y contacto en el juego.** Objetivo: nombre, rol y correo visibles sin abrir nada, y `.skip` real. Ficheros: `hud.ts`, `index.html`, `styles.css`. **M**, riesgo bajo. Independiente.
- **W5 — Reconstrucción de `classic/`.** Objetivo: que la versión de texto se lea como un portfolio. Ficheros: `build-classic.ts` (+ `classic/index.html` al publicar). **M**, riesgo medio. Depende de W1 y W3.
- **W6 — CSS de lectura.** Objetivo: escala y barras de pestañas que aguantan el crecimiento. Ficheros: `styles.css`. **S**, riesgo bajo.
- **W7 — Guardas de contenido.** Objetivo: que el validador prohíba lo que hoy rompe la lectura. Ficheros: `validate-content.ts`, `content.ts`. **S**, riesgo bajo.
- **W8 — Metadatos y publicación verificados.** Objetivo: que ninguna copia manual pueda quedar obsoleta en silencio. Ficheros: `tests/meta.test.ts` (nuevo), `scripts/publish.ts` (nuevo), `scripts/check-publish.ts` (nuevo), `package.json`. **M**, riesgo medio (toca la raíz, otro repo git).
- **W9 — Limpieza de `public/`.** Objetivo: que `dist/` deje de arrastrar el build React. Ficheros: `the-court/public/index.html`, `the-court/public/assets/`. **S**, riesgo medio. Ejecutar **después** de W8, midiendo `dist/`.

## Como se verifica

- **W1/W2/W5**: generar `public/classic/index.html` y compararlo con la versión anterior proyecto a proyecto; comprobar con `grep` que ninguna fecha queda como `2025-02` y que no queda ningún `<p></p>` vacío.
- **W2 (prueba de reordenación)**: mover un párrafo de `about` al principio y comprobar que los cinco títulos siguen cubriendo el mismo texto; volver atrás.
- **W3**: abrir el panel de Skills en ES y listar mentalmente cualquier etiqueta no técnica en inglés; el test de `view.test.ts` falla si aparece una.
- **W4**: arrancar el juego y leer nombre, rol y correo en la primera pantalla sin abrir panel; tabular desde el cuerpo y ver `.skip`.
- **W6**: capturas a 320, 828 y 1440 px de los seis paneles; contar la altura de la barra de pestañas con 10 pestañas simuladas.
- **W7**: meter un nivel `11` y un resumen de 400 caracteres en una copia de `content.ts` y ver que el validador los rechaza.
- **W8**: cambiar el nombre en `content.ts` y ver que fallan `meta.test.ts` y `check-publish`; publicar y volver a pasarlos.
- **W9**: anotar el tamaño y el número de ficheros de `dist/` antes y después, y arrancar el juego en `vite preview`.

## Riesgos y descartes

- **No propongo reescribir los textos EN** de los proyectos («entirelly», «plataformer», «prototipe»): es contenido del propietario y no hay versión ES con la que contrastar; sí dejo la regla de longitud (W7) y el aviso en `validate`.
- **No propongo quitar las pestañas**: ya resuelven la respiración de diez proyectos; el problema es la escala y el crecimiento, y eso se arregla con X8/X9.
- **Descarto un buscador o índice global dentro del juego**: costaría fotogramas en la máquina de referencia y el problema se resuelve mejor en `classic` (X7).
- **Descarto mover el contenido a un JSON o a `localStorage` para compartirlo con `classic`**: rompe la fuente única en TS sin ganancia; `build-classic` ya importa `content.ts`.
- **Descarto tocar la física, el tuning, el rig y el mapa de sombras**, y también el bug del marcador del techo: quedan fuera del encargo y no aportan a AC1..AC7.
- **Descarto reescribir `assets/` de la raíz a mano**: es un resultado del despliegue, no una fuente; lo que propongo es el automatismo de W8.
- **Riesgo asumido de W8**: si el `index.html` raíz publicado fuera hoy una copia del *fuente* y no de `dist/`, la copia cambiaría al publicar; por eso W8 empieza midiendo qué se compara, antes de escribir nada.
- **Riesgo asumido de W9**: si `public/index.html` estuviera pisando `dist/index.html`, borrarlo cambia lo publicado; de ahí que W9 vaya después de W8 y con medición previa.