import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";
import AddSkillsModal from "@/components/skills/addskills";

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

interface Goal {
  _id: string;
  name: string;
  description: string;
  user_id: string;
  skill_poll_id: string[];
}

interface SkillsHeaderProps {
  userId: string;
  goals: {
    data: Goal[];
  };
  skills: {
    data: Skill[];
  };
  selectedGoalName: string; // New prop to pass the selected goal name
  onSkillsStatusChange: (isUpdated: boolean) => void; // Callback to notify parent of update status
  onGoalChange: (goalId: string) => void; // Callback to notify parent of goal change
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  userId,
  goals,
  skills: selectedSkills,
  selectedGoalName, // Receive the selected goal name
  onSkillsStatusChange,
  onGoalChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsUpdated, setSkillsUpdated] = useState(false); // State to track updates
  const [selectedGoal, setSelectedGoal] = useState(selectedGoalName || ""); // Initialize with selectedGoalName

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

  const handleSkillsUpdate = (isUpdated: boolean) => {
    console.log(`Skills update status: ${isUpdated}`);
    setSkillsUpdated(isUpdated); // Set the local update flag
    onSkillsStatusChange(isUpdated); // Notify the parent of the update status
  };

  useEffect(() => {
    if (skillsUpdated) {
      console.log("Perform actions like fetching updated data here.");
      setSkillsUpdated(false); // Reset the flag after handling
    }
  }, [skillsUpdated]);

  const handleGoalChange = (goalName: string) => {
    setSelectedGoal(goalName); // Update the selected goal name
    const selectedGoalId = goals?.data.find((goal) => goal.name === goalName)?._id;
    if (selectedGoalId) {
      onGoalChange(selectedGoalId); // Notify parent with the selected goal ID
    }
  };

  return (
    <>
      <div className="bg-[#F5F5F5] w-full absolute top-0 left-0 z-10">
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
          {/* Goal Section */}
          <div className="bg-white w-ful h-[46px] rounded-lg flex items-center justify-start px-4">
            <span>Goal :</span>
            <select
              className="text-base font-normal leading-6 tracking-[0.015rem] bg-transparent border-none outline-none"
              value={selectedGoal} // Bind to the selected goal
              onChange={(e) => handleGoalChange(e.target.value)}
            >
              {goals?.data.map((goal) => (
                <option key={goal._id} value={goal.name}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>
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
          selectedSkills={selectedSkills.data.all}
          onClose={handleCloseModal}
          userId={userId}
          onSkillsUpdate={handleSkillsUpdate} // Pass the update handler
        />
      )}
    </>
  );
};

export default SkillsHeader;