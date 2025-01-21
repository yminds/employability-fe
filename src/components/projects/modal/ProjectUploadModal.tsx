import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { 
  useAddProjectMutation, 
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
  skills: Skill[]
  images: File[]
  synopsisPdf: File | null
  githubLinks: string[]
  liveLink: string
  coverImage: File | null
}

interface FormErrors {
  projectName?: string[]
  description?: string[]
  githubLinks?: string[]
}

interface ProjectUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?:()=>Promise<void>;
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

const STEPS = [
  "Enter Project Details",
  "Project Skills",
  "Upload Files & Links",
  "Review Your Project",
]

// const SuccessAlert = () => (
//   <Alert className="bg-green-50 border-green-200 mb-4">
//     <AlertDescription className="text-green-800">
//       Project details saved successfully!
//     </AlertDescription>
//   </Alert>
// )

export function ProjectUploadModal({
  open,
  onOpenChange,
  existingProject,
  onSuccess,
}: ProjectUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  // const [showSuccess, setShowSuccess] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [projectId, setProjectId] = React.useState<string | null>(null)
  const [repoStatuses, setRepoStatuses] = React.useState<{ [key: string]: boolean | undefined }>({})
  const [isCheckingRepo, setIsCheckingRepo] = React.useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  const [formData, setFormData] = React.useState<FormData>({
    projectName: "",
    description: "",
    skills: [],
    images: [],
    synopsisPdf: null,
    githubLinks: [''],
    liveLink: "",
    coverImage: null,
  })

  const user = useSelector((state: RootState) => state?.auth.user)
  const user_id = user?._id
  
  const [addProject, { isLoading: isSubmitting }] = useAddProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const [updateProjectTech, { isLoading: isTechUpdating }] = useUpdateProjectTechMutation()
  const [handleProjectFiles, { isLoading: isFilesUploading }] = useHandleProjectFilesMutation()

  // Initialize form with existing project data or reset when modal closes
  React.useEffect(() => {
    if (existingProject && open) {
      setFormData({
        projectName: existingProject.name,
        description: existingProject.description,
        skills: existingProject.tech,
        githubLinks: existingProject.githubLink.length > 0 ? existingProject.githubLink : [''],
        liveLink: existingProject.liveLink || "",
        images: [],
        synopsisPdf: null,
        coverImage: null,
      })
      setProjectId(existingProject._id)
      setIsEditing(true)
      
      // Determine current step based on project status
      switch(existingProject.status) {
        case 'Incomplete':
          setCurrentStep(0)
          break
        case 'In-review':
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
        skills: [],
        images: [],
        synopsisPdf: null,
        githubLinks: [''],
        liveLink: "",
        coverImage: null,
      })
      setProjectId(null)
      setCurrentStep(0)
      setIsEditing(false)
    }
  }, [existingProject, open])

  // Reset repo statuses when changing steps
  React.useEffect(() => {
    setRepoStatuses({})
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
              status: 'Incomplete'
            }
          }).unwrap()

          if (response.success) {
            toast.success("Project details updated successfully")
            setCurrentStep((prev)=>prev + 1)
          }
        } else {

          if(projectId){
            setCurrentStep((prev)=> prev + 1)
            return
          }
          // Create new project
          const response = await addProject({
            userId: user_id!,
            name: formData.projectName.trim(),
            description: formData.description.trim(),
            status: 'Incomplete'
          }).unwrap()

          if (response.success) {
            setProjectId(response.data._id)
            toast.success("Project detail saved successfully!")
            setCurrentStep((prev)=> prev + 1)
          }
        }
      } else if (currentStep === 1) {
        if (!projectId) {
          return
        }

        if (formData.skills.length > 0) {
          const technologies = formData.skills.map(skill => skill._id)
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
    payload: { status: 'Incomplete' }
  }).unwrap()

      } else if (currentStep === 2) {
        const validLinks = formData.githubLinks.filter(link => link.trim() !== '')
        if (validLinks.length > 0) {
          const areReposValid = await validateGithubLinks()
          if (!areReposValid) {
            return
          }
        }

        if (!projectId) return

        const formDataToUpload = new FormData()
        formDataToUpload.append('githubLinks', JSON.stringify(validLinks))

        if (formData.liveLink) {
          formDataToUpload.append('liveLink', formData.liveLink)
        }

        if (formData.images.length > 0) {
          formData.images.forEach((image) => {
            formDataToUpload.append('images', image)
          })
        }

        if (formData.synopsisPdf) {
          formDataToUpload.append('synopsisDoc', formData.synopsisPdf)
        }

        if (formData.coverImage) {
          formDataToUpload.append('thumbnail', formData.coverImage)
        }

        formDataToUpload.append('action', 'submit')

        try {
          const filesResponse = await handleProjectFiles({
            projectId,
            formData: formDataToUpload
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
      } else if (currentStep === 3) {
        return
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
      setRepoStatuses({})
    }
  }

  const handleUpdateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
    if (field === 'githubLinks') {
      setRepoStatuses({})
    }
  }

  const handleSetSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>> = React.useCallback(
    (skillsOrFn) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        skills:
          typeof skillsOrFn === "function"
            ? skillsOrFn(prevFormData.skills)
            : skillsOrFn,
      }))
    },
    [setFormData]
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

      // Create or update project as a draft
      const payload = {
        name: formData.projectName.trim(),
        description: formData.description.trim(),
        status: 'Incomplete'
      }

      if (isEditing && projectId) {
        // Update existing project
        await updateProject({
          projectId,
          payload
        }).unwrap()

        if(formData.skills.length > 0){
          const technologies = formData.skills.map(skill=>skill._id)
          await updateProjectTech({
            projectId,
            technologies
          }).unwrap()
        }

        if (formData.images.length > 0 || formData.synopsisPdf || formData.coverImage) {
          const formDataToUpload = new FormData()
          
          if (formData.githubLinks.length > 0) {
            formDataToUpload.append('githubLinks', JSON.stringify(formData.githubLinks.filter(link => link.trim() !== '')))
          }
  
          if (formData.liveLink) {
            formDataToUpload.append('liveLink', formData.liveLink)
          }
  
          if (formData.images.length > 0) {
            formData.images.forEach((image) => {
              formDataToUpload.append('images', image)
            })
          }
  
          if (formData.synopsisPdf) {
            formDataToUpload.append('synopsisDoc', formData.synopsisPdf)
          }
  
          if (formData.coverImage) {
            formDataToUpload.append('thumbnail', formData.coverImage)
          }
  
          await handleProjectFiles({
            projectId,
            formData: formDataToUpload
          }).unwrap()

      } else {
        // Create new project
        const response = await addProject({
          userId: user_id,
          ...payload
        }).unwrap()

        if (response.success) {
          setProjectId(response.data._id)

          if(formData.skills.length > 0){
            const technologies = formData.skills.map(skill=>skill._id)
            await updateProjectTech({
              projectId: response.data._id,
              technologies
            }).unwrap()
          }
        }
      }
    }
      // Close the modal
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving draft:", error)
      alert(error.data?.message || "Failed to save project draft")
    }
  }

  const isSubmitReady = () => {
    // Check if technologies and github links are added
    return formData.githubLinks.some(link => link.trim() !== '')
  }

  const handleSubmitForReview = async () => {
    try {
      // Validate project details first
      if (!validateProjectDetails()) {
        return
      }

      // Check if technologies and GitHub links are added
      if (!isSubmitReady()) {
        alert("Please add technologies and GitHub links before submitting for review.")
        return
      }

      // Ensure user is logged in
      if (!user_id || !projectId) {
        alert("Please log in and create a project first")
        return
      }

      // Update technologies if added
      const technologies = formData.skills.map(skill => skill._id)
      await updateProjectTech({
        projectId,
        technologies,
      }).unwrap()

      // Validate and handle GitHub links
      const validLinks = formData.githubLinks.filter(link => link.trim() !== '')
      if (validLinks.length > 0) {
        const areReposValid = await validateGithubLinks()
        if (!areReposValid) {
          alert("Please ensure all GitHub repositories are public")
          return
        }

        const formDataToUpload = new FormData()
        formDataToUpload.append('githubLinks', JSON.stringify(validLinks))
        
        // Upload files if any
        if (formData.images.length > 0) {
          formData.images.forEach((image) => {
            formDataToUpload.append('images', image)
          })
        }

        if (formData.synopsisPdf) {
          formDataToUpload.append('synopsisDoc', formData.synopsisPdf)
        }

        if (formData.coverImage) {
          formDataToUpload.append('thumbnail', formData.coverImage)
        }

        await handleProjectFiles({
          projectId,
          formData: formDataToUpload
        }).unwrap()
      }

      // Submit for review
      await updateProject({
        projectId,
        payload: { 
          name: formData.projectName.trim(),
          description: formData.description.trim(),
          status: 'In-review' 
        }
      }).unwrap()
      
      onOpenChange(false)
      setIsSuccessModalOpen(true)

      if(onSuccess){
        await onSuccess()
      }
    } catch (error: any) {
      console.error("Error submitting project for review:", error)
      toast.error(error.data?.message || "Failed to submit project for review")
    }
  }

  const validateGithubLinks = async (): Promise<boolean> => {
    setIsCheckingRepo(true)
    try {
      const validLinks = formData.githubLinks.filter(link => link.trim() !== '')
      if (validLinks.length === 0) return true

      const newStatuses: { [key: string]: boolean } = {}
      let allValid = true

      for (const link of validLinks) {
        try {
          const cleanLink = link
          .trim()
          .replace(/\.git$/, '') // Remove .git extension
          .replace(/\/$/, '') // Remove trailing slash
          .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '') // Remove github.com prefix

          const repoRegex = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+$/
        if (!repoRegex.test(cleanLink)) {
          newStatuses[link] = false
          allValid = false
          continue
        }

        const response = await fetch(`https://api.github.com/repos/${cleanLink}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        })

          const data = await response.json()
          const isPublic = response.ok && !data.private

          newStatuses[link] = isPublic
          if (!isPublic) allValid = false
        } catch (error) {
          console.error(`Error checking repository ${link}:`, error)
          newStatuses[link] = false
          allValid = false
        }
      }

      setRepoStatuses(newStatuses)
      return allValid
    } finally {
      setIsCheckingRepo(false)
    }
  }

  const renderSubmitButtons = () => {
    return (
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="flex px-8 py-2 justify-center items-center gap-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={handleSubmitForReview}
          disabled={!isSubmitReady()}
          className="flex px-8 py-2 justify-center items-center gap-2 rounded-md bg-black text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Submit for Review
        </button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // Reset form when closing
        setFormData({
          projectName: "",
          description: "",
          skills: [],
          images: [],
          synopsisPdf: null,
          githubLinks: [''],
          liveLink: "",
          coverImage: null,
        })
        setCurrentStep(0)
        setErrors({})
        setRepoStatuses({})
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="!p-8 !pb-10 w-[700px] !max-w-[700px] min-h-[615px] max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left !p-0 !m-0">
          <DialogTitle className="text-xl font-semibold">
            {STEPS[currentStep]}
          </DialogTitle>
        </DialogHeader>

        <ProgressBar steps={STEPS} currentStep={currentStep} />


        <div className="flex-1 overflow-y-auto min-h-0">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
            <div className="flex-1">
              {currentStep === 0 && (
                <ProjectDetailsStep
                  projectName={formData.projectName}
                  description={formData.description}
                  onChange={(field, value) => handleUpdateFormData(field as keyof FormData, value)}
                  errors={errors}
                  isEditing={isEditing}
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
                  setImages={(images) => handleUpdateFormData('images', images)}
                  synopsisPdf={formData.synopsisPdf}
                  setSynopsisPdf={(pdf) => handleUpdateFormData('synopsisPdf', pdf)}
                  githubLinks={formData.githubLinks}
                  setGithubLinks={(links) => handleUpdateFormData('githubLinks', links)}
                  repoStatuses={repoStatuses}
                  liveLink={formData.liveLink}
                  setLiveLink={(value) => handleUpdateFormData('liveLink', value)}
                  coverImage={formData.coverImage}
                  setCoverImage={(image) => handleUpdateFormData('coverImage', image)}
                  existingImages={existingProject?.images}
                  existingSynopsis={existingProject?.synopsis}
                  existingSynopsisDoc={existingProject?.synopsisDoc}
                  existingThumbnail={existingProject?.thumbnail}
                />
              )}
              {currentStep === 3 && (
                <div className="p-4 text-center">
                  <ReviewStep formData={formData} />
                </div>
              )}
            </div>

            {errors.githubLinks && (
              <div className="mt-4 text-red-500 text-sm">
                {errors.githubLinks.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
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
                disabled={isSubmitting || isTechUpdating || isFilesUploading || isCheckingRepo || isUpdating}
                className="flex px-[32px] py-[10px] justify-center items-center gap-2 self-stretch bg-black text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                {(isSubmitting || isTechUpdating || isFilesUploading || isCheckingRepo || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCheckingRepo ? 'Checking Repositories...' : 'Next'}
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
    </Dialog>
  )
}

export default ProjectUploadModal