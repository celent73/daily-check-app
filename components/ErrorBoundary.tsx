
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] bg-white text-black p-6 flex flex-col items-center justify-center text-center overflow-auto">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Qualcosa è andato storto 😢</h1>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6 max-w-full overflow-x-auto text-left w-full">
                        <p className="font-mono text-sm text-red-800 break-words mb-2">
                            {this.state.error?.toString()}
                        </p>
                        {this.state.errorInfo && (
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            Riprova
                        </button>
                        <button
                            onClick={() => {
                                if (confirm("Sei sicuro? Questo cancellerà tutti i dati salvati per risolvere il problema.")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition"
                        >
                            Reset Totale App (Emergenza)
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
