import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api.types";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	accessToken: string | null;
}

interface AuthActions {
	setUser: (user: User) => void;
	setTokens: (accessToken: string | null) => void;
	login: (user: User, accessToken: string) => void;
	logout: () => void;
	updateUser: (updates: Partial<User>) => void;
	setLoading: (loading: boolean) => void;
	clearAuth: () => void;
}

export const authStore = create<AuthState & AuthActions>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			accessToken: null,

			setUser: (user) => set({ user, isAuthenticated: true }),

			// New action to update tokens separately
			setTokens: (accessToken) => set({ accessToken }),

			login: (user, accessToken) =>
				set({
					user,
					isAuthenticated: true,
					isLoading: false,
					accessToken,
				}),

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
					accessToken: null,
				});
			},

			clearAuth: () => get().logout(),

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
				isAuthenticated: state.isAuthenticated,
			}),
			version: 2,
		},
	),
);
