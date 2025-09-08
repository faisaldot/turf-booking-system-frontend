import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/lib/api";
import { authStore } from "@/store/auth";
import type {
	ApiError,
	ApiResponse,
	LoginData,
	RegisterData,
	User,
	VerifyOtpData,
} from "@/types/api.types";

export function useAuth() {
	const navigate = useNavigate();
	const { login, logout, user, isAuthenticated } = authStore();

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async (credentials: LoginData) => {
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
					refreshToken: string;
				}>
			>("/auth/login", credentials);

			return response.data;
		},
		onSuccess: ({ message, data }) => {
			if (data) {
				login(data.user, data.accessToken, data.refreshToken);
				toast.success(message);
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			toast.error(error.response?.data?.message || "Login failed");
		},
	});

	// Registration mutation
	const registerMutation = useMutation({
		mutationFn: async (data: RegisterData) => {
			const response = await api.post<ApiResponse>("/auth/register", data);
			return response.data;
		},
		onSuccess: ({ message }) => {
			toast.success(message);
			navigate("/auth/verify-otp");
		},
		onError: (error: AxiosError<ApiError>) => {
			toast.error(error.response?.data?.message || "Registration failed");
		},
	});

	// Verify OTP mutation
	const verifyOtpMutation = useMutation({
		mutationFn: async (data: VerifyOtpData) => {
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
					refreshToken: string;
				}>
			>("/api/verify-auth", data);
			return response.data;
		},
		onSuccess: ({ data, message }) => {
			if (data) {
				login(data.user, data.accessToken, data.refreshToken);
				toast.success(message);
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			toast.error(error.response?.data?.message || "OTP verification failed");
		},
	});

	// Logout function
	const handleLogout = () => {
		logout();
		navigate("/auth/login");
		toast.success("Logged out successfully");
	};

	return {
		user,
		isAuthenticated,
		isLoading: loginMutation.isPending || registerMutation.isPending,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		verifyOtp: verifyOtpMutation,
		logout: handleLogout,
	};
}
