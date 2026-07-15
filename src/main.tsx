import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/main.scss";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});

const rootElement = document.getElementById("root");

if (rootElement === null) {
    throw new Error(
        "The root element was not found.",
    );
}

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>

                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);