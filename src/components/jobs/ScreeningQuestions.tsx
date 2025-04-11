import React, { useState } from 'react';

interface Question {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

interface ScreeningQuestionsProps {
  questions: Question[];
  onSubmit: (responses: any[]) => void;
}

export const ScreeningQuestions: React.FC<ScreeningQuestionsProps> = ({
  questions,
  onSubmit
}) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResponseChange = (questionIndex: number, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
    
    // Clear error for this question if it exists
    if (errors[questionIndex]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionIndex];
        return newErrors;
      });
    }
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    questions.forEach((question, index) => {
      if (question.is_mandatory && (responses[index] === undefined || responses[index] === '')) {
        newErrors[index] = 'This question is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateResponses()) {
      const formattedResponses = questions.map((question, index) => ({
        question_id: `q_${index}`, // You might want to use actual IDs from your data
        question: question.question,
        question_type: question.type,
        answer: responses[index] || ''
      }));
      
      onSubmit(formattedResponses);
    }
  };

  const renderQuestionInput = (question: Question, index: number) => {
    switch (question.type) {
      case 'yes_no':
        return (
          <div className="mt-2">
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name={`question_${index}`}
                  value="Yes"
                  checked={responses[index] === "Yes"}
                  onChange={() => handleResponseChange(index, "Yes")}
                />
                <span className="ml-2">Yes</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name={`question_${index}`}
                  value="No"
                  checked={responses[index] === "No"}
                  onChange={() => handleResponseChange(index, "No")}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="mt-2">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={responses[index] || ''}
              onChange={(e) => handleResponseChange(index, e.target.value)}
            >
              <option value="">Select an option</option>
              {question.options?.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'numeric':
        return (
          <div className="mt-2">
            <input
              type="number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your total years of work experience"
              value={responses[index] || ''}
              onChange={(e) => handleResponseChange(index, e.target.value)}
            />
          </div>
        );
        
      case 'text':
      default:
        return (
          <div className="mt-2">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your answer"
              value={responses[index] || ''}
              onChange={(e) => handleResponseChange(index, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="flex">
              <span className="text-red-500 mr-1">{question.is_mandatory ? '*' : ''}</span>
              <p>{question.question}</p>
            </div>
            
            {renderQuestionInput(question, index)}
            
            {errors[index] && (
              <p className="mt-1 text-red-500 text-sm">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};