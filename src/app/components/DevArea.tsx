import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface DevAreaProps {
    title: string;
    description: string;
    tecIcon: StaticImageData;
    tecIconAlt: string;
    tecIconWidth?: string;
    children?: ReactNode;
}

const DevArea = ({ title, description, tecIcon, tecIconAlt, tecIconWidth, children }: DevAreaProps) => {
    return (
        <div className="text-white rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-base md:text-lg mb-10 w-full md:w-4/5">{description}</p>
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