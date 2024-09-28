using ecommerce_backend.Models;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ecommerce_backend.DTOs;


[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    // POST: api/users/login
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginDto loginDto)
    {
        var user = await _userService.LoginAsync(loginDto.Name, loginDto.Password);
        if (user == null) return Unauthorized("Invalid credentials");

        return Ok(user);
    }

    // POST: api/users/register
    [HttpPost("register")]
    public async Task<ActionResult<User>> Register([FromBody] User user)
    {
        var newUser = await _userService.RegisterAsync(user);
        return CreatedAtAction(nameof(Register), newUser);
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        var users = await _userService.GetUsersAsync();
        return Ok(users);
    }
}
