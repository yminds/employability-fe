import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import InterviewHeader from "./InterviewHeader";
import InterviewList from "./InterviewList";
import arrow from "@/assets/skills/arrow.svg";

import GoalDialog from "@/components/skills/setGoalDialog";
import { useGetInvitesByUserIdQuery } from "@/api/interviewApiSlice";

const InterviewContainer: React.FC = () => {
  const navigate = useNavigate();
  const goals = useSelector((state: RootState) => state.auth.user?.goals);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const user_id = useSelector((state: RootState) => state.auth.user?._id);
  const { data: invitesData, isLoading: isInvitesLoading } = useGetInvitesByUserIdQuery(user_id);
  
  useEffect(() => {
    if (goals && goals?.length === 0) {
      setIsGoalModalOpen(true);
    } else if (goals?.length && selectedGoalId === null) {
      setSelectedGoalId(goals?.[0]._id);
    }
  }, [selectedGoalId, goals]);

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const handleGoalModal = () => {
    setIsGoalModalOpen(false);
    navigate("/");
  };

  return isGoalModalOpen ? (
    <GoalDialog isOpen={isGoalModalOpen} onClose={handleGoalModal} />
  ) : (
    <>
      <div className="flex justify-between items-center mb-4 sm:mt-3">
        <div className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackToDashboard}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img
              className="w-[10px] h-[10px]"
              src={arrow || "/placeholder.svg"}
              alt="Back"
            />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
            Interviews
          </h1>
        </div>
      </div>
      
      <section className="w-full h-[90vh] flex bg-[#F5F5F5] justify-center">
        <div className="flex w-full max-w-[1800px] md:flex-col md:overflow-y-auto md:scrollbar-hide sm:flex-col sm:overflow-y-auto sm:scrollbar-hide sm:scroll-align-top">
          {/* Main Interview List Section */}
          <div className="w-full xl:h-full lg:h-full 2xl:h-full scrollbar-hide">
            <div className="mt-1 sm:min-w-[100%] space-y-4 overflow-y-auto sm:mt-1">
              <InterviewList 
                goalId={selectedGoalId} 
                invites={invitesData?.data} 
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewContainer;
