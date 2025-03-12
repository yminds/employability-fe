import React from "react";

interface QuizActionbtnsProps {
  fundamentals: any;
  currentQuizTopic: string;
  onStartQuiz: (topic: string) => void;
  skipCurrentConcept: () => void;
  showSkipBtn: boolean;
}

const QuizActionBtns: React.FC<QuizActionbtnsProps> = ({
  currentQuizTopic,
  onStartQuiz,
  skipCurrentConcept,
  showSkipBtn = true,
}) => {
  console.log(currentQuizTopic);
  return (
    <section className="flex gap-[13px] max-h-[35px] max-w-[147px]">
      {showSkipBtn && (
        <button
          className="text-body1 relative group"
          onClick={skipCurrentConcept}
        >
          Skip
          {/* Tooltip */}
          <span className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#00163012] text-xs rounded py-1 px-2 whitespace-nowrap">
            Skip current concept
          </span>
        </button>
      )}
      <button
        onClick={() => onStartQuiz(currentQuizTopic)}
        className={`bg-[#00163012] px-[10px] rounded-full text-body1 h-[35px] w-[102px] flex items-center justify-center ${!showSkipBtn ? "mt-3 " : ""}`}
      >
        Take test
      </button>
    </section>
  );
};

export default QuizActionBtns;
