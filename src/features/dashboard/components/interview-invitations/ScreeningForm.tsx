import React, { useState } from 'react';

// Define the types for the responses
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
}

const ScreeningModal: React.FC<ScreeningModalProps> = ({ isOpen, onClose, questions, onSubmit }) => {
  const [responses, setResponses] = useState<ScreeningResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (
    question_id: string,
    value: string | number | boolean | string[],
    question: string,
    question_type: "multiple_choice" | "yes_no" | "text" | "numeric"
  ) => {
    setResponses((prev) => {
      const existingIndex = prev.findIndex((r) => r.question_id === question_id);
      const updated = { question_id, question, question_type, answer: value };

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
    const missing = questions.filter((q) => {
      if (!q.is_mandatory) return false;
      const r = responses.find((res) => res.question_id === q.question_id);
      return r === undefined || r.answer === '' || r.answer === null;
    });

    if (missing.length > 0) {
      setError("Please answer all required questions.");
      return;
    }

    setError(null);
    onSubmit(responses);
    onClose(); // Close after submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Screening Questionnaire</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {questions.map(({ question_id, question_type, question, options, is_mandatory }) => {
            let input = null;

            switch (question_type) {
              case 'multiple_choice':
                input = options?.map((opt) => (
                  <label key={opt} className="block ml-4">
                    <input
                      type="radio"
                      name={question_id}
                      value={opt}
                      className="mr-2"
                      onChange={() => handleAnswerChange(question_id, opt, question, question_type)}
                    />
                    {opt}
                  </label>
                ));
                break;

              case 'yes_no':
                input = (
                  <div className="ml-4">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name={question_id}
                        value="yes"
                        onChange={() => handleAnswerChange(question_id, true, question, question_type)}
                        className="mr-1"
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={question_id}
                        value="no"
                        onChange={() => handleAnswerChange(question_id, false, question, question_type)}
                        className="mr-1"
                      />
                      No
                    </label>
                  </div>
                );
                break;

              case 'text':
                input = (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full mt-1"
                    onChange={(e) =>
                      handleAnswerChange(question_id, e.target.value, question, question_type)
                    }
                  />
                );
                break;

              case 'numeric':
                input = (
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-full mt-1"
                    onChange={(e) =>
                      handleAnswerChange(question_id, parseInt(e.target.value, 10), question, question_type)
                    }
                  />
                );
                break;

              default:
                break;
            }

            return (
              <div key={question_id} className="mb-4">
                <label className="block font-medium mb-1">
                  {question}
                  {is_mandatory && <span className="text-red-500"> *</span>}
                </label>
                {input}
              </div>
            );
          })}

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreeningModal;
