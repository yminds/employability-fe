import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Info } from "lucide-react";
import { useGetInterviewQuestionsMutation } from "@/api/employerJobsApiSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface InterviewQuestion {
  id: string;
  question: string;
  category?: string;
  reasoning?: string;
}

interface InterviewQuestionsFormProps {
  interviewQuestions: InterviewQuestion[];
  setInterviewQuestions: Dispatch<SetStateAction<InterviewQuestion[]>>;
  jobTitle: string;
  jobDescription: string;
}

const InterviewQuestionsForm: React.FC<InterviewQuestionsFormProps> = ({
  interviewQuestions,
  setInterviewQuestions,
  jobTitle,
  jobDescription
}) => {
  const [showNewQuestionField, setShowNewQuestionField] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // API hook
  const [getInterviewQuestions, { isLoading }] = useGetInterviewQuestionsMutation();

  // Fetch AI question suggestions based on job title and description
  useEffect(() => {
    if (jobTitle && jobDescription && interviewQuestions.length === 0 && !isInitialized) {
      fetchAIQuestionSuggestions();
      setIsInitialized(true);
    }
  }, [jobTitle, jobDescription]);

  const fetchAIQuestionSuggestions = async () => {
    try {
      // Call the RTK Query mutation to get AI interview question suggestions
      const response = await getInterviewQuestions({
        jobTitle,
        jobDescription,
      }).unwrap();

      // Process the questions if successful
      if (response.success && response.data) {
        setInterviewQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching AI interview question suggestions:", error);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    const questionObj: InterviewQuestion = {
      id: `q_${Date.now()}`,
      question: newQuestion,
    };

    setInterviewQuestions([...interviewQuestions, questionObj]);
    setNewQuestion("");
    setShowNewQuestionField(false);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...interviewQuestions];
    updatedQuestions.splice(index, 1);
    setInterviewQuestions(updatedQuestions);
  };

  

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Do you have any specific questions you’d like to ask during the live interview for this job?</h2>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          The employAbility AI will pose these questions to the candidate during the live interview.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          We've recommended questions based on your job description, but you can add, edit, or remove them.
        </p>

        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            EmployAbility is analyzing your job description to suggest relevant interview questions...
          </div>
        )}

        {!isLoading && isInitialized && interviewQuestions.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            Employability has analyzed your job description and suggested {interviewQuestions.length} interview questions for this role.
          </div>
        )}

        {/* Existing questions list */}
        {interviewQuestions.length > 0 && (
          <div className="space-y-3 mb-4">
            {interviewQuestions.map((question, index) => (
              <div
                key={question.id}
                className={`flex justify-between items-center border border-gray-200 rounded-lg py-3 px-5`}
              >
                <div className="flex-grow font-normal text-sm">
                  {question.question}
                </div>
                <div className="flex items-center">
                  {/* Reasoning tooltip */}
                  {question.reasoning && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-blue-500 focus:outline-none p-1 mr-2"
                            aria-label="Question reasoning"
                          >
                            <Info size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs p-2">
                          <p>{question.reasoning}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-700 ml-2 h-8 w-8 p-0"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add question field */}
        {showNewQuestionField ? (
          <div className="mb-4">
            <div className="flex items-start">
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your interview question here..."
                className="flex-grow border border-gray-300 rounded-md mr-2"
                rows={2}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-700 mt-1"
                onClick={() => {
                  setShowNewQuestionField(false);
                  setNewQuestion("");
                }}
              >
                <Trash size={18} />
              </Button>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                type="button"
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setShowNewQuestionField(true)}
            variant="outline"
            className="flex items-center h-12 px-4 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionsForm;