import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type ScreeningResponse = {
  question_id: string;
  question: string;
  question_type: "multiple_choice" | "yes_no" | "text" | "numeric";
  answer: string | number | boolean | string[];
};

interface ScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: {
    question_id: string;
    question: string;
    question_type: "multiple_choice" | "yes_no" | "text" | "numeric";
    options?: string[];
    is_mandatory: boolean;
  }[];
  onSubmit: (responses: ScreeningResponse[]) => void;
  responses: {
    question_id: string;
    question: string;
    question_type: string;
    answer: string | number | boolean;
  }[];
  mode?: "edit" | "view";
}

const ScreeningModal = ({
  isOpen,
  onClose,
  questions,
  onSubmit,
  responses,
  mode = "edit",
}: ScreeningModalProps) => {
  console.log('responses', responses)
  const isReadOnly = mode === "view";
  const [formResponses, setFormResponses] = useState<ScreeningResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize with existing responses when in view mode
  useEffect(() => {
    if (responses ) {
      // Map API responses to formResponses state
      setFormResponses(
        responses.map((r) => ({
          question_id: r.question_id,
          question: r.question,
          question_type: r.question_type as "multiple_choice" | "yes_no" | "text" | "numeric",
          answer: r.answer,
        }))
      );
    } else {
      setFormResponses([]);
    }
  }, []);

  const handleAnswerChange = (
    question_id: string,
    value: string | number | boolean,
    question: string,
    question_type: string
  ) => {
    if (isReadOnly) return;

    setFormResponses((prev) => {
      const existingIndex = prev.findIndex((r) => r.question_id === question_id);
      const updated: ScreeningResponse = {
        question_id,
        question,
        question_type: question_type as "multiple_choice" | "yes_no" | "text" | "numeric",
        answer: value,
      };

      if (existingIndex >= 0) {
        const updatedResponses = [...prev];
        updatedResponses[existingIndex] = updated;
        return updatedResponses;
      } else {
        return [...prev, updated];
      }
    });
  };

  const handleSubmit = () => {
    if (isReadOnly) {
      onClose();
      return;
    }

    const missing = questions.filter((q) => {
      if (!q.is_mandatory) return false;
      const r = formResponses.find((res) => res.question_id === q.question_id);
      return r === undefined || r.answer === "" || r.answer === null;
    });

    if (missing.length > 0) {
      setError("Please answer all required questions.");
      return;
    }

    setError(null);
    onSubmit(formResponses);
    onClose();
  };

  if (!isOpen) return null;

  const getAnswerForQuestion = (questionId: string) => {
    return formResponses.find((r) => r.question_id === questionId)?.answer;
  };

  const formatAnswer = (answer: any, questionType: string) => {
    switch (questionType) {
      case "yes_no":
        return answer === true ? "Yes" : "No";
      case "numeric":
        return Number(answer).toString();
      default:
        return answer.toString();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg max-w-2xl w-full relative overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="overflow-hidden text-grey-10 font-dm-sans text-[20px] normal-case font-medium leading-[24px] tracking-[0.1px]">
            {isReadOnly ? "Questionnaire Responses" : "Questionnaire"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {questions.map(({ question_id, question_type, question, options, is_mandatory }) => {
              const currentAnswer = getAnswerForQuestion(question_id);
              console.log("currentAnswer", currentAnswer)
              let input = null;

              switch (question_type) {
                case "multiple_choice":
                  if (isReadOnly) {
                    input = (
                      <div className="mt-2 text-gray-700 font-medium">
                        {formatAnswer(currentAnswer, question_type)}
                      </div>
                    );
                  } else {
                    input = (
                      <div className="mt-2">
                        <div className="relative w-full">
                          <select
                            className="w-full border border-gray-300 rounded px-3 py-2 appearance-none cursor-pointer"
                            onChange={(e) => handleAnswerChange(question_id, e.target.value, question, question_type)}
                            value={currentAnswer as string || ""}
                          >
                            <option value="" disabled>Select an option</option>
                            {options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  break;

                case "yes_no":
                  if (isReadOnly) {
                    input = (
                      <div className="mt-2 text-gray-700 font-medium">
                        {formatAnswer(currentAnswer, question_type)}
                      </div>
                    );
                  } else {
                    input = (
                      <div className="mt-2 flex gap-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${question_id}-yes`}
                            name={question_id}
                            value="yes"
                            className="h-4 w-4"
                            checked={currentAnswer === true}
                            onChange={(e) => handleAnswerChange(question_id, e.target.value === "yes", question, question_type)}
                          />
                          <label htmlFor={`${question_id}-yes`}>Yes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${question_id}-no`}
                            name={question_id}
                            value="no"
                            className="h-4 w-4"
                            checked={currentAnswer === false}
                            onChange={(e) => handleAnswerChange(question_id, e.target.value === "yes", question, question_type)}
                          />
                          <label htmlFor={`${question_id}-no`}>No</label>
                        </div>
                      </div>
                    );
                  }
                  break;

                case "text":
                  if (isReadOnly) {
                    input = (
                      <div className="mt-2 text-gray-700 font-medium">
                        {formatAnswer(currentAnswer, question_type)}
                      </div>
                    );
                  } else {
                    input = (
                      <div className="mt-2">
                        <input
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your answer"
                          value={currentAnswer as string || ""}
                          onChange={(e) => handleAnswerChange(question_id, e.target.value, question, question_type)}
                        />
                      </div>
                    );
                  }
                  break;

                case "numeric":
                  if (isReadOnly) {
                    input = (
                      <div className="mt-2 text-gray-700 font-medium">
                        {formatAnswer(currentAnswer, question_type)}
                      </div>
                    );
                  } else {
                    const numericValue = currentAnswer !== undefined && currentAnswer !== null ? Number(currentAnswer) : "";
                    input = (
                      <div className="mt-2">
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter a number"
                          value={numericValue}
                          onChange={(e) => handleAnswerChange(question_id, Number(e.target.value), question, question_type)}
                        />
                      </div>
                    );
                  }
                  break;
              }

              return (
                <div key={question_id} className="mb-6">
                  <label>
                    {!isReadOnly && is_mandatory && <span className="text-red-500 mr-1">*</span>}
                    {question}
                  </label>
                  {input}
                </div>
              );
            })}

            {error && <p className="text-red-500 mb-4">{error}</p>}
          </form>
        </div>

        <div className="px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button onClick={handleSubmit} className="px-4 py-2 bg-button text-white rounded-md hover:bg-[#00163090]">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreeningModal;
