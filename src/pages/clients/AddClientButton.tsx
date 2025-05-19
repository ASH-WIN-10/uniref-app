import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const AddClientButton = () => {
    return (
        <div className="fixed right-4 bottom-4 z-50">
            <Link to="/clients/create">
                <Button className="bg-primary hover:bg-primary/90 size-12 rounded-full text-white">
                    <Plus className="size-8" />
                </Button>
            </Link>
        </div>
    );
};

export default AddClientButton;
