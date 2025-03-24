import React, { useEffect, useState } from 'react';
import { InviteItemProps } from './types';
import { ActionButtons } from './ActionButtons';
import { capitalizeString, formatDate, getDaysRemaining, getItemClassName, getStatusColor } from './utils';

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
      className={`${getItemClassName(isProcessing, isSelected)} group`}
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
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left side - Company info and details */}
        <div className="flex flex-col space-y-4 md:w-2/3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                {invite.company?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h3 className="text-sub-header text-grey-8 line-clamp-1">{invite.job?.title}</h3>
                <p className="text-body2 text-grey-5">{invite.company?.name}</p>
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

          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex justify-between">
              <span className="text-body2 text-grey-5">Interview Type:</span>
              <span className="text-body2 font-medium">
                {capitalizeString(invite.task?.interview_type || "Technical")} Interview
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-body2 text-grey-5">Status:</span>
              <span className={`text-body2 font-medium px-2 py-0.5 rounded-full ${getStatusColor(invite.status)}`}>
                {capitalizeString(invite.status || "Pending")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-body2 text-grey-5">Due Date:</span>
              <span className="text-body2 font-medium">{formatDate(invite.application_deadline)}</span>
            </div>

            {getDaysRemaining(invite.application_deadline) > 0 && (
              <div className="flex justify-between">
                <span className="text-body2 text-grey-5">Time Left:</span>
                <span className={`text-body2 font-medium ${getDaysRemaining(invite.application_deadline) <= 2
                  ? 'text-[#FF3B30]'
                  : getDaysRemaining(invite.application_deadline) <= 5
                    ? 'text-[#FF9500]'
                    : 'text-primary-green'
                  }`}>
                  {getDaysRemaining(invite.application_deadline)} days
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};