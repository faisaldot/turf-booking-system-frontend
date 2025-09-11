import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { TurfCardSkeleton } from "@/components/ui/loading";
import api from "@/lib/api";
import type { ApiResponse, Turf } from "@/types/api.types";
import TurfSearch from "./TurfSearch";

export default function TurfList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useQuery({
		queryKey: ["turfs", page, searchQuery],
		queryFn: async () => {
			const response = await api.get<ApiResponse<Turf[]>>("/turfs", {
				params: { page, limit: 12, search: searchQuery },
			});
			return response.data;
		},
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is acceptable for skeleton loaders
					<TurfCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-destructive">Failed to load turfs</p>
				<Button onClick={() => window.location.reload()}>Retry</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-6 py-4">
			{/* Search and Filters */}
			<div className="flex gap-4">
				<TurfSearch onSearch={setSearchQuery} />
				{/* placeholder for future filtering UI */}
			</div>

			{/* Turfs Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.data?.map((turf) => (
					<TurfCard key={turf._id} turf={turf} />
				))}
			</div>
			{/* Pagination */}
			{data?.meta && data.meta.totalPages > 1 && (
				<div className="mt-8 flex justify-center items-center space-x-4">
					{/* Previous Button */}
					<Button
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						disabled={page <= 1}
						variant="outline"
					>
						Previous
					</Button>

					{/* Page Info */}
					<div className="flex items-center space-x-2 text-sm text-muted-foreground">
						<span>
							Page {data.meta.currentPage} of {data.meta.totalPages}
						</span>
						{data.meta.totalPages && (
							<span className="text-xs">
								({data.meta.totalPages} total items)
							</span>
						)}
					</div>

					{/* Next Button */}
					<Button
						onClick={() => setPage((prev) => prev + 1)}
						disabled={page >= data.meta.totalPages}
						variant="outline"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}

function TurfCard({ turf }: { turf: Turf }) {
	return (
		<Card className="flex flex-col">
			{/* Image */}
			<CardHeader className="p-0 ">
				<img
					src={turf.images[0] || "https://picsum.photos/400/200?random=1"}
					alt={turf.name}
					className="w-full h-48 md:h-56 object-cover -mt-7 rounded-t-xl"
				/>
			</CardHeader>

			{/* Content */}
			<CardContent className="p-4 flex flex-col grow">
				<h3 className="font-semibold text-lg md:text-xl">{turf.name}</h3>
				<div className="flex items-center text-sm text-muted-foreground mt-1">
					<MapPin className="h-4 w-4 mr-1" />
					<span>{turf.location.city}</span>
				</div>

				<div className="mt-3 flex flex-wrap gap-2">
					{turf.amenities.slice(0, 3).map((amenity) => (
						<Badge
							key={amenity}
							variant="outline"
							className="text-xs px-2 py-1 rounded-full"
						>
							{amenity}
						</Badge>
					))}
				</div>

				<p className="mt-3 text-sm text-muted-foreground line-clamp-2">
					{turf.description}
				</p>
			</CardContent>

			{/* Footer */}
			<CardFooter className="flex justify-between items-center p-4">
				<div className="text-lg md:text-xl font-bold">
					৳{turf.defaultPricePerSlot}{" "}
					<span className="text-sm font-normal text-muted-foreground">
						/ hr
					</span>
				</div>
				<Link to={`/turfs/${turf.slug}`} className="w-full md:w-auto">
					<Button className="w-full md:w-auto hover:cursor-pointer">
						View Details
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
