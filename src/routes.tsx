import App from "./App";
import { CreateClients } from "./pages/clients/create/CreateClients";
import Clients from "./pages/clients/Clients";
import ClientPage from "./pages/clients/clientpage";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
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
        ],
    },
];

export default routes;
