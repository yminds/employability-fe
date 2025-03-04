import React from "react";

interface QuizQuestionsProps {
  questionIndex: number;
  setSelectedOption: (option: string | null) => void;
  selectedOption: string | null;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
  // When true, highlight the correct answer and mark incorrect selection
  revealAnswer?: boolean;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({
  questionIndex,
  setSelectedOption,
  selectedOption,
  questions,
  revealAnswer = false,
}) => {
  const currentQuestion = questions[questionIndex];

  return (
    <div className="p-6 w-full max-w-lg bg-white shadow-md rounded-md">
      {/* Question Header */}
      <h2 className="text-lg font-semibold mb-4">
        Question {questionIndex + 1}
      </h2>

      {/* Question Text */}
      <p className="mb-4 font-medium">{currentQuestion.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, index) => {
          let optionClass =
            "flex items-center p-3 border rounded-md cursor-pointer ";

          if (revealAnswer) {
            if (option === currentQuestion.answer) {
              optionClass += "border-green-500 bg-green-50";
            } else if (selectedOption === option && option !== currentQuestion.answer) {
              optionClass += "border-red-500 bg-red-50";
            } else {
              optionClass += "border-gray-300";
            }
          } else {
            optionClass +=
              selectedOption === option
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300";
          }

          return (
            <label key={index} className={optionClass}>
              <input
                type="radio"
                name="quiz-option"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                className="mr-3"
                disabled={revealAnswer} // optionally disable when answer is revealed
              />
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestions;
