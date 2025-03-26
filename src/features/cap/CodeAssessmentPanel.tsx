import React, { useState } from "react";
import QuestionHeader from "./QuestionHeader";
import ReactMarkdown from "react-markdown";
import CodeEditor from "./CodeEditor";

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

// Import SupportedLanguage type from CodeEditor
type SupportedLanguage = "JavaScript" | "Python";

interface CodeAssessmentPanelProps {
  language: SupportedLanguage;
  questionNumber: number;
  question: any[];
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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const questionContent = question.find((q) => q.language === selectedLanguage)?.description;
  const currentQuestion = question.find((q) => q.language === selectedLanguage)?.question;
  console.log("currentQuestion", currentQuestion);
  return (
    <div className="flex flex-row gap-6 p-4 bg-white mx-auto w-11/12 h-[calc(100vh-4rem)] my-8">
      <div className="w-1/3 rounded-xl border border-black/10 bg-[#f6fefa] p-6 flex flex-col gap-10 overflow-y-auto">
        <QuestionHeader questionNumber={questionNumber} timeLimit={timeLimit} />
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{questionContent}</ReactMarkdown>
        </div>
        {/* TODO: Add question content and test cases display */}
      </div>
      <div className="w-2/3 ">
        <CodeEditor
          testCases={testCases}
          placeholder={currentQuestion}
          language={selectedLanguage}
          onSubmit={(code) => {
            onSubmit(code);
          }}
          setSelectedLanguage={setSelectedLanguage}
        />
      </div>
    </div>
  );
};

export default CodeAssessmentPanel;
