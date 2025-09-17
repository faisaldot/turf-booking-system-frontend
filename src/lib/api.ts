import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { authStore } from "@/store/auth";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";

export const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

async function refreshAccessToken() {
	try {
		const response = await api.post("/auth/refresh-token", {});
		return response.status === 200;
	} catch (error) {
		console.error("Token refresh failed:", error);
		throw error;
	}
}

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		// Don't retry auth endpoints or if already retried
		const isAuthEndpoint =
			originalRequest.url?.includes("/auth/") ||
			originalRequest.url?.includes("/protected");

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;

			try {
				const refreshSucceeded = await refreshAccessToken();
				if (refreshSucceeded) {
					// Token refreshed successfully, retry the original request
					return api(originalRequest);
				}
			} catch (refreshError) {
				console.error("Token refresh failed:", refreshError);
				// Only logout if we're currently authenticated
				const { isAuthenticated, logout } = authStore.getState();
				if (isAuthenticated) {
					logout();
					// Redirect to auth page if not already there
					if (!window.location.pathname.includes("/auth")) {
						window.location.href = "/auth";
					}
				}
			}
		}

		// For auth endpoints, don't automatically logout on 401
		if (error.response?.status === 401 && isAuthEndpoint) {
			console.log(
				"Auth endpoint returned 401 - this is expected for unauthenticated requests",
			);
		}

		return Promise.reject(error);
	},
);

// Request interceptor to add additional headers if needed
api.interceptors.request.use(
	(config) => {
		// Log API calls in development
		if (import.meta.env.DEV) {
			console.log(`API ${config.method?.toUpperCase()}: ${config.url}`);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
