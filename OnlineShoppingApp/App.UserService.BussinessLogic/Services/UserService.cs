using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.BussinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public ReturnValue<LoggedInDto> GetLoggedInUser(string email)
        {
            ReturnValue<LoggedInDto> returnValue = new ReturnValue<LoggedInDto>();

            LoggedInDto loggedInUser = _userRepository.FindUser<LoggedInDto>(email);

            if (loggedInUser == null)
            {
                returnValue.Success = false;
                returnValue.Message = $"Korisnik {email} ne postoji.";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = loggedInUser;

            return returnValue;
        }

        public ReturnValue<LoggedInDto> UpdateUserData(LoggedInDto loggedInDto)
        {
            //validacija
            ReturnValue<LoggedInDto> returnValue = new ReturnValue<LoggedInDto>();

            LoggedInDto editedUser = _userRepository.UpdateUser(loggedInDto);
            if (editedUser == null)
            {
                returnValue.Success = false;
                returnValue.Message = $"Korisnik {loggedInDto.Email} ne postoji";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = editedUser;

            return returnValue;
        }

        public ReturnValue<List<LoggedInDto>> GetSalesmen()
        {
            ReturnValue<List<LoggedInDto>> returnValue = new ReturnValue<List<LoggedInDto>>();
            List<LoggedInDto> salesmen = _userRepository.GetAllSalesmen();

            if(salesmen == null || salesmen.Count == 0)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška.";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = salesmen;

            return returnValue;
        }
    }
}
