using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
using App.UserService.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.DataAccess.Repository.Interface
{
    public interface IUserRepository
    {
        void AddUser(UserDto userDto);
        bool CheckIfUserExists(string email);
        T FindUser<T>(string email);
        LoggedInDto UpdateUser(LoggedInDto loggedInDto);
        bool UpdatePassword(string email, string password);
        List<LoggedInDto> GetAllSalesmen(SalesmanStatus status);
        bool ChangeSalesmanStatus(string action, string email);
        SalesmanStatus GetSalesmanStatus(string email);
        int GetUserId(string email);
    }
}
