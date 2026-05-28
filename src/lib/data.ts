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
  overview: string;
  focus: string;
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
  role: "Frontend and Mobile Engineer",
  tagline: "I build scalable web and mobile products with strong UX foundations.",
  location: "Mexico City, Mexico",
  email: "emilianomg2003@hotmail.com",
  linkedin: "https://www.linkedin.com/in/emiliano-mg/",
  github: "https://github.com/louieliet",
  phone: "+52 735 135 1245",
  about: {
    history: "I am an Animation and Video Game Engineer from Universidad Panamericana, currently pursuing a postgraduate specialization in Interactive Design and a diploma in Data Science. My work sits at the intersection of frontend engineering, mobile development, product design, and data-informed thinking.\n\nI build scalable web and mobile experiences that balance usability, visual clarity, and technical execution. My background in React, Next.js, React Native, SwiftUI, backend integrations, and game development gives me a broad perspective on how products are imagined, implemented, and improved.\n\nI am especially interested in frontend systems, mobile applications, interaction design, backend integrations, cloud computing, and big data. My goal is to contribute to products that create value by connecting design, code, and data into intuitive, maintainable, and high-performance digital experiences.",
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
        degree: "Postgraduate Specialization in Interactive Design",
        institution: "Universidad Panamericana",
        year: "2025 - 2026"
      },
      {
        degree: "Data Science Diploma",
        institution: "Universidad Panamericana",
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
  design: ["Figma", "UX Research", "Prototyping", "Design Systems", "User-Centered Design"],
  frontend: ["React / Next.js", "TypeScript", "Tailwind CSS", "Design Systems", "WordPress"],
  mobile: ["Swift", "SwiftUI", "UIKit", "React Native", "Expo", "Apple Wallet"],
  gaming: ["Unity 3D / 2D", "C#", "C++", "Game UX Design"],
  backend: ["Node.js", "Firebase", "REST APIs", "Google Cloud", "Git / CI/CD"],
  data: ["SQL", "ETL", "Data Processing", "Big Data Fundamentals"]
}

// Professional Experience (Companies)
export const experience: ExperienceItem[] = [
  {
    company: "iLuk.ai",
    role: "Frontend Engineer",
    period: "Dec 2025 - Present",
    description: "Develop and maintain scalable frontend systems for AI-driven digital platforms. Build high-performance UI components aligned with product vision and business goals, collaborating with multidisciplinary teams to deliver user-centered features with measurable impact.",
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
    role: "Frontend Lead Engineer",
    period: "Oct 2025 - Dec 2025",
    description: "Led frontend development for mobile applications using React Native and Expo. Defined frontend architecture, supervised code quality standards, managed EAS build and deployment processes, and mentored developers to align implementation with product strategy.",
    stack: ["React Native", "TypeScript", "Expo", "EAS", "Figma"],
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
    role: "Web Designer",
    period: "Apr 2025 - Aug 2025",
    description: "Designed and developed SEO-optimized WordPress websites. Created UX/UI prototypes in Figma, ensured brand consistency, and delivered responsive digital experiences focused on performance.",
    stack: ["WordPress", "Figma", "SEO", "Responsive Design"]
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
    role: "Frontend / Mobile Developer",
    period: "Dec 2024 - Mar 2025",
    description: "Developed web and mobile applications using React, Next.js, and React Native, with a focus on responsive interfaces and user experience. Implemented Apple Wallet solutions and mobile integrations while optimizing scalable and maintainable digital flows.",
    stack: ["React", "Next.js", "React Native", "TypeScript", "Apple Wallet"]
  },
  {
    company: "Contagion / Nazora Studios",
    role: "Unity 3D Developer",
    period: "Jan 2024 - Aug 2024",
    description: "Designed and developed core gameplay systems and base architecture in Unity 3D. Implemented modular character and enemy systems, programmed movement, state, and interaction mechanics, and contributed to performance optimization and debugging for real-time interactive systems.",
    stack: ["Unity 3D", "C#"]
  },
  {
    company: "Chain Solutions",
    role: "Frontend Developer Intern",
    period: "Aug 2023 - Dec 2024",
    description: "Developed responsive web interfaces with React and Tailwind CSS. Participated in fullstack implementations using Next.js and TypeScript for corporate web projects.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    company: "Grupo CARSO / CTIN",
    role: "Unity Developer Intern",
    period: "May 2024 - Nov 2024",
    description: "Developed AR filters with Spark AR and Effect House, created 2D mini-games in Unity, and contributed to backend services in Google Cloud.",
    stack: ["Unity", "Spark AR", "Effect House", "Google Cloud"]
  }
]

// Academic & Lab Experience
export const academicExperience: ExperienceItem[] = [
  {
    company: "UPocket, Universidad Panamericana",
    role: "iOS Developer",
    period: "Jan 2025 - Aug 2025",
    description: "Developed SwiftUI-based features for UPocket, an iOS application published on the App Store for Universidad Panamericana students. Led the campus space reservation module, connected mobile views to REST APIs, and implemented reusable UI patterns, loading states, user interactions, and error-aware flows.",
    stack: ["Swift", "SwiftUI", "REST APIs", "iOS Development"]
  },
  {
    company: "Blank Canvas",
    role: "Co-founder / iOS Developer",
    period: "Aug 2023 - Present",
    description: "Lead iOS development and product design, defining mobile flows, initial architecture, and user-centered interfaces. Develop SwiftUI features and coordinate UX, visual design, and technical architecture decisions for maintainable mobile experiences.",
    stack: ["Swift", "SwiftUI", "Figma", "Mobile UX", "Product Design"]
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
    id: "integra-ai",
    name: "Integra AI",
    subtitle: "B2B AI Consultancy Landing Page",
    description: "Landing page for a B2B AI consultancy. Designed and built a conversion-focused website that communicates services, process, team credibility, and contact flows through a clean responsive interface, bilingual navigation, animated hero, and production-oriented messaging.",
    overview: "Integra AI is a B2B landing page for an AI consultancy focused on agents, CRM/ERP integrations, MLOps, and AI strategy. The site turns a complex technical offer into a clear commercial experience, guiding visitors from business pain points to services, process, team credibility, proof points, and contact.",
    focus: "My focus was shaping the UX narrative and frontend execution: building a sharp hero, service structure, process section, team storytelling, responsive layouts, animated canvas ribbon, bilingual navigation, and contact flow. The goal was to make enterprise AI feel concrete, understandable, and conversion-ready.",
    role: "Frontend Engineer & UX/UI Designer",
    stack: ["Astro", "Tailwind CSS", "JavaScript", "Canvas", "Responsive Design", "SEO"],
    year: "2026",
    link: "https://integra-group.ai/",
    images: [
      "/projects/integra-cover.png",
      "/projects/integra01.png",
      "/projects/integra02.png",
      "/projects/integra03.png",
      "/projects/integra04.png",
    ],
    category: "Web"
  },
  {
    id: "lotus",
    name: "Lotus",
    subtitle: "Serious Game",
    description: "Educational video game in Unity 3D that teaches emotional intelligence through gameplay. Winner of the ILAN 2023 Award (Israel-Mexico). Presented in Israel.",
    overview: "Lotus is a serious game designed to teach emotional intelligence through interactive play. The project combines narrative, exploration, and guided decision-making to help players recognize emotions and practice healthier responses in a safe digital environment.",
    focus: "The work centered on translating learning goals into game mechanics, UX flows, and Unity systems. I contributed to the gameplay structure, interface decisions, and interaction design so the experience could feel approachable while still supporting the educational purpose.",
    role: "UX Designer & Gameplay Developer",
    stack: ["Unity 3D", "C#", "Figma", "Game UX Design"],
    year: "2023-2025",
    highlight: true,
    images: [
      "/projects/lotuscover.png",
      "/projects/lotus01.png",
      "/projects/lotus02.png",
      "/projects/lotus03.png",
      "/projects/lotus04.png",
      "/projects/lotus06.png",
      "/projects/lotus07.png",
      "/projects/lotus08.png",
    ],
    category: "Gaming"
  },
  {
    id: "nba-insights",
    name: "NBA Insights",
    subtitle: "Big Data + ML Platform",
    description: "Big Data project for class where a Hadoop cluster was modernized into a BigQuery-based architecture with a frontend-consumable ML model. The app lets users explore player and team statistics, plus a Victory Predictor trained on 600K+ NBA games to estimate whether a team won from player stats.",
    overview: "NBA Insights is a data product that turns a large basketball dataset into an explorable web experience. The project modernizes a Hadoop-based workflow into BigQuery and exposes team, player, and prediction data through a frontend interface.",
    focus: "The main focus was connecting the data layer with a usable product surface: preparing BigQuery outputs, working with BigQuery ML, and designing a React interface that made statistics and win predictions easier to understand.",
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
    overview: "SAT Redesign is a UX case study focused on reducing friction in two high-stress government service flows: getting an RFC and scheduling an appointment. The redesign was grounded in user journeys, interviews, and pain-point mapping.",
    focus: "The work focused on simplifying decision points, clarifying next steps, and restructuring the experience around user intent instead of institutional complexity. The output prioritized clearer information architecture, lower cognitive load, and more predictable flows.",
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
    description: "Winner – National Swift Changemakers Hackathon 2025 (Bosch Challenge). Built an iOS vocational guidance app focused on promoting STEM careers through a gender-bias-free test, interactive flows, and a recommendation model using 16 personalities, multiple intelligences, and NLP.",
    overview: "NeuraPath helps students discover STEM career paths through a mobile experience that combines personality signals, learning preferences, and lightweight game interactions. The app was built during the National Swift Changemakers Hackathon 2025 for the Bosch Challenge.",
    focus: "The focus was product design and iOS execution: shaping the recommendation flow, designing fast and engaging interactions, and building the SwiftUI experience that connects assessment, career matching, and university enrollment actions.",
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
    overview: "Wellty is a wellness app that reframes self-care around identity instead of metrics. Rather than starting with dashboards, the experience asks who the user wants to be that day and turns that intention into short, actionable habits.",
    focus: "The product focus was designing a behavior loop that feels lightweight but meaningful: identity selection, 2-minute actions, XP feedback, and progress across the seven dimensions of wellness. I designed and built the SwiftUI experience with local persistence.",
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
    overview: "Hus Website is a corporate web project built to present the brand, services, and business context through a clean responsive experience. The site was developed with Next.js and Tailwind CSS for a production-oriented frontend workflow.",
    focus: "The focus was owning the design-to-code path: shaping the visual direction, implementing reusable frontend sections, and making sure the site worked across responsive breakpoints with a clear, professional presentation.",
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
    overview: "Project Meraki is a Unity 2D game built around a polished playable experience, with core systems for movement, interaction, and level progression. The project required close coordination between gameplay design, programming, and asset integration.",
    focus: "My focus was leading the programming side: organizing implementation tasks, building gameplay systems in C#, and keeping the technical work aligned with the team's creative direction and production needs.",
    role: "Programming Team Leader",
    stack: ["Unity 2D", "C#"],
    year: "2024-2025",
    link: "https://louieliet.itch.io/mechapaws",
    images: [
      "/projects/merakicover.png",
      "/projects/meraki01.png",
      "/projects/meraki02.png",
      "/projects/meraki03.png",
      "/projects/meraki04.png",
    ],
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
