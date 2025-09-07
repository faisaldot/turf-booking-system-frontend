import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	fallback?: string;
	className?: string;
}

export function OptimizeImage({
	src,
	alt,
	fallback = "/placeholder-turf.jpg",
	className,
	...props
}: OptimizedImageProps) {
	const [imgSrc, setImgSrc] = useState(src);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleLoad = () => {
		setIsLoading(false);
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
		setImgSrc(fallback);
	};

	return (
		<div>
			{isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}

			<img
				src={imgSrc}
				alt={alt}
				onLoad={handleLoad}
				onError={handleError}
				className={cn(
					"object-cover transition-opacity duration-300",
					isLoading ? "opacity-0" : "opacity-100",
					className,
				)}
				{...props}
			/>
			{hasError && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted">
					<span className="text-xs text-muted-foreground">
						Image unavailable
					</span>
				</div>
			)}
		</div>
	);
}
