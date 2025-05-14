"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    invoice: z.instanceof(File).optional(),
    handingOverReports: z.instanceof(File).optional(),
    pmsReports: z.instanceof(File).optional(),
});

export function CreateClients() {
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

                        <FormField
                            control={form.control}
                            name="purchaseOrder"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Purchase Order
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files?.[0],
                                                    )
                                                }
                                                className="w-full"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Upload PDF file only
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoice"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Invoice
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files?.[0],
                                                    )
                                                }
                                                className="w-full"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Upload PDF file only
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="handingOverReports"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Handing Over Reports
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files?.[0],
                                                    )
                                                }
                                                className="w-full"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Upload PDF file only
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pmsReports"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        PMS Reports
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files?.[0],
                                                    )
                                                }
                                                className="w-full"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Upload PDF file only
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
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
