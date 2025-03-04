import type React from "react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import arrowIcon from "@/assets/components/arrow_drop_down.svg";

interface InterviewHeaderProps {
  userId: string | undefined;
  goals:
    | {
        message: string;
        data: [
          {
            experience: string | undefined;
            _id: string;
            name: string;
          }
        ];
      }
    | undefined;
  selectedGoalName: string;
  onGoalChange: (goalId: string) => void;
  selectedGoalExperienceLevel: string | null;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  userId,
  goals,
  selectedGoalName,
  onGoalChange,
  selectedGoalExperienceLevel,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Map experience levels to text
  const experienceLevelObj = {
    1: "Entry-level",
    2: "Mid-level",
    3: "Senior-level",
  };

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
      const initialGoal = goals.data.find(
        (goal) => goal.name === selectedGoalName
      );
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
    <div className="bg-[#F5F5F5] w-full md:flex absolute top-0 left-0 z-10 sm:relative">
      <div className="flex w-full justify-between items-center mb-6 sm:flex-col sm:justify-normal sm:items-start sm:m-0">
        {/* Goal Section */}
        <div className="bg-white h-[46px] rounded-lg flex items-center justify-start px-4 border-gray-300 sm:my-3 sm:w-full sm:max-w-[320px]">
          <span className="text-[#00000066] font-medium mr-2">Goal:</span>
          {selectedGoal ? (
            <DropdownMenu
              onOpenChange={(
                open: boolean | ((prevState: boolean) => boolean)
              ) => setDropdownOpen(open)}
            >
              <DropdownMenuTrigger className="flex items-center justify-between text-base font-normal leading-6 tracking-[0.015rem] bg-transparent border-none outline-none cursor-pointer w-50">
                {/* Display goal name and experience level */}
                <span className="font-medium sm:w-[90%] truncate">
                  {selectedGoal} (
                  {
                    experienceLevelObj[
                      selectedGoalExperienceLevel as unknown as keyof typeof experienceLevelObj
                    ]
                  }
                  )
                </span>
                {dropdownOpen ? (
                  <img
                    className="ml-2 h-8 w-8 text-[#1C1B1F] rotate-180 duration-75"
                    src={arrowIcon || "/placeholder.svg"}
                    alt="arrow img"
                  />
                ) : (
                  <img
                    className="ml-2 h-8 w-8 text-[#1C1B1F]"
                    src={arrowIcon || "/placeholder.svg"}
                    alt="arrow img"
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                {/* Render goal options with experience level */}
                {goals?.data.map((goal) => (
                  <DropdownMenuItem
                    key={goal._id}
                    onClick={() => handleGoalChange(goal.name)}
                    className={`${
                      selectedGoal === goal.name ? "bg-gray-100" : ""
                    } cursor-pointer hover:bg-[#001630] hover:text-white`}
                  >
                    {goal.name} (
                    {
                      experienceLevelObj[
                        goal.experience as unknown as keyof typeof experienceLevelObj
                      ]
                    }
                    )
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-500 italic">Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
