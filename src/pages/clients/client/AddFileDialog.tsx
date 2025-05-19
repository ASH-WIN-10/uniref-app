import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

const fileFormSchema = z.object({
    category: z.enum(
        ["invoice", "purchase_order", "handing_over_report", "pms_reports"],
        {
            required_error: "Please select a category",
        },
    ),
    file: z
        .instanceof(File, {
            message: "Please select a file",
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size must be less than 10MB",
        }),
});

type FileFormData = z.infer<typeof fileFormSchema>;

function AddFileDialog({ clientId }: { clientId: number }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const form = useForm<FileFormData>({
        resolver: zodResolver(fileFormSchema),
        defaultValues: {
            category: undefined,
        },
    });

    async function onSubmit(data: FileFormData) {
        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("file", data.file);

        try {
            const response = await fetch(
                `http://192.168.0.31:8080/v1/clients/${clientId}/files`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            toast.success("File added successfully");
            setOpen(false);
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["client", clientId] });
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while submitting the form.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus />
                    Add Document
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Document</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a new document to the client.
                </DialogDescription>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="invoice">
                                                Invoice
                                            </SelectItem>
                                            <SelectItem value="purchase_order">
                                                Purchase Order
                                            </SelectItem>
                                            <SelectItem value="handing_over_report">
                                                Handing Over Report
                                            </SelectItem>
                                            <SelectItem value="pms_reports">
                                                PMS Reports
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) =>
                                                onChange(e.target.files?.[0])
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Add</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default AddFileDialog;
