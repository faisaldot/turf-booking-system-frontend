import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
			<h1 className="text-6xl font-bold tracking-tighter text-primary">404</h1>
			<p className="mt-4 text-xl font-medium text-muted-foreground">
				Page Not Found
			</p>
			<p className="mt-2 text-sm text-muted-foreground">
				The page you are looking for does not exist or has been moved.
			</p>
			<Button asChild className="mt-8">
				<Link to="/">Go back to homepage</Link>
			</Button>
		</div>
	);
}
