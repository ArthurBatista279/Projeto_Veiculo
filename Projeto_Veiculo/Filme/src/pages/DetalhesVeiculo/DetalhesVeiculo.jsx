import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { apiHost } from "../../services/Services";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Swal from "sweetalert2";
import "./DetalhesVeiculo.css";

const DetalhesVeiculo = () => {
    const { id } = useParams();
    const [veiculo, setVeiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagemAtiva, setImagemAtiva] = useState(null);
    const [veiculosRelacionados, setVeiculosRelacionados] = useState([]);

    useEffect(() => {
        const carregarDetalhes = async () => {
            try {
                // Busca o veículo
                const retornoVeiculos = await api.get("/veiculos");
                const veiculoEncontrado = retornoVeiculos.data.find(v => v.idVeiculos === id);

                if (veiculoEncontrado) {
                    const retornoGeneros = await api.get("/generos");
                    const generoEncontrado = retornoGeneros.data.find(g => g.idGenero == veiculoEncontrado.idGenero);

                    const extras = JSON.parse(localStorage.getItem(`veiculo_detalhes_${id}`)) || {};
                    
                    const precoFinal = extras.preco || veiculoEncontrado.preco;
                    const precoNum = Number(precoFinal);
                    const precoFormatado = isNaN(precoNum) || !precoFinal
                        ? "Sob consulta"
                        : precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                    const veiculoCompleto = {
                        id: veiculoEncontrado.idVeiculos,
                        titulo: veiculoEncontrado.nome,
                        imagem: veiculoEncontrado.imagem,
                        genero: generoEncontrado ? generoEncontrado.nome : "Sem Categoria",
                        idGenero: veiculoEncontrado.idGenero,
                        preco: precoFormatado,
                        marca: extras.marca || veiculoEncontrado.marca || "Não especificada",
                        modelo: extras.modelo || veiculoEncontrado.modelo || "Não especificado",
                        ano: extras.ano || veiculoEncontrado.ano || "Não especificado",
                        cor: extras.cor || veiculoEncontrado.cor || "Não especificada",
                        quilometragem: (extras.quilometragem != null && extras.quilometragem !== "") 
                            ? `${Number(extras.quilometragem).toLocaleString("pt-BR")} km` 
                            : (veiculoEncontrado.quilometragem != null ? `${Number(veiculoEncontrado.quilometragem).toLocaleString("pt-BR")} km` : "Não especificada"),
                        combustivel: extras.combustivel || veiculoEncontrado.combustivel || "Não especificado",
                        cambio: extras.cambio || veiculoEncontrado.cambio || "Não especificado",
                        portas: extras.numeroPortas || veiculoEncontrado.numeroPortas || "Não especificado",
                        potencia: extras.potencia || veiculoEncontrado.potencia || "Não especificada",
                        passageiros: extras.capacidadePassageiros || veiculoEncontrado.capacidadePassageiros || "Não especificado",
                        descricao: extras.descricao || veiculoEncontrado.descricao || "Veículo em excelente estado de conservação."
                    };

                    setVeiculo(veiculoCompleto);
                    setImagemAtiva(`${apiHost}/imagens/${veiculoEncontrado.imagem}`);

                    // Buscar relacionados
                    const relacionados = retornoVeiculos.data
                        .filter(v => v.idGenero === veiculoEncontrado.idGenero && v.idVeiculos !== id)
                        .slice(0, 4)
                        .map(v => {
                            const eLocais = JSON.parse(localStorage.getItem(`veiculo_detalhes_${v.idVeiculos}`)) || {};
                            const pFinal = eLocais.preco || v.preco;
                            const pNum = Number(pFinal);
                            return {
                                id: v.idVeiculos,
                                titulo: v.nome,
                                imagem: v.imagem,
                                preco: isNaN(pNum) || !pFinal ? "Sob consulta" : pNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            };
                        });
                    setVeiculosRelacionados(relacionados);

                    // Salvar no histórico
                    const historico = JSON.parse(localStorage.getItem("historico_veiculos")) || [];
                    const novoHistorico = [veiculoEncontrado.idVeiculos, ...historico.filter(v => v !== veiculoEncontrado.idVeiculos)].slice(0, 10);
                    localStorage.setItem("historico_veiculos", JSON.stringify(novoHistorico));

                } else {
                    Swal.fire('Erro', 'Veículo não encontrado', 'error');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        carregarDetalhes();
        window.scrollTo(0, 0);
    }, [id]);

    const handleFavoritar = () => {
        const favoritos = JSON.parse(localStorage.getItem("veiculos_favoritos")) || [];
        if (!favoritos.includes(veiculo.id)) {
            favoritos.push(veiculo.id);
            localStorage.setItem("veiculos_favoritos", JSON.stringify(favoritos));
            Swal.fire('Sucesso!', 'Veículo adicionado aos favoritos.', 'success');
        } else {
            Swal.fire('Aviso', 'Este veículo já está nos seus favoritos.', 'info');
        }
    };

    const handleCompartilhar = () => {
        navigator.clipboard.writeText(window.location.href);
        Swal.fire('Copiado!', 'Link copiado para a área de transferência.', 'success');
    };

    if (loading) return <div className="loading_screen">Carregando...</div>;
    if (!veiculo) return <div className="loading_screen">Veículo não encontrado.</div>;

    return (
        <>
            <Header />
            <main className="main_detalhes layout_grid">
                
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/catalogo">Catálogo</Link> &gt; <span>{veiculo.genero}</span> &gt; <strong>{veiculo.titulo}</strong>
                </div>

                <div className="detalhes_container">
                    {/* Lado Esquerdo: Galeria e Descrição */}
                    <div className="detalhes_esquerda">
                        <div className="galeria">
                            <div className="imagem_principal_container">
                                {veiculo.imagem ? (
                                    <img src={imagemAtiva} alt={veiculo.titulo} className="imagem_principal" />
                                ) : (
                                    <div className="sem_imagem_grande">Sem Foto</div>
                                )}
                            </div>
                            <div className="miniaturas">
                                {veiculo.imagem && (
                                    <>
                                        <img src={`${apiHost}/imagens/${veiculo.imagem}`} alt="miniatura" className={imagemAtiva === `${apiHost}/imagens/${veiculo.imagem}` ? "miniatura_ativa" : ""} onClick={() => setImagemAtiva(`${apiHost}/imagens/${veiculo.imagem}`)} />
                                        <img src={`${apiHost}/imagens/${veiculo.imagem}`} alt="miniatura" className="miniatura_blur" />
                                        <img src={`${apiHost}/imagens/${veiculo.imagem}`} alt="miniatura" className="miniatura_blur" />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="descricao_box">
                            <h3>Descrição do Veículo</h3>
                            <p>{veiculo.descricao}</p>
                        </div>
                    </div>

                    {/* Lado Direito: Informações Principais e Ações */}
                    <div className="detalhes_direita">
                        <div className="info_principal_box">
                            <span className="categoria_badge">{veiculo.genero}</span>
                            <h1 className="titulo_veiculo">{veiculo.titulo}</h1>
                            <h2 className="preco_veiculo">{veiculo.preco}</h2>

                            <div className="especificacoes_grid">
                                <div className="especificacao_item">
                                    <span className="espec_label">Marca</span>
                                    <span className="espec_valor">{veiculo.marca}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Modelo</span>
                                    <span className="espec_valor">{veiculo.modelo}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Ano</span>
                                    <span className="espec_valor">{veiculo.ano}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Quilometragem</span>
                                    <span className="espec_valor">{veiculo.quilometragem}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Câmbio</span>
                                    <span className="espec_valor">{veiculo.cambio}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Combustível</span>
                                    <span className="espec_valor">{veiculo.combustivel}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Cor</span>
                                    <span className="espec_valor">{veiculo.cor}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Portas</span>
                                    <span className="espec_valor">{veiculo.portas}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Potência</span>
                                    <span className="espec_valor">{veiculo.potencia}</span>
                                </div>
                                <div className="especificacao_item">
                                    <span className="espec_label">Passageiros</span>
                                    <span className="espec_valor">{veiculo.passageiros}</span>
                                </div>
                            </div>

                            <div className="acoes_box">
                                <button className="btn_contato" style={{ cursor: "default" }}>
                                    Entrar em Contato
                                </button>
                                <div className="acoes_secundarias">
                                    <button className="btn_acao" onClick={handleFavoritar}>Favoritar</button>
                                    <button className="btn_acao" onClick={handleCompartilhar}>Compartilhar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Veículos Relacionados */}
                {veiculosRelacionados.length > 0 && (
                    <div className="relacionados_box">
                        <h3>Veículos Semelhantes</h3>
                        <div className="relacionados_grid">
                            {veiculosRelacionados.map(rel => (
                                <Link to={`/veiculo/${rel.id}`} key={rel.id} className="relacionado_card">
                                    {rel.imagem ? (
                                        <img src={`${apiHost}/imagens/${rel.imagem}`} alt={rel.titulo} />
                                    ) : (
                                        <div className="sem_imagem_relacionado">Sem foto</div>
                                    )}
                                    <div className="rel_info">
                                        <h4>{rel.titulo}</h4>
                                        <span>{rel.preco}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default DetalhesVeiculo;
