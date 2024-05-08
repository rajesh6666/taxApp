using System.ComponentModel.DataAnnotations;

namespace BankTaxApi.Models
{
    public class BankAccount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Balance { get; set; }
    }
}