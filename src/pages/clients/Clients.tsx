import Addclients from "./Addclients";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, RefreshCcwIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IndiaStates } from "./create/stateData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Client {
    id: string;
    company_name: string;
    state: string;
    city: string;
}

const SearchBar = ({
    onSearch,
    initialClients,
}: {
    onSearch: (clients: Client[], message?: string) => void;
    initialClients: Client[];
}) => {
    const [search, setSearch] = useState("");
    const [selectedState, setSelectedState] = useState<string>("all");
    const [selectedCity, setSelectedCity] = useState<string>("all");

    const handleSearch = async () => {
        try {
            let queryParams = new URLSearchParams();

            if (search.trim()) {
                queryParams.append("company_name", search.toLowerCase());
            }
            if (selectedState && selectedState !== "all") {
                queryParams.append("state", selectedState);
            }
            if (selectedCity && selectedCity !== "all") {
                queryParams.append("city", selectedCity);
            }

            const response = await fetch(
                `http://192.168.0.31:8080/v1/clients?${queryParams.toString()}`,
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            let filteredClients = data.clients || [];

            if (search.trim()) {
                filteredClients = filteredClients.filter((client: Client) =>
                    client.company_name
                        .toLowerCase()
                        .startsWith(search.toLowerCase()),
                );
            }

            if (
                selectedState !== "all" ||
                selectedCity !== "all" ||
                search.trim()
            ) {
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
    };

    const handleRefresh = () => {
        setSearch("");
        setSelectedState("all");
        setSelectedCity("all");
        onSearch(initialClients);
    };

    const selectedStateData = IndiaStates.find(
        (s) => s.state === selectedState,
    );

    useEffect(() => {
        handleSearch();
    }, [selectedState, selectedCity]);

    return (
        <div className="mb-4 space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        onClick={handleSearch}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        <SearchIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        title="Show all companies">
                        <RefreshCcwIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleRefresh}
                    className="bg-primary hover:bg-primary/80 rounded-lg px-4 py-2 text-white"
                    title="Show all companies">
                    All
                </button>
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
};

function useClients() {
    return useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: async () => {
            const response = await fetch("http://192.168.0.31:8080/v1/clients");
            const data = await response.json();
            return data.clients;
        },
    });
}

export default function Clients() {
    const { data: initialClients, error } = useClients();
    const [displayedClients, setDisplayedClients] = useState<Client[]>([]);
    const [message, setMessage] = useState<string | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        if (initialClients) {
            setDisplayedClients(initialClients);
        }
    }, [initialClients]);

    const handleSearch = (clients: Client[], message?: string) => {
        setDisplayedClients(clients);
        setMessage(message);
    };

    if (error) return <div>Error loading clients</div>;

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Company List</h1>
            </div>
            <SearchBar
                onSearch={handleSearch}
                initialClients={initialClients || []}
            />
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                                Company Name
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                                State
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                                City
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {displayedClients.length > 0 ? (
                            displayedClients.map((client) => (
                                <tr
                                    onClick={() =>
                                        navigate(`/clients/${client.id}`)
                                    }
                                    key={client.id}
                                    className="cursor-pointer hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.company_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.state}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.city}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-4 text-center text-sm text-gray-500">
                                    {message || "No companies available"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="absolute right-0 bottom-0 mb-4">
                <Addclients />
            </div>
        </div>
    );
}
