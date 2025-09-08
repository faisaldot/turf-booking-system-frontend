import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
			<div className="container mx-auto flex h-16 items-center px-4">
				<Link to="/" className="mr-8 flex items-center space-x-2">
					<span className="text-lg font-bold tracking-wide hover:text-primary transition-colors">
						Khelbi Naki BD
					</span>
				</Link>

				<nav className="flex items-center space-x-6 text-sm font-medium">
					<Link
						to="/turfs"
						className="text-foreground/70 hover:text-foreground transition-colors"
					>
						Turfs
					</Link>
					<Link
						to="/about"
						className="text-foreground/70 hover:text-foreground transition-colors"
					>
						About
					</Link>
					<Link
						to="/contact"
						className="text-foreground/70 hover:text-foreground transition-colors"
					>
						Contact
					</Link>
				</nav>

				<div className="flex-1" />

				<div className="flex items-center space-x-3">
					<Link to="/auth" className={buttonVariants({ variant: "default" })}>
						Sign In
					</Link>
				</div>
			</div>
		</header>
	);
}
