import React from 'react';

interface EmptyStateProps {
  isDashboard: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isDashboard }) => {
  return (
    <div className="text-grey-5 text-center py-8">
      <p className="text-h2 font-medium">
        {isDashboard ? "No upcoming interviews" : "No interview invitations found"}
      </p>
      <p className="text-body2 mt-2">
        {isDashboard 
          ? "New interview invites will appear here" 
          : "When you receive interview invitations, they will appear here"
        }
      </p>
    </div>
  );
}; 