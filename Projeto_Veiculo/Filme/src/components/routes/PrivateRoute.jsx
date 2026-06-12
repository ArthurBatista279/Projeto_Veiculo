import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";

const PrivateRoute = ({ children }) => {
  const { usuario } = useContext(UsuarioContext);

  return usuario ? children : <Navigate to="/" />;
};

export default PrivateRoute;
