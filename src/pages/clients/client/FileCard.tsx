import { cn } from "@/lib/utils";
import { ExternalLink, Trash2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { File } from "./ClientPage";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

function DeleteFileButton({
    file,
    deleteHidden,
}: {
    file: File;
    deleteHidden: boolean;
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    async function handleDeleteFile() {
        try {
            await invoke("delete_file", {
                fileId: file.id,
                clientId: file.client_id,
            });
            toast.success("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Error deleting file");
        } finally {
            queryClient.invalidateQueries({
                queryKey: ["client", file.client_id],
            });
            navigate(`/clients/${file.client_id}`);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Trash2
                    size={18}
                    className={cn(
                        deleteHidden ? "opacity-0" : "opacity-100",
                        "cursor-pointer transition-opacity duration-200 hover:text-red-500",
                    )}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the file and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleDeleteFile}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function SendFile({ file, sendHidden }: { file: File; sendHidden: boolean }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    async function handleSendFile() {
        try {
            await invoke("send_file", {
                fileId: file.id,
            });
            toast.success("File sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Error sending email");
        } finally {
            queryClient.invalidateQueries({
                queryKey: ["client", file.client_id],
            });
            navigate(`/clients/${file.client_id}`);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <SendHorizonal
                    size={18}
                    className={cn(
                        sendHidden ? "opacity-0" : "opacity-100",
                        "cursor-pointer transition-opacity duration-200 hover:text-green-500",
                    )}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to send this file?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-primary hover:bg-primary/80"
                        onClick={handleSendFile}>
                        Send
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function FileCard({ file }: { file: File }) {
    const [deleteHidden, setDeleteHidden] = useState(true);

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    return (
        <div
            key={file.id}
            className="rounded-lg border p-4 transition-shadow hover:shadow-md"
            onMouseEnter={() => setDeleteHidden(false)}
            onMouseLeave={() => setDeleteHidden(true)}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="line-clamp-1">
                        <h3 className="mb-1 font-medium text-gray-800">
                            {file.original_file_name}
                        </h3>
                    </div>
                    <p className="mb-2 text-sm text-gray-500">
                        {formatDate(file.created_at)}
                    </p>
                    <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {file.category
                            .split("_")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                            )
                            .join(" ")}
                    </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <a
                        // TODO: Change url when s3 is implemented
                        href={"http://192.168.0.31:8080/" + file.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors hover:text-blue-600">
                        <ExternalLink size={18} />
                    </a>
                    <DeleteFileButton file={file} deleteHidden={deleteHidden} />
                    <SendFile file={file} sendHidden={deleteHidden} />
                </div>
            </div>
        </div>
    );
}

export default FileCard;
