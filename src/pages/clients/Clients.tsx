import { useState } from "react";

const clientsData = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Davis",
    "Diana Lopez",
    "Edward Martin",
];

export default function ClientsTable() {
    const [search, setSearch] = useState("");

    const filteredClients = clientsData.filter((client) =>
        client.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Company List</h1>
            <input
                type="text"
                placeholder="Search company..."
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="px-6 py-3 text-sm font-medium text-gray-700">
                            Company Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client, index) => (
                        <tr key={index} className="border-t  border-gray-200">
                            <td className="px-6 py-3 hover:bg-gray-100 text-gray-800">
                                {client}
                            </td>
                        </tr>
                    ))}
                    {filteredClients.length === 0 && (
                        <tr>
                            <td className="px-6 py-3 text-gray-500 italic">
                                No clients found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
