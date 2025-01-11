import Image, { StaticImageData } from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap, { Power4 } from 'gsap'
interface MobileProjectProps {
    title: string
    description: string
    videoSrc: string
    videoOnLeft?: boolean
    icons?: StaticImageData[]
}

const MobileProject: React.FC<MobileProjectProps> = ({
    title,
    description,
    videoSrc,
    videoOnLeft = false,
    icons = [],
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const container = containerRef.current

        if (container) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        if (videoOnLeft) {
                            gsap.fromTo(
                                container,
                                { opacity: 0, x: -300 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 1,
                                    ease: Power4.easeOut,
                                }
                            )
                        } else {
                            gsap.fromTo(
                                container,
                                { opacity: 0, x: 300 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 1,
                                    ease: Power4.easeOut,
                                }
                            )
                        }
                        observer.disconnect()
                    }
                },
                { threshold: 0.1 }
            )
            observer.observe(container)
        }
    }, [videoOnLeft])

    return (
        <div
            ref={containerRef}
            className={`opacity-0 flex flex-col md:flex-row items-center w-full ${videoOnLeft ? 'md:flex-row-reverse ' : ''}`}
        >
            <div className="relative w-full md:w-[60%] pt-[100%] md:pt-[40%]">
                <video
                    autoPlay
                    loop
                    muted
                    src={videoSrc}
                    title={title}
                    className="absolute top-0 left-0 w-full h-full"
                    controls={false}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div
                className={`space-y-3 w-full md:w-[40%] mt-6 md:mt-0 ${videoOnLeft ? 'md:-mr-32' : 'md:-ml-32'}`}
            >
                <div className="flex flex-wrap space-x-2 mt-6">
                    {icons.map((icon, index) => (
                        <Image
                            key={index}
                            src={icon}
                            alt={`icon-${index}`}
                            width={40}
                            height={40}
                        />
                    ))}
                </div>
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-gray-300 text-lg md:text-xl">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default MobileProject
