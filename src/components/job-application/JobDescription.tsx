import React from 'react';

// CSS for rich text content
const richTextStyles = `
  .job-description-content ul, .job-description-content ol {
    list-style-position: outside;
    padding-left: 1.5rem;
    margin: 1rem 0;
  }
  
  .job-description-content ul {
    list-style-type: disc;
  }
  
  .job-description-content ol {
    list-style-type: decimal;
  }
  
  .job-description-content li {
    margin: 0.25rem 0;
    padding-left: 0.5rem;
    display: list-item;
  }
  
  .job-description-content li p {
    margin: 0;
    display: inline;
  }
  
  .job-description-content table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
  }
  
  .job-description-content table td, 
  .job-description-content table th {
    border: 1px solid #d1d5db;
    padding: 0.5rem;
  }
  
  .job-description-content table th {
    background-color: #f3f4f6;
    font-weight: 500;
  }
  
  .job-description-content p {
    margin: 1rem 0;
  }

  .job-description-content strong, .job-description-content b {
    font-weight: 600;
  }

  .job-description-content em, .job-description-content i {
    font-style: italic;
  }
`;

interface JobDescriptionProps {
  description: string;
}

export default function JobDescription({ description }: JobDescriptionProps) {
  // Function to determine if text contains HTML
  const isHTML = (text: string) => {
    return /<\/?[a-z][\s\S]*>/i.test(text);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      {/* Add the styles for rich text content */}
      <style dangerouslySetInnerHTML={{ __html: richTextStyles }} />
      
      <h2 className="text-sub-header text-[#001630] mb-4">Job Description</h2>
      
      {isHTML(description) ? (
        <div 
          className="text-body2 text-[#414447] job-description-content prose prose-sm sm:prose max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p className="text-body2 text-[#414447] mb-4 whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  );
}