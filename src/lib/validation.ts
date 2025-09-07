import { email, z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	phone: z
		.string()
		.min(11, "Phone number must be at least 11 digits")
		.max(14, "Phone number must not exceed 14 digits"),
});

export const verifyOtpSchema = z.object({
	email: z.email(),
	otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
});

// Booking Schema
export const createBookingSchema = z
	.object({
		turf: z.string(),
		date: z
			.date({
				error: (issue) =>
					issue.input === undefined
						? "Please select a date"
						: issue.code === "invalid_type"
							? "Invalid date format"
							: undefined,
			})
			.refine(
				(date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
				"Date must be today or in the future",
			),
		startTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
		endTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const updateBookingStatusSchema = z.object({
	status: z.enum(["pending", "confirmed", "cancelled"]),
});

// Turf Schema
export const createTurfSchema = z.object({
	name: z.string().min(3),
	location: z.object({
		address: z.string().min(3),
		city: z.string().min(3),
	}),
	description: z.string().optional(),
	pricingRules: z
		.array(
			z.object({
				dayType: z.enum(["sunday-thursday", "friday-saturday", "all-days"]),
				timeSlots: z
					.array(
						z.object({
							startTime: z
								.string()
								.regex(
									/^([01]\d|2[0-3]):([0-5]\d)$/,
									"Invalid time format, expected HH:mm",
								),
							endTime: z
								.string()
								.regex(
									/^([01]\d|2[0-3]):([0-5]\d)$/,
									"Invalid time format, expected HH:mm",
								),
							pricePerSlot: z.number().nonnegative(),
						}),
					)
					.min(1, "At least one time slot is required per rule."),
			}),
		)
		.min(1, "At least one pricing rule is required."),
	defaultPricePerSlot: z
		.number()
		.nonnegative("Default price must be a non-negative number."),
	amenities: z.array(z.string()).optional(),
	images: z.array(z.url()).optional(),
	operatingHours: z.object({
		start: z.string().min(1),
		end: z.string().min(1),
	}),
});

export const updateTurfSchema = createTurfSchema.partial();

// User Schema
export const updateProfileSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.email().optional(),
	phone: z.string().min(11).max(14).optional(),
	profilePictures: z.url().optional(),
});
