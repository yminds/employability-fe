import { useState } from "react";
import UploadProjectSVG from "@/assets/projects/upload-local.svg";
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import backgroundImageSVG from "@/assets/projects/background.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import ProjectListing from "./project-listing";

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { 
    data: projectsData, 
    isLoading: projectsLoading, 
    error: projectsError,
    refetch:refetchProjects 
  } = useGetProjectsByUserIdQuery(userId ?? "");


  const handleModalClose = async()=>{
    setIsModalOpen(false);
    await refetchProjects();
  }

  const hanldeProjectSuccess = async() =>{
    await refetchProjects();
    setIsModalOpen(false);
  }
  if (projectsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary-700" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading projects
      </div>
    );
  }

  if (projectsData?.data && projectsData.data.length > 0) {
    return <ProjectListing />;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageSVG}
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <ProjectUploadModal open={isModalOpen} onOpenChange={setIsModalOpen} 
        onSuccess={hanldeProjectSuccess}/>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">
            No Projects Yet
          </h1>
          <p className="text-gray-500 font-sf-pro">
            Start showcasing your skills by adding your first project.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
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