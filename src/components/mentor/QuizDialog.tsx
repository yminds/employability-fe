import React, { useEffect, useCallback, useState } from "react";
import QuizQuestions from "./QuizQuestions";
import { useGenerateQuizQuestionsMutation } from "@/api/mentorChatApiSlice";

interface QuizDialogProps {
  currentQuizTopic: string;
  onClose: () => void;
  finalScore: (score:number) => void;
  user_id: string|undefined;
  thread_id: string;
  experience_level : string | undefined
}

const QuizDialog: React.FC<QuizDialogProps> = ({ currentQuizTopic, onClose, finalScore,user_id, thread_id, experience_level }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);

  // Fetch quiz questions
  const [generateQuizQuestions, { isLoading, error }] = useGenerateQuizQuestionsMutation();

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (!currentQuizTopic) return;
      try {
        const response = await generateQuizQuestions({ topic: currentQuizTopic, user_id:user_id, thread_id:thread_id, experience_level:experience_level })
        console.log(response)
        const regex = /```json\s*([\s\S]+?)\s*```/gm;
        const match = regex.exec(response?.data.data[0].text); 
        console.log(match)
        if (match) {
        const jsonString = match[1];
        const quizQuestions = JSON.parse(jsonString);
        setQuestions(quizQuestions);
        }
      } catch (err) {
        console.error("Error generating quiz:", err);
      }
    };

    fetchQuizQuestions();
  }, [currentQuizTopic, generateQuizQuestions]);

  // Handle outside click to close modal
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const modal = document.getElementById("quiz-modal");
      if (modal && !modal.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose, handleOutsideClick]);

  // Handle next question
  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen">
      <div
        id="quiz-modal"
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl transition-transform duration-300 transform scale-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quiz: {currentQuizTopic}
        </h2>

        {isLoading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load questions. Please try again.</p>
        ) : !questions.length ? (
          <p className="text-gray-500">No questions available.</p>
        ) : !quizFinished ? (
          <>
            <QuizQuestions
              questionIndex={currentQuestionIndex}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              questions={questions}
            />

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-md text-white 
                  ${selectedOption ? "bg-[#001630] hover:bg-[#062549]" : "bg-gray-400 cursor-not-allowed"}`}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-bold">Quiz Completed!</h3>
            <p className="text-xl mt-2">Your Score: {score} / {questions.length}</p>
            <button
              onClick={()=>{finalScore(score);onClose}}
              className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md font-ubuntu"
            >
              Close Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDialog;
