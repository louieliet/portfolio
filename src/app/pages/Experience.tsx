import TimeLine from '@/app/components/Timeline'
import SphereBackground from '../components/SphereBackground'

const Experience = () => {
    return (
        <div
            id="experience"
            className="experience-bg experience-section min-h-screen py-12 md:py-4 flex flex-col md:flex-row text-white justify-center items-center gap-10 md:px-0 overflow-visible relative"
            data-section-id="experience"
            data-section-type="experience"
            style={{ marginBottom: '0', paddingBottom: '0' }}
        >
            {/* Background Sphere positioned to the right */}
            <div className="absolute inset-0 w-full h-full z-0 left-80 pointer-events-none">
                <div className="w-full h-full flex items-center justify-end ml-96">
                    <div className="w-full h-full">
                        <SphereBackground containerId="experience" debug={false} />
                    </div>
                </div>
            </div>
            
            {/* Left side for the title */}
            <div className="relative w-full md:w-[45%] h-[300px] md:h-[800px] flex justify-center items-end md:items-center z-10">
                {/* Video Background with reduced opacity above the sphere */}
                <video
                    autoPlay
                    loop
                    muted
                    controls={false}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 md:rounded-r-[40px] z-30"
                    style={{ willChange: 'transform' }}
                >
                    <source src="/videos/expvid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Title */}
                <h1
                    className="timeline-title text-4xl md:text-6xl lg:text-7xl font-bold transform rotate-0 md:-rotate-90 whitespace-nowrap z-30 text-center md:text-left mb-6"
                >
                    [02] My experience
                </h1>
            </div>

            {/* Right side for the timeline content */}
            <div
                className="timeline-content w-3/4 md:w-[55%] z-20"
                style={{ willChange: 'transform', position: 'relative' }}
            >
                <TimeLine />
            </div>
            
            <div className="absolute bottom-10 left-28 h-[1px] w-24 bg-white/30"></div>
        </div>
    )
}

export default Experience
