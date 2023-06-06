﻿using App.UserService.Models;
using App.UserService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.BussinessLogic.Services.Interface
{
    public interface IAuthService
    {
        ReturnValue<string> Register(UserDto userDto);
        ReturnValue<string> Login(LoginDto loginDto);
        Task<string> SayHello(string image64);
    }
}
