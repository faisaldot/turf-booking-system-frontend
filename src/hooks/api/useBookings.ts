import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse, Booking } from "@/types/api.types";
import { useAuth } from "../auth/useAuth";

export function useBookings() {
	const { isAuthenticated } = useAuth();

	return useQuery({
		queryKey: ["my-bookings"],
		queryFn: async () => {
			const response = await api.get<ApiResponse<Booking[]>>(
				"/bookings/my-bookings",
			);
			return response.data.data;
		},
		enabled: isAuthenticated, // Only run this query if the user is logged in
	});
}
