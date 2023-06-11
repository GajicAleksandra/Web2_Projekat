using App.ShopService.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.Models.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public double TotalAmount { get; set; }
        public DateTime? TimeOfMakingOrder { get; set; }
        public DateTime TimeOfDelivery { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public string? Comment { get; set; }
    }
}
