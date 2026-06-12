import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiHost } from "../../services/Services";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "../Vitrine/Vitrine.css";

const Favoritos = () => {
    const [listaFavoritos, setListaFavoritos] = useState([]);

    useEffect(() => {
        const carregarFavoritos = async () => {
            const favoritosIds = JSON.parse(localStorage.getItem("veiculos_favoritos")) || [];
            if (favoritosIds.length === 0) return;

            try {
                const retornoAPI = await api.get("/veiculos");
                
                const veiculosFiltrados = retornoAPI.data.filter(v => favoritosIds.includes(v.idVeiculos));

                const veiculosFormatados = veiculosFiltrados.map((veiculo) => {
                    const detalhesLocais = JSON.parse(localStorage.getItem(`veiculo_detalhes_${veiculo.idVeiculos}`)) || { preco: "R$ ---,00", ano: "2024" };
                    const precoFormatado = isNaN(Number(detalhesLocais.preco)) && detalhesLocais.preco !== "R$ ---,00" 
                        ? `R$ ${detalhesLocais.preco}` 
                        : Number(detalhesLocais.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                    return {
                        id: veiculo.idVeiculos,
                        titulo: veiculo.nome,
                        imagem: veiculo.imagem,
                        preco: detalhesLocais.preco ? (isNaN(Number(detalhesLocais.preco)) ? detalhesLocais.preco : precoFormatado) : "R$ A consultar",
                        ano: detalhesLocais.ano || "2024"
                    };
                });

                setListaFavoritos(veiculosFormatados);
            } catch (error) {
                console.log(error);
            }
        };

        carregarFavoritos();
    }, []);

    return (
        <>
            <Header />
            <main className="main_vitrine">
                <div className="layout_grid vitrine_container">
                    <h2 className="vitrine_title">Meus Favoritos</h2>
                    
                    <div className="ml_grid">
                        {listaFavoritos.length > 0 ? (
                            listaFavoritos.map((veiculo) => (
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
                                        <h3 className="ml_card_title">{veiculo.titulo}</h3>
                                        <span className="ml_card_category">{veiculo.ano}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p style={{ color: '#333' }}>Você ainda não adicionou nenhum veículo aos favoritos.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Favoritos;
