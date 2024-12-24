import React, { useEffect, useState } from 'react';
import CircularProgress from '@/components/ui/circular-progress-bar'; // Updated CircularProgress
import editIcon from '@/assets/skills/edit-icon.svg';
import logo from '@/assets/skills/e-Logo.svg';
import { useSelector } from 'react-redux';
import { useUpdateGoalNameMutation , useGetGoalsbyuserQuery } from '@/api/goalsApiSlice'
import { RootState } from '@/store/store';

interface Skill {
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
  };
  verified_rating: number;
  self_rating: number;
  data : any
}

interface Goal {
  _id: string;
  user_id: string;
  __v: number;
  description: string;
  name: string;
  skill_pool_ids: string[];
}

interface GoalsResponse {
  message: string;
  data: Goal[];
}

interface EmployabilityScoreProps {
  skills: Skill[]; // Accept skills array as a prop
}

const EmployabilityScore: React.FC<EmployabilityScoreProps> = ({ skills }) => {
  const userId =  useSelector((state:RootState) => state.auth.user._id); 

  const [updateExample, { isLoading, error }] = useUpdateGoalNameMutation();

  const { data:goalData , error: goalError, isLoading: goalLoading } = useGetGoalsbyuserQuery(userId);
 
  const goalName = goalData?.data[0]?.name as string;

  const totalVerifiedRating = skills.data.reduce((acc, skill) => acc + skill.verified_rating, 0);
  const averageVerifiedRating = skills.data.length > 0 ? totalVerifiedRating / skills.data.length : 0;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>();

  useEffect(()=>{
    setGoal(goalData?.data[0]?.name as string)
  },[goalData])

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await updateExample({userId : userId, name : goal }).unwrap();
    } catch (err) {
      // Handle error
      console.error('Failed to update:', err);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false); // Save the goal and exit edit mode
      try {
        await updateExample({userId : userId, name : goal }).unwrap();
      } catch (err) {
        // Handle error
        console.error('Failed to update:', err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-around items-center bg-white w-[356px] h-[270px] rounded-lg pl-[42px] pt-[42px] pr-[42px] pb-[32px]">
      {/* Employability Score Section */}
      <div className="p-4 w-[272px] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
          {/* Circular Progress Bar */}
          <CircularProgress progress={averageVerifiedRating} size={60} strokeWidth={6} showText={false} />
          <img className="absolute w-8 h-8" src={logo} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{averageVerifiedRating}</p>
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
            <p className="text-lg font-semibold text-gray-900 truncate">{goal}</p>
          )}
        </div>
        <div className="h-[46px] flex items-end">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              <img src={editIcon} alt="" />
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
