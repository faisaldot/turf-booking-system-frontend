import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<Link to="/" className="mr-6 flex items-center space-x-2">
					<span className="font-bold">Khelbi Naki BD</span>
				</Link>
				<nav className="flex items-center space-x-6 text-sm font-medium">
					<Link
						to="/turfs"
						className="transition-colors hover:text-foreground/80 text-foreground/60"
					>
						Turfs
					</Link>
				</nav>
				<div className="flex-1" />
				<div className="flex items-center space-x-4">
					<Link to="/auth" className={buttonVariants({ variant: "default" })}>
						Sign In
					</Link>
				</div>
			</div>
		</header>
	);
}
