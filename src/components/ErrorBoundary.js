// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          Oops! Something went wrong. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
