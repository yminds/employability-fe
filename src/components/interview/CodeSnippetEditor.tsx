import React from "react";

interface CodeSnippetEditorProps {
  question: string;
  onSubmission: (code: string) => void;
}

const CodeSnippetEditor: React.FC<CodeSnippetEditorProps> = ({
  question,
  onSubmission,
}) => {
  return (
    <div>
      <div className="text-black font-ubuntu">
        {question}
      </div>
      <textarea
        className="w-full h-96 p-4 border border-gray-300 rounded-lg"
        placeholder="Write your code here..."
      />
      <button
        className="bg-[#10B754] text-white rounded-[4px] font-semibold text-[16px] w-72 py-2"
        onClick={() => onSubmission("")}
      >
        Submit
      </button>
    </div>
  );
};

export default CodeSnippetEditor;
