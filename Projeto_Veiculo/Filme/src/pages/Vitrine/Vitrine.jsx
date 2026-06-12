import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiHost } from "../../services/Services";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Swal from "sweetalert2";
import "./Vitrine.css";

const Vitrine = () => {
    const [listaVeiculos, setListaVeiculos] = useState([]);
    const [listaGeneros, setListaGeneros] = useState([]);
    
    // Filtros
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [ordenacao, setOrdenacao] = useState("");

    const getGeneros = async () => {
        try {
            const retornoAPI = await api.get("/generos");
            setListaGeneros(retornoAPI.data);
            return retornoAPI.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const getVeiculos = async () => {
        try {
            const generos = await getGeneros();
            const retornoAPI = await api.get("/veiculos");

            const veiculosFormatados = retornoAPI.data.map((veiculo) => {
                const generoEncontrado = generos.find(
                    (g) => g.idGenero == veiculo.idGenero,
                );
                
                const extras = JSON.parse(localStorage.getItem(`veiculo_detalhes_${veiculo.idVeiculos}`)) || {};
                
                const precoFinal = extras.preco || veiculo.preco;
                const precoNum = Number(precoFinal);
                const precoFormatado = isNaN(precoNum) || !precoFinal
                    ? "Sob consulta"
                    : precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                return {
                    id: veiculo.idVeiculos,
                    titulo: veiculo.nome,
                    idGenero: veiculo.idGenero,
                    imagem: veiculo.imagem,
                    genero: {
                        nome: generoEncontrado ? generoEncontrado.nome : "Não cadastrado",
                    },
                    precoOriginal: isNaN(precoNum) ? 0 : precoNum,
                    preco: precoFormatado,
                    ano: extras.ano || veiculo.ano || "Não especificado"
                };
            });

            setListaVeiculos(veiculosFormatados);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Erro!",
                text: "Problemas ao carregar o catálogo de veículos!",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        getVeiculos();
    }, []);

    // Aplicação dos filtros e ordenação
    const veiculosFiltrados = listaVeiculos
        .filter(v => v.titulo.toLowerCase().includes(busca.toLowerCase()))
        .filter(v => categoriaFiltro ? v.idGenero === categoriaFiltro : true)
        .sort((a, b) => {
            if (ordenacao === "menor_preco") return a.precoOriginal - b.precoOriginal;
            if (ordenacao === "maior_preco") return b.precoOriginal - a.precoOriginal;
            if (ordenacao === "ano_novo") return parseInt(b.ano) - parseInt(a.ano);
            if (ordenacao === "ano_velho") return parseInt(a.ano) - parseInt(b.ano);
            return 0;
        });

    return (
        <>
            <Header />
            <main className="main_vitrine">
                <div className="layout_grid vitrine_container_com_sidebar">
                    
                    {/* Sidebar de Filtros */}
                    <aside className="sidebar_filtros">
                        <h3>Filtros</h3>
                        
                        <div className="filtro_grupo">
                            <label>Buscar Veículo</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Civic, Corolla..." 
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="input_filtro"
                            />
                        </div>

                        <div className="filtro_grupo">
                            <label>Categoria</label>
                            <select 
                                value={categoriaFiltro} 
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                className="select_filtro"
                            >
                                <option value="">Todas as categorias</option>
                                {listaGeneros.map(g => (
                                    <option key={g.idGenero} value={g.idGenero}>{g.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filtro_grupo">
                            <label>Ordenar por</label>
                            <select 
                                value={ordenacao} 
                                onChange={(e) => setOrdenacao(e.target.value)}
                                className="select_filtro"
                            >
                                <option value="">Relevância</option>
                                <option value="menor_preco">Menor Preço</option>
                                <option value="maior_preco">Maior Preço</option>
                                <option value="ano_novo">Mais Novos (Ano)</option>
                                <option value="ano_velho">Mais Antigos (Ano)</option>
                            </select>
                        </div>
                    </aside>

                    {/* Grid Principal */}
                    <div className="vitrine_conteudo">
                        <h2 className="vitrine_title">Ofertas do dia ({veiculosFiltrados.length})</h2>
                        
                        <div className="ml_grid">
                            {veiculosFiltrados.length > 0 ? (
                                veiculosFiltrados.map((veiculo) => (
                                    <Link to={`/veiculo/${veiculo.id}`} className="ml_card" key={veiculo.id} style={{ textDecoration: 'none' }}>
                                        <div className="ml_card_img_container">
                                            {veiculo.imagem ? (
                                                <img 
                                                    src={`${apiHost}/imagens/${veiculo.imagem}`} 
                                                    alt={veiculo.titulo} 
                                                    className="ml_card_img"
                                                />
                                            ) : (
                                                <div className="ml_no_img">Sem Imagem</div>
                                            )}
                                        </div>
                                        <div className="ml_card_info">
                                            <div className="ml_card_price">{veiculo.preco}</div>
                                            <div className="ml_card_freight">Frete grátis</div>
                                            <h3 className="ml_card_title">{veiculo.titulo}</h3>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                                <span className="ml_card_category">{veiculo.ano}</span>
                                                <span className="ml_card_category">{veiculo.genero.nome}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p style={{ color: '#333' }}>Nenhum veículo encontrado para esta busca.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Vitrine;
