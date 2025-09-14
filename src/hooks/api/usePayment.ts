import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import type { ApiError, ApiResponse } from "@/types/api.types";

interface PaymentInitResponse {
	url: string;
}

export function usePayment() {
	const initPaymentMutation = useMutation({
		mutationFn: async (bookingId: string) => {
			const response = await api.post<ApiResponse<PaymentInitResponse>>(
				`/payment/init/${bookingId}`,
			);
			return response.data;
		},
		onSuccess: (data) => {
			if (data?.data?.url) {
				window.location.href = data.data.url;
			} else {
				toast.error("Failed to get payment URL.");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			const errorMessage =
				error.response?.data.message || "Payment initialize failed";
			toast.error(errorMessage);
		},
	});
	return {
		initPayment: initPaymentMutation.mutate,
		isLoading: initPaymentMutation.isPending,
	};
}
