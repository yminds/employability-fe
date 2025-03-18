import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  useAddProjectMutation,
  useGetProjectQuery,
  useHandleProjectFilesMutation,
  useUpdateProjectMutation,
  useUpdateProjectTechMutation,
} from "@/api/projectApiSlice";
import ProjectDetailsStep from "./steps/ProjectDetailsStep";
import ProjectSkillsStep from "./steps/ProjectSkillsStep";
import ProgressBar from "./ProgressBar";
import UploadLinksStep from "./steps/UploadLinkStep";
import ReviewStep from "./steps/ReviewStep";
import SuccessModal from "./steps/SuccessModal";
import { toast } from "sonner";
import UnsavedChangesModal from "./UnsavedChangesModal";



interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface FormData {
  projectName: string;
  description: string;
  goalId: string;
  skills: Skill[];
  images: File[];
  uploadedFiles: {
    [key: string]: { url: string; key: string };
  };
  synopsisDoc: File | "";
  githubLinks: string[];
  liveLink: string;
  thumbnail: File | "";
}

interface ProjectCreatePayload {
  name: string;
  description: string;
  status: string;
  goal_id?: string;
  user_id?: string;
}

interface FormErrors {
  projectName?: string[];
  description?: string[];
  githubLinks?: string[];
}

interface Project {
  _id: string;
  name: string;
  description: string;
  tech: Skill[];
  githubLink: string[];
  liveLink: string;
  thumbnail: string;
  images: string | string[];
  synopsisDoc: string;
  synopsis: string;
  status: string;
}

interface ProjectResponse {
  success: boolean;
  data: Project;
}

interface ProjectUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void>;
  selectedGoalId: string;
  existingProject?: {
    _id: string;
    name: string;
    description: string;
    tech: Array<{
      _id: string;
      name: string;
      icon: string;
    }>;
    githubLink: string[];
    liveLink: string;
    thumbnail?: string;
    status: string;
    images?: string;
    synopsisDoc?: string;
    synopsis?: string;
  } | null;
}

type FileEntry = { url: string; key: string };

interface PersistentFiles {
  images: FileEntry;
  thumbnail: FileEntry;
  synopsisDoc: FileEntry;
  [key: string]: FileEntry;
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
  existingProject,
  onSuccess,
  selectedGoalId,
}: ProjectUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [anyLinkIsPrivate, setAnyLinkIsPrivate] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [hasUnsavedFiles, setHasUnsavedFiles] = React.useState(false);
  const [showWarningModal, setShowWarningModal] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<
    "previous" | "close" | null
  >(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<{
    [key: string]: { url: string; key: string };
  }>({});
  const [formData, setFormData] = React.useState<FormData>({
    projectName: "",
    description: "",
    goalId: "",
    skills: [],
    images: [],
    synopsisDoc: "",
    githubLinks: [""],
    liveLink: "",
    thumbnail: "",
    uploadedFiles: {},
  });

  const [persistedFiles, setPersistedFiles] = React.useState<PersistentFiles>({
    images: { url: '', key: '' },
  thumbnail: { url: '', key: '' },
  synopsisDoc: { url: '', key: '' },
  });

  const user = useSelector((state: RootState) => state?.auth.user);
  const user_id = user?._id;

  const [addProject, { isLoading: isSubmitting }] = useAddProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [updateProjectTech, { isLoading: isTechUpdating }] =
    useUpdateProjectTechMutation();
  const [handleProjectFiles, { isLoading: isFilesUploading }] =
    useHandleProjectFilesMutation();
  const { data: projectDetails } = useGetProjectQuery(projectId || "");

  console.log("projectDetails", projectDetails);

  console.log("persisted data", persistedFiles);
  console.log("uploaded files", uploadedFiles);

  // Initialize form with existing project data or reset when modal closes
  React.useEffect(() => {
    if (existingProject && open) {
      setFormData({
        projectName: existingProject.name,
        description: existingProject.description,
        goalId: selectedGoalId || "",
        skills: existingProject.tech,
        githubLinks:
          existingProject.githubLink.length > 0
            ? existingProject.githubLink
            : [""],
        liveLink: existingProject.liveLink || "",
        images:  [],
        synopsisDoc:  "",
        thumbnail:  "",
        uploadedFiles: {
          images: { url: existingProject.images || "", key: "" },
          synopsisDoc: { url: existingProject.synopsisDoc || "", key: "" },
          thumbnail: { url: existingProject.thumbnail || "", key: "" },
        },
      });
      setProjectId(existingProject._id);
      setIsEditing(true);

      // Set persisted files
      setPersistedFiles({
        thumbnail: existingProject.thumbnail
          ? { url: existingProject.thumbnail, key: "" }
          : { url: "", key: "" },
        synopsisDoc: existingProject.synopsisDoc
          ? { url: existingProject.synopsisDoc, key: "" }
          : { url: "", key: "" },
        images: existingProject.images
          ? { url: existingProject.images, key: "" }
          : { url: "", key: "" },
      });

      // Determine current step based on project status
      switch (existingProject.status) {
        case "Incomplete":
          setCurrentStep(0);
          break;
        case "In-review":
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(0);
      }
    }

    if (!open) {
      // Reset all form states when modal closes
      setFormData({
        projectName: "",
        description: "",
        goalId: "",
        skills: [],
        images: [],
        synopsisDoc: "",
        githubLinks: [""],
        liveLink: "",
        thumbnail: "",
        uploadedFiles: {},
      });
      setProjectId(null);
      setCurrentStep(0);
      setIsEditing(false);
      setUploadedFiles({});
      setPersistedFiles({
        thumbnail: { url: "", key: "" },
        synopsisDoc: { url: "", key: "" },
        images: { url: "", key: "" },
      });
    }
  }, [existingProject, open]);

  console.log("formData after existing project:", formData);

  // Reset errors when changing steps
  React.useEffect(() => {
    setErrors({});
    setHasUnsavedFiles(false); 
  }, [currentStep]);

  const handleFileChange = (
    type: keyof Pick<FormData, 'images' | 'synopsisDoc' | 'thumbnail'>, 
    files: File | File[] | "" | null
  ) => {
    if (type === 'images' && Array.isArray(files)) {
      handleUpdateFormData(type, files);
    } else if (type === 'synopsisDoc' || type === 'thumbnail') {
      handleUpdateFormData(type, files as File | "");
    }
    setHasUnsavedFiles(true);
  };

  const handleNavigationAttempt = (action: "previous" | "close") => {
    console.log("Navigation attempt:", { action, hasUnsavedFiles, currentStep });
    if (hasUnsavedFiles && currentStep === 2) {
      setShowWarningModal(true);
      setPendingAction(action);
      return;
    }

    if (action === "previous") {
      handlePrevious();
    } else if (action === "close") {
      onOpenChange(false);
    }
  };

  const validateProjectDetails = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = ["Project name is required"];
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = [
        "Project name must be at least 3 characters long",
      ];
    } else if (formData.projectName.length > 100) {
      newErrors.projectName = ["Project name cannot exceed 100 characters"];
    }

    if (!formData.description.trim()) {
      newErrors.description = ["Description is required"];
    } else if (formData.description.trim().length < 10) {
      newErrors.description = [
        "Description must be at least 10 characters long",
      ];
    } else if (formData.description.length > 500) {
      newErrors.description = ["Description cannot exceed 500 characters"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log("existingProject", existingProject);
  console.log("persistedFiles", persistedFiles);


  const handleImageUrls = (
    imageUrls: string | string[] | undefined
  ): string[] => {
    if (typeof imageUrls === 'string') {
      return [imageUrls];
    } else if (Array.isArray(imageUrls)) {
      return imageUrls;
    }
    return [];
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        if (!validateProjectDetails()) {
          return;
        }

        // Check if we're editing an existing project
        if (isEditing && projectId) {
          // Check if project details have changed
          const detailsChanged =
            formData.projectName.trim() !== existingProject?.name ||
            formData.description.trim() !== existingProject?.description;

          if (!detailsChanged) {
            // Just move to next step
            setCurrentStep((prev) => prev + 1);
            return;
          }

          // Update with new details if changed
          const response = await updateProject({
            projectId,
            payload: {
              name: formData.projectName.trim(),
              description: formData.description.trim(),
              status: "Incomplete",
            },
          }).unwrap();

          if (response.success) {
            toast.success("Project details updated successfully");
            setCurrentStep((prev) => prev + 1);
          }
        } else {
          if (projectId) {
            setCurrentStep((prev) => prev + 1);
            return;
          }
          // Create new project
          const response = await addProject({
            userId: user_id!,
            name: formData.projectName.trim(),
            description: formData.description.trim(),
            status: "Incomplete",
            goal_id: selectedGoalId || formData.goalId,
          } as ProjectCreatePayload).unwrap();

          if (response.success) {
            setProjectId(response.data._id);
            toast.success("Project detail saved successfully!");
            setCurrentStep((prev) => prev + 1);
          }
        }
      } else if (currentStep === 1) {
        if (!projectId) {
          return;
        }

        if (formData.skills.length > 0) {
          const technologies = formData.skills.map((skill) => skill._id);
          await updateProjectTech({
            projectId,
            technologies,
          }).unwrap();
        }

        // Always move to the next step
        setCurrentStep((prev) => prev + 1);

        // Update project status to Incomplete to track progress
        await updateProject({
          projectId,
          payload: { status: "Incomplete" },
        }).unwrap();
      } else if (currentStep === 2) {
        if (!projectId) return;

        setHasUnsavedFiles(false);

        const formDataToUpload = new FormData();

        console.log("formDataToUpload", formDataToUpload);
        const validLinks = formData.githubLinks.filter(
          (link) => link.trim() !== ""
        );
        formDataToUpload.append("githubLinks", JSON.stringify(validLinks));

        if (formData.liveLink) {
          formDataToUpload.append("liveLink", formData.liveLink);
        }

        if (validLinks.length > 0) {
          formDataToUpload.append("action", "submit"); // This will trigger status change to "In-review"
        }

        // Only append files if they have been changed
        if (uploadedFiles.thumbnail?.url) {
          console.log(
            "uploadedFiles.thumbnail?.url",
            uploadedFiles.thumbnail?.url
          );

          formDataToUpload.append(
            "fileUrls[thumbnail]",
            uploadedFiles.thumbnail.url
          );
        } else if (
          existingProject?.thumbnail &&
          !persistedFiles.thumbnail.url
        ) {
          formDataToUpload.append("fileUrls[thumbnail]", "");
        } else {
          console.log("existingProject?.thumbnail", existingProject?.thumbnail);
          formDataToUpload.append(
            "fileUrls[thumbnail]",
            existingProject?.thumbnail || ""
          );
        }

        if (uploadedFiles.synopsisDoc?.url) {
          console.log(
            "uploadedFiles.synopsisDoc?.url",
            uploadedFiles.synopsisDoc?.url
          );

          formDataToUpload.append(
            "fileUrls[synopsisDoc]",
            uploadedFiles.synopsisDoc.url
          );
        } else if (
          existingProject?.synopsisDoc &&
          !persistedFiles.synopsisDoc.url
        ) {
          formDataToUpload.append("fileUrls[synopsisDoc]", "");
        } else {
          console.log(
            "existingProject?.synopsisDoc",
            existingProject?.synopsisDoc
          );
          formDataToUpload.append(
            "fileUrls[synopsisDoc]",
            existingProject?.synopsisDoc || ""
          );
        }

        if (uploadedFiles.images?.url) {
          try {
            const parsedUrls = JSON.parse(uploadedFiles.images.url);
            const imageUrls = handleImageUrls(parsedUrls);
            imageUrls.forEach((url, index) => {
              formDataToUpload.append(`fileUrls[images][${index}]`, url);
            });
          } catch (error) {
            console.error('Error parsing image URLs:', error);
          }
        } else if (existingProject?.images && !persistedFiles.images.url) {
          formDataToUpload.append("fileUrls[images]", "");
        } else if (existingProject?.images) {
          const imageUrls = handleImageUrls(existingProject.images);
          imageUrls.forEach((url, index) => {
            formDataToUpload.append(`fileUrls[images][${index}]`, url);
          });
        }

        if (
          formDataToUpload.has("fileUrls[thumbnail]") ||
          formDataToUpload.has("fileUrls[synopsisDoc]") ||
          formDataToUpload.has("fileUrls[images][0]")
        ) {
          try {
            const filesResponse = await handleProjectFiles({
              projectId,
              formData: formDataToUpload,
            }).unwrap();

            if (filesResponse.success) {
              setCurrentStep((prev) => prev + 1);
            }
          } catch (error: any) {
            if (error.status === 400) {
              return;
            }
            throw error;
          }
        } else {
          // If no files were changed, simply move to the next step
          setCurrentStep((prev) => prev + 1);
        }
      }
    } catch (error: any) {
      console.error("Error in project upload:", error);
      if (error.data?.message) {
        alert(error.data.message);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleUpdateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (
      field === "images" ||
      field === "synopsisDoc" ||
      field === "thumbnail"
    ) {
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: { url: "", key: "" },
      }));
      setPersistedFiles((prev) => ({
        ...prev,
        [field]: { url: "", key: "" },
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
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

  const handleSaveDraft = async () => {
    try {
      // Validate project details
      if (!validateProjectDetails()) {
        return;
      }

      // Ensure user is logged in
      if (!user_id) {
        alert("Please log in to save a project");
        return;
      }

      // Prevent duplicate save if we're already processing
      if (isSubmitting || isUpdating || isTechUpdating || isFilesUploading) {
        return;
      }
      toast.success("Project saved as draft successfully!");

      // Refresh the project list and close the modal
      if (onSuccess) {
        await onSuccess();
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error(error.data?.message || "Failed to save project draft");
    }
  };

  const handleSubmitForReview = async () => {
    try {
      // Validate project details first
      if (!validateProjectDetails()) {
        return;
      }

      // Ensure user is logged in
      if (!user_id || !projectId) {
        alert("Please log in and create a project first");
        return;
      }

      const validLinks = formData.githubLinks.filter(
        (link) => link.trim() !== ""
      );

      if (validLinks.length === 0) {
        toast.error(
          "Please provide at least one GitHub link before submitting for review"
        );
        return;
      }

      toast.success("Project submitted for review successfully!");
      onOpenChange(false);
      setIsSuccessModalOpen(true);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting project for review:", error);

    }
  };

  const renderSubmitButtons = () => {
    return (
      <div className="flex items-center gap-4">
        <span
          onClick={handleSaveDraft}
          className="text-grey-5 hover:text-grey-7 cursor-pointer underline text-body2 font-sf-pro"
        >
          Save as Draft
        </span>
        <button
          type="button"
          onClick={handleSubmitForReview}
          className="flex px-8 py-2 justify-center items-center gap-2 rounded-md bg-button text-grey-1 hover:bg-grey-6 disabled:opacity-50 font-sf-pro text-button"
        >
          Submit for Review
        </button>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if(hasUnsavedFiles){
            setShowWarningModal(true);
          }
          handleNavigationAttempt("close");
          setFormData({
            projectName: "",
            description: "",
            goalId: "",
            skills: [],
            images: [],
            synopsisDoc: "",
            githubLinks: [""],
            liveLink: "",
            thumbnail: "",
            uploadedFiles: {},
          });
          setCurrentStep(0);
          setErrors({});
          setUploadedFiles({});
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="!p-8 !pb-10 w-[700px] !max-w-[700px] min-h-[615px] max-h-[90vh] flex flex-col rounded-2xl">
        <DialogHeader className="text-left !p-0 !m-0">
          <DialogTitle className="text-h2 font-sf-pro text-grey-7">
            {STEPS[currentStep]}
          </DialogTitle>
        </DialogHeader>

        <ProgressBar steps={STEPS} currentStep={currentStep} />

        <div className="flex-1 overflow-y-auto pr-2 scroll-smooth minimal-scrollbar">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col h-full"
          >
            <div className="flex-1">
              {currentStep === 0 && (
                <ProjectDetailsStep
                  projectName={formData.projectName}
                  description={formData.description}
                  onChange={(field, value) =>
                    handleUpdateFormData(field as keyof FormData, value)
                  }
                  errors={errors}
                  isEditing={isEditing}
                  goalId={formData.goalId}
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
                  setImages={(images) => handleFileChange("images", images)}
                  onRepoStatusChange={(anyPrivate) => setAnyLinkIsPrivate(anyPrivate)}
                  synopsisDoc={formData.synopsisDoc}
                  setSynopsisDoc={(pdf) =>
                    handleFileChange("synopsisDoc", pdf)
                  }
                  githubLinks={formData.githubLinks}
                  setGithubLinks={(links) =>
                    handleUpdateFormData("githubLinks", links)
                  }
                  liveLink={formData.liveLink}
                  setLiveLink={(value) =>
                    handleUpdateFormData("liveLink", value)
                  }
                  thumbnail={formData.thumbnail}
                  setThumbnail={(image) =>
                    handleFileChange("thumbnail", image)
                  }
                  existingImages={
                    formData.uploadedFiles.images?.url ||
                    existingProject?.images
                  }
                  existingSynopsis={existingProject?.synopsis}
                  existingSynopsisDoc={
                    formData.uploadedFiles.synopsisDoc?.url ||
                    existingProject?.synopsisDoc
                  }
                  existingThumbnail={
                    formData.uploadedFiles.thumbnail?.url ||
                    existingProject?.thumbnail
                  }
                  projectId={projectId!}
                  onFileUploaded={(type, url, key) => {
                    setUploadedFiles((prev) => ({
                      ...prev,
                      [type]: { url, key },
                    }));
                    setPersistedFiles((prev) => ({
                      ...prev,
                      [type]: { url, key },
                    }));
                    setHasUnsavedFiles(true);
                    if (type === "images") {
                      setFormData((prev) => ({
                        ...prev,
                        images: [], // Clear the images array when new images are uploaded
                      }));
                    } else if (type === "synopsisDoc") {
                      setFormData((prev) => ({
                        ...prev,
                        synopsisDoc: "", // Clear the synopsisPdf when a new one is uploaded
                      }));
                    } else if (type === "thumbnail") {
                      console.log("Clearing coverImage");

                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: "", // Clear the coverImage when a new one is uploaded
                      }));
                    }
                  }}
                  repoStatuses={{}}
                  persistedFiles={persistedFiles}
                  onDeleteFile={(type) => {
                    setPersistedFiles((prev) => ({
                      ...prev,
                      [type]: { url: "", key: "" },
                    }));
                  }}
                  setPersistedFiles={setPersistedFiles}
                />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  existingProject={projectDetails}
                  onEdit={(step) => setCurrentStep(step)}
                />
              )}
            </div>
          </form>
        </div>

        <div className="pt-6 mt-6 border-t border-grey-2">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => handleNavigationAttempt("previous")}
              disabled={currentStep === 0}
              className="flex px-8 py-2 justify-center items-center gap-2 rounded-md border border-grey-2 text-grey-5 hover:border-grey-7 disabled:opacity-50 cursor-pointer font-sf-pro text-button transition-colors"
            >
              Previous
            </button>
            {currentStep === STEPS.length - 1 ? (
              renderSubmitButtons()
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={anyLinkIsPrivate}
                className="flex px-[32px] py-[10px] justify-center items-center gap-2 self-stretch bg-black text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </DialogContent>

      {isSuccessModalOpen && (
        <SuccessModal
          onClose={() => {
            setIsSuccessModalOpen(false);
          }}
          onRefresh={onSuccess}
        />
      )}

      <UnsavedChangesModal
        open={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onProceed={() => {
          setShowWarningModal(false);
          setHasUnsavedFiles(false);
          if (pendingAction === "previous") {
            handlePrevious();
          } else if (pendingAction === "close") {
            onOpenChange(false);
          }
          setPendingAction(null);
        }}
        onStay={() => {
          setShowWarningModal(false);
          setPendingAction(null);
        }}
      />
    </Dialog>
  );
}
