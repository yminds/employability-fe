import React,{useEffect} from "react";

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
  
  const tabsData = [
    { id: "inviteCandidates", label: "Invite Candidates", hasBadge: false },
    {
      id: "interviews",
      label: "Interviews",
      count: interviewCount,
      hasBadge: true,
    },
    { id: "shortlistedCandidates", label: "Shortlisted Candidates", hasBadge: false },
    { id: "sentInvitations", label: "Sent Invitations", hasBadge: false },
  ];

  
  const orderedTabs = interviewCount > 0
    ? [
       
        tabsData.find(tab => tab.id === "interviews"),
       
        ...tabsData.filter(tab => tab.id !== "interviews")
      ]
    : tabsData;

    useEffect(() => {
      console.log("TabNavigation - interviewCount:", interviewCount);
      console.log("TabNavigation - selectedTab:", selectedTab);
    }, [interviewCount, selectedTab]);

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

