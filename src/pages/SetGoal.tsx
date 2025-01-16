import React, { useState } from "react";
import SetExperienceLevel from "@/components/setgoals/SetExperienceLevel";
import SetGoalCard from "@/features/dashboard/SetGoalCard";
import arrow from "@/assets/skills/arrow.svg";

const SetGoal: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [journeyDialog, setJourneyDialog] = useState(false);

  const handleLevelSelection = (level: string) => {
    setSelectedLevel(level);
  };

  const handleBackBtn = () => {
    setSelectedLevel(null)
  };

  return (
    <>
      {selectedLevel ? (
        <section className=" w-screen h-screen flex flex-col items-center justify-center bg-[#F5F5F5]" >
            <div className="max-w-[1400px] w-[100%] mb-8">
                <div className="flex items-center space-x-2 gap-3 ">
                    <button
                        onClick={handleBackBtn}
                        className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
                    >
                        <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
                    </button>
                    <h1 className="text-gray-900 font-ubuntu text-2xl font-medium leading-8 tracking-tight">
                    Set Your Goal
                    </h1>
                </div>
            </div>
            <div className="max-w-[1400px] w-[100%] rounded-[12px] p-6 bg-white">
                <SetGoalCard setJourneyDialog={setJourneyDialog} selectedLevel={selectedLevel} />
            </div>
        </section>
      ) : (
        // Render the experience level selection component
        <SetExperienceLevel onLevelSelect={handleLevelSelection} />
      )}
    </>
  );
};

export default SetGoal;
