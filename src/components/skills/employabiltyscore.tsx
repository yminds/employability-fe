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
}

const EmployabilityScore: React.FC<EmployabilityScoreProps> = ({ goalId }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goalId);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

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
    if (userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [userId, selectedGoalId]);

  const totalVerifiedRating = skillsData
    ? skillsData?.data?.all.reduce((acc: number, skill: Skill) => acc + skill.verified_rating, 0)
    : 0;

  const averageVerifiedRating =
    skillsData && skillsData?.data?.all.length > 0 ? totalVerifiedRating / skillsData?.data?.all.length : 0;

  return (
    <div className="bg-white w-[100%] rounded-lg mt-[48px] p-[42px]">
      {/* Employability Score Section */}
      <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
          {/* Circular Progress Bar */}
          <CircularProgress progress={averageVerifiedRating} size={60} strokeWidth={6} showText={false} />
          <img className="absolute w-8 h-8" src={logo} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{averageVerifiedRating > 0 ? averageVerifiedRating.toFixed(2) : averageVerifiedRating}</p>
          <p className="text-sm text-gray-600">Employability Score</p>
        </div>
      </div>
    </div>
  );
};

export default EmployabilityScore;
