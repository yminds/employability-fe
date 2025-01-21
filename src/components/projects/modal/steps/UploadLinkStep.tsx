import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Github, GlobeLock, FileText, FileImage, FileSpreadsheet, FileType, Trash2, X, Plus, Lock, Unlock, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import FileUploadArea from "../FileUploadArea"
import FileList from "../FileList"
import axios from 'axios'

interface UploadLinksStepProps {
  images: File[]
  setImages: (images: File[]) => void
  synopsisPdf: File | null
  setSynopsisPdf: (file: File | null) => void
  githubLinks: string[]
  setGithubLinks: (links: string[]) => void
  repoStatuses: { [key: string]: boolean | undefined }
  liveLink: string
  setLiveLink: (value: string) => void
  coverImage: File | null
  setCoverImage: (image: File | null) => void
  existingImages?: string
  existingSynopsis?: string
  existingSynopsisDoc?: string
  existingThumbnail?: string
}

const UploadLinksStep: React.FC<UploadLinksStepProps> = ({
  images,
  setImages,
  synopsisPdf,
  setSynopsisPdf,
  githubLinks,
  setGithubLinks,
  repoStatuses,
  liveLink,
  setLiveLink,
  coverImage,
  setCoverImage,
}) => {
  const [uploadProgress, setUploadProgress] = React.useState<{ [key: string]: number }>({})
  const [localRepoStatuses, setLocalRepoStatuses] = React.useState<{ [key: string]: { status: boolean | null, loading: boolean } }>({})

  const simulateUpload = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    try {
      if (!url || !url.includes('github.com/')) return null
      
      let path: string
      if (url.startsWith('git@')) {
        path = url.split(':')[1]
      } else {
        const urlObj = new URL(url)
        path = urlObj.pathname.substring(1)
      }

      const [owner, repo] = path.replace(/\.git$/, '').split('/')
      if (!owner || !repo) throw new Error('Invalid GitHub URL format')
      return { owner, repo }
    } catch (error) {
      console.error('Error parsing GitHub URL:', error)
      return null
    }
  }

  const checkGitHubRepoAccess = async (repoUrl: string): Promise<boolean> => {
    try {
      const parsedUrl = parseGitHubUrl(repoUrl)
      if (!parsedUrl) {
        console.error('Invalid GitHub URL format:', repoUrl)
        return false
      }

      const { owner, repo } = parsedUrl
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Project-Upload-App'
        }
      })

      return response.status === 200 && !response.data.private
    } catch (error) {
      console.error('GitHub API Error:', error)
      return false
    }
  }

  const validateGithubLink = React.useCallback(async (link: string) => {
    if (!link.trim()) {
      return { status: null, loading: false }
    }

    try {
      setLocalRepoStatuses(prev => ({
        ...prev,
        [link]: { status: null, loading: true }
      }))

      const isPublic = await checkGitHubRepoAccess(link)
      
      setLocalRepoStatuses(prev => ({
        ...prev,
        [link]: { status: isPublic, loading: false }
      }))

      return { status: isPublic, loading: false }
    } catch (error) {
      setLocalRepoStatuses(prev => ({
        ...prev,
        [link]: { status: false, loading: false }
      }))
      return { status: false, loading: false }
    }
  }, [])

  const handleAddGithubLink = () => {
    setGithubLinks([...githubLinks, ''])
  }

  const handleRemoveGithubLink = (index: number) => {
    const newLinks = [...githubLinks]
    newLinks.splice(index, 1)
    setGithubLinks(newLinks)
    
    // Remove the status for the removed link
    const removedLink = githubLinks[index]
    setLocalRepoStatuses(prev => {
      const updated = { ...prev }
      delete updated[removedLink]
      return updated
    })
  }

  const handleGithubLinkChange = (index: number, value: string) => {
    const newLinks = [...githubLinks]
    newLinks[index] = value
    setGithubLinks(newLinks)

    // Validate the link as it's being typed
    validateGithubLink(value)
  }

  React.useEffect(() => {
    if (coverImage) {
      simulateUpload(coverImage.name)
    }
  }, [coverImage])

  React.useEffect(() => {
    if (synopsisPdf) {
      simulateUpload(synopsisPdf.name)
    }
  }, [synopsisPdf])

  React.useEffect(() => {
    images.forEach(image => {
      if (!uploadProgress[image.name]) {
        simulateUpload(image.name)
      }
    })
  }, [images])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Project Links */}
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
                    required
                  />
                  {/* Repo Status Indicator */}
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    {localRepoStatuses[link]?.loading && (
                      <div className="animate-spin h-5 w-5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    {localRepoStatuses[link]?.status === true && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {localRepoStatuses[link]?.status === false && (
                      <Lock className="h-5 w-5 text-red-500" />
                    )}
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
        </div>
      </section>

      {/* Cover Image */}
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
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="coverImageInput"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <FileImage className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 text-center">
                Drag and drop your image here, or{" "}
                <span className="text-[#03963f]">browse</span>
              </p>
            </label>
          </div>
          
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-center items-start gap-4 rounded-[13px]">
            {coverImage && (
              <>
                <div className="w-full flex items-center justify-between p-[10px_12px] rounded-lg bg-[#F0F5F3]">
                  <div className="flex items-center gap-4 flex-1">
                    <FileImage className="h-8 w-8 text-gray-400" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-gray-700">{coverImage.name}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={uploadProgress[coverImage.name] || 0} className="h-1 flex-1" />
                        <span className="text-xs text-gray-500">{uploadProgress[coverImage.name] || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    {uploadProgress[coverImage.name] < 100 ? (
                      <X className="h-4 w-4 text-[#6a6a6a]" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
                    )}
                  </button>
                </div>
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Synopsis Document */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Upload Synopsis Document</h2>
        </div>
        <div className="flex items-start gap-5 w-full">
          <div className="w-1/2 h-[320px] flex flex-col justify-center items-center gap-4 rounded-[13px] border border-dashed border-[#909091]">
            <FileUploadArea
              id="synopsisPdfInput"
              onFilesSelected={(files) => {
                if (files) {
                  setSynopsisPdf(files[0])
                }
              }}
              label="Upload Synopsis (PPT, TXT, PDF, DOCX)"
              accept=".ppt,.pptx,.txt,.pdf,.doc,.docx"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <div className="flex justify-center gap-4">
                <FileSpreadsheet className="w-10 h-10 text-gray-400" />
                <FileType className="w-10 h-10 text-gray-400" />
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
            </FileUploadArea>
          </div>
          
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-center items-start gap-4 rounded-[13px]">
            {synopsisPdf && (
              <div className="w-full flex items-center justify-between p-[10px_12px] rounded-lg bg-[#F0F5F3]">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-gray-700">{synopsisPdf.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={uploadProgress[synopsisPdf.name] || 0} className="h-1 flex-1" />
                      <span className="text-xs text-gray-500">{uploadProgress[synopsisPdf.name] || 0}%</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSynopsisPdf(null)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                >
                  {uploadProgress[synopsisPdf.name] < 100 ? (
                    <X className="h-4 w-4 text-[#6a6a6a]" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Images */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Project Images</h2>
        </div>
        <div className="flex items-start gap-5 w-full">
          <div className="w-1/2 h-[320px] flex flex-col justify-center items-center gap-4 rounded-[13px] border border-dashed border-[#909091]">
            <FileUploadArea
              id="imagesInput"
              onFilesSelected={(files) => {
                if (files) {
                  setImages([...images, ...Array.from(files)])
                }
              }}
              label="Drag and drop your images"
              accept=".png,.jpg,.jpeg"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <FileImage className="w-10 h-10 text-gray-400 mb-2" />
            </FileUploadArea>
          </div>
          <div className="w-1/2 h-[320px] p-4 flex flex-col justify-start items-start gap-4 rounded-[13px] overflow-y-auto">
            {images.length > 0 && images.map((file, index) => (
              <div key={index} className="w-full flex items-center justify-between p-[10px_12px] rounded-lg bg-[#F0F5F3]">
                <div className="flex items-center gap-4 flex-1">
                  <FileImage className="h-8 w-8 text-gray-400" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={uploadProgress[file.name] || 0} className="h-1 flex-1" />
                      <span className="text-xs text-gray-500">{uploadProgress[file.name] || 0}%</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updatedImages = [...images]
                    updatedImages.splice(index, 1)
                    setImages(updatedImages)
                  }}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                >
                  {uploadProgress[file.name] < 100 ? (
                    <X className="h-4 w-4 text-[#6a6a6a]" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default UploadLinksStep