using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace FilmesMoura.WebAPI.Models;

[Table("Filme")]
public partial class Filme
{
    [Key]
    [StringLength(40)]
    [Unicode(false)]
    public string? IdFilme { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Titulo { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? Imagem { get; set; }

    [StringLength(40)]
    [Unicode(false)]
    public string? IdGenero { get; set; }

    [ForeignKey("IdGenero")]
    [InverseProperty("Filmes")]
    [JsonIgnore]
    public virtual Genero? IdGeneroNavigation { get; set; }
}
