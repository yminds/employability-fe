import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import 'react-loading-skeleton/dist/skeleton.css';
import { useCreateInterview } from "@/hooks/useCreateInterview";
import { useInterviewInvites, InterviewInvite } from '@/hooks/useInterviewInvites';
import check from "@/assets/interview/check.png"
import decline from "@/assets/interview/close.png"

interface InterviewListProps {
  isDashboard?: boolean;
  isLoading?: boolean;
  invites?: InterviewInvite[];
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  userId?: string;
}

const InterviewInvitationsList: React.FC<InterviewListProps> = ({
  isDashboard = false,
  isLoading: externalIsLoading,
  invites: externalInvites,
  onAccept: externalOnAccept,
  onDecline: externalOnDecline,
  userId
}) => {
  const navigate = useNavigate();
  const { createInterview } = useCreateInterview();
  const [selectedInvite, setSelectedInvite] = useState<InterviewInvite | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  // Add local state to track modified invites
  const [localModifiedInvites, setLocalModifiedInvites] = useState<Record<string, string>>({});

  // Use our custom hook for interview invites
  const {
    invites: hookInvites,
    isLoading: hookIsLoading,
    processingIds,
    handleAccept,
    handleDecline
  } = useInterviewInvites(userId);

  // Use external invites if provided, otherwise use the ones from the hook
  const invites = externalInvites || hookInvites || [];
  const isLoading = externalIsLoading || hookIsLoading;

  // Apply local status modifications to invites
  const processedInvites = useMemo(() => {
    return invites.map((invite: InterviewInvite) => {
      if (localModifiedInvites[invite._id]) {
        return {
          ...invite,
          status: localModifiedInvites[invite._id]
        };
      }
      return invite;
    });
  }, [invites, localModifiedInvites]);

  const displayedInterviews = isDashboard ? processedInvites.slice(0, 3) : processedInvites;
  const totalInterviews = processedInvites.length;

  const handleTakeInterview = async (id: string) => {
    if (!selectedInvite) return;

    const interviewId = await createInterview({
      title: `${selectedInvite.job?.title || 'Job'} Interview`,
      type: "Job",
    });

    // Start the interview directly if tutorial is disabled
    navigate(`/interview/${interviewId}`, {
      state: { title: selectedInvite.job?.title, type: "Job" },
    });
    navigate(`/interviews/${id}/take`);
  };

  const onInviteAccept = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Immediately update local UI state
    setLocalModifiedInvites(prev => ({
      ...prev,
      [id]: 'accepted'
    }));

    const success = await handleAccept(id);
    if (success && externalOnAccept) {
      externalOnAccept(id);
    }

    // If the selected invite is the one that was just accepted, update its status locally
    if (success && selectedInvite && selectedInvite._id === id) {
      setSelectedInvite({
        ...selectedInvite,
        status: 'accepted'
      });
    }

    // If not successful, revert the local state
    if (!success) {
      setLocalModifiedInvites(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const onInviteDecline = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Immediately update local UI state
    setLocalModifiedInvites(prev => ({
      ...prev,
      [id]: 'declined'
    }));

    const success = await handleDecline(id);
    if (success && externalOnDecline) {
      externalOnDecline(id);
    }

    // If the selected invite is the one that was just declined, update its status locally
    if (success && selectedInvite && selectedInvite._id === id) {
      setSelectedInvite({
        ...selectedInvite,
        status: 'declined'
      });
    }

    // If not successful, revert the local state
    if (!success) {
      setLocalModifiedInvites(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // When hook invites update, update our local modified state to be in sync
  useEffect(() => {
    const newLocalModifiedInvites = { ...localModifiedInvites };
    let hasChanges = false;

    // Remove any local modifications that are now reflected in the server data
    for (const id in localModifiedInvites) {
      const serverInvite = invites.find((invite: InterviewInvite) => invite._id === id);
      if (serverInvite && serverInvite.status.toLowerCase() === localModifiedInvites[id].toLowerCase()) {
        delete newLocalModifiedInvites[id];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setLocalModifiedInvites(newLocalModifiedInvites);
    }
  }, [invites, localModifiedInvites]);

  const handleInviteClick = (invite: InterviewInvite) => {
    setSelectedInvite(invite);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedInvite(null), 300); // Clear after animation completes
  };

  const renderLoadingSkeleton = () => (
    <div className="bg-background-grey p-4 rounded-lg animate-pulse">
      <div className="h-5 bg-grey-2 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-grey-2 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-grey-2 rounded w-1/3"></div>
    </div>
  );

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Capitalize first letter of each word
  const capitalizeString = (str: string) => {
    return str.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-secondary-green text-greens-700';
      case 'accepted':
        return 'bg-secondary-green text-greens-700';
      case 'declined':
        return 'bg-greys-100 text-greys-700';
      case 'completed':
        return 'bg-secondary-green text-greens-700';
      case 'expired':
        return 'bg-greys-100 text-[#FF3B30]';
      default:
        return 'bg-grey-1 text-grey-7';
    }
  };

  // Render action buttons based on status
  const renderActionButtons = (invite: InterviewInvite, isProcessing: boolean) => {
    const status = invite.status?.toLowerCase();
    const isBeingProcessed = processingIds.includes(invite._id);

    if (status === 'pending') {
      return (
        <div className="flex gap-2">
          <Button
            className="bg-[#aa040f1a] hover:bg-[#aa040f33] text-button text-red-700 py-2 px-4 rounded-md transition-colors"
            onClick={(e) => onInviteDecline(invite._id, e)}
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
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            onClick={(e) => onInviteAccept(invite._id, e)}
            disabled={isBeingProcessed}
          >
            <div className="flex items-center gap-2">
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
            handleInviteClick(invite);
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

  // Add a function to generate list item class name based on processing state
  const getItemClassName = (isProcessing: boolean, isSelected: boolean | null) => {
    return `bg-white ${isProcessing ? 'opacity-70' : ''} ${isSelected ? 'bg-background-grey' : ''} p-5 rounded-lg cursor-pointer border border-grey-1 hover:shadow-md transition-all relative`;
  };

  // Add a function to generate grid item class name based on processing state
  const getGridItemClassName = (isProcessing: boolean, isSelected: boolean | null) => {
    return `bg-white ${isProcessing ? 'opacity-70' : ''} ${isSelected ? 'bg-background-grey' : ''} p-4 rounded-lg shadow-sm border border-grey-1 cursor-pointer hover:shadow-md hover:bg-background-grey transition-all flex flex-col h-full justify-between relative`;
  };

  return (
    <div className="relative">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-grey-6 text-h2 font-['Ubuntu'] leading-snug">
            Interview Invitations ({totalInterviews})
          </h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array(3).fill(null).map((_, index) => (
                <div key={index}>{renderLoadingSkeleton()}</div>
              ))}
            </div>
          ) : isDashboard ? (
            // Dashboard view - List layout
            <div className="flex flex-col gap-4">
              {displayedInterviews.map((invite: InterviewInvite) => {
                const isProcessing = processingIds.includes(invite._id);
                const isSelected = selectedInvite && selectedInvite._id === invite._id;

                return (
                  <div
                    key={invite._id}
                    className={`${getItemClassName(isProcessing, isSelected)} group`}
                    onClick={isProcessing ? undefined : () => handleInviteClick(invite)}
                    style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                  >
                    {/* Hover overlay for accepted status */}
                    {invite.status?.toLowerCase() === 'accepted' && (
                      <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-50">
                        {renderActionButtons(invite, isProcessing)}
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
                            {invite.status?.toLowerCase() === 'pending' && renderActionButtons(invite, isProcessing)}
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
              })}
            </div>
          ) : (
            // Non-dashboard view - Grid card layout
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedInterviews.map((invite: InterviewInvite) => {
                const isProcessing = processingIds.includes(invite._id);
                const isSelected = selectedInvite && selectedInvite._id === invite._id;

                return (
                  <div
                    key={invite._id}
                    className={`${getGridItemClassName(isProcessing, isSelected)} group`}
                    onClick={isProcessing ? undefined : () => handleInviteClick(invite)}
                    style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                  >
                    {/* Hover overlay for accepted status */}
                    {invite.status?.toLowerCase() === 'accepted' && (
                      <div className="absolute inset-0 bg-background-grey bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 rounded-lg">
                        {renderActionButtons(invite, isProcessing)}
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
                          {renderActionButtons(invite, isProcessing)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && displayedInterviews.length === 0 && (
            <div className="text-grey-5 text-center py-8">
              <p className="text-h2 font-medium">
                {isDashboard ? "No upcoming interviews" : "No interview invitations found"}
              </p>
              <p className="text-body2 mt-2">
                {isDashboard ? "New interview invites will appear here" : "When you receive interview invitations, they will appear here"}
              </p>
            </div>
          )}

          {isDashboard && totalInterviews > 3 && (
            <div className="w-full flex justify-center mt-4">
              <button
                onClick={() => navigate("/interviews")}
                className="flex items-center gap-1 text-button font-medium hover:underline"
              >
                View all
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 3.33334L8 12.6667"
                    stroke="#001630"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.6667 8L8.00004 12.6667L3.33337 8"
                    stroke="#001630"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Description Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-[50vw] bg-white shadow-xl transform transition-transform duration-300 z-50 ${showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {selectedInvite && (
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
                  <span className={`ml-3 text-body2 font-medium px-3 py-1 rounded-full ${getStatusColor(selectedInvite.status)}`}>
                    {capitalizeString(selectedInvite.status || "Pending")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="p-2 rounded-full"
                  onClick={closeSidebar}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 minimal-scrollbar mr-2">
              {selectedInvite.status?.toLowerCase() === 'pending' && (
                <div className="mb-6 p-4 bg-secondary-green rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                    <svg className="w-5 h-5 text-greys-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                  <span className="block text-body2 text-grey-5">Apply by</span>
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
                    onClick={() => handleTakeInterview(selectedInvite._id)}
                  >
                    Take Interview
                  </Button>
                ) : (
                  <span className={`text-body2 font-medium px-3 py-1 rounded-full ${getStatusColor(selectedInvite?.status)}`}>
                    {capitalizeString(selectedInvite?.status || "Pending")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default InterviewInvitationsList;