'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Animation variants for consistent use across components
 */
export const animations = {
  // Fade + slide up animation for text elements
  fadeIn: {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (i = 0) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8
      } 
    })
  },
  
  // Pure motion animations without opacity
  slideUp: {
    hidden: { 
      y: 40
    },
    visible: (i = 0) => ({ 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8
      } 
    })
  },
  
  slideLeft: {
    hidden: { 
      x: 40
    },
    visible: (i = 0) => ({ 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8
      } 
    })
  },
  
  slideRight: {
    hidden: { 
      x: -40
    },
    visible: (i = 0) => ({ 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8
      } 
    })
  },
  
  scale: {
    hidden: { 
      scale: 0.85
    },
    visible: (i = 0) => ({ 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        delay: i * 0.1,
        duration: 0.8
      } 
    })
  },
  
  // Reveal text line by line with stagger effect
  textReveal: {
    hidden: { 
      opacity: 0,
      y: 40 
    },
    visible: (i = 0) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: 0.2 + i * 0.1,
        duration: 0.8
      }
    })
  },
  
  // No-opacity version of textReveal
  textMotion: {
    hidden: { 
      y: 40,
      skewY: 1
    },
    visible: (i = 0) => ({ 
      y: 0,
      skewY: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: 0.2 + i * 0.1,
        duration: 0.8
      }
    })
  },
  
  // Editorial-style rotated image reveal
  imageReveal: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      rotate: -2
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        duration: 1.2
      }
    }
  },
  
  // No-opacity version of imageReveal
  imageMotion: {
    hidden: { 
      scale: 0.95,
      rotate: -2
    },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        duration: 1.2
      }
    }
  },
  
  // Magazine-style text block (paragraph or statement)
  magazineText: {
    hidden: { 
      opacity: 0, 
      y: 30,
      skewY: 1
    },
    visible: { 
      opacity: 1, 
      y: 0,
      skewY: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        duration: 0.8
      }
    }
  },
  
  // No-opacity version of magazineText
  magazineMotion: {
    hidden: { 
      y: 30,
      skewY: 1
    },
    visible: { 
      y: 0,
      skewY: 0,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        duration: 0.8
      }
    }
  },
  
  // For section backgrounds, slight scale + opacity
  sectionReveal: {
    hidden: { 
      opacity: 0,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        ease: 'easeOut',
        duration: 0.8
      }
    }
  },
  
  // No-opacity version of sectionReveal
  sectionMotion: {
    hidden: { 
      scale: 0.98
    },
    visible: { 
      scale: 1,
      transition: {
        ease: 'easeOut',
        duration: 0.8
      }
    }
  },
  
  // For cards, projects, items in a grid
  cardReveal: {
    hidden: { 
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    visible: (i = 0) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.7
      }
    })
  },
  
  // No-opacity version of cardReveal
  cardMotion: {
    hidden: { 
      y: 40,
      scale: 0.95
    },
    visible: (i = 0) => ({ 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: i * 0.1,
        duration: 0.7
      }
    })
  },
  
  // Special animation for hero/statement elements
  heroStatement: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      filter: 'blur(8px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        duration: 1,
        delay: 0.2
      }
    }
  },
  
  // Container that reveals children in sequence
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  },
  
  // Animation for section titles
  sectionTitle: {
    hidden: { 
      opacity: 0, 
      x: -20,
      skewX: 2
    },
    visible: { 
      opacity: 1, 
      x: 0,
      skewX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  },
  
  // No-opacity version of sectionTitle
  titleMotion: {
    hidden: { 
      x: -20,
      skewX: 2
    },
    visible: { 
      x: 0,
      skewX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  },
  
  // Subtle parallax effect
  parallaxItem: {
    hidden: { y: 0 },
    visible: (direction = 1) => ({
      y: direction * 10,
      transition: {
        type: 'spring',
        stiffness: 10,
        damping: 20
      }
    })
  },
  
  // For full-width sections that overlap
  overlappingSection: {
    hidden: { 
      y: 100, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 30,
        damping: 20
      }
    }
  }
}

interface AnimatedElementProps {
  children: ReactNode
  className?: string
  variant?: keyof typeof animations
  custom?: number | string | boolean
  delay?: number
  viewport?: {
    once?: boolean
    margin?: string
    amount?: number | "some" | "all"
  }
}

/**
 * Reusable animated component that applies consistent animations
 * across the portfolio with magazine-style aesthetics
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  className = "",
  variant = "fadeIn",
  custom = 0,
  delay = 0,
  viewport = { once: true, margin: "0px 0px -150px 0px" }
}) => {
  const chosenVariant = animations[variant]
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={chosenVariant}
      custom={custom}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered container that reveals children in sequence
 */
export const StaggerContainer: React.FC<AnimatedElementProps> = ({
  children,
  className = "",
  delay = 0,
  viewport = { once: true, margin: "0px 0px -150px 0px" }
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={animations.staggerContainer}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export default {
  AnimatedElement,
  StaggerContainer,
  animations
}
