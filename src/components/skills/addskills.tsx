import React, { useState } from "react";

interface Skill {
  id: number;
  name: string;
  rating: string;
  visibility: string;
  status: "verified" | "unverified";
}

interface AddSkillsModalProps {
  onClose: () => void; // Function to close the modal
  onSave: (newSkills: Skill[]) => void; // Callback to return new skills
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({ onClose, onSave }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: skills.length + 1,
      name: "",
      rating: "__/10",
      visibility: "All users",
      status: "unverified",
    };
    setSkills([...skills, newSkill]);
  };

  const handleSave = () => {
    onSave(skills); // Pass the skills to the parent
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-w-full">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Add Skills</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={skill.name}
                onChange={(e) =>
                  setSkills((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, name: e.target.value } : s
                    )
                  )
                }
                placeholder="Skill Name"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          ))}
        </div>

        <button onClick={handleAddSkill} className="text-green-600 mt-4">
          + Add Skill
        </button>

        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white p-3 rounded-lg mt-6 hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSkillsModal;
