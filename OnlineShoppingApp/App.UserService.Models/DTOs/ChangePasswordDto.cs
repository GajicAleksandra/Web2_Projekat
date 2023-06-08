using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.Models.DTOs
{
    public class ChangePasswordDto
    {
        public string CpPassword { get; set; }
        public string CpNewPassword { get; set; }
        public string CpConfirmPassword { get; set; }
    }
}
