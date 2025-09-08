import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils/useDebounce";

interface TurfSearchProps {
	onSearch: (query: string) => void;
}

export default function TurfSearch({ onSearch }: TurfSearchProps) {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);

	useEffect(() => {
		onSearch(debouncedQuery);
	}, [debouncedQuery, onSearch]);

	return (
		<Input
			placeholder="Search turfs by name or location..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			className="max-w-md"
		/>
	);
}
