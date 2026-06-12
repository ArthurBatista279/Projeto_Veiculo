import "./Header.css";
import Logo from "../../assets/img/logo.svg";
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
                {/* Ao clicar no link, redireciona para a tela login */}
                <Link to="/">
                    <img src={Logo} alt="Logo do Filmoteca" />
                </Link>

                <nav className="nav_header" style={{ display: "flex", alignItems: "center" }}>
                    <Link className="link_header" to="/veiculos">Veículos</Link>
                    <Link className="link_header" to="/generos">Gênero</Link>
                    {usuario && (
                        <button onClick={handleSair} className="btn_sair_header">
                            Sair
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;