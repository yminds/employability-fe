import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  useAddProjectMutation,
  useGetProjectQuery,
  useHandleProjectFilesMutation,
  useUpdateProjectMutation,
  useUpdateProjectTechMutation,
} from "@/api/projectApiSlice"
import ProjectDetailsStep from "./steps/ProjectDetailsStep"
import ProjectSkillsStep from "./steps/ProjectSkillsStep"
import ProgressBar from "./ProgressBar"
import UploadLinksStep from "./steps/UploadLinkStep"
import ReviewStep from "./steps/ReviewStep"
import SuccessModal from "./steps/SuccessModal"
import { toast } from "sonner"

interface Skill {
  _id: string
  name: string
  icon?: string
}

interface FormData {
  projectName: string
  description: string
  goalId:string
  skills: Skill[]
  images: File[]
  uploadedFiles: {
    [key: string]: { url: string; key: string }
  }
  synopsisDoc: File | ''
  githubLinks: string[]
  liveLink: string
  thumbnail: File | ''
}

interface FormErrors {
  projectName?: string[]
  description?: string[]
  githubLinks?: string[]
}

interface ProjectUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => Promise<void>
  selectedGoalId: string
  existingProject?: {
    _id: string
    name: string
    description: string
    tech: Array<{
      _id: string
      name: string
      icon: string
    }>
    githubLink: string[]
    liveLink: string
    thumbnail?: string
    status: string
    images?: string
    synopsisDoc?: string
    synopsis?: string
  } | null
}

const STEPS = ["Enter Project Details", "Project Skills", "Upload Files & Links", "Review Your Project"]

export function ProjectUploadModal({
  open,
  onOpenChange,
  existingProject,
  onSuccess,
  selectedGoalId,
}: ProjectUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [projectId, setProjectId] = React.useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<{
    [key: string]: { url: string; key: string }
  }>({})
  const [formData, setFormData] = React.useState<FormData>({
    projectName: "",
    description: "",
    goalId:"",
    skills: [],
    images: [],
    synopsisDoc: "",
    githubLinks: [""],
    liveLink: "",
    thumbnail: "",
    uploadedFiles: {},
  })

  
  const [persistedFiles, setPersistedFiles] = React.useState<{
    [key: string]: { url: string; key: string }
  }>({})
  // const [filePreviewState, setFilePreviewState] = React.useState<FilePreviewState>({
  //   thumbnailPreview: {
  //     file: null,
  //     status: "idle",
  //     progress: 0,
  //   },
  //   synopsisPreview: {
  //     file: null,
  //     status: "idle",
  //     progress: 0,
  //   },
  //   imagePreview: {
  //     files: {}
  //   }
  // })

  const user = useSelector((state: RootState) => state?.auth.user)
  const user_id = user?._id

  const [addProject, { isLoading: isSubmitting }] = useAddProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const [updateProjectTech, { isLoading: isTechUpdating }] = useUpdateProjectTechMutation()
  const [handleProjectFiles, { isLoading: isFilesUploading }] = useHandleProjectFilesMutation()
  const{data:projectDetails} = useGetProjectQuery(projectId || "")

  console.log("projectDetails",projectDetails)


  console.log("persisted data",persistedFiles)
  console.log("uploaded files", uploadedFiles)
  
  // Initialize form with existing project data or reset when modal closes
  React.useEffect(() => {
    if (existingProject && open) {
      setFormData({
        projectName: existingProject.name,
        description: existingProject.description,
        goalId: selectedGoalId || "",
        skills: existingProject.tech,
        githubLinks: existingProject.githubLink.length > 0 ? existingProject.githubLink : [""],
        liveLink: existingProject.liveLink || "",
        images: existingProject.images ||[],
        synopsisDoc: existingProject.synopsis || "",
        thumbnail: existingProject.thumbnail || "",
        uploadedFiles: {
          images: { url: existingProject.images || "", key: "" },
          synopsisDoc: { url: existingProject.synopsisDoc || "", key: "" },
          thumbnail: { url: existingProject.thumbnail || "", key: "" },
        },
      })
      setProjectId(existingProject._id)
      setIsEditing(true)
      
      // Set persisted files
      setPersistedFiles({
        thumbnail: existingProject.thumbnail ? { url: existingProject.thumbnail, key: "" } : { url: "", key: "" },
        synopsisDoc: existingProject.synopsisDoc ? { url: existingProject.synopsisDoc, key: "" } : { url: "", key: "" },
        images: existingProject.images ? { url: existingProject.images, key: "" } : { url: "", key: "" },
      })

      // Determine current step based on project status
      switch (existingProject.status) {
        case "Incomplete":
          setCurrentStep(0)
          break
        case "In-review":
          setCurrentStep(3)
          break
        default:
          setCurrentStep(0)
      }
    }

    if (!open) {
      // Reset all form states when modal closes
      setFormData({
        projectName: "",
        description: "",
        goalId:"",
        skills: [],
        images: [],
        synopsisDoc: "",
        githubLinks: [""],
        liveLink: "",
        thumbnail: "",
        uploadedFiles: {},
      })
      setProjectId(null)
      setCurrentStep(0)
      setIsEditing(false)
      setUploadedFiles({})
      setPersistedFiles({})
    }
  }, [existingProject, open])

  console.log("formData after existing project:"  ,formData);

  // Reset errors when changing steps
  React.useEffect(() => {
    setErrors({})
  }, [currentStep])

  const validateProjectDetails = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.projectName.trim()) {
      newErrors.projectName = ["Project name is required"]
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = ["Project name must be at least 3 characters long"]
    } else if (formData.projectName.length > 100) {
      newErrors.projectName = ["Project name cannot exceed 100 characters"]
    }

    if (!formData.description.trim()) {
      newErrors.description = ["Description is required"]
    } else if (formData.description.trim().length < 10) {
      newErrors.description = ["Description must be at least 10 characters long"]
    } else if (formData.description.length > 500) {
      newErrors.description = ["Description cannot exceed 500 characters"]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  console.log("existingProject",existingProject);
  console.log("persistedFiles",persistedFiles);
  

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        if (!validateProjectDetails()) {
          return
        }

        // Check if we're editing an existing project
        if (isEditing && projectId) {
          // Check if project details have changed
          const detailsChanged =
            formData.projectName.trim() !== existingProject?.name ||
            formData.description.trim() !== existingProject?.description

          if (!detailsChanged) {
            // Just move to next step
            setCurrentStep((prev) => prev + 1)
            return
          }

          // Update with new details if changed
          const response = await updateProject({
            projectId,
            payload: {
              name: formData.projectName.trim(),
              description: formData.description.trim(),
              status: "Incomplete",
            },
          }).unwrap()

          if (response.success) {
            toast.success("Project details updated successfully")
            setCurrentStep((prev) => prev + 1)
          }
        } else {
          if (projectId) {
            setCurrentStep((prev) => prev + 1)
            return
          }
          // Create new project
          const response = await addProject({
            userId: user_id!,
            name: formData.projectName.trim(),
            description: formData.description.trim(),
            status: "Incomplete",
            goal_id: selectedGoalId || formData.goalId,
          }).unwrap()

          if (response.success) {
            setProjectId(response.data._id)
            toast.success("Project detail saved successfully!")
            setCurrentStep((prev) => prev + 1)
          }
        }
      } else if (currentStep === 1) {
        if (!projectId) {
          return
        }

        if (formData.skills.length > 0) {
          const technologies = formData.skills.map((skill) => skill._id)
          await updateProjectTech({
            projectId,
            technologies,
          }).unwrap()
        }

        // Always move to the next step
        setCurrentStep((prev) => prev + 1)

        // Update project status to Incomplete to track progress
        await updateProject({
          projectId,
          payload: { status: "Incomplete" },
        }).unwrap()
      } else if (currentStep === 2) {
        if (!projectId) return

      
        
        const formDataToUpload = new FormData()

        console.log("formDataToUpload",formDataToUpload);
        const validLinks = formData.githubLinks.filter((link) => link.trim() !== "")
        formDataToUpload.append("githubLinks", JSON.stringify(validLinks))

        if (formData.liveLink) {
          formDataToUpload.append("liveLink", formData.liveLink)
        }

        // Only append files if they have been changed
        if (uploadedFiles.thumbnail?.url) {
          console.log("uploadedFiles.thumbnail?.url",uploadedFiles.thumbnail?.url);
          
          formDataToUpload.append("fileUrls[thumbnail]", uploadedFiles.thumbnail.url)
        }else if(existingProject?.thumbnail && !persistedFiles.thumbnail.url){
          formDataToUpload.append("fileUrls[thumbnail]",  "")
        }
        else{
          console.log("existingProject?.thumbnail",existingProject?.thumbnail);
          formDataToUpload.append("fileUrls[thumbnail]", existingProject?.thumbnail || "")
        }
 
        if (uploadedFiles.synopsisDoc?.url) {
          console.log("uploadedFiles.synopsisDoc?.url",uploadedFiles.synopsisDoc?.url);
          
          formDataToUpload.append("fileUrls[synopsisDoc]", uploadedFiles.synopsisDoc.url)
        }
        else if(existingProject?.synopsisDoc && !persistedFiles.synopsisDoc.url){
          formDataToUpload.append("fileUrls[synopsisDoc]",  "")
        }
        else  {
          console.log("existingProject?.synopsisDoc",existingProject?.synopsisDoc);
          formDataToUpload.append("fileUrls[synopsisDoc]", existingProject?.synopsisDoc || "")
        }

        if (uploadedFiles.images?.url) {
          const imageUrls = JSON.parse(uploadedFiles.images.url)
          imageUrls.forEach((url: string, index: number) => {
            formDataToUpload.append(`fileUrls[images][${index}]`, url)
          })
        }else if(existingProject?.images && !persistedFiles.images.url){
          formDataToUpload.append("fileUrls[images]",  "")
          }
        else{
          console.log("existingProject?.images",existingProject?.images);
          const imageUrls = existingProject?.images|| []
          imageUrls.forEach((url: string, index: number) => {
            formDataToUpload.append(`fileUrls[images][${index}]`, url)
          })
        }

        if (formDataToUpload.has("fileUrls[thumbnail]") || formDataToUpload.has("fileUrls[synopsisDoc]") || formDataToUpload.has("fileUrls[images][0]")) {
          try {
            const filesResponse = await handleProjectFiles({
              projectId,
              formData: formDataToUpload,
            }).unwrap()

            if (filesResponse.success) {
              setCurrentStep((prev) => prev + 1)
            }
          } catch (error: any) {
            if (error.status === 400) {
              return
            }
            throw error
          }
        } else {
          // If no files were changed, simply move to the next step
          setCurrentStep((prev) => prev + 1)
        }
      }
    } catch (error: any) {
      console.error("Error in project upload:", error)
      if (error.data?.message) {
        alert(error.data.message)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setErrors({})
    }
  }

  const handleUpdateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (field === "images" || field === "synopsisDoc" || field === "thumbnail") {
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: { url: "", key: "" },
      }))
      setPersistedFiles((prev) => ({
        ...prev,
        [field]: { url: "", key: "" },
      }))
    }
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleSetSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>> = React.useCallback(
    (skillsOrFn) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        skills: typeof skillsOrFn === "function" ? skillsOrFn(prevFormData.skills) : skillsOrFn,
      }))
    },
    [setFormData],
  )

  const handleSaveDraft = async () => {
    try {
      // Validate project details
      if (!validateProjectDetails()) {
        return
      }

      // Ensure user is logged in
      if (!user_id) {
        alert("Please log in to save a project")
        return
      }

      // Prevent duplicate save if we're already processing
      if (isSubmitting || isUpdating || isTechUpdating || isFilesUploading) {
        return
      }

      // Create or update project as a draft
      // const payload = {
      //   name: formData.projectName.trim(),
      //   description: formData.description.trim(),
      //   status: "Incomplete",
      // }

      // if (isEditing && projectId) {
      //   // Update existing project
      //   console.log("payload",payload);
        
      //   await updateProject({
      //     projectId,
      //     payload,
      //   }).unwrap()

      //   if (formData.skills.length > 0) {
      //     const technologies = formData.skills.map((skill) => skill._id)
      //     await updateProjectTech({
      //       projectId,
      //       technologies,
      //     }).unwrap()
      //   }

      //   if (formData.images.length > 0 || formData.synopsisPdf || formData.coverImage) {
      //     const formDataToUpload = new FormData()

      //     if (formData.githubLinks.length > 0) {
      //       formDataToUpload.append(
      //         "githubLinks",
      //         JSON.stringify(formData.githubLinks.filter((link) => link.trim() !== "")),
      //       )
      //     }

      //     if (formData.liveLink) {
      //       formDataToUpload.append("liveLink", formData.liveLink)
      //     }

      //     if (formData.images.length > 0) {
      //       formData.images.forEach((image) => {
      //         formDataToUpload.append("images", image)
      //       })
      //     }

      //     // if (formData.synopsisPdf) {
      //     //   formDataToUpload.append("fileUrls[synopsisDoc]", formData.synopsisPdf)
      //     // }

      //     if (formData.coverImage) {
      //       formDataToUpload.append("fileUrls[thumbnail]", formData.coverImage)
      //     }


      //     console.log("formDataToUpload",formDataToUpload);
        
          
      //     for (let [key, value] of formDataToUpload.entries()) {
      //       console.log(`${key}: ${value}`); 
      //     }
      //     await handleProjectFiles({
      //       projectId,
      //       formData: formDataToUpload ,
      //     }).unwrap()
      //   }
      // } else {
      //   // Only create a new project if we don't have a projectId
      //   if (!projectId) {
      //     const response = await addProject({
      //       userId: user_id,
      //       ...payload,
      //     }).unwrap()

      //     if (response.success) {
      //       setProjectId(response.data._id)

      //       if (formData.skills.length > 0) {
      //         const technologies = formData.skills.map((skill) => skill._id)
      //         await updateProjectTech({
      //           projectId: response.data._id,
      //           technologies,
      //         }).unwrap()
      //       }
      //     }
      //   } else {
      //     // If we have a projectId, update the existing project
      //     await updateProject({
      //       projectId,
      //       payload,
      //     }).unwrap()

      //     if (formData.skills.length > 0) {
      //       const technologies = formData.skills.map((skill) => skill._id)
      //       await updateProjectTech({
      //         projectId,
      //         technologies,
      //       }).unwrap()
      //     }
      //   }
      // }

      toast.success("Project saved as draft successfully!")

      // Refresh the project list and close the modal
      if (onSuccess) {
        await onSuccess()
      }
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving draft:", error)
      toast.error(error.data?.message || "Failed to save project draft")
    }
  }

  const handleSubmitForReview = async () => {
    try {
      // Validate project details first
      if (!validateProjectDetails()) {
        return
      }

      // Ensure user is logged in
      if (!user_id || !projectId) {
        alert("Please log in and create a project first")
        return
      }

      // Update technologies if added
      // const technologies = formData.skills.map((skill) => skill._id)
      // await updateProjectTech({
      //   projectId,
      //   technologies,
      // }).unwrap()

      // // Handle GitHub links and file uploads
      // const validLinks = formData.githubLinks.filter((link) => link.trim() !== "")
      // const formDataToUpload = new FormData()
      // formDataToUpload.append("githubLinks", JSON.stringify(validLinks))

      // if (formData.liveLink) {
      //   formDataToUpload.append("liveLink", formData.liveLink)
      // }

      // if (formData.images.length > 0) {
      //   formData.images.forEach((image) => {
      //     formDataToUpload.append("images", image)
      //   })
      // }

      // if (formData.synopsisPdf) {
      //   formDataToUpload.append("synopsisDoc", formData.synopsisPdf)
      // }

      // if (formData.coverImage) {
      //   formDataToUpload.append("thumbnail", formData.coverImage)
      // }

      // await handleProjectFiles({
      //   projectId,
      //   formData: formDataToUpload,
      // }).unwrap()

      // // Submit for review
      // await updateProject({
      //   projectId,
      //   payload: {
      //     name: formData.projectName.trim(),
      //     description: formData.description.trim(),
      //     status: "In-review",
      //   },
      // }).unwrap()

      toast.success("Project submitted for review successfully!")
      onOpenChange(false)
      setIsSuccessModalOpen(true)

      if (onSuccess) {
        await onSuccess()
      }
    } catch (error: any) {
      console.error("Error submitting project for review:", error)
      toast.error(error.data?.message || "Failed to submit project for review")
    }
  }

  // const handleFileDelete = (type: string) => {
  //   if (projectId) {
  //     const formDataToUpload = new FormData()
      
  //     if (type === "thumbnail") {
  //       formDataToUpload.append("fileUrls[thumbnail]", "")
  //     } else if (type === "synopsisDoc") {
  //       formDataToUpload.append("fileUrls[synopsisDoc]", "")  
  //     } else if (type === "images") {
  //       formDataToUpload.append("fileUrls[images]", "")
  //     }
      
  //     formDataToUpload.append("action", "update")
      
  //     handleProjectFiles({
  //       projectId,
  //       formData: formDataToUpload,
  //     }).unwrap()
  //   }
    
  //   setPersistedFiles((prev) => ({
  //     ...prev,
  //     [type]: { url: "", key: "" },
  //   }))
  // }

  const renderSubmitButtons = () => {
    return (
      <div className="flex items-center gap-4">
        <span
          onClick={handleSaveDraft}
          className="text-gray-500 hover:text-gray-700 cursor-pointer underline text-sm font-medium"
        >
          Save as Draft
        </span>
        <button
          type="button"
          onClick={handleSubmitForReview}
          className="flex px-8 py-2 justify-center items-center gap-2 rounded-md bg-black text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Submit for Review
        </button>
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setFormData({
            projectName: "",
            description: "",
            goalId:"",
            skills: [],
            images: [],
            synopsisDoc: "",
            githubLinks: [""],
            liveLink: "",
            thumbnail: "",
            uploadedFiles: {},
          })
          setCurrentStep(0)
          setErrors({})
          setUploadedFiles({})
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="!p-8 !pb-10 w-[700px] !max-w-[700px] min-h-[615px] max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left !p-0 !m-0">
          <DialogTitle className="text-xl font-semibold">{STEPS[currentStep]}</DialogTitle>
        </DialogHeader>

        <ProgressBar steps={STEPS} currentStep={currentStep} />

        <div className="flex-1 overflow-y-auto pr-2 scroll-smooth">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
            <div className="flex-1">
              {currentStep === 0 && (
                <ProjectDetailsStep
                  projectName={formData.projectName}
                  description={formData.description}
                  onChange={(field, value) => handleUpdateFormData(field as keyof FormData, value)}
                  errors={errors}
                  isEditing={isEditing}
                  goalId={formData.goalId}
                />
              )}
              {currentStep === 1 && (
                <ProjectSkillsStep selectedSkills={formData.skills} setSelectedSkills={handleSetSelectedSkills} />
              )}
              {currentStep === 2 && (
                <UploadLinksStep
                  images={formData.images}
                  setImages={(images) => handleUpdateFormData("images", images)}
                  synopsisDoc={formData.synopsisDoc}
                  setSynopsisDoc={(pdf) => handleUpdateFormData("synopsisDoc", pdf)}
                  githubLinks={formData.githubLinks}
                  setGithubLinks={(links) => handleUpdateFormData("githubLinks", links)}
                  liveLink={formData.liveLink}
                  setLiveLink={(value) => handleUpdateFormData("liveLink", value)}
                  thumbnail={formData.thumbnail}
                  setThumbnail={(image) => handleUpdateFormData("thumbnail", image)}
                  existingImages={formData.uploadedFiles.images?.url || existingProject?.images}
                  existingSynopsis={existingProject?.synopsis}
                  existingSynopsisDoc={formData.uploadedFiles.synopsisDoc?.url || existingProject?.synopsisDoc}
                  existingThumbnail={formData.uploadedFiles.thumbnail?.url || existingProject?.thumbnail}
                  projectId={projectId!}
                  onFileUploaded={(type, url, key) => {
                    setUploadedFiles((prev) => ({
                      ...prev,
                      [type]: { url, key },
                    }))
                    setPersistedFiles((prev) => ({
                      ...prev,
                      [type]: { url, key },
                    }))
                    if (type === "images") {
                      setFormData((prev) => ({
                        ...prev,
                        images: [], // Clear the images array when new images are uploaded
                      }))
                    } else if (type === "synopsisDoc") {
                      setFormData((prev) => ({
                        ...prev,
                        synopsisDoc: "", // Clear the synopsisPdf when a new one is uploaded
                      }))
                    } else if (type === "thumbnail") {
                      console.log("Clearing coverImage");
                      
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: "", // Clear the coverImage when a new one is uploaded
                      }))
                    }
                  } }
                  repoStatuses={{}}
                  persistedFiles={persistedFiles}
                  onDeleteFile={(type) => {
                    setPersistedFiles((prev) => ({
                      ...prev,
                      [type]: { url: "", key: "" },
                    }))
                  } }
                  setPersistedFiles={setPersistedFiles}               />
              )}
              {currentStep === 3 && (
                <ReviewStep existingProject={projectDetails} onEdit={(step) => setCurrentStep(step)} />
              )}
            </div>
          </form>
        </div>

        <div className="pt-6 mt-6 border-t shrink-0">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex px-8 py-2 justify-center items-center gap-2 rounded-md border border-gray-300 text-[#555555] hover:border-black disabled:opacity-50 cursor-pointer font-inter text-base font-semibold leading-5 transition-colors"
            >
              Previous
            </button>
            {currentStep === STEPS.length - 1 ? (
              renderSubmitButtons()
            ) : (
              <button
                type="button"
                onClick={handleNext}
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
            setIsSuccessModalOpen(false)
          }}
          onRefresh={onSuccess}
        />
      )}
    </Dialog> 
  )
}
