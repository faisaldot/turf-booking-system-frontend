import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function LoadingSpinner({
	size = "md",
	className,
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
	);
}

export function PageLoader() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center space-y-4">
				<LoadingSpinner size="lg" />
				<p className="text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
