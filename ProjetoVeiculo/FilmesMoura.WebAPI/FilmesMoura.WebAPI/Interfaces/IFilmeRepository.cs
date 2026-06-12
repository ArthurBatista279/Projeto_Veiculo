using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Interfaces
{
    public interface IFilmeRepository
    {
        void Cadastrar(Filme novoFilme);
        List<Filme> Listar();
        void AtualizarIdCorpo(Filme filmeAtualizado);
        void AtualizarIdUrl(Guid id, Filme filmeAtualizado);
        void Deletar(Guid id);
        Filme BuscarPorId(Guid id);
    }
}
