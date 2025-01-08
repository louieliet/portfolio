import Image from "next/image";

interface MobileProjectProps {
  videoSrc: string;
  icons: { src: string; alt: string }[];
  description: string;
  videoFirst: boolean;
}

const MobileProject: React.FC<MobileProjectProps> = ({
  videoSrc,
  icons,
  description,
  videoFirst,
}) => {
  return (
      <div
        className={`project1 flex flex-col md:flex-row md:gap-20 items-center ${videoFirst ? "" : "md:flex-row-reverse"}`}
      >
        <video autoPlay loop muted playsInline className="w-full md:w-[40%]">
          <source src={videoSrc} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="flex flex-col w-full md:w-1/2 gap-3">
          <div className="flex flex-row gap-5 md:mt-0 mt-10">
            {icons.map((icon, index) => (
              <Image
                key={index}
                src={icon.src}
                alt={icon.alt}
                width={50}
                height={50}
                className="pointer-events-none"
              />
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
  );
};

export default MobileProject;
