import React, { useEffect, useCallback, useState } from "react";
import QuizQuestions from "./QuizQuestions";
import { useGenerateQuizQuestionsMutation } from "@/api/mentorChatApiSlice";

interface QuizDialogProps {
  fundamentals: any;
  currentQuizTopic: string;
  onClose: () => void;
  finalScore: (result: { score: number, correctAnswers: AnswerRecord[], wrongAnswers: AnswerRecord[] }) => void;
  user_id: string | undefined;
  thread_id: string;
  experience_level: string | undefined;
  canTakeFinalQuiz: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface AnswerRecord {
  question: string;
  selectedOption: string;
  correctAnswer: string;
}

const QuizDialog: React.FC<QuizDialogProps> = ({
  canTakeFinalQuiz,
  fundamentals,
  currentQuizTopic,
  onClose,
  finalScore,
  user_id,
  thread_id,
  experience_level,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<AnswerRecord[]>([]);

  // Fetch quiz questions
  const [generateQuizQuestions, { isLoading, error }] = useGenerateQuizQuestionsMutation();

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (!currentQuizTopic && !canTakeFinalQuiz) return;
      
      try {
        // Use fundamentals as the topic parameter if canTakeFinalQuiz is true
        const topicToUse = canTakeFinalQuiz ? fundamentals : currentQuizTopic;
        const quizType = canTakeFinalQuiz ? "FinalQuiz" : "TopicQuiz";
        
        const response = await generateQuizQuestions({
          topic: topicToUse,
          user_id,
          thread_id,
          experience_level,
          quizType
        });
        
        console.log(response);
        const regex = /```json\s*([\s\S]+?)\s*```/gm;
        const match = regex.exec(response?.data.data[0].text);
        console.log(match);
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
  }, [currentQuizTopic, generateQuizQuestions, user_id, thread_id, experience_level, canTakeFinalQuiz, fundamentals]);

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
    if (!questions.length) return;
    const currentQuestion = questions[currentQuestionIndex];
    const answerRecord: AnswerRecord = {
      question: currentQuestion.question,
      selectedOption: selectedOption as string,
      correctAnswer: currentQuestion.answer,
    };

    // Prepare new answers list and update score if correct
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerRecord;
    const isCorrect = selectedOption === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestionIndex < questions.length - 1) {
      setUserAnswers(newUserAnswers);
      setScore(newScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Last question: update state and compute analysis data
      setUserAnswers(newUserAnswers);
      setScore(newScore);
      const correctAnswers = newUserAnswers.filter(
        (record) => record.selectedOption === record.correctAnswer
      );
      const wrongAnswers = newUserAnswers.filter(
        (record) => record.selectedOption !== record.correctAnswer
      );
      // Return analysis data to the parent component
      finalScore({ score: newScore, correctAnswers, wrongAnswers });
      onClose();
    }
  };

  // Handle previous question (restores previously selected answer)
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(userAnswers[currentQuestionIndex - 1]?.selectedOption || null);
    }
  };

  // Determine the title to display based on whether it's a final quiz or regular topic quiz
  const quizTitle = canTakeFinalQuiz ? "Final Assessment" : `Quiz: ${currentQuizTopic}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen">
      <div
        id="quiz-modal"
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl transition-transform duration-300 transform scale-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {quizTitle}
        </h2>

        {isLoading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load questions. Please try again.</p>
        ) : !questions.length ? (
          <p className="text-gray-500">No questions available.</p>
        ) : (
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
                    : "text-[#001630] bg-white border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedOption ? "bg-[#001630] hover:bg-[#062549]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizDialog;