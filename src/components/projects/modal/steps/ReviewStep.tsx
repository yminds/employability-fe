import type React from "react";
import { Github, GlobeLock, ImageIcon, FileText } from "lucide-react";
import EditIcon from "../../../../assets/projects/edit.svg";
import { useGetProjectQuery } from "@/api/projectApiSlice";
import { useEffect } from "react";

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
  };
  onEdit: (step: number) => void;
}

type imageData =
  | {
      name: string;
    }
  | string;

const ReviewStep: React.FC<ReviewStepProps> = ({ existingProject, onEdit }) => {
  let i = 0;
  // chnage console color to yellow
  console.log(`%c rendering  ${++i} times`, "color: yellow;");

  console.log("projectDetailsin review :", existingProject?.data);
  const { data: projectInfo } = useGetProjectQuery(existingProject?.data._id, {
    refetchOnMountOrArgChange: true,
  });

  //   useEffect(() => {
  //     console.log('Component mounted, projectId:', existingProject?.data._id);
  // }, [existingProject?.data._id])
  const projectDetails = projectInfo?.data;

  console.log("projectDetailsin review :", projectInfo);

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="bg-white rounded-xl border border-black/10">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 ">
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
      <div className="h-[222px] px-5 pt-5 pb-6 bg-white rounded-xl border border-black/10 flex flex-col justify-start items-start gap-7">
        <div className="h-[178px] flex flex-col justify-start items-start gap-6 w-full">
          <div className="self-stretch h-[22px] flex justify-between items-start">
            <div className="text-black text-base font-['Ubuntu'] font-medium leading-[22px]">
              Project Type & Tech Stack
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

          <div className="flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-[#8f9091] text-sm font-['SF Pro Display']">
              Project Name
            </div>
            <div className="self-stretch text-[#1f2226] text-base font-medium font-['SF Pro Display']">
              {projectDetails?.name}
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-[#8f9091] text-sm font-['SF Pro Display']">
              Tech Stack
            </div>
            <div className="self-stretch flex flex-wrap items-start gap-2">
              {projectDetails?.tech.map((skill) => (
                <div
                  key={skill._id}
                  className="px-4 py-1 bg-[#e6eeeb] rounded-[33px] border flex justify-center items-center"
                >
                  <div className="text-[#03963e] text-sm font-['SF Pro Display']">
                    {skill.name}
                  </div>
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
          {projectDetails?.githubLink.length > 0 ? (
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
              <ImageIcon className="w-6 h-6 text-[#10b753]" />
              <span className="text-[#10b753] text-base font-normal font-['SF Pro Display']">
                {projectDetails.thumbnail
                  ? projectDetails.thumbnail.split("/").pop()
                  : "No cover image provided"}
              </span>
            </div>
          </div>
        </div>
      )}

      
      {/* Project Images */}
      {projectDetails?.images && (
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
            {(() => {
              try {
                const parsedImages = JSON.parse(projectDetails.images);
                return parsedImages.map((image: imageData, index: number) => (
                  <div key={index} className="w-full flex flex-col gap-2">
                    <div className="w-full h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 flex items-center gap-4">
                      <ImageIcon className="w-6 h-6 text-[#10b753]" />
                      <span className="text-[#10b753] text-base font-normal font-['SF Pro Display'] truncate">
                        {typeof image === "string"
                          ? image.split("/").pop()
                          : image.name}
                      </span>
                    </div>
                  </div>
                ));
              } catch (error) {
                console.error("Error parsing images:", error);
                return null;
              }
            })()}
          </div>
        </div>
      )}

      {/* Synopsis PDF */}
      {(projectDetails?.synopsisDoc || projectDetails?.synopsisDoc) && (
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
              <FileText className="w-6 h-6 text-[#10b753]" />
              <span className="text-[#10b753] text-base font-normal font-['SF Pro Display']">
                {projectDetails.synopsisDoc
                  ? projectDetails.synopsisDoc.split("/").pop()
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
