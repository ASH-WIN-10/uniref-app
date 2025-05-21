import App from "./App";
import { CreateClients } from "./pages/clients/create/CreateClients";
import ClientPage from "./pages/clients/client/ClientPage";
import CompanyList from "./pages/clients/CompanyList";
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
                element: <CompanyList />,
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
