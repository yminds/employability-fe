import React from "react";

interface QuizActionbtnsProps {
  fundamentals: any;
  currentQuizTopic: string;
  onStartQuiz: (topic: string) => void;
  skipCurrentConcept: ()=> void;
  showSkipBtn: boolean
}

const QuizActionBtns: React.FC<QuizActionbtnsProps> = ({  currentQuizTopic, onStartQuiz,skipCurrentConcept,showSkipBtn = true }) => {
  console.log(currentQuizTopic)
  return (
    <section className="flex gap-5">
      {showSkipBtn && (
        <button className="text-body1" onClick={skipCurrentConcept}>Skip</button>
      )}
      <button
        onClick={() => onStartQuiz(currentQuizTopic)}
        className="bg-[#00163012] p-2 rounded-full text-body1"
      >
        Take test
      </button>
    </section>
  );
};

export default QuizActionBtns;
