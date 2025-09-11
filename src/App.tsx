import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { ResetPassword } from "./components/features/auth/ResetPassword";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import TurfDetailsPage from "./pages/turfs/TurfDetails";
import TurfListingPage from "./pages/turfs/TurfPage";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<ErrorBoundary>
				<Toaster richColors position="bottom-right" />
				<Routes>
					<Route path="/" element={<MainLayout />}>
						{/* Public Routes */}
						<Route index element={<HomePage />} />
						<Route path="auth" element={<AuthPage />} />
						<Route path="auth/verify-otp" element={<OTPVerificationPage />} />
						<Route path="reset-password/:token" element={<ResetPassword />} />

						<Route path="turfs" element={<TurfListingPage />} />
						<Route path="turfs/:slug" element={<TurfDetailsPage />} />
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
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</ErrorBoundary>
		</ThemeProvider>
	);
}

export default App;
