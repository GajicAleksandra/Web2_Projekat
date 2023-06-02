using App.UserService.Models.DTOs;
using App.UserService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.BussinessLogic.Services.Interface
{
    public interface IUserService
    {
        ReturnValue<LoggedInDto> GetLoggedInUser(string email);
        ReturnValue<LoggedInDto> UpdateUserData(LoggedInDto loggedInDto);
        ReturnValue<List<LoggedInDto>> GetSalesmen();
        ReturnValue<string> AcceptSalesman(string salesman, string action);
    }
}
