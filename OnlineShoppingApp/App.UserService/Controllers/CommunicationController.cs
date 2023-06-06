using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.UserService.Controllers
{
    [Route("api/communication")]
    [ApiController]
    public class CommunicationController : ControllerBase
    {
        private readonly IUserService _userService;
        public CommunicationController(IUserService userService) 
        {
            _userService = userService;
        }

        [Route("getuserid/{email}")]
        [HttpGet]
        public IActionResult GetUserId(string email)
        {
            ReturnValue<int> returnValue = _userService.GetUserId(email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

    }
}
