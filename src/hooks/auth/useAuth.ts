import { useMutation, useQuery } from "@tanstack/react-query";
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
	const { login, logout, user, isAuthenticated, setUser } = authStore();

	// Check authentication status
	const { data: authCheckData, isLoading: isCheckingAuth } = useQuery({
		queryKey: ["authCheck"],
		queryFn: async () => {
			try {
				const response =
					await api.get<ApiResponse<{ user: User }>>("/protected");
				return response.data.data;
			} catch {
				// if auth check fails, user is not authenticated
				return null;
			}
		},
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	if (authCheckData?.user && !isAuthenticated) {
		setUser(authCheckData.user);
	} else if (!authCheckData && isAuthenticated) {
		logout();
	}

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

			const loginData = response.data as any;
			return {
				message: loginData.message,
				data: {
					user: loginData?.user,
					accessToken: loginData?.accessToken,
				},
			};
		},
		onSuccess: ({ message, data }) => {
			console.log("Login successfully:", data?.user?.email);

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
			toast.success(message || "Registration successful");
			if (data?.email) {
				sessionStorage.setItem("otp-email", data.email);
				navigate("/auth/verify-otp");
			}
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
					refreshToken: string;
				}>
			>("/auth/verify-otp", data);

			return response.data;
		},
		onSuccess: ({ data, message }) => {
			console.log("OTP verification successful for: ", data?.user?.email);
			if (data?.user) {
				// The backend now returns the accessToken in the body to store in memory.
				login(data.user, data.accessToken);
				toast.success(message || "Email verified successfully");
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
			toast.success(message || "Password reset email sent");
			navigate("/auth");
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
					refreshToken: string;
				}>
			>(`/auth/reset-password/${token}`, { password });

			return response.data;
		},
		onSuccess: ({ data, message }) => {
			console.log("Password reset successful", data?.user?.email);
			if (data?.user) {
				login(data.user, data.accessToken);
				toast.success(message || "Password reset successful");
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
	const handleLogout = async () => {
		try {
			// This request will clear the HttpOnly cookies on the backend.
			await api.post("/auth/logout");
		} catch (error) {
			console.error("Logout API call failed", error);
		} finally {
			logout();
			navigate("/auth");
			toast.success("Logged out successfully");
		}
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
			resetPasswordMutation.isPending ||
			isCheckingAuth,

		// Actions
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		verifyOtp: verifyOtpMutation.mutate,
		forgotPassword: forgotPasswordMutation.mutate,
		resetPassword: resetPasswordMutation.mutate,
		logout: handleLogout,
	};
}
