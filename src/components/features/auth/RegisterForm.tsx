// RegisterForm.tsx

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
import { registerSchema } from "@/lib/validation";
import type { RegisterData } from "@/types/api.types";

export function RegisterForm() {
	const { register, isLoading } = useAuth();
	const form = useForm<RegisterData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
		},
	});

	const onSubmit = (data: RegisterData) => {
		console.log("Form data being submitted:", data);
		register(data, {
			onSuccess: () => {
				form.reset();
			},
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder="phone" {...field} type="number" />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full cursor-pointer"
					disabled={isLoading}
				>
					{isLoading ? <LoadingSpinner size="sm" /> : "Register"}
				</Button>
			</form>
		</Form>
	);
}
