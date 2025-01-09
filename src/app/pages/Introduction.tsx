import Image from "next/image";

const Introduction = () => {
  return (
    <div className="intro-bg w-full h-full flex justify-center items-center gap-10">
      <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-lg">
        <Image
          src="/pp.png"
          priority
          alt="Profile picture"
          className="object-cover object-center w-full h-full"
          width={500}
          height={500}
        />
      </div>
      <h1>Introduction</h1>
      <p>This is a simple introduction page.</p>
    </div>
  );
};

export default Introduction;
