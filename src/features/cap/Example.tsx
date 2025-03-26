import CodeAssessmentPanel from "./CodeAssessmentPanel";

const Example = () => {
  return (
    <div className="w-full h-screen bg-white">
      <CodeAssessmentPanel
        question={[
          {
            language: "JavaScript",
            description: `
Write a JavaScript function flattenArray(arr) that takes a nested array as input and returns a flattened version of that array.

### Function Description:
- **Input**: An array that may contain multiple levels of nested arrays.
- **Output**: A single flat array containing all the values from the nested arrays.
- The function should handle **any level of nesting**.
- The order of elements in the output should maintain the order from left to right in the input.

### Example:
\`\`\`javascript
Input: [[1, [2, 3]], [4, [5, 6]], 7, 8]
Output: [1, 2, 3, 4, 5, 6, 7, 8]
\`\`\``,
question:`function flattenArray(arr) {
    // Your code here
    return [];
}`

          },
          {
            language: "Python",
            description: `
Write a Python function flattenArray(arr) that takes a nested array as input and returns a flattened version of that array.
            
### Function Description:
- **Input**: An array that may contain multiple levels of nested arrays.
- **Output**: A single flat array containing all the values from the nested arrays.
- The function should handle **any level of nesting**.
- The order of elements in the output should maintain the order from left to right in the input.
            
### Example:
\`\`\`python
Input: [[1, [2, 3]], [4, [5, 6]], 7, 8]
Output: [1, 2, 3, 4, 5, 6, 7, 8]
 \`\`\`
            `,
            question: `def flattenArray(arr):
    # Your code here
    return []`,
          },
        ]}
        testCases={[
          {
            input: "[[1, [2, 3]], [4, [5, 6]], 7, 8]",
            expectedOutput: "[1,2,3,4,5,6,7,8]",
            description: "Basic nested array",
          },
          {
            input: "[[]]",
            expectedOutput: "[]",
            description: "Empty nested array",
          },
        ]}
        language="JavaScript"
        questionNumber={5}
        timeLimit={90}
        onSubmit={(code) => {
          console.log(code);
        }}
      />
    </div>
  );
};

export default Example;
