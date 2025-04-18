import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent,  
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
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
  countryCode?: string
  stateCode?: string
  cityName?: string
}

interface CountryType {
  name: string
  isoCode: string
  flag?: string
}

interface StateType {
  name: string
  isoCode: string
  countryCode: string
}

interface CityType {
  name: string
  countryCode: string
  stateCode: string
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
  // Basic filter state
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
  
  // Location data
  const [countries, setCountries] = useState<CountryType[]>([])
  const [states, setStates] = useState<StateType[]>([])
  const [cities, setCities] = useState<CityType[]>([])
  
  // Selected location values
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  
  // Selected locations (displayed as chips)
  const [selectedLocations, setSelectedLocations] = useState<Location[]>(
    initialValues?.locations || []
  )
  
  // Loading states for dropdowns
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false)
  const [loadingStates, setLoadingStates] = useState<boolean>(false)
  const [loadingCities, setLoadingCities] = useState<boolean>(false)

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
  
  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries()
  }, [])
  
  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry)
      // Reset state and city selections when country changes
      setSelectedState("")
      setSelectedCity("")
      setCities([])
    }
  }, [selectedCountry])
  
  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCities(selectedCountry, selectedState)
      // Reset city selection when state changes
      setSelectedCity("")
    }
  }, [selectedState])

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

  // Handle outside clicks - modified to avoid closing when clicking in dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Don't close if clicking inside the drawer or on any select component
      const isClickInsideDrawer = !!target.closest(".filter-drawer-content");
      const isClickOnSelectComponent = !!target.closest("[role='combobox']") || 
                                      !!target.closest("[role='listbox']") ||
                                      !!target.closest(".select-content");
      
      if (isOpen && !isClickInsideDrawer && !isClickOnSelectComponent && !target.closest("button")) {
        onClose();
      }
    }

    if (isOpen) {
      // Use mousedown instead of click to catch events earlier
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
  
  // Fetch countries from API
  const fetchCountries = async () => {
    setLoadingCountries(true)
    try {
      const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/employer/location/countries`)
      const data = await response.json()
      if (data.success) {
        setCountries(data.data)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    } finally {
      setLoadingCountries(false)
    }
  }
  
  // Fetch states for a country from API
  const fetchStates = async (countryCode: string) => {
    setLoadingStates(true)
    try {
      const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/employer/location/states/${countryCode}`)
      const data = await response.json()
      if (data.success) {
        setStates(data.data)
      }
    } catch (error) {
      console.error("Error fetching states:", error)
    } finally {
      setLoadingStates(false)
    }
  }
  
  // Fetch cities for a state from API
  const fetchCities = async (countryCode: string, stateCode: string) => {
    setLoadingCities(true)
    try {
      const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/employer/location/cities/${countryCode}/${stateCode}`)
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setLoadingCities(false)
    }
  }

  // Add selected location as a chip
  const handleAddLocation = () => {
    // Don't add if no city is selected
    if (!selectedCity) return
    
    // Find the objects by their codes/names
    const cityObj = cities.find(city => city.name === selectedCity)
    const stateObj = states.find(state => state.isoCode === selectedState)
    const countryObj = countries.find(country => country.isoCode === selectedCountry)
    
    if (!cityObj || !stateObj || !countryObj) return
    
    // Create location string (e.g., "New York, NY, USA")
    const locationName = `${cityObj.name}, ${stateObj.name}, ${countryObj.name}`
    
    // Check if location already exists
    if (selectedLocations.some(loc => loc.name === locationName)) {
      return
    }
    
    // Add the new location
    const newLocation: Location = {
      id: `${countryObj.isoCode}-${stateObj.isoCode}-${cityObj.name}`,
      name: locationName,
      countryCode: countryObj.isoCode,
      stateCode: stateObj.isoCode,
      cityName: cityObj.name
    }
    
    setSelectedLocations([...selectedLocations, newLocation])
    
    // Reset city selection for better UX
    setSelectedCity("")
  }

  // Remove a location chip
  const handleRemoveLocation = (locationId: string) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc.id !== locationId))
  }

  // Apply filters and close modal
  const handleApply = () => {
    // Add the current selection as a location if city is selected
    if (selectedCountry && selectedState && selectedCity) {
      handleAddLocation()
    }
    
    onApply({
      interviewType,
      submissionType,
      interviewScore,
      locations: selectedLocations,
      workExperience,
    })
    
    onClose()
  }

  // Prevent dropdown selections from closing the modal
  const handleSelectClick = (e: React.MouseEvent) => {
    // This prevents the click event from propagating up to the backdrop
    e.stopPropagation();
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
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside drawer from closing it
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
            
            {/* Country Selector */}
            <div className="space-y-2" onClick={handleSelectClick}>
              <label className="text-sm text-[#6a6a6a]">Country</label>
              <Select 
                value={selectedCountry} 
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent 
                  className="select-content max-h-[300px] overflow-auto"
                  position="popper"
                  sideOffset={5}
                  align="start"
                >
                  {loadingCountries ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* State Selector - Only visible if country is selected */}
            {selectedCountry && (
              <div className="space-y-2" onClick={handleSelectClick}>
                <label className="text-sm text-[#6a6a6a]">State/Province</label>
                <Select 
                  value={selectedState} 
                  onValueChange={setSelectedState}
                  disabled={!selectedCountry || loadingStates}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent 
                    className="select-content max-h-[300px] overflow-auto"
                    position="popper"
                    sideOffset={5}
                    align="start"
                  >
                    {loadingStates ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : states.length === 0 ? (
                      <SelectItem value="none" disabled>No states available</SelectItem>
                    ) : (
                      states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* City Selector - Only visible if state is selected */}
            {selectedCountry && selectedState && (
              <div className="space-y-2" onClick={handleSelectClick}>
                <label className="text-sm text-[#6a6a6a]">City</label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                  disabled={!selectedState || loadingCities}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent 
                    className="select-content max-h-[300px] overflow-auto"
                    position="popper"
                    sideOffset={5}
                    align="start"
                  >
                    {loadingCities ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : cities.length === 0 ? (
                      <SelectItem value="none" disabled>No cities available</SelectItem>
                    ) : (
                      cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Add Location Button - Only enabled if city is selected */}
            {selectedCountry && selectedState && selectedCity && (
              <Button 
                onClick={handleAddLocation}
                className="mt-2 w-full bg-[#eceef0] text-[#414447] hover:bg-[#d6d7d9]"
                type="button"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            )}
            
            {/* Selected Locations Display */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-[#d9d9d9] rounded-md"
                  >
                    <span>{location.name}</span>
                    <button 
                      onClick={() => handleRemoveLocation(location.id)} 
                      className="text-[#6a6a6a] hover:text-black"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="px-8 py-2 border-[#d9d9d9] text-[#6a6a6a]"
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            className="px-8 py-2 bg-[#001630] hover:bg-[#001630]/90 text-white"
            type="button"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}