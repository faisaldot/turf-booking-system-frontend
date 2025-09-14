import { XCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentFailedPage() {
	const { transactionId } = useParams();

	return (
		<div className="container mx-auto px-4 py-12">
			<Card className="max-w-md mx-auto text-center">
				<CardHeader>
					<XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
					<CardTitle className="text-2xl text-destructive">
						Payment Failed
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Your payment could not be processed. Please try again.
					</p>
					<p className="text-sm">
						Transaction ID:{" "}
						<code className="bg-muted px-2 py-1 rounded">{transactionId}</code>
					</p>
					<div className="flex gap-4 justify-center">
						<Button asChild>
							<Link to="/dashboard">View Bookings</Link>
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
