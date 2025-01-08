"use client";
interface WebProjectProps {
  src: string;
  title: string;
  projectTitle: string;
  description: string;
}

const WebProject = ({
  src,
  title,
  projectTitle,
  description,
}: WebProjectProps) => {

  return (
    <div className="rounded-lg overflow-hidden shadow-md w-full md:w-4/5">
      <div className="relative bg-white" style={{ paddingTop: "56.25%" }}>

          <iframe
            src={src}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
          ></iframe>

      </div>
      <div className="p-5">
        <h3 className="text-2xl font-bold">{projectTitle}</h3>
        <p className="text-gray-300 text-lg">{description}</p>
      </div>
    </div>
  );
};

export default WebProject;
