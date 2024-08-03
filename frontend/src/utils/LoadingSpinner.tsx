// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="relative">
      <div className="spinner-border border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
  </div>
);

export default LoadingSpinner;
