import React, { useState } from "react";
import QuizActionBtns from "./QuizActionBtns";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface Fundamental {
  name: string;
  status: string;
  description: string;
  progress?: number; // Optional percentage progress field
}

interface FundamentalBarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  fundamentals: Fundamental[];
  skill: string;
  onStartQuiz: (topic: string) => void;
  onClose: () => void;
}

const FundamentalBar: React.FC<FundamentalBarProps> = ({
  isSidebarOpen,
  fundamentals,
  skill,
  onStartQuiz,
  onClose,
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
      bg-white shadow-[0px_10px_16px_-2px_rgba(149,151,153,0.16)] z-50 overflow-hidden rounded-xl`}
    >
      {isSidebarOpen && (
        <div className="flex flex-col h-full p-[22px]">
          {/* Header */}
          <div className="bg-white">
            <div className="flex justify-between items-center">
              <h2 className="overflow-hidden text-grey-10 font-dm-sans text-[20px] normal-case font-medium leading-[24px] tracking-[0.1px]">
                Fundamentals of {skill}
              </h2>
              <button onClick={onClose} className="text-[#6A6A6A]">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="min-h-[1px] w-full bg-grey-5 my-6"></div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto minimal-scrollbar">
            {fundamentals.length > 0 ? (
              fundamentals.map((item, index) => {
                const isOpen = selectedFundamental === index;

                return (
                  <div key={index} className="relative p-1">
                    {index < fundamentals.length && (
                      <span
                        className={`absolute left-4 w-[2px] ${
                          isOpen
                            ? "bg-black top-10 bottom-[-13px]"
                            : "bg-gray-200 top-12 bottom-[-13px]"
                        } ${index === 0 ? "top-10" : "top-0"} ${
                          index === fundamentals.length - 1 ? "top-[100vh]" : ""
                        }`}
                      />
                    )}

                    {/* Step circle with index */}
                    <div
                      className={`absolute left-0 top-3 h-9 w-9 flex items-center justify-center rounded-full 
                      ${isOpen ? "bg-button text-white" : "bg-[#F0F5F333] border border-grey-2 text-gray-700"}`}
                    >
                      <span className={`text-button font-ubuntu ${isOpen ? "text-white" : "text-grey-4"}`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* The card itself */}
                    <div className="ml-10">
                      <div className="p-4 border border-gray-200 bg-[#F0F5F333] rounded-lg min-h-[52px]">
                        {/* Clickable header row */}
                        <button
                          onClick={() => setSelectedFundamental(isOpen ? null : index)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <h3 className={`text-sub-header font-dm-sans ${isOpen ? "text-grey-10" : "text-grey-5 truncate"}`}>
                            {item.name}
                          </h3>
                          <span className="text-gray-700">
                            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                          </span>
                        </button>

                        {/* Conditionally rendered details */}
                        {isOpen && (
                          <div className="mt-2">
                            <p className="text-gray-600 text-body2">{item.description}</p>
                            <div className="flex items-center justify-end gap-4 mt-4">
                              <QuizActionBtns
                                fundamentals={fundamentals}
                                currentQuizTopic={item.name}
                                onStartQuiz={onStartQuiz}
                                skipCurrentConcept={handleSkipCurrentConcept}
                                showSkipBtn
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
