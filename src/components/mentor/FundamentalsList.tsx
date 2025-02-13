import { List, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import React, { useState } from "react";

interface Fundamental {
  name: string;
  status: string;
  description: string;
}

interface FundamentalBarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  fundamentals: Fundamental[];
  skill:string
}

const FundamentalBar: React.FC<FundamentalBarProps> = ({
  isSidebarOpen,
  setSidebarOpen,
  fundamentals,
  skill
}) => {
  const [selectedFundamental, setSelectedFundamental] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="text-green-500" size={16} />;
      case "pending":
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  return (
    <>
      <div
        className={`absolute top-0 right-0 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-80" : "w-0"
        } bg-white border-l border-gray-200 shadow-2xl z-50`}
      >
        {isSidebarOpen && (
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Fundamentals of {skill}</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-green-500 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <p className="text-green-100 text-sm">
                  Track your progress through essential concepts and fundamentals
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {fundamentals.length > 0 ? (
                <div className="p-4 space-y-2">
                  {fundamentals.map((item, index) => (
                    <div
                      key={index}
                      className={`group rounded-lg border transition-all duration-200 ${
                        selectedFundamental === index
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedFundamental(selectedFundamental === index ? null : index)}
                        className="w-full px-4 py-3 flex items-center gap-3"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-medium ${
                            item.status.toLowerCase() === "completed" ? "text-green-700" :
                            item.status.toLowerCase() === "pending" ? "text-yellow-700" : "text-gray-700"
                          }`}>
                            {item.name}
                          </p>
                        </div>
                      </button>
                      {selectedFundamental === index && item.description && (
                        <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-100 mt-2 pt-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <AlertCircle size={40} className="text-gray-400 mb-4" />
                  <p className="text-gray-600">No fundamentals found for this skill.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed right-6 top-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50"
        >
          <List size={20} />
        </button>
      )}
    </>
  );
};

export default FundamentalBar;