namespace FilmesMoura.WebAPI.DTO;

public class VeiculoDTO
{
    public string? Nome { get; set; }
    public string? Marca { get; set; }
    public string? Modelo { get; set; }
    public int? Ano { get; set; }
    public decimal? Preco { get; set; }
    public string? Cor { get; set; }
    public int? Quilometragem { get; set; }
    public string? Combustivel { get; set; }
    public string? Cambio { get; set; }
    public int? NumeroPortas { get; set; }
    public string? Potencia { get; set; }
    public int? CapacidadePassageiros { get; set; }
    public string? Descricao { get; set; }
    public IFormFile? Imagem { get; set; }
    public Guid? IdGenero { get; set; }
}
