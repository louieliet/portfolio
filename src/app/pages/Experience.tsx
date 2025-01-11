import TimeLine from '@/app/components/Timeline'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Experience = () => {
    const titleExpRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const title = titleExpRef.current
        const timeline = timelineRef.current

        const mediaQuery = window.matchMedia('(min-width: 768px)')

        if (mediaQuery.matches) {
            if (title) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            gsap.fromTo(
                                entry.target,
                                {
                                    opacity: 0,
                                    x: -200,
                                },
                                {
                                    x: 150,
                                    opacity: 1,
                                    duration: 2,
                                    ease: 'power4.out',
                                    delay: 0.3,
                                }
                            )
                            observer.disconnect()
                        }
                    },
                    { threshold: 0.1 }
                )
                observer.observe(title)
            }

            if (timeline) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            gsap.fromTo(
                                entry.target,
                                {
                                    opacity: 0,
                                    x: 200,
                                },
                                {
                                    x: -50,
                                    opacity: 1,
                                    duration: 2,
                                    ease: 'power4.out',
                                    delay: 0.3,
                                }
                            )
                            observer.disconnect()
                        }
                    },
                    { threshold: 0.1 }
                )
                observer.observe(timeline)
            }
        }
    }, [])

    return (
        <div
            id="experience"
            className="experience-bg -mt-12 md:-mt-64 overflow-hidden flex flex-col md:flex-row text-white justify-center items-center gap-10 md:px-0"
        >
            {/* Left side for the title */}
            <div className="relative w-full md:w-[45%] h-[300px] md:h-[800px] flex justify-center items-end md:items-center overflow-hidden -mt-12">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 md:rounded-r-[40px]"
                >
                    <source src="/videos/expvid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Title */}
                <h1
                    ref={titleExpRef}
                    className="md:opacity-0 timeline-title text-4xl md:text-6xl lg:text-7xl font-bold transform rotate-0 md:-rotate-90 whitespace-nowrap z-10 text-center md:text-left mb-6"
                >
                    [02] Mi experiencia
                </h1>
            </div>

            {/* Right side for the timeline content */}
            <div
                ref={timelineRef}
                className="md:opacity-0 timeline-content w-3/4 md:w-[55%]"
            >
                <TimeLine />
            </div>
        </div>
    )
}

export default Experience
