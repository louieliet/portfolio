import Image from "next/image";
const ProfileImage = () => {
    return(
    <div className="introduction-content relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-lg">
      <Image
        src="/pp.png"
        alt="Profile picture"
        className="object-cover object-center w-full h-full pointer-events-none"
        width={900}
        height={900}
      />
    </div>
  );
}

export default ProfileImage;
