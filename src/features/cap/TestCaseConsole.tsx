import React, { useState, useEffect } from "react";

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface TestResult {
  passed: boolean;
  description: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
}

interface TestCaseConsoleProps {
  testCases: TestCase[];
  code: string;
  language?: string;
}

const executeTestCase = (code: string, input: string): any => {
  try {
    // Create a function from the code and input
    const fullCode = `${code}\nflattenArray(${input})`;
    return eval(fullCode);
  } catch (error) {
    return (error as Error).message;
  }
};

const executePythonTestCase = async (code: string, input: string): Promise<any> => {
  const trimmedCode = code.trim();

  // Create the code to execute without extra indentation
  const codeToExecute = `${trimmedCode}

result = flattenArray(${input})
print(result)`;  // Just print the result without "Result:" prefix

  const runPython = async () => {
    if (!(window as any).Sk) {
      return "Skulpt is not loaded";
    }

    function builtinRead(x: string) {
      if ((window as any).Sk.builtinFiles === undefined || (window as any).Sk.builtinFiles["files"][x] === undefined) {
        throw `File not found: '${x}'`;
      }
      return (window as any).Sk.builtinFiles["files"][x];
    }
    
    let output = "";
    (window as any).Sk.configure({
      output: (text: string) => {
        output = text.trim(); // Store the output and trim whitespace
      },
      read: builtinRead,
      __future__: (window as any).Sk.python3,
    });

    try {
      // Execute Python code
      await (window as any).Sk.misceval.asyncToPromise(() => {
        return (window as any).Sk.importMainWithBody("<stdin>", false, codeToExecute, true);
      });
      return output;
    } catch (err) {
      console.error("Python execution error:", err);
      return String(err);
    }
  };

  try {
    return await runPython();
  } catch (err) {
    console.error("Failed to run Python:", err);
    return String(err);
  }
};

// Helper function to parse output from different languages
const parseOutput = (output: string, language: string): any => {
  if (language === "python") {
    try {
      // Try to parse the Python output as JSON
      // Remove any "Result:" prefix if it exists
      const cleanOutput = output.replace(/^Result:\s*/, "").trim();
      return JSON.parse(cleanOutput);
    } catch (e) {
      // If parsing fails, return as is
      return output;
    }
  }
  return output;
};

// Helper function to compare results
const compareResults = (actual: any, expected: any): boolean => {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length && 
           actual.every((val, idx) => val === expected[idx]);
  }
  return actual === expected;
};

const TestCaseConsole: React.FC<TestCaseConsoleProps> = ({ testCases, code, language = "javascript" }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      setLoading(true);
      
      const testResults = await Promise.all(
        testCases.map(async (testCase) => {
          let actualOutput;
          
          if (language === "python") {
            actualOutput = await executePythonTestCase(code, testCase.input);
          } else {
            actualOutput = executeTestCase(code, testCase.input);
          }
          
          const expectedOutputValue = JSON.parse(testCase.expectedOutput);
          const parsedActualOutput = parseOutput(actualOutput, language);
          
          const passed = compareResults(parsedActualOutput, expectedOutputValue);
          
          return {
            passed,
            description: testCase.description,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: JSON.stringify(parsedActualOutput),
          };
        })
      );
      
      setResults(testResults);
      setLoading(false);
    };
    
    runTests();
  }, [testCases, code, language]);

  const passedTests = results.filter((r) => r.passed).length;

  if (loading) {
    return (
      <div className="border border-black/10 rounded-lg overflow-hidden">
        <div className="bg-[#11df7c] px-3.5 py-2.5">
          <h3 className="text-[#05733E] text-base font-medium">Running tests...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-black/10 rounded-lg overflow-hidden">
      <div className="bg-[#11df7c] px-3.5 py-2.5">
        <h3 className="text-[#05733E] text-base font-medium">
          Test Cases ({passedTests}/{testCases.length} passing)
        </h3>
      </div>
      <div className="max-h-[200px] overflow-y-auto p-4 bg-[#1e1e1e] text-white">
        {results.map((result, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2">
              <span className={result.passed ? "text-green-500" : "text-red-500"}>
                {result.passed ? "✓" : "✗"}
              </span>
              <span className="font-medium">{result.description}</span>
            </div>
            {!result.passed && (
              <div className="mt-2 pl-6 text-sm">
                <div className="text-gray-400">Input: {result.input}</div>
                <div className="text-gray-400">Expected: {result.expectedOutput}</div>
                <div className="text-red-400">Actual: {result.actualOutput}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCaseConsole;