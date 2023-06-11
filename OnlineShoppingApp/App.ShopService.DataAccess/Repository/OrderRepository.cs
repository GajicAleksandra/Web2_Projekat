using App.ShopService.DataAccess.Data;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.DataAccess.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IMapper _mapper;
        private readonly ShopDbContext _db;

        public OrderRepository(IMapper mapper, ShopDbContext db)
        {
            _mapper = mapper;
            _db = db;
        }

        public void AddOrder(OrderDto orderDto)
        {
            Order order = _mapper.Map<Order>(orderDto);
            _db.Orders.Add(order);
            _db.SaveChanges();
        }

        public List<OrderDto> GetAll()
        {
            return _mapper.Map<List<OrderDto>>(_db.Orders.Include(o => o.OrderItems).ToList());
        }
    }
}
