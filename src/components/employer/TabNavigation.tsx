import React, { useEffect, useRef } from "react";

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  interviewCount?: number; 
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  selectedTab,
  setSelectedTab,
  interviewCount = 0, 
}) => {
  // Store the previous count to prevent reset
  const [previousCount, setPreviousCount] = React.useState(interviewCount);
  
  // Reference to track if this is the initial render
  const isInitialRender = useRef(true);
  
  // Only update previous count when interviewCount changes and is not zero
  useEffect(() => {
    if (interviewCount > 0) {
      setPreviousCount(interviewCount);
    }
  }, [interviewCount]);
  
  // Display previous count or current count, whichever is higher
  const displayCount = Math.max(previousCount, interviewCount);

  // Automatically select the interviews tab when displayCount becomes > 0
  useEffect(() => {
    if (isInitialRender.current && displayCount > 0) {
      setSelectedTab("interviews");
      isInitialRender.current = false;
    }
  }, [displayCount, setSelectedTab]);

  // Define all tabs
  const allTabs = [
    { id: "inviteCandidates", label: "Invite Candidates", hasBadge: false },
    {
      id: "interviews",
      label: "Interviews",
      count: displayCount,
      hasBadge: true,
    },
    { id: "shortlistedCandidates", label: "Shortlisted Candidates", hasBadge: false },
    { id: "sentInvitations", label: "Sent Invitations", hasBadge: false },
  ];
  
  // Dynamically order tabs based on interview count
  const orderedTabs = React.useMemo(() => {
    if (displayCount > 0) {
      // If there are interviews, move the interviews tab to the front
      const interviewsTab = allTabs.find(tab => tab.id === "interviews");
      const otherTabs = allTabs.filter(tab => tab.id !== "interviews");
      return [interviewsTab, ...otherTabs];
    }
    // Otherwise, use the default order
    return allTabs;
  }, [displayCount]);

  return (
    <div className="border-b border-[#d6d7d9] pt-8">
      <div className="flex">
        {orderedTabs.map((tab:any) => (
          <button
            key={tab.id}
            className={`px-4 pb-3 text-body2 ${
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
                <span className="text-body2">({tab.count})</span>
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