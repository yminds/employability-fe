import React, { useEffect, useState } from 'react';
import { InviteItemProps } from './types';
import { ActionButtons } from './ActionButtons';
import { capitalizeString, formatDate, getDaysRemaining, getItemClassName, getStatusColor } from './utils';
import interviewType from "@/assets/interview/video_camera_front.svg";
import duratuionIcon from "@/assets/interview/pace.svg";
import dueDate from "@/assets/interview/event.svg";
import checkList from "@/assets/interview/checklist.svg";

export const InvitationListItem: React.FC<InviteItemProps> = ({
  invite,
  isProcessing,
  isSelected,
  onInviteClick,
  onAccept,
  onDecline,
  showSidebar
}) => {
  console.log("InvitationListItem invite:", invite);

  // When clicking the item, add the fundamentals data to the invite
  const handleItemClick = () => {
    if (isProcessing) return;
    onInviteClick(invite);
  };

  return (
    <div
      className={`${getItemClassName(isProcessing, isSelected)} group p-6 pb-7 `}
      onClick={handleItemClick}
      style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
    >
      {/* Hover overlay for accepted status */}
      {invite.status?.toLowerCase() === 'accepted' && !showSidebar && (
        <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-50">
          <ActionButtons
            invite={invite}
            isProcessing={isProcessing}
            onAccept={onAccept}
            onDecline={onDecline}
            onInviteClick={onInviteClick}
          />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
        {/* Left side - Company info and details */}
        <div className="flex flex-col space-y-4 md:w-2/3 ">
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
              {invite.status?.toLowerCase() === 'pending' && (
                <ActionButtons
                  invite={invite}
                  isProcessing={isProcessing}
                  onAccept={onAccept}
                  onDecline={onDecline}
                  onInviteClick={onInviteClick}
                />
              )}
            </div>
          </div>

          <div className=' h-[1px] w-full bg-[#0000001A] '></div>

          <div className="flex justify-between items-center gap-[42px] px-[6px]">
            <div>
              <div className=' flex items-center gap-3'><span><img src={interviewType} alt="" /></span> Type</div><p>{invite.task?.interview_type} Interview</p>
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
            <div>
              <div className=' flex items-center gap-3'><span><img src={checkList} alt="" /></span>Completed Tasks</div><p>0 out of 7</p>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};