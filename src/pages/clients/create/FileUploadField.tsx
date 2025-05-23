import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { UploadedFiles } from "./CreateClients";
import {
    handleSingleFileSelection,
    handleMultipleFileSelection,
    isWindows,
} from "@/lib";
import { useEffect, useState } from "react";

export const FileUploadField = ({
    name,
    label,
    description,
    multiple = false,
    control,
    value,
    setUploadedFiles,
}: {
    name: string;
    label: string;
    description: string;
    multiple?: boolean;
    control: any;
    value: string[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>;
}) => {
    const [isWindowsOS, setIsWindowsOS] = useState(false);

    useEffect(() => {
        isWindows().then(setIsWindowsOS);
    }, []);

    function handleFileSelection() {
        if (!multiple)
            handleSingleFileSelection((selected: string) =>
                setUploadedFiles((prev) => ({
                    ...prev,
                    [name]: selected,
                })),
            );
        else
            handleMultipleFileSelection((selected: string[]) =>
                setUploadedFiles((prev) => ({
                    ...prev,
                    [name]: [
                        ...(prev[name as "invoice" | "pms_report"] || []),
                        ...selected,
                    ],
                })),
            );
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange: _, ref: __ } }) => (
                <FormItem>
                    <FormLabel className="text-gray-700">{label}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleFileSelection}
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
                                            onClick={() =>
                                                setUploadedFiles((prev) => ({
                                                    ...prev,
                                                    [name]: multiple ? [] : "",
                                                }))
                                            }
                                            className="h-7 text-xs text-red-500 hover:text-red-600">
                                            Clear All
                                        </Button>
                                    </div>

                                    <div className="space-y-1">
                                        {value.map((filepath, index) => {
                                            let filename: string | undefined;
                                            if (isWindowsOS)
                                                filename = filepath
                                                    .split("\\")
                                                    .pop();
                                            else
                                                filename = filepath
                                                    .split("/")
                                                    .pop();

                                            return (
                                                <div
                                                    key={`${filename}-${index}`}
                                                    className="flex items-center justify-between rounded-sm bg-gray-50 px-2 py-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm text-gray-700">
                                                            {filename}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newFiles =
                                                                multiple
                                                                    ? value.filter(
                                                                          (
                                                                              _,
                                                                              i,
                                                                          ) =>
                                                                              i !==
                                                                              index,
                                                                      )
                                                                    : "";
                                                            setUploadedFiles(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [name]: newFiles,
                                                                }),
                                                            );
                                                        }}
                                                        className="h-7 w-7 p-0 text-gray-500 hover:text-red-500">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
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
