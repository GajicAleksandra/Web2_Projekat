﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services.Interfaces
{
    public interface ICommunicationService
    {
        Task<int> GetUserId(string email);
    }
}
