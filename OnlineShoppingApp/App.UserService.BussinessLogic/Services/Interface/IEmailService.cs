using App.UserService.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.UserService.BussinessLogic.Services.Interface
{
    public interface IEmailService
    {
        bool SendEmail(MailData emailData);
    }
}
