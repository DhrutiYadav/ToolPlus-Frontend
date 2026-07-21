import React from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors error-boundary-root">
          <div className="flex flex-col relative min-w-0 break-words rounded-2xl shadow-sm mx-auto border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors error-boundary-card">
            <div className="flex-1 p-12 flex flex-col items-center gap-3">
              <div className="relative p-6 text-rose-800 bg-rose-50 border border-rose-200 dark:text-rose-400 dark:bg-rose-900/10 dark:border-rose-800 rounded-2xl flex items-center justify-center mb-0 error-boundary-alert">
                <span className="text-4xl font-bold">⚠️</span>
              </div>
              <h2 className="font-bold mb-1 text-slate-900 dark:text-white transition-colors">Something went wrong.</h2>
              <p className="text-muted mb-6 transition-colors">
                Please refresh the page to try again, or return to the homepage.
              </p>
              <div className="flex gap-3 flex-wrap justify-center w-full">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary rounded-full px-6 py-2 shadow-sm font-bold hover-lift"
                >
                  Refresh
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-outline-secondary rounded-full px-6 py-2 shadow-sm font-bold hover-lift"
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
