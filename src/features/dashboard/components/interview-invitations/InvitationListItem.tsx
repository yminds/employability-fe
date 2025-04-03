import React, { useEffect, useState } from 'react';
import { InviteItemProps } from './interviewInvitesTypes';
import { ActionButtons } from './ActionButtons';
import {
  capitalizeString,
  formatDate,
  getDaysRemaining,
  getItemClassName,
  formatDuration
} from './utils';
import duratuionIcon from "@/assets/interview/pace.svg";
import dueDate from "@/assets/interview/event.svg";
import statusIcon from "@/assets/interview/status.png";
import TaskTable from './interviewTaskTable';
import { useUpdateInviteStatusMutation } from '@/api/InterviewInvitation';
import partyPopper from "@/assets/interview/party_popper.png";
import arrowDown from "@/assets/interview/arrow_drop_down.png";
import { useGetUserSkillsMutation } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Skill } from "@/components/skills/skillslist"

export const InvitationListItem: React.FC<InviteItemProps> = ({
  invite,
  isProcessing,
  isSelected,
  onInviteClick,
  onAccept,
  onDecline,
  isTaskCompleted,
  isDetailsView
}) => {
  // 1) Keep a local copy of `invite` in component state
  const [inviteData, setInviteData] = useState(invite);
  console.log("invite", invite)
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const userGoal = useSelector((state: RootState) => state.auth.user?.goals[0]._id);
  const user_id = useSelector((state: RootState) => state.auth.user?._id);

  const [userSkills, setUserSkills] = useState<Skill[] | undefined>()
  console.log("userSkills", userSkills)

  const [getUserSkills] = useGetUserSkillsMutation();
  const [updateInviteStatus, { isLoading }] = useUpdateInviteStatusMutation();
  const isDisabled = !isTaskCompleted;

  // For both "normal" view and "details" view, this local state will update
  // so we see the new inviteData.status right away without refreshing.
  const handleAccept = () => {
    try {
      onAccept(inviteData._id);
      // 2) After successful call, update local state
      setInviteData(prev => ({
        ...prev,
        status: 'accepted'
      }));
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleDecline = () => {
    try {
      onDecline(inviteData._id);
      setInviteData(prev => ({
        ...prev,
        status: 'declined'
      }));
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  const handleItemClick = () => {
    if (isProcessing) return;
    onInviteClick(inviteData);
  };

  const totalEstimatedTime =
    (inviteData.task?.interview_type?.estimated_time || 0) +
    (inviteData.task?.skills?.reduce(
      (acc, skill) => acc + (skill.estimated_time || 0),
      0
    ) || 0);

  const formattedDuration = formatDuration(totalEstimatedTime);

  // 3) Also update local state after “Submit Interview”
  const handleSubmitInterview = async () => {
    try {
      await updateInviteStatus({
        inviteId: inviteData._id,
        status: 'completed'
      }).unwrap();

      setInviteData({
        ...inviteData,
        status: 'completed'
      });
    } catch (error) {
      console.error('Error submitting interview:', error);
    }
  };

  const handleCompletedDropdown = () => {
    setShowCompletedDropdown(!showCompletedDropdown);
  };

  const { status = '' } = inviteData;
  const lowerStatus = status.toLowerCase();
  const isCompleted = lowerStatus === 'completed' && isTaskCompleted;
  const isPending = lowerStatus === 'pending';

  const fetchSkills = async (
    userId: string | undefined,
    goalId: string | null
  ) => {
    try {
      const response = await getUserSkills({ userId, goalId }).unwrap();
      const allSkills = response.data.all || [];
      setUserSkills(allSkills);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (userGoal && user_id) {
      fetchSkills(user_id, userGoal)
    }
  }, [userGoal, user_id])

  return (
    <div className={`${getItemClassName(isProcessing, isSelected, isDetailsView)}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col space-y-5 md:w-2/3">

          {/* 
            1) In DETAILED VIEW, if 'completed' => show "Thank you" block at the top,
               before the company/job details
          */}
          {isDetailsView && isCompleted && (
            <div className="flex items-center gap-4 bg-[#F0F3F7] rounded-lg p-3">
              <div>
                <img src={partyPopper} alt="Party Popper" />
              </div>
              <div>
                <div className="text-sub-header text-grey-6 font-dm-sans font-medium leading-[24px] tracking-[0.18px]">
                  Thank you for submitting your interview!
                </div>
                <div className="text-body2 text-grey-5 font-dm-sans font-normal leading-[20px] tracking-[0.18px]">
                  Awaiting employer review...
                </div>
              </div>
            </div>
          )}

          {/* Top row: Company / Job details + Action Buttons (Accept/Decline or Submit Interview / View details) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                {capitalizeString(inviteData.company?.name?.charAt(0)) || "C"}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-sub-header text-grey-6">
                    {inviteData.job?.title}
                  </div>
                  <span className="text-gray-600 font-dm-sans text-sm font-medium leading-5 tracking-tight px-3 bg-[#D6D7D980] rounded-full">
                    {capitalizeString(inviteData.job?.experience_level)}
                  </span>
                </div>
                <p className="text-body2 text-grey-5">
                  {capitalizeString(inviteData.company?.name)} | {inviteData.job?.location} |{" "}
                  {capitalizeString(inviteData.job?.work_place_type)}
                </p>
              </div>
            </div>

            <div>
              {/* If the invite is 'pending', show Accept/Decline or "View details" 
                  Otherwise, show the appropriate button in detail vs normal view
              */}
              {isPending ? (
                <ActionButtons
                  invite={inviteData}
                  isProcessing={isProcessing}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onInviteClick={onInviteClick}
                />
              ) : (
                isDetailsView ? (
                  <div className="flex flex-col gap-1">
                    <div className="text-[#202326] font-dm-sans text-[12px] normal-case font-normal leading-[16px] tracking-[0.18px]">
                      Submit after completing all steps.
                    </div>
                    <div
                      className={`flex items-center w-full text-buton text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${
                        isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-button hover:bg-[#062549]'
                      }`}
                    >
                      <button
                        className={`px-4 py-2 w-full rounded-md ${
                          isCompleted ? 'bg-gray-300 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSubmitInterview}
                        disabled={isCompleted || isDisabled || isLoading}
                      >
                        {isLoading
                          ? "Submitting..."
                          : isCompleted
                            ? "Interview Submitted"
                            : "Submit Interview"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="flex items-center p-2 underline" onClick={handleItemClick}>
                    View details
                  </button>
                )
              )}
            </div>
          </div>

          {/* Horizontal line (only in normal view) */}
          <div className={`${!isDetailsView ? 'h-[1px] w-full bg-[#0000001A] my-4' : ''}`}></div>

          {/* 
            This block shows either:
              - In normal view: "thank you" if completed OR else "status/duration/due date"
              - In detail view: always show "status/duration/due date" (since we placed "thank you" at top if completed)
          */}
          <div className="flex-col justify-between items-center px-[6px] w-full">
            <div className="flex items-center justify-between w-full">
              {(!isDetailsView && isCompleted) ? (
                // Normal view replacement: "Thank you" instead of status/duration/due date
                <div className="flex items-center gap-4">
                  <div>
                    <img src={partyPopper} alt="Party Popper" />
                  </div>
                  <div>
                    <div className="text-sub-header text-grey-6 font-dm-sans font-medium leading-[24px] tracking-[0.18px]">
                      Thank you for submitting your interview!
                    </div>
                    <div className="text-body2 text-grey-5 font-dm-sans font-normal leading-[20px] tracking-[0.18px]">
                      Awaiting employer review...
                    </div>
                  </div>
                </div>
              ) : (
                // Always show in detail view OR in normal view if not completed
                <div className="flex justify-between gap-[42px]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span>
                        <img src={statusIcon} alt="Status Icon" />
                      </span>
                      Status
                    </div>
                    <p>
                      {isPending
                        ? "Not Accepted"
                        : isTaskCompleted
                          ? "Completed"
                          : "Not Submitted"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span>
                        <img src={duratuionIcon} alt="Duration Icon" />
                      </span>
                      Duration
                    </div>
                    <p>Est. {formattedDuration}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span>
                        <img src={dueDate} alt="Due Date Icon" />
                      </span>
                      Due Date
                    </div>
                    <p>
                      {formatDate(inviteData.application_deadline)} |{" "}
                      {getDaysRemaining(inviteData.application_deadline) > 0 && (
                        <span
                          className={`text-body2 font-medium ${
                            getDaysRemaining(inviteData.application_deadline) <= 1
                              ? 'text-[#FF3B30]'
                              : 'text-grey-6'
                          }`}
                        >
                          {getDaysRemaining(inviteData.application_deadline)} days left
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Right side button or dropdown (normal view) */}
              <div>
                {isPending ? (
                  isDetailsView ? (
                    <button
                      className="hidden items-center p-2 underline"
                      onClick={() => onInviteClick(inviteData)}
                    >
                      View details
                    </button>
                  ) : (
                    <button className="flex items-center p-2 underline" onClick={handleItemClick}>
                      View details
                    </button>
                  )
                ) : !isDetailsView ? (
                  // normal view & not pending
                  isCompleted ? (
                    <div>
                      <button
                        className="underline"
                        onClick={handleCompletedDropdown}
                      >
                        {showCompletedDropdown ? (
                          <img src={arrowDown} alt="" className="rotate-180" />
                        ) : (
                          <img src={arrowDown} alt="" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center w-full text-buton text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${
                        isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-button hover:bg-[#062549]'
                      }`}
                    >
                      <button
                        className={`px-4 py-2 rounded-md ${
                          isCompleted ? 'bg-gray-300 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSubmitInterview}
                        disabled={isCompleted || isDisabled || isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit Interview"}
                      </button>
                    </div>
                  )
                ) : (
                  // detailed view
                  (lowerStatus === "accepted" || lowerStatus === "completed") && (
                    <span className="text-body2 font-medium text-grey-6 hidden">
                      View details
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Show the tasks dropdown in normal view if completed */}
            {showCompletedDropdown && (
              <div className="mt-2">
                <TaskTable
                  task={inviteData.task}
                  jobDescription={inviteData.job}
                  inviteId={inviteData._id}
                  user_id={user_id}
                  userGoal={userGoal}
                />
              </div>
            )}
          </div>

          {/* 
            -----------
            TASK TABLE
            -----------
            
            1) Always show for isDetailsView
            2) Keep the original logic for normal view 
          */}

          {isDetailsView ? (
            // Always show the table in the detailed view
            <>
              <div className="h-[1px] w-full bg-[#0000001A] my-4" />
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-body2 font-medium text-grey-6">
                    Complete these steps to submit
                  </p>
                </div>
                <div>
                  <TaskTable
                    task={inviteData.task}
                    jobDescription={inviteData.job}
                    inviteId={inviteData._id}
                    user_id={user_id}
                    userGoal={userGoal}
                  />
                </div>
              </div>
            </>
          ) : (
            // NORMAL VIEW: KEEP EXISTING CONDITIONAL RENDER
            inviteData.status?.toLowerCase() !== 'pending' &&
            inviteData.task !== undefined &&
            !(
              inviteData.status?.toLowerCase() === 'completed' &&
              isTaskCompleted &&
              !isDetailsView
            ) && (
              <>
                <div className="h-[1px] w-full bg-[#0000001A] my-4"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-body2 font-medium text-grey-6">
                      Complete these steps to submit
                    </p>
                  </div>
                  <div>
                    <TaskTable
                      task={inviteData.task}
                      jobDescription={inviteData.job}
                      inviteId={inviteData._id}
                      user_id={user_id}
                      userGoal={userGoal}
                    />
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationListItem;
