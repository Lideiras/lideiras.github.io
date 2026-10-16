# 05 — Plan final

Fases: fusion de dos planes ciegos + correccion del propietario sobre la entrevista y la densidad.
AC cubiertos: **AC1→T5+T6+T12 · AC2→T8+T12 · AC3→T9+T6 · AC4→T2+T3+T4+T11 · AC5→T3+T10+T7 · AC6→gates · AC7→T4+T10**

## Diagnostico

Dos superficies cuentan la misma persona y no coinciden. La primera pantalla no la nombra: la puerta dice `MY PORTFOLIO` (`the-court/index.html:28,49`) y el nombre vive encerrado en «Sobre mí» (`panels.ts:264`). El reparto de «Sobre mi» es posicional (`panels.ts:251-260`): un parrafo nuevo reetiqueta cinco pestanas sin error. La clasica da contacto solo en la ultima seccion y con fechas en crudo `2025-02` frente a `feb 2025` del juego. Y hay un contenido capaz de pisar la salida del build: `the-court/public/index.html` es una copia vieja que Vite copia a `dist/`.

**Correccion del propietario (manda sobre el resto):** el cuadro de entrevista es demasiado pequeno y algunos paneles se sienten demasiado agrupados. Medido: `styles.css:596-605` lo fija en `min(460px,100%)` x `min(100%,40dvh)` frente a `920px` x `72dvh` del panel normal (`:430-431`) — mitad de ancho y 55% de altura. La densidad viene de `.tabs__list button` a `.72rem` en pixel (`:919`) y `.label` a `.7rem` (`:630`).

## Decisiones

1. **T1 va primera.** Es el unico punto donde el build puede sobrescribir su propia salida. Mientras exista, los cambios en la puerta no llegan a `dist/`. Medir es barato y desbloquea todo lo demas.
2. **La raiz se LEE, no se ESCRIBE.** `AGENTS.md` la declara version compilada y de solo lectura. Se conserva la deteccion (T11) y se veta automatizar la copia.
3. **Capa de vista pura `src/data/view.ts`, idioma por parametro.** Orden, agrupado y formato estan duplicados en `panels.ts:142-159,185,228` y `build-classic.ts:51-67`; de ahi que las superficies diverjan. Se rechaza exportar `fmtDate` desde `panels.ts` porque arrastra DOM e `i18n` y `build-classic.ts` corre en Node.
4. **`about` con temas declarados**, no por indice, y el validador exige cobertura.
5. **Skills y stack a `L10n` con lista blanca** de tokens tecnicos.
6. **La entrevista crece.** Se revierte la decision de `:598-603` (esquina de television) porque el propietario la ha revertido: en un portfolio, leer la conversacion es mas importante que no tapar al entrevistador. Se mantiene la intencion de fondo —que el plato siga viéndose— separandola del tamano: mas ancho y mas alto, pero anclada abajo y con el registro por encima de las respuestas.
7. **Lectura por encima de la estetica pixel.** `.tabs__list button` en pixel a `.72rem` es la navegacion de un panel de diez proyectos: se pasa a fuente de cuerpo. Los titulos, chips y badges siguen en pixel.
8. **La densidad se ataca con aire, no quitando contenido.** `.panel__body .prose + .prose` esta a `.9rem` (`:891`) para texto a `1rem/1.6`; se sube el ritmo vertical y el `gap` de las rejillas, porque quitar informacion de un portfolio es peor que estirarla.
9. **`.skip` deja de ser un enlace muerto:** `index.html:17` usa `.skip` y `styles.css` no define la clase (cero coincidencias).

## Tareas (orden de ejecucion)

### T1 — Cerrar el shadow de `the-court/public/` sobre `dist/` · S · riesgo ALTO
Ficheros: `the-court/public/index.html` (borrar), `the-court/public/assets/` (borrar solo tras medir).
Terminado: `npm run build` verde; `dist/index.html` carga el chunk de entrada realmente emitido; `public/index.html` ya no existe; nº de ficheros y bytes de `dist/` anotados antes y despues.
Riesgo: si el gate `sync-root` pasa a rojo, la senal es real (la raiz estaba vieja): **parar e informar**. Refrescar la raiz es decision del propietario.

### T2 — Capa de vista pura `src/data/view.ts` · M · riesgo bajo
Ficheros: `view.ts` (nuevo), `panels.ts`, `build-classic.ts`, `tests/view.test.ts` (nuevo). Depende de T1.
Terminado: `view.ts` no importa `window`/`document`/`localStorage`; `panels.ts` y `build-classic.ts` no ordenan ni formatean fechas por su cuenta; `npm test` y `tsc` verdes.

### T3 — `about` con temas declarados · M · riesgo medio
Ficheros: `content.ts`, `panels.ts`, `build-classic.ts`, `i18n.ts`, `validate-content.ts`. Depende de T2.
Terminado: `panels.ts` sin arrays de indices; reordenar parrafos no cambia que texto cubre cada titulo; `validate --strict` nombra el tema sin parrafo; fuera `tab_intro...tab_offcourt`.

### T4 — `skills[].items[].name` y `Project.stack` como `L10n` · M · riesgo medio
Ficheros: `content.ts`, `panels.ts`, `build-classic.ts`. Depende de T2, T3.
Terminado: el panel de Skills en ES no tiene etiqueta fuera de la lista blanca; `validate --strict` rechaza una nueva.

### T5 — Identidad y contacto en la primera pantalla · M · riesgo medio
Ficheros: `boot.ts`, `the-court/index.html`, `styles.css`, `hud.ts`. Depende de T1.
Terminado: puerta con nombre · puesto · ubicacion · `mailto:` antes de elegir idioma, y persisten al pasar a EN; HUD con identidad junto al contador **conservando** `hud.ts:217`.
Aviso: mover `content` a `boot.ts` reparte ~13 kB entre chunks. Comparar el **total** de `dist/assets`, no `main-*.js`.

### T6 — Cabecera y navegacion de la clasica · XS · riesgo bajo
Ficheros: `build-classic.ts`. Depende de T2.
Terminado: email visible sin desplazar; las 5 anclas de `nav` saltan; el boton de idioma tiene `aria-label`.

### T7 — Paridad de datos y jerarquia en la clasica · M · riesgo medio
Ficheros: `build-classic.ts`, `panels.ts` (solo el `<h3>` duplicado). Depende de T2, T3, T4, T6.
Terminado: imprime `about.highlights`; fechas `feb 2025`; etiqueta de tipo por hito; primer proyecto = anio mayor; `grep -c "<p></p>"` = 0; `details` plegado; `<h2>Skills</h2>` sale de i18n; `og:*` presentes.

### T8 — Escala de lectura: la navegacion deja de estar en pixel diminuto · S · riesgo bajo
Ficheros: `styles.css`. Depende de T5.
Terminado: `.tabs__list button` (`:916-921`) a `--font-body` con `max-height` + scroll en `.tabs__list`; `.label` (`:630`) fuera del suelo `.8rem`; ano, fecha de hito y «Detalles del proyecto» tambien. Capturas a 320/828/1440 px de los seis paneles sin solape ni truncado; con 10 pestanas simuladas la barra no crece sin limite.

### T9 — `.skip` real y atajo a la clasica · S · riesgo bajo
Ficheros: `styles.css`, `the-court/index.html`, `game/main.ts`. Depende de T8, T5.
Terminado: tabulando aparece el enlace por encima del lienzo; el atajo funciona con el juego en marcha; no depende de `hover`.

### T10 — Guardas de contenido · S · riesgo bajo
Ficheros: `validate-content.ts`. Depende de T3.
Terminado: rechaza nivel fuera de 1-10, grupo/proyecto/tema vacio, `topics` con id duplicado, y en `--strict` resumen > 200 car., detalles > 600, parrafo > 700 sin punto final; el mensaje dice campo y motivo.

### T11 — Verificacion de identidad de lo publicado (solo lectura) · M · riesgo medio
Ficheros: `tests/identidad.test.ts` (nuevo), `scripts/check-publish.ts` (nuevo), `package.json`. Depende de T3, T4, T7.
Terminado: el test exige `person.name`, `role.es`, `role.en` y `location` en la raiz, en `classic/index.html` y en el generado; `check-publish` compara raiz <-> generado y comprueba que el `index.html` raiz carga un `assets/main-*.js` **existente**. Ambos solo leen. Cambiar el nombre en `content.ts` los hace fallar.

### T12 — La entrevista, a tamaño de lectura · M · riesgo bajo  *(peticion del propietario)*
Ficheros: `styles.css`, `src/ui/panels.ts` (solo si hace falta estructura). Depende de T5.
Terminado: la caja de conversacion pasa de `min(460px,100%)` x `min(100%,40dvh)` a un ancho y alto de lectura, sin dejar de estar anclada abajo; el registro (`panel--contact`) gana alto propio y las respuestas dejan de robarle altura al texto; el estado con formulario (`:612`) se recalcula para que quepan nombre, email y mensaje. En 360 px de ancho no hay scroll horizontal. El plato sigue viéndose por encima de la caja.

### T13 — Densidad: que los paneles respiren · M · riesgo bajo  *(peticion del propietario)*
Ficheros: `styles.css`, `src/ui/panels.ts` si hace falta. Depende de T8.
Terminado: ritmo vertical de `.prose` subido desde `.9rem` (`:891`) y `gap` de `.grid` (`:502`) y `.timeline`Ampliado; un bloque de datos (`highlights`, `skills`) respira igual que la prosa; ninguna seccion queda con el texto apretado contra el borde; sin truncar ni solapar nada a 320/828/1440 px. **No se quita informacion**: esto es aire, no recorte.

## Secuenciacion

```
T1
 |- T2 --+-- T3 --+-- T4 --+-- T6 --+-- T7 --+-- T11
 |       |        |          |        |         |
 |       +-----------------------+-----+---------+-- T10 (desde T3)
 '- T5 --- T8 --- T9
              \-- T12 (desde T5)
              \-- T13 (desde T8)
```

Paralelismo real: uno solo, `{T2, T5}` tras T1, y solo mientras nadie escriba `panels.ts`, `build-classic.ts`, `content.ts` ni `styles.css`. `build-classic.ts` lo tocan 5 tareas, `panels.ts` 4 y `styles.css` 4 (T5, T8, T9, T12, T13): todas secuenciales.

## Verificacion

Gates, siempre en este orden: `npm test` y despues `npm run build`. Un test verde no dice que compile.

- **T1:** `dist/` (ficheros + bytes) → build → el hash de `index-<hash>.js` en `dist/index.html` es el emitido en ese build → repetir: hash y contenido no cambian.
- **T3:** mover un parrafo de `about` al principio, build, y los cinco titulos siguen cubriendo el mismo texto.
- **T5:** `npm run dev`, primera pantalla: nombre, puesto, ubicacion y correo antes de elegir idioma; en EN siguen ahi. Contadores del HUD intactos.
- **T6/T7:** abrir `classic/index.html` desde disco, sin build: email arriba, 5 anclas que saltan, `feb 2025 – Actualidad` con etiqueta, primer proyecto = anio mayor, `grep -c "<p></p>"` a 0.
- **T8/T13:** capturas a 320/828/1440 px de los seis paneles; con 10 pestanas, medir el alto de `.tabs__list`.
- **T12:** recorrer la entrevista entera en ES y EN en 360, 828 y 1440 px: se lee la linea del entrevistador sin cortarse, las respuestas no tapan el registro, y el plato sigue visible.
- **T11:** cambiar `person.name` → `npm test` y `check-publish` fallan → publicar → vuelven a pasar.

## Fuera de alcance

- **Automatizar la escritura en la raiz.** Veto por invariante (`AGENTS.md`: solo lectura). Se conserva la deteccion de T11.
- **Bug del marcador del techo** (`game/builders/court.ts`). Fuera del encargo; es geometria de un rotulo 3D.
- **Enlace al CV en la clasica.** El PDF esta en `documents/CV_eng.pdf` en la **raiz**, no en `assets/documents/` como dice `AGENTS.md`. Desde `/classic/` una ruta absoluta funciona en produccion y daria 404 en `dev`/`preview`; una relativa daria 404 en ambos.
- **Sustituir las cabeceras literales de la clasica por `UI.section_*`**: «Experiencia y estudios» != `section_experience` (`i18n.ts:55`); cambiaria texto visible aprobado.
- **Reescribir los textos EN de los proyectos** («entirelly», «plataformer»): contenido del propietario, sin version ES con la que contrastar. La regla de longitud (T10) si entra.
- **Bundles viejos de `assets/` y `characterGlb.ts` / `voxel-court.glb`**: peso de repositorio, no de lectura, y `assets/` es la raiz.
- **Barra de progreso, medidor y racha del HUD.** Se leen solos.

## A verificar antes de decidir

1. Si `public/index.html` pisa de verdad `dist/index.html`. Indicio: raiz `index.html:15-16` y `the-court/public/index.html:15-16` son identicos y ambos cargan `/assets/index-DpomDDzq.js`, mientras `the-court/index.html:63` aun apunta a `/src/boot.ts`. T1 lo decide ejecutando el build.
2. Recuento de `<p></p>` vacios en la clasica: son **6**, no 4. El criterio `-> 0` sigue valiendo.
3. Presupuesto de bundle: comparar el **total** de `dist/assets`, no `main-*.js`.
4. `AGENTS.md` dice `assets/documents/`; el fichero real esta en `documents/`.