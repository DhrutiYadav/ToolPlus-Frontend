import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center transition-colors dark:bg-slate-950">
          <div className="w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white shadow-lg transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-5 p-10 sm:p-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-5xl dark:border-rose-800 dark:bg-rose-900/20">
                ⚠️
              </div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h2>

              <p className="max-w-md text-slate-600 dark:text-slate-400">
                An unexpected error occurred. Please refresh the page or return
                to the homepage.
              </p>

              <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg active:translate-y-0"
                >
                  Refresh
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;