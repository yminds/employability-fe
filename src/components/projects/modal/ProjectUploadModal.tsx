"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProgressBar from "./ProgressBar";
import ProjectDetailsStep from "./steps/ProjectDetailsStep";
import ProjectSkillsStep from "./steps/ProjectSkillsStep";
import UploadLinksStep from "./steps/UploadLinkStep";
import ReviewStep from "./steps/ReviewStep";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAddProjectMutation } from "@/api/projectsApiSlice";
import SuccessModal from "./steps/SuccessModal";

// Define the Skill interface
interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface FormData {
  projectName: string;
  description: string;
  skills: Skill[];
  images: File[];
  codeFiles: File[];
  github: string; // Simplified from links.github
  liveLink: string; // Simplified from links.portfolio
  coverImage: File | null;
}

interface ProjectUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  "Enter Project Details",
  "Project Skills",
  "Upload Files & Links",
  "Review Your Project",
];

export function ProjectUploadModal({
  open,
  onOpenChange,
}: ProjectUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({
    projectName: "",
    description: "",
    skills: [],
    images: [],
    codeFiles: [],
    github: "",
    liveLink: "",
    coverImage: null,
  });

  const user_id = useSelector((state: RootState) => state?.auth.user._id);
  const [addProject, { isLoading: isSubmitting }] = useAddProjectMutation();

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Prepare the payload
      const payload = {
        user_id,
        projectName: formData.projectName,
        description: formData.description,
        skills: formData.skills.map((skill) => skill._id),
        github: formData.github,
        liveLink: formData.liveLink,
      };

      // Call the mutation
      const response = await addProject(payload).unwrap();
      console.log("Project added successfully:", response);

      setIsSuccessModalOpen(true);

      // Reset form and close modal on success
      setFormData({
        projectName: "",
        description: "",
        skills: [],
        images: [],
        codeFiles: [],
        github: "",
        liveLink: "",
        coverImage: null,
      });
      setCurrentStep(0);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add project:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSetSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>> =
    React.useCallback(
      (skillsOrFn) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          skills:
            typeof skillsOrFn === "function"
              ? skillsOrFn(prevFormData.skills)
              : skillsOrFn,
        }));
      },
      [setFormData]
    );

  return (
    <>
      {/* Render Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!p-8 !pb-10 w-[700px] !max-w-[700px] min-h-[615px] max-h-[90vh] flex flex-col">
          <DialogHeader className="text-left !p-0 !m-0">
            <DialogTitle className="text-xl font-semibold">
              {STEPS[currentStep]}
            </DialogTitle>
          </DialogHeader>

          <ProgressBar steps={STEPS} currentStep={currentStep} />

          <div className="flex-1 overflow-y-auto min-h-0">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1">
                {currentStep === 0 && (
                  <ProjectDetailsStep
                    projectName={formData.projectName}
                    description={formData.description}
                    onChange={handleUpdateFormData}
                  />
                )}
                {currentStep === 1 && (
                  <ProjectSkillsStep
                    selectedSkills={formData.skills}
                    setSelectedSkills={handleSetSelectedSkills}
                  />
                )}
                {currentStep === 2 && (
                  <UploadLinksStep
                    images={formData.images}
                    setImages={(images) =>
                      handleUpdateFormData("images", images)
                    }
                    codeFiles={formData.codeFiles}
                    setCodeFiles={(files) =>
                      handleUpdateFormData("codeFiles", files)
                    }
                    github={formData.github}
                    setGithub={(value) => handleUpdateFormData("github", value)}
                    liveLink={formData.liveLink}
                    setLiveLink={(value) =>
                      handleUpdateFormData("liveLink", value)
                    }
                    coverImage={formData.coverImage}
                    setCoverImage={(image) =>
                      handleUpdateFormData("coverImage", image)
                    }
                  />
                )}
                {currentStep === 3 && <ReviewStep formData={formData} />}
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t shrink-0">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex px-8 py-2 justify-center items-center gap-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              {currentStep === STEPS.length - 1 ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="flex px-8 py-2 justify-center items-center gap-2 rounded-md bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Publish Project
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex px-[32px] py-[10px] justify-center items-center gap-2 self-stretch bg-primary-700 text-white rounded-md hover:bg-primary-600"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
