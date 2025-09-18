import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loading";
import { useBookings } from "@/hooks/api/useBookings";
import type { Booking } from "@/types/api.types";

export default function BookingList() {
	const { data: bookings, isLoading, isError } = useBookings();

	if (isLoading) {
		return <PageLoader />;
	}

	if (isError) {
		return <p className="text-destructive">Failed to load your bookings.</p>;
	}

	const now = new Date();

	const upcomingBookings =
		bookings?.filter((b) => new Date(b.date) >= now) ?? [];

	const pastBookings = bookings?.filter((b) => new Date(b.date) < now) ?? [];

	return (
		<div className="space-y-8">
			<section>
				<h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
				{upcomingBookings.length > 0 ? (
					<div className="grid gap-4 md:grid-cols-2">
						{upcomingBookings.map((booking) => (
							<BookingCard key={booking._id} booking={booking} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">
						You have no upcoming bookings.
					</p>
				)}
			</section>

			<section>
				<h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
				{pastBookings.length > 0 ? (
					<div className="grid gap-4 md:grid-cols-2">
						{pastBookings.map((booking) => (
							<BookingCard key={booking._id} booking={booking} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">You have no past bookings.</p>
				)}
			</section>
		</div>
	);
}

function BookingCard({ booking }: { booking: Booking }) {
	// A simple check to see if turf is populated or just an ID
	const turfName =
		typeof booking.turf === "object" ? booking.turf.name : "Turf";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{turfName}</span>
					<Badge
						variant={booking.status === "confiremed" ? "default" : "secondary"}
					>
						{booking.status}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<p>
					<strong>Date:</strong> {format(new Date(booking.date), "PPP")}
				</p>
				<p>
					<strong>Time:</strong> {booking.startTime} - {booking.endTime}
				</p>
				<p>
					<strong>Price:</strong> ৳{booking.totalPrice}
				</p>
			</CardContent>
		</Card>
	);
}
