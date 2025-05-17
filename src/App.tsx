import { Outlet } from "react-router";
import Header from "./pages/misc/Header";
import { Toaster } from "./components/ui/sonner";

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
}

export default App;
