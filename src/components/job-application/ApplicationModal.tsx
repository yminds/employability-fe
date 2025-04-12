import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Check, PencilIcon } from "lucide-react";
import { useGetJobByIdQuery } from "../../api/employabilityJobApiSlice";
import {
  useUploadCandidateResumeMutation,
  useUpdateCandidateMutation,
} from "../../api/screeningResponseApiSlice";
import { useCreateScreeningResponseMutation } from "../../api/screeningResponseApiSlice";
import ResumeUploadSVG from "@/assets/job-posting/ResumeUploadSVG.svg";
import { PhoneInput } from "../cards/phoneInput/PhoneInput";
import PdfFile from "@/assets/job-posting/pdfFile.svg";
import NameImage from "@/assets/job-posting/nameImage.svg";
import Email from "@/assets/job-posting/mail.svg";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId?: string;
  jobId: string;
}

type StepperStep = "details" | "questions" | "review";

interface CandidateDetails {
  _id?: string;
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  resume_s3_url?: string;
  originalName?: string;
}

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
}

interface QuestionResponse {
  question_id: string;
  question: string;
  question_type: "multiple_choice" | "yes_no" | "text" | "numeric";
  answer: string | number | boolean | string[] | null;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  companyName,
  companyId,
  jobId,
}: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<StepperStep>("details");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [intialStep, setIntialStep] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [s3Key, setS3Key] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [uploadStage, setUploadStage] = useState("s3"); // 's3' or 'candidate'
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Candidate details
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails>({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
  });

  // Screening questions
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);
  const [questionResponses, setQuestionResponses] = useState<
    QuestionResponse[]
  >([]);

  // Error handling
  const [error, setError] = useState("");
  const [candidateId, setCandidateId] = useState<string>("");
  const [contactErrors, setContactErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // RTK Query hooks
  const {
    data: jobData,
    isLoading: isJobLoading,
    error: jobError,
  } = useGetJobByIdQuery(jobId, {
    skip: !isOpen || !jobId,
  });

  const [uploadCandidateResume] = useUploadCandidateResumeMutation();
  const [updateCandidate] = useUpdateCandidateMutation();
  const [createScreeningResponse] = useCreateScreeningResponseMutation();

  // Fetch job details to get screening questions
  useEffect(() => {
    if (jobData?.success && jobData?.data.screening_questions) {
      setScreeningQuestions(jobData.data.screening_questions);

      const initialResponses = jobData.data.screening_questions.map(
        (q: ScreeningQuestion, index: number) => ({
          question_id: index.toString(),
          question: q.question,
          question_type: q.type,
          answer: null,
        })
      );

      setQuestionResponses(initialResponses);
    }
  }, [jobData]);

  useEffect(() => {
    if (jobError) {
      console.error("Error fetching job details:", jobError);
      setError("Failed to load screening questions. Please try again.");
    }
  }, [jobError]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleResumeUpload(file);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setIntialStep(true);
    setUploadedResume(file);
    setUploadingResume(true);
    setUploadProgress(0);
    setShowFields(false);
    setError("");
    setUploadStage("s3");

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", "user_" + Date.now());
      formData.append("folder", "resumes");

      const s3UploadResponse = await axios.post(
        `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 45) / (progressEvent.total || 100)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (s3UploadResponse.data.success) {
        const uploadedFileData = s3UploadResponse.data.data[0];
        setFileUrl(uploadedFileData.fileUrl);
        setS3Key(uploadedFileData.key);
        setUploadStage("candidate");

        const candidateFormData = new FormData();
        candidateFormData.append("fileUrl", uploadedFileData.fileUrl);
        candidateFormData.append("job_id", jobId);
        candidateFormData.append("resume", file);

        setUploadProgress(45);

        const candidateResponse = await uploadCandidateResume(
          candidateFormData
        ).unwrap();

        setUploadProgress(90);

        if (
          candidateResponse &&
          candidateResponse.data &&
          candidateResponse.data.candidate &&
          candidateResponse.data.candidate._id
        ) {
          const candidate = candidateResponse.data.candidate;
          setCandidateId(candidate._id);

          // Update candidate details from parsed resume
          setCandidateDetails({
            _id: candidate._id,
            name: candidate.name || "",
            contact: {
              email: candidate.contact?.email || "",
              phone: candidate.contact?.phone || "",
            },
            resume_s3_url: uploadedFileData.fileUrl,
            originalName: file.name,
          });

          // Set to 100% and show the form fields
          setUploadProgress(100);
          setResumeUploaded(true);
          setUploadingResume(false);
          setShowFields(true);
        } else {
          throw new Error(
            "Failed to process resume. Invalid response from server."
          );
        }
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setError("Failed to upload resume. Please try again.");
      setUploadingResume(false);
    }
  };

  const handleDetailsChange = (field: string, value: string) => {
    if (field === "name") {
      setCandidateDetails((prev) => ({ ...prev, name: value }));
      if (value) {
        setContactErrors((prev) => ({ ...prev, name: "" }));
        setError("");
      }
    } else if (field === "email") {
      setCandidateDetails((prev) => ({
        ...prev,
        contact: { ...prev.contact, email: value },
      }));
      if (value) {
        setContactErrors((prev) => ({ ...prev, email: "" }));
        setError("");
      }
    } else if (field === "phone") {
      setCandidateDetails((prev) => ({
        ...prev,
        contact: { ...prev.contact, phone: value },
      }));
      if (value) {
        setContactErrors((prev) => ({ ...prev, phone: "" }));
        setError("");
      }
    }
  };

  const handleQuestionResponse = (index: number, answer: any) => {
    setQuestionResponses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], answer };
      return updated;
    });

    // Clear error when user answers a question
    setError("");
  };

  const handleNext = () => {
    if (currentStep === "details") {
      if (!resumeUploaded) {
        setError("Please upload your resume before proceeding.");
        return;
      }

      // Validate contact information fields
      const newContactErrors = {
        name: candidateDetails.name ? "" : "Name is required",
        email: candidateDetails.contact.email ? "" : "Email is required",
        phone: candidateDetails.contact.phone ? "" : "Phone number is required",
      };

      setContactErrors(newContactErrors);

      // Check if any errors exist
      if (
        newContactErrors.name ||
        newContactErrors.email ||
        newContactErrors.phone
      ) {
        setError("Please fill in all required contact information.");
        return;
      }

      // If there are no screening questions, skip directly to review
      if (screeningQuestions.length === 0) {
        setCurrentStep("review");
      } else {
        setCurrentStep("questions");
      }
    } else if (currentStep === "questions") {
      // Check each mandatory question individually
      const unansweredMandatoryQuestions = screeningQuestions
        .map((question, index) => {
          const response = questionResponses[index];
          if (
            question.is_mandatory &&
            (response.answer === null ||
              response.answer === "" ||
              (Array.isArray(response.answer) && response.answer.length === 0))
          ) {
            return index;
          }
          return -1;
        })
        .filter((index) => index !== -1);

      if (unansweredMandatoryQuestions.length > 0) {
        setError(
          `Please answer the required question${
            unansweredMandatoryQuestions.length > 1 ? "s" : ""
          }.`
        );

        // Add visual indicators to unanswered mandatory questions
        const questionElements = document.querySelectorAll(
          ".question-container"
        );
        unansweredMandatoryQuestions.forEach((index) => {
          if (questionElements[index]) {
            questionElements[index].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });

        return;
      }

      setCurrentStep("review");
    }
  };

  const handleBack = () => {
    if (currentStep === "questions") {
      setCurrentStep("details");
    } else if (currentStep === "review") {
      if (screeningQuestions.length > 0) {
        setCurrentStep("questions");
      } else {
        setCurrentStep("details");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const newContactErrors = {
        name: candidateDetails.name ? "" : "Name is required",
        email: candidateDetails.contact.email ? "" : "Email is required",
        phone: candidateDetails.contact.phone ? "" : "Phone number is required",
      };

      setContactErrors(newContactErrors);

      if (
        newContactErrors.name ||
        newContactErrors.email ||
        newContactErrors.phone
      ) {
        setError("Please fill in all required contact information.");
        setCurrentStep("details");
        return;
      }

      if (candidateId) {
        await updateCandidate({
          candidateId: candidateId,
          candidateData: {
            name: candidateDetails.name,
            contact: candidateDetails.contact,
          },
        }).unwrap();
      }

      if (screeningQuestions.length > 0) {
        const unansweredMandatoryQuestions = screeningQuestions
          .map((question, index) => {
            const response = questionResponses[index];
            if (
              question.is_mandatory &&
              (response.answer === null ||
                response.answer === "" ||
                (Array.isArray(response.answer) &&
                  response.answer.length === 0))
            ) {
              return index;
            }
            return -1;
          })
          .filter((index) => index !== -1);

        if (unansweredMandatoryQuestions.length > 0) {
          setError(
            `Please answer the required question${
              unansweredMandatoryQuestions.length > 1 ? "s" : ""
            }.`
          );

          setCurrentStep("questions");

          setTimeout(() => {
            const questionElements = document.querySelectorAll(
              ".question-container"
            );
            unansweredMandatoryQuestions.forEach((index) => {
              if (questionElements[index]) {
                questionElements[index].scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            });
          }, 100);

          return;
        }

        // Filter out responses with empty answers
        const validResponses = questionResponses.filter(
          (response) =>
            !(
              response.answer === null ||
              response.answer === "" ||
              (Array.isArray(response.answer) && response.answer.length === 0)
            )
        );

        // Create the request payload
        const screeningData = {
          candidate_id: candidateId,
          job_id: jobId,
          responses: validResponses,
          status: "completed",
          completed_at: new Date().toISOString(),
        };

        // Use RTK Query mutation
        await createScreeningResponse(screeningData).unwrap();
      }

      // Reset all state variables to their initial values
      setCurrentStep("details");
      setUploadingResume(false);
      setUploadProgress(0);
      setUploadedResume(null);
      setResumeUploaded(false);
      setIntialStep(false);
      setFileUrl("");
      setS3Key("");
      setShowFields(false);
      setUploadStage("s3");
      setCandidateDetails({
        name: "",
        contact: {
          email: "",
          phone: "",
        },
      });
      setScreeningQuestions([]);
      setQuestionResponses([]);
      setError("");
      setCandidateId("");
      setContactErrors({
        name: "",
        email: "",
        phone: "",
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);

      // Handle error
      let errorMessage = "Failed to submit application. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Failed to submit application: ${error.message}`;
      }

      setError(errorMessage);
    }
  };

  // Determine if we should show the questions step in the stepper
  const hasScreeningQuestions = screeningQuestions.length > 0;

  // Get appropriate stage message for progress bar
  const getUploadStageMessage = () => {
    if (uploadStage === "s3") {
      return "Uploading to storage";
    } else if (uploadProgress < 100) {
      return "Processing resume data";
    } else {
      return "Resume processed successfully";
    }
  };

  // Format file size to KB or MB
  const formatFileSize = (size: number): string => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-8 gap-0 rounded-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-h2 text-left text-black">
            Apply For {companyName}
          </DialogTitle>
        </DialogHeader>

        {/* Stepper Header - Modified to hide questions step when there are no screening questions */}
        {intialStep && (
          <div className="mb-8">
            <div className="flex items-center gap-10">
              {/* Details Step */}
              <div className="flex items-center">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] ${
                    currentStep === "details" ||
                    currentStep === "questions" ||
                    currentStep === "review"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep === "details" ||
                  currentStep === "questions" ||
                  currentStep === "review" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    "1"
                  )}
                </div>
                <span
                  className={`ml-2 text-sm text-body2 ${
                    currentStep === "details"
                      ? "text-[#10B754] font-medium"
                      : currentStep === "questions" || currentStep === "review"
                      ? "text-[#10B754] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Your Details
                </span>
              </div>

              {/* Questions Step - Only show if there are screening questions */}
              {hasScreeningQuestions && (
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep === "questions" || currentStep === "review"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {currentStep === "questions" || currentStep === "review" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm text-body2 ${
                      currentStep === "questions"
                        ? "text-[#10B754] font-medium"
                        : currentStep === "review"
                        ? "text-[#10B754] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    Application Questions
                  </span>
                </div>
              )}

              {/* Review Step - Always show but adjust the step number */}
              <div className="flex items-center">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] ${
                    currentStep === "review"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep === "review" ? (
                    <Check className="h-3 w-3" />
                  ) : hasScreeningQuestions ? (
                    "3"
                  ) : (
                    "2"
                  )}
                </div>
                <span
                  className={`ml-2 text-sm text-body2 ${
                    currentStep === "review"
                      ? "text-[#10B754] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Review & Submit
                </span>
              </div>
            </div>
            <div className="border-t mt-8"></div>
          </div>
        )}

        {/* Content based on current step */}
        <div className="mb-8">
          {/* Your Details Step */}
          {currentStep === "details" && (
            <div>
              {/* Resume Upload Section */}
              {!intialStep ? (
                <div className="w-full">
                  {/* Main Resume Upload Card */}
                  <div className="w-full overflow-hidden bg-gradient-to-r from-[#FCFCFC] to-[#DED8FB] border rounded-lg">
                    <div className="flex">
                      <div className="flex-1 p-7">
                        <h2 className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.2px] text-[#1c1b1f] mb-2">
                          Resume
                        </h2>
                        <p className="text-body2">
                          Upload your updated resume to apply
                        </p>

                        <Button
                          className="mt-8 border border-[#000000] bg-white text-[#000000] text-button hover:bg-gray-50 px-8 py-2 h-auto"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Resume & Apply
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="h-full relative">
                          <div className="absolute right-[-20px] top-3 h-[240px] w-[240px]">
                            <img
                              src={ResumeUploadSVG || "/placeholder.svg"}
                              alt="Resume upload illustration"
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider with "Or" text - outside the card */}
                  <div className="flex items-center my-7">
                    <div className="flex-1 h-px bg-[#909091] bg-opacity-30"></div>
                    <span className="px-4 text-[#666666]">Or</span>
                    <div className="flex-1 h-px bg-[#909091] bg-opacity-30"></div>
                  </div>

                  {/* Apply with Employability section - outside the card */}
                  <div className="text-center">
                    <h3 className="text-[14px] font-medium leading-5 tracking-[0.21px] text-[#001630] mb-4">
                      Apply with Employability
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full max-w-xs border border-[#000000] bg-white text-[#000000] text-button hover:bg-gray-50 py-3 h-auto"
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Resume Upload Progress - Enhanced to show both stages */}
              {uploadingResume && (
                <div className="mb-6 bg-[#F2F3F5] p-4 rounded-lg">
                  <div className="flex items-center mb-2 gap-3">
                    <div className="bg-white p-2 rounded">
                      <img
                        src={PdfFile || "/placeholder.svg"}
                        alt="Pdf"
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-body2 text-gray-800">
                          {uploadedResume?.name}
                        </span>
                        <span className="text-sm text-body2 text-gray-500">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getUploadStageMessage()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Uploaded */}
              {resumeUploaded && !uploadingResume && (
                <div className="mb-6 p-4 bg-[#F2F3F5] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded">
                        <img
                          src={PdfFile || "/placeholder.svg"}
                          alt="Pdf"
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-body2 text-gray-800">
                          {candidateDetails.originalName}
                        </p>
                        {candidateDetails.resume_s3_url && (
                          <a
                            href={candidateDetails.resume_s3_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#10B754] hover:underline"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#001630] cursor-pointer hover:underline text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Resume
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}

              {/* Candidate Details Form - Only show fields after both uploads complete */}
              {showFields && (
                <div className="space-y-7">
                  <h3 className="text-body2 mb-4">Contact Info</h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <img
                        src={NameImage || "/placeholder.svg"}
                        alt="Name"
                        className="w-5 h-5"
                      />
                    </div>
                    <input
                      type="text"
                      value={candidateDetails.name}
                      onChange={(e) =>
                        handleDetailsChange("name", e.target.value)
                      }
                      placeholder="Full Name"
                      className={`w-full p-2 pl-10 border text-body2 text-sm ${
                        contactErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {contactErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {contactErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <img
                        src={Email || "/placeholder.svg"}
                        alt="Email"
                        className="w-5 h-5"
                      />
                    </div>
                    <input
                      type="email"
                      value={candidateDetails.contact.email}
                      onChange={(e) =>
                        handleDetailsChange("email", e.target.value)
                      }
                      placeholder="Email Address"
                      className={`w-full p-2 pl-10 border text-body2 text-sm ${
                        contactErrors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {contactErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {contactErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <PhoneInput
                      value={candidateDetails.contact.phone}
                      onChange={(value) =>
                        handleDetailsChange("phone", value as string)
                      }
                      className={`w-full text-body2 text-sm ${
                        contactErrors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {contactErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {contactErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Application Questions Step - Show all questions at once */}
          {currentStep === "questions" && hasScreeningQuestions && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* List all questions */}
              {screeningQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`mb-8 question-container ${
                    question.is_mandatory &&
                    (questionResponses[index]?.answer === null ||
                      questionResponses[index]?.answer === "" ||
                      (Array.isArray(questionResponses[index]?.answer) &&
                        questionResponses[index]?.answer.length === 0))
                  }`}
                >
                  <p className="text-body2 text-[#202326] mb-4">
                    {question.is_mandatory && (
                      <span className="text-red-500">*</span>
                    )}
                    {question.question}
                  </p>

                  {question.type === "yes_no" && (
                    <div className="space-x-4 text-body2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-5 w-5"
                          checked={questionResponses[index]?.answer === "yes"}
                          onChange={() => handleQuestionResponse(index, "yes")}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-5 w-5"
                          checked={questionResponses[index]?.answer === "no"}
                          onChange={() => handleQuestionResponse(index, "no")}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  )}

                  {question.type === "multiple_choice" && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIdx) => (
                        <label key={optIdx} className="block mb-2">
                          <input
                            type="radio"
                            className="form-radio"
                            checked={
                              questionResponses[index]?.answer === option
                            }
                            onChange={() =>
                              handleQuestionResponse(index, option)
                            }
                          />
                          <span className="ml-2">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "text" && (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={4}
                      value={(questionResponses[index]?.answer as string) || ""}
                      onChange={(e) =>
                        handleQuestionResponse(index, e.target.value)
                      }
                    />
                  )}

                  {question.type === "numeric" && (
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={(questionResponses[index]?.answer as number) || ""}
                      onChange={(e) =>
                        handleQuestionResponse(
                          index,
                          e.target.value
                            ? Number.parseInt(e.target.value, 10)
                            : null
                        )
                      }
                    />
                  )}
                  {question.is_mandatory &&
                    (questionResponses[index]?.answer === null ||
                      questionResponses[index]?.answer === "" ||
                      (Array.isArray(questionResponses[index]?.answer) &&
                        questionResponses[index]?.answer.length === 0)) &&
                    error && (
                      <p className="text-red-500 text-sm mt-2">
                        This question is required
                      </p>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Review & Submit Step */}
          {currentStep === "review" && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="mb-6">
                <div className="flex justify-between text-center">
                  <h3 className="text-body2 mb-4 text-black">Your Details</h3>
                  <Button
                    variant="ghost"
                    className="text-[#10B754] hover:bg-transparent"
                    onClick={() => setCurrentStep("details")}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-[#F2F3F5] p-4 rounded-lg flex justify-between">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-body2 text-sm text-[#68696B]">Name</p>
                      <p className="text-body2 text-[#414447]">
                        {candidateDetails.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-body2 text-sm text-[#68696B]">Email</p>
                      <p className="text-body2 text-[#414447]">
                        {candidateDetails.contact.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-body2 text-sm text-[#68696B]">Phone</p>
                      <p className="text-body2 text-[#414447]">
                        {candidateDetails.contact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section - Now separated */}
              <div className="mb-6">
                <div className="flex justify-between">
                  <h3 className="text-body2 mb-4 text-black">Resume</h3>
                  <Button
                    variant="ghost"
                    className="text-[#10B754] hover:bg-transparent"
                    onClick={() => setCurrentStep("details")}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-[#F2F3F5] p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded">
                      <img
                        src={PdfFile || "/placeholder.svg"}
                        alt="Pdf"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="text-body2">
                        {candidateDetails.originalName}
                      </p>
                      {candidateDetails.resume_s3_url && (
                        <a
                          href={candidateDetails.resume_s3_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#10B754] hover:underline"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {hasScreeningQuestions && (
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-body2 mb-4 text-black">
                      Application Questions
                    </h3>
                    <Button
                      variant="ghost"
                      className="text-[#10B754] hover:bg-transparent"
                      onClick={() => setCurrentStep("questions")}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-[#F2F3F5] p-6 rounded-lg">
                    {questionResponses.map((response, index) => {
                      const isMandatory =
                        screeningQuestions[index]?.is_mandatory;

                      return (
                        <div
                          key={index}
                          className={
                            index < questionResponses.length - 1 ? "mb-7" : ""
                          }
                        >
                          <p className="text-sm text-[#68696B]">
                            {isMandatory && (
                              <span className="text-red-500">*</span>
                            )}
                            {response.question}
                          </p>
                          <p className="text-body2 text-sm text-[#414447] pt-2">
                            {response.question_type === "yes_no"
                              ? response.answer === "yes"
                                ? "Yes"
                                : response.answer === "no"
                                ? "No"
                                : "No response"
                              : typeof response.answer === "string" ||
                                typeof response.answer === "number"
                              ? response.answer.toString()
                              : Array.isArray(response.answer)
                              ? response.answer.join(", ")
                              : "No response"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        {intialStep && (
          <div className="flex justify-end gap-4 pt-6 border-t">
            {currentStep !== "details" ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep === "review" ? (
              <Button
                onClick={handleSubmit}
                className="bg-[#001630] text-white hover:bg-[#001f45]"
              >
                Submit Application
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-[#001630] text-white hover:bg-[#001f45]"
                disabled={currentStep === "details" && !resumeUploaded}
              >
                {hasScreeningQuestions ? "Next" : "Review Application"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
