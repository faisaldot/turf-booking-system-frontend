import { Outlet } from "react-router";
import { Footer } from "./Footer";
import Header from "./Header";

export default function MainLayout() {
	return (
		<>
			<Header />

			<main className="flex-grow container mx-auto p-4">
				<Outlet />
			</main>

			<Footer />
		</>
	);
}
