import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import type { ApiResponse, Turf } from "@/types/api.types";

export default function TurfDetailsPage() {
	const { slug } = useParams<{ slug: string }>();

	const { data, isLoading, error } = useQuery({
		queryKey: ["turfDetails", slug],
		queryFn: async () => {
			const response = await api.get<ApiResponse<Turf>>(`/turfs/${slug}`);
			return response.data;
		},
		enabled: !!slug,
	});

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	if (error) {
		return (
			<div className="container py-8 text-center">
				<h1 className="text-3xl font-bold">Turf not found</h1>
				<p className="mt-4 text-muted-foreground">
					The requested turf could not be found.
				</p>
			</div>
		);
	}

	const { data: turf } = data!;

	return (
		<div className="container py-8">
			<div className="grid md:grid-cols-2 gap-8">
				{/* Image gallery */}
				<div className="space-y-4">
					<img
						src={turf?.images[0] || ""}
						alt={turf?.name}
						className="w-full h-auto rounded-lg object-cover shadow-lg"
					/>
				</div>
				{/* Turf Details */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-3xl font-bold">{turf?.name}</CardTitle>
							<CardDescription>
								<div className="flex items-center text-sm text-muted-foreground mt-1">
									<MapPin className="h-4 w-4 mr-1" />
									<span>
										{turf?.location.address}, {turf?.location.city}
									</span>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>{turf?.description}</p>
							<div className="flex items-center space-x-4">
								<div className="flex items-center text-muted-foreground">
									<Clock className="h-5 w-5 mr-2" />
									<span>
										{turf?.operatingHours.start} - {turf?.operatingHours.end}
									</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{turf?.amenities.map((amenity) => (
										<Badge key={amenity} variant="secondary">
											{amenity}
										</Badge>
									))}
								</div>
							</div>

							<div className="mt-4">
								<h3 className="text-xl font-semibold mb-2">Pricing</h3>
								<div className="space-y-2">
									<p className="text-lg font-bold">
										Default Price: ৳{turf?.defaultPricePerSlot}
									</p>
									{turf?.pricingRules.map((rule, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<div key={index} className="pl-4 border-l-2 border-primary">
											<p className="font-semibold">
												{rule.dayType.toUpperCase()}
											</p>
											{rule.timeSlots.map((slot, i) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												<p key={i} className="text-sm text-muted-foreground">
													{slot.startTime} - {slot.endTime}: ৳
													{slot.pricePerSlot}
												</p>
											))}
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
					<div>
						{/* Booking form and button here */}
						<Button>Book Now (IN FUTURE)</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
