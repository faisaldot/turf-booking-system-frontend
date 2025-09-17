import { X } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelledPage() {
	const { transactionId } = useParams();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="flex flex-col items-center space-y-2">
					<X className="w-12 h-12 text-yellow-500" />
					<CardTitle className="text-center">Payment Cancelled</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p>Your payment has been cancelled. No charges were made.</p>

					{transactionId && (
						<p className="text-sm text-gray-500">
							Transaction ID: <span className="font-mono">{transactionId}</span>
						</p>
					)}

					<div className="flex flex-col space-y-2 mt-4">
						<Button asChild>
							<Link to="/bookings">View Bookings</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link to="/turfs">Return to Turfs</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
