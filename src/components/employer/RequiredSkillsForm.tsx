import React, { useState, useEffect, useRef } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useDebounce } from "use-debounce";
import { Plus, Trash } from "lucide-react";
import axios from "axios";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

// Define a consistent type for importance levels
type ImportanceLevel = "Very Important" | "Important" | "Good-To-Have";

interface RequiredSkillsProps {
  selectedSkills: Array<{
    skill: Skill;
    importance: ImportanceLevel;
  }>;
  setSelectedSkills: React.Dispatch<
    React.SetStateAction<
      Array<{
        skill: Skill;
        importance: ImportanceLevel;
      }>
    >
  >;
  maxMustHaveSkills?: number;
  jobTitle: string;
  jobDescription: string;
}

const RequiredSkillsComponent: React.FC<RequiredSkillsProps> = ({
  selectedSkills,
  setSelectedSkills,
  maxMustHaveSkills = 6,
  jobTitle,
  jobDescription,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(
    null
  );
  const [suggestedSkills, setSuggestedSkills] = useState<Skill[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: skills,
    error,
    isLoading,
  } = useGetMultipleSkillsQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.length < 1,
  });

  // Fetch skills suggestions based on job title and description
  useEffect(() => {
    if (jobTitle && jobDescription) {
      fetchSuggestedSkills();
    }
  }, [jobTitle, jobDescription]);

  // Populate initial skills from suggestions
  useEffect(() => {
    if (suggestedSkills.length > 0 && selectedSkills.length === 0) {
      populateInitialSkills();
    }
  }, [suggestedSkills]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestedSkills = async () => {
    setIsSuggestionsLoading(true);
    try {
      // Send job title and description to get skill suggestions
      const response = await axios.post(
        "http://localhost:3000/api/v1/skillSuggestions/getSuggestedSkills",
        {
          query: `${jobTitle}, ${jobDescription}`,
        }
      );

      // Process the skills
      const skills = response.data.map((skill: any) => ({
        _id:
          skill.id ||
          `sugg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: skill.name,
        icon: skill.icon,
      }));

      setSuggestedSkills(skills);
    } catch (error) {
      console.error("Error fetching skill suggestions:", error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const populateInitialSkills = () => {
    // Determine how many skills to assign to each importance level
    const totalSkills = suggestedSkills.length;
    const mustHaveCount = Math.min(
      maxMustHaveSkills,
      Math.ceil(totalSkills * 0.4)
    ); // 40% as Very Important
    const preferredCount = Math.ceil(totalSkills * 0.4); // 40% as preferred

    // Create the initial skill selections with appropriate importance levels
    const initialSkills = [
      // Very-Important skills (top 40% up to maxMustHaveSkills)
      ...suggestedSkills.slice(0, mustHaveCount).map((skill) => ({
        skill,
        importance: "Very Important" as ImportanceLevel,
      })),

      // Preferred skills (next 40%)
      ...suggestedSkills
        .slice(mustHaveCount, mustHaveCount + preferredCount)
        .map((skill) => ({
          skill,
          importance: "Important" as ImportanceLevel,
        })),

      // Optional skills (remaining)
      ...suggestedSkills.slice(mustHaveCount + preferredCount).map((skill) => ({
        skill,
        importance: "Good-To-Have" as ImportanceLevel,
      })),
    ];

    setSelectedSkills(initialSkills);
  };

  const handleAddSkill = () => {
    const newSkill = {
      skill: { _id: "", name: "" },
      importance: "Important" as ImportanceLevel,
    };

    setSelectedSkills([...selectedSkills, newSkill]);
    // Open dropdown for the newly added skill
    setSelectedSkillIndex(selectedSkills.length);
    setIsDropdownOpen(true);
  };

  const handleSkillSelect = (index: number, skill: Skill) => {
    const newSkills = [...selectedSkills];
    newSkills[index] = { ...newSkills[index], skill };
    setSelectedSkills(newSkills);
    setIsDropdownOpen(false);
  };

  const handleImportanceChange = (
    index: number,
    importance: ImportanceLevel
  ) => {
    // Count current Must-Have skills
    const mustHaveCount = selectedSkills.filter(
      (s, idx) => idx !== index && s.importance === "Very Important"
    ).length;

    // If changing to Must-Have and already at limit, don't allow
    if (importance === "Very Important" && mustHaveCount >= maxMustHaveSkills) {
      alert(`You can only have ${maxMustHaveSkills} Very Important skills.`);
      return;
    }

    const newSkills = [...selectedSkills];
    newSkills[index] = { ...newSkills[index], importance };
    setSelectedSkills(newSkills);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...selectedSkills];
    newSkills.splice(index, 1);
    setSelectedSkills(newSkills);
  };

  const handleOpenSkillDropdown = (index: number) => {
    setSelectedSkillIndex(index);
    setIsDropdownOpen(true);
    setSearchTerm("");
  };

  const renderSkillDropdown = () => {
    if (!isDropdownOpen || selectedSkillIndex === null) return null;

    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
        style={{
          top: `${40 * (selectedSkillIndex + 1)}px`,
          left: 0,
          width: "100%",
        }}
      >
        <div className="p-2 border-b border-gray-200">
          <input
            type="text"
            autoFocus
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          {/* Show search results if there's a search term */}
          {debouncedSearchTerm ? (
            <>
              {isLoading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading skills...
                </div>
              ) : error ? (
                <div className="p-3 text-center text-red-500">
                  Error loading skills
                </div>
              ) : skills?.data?.length ?? 0 > 0 ? (
                skills?.data?.map((skill: Skill) => (
                  <div
                    key={skill._id}
                    onClick={() => handleSkillSelect(selectedSkillIndex, skill)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    {skill.icon && (
                      <img src={skill.icon} alt="" className="w-5 h-5 mr-2" />
                    )}
                    <span>{skill.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No skills found matching "{debouncedSearchTerm}"
                </div>
              )}

              {/* Option to add custom skill */}
              <div
                onClick={() =>
                  handleSkillSelect(selectedSkillIndex, {
                    _id: `custom_${Date.now()}`,
                    name: debouncedSearchTerm,
                  })
                }
                className="p-3 border-t border-gray-200 hover:bg-gray-100 cursor-pointer text-blue-600"
              >
                + Add custom skill "{debouncedSearchTerm}"
              </div>
            </>
          ) : (
            // Show suggested skills when there's no search term
            <>
              {/* <div className="p-2 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-sm">Suggested Skills</h3>
                <p className="text-xs text-gray-500">
                  Based on job description
                </p>
              </div> */}

              {isSuggestionsLoading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading suggested skills...
                </div>
              ) : suggestedSkills.length > 0 ? (
                suggestedSkills.map((skill: Skill) => (
                  <div
                    key={skill._id}
                    onClick={() => handleSkillSelect(selectedSkillIndex, skill)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    {skill.icon && (
                      <img src={skill.icon} alt="" className="w-5 h-5 mr-2" />
                    )}
                    <span>{skill.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No suggested skills available
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Skills</h2>
      <p className="text-sm text-gray-500 mb-6">
        A maximum of {maxMustHaveSkills} skills can be considered Must-Have
      </p>

      <div className="relative">
        {/* Selected Skills List */}
        {selectedSkills.map((skillItem, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            {/* Skill selector */}
            <div className="w-[450px]">
              <div
                className="flex items-center p-4 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300"
                onClick={() => handleOpenSkillDropdown(index)}
              >
                {skillItem.skill.icon && (
                  <img
                    src={skillItem.skill.icon}
                    alt=""
                    className="w-6 h-6 mr-3"
                  />
                )}
                <span className="text-gray-800 text-base">
                  {skillItem.skill.name || "Select a skill"}
                </span>
                <svg
                  className="h-5 w-5 ml-auto text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Importance selector */}
            <div className="w-[450px]">
              <div className="relative">
                <select
                  value={skillItem.importance}
                  onChange={(e) =>
                    handleImportanceChange(
                      index,
                      e.target.value as ImportanceLevel
                    )
                  }
                  className="w-full appearance-none bg-white p-4 border border-gray-200 rounded-md cursor-pointer text-base hover:border-gray-300 focus:outline-none"
                >
                   <option value="Very Important">Very Important <span className="text-red-500">*</span></option>
                  <option value="Important">Important</option>
                  <option value="Good-To-Have">Good-To-Have</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="ml-2">
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="text-gray-400 hover:text-red-500 focus:outline-none p-1"
                aria-label="Remove skill"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}

        {renderSkillDropdown()}

        {/* Add Skill button */}
        <button
          type="button"
          onClick={handleAddSkill}
          className="flex items-center px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <Plus size={20} className="mr-2" />
          <span className="text-base">Add Skill</span>
        </button>
      </div>
    </div>
  );
};

export default RequiredSkillsComponent;