import React, { useState } from "react";
import logo from "@/assets/branding/logo.svg";
import { useNavigate } from "react-router-dom";
import LevelOption from "@/components/setgoals/levels";
import seniorLevelImg from "@/assets/set-goal/seniorLevel.png";
import midLevelImg from "@/assets/set-goal/midLevel.png";
import entrylevelImg from "@/assets/set-goal/entryLevel.png";
import ProtectedOnboardingRoute from "@/features/authentication/ProtectedOnboardingRoute";
import { useSelector } from "react-redux";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
import { useUpdateFirstTimeUserMutation } from "@/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/authentication/authSlice";
import { RootState } from "@/store/store";
 
const ExperienceLevel: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
 
  const [selectedLevel, setSelectedLevel] = useState<
    "" | "entry" | "mid" | "senior"
  >("");
  const [updateFirstTimeUser] = useUpdateFirstTimeUserMutation();
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const handleSelection = async (level: "entry" | "mid" | "senior") => {
    setSelectedLevel(level);
    try {
      // navigate("/addphone", { state: { experienceLevel: level } });
      const result = await updateFirstTimeUser({
        user_id: user?._id || "",
        experience_level: level || "",
      }).unwrap();
 
      dispatch(
        setCredentials({
          user: result.user_info,
          accessToken: token,
        })
      );
      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to store experience level:", error);
    }
  };
 
  return (
    <ProtectedOnboardingRoute>
      <main className="h-screen w-screen bg-white flex">
        {/* Left Section */}
        <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
          <img
            src={grid || "/placeholder.svg"}
            alt="Grid Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <img
            src={man || "/placeholder.svg"}
            alt="Hero"
            className="absolute bottom-0 left-0 right-0 w-full object-contain"
          />
          <div className="absolute top-8 left-8 z-20">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </div>
        </div>
 
        {/* Right Section */}
        <div className="flex flex-col items-center flex-1 justify-center max-w-[846px]">
          <div className="rounded-lg w-full max-w-[500px]">
            <div className="mb-[40px]">
              <h2 className="font-ubuntu text-3xl font-bold text-[#1a1a1a] mb-2">
                Hey <span className="text-[#08a358]">{user.name}</span>!
              </h2>
              <h1 className="text-title text-[#1a1a1a]">
                What's your experience level?
              </h1>
              <p className="text-body2 text-[rgba(0,0,0,0.60)]">
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
      </main>
    </ProtectedOnboardingRoute>
  );
};
 
export default ExperienceLevel;