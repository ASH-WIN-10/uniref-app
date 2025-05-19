import { LoaderCircle } from "lucide-react";

function LoadingScreen() {
    return (
        <div className="flex h-screen items-center justify-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-gray-500" />
        </div>
    );
}

export default LoadingScreen;
