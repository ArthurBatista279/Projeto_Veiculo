import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import CadastroFilme from "../pages/CadastroFilme/CadastroFilme";
import CadastroGenero from "../pages/CadastroGenero/CadastroGenero";
import PrivateRoute from "../components/routes/PrivateRoute";

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/filmes"
                    element={
                        <PrivateRoute>
                            <CadastroFilme />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/generos"
                    element={
                        <PrivateRoute>
                            <CadastroGenero />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;