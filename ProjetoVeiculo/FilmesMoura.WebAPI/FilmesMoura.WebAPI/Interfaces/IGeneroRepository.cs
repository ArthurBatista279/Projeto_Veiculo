using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Interfaces
{
    public interface IGeneroRepository
    {
        void Cadastrar(Genero novoGenero);
        List<Genero> Listar();

        void AtualizarIdCorpo(Genero generoAtualizado);
        void AtualizarIdUrl(Guid id, Genero generoAtualizado);
        void Deletar(Guid id);
        Genero BuscarPorId(Guid id);

    }
}
