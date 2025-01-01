import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";
import AddSkillsModal from "@/components/skills/addskills";

interface SkillsHeaderProps {
  userId: string | undefined;
  goals: {
    message: string;
    data: [
      {
        _id: string;
        name: string;
      }
    ];
  } | undefined;
  selectedGoalName: string; // New prop to pass the selected goal name
  onSkillsStatusChange: (isUpdated: boolean) => void; // Callback to notify parent of update status
  onGoalChange: (goalId: string) => void; // Callback to notify parent of goal change
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  userId,
  goals,
  selectedGoalName, // Receive the selected goal name
  onSkillsStatusChange,
  onGoalChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsUpdated, setSkillsUpdated] = useState(false); // State to track updates
  const [selectedGoal, setSelectedGoal] = useState(selectedGoalName || ""); // Initialize with selectedGoalName
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>("");

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
    setSkillsUpdated(isUpdated); // Set the local update flag
    onSkillsStatusChange(isUpdated); // Notify the parent of the update status
  };

  useEffect(() => {
    if (skillsUpdated) {
      setSkillsUpdated(false); // Reset the flag after handling
    }
  }, [skillsUpdated]);

  const handleGoalChange = (goalName: string) => {
    setSelectedGoal(goalName); // Update the selected goal name
    const foundGoal = goals?.data.find((goal) => goal.name === goalName);
    if (foundGoal) {
      setSelectedGoalId(foundGoal._id); // Update the goalId state
      onGoalChange(foundGoal._id); // Notify parent with the selected goal ID
    }
  };

  // Set initial selected goalId when the component mounts
  useEffect(() => {
    const initialGoal = goals?.data.find((goal) => goal.name === selectedGoalName);
    if (initialGoal) {
      setSelectedGoalId(initialGoal._id);
    }
  }, [goals, selectedGoalName]);

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
      {isModalOpen && selectedGoalId && (
        <AddSkillsModal
          goalId={selectedGoalId} // Pass the goalId to the modal
          onClose={handleCloseModal}
          userId={userId}
          onSkillsUpdate={handleSkillsUpdate} // Pass the update handler
        />
      )}
    </>
  );
};

export default SkillsHeader;
