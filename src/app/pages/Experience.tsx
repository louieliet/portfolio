import TimeLine from '@/app/components/Timeline'
import SphereBackground from '../components/SphereBackground'

const Experience = () => {
    return (
        <div
            id="experience"
            className="experience-bg -mt-12 md:-mt-44 overflow-hidden flex flex-col md:flex-row text-white justify-center items-center gap-10 md:px-0"
        >
            {/* Left side for the title */}
            <div className="relative w-full md:w-[45%] h-[300px] md:h-[800px] flex justify-center items-end md:items-center overflow-hidden -mt-12 z-10">
                {/* Video Background with reduced opacity to better show sphere */}
                <video
                    autoPlay
                    loop
                    muted
                    controls={false}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-10 md:rounded-r-[40px]"
                >
                    <source src="/videos/expvid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Title */}
                <h1
                    className="timeline-title text-4xl md:text-6xl lg:text-7xl font-bold transform rotate-0 md:-rotate-90 whitespace-nowrap z-10 text-center md:text-left mb-6"

                >
                    [02] My experience
                </h1>
            </div>

            {/* Right side for the timeline content */}
            <div
                className="timeline-content w-3/4 md:w-[55%] z-10"
            >
                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-90">
                    <div className="md:ml-72 w-full h-full max-w-[2000px] max-h-[2000px]">
                        <SphereBackground />
                    </div>
                </div>

                <TimeLine />
            </div>
            
            <div className="absolute bottom-10 left-28 h-[1px] w-24 bg-white/30"></div>
        </div>
    )
}

export default Experience
