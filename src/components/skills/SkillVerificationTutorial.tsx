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
      title: "Step 1: Check Your Setup",
      description: "Before you dive in, make sure your microphone and camera are working properly, and screen is shared correctly.",
    },
    {
      image: `${step2}`,
      title: "Step 2: Enable the Audio",
      description: "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
    },
    {
      image: `${step3}`,
      title: "Step 3: Proceed to Interview",
      description: "Once you've checked your setup, click on 'Proceed to Interview' to begin the skill interview.",
    },
    {
      image: `${step4}`,
      title: "Step 4: Interview Process",
      description: "During the interview, respond to the AI Agent's questions. Press 'Done Answering' to move to the next one.",
    },
    {
      image: `${step5}`,
      title: "Step 5: Verified Rating & Report",
      description: "Once the interview is complete, you'll receive a verified rating and report based on your performance.",
    }
  ] : [
    {
      image: `${step2}`,
      title: "Enable Screen Sharing",
      description: "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
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

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener
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
        className="bg-white rounded-xl shadow-lg w-full max-w-xl"
      >
        <div className="p-6">
          {/* Header with Step Indicator */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">Step {currentSlide + 1} of {slides.length}</div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16}/>
            </button>
          </div>

          {/* Title */}
          <h2 className="text-h2 font-bold mb-4">{slides[currentSlide].title}</h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">{slides[currentSlide].description}</p>

          {/* Image */}
          <div className="mb-6 rounded-xl border">
            <img 
              src={slides[currentSlide].image} 
              alt={`Step ${currentSlide + 1}`} 
              className="w-full rounded-lg"
            />
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center">
            <label className=" flex text-center text-[#001630] font-dm-sans text-sm font-medium leading-5 tracking-[0.21px] flex-1 gap-1">
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
                  className="px-4 py-2 text-body2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm bg-button text-body1 text-white rounded hover:bg-[#062549]"
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