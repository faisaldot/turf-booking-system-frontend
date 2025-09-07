import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}
			return (
				<div className="min-h-screen flex items-center justify-center p-4">
					<Card className="max-w-md w-full">
						<CardHeader className="text-center">
							<AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
							<CardTitle>Something went wrong</CardTitle>
						</CardHeader>
						<CardContent className="text-center space-y-4">
							<p className="text-muted-foreground">
								An unexpected error occurred. Please try refreshing the page.
							</p>
							{import.meta.env.DEV && (
								<details className="text-left text-xs bg-muted p-2 rounded">
									<summary>Error details</summary>
									<pre>{this.state.error?.stack}</pre>
								</details>
							)}
							<Button
								onClick={() => window.location.reload()}
								className="w-full"
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh Page
							</Button>
						</CardContent>
					</Card>
				</div>
			);
		}
		return this.props.children;
	}
}
