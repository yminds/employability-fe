import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import SkillsFilter from '@/components/skills/skillsfilter';
import arrow from '@/assets/skills/arrow.svg';

interface SkillsHeaderProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({ activeFilter, setFilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBackToDashboard = () => {
    navigate('/'); // Navigate to the dashboard page
  };

  return (
    <div className="bg-[#F5F5F5] w-[920px] fixed">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackToDashboard} // Call the navigation function
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">Skills</h1>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <SkillsFilter activeFilter={activeFilter} setFilter={setFilter} />
        <button
          className="px-4 py-2 w-[138px] h-[44px] bg-black text-white rounded-md hover:bg-green-600"
        >
          Add Skills
        </button>
      </div>
    </div>
  );
};

export default SkillsHeader;
