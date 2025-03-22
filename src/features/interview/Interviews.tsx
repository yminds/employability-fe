import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import InterviewHeader from "./InterviewHeader";
import InterviewList from "./InterviewList";
import arrow from "@/assets/skills/arrow.svg";
import InterviewInvites from "./InterviewInvites";
import GoalDialog from "@/components/skills/setGoalDialog";
import InterviewInvitationsList from "@/features/dashboard/InterviewInvitationsList";
import { useGetInvitesByUserIdQuery } from "@/api/interviewApiSlice";

const InterviewContainer: React.FC = () => {
  const navigate = useNavigate();
  const goals = useSelector((state: RootState) => state.auth.user?.goals);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const user_id = useSelector((state: RootState) => state.auth.user?._id);
  const { data: invitesData, isLoading: isInvitesLoading } = useGetInvitesByUserIdQuery(user_id);
  console.log("invitesData", invitesData);
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
            Interview
          </h1>
        </div>
      </div>
      <section className="w-full h-[90vh] flex bg-[#F5F5F5] justify-center">
        <div className="flex w-full max-w-[1800px] gap-6 md:flex-col-reverse md:overflow-y-auto md:space-y-6 md:gap-0 md:scrollbar-hide sm:flex-col-reverse sm:overflow-y-auto sm:space-y-6 sm:gap-0 sm:scrollbar-hide sm:scroll-align-top">
          {/* Left Section */}
          <div className="flex-[7.5] w-full xl:h-full lg:h-full  2xl:h-full scrollbar-hide">
            {/* <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5] sm:min-w-[200px] sm:relative">
              <InterviewHeader
                userId={userId}
                goals={goalData}
                selectedGoalName={selectedGoal?.name || ""}
                onGoalChange={handleGoalChange}
                selectedGoalExperienceLevel={selectedGoalExperienceLevel}
              />
            </div> */}
            <div className="mt-1 sm:min-w-[100%] space-y-4 overflow-y-auto sm:mt-1">
              <InterviewList goalId={selectedGoalId} />
            </div>
          </div>
          {/* Right Section */}
          <div className="flex-[2.5] w-full space-y-4 sm:my-0">
            <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
              <InterviewInvitationsList invites={invitesData?.data} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewContainer;
