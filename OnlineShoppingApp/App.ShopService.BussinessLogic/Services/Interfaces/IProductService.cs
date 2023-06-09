using App.Common.Models;
using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services.Interfaces
{
    public interface IProductService
    {
        Task<ReturnValue<string>> AddProduct(ProductDto productDto, string email);
        ReturnValue<List<ProductDto>> GetProducts();
        Task<ReturnValue<List<ProductDto>>> GetProducts(string email);
        ReturnValue<ProductDto> GetProduct(int id);
        Task<ReturnValue<string>> UpdateProduct(ProductDto productDto);
        ReturnValue<string> DeleteProduct(int id);
        Task<ReturnValue<bool>> CheckSalesman(string email, int productId);
    }
}
