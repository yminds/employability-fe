import React from "react";

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

const TestCaseConsole: React.FC<TestCaseConsoleProps> = ({ testCases, code }) => {
  const runTestCases = (): TestResult[] => {
    return testCases.map((testCase) => {
      const actualOutput = executeTestCase(code, testCase.input);
      const expectedOutputValue = JSON.parse(testCase.expectedOutput);
      
      // Compare arrays for equality
      const passed = Array.isArray(actualOutput) && 
        Array.isArray(expectedOutputValue) &&
        actualOutput.length === expectedOutputValue.length &&
        actualOutput.every((val, index) => val === expectedOutputValue[index]);

      return {
        passed,
        description: testCase.description,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: JSON.stringify(actualOutput)
      };
    });
  };

  const results = runTestCases();
  const passedTests = results.filter(r => r.passed).length;

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
              <span className={`text-${result.passed ? 'green' : 'red'}-500`}>
                {result.passed ? '✓' : '✗'}
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