import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { verifyOtpSchema } from "@/lib/validation";
import type { VerifyOtpData } from "@/types/api.types";

export default function OTPVerification() {
	const { verifyOtp, isLoading } = useAuth();
	const form = useForm<VerifyOtpData>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			email: "",
			otp: "",
		},
	});

	// Pre-fill email if available from session storage
	useEffect(() => {
		const storedEmail = sessionStorage.getItem("otp-email");
		if (storedEmail) {
			form.setValue("email", storedEmail);
		}
	}, [form]);

	const onSubmit = (data: VerifyOtpData) => {
		console.log("Verifying OTP with:", data);
		verifyOtp(data);
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
								<Input placeholder="name@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="otp"
					render={({ field }) => (
						<FormItem>
							<FormLabel>OTP Code</FormLabel>
							<FormControl>
								<Input
									placeholder="XXXXXX"
									maxLength={6}
									{...field}
									onChange={(e) => {
										// Only allow numbers
										const value = e.target.value.replace(/\D/g, "");
										field.onChange(value);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full cursor-pointer"
					disabled={isLoading || !form.formState.isValid}
				>
					{isLoading ? <LoadingSpinner size="sm" /> : "Verify"}
				</Button>
			</form>
		</Form>
	);
}
