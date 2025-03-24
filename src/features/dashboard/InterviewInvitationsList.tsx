import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import 'react-loading-skeleton/dist/skeleton.css';
import { useInterviewInvites, InterviewInvite } from '@/hooks/useInterviewInvites';

import {
  InvitationListItem,
  InvitationGridItem,
  InvitationDetailSidebar,
  LoadingSkeleton,
  EmptyState,
  InterviewListProps
} from './components/interview-invitations';

const InterviewInvitationsList: React.FC<InterviewListProps> = ({
  isDashboard = false,
  isLoading: externalIsLoading,
  invites: externalInvites,
  onAccept: externalOnAccept,
  onDecline: externalOnDecline,
  userId,
  hideHeader = false
}) => {
  const navigate = useNavigate();
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
    console.log("Clicked invite:", invite);
    setSelectedInvite(invite);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedInvite(null), 300); // Clear after animation completes
  };

  return (
    <div className="relative">
      <Card className="w-full">
        {!hideHeader && (
          <CardHeader>
            <h2 className="text-grey-6 text-h2 font-['Ubuntu'] leading-snug">
              Interview Invitations ({totalInterviews})
            </h2>
          </CardHeader>
        )}
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array(3).fill(null).map((_, index) => (
                <div key={index}><LoadingSkeleton /></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayedInterviews.map((invite: InterviewInvite) => {
                const isProcessing = processingIds.includes(invite._id);
                const isSelected = selectedInvite && selectedInvite._id === invite._id;

                return (
                  <InvitationListItem
                    key={invite._id}
                    invite={invite}
                    isProcessing={isProcessing}
                    isSelected={!!isSelected}
                    onInviteClick={handleInviteClick}
                    onAccept={onInviteAccept}
                    onDecline={onInviteDecline}
                    showSidebar={showSidebar}
                  />
                );
              })}
            </div>
          )}

          {!isLoading && displayedInterviews.length === 0 && (
            <EmptyState isDashboard={isDashboard} />
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
      <InvitationDetailSidebar
        selectedInvite={selectedInvite}
        showSidebar={showSidebar}
        processingIds={processingIds}
        onClose={closeSidebar}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        setSelectedInvite={setSelectedInvite}
        setLocalModifiedInvites={setLocalModifiedInvites}
      />

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