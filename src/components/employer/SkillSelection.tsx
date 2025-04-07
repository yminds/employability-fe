import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define interfaces that match your backend model
interface SkillImportance {
  value: "Very Important" | "Important" | "Good-To-Have";
  label: string;
  color?: string;
}

interface SkillData {
  _id: string;
  name: string;
  icon: string;
}

interface Skill {
  _id: string;
  name: string;
  importance: "Very Important" | "Important" | "Good-To-Have";
  skill: SkillData;
}

interface SkillSelectionProps {
  selectedSkills: Skill[];
  availableSkills: Skill[];
  setSelectedSkills: (skills: Skill[]) => void;
  maxSkills?: number;
  isLoading?: boolean;
}

// Importance level options
const importanceLevels: SkillImportance[] = [
  {
    value: "Very Important",
    label: "Very Important",
    color: "#FF385C"
  },
  {
    value: "Important",
    label: "Important",
    color: "#F59E0B"
  },
  {
    value: "Good-To-Have",
    label: "Good-to-Have",
    color: "#6B7280"
  }
];

const SkillSelection: React.FC<SkillSelectionProps> = ({
  selectedSkills,
  availableSkills,
  setSelectedSkills,
  maxSkills = 6,
  isLoading = false
}) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [availableToAdd, setAvailableToAdd] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Update available skills when selected skills change
  useEffect(() => {
    // Filter out skills that are already selected
    const remaining = availableSkills.filter(
      skill => !selectedSkills.some(s => s._id === skill._id)
    );
    
    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      setAvailableToAdd(
        remaining.filter(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // Sort by importance: Very Important first, then Important, then Good-To-Have
      const sorted = [...remaining].sort((a, b) => {
        const importanceOrder = {
          "Very Important": 0,
          "Important": 1,
          "Good-To-Have": 2
        };
        
        return importanceOrder[a.importance] - importanceOrder[b.importance];
      });
      
      setAvailableToAdd(sorted);
    }
  }, [availableSkills, selectedSkills, searchTerm]);

  // Handle removing a skill
  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill._id !== skillId));
  };

  // Handle adding a skill
  const handleAddSkill = (skill: Skill) => {
    if (selectedSkills.length < maxSkills) {
      setSelectedSkills([...selectedSkills, skill]);
      setIsAddingSkill(false);
      setSearchTerm('');
    }
  };

  // Handle changing importance level
  const handleImportanceChange = (skillId: string, importance: "Very Important" | "Important" | "Good-To-Have") => {
    setSelectedSkills(
      selectedSkills.map(skill => 
        skill._id === skillId ? { ...skill, importance } : skill
      )
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500">Loading skills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-900">Skills</h3>
        <p className="text-sm text-gray-500">
        Would you like the candidate to be tested & verified on specific skills?
        </p>
      </div>

      {/* Selected skills list */}
      <div className="space-y-3">
        {selectedSkills.map((skill) => (
          <div 
            key={skill._id}
            className="grid grid-cols-12 gap-2 items-center"
          >
            {/* Skill name with icon */}
            <div className="col-span-5">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                {skill.skill && skill.skill.icon ? (
                  <img 
                    src={skill.skill.icon} 
                    alt={skill.name} 
                    className="w-6 h-6"
                  />
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-xs font-semibold text-gray-600">
                      {skill.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-medium truncate">{skill.name}</span>
                {/* <ChevronDown size={16} className="ml-auto text-gray-400" /> */}
              </div>
            </div>

            {/* Importance selector
            <div className="col-span-6">
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {skill.importance === "Very Important" && (
                      <span className="text-red-500">Very Important*</span>
                    )}
                    {skill.importance === "Important" && (
                      <span>Important</span>
                    )}
                    {skill.importance === "Good-To-Have" && (
                      <span>Good-to-Have</span>
                    )}
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <div className="py-1">
                    {importanceLevels.map((level) => (
                      <button
                        key={level.value}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => handleImportanceChange(skill._id, level.value)}
                      >
                        <span 
                          className={`${
                            level.value === "Very Important" ? "text-red-500" :
                            level.value === "Important" ? "text-amber-500" : 
                            "text-gray-500"
                          }`}
                        >
                          {level.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div> */}

            {/* Delete button */}
            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => handleRemoveSkill(skill._id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove skill"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill button or skill selection UI */}
      {selectedSkills.length < maxSkills && (
        <div>
          {isAddingSkill ? (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Select a skill to add</span>
                <button 
                  onClick={() => {
                    setIsAddingSkill(false);
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Search input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              
              {/* Available skills list */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {availableToAdd.length > 0 ? (
                  availableToAdd.map((skill) => (
                    <button
                      key={skill._id}
                      onClick={() => handleAddSkill(skill)}
                      className="w-full text-left p-2 hover:bg-gray-200 rounded flex items-center space-x-2"
                    >
                      {skill.skill && skill.skill.icon ? (
                        <img 
                          src={skill.skill.icon}
                          alt={skill.name}
                          className="w-6 h-6" 
                        />
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                          <span className="text-xs font-semibold text-gray-600">
                            {skill.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{skill.name}</span>
                      {skill.importance === "Very Important" && (
                        <span className="ml-auto text-xs text-red-600 font-medium">Very Important</span>
                      )}
                      {skill.importance === "Important" && (
                        <span className="ml-auto text-xs text-amber-600">Important</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm p-2">
                    {searchTerm ? "No matching skills found" : "No more skills available"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingSkill(true)}
              className="flex items-center space-x-2 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50"
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillSelection;