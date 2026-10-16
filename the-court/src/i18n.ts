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
  /* Textos de los mandos táctiles. El de acción SÍ se lee: es la etiqueta del
     botón, que en un móvil no puede ser «E» (no hay tecla E y el aviso de las
     secciones dice «Pulsa ACCIÓN»). El de tiro es sólo para lectores de pantalla:
     ese botón lleva el balón dibujado. */
  touch_action: { es: 'ACCIÓN', en: 'ACTION' },
  touch_shoot: { es: 'Tiro', en: 'Shoot' },
  section_projects: { es: 'Proyectos', en: 'Projects' },
  section_skills: { es: 'Skills', en: 'Skills' },
  section_about: { es: 'Sobre mí', en: 'About me' },
  section_experience: { es: 'Experiencia', en: 'Experience' },
  section_contact: { es: 'Contacto', en: 'Contact' },
  section_stats: { es: 'Récord', en: 'Record' },

  /* Carteles flotantes sobre cada objeto del mundo (textos aprobados por el
     propietario). Se diferencian de section_* porque el rótulo de la cámara de
     TV dice "Entrevístame", no "Contacto". */
  sign_projects: { es: 'Proyectos', en: 'Projects' },
  sign_skills: { es: 'Skills/Stats', en: 'Skills/Stats' },
  sign_about: { es: 'Sobre mí', en: 'About me' },
  sign_experience: { es: 'Experiencia', en: 'Experience' },
  sign_contact: { es: 'Entrevístame', en: 'Interview me' },
  sign_stats: { es: 'Récord', en: 'Record' },

  /* Panel de récord (6.ª sección, la canasta derecha) */
  record_chip: { es: 'Récord', en: 'Record' },
  stats_shots: { es: 'Tiros encestados', en: 'Shots made' },
  stats_attempts: { es: 'Tiros intentados', en: 'Shots attempted' },
  stats_accuracy: { es: 'Aciertos', en: 'Accuracy' },
  stats_sections: { es: 'Secciones descubiertas', en: 'Sections discovered' },
  stats_left: { es: 'Sin registrar', en: 'Not recorded' },
  stats_empty: {
    es: 'Todavía no hay nada que registrar. Sal a la pista, tira y encesta.',
    en: 'Nothing to record yet. Get out on the court, take a shot and score.',
  },
  unlocked: { es: 'Sección desbloqueada', en: 'Section unlocked' },
  progress: { es: 'Secciones', en: 'Sections' },
  mvp: {
    es: '¡MVP! Has descubierto todo el portfolio',
    en: 'MVP! You have discovered the whole portfolio',
  },
  menu: { es: 'Menú', en: 'Menu' },
  menu_title: { es: 'Ir directo a una sección', en: 'Jump to a section' },
  /* Estado de cada sección en el menú (se lee en voz alta, la marca es un
     símbolo y va oculta). */
  state_done: { es: 'visitada', en: 'visited' },
  state_open: { es: 'pendiente', en: 'pending' },
  state_locked: { es: 'bloqueada, encesta para abrirla', en: 'locked, score to unlock' },
  close: { es: 'Cerrar', en: 'Close' },
  lang_toggle: { es: 'Cambiar idioma', en: 'Change language' },
  mute: { es: 'Silenciar', en: 'Mute' },
  unmute: { es: 'Activar sonido', en: 'Unmute' },
  classic: { es: 'Versión clásica', en: 'Classic version' },
  shot_perfect: { es: '¡Tiro perfecto!', en: 'Perfect shot!' },
  shot_basket: { es: '¡Canasta!', en: 'Basket!' },
  shot_miss: { es: 'Casi… otra vez', en: 'So close… try again' },
  takeover_tag: { es: 'TAKEOVER', en: 'TAKEOVER' },
  takeover_on: { es: '¡TAKEOVER! El balón está en llamas', en: 'TAKEOVER! The ball is on fire' },
  takeover_miss: { es: 'Se apagó el fuego', en: 'Fire gone out' },
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

  /* Concurso de triples (lote B). */
  contest_start: { es: 'Pulsa E · Concurso de triples', en: 'Press E · Three-point contest' },
  contest_quit: { es: 'Pulsa E · Dejar el concurso', en: 'Press E · Leave the contest' },
  contest_on: {
    es: '¡Concurso de triples! 5 carros, 15 balones, 60 segundos',
    en: 'Three-point contest! 5 racks, 15 balls, 60 seconds',
  },
  contest_tag: { es: 'Concurso de triples', en: 'Three-point contest' },
  contest_score: { es: 'Puntos', en: 'Points' },
  contest_rack: { es: 'Carro', en: 'Rack' },
  contest_hint_next: { es: 'Ve al carro siguiente', en: 'Run to the next rack' },
  contest_hint_money: { es: '¡Bola del dinero! Vale doble', en: 'Money ball! Worth double' },
  contest_hint_buzzer: { es: '¡Bocina! Vale el balón que va en el aire', en: 'Buzzer! The ball in the air counts' },
  contest_buzzer_beater: { es: '¡Sobre la bocina!', en: 'Buzzer beater!' },
  contest_end: { es: 'Concurso terminado', en: 'Contest over' },
  contest_end_time: { es: 'Se acabó el tiempo', en: 'Time is up' },
  contest_best: { es: '¡Récord del concurso!', en: 'Contest record!' },
  stats_contest: { es: 'Mejor concurso', en: 'Best contest' },

  /*
   * Comentarista del concurso (subtítulos del HUD).
   *
   * Frases CORTAS y enteras por idioma: son subtítulos, se leen de un vistazo
   * mientras se corre al carro siguiente. Los huecos los rellena `tf()`.
   *
   * Reparto de papeles: el HUD (rótulo, aviso de la bola del dinero y canto
   * final) dice los DATOS; estas frases son la VOZ, así que no repiten el cartel
   * —cuando el HUD ya dice «¡Bola del dinero! Vale doble», la cabina comenta
   * «doble o nada», que es lo mismo con emoción y no un segundo cartel—.
   */
  cmt_tag: { es: 'Comentarista', en: 'Commentator' },
  cmt_start: {
    es: '¡Y aquí empieza el concurso! Sesenta segundos para hacerse un nombre.',
    en: 'And here we go! Sixty seconds to make a name for yourself.',
  },
  cmt_rack: { es: 'Carro {n} de {total}. ¡A por él!', en: 'Rack {n} of {total}. Go get it!' },
  cmt_money: { es: '¡Bola del dinero! Doble o nada.', en: 'Money ball! Double or nothing.' },
  cmt_make: { es: '¡Dentro! Suma {suma}, lleva {puntos}.', en: 'It’s in! Worth {suma}, that’s {puntos}.' },
  cmt_make_money: {
    es: '¡Doble con la bola del dinero! {puntos} al marcador.',
    en: 'Money ball for the double! {puntos} on the board.',
  },
  cmt_make_streak: {
    es: '¡{racha} seguidas! Está encendido.',
    en: 'That’s {racha} in a row! He’s heating up.',
  },
  cmt_miss: { es: 'Fuera. Ahí no entra.', en: 'No good. That one’s off.' },
  cmt_buzzer: {
    es: '¡Bocina! Si el balón va en el aire, todavía vale.',
    en: 'The buzzer! If the ball is in the air, it still counts.',
  },
  cmt_end: {
    es: '¡Se acabó! {puntos} puntos y {aciertos} de {tiros}.',
    en: 'That’s it! {puntos} points and {aciertos} of {tiros}.',
  },
  cmt_end_record: {
    es: '¡Se acabó! {puntos} puntos, {aciertos} de {tiros}… ¡y récord personal!',
    en: 'That’s it! {puntos} points, {aciertos} of {tiros}… and a personal best!',
  },

  /* Retransmisión: el filtro de televisión del plató (lote B). */
  live_rec: { es: 'REC', en: 'REC' },
  live_now: { es: 'EN DIRECTO', en: 'LIVE' },
  live_channel: { es: 'CANAL 3 · DEPORTES', en: 'CH 3 · SPORTS' },

  /*
   * Diálogo del entrevistador (lote B). Sustituye al formulario a secas: el
   * propietario pidió que, en vez de un formulario, haya una conversación con el
   * entrevistador y que el formulario llegue al final (y siga enviando de
   * verdad). Tres preguntas, dos respuestas cada una y la réplica del
   * entrevistador, que es lo que hace que se lea como una entrevista y no como
   * un cuestionario.
   */
  dlg_host: { es: 'Entrevistador', en: 'Interviewer' },
  dlg_label: { es: 'Diálogo de la entrevista', en: 'Interview dialogue' },
  dlg_skip: { es: 'Ir directo al formulario', en: 'Skip to the form' },
  dlg_form_title: { es: 'Datos para el entrevistador', en: 'Details for the interviewer' },
  dlg_open: {
    es: 'Estamos en directo en el plató de The Court. Acabo de ver el partido y tengo tres preguntas. Empecemos por lo básico.',
    en: "We're live on The Court's set. I've just watched the game and I have three questions. Let's start with the basics.",
  },
  dlg_q1: {
    es: '¿Qué está viendo la gente? Explícamelo para quien acaba de entrar.',
    en: 'What are people watching? Explain it to me for someone who just walked in.',
  },
  dlg_a1a: {
    es: 'Un portfolio jugable: la cancha hace de menú y cada sección está en una zona de la pista.',
    en: 'A playable portfolio: the court is the menu and every section sits in a zone on the floor.',
  },
  dlg_a1b: {
    es: 'Un motor de vóxeles propio con mi trabajo dentro. Y sí, se puede tirar a canasta de camino.',
    en: 'A voxel engine of my own with my work inside it. And yes, you can shoot hoops on the way.',
  },
  dlg_r1: {
    es: 'Jugable, nada menos. Me gusta.',
    en: 'Playable, no less. I like it.',
  },
  dlg_q2: {
    es: 'Además de tirar, ¿qué hay puesto ahí?',
    en: "Besides shooting, what's out there?",
  },
  dlg_a2a: {
    es: 'Un concurso de triples desde el carrito, el récord guardado en el navegador y un modo «takeover» si encestas cinco seguidas.',
    en: 'A three-point contest from the ball cart, the record kept in the browser, and a takeover mode if you score five in a row.',
  },
  dlg_a2b: {
    es: 'El pabellón entero: público que reacciona, el plató de televisión y secciones que se desbloquean a canastazos.',
    en: 'The whole arena: a crowd that reacts, the TV set, and sections that unlock with big shots.',
  },
  dlg_r2: {
    es: 'Suena a partido de verdad. Última pregunta y cerramos.',
    en: 'Sounds like a real game. Last question and we wrap up.',
  },
  dlg_q3: {
    es: '¿Cómo te contacta alguien que quiera trabajar contigo?',
    en: 'How does someone who wants to work with you get in touch?',
  },
  dlg_a3a: {
    es: 'Aquí abajo puede dejarme los datos y le contesto yo.',
    en: "They can leave their details right below and I'll answer myself.",
  },
  dlg_a3b: {
    es: 'Mejor el correo directo. El formulario también está ahí por si acaso.',
    en: 'Direct email is better. The form is there too, just in case.',
  },
  dlg_r3: {
    es: 'Anotado. Que rellene el formulario quien quiera y cerramos el directo.',
    en: "Noted. Anyone who wants to can fill in the form and we'll close the broadcast.",
  },
  /*
   * Los comentarios del entrevistador sobre LA PARTIDA del jugador.
   *
   * Llevan huecos `{...}` que rellena `tf()` con lo que hay guardado en el
   * navegador (tiros, acierto y mejor concurso), y hay dos versiones de cada uno
   * porque un recién llegado no tiene números de los que hablar: sin tiros, el
   * entrevistador comenta la ausencia en vez de soltar un cero.
   */
  dlg_data_shots_none: {
    es: 'Y de tiros, nada todavía: no te he visto lanzar ni uno. La cancha está ahí mismo, no muerde.',
    en: "And on shooting, nothing yet: I haven't seen you take a single one. The court is right there, it doesn't bite.",
  },
  dlg_data_shots: {
    es: 'En mi libreta llevas {made} canastas de {attempted} tiros, un {pct} % desde la línea. Ese es tu récord en este navegador.',
    en: "My notebook says {made} baskets out of {attempted} shots, {pct}% from the line. That is your record in this browser.",
  },
  dlg_data_contest_none: {
    es: 'Y del concurso de triples no me consta nada. Sesenta segundos desde el carrito, por si te animas.',
    en: "And about the three-point contest I have no record at all. Sixty seconds from the cart, if you feel like it.",
  },
  dlg_data_contest: {
    es: 'Tu mejor concurso guardado son {best} puntos. Ahí se ve quién entrena de verdad.',
    en: 'Your best saved contest is {best} points. That is where you can tell who really trains.',
  },
  contact_direct: { es: 'O escríbeme directamente', en: 'Or reach me directly' },
  cv_download: { es: 'Descargar CV en PDF', en: 'Download CV as PDF' },
  cv_note: {
    es: 'Una página, formato PDF',
    en: 'One page, PDF format',
  },
  /* Pestañas de los paneles de sección. Los rótulos de grupo (años, tipos de
     hito, grupos de skills) salen de los datos y no se traducen aquí. */
  tabs_label: { es: 'Pestañas de la sección', en: 'Section tabs' },
  tabs_all: { es: 'Todo', en: 'All' },
  proj_details: { es: 'Detalles del proyecto', en: 'Project details' },
  tab_intro: { es: 'Presentación', en: 'Introduction' },
  tab_web: { es: 'Desarrollo web', en: 'Web development' },
  tab_games: { es: 'Videojuegos', en: 'Games' },
  tab_security: { es: 'Ciberseguridad', en: 'Cybersecurity' },
  tab_offcourt: { es: 'Fuera de la pista', en: 'Off the court' },
  tab_facts: { es: 'Datos', en: 'Facts' },
  tab_message: { es: 'Entrevista', en: 'Interview' },
  tab_direct: { es: 'Contacto directo', en: 'Direct contact' },
  stats_hint: {
    es: 'El récord se guarda en este navegador: no hace falta cuenta ninguna.',
    en: 'The record is kept in this browser: no account needed.',
  },
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

/**
 * Los cinco temas de «Sobre mí», en orden, con el rótulo de su pestaña.
 *
 * Antes las pestañas las montaba `panels.ts` a mano (`idx: [0]`, `[1]`…) y el
 * texto venía de `content.about.paragraphs` por posición: añadir un párrafo por
 * arriba desplazaba los cinco temas sin que saltara nada. Aquí está el catálogo
 * —la lista de lo que existe— y en `content.ts` cada párrafo DICE de qué tema
 * es, así que los dos lados se atan por `id` y no por posición.
 *
 * `as const satisfies` hace las dos cosas: `id` queda como literal (de ahí
 * `TemaId`) y el catálogo sigue teniendo que ser válido como `UIKey`. Un
 * `id` que no exista en el catálogo no compila.
 */
export const TEMAS_ABOUT = [
  { id: 'intro', label: UI.tab_intro },
  { id: 'web', label: UI.tab_web },
  { id: 'games', label: UI.tab_games },
  { id: 'security', label: UI.tab_security },
  { id: 'offcourt', label: UI.tab_offcourt },
] as const satisfies readonly { id: string; label: L10n }[];

/** Ids de tema admitidos: sale del catálogo, no se escribe a mano en otro sitio. */
export type TemaId = (typeof TEMAS_ABOUT)[number]['id'];

/**
 * Igual que `t()`, pero rellenando los huecos `{nombre}` que lleve la frase.
 *
 * Las frases del entrevistador sobre la partida llevan las cifras del jugador
 * DENTRO, y no se pueden componer a trozos («llevas » + 7 + « canastas»): el
 * orden de las palabras y el plural no son los mismos en los dos idiomas, así
 * que la frase entera es una clave y aquí sólo se sustituyen sus huecos.
 *
 * Un hueco sin valor se queda tal cual —se lee `{pct}` en pantalla— en vez de
 * desaparecer: es un fallo que se ve en la revisión, y no un `undefined` callado
 * en medio de una entrevista.
 */
export function tf(key: UIKey, vars: Record<string, string | number>): string {
  return t(key).replace(/\{(\w+)\}/g, (todo, nombre: string) =>
    Object.prototype.hasOwnProperty.call(vars, nombre) ? String(vars[nombre]) : todo,
  );
}
