import React, { useState, useEffect, useRef } from "react";
import { useGetEmployerSkillSuggestionsMutation } from "@/api/employerJobsApiSlice";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useDebounce } from "use-debounce";
import { Plus, Trash, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Skill {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Define a consistent type for importance levels
type ImportanceLevel = "Very Important" | "Important" | "Good-To-Have";

interface SkillRecommendation {
  skill: Skill;
  importance: ImportanceLevel;
  reasoning: string;
}

// Define the API response structure - making it more flexible
interface ApiResponse {
  success: boolean;
  data:
    | SkillRecommendation[]
    | {
        skills: SkillRecommendation[];
        [key: string]: any;
      };
}

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
  // New flag to control when to fetch recommendations
  shouldFetchRecommendations?: boolean;
  // Callback to let the parent know we've fetched
  onRecommendationsFetched?: () => void;
}

// Function to sort skills by importance
const sortSkillsByImportance = (skills: SkillRecommendation[]) => {
  const importanceOrder = {
    "Very Important": 1,
    Important: 2,
    "Good-To-Have": 3,
  };

  return [...skills].sort(
    (a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]
  );
};

const RequiredSkillsComponent: React.FC<RequiredSkillsProps> = ({
  selectedSkills,
  setSelectedSkills,
  maxMustHaveSkills = 6,
  jobTitle,
  jobDescription,
  shouldFetchRecommendations = false,
  onRecommendationsFetched,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(
    null
  );
  const [recommendedSkills, setRecommendedSkills] = useState<
    SkillRecommendation[]
  >([]);
  const [reasonings, setReasonings] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // To track if we're currently fetching
  const [isFetching, setIsFetching] = useState(false);

  // API hooks
  const {
    data: searchResults,
    error: searchError,
    isLoading: isSearchLoading,
  } = useGetMultipleSkillsQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.length < 1,
  });

  const [getSkillSuggestions, { isLoading }] =
    useGetEmployerSkillSuggestionsMutation();

  // This is the key part: Only fetch when the parent component tells us to
  useEffect(() => {
    // Only fetch if the flag is true and we're not already fetching
    if (
      shouldFetchRecommendations &&
      !isFetching &&
      jobDescription &&
      jobDescription.trim() !== ""
    ) {
      console.log(
        "Fetching skill recommendations based on parent's instruction"
      );
      setIsFetching(true);

      fetchAISkillRecommendations()
        .then(() => {
          // Let the parent know we're done
          if (onRecommendationsFetched) {
            onRecommendationsFetched();
          }
          setIsFetching(false);
        })
        .catch((error) => {
          console.error("Error fetching skill recommendations:", error);
          setIsFetching(false);
        });
    }
  }, [shouldFetchRecommendations, jobDescription]);

  // Populate initial skills from AI recommendations
  useEffect(() => {
    if (recommendedSkills.length > 0 && selectedSkills.length === 0) {
      populateInitialSkills();
    }
  }, [recommendedSkills]);

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

  const fetchAISkillRecommendations = async () => {
    try {
      // Call the RTK Query mutation to get AI skill recommendations
      const response = await getSkillSuggestions({
        jobTitle,
        jobDescription,
      }).unwrap();

      console.log("API Response:", response); // Log the full response for debugging

      // Process the skills with their importance levels and reasoning
      if (response.success && response.data) {
        // The API returns data that might be in different formats
        let skillsData: SkillRecommendation[] = [];

        // Case 1: response.data is the skills array directly
        if (Array.isArray(response.data)) {
          skillsData = response.data;
        }
        // Case 2: response.data has a skills property that is an array
        else if (
          "skills" in response.data &&
          Array.isArray(
            (response.data as { skills: SkillRecommendation[] }).skills
          )
        ) {
          skillsData = (response.data as { skills: SkillRecommendation[] })
            .skills;
        }
        // Case 3: response.data is an object with other structure
        else {
          console.error("Unexpected response format:", response.data);
          return; // Exit early
        }

        // Sort skills by importance before setting
        const sortedSkills = sortSkillsByImportance(skillsData);
        setRecommendedSkills(sortedSkills);

        // Create a mapping of skill IDs to their reasoning
        const reasoningMap: Record<string, string> = {};
        skillsData.forEach((item: SkillRecommendation) => {
          reasoningMap[item.skill._id] = item.reasoning;
        });
        setReasonings(reasoningMap);
      }
    } catch (error) {
      console.error("Error fetching AI skill recommendations:", error);
      throw error;
    }
  };

  const populateInitialSkills = () => {
    const initialSkills = recommendedSkills.map((rec) => ({
      skill: rec.skill,
      importance: rec.importance,
    }));

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

    // Sort skills by importance after changing
    const sortedSkills = [...newSkills].sort((a, b) => {
      const importanceOrder = {
        "Very Important": 1,
        Important: 2,
        "Good-To-Have": 3,
      };
      return importanceOrder[a.importance] - importanceOrder[b.importance];
    });

    setSelectedSkills(sortedSkills);
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
              {isSearchLoading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading skills...
                </div>
              ) : searchError ? (
                <div className="p-3 text-center text-red-500">
                  Error loading skills
                </div>
              ) : searchResults?.data?.length ? (
                searchResults.data.map((skill: Skill) => (
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
                <div className="p-3 text-center text-gray-500 text-body2">
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
                className="p-3 border-t border-gray-200 hover:bg-gray-100 cursor-pointer text-blue-600 text-body2"
              >
                + Add custom skill "{debouncedSearchTerm}"
              </div>
            </>
          ) : (
            // Show AI recommended skills when there's no search term
            <>
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-sm font-dm-sans">
                  AI Recommended Skills
                </h3>
                <p className="text-xs font-dm-sans text-gray-500">
                  Based on job description analysis
                </p>
              </div>

              {isLoading || isFetching ? (
                <div className="p-3 text-center text-gray-500 font-dm-sans">
                  Loading AI recommended skills...
                </div>
              ) : recommendedSkills.length > 0 ? (
                recommendedSkills.map((rec) => (
                  <div
                    key={rec.skill._id}
                    onClick={() =>
                      handleSkillSelect(selectedSkillIndex, rec.skill)
                    }
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {rec.skill.icon && (
                        <img
                          src={rec.skill.icon}
                          alt=""
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      <span className="text-body2">{rec.skill.name}</span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full border text-body2`}
                    >
                      {rec.importance}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 font-dm-sans">
                  No AI recommendations available
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
      <h2 className="text-body2 mb-2">Skills</h2>
      <p className="text-[14px] font-dm-sans font-normal leading-6 tracking-[0.07px] text-gray-500 mb-2">
        A maximum of {maxMustHaveSkills} skills can be considered Very Important
      </p>

      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-body2 rounded-md flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          EmployAbility is analyzing your job description to recommend relevant
          skills...
        </div>
      )}

      {!isLoading && !isFetching && recommendedSkills.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-body2 rounded-md">
          EmployAbility has analyzed your job description and recommended{" "}
          {recommendedSkills.length} skills with appropriate importance levels.
        </div>
      )}

      <div className="relative">
        {/* Selected Skills List */}
        {selectedSkills.map((skillItem, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            {/* Combined skill selector with logo and name */}
            <div className="w-[450px]">
              <div
                className="flex items-center p-4 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300"
                onClick={() => handleOpenSkillDropdown(index)}
              >
                <div className="flex items-center flex-grow">
                  {skillItem.skill.icon ? (
                    <img
                      src={skillItem.skill.icon}
                      alt=""
                      className="w-6 h-6 mr-3"
                    />
                  ) : (
                    <div className="w-6 h-6 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {skillItem.skill.name?.substring(0, 1)}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-800 text-body2">
                    {skillItem.skill.name || "Select a skill"}
                  </span>
                </div>

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

            {/* Importance selector - removed color gradient */}
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
                  className="w-full appearance-none bg-white p-4 border border-gray-200 rounded-md cursor-pointer text-body2 hover:border-gray-300 focus:outline-none"
                >
                  <option value="Very Important">Very Important</option>
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

            {/* Actions section */}
            <div className="flex items-center">
              {/* Reasoning tooltip */}
              {reasonings[skillItem.skill._id] && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-blue-500 focus:outline-none p-1 mr-2"
                        aria-label="Skill reasoning"
                      >
                        <Info size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-2">
                      <p>{reasonings[skillItem.skill._id]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Remove skill button */}
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
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          <span className="text-[14px] font-dm-sans font-medium leading-5 tracking-[0.21px]">
            Add Skill
          </span>
        </button>
      </div>
    </div>
  );
};

export default RequiredSkillsComponent;
