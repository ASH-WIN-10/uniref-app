import { IndiaStates } from "./create/stateData";
import { segment } from "./create/segment";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useMemo, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Client {
    id: string;
    company_name: string;
    state: string;
    city: string;
    segment: string;
}
export default function CompanyListSearchBar({
    onSearch,
    initialClients,
}: {
    onSearch: (clients: Client[], message?: string) => void;
    initialClients: Client[];
}) {
    const [search, setSearch] = useState("");
    const [selectedSegment, setSelectedSegment] = useState<string>("all");
    const [selectedState, setSelectedState] = useState<string>("all");
    const [selectedCity, setSelectedCity] = useState<string>("all");

    const handleSearch = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams();

            if (search.trim()) {
                queryParams.append("company_name", search.toLowerCase());
            }
            if (selectedSegment !== "all") {
                queryParams.append("segment", selectedSegment);
            }
            if (selectedState !== "all") {
                queryParams.append("state", selectedState);
            }
            if (selectedCity !== "all") {
                queryParams.append("city", selectedCity);
            }

            if (
                search.trim() ||
                selectedSegment !== "all" ||
                selectedState !== "all" ||
                selectedCity !== "all"
            ) {
                let clients: Client[] = [];
                try {
                    const response = (await invoke("fetch_clients", {
                        queryParams: queryParams.toString(),
                    })) as {
                        clients: Client[];
                    };
                    clients = response.clients;
                    console.log(queryParams.toString());
                } catch (error) {
                    console.error("Error fetching clients:", error);
                    onSearch([], "Error loading companies");
                    return;
                }

                const filteredClients = clients;
                const message =
                    filteredClients.length === 0
                        ? "No companies found matching your filters"
                        : undefined;
                onSearch(filteredClients, message);
            } else {
                onSearch(initialClients);
            }
        } catch (error) {
            console.error("Search failed:", error);
            onSearch([], "Error loading companies");
        }
    }, [
        search,
        selectedSegment,
        selectedState,
        selectedCity,
        initialClients,
        onSearch,
    ]);

    const selectedStateData = useMemo(
        () => IndiaStates.find((s) => s.state === selectedState),
        [selectedState],
    );

    useEffect(() => {
        handleSearch();
    }, [handleSearch, selectedSegment, selectedState, selectedCity]);

    return (
        <div className="mb-4 space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <Select
                    value={selectedSegment}
                    onValueChange={setSelectedSegment}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Segment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Segments</SelectItem>
                        {segment.map((seg) => (
                            <SelectItem key={seg} value={seg}>
                                {seg}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedState}
                    onValueChange={(value) => {
                        setSelectedState(value);
                        setSelectedCity("all");
                    }}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {IndiaStates.map((state) => (
                            <SelectItem key={state.state} value={state.state}>
                                {state.state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={!selectedState || selectedState === "all"}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue
                            placeholder={
                                selectedState === "all"
                                    ? "Select State First"
                                    : "Select City"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {selectedStateData?.districts.map((city: string) => (
                            <SelectItem key={city} value={city}>
                                {city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
