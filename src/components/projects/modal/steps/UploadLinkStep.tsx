import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Github,
  GlobeLock,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType,
  Trash2,
  X,
  Plus,
  Lock,
  CheckCircle,
} from "lucide-react"
import FileUploadArea from "../FileUploadArea"
import axios from "axios"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import UploadProgressBar from "./UploadProgressBar"
import { useGetProjectQuery, useHandleProjectFilesMutation } from "@/api/projectApiSlice"
import { extractFileNameFromUrl } from "@/utils/projects/fileUtils"

// Define interfaces for file uploads
interface FileUploadState<T extends File> {
  file: T | null
  status: "idle" | "uploading" | "uploaded" | "error"
  progress: number
  url?: string
  s3Key?: string
  originalFileName?: string
}

type FileEntry = {
  url: string
  key: string
}

type PersistentFiles = {
  images: FileEntry
  thumbnail: FileEntry
  synopsisDoc: FileEntry
  [key: string]: FileEntry
}

interface ImageFile {
  file: File
  id: string
  status: "uploading" | "uploaded" | "error"
  progress: number
  url?: string
  s3Key?: string
}

interface UploadLinksStepProps {
  images: File[]
  setImages: (images: File[]) => void
  synopsisDoc: File | ""
  setSynopsisDoc: (file: File | "") => void
  githubLinks: string[]
  setGithubLinks: (links: string[]) => void
  liveLink: string
  setLiveLink: (value: string) => void
  thumbnail: File | ""
  setThumbnail: (image: File | "") => void
  projectId: string
  onFileUploaded?: (type: string, url: string, key: string) => void
  repoStatuses: { [key: string]: boolean | undefined }
  onDeleteFile: (type: string) => void
  persistedFiles: PersistentFiles
  setPersistedFiles: (files: ((prevFiles: PersistentFiles) => PersistentFiles) | PersistentFiles) => void
  existingImages?: string | string[]
  existingSynopsis?: string
  existingSynopsisDoc?: string
  existingThumbnail?: string
}

const UploadLinksStep: React.FC<UploadLinksStepProps> = ({
  images,
  setImages,
  synopsisDoc,
  setSynopsisDoc,
  githubLinks,
  setGithubLinks,
  liveLink,
  setLiveLink,
  thumbnail,
  setThumbnail,
  existingImages,
  existingSynopsis,
  existingSynopsisDoc,
  existingThumbnail,
  projectId,
  onFileUploaded,
  repoStatuses,
  onDeleteFile,
  persistedFiles,
  setPersistedFiles,
}) => {
  const [handleProjectFiles] = useHandleProjectFilesMutation()
  const [thumbnailUploadState, setThumbnailUploadState] = useState<FileUploadState<File>>({
    file: null,
    status: persistedFiles.thumbnail?.url ? "uploaded" : "idle",
    progress: persistedFiles.thumbnail?.url ? 100 : 0,
    url: persistedFiles.thumbnail?.url || "",
    s3Key: persistedFiles.thumbnail?.key || "",
    originalFileName: persistedFiles.thumbnail?.url ? extractFileNameFromUrl(persistedFiles.thumbnail.url) : undefined,
  })

  const [synopsisUploadState, setSynopsisUploadState] = useState<FileUploadState<File>>({
    file: null,
    status: persistedFiles.synopsisDoc?.url ? "uploaded" : "idle",
    progress: persistedFiles.synopsisDoc?.url ? 100 : 0,
    url: persistedFiles.synopsisDoc?.url || "",
    originalFileName: persistedFiles.synopsisDoc?.url
      ? extractFileNameFromUrl(persistedFiles.synopsisDoc.url)
      : undefined,
  })

  const { data: projectInfo } = useGetProjectQuery(projectId, {
    refetchOnMountOrArgChange: true,
  })

  const projectDetails = projectInfo?.data

  console.log("_______________________")
  console.log("projectDetails", projectDetails?.images)
  console.log("___________________________")

  // Initial state setup
  const [imageUploadState, setImageUploadState] = useState<{
    files: { [key: string]: ImageFile }
  }>(() => {
    // First check persistedFiles
    if (persistedFiles.images?.url) {
      try {
        let parsedImages: string[]
        try {
          parsedImages =
            typeof persistedFiles.images.url === "string"
              ? JSON.parse(persistedFiles.images.url)
              : persistedFiles.images.url

          if (!Array.isArray(parsedImages)) {
            parsedImages = parsedImages ? [parsedImages] : []
          }
        } catch (e) {
          console.error("Error parsing persisted images:", e)
          return { files: {} }
        }

        const existingImages = parsedImages.map((url: string, index: number) => ({
          id: `existing-${index}`,
          url,
          status: "uploaded" as const,
          progress: 100,
          file: new File([], extractFileNameFromUrl(url)),
          s3Key: url,
          originalFileName: extractFileNameFromUrl(url),
        }))

        return {
          files: existingImages.reduce(
            (acc, img) => ({
              ...acc,
              [img.id]: img,
            }),
            {},
          ),
        }
      } catch (error) {
        console.error("Error initializing image state:", error)
        return { files: {} }
      }
    }
    // If no persistedFiles, check projectDetails
    else if (projectDetails?.images) {
      const images = Array.isArray(projectDetails.images) ? projectDetails.images : [projectDetails.images]

      const existingImages = images.map((url, index) => ({
        id: `existing-${index}`,
        url,
        status: "uploaded" as const,
        progress: 100,
        file: new File([], extractFileNameFromUrl(url)),
        s3Key: url,
        originalFileName: extractFileNameFromUrl(url),
      }))

      return {
        files: existingImages.reduce(
          (acc, img) => ({
            ...acc,
            [img.id]: img,
          }),
          {},
        ),
      }
    }

    return { files: {} }
  })

  const [localRepoStatuses, setLocalRepoStatuses] = useState<{
    [key: string]: { status: boolean | null; loading: boolean }
  }>({})

  console.log("imageUploadState", imageUploadState)
  console.log("persistedFiles img", persistedFiles.images)

  useEffect(() => {
    if (persistedFiles.thumbnail?.url) {
      setThumbnailUploadState((prev) => ({
        ...prev,
        status: "uploaded",
        progress: 100,
        url: persistedFiles.thumbnail.url,
        s3Key: persistedFiles.thumbnail.key,
        originalFileName: extractFileNameFromUrl(persistedFiles.thumbnail.url),
      }))
    }

    if (persistedFiles.synopsisDoc?.url) {
      setSynopsisUploadState((prev) => ({
        ...prev,
        status: "uploaded",
        progress: 100,
        url: persistedFiles.synopsisDoc.url,
        s3Key: persistedFiles.synopsisDoc.key,
        originalFileName: extractFileNameFromUrl(persistedFiles.synopsisDoc.url),
      }))
    }

    if (persistedFiles.images?.url) {
      try {
        const parsedImages = JSON.parse(persistedFiles.images.url)
        const images = Array.isArray(parsedImages) ? parsedImages : [parsedImages]

        const updatedFiles = images.reduce((acc, url, index) => {
          const id = `existing-${index}`
          return {
            ...acc,
            [id]: {
              id,
              url,
              status: "uploaded" as const,
              progress: 100,
              file: new File([], extractFileNameFromUrl(url)),
              s3Key: url,
              originalFileName: extractFileNameFromUrl(url),
            },
          }
        }, {})

        setImageUploadState((prev) => ({
          ...prev,
          files: updatedFiles,
        }))
      } catch (error) {
        console.error("Error updating image state:", error)
      }
    }
  }, [persistedFiles])

  const user_id = useSelector((state: RootState) => state.auth.user?._id)

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    try {
      if (!url || !url.includes("github.com/")) return null

      let path: string
      if (url.startsWith("git@")) {
        path = url.split(":")[1]
      } else {
        const urlObj = new URL(url)
        path = urlObj.pathname.substring(1)
      }

      const [owner, repo] = path.replace(/\.git$/, "").split("/")
      if (!owner || !repo) throw new Error("Invalid GitHub URL format")
      return { owner, repo }
    } catch (error) {
      console.error("Error parsing GitHub URL:", error)
      return null
    }
  }

  // GitHub Repo Validation
  const checkGitHubRepoAccess = async (repoUrl: string): Promise<boolean> => {
    try {
      const parsedUrl = parseGitHubUrl(repoUrl)
      if (!parsedUrl) {
        console.error("Invalid GitHub URL format:", repoUrl)
        return false
      }

      const { owner, repo } = parsedUrl
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Project-Upload-App",
        },
      })

      return response.status === 200 && !response.data.private
    } catch (error) {
      console.error("GitHub API Error:", error)
      return false
    }
  }

  const validateGithubLink = async (link: string) => {
    if (!link.trim()) return { status: null, loading: false }

    try {
      setLocalRepoStatuses((prev) => ({
        ...prev,
        [link]: { status: null, loading: true },
      }))

      const isPublic = await checkGitHubRepoAccess(link)

      setLocalRepoStatuses((prev) => ({
        ...prev,
        [link]: { status: isPublic, loading: false },
      }))

      return { status: isPublic, loading: false }
    } catch (error) {
      setLocalRepoStatuses((prev) => ({
        ...prev,
        [link]: { status: false, loading: false },
      }))
      return { status: false, loading: false }
    }
  }

  // Load existing images on component mount
  useEffect(() => {
    if (projectDetails?.images) {
      const images = Array.isArray(projectDetails.images) ? projectDetails.images : [projectDetails.images]

      // Initialize imageUploadState with existing images
      const existingImageFiles = images.map((url, index) => ({
        id: `existing-${index}`,
        url,
        status: "uploaded" as const,
        progress: 100,
        file: new File([], extractFileNameFromUrl(url)),
        s3Key: url,
        originalFileName: extractFileNameFromUrl(url),
      }))

      setImageUploadState({
        files: existingImageFiles.reduce(
          (acc, img) => ({
            ...acc,
            [img.id]: img,
          }),
          {},
        ),
      })

      // Update persistedFiles to match
      setPersistedFiles((prev) => ({
        ...prev,
        images: {
          url: JSON.stringify(images),
          key: "",
        },
      }))
    }
  }, [projectDetails])

  // Thumbnail Upload Handler
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setThumbnailUploadState({
        file,
        status: "uploading",
        progress: 0,
      })

      try {
        const formData = new FormData()
        formData.append("files", file)
        formData.append("folder", `projects/${projectId}/thumbnail`)
        formData.append("userId", user_id!)

        const response = await axios.post(`https://employability.ai/api/v1/s3/upload`, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
            setThumbnailUploadState((prev) => ({
              ...prev,
              progress,
            }))
          },
        })

        const [uploadedFile] = response.data.data
        setThumbnailUploadState({
          file,
          status: "uploaded",
          progress: 100,
          url: uploadedFile.fileUrl,
          s3Key: uploadedFile.key,
        })

        setPersistedFiles((prev) => ({
          ...prev,
          thumbnail: { url: uploadedFile.fileUrl, key: uploadedFile.key },
        }))

        onFileUploaded?.("thumbnail", uploadedFile.fileUrl, uploadedFile.key)
      } catch (error) {
        setThumbnailUploadState({
          file,
          status: "error",
          progress: 0,
        })
        toast.error("Failed to upload cover image")
      }
    }
  }

  // Synopsis Upload Handler
  const handleSynopsisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]

      if (validTypes.includes(file.type)) {
        setSynopsisUploadState({
          file,
          status: "uploading",
          progress: 0,
        })

        try {
          const formData = new FormData()
          formData.append("files", file)
          formData.append("folder", `projects/${projectId}/synopsisDoc`)
          formData.append("userId", user_id!)

          const response = await axios.post(`https://employability.ai/api/v1/s3/upload`, formData, {
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
              setSynopsisUploadState((prev) => ({
                ...prev,
                progress,
              }))
            },
          })

          const [uploadedFile] = response.data.data
          setSynopsisUploadState({
            file,
            status: "uploaded",
            progress: 100,
            url: uploadedFile.fileUrl,
            s3Key: uploadedFile.key,
          })

          setPersistedFiles((prev) => ({
            ...prev,
            synopsisDoc: { url: uploadedFile.fileUrl, key: uploadedFile.key },
          }))

          onFileUploaded?.("synopsisDoc", uploadedFile.fileUrl, uploadedFile.key)
        } catch (error) {
          setSynopsisUploadState({
            file,
            status: "error",
            progress: 0,
          })
          toast.error("Failed to upload synopsis document")
        }
      } else {
        toast.error("Please select a PDF, DOCX, or TXT file")
      }
    }
  }

  // Project Images Upload Handler
  const handleImagesUpload = async (fileList: FileList | null) => {
    if (!fileList) return

    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"))

    // Create entries for new files
    const newFiles: { [key: string]: ImageFile } = {}
    files.forEach((file) => {
      const id = `new-${Math.random().toString(36).substring(7)}`
      newFiles[id] = {
        file,
        id,
        status: "uploading",
        progress: 0,
      }
    })

    // Update state with new files
    setImageUploadState((prev) => ({
      files: { ...prev.files, ...newFiles },
    }))

    console.log("newfiles", newFiles)

    // Upload new files
    const uploadPromises = Object.entries(newFiles).map(async ([id, imageFile]) => {
      try {
        const formData = new FormData()
        formData.append("files", imageFile.file)
        formData.append("folder", `projects/${projectId}/images`)
        formData.append("userId", user_id!)

        const response = await axios.post(`https://employability.ai/api/v1/s3/upload`, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0

            setImageUploadState((prev) => ({
              files: {
                ...prev.files,
                [id]: {
                  ...prev.files[id],
                  progress,
                },
              },
            }))
          },
        })

        const [uploadedFile] = response.data.data

        setImageUploadState((prev) => ({
          files: {
            ...prev.files,
            [id]: {
              ...prev.files[id],
              status: "uploaded",
              progress: 100,
              url: uploadedFile.fileUrl,
              s3Key: uploadedFile.key,
            },
          },
        }))

        console.log("imageUploadState in uploads", imageUploadState)

        return uploadedFile.fileUrl
      } catch (error) {
        setImageUploadState((prev) => ({
          files: {
            ...prev.files,
            [id]: {
              ...prev.files[id],
              status: "error",
              progress: 0,
            },
          },
        }))
        toast.error(`Failed to upload ${imageFile.file.name}`)
        return null
      }
    })

    const uploadedUrls = await Promise.all(uploadPromises)
    const validUrls = uploadedUrls.filter((url) => url !== null)

    if (validUrls.length > 0) {
      // Combine existing and new URLs
      const existingUrls = Object.values(imageUploadState.files)
        .filter((file) => file.status === "uploaded" && file.url)
        .map((file) => file.url)

      const allUrls = [...existingUrls, ...validUrls]

      // Update persisted files
      setPersistedFiles((prev) => ({
        ...prev,
        images: { url: JSON.stringify(allUrls), key: "" },
      }))

      // Notify parent component
      onFileUploaded?.("images", JSON.stringify(allUrls), "")
    }
  }

  // File Delete Handlers
  // Utility function to extract S3 key from URL
  const getS3KeyFromUrl = (url: string): string | null => {
    try {
      // Parse the URL to get the pathname
      const urlPath = new URL(url).pathname
      // Remove the leading slash and return the path as the key
      return urlPath.startsWith("/") ? urlPath.slice(1) : urlPath
    } catch (error) {
      console.error("Error parsing URL:", error)
      return null
    }
  }

  const handleThumbnailDelete = async () => {
    if (!projectId) return

    try {
      // Get key from either uploaded file or existing thumbnail
      const key =
        thumbnailUploadState.s3Key ||
        (existingThumbnail ? getS3KeyFromUrl(existingThumbnail) : null) ||
        persistedFiles.thumbnail?.key

      if (key) {
        // Delete from S3
        try {
          await axios.delete(`https://employability.ai/api/v1/s3/delete`, {
            data: { key },
          })
        } catch (error) {
          console.error("Error deleting from S3:", error)
        }
      }

      // Reset local state
      setThumbnailUploadState({
        file: null,
        status: "idle",
        progress: 0,
        url: "",
        s3Key: "",
      })

      // Clear parent states
      onDeleteFile("thumbnail")
      setThumbnail("")
      onFileUploaded?.("thumbnail", "", "")

      // Update persisted files
      setPersistedFiles((prev) => ({
        ...prev,
        thumbnail: { url: "", key: "" },
      }))

      toast.success("Thumbnail deleted successfully")
    } catch (error) {
      console.error("Error deleting thumbnail:", error)
      toast.error("Failed to delete thumbnail")
    }
  }

  const handleSynopsisDelete = async () => {
    if (!projectId) return

    try {
      // Get key from either uploaded file or existing synopsis
      const key =
        synopsisUploadState.s3Key ||
        (existingSynopsisDoc ? getS3KeyFromUrl(existingSynopsisDoc) : null) ||
        persistedFiles.synopsisDoc?.key

      if (key) {
        // Delete from S3
        try {
          await axios.delete(`https://employability.ai/api/v1/s3/delete`, {
            data: { key },
          })
        } catch (error) {
          console.error("Error deleting from S3:", error)
        }
      }

      // Reset local state
      setSynopsisUploadState({
        file: null,
        status: "idle",
        progress: 0,
        url: "",
        s3Key: "",
      })

      // Update database
      const formDataToUpload = new FormData()
      formDataToUpload.append("fileUrls[synopsisDoc]", "")
      formDataToUpload.append("action", "update")

      await handleProjectFiles({
        projectId,
        formData: formDataToUpload,
      }).unwrap()

      // Clear parent states
      onDeleteFile("synopsisDoc")
      setSynopsisDoc("")
      onFileUploaded?.("synopsisDoc", "", "")

      // Update persisted files
      setPersistedFiles((prev) => ({
        ...prev,
        synopsisDoc: { url: "", key: "" },
      }))

      toast.success("Synopsis document deleted successfully")
    } catch (error) {
      console.error("Error deleting synopsis document:", error)
      toast.error("Failed to delete synopsis document")
    }
  }

  const handleImageRemove = async (id: string) => {
    const imageFile = imageUploadState.files[id]
    if (imageFile && imageFile.s3Key) {
      try {
        await axios.delete(`https://employability.ai/api/v1/s3/delete`, {
          data: { key: imageFile.s3Key },
        })
        setImageUploadState((prev) => {
          const { [id]: deleted, ...remainingFiles } = prev.files
          return { files: remainingFiles }
        })
        const remainingUrls = Object.values(imageUploadState.files)
          .filter((f) => f.status === "uploaded" && f.url && f.id !== id)
          .map((f) => f.url)
        onFileUploaded?.("images", JSON.stringify(remainingUrls), "")
        if (Object.keys(imageUploadState.files).length === 1) {
          onDeleteFile("images")
        }
        toast.success("Image deleted successfully")
      } catch (error) {
        console.error("Error deleting image:", error)
        toast.error("Failed to delete image")
      }
    }
  }

  // GitHub Links Handlers
  const handleAddGithubLink = () => setGithubLinks([...githubLinks, ""])

  const handleRemoveGithubLink = (index: number) => {
    const newLinks = [...githubLinks]
    newLinks.splice(index, 1)
    setGithubLinks(newLinks)
  }

  const handleGithubLinkChange = (index: number, value: string) => {
    const newLinks = [...githubLinks]
    newLinks[index] = value
    setGithubLinks(newLinks)
    validateGithubLink(value)
  }

  const ThumbnailPreview = () => {
    const { file, status, progress, url } = thumbnailUploadState
    const thumbnailUrl = url || (file && URL.createObjectURL(file))

    // Get filename either from the file object or extract it from the URL
    const originalName = file?.name || (url && extractFileNameFromUrl(url)) || "Uploaded Thumbnail"

    // Trim the displayed name to a maximum of 15 characters
    const displayName =
      originalName.length > 15 ? `${originalName.slice(0, 15)}...${originalName.slice(-3)}` : originalName

    if (!file && !thumbnailUrl) return null

    return (
      <div className="w-full flex flex-col p-3 rounded-lg bg-[#F0F5F3]" title={originalName}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt="Thumbnail"
                className="h-10 w-10 object-cover rounded"
              />
            ) : (
              <FileImage className="h-10 w-10 text-gray-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{displayName}</p>
            </div>
          </div>
          <button onClick={handleThumbnailDelete} className="ml-2 p-1 hover:bg-gray-100 rounded-full">
            <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
          </button>
        </div>
        {status === "uploading" && <UploadProgressBar progress={progress || 0} />}
        {status === "error" && <p className="text-red-500 text-sm mt-1">Upload failed</p>}
      </div>
    )
  }

  // Update the SynopsisPreview component
  const SynopsisPreview = () => {
    const { file, status, progress, url } = synopsisUploadState
    const synopsisUrl = url

    // Get filename either from the file object or extract it from the URL
    const originalName = file?.name || (url && extractFileNameFromUrl(url)) || "Uploaded Synopsis"

    // Trim the displayed name to a maximum of 15 characters
    const displayName =
      originalName.length > 15 ? `${originalName.slice(0, 15)}...${originalName.slice(-3)}` : originalName

    if (!file && !synopsisUrl) return null

    return (
      <div className="w-full flex flex-col p-3 rounded-lg bg-[#F0F5F3]" title={originalName}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <FileText className="h-6 w-6 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{displayName}</p>
            </div>
          </div>
          <button onClick={handleSynopsisDelete} className="ml-2 p-1 hover:bg-gray-100 rounded-full">
            <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
          </button>
        </div>
        {status === "uploading" && <UploadProgressBar progress={progress || 0} />}
        {status === "error" && <p className="text-red-500 text-sm mt-1">Upload failed</p>}
      </div>
    )
  }

  const ImageFileDisplay = ({ id }: { id: string }) => {
    const imageFile = imageUploadState.files[id]

    if (!imageFile) return null

    const imageUrl = imageFile.url || (imageFile.file && URL.createObjectURL(imageFile.file))

    // Trim the displayed name to a maximum of 15 characters
    const displayName =
      imageFile.file.name.length > 15
        ? `${imageFile.file.name.slice(0, 15)}...${imageFile.file.name.slice(-3)}`
        : imageFile.file.name

    return (
      <div className="w-full flex flex-col p-3 rounded-lg bg-[#F0F5F3]" title={imageFile.file.name}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={imageFile.file.name}
                className="h-10 w-10 object-cover rounded"
              />
            ) : (
              <FileImage className="h-10 w-10 text-gray-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{displayName}</p>
            </div>
          </div>
          <button onClick={() => handleImageRemove(id)} className="ml-2 p-1 hover:bg-gray-100 rounded-full">
            <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
          </button>
        </div>
        {imageFile.status === "uploading" && <UploadProgressBar progress={imageFile.progress || 0} />}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 ">
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Welcome to Your Project Showcase!</h2>
        <p className="text-blue-700 mb-2">Let's make your project shine. Here's what you'll be adding:</p>
        <ul className="list-disc list-inside text-blue-600 space-y-1">
          <li>
            <strong>GitHub Links:</strong> Share your code repositories
          </li>
          <li>
            <strong>Live Link:</strong> Show off your deployed project
          </li>
          <li>
            <strong>Cover Image:</strong> A eye-catching preview of your work
          </li>
          <li>
            <strong>Synopsis Document:</strong> Detailed explanation of your project
          </li>
          <li>
            <strong>Project Images:</strong> Showcase different aspects of your project
          </li>
        </ul>
        <p className="text-blue-700 mt-4">
          Take your time to fill in each section. Your thorough presentation will help others appreciate your hard work!
        </p>
      </div>
      {/* Project Links Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Project Links</h2>
          <Button
            type="button"
            onClick={handleAddGithubLink}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add GitHub Link
          </Button>
        </div>

        {/* GitHub Links */}
        <div className="space-y-4">
          {githubLinks.map((link, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    placeholder="Paste GitHub link"
                    value={link}
                    onChange={(e) => handleGithubLinkChange(index, e.target.value)}
                    className="pl-10 pr-10 bg-gray-50 border-gray-200"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    {localRepoStatuses[link]?.loading && (
                      <div className="animate-spin h-5 w-5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    )}
                    {localRepoStatuses[link]?.status === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {localRepoStatuses[link]?.status === false && <Lock className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveGithubLink(index)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {localRepoStatuses[link]?.status === false && link && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Private Repository - Please make it public</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Link */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <GlobeLock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="url"
            placeholder="Personal/Portfolio website"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </section>

      {/* Cover Image Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Upload a Cover Image</h2>
        </div>
        <div className="flex items-start gap-5 w-full">
          <div className="w-1/2 h-[320px] flex flex-col justify-center items-center gap-4 rounded-[13px] border border-dashed border-[#909091]">
            <input
              type="file"
              id="coverImageInput"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
            <label
              htmlFor="coverImageInput"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <FileImage className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 text-center">
                Drag and drop your image here, or <span className="text-[#03963f]">browse</span>
              </p>
            </label>
          </div>
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-start items-start gap-4 rounded-[13px]">
            <ThumbnailPreview />
          </div>
        </div>
      </section>

      {/* Synopsis Document Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Upload Synopsis Document</h2>
        </div>
        <div className="flex items-start gap-5 w-full">
          <div className="w-1/2 h-[320px] flex flex-col justify-center items-center gap-4 rounded-[13px] border border-dashed border-[#909091]">
            <input
              type="file"
              id="synopsisPdfInput"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleSynopsisUpload}
              className="hidden"
            />
            <label
              htmlFor="synopsisPdfInput"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <div className="flex justify-center gap-4">
                <FileSpreadsheet className="w-10 h-10 text-gray-400" />
                <FileType className="w-10 h-10 text-gray-400" />
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">Upload Synopsis (PDF, DOCX, TXT)</p>
              <p className="text-sm text-[#03963f] text-center mt-2">browse</p>
            </label>
          </div>
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-start items-start gap-4 rounded-[13px]">
            <SynopsisPreview />
          </div>
        </div>
      </section>

      {/* Project Images Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Project Images</h2>
        </div>
        <div className="flex items-start gap-5 w-full">
          <div className="w-1/2 h-[320px] flex flex-col justify-center items-center gap-4 rounded-[13px] border border-dashed border-[#909091]">
            <FileUploadArea
              id="imagesInput"
              onFilesSelected={handleImagesUpload}
              multiple={true}
              label="Drag and drop your images"
              accept=".png,.jpg,.jpeg,.gif"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <FileImage className="w-10 h-10 text-gray-400 mb-2" />
            </FileUploadArea>
          </div>
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-start items-start gap-4 rounded-[13px] overflow-y-auto">
            {Object.entries(imageUploadState.files).map(([id, file]) => (
              <ImageFileDisplay key={id} id={id} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default UploadLinksStep

