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
  tab_message: { es: 'Mensaje', en: 'Message' },
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
