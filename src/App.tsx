import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}