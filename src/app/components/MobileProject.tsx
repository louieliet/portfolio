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
            <div className="relative w-full md:w-[60%]" style={{ paddingTop: "40%" }}>
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
            <div className={`space-y-5 w-full md:w-[40%] mt-5 md:mt-0 ${videoOnLeft ? '-mr-72' : '-ml-48'}`}>
                <div className="flex flex-wrap space-x-2 mt-6">
                    {icons.map((icon, index) => (
                        <Image key={index} src={icon} alt={`icon-${index}`} width={40} height={40} />
                    ))}
                </div>
                <h3 className="text-xl md:text-4xl font-bold">{title}</h3>
                <p className="text-gray-300 text-sm md:text-xl">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default MobileProject;