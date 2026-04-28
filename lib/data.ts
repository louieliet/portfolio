// Types
export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
  assets?: string[];
  appStoreUrl?: string;
  highlight?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  role: string;
  stack: string[];
  year: string;
  highlight?: boolean;
  link?: string;
  images?: string[];
  category: "Web" | "Mobile" | "Gaming";
}

export const personalInfo = {
  name: "Emiliano Montes Gómez",
  role: "Frontend Engineer + UX/UI Designer",
  tagline: "I design and build end-to-end digital experiences. From user research to production code.",
  location: "Mexico City, Mexico",
  email: "emilianomg2003@hotmail.com",
  linkedin: "https://www.linkedin.com/in/emiliano-mg/",
  github: "https://github.com/louieliet", // Placeholder based on common pattern, will need user to confirm or update
  phone: "+52 735 135 1245",
  about: {
    history: "My career started in game development, but I discovered my true passion was designing experiences for real users, not just on-screen characters. Today, I combine product design with frontend engineering. I don't just implement designs given to me; I design the complete experience (research, wireframes, prototypes) and then build it in production code. I don't need a 2-week handoff between design and development because both live in my head simultaneously.",
    approach: [
      {
        title: "Research",
        description: "Understand the user, don't assume. User interviews, analytics, journey mapping."
      },
      {
        title: "Design",
        description: "Wireframes → Prototypes → High-fidelity. Figma, design systems, usability testing."
      },
      {
        title: "Build",
        description: "Clean, performant, accessible code. React/React Native, TypeScript, SwiftUI."
      },
      {
        title: "Iterate",
        description: "Measure, learn, improve. User feedback, A/B testing, continuous improvement."
      }
    ],
    education: [
      {
        degree: "Animation and Video Game Engineering",
        institution: "Universidad Panamericana",
        year: "2021 - 2025"
      },
      {
        degree: "Interactive Design postgraduate (UX/UI)",
        institution: "Universidad Panamericana", // User didn't specify
        year: "2025 - Present"
      },
      {
        degree: "Data Science Diploma",
        institution: "Universidad Panamericana", // User didn't specify
        year: "2025 - Present"
      }
    ],
    interests: [
      "I consume a lot of editorial design, typography, and design system content. Brutalism is my guilty pleasure.",
      "I read about cognitive psychology, behavioral design, and design theory.",
      "I still play video games, but now I analyze them from a UX perspective."
    ]
  }
}

export const stack = {
  design: ["Figma", "Wireframing", "Prototyping", "User Research", "Usability Testing"],
  frontend: ["React / Next.js", "TypeScript", "Tailwind CSS", "Design Systems", "Accessibility", "WordPress"],
  mobile: ["SwiftUI", "React Native", "Mobile UX Patterns"],
  gaming: ["Unity 3D / 2D", "Game UX Design", "C#"],
  backend: ["Firebase", "RESTful APIs", "Git / CI/CD"]
}

// Professional Experience (Companies)
export const experience: ExperienceItem[] = [
  {
    company: "iLuk.ai",
    role: "Frontend Engineer + UX/UI Designer",
    period: "Dec 2025 - Present",
    description: "Frontend Engineer + Product Designer building AI-worker product experiences end-to-end. Led UX definition and frontend delivery in Next.js, shipping features for AI Visibility and automated workflows for content operations, task execution, and role-based assistants.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    assets: [
      "/projects/iluk01.png",
      "/projects/iluk02.png",
      "/projects/iluk03.png",
      "/projects/iuk04.png"
    ],
    appStoreUrl: "https://www.iluk.ai/"
  },
  {
    company: "Vyvo Tech",
    role: "Frontend Lead Engineer → Product Designer → Frontend Developer",
    period: "Oct 2025 - Dec 2025",
    description: "Progressed from Frontend Developer to Frontend Lead Engineer while also driving Product Design. Built core React Native experiences, led UX research and prototyping, guided frontend decisions, and shipped the app to the App Store.",
    stack: ["React Native", "TypeScript", "EAS", "Figma", "UX Research", "AI Integration"],
    assets: [
      "/projects/vyvo01.webp",
      "/projects/vyvo02.webp",
      "/projects/vyvo03.webp"
    ],
    appStoreUrl: "https://apps.apple.com/mx/app/vyvo-ai/id6749719082",
    highlight: true
  },
  {
    company: "Pulse Studio",
    role: "Frontend Developer",
    period: "Apr 2025 - Aug 2025",
    description: "Frontend Developer with UX Research collaboration for client websites in WordPress. Turned research insights into practical UI improvements and delivered responsive, conversion-focused web experiences with strong design alignment.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    company: "Legaltec",
    role: "Fullstack Developer",
    period: "Mar 2025 - Aug 2025",
    description: "Developed web applications using NextJS, TypeScript, and TailwindCSS. Built backend services using Firebase and NodeJS. Integrated APIs and contributed to scalable cloud-based architectures.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "NodeJS"]
  },
  {
    company: "Luyoa",
    role: "Frontend Developer",
    period: "Dec 2024 - Mar 2025",
    description: "Frontend Developer for Apple Wallet and digital loyalty solutions. Implemented user flows for enrollment, pass usage, and retention touchpoints, ensuring reliable cross-device behavior and clear user journeys.",
    stack: ["React", "TypeScript", "CSS"]
  },
  {
    company: "Chain Solutions",
    role: "Frontend Developer",
    period: "Aug 2023 - Dec 2024",
    description: "Frontend Developer for corporate web projects in Next.js. Worked across implementation, UX research input, and design support to deliver performant, responsive sites for clients such as Hus and Ragabe.",
    stack: ["Next.js", "Tailwind CSS", "React"]
  }
]

// Academic & Lab Experience
export const academicExperience: ExperienceItem[] = [
  {
    company: "iOS Development Lab UPMX",
    role: "Frontend Developer",
    period: "Jan 2025 - Oct 2025",
    description: "iOS application development in SwiftUI. Explored modern iOS development patterns and best practices.",
    stack: ["Swift", "SwiftUI", "iOS Development"]
  },
  {
    company: "Blank Canvas",
    role: "Co-founder",
    period: "Aug 2023 - Present",
    description: "Co-founded an innovation group within iOS Lab UP. Developed 2 apps: Fashion Finder and Notably. Led the design thinking process: research, wireframing, prototyping, and development in SwiftUI.",
    stack: ["Swift", "SwiftUI", "CoreML", "ARKit", "Figma"]
  },
  {
    company: "PCI Lab UP",
    role: "Gameplay Development Leader",
    period: "Jan 2024 - Present",
    description: "Coordinator of design and implementation of game mechanics in Unity 3D. Led the Gameplay Development team to create the demo for the game Lotus, winner of the ILAN 2023 award, presented in Israel.",
    stack: ["Unity 3D", "C#", "Game UX Design"]
  }
  ,
  {
    company: "Animation & Videogame Engineering Student Association",
    role: "President",
    period: "Jul 2023 - Jul 2024",
    description: "Organized academic and professional development events and represented student interests before faculty and administration.",
    stack: []
  }
]

export const projects = [
  {
    id: "lotus",
    name: "Lotus",
    subtitle: "Serious Game",
    description: "Educational video game in Unity 3D that teaches emotional intelligence through gameplay. Winner of the ILAN 2023 Award (Israel-Mexico). Presented in Israel.",
    role: "UX Designer & Gameplay Developer",
    stack: ["Unity 3D", "C#", "Figma", "Game UX Design"],
    year: "2023-2025",
    highlight: true,
    category: "Gaming"
  },
  {
    id: "nba-insights",
    name: "NBA Insights",
    subtitle: "Big Data + ML Platform",
    description: "Big Data project for class where a Hadoop cluster was modernized into a BigQuery-based architecture with a frontend-consumable ML model. The app lets users explore player and team statistics, plus a Victory Predictor trained on 600K+ NBA games to estimate whether a team won from player stats.",
    role: "Data + Frontend Builder",
    stack: ["BigQuery", "BigQuery ML", "Hadoop", "React", "Data Viz"],
    year: "2025",
    link: "https://nba-insights-web-six.vercel.app/",
    images: ["/projects/nba01.png", "/projects/nba02.png", "/projects/nba03.png", "/projects/nba04.png", "/projects/nba05.png", "/projects/nba06.png"],
    category: "Web"
  },
  {
    id: "sat-redesign",
    name: "SAT Redesign",
    subtitle: "UX Redesign",
    description: "User experience design project focused on redesigning the flows for getting an RFC and scheduling an appointment. The work was informed by UX research, including user journeys and interviews, to reduce friction and improve clarity across the process.",
    role: "UX Designer",
    stack: ["UX Research", "User Journeys", "Interviews", "Wireframing", "Prototyping"],
    year: "2025",
    link: "https://sat-ux-redesign.vercel.app/",
    images: ["/projects/sat01.png", "/projects/sat02.png", "/projects/sat03.png", "/projects/sat04.png", "/projects/sat05.png", "/projects/sat06.png", "/projects/sat07.png", "/projects/sat08.png", "/projects/sat09.png"],
    category: "Web"
  },
  {
    id: "neura-path",
    name: "NeuraPath",
    subtitle: "STEM Career Recommender",
    description: "Winner – National Swift Changemakers Hackathon 2025 (Bosch Challenge). Built a student-facing experience that combines swipe cards, a quick-thinking mini game, and a model using 16 personalities, multiple intelligences, and NLP to recommend an ideal STEM career and send users directly to university enrollment pages.",
    role: "Product Designer & iOS Builder",
    stack: ["SwiftUI", "NLP", "ML", "Forms", "Career Matching"],
    year: "2025",
    images: ["/projects/neurapathcover.png", "/projects/neurapath01.png", "/projects/neurapath02.png", "/projects/neurapath03.png", "/projects/neurapath04.png", "/projects/neurapath05.png", "/projects/neurapath06.png", "/projects/neurapath07.png"],
    category: "Mobile"
  },
  {
    id: "wellty",
    name: "Wellty",
    subtitle: "Identity-Based Wellness App",
    description: "Winner of the iOS Lab Universidad Panamericana + Windsurf hackathon. Built a wellness app that moves beyond dashboards and metric overload by asking who you want to be today, then reinforcing that identity through 2-minute micro-actions, XP, and the seven dimensions of wellness.",
    role: "Product Designer & iOS Builder",
    stack: ["SwiftUI", "iOS", "Wellness UX", "Gamification", "Local Persistence"],
    year: "2025",
    images: ["/projects/welltycover.png", "/projects/wellty01.png", "/projects/wellty02.png", "/projects/wellty03.png", "/projects/wellty04.png", "/projects/wellty05.png", "/projects/wellty06.png", "/projects/wellty07.png", "/projects/wellty09.png", "/projects/wellty10.png", "/projects/wellty11.png", "/projects/wellty12.png", "/projects/wellty13.png"],
    category: "Mobile"
  },
  {
    id: "hus",
    name: "Hus Website",
    subtitle: "Corporate Website",
    description: "Corporate website developed in Next.js and Tailwind CSS. Led design and frontend implementation.",
    role: "Design & Frontend Lead",
    stack: ["Next.js", "Tailwind CSS", "React"],
    year: "2023-2024",
    link: "https://hus-demo.vercel.app/",
    images: ["/projects/huscover.png"],
    category: "Web"
  },
  {
    id: "meraki",
    name: "Project Meraki",
    subtitle: "Unity 2D Game",
    description: "Video game developed in Unity 2D. Led the programming team.",
    role: "Programming Team Leader",
    stack: ["Unity 2D", "C#"],
    year: "2024-2025",
    link: "https://louieliet.itch.io/mechapaws",
    images: ["/projects/merakicover.png"],
    category: "Gaming"
  }
]

export const certifications = [
  { name: "Unity Essentials Pathway", issuer: "Unity", year: 2023 },
  { name: "App Development with Swift Associate", issuer: "Apple", year: 2024 }
]

export const languages = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "TOEFL Certified – 2024" }
]

// Additional professional experiences not previously listed
export const additionalExperience: ExperienceItem[] = [
  {
    company: "Unity 3D Developer – Contagion / Nazora Studios",
    role: "Unity 3D Developer",
    period: "Jan 2024 - Aug 2024",
    description: "Designed and developed core gameplay systems and foundational architecture for Unity 3D projects. Implemented modular character and enemy systems and collaborated on performance optimization.",
    stack: ["Unity 3D", "C#"]
  },
  {
    company: "Grupo CARSO / CTIN",
    role: "Unity Developer Intern",
    period: "May 2024 - Nov 2024",
    description: "Developed AR filters and 2D mini-games; contributed to backend services and cloud integrations.",
    stack: ["Unity", "Spark AR", "Effect House"]
  }
]
