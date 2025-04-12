import React, { useState } from "react";
import QuestionHeader from "./QuestionHeader";
import ReactMarkdown from "react-markdown";
import CodeEditor from "./CodeEditor";
import { IDsaQuestionResponse } from "@/components/interview/Interview";

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

// Import SupportedLanguage type from CodeEditor
type SupportedLanguage = "javascript" | "python";

interface CodeAssessmentPanelProps {
  language: SupportedLanguage;
  questionNumber: number;
  question: any[];
  testCases: TestCase[];
  timeLimit: number;
  onSubmit: (code: string) => void;
  handleDsaQuestionSubmit: (code: IDsaQuestionResponse) => void;
}

const CodeAssessmentPanel: React.FC<CodeAssessmentPanelProps> = ({
  question,
  testCases,
  language,
  questionNumber,
  timeLimit,
  onSubmit,
  handleDsaQuestionSubmit,
}) => {
  console.log("new language", language);

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    language?.toLowerCase() as SupportedLanguage
  );
  const questionContent = question.find((q) => q.language?.toLowerCase() === language)?.description;
  const currentQuestion = question.find((q) => q.language?.toLowerCase() === language)?.code;
  console.log("currentQuestion", question);
  console.log("language", selectedLanguage);
  const codeEditorRef = React.useRef<any>(null);

  return (
    <div className="flex flex-row gap-6   mx-auto w-12/12 h-[calc(79vh-4rem)] my-8">
      <div className="w-1/3 rounded-xl border border-black/10 bg-[#f6fefa] p-6 flex flex-col gap-10 overflow-y-auto">
        <QuestionHeader
          questionNumber={questionNumber}
          timeLimit={timeLimit}
          timesUp={() => {
            codeEditorRef.current?.submitUserCode();
          }}
        />
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{questionContent}</ReactMarkdown>
        </div>
        {/* TODO: Add question content and test cases display */}
      </div>
      <div className="w-2/3 ">
        <CodeEditor
          ref={codeEditorRef}
          testCases={testCases}
          placeholder={currentQuestion}
          language={language}
          onSubmit={(code) => {
            onSubmit(code);
          }}
          setSelectedLanguage={setSelectedLanguage}
          functionName={question.find((q) => q.language?.toLowerCase() === language)?.functionName}
          handleDsaQuestionSubmit={handleDsaQuestionSubmit}
        />
      </div>
    </div>
  );
};

export default CodeAssessmentPanel;
