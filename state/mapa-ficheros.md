# Mapa de ficheros

Unico escritor por fichero. Donde hay mas de una tarea, son **secuenciales**.

| Fichero | Tareas | Escritor | Paralelismo |
|---|---|---|---|
| `the-court/public/index.html` | T1 | T1 | **SECUENCIAL** bloquea a T5/T9: mientras exista, `dist/` puede no reflejar lo escrito en `the-court/index.html` |
| `the-court/public/assets/` | T1 | T1 | **SECUENCIAL**, precedido de medicion |
| `the-court/src/data/view.ts` *(nuevo)* | T2 | T2 | paralelo con T5 |
| `the-court/tests/view.test.ts` *(nuevo)* | T2 | T2 | libre |
| `the-court/src/ui/panels.ts` | T2, T3, T4, T7, T13 | T2 -> T3 -> T4 -> T7 -> T13 | **SECUENCIAL** (5 tareas) |
| `the-court/scripts/build-classic.ts` | T2, T3, T4, T6, T7 | T2 -> T3 -> T4 -> T6 -> T7 | **SECUENCIAL** (5 tareas) sobre el mismo bloque `51-69` |
| `the-court/src/data/content.ts` | T3, T4 | T3 -> T4 | **SECUENCIAL** |
| `the-court/src/i18n.ts` | T3, T7 | T3 | libre |
| `the-court/scripts/validate-content.ts` | T3, T10 | T3 -> T10 | **SECUENCIAL**: T10 endurece reglas ya instaladas |
| `the-court/src/boot.ts` | T5 | T5 | paralelo con T2 |
| `the-court/index.html` | T5, T9 | T5 -> T9 | **SECUENCIAL** (mismo `body`) |
| `the-court/src/ui/hud.ts` | T5 | T5 | libre |
| `the-court/src/styles.css` | T5, T8, T9, T12, T13 | T5 -> T8 -> T9 -> T12 -> T13 | **SECUENCIAL** (5 tareas). CSS en cascada: cambiar el orden cambia el resultado sin error de compilacion |
| `the-court/src/game/main.ts` | T9 | T9 | libre (un manejador de tecla, no toca el bucle) |
| `the-court/tests/identidad.test.ts` *(nuevo)* | T11 | T11 | libre |
| `the-court/scripts/check-publish.ts` *(nuevo)* | T11 | T11 | libre |
| `the-court/package.json` | T11 | T11 | libre |
| `index.html` (raiz) | — | **nadie** | **PROHIBIDO escribir.** Solo T11 lo lee |
| `classic/index.html` (raiz) | — | **nadie** | **PROHIBIDO escribir.** Solo T11 lo lee |
| `assets/` (raiz) | — | **nadie** | **PROHIBIDO escribir.** Fuera de alcance |

**Paralelismo real disponible: uno solo** (`{T2, T5}` tras T1), y solo mientras nadie escriba `panels.ts`, `build-classic.ts`, `content.ts` ni `styles.css`. Cualquier otro reparto es faux: dos personas editando `build-classic.ts` a la vez producen un `git diff` que ninguna reconoce.