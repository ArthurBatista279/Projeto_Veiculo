using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace FilmesMoura.WebAPI.Models;

[Table("Genero")]
public partial class Genero
{
    [Key]
    [StringLength(40)]
    [Unicode(false)]
    public string? IdGenero { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdGeneroNavigation")]
    [JsonIgnore]
    public virtual ICollection<Filme> Filmes { get; set; } = new List<Filme>();

    [InverseProperty("IdGeneroNavigation")]
    [JsonIgnore]
    public virtual ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
}
