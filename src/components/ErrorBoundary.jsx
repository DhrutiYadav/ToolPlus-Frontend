import React from 'react';

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
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 text-center bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="card rounded-4 shadow-sm mx-auto border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors" style={{ maxWidth: "500px", width: "100%" }}>
            <div className="card-body p-5 d-flex flex-column align-items-center gap-3">
              <div className="alert alert-danger rounded-4 d-flex align-items-center justify-content-center mb-0 border-0" style={{ width: '80px', height: '80px' }}>
                <span className="fs-1">⚠️</span>
              </div>
              <h2 className="fw-bold mb-1 text-slate-900 dark:text-white transition-colors">Something went wrong.</h2>
              <p className="text-muted mb-4 transition-colors">
                Please refresh the page to try again, or return to the homepage.
              </p>
              <div className="d-flex gap-3 flex-wrap justify-content-center w-100">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift"
                >
                  Refresh
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift"
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
