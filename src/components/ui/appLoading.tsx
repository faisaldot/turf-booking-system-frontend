/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLoadingProps {
	message?: string;
	showSkeleton?: boolean;
}

export function AppLoading({
	message = "Loading...",
	showSkeleton = false,
}: AppLoadingProps) {
	if (showSkeleton) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="mx-auto max-w-4xl space-y-6">
					{/* Header skeleton */}
					<div className="flex items-center justify-between">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-10 w-24" />
					</div>

					{/* Content skeletons */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<Card key={i} className="p-6">
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-20 w-full" />
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="text-center space-y-4">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
				<div className="space-y-2">
					<h2 className="text-lg font-semibold text-foreground">
						Getting things ready
					</h2>
					<p className="text-sm text-muted-foreground max-w-sm">{message}</p>
				</div>

				{/* Progress indicator dots */}
				<div className="flex justify-center space-x-1 pt-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-2 w-2 rounded-full bg-primary/30 animate-pulse"
							style={{
								animationDelay: `${i * 0.2}s`,
								animationDuration: "1.4s",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
