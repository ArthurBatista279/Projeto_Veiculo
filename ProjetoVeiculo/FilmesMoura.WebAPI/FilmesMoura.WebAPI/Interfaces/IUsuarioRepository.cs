using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Interfaces;

public interface IUsuarioRepository
{
    void Cadastrar(Usuario novoUsuario);
    Usuario BuscarPorId(Guid id);
    Usuario BuscarPorEmailESenha(string email, string senha);
}
