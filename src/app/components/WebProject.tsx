import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface WebProjectProps {
    title: string;
    description: string;
    iframeSrc: string;
    frameOnLeft?: boolean;
    icons?: StaticImageData[];
}

const WebProject: React.FC<WebProjectProps> = ({ title, description, iframeSrc, frameOnLeft = false, icons = [] }) => {
    return (
        <div className={`flex flex-col md:flex-row items-center justify-center w-full px-4 md:px-20 ${frameOnLeft ? 'md:flex-row-reverse' : ''}`}>
            { /* Iframe */}
            <div className="relative bg-white border-4 border-gray-300 rounded-lg w-full md:w-[60%]" style={{ paddingTop: "40%" }}>
                <iframe
                    src={iframeSrc}
                    title={title}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                ></iframe>
            </div>
            { /* Description */}
            <div className={`space-y-5 w-full md:w-[40%] mt-5 md:mt-0 ${frameOnLeft ? 'md:mr-14' : 'md:ml-14'}`}>
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

export default WebProject;