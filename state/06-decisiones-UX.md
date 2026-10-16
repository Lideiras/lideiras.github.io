# Decisiones de UX — revisión del propietario (2026-10-16)

Cambian T12 y T7, y nace T14. Sustituyen a lo aprobado para esos puntos en `05-plan-final.md`.

## Lo que pediste
1. En la entrevista, **no tener que hacer scroll para ver las respuestas**.
2. Las preguntas del reportero, **en modo diálogo de videojuego y fuera del panel**.
3. **El panel solo aparece al final**, para el formulario o el contacto directo.
4. Si se entra a contacto **desde el menú desplegable, no hay entrevista**: formulario directamente.

## El hallazgo que lo hace barato
Las dos rutas **ya existen** en `game/main.ts`:
- `main.ts:3024` — `if (input.consumeInteract()) openSection(active.id, true)` → pulsas **E** junto al reportero. `fromZone = true`.
- `main.ts:1166` — `onMenuSelect: (id) => openSection(id, false)` → abres contacto desde el menú. `fromZone = false`.
- `main.ts:1417` — `setMode(id === 'contact' && fromZone ? 'interview' : 'panel')`.

El `fromZone` ya distingue las dos intenciones. Lo que no se respeta es que **los dos caminos pintan lo mismo**: `PanelManager.open()` llama a `bindInterview` siempre que se abre contacto, venga de donde venga. El trabajo es dejar de borrar esa distinción.

## Diseño cerrado

### Ruta A — menú (☰) → Contacto
Panel modal normal, `mode = 'panel'`. **Sin entrevista.** Dentro: descarga del CV, contacto directo (email + redes) y formulario. Sin pestañas: la entrevista deja de ser una pestaña, asi que no queda nada que tabulizar.

### Ruta B — E junto al reportero → Entrevista
1. `mode = 'interview'` (el plató ya pasa a directo: reportero, operador, ON AIR).
2. Cuadro de diálogo **fuera del panel**, propio, pegado al borde inferior de la pantalla, estilo novela visual: nombre del entrevistador, texto y **las respuestas debajo, siempre a la vista**. Sin scroll.
3. Al terminar la conversación se abre el panel de contacto (Ruta A) con el formulario.

### Máquina de escribir
Decoracion, luego reloj `time` (se congela con `prefers-reduced-motion`), **nunca `animTime`**. Boton de saltar: completa la linea al instante y muestra las respuestas. Si al verlo resulta pesado, quitarlo es una regla de CSS.

## Lo que no se pierde (requisitos, no sugerencias)
- **`role="log"` + `aria-live="polite"`** viaja con el cuadro de dialogo (`panels.ts:373` ya lo tiene). Si se queda en el panel, un lector de pantalla pierde la entrevista entera. Es el riesgo nº1 de este cambio.
- **Foco**: al salir del panel desaparece su trampa de foco. Hay que mover el foco explicitamente al primer boton de respuesta, y decidir que hace Escape (propuesta: cierra el dialogo, no la partida).
- **Móvil**: el cuadro tiene que convivir con la lista de dedos, el medidor y el record en la parte baja. Es la restriccion real; en escritorio no aparece.
- **Boton de saltar**: hoy vive dentro del panel (`panels.ts:379`). Se traslada al cuadro.
- **`panel__card--form`** (`panels.ts:430`) desaparece: existia solo porque el formulario compartia caja con la conversacion.

## Tareas afectadas
- **T12 — REESCRITA.** No es agrandar la caja: es sacarla del panel. Nuevo `src/ui/dialogue.ts`.
- **T14 — NUEVA.** Separar las dos rutas segun `fromZone`: el menu no entrevista, el reportero si.
- **T7 —受影响.** `renderContact()` pierde las pestañas; una sola composicion para el panel.

## Mapa de ficheros que esto anade
| Fichero | Tarea | Nota |
|---|---|---|
| `src/ui/dialogue.ts` *(nuevo)* | T12 | Componente del cuadro, fuera del panel |
| `src/ui/panels.ts` | T7, T12, T14 | Quita la entrevista de las pestanas y el `bindInterview` del `open()` |
| `src/game/main.ts` | T14 | Al terminar el dialogo, abrir el panel |
| `src/styles.css` | T8, T12, T13 | T12 pasa a ser posicion del cuadro nuevo |

`src/game/main.ts` entra en el mapa: es la primera vez que una tarea toca el juego. Se mantiene la prohibicion de anadir geometria, material, sombra o trabajo por fotograma (invariantes de `AGENTS.md`). El unico trabajo por fotograma admisible es el `aria-live` al anadir una linea de texto, y solo cuando el dialogo esta abierto.