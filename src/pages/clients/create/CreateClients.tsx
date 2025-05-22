import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, type FormData } from "./CreateFormSchema";
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
import { FileUploadField } from "./FileUploadField";
import { IndiaStates } from "./stateData";
import { segment } from "./segment";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export interface UploadedFiles {
    purchase_order?: string;
    invoice?: string[];
    handing_over_report?: string;
    pms_report?: string[];
}

export function CreateClients() {
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
    const [selectedState, setSelectedState] = useState<string>("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: "",
            client_name: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            segment: "",
        },
    });

    const selectedStateData = IndiaStates.find(
        (s) => s.state === selectedState,
    );

    async function handleFormSubmit(data: FormData) {
        try {
            const formData: FormData = {
                company_name: data.company_name,
                client_name: data.client_name,
                email: data.email,
                phone: data.phone,
                state: data.state,
                city: data.city,
                segment: data.segment,
                purchase_order: uploadedFiles.purchase_order,
                invoice: uploadedFiles.invoice,
                handing_over_report: uploadedFiles.handing_over_report,
                pms_report: uploadedFiles.pms_report,
            };

            const response = (await invoke("create_client", {
                formData: formData,
            })) as {
                client: {
                    id: string;
                };
            };

            console.log("Response:", response);

            const clientId = response.client.id;
            toast.success("Client created successfully");
            navigate(`/clients/${clientId}`);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="py-10">
            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-xl/30">
                <div className="mb-6 flex flex-col items-start justify-between gap-4">
                    <BackButton />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Client
                    </h2>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        encType="multipart/form-data"
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

                            <FormField
                                control={form.control}
                                name="segment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Segment
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a segment" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {segment.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FileUploadField
                                    name="purchase_order"
                                    label="Purchase Order"
                                    description="Upload only one PDF file"
                                    control={form.control}
                                    value={
                                        uploadedFiles.purchase_order
                                            ? [uploadedFiles.purchase_order]
                                            : []
                                    }
                                    setUploadedFiles={setUploadedFiles}
                                />

                                <FileUploadField
                                    name="invoice"
                                    label="Invoice"
                                    description="Select PDF files"
                                    multiple={true}
                                    control={form.control}
                                    value={
                                        uploadedFiles.invoice
                                            ? uploadedFiles.invoice
                                            : []
                                    }
                                    setUploadedFiles={setUploadedFiles}
                                />

                                <FileUploadField
                                    name="handing_over_report"
                                    label="Handing Over Report"
                                    description="Upload only one PDF file"
                                    control={form.control}
                                    value={
                                        uploadedFiles.handing_over_report
                                            ? [
                                                  uploadedFiles.handing_over_report,
                                              ]
                                            : []
                                    }
                                    setUploadedFiles={setUploadedFiles}
                                />

                                <FileUploadField
                                    name="pms_report"
                                    label="PMS Report"
                                    description="Select PDF files"
                                    multiple={true}
                                    control={form.control}
                                    value={
                                        uploadedFiles.pms_report
                                            ? uploadedFiles.pms_report
                                            : []
                                    }
                                    setUploadedFiles={setUploadedFiles}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 px-6 text-white">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
