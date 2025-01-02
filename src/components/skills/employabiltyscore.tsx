import React, { useEffect, useState } from 'react';
import CircularProgress from '@/components/ui/circular-progress-bar'; // Updated CircularProgress
import logo from '@/assets/skills/e-Logo.svg';
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface Skill {
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
    icon: string;
  };
  verified_rating: number;
  self_rating: number;
}

interface EmployabilityScoreProps {
  goalId: string;
  goalName: string; 
  isSkillsUpdated?: boolean;
}

const EmployabilityScore: React.FC<EmployabilityScoreProps> = ({ goalId, goalName, isSkillsUpdated}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goalId);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const user = useSelector((state: any) => state.auth.user);
  const [getUserSkills, { data: skillsData, isLoading, isError, error }] =
    useGetUserSkillsMutation();

  const fetchSkills = async (userId: string, goalId: string) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (goalId !== selectedGoalId) {
      setSelectedGoalId(goalId);
    }
  }, [goalId]);

  useEffect(() => {
    if (userId && selectedGoalId ) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [userId, selectedGoalId]);

  useEffect(() => {
    if (isSkillsUpdated && userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [isSkillsUpdated]);
  

  const totalVerifiedRating = skillsData
    ? skillsData?.data?.all.reduce((acc: number, skill: Skill) => acc + skill.verified_rating, 0)
    : 0;

  const averageVerifiedRating =
    skillsData && skillsData?.data?.all.length > 0 ? totalVerifiedRating / skillsData?.data?.all.length : 0;

  return (
    <div className="bg-white flex flex-col w-[100%] rounded-lg mt-[48px] p-[42px] gap-6 pb-[32px]">
      <div className="flex items-center gap-2">
        <div>
          <img className="w-[50px] h-[50px] rounded-full" src={user?.profile_image} alt="user" />
        </div>
        <div className='flex flex-col items-start'>
          <p className='text-[#414447] font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.2px]'>{userName}</p>
          <p className='text-[#909091]0 text-[14px] font-medium leading-[24px] tracking-[-0.2px]'>{goalName}</p>
        </div>
      </div>

      {/* Employability Score Section */}
      <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
          {/* Circular Progress Bar */}
          <CircularProgress progress={averageVerifiedRating * 10} size={60} strokeWidth={6} showText={false} />
          <img className="absolute w-8 h-8" src={logo} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{averageVerifiedRating > 0 ? averageVerifiedRating.toFixed(2) : averageVerifiedRating }
            <span className="text-2xl font-bold text-[#00000099]">/10</span>
          </p>
          <p className="text-gray-900 font-sf-pro-display text-lg font-medium leading-6 tracking-[0.27px]">Skill Score</p>
        </div>
      </div>
    </div>
  );
};

export default EmployabilityScore;
