import React from "react";

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  interviewCount?: number; // Added prop for interview count
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  selectedTab, 
  setSelectedTab,
  interviewCount = 0 // Default to 0 if not provided
}) => {
  const tabs = [
    { id: "inviteCandidates", label: "Invite Candidates" },
    { 
      id: "interviews", 
      label: "Interviews", 
      count: interviewCount,
      hasBadge: true
    },
    { id: "shortlistedCandidates", label: "Shortlisted Candidates" },
    { id: "sentInvitations", label: "Sent Invitations" },
  ];

  return (
    <div className="border-b border-[#d6d7d9]">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 pb-3 text-sm font-medium ${
              selectedTab === tab.id
                ? "text-[#001630] border-b-2 border-[#24d680]"
                : "text-[#68696b]"
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.hasBadge ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#24d680]"></span>
                <span>{tab.label}</span>
                <span className="text-xs">({tab.count})</span>
              </div>
            ) : (
              tab.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;