import TurfList from "./TurfList";

export default function TurfListingPage() {
	return (
		<div className="container py-8 ">
			<h1 className="text-3xl font-bold">Available Turfs</h1>
			<div className="mt-6">
				<TurfList />
			</div>
		</div>
	);
}
