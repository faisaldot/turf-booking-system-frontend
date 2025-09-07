import { useEffect, useState } from "react";

interface ImageOptimizationOptions {
	width?: number;
	height?: number;
	quality?: number;
	format?: "webp" | "jpg" | "png";
}

export function useImageOptimization(
	src: string,
	options: ImageOptimizationOptions = {},
) {
	const [optimizedSrc, setOptimizedSrc] = useState(src);

	useEffect(() => {
		if (!src) return;

		if (src.includes("cloudinary.com")) {
			const {
				width = 800,
				height = 600,
				quality = 80,
				format = "webp",
			} = options;
			const transformations = `w-${width},h_${height},q_${quality},f_${format},c_fill`;

			const optimized = src.replace("/upload/", `/upload/${transformations}`);

			setOptimizedSrc(optimized);
		}
	}, [src, options]);

	return optimizedSrc;
}
