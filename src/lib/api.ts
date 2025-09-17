import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { authStore } from "@/store/auth";
import type { ApiError } from "@/types/api.types";

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
		if (response.data?.accessToken) {
			authStore.getState().setTokens(response.data.accessToken);
		}
		return true;
	} catch (error) {
		console.error("Token refresh failed: ", error);
		throw error;
	}
}

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		// Handle token refresh on 401 error
		if (
			error.response?.status === 401 &&
			error.response.data?.error === "TOKEN_EXPIRED" &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				await refreshAccessToken();
				// Token is now refreshed in cookies, retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				console.error("Token refresh failed: ", refreshError);
				authStore.getState().logout();
				window.location.href = "/auth";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
