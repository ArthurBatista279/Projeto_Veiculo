import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import CadastroVeiculo from "../pages/CadastroVeiculo/CadastroVeiculo";
import CadastroGenero from "../pages/CadastroGenero/CadastroGenero";
import CadastroUsuario from "../pages/CadastroUsuario/CadastroUsuario";
import Vitrine from "../pages/Vitrine/Vitrine";
import DetalhesVeiculo from "../pages/DetalhesVeiculo/DetalhesVeiculo";
import Dashboard from "../pages/Dashboard/Dashboard";
import Favoritos from "../pages/Favoritos/Favoritos";
import PrivateRoute from "../components/routes/PrivateRoute";

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<CadastroUsuario />} />
                
                <Route
                    path="/favoritos"
                    element={
                        <PrivateRoute>
                            <Favoritos />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/catalogo"
                    element={
                        <PrivateRoute>
                            <Vitrine />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/veiculo/:id"
                    element={
                        <PrivateRoute>
                            <DetalhesVeiculo />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/veiculos"
                    element={
                        <PrivateRoute requiredRole="Gerente">
                            <CadastroVeiculo />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/generos"
                    element={
                        <PrivateRoute requiredRole="Gerente">
                            <CadastroGenero />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute requiredRole="Gerente">
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;