import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { authStore } from "@/store/auth";
import type { ApiResponse } from "@/types/api";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

async function refreshAccessToken(refreshToken: string) {
	const response = await api.post<ApiResponse<{ accessToken: string }>>(
		"/auth/refresh-token",
		{ refreshToken },
	);
	return response.data.data?.accessToken;
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
				const refreshToken = authStore.getState().refreshToken;
				if (!refreshToken) throw new Error("No refresh token");

				const newAccessToken = await refreshAccessToken(refreshToken);

				authStore.getState().setTokens(newAccessToken!, refreshToken);

				return api(originalRequest);
			} catch (refreshError) {
				authStore.getState().logout();
				window.location.href = "/auth/login";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
