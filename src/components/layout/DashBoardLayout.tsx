import { NavLink, Outlet } from "react-router";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
	const linkClass = ({ isActive }: { isActive: boolean }) =>
		cn(
			"block px-4 py-2 rounded-md text-sm font-medium",
			isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent",
		);

	return (
		<div className="container grid md:grid-cols-[220px_1fr] gap-8 py-8">
			<aside>
				<nav className="space-y-1">
					<NavLink to="bookings" className={linkClass} end>
						My Bookings
					</NavLink>
					<NavLink to="profile" className={linkClass}>
						Profile Settings
					</NavLink>
				</nav>
			</aside>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
