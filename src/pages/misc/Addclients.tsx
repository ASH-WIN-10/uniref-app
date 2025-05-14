import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
const Addclients = () => {
    return (
        <div className="flex justify-end mt-10 mr-10">
            <Link to="/client/create">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full w-15 h-15 ">
                    <Plus className="size-10" />
                </Button>
            </Link>
        </div>
    );
};

export default Addclients;
