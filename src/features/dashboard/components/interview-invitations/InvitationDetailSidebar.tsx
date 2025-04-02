import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DetailSidebarProps } from './interviewInvitesTypes';
import { motion } from 'framer-motion';
import {
  InvitationListItem,
} from './InvitationListItem';

export const InvitationDetailSidebar: React.FC<DetailSidebarProps> = ({
  selectedInvite,
  showSidebar,
  processingIds,
  onClose,
  handleAccept,
  handleDecline,
  isTaskCompleted
}) => {
  if (!selectedInvite) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[50vw] bg-white shadow-xl transform transition-transform duration-300 z-50 m-5 rounded-2xl ${showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      <motion.div
        className="h-full flex flex-col relative "
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.2 }}
      >
        {/* Processing overlay - shown when the selected invite is being processed */}
        {processingIds.includes(selectedInvite._id) && (
          <div className="absolute inset-0 bg-white bg-opacity-60 z-10 flex items-center justify-center">
            <div className="p-6 rounded-lg bg-white shadow-lg text-center">
              <div className="text-3xl animate-spin mb-4">⟳</div>
              <p className="text-grey-7 font-medium">Processing your response...</p>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-[#D9D9D9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-h2 font-dm-sans font-medium  text-grey-8">Interview Invitation</h2>
            </div>
            <Button
              variant="ghost"
              className="p-2 rounded-full"
              onClick={onClose}
            >
              <X className=' text-grey-6 min-h-6 min-w-6'/>
            </Button>
          </div>
        </div>

        <div
          className={` p-7 overflow-y-auto minimal-scrollbar m-1 `}
        >


          <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
            {/* Left side - Company info and details */}
            <div className="flex flex-col md:w-2/3 ">
              <InvitationListItem
                invite={selectedInvite}
                isProcessing={processingIds.includes(selectedInvite._id)}
                onInviteClick={() => { }}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isSelected={false} 
                showSidebar={true}
                isTaskCompleted={isTaskCompleted}
                isDetailsView={true}
              />

              <div className=' h-[1px] bg-grey-2 w-full mt-10'></div>

              <div>
                {selectedInvite.job?.description && (
                  <div className="mt-10">
                    <h3 className="text-sub-header text-grey-6 font-dm-sans">Job Description</h3>
                    <p className="text-body2 text-grey-5">{selectedInvite.job?.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
