using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
using App.UserService.Models.Models;
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
        private readonly IEmailService _emailService;

        public UserController(IUserService userService, IEmailService emailService)
        {
            _userService = userService;
            _emailService = emailService;
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
        public async Task<IActionResult> ChangeProfile(LoggedInDto loggedInUser)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email) || email != loggedInUser.Email)
            {
                return BadRequest();
            }

            ReturnValue<LoggedInDto> returnValue = await _userService.UpdateUserData(loggedInUser);

            if(!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Route("changepassword")]
        [HttpPut]
        public IActionResult ChangePassword(ChangePasswordDto passwordDto)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest();
            }

            ReturnValue<string> returnValue = _userService.UpdatePassword(passwordDto, email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "0")]
        [Route("getallsalesmen/{status}")]
        [HttpGet]
        public IActionResult GetAllSalesmen(string status)
        {
            ReturnValue<List<LoggedInDto>> returnValue = _userService.GetSalesmen((SalesmanStatus)Enum.Parse(typeof(SalesmanStatus), status));

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "0")]
        [Route("acceptorrejectsalesman")]
        [HttpPut]
        public IActionResult AcceptOrRejectSalesman(VerifySalesmanDto verifySalesmanDto)
        {
            ReturnValue<string> returnValue = _userService.AcceptSalesman(verifySalesmanDto.Email, verifySalesmanDto.Action);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            string body = "";

            if (verifySalesmanDto.Action == "accept")
            {
                body = "Vaš nalog je verifikovan. Možete se prijaviti koristeći ovaj email i svoju lozinku.";
            }
            else if (verifySalesmanDto.Action == "reject")
            {
                body = "Verifikacija vašeg naloga je odbijena.";
            }

            MailData mailData = new MailData
            {
                EmailToId = verifySalesmanDto.Email,
                EmailSubject = "Verifikacija naloga",
                EmailBody = body
            };

            bool success = _emailService.SendEmail(mailData);
            
            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "2")]
        [Route("salesmanstatus")]
        [HttpGet]
        public IActionResult GetStatus()
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest();
            }

            ReturnValue<SalesmanStatus> returnValue = _userService.GetSalesmanStatus(email);
            return Ok(returnValue.Object);
        }
    }
}
