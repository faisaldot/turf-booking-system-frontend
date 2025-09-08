import { Link } from "react-router";

export function Footer() {
	return (
		<footer className="border-t bg-background/80 backdrop-blur-sm">
			<div className="flex flex-col items-center justify-between gap-4 p-6 md:h-2 md:flex-row">
				<p className="text-center text-sm text-muted-foreground">
					© {new Date().getFullYear()} Khelbi Naki BD. All rights reserved.
				</p>

				<nav className="flex items-center gap-6 text-sm">
					<Link
						to="/privacy"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Privacy
					</Link>
					<Link
						to="/terms"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Terms
					</Link>
					<Link
						to="/contact"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Contact
					</Link>
				</nav>
			</div>
		</footer>
	);
}
