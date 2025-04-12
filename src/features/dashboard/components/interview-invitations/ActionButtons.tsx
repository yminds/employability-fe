import React from 'react';
import { Button } from "@/components/ui/button";
import { ActionButtonsProps } from './interviewInvitesTypes';
import { getStatusColor } from './utils';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  invite,
  isProcessing,
  onAccept,
  onDecline,
  onInviteClick,
}) => {
  const status = invite.status?.toLowerCase();
  const isBeingProcessed = isProcessing;

  if (status === 'pending') {
    return (
      <div className="flex gap-2">
        <Button
          className="bg-white hover:bg-[#0000001A] font-dm-sans text-sm font-medium leading-5 tracking-[0.21px] border border-button "
          onClick={(e) => {
            e.stopPropagation();
            onDecline(invite._id); 
          }}
          disabled={isBeingProcessed}
        >
          <div className="flex items-center gap-2 px-5 py-3">
            {isBeingProcessed ? (
              'Processing...'
            ) : (
              <>
                <X/>
                Decline
              </>
            )}
          </div>
        </Button>
        <Button
          className="bg-button hover:bg-[#062549] text-white py-2 px-4 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAccept(invite._id); 
          }}
          disabled={isBeingProcessed}
        >
          <div className="flex items-center gap-2 text-white font-dm-sans text-sm font-medium leading-5 tracking-[0.21px] px-5 py-3">
            {isBeingProcessed ? (
              'Processing...'
            ) : (
              <>
                <Check/>
                Accept Invite
              </>
            )}
          </div>
        </Button>
      </div>
    );
  } else if (status === 'accepted') {
    return (
      <Button
        className="bg-transparent hover:bg-transparent text-button py-2 px-6 rounded-md transition-all w-full max-w-[200px] mx-auto underline"
        onClick={(e) => {
          e.stopPropagation();
          onInviteClick(invite);
        }}
      >
        View Details
      </Button>
    );
  } else if (status === 'expired') {
    return (
      <span className={`text-body2 font-medium px-3 py-1 rounded-full ${getStatusColor('expired')}`}>
        Expired
      </span>
    );
  }

  // No buttons for declined status
  return null;
}; 