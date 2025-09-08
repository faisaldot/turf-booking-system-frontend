import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { authStore } from "@/store/auth";
import type { User } from "@/types/api.types";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: User["role"];
	redirectTo?: string;
}

export default function ProtectedRoute({
	children,
	requiredRole,
	redirectTo = "/auth/login",
}: ProtectedRouteProps) {
	const { user, isAuthenticated } = authStore();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	if (requiredRole && user?.role !== requiredRole && user?.role !== "manager") {
		return <Navigate to="/unauthorized" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
