import { useState } from "react";
import { ForgotPassword } from "@/components/features/auth/ForgotPassword";
import LoginForm from "@/components/features/auth/LoginForm";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/auth/useAuth";

type AuthState = "login" | "register" | "forgot-password";

export default function AuthPage() {
	const [authState, setAuthState] = useState<AuthState>("login");

	const { isLoading } = useAuth();

	const renderForm = () => {
		switch (authState) {
			case "login":
				return <LoginForm />;
			case "register":
				return <RegisterForm />;
			case "forgot-password":
				return <ForgotPassword />;
			default:
				return null;
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">
						{authState === "login"
							? "Login to your account"
							: authState === "register"
								? "Create an account"
								: "Forgot your password?"}
					</CardTitle>
					<CardDescription>
						{authState === "login"
							? "Enter your details below to log in"
							: authState === "register"
								? "Enter your details below to create a new account"
								: "Enter your email to receive a password reset link"}
					</CardDescription>
				</CardHeader>
				<CardContent>{renderForm()}</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					{authState === "login" && (
						<Button
							variant="link"
							onClick={() => setAuthState("forgot-password")}
							disabled={isLoading}
							className="cursor-pointer"
						>
							Forgot Password?
						</Button>
					)}

					<Button
						variant="link"
						onClick={() =>
							setAuthState(authState === "login" ? "register" : "login")
						}
						disabled={isLoading}
						className="cursor-pointer"
					>
						{authState === "login" || authState === "forgot-password"
							? `Don't have an account? Sign Up`
							: `Already have an account? Sign In`}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
