# Emiliano Montes - Portfolio

A brutalist-minimalist portfolio built with Next.js 16, featuring premium animations with Lenis and GSAP.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: 
  - Lenis (~3KB) - Smooth scroll
  - GSAP + ScrollTrigger (~15KB) - Scroll-based animations
- **UI Components**: Shadcn/UI (ready to use)

## Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + Tailwind
├── components/            # React components
│   ├── hero.tsx
│   ├── experience.tsx
│   ├── projects.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   ├── scroll-progress.tsx
│   ├── smooth-scroll-provider.tsx
│   └── animations-provider.tsx
├── lib/
│   ├── data.ts           # Portfolio content (edit here!)
│   ├── animation-config.ts # Animation settings
│   └── hooks/
│       ├── use-lenis.ts
│       └── use-gsap-animations.ts
└── ANIMATIONS.md         # Animation documentation
```

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## Editing Content

All portfolio content is centralized in `lib/data.ts`. Edit this file to update:
- Personal information
- Work experience
- Projects
- Skills/stack
- About section

## Customizing Animations

Edit `lib/animation-config.ts` to adjust:
- Smooth scroll speed
- Animation durations
- Easing functions
- Parallax intensity

See `ANIMATIONS.md` for detailed documentation.

## Design Philosophy

**Brutalist Minimalism**: Clean, bold typography. High contrast. No unnecessary decorations.

**Premium Subtlety**: Animations are present but never distracting. 60fps guaranteed.

## Performance

- Lighthouse Score: 100/100 (aim)
- Total JS bundle: ~50KB (including animations)
- First Contentful Paint: <1s
- Time to Interactive: <2s

## Browser Support

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

## Accessibility

- WCAG AA compliant
- Respects `prefers-reduced-motion`
- Keyboard navigation
- Screen reader friendly

## License

Personal portfolio - All rights reserved © 2026 Emiliano Montes
