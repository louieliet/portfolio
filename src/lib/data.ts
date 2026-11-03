// Types
export interface ProjectSection {
  id: string; // slug, used as anchor
  title: string;
  body: string[]; // paragraphs
  media?: { kind: "full" | "screens"; images: string[] }; // full = one landscape image; screens = row of 1-4 portrait phone screens. A .mp4 entry is a looping clip with its .webp sibling as poster.
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
  assets?: string[];
  assetAspect?: "4/3" | "9/16";
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
  linkLabel?: string;
  images?: string[];
  imageAspect?: "9/16";
  badge?: { label: string; text: string };
  category: "Web" | "Mobile" | "Gaming";
  sections?: ProjectSection[];
  team?: string[];
  // Animated mascot beside the title. Sources ordered like CastClip: HEVC alpha .mov for Safari, VP9 alpha .webm, still poster.
  mascot?: { mov: string; webm: string; poster: string };
}

export const personalInfo = {
  name: "Emiliano Montes Gómez",
  role: "Product Designer and Engineer",
  tagline: "I build scalable web and mobile products with strong UX foundations.",
  location: "Mexico City, Mexico",
  email: "emilianomg2003@hotmail.com",
  linkedin: "https://www.linkedin.com/in/emiliano-mg/",
  github: "https://github.com/louieliet",
  phone: "+52 735 135 1245",
  about: {
    history: "Product designer and engineer based in Mexico City. I graduated in Animation and Video Game Engineering from Universidad Panamericana, where I also completed a postgraduate specialization in Interactive Design and a diploma in Data Science. At Feeble I design and build web and native iOS products end to end.\n\nI build scalable web and mobile experiences that balance usability, visual clarity, and technical execution. My background in React, Next.js, React Native, SwiftUI, backend integrations, and game development gives me a broad perspective on how products are imagined, implemented, and improved.\n\nI am especially interested in frontend systems, mobile applications, interaction design, backend integrations, cloud computing, and big data. My goal is to contribute to products that create value by connecting design, code, and data into intuitive, maintainable, and high-performance digital experiences.",
    approach: [
      {
        title: "Understand",
        description: "Who it's for and what they need. Flows, constraints and the smallest thing worth building."
      },
      {
        title: "Design",
        description: "Wireframes to high fidelity in Figma, built on a design system."
      },
      {
        title: "Build",
        description: "React, Next.js, React Native and SwiftUI. Accessible, performant code."
      },
      {
        title: "Refine",
        description: "Motion, polish and iteration based on real use."
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
        year: "2025 - 2026"
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
    company: "Feeble.io",
    role: "Fullstack Developer & UX/UI Designer",
    period: "Jul 2026 - Present",
    description: "Building products end to end: Next.js web, native iOS in SwiftUI, a Convex backend, and the UX in Figma.",
    stack: ["Next.js", "TypeScript", "Swift", "SwiftUI", "Convex", "Figma"],
    assets: ["/projects/feeble01.png"],
    appStoreUrl: "https://feeble.io/"
  },
  {
    company: "iLuk.ai",
    role: "Frontend Engineer",
    period: "Dec 2025 - Jul 2026",
    description: "Built the frontend of an AI platform: scalable systems and high-performance UI components.",
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
    assetAspect: "9/16",
    description: "Led mobile frontend in React Native: set the architecture, owned EAS releases, mentored the team.",
    stack: ["React Native", "TypeScript", "Expo", "EAS", "Figma"],
    assets: ["/projects/vyvo-onboarding.png"],
    appStoreUrl: "https://apps.apple.com/mx/app/vyvo-ai/id6749719082",
    highlight: true
  },
  {
    company: "UPocket",
    role: "iOS Developer",
    period: "Jan 2025 - Aug 2025",
    description: "Shipped SwiftUI features for the Universidad Panamericana App Store app, including the campus space booking module.",
    stack: ["Swift", "SwiftUI", "REST APIs"]
  },
  {
    company: "Luyoa / Chain Solutions",
    role: "Frontend / Mobile Developer",
    period: "Aug 2023 - Mar 2025",
    description: "Web and mobile apps in React, Next.js and React Native for Luyoa, including Apple Wallet integrations, after a frontend internship building responsive React and Tailwind interfaces.",
    stack: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS", "Apple Wallet"],
    assets: ["/projects/luyoa01.png"],
    appStoreUrl: "https://luyoa.com/"
  },
]

export const projects = [
  {
    id: "luma",
    name: "Luma",
    subtitle: "Personal Organizer for iPhone",
    description: "A softer way to organize your day. Luma brings reminders, notes, habits, and to-dos into one calm iPhone app, with real alarms that ring through silent mode and Focus.",
    overview: "Luma replaces four apps with one. Reminders arrive as notifications or, when urgent, as real iPhone alarms. To-dos live in Today, Tomorrow, This week, or Someday. Notes save as you type, and habits keep streaks that skip days off. It works offline and syncs when back online.",
    focus: "As co-founder, I share product design and development with Iñaki Sigüenza, from the flows and interface to the Swift app and its Convex backend. Fernanda Rosas leads illustration and animation.",
    role: "Co-founder, Product Designer & iOS Developer",
    team: ["Emiliano Montes", "Iñaki Sigüenza", "Fernanda Rosas"],
    stack: ["Swift", "Convex"],
    year: "2026",
    link: "https://www.lumaproductivity.app/",
    linkLabel: "Visit Luma",
    images: ["/projects/luma-cover.svg"],
    imageAspect: "9/16",
    mascot: { mov: "/projects/luma/odi-flower.mov", webm: "/projects/luma/odi-flower.webm", poster: "/projects/luma/odi-flower-still.webp" },
    badge: { label: "Status", text: "Private beta, join the waitlist" },
    category: "Mobile",
    sections: [
      { id: "why-luma", title: "Why Luma", body: ["Most days end up split across four apps: reminders in one, notes in another, habits and to-dos somewhere else. Luma puts all of it in one calm iPhone app."], media: { kind: "screens", images: ["/projects/luma/day-home.mp4"] } },
      { id: "reminders", title: "Reminders that ring", body: ["Reminders arrive as notifications, or as real iPhone alarms when they are urgent. Alarms ring through silent mode and Focus, so the important ones never get buried."], media: { kind: "screens", images: ["/projects/luma/day-reminder.mp4", "/projects/luma/urgent-alarm.webp"] } },
      { id: "the-day", title: "A day in four lists", body: ["To-dos live in Today, Tomorrow, This week or Someday. Notes save as you type.", "Habits keep streaks that skip your days off, so a planned rest day never breaks a streak."], media: { kind: "screens", images: ["/projects/luma/feat-tasks.mp4", "/projects/luma/feat-notes.mp4", "/projects/luma/day-habit.mp4"] } },
      { id: "offline", title: "Built to work offline", body: ["Luma works offline and syncs when you are back online. The app is native Swift, and Convex runs the backend and sync."], media: { kind: "screens", images: ["/projects/luma/det-offline.mp4"] } },
      { id: "team", title: "The team", body: ["I co-founded Luma with Iñaki Sigüenza. We share product design and development, from the flows and interface to the Swift app and the Convex backend. Fernanda Rosas leads illustration and animation."], media: { kind: "screens", images: ["/projects/luma/team-emi.mp4", "/projects/luma/team-inaki.mp4", "/projects/luma/team-fer.mp4"] } },
      { id: "status", title: "Where it is now", body: ["Luma is in private beta. The waitlist is open at lumaproductivity.app."] }
    ]
  },
  {
    id: "iluk-landing",
    name: "iLuk.ai",
    subtitle: "Landing for AI Workers",
    description: "The marketing landing for iLuk, a startup selling AI Workers to financial institutions. I did all of it: positioning, copy, design, the AI-generated illustrations, GSAP motion and the Next.js build.",
    overview: "iLuk sells autonomous AI agents that run customer acquisition for banks and fintechs, from market insights to real-time KYC. The landing has to make an abstract product feel trustworthy to a cautious audience, so each agent appears as a coworker with a face, a name and a job.",
    focus: "A solo project inside my frontend role at iLuk. I owned the landing end to end: positioning and copy, a consistent AI-generated character cast, scroll choreography in GSAP and the Next.js build.",
    role: "Product Designer & Frontend Engineer",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
    year: "2026",
    link: "https://www.iluk.ai/",
    linkLabel: "Visit iLuk.ai",
    images: ["/projects/iluk-cover.webp"],
    badge: { label: "Status", text: "Live at iluk.ai" },
    category: "Web",
    sections: [
      { id: "the-brief", title: "The brief", body: ["iLuk asked for a landing that sells AI Workers to financial institutions. I owned all of it: positioning, copy, design, illustration, motion and code."], media: { kind: "full", images: ["/projects/iluk-landing/hero.webp"] } },
      { id: "workers", title: "Workers, not dashboards", body: ["Selling AI to banks means selling trust. Instead of software screenshots, each agent appears as a coworker with a face, a name and a job, like Carlos, the real-time KYC and onboarding auditor."], media: { kind: "full", images: ["/projects/iluk-landing/spotlight.webp"] } },
      { id: "cast", title: "One character system, generated with AI", body: ["I set up the image generation inside iLuk's AI stack and art-directed it into one consistent cast: the same line weight, palette and proportions across the hero cards, the worker spotlight and the isometric scene."], media: { kind: "full", images: ["/projects/iluk-landing/cast.webp"] } },
      { id: "scroll-story", title: "Scroll as a story", body: ["\"Every manual process is a client you lose.\" As you scroll, the cast scatters around that line, then one worker comes into focus while the rest blur.", "The choreography runs on GSAP ScrollTrigger."], media: { kind: "full", images: ["/projects/iluk-landing/scroll-story.mp4"] } },
      { id: "four-steps", title: "Four steps to go live", body: ["Putting AI inside a bank feels risky. The deployment section breaks it into four numbered steps, so it reads as a controlled process with a clear end."], media: { kind: "full", images: ["/projects/iluk-landing/four-steps.mp4"] } },
      { id: "delivery", title: "Build and delivery", body: ["Built with Next.js, React, TypeScript and Tailwind CSS, with motion in GSAP. Delivered and live at iluk.ai."] }
    ]
  },
  {
    id: "neura-path",
    name: "NeuraPath",
    subtitle: "STEM Career Recommender",
    metric: "1st place",
    metricLabel: "Swift Changemakers Hackathon 2025, Bosch Challenge",
    description: "Built an iOS vocational guidance app focused on promoting STEM careers through a gender-bias-free test, interactive flows, and a recommendation model using 16 personalities, multiple intelligences, and NLP.",
    overview: "NeuraPath helps students discover STEM career paths through a mobile experience that combines personality signals, learning preferences, and lightweight game interactions. The app was built during the National Swift Changemakers Hackathon 2025 for the Bosch Challenge.",
    focus: "The focus was product design and iOS execution: shaping the recommendation flow, designing fast and engaging interactions, and building the SwiftUI experience that connects assessment, career matching, and university enrollment actions.",
    role: "Product Designer & iOS Builder",
    stack: ["SwiftUI", "NLP", "ML", "Forms", "Career Matching"],
    year: "2025",
    images: ["/projects/neurapathcover.png", "/projects/neurapath01.png", "/projects/neurapath02.png", "/projects/neurapath03.png", "/projects/neurapath04.png", "/projects/neurapath05.png", "/projects/neurapath06.png", "/projects/neurapath07.png"],
    badge: { label: "Award", text: "1st place, National Swift Changemakers Hackathon 2025 (Bosch Challenge)" },
    category: "Mobile",
    sections: [
      { id: "challenge", title: "The challenge", body: ["The Bosch Challenge at the National Swift Changemakers Hackathon 2025 asked for technology with social impact. We chose vocational guidance: many students choose a career before they know which STEM paths fit them, and we wanted a test that never steers anyone by gender."] },
      { id: "the-test", title: "A test without bias", body: ["The assessment combines 16 personality types and multiple intelligences, written so no question or result is framed by gender. NLP reads open answers to add context to the match."], media: { kind: "screens", images: ["/projects/neurapath01.png", "/projects/neurapath02.png", "/projects/neurapath03.png"] } },
      { id: "next-step", title: "From result to enrollment", body: ["The flow connects the assessment, the career match and university enrollment actions, so a result leads to a next step instead of a dead end."], media: { kind: "screens", images: ["/projects/neurapath04.png", "/projects/neurapath05.png", "/projects/neurapath06.png"] } },
      { id: "build", title: "How I built it", body: ["I designed the flows and built the app in SwiftUI, keeping interactions short and game-like so the test feels fast."], media: { kind: "screens", images: ["/projects/neurapath07.png"] } },
      { id: "outcome", title: "Outcome", body: ["NeuraPath won 1st place in the Bosch Challenge."] }
    ]
  },
  {
    id: "wellty",
    name: "Wellty",
    subtitle: "Identity-Based Wellness App",
    metric: "1st place",
    metricLabel: "iOS Lab UP x Windsurf hackathon",
    description: "Winner of the iOS Lab Universidad Panamericana + Windsurf hackathon. Built a wellness app that moves beyond dashboards and metric overload by asking who you want to be today, then reinforcing that identity through 2-minute micro-actions, XP, and the seven dimensions of wellness.",
    overview: "Wellty is a wellness app that reframes self-care around identity instead of metrics. Rather than starting with dashboards, the experience asks who the user wants to be that day and turns that intention into short, actionable habits.",
    focus: "The product focus was designing a behavior loop that feels lightweight but meaningful: identity selection, 2-minute actions, XP feedback, and progress across the seven dimensions of wellness. I designed and built the SwiftUI experience with local persistence.",
    role: "Product Designer & iOS Builder",
    stack: ["SwiftUI", "iOS", "Wellness UX", "Gamification", "Local Persistence"],
    year: "2025",
    images: ["/projects/welltycover.png", "/projects/wellty01.png", "/projects/wellty02.png", "/projects/wellty03.png", "/projects/wellty04.png", "/projects/wellty05.png", "/projects/wellty06.png", "/projects/wellty07.png", "/projects/wellty09.png", "/projects/wellty10.png", "/projects/wellty11.png", "/projects/wellty12.png", "/projects/wellty13.png"],
    category: "Mobile",
    sections: [
      { id: "problem", title: "The problem", body: ["Most wellness apps open on a dashboard full of metrics. That is a lot of numbers to face before doing anything."] },
      { id: "identity", title: "Start with who you want to be", body: ["Wellty opens with one question: who do you want to be today? That intention turns into short, concrete habits."], media: { kind: "screens", images: ["/projects/wellty01.png", "/projects/wellty02.png", "/projects/wellty03.png"] } },
      { id: "micro-actions", title: "Two-minute actions", body: ["Each habit is a micro-action of about two minutes. Finishing one gives XP and moves your progress across the seven dimensions of wellness."], media: { kind: "screens", images: ["/projects/wellty04.png", "/projects/wellty05.png", "/projects/wellty06.png"] } },
      { id: "loop", title: "A loop that feels light", body: ["The goal was a behavior loop that feels light but still means something: choose an identity, act for two minutes, see the feedback."], media: { kind: "screens", images: ["/projects/wellty07.png", "/projects/wellty09.png", "/projects/wellty10.png"] } },
      { id: "build", title: "How I built it", body: ["I designed the experience and built it in SwiftUI with local persistence."], media: { kind: "screens", images: ["/projects/wellty11.png", "/projects/wellty12.png", "/projects/wellty13.png"] } },
      { id: "outcome", title: "Outcome", body: ["Wellty won 1st place at the iOS Lab Universidad Panamericana x Windsurf hackathon."] }
    ]
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
