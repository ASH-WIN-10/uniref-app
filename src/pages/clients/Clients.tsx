import Addclients from "./Addclients";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface Client {
    id: string;
    company_name: string;
}

const SearchBar = ({
    onSearch,
    initialClients,
}: {
    onSearch: (clients: Client[]) => void;
    initialClients: Client[];
}) => {
    const [search, setSearch] = useState("");

    const handleSearch = async () => {
        try {
            if (!search.trim()) {
                onSearch(initialClients);
                return;
            }

            const response = await fetch(
                `http://192.168.0.31:8080/v1/clients?company_name=${encodeURIComponent(search.toLowerCase())}`,
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            const filteredClients = (data.clients || []).filter(
                (client: Client) =>
                    client.company_name
                        .toLowerCase()
                        .startsWith(search.toLowerCase()),
            );
            onSearch(
                filteredClients.length > 0 ? filteredClients : initialClients,
            );
        } catch (error) {
            console.error("Search failed:", error);
            onSearch(initialClients);
        }
    };

    const handleRefresh = () => {
        setSearch("");
        onSearch(initialClients);
    };

    return (
        <div className="mb-4 flex gap-2">
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
                title="Refresh list">
                ↻
            </button>
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
    const navigate = useNavigate();

    useEffect(() => {
        if (initialClients) {
            setDisplayedClients(initialClients);
        }
    }, [initialClients]);

    const handleSearch = (clients: Client[]) => {
        setDisplayedClients(
            clients.length > 0 ? clients : initialClients || [],
        );
    };

    if (error) return <div>Error loading clients</div>;

    return (
        <div className="mx-auto max-w-2xl p-6">
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-6 py-4 text-center text-sm text-gray-500">
                                    No companies found
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
