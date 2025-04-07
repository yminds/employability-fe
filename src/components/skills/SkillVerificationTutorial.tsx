import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import step1 from "@/assets/skills/step1.png";
import step2 from "@/assets/skills/step2.png";
import step3 from "@/assets/skills/step3.png";
import step4 from "@/assets/skills/step4.png";
import step5 from "@/assets/skills/step5.png";
import verifyStep1 from "@/assets/skills/verifyStep1.png";
import verifyStep2 from "@/assets/skills/verifyStep2.png";
import { Checkbox } from "@/components/ui/checkbox"

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

  const slides =
    component === "SkillsCard"
      ? [
          {
            image: `${verifyStep1}`,
            title: "Get Ready to Verify Your Skill",
            description: "To help you showcase your abilities, we’ll run an interview to test your React Skill.",
            step: `${currentSlide + 1}`,
          },
          {
            image: `${verifyStep2}`,
            title: "Get Your Skill Report!",
            description:
              "Once the interview is complete, you’ll receive a detailed report on your skills. You can share it with employers to showcase your abilities.",
            step: `${currentSlide + 1}`,
          },
          // {
          //   image: `${step3}`,
          //   title: "Proceed to Interview",
          //   description: "Once you've checked your setup, click on 'Proceed to Interview' to begin the skill interview.",
          //   step: `${currentSlide + 1}`
          // },
          // {
          //   image: `${step4}`,
          //   title: "Interview Process",
          //   description: "During the interview, respond to the AI Agent's questions. Press 'Done Answering' to move to the next one.",
          //   step: `${currentSlide + 1}`
          // }
        ]
      : [
          {
            image: `${step2}`,
            title: "Enable Screen Sharing",
            description:
              "While sharing as 'Entire Screen' or 'Application Window', make sure to enable audio sharing as well.",
            step: `${currentSlide + 2}`,
          },
        ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      <div ref={dialogRef} className="bg-white rounded-2xl shadow-lg w-full max-w-[958px] flex flex-col relative">
        {/* Image at the top */}
        <div className="w-full">
          <img
            src={slides[currentSlide].image}
            alt={`Step ${currentSlide + 1}`}
            className="w-full object-cover rounded-t-2xl min-h-[400px] max-h-[520px]"
          />
        </div>

        {/* Content below the image */}
        <div className="p-9 pt-6 ">
          <button onClick={onClose} className="absolute top-[25px] right-[4.6%] text-gray-500 hover:text-gray-700 z-10">
            <X size={24} />
          </button>

          {/* Step Indicator */}
          <div className=" flex-col items-center justify-start text-sm text-gray-600 mb-2 space-y-2 ">
            <div className="flex items-center justify-start gap-1">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={` h-1 p-1 rounded-full ${index === currentSlide ? "bg-grey-8 w-8" : "bg-gray-300 w-4"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Step {slides[currentSlide].step} of {slides.length}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-h1 font-dm-sans font-bold text-grey-7 mb-3">{slides[currentSlide].title}</h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">{slides[currentSlide].description}</p>
          {currentSlide === 0 && (
            <>
              <p className="text-gray-600 mb-6">Here’s what you’ll do during the skill interview</p>
              <ul className="list-disc list-inside text-[#040609] mb-6  ">
                <li>Answer questions on the skill</li>
                <li>Work through code snippets</li>
                <li>Complete a coding exercise</li>
              </ul>
            </>
          )}

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-[#001630] text-sm font-medium gap-2">
              <Checkbox
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(!!checked)}
                className=" h-4 w-4
                data-[state=unchecked]:border-[#000006] 
                data-[state=checked]:bg-[#001630] 
                data-[state=checked]:border-[#001630]
                data-[state=checked]:text-white"
                onClick={(e) => e.stopPropagation()} // Prevent triggering the parent div's click
              />
              <span className=" text-button">Don't show again</span>
            </label>

            <div className="flex space-x-2">
              {currentSlide > 0 && (
                <button onClick={handlePrev} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm bg-[#062549] text-white rounded hover:bg-[#0A3B6C]"
              >
                {currentSlide < slides.length - 1 ? "Continue" : "Start Interview"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillVerificationTutorial;
