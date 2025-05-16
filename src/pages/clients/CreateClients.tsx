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
    companyName: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    clientName: z.string().min(2, {
        message: "Client name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phoneNo: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    purchaseOrder: z.instanceof(File).optional(),
    invoices: z.array(z.instanceof(File)).optional(),
    handingOverReport: z.instanceof(File).optional(),
    pmsReports: z.array(z.instanceof(File)).optional(),
});

export function CreateClients() {
    const [uploadedInvoices, setUploadedInvoices] = useState<File[]>([]);
    const [uploadedPmsReports, setUploadedPmsReports] = useState<File[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            clientName: "",
            email: "",
            phoneNo: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    return (
        <div className="mx-auto mt-15 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Add New Client
            </h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="companyName"
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
                            name="clientName"
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
                            name="phoneNo"
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
                            name="purchaseOrder"
                            label="Purchase Order"
                            description="Upload PDF file only"
                            control={form.control}
                            value={
                                form.watch("purchaseOrder")
                                    ? [form.watch("purchaseOrder") as File]
                                    : []
                            }
                            onFilesChange={(files) =>
                                form.setValue("purchaseOrder", files[0])
                            }
                        />

                        <FileUploadField
                            name="invoices"
                            label="Invoices"
                            description="Select PDF files"
                            multiple={true}
                            control={form.control}
                            value={uploadedInvoices}
                            onFilesChange={(files) => {
                                setUploadedInvoices(files);
                                form.setValue("invoices", files);
                            }}
                        />

                        <FileUploadField
                            name="handingOverReport"
                            label="Handing Over Report"
                            description="Upload PDF file only"
                            control={form.control}
                            value={
                                form.watch("handingOverReport")
                                    ? [form.watch("handingOverReport") as File]
                                    : []
                            }
                            onFilesChange={(files) =>
                                form.setValue("handingOverReport", files[0])
                            }
                        />

                        <FileUploadField
                            name="pmsReports"
                            label="PMS Reports"
                            description="Select PDF files"
                            multiple={true}
                            control={form.control}
                            value={uploadedPmsReports}
                            onFilesChange={(files) => {
                                setUploadedPmsReports(files);
                                form.setValue("pmsReports", files);
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

            <BackButton />
        </div>
    );
}
