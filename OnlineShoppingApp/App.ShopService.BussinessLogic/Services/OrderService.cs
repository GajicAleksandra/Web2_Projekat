﻿using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.ViewModels;
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

            List<ProductDto> products = new List<ProductDto>();

            foreach(OrderItemDto orderItem in orderDto.OrderItems)
            {
                ProductDto product = _productRepository.GetProduct(orderItem.ProductId);

                if(product == null) 
                {
                    returnValue.Success = false;
                    returnValue.Message = $"Traženi proizvod ne postoji.";
                    returnValue.Object = string.Empty;

                    return returnValue;
                }

                if(product.Quantity < orderItem.Quantity)
                {
                    returnValue.Success = false;
                    returnValue.Message = $"Nema dovoljno proizvoda {product.Name} na stanju.";
                    returnValue.Object = string.Empty;

                    return returnValue;
                }

                product.Quantity -= orderItem.Quantity;
                products.Add(product);
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

            foreach(ProductDto p in products)
            {
                _productRepository.UpdateProduct(p);
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = $"Uspešno ste poručili proizvode. Očekivano vreme dostave je {orderDto.TimeOfDelivery}.";

            return returnValue;
        }

        public async Task<ReturnValue<List<OrderVM>>> GetOrders(string role)
        {
            ReturnValue<List<OrderVM>> returnValue = new ReturnValue<List<OrderVM>>();

            if(role == "0")
            {
                //admin
                returnValue.Success = true;
                returnValue.Message = string.Empty;
                returnValue.Object = OrdersForAdmin();
            }
            else if(role == "1")
            {
                //kupac
                returnValue.Success = true;
                returnValue.Message = string.Empty;
                returnValue.Object = OrdersForCustomer();
            }
            else
            {
                //prodavac
                returnValue.Success = true;
                returnValue.Message = string.Empty;
                returnValue.Object = OrdersForSalesman();
            }



            return returnValue;
        } 

        private List<OrderVM> OrdersForAdmin()
        {
            List<OrderVM> orders = new List<OrderVM>();
            List<OrderDto> ordersDto = _orderRepository.GetAll();

            foreach(OrderDto orderDto in ordersDto)
            {
                OrderVM orderVM = new OrderVM()
                {
                    Id = orderDto.Id,
                    Name = orderDto.Name,
                    LastName = orderDto.LastName,
                    Address = orderDto.Address,
                    TimeOfMakingOrder = orderDto.TimeOfMakingOrder,
                    TimeOfDelivery = orderDto.TimeOfDelivery,
                    OrderStatus = orderDto.OrderStatus,
                    TotalAmount = orderDto.TotalAmount,
                    OrderItems = new List<OrderItemVM>()
                };

                foreach (OrderItemDto orderItemDto in orderDto.OrderItems)
                {
                    ProductDto productDto = _productRepository.GetProduct(orderItemDto.ProductId);
                    OrderItemVM orderItemVM = new OrderItemVM()
                    {
                        Product = productDto,
                        Quantity = orderItemDto.Quantity,
                    };

                    orderVM.OrderItems.Add(orderItemVM);
                }

                orders.Add(orderVM);
            }

            return orders;
        }

        private List<OrderVM> OrdersForSalesman()
        {
            List<OrderVM> orders = new List<OrderVM>();

            return orders;
        }

        private List<OrderVM> OrdersForCustomer()
        {
            List<OrderVM> orders = new List<OrderVM>();

            return orders;
        }

        private bool ValidateOrder(OrderDto orderDto, out string message)
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
