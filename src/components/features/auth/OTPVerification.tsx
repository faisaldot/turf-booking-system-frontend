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
import { verifyOtpSchema } from "@/lib/validation";
import type { VerifyOtpData } from "@/types/api.types";

export function OTPVerification() {
	const form = useForm<VerifyOtpData>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			email: "",
			otp: "",
		},
	});

	const onSubmit = (data: VerifyOtpData) => {
		console.log(data);
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
								<Input placeholder="XXXXXX" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Verify
				</Button>
			</form>
		</Form>
	);
}
