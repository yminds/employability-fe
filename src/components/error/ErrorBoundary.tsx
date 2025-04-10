import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import ErrorBoundaryIllustration from "@/assets/error/ErrorBoundary.svg";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleGoBack = (): void => {
    window.history.back();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
            <div className="max-w-md text-center">
              {/* Error SVG illustration */}
              <img
                src={ErrorBoundaryIllustration || "/placeholder.svg"}
                alt="Error"
                className="mx-auto mb-8 w-[400px] h-auto"
              />

              <h1 className="text-xl font-medium text-[#202326] mb-2">
                Uh Oh... We've encountered a technical glitch in the system.
              </h1>

              <p className="text-[#68696b] mb-4">
                But don't worry, our engineers are already working on fixing it!
              </p>

              {/* Error details */}
              {this.state.error && (
                <div className="bg-[#e1f2ea] p-4 rounded-md mb-6 overflow-auto max-h-40 text-left">
                  <p className="font-mono text-sm text-[#001630]">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleGoBack}
                  className="px-6 py-2 text-[#001630] bg-white border border-[#001630] hover:bg-[#e1f2ea]"
                >
                  Go Back
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  className="px-6 py-2 text-[#001630] bg-white border border-[#001630] hover:bg-[#e1f2ea]"
                >
                  Take me Home
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
