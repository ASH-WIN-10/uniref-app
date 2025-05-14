import { Outlet } from "react-router";
import Header from "./pages/misc/Header";
import ClientsTable from "./pages/clients/Clients";
import Addclients from "./pages/misc/Addclients";
function App() {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <Outlet />
            </main>
            <ClientsTable />
            <div className="flex justify-end mt-30 ">
                <Addclients />
            </div>
        </div>
    );
}

export default App;
