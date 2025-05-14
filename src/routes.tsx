import App from "./App";

const routes = [
    {
        path: "/",
        children: [
            {
                index: true,
                element: <App />,
            },
        ],
    },
];

export default routes;
