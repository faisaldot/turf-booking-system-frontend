import { Outlet } from "react-router";

export default function MainLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="bg-white shadow">
				<nav className="container mx-auto p-4">
					<h1 className="text-2xl font-bold">Turf Booking System</h1>
				</nav>
			</header>

			<main className="flex-grow container mx-auto p-4">
				<Outlet />
			</main>

			<footer className="bg-gray-800 text-white p-4 text-center">
				<p>© 2025 Khelbi Naki BD</p>
			</footer>
		</div>
	);
}
