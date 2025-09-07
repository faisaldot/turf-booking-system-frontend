import { useEffect, useRef, useState } from "react";

export function useLazyLoading<T extends HTMLElement>() {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<T>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => observer.disconnect();
	}, []);

	return { ref, isVisible };
}
