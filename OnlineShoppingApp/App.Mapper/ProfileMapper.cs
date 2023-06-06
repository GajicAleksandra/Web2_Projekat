using App.ShopService.Models.DTOs;
using App.ShopService.Models.Models;
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
            CreateMap<User, LoggedInDto>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();
        }
    }
}