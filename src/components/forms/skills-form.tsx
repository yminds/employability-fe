import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Skill {
  _id: string;
  name: string;
  description: string;
  rating?: number;
}

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  errors: { [key: string]: string };
}

export default function SkillsForm({
  skills,
  onChange,
  errors,
}: SkillsFormProps) {
  // State to store all available skills from the API
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all available skills when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/skills_pool/skills"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setAvailableSkills(data.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const addSkill = () => {
    onChange([
      ...skills,
      {
        _id: "",
        name: "",
        description: "",
        rating: 0,
      },
    ]);
  };

  const handleSkillChange = (
    index: number,
    field: "rating" | "_id",
    value: number | string
  ) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        if (field === "_id") {
          // Find the selected skill from available skills
          const selectedSkill = availableSkills.find((s) => s._id === value);
          if (selectedSkill) {
            return { ...selectedSkill, rating: skill.rating || 0 };
          }
        }
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange(updatedSkills);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Skills</h3>

      {/* Skills Input */}
      {skills.map((skill, index) => (
        <div key={skill._id || index} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Skill {index + 1}
            </label>
            <select
              value={skill._id}
              onChange={(e) => handleSkillChange(index, "_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`skills.${index}.name`) ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            >
              <option value="">Select a skill</option>
              {availableSkills.map((availableSkill) => (
                <option key={availableSkill._id} value={availableSkill._id}>
                  {availableSkill.name}
                </option>
              ))}
            </select>

            {getError(`skills.${index}.name`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`skills.${index}.name`)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Self rating
            </label>
            <select
              value={skill.rating || 0}
              onChange={(e) =>
                handleSkillChange(index, "rating", parseInt(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`skills.${index}.rating`) ? "border-red-500" : ""
              }`}
            >
              {/* <option value="">__/10</option> */}
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i}/10
                </option>
              ))}
            </select>
            {getError(`skills.${index}.rating`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`skills.${index}.rating`)}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add Skill Button */}
      <button
        onClick={addSkill}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
        disabled={isLoading}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add skill
      </button>
    </div>
  );
}
