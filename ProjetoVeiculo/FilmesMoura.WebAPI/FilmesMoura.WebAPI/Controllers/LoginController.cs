using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FilmesMoura.WebAPI.Interfaces;
using FilmesMoura.WebAPI.DTO;
using FilmesMoura.WebAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace FilmesMoura.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;
    public LoginController(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    [HttpPost]

    public IActionResult Login(LoginDTO loginDto)
    {
        try
        {
            Usuario usuarioBuscado = _usuarioRepository.BuscarPorEmailESenha(loginDto.Email!, loginDto.Senha);

            if (usuarioBuscado == null)
            {
                return NotFound("Email ou senha inválidos.");
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, usuarioBuscado.IdUsuario),

                new Claim(JwtRegisteredClaimNames.Email, usuarioBuscado.Email),

            };

            var key = new SymmetricSecurityKey
                (System.Text.Encoding.UTF8.GetBytes("filmes-chave-autenticacao-webapi-dev"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "api_filmes",
                audience: "api_filmes",
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });

        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

}
