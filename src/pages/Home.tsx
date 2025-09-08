import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
	return (
		<div className="relative flex flex-col items-center justify-center px-6 py-20 text-center">
			<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background -z-10" />

			<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
				Welcome to <span className="text-primary">Khelbi Naki BD</span>
			</h1>

			<p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
				Book your favorite turfs with ease. The premium turf booking platform in
				Bangladesh.
			</p>

			<div className="mt-8 flex flex-col sm:flex-row gap-4">
				<Link to="/turfs" className={buttonVariants({ variant: "default" })}>
					Explore Turfs
				</Link>
				<Link to="/auth" className={buttonVariants({ variant: "outline" })}>
					Sign In
				</Link>
			</div>
		</div>
	);
}
