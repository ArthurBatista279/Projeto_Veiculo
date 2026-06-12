import "./CadastroGenero.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Cadastro from "../../components/cadastro/Cadastro";
import Lista from "../../components/lista/Lista";
import { useEffect, useState } from "react";
import api from "../../services/Services";
import Swal from "sweetalert2";
import Alerta from "../../components/alerta/Alerta";

const CadastroGenero = () => {
  const [valor, setValor] = useState("");
  const [listaGeneros, setListaGeneros] = useState([]);
  const [editar, setEditar] = useState(false);
  const [id, setId] = useState(0);

  const getGenero = async () => {
    try {
      const retornoAPI = await api.get("/generos");
      setListaGeneros(retornoAPI.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Problemas ao carregar os dados da API!",
        icon: "error",
      });
    }
  };

  const cadastrarGenero = async (e) => {
    e.preventDefault();

    if (valor.trim().length == 0) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, preencha o nome do gênero!",
        icon: "warning",
      });
      return;
    }

    const objCadastro = {
      nome: valor,
    };

    try {
      const retornoAPI = await api.post("/generos", objCadastro);

      Swal.fire({
        title: "Sucesso!",
        text: "Gênero cadastrado com sucesso!",
        icon: "success",
      });

      limparFormulario();
      await getGenero();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao cadastrar o gênero. Tente novamente!",
        icon: "error",
      });
    }
  };

  const limparFormulario = () => {
    setValor("");
    setEditar(false);
    setId(0);
  };

  const excluirGenero = async (item) => {
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
      return false;
    }

    try {
      const retornoAPI = await api.delete(`/generos/${item.idGenero}`);
      if (retornoAPI.status == 200 || retornoAPI.status == 204) {
        Swal.fire({
          title: "Deletado!",
          text: "O gênero foi excluído com sucesso!",
          icon: "success",
        });
        await getGenero();
      } else {
        Swal.fire({
          title: "Erro!",
          text: "Problemas ao excluir o gênero. Tente novamente!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Erro ao excluir o gênero. Tente novamente!",
        icon: "error",
      });
      console.log(error);
    }
  };

  const PreEditar = (item) => {
    setValor(item.nome);
    setEditar(true);
    setId(item.idGenero);
  };

  const editarGenero = async (e) => {
    e.preventDefault();

    if (valor.trim().length == 0) {
      Alerta({
        title: "Atenção!",
        text: "Por favor, preencha o nome do gênero!",
        icon: "warning",
      });
      return;
    }

    const objEditar = {
      nome: valor,
    };

    try {
      const retornoAPI = await api.put(`/generos/${id}`, objEditar);

      Swal.fire({
        title: "Sucesso!",
        text: "Gênero atualizado com sucesso!",
        icon: "success",
      });

      limparFormulario();
      await getGenero();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao atualizar o gênero. Tente novamente!",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getGenero();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Cadastro
          // Troca o título visualmente de forma dinâmica quando estiver editando
          tituloCadastro="Cadastro de Gênero"
          visibilidade="none"
          placeholder="gênero"
          funcCadastro={editar ? editarGenero : cadastrarGenero}
          valor={valor}
          setValor={setValor}
          btnEditar={editar}
          cancelarEdicao={limparFormulario}
        />

        <Lista
          tituloLista="Lista de Gêneros"
          visibilidade="none"
          lista={listaGeneros}
          tipoLista="genero"
          funcExcluir={excluirGenero}
          funcEditar={PreEditar}
        />
      </main>
      <Footer />
    </>
  );
};
export default CadastroGenero;
