import Addclients from "./Addclients";
import { useQuery } from "@tanstack/react-query";

interface Client {
    id: string;
    company_name: string;
}

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
    const { data: clients, isLoading, error } = useClients();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading clients</div>;

    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Company List</h1>
            </div>
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
                        {clients?.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {client.company_name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="absolute right-0 bottom-0 mb-4">
                <Addclients />
            </div>
        </div>
    );
}
