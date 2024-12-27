import React, { useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation } from '@/api/skillsApiSlice';

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  visibility: string;
  status: "verified" | "unverified";
}

interface AddSkillsModalProps {
  onClose: () => void; 
  userId: string; 
  onSkillsUpdate: (isUpdated: boolean) => void;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  onClose,
  userId,
  onSkillsUpdate
}) => {
  const [user_Id, setUserId] = useState<string>(userId);

  const [skills, setSkills] = useState<Skill[]>([
    {
      skill_Id: "",
      name: "",
      rating: "__/10",
      visibility: "All users",
      status: "unverified",
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
      status: "unverified",
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
          status: "verified",
        },
      ]);
    }
  };
  const [createUserSkills, { isLoading: isSaving, isError, isSuccess }] = useCreateUserSkillsMutation();

  const handleSave = async () => {
    // Ensure userId is valid
    if (!userId || typeof userId !== "string") {
      console.error("Invalid user ID.");
      return;
    }
  
    // Prepare payload
    const payload = {
      user_id: user_Id, // Ensure no leading/trailing spaces
      skills: skills.map((skill) => ({
        skill_pool_id: skill.skill_Id,
        self_rating: parseInt(skill.rating.split('/')[0]), // Extract numeric rating
      })),
    };
  
    try {
      // Call the createUserSkills mutation
      const response = await createUserSkills(payload).unwrap();
      console.log("Skills added successfully:", response);
      onSkillsUpdate(true); // Update the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add skills:", error);
      onSkillsUpdate(false); // Update the parent component
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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-w-full">
          <p>Error loading skills. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 ">
          <h2 className="text-xl font-bold">Add Skills</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-500 mb-7">
          Select the skills you want to appear in the profile
        </p>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <>
              <div
                key={index}
                className="bg-gray-50 flex flex-col items-center rounded-lg border w-[716px] h-[168px] p-6 border-gray-200"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Searchable Dropdown */}
                  <div className="col-span-4">
                    <label>Skill {index + 1}</label>
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
                                  id: selectedSkill?._id || s.skill_Id,
                                  skill_Id: selectedSkill?._id || s.skill_Id, // Set skill_Id from skillsData
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
                        <option key={availableSkill._id} value={availableSkill.name}>
                          {availableSkill.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* Hidden Field for skill_Id */}
                  <input
                    type="hidden"
                    value={skill.skill_Id} // Automatically updated from skillsData
                    name={`skill_Id-${index}`}
                  />

                  {/* Self Rating */}
                  <div className="col-span-4">
                    <label>Self rating</label>
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

                  {/* Visibility */}
                  <div className="col-span-3">
                    <label>Visibility</label>
                    <select
                      value={skill.visibility}
                      onChange={(e) =>
                        setSkills((prev) =>
                          prev.map((s, i) =>
                            i === index ? { ...s, visibility: e.target.value } : s
                          )
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Just me">Just me</option>
                      <option value="All users">All users</option>
                    </select>
                  </div>

                  {/* Remove Skill */}
                  <div className="col-span-1">
                    <button
                      onClick={() => handleRemoveSkill(skill.skill_Id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  status : <span className="text-[#D48A0C]">{skill.status}</span>
                </div>
              </div>
            </>
          ))}
        </div>

        {/* Add Skill Button */}
        <div className="mt-4">
          <button
            onClick={handleAddSkill}
            className="w-1/6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-600"
          >
            + Add Skill
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
          className="w-full bg-green-600 text-white p-3 rounded-lg mt-6 hover:bg-green-700 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSkillsModal;