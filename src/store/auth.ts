import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api.types";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

interface AuthAction {
	setUser: (user: User) => void;
	login: (user: User, accessToken: string, refreshToken?: string) => void;
	logout: () => void;
	updateUser: (updates: Partial<User>) => void;
	setLoading: (loading: boolean) => void;
	clearAuth: () => void;
}

export const authStore = create<AuthState & AuthAction>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,

			setUser: (user) => set({ user, isAuthenticated: true }),

			login: (user) =>
				set({
					user,
					isAuthenticated: true,
					isLoading: false,
				}),

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
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
			version: 2, // Increment version to clear old data with tokens
		},
	),
);
