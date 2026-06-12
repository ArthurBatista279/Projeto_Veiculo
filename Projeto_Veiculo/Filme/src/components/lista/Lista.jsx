import "./Lista.css";

// Importação de imagens:
import Editar from "../../assets/img/pen-to-square-solid.svg";
import Excluir from "../../assets/img/trash-can-regular.svg";
import { apiHost } from "../../services/Services";
import Swal from "sweetalert2";

const Lista = (props) => {
    const isVeiculo = props.tipoLista === "filme";

    const adicionarInformacoes = async (item) => {
        const detalhesSalvos = JSON.parse(localStorage.getItem(`veiculo_detalhes_${item.id}`)) || { preco: "", detalhes: "" };

        const { value: formValues } = await Swal.fire({
            title: `Detalhes de ${item.titulo}`,
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Preço (ex: 50000)" value="${detalhesSalvos.preco}">
                <textarea id="swal-input2" class="swal2-textarea" placeholder="Detalhes adicionais">${detalhesSalvos.detalhes}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                return {
                    preco: document.getElementById('swal-input1').value,
                    detalhes: document.getElementById('swal-input2').value
                }
            }
        });

        if (formValues) {
            localStorage.setItem(`veiculo_detalhes_${item.id}`, JSON.stringify(formValues));
            Swal.fire('Salvo!', 'As informações foram salvas com sucesso.', 'success');
        }
    };

    return (
        <section className="layout_grid">
            <div className="listagem">
                <h1>{props.tituloLista}</h1>
                <hr />

                {isVeiculo ? (
                    /* Visualização em Grid de Cards Premium para Veículos */
                    <div className="cards_grid scale-in">
                        {props.lista && props.lista.length > 0 ? (
                            props.lista.map((item) => (
                                <div className="vehicle_card fade-in" key={item.id}>
                                    <div className="vehicle_img_container">
                                        {item.imagem ? (
                                            <img 
                                                src={`${apiHost}/imagens/${item.imagem}`} 
                                                alt={item.titulo} 
                                                className="vehicle_img" 
                                            />
                                        ) : (
                                            <div className="vehicle_no_img">
                                                {/* Ícone de carro minimalista SVGs */}
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="10" width="20" height="8" rx="2" ry="2" />
                                                    <path d="M17 14h.01" />
                                                    <path d="M7 14h.01" />
                                                    <path d="M14 6H10L8 10h8l-2-4z" />
                                                </svg>
                                                <span>Sem Foto</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="vehicle_info">
                                        <span className="vehicle_category">
                                            {item.genero?.nome || "Sem Categoria"}
                                        </span>
                                        <h3 className="vehicle_name" title={item.titulo}>
                                            {item.titulo}
                                        </h3>
                                        <div className="vehicle_actions" style={{ gridTemplateColumns: "1fr", gap: "5px" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                                                <button className="btn-card-edit" onClick={() => props.funcEditar(item)}>
                                                    <img src={Editar} alt="Caneta" style={{ width: "14px", height: "14px", marginRight: "6px", filter: "invert(1)" }} />
                                                    Editar
                                                </button>
                                                <button className="btn-card-delete" onClick={() => props.funcExcluir(item)}>
                                                    <img src={Excluir} alt="Lixeira" style={{ width: "14px", height: "14px", marginRight: "6px", filter: "invert(1)" }} />
                                                    Excluir
                                                </button>
                                            </div>
                                            <button className="btn-card-edit" style={{ width: "100%", justifyContent: "center" }} onClick={() => adicionarInformacoes(item)}>
                                                + Info (Valor, Detalhes)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", color: "var(--color-text-secondary)" }}>
                                <h3>Nenhum veículo cadastrado.</h3>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Visualização em Tabela para Gêneros */
                    <div className="tabela scale-in">
                        <table>
                            <thead>
                                <tr className="table_cabecalho">
                                    <th>Nome do Gênero</th>
                                    <th>Editar</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.lista && props.lista.length > 0 ? (
                                    props.lista.map((item) => (
                                        <tr className="item_lista" key={item.idGenero}>
                                            <td data-cell="Nome do Gênero">
                                                {item.nome}
                                            </td>
                                            <td data-cell="Editar">
                                                <button className="icon" onClick={() => props.funcEditar(item)}>
                                                    <img src={Editar} alt="Caneta" />
                                                </button>
                                            </td>
                                            <td data-cell="Excluir">
                                                <button className="icon" onClick={() => props.funcExcluir(item)}>
                                                    <img src={Excluir} alt="Lixeira" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: "center" }}>Nenhum gênero cadastrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Lista;