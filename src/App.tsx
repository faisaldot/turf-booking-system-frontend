import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { ResetPassword } from "./components/features/auth/ResetPassword";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from "./hooks/auth/useAuth";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import PaymentFailedPage from "./pages/payment/PaymentFailed";
import PaymentSuccessPage from "./pages/payment/PaymentSuccess";
import TurfDetailsPage from "./pages/turfs/TurfDetails";
import TurfListingPage from "./pages/turfs/TurfPage";

function App() {
	const { isLoading, isAuthenticated } = useAuth();

	// Show loading spinner while checking authentication on initial load
	if (isLoading && !isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

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
							element={
								<div className="flex items-center justify-center min-h-[60vh]">
									<div className="text-center">
										<h1 className="text-2xl font-bold mb-2">Access Denied</h1>
										<p className="text-muted-foreground">
											You do not have access to this page
										</p>
									</div>
								</div>
							}
						/>

						{/* Payment Callback Routes */}
						<Route path="booking-success" element={<PaymentSuccessPage />} />
						<Route path="booking-failed" element={<PaymentFailedPage />} />

						{/* Protected Routes */}
						<Route
							path="dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>

						{/* Role based protected route */}
						<Route
							path="admin"
							element={
								<ProtectedRoute requiredRole="admin">
									<div className="flex items-center justify-center min-h-[60vh]">
										<div className="text-center">
											<h1 className="text-2xl font-bold mb-2">
												Admin Dashboard
											</h1>
											<p className="text-muted-foreground">
												Welcome to the admin panel
											</p>
										</div>
									</div>
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
