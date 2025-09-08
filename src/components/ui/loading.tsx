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

export function TurfCardSkeleton() {
	return (
		<div className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden animate-pulse">
			{/* Image */}
			<div className="bg-muted h-48 md:h-56 w-full rounded-t-xl" />

			{/* Content */}
			<div className="p-4 flex flex-col grow space-y-3">
				<div className="bg-muted h-5 rounded w-3/4" />
				<div className="bg-muted h-4 rounded w-1/2" />

				<div className="flex flex-wrap gap-2 mt-2">
					<div className="bg-muted h-5 rounded-full w-16" />
					<div className="bg-muted h-5 rounded-full w-20" />
					<div className="bg-muted h-5 rounded-full w-12" />
				</div>
			</div>

			{/* Footer */}
			<div className="flex justify-between items-center p-4">
				<div className="bg-muted h-5 rounded w-12" />
				<div className="bg-muted h-8 rounded w-24" />
			</div>
		</div>
	);
}
