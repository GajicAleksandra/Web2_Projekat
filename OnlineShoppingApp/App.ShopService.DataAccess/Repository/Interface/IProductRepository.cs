﻿using App.ShopService.Models.DTOs;
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
        List<ProductDto> GetProducts(int salesman);
        ProductDto GetProduct(int id);
        bool UpdateProduct(ProductDto productDto);
        bool DeleteProduct(int id);
        void UpdateProducts(OrderItemDto orderItemDto);
    }
}
