import "./Header.css";
import Logo from "../../assets/img/logo.svg"
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <div className="layout_grid cabecalho">
                {/* Ao clicar no link, redireciona para a tela login */}
                <Link to="/">
                    <img src={Logo} alt="Logo do Filmoteca" />
                </Link>

                <nav className="nav_header">
                    <Link className="link_header" to="/filmes">Filme</Link>
                    <Link className="link_header" to="/generos">Gênero</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;