import "./Lista.css";

// Importação de imagens:
import Editar from "../../assets/img/pen-to-square-solid.svg";
import Excluir from "../../assets/img/trash-can-regular.svg";
import { apiHost } from "../../services/Services";

const Lista = (props) => {
    return (
        <section className="layout_grid">
            <div className="listagem">

                <h1>{props.tituloLista}</h1>
                <hr />
                <div className="tabela">
                    <table>
                        {/* cabeçalho da tabela: */}
                        <thead>
                            {/* tr => table row */}
                            <tr className="table_cabecalho">
                                {/* th => table head */}
                                <th>Nome</th>
                                <th style={{ display: props.visibilidade }}>Gênero</th>
                                {props.tipoLista === "filme" && <th>Imagem</th>}
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        {/* tbody => corpo da tabela */}
                        <tbody>
                            {/* Verifica se a lista existe e tem itens */}
                            {props.lista && props.lista.length > 0 ? (
                                // Se houver itens, faz um map (laço) para renderizar cada item da lista
                                props.lista.map((item) => (
                                    <tr className="item_lista" key={item.id ?? item.idGenero}>
                                        <td data-cell="Nome">
                                            {props.tipoLista === "genero" ? item.nome : item.titulo}
                                        </td>
                                        <td data-cell="Gênero" style={{ display: props.visibilidade }}>
                                            {props.tipoLista === "filme" ? (item.genero?.nome || '-') : '-'}
                                        </td>
                                        {props.tipoLista === "filme" && (
                                            <td data-cell="Imagem">
                                                {item.imagem ? (
                                                    <img 
                                                        src={`${apiHost}/imagens/${item.imagem}`} 
                                                        alt={item.titulo} 
                                                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", margin: "0 auto" }} 
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: "12px", color: "#666" }}>Sem Foto</span>
                                                )}
                                            </td>
                                        )}
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
                                    // Caso a lista esteja vazia ou não exista, mostra uma linha dizendo que não há registros
                                    <tr>
                                        <td colSpan={props.tipoLista === "filme" ? 5 : 4}>Nenhum registro encontrado.</td>
                                    </tr>
                                )
                            }
                                
                        
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default Lista;