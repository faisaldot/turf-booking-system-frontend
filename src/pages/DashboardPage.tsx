import BookingList from "@/components/features/dashboard/BookingList";

export default function DashboardPage() {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
			<BookingList />
		</div>
	);
}
