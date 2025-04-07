import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import step1 from "@/assets/skills/step1.png";
import screenShareImg from "@/assets/skills/step2.png";
import step3 from "@/assets/skills/step3.png";
import step4 from "@/assets/skills/step4.png";
import step2 from "@/assets/skills/step4.mp4";

import { Checkbox } from "@/components/ui/checkbox";

interface SlideItem {
  image: string;
  title: string;
  description: string;
  step: string;
  listItems?: string[];
  footer?: string;
}

interface SkillVerificationTutorialProps {
  onClose: () => void;
  onConfirm: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  component: "SkillsCard" | "ScreenSharing" | "InterviewSetup";
}

const InterviewGuide: React.FC<SkillVerificationTutorialProps> = ({
  onClose,
  onConfirm,
  dontShowAgain,
  setDontShowAgain,
  component,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const slides: SlideItem[] =
    component === "InterviewSetup"
      ? [
          {
            image: `${step1}`,
            title: "Check Your Setup",
            description: "Before starting, make sure to",
            step: `${currentSlide + 1}`,
            listItems: ["Ensure your microphone is working", "Check that your camera is functioning properly"],
          },
          {
            image: `${step2}`,
            title: "Enable Screen sharing",
            description: "Before starting, make sure to",
            step: `${currentSlide + 1}`,
            listItems: ["Ensure your share Entire Screen", "Make sure to Enable audio sharing as well."],
          },
          {
            image: `${step3}`,
            title: "Interview Process",
            description: "Answering Questions in Interview",
            step: `${currentSlide + 1}`,
            listItems: [
              "Employability AI will ask questions",
              "Respond to the AI Agent's questions. Press 'Done Answering' to move to the next one.",
            ],
          },
          {
            image: `${step4}`,
            title: "Play Fair, Perform Your Best: Follow the Rules",
            description: "Before starting, please review these rules to ensure fairness and integrity.",
            step: `${currentSlide + 1}`,
            listItems: [
              "Do not use multiple screens or external resources to answer questions.",
              "Be honest in your responses—as we automatically detect suspicious activity.",
              "Your interview results will be reviewed by the employer, including your recorded video.",
            ],
            footer:
              "*Any attempts to cheat or bypass these rules will result in Permanent Suspension from the platform.",
          },
        ]
      : [
          {
            image: `${screenShareImg}`,
            title: "Enable Screen sharing",
            description: "Before starting, make sure to",
            step: "",
            listItems: ["Ensure your share Entire Screen", "Make sure to Enable audio sharing as well."],
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] transition-all duration-300">
      <div ref={dialogRef} className="bg-white rounded-2xl shadow-lg w-full max-w-[958px] relative flex flex-col">
        {/* Image at the top */}
        <div className="w-full">
          {currentSlide === 1 ? (
            <video src={slides[currentSlide].image} autoPlay loop muted className="w-full  rounded-t-2xl max-h-[520px] object-cover transition-all duration-200" />
          ) : (
            <img
              src={slides[currentSlide].image}
              alt={`Step ${currentSlide + 1}`}
              className="w-full object-cover rounded-t-2xl transition-all duration-200"
            />
          )}
        </div>

        {/* Content below the image */}
        <div className="p-8 pt-6">
          <button onClick={onClose} className="absolute top-[35px] right-8 text-gray-500 hover:text-gray-700 z-10">
            <X size={24} />
          </button>

          {/* Step Indicator */}
          {slides[currentSlide].step !== "" && (
            <div className=" flex-col items-center justify-start text-sm text-gray-600 mb-2 space-y-4 ">
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
          )}

          {/* Title */}
          <h2 className="text-h1 font-ubuntu font-bold text-grey-7 mb-3">{slides[currentSlide].title}</h2>

          {/* Description */}
          <p className="text-gray-700 font-ubuntu text-[16px] normal-case font-normal leading-6 tracking-[0.27px] mb-4">
            {slides[currentSlide].description}
          </p>

          {/* List Items */}
          {slides[currentSlide].listItems && (
            <ul className="list-disc pl-5 mb-4 text-grey-9 font-dm-sans text-[16px] normal-case font-medium leading-6 tracking-[0.27px]">
              {slides[currentSlide].listItems?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          {/* Footer */}
          {slides[currentSlide].footer && (
            <p className="text-[#B17002] font-dm-sans text-[16px] normal-case font-normal leading-6 tracking-[0.27px] mb-4 mb-4">
              {slides[currentSlide].footer}
            </p>
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
                onClick={component === "InterviewSetup" && currentSlide === slides.length - 1 ? onClose : handleNext}
                className="px-4 py-2 text-sm bg-[#062549] text-white rounded hover:bg-[#0A3B6C]"
              >
                {currentSlide < slides.length - 1
                  ? "Continue"
                  : component === "InterviewSetup"
                  ? "close"
                  : "Start Sharing"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewGuide;
