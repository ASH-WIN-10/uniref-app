import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

interface File {
    id: number;
    created_at: string;
    original_file_name: string;
    file_name: string;
    file_path: string;
    category: string;
    client_id: number;
}

interface Client {
    id: number;
    company_name: string;
    client_name: string;
    email: string;
    phone: string;
    files: File[];
}

async function getClient(clientId: number): Promise<Client> {
    const res = await fetch(`http://localhost:8080/v1/clients/${clientId}`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data.client;
}

export default function ClientPage() {
    const params = useParams();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    if (params.id === undefined) return <div>Client not found</div>;
    const clientId = parseInt(params.id);
    if (isNaN(clientId)) return <div>Invalid client ID</div>;

    const {
        data: client,
        isLoading,
        error,
    } = useQuery<Client>({
        queryKey: ["client"],
        queryFn: () => getClient(clientId),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!client) return <div>Client not found</div>;

    const categories = [
        "all",
        "invoice",
        "purchase_order",
        "handing_over_report",
        "pms_reports",
    ];

    const filteredFiles =
        selectedCategory === "all"
            ? client.files
            : client.files.filter((file) => file.category === selectedCategory);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">
                    {client.company_name}
                </h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-gray-600">
                            <span className="font-semibold">
                                Contact Person:
                            </span>{" "}
                            {client.client_name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Email:</span>{" "}
                            {client.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            <span className="font-semibold">Phone:</span>{" "}
                            {client.phone}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Documents
                    </h2>
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}>
                                {category
                                    .split("_")
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                    )
                                    .join(" ")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFiles.map((file) => (
                        <div
                            key={file.id}
                            className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="mb-1 truncate font-medium text-gray-800">
                                        {file.original_file_name}
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-500">
                                        {formatDate(file.created_at)}
                                    </p>
                                    <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                        {file.category
                                            .split("_")
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(" ")}
                                    </span>
                                </div>
                                <a
                                    href={file.file_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 p-2 text-gray-600 transition-colors hover:text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFiles.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                        No files found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
