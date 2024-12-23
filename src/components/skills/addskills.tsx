import React, { useState } from 'react';

interface Skill {
  name: string;
  rating: number;
}

const AddSkillsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [skills, setSkills] = useState<Skill[]>([{ name: '', rating: 5 }]); // Default to 5/10 for new skills
  const suggestedSkills = ['React', 'MongoDB', 'Node.js', 'GraphQL', 'MySQL', 'Express'];

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index].name = value;
    setSkills(updatedSkills); 
  };

  const handleRatingChange = (index: number, value: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index].rating = value;
    setSkills(updatedSkills);
  };

  const addSkillField = () => {
    setSkills([...skills, { name: '', rating: 5 }]); // Default rating for new skills
  };

  const addSuggestedSkill = (skill: string) => {
    setSkills([...skills, { name: skill, rating: 5 }]); // Default rating for suggested skills
  };

  const handleSave = () => {
    console.log('Saved skills:', skills);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-[42px] w-[532px] h-[654px]">
        <div className="flex justify-between items-center mb-6">
          <div className="">
            <h2 className="text-xl font-bold">Add skills</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your goal and tailor your learning path.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-lg font-bold">×</button>
        </div>

        {/* Skills Fields */}
        {skills.map((skill, index) => (
          <div key={index} className="flex  items-center gap-4 mb-4">
            <div className='flex flex-col'>
            <label className="text-gray-600 font-medium">Skill {index + 1}</label>
            <select
              className="border border-gray-300 rounded-md p-2 flex-1"
              value={skill.name}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            >
              <option value="" disabled>Select one</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
            </select>
            </div>
            <input
              type="number"
              className="border border-gray-300 rounded-md p-2 w-[60px]"
              placeholder="0/10"
              value={skill.rating}
              onChange={(e) => handleRatingChange(index, Math.min(10, Math.max(0, Number(e.target.value))))}
              min={0}
              max={10}
            />
          </div>
        ))}

        <button
          onClick={addSkillField}
          className="flex items-center text-green-600 font-semibold mb-6"
        >
          <span className="text-xl font-bold">+</span> Add skill
        </button>

        {/* Suggested Skills */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-300"
                onClick={() => addSuggestedSkill(skill)}
              >
                {skill} +
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillsModal;
