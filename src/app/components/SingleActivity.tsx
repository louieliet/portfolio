import Image, { StaticImageData } from "next/image";

interface SingleActivityProps {
  img: StaticImageData;
  title: string;
  description: string;
  imageOnLeft: boolean;
  className?: string;
}

function SingleActivity({
  img,
  title,
  description,
  imageOnLeft,
  className,
}: SingleActivityProps) {
  return (
    <div
      className={`flex flex-col md:flex-row w-full gap-8 md:gap-20 items-center ${imageOnLeft ? "md:-ml-32" : "md:flex-row-reverse md:ml-32"} ${className}`}
    >
      {/* Left side for the image */}
      <div
        className={`activity-img relative w-full md:w-[60%] h-[300px] md:h-[400px] lg:h-[650px] flex justify-center items-center overflow-hidden rounded-[40px]`}
      >
        <Image
          src={img}
          alt="Activity Image"
          width={800}
          height={800}
          className={`drop-shadow-xl pointer-events-none rounded-[40px]`}
        />
      </div>
      {/* Right side for the description */}
      <div
        className={`activity-description flex flex-col gap-5 w-full md:w-[40%] ${imageOnLeft ? "md:-mr-96" : "md:-ml-96"} ${className}`}
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-extrabold">
          {title}
        </h1>
        <p className="text-white text-base md:text-lg lg:text-xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default SingleActivity;