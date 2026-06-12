using FilmesMoura.WebAPI.BdContextFilme;
using FilmesMoura.WebAPI.Interfaces;
using FilmesMoura.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FilmesMoura.WebAPI.Repository
{
    public class GeneroRepository : IGeneroRepository
    {
        private readonly FilmeContext _context;
        public GeneroRepository(FilmeContext context)
        {
            _context = context;
        }
        public void AtualizarIdCorpo(Genero GeneroAtualizado)
        {
            try
            {
                Genero generoBuscado = _context.Generos.Find(GeneroAtualizado.IdGenero)!;

                if (generoBuscado != null)
                {
                    generoBuscado.Nome = GeneroAtualizado.Nome;
                    _context.Generos.Update(generoBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw;
            }   

        }
        public void AtualizarIdUrl(Guid id, Genero generoAtualizado)
        {
              
            try
            {
                Genero generoBuscado = _context.Generos.Find(id.ToString());

                if (generoBuscado != null)
                {
                    generoBuscado.Nome = generoAtualizado.Nome;
                    _context.Generos.Update(generoBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public Genero BuscarPorId(Guid id)
        {
            try
            {
                Genero generoBuscado = _context.Generos.Find(id.ToString());
                return generoBuscado;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void Cadastrar(Genero NovoGenero)
        {
            try
            {
                NovoGenero.IdGenero = Guid.NewGuid().ToString();
                _context.Generos.Add(NovoGenero);
                _context.SaveChanges();

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void Deletar(Guid id)
        {
            try
            {
                Genero generoBuscado = _context.Generos.Find(id.ToString());

                if (generoBuscado != null)
                {
                    _context.Generos.Remove(generoBuscado);
                }
                _context.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<Genero> Listar()
        {
            try
            {
                return _context.Generos.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }

}

