using App.Common.Services.Interfaces;
using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
using App.UserService.Models.Models;
using Newtonsoft.Json.Linq;
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
        private readonly IBlobService _blobService;

        public UserService(IUserRepository userRepository, IBlobService blobService)
        {
            _userRepository = userRepository;
            _blobService = blobService;
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

        public async Task<ReturnValue<LoggedInDto>> UpdateUserData(LoggedInDto loggedInDto)
        {
            ReturnValue<LoggedInDto> returnValue = new ReturnValue<LoggedInDto>();

            if(!ValidateEditData(loggedInDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = null;
            }

            if (!string.IsNullOrEmpty(loggedInDto.Image))
            {
                loggedInDto.Image = await UploadImage(loggedInDto.Image) ?? string.Empty;
            }

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

        public ReturnValue<string> UpdatePassword(ChangePasswordDto passwordDto, string email)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidatePassword(passwordDto, email, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = ""; 
                
                return returnValue;
            }

            _userRepository.UpdatePassword(email, BCrypt.Net.BCrypt.HashPassword(passwordDto.CpNewPassword));

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = "Uspešno ste promenili lozinku.";

            return returnValue;
        }

        public ReturnValue<List<LoggedInDto>> GetSalesmen(SalesmanStatus status)
        {
            ReturnValue<List<LoggedInDto>> returnValue = new ReturnValue<List<LoggedInDto>>();
            List<LoggedInDto> salesmen = _userRepository.GetAllSalesmen(status);

            if(salesmen == null || salesmen.Count == 0)
            {
                returnValue.Success = false;
                returnValue.Message = "Ne postoje prodavci koji čekaju verifikaciju.";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = salesmen;

            return returnValue;
        }

        public ReturnValue<string> AcceptSalesman(string salesman, string action)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();
            if (!_userRepository.ChangeSalesmanStatus(salesman, action))
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška. Pokušajte ponovo.";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = "";

            if(action == "accept")
                returnValue.Object = $"Uspešno ste verifikovali prodavca {salesman}.";
            else if(action == "reject")
                returnValue.Object = $"Uspešno ste odbili prodavca {salesman}.";

            return returnValue;
        }

        public ReturnValue<SalesmanStatus> GetSalesmanStatus(string email)
        {
            ReturnValue<SalesmanStatus> returnValue = new ReturnValue<SalesmanStatus>();
            SalesmanStatus status = _userRepository.GetSalesmanStatus(email);

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = status;
            
            return returnValue;
        }

        public ReturnValue<int> GetUserId(string email)
        {
            ReturnValue<int> returnValue = new ReturnValue<int>();

            int id = _userRepository.GetUserId(email);

            if(id == -1)
            {
                returnValue.Success = false;
                returnValue.Message = $"Korisnik {email} ne postoji.";
                returnValue.Object = -1;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = id;

            return returnValue;
        }

        private bool ValidateEditData(LoggedInDto userDto, out string message)
        {
            if (string.IsNullOrEmpty(userDto.Username) ||
               string.IsNullOrEmpty(userDto.Email) ||
               string.IsNullOrEmpty(userDto.Name) ||
               string.IsNullOrEmpty(userDto.LastName) ||
               string.IsNullOrEmpty(userDto.Address) ||
               string.IsNullOrEmpty(userDto.BirthDate.ToString()))
            {
                message = "Popunite sva obavezna polja.";
                return false;
            }

            message = string.Empty;
            return true;
        }

        private bool ValidatePassword(ChangePasswordDto passwordDto, string email, out string message)
        {
            if (string.IsNullOrEmpty(passwordDto.CpPassword) ||
               string.IsNullOrEmpty(passwordDto.CpNewPassword) ||
               string.IsNullOrEmpty(passwordDto.CpConfirmPassword))
            {
                message = "Popunite sva obavezna polja.";
                return false;
            }

            if(passwordDto.CpNewPassword != passwordDto.CpConfirmPassword)
            {
                message = "Lozinke se ne poklapaju.";
                return false;
            }

            UserDto userFromDb = _userRepository.FindUser<UserDto>(email);

            if (!BCrypt.Net.BCrypt.Verify(passwordDto.CpPassword, userFromDb.Password))
            {
                message = "Neispravna trenutna lozinka.";
                return false;
            }

            message = string.Empty;
            return true;
        }

        private async Task<string> UploadImage(string image64)
        {
            Guid g = Guid.NewGuid();
            string guidString = Convert.ToBase64String(g.ToByteArray());
            guidString = guidString.Replace("=", "");
            guidString = guidString.Replace("+", "");
            var response = await _blobService.UploadImage(image64, guidString);

            return response.Message;

        }
    }
}
