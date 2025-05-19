import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
const BackButton = ({ to = "/clients" }: { to?: string }) => {
    return (
        <div className="mt-3 flex justify-center">
            <Link to={to}>
                <Button>
                    <ArrowLeft />
                </Button>
            </Link>
        </div>
    );
};

export default BackButton;
