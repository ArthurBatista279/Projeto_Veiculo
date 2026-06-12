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

        Veiculo veiculo = new Veiculo();

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

        veiculo.IdGenero = novoVeiculo.IdGenero.ToString();
        veiculo.Nome = novoVeiculo.Nome!;

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
        if (!String.IsNullOrWhiteSpace(veiculo.Nome))
            veiculoBuscado.Nome = veiculo.Nome;
        if (veiculo.IdGenero != null && veiculo.IdGenero.ToString() != veiculoBuscado.IdGenero)
            veiculoBuscado.IdGenero = veiculo.IdGenero.ToString();
        if (veiculo.Imagem != null && veiculo.Imagem.Length != 0)
        {
            var pastaRelativa = "wwwroot/imagens";
            var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

            // Delete arquivo antigo
            if (!string.IsNullOrEmpty(veiculoBuscado.Imagem))
            {
                var caminhoImagemAntiga = Path.Combine(caminhoPasta, veiculoBuscado.Imagem);
                if (System.IO.File.Exists(caminhoImagemAntiga))
                    System.IO.File.Delete(caminhoImagemAntiga);
            }

            // Salvar nova imagem
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

    [HttpPut]
    public IActionResult Put(Veiculo veiculo)
    {
        try
        {
            _veiculoRepository.AtualizarIdCorpo(veiculo);
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
