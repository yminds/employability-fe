import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  useGetInvitesByUserIdQuery, 
  useRespondToInviteMutation, 
} from '@/api/interviewInvitesApiSlice';
import { useSelector } from 'react-redux';
// Define interface for interview invite

export interface InterviewInvite {
  _id: string;
  job?: {
    title?: string;
    company?: string;
    description?: string;
    location?: string;
    job_type?: string;
    work_place_type?: string;
    experience_level?: string;
    skills_required?: {
      skill: string;
    }[];
  };
  company?: {
    name?: string;
  };
  task?: {
    interview_type?: {
      type?: string;
      status?: string;
      estimated_time?: number;
      interview_id?: string;
    };
    skills?: {
      name?: string;
      status?: string;
      estimated_time?: number;
      _id?: string;
    }[];
  };
  status: string;
  application_deadline: string;
  fundamentalsCsv?: string | null;
}

export const useInterviewInvites = (userId?: string) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  
  // Get the user ID from Redux state if not provided
  const authUser = useSelector((state: any) => state.auth?.user);
  const currentUserId = userId || authUser?._id;
  
  // Fetch invitations for the current user
  const {
    data: invites = [] as InterviewInvite[],
    isLoading,
    isError,
    refetch
  } = useGetInvitesByUserIdQuery(currentUserId, {
    skip: !currentUserId, // Skip query if no user ID is available
  });
  
  // RTK Query mutation hook
  const [respondToInvite] = useRespondToInviteMutation();
  
  // Handler for accepting invitations
  const handleAccept = useCallback(async (id: string) => {
    if (processingIds.includes(id)) return false;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      await respondToInvite({ inviteId: id, action: 'accept' }).unwrap();
      
      // No need for direct toast here as RTK Query will trigger a refetch
      // that will update the UI automatically
      
      // Return success without waiting for the refetch
      return true;
      
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      // Only show error toast if there's actually an error
      if (error?.status !== 200) {
        toast.error(error?.data?.message || "Failed to accept interview invitation");
      }
      return false;
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  }, [processingIds, respondToInvite]);
  
  // Handler for declining invitations
  const handleDecline = useCallback(async (id: string) => {
    if (processingIds.includes(id)) return false;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      await respondToInvite({ inviteId: id, action: 'decline' }).unwrap();
      
      // No need for direct toast here as RTK Query will trigger a refetch
      // that will update the UI automatically
      
      // Return success without waiting for the refetch
      return true;
      
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      // Only show error toast if there's actually an error
      if (error?.status !== 200) {
        toast.error(error?.data?.message || "Failed to decline interview invitation");
      }
      return false;
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  }, [processingIds, respondToInvite]);
  
  return {
    invites,
    isLoading,
    isError,
    processingIds,
    handleAccept,
    handleDecline,
    refetch
  };
}; 