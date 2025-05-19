import { useRef } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FileSchema = z.object({
    name: z.string(),
    size: z.number().max(MAX_FILE_SIZE, "File size must be less than 10MB"),
    type: z.string().refine((type) => type === "application/pdf", {
        message: "Only PDF files are allowed",
    }),
});

export const FileUploadField = ({
    name,
    label,
    description,
    multiple = false,
    control,
    value,
    onFilesChange,
}: {
    name: string;
    label: string;
    description: string;
    multiple?: boolean;
    control: any;
    value: File[];
    onFilesChange: (files: File[]) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = (files: File[]) => {
        try {
            files.forEach((file) => {
                FileSchema.parse({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
            });
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.errors[0]?.message || "Invalid file";
                toast.error(errorMessage);
            }
            return false;
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange: _, ref: __, ...fieldProps } }) => (
                <FormItem>
                    <FormLabel className="text-gray-700">{label}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <input
                                type="file"
                                accept=".pdf"
                                multiple={multiple}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files) {
                                        const newFiles = multiple
                                            ? [...value, ...Array.from(files)]
                                            : files[0]
                                              ? [files[0]]
                                              : [];

                                        if (validateFiles(newFiles)) {
                                            onFilesChange(newFiles);
                                        } else {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }
                                    }
                                }}
                                className="hidden"
                                ref={fileInputRef}
                                {...fieldProps}
                                value={undefined}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full">
                                Choose File
                            </Button>

                            {value.length > 0 && (
                                <div className="mt-2 space-y-2 rounded-md border p-2">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-medium">
                                            Uploaded Files
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onFilesChange([])}
                                            className="h-7 text-xs text-red-500 hover:text-red-600">
                                            Clear All
                                        </Button>
                                    </div>

                                    <div className="space-y-1">
                                        {value.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between rounded-sm bg-gray-50 px-2 py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">
                                                        {file.name}
                                                    </span>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newFiles =
                                                            value.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            );
                                                        onFilesChange(newFiles);
                                                    }}
                                                    className="h-7 w-7 p-0 text-gray-500 hover:text-red-500">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-sm text-gray-500">
                        {description}
                    </FormDescription>
                </FormItem>
            )}
        />
    );
};
