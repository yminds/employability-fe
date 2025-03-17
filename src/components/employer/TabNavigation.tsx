import React from "react";

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { id: "matching", label: "Matching Candidates" },
    { id: "all", label: "All Applicants" },
    { id: "screening", label: "Screening" },
    { id: "tasks", label: "Tasks" },
    { id: "pipeline", label: "In Pipeline" },
  ];

  return (
    <div className="border-b border-[#d6d7d9]">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 text-sm font-medium ${
              selectedTab === tab.id
                ? "text-[#001630] border-b-2 border-[#001630]"
                : "text-[#68696b]"
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;