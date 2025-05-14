import { useState } from "react";
import Addclients from "../misc/Addclients";

const clientsData = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Davis",
    "Diana Lopez",
    "Edward Martin",
];

export default function Clients() {
    const [search, setSearch] = useState("");

    const filteredClients = clientsData.filter((client) =>
        client.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Company List</h1>
            <input
                type="text"
                placeholder="Search company..."
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="px-6 py-3 text-sm font-medium text-gray-700">
                            Company Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client, index) => (
                        <tr key={index} className="border-t border-gray-200">
                            <td className="px-6 py-3 text-gray-800 hover:bg-gray-100">
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
            <div className="absolute right-0 bottom-4 flex">
                <Addclients />
            </div>
        </div>
    );
}
