import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const BackButton = () => {
    return (
        <div className="mt-10 flex justify-center">
            <Link to="/">
                <Button>Go Back</Button>
            </Link>
        </div>
    );
};

export default BackButton;
