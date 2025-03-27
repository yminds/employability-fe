import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import step1 from "@/assets/skills/step1.png"
import step2 from "@/assets/skills/step2.png"
import step3 from "@/assets/skills/step3.png"
import step4 from "@/assets/skills/step4.png"
import step5 from "@/assets/skills/step5.png"

interface SkillVerificationTutorialProps {
  onClose: () => void;
  onConfirm: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  component: "SkillsCard" | "ScreenSharing";
}

const SkillVerificationTutorial: React.FC<SkillVerificationTutorialProps> = ({
  onClose,
  onConfirm,
  dontShowAgain,
  setDontShowAgain,
  component,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const slides = component === "SkillsCard" ? [
    {
      image: `${step1}`,
      title: "Check Your Setup",
      description: "Before you dive in, make sure your microphone and camera are working properly, and screen is shared correctly.",
      step: `${currentSlide + 1}`
    },
    {
      image: `${step2}`,
      title: "Enable the Audio",
      description: "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
      step: `${currentSlide + 1}`
    },
    {
      image: `${step3}`,
      title: "Proceed to Interview",
      description: "Once you've checked your setup, click on 'Proceed to Interview' to begin the skill interview.",
      step: `${currentSlide + 1}`
    },
    {
      image: `${step4}`,
      title: "Interview Process",
      description: "During the interview, respond to the AI Agent's questions. Press 'Done Answering' to move to the next one.",
      step: `${currentSlide + 1}`
    }
  ] : [
    {
      image: `${step2}`,
      title: "Enable Screen Sharing",
      description: "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
      step: `${currentSlide + 2}`
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onConfirm();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-[958px] flex flex-col"
      >
        {/* Image at the top */}
        <div className="w-full">
          <img
            src={slides[currentSlide].image}
            alt={`Step ${currentSlide + 1}`}
            className="w-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Content below the image */}
        <div className="p-9 pt-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X size={24} />
          </button>

          {/* Step Indicator */}
          <div className=" flex-col items-center justify-start text-sm text-gray-600 mb-2 space-y-2 ">
            <div className="flex items-center justify-start gap-1">
              {slides.map((_, index) => (
                <div key={index} className={` h-1 p-1 rounded-full ${index === currentSlide ? 'bg-grey-8 w-8' : 'bg-gray-300 w-4'}`} />
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-2">Step {slides[currentSlide].step} of {slides.length}</div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#001630] mb-4">{slides[currentSlide].title}</h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">{slides[currentSlide].description}</p>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-[#001630] text-sm font-medium gap-2">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Don't show again</span>
            </label>

            <div className="flex space-x-2">
              {currentSlide > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm bg-[#062549] text-white rounded hover:bg-[#0A3B6C]"
              >
                {currentSlide < slides.length - 1 ? 'Continue' : 'Start Interview'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillVerificationTutorial;