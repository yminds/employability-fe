import React, { useState } from "react";
import bg from "@/assets/set-goal/backGround.png";
import logo from "@/assets/branding/logo.svg"
import LevelOption from "@/components/setgoals/levels";
import seniorLevelImg from "@/assets/set-goal/seniorLevel.png";
import midLevelImg from "@/assets/set-goal/midLevel.png";
import entrylevelImg from "@/assets/set-goal/entryLevel.png";
import ESymbol from "@/assets/branding/e.png"


interface SetExperienceLevelProps {
  onLevelSelect: (level: string) => void;
}

const SetExperienceLevel: React.FC<SetExperienceLevelProps> = ({ onLevelSelect }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleSelection = (level: string) => {
    setSelectedLevel(level);
    onLevelSelect(level); // Pass the selected level to the parent
  };

  return (
    <main className="h-screen w-screen bg-white flex p-6">
      <section className="h-full w-full relative">
        <img className="w-full h-full rounded-lg" src={bg} alt="" />
        <img className=" absolute top-0 2xl:top-10 left-10" src={logo} alt="" />
        <img className="absolute bottom-0 left-1/2 transform -translate-x-1/2 xl:w-[600px] 2xl:w-[1000px]" src={ESymbol} alt="" />
      </section>
      <section className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-[846px]">
          <div className="bg-white rounded-lg w-full max-w-[500px]">
            <div className="mb-[40px]">
              <h1 className="font-ubuntu text-2xl font-bold leading-[42px] tracking-[-0.5px]">
                What's your experience level?
              </h1>
              <p className="text-black text-opacity-60 font-sf-pro-display text-base font-normal leading-6 tracking-wide">
                Choose your experience level, or skip this step.
              </p>
            </div>
            <div className="space-y-4">
              <LevelOption
              level="Entry Level"
              description="Starting your career journey? Let’s help you build a solid foundation and develop essential skills."
              isSelected={selectedLevel === "Entry Level"}
              onClick={() => handleSelection("1")}
              imgScr={entrylevelImg}
              className="h-[52px]"
              />
              <LevelOption
                level="Mid Level"
                description="Already established? Enhance your expertise and prepare for more responsibilities."
                isSelected={selectedLevel === "Mid Level"}
                onClick={() => handleSelection("2")}
                imgScr={midLevelImg}
                className="h-[52px]"
              />
              <LevelOption
                level="Senior Level"
                description="Experienced and confident? Verify your skills to excel in Jobs roles."
                isSelected={selectedLevel === "Senior Level"}
                onClick={() => handleSelection("3")}
                imgScr={seniorLevelImg}
                className="h-[69px]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SetExperienceLevel;
