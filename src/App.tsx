import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { ResetPassword } from "./components/features/auth/ResetPassword";
import BookingList from "./components/features/dashboard/BookingList";
import DashboardLayout from "./components/layout/DashBoardLayout";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { AppLoading } from "./components/ui/appLoading";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import PaymentFailedPage from "./pages/payment/PaymentFailed";
import PaymentSuccessPage from "./pages/payment/PaymentSuccess";
import TurfDetailsPage from "./pages/turfs/TurfDetails";
import TurfListingPage from "./pages/turfs/TurfPage";

function App() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsReady(true);
		}, 250);

		return () => clearTimeout(timer);
	}, []);

	// Show loading spinner while checking authentication on initial load
	if (!isReady) {
		return (
			<AppLoading
				message="Authenticating and loading your workspace..."
				showSkeleton={false}
			/>
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
									<DashboardLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<BookingList />} />
							<Route path="bookings" element={<BookingList />} />
							<Route path="profile" element={<ProfilePage />} />
							<Route />
						</Route>

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
