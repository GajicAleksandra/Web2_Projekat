using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;

namespace App.ShopService.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        public OrderController(IOrderService orderService, IProductService productService)
        {
            _orderService = orderService;
            _productService = productService;
        }

        [Authorize(Roles = "1")]
        [Route("add")]
        [HttpPost]
        public async Task<IActionResult> AddOrder(OrderDto orderDto)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("Desila se greška, pokušajte ponovo.");
            }

            ReturnValue<string> returnValue = await _orderService.MakeOrder(orderDto, email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "0")]
        [Route("getall")]
        [HttpGet]
        public IActionResult GetAll()
        {
            string role = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            
            if (string.IsNullOrEmpty(role) || string.IsNullOrEmpty(email))
            {
                return NotFound("Desila se greška, pokušajte ponovo.");
            }

            ReturnValue<List<OrderVM>> returnValue = _orderService.GetAdminOrders();

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "2")]
        [Route("getsalesmanorders/{type}")]
        [HttpGet]
        public async Task<IActionResult> GetSalesmanOrders(string type)
        {
            return Ok();
        }

        [Authorize(Roles = "1")]
        [Route("getcustomerorders/{type}")]
        [HttpGet]
        public async Task<IActionResult> GetCustomerOrders(string type)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("Desila se greška, pokušajte ponovo.");
            }

            ReturnValue<List<OrderVM>> returnValue = await _orderService.GetCustomerOrders(type, email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }

        [Authorize(Roles = "1")]
        [Route("cancelorder/{id}")]
        [HttpGet]
        public async Task<IActionResult> CancelOrder(int id)
        {
            string email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("Desila se greška, pokušajte ponovo.");
            }

            ReturnValue<string> returnValue = await _orderService.CancelOrder(id, email);

            if (!returnValue.Success)
            {
                return BadRequest(returnValue.Message);
            }

            return Ok(returnValue.Object);
        }
    }
}
