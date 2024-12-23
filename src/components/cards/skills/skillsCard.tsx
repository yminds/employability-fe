import React from 'react';
import useSkillStatus from '@/hooks/useSkillsStatus';

interface SkillCardProps {
  skill: string;
  skillImg: string;
  verified_rating: number;
  selfRating: number;
  initialStatus: string; // Initial status of the skill
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  skillImg,
  verified_rating,
  selfRating,
  initialStatus,
}) => {
  const { status, getStatusImage } = useSkillStatus(initialStatus);

  return (
    <div className="flex items-center justify-around w-[920px] h-[140px] p-4 bg-white border rounded-lg shadow-sm">
      {/* Left Section: Skill Image and Name */}
      <div className="flex w-[30%] h-full  items-center justify-center space-x-4">
        <img src={skillImg} alt={skill} className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="text-[2vh] font-semibold">{skill}</h3>
          <p className="text-sm text-gray-600">Self rating: {selfRating}/10</p>
        </div>
      </div>

      {/* Middle Section: Rating and Status */}
      <div className="flex w-[30%] flex-col items-center space-y-1 border-r-2 border-l-2">
        <p className="text-lg font-bold">{verified_rating}/10</p>
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
      <div className="flex w-[40%] justify-center  space-x-2">
        {status === 'Verified' ? (
          <>
            <button className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium border rounded-md text-gray-700 hover:bg-[#10B754] hover:text-white">
              View report
            </button>
            <button className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium text-white bg-black rounded-md hover:bg-[#10B754]">
              Improve score
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 w-[138px] h-[44px] text-sm font-medium border rounded-md text-gray-700 hover:bg-[#10B754] hover:text-white">
              Learn
            </button>
            <button className="px-4 py-2 w-[138px] h-[44px] text-sm font-medium text-white bg-black rounded-md hover:bg-[#10B754]">
              Verify skill
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
