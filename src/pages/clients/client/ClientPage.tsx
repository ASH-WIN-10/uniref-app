import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { Pencil } from "lucide-react";
import BackButton from "@/components/custom/BackButton";
import { Button } from "@/components/ui/button";
import FileCard from "./FileCard";
import AddFile from "./AddFileDialog";
import LoadingScreen from "@/components/custom/LoadingScreen";
import DeleteClientButton from "./DeleteClientButton";
import { invoke } from "@tauri-apps/api/core";

export interface File {
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
    state: string;
    city: string;
    segment: string;
    files: File[];
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
        queryKey: ["client", clientId],
        queryFn: async () => {
            try {
                const response = (await invoke("fetch_client", {
                    clientId: clientId,
                })) as {
                    client: Client;
                };
                const client = response.client;
                return client;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });

    if (isLoading) return <LoadingScreen />;
    if (error) return <div>Error: {error.message}</div>;
    if (!client) return <div>Client not found</div>;

    const categories = [
        "all",
        "invoice",
        "purchase_order",
        "handing_over_report",
        "pms_report",
    ];

    const filteredFiles =
        selectedCategory === "all"
            ? client.files
            : client.files.filter((file) => file.category === selectedCategory);

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <BackButton />
            </div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {client.company_name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {client.segment}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link to={`/clients/${clientId}/edit`}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-100 hover:bg-gray-200">
                                <Pencil />
                            </Button>
                        </Link>
                        <DeleteClientButton clientId={clientId} />
                    </div>
                </div>
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
                        <p className="text-gray-600">
                            <span className="font-semibold">Location:</span>{" "}
                            {client.city}, {client.state}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Documents
                        </h2>
                        <div className="flex gap-2">
                            <AddFile clientId={clientId} />
                        </div>
                    </div>
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
                        <FileCard file={file} key={file.id} />
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
