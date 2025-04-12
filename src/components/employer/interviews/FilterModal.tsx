import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { InterviewType } from "../InterviewCandidatesView"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  initialValues?: FilterValues
}

interface Location {
  id: string
  name: string
}

export interface FilterValues {
  interviewType: InterviewType
  submissionType: "submitted" | "not_submitted"
  interviewScore: number
  locations: Location[]
  workExperience: number
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApply,
  initialValues
}) => {
  const [interviewType, setInterviewType] = useState<InterviewType>(
    initialValues?.interviewType || "full"
  )
  const [submissionType, setSubmissionType] = useState<"submitted" | "not_submitted">(
    initialValues?.submissionType || "submitted"
  )
  const [interviewScore, setInterviewScore] = useState<number>(
    initialValues?.interviewScore || 0
  )
  const [workExperience, setWorkExperience] = useState<number>(
    initialValues?.workExperience || 0
  )
  const [locationInput, setLocationInput] = useState<string>("")
  const [selectedLocations, setSelectedLocations] = useState<Location[]>(
    initialValues?.locations || [{ id: "1", name: "Bangalore Urban" }]
  )

  // Update local state when initialValues change
  useEffect(() => {
    if (initialValues) {
      setInterviewType(initialValues.interviewType)
      setSubmissionType(initialValues.submissionType)
      setInterviewScore(initialValues.interviewScore)
      setWorkExperience(initialValues.workExperience)
      setSelectedLocations(initialValues.locations)
    }
  }, [initialValues])

  // Animation states
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  // Handle component mounting/unmounting with animations
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isOpen) {
      setVisible(true)
      // Small delay to trigger the CSS transition
      timeoutId = setTimeout(() => setMounted(true), 10)
    } else {
      setMounted(false)
      // Wait for the transition to complete before hiding the component
      timeoutId = setTimeout(() => setVisible(false), 300) // Match this with your CSS transition duration
    }

    return () => clearTimeout(timeoutId)
  }, [isOpen])

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".filter-drawer-content") && !target.closest("button")) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen, onClose])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  const predefinedLocations: Location[] = [
    { id: "2", name: "Bangalore Rural" },
    { id: "3", name: "Kerala" },
    { id: "4", name: "Chennai" },
    { id: "5", name: "Hyderabad" },
  ]

  const handleRemoveLocation = (locationId: string) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc.id !== locationId))
  }

  const handleAddLocation = (locationName: string) => {
    if (!locationName.trim()) return;
    
    // Check if location already exists
    if (selectedLocations.some(loc => loc.name.toLowerCase() === locationName.toLowerCase())) {
      return;
    }
    
    // Add new location
    const newLocation = {
      id: `custom-${Date.now()}`,
      name: locationName.trim()
    };
    
    setSelectedLocations([...selectedLocations, newLocation]);
    setLocationInput("");
  }

  const handleSelectPredefinedLocation = (location: Location) => {
    // Check if location is already selected
    if (selectedLocations.some(loc => loc.id === location.id)) {
      return;
    }
    
    setSelectedLocations([...selectedLocations, location]);
  }

  const handleApply = () => {
    onApply({
      interviewType,
      submissionType,
      interviewScore,
      locations: selectedLocations,
      workExperience,
    })
    onClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end py-4 pr-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${mounted ? "opacity-60" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`filter-drawer-content bg-white w-full max-w-md h-full shadow-xl rounded-lg transform transition-transform duration-300 ease-in-out ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 h-[calc(100%-132px)] overflow-y-auto">
          {/* Interview Type */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-[#6a6a6a]">Interview Type</h3>
            <RadioGroup
              value={interviewType}
              onValueChange={(value) => setInterviewType(value as InterviewType)}
              className="flex gap-4"
            >
              <div
                className={`flex items-center border rounded-md px-6 py-3 ${
                  interviewType === "full" ? "border-[#32a6f9]" : "border-[#d9d9d9]"
                }`}
              >
                <RadioGroupItem value="full" id="filter-full-interview" className="mr-2" />
                <Label htmlFor="filter-full-interview">Full Interview</Label>
              </div>
              <div
                className={`flex items-center border rounded-md px-6 py-3 ${
                  interviewType === "screening" ? "border-[#32a6f9]" : "border-[#d9d9d9]"
                }`}
              >
                <RadioGroupItem value="screening" id="filter-screening" className="mr-2" />
                <Label htmlFor="filter-screening">Screening</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submission Type */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-[#6a6a6a]">Submission Type</h3>
            <RadioGroup
              value={submissionType}
              onValueChange={(value) => setSubmissionType(value as "submitted" | "not_submitted")}
              className="flex gap-4"
            >
              <div
                className={`flex items-center border rounded-md px-6 py-3 ${
                  submissionType === "submitted" ? "border-[#32a6f9]" : "border-[#d9d9d9]"
                }`}
              >
                <RadioGroupItem value="submitted" id="filter-submitted" className="mr-2" />
                <Label htmlFor="filter-submitted">Submitted</Label>
              </div>
              <div
                className={`flex items-center border rounded-md px-6 py-3 ${
                  submissionType === "not_submitted" ? "border-[#32a6f9]" : "border-[#d9d9d9]"
                }`}
              >
                <RadioGroupItem value="not_submitted" id="filter-not-submitted" className="mr-2" />
                <Label htmlFor="filter-not-submitted">Not Submitted</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Interview Score */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-[#6a6a6a]">Interview Score</h3>
            <div className="pt-4">
              <Slider
                value={[interviewScore]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setInterviewScore(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-[#6a6a6a]">
                <span>0</span>
                <span>{interviewScore}</span>
                <span>10</span>
              </div>
            </div>
          </div>

           {/* Locations */}
           <div className="space-y-4">
            <h3 className="text-base font-medium text-[#6a6a6a]">Locations</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] w-4 h-4" />
              <input
                type="text"
                placeholder="Select location e.g., New York, USA"
                className="w-full pl-10 pr-3 py-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#32a6f9]"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLocation(locationInput);
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-[#d9d9d9] rounded-md"
                >
                  <span>{location.name}</span>
                  <button onClick={() => handleRemoveLocation(location.id)} className="text-[#6a6a6a] hover:text-black">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {predefinedLocations
                .filter(loc => !selectedLocations.some(selected => selected.id === loc.id))
                .map((location) => (
                <div 
                  key={location.id} 
                  className="px-3 py-2 bg-white border border-[#d9d9d9] rounded-md cursor-pointer hover:border-[#32a6f9]"
                  onClick={() => handleSelectPredefinedLocation(location)}
                >
                  <span>{location.name}</span>
                </div>
              ))}
            </div>
          </div>

           {/* Work Experience */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-[#6a6a6a]">Work Experience</h3>
            <div className="pt-4">
              <Slider
                value={[workExperience]}
                min={0}
                max={20}
                step={1}
                onValueChange={(value) => setWorkExperience(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-[#6a6a6a]">
                <span>0 yr</span>
                <span>{workExperience} yr</span>
                <span>20 yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-lg border-t bg-white flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="px-8 py-2 border-[#d9d9d9] text-[#6a6a6a]">
            Cancel
          </Button>
          <Button onClick={handleApply} className="px-8 py-2 bg-[#001630] hover:bg-[#001630]/90 text-white">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}