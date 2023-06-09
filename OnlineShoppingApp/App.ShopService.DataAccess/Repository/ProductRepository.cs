using App.ShopService.DataAccess.Data;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.DataAccess.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly IMapper _mapper;
        private readonly ShopDbContext _db;

        public ProductRepository(IMapper mapper, ShopDbContext db)
        {
            _mapper = mapper;
            _db = db;
        }

        public void AddProduct(ProductDto productDto)
        {
            Product product = _mapper.Map<Product>(productDto);
            _db.Products.Add(product);
            _db.SaveChanges();
        }

        public List<ProductDto> GetProducts()
        {
            return _mapper.Map<List<ProductDto>>(_db.Products.ToList());
        }

        public ProductDto GetProduct(int id)
        {
            Product product = _db.Products.FirstOrDefault(p => p.Id == id);
            if(product == null)
            {
                return null;
            }

            return _mapper.Map<ProductDto>(product);
        }

        public void UpdateProduct(ProductDto productDto)
        {
            Product product = _db.Products.FirstOrDefault(p => p.Id == productDto.Id);

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Quantity = productDto.Quantity;
            product.Image = productDto.Image;

            _db.Products.Update(product);
            _db.SaveChanges();
        }

        public bool DeleteProduct(int id) 
        {
            Product product = _db.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return false;

            _db.Products.Remove(product); 
            _db.SaveChanges();

            return true;
        }
    }
}
