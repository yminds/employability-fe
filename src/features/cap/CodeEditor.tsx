import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import OutputConsole, { OutputItem } from "./OutputConsole";
import TestCaseConsole from "./TestCaseConsole";

interface CodeEditorProps {
  placeholder: string;
  language: string;
  onSubmit: (code: string) => void;
  testCases: { input: string; expectedOutput: string; description: string }[];
}

const executeJavaScript = (code: string): OutputItem[] => {
  const output: OutputItem[] = [];
  const originalLog = console.log;
  
  try {
    // Override console.log temporarily
    console.log = (...args) => {
      const message = args.map(arg =>
        typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      ).join(" ");
      output.push({ type: "log", content: message });
    };
    
    // Execute code and get result
    const result = eval(code);
    
    // Add final result if it's not undefined
    if (result !== undefined) {
      output.push({
        type: "result",
        content: typeof result === "object" ? JSON.stringify(result, null, 2) : String(result),
      });
    }
    
    return output;
  } catch (error) {
    return [{ type: "error", content: (error as Error).message }];
  } finally {
    // Restore original console.log
    console.log = originalLog;
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  placeholder,
  language,
  onSubmit,
  testCases,
}) => {
  const [code, setCode] = useState<string>(placeholder);
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [testsExecuted, setTestsExecuted] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = () => {
    setIsSubmitted(false); // Reset to show OutputConsole
    if (language.toLowerCase() !== "javascript") {
      setOutput([{ type: "error", content: "Only JavaScript execution is supported at the moment." }]);
      return;
    }
    
    const executionOutput = executeJavaScript(code);
    setOutput(executionOutput);
  };

  const handleSubmit = () => {
    if (!testsExecuted) {
      setIsSubmitted(true);
      setTestsExecuted(true);
    } else {
      onSubmit(code);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full h-[80%] rounded-lg">
        <div className="bg-[#11df7c] px-3.5 py-2.5 rounded-t-lg flex flex-row items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[#05733E] text-base font-normal leading-[17px]">
              Language :
            </span>
            <span className="text-[#0D0D0D] text-base font-medium leading-6">
              {language}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              className="text-[#05733E] text-sm font-medium hover:text-[#0D0D0D]"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              className="text-[#05733E] text-sm font-medium hover:text-[#0D0D0D]"
            >
              {testsExecuted ? "Submit" : "Test"}
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-48px)] border border-black/10 rounded-b-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={language.toLowerCase()}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </div>
      <div className="h-[20%] flex flex-col gap-4">
        {isSubmitted ? (
          <div>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[#05733E] text-sm font-medium hover:text-[#0D0D0D]"
              >
                Back to Console
              </button>
            </div>
            <TestCaseConsole testCases={testCases} code={code} />
          </div>
        ) : (
          <OutputConsole output={output} />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
