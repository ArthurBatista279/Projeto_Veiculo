import "./CadastroVeiculo.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Cadastro from "../../components/cadastro/Cadastro";
import Lista from "../../components/lista/Lista";
import { useEffect, useState } from "react";
import api from "../../services/Services";
import Swal from "sweetalert2";
import Alerta from "../../components/alerta/Alerta";

const CadastroVeiculo = () => {
  const [valor, setValor] = useState("");
  const [idGenero, setIdGenero] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemKey, setImagemKey] = useState(Date.now());
  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(0);
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [listaGeneros, setListaGeneros] = useState([]);

  const getGeneros = async () => {
    try {
      const retornoAPI = await api.get("/generos");
      setListaGeneros(retornoAPI.data);
      return retornoAPI.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Problemas ao carregar os gêneros!",
        icon: "error",
      });
      return [];
    }
  };

  const getVeiculos = async (generosCarregados = listaGeneros) => {
    try {
      const retornoAPI = await api.get("/veiculos");

      const generos =
        generosCarregados.length > 0 ? generosCarregados : await getGeneros();

      const veiculosFormatados = retornoAPI.data.map((veiculo) => {
        const generoEncontrado = generos.find(
          (g) => g.idGenero == veiculo.idGenero,
        );
        return {
          id: veiculo.idVeiculos,
          titulo: veiculo.nome,
          idGenero: veiculo.idGenero,
          imagem: veiculo.imagem,
          genero: {
            nome: generoEncontrado ? generoEncontrado.nome : "Não cadastrado",
          },
        };
      });

      setListaVeiculos(veiculosFormatados);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Problemas ao carregar a lista de veículos!",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      const generos = await getGeneros();
      await getVeiculos(generos);
    };
    inicializar();
  }, []);

  const cadastrarVeiculo = async (e) => {
    e.preventDefault();

    if (valor.trim().length === 0) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, preencha o nome do veículo!",
        icon: "warning",
      });
      return;
    }

    if (!idGenero) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, selecione um gênero!",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nome", valor);
    formData.append("idGenero", idGenero);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      await api.post("/veiculos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Veículo cadastrado com sucesso!",
        icon: "success",
      });

      limparFormulario();
      await getVeiculos();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao cadastrar o veículo. Tente novamente!",
        icon: "error",
      });
    }
  };

  const editarVeiculo = async (e) => {
    e.preventDefault();

    if (valor.trim().length === 0) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, preencha o nome do veículo!",
        icon: "warning",
      });
      return;
    }

    if (!idGenero) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, selecione um gênero!",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nome", valor);
    formData.append("idGenero", idGenero);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      await api.put(`/veiculos/${idEditar}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Veículo atualizado com sucesso!",
        icon: "success",
      });

      limparFormulario();
      await getVeiculos();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao atualizar o veículo. Tente novamente!",
        icon: "error",
      });
    }
  };

  const PreEditar = (item) => {
    setValor(item.titulo);
    setIdGenero(item.idGenero || "");
    setEditar(true);
    setIdEditar(item.id);
    setImagem(null);
    setImagemKey(Date.now());
  };

  const excluirVeiculo = async (item) => {
    const result = await Swal.fire({
      title: "Tem certeza que deseja excluir?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const retornoAPI = await api.delete(`/veiculos/${item.id}`);
      if (retornoAPI.status === 200 || retornoAPI.status === 204) {
        Swal.fire({
          title: "Deletado!",
          text: "O veículo foi excluído com sucesso!",
          icon: "success",
        });
        await getVeiculos();
      } else {
        Swal.fire({
          title: "Erro!",
          text: "Problemas ao excluir o veículo. Tente novamente!",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao excluir o veículo. Tente novamente!",
        icon: "error",
      });
    }
  };

  const limparFormulario = () => {
    setValor("");
    setIdGenero("");
    setEditar(false);
    setIdEditar(0);
    setImagem(null);
    setImagemKey(Date.now());
  };

  return (
    <>
      <Header />

      <main>
        <Cadastro
          tituloCadastro="Cadastro de Veículo"
          placeholder="veículo"
          funcCadastro={editar ? editarVeiculo : cadastrarVeiculo}
          valor={valor}
          setValor={setValor}
          valorSelect={idGenero}
          setValorSelect={setIdGenero}
          comImagem={true}
          imagemKey={imagemKey}
          setImagem={setImagem}
          btnEditar={editar}
          cancelarEdicao={limparFormulario}
          listaGeneros={listaGeneros}
        />

        <Lista
          tituloLista="Lista de Veículos"
          lista={listaVeiculos}
          tipoLista="filme" // Usamos "filme" no tipoLista para aproveitar a coluna de imagem e mapeamento de gênero
          funcExcluir={excluirVeiculo}
          funcEditar={PreEditar}
        />
      </main>

      <Footer />
    </>
  );
};

export default CadastroVeiculo;
