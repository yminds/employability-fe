import { useState } from "react";
import UploadProjectSVG from "@/assets/projects/upload-local.svg";
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import backgroundImageSVG from "@/assets/projects/background.svg";

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0 px-16 py-16 ">
        <img
          src={backgroundImageSVG}
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto h-screen flex flex-col items-center justify-center">
        <ProjectUploadModal open={isModalOpen} onOpenChange={setIsModalOpen} />

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">
            No Projects Yet
          </h1>
          <p className="text-gray-500 font-sf-pro">
            Start showcasing your skills by adding your first project.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Upload Project Button */}
          <div
            className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={UploadProjectSVG}
              alt="Upload Project"
              className="w-auto h-auto"
            />
          </div>

          {/* Get Project from Mentor Button */}
          <div className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={GetProjectFromMentorSVG}
              alt="Get Project from Mentor"
              className="w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
