using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICommunicationService _communicationService;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, ICommunicationService communicationService, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _communicationService = communicationService;
            _productRepository = productRepository;
        }
         
        public async Task<ReturnValue<string>> MakeOrder(OrderDto orderDto, string email)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidateOrder(orderDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = string.Empty;

                return returnValue;
            }

            foreach(OrderItemDto orderItem in orderDto.OrderItems)
            {
                ProductDto product = _productRepository.GetProduct(orderItem.ProductId);
                orderDto.TotalAmount += orderItem.Quantity * product.Price;
            }

            int customerId = await _communicationService.GetUserId(email);
            if (customerId == -1)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            orderDto.CustomerId = customerId;
            orderDto.TimeOfMakingOrder = DateTime.Now;
            orderDto.TotalAmount = orderDto.TotalAmount + 200; //dostava

            Random random = new Random();
            orderDto.TimeOfDelivery = DateTime.Now.AddHours(1).AddHours(random.Next(1, 73));

            _orderRepository.AddOrder(orderDto);

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = $"Uspešno ste poručili proizvode. Očekivano vreme dostave je {orderDto.TimeOfDelivery}.";

            return returnValue;
        }

        public bool ValidateOrder(OrderDto orderDto, out string message)
        {
            if(string.IsNullOrEmpty(orderDto.Name) || 
                string.IsNullOrEmpty(orderDto.LastName) ||
                string.IsNullOrEmpty(orderDto.Address))
            {
                message = "Popunite obavezna polja.";
                return false;
            }

            if(orderDto.OrderItems == null || orderDto.OrderItems.Count == 0)
            {
                message = "Niste izabrali nijedan proizvod.";
                return false;
            }

            message = string.Empty;
            return true;
        }
    }
}
