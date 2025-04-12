import { useState, useEffect } from "react";

interface ScreeningQuestion {
  _id: string;
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  options?: string[];
  customField?: string;
  customFieldValue?: string;
}

interface ApplicationQuestionsStepProps {
  screeningQuestions: ScreeningQuestion[];
  applicationData: Record<string, string>;
  updateApplicationData: (data: Record<string, string>) => void;
}

export default function ApplicationQuestionsStep({
  screeningQuestions,
  applicationData,
  updateApplicationData,
}: ApplicationQuestionsStepProps) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [validationAttempted, setValidationAttempted] = useState(false);

  // Validate all mandatory questions whenever applicationData changes
  useEffect(() => {
    if (validationAttempted) {
      validateMandatoryQuestions();
    }
  }, [applicationData, validationAttempted]);

  const handleInputChange = (questionId: string, value: string) => {
    updateApplicationData({ ...applicationData, [questionId]: value });

    // Clear error for this question if it's been answered
    if (value.trim() !== "" && validationErrors[questionId]) {
      const updatedErrors = { ...validationErrors };
      delete updatedErrors[questionId];
      setValidationErrors(updatedErrors);
    }
  };

  // Validate all mandatory questions
  const validateMandatoryQuestions = () => {
    const errors: Record<string, string> = {};

    screeningQuestions.forEach((question) => {
      if (question.is_mandatory) {
        const answer = applicationData[question._id] || "";
        if (answer.trim() === "") {
          errors[question._id] = "This question is required";
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Public method to validate all questions (called from parent component)
  const validateAllQuestions = () => {
    setValidationAttempted(true);
    return validateMandatoryQuestions();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - Adding a custom property to the component
      window.validateApplicationQuestions = validateAllQuestions;
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore - Cleanup
        delete window.validateApplicationQuestions;
      }
    };
  }, [applicationData]);

  const renderQuestion = (question: ScreeningQuestion, index: number) => {
    const questionId = question._id;
    const value = applicationData[questionId] || "";
    const hasError = !!validationErrors[questionId];

    return (
      <div key={questionId} className="space-y-4 mb-8">
        <label className="block text-body2 text-[#202326]">
          {question.is_mandatory && <span className="text-red-500">*</span>}
          {question.question}
        </label>

        {question.type === "yes_no" && (
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={questionId}
                value="Yes"
                checked={value === "Yes"}
                onChange={() => handleInputChange(questionId, "Yes")}
                className={`h-5 w-5 ${
                  hasError ? "border-red-500" : "text-[#10B754]"
                }`}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={questionId}
                value="No"
                checked={value === "No"}
                onChange={() => handleInputChange(questionId, "No")}
                className={`h-5 w-5 ${
                  hasError ? "border-red-500" : "text-[#10B754]"
                }`}
              />
              <span>No</span>
            </label>
          </div>
        )}

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={value === option}
                  onChange={() => handleInputChange(questionId, option)}
                  className={`h-5 w-5 ${
                    hasError ? "border-red-500" : "text-[#10B754]"
                  }`}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            placeholder="Enter your answer"
            className={`w-full p-3 border ${
              hasError ? "border-red-500" : "border-gray-300"
            } rounded-md text-body2`}
          />
        )}

        {question.type === "numeric" && (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            placeholder="Enter a number"
            className={`w-full p-3 border ${
              hasError ? "border-red-500" : "border-gray-300"
            } rounded-md text-body2`}
          />
        )}

        {hasError && (
          <p className="text-red-500 text-sm mt-1">
            {validationErrors[questionId]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-4">
        {screeningQuestions.map((question, index) =>
          renderQuestion(question, index)
        )}
      </div>
    </div>
  );
}
