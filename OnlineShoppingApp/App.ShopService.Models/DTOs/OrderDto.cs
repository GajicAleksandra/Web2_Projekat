using App.ShopService.Models.Enums;
using App.ShopService.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.Models.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public double TotalAmount { get; set; }
        public DateTime? TimeOfMakingOrder { get; set; }
        public DateTime TimeOfDelivery { get; set; }
    }
}
