import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react"; // <-- 1. Import useEffect
import { toast } from "sonner";
import api from "@/lib/api";
import { authStore } from "@/store/auth";
import type {
	ApiError,
	ApiResponse,
	UpdateProfileData,
	User,
} from "@/types/api.types";

export function useUser() {
	const queryClient = useQueryClient();
	const { user: userState, updateUser } = authStore();

	const userQuery = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const response = await api.get<User>("/users/me");
			return response.data;
		},
		enabled: !!userState,
	});

	//  Add a useEffect to sync the fetched data with the Zustand store
	useEffect(() => {
		if (userQuery.data) {
			updateUser(userQuery.data);
		}
	}, [userQuery.data, updateUser]);

	const updateProfileMutation = useMutation({
		mutationFn: async (data: UpdateProfileData) => {
			const response = await api.patch<ApiResponse<User>>("/users/me", data);
			return response.data.data;
		},
		onSuccess: (updatedUser) => {
			if (updatedUser) {
				toast.success("Profile updated successfully!");
				queryClient.invalidateQueries({ queryKey: ["me"] });
			}
		},
		onError: (error: AxiosError<ApiError>) => {
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
