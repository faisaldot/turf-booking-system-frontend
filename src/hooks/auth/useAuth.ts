// useAuth.ts

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
			console.log("Attemting login with:", credentials);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
					refreshToken: string;
				}>
			>("/api/v1/auth/login", credentials);

			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("Login successfull:", data?.refreshToken);
			if (data) {
				login(data.user, data.accessToken, data.refreshToken);
				toast.success(message);
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Login error:", error);
			toast.error(error.response?.data?.message || "Login failed");
		},
	});

	// Registration mutation
	const registerMutation = useMutation({
		mutationFn: async (data: RegisterData) => {
			console.log("Attempting registration with: ", data);
			const response = await api.post<ApiResponse>(
				"/api/v1/auth/register",
				data,
			);
			return response.data;
		},
		onSuccess: ({ message }) => {
			console.log("Registration successful");
			toast.success(message);
			navigate("/auth/verify-otp");
		},
		onError: (error: AxiosError<ApiError>) => {
			console.log("Registration error:", error);
			toast.error(error.response?.data?.message || "Registration failed");
		},
	});

	// Verify OTP mutation
	const verifyOtpMutation = useMutation({
		mutationFn: async (data: VerifyOtpData) => {
			console.log("Attempting OTP verification with: ", data);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
					refreshToken: string;
				}>
			>("/auth/verify-otp", data);
			return response.data;
		},
		onSuccess: ({ data, message }) => {
			console.log("OTP verification successful: ", data);
			if (data) {
				login(data.user, data.accessToken, data.refreshToken);
				toast.success(message);
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.log("OTP verification error: ", error);
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
