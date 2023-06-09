using App.Common.Models;
using App.Common.Services.Interfaces;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.Models;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IBlobService _blobService;

        public ProductService(IProductRepository productRepository, IBlobService blobService)
        {
            _productRepository = productRepository;
            _blobService = blobService;
        }

        public async Task<ReturnValue<string>> AddProduct(ProductDto productDto, string email)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if (!ValidateProduct(productDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = "";

                return returnValue;
            }

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://localhost:7059/api/communication/");
                var response = await client.GetAsync($"getuserid/{email}");

                if (response.IsSuccessStatusCode)
                {
                    string stringResult = await response.Content.ReadAsStringAsync();
                    productDto.SalesmanId = JsonConvert.DeserializeObject<int>(stringResult);
                }
                else
                {
                    returnValue.Success = false;
                    returnValue.Message = "Desila se greška, pokušajte ponovo.";
                    returnValue.Object = "";

                    return returnValue;
                }
            }

            productDto.Image = await UploadImage(productDto.Image) ?? string.Empty;

            _productRepository.AddProduct(productDto);

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = "Uspešno dodat proizvod.";

            return returnValue;
        }

        public ReturnValue<List<ProductDto>> GetProducts()
        {
            ReturnValue<List<ProductDto>> returnValue = new ReturnValue<List<ProductDto>>();

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = _productRepository.GetProducts();

            return returnValue;
        }

        public ReturnValue<ProductDto> GetProduct(int id)
        {
            ReturnValue<ProductDto> returnValue = new ReturnValue<ProductDto>();

            ProductDto product = _productRepository.GetProduct(id);

            if(product == null)
            {
                returnValue.Success = false;
                returnValue.Message = "Proizvod nije pronađen.";
                returnValue.Object = null;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = product;

            return returnValue;
        }

        public async Task<ReturnValue<string>> UpdateProduct(ProductDto productDto)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidateProduct(productDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = null;

                return returnValue;
            }

            if (!productDto.Image.Contains("http"))
            {
                productDto.Image = await UploadImage(productDto.Image) ?? string.Empty;
            }
           
            _productRepository.UpdateProduct(productDto);

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = "Uspešno ste izmenili proizvod.";

            return returnValue;
        }

        public ReturnValue<string> DeleteProduct(int id)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();
            if (!_productRepository.DeleteProduct(id))
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = "Uspešno ste obrisali proizvod.";

            return returnValue;
        }

        private bool ValidateProduct(ProductDto productDto, out string message)
        {
            if(string.IsNullOrEmpty(productDto.Name) || 
                string.IsNullOrEmpty(productDto.Description) ||
                string.IsNullOrEmpty(productDto.Image) ||
                productDto.Price == 0 || productDto.Quantity == 0)
            {
                message = "Popunite sva obavezna polja.";
                return false;
            }

            message = string.Empty;
            return true;
        }

        private async Task<string> UploadImage(string image64)
        {
            Guid g = Guid.NewGuid();
            string guidString = Convert.ToBase64String(g.ToByteArray());
            guidString = guidString.Replace("=", "");
            guidString = guidString.Replace("+", "");
            var response = await _blobService.UploadImage(image64, guidString);

            return response.Message;

        }
    }
}
