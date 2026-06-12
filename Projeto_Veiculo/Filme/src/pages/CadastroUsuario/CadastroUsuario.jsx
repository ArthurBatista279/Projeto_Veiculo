import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/Services";
import { Alerta } from "../../components/alerta/Alerta";
import Botao from "../../components/botao/Botao";
import Logo from "../../assets/Diseno-sin-titulo-22-e1768576968289.webp";

const CadastroUsuario = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const Cadastrar = async (e) => {
        e.preventDefault();

        if (nome.trim().length === 0 || email.trim().length === 0 || senha.trim().length === 0) {
            Alerta({
                title: 'Atenção!',
                text: 'Preencha todos os campos para se cadastrar.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const dadosCadastro = {
            nome: nome,
            email: email,
            senha: senha
        };

        try {
            await api.post("/Usuario", dadosCadastro);
            
            Alerta({
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso! Faça seu login.',
                icon: 'success',
                confirmButtonText: 'Ir para Login'
            }).then(() => {
                navigate("/");
            });

        } catch (error) {
            Alerta({
                title: 'Erro!',
                text: 'Não foi possível realizar o cadastro. O e-mail pode já estar em uso.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <main className="main_login">
            <div className="banner"></div>
            <section className="section_login">
                <img src={Logo} alt="Logo Catálogo de Veículos" />
                <form className="form_login" onSubmit={Cadastrar}>
                    <h1>Cadastre-se</h1>
                    <div className="campos_login">
                        <div className="campo_input">
                            <label htmlFor="nome">Nome Completo:</label>
                            <input type="text" name="nome" placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="campo_input">
                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="campo_input">
                            <label htmlFor="senha">Senha:</label>
                            <input type="password" name="senha" placeholder="Crie uma senha forte" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                    </div>
                    <Botao nomeDoBotao="Cadastrar" />
                    
                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>Já possui uma conta? </span>
                        <Link to="/" style={{ color: "var(--color-primary-hover)", fontSize: "0.9rem", fontWeight: "bold" }}>Faça login</Link>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default CadastroUsuario;
