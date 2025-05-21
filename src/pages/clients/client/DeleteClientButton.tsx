import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DeleteClientButton({ clientId }: { clientId: number }) {
    const navigate = useNavigate();

    function deleteClient() {
        fetch(`http://192.168.0.31:8080/v1/clients/${clientId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404)
                        throw new Error("Client not found");
                    else throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error deleting client:", error);
            })
            .finally(() => {
                toast.success("Client deleted successfully");
                navigate("/");
            });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600">
                <Trash2 className="h-5 w-5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the client and remove their data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={deleteClient}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
