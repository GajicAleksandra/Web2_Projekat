using App.ShopService.BussinessLogic.Services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.ShopService.BussinessLogic.Services
{
    public class CommunicationService : ICommunicationService
    {
        public async Task<int> GetUserId(string email)
        {
            int id = -1;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://localhost:7059/api/communication/");
                var response = await client.GetAsync($"getuserid/{email}");

                if (response.IsSuccessStatusCode)
                {
                    string stringResult = await response.Content.ReadAsStringAsync();
                    id = JsonConvert.DeserializeObject<int>(stringResult);
                }
            }
            return id;
        }
    }
}
