using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace FilmesMoura.WebAPI.DTO;

public class LoginDTO
{
    [Required(ErrorMessage = "O Email do usuario é obrigatorio!")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "O Senha do usuario é obrigatorio!")]
    public string? Senha { get; set; }
}
