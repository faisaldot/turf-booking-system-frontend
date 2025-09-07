import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api";

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

interface AuthAction {
	setUser: (user: User) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	login: (user: User, accessToken: string, refreshToken: string) => void;
	logout: () => void;
	updateUser: (updates: Partial<User>) => void;
	setLoading: (loading: boolean) => void;
}

export const authStore = create<AuthState & AuthAction>()(
	persist(
		(set, _get) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,

			setUser: (user) => set({ user, isAuthenticated: true }),
			setTokens: (accessToken, refreshToken) =>
				set({ accessToken, refreshToken }),

			login: (user, accessToken, refreshToken) =>
				set({ user, accessToken, refreshToken, isAuthenticated: false }),

			logout: () =>
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
				}),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),

			setLoading: (loading) => set({ isLoading: loading }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
