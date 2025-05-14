import App from "./App";
import { CreateClients } from "./pages/clients/CreateClients";
const routes = [
    {
        path: "/",
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: "client/create",
                element: <CreateClients />,
            },
        ],
    },
];

export default routes;
