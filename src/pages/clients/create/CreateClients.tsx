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
import { FileUploadField } from "./FileUploadField";

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
        message: "Phone number must be at least 10 digits.",
    }),
    purchase_order: z.instanceof(File).optional(),
    invoice: z.array(z.instanceof(File)).optional(),
    handing_over_report: z.instanceof(File).optional(),
    pms_reports: z.array(z.instanceof(File)).optional(),
});

export function CreateClients() {
    const [uploadedInvoices, setUploadedInvoices] = useState<File[]>([]);
    const [uploadedPmsReports, setUploadedPmsReports] = useState<File[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: "",
            client_name: "",
            email: "",
            phone: "",
        },
    });

    function handleFormSubmit(data: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append("company_name", data.company_name);
        formData.append("client_name", data.client_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);

        if (data.purchase_order) {
            formData.append("purchase_order", data.purchase_order);
        }

        if (data.invoice) {
            data.invoice.forEach((file) => {
                formData.append("invoice[]", file);
            });
        }

        if (data.handing_over_report) {
            formData.append("handing_over_report", data.handing_over_report);
        }

        if (data.pms_reports) {
            data.pms_reports.forEach((file) => {
                formData.append("pms_reports[]", file);
            });
        }

        fetch("http://192.168.0.31:8080/v1/clients", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error("Network response was not ok");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while submitting the form.");
            });
    }

    return (
        <div className="mx-auto mt-15 max-w-2xl rounded-lg bg-white p-6 shadow-xl/30">
            <div className="flex flex-col items-start justify-between gap-4">
                <BackButton />
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
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

                        <FileUploadField
                            name="purchase_order"
                            label="Purchase Order"
                            description="Upload only one PDF file"
                            control={form.control}
                            value={
                                form.watch("purchase_order")
                                    ? [form.watch("purchase_order") as File]
                                    : []
                            }
                            onFilesChange={(files) =>
                                form.setValue("purchase_order", files[0])
                            }
                        />

                        <FileUploadField
                            name="invoice"
                            label="Invoice"
                            description="Select PDF files"
                            multiple={true}
                            control={form.control}
                            value={uploadedInvoices}
                            onFilesChange={(files) => {
                                setUploadedInvoices(files);
                                form.setValue("invoice", files);
                            }}
                        />

                        <FileUploadField
                            name="handing_over_report"
                            label="Handing Over Report"
                            description="Upload only one PDF file"
                            control={form.control}
                            value={
                                form.watch("handing_over_report")
                                    ? [
                                          form.watch(
                                              "handing_over_report",
                                          ) as File,
                                      ]
                                    : []
                            }
                            onFilesChange={(files) =>
                                form.setValue("handing_over_report", files[0])
                            }
                        />

                        <FileUploadField
                            name="pms_reports"
                            label="PMS Reports"
                            description="Select PDF files"
                            multiple={true}
                            control={form.control}
                            value={uploadedPmsReports}
                            onFilesChange={(files) => {
                                setUploadedPmsReports(files);
                                form.setValue("pms_reports", files);
                            }}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 px-6 text-white">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
