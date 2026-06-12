import { useState, useEffect } from "react";
import { UsuarioContext } from "./UsuarioContext";

const getStoredUsuario = () => {
  try {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(getStoredUsuario);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  const sair = () => {
    setUsuario(null);
  };

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        sair,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuarioProvider;
