using App.Common.Services;
using App.Common.Services.Interfaces;
using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.Models;
using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
using App.UserService.Models.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Mozilla;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace App.UserService.BussinessLogic.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly IBlobService _blobService;

        private string TokenSecretKey { get; set; }

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IBlobService blobService)
        {
            _userRepository = userRepository;
            _config = configuration;
            _blobService = blobService;

            TokenSecretKey = _config.GetSection("Authentication:SecretKey").Value;
        }

        public async Task<ReturnValue<string>> Register(UserDto userDto)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidateRegister(userDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = null;

                return returnValue;
            }

            if(userDto.UserType == 2)
            {
                userDto.Status = 0;
            }
            else
            {
                userDto.Status = 1;
            }

            userDto.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            if (!string.IsNullOrEmpty(userDto.Image))
            {
                userDto.Image = await UploadImage(userDto.Image) ?? string.Empty;
            }

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = "Uspešna registracija.";

            _userRepository.AddUser(userDto);

            return returnValue;
        }

        public ReturnValue<string> Login(LoginDto loginDto)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidateLogin(loginDto, out string message, out string token))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = token;

            return returnValue;
        }

        public ReturnValue<string> LoginWithGoogle(GoogleLoginDto loginDto)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            UserDto userDto = new UserDto()
            {
                Email = loginDto.Email,
                Name = loginDto.Name,
                LastName = loginDto.LastName,
                Username = loginDto.Email.Split('@')[0],
                Image = "",
                UserType = 1,
                Status = 1,
                Address = "",
            };

            if (!_userRepository.CheckIfUserExists(loginDto.Email))
            {
                _userRepository.AddUser(userDto);
            }

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = GenerateToken(userDto);

            return returnValue;
        }

        private bool ValidateRegister(UserDto userDto, out string message)
        {
            if (string.IsNullOrEmpty(userDto.Username) ||
               string.IsNullOrEmpty(userDto.Password) ||
               string.IsNullOrEmpty(userDto.ConfirmPassword) ||
               string.IsNullOrEmpty(userDto.Email) ||
               string.IsNullOrEmpty(userDto.Name) ||
               string.IsNullOrEmpty(userDto.LastName) ||
               string.IsNullOrEmpty(userDto.Address) ||
               userDto.UserType < 0)
            {
                message = "Popunite sva obavezna polja.";
                return false;
            }

            if (!userDto.Password.Equals(userDto.ConfirmPassword))
            {
                message = $"Lozinke se ne poklapaju.";
                return false;
            }

            if (_userRepository.CheckIfUserExists(userDto.Email))
            {
                message = $"Korisnik {userDto.Email} već postoji.";
                return false;
            }

            message = string.Empty;
            return true;
        }

        public bool ValidateLogin(LoginDto loginDto, out string message, out string token)
        {
            if(string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                message = $"Unesite email i lozinku.";
                token = string.Empty;
                return false;
            }

            if (!_userRepository.CheckIfUserExists(loginDto.Email))
            {
                message = $"Korisnik {loginDto.Email} ne postoji.";
                token = string.Empty;
                return false;
            }

            UserDto userFromDb = _userRepository.FindUser<UserDto>(loginDto.Email);

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, userFromDb.Password))
            {
                message = "Neispravna lozinka.";
                token = string.Empty;
                return false;
            }

            token = GenerateToken(userFromDb);

            message = string.Empty;
            return true;
        }

        private string GenerateToken(UserDto userDto)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, userDto.UserType.ToString()),
                new Claim(ClaimTypes.Email, userDto.Email),
                new Claim("Image", userDto.Image),
                new Claim("IsVerified", userDto.Status.ToString())
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TokenSecretKey));

            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:7059",
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: signinCredentials
            );
            return new JwtSecurityTokenHandler().WriteToken(tokeOptions);
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
