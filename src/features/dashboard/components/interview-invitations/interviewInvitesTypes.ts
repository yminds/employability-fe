import { InterviewInvite } from "@/hooks/useInterviewInvites";

export interface InviteItemProps {
  invite: InterviewInvite;
  isProcessing: boolean;
  isSelected: boolean;
  onInviteClick: (invite: InterviewInvite) => void;
  onAccept: (id: string, e: React.MouseEvent) => void;
  onDecline: (id: string, e: React.MouseEvent) => void;
  showSidebar: boolean;
  isTaskCompleted: boolean | undefined;
}

export interface ActionButtonsProps {
  invite: InterviewInvite;
  isProcessing: boolean;
  onAccept: (id: string, e: React.MouseEvent) => void;
  onDecline: (id: string, e: React.MouseEvent) => void;
  onInviteClick: (invite: InterviewInvite) => void;
}

export interface DetailSidebarProps {
  selectedInvite: InterviewInvite | null;
  showSidebar: boolean;
  processingIds: string[];
  onClose: () => void;
  handleAccept: (id: string) => Promise<boolean>;
  handleDecline: (id: string) => Promise<boolean>;
  setSelectedInvite: React.Dispatch<React.SetStateAction<InterviewInvite | null>>;
  setLocalModifiedInvites: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isTaskCompleted: boolean | undefined;
}

export interface InterviewListProps {
  isDashboard?: boolean;
  isLoading?: boolean;
  invites?: InterviewInvite[];
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  userId?: string;
  hideHeader?: boolean;
} 