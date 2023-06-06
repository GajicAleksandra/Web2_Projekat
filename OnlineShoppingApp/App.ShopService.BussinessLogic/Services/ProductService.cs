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
                returnValue.Object = "Popunite obavezna polja.";

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

            productDto.Image = ""; //await UploadImage(productDto.Image) ?? string.Empty;

            returnValue.Success = true;
            returnValue.Message = "";
            returnValue.Object = "Uspešno dodat proizvod.";

            _productRepository.AddProduct(productDto);

            return returnValue;
        }

        private bool ValidateProduct(ProductDto productDto, out string message)
        {
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
