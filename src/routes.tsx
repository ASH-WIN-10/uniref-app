import App from "./App";
import { CreateClients } from "./pages/clients/CreateClients";
import Clients from "./pages/clients/Clients";
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
                path: "client/create",
                element: <CreateClients />,
            },
        ],
    },
];

export default routes;
