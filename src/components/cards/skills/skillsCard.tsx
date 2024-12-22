import React from 'react';
import useSkillStatus from '@/hooks/useSkillsStatus';

interface SkillCardProps {
  skill: string;
  skillImg: string;
  rating: number;
  selfRating: number;
  initialStatus: string; // Initial status of the skill
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  skillImg,
  rating,
  selfRating,
  initialStatus,
}) => {
  const { status, getStatusImage } = useSkillStatus(initialStatus);

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
      {/* Left Section: Skill Image and Name */}
      <div className="flex items-center space-x-4">
        <img src={skillImg} alt={skill} className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{skill}</h3>
          <p className="text-sm text-gray-600">Self rating: {selfRating}/10</p>
        </div>
      </div>

      {/* Middle Section: Rating and Status */}
      <div className="flex flex-col items-center space-y-1">
        <p className="text-lg font-bold">{rating}/10</p>
        <div className="flex items-center space-x-2">
          <img src={getStatusImage()} alt={status} className="w-4 h-4" />
          <span
            className={`text-sm font-medium ${
              status === 'Verified' ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex space-x-2">
        {status === 'Verified' ? (
          <>
            <button className="px-4 py-2 text-sm font-medium border rounded-md text-gray-700 hover:bg-[#10B754] hover:text-white">
              View report
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-[#10B754]">
              Improve score
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 text-sm font-medium border rounded-md text-gray-700 hover:bg-[#FACC15] hover:text-white">
              Learn
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-[#10B754]">
              Verify skill
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
