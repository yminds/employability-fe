import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";
import AddSkillsModal from "@/components/skills/addskills";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface SkillsHeaderProps {
  onSkillsStatusChange: (isUpdated: boolean) => void; // Callback to notify parent of update status
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({ onSkillsStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsUpdated, setSkillsUpdated] = useState(false); // State to track updates

  const userId = useSelector((state: RootState) => state.auth.user._id);

  const { data: goalData, isLoading: goalLoading } = useGetGoalsbyuserQuery(userId);

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


  const [goal, setGoal] = useState<string>();

  useEffect(() => {
    setGoal(goalData?.data[0]?.name as string);
  }, [goalData]);

  useEffect(() => {
    if (skillsUpdated) {
      console.log("Perform actions like fetching updated data here.");
      setSkillsUpdated(false); // Reset the flag after handling
    }
  }, [skillsUpdated]);

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
          <div className="bg-white w-ful h-[46px] rounded-lg flex items-center justify-start px-4 ">
            <span className="text-sm text-gray-600 items-center">Goal : </span>
            <span className="text-lg font-semibold text-gray-900 pl-2 truncate">
              {goal}
            </span>
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
          onClose={handleCloseModal}
          userId={userId}
          onSkillsUpdate={handleSkillsUpdate} // Pass the update handler
        />
      )}
    </>
  );
};

export default SkillsHeader;
