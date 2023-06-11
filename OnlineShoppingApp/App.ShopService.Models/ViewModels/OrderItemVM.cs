using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.Models.ViewModels
{
    public class OrderItemVM
    {
        public ProductDto Product { get; set; }
        public int Quantity { get; set; }
    }
}
