import React, { useEffect, useState } from "react";
import AddSkillsModal from "@/components/skills/addskills";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import arrowIcon from "@/assets/components/arrow_drop_down.svg";

interface SkillsHeaderProps {
  userId: string | undefined;
  goals: {
    message: string;
    data: [
      {
        experience: string | undefined;
        _id: string;
        name: string;
      }
    ];
  } | undefined;
  selectedGoalName: string;
  onSkillsStatusChange: (isUpdated: boolean) => void;
  onGoalChange: (goalId: string) => void;
  selectedGoalExperienceLevel: string | null;
  hideAddSkillsButton?: boolean;
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  userId,
  goals,
  selectedGoalName,
  onSkillsStatusChange,
  onGoalChange,
  selectedGoalExperienceLevel,
  hideAddSkillsButton = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsUpdated, setSkillsUpdated] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Map experience levels to text
  const experienceLevelObj = { 1: "Entry-level", 2: "Mid-level", 3: "Senior-level" };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        setSelectedGoal(goals.data[0].name);
        setSelectedGoalId(goals.data[0]._id);
      }
    }
  }, [goals, selectedGoalName]);

  return (
    <>
      <div className="bg-[#F5F5F5] w-full md:flex absolute top-0 left-0 z-10">
        <div className="flex w-full justify-between items-center mb-6">
          {/* Goal Section */}
          <div className="bg-white h-[46px] rounded-lg flex items-center justify-start px-4 border-gray-300">
            <span className="text-[#00000066] font-medium mr-2">Goal:</span>
            {selectedGoal ? (
              <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
                <DropdownMenuTrigger
                  className="flex items-center justify-between text-base font-normal leading-6 tracking-[0.015rem] bg-transparent border-none outline-none cursor-pointer w-50"
                >
                  {/* Display goal name and experience level */}
                  <span className="font-medium sm:w-[100px] truncate">
                    {selectedGoal} ({experienceLevelObj[selectedGoalExperienceLevel as unknown as keyof typeof experienceLevelObj]})
                  </span>
                </div>
                <img 
                  className={`h-6 w-6 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  src={arrowIcon} 
                  alt="arrow"
                />
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
                    {goal.name} ({experienceLevelObj[goal.experience as unknown as keyof typeof experienceLevelObj]})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-500 italic ml-2">Loading...</span>
          )}
        </div>

        {!hideAddSkillsButton && (
          <button
            onClick={handleOpenModal}
            className=" py-2 text-sm w-[138px] h-[44px] md:h[50px] md:w[150px] md:px-2 md:py-0.5 font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
          >
            Add Skills
          </button>
        )}
      </div>

      {isModalOpen && selectedGoalId && (
        <AddSkillsModal
          goalId={selectedGoalId}
          onClose={handleCloseModal}
          userId={userId}
          onSkillsUpdate={handleSkillsUpdate}
          goals={goals}
          prefillSkills={[]}
        />
      )}
    </>
  );
};

export default SkillsHeader;