using App.UserService.DataAccess.Data;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.Models.DTOs;
using App.UserService.Models.Enums;
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

        public List<LoggedInDto> GetAllSalesmen(SalesmanStatus status)
        {
            List<User> salesmen = _db.Users.Where(u => u.UserType == UserType.Salesman && u.Status == status).ToList();
            return _mapper.Map<List<LoggedInDto>>(salesmen) ?? new List<LoggedInDto>();
        }

        public bool ChangeSalesmanStatus(string email, string action)
        {
            User salesman = _db.Users.Where(u => u.Email == email).FirstOrDefault();
            if(salesman == null) 
            { 
                return false; 
            }

            if (action == "accept")
                salesman.Status = SalesmanStatus.Accepted;
            else if(action == "reject")
                salesman.Status = SalesmanStatus.Rejected;

            _db.Users.Update(salesman);
            _db.SaveChanges();

            return true;
        }

        public SalesmanStatus GetSalesmanStatus(string email)
        {
            User userFormDb = _db.Users.Where(u => u.Email == email).FirstOrDefault();
            return (SalesmanStatus)userFormDb.Status;
        }

        public int GetUserId(string email)
        {
            User user = _db.Users.FirstOrDefault(u => u.Email == email);

            if(user == null)
            {
                return -1;
            }

            return user.Id;
        }
    }
}
