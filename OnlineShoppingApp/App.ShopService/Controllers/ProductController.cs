using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;
using System.Security.Claims;

namespace App.ShopService.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize(Roles = "2")]
        [Route("add")]
        [HttpPost]
        public async Task<ActionResult> AddProduct(ProductDto productDto)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("Prodavac ne postoji.");
            }

            ReturnValue<string> returnValue = await _productService.AddProduct(productDto, email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize]
        [Route("getproducts")]
        [HttpGet]
        public async Task<ActionResult> GetProducts()
        {
            string role = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            if(role == "2")
            {
                string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
                
                ReturnValue<List<ProductDto>> returnValue = await _productService.GetProducts(email);

                if (!returnValue.Success)
                {
                    return BadRequest(returnValue.Message);
                }

                return Ok(returnValue.Object);
            }

            return Ok(_productService.GetProducts().Object);
        }

        [Authorize]
        [Route("get/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetProduct(int id)
        {
            string role = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            if (role == "2")
            {
                string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
                ReturnValue<bool> ret = await _productService.CheckSalesman(email, id);
                if (!ret.Success)
                {
                    return BadRequest(ret.Message);
                }
            }

            ReturnValue<ProductDto> returnValue = _productService.GetProduct(id);

            if(!returnValue.Success)
            {
                return NotFound(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "2")]
        [Route("edit")]
        [HttpPut]
        public async Task<ActionResult> EditProduct(ProductDto productDto)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            ReturnValue<bool> ret = await _productService.CheckSalesman(email, productDto.Id);
            if (!ret.Success)
            {
                return BadRequest(ret.Message);
            }

            ReturnValue<string> returnValue = await _productService.UpdateProduct(productDto);

            if(!returnValue.Success)
            {
                if(returnValue.Object == "NotFound")
                    return NotFound(returnValue.Message);
                else
                    return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "2")]
        [Route("delete/{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            ReturnValue<bool> ret = await _productService.CheckSalesman(email, id);
            if (!ret.Success)
            {
                return BadRequest(ret.Message);
            }            

            ReturnValue<string> returnValue = _productService.DeleteProduct(id);

            if (!returnValue.Success)
            {
                return NotFound(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }
    }
}
