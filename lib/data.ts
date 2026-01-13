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
    description: "Frontend Engineer and UX/UI Designer at iLuk, a growth stack platform that helps companies improve their AI Visibility and optimize SEO + GEO. Built with Next.js.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  {
    company: "Vyvo Tech",
    role: "Frontend Lead Engineer → Product Designer → Frontend Developer",
    period: "Aug 2025 - Dec 2025",
    description: "Built an AI-powered social network where users interact with AI agents (like Instagram/TikTok but with avatars that can like, comment, and have natural conversations). Led mobile app development from frontend developer to lead engineer. Designed and implemented views in React Native, conducted UX research, created prototypes, and oversaw the frontend team. Managed architecture decisions, code reviews, design system alignment, and deployment with EAS. App published on App Store.",
    stack: ["React Native", "TypeScript", "EAS", "Figma", "UX Research", "AI Integration"],
    assets: [
      "/projects/vyvo-1.png",
      "/projects/vyvo-2.png",
      "/projects/vyvo-3.png"
    ],
    appStoreUrl: "https://apps.apple.com/app/vyvo", // User needs to provide actual URL
    highlight: true
  },
  {
    company: "Pulse Studio",
    role: "Frontend Developer",
    period: "Apr 2025 - Aug 2025",
    description: "Frontend development using modern frameworks and best practices. Collaborated on building responsive and performant web applications.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    company: "Luyoa",
    role: "Frontend Developer",
    period: "Jan 2025 - May 2025",
    description: "Frontend development focused on creating intuitive user interfaces and seamless user experiences.",
    stack: ["React", "TypeScript", "CSS"]
  },
  {
    company: "Chain Solutions",
    role: "Frontend Developer",
    period: "Aug 2023 - Dec 2024",
    description: "Frontend development of corporate websites. Worked on projects like Hus and Ragabe.",
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
    id: "blank-canvas",
    name: "Blank Canvas",
    subtitle: "iOS Innovation Studio",
    description: "Co-founded an innovation group within the iOS Lab at Universidad Panamericana. Developed 2 apps (Fashion Finder, Notably) using SwiftUI, CoreML, and ARKit.",
    role: "Co-founder, Product Designer & iOS Developer",
    stack: ["SwiftUI", "CoreML", "ARKit", "Figma", "Firebase"],
    year: "2023-2025",
    category: "Mobile"
  },
  {
    id: "fashion-finder",
    name: "Fashion Finder",
    subtitle: "ML Personal Stylist",
    description: "iOS app with machine learning that suggests outfits based on your mood, the weather, and your digital closet. I trained a custom ML model with CoreML.",
    role: "UX Designer & iOS Developer",
    stack: ["SwiftUI", "CoreML (Custom)", "Firebase"],
    year: "Personal Project",
    category: "Mobile"
  },
  {
    id: "notably",
    name: "Notably",
    subtitle: "iOS App",
    description: "iOS application developed under Blank Canvas. Focused on [Add specific description if available].",
    role: "iOS Developer",
    stack: ["SwiftUI", "Swift"],
    year: "2023-2025",
    category: "Mobile"
  },
  {
    id: "habitus",
    name: "Habitus",
    subtitle: "Habit Tracker App",
    description: "Habit tracking app built in React Native and Firebase. Tracks daily habits, shows progress, and includes a reminder system.",
    role: "React Native Developer",
    stack: ["React Native", "Firebase", "Push Notifications"],
    year: "Personal Project",
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
    id: "ragabe",
    name: "Ragabe Website",
    subtitle: "Business Website",
    description: "Business page with responsive design. Worked on layout, components, and visual polish.",
    role: "Frontend Developer",
    stack: ["Next.js", "React", "Tailwind CSS"],
    year: "2023-2024",
    link: "https://dev.ragabe.git.chainsol.io/",
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
