import React, { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Edit } from "lucide-react";

export interface InterviewQuestion {
  id: string;
  question: string;

}

interface InterviewQuestionsFormProps {
  interviewQuestions: InterviewQuestion[];
  // Fix: Use Dispatch<SetStateAction<>> type to match React's useState setter
  setInterviewQuestions: Dispatch<SetStateAction<InterviewQuestion[]>>;
}

const InterviewQuestionsForm: React.FC<InterviewQuestionsFormProps> = ({
  interviewQuestions,
  setInterviewQuestions
}) => {
  const [showNewQuestionField, setShowNewQuestionField] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

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
          <h2 className="text-lg font-medium">Do you have any specific questions you’d like to ask during the live interview for this job?</h2>
         
        </div>
        <p className="text-sm text-gray-500 mb-6">
          The employability AI will pose these questions to the candidate during the live interview.
        </p>

        {/* Existing questions list */}
        {interviewQuestions.length > 0 && (
          <div className="space-y-3 mb-4">
            {interviewQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex justify-between items-center border border-gray-200 rounded-full py-3 px-5 bg-gray-50"
              >
                <div className="flex-grow font-normal text-sm">
                  {question.question}
                </div>
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
                placeholder="Question"
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