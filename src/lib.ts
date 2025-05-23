import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";

async function isWindows(): Promise<boolean> {
    return await invoke("is_windows");
}

async function handleSingleFileSelection(fn: any) {
    try {
        const selected = await open({
            directory: false,
            multiple: false,
            filters: [
                {
                    name: "PDF Files",
                    extensions: ["pdf"],
                },
            ],
        });

        if (selected) fn(selected);
    } catch (error) {
        console.error("Error selecting file:", error);
        toast.error(
            "An error occurred while selecting files. Please try again.",
        );
    }
}

async function handleMultipleFileSelection(fn: any) {
    try {
        const selected = await open({
            directory: false,
            multiple: true,
            filters: [
                {
                    name: "PDF Files",
                    extensions: ["pdf"],
                },
            ],
        });

        if (selected) fn(selected);
    } catch (error) {
        console.error("Error selecting files:", error);
        toast.error(
            "An error occurred while selecting files. Please try again.",
        );
    }
}

export { isWindows, handleSingleFileSelection, handleMultipleFileSelection };
