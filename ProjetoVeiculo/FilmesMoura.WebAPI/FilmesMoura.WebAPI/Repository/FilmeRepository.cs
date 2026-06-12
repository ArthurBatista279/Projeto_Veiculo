using FilmesMoura.WebAPI.BdContextFilme;
using FilmesMoura.WebAPI.Interfaces;
using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Repository
{
    public class FilmeRepository : IFilmeRepository
    {
        private readonly FilmeContext _context;

        public FilmeRepository(FilmeContext context)
        {
            _context = context;
        }

        public void AtualizarIdCorpo(Filme filmeAtualizado)
        {
            try
            {
                Filme filmeBuscado = _context.Filmes.Find(filmeAtualizado.IdFilme)!;

                if(filmeBuscado != null)
                {
                    filmeBuscado.Titulo = filmeAtualizado.Titulo;
                    filmeBuscado.IdGenero = filmeAtualizado.IdGenero;
                    _context.Filmes.Update(filmeBuscado!);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void AtualizarIdUrl(Guid id, Filme filmeAtualizado)
        {
            try
            {
                Filme filmeBuscado = _context.Filmes.Find(id.ToString());

                if (filmeBuscado != null)
                {
                    filmeBuscado.Titulo = filmeAtualizado.Titulo;
                    filmeBuscado.IdGenero = filmeAtualizado.IdGenero;
                    _context.Filmes.Update(filmeBuscado!);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public Filme BuscarPorId(Guid id)
        {
            try
            {
                Filme filmeBuscado = _context.Filmes.Find(id.ToString());
                return filmeBuscado;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Cadastrar(Filme novoFilme)
        {
            try
            {
                novoFilme.IdFilme = Guid.NewGuid().ToString();
                _context.Filmes.Add(novoFilme);
                _context.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Deletar(Guid id)
        {
            try
            {
                Filme filmeBuscado = _context.Filmes.Find(id.ToString()!);

                if (filmeBuscado != null)
                {
                    _context.Filmes.Remove(filmeBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<Filme> Listar()
        {
            try
            {
                List<Filme> listaFilme = _context.Filmes.ToList();
                return listaFilme;
            }
            catch (Exception e)
            {

                throw;
            }
        }
    }
}
