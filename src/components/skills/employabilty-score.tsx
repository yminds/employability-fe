import React, { useState } from 'react';

const EmployabilityScore: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>('Full stack developer');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-4">
      {/* Employability Score Section */}
      <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
          <span className="text-green-600 font-bold text-xl">e</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">88.9</p>
          <p className="text-sm text-gray-600">Employability Score</p>
        </div>
      </div>

      {/* Goal Section */}
      <div className="p-4 bg-white rounded-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Goal</p>
          {isEditing ? (
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="text-lg font-semibold text-gray-900 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">{goal}</p>
          )}
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Save
          </button>
        ) : (
          <button onClick={handleEdit} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5h6M5 11h14M5 11V5m6 6v14"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployabilityScore;
