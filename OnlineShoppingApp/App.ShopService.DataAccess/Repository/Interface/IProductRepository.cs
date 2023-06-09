using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.DataAccess.Repository.Interface
{
    public interface IProductRepository
    {
        void AddProduct(ProductDto productDto);
        List<ProductDto> GetProducts();
        ProductDto GetProduct(int id);
        void UpdateProduct(ProductDto productDto);
    }
}
