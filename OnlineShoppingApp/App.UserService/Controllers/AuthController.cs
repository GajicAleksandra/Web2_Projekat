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
        public ActionResult<string> Register(UserDto user)
        {
            ReturnValue<string> returnValue = _authService.Register(user);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Route("say-hello")]
        [HttpPost]
        public async Task<ActionResult<string>> SayHello(string image64)
        {
            string retVal = await _authService.SayHello(image64);
            return Ok(retVal);
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
