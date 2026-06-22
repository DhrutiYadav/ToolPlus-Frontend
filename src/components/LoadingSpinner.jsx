import React from "react";

function LoadingSpinner({ fullPage = false }) {
  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold">Loading amazing deals...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: "80vh", width: "100%" }}
      >
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

export default LoadingSpinner;
