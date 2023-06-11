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

        public List<OrderDto> GetAll(int userId)
        {
            return _mapper.Map<List<OrderDto>>(_db.Orders.Where(o => o.CustomerId == userId).Include(o => o.OrderItems).ToList());
        }

        public OrderDto GetOrder(int orderId)
        {
            Order order = _db.Orders.Where(o => o.Id == orderId).Include(o => o.OrderItems).FirstOrDefault();
            if(order == null)
            {
                return null;
            }

            return _mapper.Map<OrderDto>(order);
        }

        public void UpdateOrder(OrderDto orderDto)
        {
            Order order = _db.Orders.FirstOrDefault(o => o.Id == orderDto.Id);
            order.OrderStatus = orderDto.OrderStatus;
            _db.Orders.Update(order);
            _db.SaveChanges();
        }
    }
}
