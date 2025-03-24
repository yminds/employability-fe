import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DetailSidebarProps } from './types';
import { capitalizeString, formatDate, getStatusColor } from './utils';
import check from "@/assets/interview/check.png";
import decline from "@/assets/interview/close.png";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCreateInterview } from "@/hooks/useCreateInterview";
import { 
  useGetFundamentalNamesAsCsvMutation, 
  useUpdateInterviewIdMutation 
} from "@/api/interviewInvitesApiSlice";

export const InvitationDetailSidebar: React.FC<DetailSidebarProps> = ({
  selectedInvite,
  showSidebar,
  processingIds,
  onClose,
  handleAccept,
  handleDecline,
  setSelectedInvite,
  setLocalModifiedInvites
}) => {

  if (!selectedInvite) return null;
  const navigate = useNavigate();
  const { createInterview } = useCreateInterview();
  const [getFundamentalNamesAsCsv] = useGetFundamentalNamesAsCsvMutation();
  const [updateInterviewId] = useUpdateInterviewIdMutation();

  const [isLoadingFundamentals, setIsLoadingFundamentals] = useState(false);

  /**
   * Called when user clicks "Take Interview."
   * 1. Fetch fundamentals for the job's skill pool IDs.
   * 2. Create the interview.
   * 3. Update the invite with interviewId.
   * 4. Navigate to the interview page.
   */
  const handleTakeInterview = async () => {
    if (!selectedInvite) {
      console.error("No selected invite found");
      return;
    }

    // Make sure we have valid skill_pool_ids
    const skillPoolIds = selectedInvite.job?.skills_required?.map((skill) => skill.skill) || [];
    if (!skillPoolIds.length) {
      toast.error("No skill requirements found – cannot proceed with interview.");
      return;
    }

    setIsLoadingFundamentals(true);
    try {
      // 1. Fetch fundamentals CSV
      const { data: fundamentalsData } = await getFundamentalNamesAsCsv(skillPoolIds).unwrap();
      if (!fundamentalsData) {
        toast.error("No fundamentals data returned. Cannot proceed with interview.");
        return;
      }

      // 2. Create interview
      const interviewId = await createInterview({
        title: `${selectedInvite.job?.title} Interview`,
        type: "Job",
      });
      console.log("Created interview with ID:", interviewId);

      // 3. Update the invite with the newly created interviewId
      //    so that the backend also knows which interview is tied to this invitation.
      await updateInterviewId({
        inviteId: selectedInvite._id,
        interviewId,
      }).unwrap();
      console.log("Updated invite with interview ID:", interviewId);

      // 4. Navigate to interview
      navigate(`/interview/${interviewId}`, {
        state: {
          title: selectedInvite.job?.title,
          type: "Job",
          jobDescription: selectedInvite.job?.description,
          skills_required: selectedInvite.job?.skills_required,
          Fundamentals: fundamentalsData,
        },
      });
    } catch (error) {
      console.error("Error fetching fundamentals or creating/updating interview:", error);
      toast.error("Failed to create interview. Please try again.");
    } finally {
      setIsLoadingFundamentals(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[50vw] bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col relative">
        {/* Processing overlay - shown when the selected invite is being processed */}
        {processingIds.includes(selectedInvite._id) && (
          <div className="absolute inset-0 bg-white bg-opacity-60 z-10 flex items-center justify-center">
            <div className="p-6 rounded-lg bg-white shadow-lg text-center">
              <div className="text-3xl animate-spin mb-4">⟳</div>
              <p className="text-grey-7 font-medium">Processing your response...</p>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-grey-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-h2 font-medium text-grey-8">Invitation Details</h2>
              <span
                className={`ml-3 text-body2 font-medium px-3 py-1 rounded-full ${getStatusColor(selectedInvite.status)}`}
              >
                {capitalizeString(selectedInvite.status || "Pending")}
              </span>
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
        
        <div className="flex-1 overflow-y-auto p-6 minimal-scrollbar mr-2">
          {selectedInvite.status?.toLowerCase() === 'pending' && (
            <div className="mb-6 p-4 bg-secondary-green rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-green mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-body2 font-medium text-grey-7">
                  This interview invitation is awaiting your response. Please accept or decline.
                </p>
              </div>
            </div>
          )}

          {selectedInvite.status?.toLowerCase() === 'expired' && (
            <div className="mb-6 p-4 bg-greys-100 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-greys-700 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-body2 font-medium text-grey-7">
                  This interview invitation has expired and is no longer available.
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                {selectedInvite.company?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h3 className="text-h1 font-medium text-grey-8">{selectedInvite.job?.title}</h3>
                <p className="text-body2 text-grey-5">
                  {selectedInvite.company?.name} • {selectedInvite.job?.location || 'Remote'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background-grey p-3 rounded-md">
                <span className="text-body2 text-grey-5 block">Job Type</span>
                <span className="text-body2 font-medium">
                  {capitalizeString(selectedInvite.job?.job_type || "Full-time")}
                </span>
              </div>
              <div className="bg-background-grey p-3 rounded-md">
                <span className="text-body2 text-grey-5 block">Work Type</span>
                <span className="text-body2 font-medium">
                  {capitalizeString(selectedInvite.job?.work_place_type || "Remote")}
                </span>
              </div>
              <div className="bg-background-grey p-3 rounded-md">
                <span className="text-body2 text-grey-5 block">Experience Level</span>
                <span className="text-body2 font-medium">
                  {capitalizeString(selectedInvite.job?.experience_level || "Entry")}
                </span>
              </div>
              <div className="bg-background-grey p-3 rounded-md">
                <span className="text-body2 text-grey-5 block">Interview Type</span>
                <span className="text-body2 font-medium">
                  {capitalizeString(selectedInvite.task?.interview_type || "Technical")}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sub-header font-medium mb-4">Job Description</h4>
            <div className="text-body2 text-grey-6 prose prose-sm max-w-none whitespace-pre-line">
              {selectedInvite.job?.description || "No description provided."}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-grey-1">
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-body2 text-grey-5">Due Date</span>
              <span className="text-body2 font-medium">
                {formatDate(selectedInvite?.application_deadline)}
              </span>
            </div>

            {selectedInvite?.status?.toLowerCase() === 'pending' ? (
              <div className="flex gap-3">
                <Button
                  className="bg-button hover:bg-grey-7 text-body2 text-white w-24"
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (processingIds.includes(selectedInvite._id)) return;

                    // Immediately update UI
                    setSelectedInvite({
                      ...selectedInvite,
                      status: 'accepted'
                    });

                    // Update local modifications for list display
                    setLocalModifiedInvites(prev => ({
                      ...prev,
                      [selectedInvite._id]: 'accepted'
                    }));

                    try {
                      const success = await handleAccept(selectedInvite._id);
                      if (!success) {
                        // Revert if failed
                        setSelectedInvite({
                          ...selectedInvite,
                          status: 'pending'
                        });
                        setLocalModifiedInvites(prev => {
                          const newState = { ...prev };
                          delete newState[selectedInvite._id];
                          return newState;
                        });
                      }
                    } catch (err) {
                      console.error('Error accepting invitation:', err);
                      // Revert UI on error
                      setSelectedInvite({
                        ...selectedInvite,
                        status: 'pending'
                      });
                      setLocalModifiedInvites(prev => {
                        const newState = { ...prev };
                        delete newState[selectedInvite._id];
                        return newState;
                      });
                    }
                  }}
                  disabled={processingIds.includes(selectedInvite._id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    {processingIds.includes(selectedInvite._id) ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⟳</span>
                        Processing
                      </>
                    ) : (
                      <>
                        <img src={check} alt="Accept" className="w-5 h-5" />
                        Accept
                      </>
                    )}
                  </div>
                </Button>
                <Button
                  className="bg-grey-2 hover:bg-grey-3 text-button text-grey-7 w-24"
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (processingIds.includes(selectedInvite._id)) return;

                    // Immediately update UI
                    setSelectedInvite({
                      ...selectedInvite,
                      status: 'declined'
                    });

                    // Update local modifications for list display
                    setLocalModifiedInvites(prev => ({
                      ...prev,
                      [selectedInvite._id]: 'declined'
                    }));

                    try {
                      const success = await handleDecline(selectedInvite._id);
                      if (!success) {
                        // Revert if failed
                        setSelectedInvite({
                          ...selectedInvite,
                          status: 'pending'
                        });
                        setLocalModifiedInvites(prev => {
                          const newState = { ...prev };
                          delete newState[selectedInvite._id];
                          return newState;
                        });
                      }
                    } catch (err) {
                      console.error('Error declining invitation:', err);
                      // Revert UI on error
                      setSelectedInvite({
                        ...selectedInvite,
                        status: 'pending'
                      });
                      setLocalModifiedInvites(prev => {
                        const newState = { ...prev };
                        delete newState[selectedInvite._id];
                        return newState;
                      });
                    }
                  }}
                  disabled={processingIds.includes(selectedInvite._id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    {processingIds.includes(selectedInvite._id) ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⟳</span>
                        Processing
                      </>
                    ) : (
                      <>
                        <img src={decline} alt="Decline" className="w-5 h-5" />
                        Decline
                      </>
                    )}
                  </div>
                </Button>
              </div>
            ) : selectedInvite?.status?.toLowerCase() === 'accepted' ? (
              <Button
                className="bg-button hover:bg-grey-7 text-body2 text-white"
                onClick={handleTakeInterview}
                disabled={isLoadingFundamentals}
              >
                {isLoadingFundamentals ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Loading Interview Data...
                  </>
                ) : (
                  "Take Interview"
                )}
              </Button>
            ) : (
              <span
                className={`text-body2 font-medium px-3 py-1 rounded-full ${getStatusColor(selectedInvite?.status)}`}
              >
                {capitalizeString(selectedInvite?.status || "Pending")} 
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
