import "./Header.css";
import Logo from "../../assets/Diseno-sin-titulo-22-e1768576968289.webp";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";

const Header = () => {
    const { sair, usuario } = useContext(UsuarioContext);
    const navigate = useNavigate();

    const handleSair = () => {
        sair();
        navigate("/");
    };

    return (
        <header>
            <div className="layout_grid cabecalho">
                {/* Logo redireciona para a tela inicial / login */}
                <Link to="/">
                    <img src={Logo} alt="Logo Catálogo de Veículos" style={{ height: "60px" }} />
                </Link>

                <nav className="nav_header">
                    <Link className="link_header" to="/catalogo">Catálogo</Link>
                    {usuario && (
                        <Link className="link_header" to="/favoritos">Favoritos</Link>
                    )}
                    
                    {usuario && usuario.perfil === 'Gerente' && (
                        <Link className="link_header link_admin" to="/dashboard">
                            Painel Admin
                        </Link>
                    )}

                    {usuario && (
                        <div className="nav_usuario_grupo">
                            <div className="nav_usuario_info">
                                <span className="usuario_ativo">{usuario.email || usuario}</span>
                                <span className={`perfil_badge ${usuario.perfil === 'Gerente' ? 'perfil_gerente' : 'perfil_usuario'}`}>
                                    {usuario.perfil || "Usuário"}
                                </span>
                            </div>
                            <button onClick={handleSair} className="btn_sair_header">Sair</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;