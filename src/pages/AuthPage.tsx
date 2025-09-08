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
import { useState } from "react";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">
						{isLogin ? "Login to your account" : "Create an account"}
					</CardTitle>
					<CardDescription>
						Enter you details below to{" "}
						{isLogin ? "log in" : "create a new account"}
					</CardDescription>
				</CardHeader>
				<CardContent>{isLogin ? <LoginForm /> : <RegisterForm />}</CardContent>
				<CardFooter className="flex-col">
					<Button variant="link" onClick={() => setIsLogin(!isLogin)}>
						{isLogin
							? `Don't have an account? Sign Up`
							: `Already have an account? Sign In`}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
