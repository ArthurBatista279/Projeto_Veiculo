import "./Login.css"
import Botao from "../../components/botao/Botao"
import Logo from "../../assets/Diseno-sin-titulo-22-e1768576968289.webp"
import { useContext, useEffect, useState } from "react"
import { UsuarioContext } from "../../context/UsuarioContext"
import { useNavigate, Link } from "react-router-dom"
import { Alerta } from "../../components/alerta/Alerta"
import api from "../../services/Services"
import { jwtDecode } from "jwt-decode"


const Login = () => {

    const { usuario, setUsuario } = useContext(UsuarioContext)

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()


    const LoginEmail = async (e) => {
        e.preventDefault()

        if (email.trim().length == 0 || senha.trim().length == 0) {
            Alerta({
                title: 'Login!',
                text: 'Preencher todos os campos',
                icon: 'warning',
                confirmButtonText: 'OK'
            })
            return false;
        }
        

        const dadosLogin = {
            email: email,
            senha: senha,
        }

        try {
            const retornoAPI = await api.post("/Login", dadosLogin)

            console.log("Retorno da API");
            console.log(retornoAPI.data);

            const token = retornoAPI.data.token
            const usuarioDecoded = jwtDecode(token)
            console.log(usuarioDecoded);

            // Mock do Perfil: se o email contiver 'gerente' ou 'admin', vira Gerente, senão Usuário Padrão.
            const perfilAtribuido = email.toLowerCase().includes('gerente') || email.toLowerCase().includes('admin') 
                ? 'Gerente' 
                : 'Usuario';

            const usuarioObj = { email: email, perfil: perfilAtribuido };

            setUsuario(usuarioObj)
            localStorage.setItem("usuario", JSON.stringify(usuarioObj))
            setEmail("")

            navigate("/veiculos")

        } catch (error) {
            Alerta({
                title: 'Login!',
                text: 'Usuário ou Senha inválidos',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }

    }


    const verificaLogin = () => {
        const logado = localStorage.getItem("usuario")

        if (logado != undefined && logado != null) {
            setUsuario(JSON.parse(logado))
            navigate("/veiculos")
        }
    };


    useEffect(() => {
        verificaLogin()
    }, [])

    return (
        <main className="main_login">
            <div className="banner"></div>
            <section className="section_login">
                <img src={Logo} alt="Logo do Projeto" />
                <form action="" className="form_login" onSubmit={LoginEmail}>
                    <h1>Login</h1>
                    <div className="campos_login">
                        <div className="campo_input">
                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }} />
                        </div>
                        <div className="campo_input">
                            <label htmlFor="senha">Senha:</label>
                            <input type="password" name="senha" placeholder="Digite sua senha" value={senha} onChange={(e) => {
                                setSenha(e.target.value)
                            }} />
                        </div>
                    </div>
                    <Botao nomeDoBotao="Entrar" />
                    
                    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                        <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>Ainda não tem uma conta? </span>
                        <Link to="/cadastro" style={{ color: "var(--color-primary-hover)", fontSize: "0.9rem", fontWeight: "bold" }}>Cadastre-se aqui</Link>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default Login