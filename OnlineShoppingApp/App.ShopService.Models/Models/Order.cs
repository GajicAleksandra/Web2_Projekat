using App.ShopService.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.Models.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProductQuantity { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public double TotalAmount { get; set; }
        public DateTime TimeOfDelivery { get; set; }
        public OrderStatus OrderStatus { get; set; }
    }
}
