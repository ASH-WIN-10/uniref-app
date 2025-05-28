import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SendHorizontal } from "lucide-react";
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
import { invoke } from "@tauri-apps/api/core";

const fileFormSchema = z.object({
    category: z.enum(
        ["invoice", "purchase_order", "handing_over_report", "pms_report"],
        {
            required_error: "Please select a category",
        },
    ),
    filepath: z.string(),
});

type FileFormData = z.infer<typeof fileFormSchema>;

export default function SendDialog({ clientId }: { clientId: number }) {
    const queryClient = useQueryClient();
    const [openState, setOpen] = useState(false);
    const form = useForm<FileFormData>({
        resolver: zodResolver(fileFormSchema),
        defaultValues: {
            category: undefined,
        },
    });

    async function onSubmit(data: FileFormData) {
        try {
            await invoke("add_file", {
                clientId: clientId,
                category: data.category,
            });
            toast.success("File added successfully");
            setOpen(false);
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["client", clientId] });
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while sending the file.");
        }
    }

    return (
        <Dialog open={openState} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <SendHorizontal />
                    Send File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send File</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Select a category of files to send.
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
                                            <SelectItem value="pms_report">
                                                PMS Report
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Send</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
