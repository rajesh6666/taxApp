namespace BankTaxApi.Models
{
    public class TransferRequest
    {
        public int SourceAccountId { get; set; }
        public int TargetAccountId { get; set; }
        public decimal Amount { get; set; }
    }
}