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
    public string? Imagem { get; set; }

    [StringLength(40)]
    [Unicode(false)]
    public string? IdGenero { get; set; }

    [ForeignKey("IdGenero")]
    [InverseProperty("Veiculos")]
    [JsonIgnore]
    public virtual Genero? IdGeneroNavigation { get; set; }
}
