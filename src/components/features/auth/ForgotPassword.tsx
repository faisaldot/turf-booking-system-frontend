import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/hooks/auth/useAuth";
import { forgotPasswordSchema } from "@/lib/validation";
import type { ForgotPasswordData } from "@/types/api.types";

export function ForgotPassword() {
	const { forgotPassword, isLoading } = useAuth();
	const form = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (data: ForgotPasswordData) => {
		console.log("Forgot password data being submitted:", data);
		forgotPassword(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="me@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full cursor-pointer"
					disabled={isLoading}
				>
					{isLoading ? <LoadingSpinner size="sm" /> : "Send Reset Link"}
				</Button>
			</form>
		</Form>
	);
}
