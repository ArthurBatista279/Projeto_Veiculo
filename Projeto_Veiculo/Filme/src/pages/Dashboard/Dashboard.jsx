import { useEffect, useState } from "react";
import api, { apiHost } from "../../services/Services";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Swal from "sweetalert2";
import "./Dashboard.css";

// ── Sub-componente: Painel de Visão Geral ──────────────────────────
const PainelVisaoGeral = ({ totalVeiculos, totalCategorias }) => {
    return (
        <div className="db_visao_geral">
            <div className="db_stats_grid">
                <div className="db_stat_card db_stat_primary">
                    <div className="db_stat_icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="10" width="20" height="8" rx="2" /><path d="M14 6H10L8 10h8l-2-4z" />
                        </svg>
                    </div>
                    <div>
                        <div className="db_stat_val">{totalVeiculos}</div>
                        <div className="db_stat_lbl">Veículos Cadastrados</div>
                    </div>
                </div>
                <div className="db_stat_card db_stat_green">
                    <div className="db_stat_icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                    </div>
                    <div>
                        <div className="db_stat_val">{totalCategorias}</div>
                        <div className="db_stat_lbl">Categorias</div>
                    </div>
                </div>
                <div className="db_stat_card db_stat_orange">
                    <div className="db_stat_icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <div className="db_stat_val">{totalVeiculos + totalCategorias}</div>
                        <div className="db_stat_lbl">Total de Registros</div>
                    </div>
                </div>
            </div>

            <div className="db_info_box">
                <h3>Bem-vindo ao Painel Administrativo</h3>
                <p>Use as abas acima para gerenciar <strong>Veículos</strong> e <strong>Categorias</strong> do catálogo.</p>
                <div className="db_quicklinks">
                    <div className="db_ql_item"> Acesse a aba <strong>Veículos</strong> para cadastrar, editar e excluir carros do catálogo</div>
                    <div className="db_ql_item"> Acesse a aba <strong>Categorias</strong> para gerenciar as classificações dos veículos</div>
                    <div className="db_ql_item"> Use o <strong>Catálogo</strong> no menu para ver como os usuários enxergam o site</div>
                </div>
            </div>
        </div>
    );
};

// ── Sub-componente: Gerenciamento de Veículos ──────────────────────
const PainelVeiculos = () => {
    const camposIniciais = {
        nome: "", marca: "", modelo: "", ano: "", preco: "",
        cor: "", quilometragem: "", combustivel: "", cambio: "",
        numeroPortas: "", potencia: "", capacidadePassageiros: "",
        descricao: "", idGenero: "",
    };

    const [campos, setCampos] = useState(camposIniciais);
    const [imagem, setImagem] = useState(null);
    const [imagemKey, setImagemKey] = useState(Date.now());
    const [editar, setEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [listaVeiculos, setListaVeiculos] = useState([]);
    const [listaGeneros, setListaGeneros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buscaLista, setBuscaLista] = useState("");

    const set = (campo) => (e) => setCampos((p) => ({ ...p, [campo]: e.target.value }));

    const carregarDados = async () => {
        try {
            const [vRes, gRes] = await Promise.all([api.get("/veiculos"), api.get("/generos")]);
            const generos = gRes.data;
            setListaGeneros(generos);
            const formatados = vRes.data.map((v) => {
                const g = generos.find((g) => g.idGenero == v.idGenero);
                // Puxa as especificidades locais se existirem
                const extras = JSON.parse(localStorage.getItem(`veiculo_detalhes_${v.idVeiculos}`)) || {};
                return { 
                    ...v, 
                    id: v.idVeiculos, 
                    titulo: v.nome, 
                    generoNome: g?.nome || "Sem Categoria",
                    // Garante que os campos locais/localStorage aparecem para edicao
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
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { carregarDados(); }, []);

    const buildFD = () => {
        const fd = new FormData();
        fd.append("nome", campos.nome);
        fd.append("idGenero", campos.idGenero);
        if (imagem) fd.append("imagem", imagem);
        return fd;
    };

    const salvar = async (e) => {
        e.preventDefault();
        if (!campos.nome.trim()) return Swal.fire("Atenção!", "Nome é obrigatório.", "warning");
        if (!campos.idGenero) return Swal.fire("Atenção!", "Selecione uma categoria.", "warning");
        try {
            const fd = buildFD();
            if (editar) {
                await api.put(`/veiculos/${idEditar}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
                const extras = {
                    marca: campos.marca, modelo: campos.modelo, ano: campos.ano, preco: campos.preco,
                    cor: campos.cor, quilometragem: campos.quilometragem, combustivel: campos.combustivel,
                    cambio: campos.cambio, numeroPortas: campos.numeroPortas, potencia: campos.potencia,
                    capacidadePassageiros: campos.capacidadePassageiros, descricao: campos.descricao
                };
                localStorage.setItem(`veiculo_detalhes_${idEditar}`, JSON.stringify(extras));
                Swal.fire("Atualizado!", "Veículo atualizado com sucesso.", "success");
            } else {
                await api.post("/veiculos", fd, { headers: { "Content-Type": "multipart/form-data" } });
                const resLista = await api.get("/veiculos");
                const recemCriado = resLista.data
                    .filter(v => v.nome === campos.nome && v.idGenero == campos.idGenero)
                    .sort((a, b) => b.idVeiculos.localeCompare(a.idVeiculos))[0];
                
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
                Swal.fire("Cadastrado!", "Veículo cadastrado com sucesso.", "success");
            }
            limpar();
            await carregarDados();
        } catch { Swal.fire("Erro!", "Falha ao salvar veículo.", "error"); }
    };

    const preEditar = (v) => {
        setCampos({
            nome: v.nome||"", marca: v.marca||"", modelo: v.modelo||"",
            ano: v.ano||"", preco: v.preco||"", cor: v.cor||"",
            quilometragem: v.quilometragem||"", combustivel: v.combustivel||"",
            cambio: v.cambio||"", numeroPortas: v.numeroPortas||"",
            potencia: v.potencia||"", capacidadePassageiros: v.capacidadePassageiros||"",
            descricao: v.descricao||"", idGenero: v.idGenero||"",
        });
        setEditar(true); setIdEditar(v.id); setImagem(null); setImagemKey(Date.now());
        document.getElementById("db_form_veiculo")?.scrollIntoView({ behavior: "smooth" });
    };

    const excluir = async (v) => {
        const r = await Swal.fire({ title: `Excluir "${v.nome}"?`, text: "Esta ação não pode ser desfeita.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonText: "Cancelar", confirmButtonText: "Excluir" });
        if (!r.isConfirmed) return;
        try { 
            await api.delete(`/veiculos/${v.id}`); 
            localStorage.removeItem(`veiculo_detalhes_${v.id}`);
            Swal.fire("Excluído!", "", "success"); 
            await carregarDados(); 
        }
        catch { Swal.fire("Erro!", "Falha ao excluir.", "error"); }
    };

    const limpar = () => { setCampos(camposIniciais); setEditar(false); setIdEditar(null); setImagem(null); setImagemKey(Date.now()); };

    const veiculosFiltrados = listaVeiculos.filter(v => v.nome?.toLowerCase().includes(buscaLista.toLowerCase()) || v.marca?.toLowerCase().includes(buscaLista.toLowerCase()));

    return (
        <div className="db_painel_veiculos">
            <form id="db_form_veiculo" onSubmit={salvar} className="db_veiculo_form">
                <div className="db_form_titulo">
                    <h2>{editar ? "Editar Veículo" : "Novo Veículo"}</h2>
                    {editar && <button type="button" className="db_btn_cancelar" onClick={limpar}>Cancelar edição</button>}
                </div>

                <fieldset className="db_fieldset">
                    <legend>Informações Básicas</legend>
                    <div className="db_grid db_grid_3">
                        <div className="db_campo"><label>Nome *</label><input type="text" placeholder="Ex: Civic" value={campos.nome} onChange={set("nome")} required /></div>
                        <div className="db_campo"><label>Marca</label><input type="text" placeholder="Ex: Honda" value={campos.marca} onChange={set("marca")} /></div>
                        <div className="db_campo"><label>Modelo</label><input type="text" placeholder="Ex: EXL" value={campos.modelo} onChange={set("modelo")} /></div>
                    </div>
                </fieldset>

                <fieldset className="db_fieldset">
                    <legend>Categorização e Preço</legend>
                    <div className="db_grid db_grid_3">
                        <div className="db_campo">
                            <label>Categoria *</label>
                            <select value={campos.idGenero} onChange={set("idGenero")} required>
                                <option value="" disabled>Selecione...</option>
                                {listaGeneros.map(g => <option key={g.idGenero} value={g.idGenero}>{g.nome}</option>)}
                            </select>
                        </div>
                        <div className="db_campo"><label>Ano</label><input type="number" placeholder="2024" min="1900" max="2099" value={campos.ano} onChange={set("ano")} /></div>
                        <div className="db_campo"><label>Preço (R$)</label><input type="number" placeholder="89000" min="0" step="0.01" value={campos.preco} onChange={set("preco")} /></div>
                    </div>
                </fieldset>

                <fieldset className="db_fieldset">
                    <legend>Especificações Técnicas</legend>
                    <div className="db_grid db_grid_4">
                        <div className="db_campo"><label>Cor</label><input type="text" placeholder="Preto" value={campos.cor} onChange={set("cor")} /></div>
                        <div className="db_campo"><label>Quilometragem</label><input type="number" placeholder="45000" min="0" value={campos.quilometragem} onChange={set("quilometragem")} /></div>
                        <div className="db_campo"><label>Combustível</label>
                            <select value={campos.combustivel} onChange={set("combustivel")}>
                                <option value="">Selecione...</option>
                                {["Flex","Gasolina","Etanol","Diesel","Elétrico","Híbrido","GNV"].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="db_campo"><label>Câmbio</label>
                            <select value={campos.cambio} onChange={set("cambio")}>
                                <option value="">Selecione...</option>
                                {["Manual","Automático","CVT","Automatizado","Dupla Embreagem"].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="db_campo"><label>Portas</label>
                            <select value={campos.numeroPortas} onChange={set("numeroPortas")}>
                                <option value="">Selecione...</option>
                                {[2,3,4,5].map(n => <option key={n} value={n}>{n} portas</option>)}
                            </select>
                        </div>
                        <div className="db_campo"><label>Potência</label><input type="text" placeholder="150 cv" value={campos.potencia} onChange={set("potencia")} /></div>
                        <div className="db_campo"><label>Passageiros</label>
                            <select value={campos.capacidadePassageiros} onChange={set("capacidadePassageiros")}>
                                <option value="">Selecione...</option>
                                {[2,4,5,6,7,8,9,10,12,15].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="db_fieldset">
                    <legend>Descrição e Imagem</legend>
                    <div className="db_grid db_grid_2">
                        <div className="db_campo"><label>Descrição</label><textarea placeholder="Descreva o veículo..." value={campos.descricao} onChange={set("descricao")} rows={4} /></div>
                        <div className="db_campo">
                            <label>Imagem Principal</label>
                            <div className="db_upload" onClick={() => document.getElementById("db_img").click()}>
                                {imagem ? (
                                    <div className="db_img_prev">
                                        <img src={URL.createObjectURL(imagem)} alt="preview" />
                                        <button type="button" className="db_rm_img" onClick={(e) => { e.stopPropagation(); setImagem(null); setImagemKey(Date.now()); }}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="db_upload_icon_svg">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                <circle cx="12" cy="13" r="4"/>
                                            </svg>
                                        </span>
                                        <span>Clique para selecionar</span>
                                        <small>JPG, PNG, WEBP</small>
                                    </>
                                )}
                            </div>
                            <input key={imagemKey} id="db_img" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setImagem(e.target.files[0] || null)} />
                        </div>
                    </div>
                </fieldset>

                <div className="db_form_actions">
                    <button type="submit" className="db_btn_salvar">
                        {editar ? "Salvar Alterações" : "Cadastrar Veículo"}
                    </button>
                </div>
            </form>

            {/* Lista */}
            <div className="db_lista_header">
                <h3>Veículos <span className="db_badge">{veiculosFiltrados.length}</span></h3>
                <input type="text" className="db_busca" placeholder="Buscar por nome ou marca..." value={buscaLista} onChange={e => setBuscaLista(e.target.value)} />
            </div>

            {loading ? (
                <div className="db_skeleton_grid">{[1,2,3,4].map(i=><div key={i} className="db_skeleton"/>)}</div>
            ) : (
                <div className="db_table_wrap">
                    <table className="db_table">
                        <thead><tr><th>Imagem</th><th>Nome</th><th>Marca</th><th>Ano</th><th>Preço</th><th>Categoria</th><th>Ações</th></tr></thead>
                        <tbody>
                            {veiculosFiltrados.length === 0 && <tr><td colSpan={7} className="db_empty_row">Nenhum veículo encontrado.</td></tr>}
                            {veiculosFiltrados.map(v => (
                                <tr key={v.id}>
                                    <td>
                                        {v.imagem ? <img src={`${apiHost}/imagens/${v.imagem}`} alt={v.nome} className="db_table_img" /> : (
                                            <div className="db_table_no_img">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="10" width="20" height="8" rx="2" /><path d="M14 6H10L8 10h8l-2-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td><strong>{v.nome}</strong></td>
                                    <td>{v.marca || "—"}</td>
                                    <td>{v.ano || "—"}</td>
                                    <td>{v.preco ? `R$ ${Number(v.preco).toLocaleString("pt-BR")}` : "—"}</td>
                                    <td><span className="db_cat_badge">{v.generoNome}</span></td>
                                    <td>
                                        <div className="db_table_actions">
                                            <button className="db_tbl_edit" onClick={() => preEditar(v)}>Editar</button>
                                            <button className="db_tbl_del" onClick={() => excluir(v)}>Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ── Sub-componente: Gerenciamento de Categorias ────────────────────
const PainelCategorias = () => {
    const [nome, setNome] = useState("");
    const [lista, setLista] = useState([]);
    const [editar, setEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const carregar = async () => {
        try { const r = await api.get("/generos"); setLista(r.data); } catch { }
    };

    useEffect(() => { carregar(); }, []);

    const salvar = async (e) => {
        e.preventDefault();
        if (!nome.trim()) return Swal.fire("Atenção!", "Nome da categoria é obrigatório.", "warning");
        try {
            if (editar) {
                await api.put(`/generos/${idEditar}`, { nome });
                Swal.fire("Atualizado!", "Categoria atualizada.", "success");
            } else {
                await api.post("/generos", { nome });
                Swal.fire("Cadastrado!", "Categoria criada.", "success");
            }
            setNome(""); setEditar(false); setIdEditar(null);
            await carregar();
        } catch { Swal.fire("Erro!", "Falha ao salvar categoria.", "error"); }
    };

    const excluir = async (g) => {
        const r = await Swal.fire({ title: `Excluir "${g.nome}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonText: "Cancelar", confirmButtonText: "Excluir" });
        if (!r.isConfirmed) return;
        try { await api.delete(`/generos/${g.idGenero}`); Swal.fire("Excluído!", "", "success"); await carregar(); }
        catch { Swal.fire("Erro!", "Falha ao excluir. Verifique se há veículos vinculados.", "error"); }
    };

    return (
        <div className="db_painel_categorias">
            <form onSubmit={salvar} className="db_cat_form">
                <h2>{editar ? "Editar Categoria" : "Nova Categoria"}</h2>
                <div className="db_cat_form_row">
                    <div className="db_campo"><label>Nome da Categoria *</label><input type="text" placeholder="Ex: SUV, Sedan, Esportivo..." value={nome} onChange={e => setNome(e.target.value)} required /></div>
                    <button type="submit" className="db_btn_salvar">{editar ? "Salvar" : "Cadastrar"}</button>
                    {editar && <button type="button" className="db_btn_cancelar" onClick={() => { setNome(""); setEditar(false); setIdEditar(null); }}>Cancelar</button>}
                </div>
            </form>

            <div className="db_lista_header"><h3>Categorias <span className="db_badge">{lista.length}</span></h3></div>

            <div className="db_table_wrap">
                <table className="db_table">
                    <thead><tr><th>#</th><th>Nome</th><th>Ações</th></tr></thead>
                    <tbody>
                        {lista.length === 0 && <tr><td colSpan={3} className="db_empty_row">Nenhuma categoria cadastrada.</td></tr>}
                        {lista.map((g, i) => (
                            <tr key={g.idGenero}>
                                <td style={{ color: "var(--color-text-secondary)", fontSize: "0.8rem" }}>{i + 1}</td>
                                <td><strong>{g.nome}</strong></td>
                                <td><div className="db_table_actions">
                                    <button className="db_tbl_edit" onClick={() => { setNome(g.nome); setEditar(true); setIdEditar(g.idGenero); }}>Editar</button>
                                    <button className="db_tbl_del" onClick={() => excluir(g)}>Excluir</button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ── Componente Principal: Dashboard ───────────────────────────────
const Dashboard = () => {
    const [abaAtiva, setAbaAtiva] = useState("geral");
    const [totalVeiculos, setTotalVeiculos] = useState(0);
    const [totalCategorias, setTotalCategorias] = useState(0);

    useEffect(() => {
        Promise.all([api.get("/veiculos").catch(() => ({ data: [] })), api.get("/generos").catch(() => ({ data: [] }))])
            .then(([v, g]) => { setTotalVeiculos(v.data.length); setTotalCategorias(g.data.length); });
    }, [abaAtiva]);

    const abas = [
        { key: "geral", label: "Visão Geral" },
        { key: "veiculos", label: "Veículos" },
        { key: "categorias", label: "Categorias" },
    ];

    return (
        <>
            <Header />
            <main className="main_dashboard">
                <div className="layout_grid db_layout">
                    <div className="db_top">
                        <h1 className="db_titulo">Painel Administrativo</h1>
                        <p className="db_subtitulo">Gerencie o catálogo de veículos e categorias em um único lugar.</p>
                    </div>

                    <div className="db_abas">
                        {abas.map(a => (
                            <button key={a.key} className={`db_aba ${abaAtiva === a.key ? "db_aba_ativa" : ""}`} onClick={() => setAbaAtiva(a.key)}>
                                {a.label}
                            </button>
                        ))}
                    </div>

                    <div className="db_conteudo">
                        {abaAtiva === "geral" && <PainelVisaoGeral totalVeiculos={totalVeiculos} totalCategorias={totalCategorias} />}
                        {abaAtiva === "veiculos" && <PainelVeiculos />}
                        {abaAtiva === "categorias" && <PainelCategorias />}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Dashboard;
