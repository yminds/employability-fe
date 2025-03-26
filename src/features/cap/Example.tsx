import { IDsaQuestionResponse } from "@/components/interview/Interview";
import CodeAssessmentPanel from "./CodeAssessmentPanel";

// [
//   {
//     language: "JavaScript",
//     description: `
// Write a JavaScript function flattenArray(arr) that takes a nested array as input and returns a flattened version of that array.

// ### Function Description:
// - **Input**: An array that may contain multiple levels of nested arrays.
// - **Output**: A single flat array containing all the values from the nested arrays.
// - The function should handle **any level of nesting**.
// - The order of elements in the output should maintain the order from left to right in the input.

// ### Example:
// \`\`\`javascript
// Input: [[1, [2, 3]], [4, [5, 6]], 7, 8]
// Output: [1, 2, 3, 4, 5, 6, 7, 8]
// \`\`\``,
// question:`function flattenArray(arr) {
// // Your code here
// return [];
// }`

//   },
//   {
//     language: "Python",
//     description: `
// Write a Python function flattenArray(arr) that takes a nested array as input and returns a flattened version of that array.

// ### Function Description:
// - **Input**: An array that may contain multiple levels of nested arrays.
// - **Output**: A single flat array containing all the values from the nested arrays.
// - The function should handle **any level of nesting**.
// - The order of elements in the output should maintain the order from left to right in the input.

// ### Example:
// \`\`\`python
// Input: [[1, [2, 3]], [4, [5, 6]], 7, 8]
// Output: [1, 2, 3, 4, 5, 6, 7, 8]
// \`\`\`
//     `,
//     question: `def flattenArray(arr):
// # Your code here
// return []`,
//   },
// ]}
// testCases={[
//   {
//     input: "[[1, [2, 3]], [4, [5, 6]], 7, 8]",
//     expectedOutput: "[1,2,3,4,5,6,7,8]",
//     description: "Basic nested array",
//   },
//   {
//     input: "[[]]",
//     expectedOutput: "[]",
//     description: "Empty nested array",
//   },
// ]
interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}
interface Question {
  language: string;
  description: string;
  question: string;
  testCases: TestCase[];
  functionName: string;
  code: string;
}
interface CodeAssessmentPanelProps {
  question: Question;
  handleDsaQuestionSubmit: (code: IDsaQuestionResponse) => void;
}

const Example = ({ question, handleDsaQuestionSubmit }: CodeAssessmentPanelProps) => {
  console.log("question", question);

  return (
    <div className="w-full h-full ">
      <CodeAssessmentPanel
        question={[
          {
            question: question?.question,
            description: `${question?.description} \n
         
 ## Example 1:
Input: ${question?.testCases[0]?.input} \n
Output: ${question?.testCases[0]?.expectedOutput} \n
Explanation: The answer is "abc", with the length of 3.
            `,
            code: question?.code,
            functionName: question?.functionName,
            language: question?.language,
          },
        ]}
        testCases={question?.testCases}
        language={question?.language?.toLocaleLowerCase() as "javascript" | "python"}
        questionNumber={5}
        timeLimit={60 * 15}
        onSubmit={(code) => {
          console.log(code);
        }}
        handleDsaQuestionSubmit={handleDsaQuestionSubmit}
      />
    </div>
  );
};

export default Example;
