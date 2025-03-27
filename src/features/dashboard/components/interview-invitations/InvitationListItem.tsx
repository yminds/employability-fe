import React from 'react';
import { InviteItemProps } from './interviewInvitesTypes';
import { ActionButtons } from './ActionButtons';
import { capitalizeString, formatDate, getDaysRemaining, getItemClassName } from './utils';
import duratuionIcon from "@/assets/interview/pace.svg";
import dueDate from "@/assets/interview/event.svg";
import statusIcon from "@/assets/interview/status.png";
import TaskTable from './interviewTaskTable';

export const InvitationListItem: React.FC<InviteItemProps> = ({
  invite,
  isProcessing,
  isSelected,
  onInviteClick,
  onAccept,
  onDecline,
  showSidebar,
  isTaskCompleted
}) => {
  console.log("InvitationListItem invite:", invite);
  const isDisabled = true
  // When clicking the item, add the fundamentals data to the invite
  const handleItemClick = () => {
    if (isProcessing) return;
    onInviteClick(invite);
  };

  return (
    <div
      className={`${getItemClassName(isProcessing, isSelected)} p-6 pb-7 `}
    >


      <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
        {/* Left side - Company info and details */}
        <div className="flex flex-col space-y-5 md:w-2/3 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                {capitalizeString(invite.company?.name?.charAt(0)) || "C"}
              </div>
              <div>
                <div className=' flex items-center gap-3'><div className="text-sub-header text-grey-6">{invite.job?.title}</div> <span className='text-gray-600 font-dm-sans text-sm font-medium leading-5 tracking-tight px-3 bg-[#D6D7D980] rounded-full'>{capitalizeString(invite.job?.experience_level)}</span></div>
                <p className="text-body2 text-grey-5">{capitalizeString(invite.company?.name)} | {invite.job?.location} | {capitalizeString(invite.job?.work_place_type)}</p>
              </div>
            </div>
            {/* Right side - Action buttons based on status for pending only */}
            <div className="mt-4 md:mt-0 md:w-1/3 md:flex md:justify-end md:items-center">
              {invite.status?.toLowerCase() === 'pending' ? (
                <ActionButtons
                  invite={invite}
                  isProcessing={isProcessing}
                  onAccept={onAccept}
                  onDecline={onDecline}
                  onInviteClick={onInviteClick}
                />
              ) : (
                <button className='flex items-center p-2 underline' onClick={() => {
                  handleItemClick();
                }}>View details
                </button>
              )}
            </div>
          </div>

          <div className=' h-[1px] w-full bg-[#0000001A] '></div>

          <div className="flex justify-between items-center px-[6px] w-full">
            <div className=' flex justify-between gap-[42px]'>
              <div>
                <div className=' flex items-center gap-3'><span><img src={statusIcon} alt="" /></span>Status</div><p>{invite.status.toLowerCase() === "pending" ? "Not Accepted" : isTaskCompleted ? "Completed" : "Not Submitted"}</p>
              </div>
              <div>
                <div className=' flex items-center gap-3'><span><img src={duratuionIcon} alt="" /></span>Duration</div><p>Est. About 30 minutes</p>
              </div>
              <div>
                <div className=' flex items-center gap-3'><span><img src={dueDate} alt="" /></span>Due Date</div><p>{formatDate(invite.application_deadline)} | {getDaysRemaining(invite.application_deadline) > 0 && (
                  <span className={`text-body2 font-medium ${getDaysRemaining(invite.application_deadline) <= 2
                    ? 'text-[#FF3B30]'
                    : getDaysRemaining(invite.application_deadline) <= 5
                      ? 'text-[#FF9500]'
                      : 'text-grey-6'
                    }`}>
                    {getDaysRemaining(invite.application_deadline)} days left
                  </span>
                )}</p>
              </div>
            </div>
            <div>
              {invite.status?.toLowerCase() === 'pending' ? (
                <button className='flex items-center p-2 underline' onClick={() => {
                  onInviteClick(invite);
                }}>View details
                </button>
              ):(
                <div className={`flex items-center w-full text-buton text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-button hover:bg-[#062549]'}`}>
                  <button className=' px-4 py-2 '>
                  Submit Interview
                </button>
                </div>
              )}
            </div>
          </div>

          <div className=' h-[1px] w-full bg-[#0000001A]  my-4'></div>

          {/* Show the task details as a performance card similar to the one in the skills report page*/}
          {invite.status?.toLowerCase() !== 'pending' && invite.task !== undefined && (
            <div>
              <div className='flex items-center justify-between'>
                <p className='text-body2 font-medium text-grey-6'>Complete these steps to submit</p>
              </div>
              <div>
              <TaskTable  task={invite.task}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};