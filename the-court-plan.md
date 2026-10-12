# THE COURT — Plan de desarrollo del portfolio-videojuego

> **Versión del plan:** 1.0 · **Fecha:** 12 oct 2026
> **Tipo de proyecto:** portfolio web informativo con forma de videojuego de baloncesto 2.5D low-poly
> **Plazo objetivo:** un fin de semana (~16 h) para la versión base

---

## 0. Cómo usar este documento

Este documento está escrito para que una IA (o una persona) lo ejecute **en orden y sin tomar decisiones propias**. Cada fase contiene: objetivo → archivos → código completo → comando de verificación → criterio de "hecho".

**Reglas para quien lo ejecute:**

1. Seguir las fases en orden. No saltar verificaciones.
2. Copiar el código **tal cual**. Si algo falla, corregir el error mínimo y anotarlo; no reescribir la arquitectura.
3. Si falta un dato (marcado `[[PENDIENTE]]`), **preguntar al propietario**. Nunca inventar empresas, fechas, métricas, enlaces ni textos.
4. No añadir dependencias que no estén listadas en la sección 3.
5. Todo texto visible al usuario debe existir en español **y** en inglés.

### 0.1 Estado de verificación (honestidad ante todo)

| Qué | Estado |
|---|---|
| Compilación TypeScript en modo `strict` (+ `noUnusedLocals`) | ✅ Verificado: 0 errores |
| Tests unitarios de la física del tiro y del balón (13 tests) | ✅ Verificado: 13/13 |
| `vite build` de producción | ✅ Verificado |
| Validador de contenido (`validate-content.ts`) y generador de la versión clásica | ✅ Verificado |
| **Render visual en navegador** (aspecto, encuadre de cámara, rendimiento, táctil) | ⚠️ **No verificado.** En el entorno donde se escribió este plan no había navegador. La sección 13 lista qué mirar y qué constantes ajustar. |
| Enlaces a assets externos opcionales | ⚠️ Los marcados ✅ en la sección 14 se comprobaron al escribir el plan; las licencias hay que revisarlas en cada página antes de usarlos. |

---

## 1. Decisiones

### 1.1 Cerradas (las tomaste tú)

| Tema | Decisión |
|---|---|
| Temática | Baloncesto |
| Estilo | 2.5D low-poly (cámara fija en ángulo, mundo 3D) |
| Alcance | Ligero: pocas mecánicas, versión base en un fin de semana |
| Idiomas | Español e inglés. **Se pregunta antes de cargar el juego** |
| Contacto | Formulario integrado en una escena: el jugador se acerca a una cámara de TV y a un entrevistador |
| Personaje | Genérico (no es un avatar tuyo) |
| Objetivo de la web | Solo informativa sobre ti: sin cuentas, sin backend propio |
| Contenido | Reutilizar el de tu portfolio estático actual y ampliarlo después con lo nuevo |

### 1.2 Tomadas por defecto (cámbialas si no te gustan)

| Decisión | Valor por defecto | Dónde se cambia |
|---|---|---|
| Frecuencia de la pregunta de idioma | **Cada visita** (se resalta el último idioma usado) | `ASK_EVERY_VISIT` en `src/boot.ts` |
| Assets | **Todo procedural** (personajes, pista, canastas, cámara de TV hechos con código). Cero descargas, cero licencias, carga instantánea | Sección 14 explica cómo sustituir por `.glb` |
| Sonido | Sintetizado con WebAudio (sin archivos) | `src/game/audio.ts` |
| Servicio del formulario | Formspree (envía a tu email, sin servidor propio). Sin endpoint configurado, abre el cliente de correo (`mailto:`) | `.env` → `VITE_FORM_ENDPOINT` |
| Progreso | Se guarda en `localStorage` qué secciones has visitado/desbloqueado (seguirá funcionando si el navegador lo bloquea) | `loadSet`/`saveSet` en `main.ts` |
| Secciones y cómo se abren | Ver sección 2.2 | `ZONES` en `config.ts` |
| Colores del jugador | Camiseta naranja `#ff6a1a`, pantalón oscuro | `buildHuman({...})` en `main.ts` |

### 1.3 Datos que faltan (los necesita la IA ejecutora)

- [ ] **URL o repositorio de tu portfolio estático actual** (imprescindible para la Fase 0).
- [ ] Nombre completo, iniciales (máx. 3 letras, se pintan en el centro de la pista) y dorsal.
- [ ] Email de destino del formulario y cuenta de Formspree (o el servicio que prefieras).
- [ ] Lista de proyectos/experiencias **nuevos** desde la última actualización (plantilla en 5.3).
- [ ] Dominio y hosting actuales.

---

## 2. Producto

### 2.1 Concepto

El visitante controla a un jugador en una pista de baloncesto con cámara fija en ángulo. Cada sección del portfolio es un lugar de la pista. Las dos canastas se **desbloquean encestando**; el resto se abre caminando hasta la zona y pulsando una tecla. Siempre hay un menú ☰ para saltar directamente a cualquier sección y un enlace a la **versión clásica** (HTML normal), para reclutadores con prisa, SEO, accesibilidad y dispositivos sin WebGL2.

### 2.2 Mapa del mundo

Convenciones: **1 unidad = 1 metro**. Eje **X** = largo de la pista (derecha en pantalla), **Z** = ancho (positivo = hacia la cámara = abajo en pantalla), **Y** = arriba. Los personajes miran hacia **+Z local**. La cámara está en el lado **+Z**.

| Sección | Lugar | Centro (x, z) | Radio de interacción | Cómo se abre |
|---|---|---|---|---|
| Proyectos | Canasta izquierda | aro en (−12.425, 0) | 4.5 m | **Encestar** una vez (luego, `E` cerca del aro la reabre) |
| Skills | Canasta derecha | aro en (+12.425, 0) | 4.5 m | **Encestar** una vez |
| Sobre mí | Banquillo | (0, 8.4) | 2.4 m | `E` / botón ACCIÓN |
| Experiencia | Túnel de vestuarios | (−10, −8.2) | 1.8 m | `E` / botón ACCIÓN |
| Contacto | Plató de entrevista TV | (9, 8.3) | 1.6 m | `E` / ACCIÓN → escena de entrevista con el formulario |

Escenografía: gradas con público en el lado −Z (216 asientos con instancing), banquillo con bolsa y toalla, plató de TV con reportero (micrófono), operador, cámara de estudio con luz *tally* parpadeante y cartel **ON AIR** que se enciende durante la entrevista.

### 2.3 Controles

| Acción | Teclado | Táctil |
|---|---|---|
| Moverte | `WASD` / flechas | Joystick virtual (izquierda) |
| Tirar | Mantener `Espacio` y soltar | Mantener 🏀 y soltar |
| Interactuar | `E` | Botón `E` |
| Cerrar panel | `Esc` o ✕ | ✕ |
| Menú / idioma / sonido | Botones arriba a la derecha | Ídem |

### 2.4 Máquina de estados

```
Página carga (solo HTML + CSS + boot.ts ≈ 6 KB)
        │
 Selector ES / EN ──(clic)──► descarga diferida del juego (≈132 KB gzip) ──► PLAY
                                                                              │
        ┌──────────────────┬─────────────────────┬─────────────────────┬──────┴─────┐
   tiro encestado     E en zona "walk"      E en zona contacto       menú ☰ (cualquier sección)
        │                  │                     │                         │
      PANEL              PANEL              ENTREVISTA                   PANEL
        └──────────────────┴────── Esc / ✕ ───────┴─────────────────────────┘
                                      ▼
                                    PLAY
```

Sin WebGL2, o si falla la carga del juego → redirección automática a `/classic/`.

### 2.5 Sistema de tiro (funcionamiento exacto)

1. Al **mantener** el botón de tiro aparece el medidor (barra con zona verde central). La aguja oscila 0→1→0 a `METER_HZ` = 0.7 barridos/s (≈1.4 s por pasada: es un juego de portfolio, no debe frustrar).
2. Al **soltar**, se calcula la velocidad inicial ideal que lleva el balón de la mano al centro del aro con una parábola (ecuación de tiro con ángulo fijo; prueba 55°, 62°, 70°, 78° y elige el primero que llega al aro **descendiendo**).
3. Error: dentro de la zona verde (`|e| ≤ SWEET_SPOT` = 0.3, es decir el **30 % central** del medidor) el error es **0 → canasta garantizada**. Fuera, el error crece linealmente hasta los extremos y la física decide (aro, tablero, rebotes).
4. Ayuda: tras 3 fallos seguidos el error se reduce a la mitad (`assist` 0.85 → 0.4). Nadie se queda atascado, y además existe el menú.
5. Física del balón: gravedad exacta (aceleración constante), subpasos de 1/120 s, rebote en suelo (0.62), tablero (0.55) y aro (detección al cruzar el plano del aro hacia abajo: dentro de `SCORE_RADIUS` = 0.2 m → canasta; entre 0.2 y 0.405 m → rebote en el aro).
6. Resultados medidos en los tests: desde 4 distancias distintas **toda la zona verde encesta exactamente una vez**; un tiro en el extremo corto del medidor falla; los tiros largos a veces entran de tablero (como en la vida real).

### 2.6 La escena de entrevista (contacto)

1. El jugador entra en el anillo naranja del plató y pulsa `E`.
2. El jugador se coloca en su marca (9, 8.3) mirando al reportero; la cámara viaja a un plano lateral que incluye a ambos y a la cámara de TV; el cartel **ON AIR** se enciende y el reportero extiende el micrófono.
3. El formulario aparece como "tercio inferior" de televisión (no tapa la escena). Campos: nombre, email, mensaje. Protecciones: campo trampa anti-bots (*honeypot*), validación de email y longitud, límite de 1 envío por minuto, y *fallback* a `mailto:` si no hay endpoint o falla el envío.
4. `Esc` o ✕ cierra la entrevista y devuelve el control.

---

## 3. Stack y versiones (fijas)

| Pieza | Versión | Para qué |
|---|---|---|
| Node.js | ≥ 20 LTS | Entorno |
| Vite | ^6 | Servidor de desarrollo y empaquetado — <https://vite.dev> |
| TypeScript | ^5.6 (`strict`) | Lenguaje |
| three | **0.170.0** (exacta) | Motor 3D — <https://threejs.org/docs/> |
| @types/three | **0.170.0** (exacta, debe coincidir con `three`) | Tipos |
| @fontsource/bebas-neue, @fontsource/inter | ^5 | Tipografías autoalojadas (sin peticiones a Google) — <https://fontsource.org> |
| Vitest | ^2 | Tests — <https://vitest.dev> |
| tsx | ^4 | Ejecutar los scripts de validación y de versión clásica |

Sin React, sin motor de física externo, sin librería de audio: menos superficie, menos peso, más fácil de mantener. Subir `three` a otra versión requiere subir `@types/three` a la misma.

---

## 4. Estructura de carpetas

```
the-court/
├─ index.html                 # selector de idioma + contenedores
├─ package.json  tsconfig.json  vite.config.ts  .env.example  .gitignore
├─ public/
│  ├─ _headers  robots.txt  og.png (crear: 1200×630)
│  ├─ classic/index.html      # GENERADO por scripts/build-classic.ts (no editar a mano)
│  └─ models/                 # (opcional) .glb si sustituyes lo procedural
├─ scripts/
│  ├─ validate-content.ts     # falla el build si el contenido está incompleto
│  └─ build-classic.ts        # genera la versión clásica desde content.ts
├─ tests/shot.test.ts
└─ src/
   ├─ boot.ts                 # idioma → descarga diferida del juego
   ├─ i18n.ts                 # diccionario de la interfaz + idioma activo
   ├─ styles.css
   ├─ data/content.ts         # ÚNICA fuente de verdad del contenido (bilingüe)
   ├─ game/
   │  ├─ config.ts  shot.ts  ball.ts  input.ts  audio.ts  main.ts
   │  ├─ assets.ts  characterGlb.ts        # solo para modelos .glb opcionales
   │  └─ builders/ util.ts  court.ts  props.ts  human.ts  tv.ts
   └─ ui/ hud.ts  panels.ts  contactForm.ts
```

Principio: **todo el contenido vive en `src/data/content.ts`**. El juego, los paneles y la versión clásica leen de ahí. Actualizar el portfolio = editar un archivo.

---

## 5. Fase 0 — Inventario del portfolio actual (antes de escribir código)

**Objetivo:** tener todo el contenido existente en el formato de `content.ts`, sin inventar nada.

### 5.1 Procedimiento

1. Obtener el portfolio actual (URL pública o repositorio). Si es una URL, leer cada página/sección; si es repo, leer HTML/JSON/Markdown de contenido.
2. Rellenar esta tabla de equivalencias y **mostrársela al propietario para confirmar** antes de continuar:

| Elemento del portfolio actual | Campo en `content.ts` |
|---|---|
| Nombre, titular, ubicación, email, redes | `person.*` |
| Texto de presentación / bio | `about.paragraphs[]` |
| Datos curiosos (posición en la cancha, afición al espacio…) | `about.highlights[]` |
| Cada proyecto (título, año, descripción, tecnologías, enlaces) | `projects[]` |
| Tecnologías y nivel | `skills[]` (nivel 1–5) |
| Trabajo, estudios, deporte | `timeline[]` con `kind: 'work' \| 'education' \| 'sport'` |

3. **Idiomas:** conserva el texto original en su idioma. El otro idioma lo traduce la IA fielmente y marca con `[[REVISAR TRADUCCIÓN]]` al final de cada texto traducido para que el propietario lo apruebe; después se quita el marcador.
4. Todo dato que no aparezca en el portfolio actual → `[[PENDIENTE]]` (nunca inventar).
5. `id` de proyectos/hitos: *slug* en minúsculas con guiones, único.

### 5.2 Cómo se usa el validador

`npm run validate` avisa de los marcadores pendientes. `npm run validate -- --strict` (lo usa `npm run build`) **falla** si queda algún `[[...]]`, un texto vacío en cualquier idioma, una URL que no sea `http(s)`/`mailto`, ids duplicados o si `person.name` sigue siendo "Tu Nombre". Así es imposible desplegar contenido a medias.

### 5.3 Plantilla para el contenido nuevo (lo harás tras la Fase 0)

```
Proyecto nuevo
- Título:
- Año:
- Resumen (1–2 frases, ES y EN):
- Tecnologías:
- Enlaces (demo, código, vídeo):
- ¿Destacado? (sí/no)

Experiencia / estudios / deporte nuevo
- Tipo (work | education | sport):
- Título (ES y EN) · Organización · Inicio – Fin (o actualidad):
- Descripción (ES y EN):
```

**Hecho cuando:** el propietario ha confirmado la tabla de equivalencias y existe un `content.ts` con todos los datos reales (los pendientes marcados).

---

## 6. Fase 1 — Scaffolding

```bash
mkdir the-court && cd the-court
git init
# Copiar los archivos de configuración de abajo y luego:
npm install
```

### 6.1 `package.json`

```json
{
  "name": "the-court",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "validate": "tsx scripts/validate-content.ts",
    "classic": "tsx scripts/build-classic.ts",
    "prebuild": "npm run validate -- --strict && npm run classic",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@fontsource/bebas-neue": "^5.1.0",
    "@fontsource/inter": "^5.1.0",
    "three": "0.170.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/three": "0.170.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

### 6.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src", "scripts", "tests", "vite.config.ts"]
}
```

### 6.3 `vite.config.ts`

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  server: { host: true },
});
```

### 6.4 `.env.example` (copiar a `.env` y rellenar)

```bash
# Endpoint del formulario de contacto (Formspree: https://formspree.io/f/XXXXXXXX)
VITE_FORM_ENDPOINT=
```

### 6.5 `.gitignore`

```text
# .gitignore
node_modules
dist
.env
public/classic/index.html
```

### 6.6 `public/_headers` y `public/robots.txt`

```text
# public/_headers
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/models/*
  Cache-Control: public, max-age=31536000, immutable
/classic/*
  Cache-Control: public, max-age=3600
```

```text
# public/robots.txt
User-agent: *
Allow: /
```

**Verificación:** `npm install` termina sin errores. **Hecho cuando** existe `node_modules/` y `npx tsc --version` responde.

---

## 7. Fase 2 — Idioma y contenido

Archivos: `src/i18n.ts` (diccionario de interfaz y estado de idioma) y `src/data/content.ts` (tu contenido).

### 7.1 `src/i18n.ts`

El idioma activo vive en un único sitio. `setLang` guarda la preferencia, actualiza `<html lang>` y emite el evento `langchange` que el HUD escucha. `UI` usa `satisfies` para que `t('clave')` esté tipado: una clave inexistente es un error de compilación.

```ts
// src/i18n.ts
export type Lang = 'es' | 'en';
export type L10n = Record<Lang, string>;

const STORAGE_KEY = 'court.lang';
let current: Lang = 'es';

export const isLang = (v: unknown): v is Lang => v === 'es' || v === 'en';

export function readSavedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

export function setLang(lang: Lang): void {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* almacenamiento bloqueado: se ignora */
  }
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export const getLang = (): Lang => current;
export const loc = (v: L10n): string => v[current];

export const UI = {
  loading: { es: 'Calentando…', en: 'Warming up…' },
  welcome: {
    es: 'Muévete con WASD o flechas · Mantén ESPACIO y suelta para tirar · E para interactuar',
    en: 'Move with WASD or arrows · Hold SPACE and release to shoot · E to interact',
  },
  welcome_touch: {
    es: 'Joystick para moverte · TIRO para lanzar · ACCIÓN para interactuar',
    en: 'Joystick to move · SHOOT to throw · ACTION to interact',
  },
  hint_interact: { es: 'Pulsa E', en: 'Press E' },
  hint_interact_touch: { es: 'Pulsa ACCIÓN', en: 'Tap ACTION' },
  hint_shoot: {
    es: 'Mantén ESPACIO y suelta en la zona verde',
    en: 'Hold SPACE and release in the green zone',
  },
  hint_shoot_touch: {
    es: 'Mantén TIRO y suelta en la zona verde',
    en: 'Hold SHOOT and release in the green zone',
  },
  section_projects: { es: 'Proyectos', en: 'Projects' },
  section_skills: { es: 'Skills', en: 'Skills' },
  section_about: { es: 'Sobre mí', en: 'About me' },
  section_experience: { es: 'Experiencia', en: 'Experience' },
  section_contact: { es: 'Contacto', en: 'Contact' },
  unlocked: { es: 'Sección desbloqueada', en: 'Section unlocked' },
  progress: { es: 'Secciones', en: 'Sections' },
  mvp: {
    es: '¡MVP! Has descubierto todo el portfolio',
    en: 'MVP! You have discovered the whole portfolio',
  },
  menu: { es: 'Menú', en: 'Menu' },
  menu_title: { es: 'Ir directo a una sección', en: 'Jump to a section' },
  close: { es: 'Cerrar', en: 'Close' },
  lang_toggle: { es: 'Cambiar idioma', en: 'Change language' },
  mute: { es: 'Silenciar', en: 'Mute' },
  unmute: { es: 'Activar sonido', en: 'Unmute' },
  classic: { es: 'Versión clásica', en: 'Classic version' },
  shot_perfect: { es: '¡Tiro perfecto!', en: 'Perfect shot!' },
  shot_basket: { es: '¡Canasta!', en: 'Basket!' },
  shot_miss: { es: 'Casi… otra vez', en: 'So close… try again' },
  form_name: { es: 'Nombre', en: 'Name' },
  form_email: { es: 'Email', en: 'Email' },
  form_message: { es: 'Mensaje', en: 'Message' },
  form_send: { es: 'Enviar', en: 'Send' },
  form_sending: { es: 'Enviando…', en: 'Sending…' },
  form_ok: { es: '¡Mensaje enviado! Te respondo pronto.', en: 'Message sent! I will reply soon.' },
  form_err: {
    es: 'No se pudo enviar. Escríbeme directamente a',
    en: 'Could not send. Please email me directly at',
  },
  form_invalid: {
    es: 'Revisa los campos (email válido y mensaje de al menos 10 caracteres).',
    en: 'Check the fields (valid email and a message of at least 10 characters).',
  },
  form_wait: { es: 'Espera un minuto antes de enviar otro mensaje.', en: 'Please wait a minute before sending another message.' },
  interview_title: { es: 'Entrevista en directo', en: 'Live interview' },
  interview_sub: { es: 'Cuéntame sobre tu proyecto', en: 'Tell me about your project' },
  contact_direct: { es: 'O escríbeme directamente', en: 'Or reach me directly' },
  skills_level: { es: 'Nivel', en: 'Level' },
  about_number: { es: 'Dorsal', en: 'Jersey' },
  kind_work: { es: 'Trabajo', en: 'Work' },
  kind_education: { es: 'Estudios', en: 'Education' },
  kind_sport: { es: 'Deporte', en: 'Sport' },
  present: { es: 'Actualidad', en: 'Present' },
  aria_game: {
    es: 'Escena interactiva en 3D. Usa el menú para ir directamente a cualquier sección.',
    en: 'Interactive 3D scene. Use the menu to jump straight to any section.',
  },
} satisfies Record<string, L10n>;

export type UIKey = keyof typeof UI;
export const t = (key: UIKey): string => UI[key][current];
```

### 7.2 `src/data/content.ts`

Los **tipos** son definitivos; los **datos** de ejemplo se sustituyen con el resultado de la Fase 0. Cada texto visible es `{ es, en }`. `end: null` significa "actualidad".

```ts
// src/data/content.ts
import type { L10n } from '../i18n';

export type SectionId = 'projects' | 'skills' | 'about' | 'experience' | 'contact';

export interface Link { label: L10n; url: string }

export interface Project {
  id: string;
  title: string;
  year: number;
  summary: L10n;
  stack: string[];
  links: Link[];
}

export interface SkillGroup {
  id: string;
  name: L10n;
  items: { name: string; level: 1 | 2 | 3 | 4 | 5 }[];
}

export interface TimelineItem {
  id: string;
  kind: 'work' | 'education' | 'sport';
  title: L10n;
  org: string;
  start: string;
  end: string | null; // null = actualidad
  description: L10n;
}

export interface Content {
  person: {
    name: string;
    initials: string;
    jerseyNumber: string;
    role: L10n;
    tagline: L10n;
    location: string;
    email: string;
    social: Link[];
  };
  about: { paragraphs: L10n[]; highlights: { label: L10n; value: L10n }[] };
  projects: Project[];
  skills: SkillGroup[];
  timeline: TimelineItem[];
}

/* Datos de ejemplo: la Fase 0 del plan los sustituye por los de tu portfolio actual. */
export const content: Content = {
  person: {
    name: 'Tu Nombre',
    initials: 'TN',
    jerseyNumber: '23',
    role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    tagline: {
      es: 'Videojuegos, web y baloncesto.',
      en: 'Games, web and basketball.',
    },
    location: 'Barcelona',
    email: 'hola@example.com',
    social: [
      { label: { es: 'GitHub', en: 'GitHub' }, url: 'https://github.com/' },
      { label: { es: 'LinkedIn', en: 'LinkedIn' }, url: 'https://www.linkedin.com/' },
    ],
  },
  about: {
    paragraphs: [
      {
        es: 'Soy desarrollador full stack con formación en desarrollo de videojuegos.',
        en: 'I am a full stack developer trained in game development.',
      },
    ],
    highlights: [
      { label: { es: 'Posición', en: 'Position' }, value: { es: 'Base', en: 'Point guard' } },
    ],
  },
  projects: [
    {
      id: 'proyecto-ejemplo',
      title: 'Proyecto de ejemplo',
      year: 2025,
      summary: { es: 'Descripción breve del proyecto.', en: 'Short project description.' },
      stack: ['TypeScript', 'Node.js'],
      links: [{ label: { es: 'Código', en: 'Code' }, url: 'https://github.com/' }],
    },
  ],
  skills: [
    {
      id: 'frontend',
      name: { es: 'Frontend', en: 'Frontend' },
      items: [
        { name: 'TypeScript', level: 5 },
        { name: 'Three.js', level: 4 },
      ],
    },
  ],
  timeline: [
    {
      id: 'estudios-videojuegos',
      kind: 'education',
      title: { es: 'Desarrollo de videojuegos', en: 'Game development' },
      org: 'Centro de estudios',
      start: '2019',
      end: '2023',
      description: { es: 'Formación en diseño y programación de videojuegos.', en: 'Training in game design and programming.' },
    },
  ],
};
```

### 7.3 `scripts/validate-content.ts`

```ts
// scripts/validate-content.ts
import { content } from '../src/data/content';

const strict = process.argv.includes('--strict');
const errors: string[] = [];
const warnings: string[] = [];

function walk(node: unknown, path: string): void {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    const isL10n = typeof o.es === 'string' && typeof o.en === 'string' && Object.keys(o).length === 2;
    if (isL10n) {
      for (const lang of ['es', 'en'] as const) {
        const v = (o[lang] as string).trim();
        if (!v) errors.push(`${path}.${lang} está vacío`);
        if (v.includes('[[')) (strict ? errors : warnings).push(`${path}.${lang} contiene un marcador [[PENDIENTE]]`);
      }
      return;
    }
    for (const [k, v] of Object.entries(o)) {
      if (k === 'url' && typeof v === 'string' && !/^(https?:\/\/|mailto:)/.test(v)) errors.push(`${path}.url no es http(s)/mailto: ${v}`);
      walk(v, `${path}.${k}`);
    }
    return;
  }
  if (typeof node === 'string' && node.includes('[[')) (strict ? errors : warnings).push(`${path} contiene un marcador [[PENDIENTE]]`);
}

function unique(label: string, ids: string[]): void {
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`${label}: ids duplicados ${dup.join(', ')}`);
}

walk(content, 'content');
unique('projects', content.projects.map((p) => p.id));
unique('skills', content.skills.map((s) => s.id));
unique('timeline', content.timeline.map((x) => x.id));
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(content.person.email)) errors.push('person.email inválido');
if (content.person.initials.length > 3) errors.push('person.initials: máximo 3 caracteres');
if (strict && content.person.name === 'Tu Nombre') errors.push('person.name sigue siendo el valor de ejemplo');

warnings.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  process.exit(1);
}
console.log(`✓ content.ts válido (${content.projects.length} proyectos, ${content.skills.length} grupos de skills, ${content.timeline.length} hitos)`);
```

**Verificación:** `npm run validate` → `✓ content.ts válido (…)`. **Hecho cuando** pasa con los datos reales (en modo no estricto pueden quedar `[[PENDIENTE]]` como aviso).

---

## 8. Fase 3 — Configuración, matemática del tiro y física del balón

### 8.1 `src/game/config.ts`

Todas las constantes de juego en un único sitio. Las medidas son reglamentarias (FIBA): pista 28×15 m, aro a 3.05 m, diámetro del aro 0.45 m, balón de 0.24 m. `SCORE_RADIUS` (0.2 m) es deliberadamente generoso para que el juego sea amable. `ZONES` es la tabla de la sección 2.2.

```ts
// src/game/config.ts
import type { SectionId } from '../data/content';

export const G = 9.81;
export const COURT = { length: 28, width: 15, halfL: 14, halfW: 7.5 } as const;
export const RIM = { y: 3.05, radius: 0.225, tube: 0.012, fromBaseline: 1.575, boardFromBaseline: 1.2 } as const;
export const BALL = { radius: 0.12, visualScale: 1.5 } as const;
export const SCORE_RADIUS = 0.2; // tolerancia (m) del centro de la canasta; más alto = más fácil
export const SHOOT_RANGE = 11; // distancia máxima "recomendada" al aro
export const METER_HZ = 0.7; // barridos completos (0→1→0) por segundo: más bajo = más fácil
export const SWEET_SPOT = 0.3; // |e| <= 0.3 = zona verde (30 % del medidor): canasta garantizada

export const PLAYER = {
  speed: 5.2,
  bounds: { minX: -16, maxX: 16, minZ: -8.8, maxZ: 10.6 },
} as const;

export const CAMERA = {
  fov: 32,
  offset: [0, 14, 12] as const,
  lerp: 4,
  clampX: 11,
  minZ: -4,
  maxZ: 5,
} as const;

export type Side = -1 | 1;
export const rimX = (s: Side): number => s * (COURT.halfL - RIM.fromBaseline); // ±12.425
export const boardX = (s: Side): number => s * (COURT.halfL - RIM.boardFromBaseline); // ±12.8

export const SECTION_IDS: SectionId[] = ['projects', 'skills', 'about', 'experience', 'contact'];

export interface Zone {
  id: SectionId;
  kind: 'shoot' | 'walk' | 'interview';
  x: number;
  z: number;
  radius: number;
  side?: Side;
}

export const ZONES: Zone[] = [
  { id: 'projects', kind: 'shoot', x: rimX(-1), z: 0, radius: 4.5, side: -1 },
  { id: 'skills', kind: 'shoot', x: rimX(1), z: 0, radius: 4.5, side: 1 },
  { id: 'about', kind: 'walk', x: 0, z: 8.4, radius: 2.4 },
  { id: 'experience', kind: 'walk', x: -10, z: -8.2, radius: 1.8 },
  { id: 'contact', kind: 'interview', x: 9, z: 8.3, radius: 1.6 },
];

export const INTERVIEW = {
  playerSpot: [9, 8.3] as const,
  cameraPos: [5.4, 2.1, 8.9] as const,
  cameraLook: [9.2, 1.3, 9.0] as const,
};
```

### 8.2 `src/game/shot.ts`

```ts
// src/game/shot.ts
import { G, METER_HZ, SWEET_SPOT } from './config';

export interface V3 { x: number; y: number; z: number }
export interface ShotSolution { vx: number; vy: number; vz: number; t: number; angleDeg: number }

/**
 * Velocidad inicial para ir de `from` a `rim` siguiendo una parábola.
 * Prueba varios ángulos y se queda con el primero que llega al aro DESCENDIENDO
 * (si llegara subiendo, el balón nunca podría entrar).
 */
export function solveShot(from: V3, rim: V3, angles: number[] = [55, 62, 70, 78]): ShotSolution | null {
  const dx = rim.x - from.x;
  const dz = rim.z - from.z;
  const d = Math.hypot(dx, dz);
  const h = rim.y - from.y;
  if (d < 0.01) return null;

  for (const angleDeg of angles) {
    const th = (angleDeg * Math.PI) / 180;
    const denom = 2 * Math.cos(th) ** 2 * (d * Math.tan(th) - h);
    if (denom <= 0) continue;
    const v = Math.sqrt((G * d * d) / denom);
    const vh = v * Math.cos(th);
    const vy = v * Math.sin(th);
    const t = d / vh;
    if (vy - G * t >= 0) continue; // llega subiendo: descartar
    return { vx: (vh * dx) / d, vy, vz: (vh * dz) / d, t, angleDeg };
  }
  return null;
}

/** Medidor triangular 0→1→0 con METER_HZ barridos completos por segundo. */
export function meterAt(seconds: number): number {
  const p = (seconds * METER_HZ) % 2;
  return p < 1 ? p : 2 - p;
}

/** e ∈ [-1, 1]; 0 = centro exacto de la zona verde. */
export function evaluateMeter(m: number): { e: number; perfect: boolean } {
  const e = (m - 0.5) * 2;
  return { e, perfect: Math.abs(e) <= SWEET_SPOT };
}

/**
 * Aplica el error de timing a la solución ideal.
 * - Dentro de la zona verde (|e| <= SWEET_SPOT) el error es 0: canasta garantizada.
 * - Fuera, el error crece linealmente hasta 1 en los extremos del medidor.
 * - assist ∈ [0, 1]: 1 = error completo, 0 = siempre perfecto.
 */
export function applyShotError(sol: ShotSolution, e: number, assist: number, rnd: () => number): V3 {
  const mag = Math.max(0, Math.abs(e) - SWEET_SPOT) / (1 - SWEET_SPOT);
  const eEff = Math.sign(e) * mag;
  const speedScale = 1 + eEff * 0.06 * assist;
  const yaw = (rnd() - 0.5) * 0.03 * mag * assist;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const vx = sol.vx * speedScale;
  const vz = sol.vz * speedScale;
  return { x: vx * cos - vz * sin, y: sol.vy * speedScale, z: vx * sin + vz * cos };
}
```

### 8.3 `src/game/ball.ts`

```ts
// src/game/ball.ts
import * as THREE from 'three';
import { BALL, G, RIM, SCORE_RADIUS, boardX, rimX, type Side } from './config';

export interface BallEvents {
  score?: (side: Side) => void;
  rim?: () => void;
  board?: () => void;
  bounce?: (impactSpeed: number) => void;
}

const SIDES: Side[] = [-1, 1];

export class Ball {
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  state: 'held' | 'flying' = 'held';
  scored = false;
  private resting = 0;
  private age = 0;
  private readonly prev = new THREE.Vector3();

  constructor(readonly object: THREE.Object3D, private readonly ev: BallEvents = {}) {}

  launch(from: THREE.Vector3, vel: THREE.Vector3): void {
    this.pos.copy(from);
    this.vel.copy(vel);
    this.state = 'flying';
    this.scored = false;
    this.resting = 0;
    this.age = 0;
    this.object.position.copy(this.pos);
  }

  get settled(): boolean {
    return this.state === 'flying' && (this.age > 8 || this.resting > 0.8);
  }

  step(dt: number): void {
    if (this.state !== 'flying') return;
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / n;
    for (let i = 0; i < n; i++) this.integrate(h);
    this.age += dt;
    this.object.position.copy(this.pos);
    this.object.rotation.x += this.vel.z * dt * 3;
    this.object.rotation.z -= this.vel.x * dt * 3;
  }

  private integrate(dt: number): void {
    const { pos, vel, prev } = this;
    prev.copy(pos);

    // Gravedad exacta (aceleración constante)
    pos.addScaledVector(vel, dt);
    pos.y -= 0.5 * G * dt * dt;
    vel.y -= G * dt;

    // Suelo
    if (pos.y < BALL.radius && vel.y < 0) {
      const impact = -vel.y;
      pos.y = BALL.radius;
      vel.y = impact * 0.62;
      vel.x *= 0.92;
      vel.z *= 0.92;
      if (impact > 1.2) this.ev.bounce?.(impact);
      if (vel.y < 0.8) vel.y = 0;
    }
    if (pos.y <= BALL.radius + 1e-3 && vel.y === 0) {
      const f = Math.max(0, 1 - 2.2 * dt);
      vel.x *= f;
      vel.z *= f;
      this.resting = Math.hypot(vel.x, vel.z) < 0.4 ? this.resting + dt : 0;
    } else {
      this.resting = 0;
    }

    for (const s of SIDES) {
      // Tablero (plano x = boardX, rectángulo 1.8 x 1.05 m)
      const bx = boardX(s);
      if ((prev.x - bx) * (pos.x - bx) < 0 && Math.abs(pos.z) < 0.9 && pos.y > 2.9 && pos.y < 3.95) {
        const dir = Math.sign(prev.x - bx);
        pos.x = bx + dir * (BALL.radius + 0.026);
        vel.x = -vel.x * 0.55;
        this.ev.board?.();
      }

      // Aro (plano y = RIM.y, solo cruzando hacia abajo)
      if (prev.y > RIM.y && pos.y <= RIM.y && vel.y < 0) {
        const k = (prev.y - RIM.y) / (prev.y - pos.y);
        const cx = prev.x + (pos.x - prev.x) * k;
        const cz = prev.z + (pos.z - prev.z) * k;
        const dx = cx - rimX(s);
        const dz = cz;
        const dist = Math.hypot(dx, dz);
        if (dist <= SCORE_RADIUS) {
          if (!this.scored) {
            this.scored = true;
            this.ev.score?.(s);
          }
          vel.x *= 0.35;
          vel.z *= 0.35;
          vel.y *= 0.7;
        } else if (dist <= RIM.radius + BALL.radius + 0.06) {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          vel.set(nx * 1.8 + vel.x * 0.2, 2.8, nz * 1.8 + vel.z * 0.2);
          pos.y = RIM.y + 0.02;
          this.ev.rim?.();
        }
      }
    }
  }
}
```

### 8.4 `tests/shot.test.ts`

```ts
// tests/shot.test.ts
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Ball } from '../src/game/ball';
import { RIM, rimX, G, METER_HZ, SWEET_SPOT } from '../src/game/config';
import { applyShotError, evaluateMeter, meterAt, solveShot } from '../src/game/shot';

const rimLeft = { x: rimX(-1), y: RIM.y, z: 0 };

describe('solveShot', () => {
  const shooters = [
    { x: -4.4, y: 2.1, z: 0.5 },
    { x: -8, y: 2.1, z: -3 },
    { x: -10.5, y: 2.1, z: 1 },
    { x: -2, y: 2.1, z: 6 },
    { x: 0, y: 2.15, z: 0 },
  ];
  it.each(shooters)('llega al centro del aro descendiendo desde %o', (from) => {
    const s = solveShot(from, rimLeft)!;
    expect(s).not.toBeNull();
    const x = from.x + s.vx * s.t;
    const z = from.z + s.vz * s.t;
    const y = from.y + s.vy * s.t - 0.5 * G * s.t * s.t;
    expect(x).toBeCloseTo(rimLeft.x, 5);
    expect(z).toBeCloseTo(rimLeft.z, 5);
    expect(y).toBeCloseTo(RIM.y, 5);
    expect(s.vy - G * s.t).toBeLessThan(0);
  });
});

describe('medidor', () => {
  it('es triangular 0→1→0', () => {
    expect(meterAt(0)).toBeCloseTo(0);
    expect(meterAt(1 / METER_HZ)).toBeCloseTo(1);
    expect(meterAt(2 / METER_HZ)).toBeCloseTo(0);
  });
  it('centro = perfecto', () => {
    expect(evaluateMeter(0.5).perfect).toBe(true);
    expect(evaluateMeter(0.9).perfect).toBe(false);
  });
});

function simulate(e: number, from: { x: number; y: number; z: number }) {
  let scores = 0;
  const ball = new Ball(new THREE.Object3D(), { score: () => scores++ });
  const sol = solveShot(from, rimLeft)!;
  const v = applyShotError(sol, e, 1, () => 0.5);
  ball.launch(new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(v.x, v.y, v.z));
  for (let i = 0; i < 60 * 6; i++) ball.step(1 / 60);
  return scores;
}

describe('Ball física + canasta', () => {
  it.each(shootersForBall())('desde %o: toda la zona verde encesta exactamente una vez', (from) => {
    for (const e of [-SWEET_SPOT, -0.1, 0, 0.1, SWEET_SPOT]) {
      expect(simulate(e, from)).toBe(1);
    }
  });
  it('un tiro muy corto (extremo del medidor) no encesta', () => {
    expect(simulate(-1, { x: -4.4, y: 2.1, z: 0.5 })).toBe(0);
  });
  it('un tiro corto fuera de la zona verde no encesta desde media distancia', () => {
    expect(simulate(-0.7, { x: -4.4, y: 2.1, z: 0.5 })).toBe(0);
  });
});

function shootersForBall() {
  return [
    { x: -4.4, y: 2.1, z: 0.5 },
    { x: -8, y: 2.1, z: -3 },
    { x: -10.5, y: 2.1, z: 1 },
    { x: -2, y: 2.1, z: 6 },
  ];
}
```

**Verificación:** `npm test` → `13 passed`. **Hecho cuando** los 13 tests pasan. Si se cambian `SWEET_SPOT`, `SCORE_RADIUS` o la física, estos tests deben seguir pasando: son la red de seguridad de la jugabilidad.

---

## 9. Fase 4 — Construcción del mundo (todo con código)

Estrategia: **cero assets obligatorios**. Personajes, pista, canastas, banquillo, túnel y plató se generan con primitivas de Three.js (cajas, cilindros, toros, esferas) con *flat shading*, que es exactamente la estética low-poly. Ventajas: carga instantánea, sin licencias, fácil de recolorear, y demuestra tu nivel técnico como desarrollador de videojuegos.

### 9.1 `src/game/builders/util.ts` — utilidades

`mat()` cachea materiales; `box()` crea cajas con sombras; `cylBetween()` une dos puntos con un cilindro (trípode, brazo de canasta); `canvasTexture()` dibuja texturas por código; `mulberry32()` es un generador aleatorio con semilla (el público es idéntico en cada carga).

```ts
// src/game/builders/util.ts
import * as THREE from 'three';

const cache = new Map<number, THREE.MeshStandardMaterial>();

/** Material low-poly con flat shading, cacheado por color. */
export function mat(color: number): THREE.MeshStandardMaterial {
  let m = cache.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05 });
    cache.set(color, m);
  }
  return m;
}

export function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Cilindro entre dos puntos (patas de trípode, brazos de canasta…). */
export function cylBetween(a: THREE.Vector3, b: THREE.Vector3, radius: number, color: number): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 6), mat(color));
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  m.castShadow = true;
  return m;
}

export function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) throw new Error('2D canvas no disponible');
  draw(g);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** PRNG determinista para que la escena sea idéntica en cada carga. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

### 9.2 `src/game/builders/human.ts` — personaje genérico

Humanoide de ~1.9 m: piernas y brazos con **pivotes en cadera y hombro** (por eso se pueden animar rotando el grupo), torso, cabeza con ojos, pelo, calzado, dorsal en la espalda (textura de canvas). El mismo constructor crea al jugador, al reportero y al operador de cámara con otros colores.

Animaciones procedurales: `animateHuman` (carrera: piernas y brazos en oposición con seno, rebote del cuerpo, "respiración" del torso) y `poseShoot` (brazos arriba). Para cambiar la apariencia basta con los colores de `HumanOptions`.

```ts
// src/game/builders/human.ts
import * as THREE from 'three';
import { box, canvasTexture } from './util';

export interface HumanOptions {
  skin: number;
  hair: number;
  jersey: number;
  shorts: number;
  shoes: number;
  number?: string;
}

export interface HumanRig {
  root: THREE.Group; // posición/rotación en el mundo (pies en y=0, mira hacia +Z local)
  body: THREE.Group; // sube y baja al correr
  torso: THREE.Mesh;
  armL: THREE.Group; // pivotes en los hombros
  armR: THREE.Group;
  legL: THREE.Group; // pivotes en las caderas
  legR: THREE.Group;
}

/** Humanoide low-poly de ~1.9 m construido solo con cajas. Sin assets externos. */
export function buildHuman(o: HumanOptions): HumanRig {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const leg = (x: number): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.95, 0);
    const l = box(0.14, 0.9, 0.14, o.skin);
    l.position.y = -0.45;
    const shoe = box(0.16, 0.09, 0.27, o.shoes);
    shoe.position.set(0, -0.86, 0.05);
    pivot.add(l, shoe);
    return pivot;
  };
  const arm = (x: number): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 1.5, 0);
    const a = box(0.1, 0.58, 0.1, o.skin);
    a.position.y = -0.29;
    const shoulder = box(0.13, 0.14, 0.13, o.jersey);
    shoulder.position.y = -0.04;
    pivot.add(a, shoulder);
    return pivot;
  };

  const legL = leg(-0.11);
  const legR = leg(0.11);
  const armL = arm(-0.29);
  const armR = arm(0.29);

  const shorts = box(0.42, 0.34, 0.26, o.shorts);
  shorts.position.y = 0.98;
  const torso = box(0.44, 0.6, 0.25, o.jersey);
  torso.position.y = 1.27;
  const neck = box(0.08, 0.08, 0.08, o.skin);
  neck.position.y = 1.6;
  const head = box(0.24, 0.26, 0.24, o.skin);
  head.position.y = 1.76;
  const hair = box(0.26, 0.1, 0.26, o.hair);
  hair.position.y = 1.9;
  const eyeL = box(0.03, 0.03, 0.01, 0x111111);
  eyeL.position.set(-0.055, 1.78, 0.121);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.055;

  body.add(legL, legR, armL, armR, shorts, torso, neck, head, hair, eyeL, eyeR);

  if (o.number) {
    const text = o.number;
    const tex = canvasTexture(128, 128, (g) => {
      g.clearRect(0, 0, 128, 128);
      g.fillStyle = '#ffffff';
      g.font = 'bold 96px Impact, "Bebas Neue", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(text, 64, 70);
    });
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.26),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
    );
    plane.position.set(0, 1.3, -0.127);
    plane.rotation.y = Math.PI; // el plano mira hacia -Z (la espalda)
    body.add(plane);
  }

  return { root, body, torso, armL, armR, legL, legR };
}

/** Ciclo de carrera procedural. speed01 ∈ [0, 1]. */
export function animateHuman(rig: HumanRig, time: number, speed01: number, holdingBall: boolean): void {
  const swing = Math.sin(time * 11) * 0.9 * speed01;
  rig.legL.rotation.x = swing;
  rig.legR.rotation.x = -swing;
  if (holdingBall) {
    rig.armL.rotation.x = -0.9 - swing * 0.1;
    rig.armR.rotation.x = -0.9 + swing * 0.1;
  } else {
    rig.armL.rotation.x = -swing * 0.8;
    rig.armR.rotation.x = swing * 0.8;
  }
  rig.body.position.y = Math.abs(Math.sin(time * 11)) * 0.06 * speed01;
  rig.torso.scale.y = 1 + Math.sin(time * 2.2) * 0.012;
}

/** Brazos arriba al cargar el tiro. k ∈ [0, 1]. */
export function poseShoot(rig: HumanRig, k: number): void {
  const a = -1.2 - k * 1.3;
  rig.armL.rotation.x = a;
  rig.armR.rotation.x = a;
}
```

### 9.3 `src/game/builders/court.ts` — pista y gradas

La pista es **un plano con una textura dibujada por código** (80 px/m → 2240×1200): parqué con tablones, zonas pintadas, líneas reglamentarias (círculo central, zonas de 4.9×5.8 m, círculos de tiros libres, línea de triple a 6.75 m con rectas de esquina a 0.9 m de la banda, semicírculo de no-carga). Las iniciales del propietario se pintan en el círculo central (la fuente se espera con `document.fonts.load` antes de dibujar). Las gradas son 6 escalones y un `InstancedMesh` con 240 espectadores (una sola llamada de dibujo).

```ts
// src/game/builders/court.ts
import * as THREE from 'three';
import { COURT } from '../config';
import { box, canvasTexture, mulberry32 } from './util';

const PPM = 80; // píxeles de textura por metro

function drawCourt(g: CanvasRenderingContext2D, W: number, H: number, brand: string): void {
  // Parqué
  g.fillStyle = '#c98b4b';
  g.fillRect(0, 0, W, H);
  const plank = PPM * 0.25;
  for (let i = 0, n = 0; i < W; i += plank, n++) {
    g.fillStyle = n % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
    g.fillRect(i, 0, plank, H);
  }
  // Zonas pintadas (4.9 m ancho × 5.8 m largo)
  const keyL = 5.8 * PPM;
  const keyW = 4.9 * PPM;
  g.fillStyle = '#9d3b2a';
  g.fillRect(0, H / 2 - keyW / 2, keyL, keyW);
  g.fillRect(W - keyL, H / 2 - keyW / 2, keyL, keyW);

  // Líneas
  const lw = 0.06 * PPM;
  g.strokeStyle = '#ffffff';
  g.lineWidth = lw;
  g.lineJoin = 'round';
  g.strokeRect(lw / 2, lw / 2, W - lw, H - lw);
  g.beginPath();
  g.moveTo(W / 2, 0);
  g.lineTo(W / 2, H);
  g.stroke();
  g.beginPath();
  g.arc(W / 2, H / 2, 1.8 * PPM, 0, Math.PI * 2);
  g.stroke();

  const hoopFromBase = 1.575 * PPM;
  const arcR = 6.75 * PPM;
  const cornerZ = 6.6 * PPM; // línea de triple a 0.9 m de la banda
  const a = Math.asin(cornerZ / arcR);
  const dxArc = Math.sqrt(arcR * arcR - cornerZ * cornerZ);

  for (const side of [-1, 1] as const) {
    const baseX = side === -1 ? 0 : W;
    const dir = side === -1 ? 1 : -1; // hacia el interior de la pista
    const hx = baseX + dir * hoopFromBase;
    // Caja de la zona + círculo de tiros libres
    g.strokeRect(side === -1 ? 0 : W - keyL, H / 2 - keyW / 2, keyL, keyW);
    g.beginPath();
    g.arc(baseX + dir * keyL, H / 2, 1.8 * PPM, 0, Math.PI * 2);
    g.stroke();
    // Triple: dos rectas + arco
    g.beginPath();
    g.moveTo(baseX, H / 2 - cornerZ);
    g.lineTo(hx + dir * dxArc, H / 2 - cornerZ);
    g.moveTo(baseX, H / 2 + cornerZ);
    g.lineTo(hx + dir * dxArc, H / 2 + cornerZ);
    g.stroke();
    g.beginPath();
    if (side === -1) g.arc(hx, H / 2, arcR, -a, a);
    else g.arc(hx, H / 2, arcR, Math.PI - a, Math.PI + a);
    g.stroke();
    // Semicírculo bajo el aro
    g.beginPath();
    g.arc(hx, H / 2, 1.25 * PPM, side === -1 ? -Math.PI / 2 : Math.PI / 2, side === -1 ? Math.PI / 2 : -Math.PI / 2 + Math.PI * 2, false);
    g.stroke();
  }

  // Marca central
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.font = `${1.1 * PPM}px "Bebas Neue", Impact, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(brand, W / 2, H / 2 + 0.05 * PPM);
}

function buildStands(): THREE.Group {
  const g = new THREE.Group();
  const rows = 6;
  const cols = 40;
  for (let i = 0; i < rows; i++) {
    const step = box(46, 0.6, 1.2, i % 2 ? 0x25304a : 0x2c3957);
    step.position.set(0, 0.3 + i * 0.6, -10.6 - i * 1.2);
    g.add(step);
  }
  const rnd = mulberry32(7);
  const palette = [0xf97316, 0x38bdf8, 0xf8fafc, 0xfacc15, 0xa78bfa, 0x34d399].map((c) => new THREE.Color(c));
  const fans = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.34, 0.5, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }),
    rows * cols,
  );
  const m = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rnd() < 0.2) m.makeScale(0.001, 0.001, 0.001); // asiento vacío
      else m.makeTranslation(-19.5 + c + rnd() * 0.2, 0.6 + r * 0.6 + 0.25, -10.6 - r * 1.2);
      fans.setMatrixAt(k, m);
      fans.setColorAt(k, palette[Math.floor(rnd() * palette.length)]!);
      k++;
    }
  }
  fans.instanceMatrix.needsUpdate = true;
  if (fans.instanceColor) fans.instanceColor.needsUpdate = true;
  g.add(fans);
  return g;
}

export function buildCourt(brand: string, maxAnisotropy: number): THREE.Group {
  const group = new THREE.Group();
  const W = COURT.length * PPM;
  const H = COURT.width * PPM;
  const tex = canvasTexture(W, H, (g) => drawCourt(g, W, H, brand));
  tex.anisotropy = maxAnisotropy;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(COURT.length, COURT.width),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  const around = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 40),
    new THREE.MeshStandardMaterial({ color: 0x1d2433, roughness: 0.9 }),
  );
  around.rotation.x = -Math.PI / 2;
  around.position.y = -0.01;
  around.receiveShadow = true;

  group.add(around, floor, buildStands());
  return group;
}
```

### 9.4 `src/game/builders/props.ts` — canasta, banquillo, túnel, anillos y balón

La canasta usa la geometría real: tablero de 1.8×1.05 m con borde inferior a 2.90 m, aro (toro de radio 0.225 m) a 3.05 m y a 0.15 m del tablero, red como cilindro troncocónico en *wireframe*.

```ts
// src/game/builders/props.ts
import * as THREE from 'three';
import { BALL, COURT, RIM, boardX, rimX, type Side } from '../config';
import { box, canvasTexture, cylBetween, mat } from './util';

/** Canasta completa: poste, brazo, tablero, aro y red. Medidas FIBA (aro a 3.05 m). */
export function buildHoop(side: Side): THREE.Group {
  const g = new THREE.Group();
  const bx = boardX(side);
  const poleX = side * (COURT.halfL + 0.6);

  const pole = box(0.18, 3.7, 0.18, 0x2b2f3a);
  pole.position.set(poleX, 1.85, 0);
  const arm = cylBetween(new THREE.Vector3(poleX, 3.4, 0), new THREE.Vector3(bx, 3.4, 0), 0.06, 0x2b2f3a);

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.05, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, roughness: 0.2 }),
  );
  board.position.set(bx, 3.425, 0);
  board.castShadow = true;
  const square = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.59), new THREE.MeshBasicMaterial({ color: 0xff5a1f, wireframe: true }));
  square.position.set(bx - side * 0.001, 3.25, 0);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(RIM.radius, RIM.tube * 1.6, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.4 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.set(rimX(side), RIM.y, 0);
  rim.castShadow = true;

  const net = new THREE.Mesh(
    new THREE.CylinderGeometry(RIM.radius, 0.13, 0.45, 12, 3, true),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 }),
  );
  net.position.set(rimX(side), RIM.y - 0.225, 0);

  g.add(pole, arm, board, square, rim, net);
  return g;
}

export function buildBench(): THREE.Group {
  const g = new THREE.Group();
  const seat = box(5, 0.1, 0.55, 0x8b5a2b);
  seat.position.set(0, 0.5, 9.7);
  const back = box(5, 0.5, 0.08, 0x8b5a2b);
  back.position.set(0, 0.85, 9.95);
  for (const x of [-2.2, 2.2]) {
    const leg = box(0.1, 0.5, 0.5, 0x2b2f3a);
    leg.position.set(x, 0.25, 9.7);
    g.add(leg);
  }
  const bag = box(0.7, 0.35, 0.4, 0xff6a1a);
  bag.position.set(1.4, 0.72, 9.7);
  const towel = box(0.5, 0.06, 0.3, 0xf8fafc);
  towel.position.set(-1.2, 0.58, 9.7);
  g.add(seat, back, bag, towel);
  return g;
}

/** Puerta del túnel de vestuarios, en el lateral lejano de la pista. */
export function buildTunnel(): THREE.Group {
  const g = new THREE.Group();
  const frame = box(3.4, 3.0, 0.6, 0x1b2233);
  frame.position.set(-10, 1.5, -9.9);
  const opening = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.4), new THREE.MeshBasicMaterial({ color: 0x04060a }));
  opening.position.set(-10, 1.2, -9.59);
  const lightTex = canvasTexture(128, 32, (c) => {
    c.fillStyle = '#16a34a';
    c.fillRect(0, 0, 128, 32);
    c.fillStyle = '#ffffff';
    c.font = 'bold 22px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('EXIT', 64, 17);
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshBasicMaterial({ map: lightTex }));
  sign.position.set(-10, 2.75, -9.58);
  g.add(frame, opening, sign);
  return g;
}

/** Anillo luminoso en el suelo que marca una zona interactiva. */
export function buildZoneRing(x: number, z: number, radius: number): THREE.Mesh {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(radius - 0.08, radius, 48),
    new THREE.MeshBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.03, z);
  return ring;
}

/** Balón: esfera naranja con costuras dibujadas en la textura. */
export function createBallMesh(): THREE.Mesh {
  const tex = canvasTexture(256, 128, (g) => {
    g.fillStyle = '#e8651a';
    g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#1a1208';
    g.lineWidth = 4;
    for (const x of [0, 64, 128, 192]) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, 128);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(0, 64);
    g.lineTo(256, 64);
    g.stroke();
  });
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(BALL.radius * BALL.visualScale, 16, 12),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }),
  );
  m.castShadow = true;
  return m;
}

export { mat };
```

### 9.5 `src/game/builders/tv.ts` — plató de entrevista

Cámara de TV: cuerpo, objetivo con parasol, visor, cabezal, **trípode de 3 patas** (cada pata es un cilindro entre el cabezal y el suelo) y luz *tally* roja. Cartel ON AIR con textura emisiva. Reportero con micrófono (cilindro + esfera atados al pivote del brazo) y operador.

```ts
// src/game/builders/tv.ts
import * as THREE from 'three';
import { buildHuman, type HumanRig } from './human';
import { box, canvasTexture, cylBetween, mat } from './util';

export interface InterviewSet {
  group: THREE.Group;
  reporter: HumanRig;
  operator: HumanRig;
  tally: THREE.Mesh;
  onAir: THREE.Mesh;
}

/** Cámara de TV de estudio sobre trípode. Apunta hacia +Z local. */
export function buildTvCamera(): { group: THREE.Group; tally: THREE.Mesh } {
  const g = new THREE.Group();
  const body = box(0.46, 0.38, 0.8, 0x1f2937);
  body.position.set(0, 1.5, 0);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.4, 12), mat(0x0b0f19));
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 1.5, 0.6);
  lens.castShadow = true;
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.17, 0.14, 12, 1, true), mat(0x111827));
  hood.rotation.x = Math.PI / 2;
  hood.position.set(0, 1.5, 0.84);
  const viewfinder = box(0.2, 0.2, 0.3, 0x111827);
  viewfinder.position.set(0.3, 1.58, -0.05);
  const head = box(0.18, 0.18, 0.18, 0x374151);
  head.position.set(0, 1.28, 0);

  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    g.add(cylBetween(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(Math.sin(a) * 0.65, 0, Math.cos(a) * 0.65), 0.025, 0x374151));
  }

  const tally = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2d2d }));
  tally.position.set(0, 1.74, 0.3);
  g.add(body, lens, hood, viewfinder, head, tally);
  return { group: g, tally };
}

/** Plató de entrevista: reportero con micro, operador, cámara de TV, fondo y cartel ON AIR. */
export function buildInterviewSet(): InterviewSet {
  const group = new THREE.Group();

  const backdrop = box(5.4, 2.6, 0.12, 0x111827);
  backdrop.position.set(9.5, 1.3, 11.3);
  const stripe = box(5.4, 0.16, 0.14, 0xff6a1a);
  stripe.position.set(9.5, 2.1, 11.3);

  const airTex = canvasTexture(256, 96, (g) => {
    g.fillStyle = '#7f1d1d';
    g.fillRect(0, 0, 256, 96);
    g.fillStyle = '#ffffff';
    g.font = 'bold 56px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('ON AIR', 128, 52);
  });
  const onAir = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.4, 0.1),
    new THREE.MeshStandardMaterial({ map: airTex, emissive: 0xff2d2d, emissiveMap: airTex, emissiveIntensity: 0.2 }),
  );
  onAir.position.set(9.5, 2.95, 11.2);

  const reporter = buildHuman({ skin: 0xd9a066, hair: 0x1f1b16, jersey: 0x1e3a8a, shorts: 0x1e293b, shoes: 0x0f172a });
  reporter.root.position.set(9.0, 0, 9.7);
  reporter.root.rotation.y = Math.PI; // mira hacia -Z (la cancha)
  const mic = new THREE.Group();
  mic.add(box(0.03, 0.2, 0.03, 0x111111));
  const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), mat(0xf97316));
  micHead.position.y = 0.12;
  mic.add(micHead);
  mic.position.set(0, -0.6, 0.06);
  reporter.armR.add(mic);

  const cam = buildTvCamera();
  cam.group.position.set(11.0, 0, 8.7);
  cam.group.rotation.y = -Math.PI / 2; // apunta hacia -X (el punto de entrevista)

  const operator = buildHuman({ skin: 0xc68642, hair: 0x2b1d12, jersey: 0x111827, shorts: 0x374151, shoes: 0x111827 });
  operator.root.position.set(11.9, 0, 8.7);
  operator.root.rotation.y = -Math.PI / 2;

  group.add(backdrop, stripe, onAir, reporter.root, cam.group, operator.root);
  return { group, reporter, operator, tally: cam.tally, onAir };
}
```

**Verificación (Fases 3 + 4):** `npx tsc --noEmit` sin salida. **Hecho cuando** compila sin errores ni avisos.

---

## 10. Fase 5 — Entrada y audio

### 10.1 `src/game/input.ts`

Teclado (`event.code`, así funciona con cualquier distribución de teclado) + joystick virtual. Se ignora el teclado mientras se escribe en un campo del formulario y se desactiva por completo cuando hay un panel abierto.

```ts
// src/game/input.ts
const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1], ArrowUp: [0, -1],
  KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0],
  KeyD: [1, 0], ArrowRight: [1, 0],
};

/** Teclado + controles táctiles. Mundo: +X derecha, +Z hacia la cámara (abajo en pantalla). */
export class Input {
  private keys = new Set<string>();
  private interactFlag = false;
  private enabled = true;
  joy = { x: 0, y: 0 };
  shootHeld = false;

  constructor() {
    window.addEventListener('keydown', this.onDown);
    window.addEventListener('keyup', this.onUp);
    window.addEventListener('blur', this.reset);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onDown);
    window.removeEventListener('keyup', this.onUp);
    window.removeEventListener('blur', this.reset);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) this.reset();
  }

  /** Vector de movimiento con magnitud ≤ 1. */
  move(): { x: number; z: number } {
    if (!this.enabled) return { x: 0, z: 0 };
    let x = this.joy.x;
    let z = this.joy.y;
    for (const k of this.keys) {
      const v = MOVE_KEYS[k];
      if (v) {
        x += v[0];
        z += v[1];
      }
    }
    const len = Math.hypot(x, z);
    return len > 1 ? { x: x / len, z: z / len } : { x, z };
  }

  pressInteract(): void {
    if (this.enabled) this.interactFlag = true;
  }

  consumeInteract(): boolean {
    const v = this.interactFlag;
    this.interactFlag = false;
    return v;
  }

  private reset = (): void => {
    this.keys.clear();
    this.joy = { x: 0, y: 0 };
    this.shootHeld = false;
    this.interactFlag = false;
  };

  private isTyping(e: KeyboardEvent): boolean {
    const el = e.target as HTMLElement | null;
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  private onDown = (e: KeyboardEvent): void => {
    if (!this.enabled || this.isTyping(e)) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) this.shootHeld = true;
      return;
    }
    if (e.code === 'KeyE' && !e.repeat) this.interactFlag = true;
    if (e.code in MOVE_KEYS) {
      e.preventDefault();
      this.keys.add(e.code);
    }
  };

  private onUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') this.shootHeld = false;
    this.keys.delete(e.code);
  };
}
```

### 10.2 `src/game/audio.ts`

Sonidos **sintetizados**: rebote (seno descendente), *swish* (ruido filtrado), aro (triángulo), tablero (cuadrada), clic y ovación. El `AudioContext` se desbloquea con el clic del selector de idioma (un gesto de usuario real), así que el audio funciona desde el primer segundo.

```ts
// src/game/audio.ts
/** Efectos de sonido sintetizados con WebAudio: cero archivos, cero licencias. */
const MUTE_KEY = 'court.muted';

export class Sfx {
  private ctx: AudioContext | null = null;
  private noiseBuf: AudioBuffer | null = null;
  muted = false;

  constructor() {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      /* ignorar */
    }
  }

  /** Llamar tras un gesto del usuario (el clic en el selector de idioma sirve). */
  unlock(): void {
    this.ensure();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0');
    } catch {
      /* ignorar */
    }
    return this.muted;
  }

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, vol: number, centerHz: number): void {
    const ctx = this.ensure();
    if (!ctx) return;
    if (!this.noiseBuf) {
      this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = centerHz;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  bounce(impact: number): void {
    this.tone(120 + impact * 6, 0.12, 'sine', Math.min(0.5, impact * 0.06), 60);
  }
  swish(): void {
    this.noise(0.45, 0.28, 2600);
  }
  rim(): void {
    this.tone(520, 0.28, 'triangle', 0.25, 360);
  }
  board(): void {
    this.tone(190, 0.12, 'square', 0.1, 120);
  }
  release(): void {
    this.noise(0.12, 0.08, 1200);
  }
  click(): void {
    this.tone(880, 0.06, 'square', 0.05);
  }
  cheer(): void {
    this.noise(1.3, 0.16, 900);
  }
}
```

---

## 11. Fase 6 — Interfaz (HUD, paneles, formulario)

### 11.1 `src/ui/contactForm.ts`

Endpoint por variable de entorno. Orden de comprobaciones: honeypot → validación → límite de 1 envío/min → envío JSON con `fetch` → en error, mensaje con enlace `mailto:`. **Todo texto del usuario que se reinserta en HTML pasa por `esc()`.**

```ts
// src/ui/contactForm.ts
import { content } from '../data/content';
import { t } from '../i18n';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const RATE_KEY = 'court.lastSend';
const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export function renderContactForm(): string {
  return `
  <form data-contact novalidate>
    <label>${esc(t('form_name'))}<input name="name" autocomplete="name" required maxlength="80" /></label>
    <label>${esc(t('form_email'))}<input name="email" type="email" autocomplete="email" required maxlength="120" /></label>
    <label>${esc(t('form_message'))}<textarea name="message" rows="5" required minlength="10" maxlength="2000"></textarea></label>
    <input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button type="submit" class="btn">${esc(t('form_send'))}</button>
    <p class="form-status" data-status role="status" aria-live="polite"></p>
  </form>`;
}

export function bindContactForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form[data-contact]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // honeypot: un bot rellenó el campo oculto
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 10) {
      status.textContent = t('form_invalid');
      return;
    }
    try {
      const last = Number(localStorage.getItem(RATE_KEY) ?? 0);
      if (Date.now() - last < 60_000) {
        status.textContent = t('form_wait');
        return;
      }
    } catch {
      /* sin almacenamiento: se omite el límite local */
    }

    const mailto = `mailto:${content.person.email}?subject=${encodeURIComponent(`Portfolio · ${name}`)}&body=${encodeURIComponent(message)}`;
    if (!ENDPOINT) {
      window.location.href = mailto; // sin endpoint configurado: abrir el cliente de correo
      return;
    }

    button.disabled = true;
    status.textContent = t('form_sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      status.textContent = t('form_ok');
      form.reset();
      try {
        localStorage.setItem(RATE_KEY, String(Date.now()));
      } catch {
        /* ignorar */
      }
    } catch {
      status.innerHTML = `${esc(t('form_err'))} <a href="${esc(mailto)}">${esc(content.person.email)}</a>`;
    } finally {
      button.disabled = false;
    }
  });
}
```

### 11.2 `src/ui/panels.ts`

Cinco *renderers* (uno por sección) que leen de `content.ts`. Seguridad: `esc()` escapa HTML y `safeUrl()` solo admite `http(s):` y `mailto:`. Accesibilidad: `role="dialog"`, `aria-modal`, foco al abrir, **trampa de foco** con Tab, `Esc` cierra y se devuelve el foco al elemento que abrió el panel.

```ts
// src/ui/panels.ts
import { content, type SectionId } from '../data/content';
import { loc, t, type UIKey } from '../i18n';
import { bindContactForm, renderContactForm } from './contactForm';

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
const safeUrl = (u: string): string => (/^(https?:|mailto:)/i.test(u) ? u : '#');
export const sectionKey = (id: SectionId): UIKey => `section_${id}` as UIKey;

const link = (l: { label: { es: string; en: string }; url: string }): string =>
  `<a class="chip chip--link" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(loc(l.label))}</a>`;

const RENDER: Record<SectionId, () => string> = {
  projects: () =>
    `<div class="grid">${content.projects
      .map(
        (p) => `<article class="card">
          <header><h3>${esc(p.title)}</h3><span class="muted">${p.year}</span></header>
          <p>${esc(loc(p.summary))}</p>
          <p class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</p>
          <p class="chips">${p.links.map(link).join('')}</p>
        </article>`,
      )
      .join('')}</div>`,

  skills: () =>
    content.skills
      .map(
        (g) => `<section class="skillgroup"><h3>${esc(loc(g.name))}</h3>
        ${g.items
          .map(
            (i) => `<div class="stat"><span>${esc(i.name)}</span>
              <div class="bar" role="meter" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${i.level}" aria-label="${esc(t('skills_level'))}: ${i.level}/5"><i style="width:${i.level * 20}%"></i></div></div>`,
          )
          .join('')}</section>`,
      )
      .join(''),

  about: () => `
    <div class="playercard">
      <div class="jersey" aria-label="${esc(t('about_number'))}">${esc(content.person.jerseyNumber)}</div>
      <div><h3>${esc(content.person.name)}</h3><p class="muted">${esc(loc(content.person.role))} · ${esc(content.person.location)}</p></div>
    </div>
    ${content.about.paragraphs.map((p) => `<p>${esc(loc(p))}</p>`).join('')}
    <dl class="highlights">${content.about.highlights.map((h) => `<div><dt>${esc(loc(h.label))}</dt><dd>${esc(loc(h.value))}</dd></div>`).join('')}</dl>`,

  experience: () =>
    `<ol class="timeline">${content.timeline
      .map(
        (it) => `<li><span class="badge badge--${it.kind}">${esc(t(`kind_${it.kind}` as UIKey))}</span>
          <h3>${esc(loc(it.title))}</h3>
          <p class="muted">${esc(it.org)} · ${esc(it.start)} – ${it.end ? esc(it.end) : esc(t('present'))}</p>
          <p>${esc(loc(it.description))}</p></li>`,
      )
      .join('')}</ol>`,

  contact: () => `
    <p class="lead">${esc(t('interview_sub'))}</p>
    ${renderContactForm()}
    <h3>${esc(t('contact_direct'))}</h3>
    <p class="chips"><a class="chip chip--link" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a>${content.person.social.map(link).join('')}</p>`,
};

export class PanelManager {
  private el: HTMLElement;
  private current: SectionId | null = null;
  private opener: HTMLElement | null = null;

  constructor(parent: HTMLElement, private onClose: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'panel';
    this.el.hidden = true;
    parent.appendChild(this.el);
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el || (e.target as HTMLElement).closest('[data-close]')) this.close();
    });
    document.addEventListener('keydown', this.onKey);
  }

  get isOpen(): boolean {
    return this.current !== null;
  }

  open(id: SectionId): void {
    this.opener = document.activeElement as HTMLElement | null;
    this.current = id;
    const title = id === 'contact' ? t('interview_title') : t(sectionKey(id));
    this.el.innerHTML = `<div class="panel__card panel--${id}" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <header class="panel__head"><h2 id="panel-title">${esc(title)}</h2>
      <button type="button" class="panel__close" data-close aria-label="${esc(t('close'))}">✕</button></header>
      <div class="panel__body">${RENDER[id]()}</div></div>`;
    this.el.hidden = false;
    if (id === 'contact') bindContactForm(this.el);
    this.el.querySelector<HTMLElement>('[data-close]')?.focus();
  }

  close(): void {
    if (!this.current) return;
    this.current = null;
    this.el.hidden = true;
    this.el.innerHTML = '';
    this.opener?.focus?.();
    this.onClose();
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.current) return;
    if (e.key === 'Escape') {
      this.close();
      return;
    }
    if (e.key === 'Tab') {
      const f = [...this.el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea')].filter((n) => !n.classList.contains('hp'));
      if (!f.length) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
}
```

### 11.3 `src/ui/hud.ts`

Etiquetas flotantes sobre cada zona (proyección mundo→pantalla en cada frame, sin librerías), aviso contextual, medidor de tiro, *toasts* (también anunciados en una región `aria-live`), progreso X/5, menú ☰ con las 5 secciones y la versión clásica, botones de idioma y sonido, y controles táctiles.

```ts
// src/ui/hud.ts
import type { SectionId } from '../data/content';
import { SECTION_IDS, SWEET_SPOT } from '../game/config';
import type { Input } from '../game/input';
import { getLang, setLang, t, type UIKey } from '../i18n';
import { esc, sectionKey } from './panels';

export interface HudCallbacks {
  onMenuSelect(id: SectionId): void;
  onToggleMute(): boolean; // devuelve el nuevo estado muted
}

export class Hud {
  private labels = new Map<string, { el: HTMLElement; key: UIKey }>();
  private prompt!: HTMLElement;
  private meter!: HTMLElement;
  private needle!: HTMLElement;
  private toastEl!: HTMLElement;
  private live!: HTMLElement;
  private progress!: HTMLElement;
  private menu!: HTMLElement;
  private muteBtn!: HTMLButtonElement;
  private toastTimer = 0;
  private progressValue = 0;
  private muted: boolean;

  constructor(private root: HTMLElement, private cb: HudCallbacks, muted: boolean) {
    this.muted = muted;
    this.root.innerHTML = `
      <div class="hud">
        <div class="hud__top">
          <span class="chip" data-progress></span>
          <div class="hud__buttons">
            <button type="button" class="icon" data-mute></button>
            <button type="button" class="icon" data-lang></button>
            <button type="button" class="icon" data-menu-btn aria-haspopup="true" aria-expanded="false"></button>
          </div>
        </div>
        <nav class="menu" data-menu hidden></nav>
        <div class="hud__labels" data-labels></div>
        <div class="prompt" data-prompt hidden></div>
        <div class="meter" data-meter hidden aria-hidden="true"><i class="sweet" style="left:${((0.5 - SWEET_SPOT / 2) * 100).toFixed(1)}%;width:${(SWEET_SPOT * 100).toFixed(1)}%"></i><b class="needle" data-needle></b></div>
        <div class="toast" data-toast hidden></div>
        <div class="sr-only" data-live aria-live="polite"></div>
      </div>`;
    const q = <T extends HTMLElement>(s: string): T => this.root.querySelector<T>(s)!;
    this.prompt = q('[data-prompt]');
    this.meter = q('[data-meter]');
    this.needle = q('[data-needle]');
    this.toastEl = q('[data-toast]');
    this.live = q('[data-live]');
    this.progress = q('[data-progress]');
    this.menu = q('[data-menu]');
    this.muteBtn = q<HTMLButtonElement>('[data-mute]');

    q('[data-lang]').addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
    this.muteBtn.addEventListener('click', () => {
      this.muted = this.cb.onToggleMute();
      this.refreshText();
    });
    const menuBtn = q<HTMLButtonElement>('[data-menu-btn]');
    menuBtn.addEventListener('click', () => {
      const open = this.menu.hidden;
      this.menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    this.menu.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-section]');
      if (!b) return;
      this.menu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
      this.cb.onMenuSelect(b.dataset.section as SectionId);
    });
    window.addEventListener('langchange', () => this.refreshText());
    this.refreshText();
  }

  private refreshText(): void {
    const q = (s: string): HTMLElement => this.root.querySelector<HTMLElement>(s)!;
    q('[data-lang]').textContent = getLang() === 'es' ? 'EN' : 'ES';
    q('[data-lang]').setAttribute('aria-label', t('lang_toggle'));
    this.muteBtn.textContent = this.muted ? '🔇' : '🔊';
    this.muteBtn.setAttribute('aria-label', this.muted ? t('unmute') : t('mute'));
    const mb = q('[data-menu-btn]');
    mb.textContent = '☰';
    mb.setAttribute('aria-label', t('menu'));
    this.menu.innerHTML =
      `<p class="menu__title">${esc(t('menu_title'))}</p>` +
      SECTION_IDS.map((id) => `<button type="button" data-section="${id}">${esc(t(sectionKey(id)))}</button>`).join('') +
      `<a href="/classic/">${esc(t('classic'))}</a>`;
    this.progress.textContent = `${t('progress')} ${this.progressValue}/${SECTION_IDS.length}`;
    for (const { el, key } of this.labels.values()) el.textContent = t(key);
  }

  addLabel(id: string, key: UIKey): void {
    const el = document.createElement('div');
    el.className = 'label';
    el.textContent = t(key);
    this.root.querySelector('[data-labels]')!.appendChild(el);
    this.labels.set(id, { el, key });
  }

  placeLabel(id: string, x: number, y: number, visible: boolean): void {
    const l = this.labels.get(id);
    if (!l) return;
    l.el.style.display = visible ? '' : 'none';
    l.el.style.transform = `translate(-50%, -100%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }

  setProgress(n: number): void {
    this.progressValue = n;
    this.progress.textContent = `${t('progress')} ${n}/${SECTION_IDS.length}`;
  }

  setPrompt(text: string | null): void {
    this.prompt.hidden = text === null;
    if (text !== null && this.prompt.textContent !== text) this.prompt.textContent = text;
  }

  showMeter(value: number | null): void {
    this.meter.hidden = value === null;
    if (value !== null) this.needle.style.left = `${(value * 100).toFixed(1)}%`;
  }

  toast(text: string, ms = 2400): void {
    this.toastEl.textContent = text;
    this.toastEl.hidden = false;
    this.live.textContent = text;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toastEl.hidden = true), ms);
  }

  /** Joystick virtual + botones TIRO / ACCIÓN para pantallas táctiles. */
  mountTouch(input: Input): void {
    const wrap = document.createElement('div');
    wrap.className = 'touch';
    wrap.innerHTML = `
      <div class="joy" data-joy><div class="stick" data-stick></div></div>
      <div class="touch__btns">
        <button type="button" class="btn-round" data-act>E</button>
        <button type="button" class="btn-round btn-round--big" data-shoot>🏀</button>
      </div>`;
    this.root.appendChild(wrap);

    const joy = wrap.querySelector<HTMLElement>('[data-joy]')!;
    const stick = wrap.querySelector<HTMLElement>('[data-stick]')!;
    const R = 48;
    let pid: number | null = null;
    const set = (e: PointerEvent): void => {
      const r = joy.getBoundingClientRect();
      let dx = e.clientX - (r.left + r.width / 2);
      let dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      input.joy = { x: dx / R, y: dy / R };
    };
    const end = (): void => {
      pid = null;
      stick.style.transform = '';
      input.joy = { x: 0, y: 0 };
    };
    joy.addEventListener('pointerdown', (e) => {
      pid = e.pointerId;
      joy.setPointerCapture(pid);
      set(e);
    });
    joy.addEventListener('pointermove', (e) => pid === e.pointerId && set(e));
    joy.addEventListener('pointerup', end);
    joy.addEventListener('pointercancel', end);

    const shoot = wrap.querySelector<HTMLElement>('[data-shoot]')!;
    shoot.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.shootHeld = true;
    });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) shoot.addEventListener(ev, () => (input.shootHeld = false));
    wrap.querySelector<HTMLElement>('[data-act]')!.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.pressInteract();
    });
  }
}
```

---

## 12. Fase 7 — Orquestador, arranque y estilos

### 12.1 `index.html`

Contiene el **selector de idioma** y el cargador, pero **no** carga el juego. Incluye metadatos SEO/Open Graph y enlace a la versión clásica. Crear `public/og.png` (1200×630; una captura del juego sirve) y poner tu nombre real en `<title>` y metadatos.

```html
<!-- index.html -->
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Tu Nombre · Full Stack Developer — The Court</title>
    <meta name="description" content="Portfolio interactivo de Tu Nombre, desarrollador full stack. Juega un partido para descubrir mis proyectos. / Interactive portfolio: play a game to discover my work." />
    <meta name="theme-color" content="#0b1020" />
    <link rel="alternate" href="/classic/" title="Classic version" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tu Nombre · Full Stack Developer" />
    <meta property="og:description" content="Portfolio interactivo en forma de partido de baloncesto." />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body data-mode="gate">
    <a class="skip" href="/classic/">Versión clásica / Classic version</a>

    <div id="lang-gate" role="dialog" aria-modal="true" aria-labelledby="lang-title">
      <div class="gate-card">
        <h1 id="lang-title">THE COURT</h1>
        <p>Elige tu idioma · Choose your language</p>
        <div class="gate-buttons">
          <button type="button" data-lang="es">Español</button>
          <button type="button" data-lang="en">English</button>
        </div>
        <a class="gate-classic" href="/classic/">Versión clásica · Classic version</a>
      </div>
    </div>

    <div id="loader" hidden>
      <div class="loader-bar"><i id="loader-fill"></i></div>
      <p id="loader-text">…</p>
    </div>

    <canvas id="game" tabindex="0"></canvas>
    <div id="ui"></div>

    <noscript>
      <p style="position:fixed;inset:auto 0 1rem 0;text-align:center;color:#fff">
        <a style="color:#ff6a1a" href="/classic/">Versión clásica / Classic version</a>
      </p>
    </noscript>
    <script type="module" src="/src/boot.ts"></script>
  </body>
</html>
```

### 12.2 `src/boot.ts`

Punto de entrada. Importa las fuentes y los estilos, muestra el selector y **solo cuando se elige idioma** hace `import('./game/main')` (descarga diferida: el visitante que se va sin elegir no descarga el motor 3D). Si no hay WebGL2 o falla algo, redirige a `/classic/`.

```ts
// src/boot.ts
import '@fontsource/bebas-neue';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import './styles.css';
import { readSavedLang, setLang, t, type Lang } from './i18n';

/** true = preguntar el idioma en CADA visita, antes de cargar el juego. */
const ASK_EVERY_VISIT = true;

const gate = document.getElementById('lang-gate') as HTMLElement;
const loader = document.getElementById('loader') as HTMLElement;
const fill = document.getElementById('loader-fill') as HTMLElement;
const loaderText = document.getElementById('loader-text') as HTMLElement;
const canvas = document.getElementById('game') as HTMLCanvasElement;

function webgl2Available(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

async function start(lang: Lang): Promise<void> {
  setLang(lang);
  gate.hidden = true;
  if (!webgl2Available()) {
    location.replace('/classic/'); // sin WebGL2: versión clásica
    return;
  }
  loader.hidden = false;
  loaderText.textContent = t('loading');
  document.body.dataset.mode = 'loading';
  try {
    // El código 3D se descarga SOLO ahora, después de elegir idioma
    const { createGame } = await import('./game/main');
    const game = await createGame({
      canvas,
      onProgress: (p) => {
        fill.style.width = `${Math.round(p * 100)}%`;
      },
    });
    loader.hidden = true;
    game.start();
  } catch (err) {
    console.error(err);
    location.replace('/classic/');
  }
}

const saved = readSavedLang();
if (!ASK_EVERY_VISIT && saved) {
  void start(saved);
} else {
  document.body.dataset.mode = 'gate';
  const buttons = gate.querySelectorAll<HTMLButtonElement>('button[data-lang]');
  buttons.forEach((b) => {
    if (b.dataset.lang === saved) b.classList.add('is-last');
    b.addEventListener('click', () => void start(b.dataset.lang as Lang));
  });
  (gate.querySelector<HTMLButtonElement>('button[data-lang].is-last') ?? buttons[0])?.focus();
}
```

### 12.3 `src/game/main.ts` — el orquestador

Hace, en orden: renderer (límite de *pixel ratio* 2 en escritorio y 1.5 en móvil, sombras suaves, *tone mapping* ACES) → luces → mundo → jugador y balón → UI → bucle. Detalles de diseño que conviene conocer:

- **Cámara:** perspectiva (FOV 32°) con desplazamiento fijo (0, 14, 12) respecto al jugador; sigue con suavizado exponencial y se limita a x∈[−11, 11], z∈[−4, 5] para no salirse de la pista. En pantallas verticales (`aspect < 1.5`) se aleja hasta 2.4× para ver más pista.
- **Prioridad de zonas:** gana la zona utilizable más cercana. Las canastas solo son "pulsables" cuando ya están desbloqueadas.
- **Calidad adaptativa:** si pasan 90 fotogramas lentos (>41 ms) baja el *pixel ratio* en pasos de 0.25 hasta 1.
- **Pausa:** al ocultar la pestaña se cancela el bucle (cero consumo).
- **Reducción de movimiento:** con `prefers-reduced-motion` la cámara no hace transiciones suaves.
- **Desbloqueo:** al encestar por primera vez se desbloquea la sección, suena la ovación, aparece un aviso y a los 1.3 s se abre el panel.
- **MVP:** al visitar las 5 secciones aparece un mensaje final.

```ts
// src/game/main.ts
import * as THREE from 'three';
import { content, type SectionId } from '../data/content';
import { t } from '../i18n';
import { Hud } from '../ui/hud';
import { PanelManager, sectionKey } from '../ui/panels';
import { Sfx } from './audio';
import { Ball } from './ball';
import { buildCourt } from './builders/court';
import { animateHuman, buildHuman, poseShoot } from './builders/human';
import { buildBench, buildHoop, buildTunnel, buildZoneRing, createBallMesh } from './builders/props';
import { buildInterviewSet } from './builders/tv';
import {
  CAMERA, INTERVIEW, PLAYER, RIM, SECTION_IDS, SHOOT_RANGE, ZONES, rimX, type Side, type Zone,
} from './config';
import { Input } from './input';
import { applyShotError, evaluateMeter, meterAt, solveShot } from './shot';

type Mode = 'play' | 'panel' | 'interview';
export interface GameHandle { start(): void; dispose(): void }

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const lerpAngle = (a: number, b: number, k: number): number => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;
const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

function loadSet(key: string): Set<SectionId> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown;
    return new Set((Array.isArray(raw) ? raw : []).filter((x): x is SectionId => SECTION_IDS.includes(x as SectionId)));
  } catch {
    return new Set();
  }
}
function saveSet(key: string, s: Set<SectionId>): void {
  try {
    localStorage.setItem(key, JSON.stringify([...s]));
  } catch {
    /* ignorar */
  }
}

export async function createGame(opts: { canvas: HTMLCanvasElement; onProgress: (p: number) => void }): Promise<GameHandle> {
  const { canvas, onProgress } = opts;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  onProgress(0.05);
  await document.fonts.load('48px "Bebas Neue"').catch(() => undefined);

  // ───────── Renderer, escena, cámara, luces
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  let pixelRatio = Math.min(window.devicePixelRatio, coarse ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1020);
  scene.fog = new THREE.Fog(0x0b1020, 32, 75);
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 120);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-8, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 16, bottom: -16, near: 1, far: 50 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  onProgress(0.2);
  await nextFrame();

  // ───────── Mundo
  scene.add(buildCourt(content.person.initials, renderer.capabilities.getMaxAnisotropy()));
  scene.add(buildHoop(-1), buildHoop(1), buildBench(), buildTunnel());
  const set = buildInterviewSet();
  scene.add(set.group);

  const rings: THREE.Mesh[] = [];
  for (const z of ZONES) {
    if (z.kind === 'shoot') continue;
    const ring = buildZoneRing(z.x, z.z, z.radius);
    rings.push(ring);
    scene.add(ring);
  }
  onProgress(0.55);
  await nextFrame();

  // ───────── Jugador y balón
  const player = buildHuman({
    skin: 0xf1c27d, hair: 0x2b1d12, jersey: 0xff6a1a, shorts: 0x111827, shoes: 0xffffff, number: content.person.jerseyNumber,
  });
  scene.add(player.root);
  const pos = player.root.position;
  let rotY = 0;

  const sfx = new Sfx();
  const ballMesh = createBallMesh();
  scene.add(ballMesh);
  const ball = new Ball(ballMesh, {
    score: onScore,
    rim: () => sfx.rim(),
    board: () => sfx.board(),
    bounce: (v) => sfx.bounce(v),
  });

  // ───────── UI y estado
  const uiRoot = document.getElementById('ui')!;
  let mode: Mode = 'play';
  const visited = loadSet('court.visited');
  const unlocked = loadSet('court.unlocked');
  const input = new Input();
  const panels = new PanelManager(uiRoot, () => setMode('play'));
  const hud = new Hud(
    uiRoot,
    {
      onMenuSelect: (id) => openSection(id, false),
      onToggleMute: () => sfx.toggleMute(),
    },
    sfx.muted,
  );
  if (coarse) hud.mountTouch(input);
  canvas.setAttribute('aria-label', t('aria_game'));
  window.addEventListener('langchange', () => canvas.setAttribute('aria-label', t('aria_game')));
  hud.setProgress(visited.size);

  for (const z of ZONES) hud.addLabel(z.id, sectionKey(z.id));

  function setMode(m: Mode): void {
    mode = m;
    document.body.dataset.mode = m;
    input.setEnabled(m === 'play');
    if (m === 'play') canvas.focus({ preventScroll: true });
  }

  // ───────── Lógica de juego
  let charging = false;
  let chargeT = 0;
  let flick = 0;
  let missStreak = 0;
  let mvpShown = false;

  function nearestSide(): Side {
    return Math.abs(pos.x - rimX(-1)) <= Math.abs(pos.x - rimX(1)) ? -1 : 1;
  }
  const zoneFor = (side: Side): Zone => ZONES.find((z) => z.side === side)!;

  function markVisited(id: SectionId): void {
    visited.add(id);
    saveSet('court.visited', visited);
    hud.setProgress(visited.size);
  }

  function openSection(id: SectionId, fromZone: boolean): void {
    markVisited(id);
    sfx.click();
    setMode(id === 'contact' && fromZone ? 'interview' : 'panel');
    if (mode === 'interview') {
      pos.set(INTERVIEW.playerSpot[0], 0, INTERVIEW.playerSpot[1]);
      rotY = 0; // mira hacia +Z (el reportero)
      player.root.rotation.y = rotY;
    }
    panels.open(id);
    if (!mvpShown && visited.size === SECTION_IDS.length) {
      mvpShown = true;
      window.setTimeout(() => hud.toast(t('mvp'), 4500), 600);
    }
  }

  function onScore(side: Side): void {
    sfx.swish();
    missStreak = 0;
    const zone = zoneFor(side);
    if (unlocked.has(zone.id)) {
      hud.toast(t('shot_basket'));
      return;
    }
    unlocked.add(zone.id);
    saveSet('court.unlocked', unlocked);
    sfx.cheer();
    hud.toast(`${t('unlocked')}: ${t(sectionKey(zone.id))}`, 3000);
    window.setTimeout(() => mode === 'play' && openSection(zone.id, false), 1300);
  }

  function shoot(meter: number): void {
    const side = nearestSide();
    const rim = new THREE.Vector3(rimX(side), RIM.y, 0);
    const from = new THREE.Vector3(pos.x + Math.sin(rotY) * 0.2, 2.15, pos.z + Math.cos(rotY) * 0.2);
    const sol = solveShot(from, rim) ?? { vx: 0, vy: 6, vz: 0, t: 1, angleDeg: 90 };
    const { e, perfect } = evaluateMeter(meter);
    const assist = missStreak >= 3 ? 0.4 : 0.85; // tras 3 fallos el juego se vuelve más permisivo
    const v = applyShotError(sol, e, assist, Math.random);
    ball.launch(from, new THREE.Vector3(v.x, v.y, v.z));
    sfx.release();
    flick = 0.35;
    if (perfect) hud.toast(t('shot_perfect'), 1200);
  }

  const tmp = new THREE.Vector3();
  function placeHeldBall(time: number, speed01: number): void {
    const f = tmp.set(Math.sin(rotY), 0, Math.cos(rotY));
    const side = { x: Math.cos(rotY), z: -Math.sin(rotY) }; // +X local del jugador
    let x = pos.x;
    let y: number;
    let z = pos.z;
    if (charging) {
      y = 1.9 + Math.min(chargeT, 0.6) * 0.5;
      x += f.x * 0.2;
      z += f.z * 0.2;
    } else if (speed01 > 0.1) {
      y = 0.14 + Math.abs(Math.sin(time * 11)) * 0.9;
      x += f.x * 0.45 + side.x * 0.28;
      z += f.z * 0.45 + side.z * 0.28;
    } else {
      y = 1.2;
      x += f.x * 0.42;
      z += f.z * 0.42;
    }
    ball.pos.set(x, y, z);
    ball.object.position.copy(ball.pos);
  }

  // ───────── Cámara
  const camGoal = new THREE.Vector3();
  const lookGoal = new THREE.Vector3();
  const lookNow = new THREE.Vector3();
  let dist = 1;
  function updateCamera(dt: number, snap = false): void {
    if (mode === 'interview') {
      camGoal.set(...INTERVIEW.cameraPos);
      lookGoal.set(...INTERVIEW.cameraLook);
    } else {
      const tx = clamp(pos.x, -CAMERA.clampX, CAMERA.clampX);
      const tz = clamp(pos.z, CAMERA.minZ, CAMERA.maxZ);
      lookGoal.set(tx, 0.8, tz);
      camGoal.set(tx + CAMERA.offset[0] * dist, CAMERA.offset[1] * dist, tz + CAMERA.offset[2] * dist);
    }
    const k = snap || reduced ? 1 : 1 - Math.exp(-CAMERA.lerp * dt);
    camera.position.lerp(camGoal, k);
    lookNow.lerp(lookGoal, k);
    camera.lookAt(lookNow);
  }

  function resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    dist = clamp(1.5 / camera.aspect, 1, 2.4); // en vertical se aleja para ver más cancha
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  onProgress(0.85);

  // ───────── Bucle
  const proj = new THREE.Vector3();
  const clock = new THREE.Clock();
  let raf = 0;
  let slowFrames = 0;

  function update(dt: number, time: number): void {
    const playing = mode === 'play';
    let speed01 = 0;

    if (playing) {
      const wants = input.shootHeld && ball.state === 'held';
      if (wants && !charging) {
        charging = true;
        chargeT = 0;
      }
      if (charging) {
        chargeT += dt;
        const side = nearestSide();
        rotY = lerpAngle(rotY, Math.atan2(rimX(side) - pos.x, -pos.z), 1 - Math.exp(-14 * dt));
        hud.showMeter(meterAt(chargeT));
        if (!input.shootHeld) {
          shoot(meterAt(chargeT));
          charging = false;
          hud.showMeter(null);
        }
      } else {
        const mv = input.move();
        const len = Math.hypot(mv.x, mv.z);
        if (len > 0.05) {
          const k = Math.min(1, len);
          const dx = mv.x / len;
          const dz = mv.z / len;
          pos.x = clamp(pos.x + dx * PLAYER.speed * k * dt, PLAYER.bounds.minX, PLAYER.bounds.maxX);
          pos.z = clamp(pos.z + dz * PLAYER.speed * k * dt, PLAYER.bounds.minZ, PLAYER.bounds.maxZ);
          rotY = lerpAngle(rotY, Math.atan2(dx, dz), 1 - Math.exp(-14 * dt));
          speed01 = k;
        }
      }
    } else if (charging) {
      charging = false;
      hud.showMeter(null);
    }
    player.root.rotation.y = rotY;

    // Animación del jugador
    animateHuman(player, time, speed01, ball.state === 'held' && !charging);
    if (charging) poseShoot(player, Math.min(chargeT / 0.6, 1));
    if (flick > 0) {
      flick -= dt;
      poseShoot(player, 1);
    }

    // Balón
    if (ball.state === 'held') placeHeldBall(time, speed01);
    else {
      ball.step(dt);
      if (ball.settled) {
        if (!ball.scored) missStreak++;
        ball.state = 'held';
      }
    }

    // Zonas, avisos e interacción
    let active: Zone | null = null;
    let best = Infinity;
    for (const z of ZONES) {
      const d = Math.hypot(pos.x - z.x, pos.z - z.z);
      const usable = z.kind !== 'shoot' || unlocked.has(z.id);
      if (playing && usable && d <= z.radius && d < best) {
        best = d;
        active = z;
      }
    }
    if (playing && active) {
      hud.setPrompt(`${coarse ? t('hint_interact_touch') : t('hint_interact')} · ${t(sectionKey(active.id))}`);
      if (input.consumeInteract()) openSection(active.id, true);
    } else {
      input.consumeInteract();
      const side = nearestSide();
      const near = Math.abs(pos.x - rimX(side)) <= SHOOT_RANGE && !unlocked.has(zoneFor(side).id);
      hud.setPrompt(playing && near && ball.state === 'held' && !charging ? (coarse ? t('hint_shoot_touch') : t('hint_shoot')) : null);
    }

    // Decorado vivo
    for (const r of rings) r.scale.setScalar(1 + Math.sin(time * 3) * 0.04);
    animateHuman(set.reporter, time, 0, false);
    animateHuman(set.operator, time, 0, false);
    set.reporter.armR.rotation.x = mode === 'interview' ? -1.45 : -1.15;
    set.tally.visible = mode === 'interview' || Math.floor(time * 1.5) % 2 === 0;
    (set.onAir.material as THREE.MeshStandardMaterial).emissiveIntensity = mode === 'interview' ? 1.6 : 0.2;

    updateCamera(dt);

    // Etiquetas flotantes (proyección mundo → pantalla)
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const z of ZONES) {
      proj.set(z.x, z.kind === 'shoot' ? 4.6 : 2.5, z.z).project(camera);
      hud.placeLabel(z.id, (proj.x * 0.5 + 0.5) * w, (-proj.y * 0.5 + 0.5) * h, proj.z < 1 && mode !== 'interview');
    }
  }

  function frame(): void {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 1 / 20);
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);

    // Calidad adaptativa: si va lento, baja la resolución de render
    slowFrames = dt > 1 / 24 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 90 && pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      slowFrames = 0;
      resize();
    }
  }

  const onVisibility = (): void => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  onProgress(1);
  return {
    start() {
      sfx.unlock();
      setMode('play');
      updateCamera(0, true);
      hud.toast(coarse ? t('welcome_touch') : t('welcome'), 6000);
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      input.dispose();
      renderer.dispose();
    },
  };
}
```

### 12.4 `src/styles.css`

```css
// src/styles.css
:root {
  --bg: #0b1020;
  --panel: rgba(15, 21, 40, 0.92);
  --line: rgba(255, 255, 255, 0.12);
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #ff6a1a;
  --ok: #22c55e;
  --font: 'Inter', system-ui, sans-serif;
  --display: 'Bebas Neue', Impact, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); overflow: hidden; }
#game { position: fixed; inset: 0; width: 100vw; height: 100dvh; display: block; outline: none; touch-action: none; }
[hidden] { display: none !important; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.skip { position: fixed; left: 8px; top: -60px; z-index: 100; background: #fff; color: #000; padding: 8px 12px; border-radius: 6px; }
.skip:focus { top: 8px; }
a { color: var(--accent); }
button { font: inherit; cursor: pointer; }
:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }

/* Selector de idioma */
#lang-gate { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; background: radial-gradient(ellipse at 50% 30%, #1b2a55 0%, var(--bg) 70%); }
.gate-card { text-align: center; padding: 2rem; max-width: 92vw; }
.gate-card h1 { font-family: var(--display); font-size: clamp(3.5rem, 14vw, 7rem); letter-spacing: 0.06em; margin: 0; line-height: 1; }
.gate-card p { color: var(--muted); margin: 0.5rem 0 1.5rem; }
.gate-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.gate-buttons button { background: var(--accent); color: #fff; border: 0; border-radius: 999px; padding: 0.9rem 2.2rem; font-size: 1.15rem; font-weight: 700; min-width: 9rem; transition: transform 0.12s; }
.gate-buttons button:hover { transform: translateY(-2px) scale(1.03); }
.gate-buttons button.is-last { box-shadow: 0 0 0 3px #fff; }
.gate-classic { display: inline-block; margin-top: 1.5rem; color: var(--muted); font-size: 0.9rem; }

/* Cargando */
#loader { position: fixed; inset: 0; z-index: 40; display: grid; place-content: center; justify-items: center; gap: 1rem; background: var(--bg); }
.loader-bar { width: min(320px, 70vw); height: 10px; border-radius: 99px; background: var(--line); overflow: hidden; }
.loader-bar i { display: block; height: 100%; width: 0; background: var(--accent); transition: width 0.2s; }

/* HUD */
.hud { position: fixed; inset: 0; pointer-events: none; z-index: 10; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
.hud > * { pointer-events: auto; }
.hud__top { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; }
.hud__top > * { pointer-events: auto; }
.hud__buttons { display: flex; gap: 8px; }
.chip { display: inline-block; background: var(--panel); border: 1px solid var(--line); border-radius: 999px; padding: 0.35rem 0.8rem; font-size: 0.85rem; }
.chip--link { text-decoration: none; }
.chip--link:hover { background: var(--accent); color: #fff; }
.icon { min-width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); color: var(--text); font-weight: 700; }
.menu { position: absolute; top: 64px; right: 12px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 0.5rem; display: grid; gap: 4px; min-width: 200px; }
.menu__title { margin: 0.3rem 0.6rem; color: var(--muted); font-size: 0.8rem; }
.menu button, .menu a { text-align: left; background: transparent; color: var(--text); border: 0; padding: 0.7rem 0.8rem; border-radius: 8px; text-decoration: none; }
.menu button:hover, .menu a:hover { background: var(--line); }
.hud__labels { position: absolute; inset: 0; pointer-events: none; }
.label { position: absolute; left: 0; top: 0; font-family: var(--display); font-size: 1.35rem; letter-spacing: 0.05em; background: var(--accent); color: #fff; padding: 0.1rem 0.7rem; border-radius: 6px; white-space: nowrap; }
.prompt { position: absolute; left: 50%; bottom: 26%; transform: translateX(-50%); background: var(--panel); border: 1px solid var(--accent); border-radius: 999px; padding: 0.55rem 1.2rem; font-weight: 700; pointer-events: none; text-align: center; max-width: 92vw; }
.meter { position: absolute; left: 50%; bottom: 14%; transform: translateX(-50%); width: min(320px, 70vw); height: 18px; border-radius: 99px; background: rgba(255,255,255,.15); border: 2px solid #fff; pointer-events: none; }
.meter .sweet { position: absolute; top: 0; bottom: 0; background: var(--ok); border-radius: 99px; opacity: .85; } /* left/width los fija hud.ts desde SWEET_SPOT */
.meter .needle { position: absolute; top: -6px; width: 6px; height: 26px; margin-left: -3px; background: #fff; border-radius: 3px; }
.toast { position: absolute; left: 50%; top: 14%; transform: translateX(-50%); background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 0.7rem 1.2rem; text-align: center; max-width: min(92vw, 640px); pointer-events: none; }

/* Táctil */
.touch { position: absolute; left: 0; right: 0; bottom: 0; height: 190px; pointer-events: none; }
.touch > * { pointer-events: auto; }
.joy { position: absolute; left: 24px; bottom: 24px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,.12); border: 2px solid var(--line); touch-action: none; }
.stick { position: absolute; left: 36px; top: 36px; width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,.55); }
.touch__btns { position: absolute; right: 20px; bottom: 28px; display: flex; gap: 14px; align-items: flex-end; }
.btn-round { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #fff; background: rgba(255,106,26,.85); color: #fff; font-size: 1.3rem; font-weight: 700; touch-action: none; user-select: none; }
.btn-round--big { width: 88px; height: 88px; font-size: 2rem; }

/* Paneles */
.panel { position: fixed; inset: 0; z-index: 30; display: grid; place-items: center; background: rgba(5, 8, 18, 0.62); padding: 12px; }
.panel__card { width: min(920px, 100%); max-height: 88dvh; display: flex; flex-direction: column; background: var(--panel); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.panel__head { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--line); }
.panel__head h2 { margin: 0; font-family: var(--display); font-size: 2rem; letter-spacing: .05em; }
.panel__close { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--line); background: transparent; color: var(--text); }
.panel__body { padding: 1.25rem; overflow: auto; }
.panel__body h3 { margin: 0 0 .4rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.card { border: 1px solid var(--line); border-radius: 14px; padding: 1rem; background: rgba(255,255,255,.03); }
.card header { display: flex; justify-content: space-between; gap: .5rem; }
.chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.muted { color: var(--muted); }
.lead { font-size: 1.1rem; }
.stat { display: grid; grid-template-columns: 9rem 1fr; gap: .8rem; align-items: center; margin: .45rem 0; }
.bar { height: 12px; background: var(--line); border-radius: 99px; overflow: hidden; }
.bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), #ffb347); }
.skillgroup { margin-bottom: 1.4rem; }
.playercard { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.jersey { font-family: var(--display); font-size: 3.4rem; width: 5rem; height: 5rem; display: grid; place-items: center; background: var(--accent); border-radius: 14px; }
.highlights { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: .8rem; }
.highlights dt { color: var(--muted); font-size: .8rem; } .highlights dd { margin: 0; font-weight: 700; }
.timeline { list-style: none; margin: 0; padding: 0 0 0 1rem; border-left: 2px solid var(--accent); display: grid; gap: 1.2rem; }
.badge { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; padding: .15rem .55rem; border-radius: 99px; background: var(--line); }
.badge--work { background: #1d4ed8; } .badge--education { background: #7e22ce; } .badge--sport { background: var(--accent); }
form[data-contact] { display: grid; gap: .8rem; margin-bottom: 1.2rem; }
form[data-contact] label { display: grid; gap: .3rem; font-size: .9rem; color: var(--muted); }
input, textarea { font: inherit; color: var(--text); background: rgba(255,255,255,.06); border: 1px solid var(--line); border-radius: 10px; padding: .7rem .8rem; }
.hp { position: absolute; left: -9999px; }
.btn { background: var(--accent); color: #fff; border: 0; border-radius: 10px; padding: .8rem 1.2rem; font-weight: 700; }
.btn:disabled { opacity: .6; }

/* Modo entrevista: la tarjeta pasa a "tercio inferior" de TV y deja ver la escena */
body[data-mode='interview'] .panel { background: transparent; place-items: end start; pointer-events: none; }
body[data-mode='interview'] .panel__card { pointer-events: auto; width: min(460px, 100%); max-height: 70dvh; }
@media (max-width: 700px) {
  body[data-mode='interview'] .panel { place-items: end center; }
  .stat { grid-template-columns: 6.5rem 1fr; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

**Verificación:** `npm run dev` y abrir la URL. Pasar la lista visual de la sección 13.

---

## 13. Calibración visual (lo único que no pude comprobar)

Lista de comprobación en `npm run dev`. Cada fila indica qué constante tocar si algo no se ve como se espera:

| Comprobación | Esperado | Si no, ajustar |
|---|---|---|
| Al abrir: selector ES/EN a pantalla completa; el juego **no** se descarga hasta elegir (pestaña Network: `main-*.js` aparece tras el clic) | ✔ | `boot.ts` |
| Tras elegir: barra de carga breve y la pista con 2 canastas, gradas, banquillo, túnel y plató | ✔ | — |
| Se ven **ambas canastas** al estar en el centro y al desplazarte a los extremos | ✔ | `CAMERA.clampX`, `CAMERA.offset` |
| El jugador se ve nítido (≈1/6 de la altura de pantalla) | ✔ | `CAMERA.offset` (más pequeño = más cerca), `CAMERA.fov` |
| El balón se ve bien en vuelo | ✔ | `BALL.visualScale` (1.5 por defecto) |
| Las líneas de la pista están **del lado correcto** (zona pintada pegada a cada canasta, triples curvados hacia el centro) | ✔ | `drawCourt` en `court.ts` |
| El dorsal se lee al verlo **de espaldas** y las caras miran al sentido del movimiento | ✔ | `human.ts` (`plane.rotation.y`), `rotY` en `main.ts` |
| Desde ~8 m con el medidor en verde → canasta. Fuera del verde → casi siempre falla | ✔ | `SWEET_SPOT`, `METER_HZ` |
| La zona verde dibujada coincide con la que cuenta (se genera desde `SWEET_SPOT`, no hay que tocar CSS) | ✔ | `SWEET_SPOT` en `config.ts` |
| Cada anillo naranja coincide con su etiqueta flotante y con `E` | ✔ | `ZONES` |
| Entrevista: cámara lateral con el jugador, el reportero y la cámara de TV visibles; ON AIR encendido; el panel no tapa la escena | ✔ | `INTERVIEW.*` en `config.ts`, `body[data-mode='interview']` en CSS |
| Móvil (Chrome DevTools → modo dispositivo, y un móvil real): joystick, TIRO, ACCIÓN; sin zoom accidental | ✔ | `.touch`, `touch-action` |
| `npm run build` → `dist/` y `dist/classic/index.html` existen | ✔ | — |

> **Medidor:** la zona verde se dibuja en `hud.ts` a partir de `SWEET_SPOT`, así que lo que ves es exactamente lo que cuenta: `m ∈ [0.5 − SWEET_SPOT/2, 0.5 + SWEET_SPOT/2]` = **[0.35, 0.65]** con 0.3. Si cambias `SWEET_SPOT`, vuelve a ejecutar `npm test`.

### 13.1 Botones de ajuste rápido

| Quiero… | Cambiar |
|---|---|
| Juego más fácil / difícil | `SWEET_SPOT`, `METER_HZ`, `SCORE_RADIUS`, el `assist` en `shoot()` |
| Jugador más rápido | `PLAYER.speed` |
| Más / menos pista visible | `CAMERA.offset`, `CAMERA.fov`, `dist` en `resize()` |
| Otros colores | `buildHuman({...})` en `main.ts`, color del anillo en `buildZoneRing`, `--accent` en CSS |
| Otra marca en el centro | `person.initials` en `content.ts` |

---

## 14. Assets externos (opcionales)

**Por qué son opcionales:** el juego funciona completo sin ninguno. Úsalos solo si quieres un look más detallado o animaciones capturadas. Antes de usar cualquiera: **abrir la página y leer la licencia del paquete concreto**. Si requiere atribución, añadir una sección "Créditos" a la versión clásica.

| Recurso | Qué ofrece | Enlace | Notas |
|---|---|---|---|
| Quaternius | Packs low-poly con licencia CC0: personajes animados, props, mundos | <https://quaternius.com> | Los packs suelen traer FBX/OBJ/Blend y a veces glTF; verifícalo en la descarga. Si no hay glTF, convertir con Blender |
| Quaternius — Ultimate Platformer Pack ✅ | 100+ modelos, personaje animado con 18 animaciones, glTF incluido, CC0 | <https://quaternius.itch.io/ultimate-platformer-pack> | Estilo de plataformas, no baloncesto; sirve para un personaje con animaciones |
| Kenney | Miles de assets CC0 en estilo coherente | <https://kenney.nl/assets> | El "Sports pack" ✅ (<https://opengameart.org/node/73317>) es **2D cenital**: **no sirve** para este proyecto 3D |
| KayKit | Personajes y escenarios low-poly estilizados, CC0 (el pack de aventureros y el de animaciones) | <https://kaylousberg.itch.io/> | Buen candidato a personaje alternativo con animaciones |
| Poly Pizza | Buscador de modelos low-poly (balón, canasta, gradas) | <https://poly.pizza> | Buscar "basketball hoop". **No pude confirmar un modelo CC0 concreto de canasta**, por eso el plan genera la canasta por código. Revisar licencia modelo a modelo |
| Sketchfab (descargables) | Modelos de la comunidad con filtro por licencia | <https://sketchfab.com/features/free-3d-models> | Filtrar por CC0/CC-BY y "Downloadable". CC-BY exige atribución |
| Polyclem — Free Studio Starter Pack ✅ | 10 props de plató en low-poly, gratis (pago voluntario, 9.5 MB) | <https://polyclem.itch.io/freestudiostarterpack> | Útil para decorar el plató de TV. Comprobar formatos y licencia en el interior |
| Polyclem — Studio Camera Gear Pack ✅ | 16 modelos: cámaras de TV, trípodes, pértiga… | <https://polyclem.itch.io/studiocameragearpack> | **De pago (9.99 USD).** Formatos .blend/.fbx/.obj → convertir a .glb. Opcional: la cámara del plan ya es procedural |
| PolyPlix — Basketball Courts Pack ✅ | 10 pistas low-poly con texturas 4K | <https://polyplix.itch.io/basketball-courts-pack> | **De pago (8 USD) y muy pesado (~319 MB).** No recomendado para web; la pista procedural pesa 0 |
| Mixamo | Animaciones (correr, driblar, tirar) para personajes humanoides | <https://www.mixamo.com> | Requiere cuenta Adobe gratuita; descarga FBX |
| Blender | Convertir FBX → glTF (.glb), retocar | <https://www.blender.org> | File → Import → FBX; File → Export → glTF 2.0 (.glb) |
| glTF Transform | Comprimir/optimizar .glb | <https://gltf-transform.dev> | Ver 14.2 |
| Freesound | Efectos de sonido reales (si dejas el sintetizado) | <https://freesound.org> | Licencia por archivo (CC0 / CC-BY) |

### 14.1 Presupuesto de peso

| Elemento | Medido / límite |
|---|---|
| `boot` (HTML+CSS+arranque), ya cargado antes de elegir idioma | ≈ 6 KB JS + 13.5 KB CSS (3.3 KB gzip) |
| Juego 3D (descarga diferida) | **506 KB (132 KB gzip)** medido en `vite build` |
| Fuentes (latin) | ≈ 14 KB (Bebas) + ≈ 24 KB por peso de Inter |
| Presupuesto si añades modelos | **≤ 5 MB** en total, **≤ 3 s** de carga en 4G |

### 14.2 Pipeline para introducir un modelo .glb

1. Descargar el modelo; si es FBX, abrirlo en Blender y exportar a `.glb`.
2. Optimizar: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt` (comprueba `--help` por si cambian las opciones en tu versión). Los modelos con compresión meshopt/Draco necesitan configurar el decodificador en `GLTFLoader` (`setMeshoptDecoder` / `DRACOLoader`); si no quieres complicarte, optimiza sin `--compress` o solo comprime texturas.
3. Guardar en `public/models/nombre.glb`.
4. Cargar con `loadModel()` (`src/game/assets.ts`) o con `buildCharacterFromGLB()` (`src/game/characterGlb.ts`). **Siempre con fallback**: si devuelve `null`, se conserva el modelo procedural; el juego nunca se rompe por un 404.
5. **Alcance de la sustitución:** reportero y operador pueden cambiarse por un GLB con animación *idle* sin tocar más código. Para el **jugador** también hace falta una animación de tiro (o dejar de usar `poseShoot`) y reubicar el anclaje del balón: es trabajo extra, planificado en el backlog.

### 14.3 `src/game/assets.ts` y `src/game/characterGlb.ts`

```ts
// src/game/assets.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Gestor de progreso de carga compartido (solo se usa si añades modelos .glb). */
export function createLoadingManager(onProgress: (p: number) => void): THREE.LoadingManager {
  const m = new THREE.LoadingManager();
  m.onProgress = (_url, loaded, total) => onProgress(total ? loaded / total : 1);
  return m;
}

export interface LoadedModel { scene: THREE.Group; animations: THREE.AnimationClip[] }

/**
 * Carga un .glb. Si falla (404, red…) devuelve null para que el llamador
 * conserve la versión procedural. Nunca rompe el arranque del juego.
 */
export async function loadModel(url: string, manager?: THREE.LoadingManager): Promise<LoadedModel | null> {
  try {
    const gltf = await new GLTFLoader(manager).loadAsync(url);
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return { scene: gltf.scene, animations: gltf.animations };
  } catch (err) {
    console.warn(`[assets] no se pudo cargar ${url}; se usa el modelo procedural`, err);
    return null;
  }
}
```

```ts
// src/game/characterGlb.ts
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { loadModel } from './assets';

export interface GlbCharacter {
  root: THREE.Group;
  /** speed01 ∈ [0, 1]: mezcla entre la animación idle y la de correr. */
  update(dt: number, speed01: number): void;
}

/**
 * Personaje desde un .glb con animaciones (p. ej. Quaternius o Mixamo).
 * Devuelve null si el archivo falla o no contiene los clips pedidos:
 * el llamador conserva entonces el personaje procedural.
 */
export async function buildCharacterFromGLB(
  url: string,
  opts: { idle: string; run: string; scale?: number },
  manager?: THREE.LoadingManager,
): Promise<GlbCharacter | null> {
  const model = await loadModel(url, manager);
  if (!model) return null;
  const idle = THREE.AnimationClip.findByName(model.animations, opts.idle);
  const run = THREE.AnimationClip.findByName(model.animations, opts.run);
  if (!idle || !run) {
    console.warn(`[assets] ${url}: clips disponibles = ${model.animations.map((a) => a.name).join(', ')}`);
    return null;
  }
  const root = new THREE.Group();
  const obj = cloneSkinned(model.scene) as THREE.Group; // clone() normal rompe los esqueletos
  obj.scale.setScalar(opts.scale ?? 1);
  root.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  const idleAction = mixer.clipAction(idle).play();
  const runAction = mixer.clipAction(run).play();
  return {
    root,
    update(dt, speed01) {
      idleAction.setEffectiveWeight(1 - speed01);
      runAction.setEffectiveWeight(speed01);
      mixer.update(dt);
    },
  };
}
```

---

## 15. Fase 8 — Versión clásica (SEO y accesibilidad)

`scripts/build-classic.ts` genera `public/classic/index.html` **desde `content.ts`**, así que nunca queda desactualizada. Cada texto se emite en ambos idiomas y un pequeño CSS oculta el que no toca (`html[data-l=…]`); un botón EN/ES cambia el idioma y recuerda la elección. Es HTML indexable por buscadores. Se regenera automáticamente en `npm run build` (script `prebuild`).

```ts
// scripts/build-classic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { content } from '../src/data/content';
import type { L10n } from '../src/i18n';

const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
const safe = (u: string): string => (/^(https?:|mailto:)/i.test(u) ? u : '#');
/** Cada texto se emite en ambos idiomas; el CSS oculta el que no toca. */
const b = (v: L10n): string => `<span lang="es">${esc(v.es)}</span><span lang="en">${esc(v.en)}</span>`;
const L = (es: string, en: string): L10n => ({ es, en });

const html = `<!doctype html>
<html lang="es" data-l="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(content.person.name)} · ${esc(content.person.role.es)} / ${esc(content.person.role.en)}</title>
<meta name="description" content="${esc(content.person.tagline.es)} ${esc(content.person.tagline.en)}">
<link rel="canonical" href="/classic/">
<style>
:root{color-scheme:dark;--a:#ff6a1a}
html[data-l=es] [lang=en],html[data-l=en] [lang=es]{display:none}
body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#0b1020;color:#f1f5f9}
main{max-width:860px;margin:0 auto;padding:2rem 1rem 4rem}
h1{font-size:2.6rem;margin:.2rem 0}h2{border-bottom:2px solid var(--a);padding-bottom:.3rem;margin-top:2.5rem}
a{color:var(--a)}.muted{color:#94a3b8}.tag{display:inline-block;background:#1e293b;border-radius:99px;padding:.1rem .6rem;margin:0 .3rem .3rem 0;font-size:.85rem}
article{border:1px solid #243049;border-radius:12px;padding:1rem;margin:1rem 0}
nav{display:flex;gap:1rem;flex-wrap:wrap;justify-content:space-between}
button{background:var(--a);color:#fff;border:0;border-radius:8px;padding:.4rem .9rem;font-weight:700;cursor:pointer}
</style>
</head>
<body>
<main>
<nav><a href="/">${b(L('🏀 Jugar la versión interactiva', '🏀 Play the interactive version'))}</a><button id="lang" type="button">EN / ES</button></nav>
<header><h1>${esc(content.person.name)}</h1><p>${b(content.person.role)} · ${esc(content.person.location)}</p><p class="muted">${b(content.person.tagline)}</p></header>

<section id="about"><h2>${b(L('Sobre mí', 'About me'))}</h2>${content.about.paragraphs.map((p) => `<p>${b(p)}</p>`).join('')}</section>

<section id="projects"><h2>${b(L('Proyectos', 'Projects'))}</h2>${content.projects
  .map(
    (p) => `<article><h3>${esc(p.title)} <span class="muted">${p.year}</span></h3><p>${b(p.summary)}</p><p>${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</p><p>${p.links.map((l) => `<a href="${esc(safe(l.url))}" rel="noopener noreferrer">${b(l.label)}</a>`).join(' · ')}</p></article>`,
  )
  .join('')}</section>

<section id="skills"><h2>Skills</h2>${content.skills
  .map((g) => `<h3>${b(g.name)}</h3><p>${g.items.map((i) => `<span class="tag">${esc(i.name)} ${i.level}/5</span>`).join('')}</p>`)
  .join('')}</section>

<section id="experience"><h2>${b(L('Experiencia y estudios', 'Experience and education'))}</h2>${content.timeline
  .map((x) => `<article><h3>${b(x.title)}</h3><p class="muted">${esc(x.org)} · ${esc(x.start)} – ${x.end ? esc(x.end) : b(L('Actualidad', 'Present'))}</p><p>${b(x.description)}</p></article>`)
  .join('')}</section>

<section id="contact"><h2>${b(L('Contacto', 'Contact'))}</h2><p><a href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a></p><p>${content.person.social
  .map((l) => `<a href="${esc(safe(l.url))}" rel="noopener noreferrer">${b(l.label)}</a>`)
  .join(' · ')}</p></section>
</main>
<script>
(function(){var r=document.documentElement,s;try{s=localStorage.getItem('court.lang')}catch(e){}
var l=s||((navigator.language||'es').slice(0,2)==='en'?'en':'es');r.dataset.l=l;r.lang=l;
document.getElementById('lang').onclick=function(){l=l==='es'?'en':'es';r.dataset.l=l;r.lang=l;try{localStorage.setItem('court.lang',l)}catch(e){}}})();
</script>
</body>
</html>
`;

mkdirSync('public/classic', { recursive: true });
writeFileSync('public/classic/index.html', html);
console.log('✓ public/classic/index.html generado desde content.ts');
```

**Verificación:** `npm run classic` → `✓ public/classic/index.html generado`. Abrir `/classic/` y comprobar que el contenido está completo en ES y EN.

---

## 16. Despliegue (Cloudflare Pages, gratis)

1. Subir el repo a GitHub.
2. En <https://pages.cloudflare.com> → *Create a project* → conectar el repo.
3. Configuración de build: **Build command** `npm run build` · **Output directory** `dist` · **Node version** 20 (variable `NODE_VERSION=20`).
4. Variables de entorno: `VITE_FORM_ENDPOINT` = URL de tu formulario de Formspree (<https://formspree.io>: crear formulario → copiar el endpoint `https://formspree.io/f/XXXXXXXX`). Alternativa equivalente: <https://web3forms.com> (cambiar el cuerpo del `fetch` según su documentación).
5. Dominio propio: *Custom domains* en el panel de Pages. Redirige el dominio antiguo al nuevo (301) si cambias de hosting.
6. Antes del primer despliegue: `public/og.png`, nombre real en `index.html`, `content.ts` sin marcadores (el `prebuild --strict` lo exige).

Alternativas válidas: Netlify (<https://www.netlify.com>) o GitHub Pages (en este caso configurar `base` en `vite.config.ts` y revisar las rutas absolutas `/classic/`).

---

## 17. Calidad y criterios de aceptación

### 17.1 Rendimiento
- 60 fps en un portátil medio; ≥ 30 fps en un móvil de gama media.
- Lighthouse en escritorio: Performance **> 80**, Accessibility **> 90**, SEO **> 90** (<https://developer.chrome.com/docs/lighthouse>). Nota: Lighthouse puntúa la página de selección de idioma (el juego se carga tras interacción); la versión clásica `/classic/` debe superar 90 en todo.
- `npm run build` sin avisos de TypeScript.

### 17.2 Accesibilidad
- Todo el contenido existe como HTML real en la versión clásica y en los paneles (no está "dibujado" en el canvas).
- Menú ☰ para ir a cualquier sección sin jugar; `Esc` cierra paneles; foco gestionado y atrapado en el diálogo.
- Anuncios por `aria-live`. `prefers-reduced-motion` respetado. Botón de silencio persistente.
- Objetivos táctiles ≥ 44 px. Contraste de texto sobre fondos oscuros ≥ 4.5:1.

### 17.3 Matriz de pruebas manuales

| Caso | Pasa si… |
|---|---|
| Elegir ES / EN | Toda la interfaz y el contenido salen en ese idioma; el botón EN/ES cambia en caliente |
| Encestar a la izquierda por primera vez | Aviso "Sección desbloqueada", ovación, se abre Proyectos |
| Encestar de nuevo | Solo aviso "¡Canasta!" (no reabre el panel) |
| `E` junto al aro desbloqueado | Reabre el panel |
| Ir a banquillo / túnel / plató y pulsar `E` | Abre Sobre mí / Experiencia / entrevista |
| Menú ☰ → cada sección | Abre directamente, sin jugar |
| Enviar formulario vacío | Mensaje de validación, no se envía |
| Enviar dos veces seguidas | Segundo envío bloqueado 60 s |
| Sin `VITE_FORM_ENDPOINT` | Abre el cliente de correo con el mensaje |
| Visitar las 5 secciones | Aparece el mensaje MVP |
| Bloquear JavaScript / sin WebGL2 | Se llega a `/classic/` |
| Recargar | Progreso conservado (X/5) |
| Pestaña en segundo plano 1 min | Sin consumo de CPU y sin saltos al volver |

### 17.4 Definición de "terminado" de la versión base
Todas las casillas de 13, 17.2 y 17.3 marcadas · `npm test` en verde · `npm run build` en verde · desplegado en un dominio · `content.ts` sin marcadores · versión clásica completa.

---

## 18. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Ver mal la pista en pantallas muy anchas o muy verticales | `dist` adaptativo en `resize()`; ajustar `CAMERA` (sección 13) |
| Un visitante no quiere "jugar" | Menú ☰ y `/classic/` siempre visibles |
| Gasto de batería en móvil | Límite de *pixel ratio* 1.5, calidad adaptativa, pausa en segundo plano |
| Spam en el formulario | Honeypot + límite 1/min + validación; Formspree añade su propio filtro |
| Contenido desactualizado entre juego y versión clásica | Una sola fuente (`content.ts`) y generación automática |
| Dependencia rota o `three` mal alineado con sus tipos | Versiones exactas fijadas (sección 3) |
| Licencias de assets | Por defecto no hay assets externos; si se añaden, anotar licencia y créditos |

---

## 19. Backlog (versión 2, fuera del fin de semana)

1. Sustituir al jugador por un GLB animado con clips de correr, driblar y tirar (sección 14.2).
2. Confeti y partículas al desbloquear; cámara con ligero *shake* (respetando `prefers-reduced-motion`).
3. Música de fondo con *toggle* (Howler.js o `<audio>`).
4. Logros ("Triple desde el centro", "100 % descubierto") con `localStorage`.
5. Zona extra: "Exploración espacial" (tu otra pasión) como mini-escena con cielo estrellado.
6. Analítica sin cookies (<https://plausible.io>) para saber qué zonas se visitan.
7. Tests de interfaz con Playwright (<https://playwright.dev>).

---

## 20. Prompt maestro para la IA ejecutora

> Eres un desarrollador senior de TypeScript y Three.js. Ejecuta el documento "THE COURT — Plan de desarrollo" **fase por fase y en orden**.
>
> Reglas: (1) copia el código de cada fase tal cual; (2) tras cada fase ejecuta su comando de verificación y no continúes si falla; si falla, corrige lo mínimo y explica el cambio; (3) no añadas dependencias; (4) todo texto visible debe estar en español e inglés; (5) nunca inventes datos del propietario: usa `[[PENDIENTE]]` y pregunta; (6) en la Fase 0, pide la URL o el repositorio del portfolio actual y muéstrame la tabla de equivalencias antes de rellenar `content.ts`; (7) al terminar, entrega: repositorio con todos los archivos, salida de `npm test` y `npm run build`, la lista de la sección 13 marcada con lo que observaste en el navegador, y una lista de cualquier desviación respecto al plan.

---

## 21. Orden de ejecución resumido (checklist)

- [ ] **F0** Inventario del portfolio actual y confirmación de la tabla (5)
- [ ] **F1** Scaffolding y `npm install` (6)
- [ ] **F2** `i18n.ts`, `content.ts` real, validador → `npm run validate` (7)
- [ ] **F3** `config.ts`, `shot.ts`, `ball.ts`, tests → `npm test` (8)
- [ ] **F4** Builders → `npx tsc --noEmit` (9)
- [ ] **F5** `input.ts`, `audio.ts` (10)
- [ ] **F6** `contactForm.ts`, `panels.ts`, `hud.ts` (11)
- [ ] **F7** `index.html`, `boot.ts`, `main.ts`, `styles.css` → `npm run dev` + sección 13 (12–13)
- [ ] **F8** Versión clásica → `npm run classic` (15)
- [ ] **F9** Añadir el contenido nuevo (5.3) y revisar traducciones
- [ ] **F10** Formulario real (Formspree) y despliegue (16)
- [ ] **F11** Matriz de pruebas (17) y Lighthouse
