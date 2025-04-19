import React, { useState } from 'react';

interface ISnippet{
    question: string;
    code: string;
    userAnswer: string;
    rating: number;
    remarks: string;
    
}
const CodeSnippetComponent = ({ snippets }: { snippets: ISnippet[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => prev < snippets.length - 1 ? prev + 1 : prev);
  };
  
  if (!snippets || snippets.length === 0) {
    return <div className="text-center p-4 text-gray-500">No code snippets available</div>;
  }
  
  const currentSnippet = snippets[currentIndex];
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md font-dm-sans">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Code Snippets: Q{currentIndex + 1}/{snippets.length}</h3>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevious} 
            className="border border-gray-200 rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentIndex === 0}
            aria-label="Previous snippet"
          >
            &#10094;
          </button>
          <button 
            onClick={handleNext} 
            className="border border-gray-200 rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentIndex === snippets.length - 1}
            aria-label="Next snippet"
          >
            &#10095;
          </button>
        </div>
      </div>
      
      <div className={`flex items-center gap-3 p-4 mb-4 rounded-md ${
        currentSnippet.rating <= 2 ? 'bg-red-50' : 'bg-green-50'
      }`}>
        <div className="text-xl">
          {currentSnippet.rating <= 2 ? '⚠️' : '✅'}
        </div>
        <div className="text-sm">
          {currentSnippet.remarks}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-lg mb-2">Problem Statement</h4>
        <p className="text-gray-700">{currentSnippet.question}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-lg mb-2">User Code Snippet</h4>
        <div className="relative bg-gray-50 rounded-md border border-gray-200">
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{currentSnippet.code}</code>
          </pre>
          <button 
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100 transition-colors"
            aria-label="Copy code"
          >
            <span>📋</span> Copy
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-lg mb-2">User Answer</h4>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200">{currentSnippet.userAnswer}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-lg mb-2">Assessment</h4>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Rating:</span>
            <span className={`font-bold ${
              currentSnippet.rating <= 2 ? 'text-red-600' : 
              currentSnippet.rating === 3 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {currentSnippet.rating}/5
            </span>
          </div>
          <p className="text-gray-700">{currentSnippet.remarks}</p>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetComponent;