import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResumeUploadModal from "./ResumeUploadModal";
import axios from "axios";
import { Check } from "lucide-react";
import { useGetJobByIdQuery } from "../../api/employabilityJobApiSlice";
import { useUploadCandidateResumeMutation, useUpdateCandidateMutation } from "../../api/screeningResponseApiSlice";
import { useCreateScreeningResponseMutation } from "../../api/screeningResponseApiSlice"

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
  // States for the stepper and application process
  const [currentStep, setCurrentStep] = useState<StepperStep>("details");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [s3Key, setS3Key] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [uploadStage, setUploadStage] = useState("s3"); // 's3' or 'candidate'

  // Candidate details
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails>({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
  });

  // Screening questions
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [questionResponses, setQuestionResponses] = useState<QuestionResponse[]>([]);

  // Error handling
  const [error, setError] = useState("");
  const [candidateId, setCandidateId] = useState<string>("");

  // RTK Query hooks
  const { data: jobData, isLoading: isJobLoading, error: jobError } = useGetJobByIdQuery(jobId, {
    skip: !isOpen || !jobId
  });
  
  const [uploadCandidateResume] = useUploadCandidateResumeMutation();
  const [updateCandidate] = useUpdateCandidateMutation();
  const [createScreeningResponse] = useCreateScreeningResponseMutation();

  // Fetch job details to get screening questions
  useEffect(() => {
    if (jobData?.success && jobData?.data.screening_questions) {
      setScreeningQuestions(jobData.data.screening_questions);

      // Initialize responses array with no default selections
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

  // Handle job loading error
  useEffect(() => {
    if (jobError) {
      console.error("Error fetching job details:", jobError);
      setError("Failed to load screening questions. Please try again.");
    }
  }, [jobError]);

  const handleResumeUpload = async (file: File) => {
    setUploadedResume(file);
    setUploadingResume(true);
    setUploadProgress(0);
    setShowFields(false);
    setError(""); // Clear any previous errors
    setUploadStage("s3");

    try {
      // Step 1: Upload to S3 (keeping axios for progress tracking)
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", "user_" + Date.now());
      formData.append("folder", "resumes");

      const s3UploadResponse = await axios.post(
        "http://localhost:3000/api/v1/s3/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            // Calculate progress for S3 upload phase (0-45%)
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

        // Update stage to candidate upload after S3 upload is complete
        setUploadStage("candidate");

        // Step 2: Process the resume using RTK Query mutation
        const candidateFormData = new FormData();
        candidateFormData.append("fileUrl", uploadedFileData.fileUrl);
        candidateFormData.append("job_id", jobId);
        candidateFormData.append("resume", file);

        // Set progress to indicate we're starting the candidate upload
        setUploadProgress(45);

        // Use the RTK Query mutation
        const candidateResponse = await uploadCandidateResume(candidateFormData).unwrap();
        
        // Set progress to 90% when we get a response
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
    } else if (field === "email") {
      setCandidateDetails((prev) => ({
        ...prev,
        contact: { ...prev.contact, email: value },
      }));
    } else if (field === "phone") {
      setCandidateDetails((prev) => ({
        ...prev,
        contact: { ...prev.contact, phone: value },
      }));
    }
  };

  const handleQuestionResponse = (index: number, answer: any) => {
    setQuestionResponses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], answer };
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep === "details") {
      if (!resumeUploaded) {
        setError("Please upload your resume before proceeding.");
        return;
      }

      // If there are no screening questions, skip directly to review
      if (screeningQuestions.length === 0) {
        setCurrentStep("review");
      } else {
        setCurrentStep("questions");
      }
    } else if (currentStep === "questions") {
      // Validate all mandatory questions are answered
      const unansweredMandatory = questionResponses.some(
        (response, index) =>
          screeningQuestions[index]?.is_mandatory &&
          (response.answer === null || 
           response.answer === "" ||
           (Array.isArray(response.answer) && response.answer.length === 0))
      );

      if (unansweredMandatory) {
        setError("Please answer all mandatory questions before proceeding.");
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
      if (candidateId) {
        // Update candidate details using RTK Query
        await updateCandidate({
          candidateId: candidateId,
          candidateData: {
            name: candidateDetails.name,
            contact: candidateDetails.contact,
          }
        }).unwrap();
      }

      // Save screening responses (only if there are questions)
      if (screeningQuestions.length > 0) {
        // Validate mandatory fields are filled
        const unansweredMandatory = questionResponses.some(
          (response, index) =>
            screeningQuestions[index]?.is_mandatory &&
            (response.answer === null ||
             response.answer === "" ||
             (Array.isArray(response.answer) && response.answer.length === 0))
        );

        if (unansweredMandatory) {
          setError("Please answer all mandatory questions before submitting.");
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl p-6 gap-0">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-h2 text-left text-black">
              Apply For {companyName}
            </DialogTitle>
          </DialogHeader>

          {/* Stepper Header - Modified to hide questions step when there are no screening questions */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {/* Details Step */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                    <Check size={16} />
                  ) : (
                    "1"
                  )}
                </div>
                <span
                  className={`ml-2 ${
                    currentStep === "details"
                      ? "font-semibold text-green-500"
                      : ""
                  }`}
                >
                  Your Details
                </span>
              </div>

              {/* First Divider - Only show if there are screening questions */}
              {hasScreeningQuestions && (
                <div className="h-1 w-16 bg-gray-200 mx-2">
                  <div
                    className={`h-full ${
                      currentStep === "questions" || currentStep === "review"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              )}

              {/* Questions Step - Only show if there are screening questions */}
              {hasScreeningQuestions && (
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === "questions" || currentStep === "review"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {currentStep === "questions" || currentStep === "review" ? (
                      <Check size={16} />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span
                    className={`ml-2 ${
                      currentStep === "questions"
                        ? "font-semibold text-green-500"
                        : ""
                    }`}
                  >
                    Application Questions
                  </span>
                </div>
              )}

              {/* Second Divider - Adjust width based on whether questions step is shown */}
              <div
                className={`h-1 ${
                  hasScreeningQuestions ? "w-16" : "w-32"
                } bg-gray-200 mx-2`}
              >
                <div
                  className={`h-full ${
                    currentStep === "review" ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              </div>

              {/* Review Step - Always show but adjust the step number */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "review"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep === "review" ? (
                    <Check size={16} />
                  ) : hasScreeningQuestions ? (
                    "3"
                  ) : (
                    "2"
                  )}
                </div>
                <span
                  className={`ml-2 ${
                    currentStep === "review"
                      ? "font-semibold text-green-500"
                      : ""
                  }`}
                >
                  Review & Submit
                </span>
              </div>
            </div>
          </div>

          {/* Content based on current step */}
          <div className="mb-8">
            {/* Your Details Step */}
            {currentStep === "details" && (
              <div>
                {/* Resume Upload Section */}
                {!resumeUploaded ? (
                  <div className="mb-6">
                    <Button
                      onClick={() => setIsResumeModalOpen(true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Upload Resume
                    </Button>
                  </div>
                ) : null}

                {/* Resume Upload Progress - Enhanced to show both stages */}
                {uploadingResume && (
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-16 text-red-500 mr-3">
                        <div className="text-xs text-gray-500 flex items-center justify-center bg-gray-100 rounded-sm w-full h-full">
                          PDF
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {uploadedResume?.name}
                          </span>
                          <span className="text-sm text-gray-500">
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
                {resumeUploaded && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-16 text-red-500 mr-3">
                          <div className="text-xs text-gray-500 flex items-center justify-center bg-gray-100 rounded-sm w-full h-full">
                            PDF
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {candidateDetails.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setIsResumeModalOpen(true)}
                      >
                        Change Resume
                      </Button>
                    </div>
                  </div>
                )}

                {/* Candidate Details Form - Only show fields after both uploads complete */}
                {showFields && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={candidateDetails.name}
                        onChange={(e) =>
                          handleDetailsChange("name", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={candidateDetails.contact.email}
                        onChange={(e) =>
                          handleDetailsChange("email", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={candidateDetails.contact.phone}
                        onChange={(e) =>
                          handleDetailsChange("phone", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Application Questions Step - Show all questions at once */}
            {currentStep === "questions" && hasScreeningQuestions && (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <h3 className="text-lg font-medium mb-4">
                  Application Questions
                </h3>
                
                {/* List all questions */}
                {screeningQuestions.map((question, index) => (
                  <div key={index} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                    <p className="text-lg font-medium mb-4">
                      {question.is_mandatory && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {question.question}
                    </p>

                    {question.type === "yes_no" && (
                      <div className="space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            checked={
                              questionResponses[index]?.answer === "yes"
                            }
                            onChange={() =>
                              handleQuestionResponse(index, "yes")
                            }
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio"
                            checked={
                              questionResponses[index]?.answer === "no"
                            }
                            onChange={() =>
                              handleQuestionResponse(index, "no")
                            }
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    )}

                    {question.type === "multiple_choice" && (
                      <div className="space-y-2">
                        {question.options?.map(
                          (option, optIdx) => (
                            <label
                              key={optIdx}
                              className="block mb-2"
                            >
                              <input
                                type="radio"
                                className="form-radio"
                                checked={
                                  questionResponses[index]?.answer === option
                                }
                                onChange={() =>
                                  handleQuestionResponse(
                                    index,
                                    option
                                  )
                                }
                              />
                              <span className="ml-2">{option}</span>
                            </label>
                          )
                        )}
                      </div>
                    )}

                    {question.type === "text" && (
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        value={
                          (questionResponses[index]?.answer as string) || ""
                        }
                        onChange={(e) =>
                          handleQuestionResponse(
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}

                    {question.type === "numeric" && (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={
                          (questionResponses[index]?.answer as number) || ""
                        }
                        onChange={(e) =>
                          handleQuestionResponse(
                            index,
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Review & Submit Step */}
            {currentStep === "review" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Your Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{candidateDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {candidateDetails.contact.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {candidateDetails.contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Resume</p>
                      <p className="font-medium">
                        {candidateDetails.originalName}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-2 text-blue-500 hover:text-blue-700"
                      onClick={() => setCurrentStep("details")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {hasScreeningQuestions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      Application Questions
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-[40vh] overflow-y-auto">
                      {questionResponses.map((response, index) => (
                        <div
                          key={index}
                          className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                        >
                          <p className="font-medium mb-1">
                            {response.question}
                          </p>
                          <p className="text-gray-700">
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
                      ))}
                      <Button
                        variant="ghost"
                        className="mt-2 text-blue-500 hover:text-blue-700"
                        onClick={() => setCurrentStep("questions")}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between">
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
        </DialogContent>
      </Dialog>

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onUpload={handleResumeUpload}
      />
    </>
  );
}