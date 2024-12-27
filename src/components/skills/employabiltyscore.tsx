import React from 'react';
import CircularProgress from '@/components/ui/circular-progress-bar'; // Updated CircularProgress
import logo from '@/assets/skills/e-Logo.svg';

interface Skill {
    _id: string;
    skill_pool_id: {
      _id: string;
      name: string;
      icon: string
    };
    verified_rating: number;
    self_rating: number;
}

interface EmployabilityScoreProps {
  skills: {
    data: Skill[];
  }; 
}

const EmployabilityScore: React.FC<EmployabilityScoreProps> = ({ skills }) => {

  const totalVerifiedRating = skills.data.reduce((acc, skill) => acc + skill.verified_rating, 0);
  const averageVerifiedRating =
    skills.data.length > 0 ? parseFloat((totalVerifiedRating / skills.data.length).toFixed(2)) : 0.00;

  return (
    <div className=" bg-white w-[100%] rounded-lg mt-[48px] p-[42px]">
      {/* Employability Score Section */}
      <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
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
    </div>
  );
};

export default EmployabilityScore;
