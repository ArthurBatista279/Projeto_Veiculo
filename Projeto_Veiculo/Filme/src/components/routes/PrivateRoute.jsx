import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { usuario } = useContext(UsuarioContext);

  if (!usuario) {
    return <Navigate to="/" />;
  }

  // Se a rota exige um papel específico e o usuário não possui
  if (requiredRole && usuario.perfil !== requiredRole) {
    return <Navigate to="/catalogo" />;
  }

  return children;
};

export default PrivateRoute;
