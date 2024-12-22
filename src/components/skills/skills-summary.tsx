import React from 'react';

import verifiedIcon from "@/assets/skills/verified_skills.svg";
import excellentIcon from "@/assets/skills/excellent.svg";
import strongIcon from "@/assets/skills/strong.svg";
import weakIcon from "@/assets/skills/weak.svg";


const SkillSummary: React.FC = () => {
  return (
    <div className=" p-10 flex flex-col justify-around bg-white rounded-xl w-[356px] h-[326px]">
      {/* Skills Verified Section */}
      <div className='flex items-start gap-2'>
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border space-x-2 mb-4">
          <img src={verifiedIcon} alt="Verified icon" className="w-[24px] h-[24px]" />
        </div>
        <div className='flex flex-col '>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">6/10</span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">Skills Verified </span>
          </p>
        </div>
      </div>
      {/* Skill Levels */}
      <div className='flex items-start gap-2'>
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border space-x-2 mb-4">
          <img src={excellentIcon} alt="Verified icon" className="w-[24px] h-[24px]" />
        </div>
        <div className='flex flex-col '>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">3</span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">Excellent</span>
          </p>
        </div>
      </div>
      <div className='flex items-start gap-2'>
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border space-x-2 mb-4">
          <img src={strongIcon} alt="Verified icon" className="w-[24px] h-[24px]" />
        </div>
        <div className='flex flex-col '>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">6/10</span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">Skills Verified </span>
          </p>
        </div>
      </div>
      <div className='flex items-start gap-2'>
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border space-x-2 mb-4">
          <img src={weakIcon} alt="Verified icon" className="w-[24px] h-[24px]" />
        </div>
        <div className='flex flex-col '>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">6/10</span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">Skills Verified </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillSummary;
