import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice"
import { useDebounce } from "use-debounce"

interface Skill {
  _id: string
  name: string
  icon?: string
}

interface EmployerSkillSelectorProps {
  selectedSkills: Skill[]
  setSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>
  label?: string
  placeholder?: string
}

interface SkillTagProps {
  skill: Skill
  onRemove: (skillId: string) => void
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove }) => {
  // Ensure we always display a valid skill name
  const displayName = skill.name || (typeof skill._id === 'string' ? skill._id : 'Unknown Skill');
  
  return (
    <span className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5 font-sf-pro">
      {skill.icon && <img src={skill.icon || "/placeholder.svg"} alt={displayName} className="w-5 h-5" />}
      {displayName}
      <button
        type="button"
        onClick={() => onRemove(skill._id)}
        className="ml-2 text-white bg-gray-400 rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ✕
      </button>
    </span>
  )
}

const EmployerSkillSelector: React.FC<EmployerSkillSelectorProps> = ({
  selectedSkills,
  setSelectedSkills,
  label = "Required Skills",
  placeholder = "Search skills...",
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    data: skills,
    error,
    isLoading,
  } = useGetMultipleSkillsQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.length < 1,
  })

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkills((prevSkills) => {
      // Only add if not already in the list (comparing by _id)
      if (!prevSkills.find((s) => s._id === skill._id)) {
        // Preserve the full skill object with _id, name, and icon
        return [...prevSkills, {
          _id: skill._id,
          name: skill.name,
          icon: skill.icon
        }]
      }
      return prevSkills
    })
    setSearchTerm("")
    setIsDropdownOpen(false)
  }

  const handleSkillRemove = (skillId: string) => {
    setSelectedSkills((prevSkills) => prevSkills.filter((skill) => skill._id !== skillId))
  }

  return (
    <div className="w-full">
      {label && (
        <label className="text-gray-900 text-sm font-medium mb-1 block">
          {label}
        </label>
      )}
      <div className="relative w-full" ref={dropdownRef}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          autoComplete="off"
          aria-label="Search skills"
          className="w-full flex h-10 p-2 px-4 justify-between items-center self-stretch rounded-md border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-sf-pro"
        />

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isLoading && <p className="p-2">Loading skills...</p>}
            {error && <p className="p-2 text-red-500">Failed to load skills</p>}
            {skills?.data?.length ? (
              skills.data.map((skill: Skill) => (
                <div
                  key={skill._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
                  onClick={() => handleSkillSelect(skill)}
                >
                  {skill.icon && <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="w-5 h-5" />}
                  {skill.name}
                </div>
              ))
            ) : (
              <p className="p-2">No skills found</p>
            )}
          </div>
        )}
      </div>

      {/* Display Selected Skills */}
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.isArray(selectedSkills) && selectedSkills.length > 0 ? (
          selectedSkills.map((skill) => <SkillTag key={skill._id} skill={skill} onRemove={handleSkillRemove} />)
        ) : (
          <p className="text-gray-500 text-sm">No skills selected</p>
        )}
      </div>
    </div>
  )
}

export default EmployerSkillSelector