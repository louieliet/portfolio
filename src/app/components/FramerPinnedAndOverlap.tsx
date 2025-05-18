"use client"

import React from 'react'
import { motion, useViewportScroll, useTransform } from 'framer-motion'

interface FramerPinnedAndOverlapProps {
    contentOne: React.ReactNode
    contentTwo: React.ReactNode
    /** Total height of the container, e.g. "500vh" */
    containerHeight?: string
}

export default function FramerPinnedAndOverlap({
    contentOne,
    contentTwo,
    containerHeight = '500vh',
}: FramerPinnedAndOverlapProps) {
    const { scrollYProgress } = useViewportScroll()
    // Calculate overlap distance in vh (total height minus the pinned 100vh)
    const totalVh = parseInt(containerHeight.replace('vh', ''), 10)
    const overlapVh = Math.max(totalVh - 100, 0)
    const y = useTransform(scrollYProgress, [0, 1], ['0vh', `-${overlapVh}vh`])

    return (
        <div
            style={{
                position: 'relative',
                height: containerHeight,
                width: '100%',
                overflow: 'visible',
            }}
        >
            {/* Pinned section */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    zIndex: 1,
                }}
            >
                {contentOne}
            </div>

            {/* Overlapping section animated with framer-motion */}
            <motion.div
                style={{
                    y,
                    position: 'absolute',
                    top: '100vh',
                    left: 0,
                    width: '100%',
                    zIndex: 2,
                }}
            >
                {contentTwo}
            </motion.div>
        </div>
    )
}
