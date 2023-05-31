﻿using App.UserService.DataAccess.Data;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.Models.DTOs;
using App.UserService.Models.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.DataAccess.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IMapper _mapper;
        private readonly UserDbContext _db;

        public UserRepository(IMapper mapper, UserDbContext db)
        {
            _mapper = mapper;
            _db = db;
        }

        public void AddUser(UserDto userDto)
        {
            User user = _mapper.Map<User>(userDto);
            _db.Users.Add(user);
            _db.SaveChanges();
        }

        public bool CheckIfUserExists(string email)
        {
            User userFromDb = _db.Users.Where(u => u.Email == email).FirstOrDefault();
            return userFromDb == null ? false : true;
        }

        public T FindUser<T>(string email)
        {
            User userFromDb = _db.Users.Where(u => u.Email == email).FirstOrDefault();
            return _mapper.Map<T>(userFromDb);
        }

        public LoggedInDto UpdateUser(LoggedInDto loggedInDto)
        {
            User userFromDb = _db.Users.Where(u => u.Email == loggedInDto.Email).FirstOrDefault();

            if(userFromDb == null)
            {
                return null;
            }

            userFromDb.Username = loggedInDto.Username;
            userFromDb.Name = loggedInDto.Name;
            userFromDb.LastName = loggedInDto.LastName;
            userFromDb.Address = loggedInDto.Address;
            userFromDb.BirthDate = loggedInDto.BirthDate;

            _db.Users.Update(userFromDb);
            _db.SaveChanges();

            return loggedInDto;
        }
    }
}
