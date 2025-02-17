import React from "react";
import MonacoEditor from "@monaco-editor/react";

const CodeSnippetQuestion: React.FC<{
  question: string;
  codeSnippet: string;
}> = ({ question, codeSnippet }) => {
  return (
    <div className="flex flex-col gap-4 relative w-full rounded-xl h-[50vh]">
      <div className="font-medium text-lg">{question}</div>
      <div className="rounded-lg overflow-hidden bg-[#1e1e1e] h-full px-3">
        <MonacoEditor
          className="h-full"
          value={codeSnippet}
          theme="vs-dark"
          language="javascript" // need to disable later
          options={{
            readOnly: true,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            lineNumbers: "off",
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            scrollBeyondLastLine: false,
            renderValidationDecorations: "off",
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            }
          }}
        />
      </div>
    </div>
  );
};

export default CodeSnippetQuestion;
