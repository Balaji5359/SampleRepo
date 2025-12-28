import React from 'react';

const LoadingSpinner = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-full"
    >
      <div className="w-12 h-12 relative mb-4">
        <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="text text-lg font-medium" style={{ color: '#3b9797' }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;