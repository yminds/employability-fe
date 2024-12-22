import React, { useState } from 'react';

import editIcon from "@/assets/skills/edit-icon.svg";
import logo from "@/assets/skills/e-Logo.svg";

const EmployabilityScore: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>('Full stack developer');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false); // Save the goal and exit edit mode
    }
  };

  return (
    <div className="flex flex-col justify-around items-center bg-white w-[356px] h-[270px] rounded-lg ">
      {/* Employability Score Section */}
      <div className="p-4 w-[272px] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="w-[60px] h-[60px] flex border items-center justify-center rounded-full ">
          <img className="" src={logo} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">88.9</p>
          <p className="text-sm text-gray-600">Employability Score</p>
        </div>
      </div>

      {/* Goal Section */}
      <div className="bg-[#FAFAFA] w-[272px] h-[80px] rounded-lg flex items-center justify-around">
        <div className="w-[213px] h-[46px] flex flex-col justify-around">
          <p className="text-sm text-gray-600 items-center">Goal</p>
          {isEditing ? (
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key
              className="text-lg font-semibold text-gray-900 border border-gray-100 rounded-md px-2 py-1 focus:border-b-2 "
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">{goal}</p>
          )}
        </div>
        <div className='h-[46px] flex items-end'>
            {isEditing ? (
            <button
                onClick={handleSave}
                className="text-blue-600  hover:text-blue-800 font-medium"
            >
                <img  src={editIcon} alt="" />
            </button>
            ) : (
            <button onClick={handleEdit} className="text-gray-500 hover:text-gray-700">
                <img src={editIcon} alt="" />
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default EmployabilityScore;
