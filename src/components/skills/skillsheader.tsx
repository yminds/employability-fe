import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";
import AddSkillsModal from "@/components/skills/addskills";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  selectedGoalName,
  onSkillsStatusChange,
  onGoalChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsUpdated, setSkillsUpdated] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null); // Start as null to handle loading
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    setSkillsUpdated(isUpdated);
    onSkillsStatusChange(isUpdated);
  };

  useEffect(() => {
    if (skillsUpdated) {
      setSkillsUpdated(false);
    }
  }, [skillsUpdated]);

  const handleGoalChange = (goalName: string) => {
    setSelectedGoal(goalName);
    const foundGoal = goals?.data.find((goal) => goal.name === goalName);
    if (foundGoal) {
      setSelectedGoalId(foundGoal._id);
      onGoalChange(foundGoal._id);
    }
  };

  useEffect(() => {
    if (goals?.data.length && selectedGoalName) {
      const initialGoal = goals.data.find((goal) => goal.name === selectedGoalName);
      if (initialGoal) {
        setSelectedGoal(initialGoal.name);
        setSelectedGoalId(initialGoal._id);
      } else {
        setSelectedGoal(goals.data[0].name); // Default to the first goal if no match
        setSelectedGoalId(goals.data[0]._id);
      }
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
          <div className="bg-white h-[46px] rounded-lg flex items-center justify-start px-4 border-gray-300">
            <span className="text-[#00000066] font-medium mr-2">Goal:</span>
            {selectedGoal ? (
              <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
                <DropdownMenuTrigger
                  className="flex items-center justify-between text-base font-normal leading-6 tracking-[0.015rem] bg-transparent border-none outline-none cursor-pointer w-50"
                >
                  <span className="font-medium">{selectedGoal}</span>
                  {dropdownOpen ? (
                    <ChevronUp className="ml-2 h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  {goals?.data.map((goal) => (
                    <DropdownMenuItem
                      key={goal._id}
                      onClick={() => handleGoalChange(goal.name)}
                      className={`${
                        selectedGoal === goal.name ? "bg-gray-100" : ""
                      } cursor-pointer hover:bg-[#001630] hover:text-white`}
                    >
                      {goal.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-gray-500 italic">Loading...</span>
            )}
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md"
          >
            Add Skills
          </button>
        </div>
      </div>

      {/* AddSkillsModal */}
      {isModalOpen && selectedGoalId && (
        <AddSkillsModal
          goalId={selectedGoalId}
          onClose={handleCloseModal}
          userId={userId}
          onSkillsUpdate={handleSkillsUpdate}
          goals={goals}
        />
      )}
    </>
  );
};

export default SkillsHeader;
