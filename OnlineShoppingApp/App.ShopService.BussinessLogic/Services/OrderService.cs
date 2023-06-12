using App.Common.Models;
using App.ShopService.BussinessLogic.Services.Interfaces;
using App.ShopService.DataAccess.Repository.Interface;
using App.ShopService.Models.DTOs;
using App.ShopService.Models.Enums;
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
         
        public async Task<ReturnValue<string>> MakeOrder(OrderVM orderDto, string email)
        {
            Thread.Sleep(4000);
            ReturnValue<string> returnValue = new ReturnValue<string>();

            if(!ValidateOrder(orderDto, out string message))
            {
                returnValue.Success = false;
                returnValue.Message = message;
                returnValue.Object = string.Empty;

                return returnValue;
            }

            List<ProductDto> products = new List<ProductDto>();
            List<int> salesmanIds = new List<int>();

            List<OrderItemDto> items = new List<OrderItemDto>();

            foreach(OrderItemVM orderItem in orderDto.OrderItems)
            {
                ProductDto product = _productRepository.GetProduct(orderItem.Product.Id);

                if (product == null)
                {
                    returnValue.Success = false;
                    returnValue.Message = $"Proizvoda {orderItem.Product.Name} nema više na stanju.";
                    returnValue.Object = string.Empty;

                    return returnValue;
                }

                if (!salesmanIds.Contains(product.SalesmanId))
                    salesmanIds.Add(product.SalesmanId);

                if(product.Price != orderItem.Product.Price)
                {
                    returnValue.Success = false;
                    returnValue.Message = $"Cena proizvoda {orderItem.Product.Name} je izmenjena. Nova cena je {product.Price} RSD.";
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

                OrderItemDto orderItemDto = new OrderItemDto()
                {
                    ProductId = orderItem.Product.Id,
                    Quantity = orderItem.Quantity,
                };

                items.Add(orderItemDto);
            }

            int customerId = await _communicationService.GetUserId(email);
            if (customerId == -1)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            Random random = new Random();

            OrderDto order = new OrderDto()
            {
                Id = orderDto.Id,
                Name = orderDto.Name,
                LastName = orderDto.LastName,
                Address = orderDto.Address,
                TimeOfDelivery = DateTime.Now.AddHours(1).AddHours(random.Next(1, 25)),
                TimeOfMakingOrder = DateTime.Now,
                CustomerId = customerId,
                TotalAmount = orderDto.TotalAmount + (salesmanIds.Count * 200),
                Comment = orderDto.Comment,
                OrderStatus = OrderStatus.Pending,
                OrderItems = items
            };

            _orderRepository.AddOrder(order);

            foreach(ProductDto p in products)
            {
                _productRepository.UpdateProduct(p);
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            DateTime date = order.TimeOfDelivery;
            returnValue.Object = $"Uspešno ste poručili proizvode. Očekivano vreme dostave je {date.Day}.{date.Month}.{date.Year}. {date.Hour}h.";

            return returnValue;
        }

        public ReturnValue<List<OrderVM>> GetAdminOrders()
        {
            ReturnValue<List<OrderVM>> returnValue = new ReturnValue<List<OrderVM>>();

            List<OrderDto> ordersDto = _orderRepository.GetAll();

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = ConvertInOrderVM(ordersDto);

            return returnValue;
        }

        public async Task<ReturnValue<List<OrderVM>>> GetSalesmanOrders(string type, string email)
        {
            ReturnValue<List<OrderVM>> returnValue = new ReturnValue<List<OrderVM>>();

            int salesmanId = await _communicationService.GetUserId(email);
            if (salesmanId == -1)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = null;

                return returnValue;
            }

            List<OrderDto> ordersDto = _orderRepository.GetAll();
            List<OrderVM> orders = ConvertInOrderVM(ordersDto);
            List<OrderVM> salesmanOrders = new List<OrderVM>();

            foreach(OrderVM order in orders)
            {
                try
                {
                    List<OrderItemVM> items = order.OrderItems.FindAll(i => i.Product.SalesmanId == salesmanId);

                    if(items == null || items.Count == 0)
                    {
                        continue;
                    }

                    OrderVM o = new OrderVM()
                    {
                        Id = order.Id,
                        Name = order.Name,
                        LastName = order.LastName,
                        TimeOfMakingOrder = order.TimeOfMakingOrder,
                        Address = order.Address,
                        TimeOfDelivery = order.TimeOfDelivery,
                        OrderStatus = order.OrderStatus,
                        TotalAmount = order.TotalAmount,
                        OrderItems = items,
                        Comment = order.Comment,
                    };

                    salesmanOrders.Add(o);
                }
                catch(Exception ex)
                {
                    continue;
                }
            }

            if(salesmanOrders.Count == 0)
            {
                returnValue.Success = false;
                returnValue.Message = "Nemate nijednu porudžbinu.";
                returnValue.Object = null;

                return returnValue;
            }

            if(type == "new")
            {
                salesmanOrders = salesmanOrders.Where(o => o.TimeOfDelivery > DateTime.Now && o.OrderStatus != "otkazano").ToList();
            }
            else if(type == "previous")
            {
                salesmanOrders = salesmanOrders.Where(o => o.TimeOfDelivery < DateTime.Now && o.OrderStatus != "otkazano").ToList();
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = salesmanOrders;

            return returnValue;
        }

        public async Task<ReturnValue<List<OrderVM>>> GetCustomerOrders(string type, string email)
        {
            ReturnValue<List<OrderVM>> returnValue = new ReturnValue<List<OrderVM>>();

            int customerId = await _communicationService.GetUserId(email);
            if (customerId == -1)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = null;

                return returnValue;
            }

            List<OrderDto> ordersDto = _orderRepository.GetAll(customerId);

            if (ordersDto == null || ordersDto.Count == 0)
            {
                returnValue.Success = false;
                returnValue.Message = "Nemate nijednu porudžbinu.";
                returnValue.Object = null;

                return returnValue;
            }

            if (type == "new")
            {
                ordersDto = ordersDto.Where(o => o.TimeOfDelivery > DateTime.Now && o.OrderStatus != OrderStatus.Canceled).ToList();
            }
            else if(type == "previous")
            {
                ordersDto = ordersDto.Where(o => o.TimeOfDelivery < DateTime.Now && o.OrderStatus != OrderStatus.Canceled).ToList();
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = ConvertInOrderVM(ordersDto);

            return returnValue;
        }

        public async Task<ReturnValue<string>> CancelOrder(int orderId, string email)
        {
            ReturnValue<string> returnValue = new ReturnValue<string>();

            int customerId = await _communicationService.GetUserId(email);
            if (customerId == -1)
            {
                returnValue.Success = false;
                returnValue.Message = "Desila se greška, pokušajte ponovo.";
                returnValue.Object = null;

                return returnValue;
            }

            OrderDto orderDto = _orderRepository.GetOrder(orderId);

            if(orderDto == null)
            {
                returnValue.Success = false;
                returnValue.Message = "Porudžbina ne postoji.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            if(orderDto.CustomerId != customerId)
            {
                returnValue.Success = false;
                returnValue.Message = "Možete da otkažete samo svoje porudžbine.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            if(orderDto.TimeOfMakingOrder.Value.AddHours(1) < DateTime.Now) 
            {
                returnValue.Success = false;
                returnValue.Message = "Ne možete otkazati porudžbinu, prošlo je sat vremena od poručivanja.";
                returnValue.Object = string.Empty;

                return returnValue;
            }

            orderDto.OrderStatus = OrderStatus.Canceled;
            _orderRepository.UpdateOrder(orderDto);

            foreach(OrderItemDto item in orderDto.OrderItems)
            {
                 _productRepository.UpdateProducts(item);
            }

            returnValue.Success = true;
            returnValue.Message = string.Empty;
            returnValue.Object = $"Porudžbina #{orderDto.Id} je uspešno otkazana.";

            return returnValue;
        }

        private List<OrderVM> ConvertInOrderVM(List<OrderDto> ordersDto)
        {
            List<OrderVM> orders = new List<OrderVM>();
            foreach (OrderDto orderDto in ordersDto)
            {
                OrderVM orderVM = new OrderVM()
                {
                    Id = orderDto.Id,
                    Name = orderDto.Name,
                    LastName = orderDto.LastName,
                    Address = orderDto.Address,
                    TimeOfMakingOrder = orderDto.TimeOfMakingOrder,
                    TimeOfDelivery = orderDto.TimeOfDelivery,
                    TotalAmount = orderDto.TotalAmount,
                    OrderItems = new List<OrderItemVM>(),
                    Comment = orderDto.Comment,
                };

                if (orderDto.OrderStatus == OrderStatus.Canceled)
                {
                    orderVM.OrderStatus = "otkazano";
                }

                if (orderDto.TimeOfDelivery < DateTime.Now)
                {
                    if (orderDto.OrderStatus != OrderStatus.Canceled)
                    {
                        orderVM.OrderStatus = "isporuceno";
                    }
                }
                else
                {
                    if (orderDto.OrderStatus != OrderStatus.Canceled)
                    {
                        orderVM.OrderStatus = "u toku";
                    }
                }

                foreach (OrderItemDto orderItemDto in orderDto.OrderItems)
                {
                    ProductDto productDto = _productRepository.GetProduct(orderItemDto.ProductId);
                    if (productDto == null)
                        continue;
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

        private bool ValidateOrder(OrderVM orderDto, out string message)
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

            foreach(OrderItemVM orderItem in orderDto.OrderItems)
            {
                if(orderItem.Quantity <= 0)
                {
                    message = "Količina proizvoda ne može biti negativan broj.";
                    return false;
                }
            }

            message = string.Empty;
            return true;
        }
    }
}
