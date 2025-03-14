// utils/candidateUtils.ts
import { ICandidate, ScreeningCard, CandidateInvitation } from "../types/candidate";

// Get candidate data safely with proper fallback values
export const getCandidateData = (
  result: ScreeningCard | CandidateInvitation,
  appliedCandidates: ICandidate[]
): ICandidate => {
  if (typeof result?.candidate_id === "string") {
    // Find in applied candidates first
    const existingCandidate = appliedCandidates.find(
      (c) => c._id === result?.candidate_id
    );
    
    if (existingCandidate) {
      return existingCandidate;
    }

    // Create a minimal valid ICandidate object
    return {
      _id: result?.candidate_id,
      name: "Unknown Candidate",
      contact: {
        email: "unknown@example.com",
        phone: "N/A",
      },
      skills: [],
      education: [],
      experience: [],
    };
  }

  // Already an ICandidate object
  return result?.candidate_id as ICandidate;
};

// Extract a candidate's experience level
export const getCandidateExperienceLevel = (candidate: ICandidate): string => {
  // First check if the candidate already has an experience_level field
  if (candidate?.experience_level) {
    return candidate?.experience_level;
  }
  
  // Otherwise calculate it based on experience entries
  if (candidate?.experience && candidate?.experience.length > 0) {
    const totalYears = candidate?.experience.reduce((total, exp) => {
      try {
        // Simple calculation, could be more sophisticated
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        const years = (end.getFullYear() - start.getFullYear());
        return total + years;
      } catch (e) {
        return total;
      }
    }, 0);
    
    if (totalYears < 2) return 'Entry Level';
    else if (totalYears < 5) return 'Mid Level';
    else return 'Senior Level';
  }
  
  return 'Not Specified';
};

// Extract a candidate's role
export const getCandidateRole = (candidate: ICandidate): string => {
  // First check if the candidate already has a role field
  if (candidate?.role) {
    return candidate?.role;
  }
  
  // Otherwise check if there's a current job title from experience
  if (candidate?.experience && candidate?.experience.length > 0) {
    return candidate?.experience[0].jobTitle;
  }
  
  return 'Not Specified';
};

// Format date
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not scheduled';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Get status badge color for invitations
export const getInvitationStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Filter candidates based on search term
export const filterCandidates = (candidates: ICandidate[], searchTerm: string): ICandidate[] => {
  if (!searchTerm) return candidates;

  return candidates.filter(
    (candidate) =>
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      candidate.softSkills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      candidate.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};