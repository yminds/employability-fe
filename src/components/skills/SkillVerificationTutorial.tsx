import React, { useState } from "react";
import checkSetupImg from "@/assets/skills/checkSetupImg.png"
import checkedStateCheckSetup from "@/assets/skills/checkedStateCheckSetup.png"
import enableAudioImg from "@/assets/skills/enableAudioImg.png"
import interveiwScreenImg from "@/assets/skills/interveiwScreenImg.png"
import skillCard from "@/assets/skills/skillCard.png"

interface SkillVerificationTutorialProps {
  onClose: () => void;
  onConfirm: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  component:"SkillsCard" | "ScreenSharing";
}

const SkillVerificationTutorial: React.FC<SkillVerificationTutorialProps> = ({
  onClose,
  onConfirm,
  dontShowAgain,
  setDontShowAgain,
  component,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides =  component === "SkillsCard" ? [
    {
      image: `${checkSetupImg}`, // Replace with actual path
      title: "Step 1: Check Your Setup",
      description:
        "Before you dive in, make sure your microphone and camera are working properly, and screen is shared correctly.",
    },
    {
      image: `${enableAudioImg}`, // Replace with actual path
      title: "Step 2: Enable the Audio",
      description:
        "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
    },
    {
      image: `${checkedStateCheckSetup}`, // Replace with actual path
      title: "Step 3: Proceed to Interview",
      description:
        "Once you've checked your setup, click on 'Proceed to Interview' to begin the skill interview.",
    },
    {
      image: `${interveiwScreenImg}`, // Replace with actual path
      title: "Step 4: Interview Process",
      description:
        "Once the interview starts, you'll be asked a series of questions by the AI Agent. Answer them to the best of your ability. After answering the question press the 'Done Answering' button to proceed to the next question.",
    },
    {
      image: `${skillCard}`, // Replace with actual path
      title: "Step 5: Verified Rating & Report",
      description:
        "Once the interview is complete, you'll receive a verified rating and report based on your performance.",
    },
  ] : [
    {
      image: `${enableAudioImg}`, // Replace with actual path
      title: "Enable the Audio",
      description:
        "Enable the screen using the 'Entire Screen' only. Make sure to enable audio sharing as well.",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6">
        {/* Content */}
        <div className="flex flex-col space-y-6">
          {/* Main Content Area */}
          <div className={`flex ${currentSlide % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-6`}>
            {/* Image Section - 70% */}
            <div className="w-[70%]">
              <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                <img
                  src={slides[currentSlide].image}
                  alt={`Tutorial Step ${currentSlide + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg border-2"
                />
              </div>
            </div>

            {/* Text Section - 30% */}
            <div className="w-[30%] flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-h1 font-bold leading-tight">{slides[currentSlide].title}</h2>
                <p className="text-gray-600 text-body leading-relaxed">{slides[currentSlide].description}</p>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? "bg-button" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {/* Left side: Back button or empty space */}
            <div>
              {currentSlide > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>
              )}
            </div>

            {/* Right side: Next/Finish controls */}
            <div className="flex items-center space-x-4">
              {currentSlide === slides.length - 1 ? (
                <>
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Don't show again</span>
                  </label>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-6 py-2 text-sm rounded-md transition-colors bg-button text-white hover:bg-[#062549]`}
                  >
                    Start Interview
                  </button>
                </>
              ) : (
                <>
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Don't show again</span>
                  </label>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-4 py-2 bg-button text-white rounded-md hover:bg-[#062549] transition-colors"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default SkillVerificationTutorial;