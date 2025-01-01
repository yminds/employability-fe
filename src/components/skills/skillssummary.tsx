import React, { useEffect } from 'react';
import verifiedIcon from "@/assets/skills/verified_skills.svg";
import excellentIcon from "@/assets/skills/excellent.svg";
import strongIcon from "@/assets/skills/strong.svg";
import weakIcon from "@/assets/skills/weak.svg";
import { useGetUserSkillsSummaryMutation } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkillSummaryProps {
  isSkillsUpdated: boolean; // Flag to indicate if skills were updated
  selectedGoalId: string;
}

const SkillSummary: React.FC<SkillSummaryProps> = ({ isSkillsUpdated, selectedGoalId }) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const goalId = selectedGoalId;

  // Initialize the mutation hook
  const [getUserSkillsSummary, { data: skillsSummaryData, error, isLoading }] = useGetUserSkillsSummaryMutation();

  // Fetch data when component mounts or selectedGoalId changes
  useEffect(() => {
    if (userId && selectedGoalId) {
      getUserSkillsSummary({ userId, goalId }); // Call the mutation with parameters
    }
  }, [userId, selectedGoalId, getUserSkillsSummary]);

  // Re-fetch data when skills are updated
  useEffect(() => {
    if (isSkillsUpdated) {
      getUserSkillsSummary({ userId, goalId });
    }
  }, [isSkillsUpdated, userId, selectedGoalId, getUserSkillsSummary]);

  const renderLoadingSkeleton = () => (
    <div className="flex flex-col justify-around bg-white rounded-xl w-full h-[326px] p-10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-start gap-4 mb-4">
          <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border">
            <Skeleton circle={true} width={28} height={28} className=" mb-1" />
          </div>
          <div className="flex flex-col justify-center">
            <Skeleton width={140} height={16} className="mb-1" />
            <Skeleton width={100} height={16} />
          </div>
        </div>
      ))}
    </div>
  );
  
  if (isLoading) {
    return renderLoadingSkeleton();
  }

  if (error || !skillsSummaryData?.data) {
    return 
  }

  // Extract values from the API response
  const {
    totalSkills,
    totalVerifiedSkills,
    excellent,
    intermediate,
    weak,
  } = skillsSummaryData.data;

  return (
    <div className="p-10 flex flex-col justify-around bg-white rounded-xl w-full h-[326px]">
      {/* Skills Verified Section */}
      <div className="flex items-start gap-2">
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border">
          <img src={verifiedIcon} alt="Verified icon" className="w-[24px] h-[24px]" />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              {totalVerifiedSkills}/{totalSkills}
            </span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              Skills Verified
            </span>
          </p>
        </div>
      </div>
      {/* Skill Levels */}
      <div className="flex items-start gap-2">
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border">
          <img src={excellentIcon} alt="Excellent icon" className="w-[24px] h-[24px]" />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              {excellent}
            </span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              Excellent
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border">
          <img src={strongIcon} alt="Strong icon" className="w-[24px] h-[24px]" />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              {intermediate}
            </span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              Strong
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex items-center justify-center rounded-full w-[46px] h-[46px] bg-[#FAFAFAFA] border">
          <img src={weakIcon} alt="Weak icon" className="w-[24px] h-[24px]" />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              {weak}
            </span>
          </p>
          <p className="text-base font-medium">
            <span className="text-[16px] font-normal leading-[24px] tracking-[0.015rem]">
              Weak
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillSummary;
