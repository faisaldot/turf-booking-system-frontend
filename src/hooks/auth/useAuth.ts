import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/lib/api";
import { authStore } from "@/store/auth";
import { uiStore } from "@/store/ui";
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
	const queryClient = useQueryClient();
	const { login, logout, user, isAuthenticated, setUser } = authStore();

	// Check authentication status
	const { data: authCheckData, isLoading: isCheckingAuth } = useQuery({
		queryKey: ["authCheck"],
		queryFn: async () => {
			try {
				const response =
					await api.get<ApiResponse<{ user: User }>>("/protected");
				return response.data.data;
			} catch (error) {
				console.log("Auth check failed:", error);
				return null;
			}
		},
		enabled: isAuthenticated,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
	});

	// Sync user data from auth check
	if (authCheckData?.user && !user) {
		setUser(authCheckData.user);
	} else if (!authCheckData && isAuthenticated && !isCheckingAuth) {
		logout();
	}

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async (credentials: LoginData) => {
			console.log("Attempting login with:", credentials);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
				}>
			>("/auth/login", credentials);
			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("Login successful:", data?.user?.email);

			if (data?.user) {
				login(data.user, data.accessToken || "");
				toast.success(message || "Login successful");

				// Invalidate and refetch auth check
				queryClient.invalidateQueries({ queryKey: ["authCheck"] });

				// Navigate after a small delay to ensure state is updated
				setTimeout(() => {
					navigate("/dashboard");
				}, 100);
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
			console.log("Attempting registration with:", data);
			const response = await api.post<ApiResponse<{ email: string }>>(
				"/auth/register",
				data,
			);
			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("Registration successful for:", data?.email);
			toast.success(
				message || "Registration successful! Please check your email for OTP.",
			);

			// Store email in sessionStorage BEFORE navigation
			if (data?.email) {
				sessionStorage.setItem("otp-email", data.email);
				console.log("Email stored in session:", data.email);

				// Navigate to OTP page
				setTimeout(() => {
					navigate("/auth/verify-otp");
				}, 100);
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("Registration error:", error);
			const errorMessage =
				error.response?.data?.message || "Registration failed";
			toast.error(errorMessage);
		},
	});

	// Verify OTP mutation
	const verifyOtpMutation = useMutation({
		mutationFn: async (data: VerifyOtpData) => {
			console.log("Attempting OTP verification for:", data.email);
			const response = await api.post<
				ApiResponse<{
					user: User;
					accessToken: string;
				}>
			>("/auth/verify-otp", data);
			return response.data;
		},
		onSuccess: ({ message, data }) => {
			console.log("OTP verification successful for:", data?.user?.email);

			if (data?.user) {
				// Login the user
				login(data.user, data.accessToken || "");
				toast.success(message || "Email verified successfully!");

				// Clear stored email
				sessionStorage.removeItem("otp-email");

				// Invalidate auth check
				queryClient.invalidateQueries({ queryKey: ["authCheck"] });

				// Navigate to dashboard
				setTimeout(() => {
					navigate("/dashboard");
				}, 100);
			}
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error("OTP verification error:", error.response?.data);
			const errorMessage =
				error.response?.data?.message || "OTP verification failed";
			toast.error(errorMessage);
		},
	});

	// Forgot Password mutation
	const forgotPasswordMutation = useMutation({
		mutationFn: async (data: ForgotPasswordData) => {
			console.log("Requesting password reset for:", data.email);
			const response = await api.post<ApiResponse>(
				"/auth/forgot-password",
				data,
			);
			return response.data;
		},
		onSuccess: ({ message }) => {
			toast.success(
				message || "Password reset email sent! Please check your inbox.",
			);
			setTimeout(() => {
				navigate("/auth");
			}, 100);
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
		onSuccess: ({ message, data }) => {
			console.log("Password reset successful for:", data?.user?.email);

			if (data?.user) {
				login(data.user, data.accessToken || "");
				toast.success(message || "Password reset successful!");

				queryClient.invalidateQueries({ queryKey: ["authCheck"] });

				setTimeout(() => {
					navigate("/dashboard");
				}, 100);
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
			await api.post("/auth/logout");
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Logout API call failed:", error);
		} finally {
			logout();
			queryClient.clear();
			navigate("/auth");
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
			(isCheckingAuth && isAuthenticated),

		// Actions
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		verifyOtp: verifyOtpMutation.mutate,
		forgotPassword: forgotPasswordMutation.mutate,
		resetPassword: resetPasswordMutation.mutate,
		logout: handleLogout,
	};
}
