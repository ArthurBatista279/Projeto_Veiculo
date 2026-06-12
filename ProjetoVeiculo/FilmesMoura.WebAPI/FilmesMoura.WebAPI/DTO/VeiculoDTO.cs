namespace FilmesMoura.WebAPI.DTO;

public class VeiculoDTO
{
    public string? Nome { get; set; }
    public IFormFile? Imagem { get; set; }
    public Guid? IdGenero { get; set; }
}
