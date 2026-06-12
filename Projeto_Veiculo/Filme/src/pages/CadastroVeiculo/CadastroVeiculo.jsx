import "./CadastroVeiculo.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useEffect, useState } from "react";
import api, { apiHost } from "../../services/Services";
import Swal from "sweetalert2";

const camposIniciais = {
  nome: "", marca: "", modelo: "", ano: "", preco: "",
  cor: "", quilometragem: "", combustivel: "", cambio: "",
  numeroPortas: "", potencia: "", capacidadePassageiros: "",
  descricao: "", idGenero: "",
};

const CadastroVeiculo = () => {
  const [campos, setCampos] = useState(camposIniciais);
  const [imagem, setImagem] = useState(null);
  const [imagemKey, setImagemKey] = useState(Date.now());
  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [listaGeneros, setListaGeneros] = useState([]);
  const [loading, setLoading] = useState(true);

  const set = (campo) => (e) => setCampos((prev) => ({ ...prev, [campo]: e.target.value }));

  const getGeneros = async () => {
    try {
      const res = await api.get("/generos");
      setListaGeneros(res.data);
      return res.data;
    } catch { return []; }
  };

  const getVeiculos = async (generos = listaGeneros) => {
    try {
      const res = await api.get("/veiculos");
      const generosRef = generos.length > 0 ? generos : await getGeneros();
      const formatados = res.data.map((v) => {
        const g = generosRef.find((g) => g.idGenero == v.idGenero);
        // Puxa as especificidades locais se existirem
        const extras = JSON.parse(localStorage.getItem(`veiculo_detalhes_${v.idVeiculos}`)) || {};
        return { 
          ...v, 
          id: v.idVeiculos, 
          titulo: v.nome, 
          generoNome: g?.nome || "Sem Categoria",
          // Garante que os campos do localStorage sobrescrevem os campos locais para edição/exibição
          marca: extras.marca || v.marca || "",
          modelo: extras.modelo || v.modelo || "",
          ano: extras.ano || v.ano || "",
          preco: extras.preco || v.preco || "",
          cor: extras.cor || v.cor || "",
          quilometragem: extras.quilometragem || v.quilometragem || "",
          combustivel: extras.combustivel || v.combustivel || "",
          cambio: extras.cambio || v.cambio || "",
          numeroPortas: extras.numeroPortas || v.numeroPortas || "",
          potencia: extras.potencia || v.potencia || "",
          capacidadePassageiros: extras.capacidadePassageiros || v.capacidadePassageiros || "",
          descricao: extras.descricao || v.descricao || ""
        };
      });
      setListaVeiculos(formatados);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const g = await getGeneros();
      await getVeiculos(g);
      setLoading(false);
    };
    init();
  }, []);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("nome", campos.nome);
    fd.append("idGenero", campos.idGenero);
    if (imagem) fd.append("imagem", imagem);
    return fd;
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!campos.nome.trim()) return Swal.fire("Atenção!", "Nome do veículo é obrigatório.", "warning");
    if (!campos.idGenero) return Swal.fire("Atenção!", "Selecione uma categoria.", "warning");
    try {
      const fd = buildFormData();
      let veiculoSalvo = null;
      
      if (editar) {
        const res = await api.put(`/veiculos/${idEditar}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        // Grava no localStorage os dados adicionais usando o ID
        const extras = {
          marca: campos.marca, modelo: campos.modelo, ano: campos.ano, preco: campos.preco,
          cor: campos.cor, quilometragem: campos.quilometragem, combustivel: campos.combustivel,
          cambio: campos.cambio, numeroPortas: campos.numeroPortas, potencia: campos.potencia,
          capacidadePassageiros: campos.capacidadePassageiros, descricao: campos.descricao
        };
        localStorage.setItem(`veiculo_detalhes_${idEditar}`, JSON.stringify(extras));
        Swal.fire("Sucesso!", "Veículo atualizado com sucesso!", "success");
      } else {
        const res = await api.post("/veiculos", fd, { headers: { "Content-Type": "multipart/form-data" } });
        // O POST geralmente retorna o objeto criado ou precisamos buscar o ID recém-criado
        // Buscamos a lista atualizada para identificar o ID do último veículo criado com esse nome
        const resLista = await api.get("/veiculos");
        const recemCriado = resLista.data
          .filter(v => v.nome === campos.nome && v.idGenero == campos.idGenero)
          .sort((a, b) => b.idVeiculos.localeCompare(a.idVeiculos))[0]; // fallback heurístico do mais recente
        
        const targetId = recemCriado ? recemCriado.idVeiculos : null;
        if (targetId) {
          const extras = {
            marca: campos.marca, modelo: campos.modelo, ano: campos.ano, preco: campos.preco,
            cor: campos.cor, quilometragem: campos.quilometragem, combustivel: campos.combustivel,
            cambio: campos.cambio, numeroPortas: campos.numeroPortas, potencia: campos.potencia,
            capacidadePassageiros: campos.capacidadePassageiros, descricao: campos.descricao
          };
          localStorage.setItem(`veiculo_detalhes_${targetId}`, JSON.stringify(extras));
        }
        Swal.fire("Sucesso!", "Veículo cadastrado com sucesso!", "success");
      }
      limpar();
      await getVeiculos();
    } catch (e) {
      Swal.fire("Erro!", editar ? "Falha ao atualizar veículo." : "Falha ao cadastrar veículo.", "error");
    }
  };

  const preEditar = (v) => {
    setCampos({
      nome: v.nome || "", marca: v.marca || "", modelo: v.modelo || "",
      ano: v.ano || "", preco: v.preco || "", cor: v.cor || "",
      quilometragem: v.quilometragem || "", combustivel: v.combustivel || "",
      cambio: v.cambio || "", numeroPortas: v.numeroPortas || "",
      potencia: v.potencia || "", capacidadePassageiros: v.capacidadePassageiros || "",
      descricao: v.descricao || "", idGenero: v.idGenero || "",
    });
    setEditar(true);
    setIdEditar(v.id);
    setImagem(null);
    setImagemKey(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluir = async (v) => {
    const r = await Swal.fire({ title: "Excluir veículo?", text: `"${v.nome}" será removido permanentemente.`, icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#374151", confirmButtonText: "Sim, excluir", cancelButtonText: "Cancelar" });
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/veiculos/${v.id}`);
      localStorage.removeItem(`veiculo_detalhes_${v.id}`);
      Swal.fire("Excluído!", "Veículo removido com sucesso.", "success");
      await getVeiculos();
    } catch { Swal.fire("Erro!", "Falha ao excluir veículo.", "error"); }
  };

  const limpar = () => { setCampos(camposIniciais); setEditar(false); setIdEditar(null); setImagem(null); setImagemKey(Date.now()); };

  return (
    <>
      <Header />
      <main className="main_cv">
        <section className="cv_form_section">
          <div className="layout_grid">
            <div className="cv_form_header">
              <h1>{editar ? "Editar Veículo" : "Cadastrar Veículo"}</h1>
              <p>{editar ? "Atualize as informações do veículo selecionado." : "Preencha os campos para adicionar um novo veículo ao catálogo."}</p>
            </div>

            <form onSubmit={salvar} className="cv_form">
              {/* Linha 1 - Básico */}
              <fieldset className="cv_fieldset">
                <legend>Informações Básicas</legend>
                <div className="cv_grid cv_grid_3">
                  <div className="cv_campo">
                    <label>Nome do Veículo *</label>
                    <input type="text" placeholder="Ex: Civic, Corolla, Gol..." value={campos.nome} onChange={set("nome")} required />
                  </div>
                  <div className="cv_campo">
                    <label>Marca *</label>
                    <input type="text" placeholder="Ex: Honda, Toyota..." value={campos.marca} onChange={set("marca")} />
                  </div>
                  <div className="cv_campo">
                    <label>Modelo</label>
                    <input type="text" placeholder="Ex: Sedan LXR 2.0, Hatch..." value={campos.modelo} onChange={set("modelo")} />
                  </div>
                </div>
              </fieldset>

              {/* Linha 2 - Preço e Categorização */}
              <fieldset className="cv_fieldset">
                <legend>Categorização e Preço</legend>
                <div className="cv_grid cv_grid_3">
                  <div className="cv_campo">
                    <label>Categoria *</label>
                    <select value={campos.idGenero} onChange={set("idGenero")} required>
                      <option value="" disabled>Selecione...</option>
                      {listaGeneros.map(g => (
                        <option key={g.idGenero} value={g.idGenero}>{g.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cv_campo">
                    <label>Ano de Fabricação</label>
                    <input type="number" placeholder="Ex: 2020" min="1900" max="2100" value={campos.ano} onChange={set("ano")} />
                  </div>
                  <div className="cv_campo">
                    <label>Preço (R$)</label>
                    <input type="number" placeholder="Ex: 89900" min="0" step="0.01" value={campos.preco} onChange={set("preco")} />
                  </div>
                </div>
              </fieldset>

              {/* Linha 3 - Especificações */}
              <fieldset className="cv_fieldset">
                <legend>Especificações Técnicas</legend>
                <div className="cv_grid cv_grid_4">
                  <div className="cv_campo">
                    <label>Cor</label>
                    <input type="text" placeholder="Ex: Preto, Branco, Prata..." value={campos.cor} onChange={set("cor")} />
                  </div>
                  <div className="cv_campo">
                    <label>Quilometragem (km)</label>
                    <input type="number" placeholder="Ex: 45000" min="0" value={campos.quilometragem} onChange={set("quilometragem")} />
                  </div>
                  <div className="cv_campo">
                    <label>Combustível</label>
                    <select value={campos.combustivel} onChange={set("combustivel")}>
                      <option value="">Selecione...</option>
                      <option value="Flex">Flex</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Etanol">Etanol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="GNV">GNV</option>
                    </select>
                  </div>
                  <div className="cv_campo">
                    <label>Câmbio</label>
                    <select value={campos.cambio} onChange={set("cambio")}>
                      <option value="">Selecione...</option>
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                      <option value="CVT">CVT</option>
                      <option value="Automatizado">Automatizado</option>
                      <option value="Dupla Embreagem">Dupla Embreagem</option>
                    </select>
                  </div>
                  <div className="cv_campo">
                    <label>Número de Portas</label>
                    <select value={campos.numeroPortas} onChange={set("numeroPortas")}>
                      <option value="">Selecione...</option>
                      <option value="2">2 portas</option>
                      <option value="3">3 portas</option>
                      <option value="4">4 portas</option>
                      <option value="5">5 portas</option>
                    </select>
                  </div>
                  <div className="cv_campo">
                    <label>Potência</label>
                    <input type="text" placeholder="Ex: 150 cv..." value={campos.potencia} onChange={set("potencia")} />
                  </div>
                  <div className="cv_campo">
                    <label>Capacidade de Passageiros</label>
                    <select value={campos.capacidadePassageiros} onChange={set("capacidadePassageiros")}>
                      <option value="">Selecione...</option>
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="7">7</option>
                      <option value="8">8 ou mais</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Linha 4 - Descrição e Imagem */}
              <fieldset className="cv_fieldset">
                <legend>Descrição e Mídia</legend>
                <div className="cv_grid cv_grid_2">
                  <div className="cv_campo">
                    <label>Descrição do Veículo</label>
                    <textarea placeholder="Descreva o veículo em detalhes: estado de conservação, opcionais, histórico de revisões..." value={campos.descricao} onChange={set("descricao")} rows={5} />
                  </div>
                  <div className="cv_campo">
                    <label>Imagem Principal</label>
                    <div className="cv_upload_area" onClick={() => document.getElementById("img_input").click()}>
                      {imagem ? (
                        <div className="cv_img_preview">
                          <img src={URL.createObjectURL(imagem)} alt="preview" />
                          <button type="button" className="cv_remove_img" onClick={(e) => { e.stopPropagation(); setImagem(null); setImagemKey(Date.now()); }}>✕</button>
                        </div>
                      ) : (
                        <>
                          <span className="cv_upload_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                              <circle cx="12" cy="13" r="4"/>
                            </svg>
                          </span>
                          <span>Clique para selecionar uma imagem</span>
                          <small>JPG, PNG, WEBP — máx. 5MB</small>
                        </>
                      )}
                    </div>
                    <input key={imagemKey} id="img_input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setImagem(e.target.files[0] || null)} />
                  </div>
                </div>
              </fieldset>

              {/* Botões */}
              <div className="cv_actions">
                {editar && <button type="button" className="cv_btn_cancelar" onClick={limpar}>Cancelar Edição</button>}
                <button type="submit" className="cv_btn_salvar">
                  {editar ? "Atualizar Veículo" : "Cadastrar Veículo"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Lista de veículos */}
        <section className="cv_lista_section">
          <div className="layout_grid">
            <div className="cv_lista_header">
              <h2>Veículos Cadastrados <span className="cv_count_badge">{listaVeiculos.length}</span></h2>
            </div>

            {loading ? (
              <div className="cv_skeleton_grid">
                {[1,2,3,4,5,6].map(i => <div key={i} className="cv_skeleton_card" />)}
              </div>
            ) : listaVeiculos.length === 0 ? (
              <div className="cv_empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  <rect x="2" y="10" width="20" height="8" rx="2" /><path d="M14 6H10L8 10h8l-2-4z" />
                </svg>
                <p>Nenhum veículo cadastrado ainda.</p>
              </div>
            ) : (
              <div className="cv_cards_grid">
                {listaVeiculos.map((v) => (
                  <div className="cv_card" key={v.id}>
                    <div className="cv_card_img">
                      {v.imagem ? (
                        <img src={`${apiHost}/imagens/${v.imagem}`} alt={v.nome} />
                      ) : (
                        <div className="cv_card_no_img">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="10" width="20" height="8" rx="2" /><path d="M14 6H10L8 10h8l-2-4z" />
                          </svg>
                        </div>
                      )}
                      <div className="cv_card_badge">{v.generoNome}</div>
                    </div>
                    <div className="cv_card_body">
                      <h3>{v.nome}</h3>
                      <div className="cv_card_specs">
                        {v.marca && <span>{v.marca}</span>}
                        {v.ano && <span>{v.ano}</span>}
                        {v.preco && <span className="cv_preco">R$ {Number(v.preco).toLocaleString("pt-BR")}</span>}
                      </div>
                      {v.cor && <div className="cv_card_detail">Cor: {v.cor}</div>}
                      {v.quilometragem != null && <div className="cv_card_detail">{Number(v.quilometragem).toLocaleString("pt-BR")} km</div>}
                    </div>
                    <div className="cv_card_actions">
                      <button className="cv_btn_edit" onClick={() => preEditar(v)}>Editar</button>
                      <button className="cv_btn_delete" onClick={() => excluir(v)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CadastroVeiculo;
