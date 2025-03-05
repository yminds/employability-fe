import React, { useState } from "react";
import QuizActionBtns from "./QuizActionBtns";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Fundamental {
  name: string;
  status: string;
  description: string;
  progress?: number; // Add a progress field if you need a percentage
}

interface FundamentalBarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  fundamentals: Fundamental[];
  skill: string;
  onStartQuiz: (topic: string) => void;
}

const FundamentalBar: React.FC<FundamentalBarProps> = ({
  isSidebarOpen,
  fundamentals,
  skill,
  onStartQuiz,
}) => {
  const [selectedFundamental, setSelectedFundamental] = useState<number | null>(0);

  // Handle skipping to the next concept
  const handleSkipCurrentConcept = () => {
    setSelectedFundamental((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex + 1) % fundamentals.length;
    });
  };

  return (
    <div
      className={`absolute top-2 right-0 h-[80vh] max-h-[1150px] transition-all duration-300 ease-in-out 
      ${isSidebarOpen ? "w-[405px]" : "w-0"} 
      bg-white shadow-2xl z-50 overflow-hidden rounded-xl`}
    >
      {isSidebarOpen && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white p-3 mb-0 border-b-2 m-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Fundamentals of {skill}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 minimal-scrollbar">
            {fundamentals.length > 0 ? (
              fundamentals.map((item, index) => {
                const isOpen = selectedFundamental === index;

                return (
                  <div key={index} className="relative p-1">
                    {index < fundamentals.length && (
                      <span
                        className={`absolute left-4 w-[2px] ${
                          isOpen ? `bg-black top-10 bottom-[-20px]` : `bg-gray-200 top-10 bottom-[-20px]`
                        } ${index === 0 ? `top-10` : `top-0`} ${
                          index == fundamentals.length - 1 ? `top-[100vh]` : ``
                        }`}
                      />
                    )}

                    {/* Step circle with index */}
                    <div
                      className={`absolute left-0 top-4 h-8 w-8 flex items-center justify-center rounded-full 
                      ${isOpen ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      {index + 1}
                    </div>

                    {/* The card itself */}
                    <div className="ml-10">
                      <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                        {/* Clickable header row */}
                        <button
                          onClick={() => setSelectedFundamental(isOpen ? null : index)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <h3 className={`font-semibold ${isOpen ? 'text-grey-10': 'text-grey-5 truncate'} `}>{item.name}</h3>
                          <span className="text-gray-700">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>

                        {/* Conditionally rendered details */}
                        {isOpen && (
                          <div className="mt-2">
                            <p className="text-gray-600 text-sm">{item.description}</p>

                            {/* Status Progress Bar */}
                            <div className="mt-3">
                              <p className="text-body1 text-gray-500 mb-1">Status: {item.status}</p>
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-4">
                              <QuizActionBtns
                                fundamentals={fundamentals}
                                currentQuizTopic={item.name}
                                onStartQuiz={onStartQuiz}
                                skipCurrentConcept={handleSkipCurrentConcept} // Updated
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-gray-600">No fundamentals found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundamentalBar;
