import { useState } from "react";
import UploadProjectSVG from "@/assets/projects/upload-local.svg"; // Ensure correct import path
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-auto my-auto h-screen flex flex-col items-center justify-center">
      <ProjectUploadModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">
          No Projects Yet
        </h1>
        <p className="text-gray-500 font-sf-pro">
          Start showcasing your skills by adding your first project.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 gap-4">
        {/* Upload Project SVG */}
        <div
          className="flex justify-center  cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={UploadProjectSVG}
            alt="Upload Project"
            className="w-auto h-auto"
          />
        </div>

        {/* Get Project from Mentor SVG */}
        <div className="flex justify-center">
          <img
            src={GetProjectFromMentorSVG}
            alt="Get Project from Mentor"
            className="w-auto h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
