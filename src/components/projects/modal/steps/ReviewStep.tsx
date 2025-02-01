import type React from "react";
import { Github, GlobeLock, ImageIcon, FileText } from "lucide-react";
import EditIcon from "../../../../assets/projects/edit.svg";
import { useGetProjectQuery } from "@/api/projectApiSlice";
import {
  extractFileNameFromUrl,
  getFileType,
} from "@/utils/projects/fileUtils";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface ReviewStepProps {
  existingProject: {
    data: {
      _id: string;
      name: string;
      description: string;
      tech: Skill[];
      githubLink: string[];
      liveLink: string;
      thumbnail: string;
      images: string;
      synopsisDoc: string;
      synopsis: string;
    };
  } | undefined;
  onEdit: (step: number) => void;
}

type imageData =
  | {
      name: string;
    }
  | string;

const ReviewStep: React.FC<ReviewStepProps> = ({ existingProject, onEdit }) => {
  const { data: projectInfo } = useGetProjectQuery(existingProject?.data?._id ?? "", {
    refetchOnMountOrArgChange: true,
  });

  const projectDetails = projectInfo?.data;

  const renderFileIcon = (url: string) => {
    const fileType = getFileType(url);
    switch (fileType) {
      case "image":
        return <ImageIcon className="w-6 h-6 text-[#10b753]" />;
      case "document":
        return <FileText className="w-6 h-6 text-[#10b753]" />;
      default:
        return <FileText className="w-6 h-6 text-[#10b753]" />;
    }
  };


  return (
    <div className="space-y-6 ">
      {/* Project Details */}
      <div className="bg-white rounded-xl border border-black/10">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Project Name</div>
              <div className="text-gray-900 text-base font-medium">
                {projectDetails?.name}
              </div>
            </div>
            <div
              className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => onEdit(0)}
            >
              <img
                src={EditIcon || "/placeholder.svg"}
                alt="Edit"
                width={24}
                height={24}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-2 self-stretch mt-4">
            <div className="text-gray-400 text-sm">Description</div>
            <div className="text-gray-600 text-sm self-stretch">
              {projectDetails?.description}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10">
        <div className="flex flex-col ">
          <div className="flex justify-between items-start">
            <div className="text-black text-base font-['Ubuntu'] font-medium">
              Project Tech Stack
            </div>
            <div
              className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => onEdit(1)}
            >
              <img
                src={EditIcon || "/placeholder.svg"}
                alt="Edit"
                width={24}
                height={24}
              />
            </div>
          </div>

          
            <div className="flex flex-col gap-2">
              <div className="text-[#8f9091] text-sm">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {projectDetails?.tech.map((skill) => (
                  <div
                    key={skill._id}
                    className="px-4 py-1 bg-[#e6eeeb] rounded-[33px] border"
                  >
                    <div className="text-[#03963e] text-sm">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Links */}
      <div className="w-full px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10 flex flex-col justify-start items-start gap-7">
        <div className="self-stretch h-[22px] flex justify-between items-start">
          <div className="text-black text-base font-['Ubuntu'] font-medium leading-[22px]">
            Links
          </div>
          <div
            className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
            onClick={() => onEdit(2)}
          >
            <img
              src={EditIcon || "/placeholder.svg"}
              alt="Edit"
              width={24}
              height={24}
            />
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-3">
          {projectDetails?.githubLink && projectDetails?.githubLink.length > 0 ? (
            projectDetails?.githubLink.map((link, index) => (
              <div
                key={index}
                className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4"
              >
                <Github className="w-6 h-6 text-[#10b753]" />
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="w-full bg-transparent text-[#10b753] text-base font-normal font-['SF Pro Display'] focus:outline-none"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
              <Github className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-base">
                No GitHub link provided
              </span>
            </div>
          )}

          {projectDetails?.liveLink ? (
            <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
              <GlobeLock className="w-6 h-6 text-[#10b753]" />
              <input
                type="text"
                value={projectDetails.liveLink}
                readOnly
                className="w-full bg-transparent text-[#10b753] text-base font-normal font-['SF Pro Display'] focus:outline-none"
              />
            </div>
          ) : (
            <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
              <GlobeLock className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-base">
                No live link provided
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {projectDetails?.thumbnail && (
        <div className="w-full px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10 flex flex-col justify-start items-start gap-7">
          <div className="self-stretch h-[22px] flex justify-between items-start">
            <div className="text-black text-base font-medium font-['Ubuntu']">
              Cover Image
            </div>
            <div
              className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => onEdit(2)}
            >
              <img
                src={EditIcon || "/placeholder.svg"}
                alt="Edit"
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-start items-start gap-3">
            <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
              {renderFileIcon(projectDetails.thumbnail)}
              <span className="text-[#10b753] text-base font-normal font-['SF Pro Display']">
                {extractFileNameFromUrl(projectDetails.thumbnail)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Project Images */}
      {projectDetails?.images && projectDetails.images.length > 0 && (
        <div className="w-full px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10 flex flex-col justify-start items-start gap-7">
          <div className="self-stretch h-[22px] flex justify-between items-start">
            <div className="text-black text-base font-medium font-['Ubuntu']">
              Project Images
            </div>
            <div
              className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => onEdit(2)}
            >
              <img
                src={EditIcon || "/placeholder.svg"}
                alt="Edit"
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            {Array.isArray(projectDetails.images) ? (
              projectDetails.images.map((imageUrl: string, index: number) => (
                <div key={index} className="w-full flex flex-col gap-2">
                  <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
                    {renderFileIcon(imageUrl)}
                    <span className="text-[#10b753] text-base font-normal font-['SF Pro Display'] truncate">
                      {extractFileNameFromUrl(imageUrl)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Handle the case where images is a single string
              <div className="w-full flex flex-col gap-2">
                <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
                  {renderFileIcon(projectDetails.images)}
                  <span className="text-[#10b753] text-base font-normal font-['SF Pro Display'] truncate">
                    {extractFileNameFromUrl(projectDetails.images)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Synopsis PDF */}
      {(projectDetails?.synopsisDoc || projectDetails?.synopsis) && (
        <div className="w-full px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10 flex flex-col justify-start items-start gap-7">
          <div className="self-stretch h-[22px] flex justify-between items-start">
            <div className="text-black text-base font-medium font-['Ubuntu']">
              Project Synopsis
            </div>
            <div
              className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => onEdit(2)}
            >
              <img
                src={EditIcon || "/placeholder.svg"}
                alt="Edit"
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-start items-start gap-3">
            <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
              {projectDetails.synopsisDoc &&
                renderFileIcon(projectDetails.synopsisDoc)}
              <span className="text-[#10b753] text-base font-normal font-['SF Pro Display']">
                {projectDetails.synopsisDoc
                  ? extractFileNameFromUrl(projectDetails.synopsisDoc)
                  : "No synopsis document provided"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default ReviewStep;
