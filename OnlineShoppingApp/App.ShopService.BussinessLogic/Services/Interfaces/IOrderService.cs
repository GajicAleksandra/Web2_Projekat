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
        Task<ReturnValue<string>> MakeOrder(OrderVM orderDto, string email);
        ReturnValue<List<OrderVM>> GetAdminOrders();
        Task<ReturnValue<List<OrderVM>>> GetSalesmanOrders(string type, string email);
        Task<ReturnValue<List<OrderVM>>> GetCustomerOrders(string type, string email);
        Task<ReturnValue<string>> CancelOrder(int orderId, string email);
    }
}
