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
import arrowDown from "@/assets/interview/arrow_drop_down.png";
import { useGetUserSkillsMutation } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Skill } from "@/components/skills/skillslist"
import checked from "@/assets/interview/priority.png";
import shortListed from "@/assets/interview/shortListed.png"
import rejected from "@/assets/interview/rejected.png"
import { useNavigate } from 'react-router-dom';
import { InterviewDateModal } from '@/components/employer/InterviewDateModal';
import { detectMobileDevice } from '@/utils/deviceDetection';
import { useGetCountriesQuery, useGetStatesQuery } from '@/api/locationApiSlice';

import {
  useCheckInviteStatusQuery,
  useRespondToInviteMutation,
  useCheckUserExistsMutation,
  useSendInvitationResponseMailMutation,
} from "@/api/InterviewInvitation";

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
  const navigate = useNavigate();
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const userGoal = useSelector((state: RootState) => state?.auth.user?.goals[0]._id);
  const user_id = useSelector((state: RootState) => state?.auth.user?._id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const [userSkills, setUserSkills] = useState<Skill[] | undefined>()
  console.log("userSkills", userSkills)

  useEffect(() => {
    setInviteData(invite);
  }, [invite]);
  
  const [getUserSkills] = useGetUserSkillsMutation();
  const [updateInviteStatus, { isLoading }] = useUpdateInviteStatusMutation();
  const isDisabled = !isTaskCompleted;
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: states = [] } = useGetStatesQuery(inviteData.job?.location?.country || "", {
    skip: !inviteData.job?.location?.country,
  });

  // const country = inviteData.job?.location?.country
  //   ? countries.find((c) => c.isoCode === inviteData.job?.location?.country)
  //   : "";

  const state =
    inviteData.job?.location?.state && inviteData.job?.location?.country
      ? states.find((s) => s.isoCode === inviteData.job?.location?.state)
      : null;


  // For both "normal" view and "details" view, this local state will update
  // so we see the new inviteData.status right away without refreshing.
  const handleAccept = () => {
    try {
      // onAccept(inviteData._id);
      // // 2) After successful call, update local state
      setInviteData(prev => ({
        ...prev,
        status: 'accepted'
      }));

      // Open the InterviewDateModal after accepting
      setDeadlineDate(inviteData.application_deadline ? new Date(inviteData.application_deadline) : null);
      setIsModalOpen(true);
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
  const handleAvailableOpportunities = () => {
    navigate("/jobs")
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [
    respondToInvite,
    { data: responseData, error: responseError, isLoading: responseLoading },
  ] = useRespondToInviteMutation();

  console.log({ data: responseData, error: responseError, isLoading: responseLoading })

  const {
    data: inviteStatusData,
  } = useCheckInviteStatusQuery(inviteData._id || "", {
    skip: !inviteData._id,
  });

  const [sendInvitationResponseMail] = useSendInvitationResponseMailMutation();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.classList.contains("no-detail-trigger")) {
      return;
    }
    handleItemClick();
  };


  const handleConfirmAccept = async (date: Date) => {
    if (!date) {
      setErrorMessage("Please select a submission date before continuing");
      return;
    }
    console.log("Date in handleConfirmAccept", date)
    console.log("inviteData in handleConfirmAccept", inviteData)

    try {
      const response = await respondToInvite({
        inviteId: inviteData._id,
        action: "accept",
        submission_expected_date: date.toISOString(),
      }).unwrap();

      if (response.success && inviteStatusData?.data?.candidateInfo) {
        try {
          await sendInvitationResponseMail({
            inviteId: inviteData._id,
            candidateEmail: inviteStatusData.data.candidateInfo.email,
            candidateName: inviteStatusData.data.candidateInfo.name,
            jobTitle: inviteData.job?.title || '',
            companyName: typeof inviteData.company === "object"
              ? inviteData.company?.name
              : "",
            status: "accepted",
            submissionDate: date.toISOString(),
            isUserExist: false
          });
        } catch (error) {
          console.error("Error sending invitation response mail:", error);
          setErrorMessage("Failed to send email. Please try again.");
        }
      }

      setInviteData(prev => ({
        ...prev,
        status: 'accepted',
        submission_expected_date: date.toISOString(),
      }));

      setProcessingComplete(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setErrorMessage("Failed to accept the invitation. Please try again.");
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (userGoal && user_id) {
      fetchSkills(user_id, userGoal)
    }
  }, [userGoal, user_id])

  useEffect(() => {
    setIsMobileDevice(detectMobileDevice());
  }, []);

  return (
    <div className={`${getItemClassName(isProcessing, isSelected, isDetailsView)}`} onClick={handleCardClick}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col space-y-5 md:w-2/3">

          {/* Top row: Company / Job details + Action Buttons (Accept/Decline or Submit Interview / View details) */}
          <div className="flex items-center justify-between cursor-pointer" >
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
                  {capitalizeString(inviteData.company?.name)} | {inviteData.job?.location?.city}, {typeof state === 'string' ? state : state?.name || ''} |{" "}
                  {capitalizeString(inviteData.job?.work_place_type)}
                </p>
              </div>
            </div>

            <div>
              {/* If the invite is 'pending', show Accept/Decline buttons */}
              {isPending ? (
                <ActionButtons
                  invite={inviteData}
                  isProcessing={isProcessing}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onInviteClick={onInviteClick}
                />
              ) : (
                // For non-pending invites:
                isDetailsView ? (
                  // In detailed view, if the status is completed, just show "View details"
                  !isCompleted && (
                    // If not completed, show the submission action area
                    <div className="flex flex-col gap-1">
                      <div className="text-[#202326] font-dm-sans text-[12px] normal-case font-normal leading-[16px] tracking-[0.18px]">
                        Submit after completing all steps.
                      </div>
                      <div
                        className={`flex items-center w-full text-button text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-button hover:bg-[#062549]"
                          }`}
                      >
                        <button
                          className={`px-4 py-2 w-full rounded-md ${isCompleted ? "bg-gray-300 cursor-not-allowed" : ""
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
                  )
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
            { /* If shortlisted */}
            <div className="flex items-center justify-between w-full">
              {inviteData.shortlist ? (
                <div className=' flex items-center justify-between w-[465px] gap-2'>
                  <div>
                    <img src={shortListed} alt="Shortlisted Icon" />
                  </div>
                  <div className="flex-col items-center justify-center h-[56px] space-y-2">
                    <div className="text-grey-6 font-dm-sans text-base font-medium leading-5">
                      Congratulations! You’ve been shortlisted for this role.
                    </div>
                    <div className="text-[14px] text-grey-5 font-dm-sans text-base font-nor leading-5">
                      You’ll hear from the employer soon...
                    </div>
                  </div>
                </div>
              ) : (inviteData.rejected) ? (
                <div className=' flex items-center justify-between gap-2'>
                  <div>
                    <img src={rejected} alt="Shortlisted Icon" />
                  </div>
                  <div className="flex-col items-center justify-center h-[56px] space-y-2">
                    <div className="text-grey-6 font-dm-sans text-base font-medium leading-5">
                      Unfortunately, you have not been selected for this role.
                    </div>
                    <div className="text-[14px] text-grey-5 font-dm-sans text-base font-nor leading-5">
                      You can apply for other roles or check out <span className="text-grey-8 font-dm-sans text-sm normal-case font-normal leading-[22px] underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAvailableOpportunities(); // or any other logic
                        }}
                      >Available opportunities.</span>
                    </div>
                  </div>
                </div>
              ) : (isCompleted) ? (
                <div className="flex-col items-center justify-center h-[56px] space-y-2">
                  <div className="text-sub-header text-grey-6 font-dm-sans font-medium leading-[24px] tracking-[0.18px] flex items-center gap-2">
                    <span><img src={checked} alt="Checked Icon" /></span>
                    Submitted Successfully
                  </div>
                  <div className="text-body2 text-grey-5 font-dm-sans font-normal leading-[22px]">
                    Interview submitted on
                    <span className='  text-grey-7'> {inviteData.submission_date ? formatDate(inviteData.submission_date) : formatDate(inviteData.updatedAt)}</span>. Employer will review it shortly
                  </div>
                </div>
              ) : (
                // Always show in detail view OR in normal view if not completed
                <div className="flex justify-between gap-[42px]">
                  <div className=' flex-col items-center justify-center h-[56px] space-y-2'>
                    <div className="flex items-center gap-[6px] ">
                      <span>
                        <img src={statusIcon} alt="Status Icon" className=' ' />
                      </span>
                      <span className='text-[#414447] font-dm-sans text-[12px] font-normal leading-4 tracking-[0.18px]'>Status</span>
                    </div>
                    <div>
                      <p className='font-dm-sans text-[14px] font-semibold leading-[21px] tracking-[0.21px] text-[#414447]'>
                        {isPending
                          ? "Not Accepted"
                          : isTaskCompleted
                            ? "Completed"
                            : "Not Submitted"}
                      </p>
                    </div>
                  </div>
                  <div className=' flex-col items-center justify-center h-[56px] space-y-2'>
                    <div className="flex items-center gap-3">
                      <span>
                        <img src={duratuionIcon} alt="Duration Icon" />
                      </span>
                      <span className='text-[#414447] font-dm-sans text-[12px] font-normal leading-4 tracking-[0.18px]'>Duration</span>
                    </div>
                    <p className='font-dm-sans text-[14px] font-semibold leading-[21px] tracking-[0.21px] text-[#414447]'>Est. {formattedDuration}</p>
                  </div>
                  <div className=' flex-col items-center justify-center h-[56px] space-y-2'>
                    <div className="flex items-center gap-3">
                      <span>
                        <img src={dueDate} alt="Due Date Icon" />
                      </span>
                      <span className='text-[#414447] font-dm-sans text-[12px] font-normal leading-4 tracking-[0.18px]'>Due Date</span>
                    </div>
                    <p className='font-dm-sans text-[14px] font-semibold leading-[21px] tracking-[0.21px] text-[#414447]'>
                      {formatDate(inviteData.application_deadline)} |{" "}
                      {getDaysRemaining(inviteData.application_deadline) > 0 && (
                        <span
                          className={`font-dm-sans text-[14px] font-semibold leading-[21px] tracking-[0.21px] text-[#414447] ${getDaysRemaining(inviteData.application_deadline) <= 1
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
                        className="underline no-detail-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompletedDropdown(); // or any other logic
                        }}
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
                      className={`flex items-center w-full text-buton text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-button hover:bg-[#062549]'
                        }`}
                    >
                      <button
                        className={`px-4 py-2 rounded-md ${isCompleted ? 'bg-gray-300 cursor-not-allowed' : ''
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmitInterview(); // or any other logic
                        }}
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
              <div className="mt-2 space-y-4">
                {/* Show submitted status block if invite is shortlisted */}
                {inviteData.shortlist && isCompleted && (
                  <div className="flex-col items-center justify-center h-[56px] space-y-2">
                    <div className="text-sub-header text-grey-6 font-dm-sans font-medium leading-[24px] tracking-[0.18px] flex items-center gap-2">
                      <span><img src={checked} alt="Checked Icon" /></span>
                      Submitted Successfully
                    </div>
                    <div className="text-body2 text-grey-5 font-dm-sans font-normal leading-[22px]">
                      Interview submitted on
                      <span className="text-grey-7"> {inviteData.submission_date ? formatDate(inviteData.submission_date) : formatDate(inviteData.updatedAt)}</span>. Employer will review it shortly
                    </div>
                  </div>
                )}

                <TaskTable
                  task={inviteData.task}
                  jobDescription={inviteData.job}
                  companyDetails={inviteData.company}
                  inviteId={inviteData._id}
                  user_id={user_id}
                  userGoal={userGoal}
                  isScreeningCompleted={inviteData.screeningResponse ? true : false}
                  candidateResponse={inviteData.screeningResponse}
                />
              </div>
            )}

            <div className="relative">
              <InterviewDateModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={(date: Date) => {
                  setSelectedDate(date);
                  handleConfirmAccept(date);
                }}
                deadlineDate={deadlineDate}
                isMobileDevice={isMobileDevice}
              />
            </div>

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
                    companyDetails={inviteData.company}
                    inviteId={inviteData._id}
                    user_id={user_id}
                    userGoal={userGoal}
                    isScreeningCompleted={inviteData.screeningResponse ? true : false}
                    candidateResponse={inviteData.screeningResponse}
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
                      companyDetails={inviteData.company}
                      inviteId={inviteData._id}
                      user_id={user_id}
                      userGoal={userGoal}
                      isScreeningCompleted={inviteData.screeningResponse ? true : false}
                      candidateResponse={inviteData.screeningResponse}
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
