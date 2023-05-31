using App.ShopService.DataAccess.Data;
using App.ShopService.DataAccess.Repository.Interface;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.DataAccess.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IMapper _mapper;
        private readonly ShopDbContext _db;

        public OrderRepository(IMapper mapper, ShopDbContext db)
        {
            _mapper = mapper;
            _db = db;
        }
    }
}
