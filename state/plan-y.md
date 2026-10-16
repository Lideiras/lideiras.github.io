## Problema

- La puerta del juego (`the-court/index.html:28`) dice `MY PORTFOLIO` y poco más: el primer píxel de la primera superficie **no nombra a la persona, no dice a qué se dedica y no da un contacto**. El nombre sólo está en el `<title>`, que nadie lee en pantalla → AC1 no se cumple en la entrada del juego.
- En `classic/index.html` el contacto es la **última** sección, después de 10 proyectos y 11 hitos, y la `nav` (`:36`) sólo enlaza a la versión interactiva y al conmutador de idioma: no hay forma de llegar al email sin recorrer la página entera → AC1 tampoco se cumple aquí.
- `classic/index.html:39` no imprime `content.about.highlights` (el TFG 8/10, el Parlamento de Galicia, los 5 idiomas), que sí sale en la pestaña «Datos» del juego (`panels.ts:273`): una superficie enseña información que la otra no.
- `classic/index.html:45` muestra los hitos como `2025-02 – Actualidad` (volcado de BD) mientras el panel del juego los formatea como `feb 2025` (`panels.ts:154`), y **no muestra el tipo de hito** (Trabajo / Estudios / Deporte) que el juego sí muestra (`panels.ts:218`). Los mismos datos, dos lecturas distintas.
- `classic/index.html:41` emite `<p></p>` para los 4 proyectos sin enlaces (`build-classic.ts:55` no comprueba `p.links`), y ordena por orden de array: empieza por un proyecto de 2022 y el TFG de 2025 es el séptimo, mientras el juego ordena por año descendente (`panels.ts:185`).
- `panels.ts:249-260` reparte `about.paragraphs` a 5 pestañas **por posición**: reordenar, añadir o quitar un párrafo reetiqueta temas en silencio y el clásico no se entera → AC5.
- `classic/index.html` de la raíz es copia manual de `public/classic/index.html` y el build no la refresca: en cuanto cambie `content.ts` y no se copie, se sirve contenido obsoleto sin ningún aviso.

## Propuesta

| # | Qué | Por qué | Fichero | Riesgo | Cómo se verifica |
|---|---|---|---|---|---|
| Y1 | La tarjeta de la puerta muestra **nombre · puesto · ubicación** y un `mailto:` real, inyectados desde `content.person` | Es lo primero que ve el visitante y hoy no dice quién es; se rellena desde la fuente única, no con literales | `src/boot.ts`, `the-court/index.html`, `src/styles.css` | bajo | Abrir la puerta en `npm run dev`: se lee el nombre antes de elegir idioma; ES y EN |
| Y2 | La clásica lleva **email y redes en la cabecera** y una **`nav` con las 5 secciones** (`#about`… ya existen) | AC1/AC3: contacto localizable sin scroll y navegación por teclado | `scripts/build-classic.ts` | bajo | Abrir `classic/index.html` desde disco: email visible sin desplazar; los enlaces saltan |
| Y3 | La clásica imprime **`about.highlights`** (las fichas de datos) | Es contenido que existe en `content.ts` y una superficie enseña y la otra no | `scripts/build-classic.ts` | bajo | Comparar la sección «Sobre mí» de las dos superficies |
| Y4 | La clásica usa el **mismo formateador de fecha** que los paneles y añade la **etiqueta de tipo** (Trabajo/Estudios/Deporte) | Los mismos hitos se leen de dos maneras; el formato `feb 2025` ya está escrito y probado en `panels.ts:154` | `panels.ts` (exportar `fmtDate`), `scripts/build-classic.ts` | bajo | Leer `2025-02` en la clásica antes y `feb 2025 – Actualidad` después; las 3 etiquetas visibles |
| Y5 | La clásica **ordena los proyectos por año descendente** y **no emite `<p>` vacío** sin enlaces | Empieza por lo más débil; los huecos son hueco visual | `scripts/build-classic.ts` | bajo | El primero es «Endless Blue» (2025); `grep -c "<p></p>"` a 0 |
| Y6 | `about.paragraphs` lleva **la clave de su pestaña** en vez de inferirse por posición | Es el único acoplamiento posicional del pipeline y el que rompe AC5 en silencio | `src/data/content.ts`, `src/ui/panels.ts`, `scripts/validate-content.ts` | bajo | Quitar un párrafo y compilar: el validador lo dice en vez de reetiquetar |
| Y7 | `npm run classic` **avisa loudly** si el `classic/index.html` de la raíz ya no es idéntico al generado, con el comando de copia | La desincronización hoy es silenciosa; no hace falta pipeline nuevo para verla | `scripts/build-classic.ts` | bajo | Toca un texto en `content.ts`, `npm run classic`, leer el aviso |
| Y8 | Se quita el `<h3>` que **repite** el nombre del grupo ya presente en la pestaña | Ruido duplicado en la lectura del panel de skills | `src/ui/panels.ts` | bajo | Abrir la pestaña, el título aparece una vez |

## Plan de trabajo

- **W1 — Identidad en la puerta.** Objetivo: que el primer fotograma diga quién es la persona y cómo escribirle. `src/boot.ts` (import de `content`, `textContent` sobre un nodo marcado), `the-court/index.html` (un `<p data-gate-id>`), `src/styles.css` (regla `.gate-id`, reutilizando el estilo de `.gate-card p`). S · riesgo bajo · sin dependencias.
- **W2 — Contacto arriba y navegación en la clásica.** Objetivo: email y redes en la cabecera y anclas a las 5 secciones en la `nav`. `scripts/build-classic.ts`. XS · riesgo bajo · independiente.
- **W3 — Paridad de datos de la clásica.** Objetivo: `about.highlights`, etiqueta de tipo en los hitos y fechas con el formateador compartido; proyectos ordenados por año desc. y sin `<p>` vacío. `scripts/build-classic.ts` + `panels.ts` (exportar `fmtDate`, que ya es puro salvo `getLang()`: se le pasa el idioma por parámetro para poder usarlo también desde Node). M · riesgo bajo · independiente de W2 pero **toca el mismo fichero: secuencial**.
- **W4 — Pestañas de «Sobre mí» ligadas al dato.** Objetivo: cada párrafo declara su pestaña y el validador lo exige. `src/data/content.ts` (5 líneas), `src/ui/panels.ts` (`renderAbout` lee la etiqueta del párrafo en vez del índice), `scripts/validate-content.ts` (error si falta una etiqueta), y de paso Y8. S · riesgo bajo · independiente.
- **W5 — Aviso de copia desincronizada.** Objetivo: que la desincronización de `classic/index.html` se vea al terminar `npm run classic`. `scripts/build-classic.ts`, después del `writeFileSync`: comparar con `../../classic/index.html` y, si difieren, imprimir el comando de copia. XS · riesgo bajo · **toca el mismo fichero que W2/W3: hacer el último**.

## Como se verifica

Sin fiarse de los gates automáticos (los gates sólo comprueban que la copia raíz sea idéntica al fichero **ya** generado; no dicen si lo que se ve está bien):

1. **Puerta**: `npm run dev`, primera pantalla. Leer: sale «Daniel Noya Catoira», su puesto, Girona y un email pulsable. Cambiar a EN con el botón y comprobar que los datos no desaparecen (vienen de `content.ts`, no de `t()`).
2. **Clásica**: abrir `classic/index.html` desde el disco, sin `npm run`. Mirar: (a) email en la primera pantalla; (b) los 5 enlaces de la `nav` llevan a su sección; (c) en «Experiencia y estudios» se lee `feb 2025 – Actualidad`, no `2025-02`, y cada artículo lleva su etiqueta; (d) el primer proyecto es «Endless Blue»; (e) no hay huecos bajo las etiquetas de los proyectos sin enlaces; (f) las cuatro fichas de datos están al final de «Sobre mí».
3. **Paridad**: recorrer las dos superficies lado a lado (juego → menú ☰ y `/classic/`) y anotar cualquier dato que aparezca en una y no en la otra.
4. **Y6**: quitar temporalmente un párrafo de `content.ts` y leer el mensaje de `npm run validate -- --strict`: tiene que nombrar la pestaña que falta, no dejar de compilar en silencio.
5. **Y7**: editar un texto de `content.ts`, `npm run classic` y leer el aviso de la copia; luego restaurar y confirmar que `fc /b classic\index.html the-court\public\classic\index.html` vuelve a dar «0 diferencias».
6. **Presupuesto de fotograma**: la lista de dedos no cambia en el bucle y el bundle debe quedar dentro de ±5 kB de los 706,81 kB medidos; si se pasa, es que se ha colado trabajo por fotograma en el HUD.

## Riesgos y descartes

- **Bug del marcador del techo**: no lo incluyo. No es lectura de información, es geometría de un rótulo 3D y necesita un primer plano para diagnosticarse; mezclarlo aquí amplía el riesgo sin tocar ninguna de las superficies de información.
- **Sustituir los encabezados literales de la clásica por `UI.section_*`**: tres de cinco no coinciden con el texto aprobado («Experiencia y estudios» ≠ `section_experience`), así que el arreglo cambia texto visible a cambio de quitar una duplicación que no se desincroniza sola. Se deja la duplicación y se anota.
- **Enlace al PDF del CV en la clásica**: el mismo fichero se sirve en `/` y en `/classic/` bajo `the-court`, y la ruta relativa que valdría en la raíz (`../assets/documents/…`) daría 404 en `dev`/`preview`. Añadirlo crearía un enlace roto en una de las dos superficies; no se propone.
- **Comprobación automática de `index.html` raíz contra `dist/index.html`**: `dist/index.html` lleva los nombres de los assets con hash, así que cambia en cada build aunque el contenido no haya cambiado; la comparación daría falso positivo siempre. Por eso el aviso de Y7 se limita a `classic/`, que sí es byte-estable.
- **Automatizar la publicación** (copia a raíz o CI): el contrato pide no introducir pasos manuales nuevos, y automatizarlos exige decidir el flujo de deploy entero. Con menos superficie: aviso ruidoso + el gate de identidad que ya existe.
- **Nuevo fichero de test para el HTML generado**: no hay arnés que compruebe el HTML sin añadir uno; `validate --strict` cubre el dato y la comparación byte a byte cubre el resultado.
- **Limpieza de `assets/` con bundles viejos y del `characterGlb.ts` muerto**: es peso de repositorio, no de lectura, y `index.html` de la raíz es copia manual: tocarlo a ciegas puede romper lo publicado.
- **Barra de progreso / medidor / racha del HUD**: se leen solos y ya están medidos en la bitácora; no hay hallazgo que justifique tocarlos.