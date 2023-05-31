using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace App.UserService.Controllers
{
    [Authorize]
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Route("getloggedinuser")]
        [HttpGet]
        public IActionResult GetLoggedInUser()
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email))
            {
                return NotFound();
            }

            ReturnValue<LoggedInDto> returnValue = _userService.GetLoggedInUser(email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Route("changeprofile")]
        [HttpPut]
        public IActionResult ChangeProfile(LoggedInDto loggedInUser)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email) || email != loggedInUser.Email)
            {
                return BadRequest();
            }

            ReturnValue<LoggedInDto> returnValue = _userService.UpdateUserData(loggedInUser);

            if(!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "0")]
        [Route("getallsalesmen")]
        [HttpGet]
        public IActionResult GetAllSalesmen()
        {
            ReturnValue<List<LoggedInDto>> returnValue = _userService.GetSalesmen();

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }
    }
}
