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
	ForgotPasswordData,
	LoginData,
	RegisterData,
	User,
	VerifyOtpData,
} from "@/types/api.types";

export function useAuth() {
	const navigate = useNavigate();
	const { login, logout, user, isAuthenticated, setLoading } = authStore();

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async (credentials: LoginData) => {
			console.log("Attemting login with:", credentials);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
				}>
			>("/auth/login", credentials);

			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("Login successfull:", data?.user.email);
			if (data) {
				login(data.user, data.accessToken);
				toast.success(message);

				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Login error:", error);
			const errorMessage = error.response?.data?.message || "Login failed";
			toast.error(errorMessage);
		},
	});

	// Registration mutation
	const registerMutation = useMutation({
		mutationFn: async (data: RegisterData) => {
			console.log("Attempting registration with: ", data);
			const response = await api.post<ApiResponse<{ email: string }>>(
				"/auth/register",
				data,
			);
			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("Registration successful", data?.email);
			toast.success(message);
			sessionStorage.setItem("otp-email", data?.email || "");
			navigate("/auth/verify-otp");
		},
		onError: (error: AxiosError<ApiError>) => {
			console.log("Registration error:", error);
			const errorMessage =
				error.response?.data?.message || "Registration failed";
			toast.error(errorMessage);
		},
	});

	// Verify OTP mutation
	const verifyOtpMutation = useMutation({
		mutationFn: async (data: VerifyOtpData) => {
			console.log("Attempting OTP verification with: ", data.email);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
				}>
			>("/auth/verify-otp", data);
			return response.data;
		},
		onSuccess: ({ data, message }) => {
			console.log("OTP verification successful for: ", data?.user.email);
			if (data) {
				login(data.user, data.accessToken);
				toast.success(message);
				sessionStorage.removeItem("otp-email");
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.log("OTP verification error: ", error.response?.data);
			const errorMessage =
				error.response?.data?.message || "OTP verification failed";
			toast.error(errorMessage);
		},
	});

	// Forgot Password mutation
	const forgotPasswordMutation = useMutation({
		mutationFn: async (data: ForgotPasswordData) => {
			console.log("Requesting password reset for: ", data.email);
			const response = await api.post<ApiResponse>(
				"/auth/forgot-password",
				data,
			);
			return response.data;
		},
		onSuccess: ({ message }) => {
			toast.success(message);
			navigate("/auth/login");
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Forgot password error:", error.response?.data);
			const errorMessage =
				error.response?.data?.message || "Failed to send reset email";
			toast.error(errorMessage);
		},
	});

	// Reset Password mutation
	const resetPasswordMutation = useMutation({
		mutationFn: async ({
			token,
			password,
		}: {
			token: string;
			password: string;
		}) => {
			console.log("Attempting password reset");
			const response = await api.patch<
				ApiResponse<{
					user: User;
					accessToken: string;
				}>
			>(`/auth/reset-password/${token}`, { password });
			return response.data;
		},
		onSuccess: ({ data, message }) => {
			console.log("Password reset successful");
			if (data) {
				login(data.user, data.accessToken);
				toast.success(message);
				navigate("/dashboard");
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Password reset error:", error.response?.data);
			const errorMessage =
				error.response?.data?.message || "Password reset failed";
			toast.error(errorMessage);
		},
	});

	// Logout function
	const handleLogout = () => {
		logout();
		navigate("/auth/login");
		toast.success("Logged out successfully", { richColors: true });
	};

	return {
		// State
		user,
		isAuthenticated,
		isLoading:
			loginMutation.isPending ||
			registerMutation.isPending ||
			verifyOtpMutation.isPending ||
			forgotPasswordMutation.isPending ||
			resetPasswordMutation.isPending,

		// Actions
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		verifyOtp: verifyOtpMutation.mutate,
		forgotPassword: forgotPasswordMutation.mutate,
		resetPassword: (token: string, password: string) =>
			resetPasswordMutation.mutate({ token, password }),
		logout: handleLogout,

		// Status flags
		loginError: loginMutation.error,
		registerError: registerMutation.error,
		verifyOtpError: verifyOtpMutation.error,
	};
}
