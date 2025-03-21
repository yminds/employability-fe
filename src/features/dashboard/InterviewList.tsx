import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface InterviewListProps {
  isDashboard?: boolean;
  isLoading?: boolean;
  invites?: any[];
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ 
  isDashboard = false, 
  isLoading = false, 
  invites = [],
  onAccept,
  onDecline
}) => {
  const navigate = useNavigate();
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const displayedInterviews = isDashboard ? invites.slice(0, 3) : invites;
  const totalInterviews = invites.length;

  const handleTakeInterview = (id: string, e: React.MouseEvent) => {
    navigate(`/interviews/${id}/take`);
  };

  const handleAccept = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProcessingIds(prev => [...prev, id]);
    
    if (onAccept) {
      onAccept(id);
      // Remove from processing after API call completes
      setTimeout(() => {
        setProcessingIds(prev => prev.filter(pId => pId !== id));
      }, 1000);
    }
  };

  const handleDecline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProcessingIds(prev => [...prev, id]);
    
    if (onDecline) {
      onDecline(id);
      // Remove from processing after API call completes
      setTimeout(() => {
        setProcessingIds(prev => prev.filter(pId => pId !== id));
      }, 1000);
    }
  };

  const handleInviteClick = (invite: any) => {
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
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-secondary-green text-greens-700';
      case 'accepted':
        return 'bg-secondary-green text-greens-700';
      case 'declined':
        return 'bg-greys-100 text-greys-700';
      case 'completed':
        return 'bg-secondary-green text-greens-700';
      default:
        return 'bg-grey-1 text-grey-7';
    }
  };

  // Render action buttons based on status
  const renderActionButtons = (invite: any, isProcessing: boolean) => {
    const status = invite.status?.toLowerCase();
    
    if (status === 'pending') {
      return (
        <div className="flex gap-2">
          <Button 
            className="bg-button hover:bg-grey-7 text-white py-2 px-4 rounded-md transition-colors"
            onClick={(e) => handleAccept(invite._id, e)}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Accept'}
          </Button>
          <Button 
            className="bg-grey-2 hover:bg-grey-3 text-button text-grey-7 py-2 px-4 rounded-md transition-colors"
            onClick={(e) => handleDecline(invite._id, e)}
            disabled={isProcessing}
          >
            Decline
          </Button>
        </div>
      );
    } else if (status === 'accepted') {
      return (
        <Button 
          className="bg-button hover:bg-grey-7 text-button text-white py-2 px-6 rounded-md transition-colors"
          onClick={() => handleInviteClick(invite)}
        >
          View Details
        </Button>
      );
    }
    
    // No buttons for declined status
    return null;
  };

  return (
    <div className="relative">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-grey-6 text-h2 font-['Ubuntu'] leading-snug">
            Upcoming Interviews ({totalInterviews})
          </h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array(3).fill(null).map((_, index) => (
                <div key={index}>{renderLoadingSkeleton()}</div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayedInterviews.map((invite) => {
                const isProcessing = processingIds.includes(invite._id);
                
                return (
                  <div 
                    key={invite._id} 
                    className="bg-white p-5 rounded-lg cursor-pointer border border-grey-1 hover:shadow-md transition-shadow" 
                    onClick={() => handleInviteClick(invite)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      {/* Left side - Company info and details */}
                      <div className="flex flex-col space-y-4 md:w-2/3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-secondary-green flex items-center justify-center text-primary-green font-semibold mr-3">
                            {invite.company?.name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <h3 className="text-sub-header text-grey-8 line-clamp-1">{invite.job?.title}</h3>
                            <p className="text-body2 text-grey-5">{invite.company?.name}</p>
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
                              <span className={`text-body2 font-medium ${
                                getDaysRemaining(invite.application_deadline) <= 2 
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
                      
                      {/* Right side - Action buttons based on status */}
                      <div className="mt-4 md:mt-0 md:w-1/3 md:flex md:justify-end md:items-center">
                        {renderActionButtons(invite, isProcessing)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && displayedInterviews.length === 0 && (
            <div className="text-grey-5 text-center py-8">
              <p className="text-h2 font-medium">No interviews found</p>
              <p className="text-body2 mt-2">New interview invites will appear here</p>
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
        className={`fixed inset-y-0 right-0 w-[50vw] bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedInvite && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-grey-1">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 font-medium text-grey-8">Job Details</h2>
                <Button 
                  variant="ghost" 
                  className="p-2 rounded-full"
                  onClick={closeSidebar}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
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
                    {formatDate(selectedInvite.application_deadline)}
                  </span>
                </div>
                <Button
                  className="bg-button hover:bg-grey-7 text-body2 text-white"
                  onClick={() => handleTakeInterview(selectedInvite._id, {} as React.MouseEvent)}
                >
                  Take Interview
                </Button>
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

export default InterviewList;