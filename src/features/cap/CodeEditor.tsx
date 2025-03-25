import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import OutputConsole, { OutputItem } from "./OutputConsole";
import TestCaseConsole from "./TestCaseConsole";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type SupportedLanguage = "JavaScript" | "Python";

interface CodeEditorProps {
  placeholder: string;
  language: SupportedLanguage;
  onSubmit: (code: string) => void;
  testCases: { input: string; expectedOutput: string; description: string }[];
  setSelectedLanguage: (language: SupportedLanguage) => void;
}

const executeJavaScript = (code: string): OutputItem[] => {
  const output: OutputItem[] = [];
  const originalLog = console.log;
  console.log("code", code);

  const codeToExecute = `
   ${code}
   flattenArray([[1, [2, 3]], [4, [5, 6]], 7, 8])
  `;

  try {
    // Override console.log temporarily
    console.log = (...args) => {
      const message = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ");
      output.push({ type: "log", content: message });
    };

    // Execute code and get result
    const result = eval(codeToExecute);
    console.log("result", result);

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

// ... existing code ...
const executePython = async (code: string): Promise<any> => {
  // Remove any leading/trailing whitespace from the code
  const trimmedCode = code.trim();
  
  // Create the code to execute without extra indentation
  const codeToExecute = 
`${trimmedCode}

result = flattenArray([[1, [2, 3]], [4, [5, 6]], 7, 8])
print("Result:", result)`;

  const runPython = async () => {
    if (!(window as any).Sk) {
      return [{ type: "error", content: "Skulpt is not loaded" }];
    }

    function builtinRead(x: string) {
      if ((window as any).Sk.builtinFiles === undefined || (window as any).Sk.builtinFiles["files"][x] === undefined) {
        throw `File not found: '${x}'`;
      }
      return (window as any).Sk.builtinFiles["files"][x];
    }

    const output: OutputItem[] = [];

    (window as any).Sk.configure({
      output: (text: string) => output.push({ type: "result", content: text }),
      read: builtinRead,
      __future__: (window as any).Sk.python3,
    });

    try {
      console.log("codeToExecute", codeToExecute);
      
      // Execute Python code
      await (window as any).Sk.misceval.asyncToPromise(() => {
        return (window as any).Sk.importMainWithBody("<stdin>", false, codeToExecute, true);
      });
      
    } catch (err) {
      console.error("Python execution error:", err);
      output.push({ 
        type: "error", 
        content: err ? (err.toString ? err.toString() : JSON.stringify(err)) : "Unknown error in Python execution" 
      });
    }

    return output;
  };

  try {
    const output = await runPython();
    console.log("output", output);
    return output; // Return the actual output
  } catch (err) {
    console.error("Failed to run Python:", err);
    return [{ type: "error", content: `Failed to run Python: ${err}` }];
  }
};
// ... existing code ...

const CodeEditor: React.FC<CodeEditorProps> = ({ placeholder, language, onSubmit, testCases, setSelectedLanguage }) => {
  const [code, setCode] = useState<string>(placeholder);
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [testsExecuted, setTestsExecuted] = useState<boolean>(false);

  // Update code when placeholder changes (when language changes)
  useEffect(() => {
    setCode(placeholder);
  }, [placeholder]);



  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun =async () => {
    setIsSubmitted(false); // Reset to show OutputConsole

    let executionOutput: OutputItem[] = [];
    switch (language) {
      case "JavaScript":
        executionOutput = executeJavaScript(code);
        break;
      case "Python":
        executionOutput =await executePython(code);
        break;
      default:
        executionOutput = [{ type: "error", content: "Unsupported language." }];
    }

    setOutput(executionOutput);
  };

  const handleSubmit = () => {
    if (!testsExecuted) {
      setIsSubmitted(true);
      setTestsExecuted(true);
    } else {
      onSubmit(code);
      setIsSubmitted(false);  
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full h-[80%] rounded-lg">
        <div className="bg-[#11df7c] px-3.5 py-2.5 rounded-t-lg flex flex-row items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[#05733E] text-base font-normal leading-[17px]">Language :</span>
            <span className="text-[#0D0D0D] text-base font-medium leading-6">
              <DropdownMenu>
                <DropdownMenuTrigger>{language}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("JavaScript")}>JavaScript</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("Python")}>Python</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRun} className="text-[#05733E] text-sm font-medium hover:text-[#0D0D0D]">
              Run
            </button>
            <button onClick={handleSubmit} className="text-[#05733E] text-sm font-medium hover:text-[#0D0D0D]">
              {testsExecuted ? "Submit" : "Test"}
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-48px)] border border-black/10 rounded-b-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={language === "JavaScript" ? "javascript" : "python"}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              "folding": false,
              "matchBrackets": "never",
              "renderValidationDecorations": "off"
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
            <TestCaseConsole testCases={testCases} code={code} language={language?.toLocaleLowerCase()} />
          </div>
        ) : (
          <OutputConsole output={output} />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
