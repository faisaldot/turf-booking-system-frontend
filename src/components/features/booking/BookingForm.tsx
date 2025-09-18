// Booking form - Fixed version
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePayment } from "@/hooks/api/usePayment";
import { useAuth } from "@/hooks/auth/useAuth";
import api from "@/lib/api";
import { createBookingSchema } from "@/lib/validation";
import type {
	ApiError,
	ApiResponse,
	AvailabilitySlot,
	Booking,
	CreateBookingData,
	TurfAvailability,
} from "@/types/api.types";

// Schema for form validation.
const formSchema = createBookingSchema.pick({
	date: true,
	startTime: true,
	turf: true,
});

type BookingFormData = z.infer<typeof formSchema>;

interface BookingFormProps {
	turfId: string;
}

export default function BookingForm({ turfId }: BookingFormProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		formSchema.shape.date.parse(new Date()),
	);

	const { isAuthenticated, user } = useAuth();
	const { initPaymentAsync, isLoading: isPaymentLoading } = usePayment();
	const queryClient = useQueryClient();

	const form = useForm<BookingFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: selectedDate,
			startTime: "",
			turf: turfId,
		},
	});

	// Query to fetch turf availability
	const { data: availability, isLoading: isAvailabilityLoading } = useQuery({
		queryKey: ["turf-availability", turfId, selectedDate],
		queryFn: async () => {
			if (!selectedDate) return null;
			const dateStr = selectedDate.toISOString().split("T")[0];
			const response = await api.get<ApiResponse<TurfAvailability>>(
				`/turfs/${turfId}/availability`,
				{ params: { date: dateStr } },
			);
			return response.data.data;
		},
		enabled: !!selectedDate,
	});

	// Mutation to create a new booking
	const bookingMutation = useMutation({
		mutationFn: async (data: CreateBookingData): Promise<Booking> => {
			console.log("Making booking API call with:", data);
			const response = await api.post<ApiResponse<Booking>>("/bookings", data);
			console.log("Booking API response:", response.data);
			console.log("Response structure:", {
				hasData: !!response.data.data,
				hasBooking: !!(response.data as any).booking,
				hasId: !!(response.data as any).id,
				hasUnderscore: !!(response.data as any)._id,
				rawResponse: response.data,
			});

			// Try different possible response structures
			return (
				response.data.data ||
				(response.data as any).booking ||
				(response.data as any)
			);
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Booking mutation error:", error);
			const errorMessage =
				error.response?.data?.message || "Failed to create booking.";
			toast.error(errorMessage);
		},
	});

	const onSubmit = async (data: BookingFormData) => {
		try {
			const startHour = Number(data.startTime.split(":")[0]);
			const endHour = startHour + 1;
			const endTime = `${String(endHour).padStart(2, "0")}:${
				data.startTime.split(":")[1]
			}`;

			const bookingData = {
				turf: turfId,
				date: data.date,
				startTime: data.startTime,
				endTime: endTime,
			};

			console.log("Submitting booking data:", bookingData);

			// First, create the booking
			const booking = await bookingMutation.mutateAsync(bookingData);

			console.log("Booking response:", booking);
			console.log("Booking created:", booking);

			// Check multiple possible response formats
			const bookingId = booking._id;
			// booking?._id || booking?.id || (booking as any)?.bookingId;

			if (bookingId) {
				toast.success(
					"Booking created successfully. Redirecting to payment...",
				);

				// Invalidate queries
				queryClient.invalidateQueries({
					queryKey: ["turf-availability", turfId, selectedDate],
				});

				console.log("Initializing payment for booking ID:", bookingId);

				// Then initialize payment and wait for it to complete
				await initPaymentAsync(bookingId);
			} else {
				toast.error("Booking created but no booking ID received");
				console.error("Invalid booking response:", booking);

				// If you know the booking was created (check network tab),
				// you could try using the response directly or check what ID field exists
				console.log(
					"Available properties on booking object:",
					Object.keys(booking || {}),
				);
			}
		} catch (error) {
			// Error handling is already done in the individual mutation handlers
			console.error("Booking or payment initialization failed:", error);
		}
	};

	const availableSlots =
		availability?.slots?.filter((slot) => slot.isAvailable) || [];

	const isFormLoading =
		bookingMutation.isPending || isAvailabilityLoading || isPaymentLoading;

	if (!isAuthenticated) {
		return (
			<Card className="p-6 text-center">
				<p>You must be logged in to make a booking.</p>
				<Button asChild className="mt-4">
					<Link to="/auth">Log In</Link>
				</Button>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					Book Your Slot
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Date Selection */}
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Date</FormLabel>
									<FormControl>
										<CalendarComponent
											mode="single"
											selected={field.value}
											onSelect={(date) => {
												field.onChange(date);
												setSelectedDate(date);
												// Reset time selection when date changes
												form.setValue("startTime", "");
											}}
											disabled={(date) => date < new Date()}
											className="rounded-md border"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Time Slot Selection */}
						{isAvailabilityLoading ? (
							<div className="flex justify-center">
								<LoadingSpinner />
							</div>
						) : availableSlots.length > 0 ? (
							<>
								<FormField
									control={form.control}
									name="startTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Available Time Slots</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a time slot" />
													</SelectTrigger>
													<SelectContent>
														{availableSlots.map((slot) => (
															<SelectItem
																key={slot.startTime}
																value={slot.startTime}
															>
																<div className="flex items-center justify-between w-full">
																	<span>
																		{slot.startTime} - {slot.endTime}
																	</span>
																	<span className="font-semibold">
																		৳{slot.pricePerSlot}
																	</span>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Booking Summary */}
								{form.watch("startTime") && (
									<BookingSummary
										selectedSlot={availableSlots.find(
											(s) => s.startTime === form.watch("startTime"),
										)}
										date={selectedDate}
									/>
								)}
							</>
						) : (
							<p className="text-center text-muted-foreground">
								No available slots for this date.
							</p>
						)}

						<Button
							type="submit"
							disabled={isFormLoading || !form.formState.isValid}
							className="w-full"
						>
							{isFormLoading ? <LoadingSpinner size="sm" /> : "Book Now"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

// A simple component to show the booking summary
function BookingSummary({
	selectedSlot,
	date,
}: {
	selectedSlot: AvailabilitySlot | undefined;
	date: Date | undefined;
}) {
	if (!selectedSlot || !date) {
		return null;
	}
	const startHour = Number(selectedSlot.startTime.split(":")[0]);
	const endHour = startHour + 1;
	const endTime = `${String(endHour).padStart(2, "0")}:${
		selectedSlot.startTime.split(":")[1]
	}`;

	return (
		<div className="space-y-2 p-4 border rounded-lg bg-secondary/30">
			<h4 className="font-semibold text-lg">Booking Summary</h4>
			<p className="text-sm">
				<span className="font-medium">Date:</span> {date.toLocaleDateString()}
			</p>
			<p className="text-sm">
				<span className="font-medium">Time:</span> {selectedSlot.startTime} -{" "}
				{endTime}
			</p>
			<div className="flex items-center justify-between font-bold text-lg text-primary">
				<span>Total Price</span>
				<span>৳{selectedSlot.pricePerSlot}</span>
			</div>
		</div>
	);
}
