import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import JobPreviewSidebar from "./JobPreviewSidebar";
import BasicInfoForm from "./BasicInfoFrom";
import SuggestedSkillsForm from "./RequiredSkillsForm";
import ScreeningQuestionsForm from "./ScreeningQuestionsFrom";
import { Navigate, useNavigate } from "react-router-dom";
import JobCreateSidebar from "./JobCreateSidebar";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
}

interface JobPostingPageProps {
  onClose?: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
  companyId?: string | { _id: string };
  employerId?: string;
}

const JobPostingPage: React.FC<JobPostingPageProps> = ({
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  companyId,
  employerId,
}) => {
  // Basic form data
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    job_type: initialData?.job_type || "",
    work_place_type: initialData?.work_place_type || "",
    experience_level: initialData?.experience_level || "",
    company_name: initialData?.company_name || "",
    company_logo: initialData?.company_logo || "",
    job_id: initialData?._id || undefined,
  });

  const navigate = useNavigate();

  // Skills state
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{
      skill: Skill;
      importance: "Very Important" | "Important" | "Good-To-Have";
    }>
  >(
    initialData?.skills_required
      ? initialData.skills_required.map((skill: any) => {
          let skillObj;
          if (typeof skill === "string") {
            skillObj = { _id: skill, name: skill, icon: undefined };
          } else if (skill && typeof skill === "object") {
            skillObj = {
              _id: skill._id || "",
              name:
                skill.name || (typeof skill._id === "string" ? skill._id : ""),
              icon: skill.icon,
            };
          } else {
            skillObj = { _id: "", name: "Unknown Skill", icon: undefined };
          }

          // Add importance if it exists in the data, otherwise default to "Preferred"
          return {
            skill: skillObj,
            importance: skill.importance || "Important",
          };
        })
      : []
  );

  // Screening questions state
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >(initialData?.screening_questions || []);

  // Interview questions state (keeping for data structure compatibility)
  const [interviewQuestions, setInterviewQuestions] = useState<
    InterviewQuestion[]
  >(initialData?.interview_questions || []);

  // Step navigation
  const [activeStep, setActiveStep] = useState<
    "basic" | "skills" | "screening" | "preview"
  >("basic");

  // Preview state
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const handleNextStep = () => {
    markCurrentStepComplete();

    if (activeStep === "basic") {
      setActiveStep("skills");
    } else if (activeStep === "skills") {
      setActiveStep("screening");
    } else if (activeStep === "screening") {
      setActiveStep("preview");
    }
  };

  const handlePreviousStep = () => {
    if (activeStep === "preview") {
      setCompletedSteps((prev) => ({ ...prev, screening: false }));
      setActiveStep("screening");
    } else if (activeStep === "screening") {
      setCompletedSteps((prev) => ({ ...prev, skills: false }));
      setActiveStep("skills");
    } else if (activeStep === "skills") {
      setCompletedSteps((prev) => ({ ...prev, basic: false }));
      setActiveStep("basic");
    }
  };

  // Form validation
  const isFormValid = () => {
    if (activeStep === "basic") {
      return formData.title && formData.location && formData.description;
    } else if (activeStep === "skills") {
      return selectedSkills.length > 0;
    }
    return true;
  };

  // Submit the final job posting only when explicitly requested
  const handleFinalSubmit = () => {
    // Mark all steps as completed for future navigation
    setCompletedSteps({
      basic: true,
      skills: true,
      screening: true,
    });

    const company_id_str =
      typeof companyId === "object" && companyId?._id
        ? companyId._id
        : typeof companyId === "string"
        ? companyId
        : "";

    const processedData = {
      ...formData,
      skills_required: selectedSkills.map((skillItem) => ({
        _id: skillItem.skill._id,
        name: skillItem.skill.name,
        icon: skillItem.skill.icon,
        importance: skillItem.importance,
      })),
      screening_questions: screeningQuestions,
      interview_questions: interviewQuestions,
      company_id: company_id_str,
      employer_id: employerId,
    };

    if (typeof onSubmit === "function") {
      onSubmit(processedData);
    }
  };

  // Form submission event handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === "preview") {
      // Only submit the form when in preview step and submit button is clicked
      handleFinalSubmit();
    } else {
      // Otherwise just advance to the next step
      handleNextStep();
    }
  };

  // Handle form data change
  const handleFormDataChange = (updatedData: any) => {
    setFormData({ ...formData, ...updatedData });
  };

  // Preview toggle handler
  const handleTogglePreview = () => {
    setPreviewExpanded(!previewExpanded);
  };

  // State to track completed steps
  const [completedSteps, setCompletedSteps] = useState<{
    basic: boolean;
    skills: boolean;
    screening: boolean;
  }>({
    // Only mark steps as completed if we have initial data,
    // otherwise all steps should start as incomplete
    basic: false,
    skills: false,
    screening: false,
  });

  // Check if a step is valid and can be navigated to
  const canNavigateToStep = (stepId: string) => {
    // Allow navigation to steps in sequence or any completed steps
    if (stepId === "basic") return true;
    if (stepId === "skills")
      return completedSteps.basic || activeStep === "skills";
    if (stepId === "screening")
      return (
        (completedSteps.basic && completedSteps.skills) ||
        activeStep === "screening"
      );
    if (stepId === "preview")
      return (
        (completedSteps.basic &&
          completedSteps.skills &&
          completedSteps.screening) ||
        activeStep === "preview"
      );
    return false;
  };

  // Update completed steps when moving to next step
  const markCurrentStepComplete = () => {
    setCompletedSteps((prev) => {
      if (activeStep === "basic") return { ...prev, basic: true };
      if (activeStep === "skills") return { ...prev, skills: true };
      if (activeStep === "screening") return { ...prev, screening: true };
      return prev;
    });
  };

  // Tab navigation component
  const TabNavigation = () => {
    const tabs = [
      { id: "basic", label: "Basic Info" },
      { id: "skills", label: "Required Skills" },
      { id: "screening", label: "Applicant Questions" },
      { id: "preview", label: "Review & Save" },
    ];

    // Function to handle step navigation
    const handleStepClick = (stepId: string) => {
      if (canNavigateToStep(stepId)) {
        // When clicking on a previous step, mark all subsequent steps as incomplete
        if (stepId === "basic") {
          setCompletedSteps((prev) => ({
            ...prev,
            skills: false,
            screening: false,
          }));
        } else if (stepId === "skills") {
          setCompletedSteps((prev) => ({
            ...prev,
            screening: false,
          }));
        }

        setActiveStep(stepId as any);
      }
    };

    return (
      <div className="flex justify-between w-full ">
        {tabs.map((tab, index) => {
          const isActive = activeStep === tab.id;
          const isCompleted =
            !isActive &&
            ((tab.id === "basic" && completedSteps.basic) ||
              (tab.id === "skills" && completedSteps.skills) ||
              (tab.id === "screening" && completedSteps.screening));
          const isClickable = canNavigateToStep(tab.id);

          return (
            <div
              key={tab.id}
              className={`flex items-center gap-2 ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              }`}
              onClick={() => isClickable && handleStepClick(tab.id)}
            >
              {isActive ? (
                <>
                  <div className="w-5 h-5 bg-[#10b753] rounded-full flex items-center justify-center">
                    <span className="text-white font-dm-sans text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-[14px] leading-6 font-medium font-dm-sans text-[#10b753]">
                    {tab.label}
                  </div>
                </>
              ) : isCompleted ? (
                <>
                  <div className="w-5 h-5 bg-[#10b753] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-[#10b753]">
                    {tab.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full border border-[#b3b3b3] flex items-center justify-center">
                    <div className="text-[10px] font-dm-sans font-medium text-[#b3b3b3]">
                      {index + 1}
                    </div>
                  </div>
                  <div className="text-[14px] leading-6 font-medium font-dm-sans text-[#B3B3B3]">
                    {tab.label}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleEditClick = (
    section: "basic" | "skills" | "screening" | "review"
  ) => {
    if (section === "basic") {
      setActiveStep("basic");
    } else if (section === "skills") {
      setActiveStep("skills");
    } else if (section === "screening") {
      setActiveStep("screening");
    } else if (section === "review") {
      handleFinalSubmit();
    }
  };

  return (
    <main className="h-screen w-full  overflow-hidden font-ubuntu">
      <div className="h-full flex flex-col bg-[#F5F5F5]">
        <div className="flex-1 px-[55px] pb-[5px] pt-[20px] min-h-0 flex flex-col">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-[30px] h-[30px] bg-white rounded-3xl border border-black/10 flex items-center justify-center"
              onClick={() => navigate("/employer")}
            >
              {/* Arrow icon placeholder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-base text-[#8f9091] font-normal">
              <span>Jobs</span>
              <span className="mx-1">/</span>
              <span className="text-[#030609]">Create Job</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 h-full overflow-hidden">
            <div className="grid grid-cols-4 gap-6 h-full">
              {/* Left Column - Main Form */}
              <div className="col-span-3 min-h-full flex flex-col">
                <div className="bg-white rounded-xl shadow-sm border border-[#d9d9d9]/20 flex flex-col h-full overflow-hidden">
                  {/* Fixed Header - Always visible */}
                  <div className="bg-white p-8 shadow-sm z-10">
                    <div className="flex flex-col gap-3">
                      <h1 className="text-[24px] font-medium font-ubuntu leading-[38.4px] tracking-[-0.36px] text-[#414447]">
                        Create Job
                      </h1>
                      <TabNavigation />
                    </div>
                  </div>

                  {/* Scrollable Form Content */}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 pt-6 scrollbar-hide">
                      {/* Step 1: Basic Info */}
                      {activeStep === "basic" && (
                        <BasicInfoForm
                          formData={formData}
                          onChange={handleFormDataChange}
                        />
                      )}

                      {/* Step 2: Required Skills */}
                      {activeStep === "skills" && (
                        <SuggestedSkillsForm
                          jobTitle={formData.title}
                          jobDescription={formData.description}
                          selectedSkills={selectedSkills}
                          setSelectedSkills={setSelectedSkills}
                        />
                      )}

                      {/* Step 3: Screening Questions */}
                      {activeStep === "screening" && (
                        <ScreeningQuestionsForm
                          screeningQuestions={screeningQuestions}
                          setScreeningQuestions={setScreeningQuestions}
                        />
                      )}

                      {/* Step 4: Preview */}
                      {activeStep === "preview" && (
                        <div className="flex flex-col gap-7">
                          <JobPreviewSidebar
                            jobTitle={formData.title}
                            companyName={formData.company_name}
                            location={formData.location}
                            jobType={formData.job_type}
                            workplaceType={formData.work_place_type}
                            description={formData.description}
                            skills={selectedSkills}
                            screeningQuestions={screeningQuestions}
                            interviewQuestions={[]}
                            expanded={true}
                            onPreviewClick={handleTogglePreview}
                            onEditClick={handleEditClick}
                          />
                        </div>
                      )}
                    </div>

                    {/* Fixed Navigation Buttons - Always visible at bottom */}
                    <div className="bg-white border-t border-gray-200 py-4 px-8 flex justify-between">
                      {activeStep !== "basic" && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 px-8 py-2 border border-gray-300"
                          onClick={handlePreviousStep}
                        >
                          Back
                        </Button>
                      )}
                      {activeStep !== "preview" ? (
                        <Button
                          type="button"
                          className="ml-auto h-11 px-8 py-2 bg-[#001630] text-white rounded"
                          disabled={!isFormValid()}
                          onClick={handleNextStep}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="ml-auto h-11 px-8 py-2 bg-[#001630] text-white rounded"
                          disabled={isLoading}
                          onClick={handleFinalSubmit}
                        >
                          {isLoading
                            ? "Saving..."
                            : initialData
                            ? "Update Job"
                            : "Post Job"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview Panel */}
              <div className="col-span-1">
                <div className="sticky top-0">
                  <JobCreateSidebar
                    jobTitle={formData.title}
                    companyName={formData.company_name}
                    companyLogo={initialData.company_logo}
                    location={formData.location}
                  />
                  {/* <JobPreviewSidebar
                    jobTitle={formData.title}
                    companyName={formData.company_name}
                    companyLogo={initialData.company_logo}
                    location={formData.location}
                    jobType={formData.job_type}
                    workplaceType={formData.work_place_type}
                    description={formData.description}
                    skills={selectedSkills}
                    screeningQuestions={screeningQuestions}
                    expanded={previewExpanded}
                    onPreviewClick={handleTogglePreview}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobPostingPage;
