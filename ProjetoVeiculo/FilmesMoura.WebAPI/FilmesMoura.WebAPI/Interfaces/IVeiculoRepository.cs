using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Interfaces
{
    public interface IVeiculoRepository
    {
        void Cadastrar(Veiculo novoVeiculo);
        List<Veiculo> Listar();
        void AtualizarIdCorpo(Veiculo veiculoAtualizado);
        void AtualizarIdUrl(Guid id, Veiculo veiculoAtualizado);
        void Deletar(Guid id);
        Veiculo BuscarPorId(Guid id);
    }
}
