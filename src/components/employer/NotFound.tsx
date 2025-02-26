import React from 'react';
import { Link } from 'react-router-dom';

const EmployerNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#0AD472] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/employer"
          className="inline-flex items-center px-6 py-3 bg-[#0AD472] text-white font-medium rounded-lg hover:bg-[#089c59] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default EmployerNotFound;