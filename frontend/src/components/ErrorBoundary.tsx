import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">
              عذراً، حدث خطأ ما
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
              {this.state.error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                تحديث الصفحة
              </Button>
              <Button
                onClick={this.handleReset}
                className="w-full"
              >
                المحاولة مرة أخرى
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-auto">
                <pre className="text-xs text-slate-600 dark:text-slate-300">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 