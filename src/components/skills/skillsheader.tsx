import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillsFilter from "@/components/skills/skillsfilter";
import arrow from "@/assets/skills/arrow.svg";
import AddSkillsModal from "@/components/skills/addskills";

interface SkillsHeaderProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
  skills: any[];
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  activeFilter,
  setFilter,
  skills,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/"); // Navigate to the dashboard page
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSaveSkills = (newSkills: any[]) => {
    const updatedSkills = newSkills ; // Combine existing and new skills
    console.log("Updated Skills:", updatedSkills);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <div className="bg-[#F5F5F5] w-[920px] fixed">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 gap-3">
            <button
              onClick={handleBackToDashboard}
              className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
            >
              <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
            </button>
            <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
              Skills
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <SkillsFilter activeFilter={activeFilter} setFilter={setFilter} />
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 w-[138px] h-[44px] bg-black text-white rounded-md hover:bg-green-600"
          >
            Add Skills
          </button>
        </div>
      </div>

      {/* AddSkillsModal */}
      {isModalOpen && (
        <AddSkillsModal
          onClose={handleCloseModal}
          userId="userId" // Replace with actual userId if needed
        />
      )}
    </>
  );
};

export default SkillsHeader;
