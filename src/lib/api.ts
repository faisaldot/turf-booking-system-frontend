import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { authStore } from "@/store/auth";
import type { ApiResponse } from "@/types/api.types";

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
		const response = await api.post<ApiResponse<{ accessToken: string }>>(
			"/auth/refresh-token",
			{},
		);
		return response.data.data?.accessToken;
	} catch (error) {
		console.error("Token refresh failed: ", error);
		throw error;
	}
}

// Request interceptors for auth token
api.interceptors.request.use(
	(config) => {
		const token = authStore.getState().accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		// Handle token refresh on 401 error
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();

				if (newAccessToken) {
					authStore
						.getState()
						.setTokens(newAccessToken, authStore.getState().refreshToken || "");

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					}
					return api(originalRequest);
				}
			} catch (refreshError) {
				console.error("Token refresh failed: ", refreshError);
				authStore.getState().logout();
				window.location.href = "/auth/login";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
