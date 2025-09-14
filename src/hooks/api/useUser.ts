import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { authStore } from "@/store/auth";
import type { ApiResponse, UpdateProfileData, User } from "@/types/api.types";

export function useUser() {
	const queryClient = useQueryClient();
	const { user: userState, updateUser } = authStore();

	const userQuery = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const response = await api.get<ApiResponse<User>>("/users/me");
			return response.data.data;
		},
		// The query should only run if the user is authenticated
		enabled: !!userState,
		// Update the Zustand store with the fetched user data
		onSuccess: (data) => {
			if (data) {
				updateUser(data);
			}
		},
	});

	const updateProfileMutation = useMutation({
		mutationFn: async (data: UpdateProfileData) => {
			const response = await api.patch<ApiResponse<User>>("/users/me", data);
			return response.data.data;
		},
		onSuccess: (updatedUser) => {
			if (updatedUser) {
				toast.success("Profile updated successfully!");
				// Invalidate the 'me' query to refetch fresh data
				queryClient.invalidateQueries({ queryKey: ["me"] });
				// Also update the Zustand store directly to avoid a slight delay
				updateUser(updatedUser);
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update profile.");
		},
	});

	return {
		user: userQuery.data,
		isLoading: userQuery.isLoading,
		isUpdating: updateProfileMutation.isPending,
		updateProfile: updateProfileMutation.mutate,
	};
}
