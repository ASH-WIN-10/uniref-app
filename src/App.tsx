import { Outlet } from "react-router";
import Header from "./pages/misc/Header";

function App() {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
