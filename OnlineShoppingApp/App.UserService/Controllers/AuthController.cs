using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.UserService.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<string>> Register(UserDto user)
        {
            ReturnValue<string> returnValue = await _authService.Register(user);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Route("login")]
        [HttpPost]
        public ActionResult<string> Login(LoginDto loginDto)
        {
            ReturnValue<string> returnValue = _authService.Login(loginDto);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }
    }
}
