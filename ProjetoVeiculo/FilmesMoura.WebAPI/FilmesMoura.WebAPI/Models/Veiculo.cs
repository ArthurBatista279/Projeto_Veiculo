using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace FilmesMoura.WebAPI.Models;

[Table("Veiculos")]
public partial class Veiculo
{
    [Key]
    [StringLength(40)]
    [Unicode(false)]
    public string? IdVeiculos { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? Marca { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Modelo { get; set; }

    public int? Ano { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Preco { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Cor { get; set; }

    public int? Quilometragem { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Combustivel { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Cambio { get; set; }

    public int? NumeroPortas { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Potencia { get; set; }

    public int? CapacidadePassageiros { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string? Descricao { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Imagem { get; set; }

    [StringLength(40)]
    [Unicode(false)]
    public string? IdGenero { get; set; }

    [ForeignKey("IdGenero")]
    [InverseProperty("Veiculos")]
    [JsonIgnore]
    public virtual Genero? IdGeneroNavigation { get; set; }
}
