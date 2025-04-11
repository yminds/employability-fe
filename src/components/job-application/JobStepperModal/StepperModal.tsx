import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import YourDetailsStep from "./YourDetailsStep";
import ApplicationQuestionsStep from "./ApplicationQuestionsStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@/api/locationApiSlice";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";

interface StepperModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobId: string;
  jobDetails: any;
  user: any;
}

export default function StepperModal({
  isOpen,
  onClose,
  companyName,
  jobId,
  jobDetails,
  user,
}: StepperModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [resumeData, setResumeData] = useState({
    name: user?.resumeName || "",
    url: user?.resume_s3_url || "",
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const goalId = user?.goals?.[0]?._id || "";

  const ScreeningQuestions = jobDetails.screening_questions;

  const { data: countries = [] } = useGetCountriesQuery();
  const { data: states = [] } = useGetStatesQuery(user.address?.country || "", {
    skip: !user.address?.country,
  });
  const country = user.address?.country
    ? countries.find((c) => c.isoCode === user.address.country)
    : null;
  const state =
    user.address?.state && user.address?.country
      ? states.find((s) => s.isoCode === user.address.state)
      : null;
  const city = user.address?.city;

  const locationString = [city, state?.name, country?.name].join(", ");

  const userDetails = {
    name: user.name,
    title: user?.goals?.[0]?.name,
    location: locationString,
    email: user?.email,
    phone: user?.phone_number,
    resumeName: resumeData.name || undefined,
    resume_s3_url: resumeData.url || user?.resume_s3_url,
    profileImage: user?.profile_image,
    userId: user._id,
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // @ts-ignore - Access the validation method exposed by ApplicationQuestionsStep
      const isValid = window.validateApplicationQuestions?.();
      if (!isValid) {
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (previousStep === 3 && editingSection) {
      setCurrentStep(3);
      setEditingSection(null);
      setPreviousStep(null);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting application", {
      userDetails,
      applicationData,
      jobId,
    });
    onClose();
  };

  const updateApplicationData = (data: Partial<typeof applicationData>) => {
    setApplicationData({ ...applicationData, ...data });
  };

  const handleEditSection = (section: "details" | "resume" | "questions") => {
    setPreviousStep(currentStep);
    setEditingSection(section);

    if (section === "details") {
      setIsProfileModalOpen(true);
    } else if (section === "questions") {
      setCurrentStep(2);
    } else if (section === "resume") {
      setCurrentStep(1);
    }
  };

  const handleResumeUpdate = (resumeData: { name: string; url: string }) => {
    setResumeData(resumeData);
  };

  const getNextButtonText = () => {
    if (currentStep === 3) return "Submit Application";
    if (previousStep === 3) return "Save Changes";
    return "Next";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] p-0 overflow-hidden rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center px-8 pt-8">
            <h2 className="text-h2">Apply For {companyName}</h2>
          </div>

          {/* Stepper Header */}
          <div className="px-8 pt-4 pb-8">
            <div className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`rounded-full h-5 w-5 flex items-center justify-center text-[11px] ${
                    currentStep >= 1 ? "bg-[#10B754] text-white" : "bg-gray-200"
                  }`}
                >
                  {currentStep > 1 ? <Check className="h-3 w-3" /> : 1}
                </div>
                <span
                  className={`ml-2 text-sm text-body2 ${
                    currentStep >= 1
                      ? "text-[#10B754] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Your Details
                </span>
              </div>
              <div className="flex-grow mx-2 h-[1px] bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`rounded-full h-5 w-5 flex items-center justify-center text-[11px] ${
                    currentStep >= 2 ? "bg-[#10B754] text-white" : "bg-gray-200"
                  }`}
                >
                  {currentStep > 2 ? <Check className="h-3 w-3" /> : 2}
                </div>
                <span
                  className={`ml-2 text-sm text-body2 ${
                    currentStep >= 2
                      ? "text-[#10B754] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Application Questions
                </span>
              </div>
              <div className="flex-grow mx-2 h-[1px] bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`rounded-full h-5 w-5 flex items-center justify-center text-[11px] ${
                    currentStep >= 3 ? "bg-[#10B754] text-white" : "bg-gray-200"
                  }`}
                >
                  3
                </div>
                <span
                  className={`ml-2 text-sm text-body2 ${
                    currentStep >= 3
                      ? "text-[#10B754] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Review & Submit
                </span>
              </div>
            </div>
          </div>

          <div className="border-t mx-8"></div>
        </div>

        <div className="p-8 overflow-y-auto flex-grow">
          {currentStep === 1 && (
            <YourDetailsStep
              userData={userDetails}
              onUpdateResume={handleResumeUpdate}
            />
          )}
          {currentStep === 2 && (
            <ApplicationQuestionsStep
              screeningQuestions={ScreeningQuestions}
              applicationData={applicationData}
              updateApplicationData={updateApplicationData}
            />
          )}
          {currentStep === 3 && (
            <ReviewSubmitStep
              userData={userDetails}
              applicationData={applicationData}
              screeningQuestions={ScreeningQuestions}
              onEditSection={handleEditSection}
            />
          )}
        </div>

        <div className="flex justify-end gap-4 py-6 border-t mx-8 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#001630] text-white rounded-md hover:bg-[#00224d]"
            >
              {getNextButtonText()}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#001630] text-white rounded-md hover:bg-[#00224d]"
            >
              Submit Application
            </button>
          )}
        </div>
        {isProfileModalOpen && (
          <CompleteProfileModal
            type="basic"
            onClose={() => setIsProfileModalOpen(false)}
            user={user}
            goalId={goalId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
