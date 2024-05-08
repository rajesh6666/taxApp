using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using BankTaxApi.Models;

namespace BankTaxApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BankAccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BankAccountsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<BankAccount>> GetAll() =>
            _context.BankAccounts.ToList();

        [HttpGet("{id}")]
        public ActionResult<BankAccount> GetById(int id)
        {
            var bankAccount = _context.BankAccounts.Find(id);
            if (bankAccount == null)
            {
                return NotFound();
            }
            return bankAccount;
        }

        [HttpPost("transfer")]
        public IActionResult Transfer([FromBody] TransferRequest request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate the source account id
            if (string.IsNullOrWhiteSpace(request.SourceAccountId.ToString()) || request.SourceAccountId <= 0)
            {
                return BadRequest(new { status = "error", message = "Source account id must be a valid number greater than zero." });
            }

            // Validate the target account id
            if (string.IsNullOrWhiteSpace(request.TargetAccountId.ToString()) || request.TargetAccountId <= 0)
            {
                return BadRequest(new { status = "error", message = "Target account id must be a valid number greater than zero." });
            }

            // Validate the amount
            if (string.IsNullOrWhiteSpace(request.Amount.ToString()) || request.Amount <= 0)
            {
                return BadRequest(new { status = "error", message = "Amount must be a number greater than zero." });
            }

            // Get the source and target accounts
            var sourceAccount = _context.BankAccounts.Find(request.SourceAccountId);
            var targetAccount = _context.TaxAccounts.Find(request.TargetAccountId);

            // Check if accounts exist
            if (sourceAccount == null || targetAccount == null)
            {
                return NotFound(new { status = "error", message = "Source or target account not found." });
            }

            // Check if the source account has enough balance
            if (sourceAccount.Balance < request.Amount)
            {
                return BadRequest(new { status = "error", message = "Insufficient balance in the source account." });
            }

            // Perform the transfer
            sourceAccount.Balance -= request.Amount;
            targetAccount.Balance += request.Amount;

            // Save the changes
            _context.SaveChanges();

            return Ok(new { status = "success" });
        }
    }
}