import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import SideMenu from '../components/SideMenu'
import Introduction from './Introduction'

// Debug components - uncomment when needed for debugging
// const SectionManager = dynamic(() => import('../components/SectionManager'), {
//     ssr: false
// })

// Section test component to debug SphereBackground visibility
const SectionTest = dynamic(() => import('../components/SectionTest'), {
    ssr: false
})

// Dynamically import components for better performance
const WhatIdo = dynamic(() => import('./WhatIdo'), {
    loading: () => <div className="min-h-screen" />
})

const Experience = dynamic(() => import('./Experience'), {
    loading: () => <div className="min-h-screen" />
})

const Activities = dynamic(() => import('./Activities'), {
    loading: () => <div className="min-h-screen" />
})

const Contact = dynamic(() => import('./Contact'), {
    loading: () => <div className="min-h-[50vh]" />
})

const Home = () => {
    return (
        <main className="relative overflow-x-hidden">
            <SideMenu />
            {/* Uncomment the line below to debug section visibility */}
            {/* <SectionManager debug={true} /> */}
            <SectionTest />
            <section id="intro-section" className="section-container overflow-visible relative" data-section-type="intro">
                <Introduction />
            </section>
            <section id="whatido-section" className="section-container overflow-visible relative" data-section-type="whatido">
                <Suspense fallback={<div className="min-h-screen" />}>
                    <WhatIdo />
                </Suspense>
            </section>
            <section id="experience-section" className="section-container overflow-visible relative" data-section-type="experience">
                <Suspense fallback={<div className="min-h-screen" />}>
                    <Experience />
                </Suspense>
            </section>
            <section id="activities-section" className="section-container overflow-visible relative" data-section-type="activities">
                <Suspense fallback={<div className="min-h-screen" />}>
                    <Activities />
                </Suspense>
            </section>
            <section id="contact-section" className="section-container overflow-visible relative" data-section-type="contact">
                <Suspense fallback={<div className="min-h-[50vh]" />}>
                    <Contact />
                </Suspense>
            </section>
        </main>
    )
}

export default Home
