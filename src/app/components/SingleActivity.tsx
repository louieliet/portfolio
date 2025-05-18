'use client'

import Image, { StaticImageData } from 'next/image'

interface SingleActivityProps {
    img: StaticImageData | string
    title: string
    description: string
    imageOnLeft: boolean
}

const SingleActivity = ({ img, title, description, imageOnLeft }: SingleActivityProps) => {
    return (
        <div className={`flex flex-col ${imageOnLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
            {/* Image Container */}
            <div className={`w-full md:w-5/12 relative overflow-hidden ${imageOnLeft ? 'md:rotate-1' : 'md:-rotate-1'} shadow-2xl`}>
                <div className="relative w-full aspect-[4/5] hover:scale-105 transition-transform duration-700 ease-in-out">
                    <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a]/80 to-transparent opacity-70"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className={`w-full md:w-7/12 text-white ${imageOnLeft ? 'md:pr-40' : 'md:pl-44'}`}>
                <div className={`${imageOnLeft ? 'md:ml-6' : 'md:-ml-6'}`}>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                        {title}
                    </h3>
                    <div className="h-px w-24 bg-white/30 mb-5"></div>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default SingleActivity
