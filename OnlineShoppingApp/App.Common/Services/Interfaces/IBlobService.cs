using App.Common.Models;

namespace App.Common.Services.Interfaces
{
    public interface IBlobService
    {
        Task<ReturnValue<string>> UploadImage(string image64, string imageName);
    }
}
