import React from "react";
import '../styles/LoadingSpinner.css';

function LoadingSpinner({ fullPage = false }) {
  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary spinner-large" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold">Loading amazing deals...</p>
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
