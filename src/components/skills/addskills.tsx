import React, { useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation } from "@/api/skillsApiSlice";

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  visibility: string;
}

interface AddSkillsModalProps {
  onClose: () => void;
  userId: string;
  onSkillsUpdate: (isUpdated: boolean) => void;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  onClose,
  userId,
  onSkillsUpdate,
}) => {
  const [user_Id] = useState<string>(userId);

  const [skills, setSkills] = useState<Skill[]>([
    {
      skill_Id: "",
      name: "",
      rating: "__/10",
      visibility: "All users", // Default visibility
    },
  ]);

  const [suggestedSkills] = useState([
    { id: "1", name: "React" },
    { id: "2", name: "MongoDB" },
    { id: "3", name: "Node.js" },
    { id: "4", name: "GraphQL" },
    { id: "5", name: "MySQL" },
    { id: "6", name: "Express" },
  ]);

  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering skills

  const { data: skillsData, error, isLoading } = useGetMultipleSkillsQuery(searchTerm);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      skill_Id: "",
      name: "",
      rating: "__/10",
      visibility: "All users",
    };
    setSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.skill_Id !== id));
  };

  const handleAddSuggestedSkill = (suggestedSkill: { id: string; name: string }) => {
    if (!skills.some((skill) => skill.skill_Id === suggestedSkill.id)) {
      setSkills([
        ...skills,
        {
          skill_Id: suggestedSkill.id,
          name: suggestedSkill.name,
          rating: "__/10",
          visibility: "All users",
        },
      ]);
    }
  };

  const [createUserSkills, { isLoading: isSaving, isError, isSuccess }] =
    useCreateUserSkillsMutation();

  const handleSave = async () => {
    // Ensure userId is valid
    if (!userId || typeof userId !== "string") {
      console.error("Invalid user ID.");
      return;
    }

    // Prepare payload
    const payload = {
      user_id: user_Id,
      skills: skills.map((skill) => ({
        skill_pool_id: skill.skill_Id,
        self_rating: parseInt(skill.rating.split("/")[0]), // Extract numeric rating
      })),
    };

    try {
      // Call the createUserSkills mutation
      const response = await createUserSkills(payload).unwrap();
      console.log("Skills added successfully:", response);
      onSkillsUpdate(true); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add skills:", error);
      onSkillsUpdate(false); // Notify parent component
    }
  };

  // Filter skills based on the search term
  const filteredSkills = skillsData?.data.filter((skill: any) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-w-full">
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-[800px]">
          <p>Error loading skills. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center  z-50">
      <div className="bg-white rounded-lg p-8 max-w-[800px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Add Skills</h2>
            <p className="text-sm text-gray-500">Select the skills you want to appear in the profile</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl w-6 h-6"
          >
            ×
          </button>
        </div>

        {/* Skills List */}
        <div className="space-y-4 mt-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border max-w-[716px] h-[100px] p-4 border-gray-200"
            >
              <div className="grid grid-cols-2 relative gap-4">
                {/* Skill Input */}
                <div className="col-span-1">
                  <label className="text-sm font-medium">Skill {index + 1}</label>
                  <input
                    list={`skills-${index}`}
                    value={skill.name}
                    onChange={(e) => {
                      const selectedSkill = skillsData?.data.find(
                        (availableSkill: any) =>
                          availableSkill.name === e.target.value
                      );
                      setSkills((prev) =>
                        prev.map((s, i) =>
                          i === index
                            ? {
                                ...s,
                                skill_Id: selectedSkill?._id || s.skill_Id,
                                name: selectedSkill?.name || e.target.value,
                              }
                            : s
                        )
                      );
                    }}
                    onInput={(e) => setSearchTerm(e.currentTarget.value)}
                    placeholder="Search skills"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <datalist id={`skills-${index}`}>
                    {filteredSkills?.map((availableSkill: any) => (
                      <option
                        key={availableSkill._id}
                        value={availableSkill.name}
                      >
                        {availableSkill.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Self Rating */}
                <div className="col-span-1">
                  <label className="text-sm font-medium">Self rating</label>
                  <select
                    value={skill.rating}
                    onChange={(e) =>
                      setSkills((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, rating: e.target.value } : s
                        )
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="__/10">__/10</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={`${i + 1}/10`}>
                        {i + 1}/10
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Skill */}
                <div className="absolute right-0 top-[-14px] flex justify-end">
                  <button
                    onClick={() => handleRemoveSkill(skill.skill_Id)}
                    className="text-gray-500 w-4 h-4 text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Skill Button */}
{/* Add Skill Button */}
<div
  className="mt-4 w-1/6 flex items-center gap-2 cursor-pointer"
  onClick={handleAddSkill} // Apply the click handler to the wrapper div
>
  {/* Icon */}
  <div className="flex items-center justify-center w-5 h-5 bg-green-600 text-white text-lg rounded-full">
    +
  </div>

  {/* Button */}
  <button
    className="flex-1 text-green-600 py-2 rounded-lg"
    type="button"
  >
    Add Skill
  </button>
</div>

        {/* Suggested Skills */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Suggested Skills</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((suggestedSkill) => (
              <button
                key={suggestedSkill.id}
                onClick={() => handleAddSuggestedSkill(suggestedSkill)}
                className="px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                {suggestedSkill.name} +
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#00183D] text-white py-3 rounded-lg mt-6 hover:bg-[#001A4D]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSkillsModal;
