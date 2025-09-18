import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea"; // <-- Import Textarea
import { useUser } from "@/hooks/api/useUser";
import { updateProfileSchema } from "@/lib/validation";
import type { UpdateProfileData } from "@/types/api.types";

export default function ProfileForm() {
	const { user, updateProfile, isUpdating } = useUser();

	const form = useForm<UpdateProfileData>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user?.name || "",
			phone: user?.phone || "",
			address: user?.address || "",
		},
	});

	// Reset form with user data when it loads
	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name,
				phone: user.phone || "",
				address: user.address || "",
			});
		}
	}, [user, form]);

	const onSubmit = (data: UpdateProfileData) => {
		updateProfile(data);
	};

	return (
		<Card className="max-w-3xl">
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>Update your personal details here.</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-6">
						{/* Email (Read-only) */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
							<FormLabel>Email</FormLabel>
							<Input value={user?.email || ""} disabled className="bg-muted" />
						</div>

						{/* Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Your name" {...field} />
									</FormControl>
									<FormMessage className="md:col-start-2" />
								</FormItem>
							)}
						/>

						{/* Phone */}
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input placeholder="Your phone number" {...field} />
									</FormControl>
									<FormMessage className="md:col-start-2" />
								</FormItem>
							)}
						/>

						{/* Address */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
									<FormLabel className="pt-2">Address</FormLabel>
									<FormControl>
										<Textarea placeholder="Your address" {...field} />
									</FormControl>
									<FormMessage className="md:col-start-2" />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="border-t px-6 py-4">
						<Button
							type="submit"
							disabled={isUpdating || !form.formState.isDirty}
						>
							{isUpdating && <LoadingSpinner size="sm" className="mr-2" />}
							Save Changes
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
