using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.Models
{
    public class ReturnValue<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? Object { get; set; }
    }
}
