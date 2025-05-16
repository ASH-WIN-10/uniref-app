import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
const Addclients = () => {
    return (
        <div className="mt-10 mr-10 flex justify-end">
            <Link to="/clients/create">
                <Button className="bg-primary hover:bg-primary/90 h-15 w-15 rounded-full text-white">
                    <Plus className="size-10" />
                </Button>
            </Link>
        </div>
    );
};

export default Addclients;
