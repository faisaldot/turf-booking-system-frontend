import { useQuery } from "@tanstack/react-query";
import {
	Award,
	Calendar,
	Camera,
	Car,
	Clock,
	Coffee,
	Mail,
	MapPin,
	Phone,
	Shield,
	Star,
	Users,
	Wifi,
	Zap,
} from "lucide-react";
import { useParams } from "react-router";
import BookingForm from "@/components/features/booking/BookingForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ApiResponse, Turf } from "@/types/api.types";

// Amenity icon mapping

// biome-ignore lint/suspicious/noExplicitAny: <explanation
const amenityIcons: Record<string, any> = {
	wifi: Wifi,
	parking: Car,
	restroom: Users,
	cafeteria: Coffee,
	security: Shield,
	lighting: Zap,
	default: Award,
};

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
		return <PageLoader message="Loading turf details..." />;
	}

	if (error || !data?.data) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
							<MapPin className="h-8 w-8 text-white" />
						</div>
						<h1 className="text-2xl font-bold mb-2">Turf Not Found</h1>
						<p className="text-muted-foreground mb-6">
							The requested turf could not be found or may have been removed.
						</p>
						<Button
							asChild
							className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
						>
							<a href="/">Browse All Turfs</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const { data: turf } = data;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/30">
			<div className="container py-8">
				{/* Hero Section */}
				<div className="mb-8">
					<div className="text-center mb-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full mb-4">
							<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
							<span className="text-sm font-medium text-blue-700 dark:text-blue-400">
								Premium Turf Facility
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
							{turf?.name}
						</h1>
						<div className="flex items-center justify-center gap-2 text-muted-foreground">
							<MapPin className="h-5 w-5 text-red-500" />
							<span className="text-lg">
								{turf?.location.address}, {turf?.location.city}
							</span>
						</div>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Images & Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Image Gallery */}
						<Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
							<div className="relative">
								<img
									src={turf?.images[0] || ""}
									alt={turf?.name}
									className="w-full h-[400px] object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
								<div className="absolute bottom-4 left-4 flex items-center gap-2">
									<Badge className="bg-white/90 text-gray-900 hover:bg-white">
										<Camera className="h-3 w-3 mr-1" />
										{turf?.images?.length || 1} Photos
									</Badge>
								</div>
							</div>
						</Card>

						{/* Turf Information */}
						<Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-2xl">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
										<MapPin className="h-4 w-4 text-white" />
									</div>
									About This Turf
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
									{turf?.description}
								</p>

								{/* Operating Hours */}
								<div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl">
									<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
										<Clock className="h-5 w-5 text-white" />
									</div>
									<div>
										<p className="font-semibold text-gray-900 dark:text-white">
											Operating Hours
										</p>
										<p className="text-emerald-600 dark:text-emerald-400 font-medium">
											{turf?.operatingHours.start} - {turf?.operatingHours.end}
										</p>
									</div>
								</div>

								{/* Amenities */}
								<div className="space-y-4">
									<h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
										<Award className="h-5 w-5 text-amber-500" />
										Amenities & Features
									</h3>
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
										{turf?.amenities.map((amenity) => {
											const IconComponent =
												amenityIcons[amenity.toLowerCase()] ||
												amenityIcons.default;
											return (
												<div
													key={amenity}
													className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
												>
													<IconComponent className="h-4 w-4 text-blue-600" />
													<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
														{amenity}
													</span>
												</div>
											);
										})}
									</div>
								</div>

								{/* Pricing Information */}
								<div className="space-y-4">
									<h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
										<Zap className="h-5 w-5 text-yellow-500" />
										Pricing Details
									</h3>

									<div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
											<span className="font-semibold text-gray-900 dark:text-white">
												Default Rate
											</span>
										</div>
										<p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
											৳{turf?.defaultPricePerSlot}
											<span className="text-sm font-normal text-muted-foreground ml-1">
												per hour
											</span>
										</p>
									</div>

									{turf?.pricingRules.map((rule) => (
										<Card
											key={crypto.randomUUID()}
											className="border-l-4 border-l-blue-500 shadow-md"
										>
											<CardContent className="p-4">
												<h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
													<Calendar className="h-4 w-4 text-blue-500" />
													{rule.dayType.toUpperCase()} RATES
												</h4>
												<div className="grid gap-2">
													{rule.timeSlots.map((slot) => (
														<div
															key={crypto.randomUUID()}
															className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
														>
															<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
																{slot.startTime} - {slot.endTime}
															</span>
															<span className="font-bold text-blue-600 dark:text-blue-400">
																৳{slot.pricePerSlot}
															</span>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Booking Form */}
					<div className="lg:col-span-1">
						<div className="sticky top-8 space-y-6">
							{/* Quick Info Card */}
							<Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-lg">
										<div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
											<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
										</div>
										Quick Info
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-green-600" />
											<span className="text-sm font-medium">Capacity</span>
										</div>
										<span className="font-bold text-green-600">22 Players</span>
									</div>

									<div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
										<div className="flex items-center gap-2">
											<Star className="h-4 w-4 text-blue-600" />
											<span className="text-sm font-medium">Rating</span>
										</div>
										<div className="flex items-center gap-1">
											<span className="font-bold text-blue-600">4.8</span>
											<div className="flex gap-0.5">
												{[...Array(5)].map((_, i) => (
													<Star
														key={crypto.randomUUID()}
														className={cn(
															"h-3 w-3",
															i < 4
																? "text-amber-400 fill-amber-400"
																: "text-gray-300",
														)}
													/>
												))}
											</div>
										</div>
									</div>

									<Separator />

									<div className="space-y-2">
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											Need help?
										</p>
										<div className="flex gap-2">
											<Button size="sm" variant="outline" className="flex-1">
												<Phone className="h-3 w-3 mr-1" />
												Call
											</Button>
											<Button size="sm" variant="outline" className="flex-1">
												<Mail className="h-3 w-3 mr-1" />
												Email
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Booking Form */}
							<BookingForm turfId={turf._id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
