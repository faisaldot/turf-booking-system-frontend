export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	meta?: {
		totalItems: number;
		totalPages: number;
		currentPage: number;
		itemsPerPage: number;
	};
}

export interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	role: "user" | "admin" | "manager";
	isVerified: boolean;
	isActive: boolean;
	profilePicture?: string;
	createdAt: string;
	updatedAt: string;
}
