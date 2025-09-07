import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

const authStore = "";

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
		const originalRequest = error.config as any;

		// Handle token refresh on 401 error
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = authStore.getState().refreshToken;
				if (!refreshToken) throw new Error("No refresh token");

				const response = await api.post<
					ApiResponse<{
						accessToken: string;
					}>
				>("/auth/refresh-token", {
					refreshToken,
				});

				const accessToken = response.data.data?.accessToken;
				authStore.getState().setTokens(accessToken, refreshToken);

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
