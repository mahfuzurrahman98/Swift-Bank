import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/utils/helpers/logger";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logger.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="max-w-6xl w-full mx-auto px-4 lg:px-0 py-4">
                    <AlertMessage
                        type="error"
                        message="Something went wrong while rendering this component."
                    />
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
                        <div className="flex items-center mb-2">
                            <AlertTriangle
                                size={16}
                                className="mr-2 text-destructive"
                            />
                            <span className="font-medium">Error Details:</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <code>
                                {this.state.error?.message ||
                                    "Unknown error occurred"}
                            </code>
                        </div>
                        <Button
                            size="sm"
                            onClick={() =>
                                this.setState({
                                    hasError: false,
                                    error: undefined,
                                })
                            }
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
