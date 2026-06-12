using FilmesMoura.WebAPI.DTO;
using FilmesMoura.WebAPI.Interfaces;
using FilmesMoura.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FilmesMoura.WebAPI.Controllers;

[Route("api/veiculos")]
[ApiController]
public class VeiculoController : ControllerBase
{
    private readonly IVeiculoRepository _veiculoRepository;
    public VeiculoController(IVeiculoRepository veiculoRepository)
    {
        _veiculoRepository = veiculoRepository;
    }

    [HttpGet]
    public IActionResult Get()
    {
        try
        {
            return Ok(_veiculoRepository.Listar());
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        try
        {
            return Ok(_veiculoRepository.BuscarPorId(id));
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromForm] VeiculoDTO novoVeiculo)
    {
        if (String.IsNullOrWhiteSpace(novoVeiculo.Nome) || novoVeiculo.IdGenero == Guid.Empty)
            return BadRequest("É obrigatório que o veículo tenha nome e gênero!");

        Veiculo veiculo = new Veiculo
        {
            Nome = novoVeiculo.Nome!,
            Marca = novoVeiculo.Marca,
            Modelo = novoVeiculo.Modelo,
            Ano = novoVeiculo.Ano,
            Preco = novoVeiculo.Preco,
            Cor = novoVeiculo.Cor,
            Quilometragem = novoVeiculo.Quilometragem,
            Combustivel = novoVeiculo.Combustivel,
            Cambio = novoVeiculo.Cambio,
            NumeroPortas = novoVeiculo.NumeroPortas,
            Potencia = novoVeiculo.Potencia,
            CapacidadePassageiros = novoVeiculo.CapacidadePassageiros,
            Descricao = novoVeiculo.Descricao,
            IdGenero = novoVeiculo.IdGenero.ToString()
        };

        if (novoVeiculo.Imagem != null && novoVeiculo.Imagem.Length > 0)
        {
            var extensao = Path.GetExtension(novoVeiculo.Imagem.FileName);
            var nomeArquivo = $"{Guid.NewGuid()}{extensao}";

            var pastaRelativa = "wwwroot/imagens";
            var caminhaPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

            if (!Directory.Exists(caminhaPasta))
                Directory.CreateDirectory(caminhaPasta);

            var caminhaCompleto = Path.Combine(caminhaPasta, nomeArquivo);

            using (var stream = new FileStream(caminhaCompleto, FileMode.Create))
            {
                await novoVeiculo.Imagem.CopyToAsync(stream);
            }

            veiculo.Imagem = nomeArquivo;
        }

        try
        {
            _veiculoRepository.Cadastrar(veiculo);
            return StatusCode(201, "Veículo cadastrado com sucesso!");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(Guid id, [FromForm] VeiculoDTO veiculo)
    {
        var veiculoBuscado = _veiculoRepository.BuscarPorId(id);

        if (veiculoBuscado == null)
            return NotFound("Veículo não encontrado!");

        // Atualiza campos básicos se fornecidos
        if (!String.IsNullOrWhiteSpace(veiculo.Nome))
            veiculoBuscado.Nome = veiculo.Nome;
        if (!String.IsNullOrWhiteSpace(veiculo.Marca))
            veiculoBuscado.Marca = veiculo.Marca;
        if (!String.IsNullOrWhiteSpace(veiculo.Modelo))
            veiculoBuscado.Modelo = veiculo.Modelo;
        if (veiculo.Ano.HasValue)
            veiculoBuscado.Ano = veiculo.Ano;
        if (veiculo.Preco.HasValue)
            veiculoBuscado.Preco = veiculo.Preco;
        if (!String.IsNullOrWhiteSpace(veiculo.Cor))
            veiculoBuscado.Cor = veiculo.Cor;
        if (veiculo.Quilometragem.HasValue)
            veiculoBuscado.Quilometragem = veiculo.Quilometragem;
        if (!String.IsNullOrWhiteSpace(veiculo.Combustivel))
            veiculoBuscado.Combustivel = veiculo.Combustivel;
        if (!String.IsNullOrWhiteSpace(veiculo.Cambio))
            veiculoBuscado.Cambio = veiculo.Cambio;
        if (veiculo.NumeroPortas.HasValue)
            veiculoBuscado.NumeroPortas = veiculo.NumeroPortas;
        if (!String.IsNullOrWhiteSpace(veiculo.Potencia))
            veiculoBuscado.Potencia = veiculo.Potencia;
        if (veiculo.CapacidadePassageiros.HasValue)
            veiculoBuscado.CapacidadePassageiros = veiculo.CapacidadePassageiros;
        if (!String.IsNullOrWhiteSpace(veiculo.Descricao))
            veiculoBuscado.Descricao = veiculo.Descricao;
        if (veiculo.IdGenero != null && veiculo.IdGenero.ToString() != veiculoBuscado.IdGenero)
            veiculoBuscado.IdGenero = veiculo.IdGenero.ToString();

        // Atualiza imagem se fornecida
        if (veiculo.Imagem != null && veiculo.Imagem.Length != 0)
        {
            var pastaRelativa = "wwwroot/imagens";
            var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

            if (!string.IsNullOrEmpty(veiculoBuscado.Imagem))
            {
                var caminhoImagemAntiga = Path.Combine(caminhoPasta, veiculoBuscado.Imagem);
                if (System.IO.File.Exists(caminhoImagemAntiga))
                    System.IO.File.Delete(caminhoImagemAntiga);
            }

            var extensao = Path.GetExtension(veiculo.Imagem.FileName);
            var nomeArquivo = $"{Guid.NewGuid()}{extensao}";

            if (!Directory.Exists(caminhoPasta))
                Directory.CreateDirectory(caminhoPasta);

            var caminhoCompleto = Path.Combine(caminhoPasta, nomeArquivo);

            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await veiculo.Imagem.CopyToAsync(stream);
            }

            veiculoBuscado.Imagem = nomeArquivo;
        }

        try
        {
            _veiculoRepository.AtualizarIdUrl(id, veiculoBuscado);
            return NoContent();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var veiculoBuscado = _veiculoRepository.BuscarPorId(id);
        if (veiculoBuscado == null)
            return NotFound("Veículo não encontrado!");

        var pastaRelativa = "wwwroot/imagens";
        var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

        if (!string.IsNullOrEmpty(veiculoBuscado.Imagem))
        {
            var caminho = Path.Combine(caminhoPasta, veiculoBuscado.Imagem);
            if (System.IO.File.Exists(caminho))
                System.IO.File.Delete(caminho);
        }

        try
        {
            _veiculoRepository.Deletar(id);
            return NoContent();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }
}
