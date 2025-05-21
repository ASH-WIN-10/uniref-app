import AddClientButton from "./AddClientButton";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import CompanyListSearchBar from "./CompanyListSearch";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { invoke } from "@tauri-apps/api/core";

interface Client {
    id: string;
    company_name: string;
    state: string;
    city: string;
    segment: string;
}

export default function CompanyList() {
    const {
        data: initialClients,
        isLoading,
        error,
    } = useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: async () => {
            try {
                const response = (await invoke("fetch_clients")) as {
                    clients: Client[];
                };
                const clients = response.clients;
                return clients;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });

    const [displayedClients, setDisplayedClients] = useState<Client[]>([]);
    const [message, setMessage] = useState<string | undefined>();
    const navigate = useNavigate();

    useMemo(() => {
        if (initialClients) {
            setDisplayedClients(initialClients);
        }
    }, [initialClients]);

    const handleSearch = useCallback((clients: Client[], message?: string) => {
        setDisplayedClients(clients);
        setMessage(message);
    }, []);

    if (isLoading) return <LoadingScreen />;
    if (error) return <div>Error loading clients</div>;

    return (
        <div className="mx-auto max-w-4xl p-6">
            <CompanyListSearchBar
                onSearch={handleSearch}
                initialClients={initialClients || []}
            />
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                                Company Name
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                                Segment
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
                                    className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.company_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.segment}
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
                                    colSpan={4}
                                    className="px-6 py-4 text-center text-sm text-gray-500">
                                    {message || "No companies available"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="absolute right-0 bottom-0 mb-4">
                <AddClientButton />
            </div>
        </div>
    );
}
