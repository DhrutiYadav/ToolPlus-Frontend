import React from "react";
import '../styles/LoadingSpinner.css';

function LoadingSpinner({ fullPage = false }) {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="inline-block w-8 h-8 border-4 border-current border-r-transparent rounded-full animate-spin text-orange-500 spinner-large" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-6 text-muted font-semibold">Loading amazing deals...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

export default LoadingSpinner;
