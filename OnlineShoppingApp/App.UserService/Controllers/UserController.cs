using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.UserService.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        
        [Route("index")]
        [HttpGet]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
