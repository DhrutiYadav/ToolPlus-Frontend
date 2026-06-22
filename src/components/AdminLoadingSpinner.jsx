import React from "react";

function AdminLoadingSpinner({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <p className="mt-4 text-slate-500 font-medium text-sm">Loading admin dashboard...</p>
    </div>
  );
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        {content}
      </div>
    );
  }
  return content;
}

export default AdminLoadingSpinner;
