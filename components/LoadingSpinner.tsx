
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-8" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      <p className="ml-4 text-lg text-slate-700">Schema wordt gegenereerd...</p>
    </div>
  );
};

export default LoadingSpinner;