import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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

export function OTPVerification() {
	const { verifyOtp } = useAuth();
	const form = useForm<VerifyOtpData>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			email: "",
			otp: "",
		},
	});

	const onSubmit = (data: VerifyOtpData) => {
		console.log("Verifying OTP with", data);
		verifyOtp.mutate(data);
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
								<Input placeholder="XXXXXX" maxLength={6} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full cursor-pointer"
					disabled={verifyOtp.isPending}
				>
					{verifyOtp.isPending ? <LoadingSpinner size="sm" /> : "Verify"}
				</Button>
			</form>
		</Form>
	);
}
