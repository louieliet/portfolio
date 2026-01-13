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

export const experience = [
  {
    company: "iLuk.ai",
    role: "Frontend Engineer + UX/UI Designer",
    period: "Dec 2025 - Present",
    description: "Frontend Engineer and UX/UI Designer at iLuk, a growth stack platform that helps companies improve their AI Visibility and optimize SEO + GEO. Built with Next.js.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  {
    company: "Vyvo Tech",
    role: "Frontend Lead Engineer",
    period: "Oct 2025 - Dec 2025",
    description: "Led mobile app development, focusing on building high-quality, performant, and user-centered experiences. Oversaw the frontend team, guiding architecture decisions, reviewing code, and ensuring design system alignment. Managed build and deployment with EAS.",
    stack: ["React Native", "EAS", "TypeScript"]
  },
  {
    company: "Vyvo Tech",
    role: "Frontend Developer & Product Designer",
    period: "Sep 2025 - Oct 2025",
    description: "Focused on building performant, scalable experiences. Translated designs into seamless digital experiences. Specialized in UX design: researching user needs, defining flows, creating prototypes, and testing solutions.",
    stack: ["React Native", "Figma", "UX Research"]
  },
  {
    company: "Vyvo Tech",
    role: "Frontend Developer",
    period: "Aug 2025 - Oct 2025",
    description: "Frontend development in React Native.",
    stack: ["React Native", "TypeScript"]
  },
  {
    company: "iOS Development Lab UPMX",
    role: "Frontend Developer",
    period: "Jan 2025 - Oct 2025",
    description: "iOS application development.",
    stack: ["Swift", "SwiftUI"]
  },
  {
    company: "Blank Canvas",
    role: "Co-founder",
    period: "Aug 2023 - Oct 2025",
    description: "Co-founded an innovation group within iOS Lab UP. Developed 2 apps: Fashion Finder and Notably. Led the design thinking process: research, wireframing, prototyping, and development in SwiftUI.",
    stack: ["Swift", "SwiftUI", "CoreML", "ARKit", "Figma"]
  },
  {
    company: "Panteras Play",
    role: "Programming Team Leader",
    period: "Aug 2024 - Oct 2025",
    description: "Led the programming team in the development of the video game Meraki in Unity 2D.",
    stack: ["Unity 2D", "C#"]
  },
  {
    company: "PCI Lab UP",
    role: "Gameplay Development Leader",
    period: "Aug 2023 - Oct 2025",
    description: "Coordinator of design and implementation of game mechanics in Unity 3D. Led the Gameplay Development team to create the demo for the game Lotus, winner of the ILAN 2023 award, presented in Israel.",
    stack: ["Unity 3D", "C#", "Game UX Design"]
  },
  {
    company: "Chain Solutions",
    role: "Frontend Developer",
    period: "Aug 2023 - Dec 2024",
    description: "Frontend development of corporate websites. Worked on projects like Hus and Ragabe.",
    stack: ["Next.js", "Tailwind CSS", "React"]
  }
]

export const projects = [
  {
    id: "vyvo",
    name: "Vyvo Tech",
    subtitle: "AI Social Network",
    description: "Social network where users interact with AI agents. Like Instagram/TikTok but with avatars that can like, comment, and have natural conversations. I designed and implemented views in React Native.",
    role: "Frontend Engineer & UX/UI Designer",
    stack: ["React Native", "TypeScript", "AI Integration"],
    year: "2025",
    highlight: true,
    link: "#", // Needs link
    category: "Mobile"
  },
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
