import { Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/Home";

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				{/* Public Routes */}
				<Route index element={<HomePage />} />
				<Route path="auth" element={<AuthPage />} />
				<Route
					path="unauthorized"
					element={<div>You do not have access to this page</div>}
				/>
				{/* Protected Routes */}
				<Route
					path="dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				{/* Example: Role base protected route */}
				<Route
					path="admin"
					element={
						<ProtectedRoute requiredRole="admin">
							<div>Admin Dashboard</div>
						</ProtectedRoute>
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
