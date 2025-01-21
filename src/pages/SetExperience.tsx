import React, { useState } from "react";
import bg from "@/assets/set-goal/backGround.png";
import logo from "@/assets/branding/logo.svg";
import ESymbol from "@/assets/branding/e.png";
import { useNavigate } from "react-router-dom";
import LevelOption from "@/components/setgoals/levels";
import seniorLevelImg from "@/assets/set-goal/seniorLevel.png";
import midLevelImg from "@/assets/set-goal/midLevel.png";
import entrylevelImg from "@/assets/set-goal/entryLevel.png";
import ProtectedOnboardingRoute from "@/features/authentication/ProtectedOnboardingRoute";
import { useSelector } from "react-redux";

const ExperienceLevel: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const navigate = useNavigate();
  console.log("User:", user.name);

  const handleSelection = async (level: string) => {
    setSelectedLevel(level);
    try {
      navigate("/addphone", { state: { experienceLevel: level } });
    } catch (error) {
      console.error("Failed to store experience level:", error);
    }
  };

  return (
    <ProtectedOnboardingRoute>
      <main className="h-screen w-screen flex p-6">
        <section className="h-full w-full relative">
          <img className="w-full h-full rounded-lg" src={bg} alt="" />
          <img
            className=" absolute top-0 2xl:top-10 left-10"
            src={logo}
            alt=""
          />
          <img
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 xl:w-[600px] 2xl:w-[1000px]"
            src={ESymbol}
            alt=""
          />
        </section>
        <section className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[846px]">
            <div className="bg-white rounded-lg w-full max-w-[500px]">
              <div className="mb-[40px]">
                <h2 className="font-ubuntu text-3xl font-bold text-[#1a1a1a] mb-2">
                  Hey <span className="text-[#08a358]">{user.name}</span>!
                </h2>
                <h1 className="font-ubuntu text-2xl font-bold leading-[42px] tracking-[-0.5px] text-[#1a1a1a]">
                  What's your experience level?
                </h1>
                <p className="text-black text-opacity-60 font-sf-pro-display text-base font-normal leading-6 tracking-wide">
                  Choose your experience level, or skip this step.
                </p>
              </div>
              <div className="space-y-4">
                <LevelOption
                  level="Entry Level"
                  description="Starting your career journey? Let's help you build a solid foundation and develop essential skills."
                  isSelected={selectedLevel === "entry"}
                  onClick={() => handleSelection("entry")}
                  imgScr={entrylevelImg}
                  className="h-[52px]"
                />
                <LevelOption
                  level="Mid Level"
                  description="Already established? Enhance your expertise and prepare for more responsibilities."
                  isSelected={selectedLevel === "mid"}
                  onClick={() => handleSelection("mid")}
                  imgScr={midLevelImg}
                  className="h-[52px]"
                />
                <LevelOption
                  level="Senior Level"
                  description="Experienced and confident? Verify your skills to excel in Jobs roles."
                  isSelected={selectedLevel === "senior"}
                  onClick={() => handleSelection("senior")}
                  imgScr={seniorLevelImg}
                  className="h-[69px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </ProtectedOnboardingRoute>
  );
};

export default ExperienceLevel;
