import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, ReactNode } from "react"
import gsap from "gsap";

interface DevAreaProps {
    title: string;
    description: string;
    tecIcon: StaticImageData;
    tecIconAlt: string;
    tecIconWidth?: string;
    children?: ReactNode;
}

const DevArea = ({ title, description, tecIcon, tecIconAlt, tecIconWidth, children }: DevAreaProps) => {
    const devContent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const content = devContent.current;
        if (content) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                      gsap.fromTo(
                        entry.target,
                        {
                          opacity: 0,
                        },
                        {
                          opacity: 1,
                          duration: 2,
                          ease: "power4.out",
                          delay: 0.2
                        }
                      );
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(content);
        }
      }, []);
    return (
        <div ref={devContent} className="text-white rounded-lg opacity-0">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-base md:text-lg mb-10 w-full md:w-[90%]">{description}</p>
            <h1 className="text-4xl font-bold mb-8">Tecnologías que uso</h1>
            <div className="flex flex-wrap space-x-4 mb-8">
                <Image src={tecIcon} alt={tecIconAlt} width={40} height={40} className={tecIconWidth} />
            </div>
            <h1 className="text-4xl font-bold mb-8">Mi trabajo</h1>
            {children}
        </div>
    );
}

export default DevArea;