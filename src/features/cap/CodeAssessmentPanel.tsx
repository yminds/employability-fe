import React from "react";
import QuestionHeader from "./QuestionHeader";
import ReactMarkdown from "react-markdown";
import CodeEditor from "./CodeEditor";

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface CodeAssessmentPanelProps {
  language: string;
  questionNumber: number;
  question: string;
  testCases: TestCase[];
  timeLimit: number;
  onSubmit: (code: string) => void;
}

const CodeAssessmentPanel: React.FC<CodeAssessmentPanelProps> = ({
  question,
  testCases,
  language,
  questionNumber,
  timeLimit,
  onSubmit,
}) => {
  return (
    <div className="flex flex-row gap-6 p-4 bg-white mx-auto w-11/12 h-[calc(100vh-4rem)] my-8">
      <div className="w-1/3 rounded-xl border border-black/10 bg-[#f6fefa] p-6 flex flex-col gap-10 overflow-y-auto">
        <QuestionHeader questionNumber={questionNumber} timeLimit={timeLimit} />
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{question}</ReactMarkdown>
        </div>
        {/* TODO: Add question content and test cases display */}
      </div>
      <div className="w-2/3 ">
        <CodeEditor
          testCases={testCases}
          placeholder={`function flattenArray(arr) {
    // Your code here
    return [];
}`}
          language={language}
          onSubmit={(code) => {
            onSubmit(code);
          }}
        />
      </div>
    </div>
  );
};

export default CodeAssessmentPanel;
