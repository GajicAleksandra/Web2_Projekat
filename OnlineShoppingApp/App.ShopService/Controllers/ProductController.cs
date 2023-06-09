using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public ActionResult GetProducts()
        {
            return Ok(_productService.GetProducts().Object);
        }

        [Authorize]
        [Route("get/{id}")]
        [HttpGet]
        public ActionResult GetProduct(int id)
        {
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
            ReturnValue<string> returnValue = await _productService.UpdateProduct(productDto);

            if(!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "2")]
        [Route("delete/{id}")]
        [HttpDelete]
        public ActionResult DeleteProduct(int id)
        {
            ReturnValue<string> returnValue = _productService.DeleteProduct(id);

            if (!returnValue.Success)
            {
                return NotFound(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }
    }
}
