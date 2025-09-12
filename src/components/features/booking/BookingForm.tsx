import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth/useAuth";
import api from "@/lib/api";
import { createBookingSchema } from "@/lib/validation";
import type {
	ApiResponse,
	AvailabilitySlot,
	Booking,
	CreateBookingData,
	TurfAvailability,
} from "@/types/api.types";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Link } from "react-router";

const formSchema = createBookingSchema.pick({
	date: true,
	startTime: true,
});

type BookingFormData = {
	date: Date;
	startTime: string;
};

interface BookingFormProps {
	turfId: string;
}

export default function BookingForm({ turfId }: BookingFormProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		formSchema.shape.date.parse(new Date()),
	);

	const { isAuthenticated, user } = useAuth();
	const queryClient = useQueryClient();

	const form = useForm<BookingFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: selectedDate,
			startTime: "",
		},
	});

	// Get availability for the selected date
	const {
		data: availability,
		isLoading: isAvailabilityLoading,
		refetch: refetchAvailability,
	} = useQuery({
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

	// Create booking mutation
	const bookingMutation = useMutation({
		mutationFn: async (data: CreateBookingData) => {
			const response = await api.post<ApiResponse<Booking>>("/bookings", data);
			return response.data.data;
		},
		onSuccess: (booking) => {
			if (booking) {
				toast.success("Booking created successfully. Redirecting to payment...");
				queryClient.invalidateQueries({
					queryKey: ["turf-availability", turfId, selectedDate],
				});
				// Here, we would navigate to a payment page or trigger the payment modal
				// For now, we'll just show a success message
				console.log("Booking created:", booking);
			}
		},
		onError: (error: AxiosError<any>) => {
			const errorMessage =
				error.response?.data?.message || "Failed to create booking.";
			toast.error(errorMessage);
		},
	});

	const onSubmit = (data: BookingFormData) => {
		// Calculate endTime as 1 hour after startTime.
		const startHour = Number(data.startTime.split(":")[0]);
		const endHour = startHour + 1;
		const endTime = `${String(endHour).padStart(2, "0")}:${
			data.startTime.split(":")[1]
		}`;

		bookingMutation.mutate({
			turf: turfId,
			date: data.date,
			startTime: data.startTime,
			endTime: endTime,
		});
	};

	const availableSlots =
		availability?.slots?.filter((slot) => slot.isAvailable) || [];

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
															<SelectItem key={slot.startTime} value={slot.startTime}>
																<div className="flex items-center justify-between w-full space-x-4">
																	<span>
																		{slot.startTime} - {slot.endTime}
																	</span>
																	<span className="font-semibold ">
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
							disabled={
								bookingMutation.isPending || !form.formState.isValid
							}
							className="w-full"
						>
							{bookingMutation.isPending ? "Creating Booking..." : "Book Now"}
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
				<span className="font-medium">Time:</span> {selectedSlot.startTime} - {endTime}
			</p>
			<div className="flex items-center justify-between font-bold text-lg text-primary">
				<span>Total Price</span>
				<span>৳{selectedSlot.pricePerSlot}</span>
			</div>
		</div>
	);
}
