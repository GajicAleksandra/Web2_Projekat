using App.Common.Models;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services.Interfaces
{
    public interface IOrderService
    {
        Task<ReturnValue<string>> MakeOrder(OrderDto orderDto, string email);
        Task<ReturnValue<List<OrderVM>>> GetOrders(string role);

    }
}
