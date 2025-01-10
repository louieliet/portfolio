import Image, { StaticImageData } from 'next/image';

interface MobileProjectProps {
    title: string;
    description: string;
    videoSrc: string;
    videoOnLeft?: boolean;
    icons?: StaticImageData[];
}

const MobileProject: React.FC<MobileProjectProps> = ({ title, description, videoSrc, videoOnLeft = false, icons = [] }) => {
    return (
        <div className={`flex flex-col md:flex-row items-center w-full ${videoOnLeft ? 'md:flex-row-reverse ' : ''}`}>
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
            <div className={`space-y-3 w-full md:w-[40%] mt-6 md:mt-0 ${videoOnLeft ? 'md:-mr-44' : 'md:-ml-48'}`}>
                <div className="flex flex-wrap space-x-2 mt-6">
                    {icons.map((icon, index) => (
                        <Image key={index} src={icon} alt={`icon-${index}`} width={40} height={40} />
                    ))}
                </div>
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-gray-300 text-lg md:text-xl">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default MobileProject;