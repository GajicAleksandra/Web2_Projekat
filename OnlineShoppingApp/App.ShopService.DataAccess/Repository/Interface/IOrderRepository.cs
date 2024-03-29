﻿using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.DataAccess.Repository.Interface
{
    public interface IOrderRepository
    {
        void AddOrder(OrderDto orderDto);
        List<OrderDto> GetAll();
        List<OrderDto> GetAll(int userId);
        OrderDto GetOrder(int orderId);
        void UpdateOrder(OrderDto orderDto);
    }
}
