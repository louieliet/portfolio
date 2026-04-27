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
  github: "https://github.com/Emiliano-MG", // Placeholder based on common pattern, will need user to confirm or update
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
        degree: "Interactive Design Specialization (UX/UI)",
        institution: "[Institution]", // User didn't specify
        year: "2025"
      },
      {
        degree: "Data Science Diploma",
        institution: "[Institution]", // User didn't specify
        year: "In progress"
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
  frontend: ["React / Next.js", "TypeScript", "Tailwind CSS", "Design Systems", "Accessibility"],
  mobile: ["SwiftUI", "React Native", "iOS HIG", "Mobile UX Patterns"],
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
    period: "Aug 2025 - Dec 2025",
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
    company: "Luyoa",
    role: "Frontend Developer",
    period: "Jan 2025 - May 2025",
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
    period: "Aug 2023 - Oct 2025",
    description: "Co-founded an innovation group within iOS Lab UP. Developed 2 apps: Fashion Finder and Notably. Led the design thinking process: research, wireframing, prototyping, and development in SwiftUI.",
    stack: ["Swift", "SwiftUI", "CoreML", "ARKit", "Figma"]
  },
  {
    company: "PCI Lab UP",
    role: "Gameplay Development Leader",
    period: "Aug 2023 - Oct 2025",
    description: "Coordinator of design and implementation of game mechanics in Unity 3D. Led the Gameplay Development team to create the demo for the game Lotus, winner of the ILAN 2023 award, presented in Israel.",
    stack: ["Unity 3D", "C#", "Game UX Design"]
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
    description: "Winner of the Apple Enactus Hackathon 2025 Swift Change Makers challenge for Bosch. Built a student-facing experience that combines swipe cards, a quick-thinking mini game, and a model using 16 personalities, multiple intelligences, and NLP to recommend an ideal STEM career and send users directly to university enrollment pages.",
    role: "Product Designer & iOS Builder",
    stack: ["SwiftUI", "NLP", "ML", "Forms", "Career Matching"],
    year: "2025",
    images: ["/projects/neurapath01.png", "/projects/neurapath02.png", "/projects/neurapath03.png", "/projects/neurapath04.png", "/projects/neurapath05.png", "/projects/neurapath06.png", "/projects/neurapath07.png"],
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
    category: "Gaming"
  }
]
