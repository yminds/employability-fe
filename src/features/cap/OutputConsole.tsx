import React from "react";

export type OutputItem = {
  type: 'log' | 'error' | 'result';
  content: string;
};

interface OutputConsoleProps {
  output: OutputItem[];
}

const OutputConsole: React.FC<OutputConsoleProps> = ({ output }) => {
  console.log("output", output);
  
  return (
    <div className="h-full w-full bg-[#1e1e1e] text-white rounded-lg overflow-y-auto p-4">
      <div className="font-mono text-sm">
        {output.length === 0 ? (
          <span className="text-gray-400">// Output will appear here...</span>
        ) : (
          output.map((item, index) => (
            <div
              key={index}
              className={`mb-1 ${
                item.type === 'error'
                  ? 'text-red-400'
                  : item.type === 'result'
                  ? 'text-green-400'
                  : 'text-white'
              }`}
            >
              {item.type === 'log' && '> '}
              {item.type === 'error' && '✖ '}
              {item.type === 'result' && '← '}
              {item.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OutputConsole; 