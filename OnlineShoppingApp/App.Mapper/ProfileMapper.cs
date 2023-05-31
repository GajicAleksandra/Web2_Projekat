using App.UserService.Models.DTOs;
using App.UserService.Models.Models;
using AutoMapper;

namespace App.Mapper
{
    public class ProfileMapper : Profile
    {
        public ProfileMapper() 
        {
            CreateMap<User, UserDto>().ReverseMap();
        }
    }
}