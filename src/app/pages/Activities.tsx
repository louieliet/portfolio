'use client'
// GSAP import and animation hook removed; animations disabled
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import SingleActivity from '@/app/components/SingleActivity'
import IOSIMG from '@/app/assets/images/iosimg.jpeg'
import VORTEXIMG from '@/app/assets/images/vorteximg.jpg'
import PCIIMG from '@/app/assets/images/pciimg.jpg'
import SAUPIMG from '@/app/assets/images/saupimg.jpeg'
import RotatingCube from '@/app/components/RotatingCube'

const Activities = () => {
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    })
    const [isLoaded, setIsLoaded] = useState(false)
    
    useEffect(() => {
        setIsLoaded(true)
    }, [])
    
    return (
        <div
            id="activities"
            ref={inViewRef}
            className="activities-bg z-20 flex flex-col px-5 md:px-20 pb-20 relative overflow-hidden"
        >
            {/* 3D Element in background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40">
                {isLoaded && inView && (
                    <div className="w-full h-full">
                        <RotatingCube containerId="activities" />
                    </div>
                )}
            </div>
            
            <div className="text-start w-full mt-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 activity-fade">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl text-white font-extrabold md:mt-20">
                        [03] Activities
                    </h1>
                    <div className="mt-4 md:mt-8 md:w-2/5">
                        <p className="text-white/70 text-lg leading-relaxed">
                            Projects and roles I have performed, contributing to my professional development
                            and strengthening my experience in different technological fields.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-16 md:gap-40 mt-8 md:mt-16">
                    <div className="activity-fade">
                        <SingleActivity
                            img={IOSIMG}
                            title="Co-founder of Blank Canvas and fullstack developer at iOS Lab UP"
                            description="I participate in iOS application development, leading a creative team in conceptualizing, designing, and programming innovative solutions. My focus is on creating attractive and functional user experiences. I have worked with Swift, SwiftUI, CoreML, ARKit."
                            imageOnLeft={true}
                        />
                    </div>

                    <div className="activity-fade">
                        <SingleActivity
                            img={VORTEXIMG}
                            title="Unity 2D Senior Developer at UP Panteras Play - Vortex"
                            description="Developer focused on programming tasks and specialized in player mechanics in Unity 2D for the game Pumpkin Paradox. I was in charge of player mechanics and levels that were presented at EGS 2023."
                            imageOnLeft={false}
                        />
                    </div>

                    <div className="activity-fade">
                        <SingleActivity
                            img={PCIIMG}
                            title="Gameplay Development Leader at PCI Lab - Universidad Panamericana"
                            description="Coordinator of design and implementation of game mechanics in Unity 3D. I led the Gameplay Development team to create the demo for the game Lotus, winner of the ILAN 2023 award, presented in Israel."
                            imageOnLeft={true}
                        />
                    </div>

                    <div className="activity-fade">
                        <SingleActivity
                            img={SAUPIMG}
                            title="President of Animation and Game Engineering | Student Society of Universidad Panamericana"
                            description="I led initiatives to promote collaboration among students, organizing events and conferences that foster professional development and creativity."
                            imageOnLeft={false}
                        />
                    </div>
                </div>
                
                {/* Magazine-style decorative elements */}
                <div className="mt-24 flex justify-between items-center activity-fade">
                    <div className="h-[1px] w-24 bg-white/30"></div>
                    <span className="text-white/40 text-sm tracking-widest uppercase px-4">Portfolio 2025</span>
                    <div className="h-[1px] flex-grow bg-white/30"></div>
                </div>
            </div>
        </div>
    )
}

export default Activities
