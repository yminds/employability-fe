import Select from "react-select";
import { skillsList } from "@/utils/skillsList";

// Assuming skillsList is an array of predefined skills
interface Skill {
  name: string;
  rating: number;
}

interface SkillSelectorProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({ skills, setSkills }) => {
  // Handle selecting a new skill from the dropdown
  const handleSelectSkill = (selectedOption: any) => {
    const skill = selectedOption?.value;
    if (skill && !skills.some((s) => s.name === skill)) {
      setSkills([...skills, { name: skill, rating: 1 }]); // Add new skill with default rating
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index); // Remove the skill at the specified index
    setSkills(updatedSkills); // Update the state with the new skills list
  };

  // Handle rating change for a skill
  const handleRatingChange = (index: number, newRating: number) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill, i) =>
        i === index ? { ...skill, rating: newRating } : skill
      )
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Skills</h3>
      {/* Searchable skill dropdown */}
      <Select
        options={skillsList.map((skill) => ({ value: skill, label: skill }))}
        onChange={handleSelectSkill}
        placeholder="Select a skill"
        isSearchable
        isClearable
      />

      {/* Display selected skills with ratings */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded relative">
            <span className="text-lg font-medium">{skill.name}</span>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="absolute top-2 right-2 text-red-500"
            >
              X
            </button>

            {/* Rating selector */}
            <select
              value={skill.rating}
              onChange={(e) =>
                handleRatingChange(index, Number(e.target.value))
              }
              className="text-sm text-gray-500 w-full mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} -{" "}
                  {rating === 1
                    ? "Beginner"
                    : rating === 2
                    ? "Basic"
                    : rating === 3
                    ? "Intermediate"
                    : rating === 4
                    ? "Advanced"
                    : "Expert"}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillSelector;
