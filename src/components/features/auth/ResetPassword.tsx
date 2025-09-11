import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
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
import { resetPasswordSchema } from "@/lib/validation";
import type { ResetPasswordData } from "@/types/api.types";

export function ResetPassword() {
	const { resetPassword, isLoading } = useAuth();

	const { token } = useParams<{ token: string }>();

	const form = useForm<ResetPasswordData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = (data: ResetPasswordData) => {
		console.log("Reset password data being submitted:", data);

		if (token) {
			resetPassword({ token, password: data.password });
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="New password" {...field} />
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
					{isLoading ? <LoadingSpinner size="sm" /> : "Reset Password"}
				</Button>
			</form>
		</Form>
	);
}
