using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }
    }
}
