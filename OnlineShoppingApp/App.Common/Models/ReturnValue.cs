namespace App.Common.Models
{
    public class ReturnValue<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? Object { get; set; }

        public ReturnValue() { }

        public ReturnValue(bool status, string message)
        {
            Success = status;
            Message = message;
        }
    }
}
