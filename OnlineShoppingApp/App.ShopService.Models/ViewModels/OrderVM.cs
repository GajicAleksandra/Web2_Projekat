using App.ShopService.Models.DTOs;
using App.ShopService.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.Models.ViewModels
{
    public class OrderVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public List<OrderItemVM> OrderItems { get; set; }
        public string OrderStatus { get; set; }
        public double TotalAmount { get; set; }
        public DateTime? TimeOfMakingOrder { get; set; }
        public DateTime TimeOfDelivery { get; set; }
    }
}
