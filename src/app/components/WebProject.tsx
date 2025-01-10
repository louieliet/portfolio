import React, { useRef, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { gsap } from 'gsap';

interface WebProjectProps {
    title: string;
    description: string;
    iframeSrc: string;
    frameOnLeft?: boolean;
    icons?: StaticImageData[];
}

const WebProject: React.FC<WebProjectProps> = ({ title, description, iframeSrc, frameOnLeft = false, icons = [] }) => {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;
        if (button && text) {
            gsap.set(button, { position: 'relative', overflow: 'hidden' });
            const hoverEffect = document.createElement('div');
            hoverEffect.style.position = 'absolute';
            hoverEffect.style.top = '100%';
            hoverEffect.style.left = '0';
            hoverEffect.style.width = '100%';
            hoverEffect.style.height = '100%';
            hoverEffect.style.backgroundColor = '#121b30'; // Change this to your desired hover color
            hoverEffect.style.transition = 'top 0.3s ease-in-out';
            button.appendChild(hoverEffect);

            button.addEventListener('mouseenter', () => {
                hoverEffect.style.top = '0';
                gsap.to(text, { color: '#ffffff', duration: 0.3 });
            });

            button.addEventListener('mouseleave', () => {
                hoverEffect.style.top = '100%';
                gsap.to(text, { color: '#121b30', duration: 0.3 });
            });
        }
    }, []);

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center w-full px-4 md:px-20 ${frameOnLeft ? 'md:flex-row-reverse' : ''}`}>
            <div className="relative bg-white border-4 border-gray-300 rounded-lg w-full md:w-[60%]" style={{ paddingTop: "40%" }}>
                <iframe
                    src={iframeSrc}
                    title={title}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                ></iframe>
            </div>
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
                <a
                    href={iframeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={buttonRef}
                    className="relative inline-block px-6 py-2 text-gray-800 bg-white border-2 border-white rounded-full overflow-hidden"
                >
                    <span ref={textRef} className="relative z-10">Visit Project</span>
                </a>
            </div>
        </div>
    );
};

export default WebProject;