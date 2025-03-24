import React from 'react';
import { Button } from "@/components/ui/button";
import { ActionButtonsProps } from './types';
import { capitalizeString, getStatusColor } from './utils';
import check from "@/assets/interview/check.png";
import decline from "@/assets/interview/close.png";

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
          className="bg-[#aa040f1a] hover:bg-[#aa040f33] text-button text-red-700 py-2 px-4 rounded-md transition-colors"
          onClick={(e) => onDecline(invite._id, e)}
          disabled={isBeingProcessed}
        >
          <div className="flex items-center gap-2">
            {isBeingProcessed ? (
              'Processing...'
            ) : (
              <>
                <img src={decline} alt="Decline" className="w-5 h-5" />
                Decline
              </>
            )}
          </div>
        </Button>
        <Button
          className="bg-[#03963F1A] hover:bg-[#03963F33] text-white py-2 px-4 rounded-md transition-colors"
          onClick={(e) => onAccept(invite._id, e)}
          disabled={isBeingProcessed}
        >
          <div className="flex items-center gap-2 text-[#03963F]">
            {isBeingProcessed ? (
              'Processing...'
            ) : (
              <>
                <img src={check} alt="Accept" className="w-5 h-5" />
                Accept
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