using App.UserService.Models.DTOs;
using App.UserService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.UserService.Models.Enums;

namespace App.UserService.BussinessLogic.Services.Interface
{
    public interface IUserService
    {
        ReturnValue<LoggedInDto> GetLoggedInUser(string email);
        ReturnValue<LoggedInDto> UpdateUserData(LoggedInDto loggedInDto);
        ReturnValue<List<LoggedInDto>> GetSalesmen(SalesmanStatus status);
        ReturnValue<string> AcceptSalesman(string salesman, string action);
        ReturnValue<SalesmanStatus> GetSalesmanStatus(string email);
        ReturnValue<int> GetUserId(string email);
    }
}
