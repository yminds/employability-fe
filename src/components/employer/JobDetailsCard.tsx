import { useState, useRef, useEffect } from "react"
import { MoreVertical, Copy, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

// Updated interface to handle the new location structure
interface JobDetailsData {
  _id?: string
  title?: string
  company?: {
    _id?: string
    name?: string
  }
  location?: string | { city: string; state: string; country: string }
  job_type?: string
  work_place_type?: string
  experience_level?: string
  // Any other fields from your API
}

interface JobDetailsCardProps {
  jobDetails?: JobDetailsData
  onViewDetails: () => void
  onDelete?: () => void
}

// Helper function to format location
const formatLocation = (location?: string | { city: string; state: string; country: string }): string => {
  if (!location) return "";
  
  if (typeof location === "string") {
    return location;
  }
  
  if (typeof location === "object") {
    const { city, state, country } = location;
    return `${city || ''}${city ? ', ' : ''}${state || ''}${state ? ', ' : ''}${country || ''}`.replace(/^, |, $/g, '');
  }
  
  return "";
};

// Update the JobDetailsCard component to use a portal for the dropdown
const JobDetailsCard = ({ jobDetails, onViewDetails, onDelete }: JobDetailsCardProps) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Update dropdown position when button is clicked
  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.right - 204, // Align right edge of dropdown with right edge of button
      })
    }
  }, [showDropdown])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle copy job link
  const handleCopyLink = () => {
    if (jobDetails?._id) {
      const link = `https://employability.ai/job-post/${jobDetails._id}`
      navigator.clipboard.writeText(link)
      toast.success("Job link copied to clipboard")
      setShowDropdown(false)
    }
  }

  // Handle edit details
  const handleEditDetails = () => {
    onViewDetails()
    setShowDropdown(false)
  }

  // Handle delete
  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    setShowDropdown(false)
  }

  // Format the location for display
  const formattedLocation = formatLocation(jobDetails?.location);

  // If job details aren't loaded yet, show a loading state
  if (!jobDetails) {
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-6 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-[70px] h-[70px] bg-[#eceef0] rounded-full animate-pulse"></div>
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-3">
                <div className="h-8 bg-[#eceef0] rounded w-[180px] animate-pulse"></div>
                <div className="h-7 bg-[#eceef0] rounded-full w-[100px] animate-pulse"></div>
              </div>
              <div className="h-5 bg-[#eceef0] rounded w-[250px] animate-pulse"></div>
            </div>
          </div>
          <div className="w-9 h-9 bg-[#eceef0] rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-4">
          {/* Company logo/icon */}
          <div className="w-[70px] h-[70px] relative bg-[#ebfff3] rounded-full overflow-hidden flex items-center justify-center">
            <div className="w-[36px] h-[47px] relative">
              <div className="w-[24px] h-[47px] absolute left-0 top-0 bg-[#cdead9]" />
              <div className="w-[24px] h-[24px] absolute left-[11px] top-[22px] bg-[#bbddc9]" />
              <div className="w-[20px] h-[14px] absolute left-[2.5px] top-[3px] flex flex-col justify-start items-start gap-[2.7px]">
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-[#414447] text-[18px] font-medium font-ubuntu leading-8 tracking-[-0.3px]">
                {jobDetails.title || "Job Title"}
              </h2>
              {jobDetails.experience_level && (
                <span className="px-3 py-1 bg-[#eceef0] text-[#414447] text-[14px] font-medium leading-5 tracking-[0.07px] rounded-full">
                  {jobDetails.experience_level}
                </span>
              )}
            </div>

            <div className="flex items-center text-[#68696b] text-body2">
              <span>{jobDetails.company?.name || "Company Name"}</span>
              {formattedLocation && (
                <>
                  <span className="mx-2">|</span>
                  <span>{formattedLocation}</span>
                </>
              )}
              {jobDetails.work_place_type && (
                <>
                  <span className="mx-2">|</span>
                  <span>{jobDetails.work_place_type}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* More options button with dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            className="text-[#414447] bg-[#eceef0] p-2 rounded-full transition-colors hover:bg-[#e0e2e4]"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown menu - now positioned fixed and with a high z-index */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="fixed w-[204px] p-3 bg-white rounded-[5px] shadow-[0px_10px_16px_-2px_rgba(149,151,153,0.16)] inline-flex flex-col justify-center items-start gap-2 z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              {/* Copy Job link */}
              <button
                className="self-stretch p-2 inline-flex justify-start items-center gap-2 hover:bg-[#f5f5f5] w-full rounded"
                onClick={handleCopyLink}
              >
                <Copy className="w-[15.50px] h-[18.50px] text-[#1c1b1f]" />
                <span className="text-[#414347] text-base font-normal font-['DM_Sans'] leading-normal tracking-tight">
                  Copy Job link
                </span>
              </button>

              {/* Edit Details */}
              <button
                className="self-stretch p-2 inline-flex justify-start items-center gap-2 hover:bg-[#f5f5f5] w-full rounded"
                onClick={handleEditDetails}
              >
                <Edit className="w-5 h-[21.10px] text-[#1c1b1f]" />
                <span className="text-[#414347] text-base font-normal font-['DM_Sans'] leading-normal tracking-tight">
                  Edit Details
                </span>
              </button>

              {/* Delete */}
              <button
                className="self-stretch p-2 inline-flex justify-start items-center gap-2 hover:bg-[#f5f5f5] w-full rounded"
                onClick={handleDelete}
              >
                <Trash2 className="w-[15px] h-[16.88px] text-[#fd5964]" />
                <span className="text-[#fd5964] text-base font-normal font-['DM_Sans'] leading-normal tracking-tight">
                  Delete
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetailsCard