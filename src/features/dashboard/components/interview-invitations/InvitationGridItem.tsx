import React, { useState } from 'react';
import { InviteItemProps } from './types';
import { ActionButtons } from './ActionButtons';
import { capitalizeString, formatDate, getDaysRemaining, getGridItemClassName, getStatusColor } from './utils';

export const InvitationGridItem: React.FC<InviteItemProps> = ({
  invite,
  isProcessing,
  isSelected,
  onInviteClick,
  onAccept,
  onDecline,
  showSidebar
}) => {
  const [fundamentalsCsv, setFundamentalsCsv] = useState<string | null>(null);
  const [isLoadingFundamentals, setIsLoadingFundamentals] = useState(false);


  
  // When clicking the item, add the fundamentals data to the invite
  const handleItemClick = () => {
    if (isProcessing) return;
    
    // Create a new invite object with the fundamentals data
    const inviteWithFundamentals = {
      ...invite,
      fundamentalsCsv: fundamentalsCsv
    };
    
    onInviteClick(inviteWithFundamentals);
  };

  return (
    <div
      className={`${getGridItemClassName(isProcessing, isSelected)} group`}
      onClick={handleItemClick}
      style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
    >
      {/* Hover overlay for accepted status */}
      {invite.status?.toLowerCase() === 'accepted' && !showSidebar && (
        <div className="absolute inset-0 bg-background-grey bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 rounded-lg">
          <ActionButtons
            invite={{...invite, fundamentalsCsv}}
            isProcessing={isProcessing || isLoadingFundamentals}
            onAccept={onAccept}
            onDecline={onDecline}
            onInviteClick={onInviteClick}
          />
        </div>
      )}
      
      <div>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
            {invite.company?.name?.charAt(0) || "C"}
          </div>
          <div>
            <h3 className="text-sub-header text-grey-8 line-clamp-1">{invite.job?.title}</h3>
            <p className="text-body2 text-grey-5">{invite.company?.name}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-body2 text-grey-5">Interview Type:</span>
            <span className="text-body2 font-medium">
              {capitalizeString(invite.task?.interview_type || "Technical")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body2 text-grey-5">Status:</span>
            <span className={`text-body2 font-medium px-2 py-0.5 rounded-full ${getStatusColor(invite.status)}`}>
              {capitalizeString(invite.status || "Pending")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body2 text-grey-5">Due:</span>
            <span className="text-body2 font-medium">{formatDate(invite.application_deadline)}</span>
          </div>

          {getDaysRemaining(invite.application_deadline) > 0 && (
            <div className="flex items-center justify-between">
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

      {/* Only show this section for pending/expired status */}
      {(invite.status?.toLowerCase() === 'pending' || invite.status?.toLowerCase() === 'expired') && (
        <div className="pt-3 border-t border-grey-1">
          <div className="flex justify-end">
            <ActionButtons
              invite={{...invite, fundamentalsCsv}}
              isProcessing={isProcessing}
              onAccept={onAccept}
              onDecline={onDecline}
              onInviteClick={onInviteClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 