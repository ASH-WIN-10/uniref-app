import App from "./App";
import { CreateClients } from "./pages/clients/create/CreateClients";
import ClientPage from "./pages/clients/client/ClientPage";
import { Link } from "react-router";
import Clients from "./pages/clients/Clients";
import EditClient from "./pages/clients/edit/EditClient";
import NotFound from "./pages/misc/NotFound";

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Link to="/clients">Clients</Link>,
            },
            {
                path: "clients",
                element: <Clients />,
            },
            {
                path: "clients/create",
                element: <CreateClients />,
            },
            {
                path: "clients/:id",
                element: <ClientPage />,
            },
            {
                path: "clients/:id/edit",
                element: <EditClient />,
            },
        ],
    },
];

export default routes;
