import { OTPVerification } from "@/components/features/auth/OTPVerification";

export default function OTPVerificationPage() {
	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
			<div className="w-full max-w-md">
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold">Verify Your Email</h1>
					<p className="text-muted-foreground mt-2">
						Enter the 6-digit code sent to your email
					</p>
				</div>
				<OTPVerification />
			</div>
		</div>
	);
}
