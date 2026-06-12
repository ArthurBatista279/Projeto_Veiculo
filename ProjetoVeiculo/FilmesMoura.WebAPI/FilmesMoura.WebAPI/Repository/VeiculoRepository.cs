using FilmesMoura.WebAPI.BdContextFilme;
using FilmesMoura.WebAPI.Interfaces;
using FilmesMoura.WebAPI.Models;

namespace FilmesMoura.WebAPI.Repository
{
    public class VeiculoRepository : IVeiculoRepository
    {
        private readonly FilmeContext _context;

        public VeiculoRepository(FilmeContext context)
        {
            _context = context;
        }

        public void AtualizarIdCorpo(Veiculo veiculoAtualizado)
        {
            try
            {
                Veiculo veiculoBuscado = _context.Veiculos.Find(veiculoAtualizado.IdVeiculos)!;

                if (veiculoBuscado != null)
                {
                    veiculoBuscado.Nome = veiculoAtualizado.Nome;
                    veiculoBuscado.IdGenero = veiculoAtualizado.IdGenero;
                    _context.Veiculos.Update(veiculoBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void AtualizarIdUrl(Guid id, Veiculo veiculoAtualizado)
        {
            try
            {
                Veiculo veiculoBuscado = _context.Veiculos.Find(id.ToString())!;

                if (veiculoBuscado != null)
                {
                    veiculoBuscado.Nome = veiculoAtualizado.Nome;
                    veiculoBuscado.Marca = veiculoAtualizado.Marca;
                    veiculoBuscado.Modelo = veiculoAtualizado.Modelo;
                    veiculoBuscado.Ano = veiculoAtualizado.Ano;
                    veiculoBuscado.Preco = veiculoAtualizado.Preco;
                    veiculoBuscado.Cor = veiculoAtualizado.Cor;
                    veiculoBuscado.Quilometragem = veiculoAtualizado.Quilometragem;
                    veiculoBuscado.Combustivel = veiculoAtualizado.Combustivel;
                    veiculoBuscado.Cambio = veiculoAtualizado.Cambio;
                    veiculoBuscado.NumeroPortas = veiculoAtualizado.NumeroPortas;
                    veiculoBuscado.Potencia = veiculoAtualizado.Potencia;
                    veiculoBuscado.CapacidadePassageiros = veiculoAtualizado.CapacidadePassageiros;
                    veiculoBuscado.Descricao = veiculoAtualizado.Descricao;
                    veiculoBuscado.IdGenero = veiculoAtualizado.IdGenero;
                    veiculoBuscado.Imagem = veiculoAtualizado.Imagem;
                    _context.Veiculos.Update(veiculoBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Veiculo BuscarPorId(Guid id)
        {
            try
            {
                Veiculo veiculoBuscado = _context.Veiculos.Find(id.ToString())!;
                return veiculoBuscado;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Cadastrar(Veiculo novoVeiculo)
        {
            try
            {
                novoVeiculo.IdVeiculos = Guid.NewGuid().ToString();
                _context.Veiculos.Add(novoVeiculo);
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
                Veiculo veiculoBuscado = _context.Veiculos.Find(id.ToString())!;

                if (veiculoBuscado != null)
                {
                    _context.Veiculos.Remove(veiculoBuscado);
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Veiculo> Listar()
        {
            try
            {
                return _context.Veiculos.ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
