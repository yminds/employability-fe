import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DetailSidebarProps } from './interviewInvitesTypes';
import { capitalizeString, formatDate, getDaysRemaining } from './utils';
import duratuionIcon from "@/assets/interview/pace.svg";
import dueDate from "@/assets/interview/event.svg";
import statusIcon from "@/assets/interview/status.png";
import { ActionButtons } from './ActionButtons';
import TaskTable from './interviewTaskTable';
import { motion } from 'framer-motion';

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
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          className={` p-7 overflow-y-auto minimal-scrollbar m-1 `}
        >


          <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
            {/* Left side - Company info and details */}
            <div className="flex flex-col md:w-2/3 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                    {capitalizeString(selectedInvite.company?.name?.charAt(0)) || "C"}
                  </div>
                  <div>
                    <div className=' flex items-center gap-3'><div className="text-sub-header text-grey-6">{selectedInvite.job?.title}</div> <span className='text-gray-600 font-dm-sans text-sm font-medium leading-5 tracking-tight px-3 bg-[#D6D7D980] rounded-full'>{capitalizeString(selectedInvite.job?.experience_level)}</span></div>
                    <p className="text-body2 text-grey-5">{capitalizeString(selectedInvite.company?.name)} | {selectedInvite.job?.location} | {capitalizeString(selectedInvite.job?.work_place_type)}</p>
                  </div>
                </div>
                {/* Right side - Action buttons based on status for pending only */}
                <div className="mt-4 md:mt-0 md:w-1/3 md:flex md:justify-end md:items-center">
                  {selectedInvite.status?.toLowerCase() === 'pending' ? (
                    <ActionButtons
                      invite={selectedInvite}
                      isProcessing={processingIds.includes(selectedInvite._id)}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onInviteClick={() => { }}
                    />
                  ) : (
                    <div className={`flex items-center w-full text-buton text-white font-dm-sans text-sm font-medium leading-5 tracking-wide rounded-md ${isTaskCompleted ? 'bg-button hover:bg-[#062549]' : 'bg-grey-3 cursor-not-allowed'}`}>
                      <button className=' px-4 py-2 '>
                        Submit Interview
                      </button>
                    </div>
                  )}
                </div>
              </div>



              <div className="flex justify-between mt-10 items-center gap-[42px] px-[6px] w-2/3">
                <div>
                  <div className=' flex items-center gap-3'><span><img src={statusIcon} alt="" /></span>Status</div><p>{selectedInvite.status.toLowerCase() === "pending" ? "Not Accepted" : selectedInvite.status !== "completed" ? "Not Submitted" : "Completed"}</p>
                </div>
                <div>
                  <div className=' flex items-center gap-3'><span><img src={duratuionIcon} alt="" /></span>Duration</div><p>Est. About 30 minutes</p>
                </div>
                <div>
                  <div className=' flex items-center gap-3'><span><img src={dueDate} alt="" /></span>Due Date</div><p>{formatDate(selectedInvite.application_deadline)} | {getDaysRemaining(selectedInvite.application_deadline) > 0 && (
                    <span className={`text-body2 font-medium ${getDaysRemaining(selectedInvite.application_deadline) <= 1
                      ? 'text-[#FF3B30]'
                        : 'text-grey-6'
                      }`}>
                      {getDaysRemaining(selectedInvite.application_deadline)} days left
                    </span>
                  )}</p>
                </div>
              </div>

              <div className=' h-[1px] bg-grey-2 w-full my-10 '></div>

              <div className='flex flex-col gap-7'>
                <h3 className='text-body2 font-medium text-grey-6'>Complete these steps to submit</h3>
                <TaskTable task={selectedInvite.task} jobDescription={selectedInvite.job} inviteId={selectedInvite._id} />
              </div>

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
