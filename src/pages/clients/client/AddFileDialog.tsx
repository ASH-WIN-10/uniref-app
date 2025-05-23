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
import { Plus } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import { handleSingleFileSelection, isWindows } from "@/lib";

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

function AddFileDialog({ clientId }: { clientId: number }) {
    const queryClient = useQueryClient();
    const [openState, setOpen] = useState(false);
    const [filepath, setFilepath] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [isWindowsOS, setIsWindowsOS] = useState(false);

    useEffect(() => {
        isWindows().then(setIsWindowsOS);
    }, []);

    const form = useForm<FileFormData>({
        resolver: zodResolver(fileFormSchema),
        defaultValues: {
            category: undefined,
        },
    });

    async function handleFileSelection() {
        handleSingleFileSelection((selected: string) => {
            if (isWindowsOS) {
                const path = selected.split("\\").join("/");
                setFilepath(path);
            } else {
                setFilepath(selected);
            }

            setFilename(filepath || null);
            setFilepath(selected);
            form.setValue("filepath", filepath || "");
        });
    }

    async function onSubmit(data: FileFormData) {
        try {
            await invoke("add_file", {
                clientId: clientId,
                category: data.category,
                filepath: filepath,
            });

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
        <Dialog open={openState} onOpenChange={setOpen}>
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
                                            <SelectItem value="pms_report">
                                                PMS Report
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="filepath"
                            render={() => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleFileSelection()
                                            }>
                                            {filename || "Select a file"}
                                        </Button>
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
