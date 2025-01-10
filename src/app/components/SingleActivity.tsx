import Image, { StaticImageData } from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap, { Power4 } from 'gsap'

interface SingleActivityProps {
    img: StaticImageData
    title: string
    description: string
    imageOnLeft: boolean
}

function SingleActivity({
    img,
    title,
    description,
    imageOnLeft,
}: SingleActivityProps) {
    const activityImageRef = useRef<HTMLDivElement>(null)
    const activityTxtRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const image = activityImageRef.current
        const txt = activityTxtRef.current

        if (image) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            image,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 4,
                                ease: Power4.easeOut,
                                delay: 0.5,
                            }
                        )
                        observer.disconnect()
                    }
                },
                { threshold: 0.1 }
            )
            observer.observe(image)
        }
        if (txt) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        if(imageOnLeft){
                            gsap.fromTo(
                                txt,
                                {
                                    opacity: 0,
                                    x: 200,
                                },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 2,
                                    ease: Power4.easeOut,
                                    delay: 0.5,
                                }
                            )
                        }
                        else{
                            gsap.fromTo(
                                txt,
                                {
                                    opacity: 0,
                                    x: -200,
                                },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 2,
                                    ease: Power4.easeOut,
                                    delay: 0.5,
                                }
                            )

                        }
                        observer.disconnect()
                    }
                },
                { threshold: 0.1 }
            )
            observer.observe(txt)
        }
    }, [imageOnLeft])

    return (
        <div
            className={`flex flex-col md:flex-row w-full gap-3 md:gap-20 items-center ${imageOnLeft ? 'md:-ml-44' : 'md:flex-row-reverse md:ml-36'}`}
        >
            {/* Left side for the image */}
            <div
                ref={activityImageRef}
                className="opacity-0 relative w-96 md:w-[60%] h-[320px] md:h-[400px] lg:h-[650px] flex justify-center items-center overflow-hidden md:rounded-[40px]"
            >
                <Image
                    src={img}
                    alt="Activity Image"
                    width={1200}
                    height={1200}
                    className={`drop-shadow-xl pointer-events-none md:rounded-[40px]`}
                />
            </div>
            {/* Right side for the description */}
            <div
                ref={activityTxtRef}
                className="opacity-0 flex flex-col gap-5 w-full md:w-[40%] px-3 md:px-0"
            >
                <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-extrabold">
                    {title}
                </h1>
                <p className="text-white text-base md:text-lg lg:text-xl leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default SingleActivity
