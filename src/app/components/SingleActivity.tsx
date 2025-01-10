import Image, { StaticImageData } from 'next/image'

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
    return (
        <div
            className={`flex flex-col md:flex-row w-full gap-3 md:gap-20 items-center ${imageOnLeft ? 'md:-ml-44' : 'md:flex-row-reverse md:ml-36'}`}
        >
            {/* Left side for the image */}
            <div
                className="relative w-96 md:w-[60%] h-[320px] md:h-[400px] lg:h-[650px] flex justify-center items-center overflow-hidden md:rounded-[40px]"
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
                className="flex flex-col gap-5 w-full md:w-[40%] px-3 md:px-0"
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
