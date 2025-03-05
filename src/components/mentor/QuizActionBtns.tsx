import React from "react";

interface QuizActionbtnsProps {
  fundamentals: any;
  currentQuizTopic: string;
  onStartQuiz: (topic: string) => void;
  skipCurrentConcept: ()=> void;
}

const QuizActionBtns: React.FC<QuizActionbtnsProps> = ({ fundamentals, currentQuizTopic, onStartQuiz,skipCurrentConcept }) => {
  return (
    <section className="flex gap-5">
      <button className="text-body1" onClick={skipCurrentConcept}>Skip</button>
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
