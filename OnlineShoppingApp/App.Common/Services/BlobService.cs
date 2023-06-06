using App.Common.Models;
using App.Common.Services.Interfaces;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Text.Json;

namespace App.Common.Services
{
    public class BlobService : IBlobService
    {
        private readonly string _containerName = "aleksandra";
        private readonly string _storage = @"AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;";

        public BlobService()
        {
        }

        public async Task<ReturnValue<string>> UploadImage(string image64, string imageName)
        {
            try
            {
                CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storage);
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_containerName);
                string fileName = imageName;

                if (image64.Contains("base64"))
                {
                    image64 = image64.Split(new string[] { "base64," }, StringSplitOptions.None)[1];
                }

                byte[] bytes = System.Convert.FromBase64String(image64);
                var bytesCount = bytes.Length;
                if (fileName != null && bytes != null)
                {
                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
                    await cloudBlockBlob.UploadFromByteArrayAsync(bytes, 0, bytesCount);
                    return new ReturnValue<string>(true, cloudBlockBlob.Uri.AbsoluteUri);
                }
            }
            catch (Exception ex)
            {
                return new ReturnValue<string>(false, JsonSerializer.Serialize(ex));
            }

            return new ReturnValue<string>(false, "");
        }
    }
}
