import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/custom/BackButton";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { IndiaStates } from "../create/stateData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
    company_name: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    client_name: z.string().min(2, {
        message: "Client name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().length(10, {
        message: "Phone number must be only 10 digits.",
    }),
    state: z.string().min(1, {
        message: "Please select a state.",
    }),
    city: z.string().min(1, {
        message: "Please select a city.",
    }),
});

type FormData = z.infer<typeof formSchema>;

interface Client {
    id: number;
    company_name: string;
    client_name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
}

async function getClient(clientId: number): Promise<Client> {
    const res = await fetch(`http://192.168.0.31:8080/v1/clients/${clientId}`);
    if (!res.ok) {
        if (res.status === 404) throw new Error("Client not found");
        else throw new Error("Network response was not ok");
    }
    const data = await res.json();
    console.log(data);
    return data.client;
}

export default function EditClient() {
    const navigate = useNavigate();
    const params = useParams();
    const [selectedState, setSelectedState] = useState<string>("");

    if (!params.id) return <div>Client ID not provided</div>;
    const clientId = parseInt(params.id);
    if (isNaN(clientId)) return <div>Invalid client ID</div>;

    const {
        data: client,
        isLoading,
        error,
    } = useQuery<Client>({
        queryKey: ["client", clientId],
        queryFn: () => getClient(clientId),
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: "",
            client_name: "",
            email: "",
            phone: "",
            state: "",
            city: "",
        },
    });

    useState(() => {
        if (client) {
            form.reset({
                company_name: client.company_name,
                client_name: client.client_name,
                email: client.email,
                phone: client.phone,
                state: client.state,
                city: client.city,
            });
            setSelectedState(client.state);
        }
    });

    const selectedStateData = IndiaStates.find(
        (s) => s.state === selectedState,
    );

    function handleFormSubmit(data: FormData) {
        toast.loading("Updating client...");

        fetch(`http://192.168.0.31:8080/v1/clients/${clientId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                company_name: data.company_name,
                client_name: data.client_name,
                email: data.email,
                phone: data.phone,
                state: data.state,
                city: data.city,
            }),
        })
            .then(async (response) => {
                console.log(response);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        errorData?.message || "Failed to update client",
                    );
                }
                return response.json();
            })
            .then(() => {
                toast.dismiss();
                toast.success("Client updated successfully");
                navigate(`/clients/${clientId}`);
            })
            .catch((error) => {
                toast.dismiss();
                console.error("Error updating client:", error);
                toast.error(
                    error?.message ||
                        "Failed to update client. Please try again.",
                );
            });
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading client data</div>;
    if (!client) return <div>Client not found</div>;

    return (
        <div className="mx-auto mt-15 max-w-2xl rounded-lg bg-white p-6 shadow-xl/30">
            <div className="flex flex-col items-start justify-between gap-4">
                <BackButton to={`/clients/${clientId}`} />
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    Edit Client
                </h2>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Company Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="client_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Client Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter client name"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        State
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedState(value);
                                            form.setValue("city", "");
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a state" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {IndiaStates.map((state) => (
                                                <SelectItem
                                                    key={state.state}
                                                    value={state.state}>
                                                    {state.state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        City
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={!selectedState}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        selectedState
                                                            ? "Select a city"
                                                            : "Select a state first"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {selectedStateData?.districts.map(
                                                (city: string) => (
                                                    <SelectItem
                                                        key={city}
                                                        value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 px-6 text-white">
                            Update Client
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
