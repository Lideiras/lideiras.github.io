import type { L10n, TemaId } from '../i18n';

export type SectionId = 'projects' | 'skills' | 'about' | 'experience' | 'contact' | 'stats';

export interface Link { label: L10n; url: string }

/** Escala de niveles 1–10 (decisión del propietario). */
export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Project {
  id: string;
  title: string;
  year: number;
  summary: L10n;
  /** Descripción larga opcional (añadida: el portfolio original traía shortDescription + fullDescription). */
  details?: L10n;
  stack: string[];
  links: Link[];
}

export interface SkillGroup {
  id: string;
  name: L10n;
  items: { name: L10n; level: SkillLevel }[];
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

/**
 * Un tema de «Sobre mí»: el texto va DECLARADO con su tema.
 *
 * Antes el reparto era posicional: `panels.ts` decía «el párrafo 0 va con
 * Presentación, el 1 con Desarrollo web…». Insertar un párrafo por arriba
 * desplazaba las cinco pestañas sin que saltara nada: «Ciberseguridad» pasaba a
 * enseñar el texto de videojuegos y no había forma de enterarse. Al bajar, cada
 * párrafo dice de quién es.
 */
export interface AboutTopic {
  /**
   * El mismo id que en `TEMAS_ABOUT` (`i18n.ts`), que es donde están las
   * etiquetas. Es la unión entre el rótulo de la pestaña y su texto, y el tipo
   * no es `string` a propósito: un id que no exista en el catálogo no compila.
   */
  id: TemaId;
  /** Párrafos del tema, en orden. Hoy hay uno por tema; la lista admite más. */
  text: L10n[];
}

export interface Content {
  person: {
    name: string;
    initials: string;
    jerseyNumber: string;
    birthDate?: string;
    role: L10n;
    /** Opcional por decisión del propietario: no quiere tagline. */
    tagline?: L10n;
    location: string;
    email: string;
    social: Link[];
  };
  about: {
    topics: AboutTopic[];
    /**
     * Los mismos párrafos, en lista plana y DERIVADOS de los temas.
     *
     * Nadie que dibuje «Sobre mí» debería tener que reagrupar para leer la
     * prosa (la clásica, el validador), pero el texto EDITABLE es el de
     * `topics`: duplicarlo aquí a mano son dos copias que divergen.
     */
    paragraphs: L10n[];
    highlights: { label: L10n; value: L10n }[];
  };
  projects: Project[];
  skills: SkillGroup[];
  timeline: TimelineItem[];
}

/* ---------------------------------------------------------------------------
 * Fuente de verdad del contenido. Extraído del portfolio estático real:
 *   · textos originales en inglés -> assets/index-mdcuKJhk.js (bundle React)
 *   · experiencia, estudios y fechas -> assets/documents/CV_eng.pdf
 * Los textos que el propietario aún no ha aprobado llevan .
 * ------------------------------------------------------------------------- */

/*
 * Los temas de «Sobre mí», con su texto DECLARADO (T3).
 *
 * El reparto es por id, no por posición: mover, quitar o añadir un párrafo aquí
 * dentro ya no puede reetiquetar ninguna pestaña. El orden de las pestañas es el
 * de `TEMAS_ABOUT` (`i18n.ts`), no el de esta lista, porque el rótulo de cada
 * tema es texto de interfaz y vive allí.
 */
const ABOUT_TOPICS: AboutTopic[] = [
  {
    id: 'intro',
    text: [
      {
        es: '¡Hola! Soy Daniel, una mente curiosa que disfruta convirtiendo ideas en experiencias interactivas. Soy desarrollador full stack y desarrollador de videojuegos, y ahora estoy inmerso en la IA y la ciencia de datos para hacer mis proyectos más inteligentes y emocionantes',
        en: "Hey! I'm Daniel, a curious mind who loves turning ideas into interactive experiences. I'm a full-stack developer and game developer, currently diving deep into AI and Data Science to make my projects smarter and more exciting.",
      },
    ],
  },
  {
    id: 'web',
    text: [
      {
        es: 'Construyo aplicaciones web y plataformas a medida con Laravel y React. En Global Fun Partners he desarrollado y mantenido webs corporativas con WordPress, he creado un portal privado de empresa que agiliza las operaciones internas y he diseñado soluciones a medida para el área privada del CBU Bàsquet Lloret, mejorando la gestión de equipo y los flujos de comunicación',
        en: 'I build web apps and custom platforms using Laravel and React. At Global Fun Partners, I have developed and maintained corporate websites with WordPress, created a private company portal to streamline internal operations, and designed tailored solutions for the private area of CBU Bàsquet Lloret, improving team management and communication workflows.',
      },
    ],
  },
  {
    id: 'games',
    text: [
      {
        es: 'Pero donde de verdad me enciendo es trabajando en videojuegos: diseñando mecánicas, creando mundos en Unity o Unreal y dando vida a historias con arte 3D y animaciones. También he trabajado en varios proyectos, tanto personales como durante mis estudios universitarios, que puedes explorar en la sección de obras de esta web',
        en: "But where I really light up is when I'm working on games—designing mechanics, crafting worlds in Unity or Unreal, and bringing stories to life with 3D art and animations. I've also worked on several projects, both personal and during my university studies, which you can explore in the Works section of this site.",
      },
    ],
  },
  {
    id: 'security',
    text: [
      {
        es: 'La ciberseguridad es una de mis pasiones, y dentro de ella el pentesting es lo que más me entusiasma. Soy autodidacta en el área y no dejo de buscar formas de probar, proteger y blindar sistemas. Para mí programar es tan cuestión de creatividad como de ponerme a prueba buscando vulnerabilidades y hacer el software más resiliente',
        en: 'Cybersecurity is a personal passion of mine, with a focus on pentesting, which I find especially exciting. I am self-taught in this area and constantly exploring ways to test, secure, and harden systems. For me, programming is as much about creativity as it is about challenging myself to find vulnerabilities and make software more resilient.',
      },
    ],
  },
  {
    id: 'offcourt',
    text: [
      {
        es: 'Fuera del código, seguramente me encuentres en una pista de baloncesto, experimentando con nuevos conceptos de videojuegos o empapándome de las últimas tendencias en IA, hacking ético y tecnología en general. Me encanta mezclar lo técnico con la creatividad, y siempre busco formas de aprender, crecer y construir proyectos que sean a la vez débutants y con sentido',
        en: "Outside of coding, you'll probably find me on a basketball court, experimenting with new game concepts, or geeking out about the latest trends in AI, ethical hacking, and tech in general. I love blending technical skills with creativity, and I'm always looking for ways to learn, grow, and build projects that are both fun and meaningful.",
      },
    ],
  },
];

export const content: Content = {
  person: {
    name: 'Daniel Noya Catoira',
    initials: 'LID',
    jerseyNumber: '23',
    birthDate: '2001-03-07',
    role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    location: 'Girona, Catalonia',
    email: 'contactdanielnoya@gmail.com',
    social: [
      { label: { es: 'LinkedIn', en: 'LinkedIn' }, url: 'https://www.linkedin.com/in/daniel-noya-catoira/' },
      { label: { es: 'X', en: 'X' }, url: 'https://x.com/LideGameDev' },
      { label: { es: 'TryHackMe', en: 'TryHackMe' }, url: 'https://tryhackme.com/p/Lideiras' },
      { label: { es: 'itch.io', en: 'itch.io' }, url: 'https://danoya.itch.io/' },
    ],
  },

  about: {
    topics: ABOUT_TOPICS,
    paragraphs: ABOUT_TOPICS.flatMap((t) => t.text),
    highlights: [
      {
        label: { es: 'En la pista', en: 'On the court' },
        value: { es: 'Semiprofesional desde 2017', en: 'Semi-pro since 2017' },
      },
      {
        label: { es: 'Idiomas', en: 'Languages' },
        value: { es: '5', en: '5' },
      },
      {
        label: { es: 'TFG Endless Blue', en: 'Final project Endless Blue' },
        value: { es: '8/10', en: '8/10' },
      },
      {
        label: { es: 'Debate', en: 'Debate' },
        value: { es: 'Parlamento de Galicia', en: 'Galician Parliament' },
      },
    ],
  },

  projects: [
    {
      id: 'sobreviviu-udg',
      title: "Sobreviu l'UDG",
      year: 2022,
      summary: {
        es: 'Juego de terror y puzles en primera persona hecho con Unity 3D',
        en: 'Horror puzzle FPS game made with Unity 3D',
      },
      details: {
        es: 'Juego de terror y puzles en primera persona ambientado en el campus de la UDG. El jugador debe resolver puzles para escapar del campus y encontrar la salida. El juego tiene una atmósfera de terror y una mecánica de resolución de puzles única',
        en: 'Horror puzzle FPS game based on the UDG campus. The player must solve puzzles to escape the campus and find the exit. The game features a horror atmosphere and a unique puzzle-solving mechanic.',
      },
      stack: ['Unity 3D', 'Blender', 'Substance Painter', 'C#', 'Puzzles'],
      links: [
        { label: { es: 'itch.io', en: 'itch.io' }, url: 'https://danoya.itch.io/sobreviu-ludg' },
      ],
    },
    {
      id: 'long-live-the-king',
      title: 'Long Live The King',
      year: 2022,
      summary: {
        es: 'FPS de arquero con mecánicas de parkour hecho con UE4',
        en: 'Archer FPS with parkour mechanics made with UE4',
      },
      details: {
        es: 'Proyecto desarrollado para la asignatura de Desarrollo de Videojuegos de la Universidad de Girona. Es un FPS de arquero con mecánicas de parkour: el jugador puede moverse en todas las direcciones y saltar obstáculos. Me encargué de las mecánicas de arco y flecha y del diseño de niveles',
        en: 'Project developed for the Game Development subject at the University of Girona. It is a FPS archer game with parkour mechanics. The player can move in all directions and jump over obstacles.',
      },
      stack: ['UE4', 'Blueprint', 'Blender', '3D Modeling', 'Animation', 'Parkour'],
      links: [
        { label: { es: 'itch.io', en: 'itch.io' }, url: 'https://danoya.itch.io/long-live-the-king' },
        { label: { es: 'GitHub', en: 'GitHub' }, url: 'https://github.com/kimarsal/LongLiveTheKing' },
      ],
    },
    {
      id: 'multiplayer-simple-game',
      title: 'Multiplayer Simple Game',
      year: 2023,
      summary: {
        es: 'Juego multijugador 2D hecho con el sistema multijugador de Unity',
        en: '2D Multiplayer game made using Unity Multiplayer System',
      },
      details: {
        es: 'Pequeño proyecto desarrollado para la asignatura de Desarrollo de Videojuegos Multijugador de la Universidad de Girona. Es un juego multijugador 2D que usa el sistema multijugador de Unity para facilitar la comunicación entre jugadores y servidor. Para construir una comunicación sólida entre clientes y servidor tuve que aprender a usar ese sistema',
        en: 'Small project developed for the Multiplayer Game Development subject at the University of Girona. It is a 2D multiplayer game. The game uses the Unity Multiplayer System to ease the multiplayer communication between players & server.',
      },
      stack: ['Unity 3D', 'C#', 'Unity Multiplayer System', 'Animation'],
      links: [],
    },
    {
      id: 'vr-game',
      title: 'VR Game',
      year: 2022,
      summary: {
        es: 'Juego de realidad virtual hecho con Unity',
        en: 'VR game made using Unity',
      },
      details: {
        es: 'Juego de realidad virtual desarrollado para la asignatura de Realidad Virtual de la Universidad de Girona. Usa el sistema de VR de Unity para ofrecer una experiencia sencilla al jugador; el objetivo del proyecto era entender cómo funciona Unity con los sistemas de VR y poder añadir esas habilidades a mi caja de herramientas de desarrollo',
        en: 'VR game developed for the Virtual Reality subject at the University of Girona. It is a VR game. The game uses the Unity VR System to deliver a simple VR experience to the player, this project objective was to understand how Unity works with the VR Systems and being able to add those skills to our game developing toolbox.',
      },
      stack: ['Unity 3D', 'C#', 'Unity VR System', 'Animation', 'Unity XR Interaction Toolkit'],
      links: [],
    },
    {
      id: 'endless-runner-game',
      title: 'Endless Runner Game',
      year: 2023,
      summary: {
        es: 'Juego de carrera infinita para dispositivos móviles hecho con Unity',
        en: 'Endless Runner Game for mobile devices made using Unity',
      },
      details: {
        es: 'Juego de carrera infinita desarrollado para la asignatura de Juegos Móviles de la Universidad de Girona. Usa el sistema móvil de Unity para ofrecer una experiencia móvil sencilla; el objetivo del proyecto era entender los distintos tipos de entrada en Unity para un juego móvil y cómo construir las teselas del mapa infinito para los niveles sin fin',
        en: 'Endless Runner Game developed for the Mobile Games subject at the University of Girona. It is a Endless Runner Game. The game uses the Unity Mobile System to deliver a simple mobile experience to the player, this project objective was to understand how Unity works with the Mobile Systems and being able to add those skills to our game developing toolbox.',
      },
      stack: ['Unity 3D', 'C#', 'Unity Mobile System', 'Animation', 'Unity Mobile Input'],
      links: [
        { label: { es: 'Descarga', en: 'Download' }, url: 'https://drive.google.com/file/d/1LSxJ884z316t4CY6CY7Z4A5J6ZVEB5oz/view?usp=sharing' },
      ],
    },
    {
      id: 'godot-2d-plataformer',
      title: 'Godot 2D Plataformer',
      year: 2022,
      summary: {
        es: 'Juego de plataformas 2D hecho con Godot y su starter kit de plataformas 2D',
        en: '2D Plataformer game made using Godot and the 2D Plataformer starter kit',
      },
      details: {
        es: 'Juego de plataformas 2D hecho con el motor Godot para ofrecer una experiencia sencilla al jugador; el objetivo del proyecto era entender cómo funciona Godot y cómo se programa con GDScript',
        en: '2D Plataformer Game. It is a 2D Plataformer Game. The game uses the Godot Engine to deliver a simple experience to the player, this project objective was to understand how Godot works.',
      },
      stack: ['Godot Engine', 'GDScript', '2D Systems', 'Animation'],
      links: [],
    },
    {
      id: 'tfg-game',
      title: 'Endless Blue',
      year: 2025,
      summary: {
        es: 'Juego 3D hecho como proyecto final del Grado en Desarrollo de Videojuegos de la Universidad de Girona',
        en: '3D Game made as my final project for the Game Development degree at the University of Girona',
      },
      details: {
        es: 'Juego 3D en el que el usuario controla un delfín animado proceduralmente que debe explorar un mapa lleno de enemigos patrulla, NPC y cofres que cuentan una historia sobre la pérdida y el duelo. Es el prototipo inicial que presenté al tribunal, con una nota final de 8/10. Cuenta con un entorno 3D, un delfín con animación procedural y enemigos 3D también animados proceduralmente',
        en: 'The game is a 3D game where the user controls a procedurally animated dolphin that has to explore a map filled with patroling enemies, NPCs and chests that tell a story about loss and grieve. This is the initial prototipe I presented to the tribunal and the final mark was a 8/10. The game features a 3D environment, a procedurally 3D animated dolphin and a 3D animated enemies also procedurally animated.',
      },
      stack: ['Unity 3D', 'C#', 'Animation', 'Procedural Animations'],
      links: [
        { label: { es: 'Descarga', en: 'Download' }, url: 'https://www.dropbox.com/scl/fo/183tykx5fp80v5ckzlqj3/ABlPNYEYd5gpg8wW6rNMoNk?rlkey=3lcq3pfil8c6htlaxgh3q6zfe&st=g58qp7be&dl=0' },
      ],
    },
    {
      id: 'pinball-godot-game',
      title: 'Pinball Godot Game',
      year: 2021,
      summary: {
        es: 'Juego de pinball 2D hecho con Godot para entender la física dentro del motor',
        en: '2D Pinball game made using Godot to understand physics inside the engine',
      },
      details: {
        es: 'Juego de pinball 2D en el que el usuario controla una pelota que tiene que rebotar en las palas y romper los bloques. Cuenta con un entorno 2D, una pelota animada en 2D y unas palas también animadas proceduralmente',
        en: 'The game is a 2D pinball game where the user controls a ball that has to bounce on the paddles and break the blocks. The game features a 2D environment, a 2D animated ball and a 2D animated paddles also procedurally animated.',
      },
      stack: ['Godot', 'GDScript', 'Animation', 'Physics'],
      links: [],
    },
    {
      id: 'las-aventuras-del-seton-magico',
      title: 'The Adventures of the Magic Seton',
      year: 2021,
      summary: {
        es: 'Juego 2D hecho con Vue.js para entender el framework',
        en: '2D Game made using Vue.js to understand the framework',
      },
      details: {
        es: 'Juego 2D hecho con el framework Vue.js para entender cómo funciona; es un juego de plataformas 2D de 2 niveles, con enemigos y controles limitados. El diseño del personaje principal lo dibujé entero yo, fotograma a fotograma. Cuenta con un entorno 2D, un personaje animado en 2D y enemigos 2D también animados proceduralmente',
        en: 'The game is a 2D game made using the Vue.js framework to allow me to understand how it works, its a 2 level 2D plataformer with limited enemeies and controlls. The main character design is drawn entirelly by me frame by frame. The game features a 2D environment, a 2D animated character and a 2D animated enemies also procedurally animated.',
      },
      stack: ['Vue.js', 'JavaScript', 'Animation', 'Physics'],
      links: [],
    },
    {
      id: 'dungeon-hunter-godot',
      title: 'Dungeon Hunter',
      year: 2021,
      summary: {
        es: 'Juego 2.5D hecho con Godot para entender el motor',
        en: '2.5D Game made using Godot to understand the engine',
      },
      details: {
        es: 'Juego 2.5D hecho con el motor Godot para entender cómo funciona; es un juego 2.5D al estilo Diablo de 2 niveles. El diseño del personaje principal lo dibujé entero yo, fotograma a fotograma. Cuenta con un entorno 2.5D, un personaje animado en 2.5D y enemigos 2.5D',
        en: 'The game is a 2.5D game made using the Godot engine to allow me to understand how it works, its a 2 level 2.5D Diablo-like game. The main character design is drawn entirelly by me frame by frame. The game features a 2.5D environment, a 2.5D animated character and a 2.5D animated enemies.',
      },
      stack: ['Godot', 'GDScript', '2.5D Videogame'],
      links: [],
    },
  ],

  skills: [
    {
      id: 'languages',
      name: { es: 'Lenguajes de programación', en: 'Programming languages' },
      items: [
        { name: { es: 'C#', en: 'C#' }, level: 9 },
        { name: { es: 'JavaScript', en: 'JavaScript' }, level: 9 },
        { name: { es: 'PHP', en: 'PHP' }, level: 8 },
        { name: { es: 'HTML/CSS', en: 'HTML/CSS' }, level: 8 },
        { name: { es: 'SQL', en: 'SQL' }, level: 7 },
        { name: { es: 'Python', en: 'Python' }, level: 6 },
        { name: { es: 'C++', en: 'C++' }, level: 5 },
        { name: { es: 'Kotlin', en: 'Kotlin' }, level: 3 },
      ],
    },
    {
      id: 'frameworks',
      name: { es: 'Frameworks y plataformas', en: 'Frameworks & platforms' },
      items: [
        { name: { es: 'Laravel', en: 'Laravel' }, level: 8 },
        { name: { es: 'React', en: 'React' }, level: 8 },
        { name: { es: 'WordPress', en: 'WordPress' }, level: 8 },
        { name: { es: 'ServiceNow', en: 'ServiceNow' }, level: 8 },
      ],
    },
    {
      id: 'engines',
      name: { es: 'Motores y herramientas', en: 'Engines & tools' },
      items: [
        { name: { es: 'Unity', en: 'Unity' }, level: 9 },
        { name: { es: 'Git', en: 'Git' }, level: 9 },
        { name: { es: 'Godot', en: 'Godot' }, level: 7 },
        { name: { es: 'Unreal Engine', en: 'Unreal Engine' }, level: 7 },
        { name: { es: 'Blender', en: 'Blender' }, level: 6 },
        { name: { es: 'Substance Painter', en: 'Substance Painter' }, level: 5 },
        { name: { es: 'Adobe Suite', en: 'Adobe Suite' }, level: 6 },
      ],
    },
    {
      id: 'areas',
      name: { es: 'Áreas de desarrollo', en: 'Development areas' },
      items: [
        { name: { es: 'Desarrollo de videojuegos', en: 'Game development' }, level: 9 },
        { name: { es: 'Diseño de juegos', en: 'Game design' }, level: 8 },
        { name: { es: 'Desarrollo de aplicaciones', en: 'Application development' }, level: 8 },
        { name: { es: 'Desarrollo de software', en: 'Software development' }, level: 8 },
        { name: { es: 'Gestión de bases de datos', en: 'Database management' }, level: 7 },
        { name: { es: 'Modelado 3D', en: '3D modeling' }, level: 6 },
        { name: { es: 'Animación 3D', en: '3D animations' }, level: 6 },
      ],
    },
    {
      id: 'security',
      name: { es: 'Ciberseguridad', en: 'Cybersecurity' },
      items: [
        { name: { es: 'Pentesting', en: 'Pentesting' }, level: 7 },
        { name: { es: 'Evaluación de vulnerabilidades', en: 'Vulnerability assessment' }, level: 6 },
        { name: { es: 'Auditoría de seguridad', en: 'Security auditing' }, level: 6 },
        { name: { es: 'Metasploit', en: 'Metasploit' }, level: 6 },
        { name: { es: 'Nmap', en: 'Nmap' }, level: 6 },
        { name: { es: 'Burp Suite', en: 'Burp Suite' }, level: 6 },
      ],
    },
    {
      id: 'spoken',
      name: { es: 'Idiomas', en: 'Spoken languages' },
      items: [
        { name: { es: 'Español', en: 'Español' }, level: 10 },
        { name: { es: 'Gallego', en: 'Gallego' }, level: 10 },
        { name: { es: 'Inglés', en: 'Inglés' }, level: 10 },
        { name: { es: 'Catalán', en: 'Catalán' }, level: 9 },
        { name: { es: 'Italiano', en: 'Italiano' }, level: 6 },
      ],
    },
  ],

  timeline: [
    {
      id: 'global-fun-partners',
      kind: 'work',
      title: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
      org: 'Global Fun Partners',
      start: '2025-02',
      end: null,
      description: {
        es: 'Desarrollé y mantuve varias webs corporativas con WordPress, cuidando el rendimiento y el diseño responsive. Construí un portal privado de empresa con Laravel (backend) y React (frontend) para agilizar las operaciones internas de una distribuidora nacional de máquinas recreativas. Diseñé e implementé soluciones a medida para el área privada del CBU Bàsquet Lloret, mejorando la gestión de equipo y los flujos de comunicación',
        en: 'Developed and maintained multiple corporate websites using WordPress, ensuring performance optimization and responsive design. Built a private company portal using Laravel (backend) and React (frontend) to streamline internal operations for a nationwide amusement machine distribution company. Designed and implemented custom solutions for the private area of CBU Bàsquet Lloret, enhancing team management and communication workflows.',
      },
    },
    {
      id: 'master-data-science-udg',
      kind: 'education',
      title: { es: 'Máster en Ciencia de Datos e Inteligencia Artificial', en: "Master's in Data Science and Artificial Intelligence" },
      org: 'Girona University',
      start: '2025',
      end: null,
      description: {
        es: 'Máster en curso en la Universidad de Girona, donde me introduzco a fondo en algoritmos de aprendizaje automático, redes neuronales y técnicas de análisis de datos',
        en: 'Currently pursuing a Master in Data Science and Artificial Intelligence at Girona University, diving deep into machine learning algorithms, neural networks and data analysis techniques.',
      },
    },
    {
      id: 'game-design-development-udg',
      kind: 'education',
      title: { es: 'Grado en Diseño y Desarrollo de Videojuegos', en: 'Game Design and Development' },
      org: 'Girona University',
      start: '2019',
      end: '2025-06',
      description: {
        es: 'Grado en Diseño y Desarrollo de Videojuegos con nota media 7/10. Me dio la base en programación, modelado 3D, animación y mecánicas de juego',
        en: 'Bachelor degree in Game Design and Development with a GPA of 7/10. It gave me a solid foundation in programming, 3D modeling, animation and game mechanics.',
      },
    },
    {
      id: 'noddonn-technology-consulting',
      kind: 'work',
      title: { es: 'Desarrollador de Soluciones de TI', en: 'IT Solutions Developer' },
      org: 'Noddon Technology Consulting',
      start: '2024-03',
      end: '2025-02',
      description: {
        es: 'Desarrollé soluciones de TI para Banco Sabadell. Implementé soluciones de TI con tecnologías ServiceNow y JavaScript. Conocí el funcionamiento interno del sector: flujos de trabajo, despliegues a producción desde entornos de desarrollo, gestión de bases de datos y desarrollo de aplicaciones a partir de ellos',
        en: 'Developed IT Solutions for Banco Sabadell. Implemented IT Solutions using ServiceNow + JavaScript technologies. Gained an understanding of the inner workings of the industry, including workflows, production deployments from development environments, database management and application development based on them.',
      },
    },
    {
      id: 'study-abroad-cassino',
      kind: 'education',
      title: { es: 'Estancia en el extranjero', en: 'Study Abroad' },
      org: 'Università degli Studi di Cassino e del Lazio Meridionale',
      start: '2022-09',
      end: '2023-02',
      description: {
        es: 'Asignaturas cursadas como estudiante de intercambio en la Università degli Studi di Cassino e del Lazio Meridionale, en Cassino (Italia)',
        en: 'Study abroad coursework at Università degli Studi di Cassino e del Lazio Meridionale, in Cassino (Italy).',
      },
    },
    {
      id: 'semi-pro-basketball',
      kind: 'sport',
      title: { es: 'Jugador de baloncesto semiprofesional', en: 'Semi-pro Basketball Player' },
      org: 'Various locations, Spain / Ireland / Italy',
      start: '2017-09',
      end: null,
      description: {
        es: 'He jugado en ligas semiprofesionales de baloncesto, con disciplina, trabajo en equipo y pensamiento estratégico. He compaginado entrenamientos intensos y partidos competitivos con las responsabilidades académicas',
        en: 'Competed in semi-professional basketball leagues, showcasing discipline, teamwork and strategic thinking. Balanced intensive training schedules and competitive games with academic responsibilities.',
      },
    },
    {
      id: 'st-patricks-centre',
      kind: 'work',
      title: { es: 'Profesor voluntario (educación especial)', en: 'Teacher (Volunteer)' },
      org: 'St. Patricks Centre',
      start: '2017-03',
      end: '2017-04',
      description: {
        es: 'Fui voluntario como profesor de alumnado con necesidades educativas especiales en Kilkenny: ayudé a planificar clases, preparé actividades educativas adaptadas y apoyé al alumnado en el desarrollo de habilidades esenciales. Trabajé junto al profesorado para crear un entorno de aprendizaje inclusivo y motivador, fomentando la paciencia, la empatía y la adaptabilidad. Galardonado con los Gaisce Awards del gobierno irlandés por el trabajo voluntario del curso',
        en: 'Volunteered as a teacher for special education students in Kilkenny, assisting with lesson planning, delivering tailored educational activities and supporting students in developing essential skills. Worked closely with staff to create an inclusive and engaging learning environment, fostering patience, empathy and adaptability. Awarded Gaisce Awards given by the Irish government for the volunteer work of the school year.',
      },
    },
    {
      id: 'irish-defence-forces',
      kind: 'work',
      title: { es: 'Oficial de oficina (voluntario)', en: 'Office Worker (Volunteer)' },
      org: 'Irish Defence Forces',
      start: '2017-02',
      end: '2017-03',
      description: {
        es: 'Asistí al personal administrativo del cuartel militar de Kilkenny en tareas de oficina: organizar y archivar documentación, gestionar registros y facilitar la comunicación entre departamentos. Conocí los flujos de trabajo administrativos de las fuerzas armadas y desarrollé habilidades de organización y trabajo en equipo en un entorno estructurado y disciplinado',
        en: 'Assisted administrative personnel in the Kilkenny Army Barracks with various office tasks, including organizing and filing paperwork, managing records and facilitating communication between departments. Gained insight into military administrative workflows and developed organizational and teamwork skills in a structured and disciplined environment.',
      },
    },
    {
      id: 'study-abroad-st-kierans',
      kind: 'education',
      title: { es: 'Estancia en el extranjero', en: 'Study Abroad' },
      org: "St Kieran's College",
      start: '2016-09',
      end: '2017-06',
      description: {
        es: 'Asignaturas cursadas como estudiante de intercambio en St Kieran’s College, en Kilkenny (Irlanda)',
        en: "Study abroad coursework at St Kieran's College, in Kilkenny (Ireland).",
      },
    },
    {
      id: 'ies-frei-martin-sarmiento',
      kind: 'education',
      title: { es: 'Bachillerato (nota media 8,25/10)', en: 'Secondary Education (GPA 8.25/10)' },
      org: 'IES Frei Martín Sarmiento',
      start: '2014-09',
      end: '2019-06',
      description: {
        es: 'Bachillerato en el IES Frei Martín Sarmiento (Pontevedra) con una nota media de 8,25/10',
        en: 'Secondary education at IES Frei Martín Sarmiento (Pontevedra) with a GPA of 8.25/10.',
      },
    },
    {
      id: 'debate-team',
      kind: 'sport',
      title: { es: 'Integrante del equipo de debate', en: 'Debate Team Member' },
      org: 'Pontevedra, Galicia',
      start: '2014-09',
      end: '2019-06',
      description: {
        es: 'Representé al centro en debates regionales y nacionales, incluida una sesión en el Parlamento de Galicia. Desarrollé la oratoria, el pensamiento crítico y la comunicación persuasiva, y trabajé en equipo investigando y preparando argumentos',
        en: 'Represented the school at regional and national-level debates, including a debate held at the Galician Parliament. Developed public speaking, critical thinking and persuasive communication skills, and collaborated with teammates to research and prepare arguments.',
      },
    },
  ],
};